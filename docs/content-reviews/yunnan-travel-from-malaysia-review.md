# 马来西亚云南文章适配与发布前审查

审查日期：2026-09-30。基线：`main` 的 `d718f828877962fa1c1c6828fdaec802dad69083`。

## 交付状态

- 文章：`_posts/yunnan-travel-from-malaysia.md`，保持 `status: draft`。
- 已采用当前项目的 camelCase 元数据、对象形式 author/ogImage、canonical、section 和 faqs。
- H1 由文章组件生成，正文不重复 H1；8 条 FAQ 只在现有 FAQ 组件呈现，并由同一份数据输出 JSON-LD。
- 已移除外围代码围栏、Production Notes、修订历史、没有独立验证的研究结论和关键词清单。
- SEO 标题 56 字符；description 151 字符。使用 `absoluteSeoTitle` 控制最终标题长度；excerpt 与 description 一致，兼容当前读取优先级。
- 约 2,900 个英文词（不含元数据 FAQ），保留行程决策信息，减少反复出现的航班说明和销售段落。
- 补齐内容读取器对 draft/review 的过滤。现有无 status 的文章保持可见；未发布内容不进入公共路由、相关文章、搜索或 sitemap。
- 不合并、不部署；反向内链只制定计划，暂不写入现有页面。

## 事实核查与修改

| 原稿问题 | 修改结果 | 核查依据 / 剩余限制 |
|---|---|---|
| 免签协议“无到期日” | 改为五年有效期，并自动延长后续五年；区别于部分国家的单方面限时免签 | 中国驻马来西亚使馆 FAQ Q8，已直接打开核验 |
| 30 天、90/180 天和护照有效期 | 保留；明确普通护照及不少于六个月有效期 | 使馆 FAQ Q2、Q4、Q5；不要将居住地当国籍 |
| 丽江回昆明火车约 2 小时 | 改为日间列车约 3.5–5 小时，核对昆明/昆明南，并加本地接驳时间 | Trip.com 当前展示的车次约 3h23m 至 5h2m；不是未来某日的出票承诺 |
| 将大理航线开航时的每周两班反复作为当前频次 | 只作为 2025-01-10 的历史公告，当前运营日待实际日期验证 | Tourism Malaysia 官方新闻证实开航及当时 Mon/Fri；未取得 2026-09 的航空公司实时班表 |
| 新山航线从宣布开航直接推成现行班次 | 说明 AirAsia 公告的 2025-12-14 起航日期，不保证目前每周频次 | AirAsia 官方公告；未来日期需可出票结果 |
| 丽江直飞吉隆坡“2026 年 1 月停飞，改投大理”，及“必须回昆明/大理” | 删除未经航空公司证明的停飞日期及原因；允许比较丽江出发的完整中转票 | 没有取得足以证明永久停飞的一级来源；不能把未确认当作不存在 |
| VPN 可以让 Google Maps 可用准确 | 区分网络可访问与地图数据/导航质量，建议保存中文地址并准备本地地图 | 与站内地图指南一致；移除无法直接打开复核、且涉及过时导航描述的 The Star 引文 |
| 将 Upper Gorge 景区观景与 Walnut Garden 混为一处 | 区分上虎跳景区观景、高路徒步、中虎跳下切；提示确认入口及步行需求 | 云南官方材料及迪庆景区资料；不再许诺“任何人都无需体力” |
| “香格里拉不可能放入 8 天” | 改为可以替换停留点，不能原样叠加；补充丽香铁路 | 云南省交通运输厅 2026-08 的铁路报道 |
| 7 天必须优先削减大理/丽江、保留沙溪 | 改为按旅行偏好取舍；偏好铁路和少搬酒店时可舍弃沙溪 | 编辑判断，不伪装成交通事实 |
| 6 日游“全程私家车”“只含交通和路线规划” | 改为以产品页和确认单为准，说明高铁+私家车；不复制固定价格或酒店承诺 | 当前 main 产品数据及公开 6 日游页面均有高铁；产品是 6 天 5 晚，包含项目不只是交通 |
| 6 日游一定不计国际出发/返程日 | 改为取决于抵离时间，国际飞行可以和团的首末日重叠 | 避免机械相加导致日数错误 |
| 免费 Dali PDF 已可领取 | 移除这项未证实已交付的承诺 | 项目背景文件说明 PDF/Brevo 交付尚未完成；以后有真实可发送资源再恢复 |
| 声称 `/survival-kit` 不存在 | 使用实际存在的 `/survival-kit` | 已核对源码及公开页面 |
| 泸沽湖产品链接未验证 | 保留当前 main 内实际存在且 published 的产品路径 | 正式构建生成该路由；公共网页检索工具无法读取不等于 404，后续发布前再检查生产环境 |

