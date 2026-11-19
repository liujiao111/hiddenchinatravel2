# 全站咨询 Ref 归因（2026-11-19）

**统一编号**：`HCT-YYYYMMDD-XXXXXXXXXXXXXXXX`。运营查询：`/api/admin/whatsapp-ref-lookup`（服务器变量 `WHATSAPP_REF_LOOKUP_SECRET`，至少 20 字符）。所有 Ref 记录仅存于现有 **Private Vercel Blob**，加密为 AES-256-GCM；使用 `BLOB_READ_WRITE_TOKEN`。旧 WhatsApp Ref 保持兼容。

| 事件状态 | 触发时机 | 是否真实线索 |
| --- | --- | --- |
| `form_submitted` | `/api/enquiry`、`/api/custom-journey` 业务邮件被 Resend 接受后 | **是（表单提交）**，不等于已成交 |
| `whatsapp_click_unconfirmed` | 全站指定咨询号码的 WhatsApp 链接点击 | **否**，无法检测用户是否点击 Send |
| `qr_view` / `qr_download` | PC/移动端浮动联系面板的 WhatsApp 或微信二维码展示/下载 | 否，非真实扫描 |
| `qr_link_open` | 手机打开 PC 动态 WhatsApp QR 的站内中转 URL | 否，非 WhatsApp 消息已发送 |
| `wechat_id_copy` | 微信号复制成功 | 否，无法证明已经添加微信 |

**表单范围**：ContactForm、QuickAsk、CustomJourneyForm、PreviewEnquiryForm、PackageEnquiryForm、YunnanPrivateDriverBooking（含中英文页面）。提交时附加 `tracking`（Ref、首次/最近/本次浏览器归因、页面和表单标识）；服务器自行验证与清洗，并在成功邮件前加入 `Ref: ...`。已有 UUID `requestId` 仍用于 Resend 幂等防重，后台单独显示 UUID。Blob 故障不会使已被 Resend 接受的邮件重复发送；若写入失败需检查服务器日志。

**QR 跨设备**：PC WhatsApp 二维码由本地 SVG 生成器产生，指向 `/api/qr/whatsapp?ref=<展示Ref>`。展示时保存 PC 归因；手机打开中转时生成新的手机 Ref，尽可能继承 PC 首次/最近/本次来源，记录 `parent_ref`，再 307 跳转到 WhatsApp。客户预填消息**只含简短 Ref**，不放任何渠道或 UTM。若 PC 记录尚未到达或被用户拒绝分析同意，手机可能无法继承 PC 来源。微信个人二维码继续使用原始静态图片，只能记录浏览器可观察的展示、下载、复制行为；不宣称检测到扫码或加好友成功。

**数据边界**：Blob 只保存受限来源、UTM、页面、时间、事件类型、产品 ID 和 UUID，**不保存旅客姓名、邮箱、电话、备注或 WhatsApp 消息**。GA4 使用已有 `generate_lead`（仅表单成功）和 `whatsapp_click`（点击）；QR 事件均为普通互动，不新增广告转化目标。分析存储拒绝时不持久化浏览器归因或二维码互动；表单业务提交本身仍可带内部 Ref。不要把来自 `utm_source` 的 ChatGPT 标记解释为已证实 AI 引荐。

**测试**：`npm run test:whatsapp` / `npm run build`；人工在正式站提交测试表单（确保 Resend 不向真实客户发送）、查看邮件 Ref 与后台归因；PC 扫描新 WhatsApp QR，核对手机 Ref 能追到 `parent_ref`。部署 READY 并不等于真实外部 WhatsApp/微信消息已发送。
