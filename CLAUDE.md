# CLAUDE.md — 个人博客项目

## 项目概述

个人博客系统，包含博客前台和管理后台。

- **框架**：Next.js 14+ (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **数据库**：Supabase (PostgreSQL)
- **ORM**：Prisma
- **认证**：Supabase Auth (GitHub OAuth)
- **部署**：Vercel

## 技术决策

- 前台使用 SSG + ISR，文章页静态生成，数据更新后增量刷新
- 后台使用 CSR，不需要 SEO
- 内容格式为 Markdown，存储在数据库中，渲染时用 MDX 处理
- 代码高亮使用 Shiki
- 暗色/亮色模式通过 next-themes 实现
- 全文搜索使用 flexsearch（客户端搜索，无需后端服务）
- 评论系统使用 Giscus（基于 GitHub Discussions）

## 项目结构

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页（文章列表）
│   ├── posts/[slug]/page.tsx   # 文章详情
│   ├── tags/                   # 标签相关页面
│   ├── about/page.tsx          # 关于页
│   └── admin/                  # 管理后台
│       ├── layout.tsx          # 后台布局（含登录守卫）
│       ├── page.tsx            # 仪表盘
│       ├── posts/              # 文章管理（列表/新建/编辑）
│       └── tags/page.tsx       # 标签管理
├── components/
│   ├── ui/                     # 基础 UI 组件
│   ├── blog/                   # 博客前台组件
│   └── admin/                  # 后台组件
├── lib/
│   ├── db.ts                   # Prisma 客户端
│   ├── supabase.ts             # Supabase 客户端
│   ├── auth.ts                 # 认证工具
│   └── mdx.ts                  # MDX 渲染
└── styles/
    └── globals.css             # Tailwind 全局样式
```

## 数据模型

```
posts:      id, title, slug, content, summary, cover_image,
            status(draft/published/hidden), created_at, updated_at
tags:       id, name, slug
post_tags:  post_id, tag_id
```

## 常用命令

```bash
npm run dev             # 启动开发服务器
npm run build           # 构建生产版本
npm run lint            # ESLint 检查
npx prisma studio       # 打开 Prisma 数据库管理界面
npx prisma migrate dev  # 执行数据库迁移
npx prisma generate     # 生成 Prisma 客户端类型
```

## 开发规范

- 组件文件使用 PascalCase：`PostCard.tsx`
- 工具函数文件使用 camelCase：`formatDate.ts`
- 页面路由文件固定命名：`page.tsx`、`layout.tsx`、`loading.tsx`、`error.tsx`
- API 路由放在 `app/api/` 下，RESTful 风格
- 数据库操作统一通过 Prisma，不直接写 SQL
- 服务端组件为默认，需要交互的组件才加 `"use client"`
- 环境变量：公开的用 `NEXT_PUBLIC_` 前缀，私有的不加
- 文档文件名使用英文，内容使用中文

## 文档目录结构

```
docs/
├── changelog.md                       # 变更日志（语义化，记录为什么改）
├── lessons.md                         # 经验教训（被纠正后更新）
└── design/YYYY-MM-DD-topic/           # 设计方案目录
    ├── design.md                      # 技术方案（source of truth）
    └── todo.md                        # 任务清单（可勾选条目）
```

## 开发工作流

收到需求后，`read docs/workflow.md` 加载完整工作流并按流程执行。