### 本次读取的主要来源

- [中国驻马来西亚使馆：互免签证 FAQ](https://my.china-embassy.gov.cn/eng/fwzc/lsyw/qz/202508/t20250801_11681401.htm)
- [中国驻马来西亚使馆：中文 FAQ](https://my.china-embassy.gov.cn/fwzc/lsyw/lszj/fhqz2024/cjwdvisa/202508/t20250801_11681383.htm)
- [AirAsia：Johor Bahru–Kunming 公告](https://newsroom.airasia.com/news/2025/11/11/airasia-strengthens-southern-hub-with-new-johor-bahru-kunming-route)
- [Tourism Malaysia：Lucky Air 大理–吉隆坡首航](https://www.tourism.gov.my/media/view/lucky-air-launches-bi-weekly-flight-linking-dali-to-kuala-lumpur)
- [Trip.com：丽江–昆明当前时刻表](https://www.trip.com/trains/china/route/lijiang-to-kunming/)
- [云南省交通运输厅：丽香铁路旅客破千万人次，2026-08](https://jtyst.yn.gov.cn/xyxw/202608/t20260820_3635852.html)
- [云南官方材料：丽江虎跳峡位于上段](https://www.ynxc.gov.cn/html/2025/dianbanjingpin_0126/3019457.html)
- [迪庆政府：虎跳峡景区，2026-09](https://diqing.gov.cn/xwzx/bmdt/202609/20260904_245165.html)

## SEO 判断

主要意图保持 `yunnan travel from malaysia`，辅以行程型长尾：`8 day yunnan itinerary from malaysia`、`kuala lumpur to dali`、`johor bahru to kunming`。签证条件是完成计划的必要信息，但不把整篇扩成泛“中国签证”页，与已有签证工具/国家页分工。

文章的差异化在机场进出、8 天 7 晚、沙溪道路接送和丽江回程时间。比泛泛景点清单更适合承接规划中的询盘。该判断是基于内容与意图的策略判断；本次没有查询 GSC、关键词工具或搜索量，不声称“中流量低竞争”或保证获客。

`tour package`/`Muslim tour` 不作为主攻词：正文提供选择和服务边界，产品页承担报价与服务范围。避免把“认证清真餐饮”当作尚未具备的销售能力。

预算部分仍没有可复核的 MYR 总价，不能充分满足“费用多少”的搜索意图。当前版本用费用清单和货币工具解决对比问题；若以后有实际报价，可注明人数、月份、房型和包含项目后增加区间，不应现在编造预算。

## GEO 判断

- 首段直接回答国籍、入境、机场和天数；航线、日程及住宿晚数表格可被独立理解。
- 将核验日期和事实范围分开：签证是直接核验，航线开航是历史事实，当前班次待日期验证。
- FAQ 与可见答案来自同一元数据，没有正文/JSON-LD 版本冲突。
- 不虚构 Joy 的亲历故事，不把第三方引文当作作者的 firsthand experience。
- 官方来源尽量靠近具体陈述，提高可核验性；这不构成 AI 引用保证。
- Google 说明 AI 搜索仍以 SEO 基础为主，不需要特殊 GEO schema。FAQ 保留给读者和通用语义使用，不承诺 Google FAQ 富结果；其 2026 年文档已宣布 FAQ 富结果停止展示。
- 原制作备注中的“独立 AI/generative-search report”不宜当作既定可用报表。Google 当前说明相关流量纳入 Search Console 的 Web 类型；按 URL/查询观察并结合 GA4 询盘，不把展示量等同订单。

依据：[Google AI features](https://developers.google.com/search/docs/appearance/ai-features)、[Google Search 文档更新](https://developers.google.com/search/updates)。

## 配图

| 位置 | 图片 | 处理 |
|---|---|---|
| Hero | 丽江古城水车，原 `丽江-丽江古城-460.jpg` | 1800×1200 WebP，约 616 KiB |
| 8 天行程之后 | 洱海山水，原 `大理-洱海-343.jpg` | 1400×807 WebP，约 66 KiB |
| 大理停留说明 | 大理古城城门，原 `大理-大理古城-450.jpg` | 1400×788 WebP，约 315 KiB |
| 沙溪过夜说明 | 现有 `dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp` | 复用 1920×1080，约 250 KiB |
| 虎跳峡说明 | 原 `丽江-虎跳峡-469.jpg` | 1400×840 WebP，约 391 KiB |

已查看实图后选择；不把石林配成机场，不把河边图配成 Sideng Square。四张新增 WebP 合计约 1.36 MiB；保留现有照片来源，未另取外网图片。仓库照片的原始授权链未在本次重新审计。

## 反向内链计划：发布后再实施

| 优先级 | 来源 | 放在哪里 | 建议锚文本与理由 |
|---|---|---|---|
| P0 | `/china-destinations/yunnan` | `Starting outside China / From abroad` 国家卡区 | `Yunnan from Malaysia`；作为国家集群入口，与其他国家并列 |
| P0 | `/yunnan-travel-from-singapore` | 航班/出发机场比较段 | `Yunnan from Malaysia`；解释 Johor/Senai 与 Changi 的选择，最强自然关联 |
| P1 | `/yunnan-travel-from-usa` | 现有“从其他国家出发”句 | `Malaysia`；同集群短内链，不扩写无关签证段 |
| P1 | `/yunnan-travel-from-australia` | 现有国家比较链接句 | `Malaysia`；同集群连接，保留原文章主意图 |
| P1 | `/yunnan-travel-from-uk` | 现有 departure-markets 比较句 | `Yunnan from Malaysia`；适合转机/同行不同出发地读者 |
| P1 | `/dali-travel-guide` | How to get there / 交通段 | `Dali and Yunnan from Malaysia`；先确认 KUL–DLU 当前可订再说明直飞捷径 |
| P1 | `/journeys/kunming-dali-shaxi-lijiang-6-days` | 行程前准备指南卡或 flights/planning 说明 | `Planning this route from Malaysia`；补足国际航班及昆明回程安排 |
| P1 | `/journeys/dali-lijiang-lugu-lake-private-tour` | 机场抵离/准备指南区 | `Yunnan from Malaysia`；大理接机与丽江送机的国际衔接；不把 8 天沙溪路线等同此产品 |
| P2 | `/china-visa-checker/malaysia` | Related planning / 下一步规划 | `Plan a Yunnan holiday from Malaysia`；从入境问题走向行程；先核对国家页路径是否已正式开放 |
| P2 | `/dali-hidden-gems-off-the-beaten-path` | 沙溪交通/过夜段 | `an 8-day Yunnan route from Malaysia`；只加一句相关示例 |

暂不全站在支付、VPN等泛指南硬塞马来西亚链接；首页主导航也不增加单独 Malaysia 顶级项，继续用 Yunnan hub 承接国家集群。新文章上线后先做 P0/P1，再根据实际流量判断 P2。

## 发布条件与验证记录

1. 保持当前草稿直访 404，搜索和 sitemap 无记录。
2. 发布时填写真实 `date`，更新需要变化的 `dateModified`，确认实际旅行日期的航班；不要将“lastVerified”理解为所有未来班次均已验证。
3. 在同一次发布变更中将 status 改为 published，并落实 P0/P1 反向内链，避免孤立文章；再次核对图片/站内路径。
4. 最终报价、清真服务和免费 PDF 均不得超出已有确认材料。
5. 上线后 4/8/12 周按 URL 查看 GSC 查询与点击，结合 GA4 的 WhatsApp/产品页点击及有效询盘；上线前不作流量成果判断。

本次验证结果：

- `npm run build` 成功，TypeScript 通过，生成 88 个既有静态页面；马来西亚草稿不在路由列表中。
- 草稿 URL 实际返回 404；sitemap 与搜索 API 均无草稿条目；首页、UK 文章、泸沽湖产品返回 200。
- 使用实际 content 读取器测试 draft/review/published/无 status 四种状态：草稿及 review 不可见，published 和既有无 status 内容保持可见，相关文章不含草稿。
- 单独本地预览副本中：1 个 H1、10 个表格、8 条可见 FAQ 和 8 条对应 FAQ schema；5 个图片请求均 200；推送前复查修复了空的大理古城 WebP，四张新增 WebP 均通过 Pillow 完整解码检查。
- 桌面及 390px 手机宽度无整页水平溢出，宽表格在组件内横向滚动；已查看截图。
- 新文章 15 个不同站内路径均实际返回 200；`eslint src/lib/content.ts` 和 `git diff --check` 通过。
- 原仓库文章始终是 draft；临时预览副本的 published 状态没有写回仓库。

预览另发现既有 RootLayout 把 `beforeInteractive` Script 放在 html 的直接子级，开发环境报 script/html 嵌套及 hydration 警告。该问题来自现有全站 layout，本次没有改变 layout，文章页面没有框架错误遮罩。后续建议单独检查全站脚本位置；这里不声称浏览器完全无警告。

