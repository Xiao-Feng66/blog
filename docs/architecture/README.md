# 架构总览

## 项目定位

个人博客系统，Next.js 14 App Router + Supabase + Prisma。

## AI 阅读导航

按任务类型选择对应文档，避免一次性读完全部源码：

| 任务类型 | 先读文档 | 可能需读的源码 |
|---------|---------|-------------|
| 新增/修改页面路由 | [routing.md](routing.md) | 对应 `page.tsx`, `layout.tsx` |
| 修改数据库/表结构 | [data-layer.md](data-layer.md) | `schema.prisma`, `db.ts` |
| 新增/修改 API 接口 | [api.md](api.md) + [data-layer.md](data-layer.md) | 对应 `route.ts`, `apiAuth.ts` |
| 修改登录/权限/后台 | [auth.md](auth.md) | `auth.ts`, `apiAuth.ts`, `admin/layout.tsx` |
| 新增/修改 UI 组件 | [components.md](components.md) + [rendering.md](rendering.md) | 对应组件文件 |
| 调整渲染方式/SEO | [rendering.md](rendering.md) | 对应 `page.tsx` |
| 调整整体架构/技术栈 | 本文档 + 所有文档 | — |

## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | Next.js 14+ (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 数据库 | Supabase (PostgreSQL) |
| ORM | Prisma |
| 认证 | Supabase Auth (GitHub OAuth) |
| MDX 渲染 | next-mdx-remote |
| 代码高亮 | Shiki |
| 主题切换 | next-themes |
| 全文搜索 | flexsearch（客户端） |
| 评论 | Giscus |
| 部署 | Vercel |

## 关键设计决策

- **前台**：SSG + ISR，文章页静态生成，利于 SEO 和 CDN 缓存
- **后台**：CSR，不需要 SEO，交互密集
- **内容**：Markdown 存数据库，MDX 渲染，代码高亮用 Shiki
- **搜索**：flexsearch 客户端搜索，无需后端索引服务
- **评论**：Giscus 基于 GitHub Discussions，免费托管

## 文档维护

开发收尾时检查本文档是否因代码变更而过时。若新增路由、改 schema、新增组件等，同步更新对应子文档。
