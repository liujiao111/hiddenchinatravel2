import { createHash, timingSafeEqual } from "node:crypto";
import { findWhatsAppSource, WHATSAPP_REF_PATTERN } from "@/lib/whatsapp-ref-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateHeaders = {
  "cache-control": "no-store, private",
  "x-robots-tag": "noindex, nofollow",
  "referrer-policy": "no-referrer",
  "x-content-type-options": "nosniff",
};
const fail = (message: string, status: number) =>
  Response.json({ error: message }, { status, headers: privateHeaders });

function authenticated(value: string | null, secret: string) {
  if (!value || !secret || value.length > 512) return false;
  const expected = createHash("sha256").update(secret).digest();
  const actual = createHash("sha256").update(value).digest();
  return timingSafeEqual(expected, actual);
}

export async function POST(request: Request) {
  const secret = process.env.WHATSAPP_REF_LOOKUP_SECRET;
  if (!secret || secret.length < 20 || !process.env.BLOB_READ_WRITE_TOKEN)
    return fail("Lookup not configured", 503);
  const origin = request.headers.get("origin");
  const site = request.headers.get("sec-fetch-site");
  if ((origin && origin !== new URL(request.url).origin) ||
      (site && site !== "same-origin"))
    return fail("Forbidden", 403);
  if (!authenticated(request.headers.get("x-ref-lookup-secret"), secret))
    return fail("Invalid access key", 401);
  let ref = "";
  try {
    const body = await request.text();
    if (body.length > 300) return fail("Invalid request", 400);
    const data = JSON.parse(body) as { ref?: unknown };
    ref = typeof data.ref === "string" ? data.ref.trim().toUpperCase() : "";
  } catch {
    return fail("Invalid JSON", 400);
  }
  if (!WHATSAPP_REF_PATTERN.test(ref)) return fail("Invalid reference format", 400);
  try {
    const record = await findWhatsAppSource(ref);
    if (!record) return fail("No stored record for this reference", 404);
    return Response.json(record, { headers: privateHeaders });
  } catch (error) {
    console.error("WhatsApp Ref lookup failed", error instanceof Error ? error.message : "unknown");
    return fail("Lookup currently unavailable", 503);
  }
}

