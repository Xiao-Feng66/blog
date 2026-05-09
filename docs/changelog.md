# 变更日志

> 按时间倒序记录。每条包含：变更类型、背景（为什么改）、核心改动、涉及文件。

---

## 2026-05-09

### [优化] 博客前台 + 管理后台 UI 优化

- **背景**：文章页标题重复显示、内容区太窄、代码块和标题对比度不足、管理后台表单和侧边栏颜色太浅
- **核心改动**：
  1. 修复标题重复：渲染 MDX 前剥离 markdown 首行 `# 标题`
  2. 文章居中，容器 `max-w-3xl`（768px）
  3. 新增左侧 TOC 目录：从 DOM 读取实际 heading ID，absolute 定位在文章左侧，sticky 粘性跟随，IntersectionObserver 高亮当前标题，点击平滑跳转（xl 屏幕以上显示）
  4. 新增回到顶部按钮：滚动超过 400px 时出现，点击平滑回顶
  5. 代码块对比度提升：Shiki 主题从 `github-light` 换为 `github-light-high-contrast`，背景从 `stone-50` 改为 `stone-100`
  6. 标题样式加强：`font-light` 改为 `font-semibold`，明确设置 `text-ink` 颜色
  7. 全局色值调深：边框 `#e8e5e0` → `#c5c0b8`，muted 文字 `#9c968e` → `#78736b`
  8. 管理后台表单 label 和辅助文字颜色加深
- **涉及文件**：src/app/posts/[slug]/page.tsx, src/lib/mdx.ts, src/app/globals.css, src/components/blog/TableOfContents.tsx（新增）, src/components/blog/ScrollToTop.tsx（新增）, src/components/admin/PostForm.tsx, src/components/admin/Sidebar.tsx, src/app/admin/posts/page.tsx

---

### [功能] 仪表盘访问数据分析

- **背景**：管理后台仪表盘只展示文章数量，无法了解博客实际访问情况和热门内容
- **核心改动**：
  1. 新增 PageView 数据模型（page_views 表），记录页面访问路径、访客标识、时间
  2. 新增 `POST /api/track` 采集路由，前台页面加载时自动上报访问量（hash IP 生成 sessionId，隐私友好）
  3. 新增 `GET /api/analytics` 查询路由，支持 7 天/30 天时间维度筛选
  4. 新增 TrackPageView 组件集成到 LayoutShell，非 admin 页面自动追踪
  5. 新增 AnalyticsSection 仪表盘组件（PV/UV 统计卡片 + Recharts 折线图 + 热门文章排行）
- **涉及文件**：prisma/schema.prisma, src/app/api/track/route.ts, src/app/api/analytics/route.ts, src/components/TrackPageView.tsx, src/components/LayoutShell.tsx, src/components/admin/AnalyticsSection.tsx, src/app/admin/page.tsx, src/lib/mockData.ts

---

### [功能] 管理后台体验增强

- **背景**：新建文章只能手动输入内容、标签区域空白无法新建、后台页面显示博客前台导航栏
- **核心改动**：
  1. PostForm 添加 Markdown 文件导入按钮（FileReader 读取后填入 textarea）
  2. 标签区域支持内联新建标签（输入框 + POST /api/tags + 自动勾选）
  3. 新建 LayoutShell 组件，/admin 路径下隐藏 Header/Footer/BackgroundDecor
  4. Sidebar 添加"查看博客"链接跳转博客首页
- **涉及文件**：src/components/admin/PostForm.tsx, src/components/LayoutShell.tsx, src/app/layout.tsx, src/components/admin/Sidebar.tsx

---

### [修复] Vercel 部署问题修复

- **背景**：首次部署到 Vercel 时构建卡在 "Installing dependencies"，以及管理后台登录流程存在问题
- **核心改动**：
  1. 添加 `.npmrc` 固定官方 npm 源（package-lock.json 指向公司内网 artifactory，Vercel 无法访问）
  2. 重新生成 `package-lock.json`，所有包指向 registry.npmjs.org
  3. 添加 `postinstall: "prisma generate"` 防止 Vercel 缓存导致 Prisma Client 缺失
  4. 将登录页从 `/admin/login` 移至 `/login`，修复 admin layout 重定向死循环
- **涉及文件**：.npmrc, package.json, package-lock.json, src/app/login/page.tsx, src/app/admin/layout.tsx, src/app/api/auth/callback/route.ts

---

### [功能] 余白风格前端重设计 + Mock 数据层 + 部署上线

- **背景**：博客前端风格不符合预期，参考 blog.chanler.dev 余白主题完全重设计；同时建立 mock 数据层便于无数据库开发，并完成 Vercel + Supabase 生产部署
- **核心改动**：
  1. Mock 数据层：useMock 标志自动检测 DATABASE_URL，无数据库时返回 mock 数据
  2. 前端重设计：余白美学（极简留白、暖色墨/纸色系、排版驱动层次、首页全屏 hero）
  3. 新增 `/posts` 全部文章页，导航栏增加「文章」入口
  4. 标签页改为网格卡片布局
  5. Supabase 数据库迁移 + GitHub OAuth 认证 + Vercel 部署
- **涉及文件**：src/app/globals.css, src/app/page.tsx, src/app/posts/page.tsx, src/components/blog/\*\*, src/lib/auth.ts, prisma/\*\*

---

## 2026-05-08

### [新功能] 个人博客系统搭建

- **背景**：从零搭建个人博客，包含博客前台和管理后台
- **核心改动**：
  1. 项目脚手架：Next.js + TypeScript + Tailwind CSS + Prisma + Supabase
  2. 博客前台：首页文章列表、文章详情（MDX + Shiki）、标签页、关于页、暗色模式、SEO
  3. 管理后台：GitHub OAuth 登录、文章 CRUD、标签管理、仪表盘
  4. 集成功能：全文搜索（flexsearch）、Giscus 评论、ISR 重新验证、错误边界
- **涉及文件**：src/app/\*\*, src/components/\*\*, src/lib/\*\*, prisma/schema.prisma, .env.example

---

### [初始化] 项目设计文档创建

- **背景**：从零搭建个人博客，需要先确定技术方案和开发计划
- **核心改动**：
  1. 创建 CLAUDE.md 项目规范
  2. 创建技术方案文档 `docs/design/2026-05-08-personal-blog/design.md`
  3. 创建任务清单 `docs/design/2026-05-08-personal-blog/todo.md`
- **涉及文件**：CLAUDE.md, docs/design/2026-05-08-personal-blog/design.md, docs/design/2026-05-08-personal-blog/todo.md, docs/changelog.md
