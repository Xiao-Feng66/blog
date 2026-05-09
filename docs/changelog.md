# 变更日志

> 按时间倒序记录。每条包含：变更类型、背景（为什么改）、核心改动、涉及文件。

---

## 2026-05-09

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
