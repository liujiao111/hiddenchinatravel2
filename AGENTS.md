<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Hidden China Travel article content rule — required

Before editing or publishing `_posts/*.md` or `_posts-zh/*.md`, read `PROJECT.md` §19.

- Article FAQs have one source of truth: YAML frontmatter `faqs` rendered by `src/components/article-page.tsx`, including JSON-LD.
- Never add an inline `## FAQ`, `## Frequently Asked Questions`, `## 常见问题` or `## 常见问答` section to a post that has frontmatter `faqs`.
- If a supplied draft contains inline questions, put them in `faqs` only. Preserve useful information, links, tables, pictures, and author notes when migrating older FAQ sections.
- English and Chinese content must follow the same rule. Posts without FAQs do not require them.
- Run `npm run check:faq` before finishing; do not bypass failing checks.

## 全站 UI 规范（强制）

- 新增或调整页面 UI 时，先复用 `src/app/globals.css` 的设计变量和全站组件样式；不要为单页另造颜色、按钮、圆角、阴影或间距规则。确需新增变体时，先定义为共享 token / 组件变体，再复用。
- 按钮沿用共享 `.button` 基础规格和已有变体。主 CTA 可使用品牌蓝；**所有次 CTA、软按钮、描边按钮和文字型操作都不得使用蓝色底或蓝色字**。图上软按钮使用白底深色字；浅色内容区的次级文字操作使用正文色与下划线。不同页面同类操作保持一致，不能用局部 CSS 覆盖出另一种视觉样式。
- 卡片可有图片卡、内容卡等结构差异，但圆角、边框、阴影和悬停反馈必须遵守共享卡片规范，不得每页自行混用直角、圆角、描边和浮起效果。
- 询价表单统一沿用共享 `.contact-form` 字段、标签、错误态和提交按钮规格；自定义表单只调整字段布局，不另造高度、边框、圆角、背景或按钮样式。表单输入控件高度使用 `--control-height`。
- 标准页头默认保留完整主导航与搜索。不要在行程页使用 `SiteHeader` 的 `conversion` 简化模式隐藏主菜单；只有需求明确要求极简转化页头时才可使用，并说明页面范围。
- 搜索框的示例查询必须作为 placeholder 展示，不能作为默认输入值或自动触发搜索建议。
- 完成 UI 改动前检查桌面与移动断点，确认主次操作、导航、焦点态和图片裁切一致；至少运行受影响文件的 lint 与 `npx tsc --noEmit`。
