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
<title>Hidden China Travel · Ref 来源查询</title>
<style>
*{box-sizing:border-box}body{font:15px system-ui,-apple-system,sans-serif;background:#f2f7fc;color:#213448;margin:0}
main{max-width:790px;margin:7vh auto;padding:24px}
h1{font-size:25px;margin:0 0 8px}p{line-height:1.65;color:#586b7f;margin:0 0 22px}
section{background:white;border:1px solid #dbe6f0;border-radius:16px;padding:24px;box-shadow:0 5px 18px #243b5310}
form{display:grid;gap:16px}label{display:grid;gap:7px;font-weight:600}
input{width:100%;padding:12px;border:1px solid #a9bbcb;border-radius:9px;font:inherit;min-width:0}
button{background:#1468ad;border:0;color:white;font:inherit;font-weight:650;padding:13px;border-radius:10px;cursor:pointer}
button:disabled{opacity:.55}#result{margin-top:20px;white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.8}
.row{border-top:1px solid #e6eef5;padding:8px 0}.key{color:#5f7080;font-size:13px;display:block}
.value{font-weight:550}small{display:block;margin-top:20px;color:#698096}
</style></head><body><main><h1>WhatsApp 咨询来源查询</h1>
<p>客户消息只保留 Ref。输入咨询编号和内部查询密钥，查看该 Ref 对应的点击来源；点击并不代表客户已经发送消息。</p>
<section>
<form id="lookup"><label>咨询 Ref<input id="ref" required autocomplete="off" spellcheck="false" placeholder="HCT-20261118-..." /></label>
<label>内部查询密钥<input id="secret" type="password" required autocomplete="off" placeholder="仅运营人员持有" /></label>
<button type="submit" id="button">查询来源</button></form>
<div id="result" role="status" aria-live="polite"></div>
</section>
<small>仅展示新系统上线后成功保存的记录；历史 Ref 无法自动补齐。</small>
</main>
<script>
(function(){
const form=document.getElementById('lookup'),result=document.getElementById('result'),button=document.getElementById('button');
function line(k,v){const div=document.createElement('div');div.className='row';
const a=document.createElement('span'),b=document.createElement('span');
a.className='key';b.className='value';a.textContent=k;b.textContent=(v===undefined||v===null||v==='')?'—':String(v);div.append(a,b);result.append(div);}
form.addEventListener('submit',async function(e){e.preventDefault();button.disabled=true;result.textContent='查询中…';
try{const res=await fetch(location.pathname,{method:'POST',headers:{'content-type':'application/json','x-ref-lookup-secret':document.getElementById('secret').value},body:JSON.stringify({ref:document.getElementById('ref').value}),cache:'no-store'});
const data=await res.json();result.textContent='';if(!res.ok){result.textContent=data.error||'查询失败';return;}
line('Ref',data.ref);line('记录类型','WhatsApp 点击（未确认发送）');line('点击时间 UTC',data.captured_at);line('点击页面',data.conversion_url);
line('点击位置',data.whatsapp_location);
line('首次来源',data.first?.source_label);line('首次来源 / 媒介',(data.first?.source||'')+' / '+(data.first?.medium||''));
line('首次进入页面',data.first?.landing_page);line('首次外部引荐',data.first?.referrer);
line('首次广告参数',JSON.stringify(data.first?.params||{}));
line('最近营销来源',data.last?.source_label);line('最近来源 / 媒介',(data.last?.source||'')+' / '+(data.last?.medium||''));
line('最近落地页',data.last?.landing_page);line('最近广告参数',JSON.stringify(data.last?.params||{}));
line('本次会话来源',data.session?.source_label);
}catch(err){result.textContent='请求失败，请检查网络或配置';}finally{button.disabled=false;}
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
