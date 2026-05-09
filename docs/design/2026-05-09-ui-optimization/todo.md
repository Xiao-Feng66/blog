# UI 优化 - 任务清单

> 状态：进行中

## 已完成

- [x] 修复标题重复显示（剥离 markdown 首行 `# 标题`）
- [x] 文章内容加宽（`max-w-2xl` → `max-w-3xl`）
- [x] 新增左侧 TOC 目录组件（DOM 读取 heading、IntersectionObserver 高亮）
- [x] 代码块主题换为 `github-light-high-contrast`，背景 `stone-50` → `stone-100`
- [x] 标题样式 `font-light` → `font-semibold` + `text-ink` 颜色
- [x] 全局边框色加深（`#e8e5e0` → `#c5c0b8`）
- [x] 全局 muted 文字色加深（`#9c968e` → `#78736b`）
- [x] 管理后台表单 label / 辅助文字颜色加深
- [x] 管理后台侧边栏文字颜色加深
- [x] TOC 布局改为 absolute 定位在文章左侧，文章居中
- [x] TOC 锚点跳转修复（从 DOM 读取真实 ID）
- [x] 新增回到顶部按钮（ScrollToTop 组件）

## 待修复

- [ ] 管理后台输入框边框再加深（截图仍显淡）
- [ ] TOC sticky 不生效 — 滚动后目录跟着滑走，需给 absolute nav 加 `h-full` 使 sticky 有空间
- [ ] TOC 点击跳转标题被导航栏遮挡 — 给 heading 加 `scroll-margin-top`
- [ ] 回到顶部按钮移到 TOC 下方，按钮稍大
- [ ] 代码块文字颜色太浅 — `github-light-high-contrast` 仍不够，需进一步处理
