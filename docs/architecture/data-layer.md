# 数据层

## 概述

Prisma ORM + PostgreSQL，支持本地 Mock 回退（无数据库时）。

## 快速参考

| 文件 | 职责 |
|------|------|
| `prisma/schema.prisma` | 数据库 Schema（Post, Tag, PostTag, PageView） |
| `src/lib/db.ts` | Prisma 客户端实例 + Mock 开关 |
| `src/lib/mockData.ts` | 本地 Mock 数据实现 |

## Schema

```
Post: id(UUID), title, slug(unique), content, summary, coverImage?, status(draft/published/hidden), createdAt, updatedAt
Tag: id(UUID), name(unique), slug(unique)
PostTag: postId, tagId (复合主键)
PageView: id(UUID), path, postId?, sessionId, createdAt
```

## 数据访问模式

- **服务端组件 / Route Handler**：直接 `import { prisma } from "@/lib/db"`
- **浏览器端**：通过 API 路由访问，不直接操作数据库
- **Mock 模式**：`useMock` 为 true 时 `prisma` 为 null，调用方需使用 `mockDb`

## Mock 机制

- `useMock = !DATABASE_URL || DATABASE_URL.includes("johndoe:randompassword")`
- Mock 模式下 `isAdmin()` 返回 true，方便本地无数据库开发

## 关键约定

- 不直接写 SQL，统一用 Prisma Client
- 服务端组件中直接查库；客户端通过 API
- 新增字段时同步更新 `schema.prisma` 并执行 `npx prisma migrate dev`
- 查询文章时通常 `include: { tags: { include: { tag: true } } }` 获取关联标签
