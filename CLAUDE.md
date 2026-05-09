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

## AI 工作指南

按任务类型阅读对应文档，避免一次性读完全部源码：

| 任务 | 阅读顺序 |
|------|---------|
| 了解整体架构 | `docs/architecture/README.md` |
| 改页面/路由/布局 | `docs/architecture/routing.md` + `rendering.md` |
| 改数据库/表结构 | `docs/architecture/data-layer.md` |
| 改 API 接口 | `docs/architecture/api.md` + `data-layer.md` |
| 改登录/权限 | `docs/architecture/auth.md` |
| 改 UI 组件 | `docs/architecture/components.md` + `rendering.md` |

## 项目结构（目录级）

```
src/
├── app/           # Next.js App Router（前台 + 后台 + API）
├── components/    # 组件（ui / blog / admin）
├── lib/           # 工具函数、客户端、认证
└── generated/     # Prisma 生成代码
```

详细路由、组件分层、API 清单见 `docs/architecture/` 各子文档。

## 数据模型

```
Post:  id, title, slug, content, summary, coverImage?, status, createdAt, updatedAt
Tag:   id, name, slug
PostTag: postId, tagId
```

详见 `docs/architecture/data-layer.md`。

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
- **每个需求合入 main 前必须更新 `docs/changelog.md`**，按 `docs/workflow.md` 规范格式记录

## 文档目录结构

```
docs/
├── architecture/                       # 架构文档（AI 按需读取）
│   ├── README.md                       # 架构总览 + AI 导航
│   ├── routing.md                      # 路由结构
│   ├── data-layer.md                   # 数据层
│   ├── auth.md                         # 认证与权限
│   ├── api.md                          # API 路由
│   ├── components.md                   # 组件体系
│   └── rendering.md                    # 渲染策略
├── changelog.md                        # 变更日志（语义化，记录为什么改）
├── lessons.md                          # 经验教训（被纠正后更新）
├── design/YYYY-MM-DD-topic/            # 设计方案目录
│   ├── design.md                       # 技术方案（source of truth）
│   └── todo.md                         # 任务清单（可勾选条目）
└── workflow.md                         # 开发工作流
```

## 开发工作流

收到需求后，`read docs/workflow.md` 加载完整工作流并按流程执行。