const html = `<!doctype html>
<html lang="zh"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Hidden China Travel · 全站咨询 Ref 查询</title>
<style>
*{box-sizing:border-box}body{font:15px system-ui,-apple-system,sans-serif;background:#f2f7fc;color:#213448;margin:0}
main{max-width:790px;margin:7vh auto;padding:24px}
h1{font-size:25px;margin:0 0 8px}p{line-height:1.65;color:#586b7f;margin:0 0 22px}
section{background:white;border:1px solid #dbe6f0;border-radius:16px;padding:24px;box-shadow:0 5px 18px #243b5310}
form{display:grid;gap:16px}label{display:grid;gap:7px;font-weight:600}
input{width:100%;padding:12px;border:1px solid #a9bbcb;border-radius:9px;font:inherit;min-width:0}
button{background:#1468ad;border:0;color:white;font:inherit;font-weight:650;padding:13px;border-radius:10px;cursor:pointer}
button:disabled{opacity:.55}#result{margin-top:20px;overflow-wrap:anywhere;line-height:1.7}
.detail-section{margin-top:20px;padding-top:14px;border-top:1px solid #d8e6f2}
.detail-section h2{font-size:17px;font-weight:700;margin:0 0 4px;color:#193d5a}
.detail-section p{font-size:13px;margin:0 0 12px;color:#607c90}
.row{border-top:1px solid #e6eef5;padding:10px 0}.key{color:#5f7080;font-size:13px;display:block}
.value{font-weight:550;display:block;white-space:pre-wrap}small{display:block;margin-top:20px;color:#698096}
.notice{background:#edf5fb;border-radius:9px;padding:12px;margin:14px 0;color:#335e7a;font-size:13px}
</style></head><body><main><h1>全站咨询 Ref 来源查询</h1>
<p>先看客户这一次从哪里进入网站，再看首次与历史营销来源。表单提交、WhatsApp 点击及二维码互动共用 Ref；点击或扫码不代表消息已经发送。</p>
<section>
<form id="lookup"><label>咨询 Ref<input id="ref" required autocomplete="off" spellcheck="false" placeholder="HCT-20261118-..." /></label>
<label>内部查询密钥<input id="secret" type="password" required autocomplete="off" placeholder="仅运营人员持有" /></label>
<button type="submit" id="button">查询来源</button></form>
<div id="result" role="status" aria-live="polite"></div>
</section>
<small>历史归因在浏览器内最多保留 90 天。来源参数不等于来源真实性证明；仅展示新系统上线后成功保存的记录。</small>
</main>
<script>
(function(){
const form=document.getElementById('lookup'),result=document.getElementById('result'),button=document.getElementById('button');
let group;
const aiNames={
 'chatgpt.com':'ChatGPT','chat.openai.com':'ChatGPT','chatgpt':'ChatGPT',
 'perplexity.ai':'Perplexity','perplexity':'Perplexity',
 'claude.ai':'Claude','claude':'Claude',
 'gemini.google.com':'Gemini','gemini':'Gemini',
 'copilot.microsoft.com':'Copilot','copilot':'Copilot',
 'poe.com':'Poe','poe':'Poe','grok.com':'Grok','grok':'Grok'
};
function aiName(raw){return aiNames[String(raw||'').trim().toLowerCase().replace(/^www\./,'')]||'';}
function referrerHost(raw){
 try{return new URL(raw).hostname.toLowerCase().replace(/^www\./,'');}
 catch{return '';}
}
function sourceLabel(t){
 if(!t)return '—';
 const refHost=referrerHost(t.referrer);
 const refAi=aiName(refHost),tagAi=aiName(t.params&&t.params.utm_source);
 const paid=Boolean(t.params&&(t.params.gclid||t.params.gbraid||t.params.wbraid||t.params.msclkid));
 if(refAi&&!paid&&(t.medium==='referral'||t.source===refHost))return refAi+' · 浏览器引荐来源（Referrer）';
 if(tagAi&&!paid)return tagAi+' · 仅 UTM 来源标记（未核实实际引荐）';
 return t.source_label||'未知';
}
function time(raw){
 if(!raw)return '—';
 const date=new Date(raw);
 if(!Number.isFinite(date.getTime()))return raw;
 return date.toLocaleString('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',timeZoneName:'short'});
}
function section(title,description){
 group=document.createElement('section');group.className='detail-section';
 const h=document.createElement('h2');h.textContent=title;group.append(h);
 if(description){const p=document.createElement('p');p.textContent=description;group.append(p);}
 result.append(group);
}
function line(key,value){
 const div=document.createElement('div');div.className='row';
 const a=document.createElement('span'),b=document.createElement('span');
 a.className='key';b.className='value';a.textContent=key;b.textContent=value===undefined||value===null||value===''?'—':String(value);
 div.append(a,b);(group||result).append(div);
}
function sourceDetails(t,kind){
 line(kind+'来源',sourceLabel(t));
 line('来源 / 媒介',(t&&t.source||'未知')+' / '+(t&&t.medium||'未知'));
 line('进入页面',t&&t.landing_page);
 line('来源记录时间（本地）',time(t&&t.time));
 line('浏览器外部引荐（Referrer）',t&&t.referrer);
 const params=t&&t.params||{};
 line('来源及广告参数',Object.keys(params).length?JSON.stringify(params):'无');
}
form.addEventListener('submit',async function(e){
 e.preventDefault();button.disabled=true;group=null;result.textContent='查询中…';
 try{
  const res=await fetch(location.pathname,{method:'POST',headers:{'content-type':'application/json','x-ref-lookup-secret':document.getElementById('secret').value},body:JSON.stringify({ref:document.getElementById('ref').value}),cache:'no-store'});
  const data=await res.json();result.textContent='';
  if(!res.ok){result.textContent=data.error||'查询失败';return;}
  const note=document.createElement('div');note.className='notice';
  note.textContent='本次访问来源不一定等于首次获客来源。以下历史触点按浏览器记录展示，不应将 UTM 标签直接视为平台引荐证明。';
  result.append(note);
  const statuses={
   whatsapp_click_unconfirmed:'WhatsApp 点击（未确认消息发送）',
   form_submitted:'表单提交成功（邮件服务已接受）',
   qr_view:'二维码展示（无法确认实际扫描）',
   qr_download:'二维码下载（无法确认实际扫描）',
   qr_link_open:'WhatsApp 二维码链接打开（无法确认消息发送）',
   wechat_id_copy:'微信号复制（无法确认是否添加）'
  };
  section('本次访问与咨询行为','显示该 Ref 在网站能够确认的事件，不把扫码、点击算作真实对话');
  line('Ref',data.ref);
  line('事件类型',statuses[data.status]||data.status||'未知');
  line('事件时间（本地）',time(data.captured_at));
  line('发生页面',data.conversion_url);
  if(data.channel)line('咨询渠道',data.channel);
  if(data.whatsapp_location)line('按钮／互动位置',data.whatsapp_location);
  if(data.form_name)line('提交表单',data.form_name);
  if(data.product_id)line('产品／服务 ID',data.product_id);
  if(data.form_submission_id)line('原表单请求 UUID',data.form_submission_id);
  if(data.parent_ref)line('PC 二维码来源 Ref',data.parent_ref);
  sourceDetails(data.session,'本次会话');
  section('历史：首次访问','首次进入网站时的来源，最多保留 90 天');
  sourceDetails(data.first,'首次');
  section('历史：最近一次可归因来源','新的 Direct 访问不会覆盖之前带营销参数或外部引荐的来源');
  sourceDetails(data.last,'最近');
 }catch(err){result.textContent='请求失败，请检查网络或配置';}
 finally{button.disabled=false;}
});
})();
</script></body></html>`;

export async function GET() {
  return new Response(html, {
    status: 200,
    headers: { ...privateHeaders, "content-type": "text/html; charset=utf-8",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'" },
  });
}
