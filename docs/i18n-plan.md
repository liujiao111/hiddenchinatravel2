# 多语言（i18n）设计规划 — 简体中文先行

> Status: Phase 1（技术框架）实施中
> Last updated: 2026-10-31

## 0. 战略前提：中文版给谁看

本站内容是"外国人在中国如何生存"，简体中文版的自然受众：

- 新加坡、马来西亚华人（已有 `yunnan-travel-from-singapore/malaysia` 文章，市场已存在）
- 台湾、香港及海外华人
- 回中国大陆探亲/旅游的海外华人

**结论：中文 SEO 主战场仍是 Google（zh 搜索），不是百度。** 这些用户使用 Google 搜中文。Google 完整支持 hreflang，一套机制搞定；百度不支持 hreflang 且不是目标渠道，不做特殊架构。

## 1. URL 架构：英文原地不动，中文挂 `/zh`

| 方案 | 结论 |
|---|---|
| 英文留在根路径 `/`，中文用 `/zh/...` 子路径 | ✅ **采用**。现有全部 URL 一个不变 |
| 英文改成 `/en/`，中文 `/zh/` | ❌ 38 篇文章 + 3 个产品页全部改 URL，SEO 自杀 |
| 中文子域名 `cn.xxx.com` | ❌ 分散域名权重 |

**为什么不能动英文 URL**：`legacy-redirects.mjs` 维护着 100+ 条从旧 WordPress 站 301 过来的规则，全部指向根路径；现有 sitemap、Search Console 收录、外链全部锚定在根路径。

**实现（Next.js 16 标准做法）**：

```text
src/app/[lang]/          ← 所有现有页面路由整体迁入（api/、go/ 等 route handler 留在根）
src/proxy.ts             ← Next.js 16 新约定（middleware.ts 已改名 proxy.ts）
src/i18n/routing.ts      ← next-intl 路由配置：localePrefix: "as-needed"
src/i18n/request.ts      ← 按请求加载 messages
src/i18n/messages/{en,zh}.json
src/i18n/navigation.ts   ← 带 locale 感知的 Link/usePathname
```

- 用 **next-intl**，`localePrefix: "as-needed"`：默认语言（英文）不带前缀，URL 保持 `/best-vpn-for-china`；中文带前缀 `/zh/best-vpn-for-china`。外部 URL 与现状逐字节一致，proxy 内部把根路径请求改写到 `en`。
- Next.js 16 注意点：`middleware.ts` 已弃用改名 `src/proxy.ts`（但 import 路径仍叫 `next-intl/middleware`）；`params` 是 `Promise` 必须 await。
- 改代码前必读 `node_modules/next/dist/docs/`（见 AGENTS.md）。

## 2. SEO 机制：hreflang + 各自独立的 canonical

每页 `<head>` 输出（通过 `generateMetadata` 的 `alternates.languages`）：

```html
<link rel="alternate" hreflang="en" href="https://hiddenchinatravel.com/best-vpn-for-china" />
<link rel="alternate" hreflang="zh-Hans" href="https://hiddenchinatravel.com/zh/best-vpn-for-china" />
<link rel="alternate" hreflang="x-default" href="https://hiddenchinatravel.com/best-vpn-for-china" />
<link rel="canonical" href="https://hiddenchinatravel.com/zh/best-vpn-for-china" />  <!-- 中文页自指 -->
```

四条铁律：

1. **canonical 各语言自指**，绝不让中文页 canonical 指向英文页（否则 Google 不索引中文页，中文 SEO 归零）；
2. hreflang 必须**双向互链**（英→中、中→英），缺一边整组失效；
3. `x-default` 指向英文版；
4. `<html lang>` 按语言动态输出 `en` / `zh-Hans`。

**Sitemap**：按语言生成，entry 带 `alternates.languages`；中文单独在 GSC 观察收录。

**中文 slug 用英文/拼音，不用中文字符**：`/zh/dali-travel-guide`，不要 `/zh/大理旅游攻略`（percent-encode 乱码影响 CTR 和外链）。

**结构化数据**：`organizationJsonLd` 加 `inLanguage`，中文页产品/FAQ JSON-LD 用中文文案。

**中文标题/meta 重新做关键词研究，不是直译**：英文用户搜 "best VPN for China"，中文用户搜"中国 VPN 推荐""回国上网""云南私家团"。`seoTitle`/`metaDescription` 按中文搜索习惯独立撰写。

## 3. 内容架构：翻译配对 + 渐进发布

