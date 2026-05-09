# UI 优化 - 任务清单

> 状态：进行中

## 已完成

- [x] 修复标题重复显示（剥离 markdown 首行 `# 标题`）
- [x] 文章内容加宽（`max-w-2xl` → `max-w-3xl`）
- [x] 新增左侧 TOC 目录组件（DOM 读取 heading、IntersectionObserver 高亮）
- [x] 代码块主题换为 `github-light-high-contrast`，背景 `stone-50` → `stone-100`
- [x] 标题样式 `font-light` → `font-semibold` + `text-ink` 颜色
- [x] 全局边框色加深（`#e8e5e0` → `#b5b0a6`）
- [x] 全局 muted 文字色加深（`#9c968e` → `#78736b`）
- [x] 管理后台表单 label / 辅助文字颜色加深
- [x] 管理后台侧边栏文字颜色加深
- [x] TOC 布局改为 absolute + h-full 定位，文章居中，sticky 生效
- [x] TOC 锚点跳转修复（从 DOM 读取真实 ID）
- [x] 代码块文字颜色修复（prose 的 `--tw-prose-pre-code` 覆盖 Shiki，用 `!important` 强制 `var(--shiki-light)`）
- [x] 锚点跳转标题被导航栏遮挡（添加 scroll-margin-top: 5rem）
- [x] 回到顶部按钮改为右下角固定圆形图标按钮（独立 ScrollToTop 组件）
