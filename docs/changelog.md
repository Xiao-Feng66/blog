# 变更日志

> 按时间倒序记录。每条包含：变更类型、背景（为什么改）、核心改动、涉及文件。

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