```text
_posts/                  # 英文文章（不动）
_posts-zh/               # 中文文章
content/hubs/            → content-zh/hubs/
content/journeys/        → content-zh/journeys/
content/legal/           → content-zh/legal/（第一版不翻译）
```

frontmatter 增加：

```yaml
lang: zh
translationKey: dali-travel-guide   # 与英文版配对，用于 hreflang 和语言切换器互跳
status: published                    # 现有机制天然支持渐进发布：翻译一篇发一篇
```

`content.ts` 改动：`getAllContent(lang)`，缓存按 lang 分桶。

**未翻译的页面不生成中文 URL（404）**，不做"中文 URL 显示英文内容"的兜底（软重复内容稀释两种语言 SEO）。语言切换器对未翻译页面跳到中文版首页。

**翻译优先级（按转化贡献排）**：

| 批次 | 内容 | 理由 |
|---|---|---|
| P1 骨架 | 首页、`/journeys` + 3 条线路页、`/custom-china-tour`、`/about-us`、`/contact`、booking 条款 | 转化链路 |
| P2 目的地 | `/china-destinations/yunnan`、大理/丽江/沙溪/香格里拉攻略 | 云南产品承接页 |
| P3 生存指南 | 支付、VPN、SIM/eSIM、高铁、签证免签政策 | 中文用户真实高频痛点 |
| P4 长尾 | 其余文章、traveler stories、工具页 | 按流量数据选翻 |

## 4. UI 文案与转化本地化

- 组件硬编码英文抽到 `src/i18n/messages/{lang}.json`；服务端组件用 `getTranslations`，客户端组件按需传 namespace，不要把整本字典塞进 client bundle；
- **语言切换器**放 header 右侧（"EN / 中"），cookie 记住选择；**不要**按 IP/浏览器语言自动跳转（Google 反对，且误伤英文用户）。英文首页可放轻量提示条"查看中文版 →"；
- **转化组件按语言换，不只是翻译**：中文版 WhatsApp CTA 换微信二维码 + 邮箱；询盘表单标签中文化；Resend 确认邮件按 lang 用双语模板；
- 字体：中文页用系统字体栈（PingFang / Microsoft YaHei / Noto Sans SC），不加载 Web 中文字体（文件太大拖垮 LCP）；
- 价格：中文版保留 USD，可补人民币参考价（接现有汇率数据）。

## 5. 不翻译 / 特殊处理

- **签证检查器**（`/china-visa-checker` 及国家子页面）：规则引擎和 CSV 不动，第一版只翻译工具 UI，国家页保持英文；
- **法律页**：保持英文，中文页给摘要说明；
- **汇率换算器**：UI 翻译即可，逻辑零改动；
- **GA4**：按 `/zh` 路径分段，中文版流量-询盘漏斗独立看。

## 6. 实施分期与验收

```text
阶段 1（纯基建，0 中文内容上线）
  proxy.ts + [lang] 迁移 + 字典机制 + hreflang 骨架 + 语言切换器
  验收：英文站所有 URL 逐字节不变（sitemap 全量 URL diff）；
        npm run build / lint 通过；GSC 无异常波动

阶段 2（中文版骨架上线，约 8-10 页）
  首页 + 产品页 + 定制游 + 关于 + 联系
  验收：hreflang 双向校验通过（Screaming Frog 爬一遍）；
        中文页 canonical 自指；微信 CTA 可扫

阶段 3（目的地 + 高频生存指南，约 15 页）
阶段 4（长尾内容，按数据驱动）
```

**未来加语言（繁体、日语、马来语等）**：locales 数组加一项 → 加一本字典 → 建对应内容目录 → 翻译。架构零新工作。

**最大长期风险是维护**：英文内容重大更新时，对应中文 frontmatter 的 `status` 降为 `review` 或标记待同步，避免中文版悄悄过期（签证、免签政策类内容过期会误导用户）。

## 7. 环境备注：@swc/core 本地桩

next-intl 的 config 插件在加载时会静态 import `@swc/core`（仅消息提取功能真正调用它，本项目未启用提取）。其 1.16.x 预编译二进制需要 macOS 14+ 的 unwind 符号，在 macOS 13 上无法加载，导致 `next build` 无法读取 next.config.mjs。

处理：`package.json` 的 `overrides` 把 `@swc/core` 指向本地桩 `stubs/swc-core/`（导出的方法被调用时才报错；提取功能未启用，永不会触发）。

注意：Vercel（Linux）和新版 macOS 上真实二进制可用；若将来启用 `experimental.extract` 消息提取，需先移除此桩并恢复真实依赖。
