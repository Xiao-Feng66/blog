# API 路由

## 概述

RESTful API，位于 `app/api/` 下，使用 Next.js Route Handler。

## 路由清单

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/api/auth/callback` | 公开 | GitHub OAuth 回调 |
| GET | `/api/posts` | 公开 | 文章列表（分页、状态筛选、标签筛选） |
| POST | `/api/posts` | Admin | 创建文章 |
| GET | `/api/posts/[id]` | 公开 | 文章详情 |
| PUT | `/api/posts/[id]` | Admin | 更新文章 |
| DELETE | `/api/posts/[id]` | Admin | 删除文章 |
| GET | `/api/tags` | 公开 | 标签列表 |
| POST | `/api/tags` | Admin | 创建标签 |
| PUT | `/api/tags/[id]` | Admin | 更新标签 |
| DELETE | `/api/tags/[id]` | Admin | 删除标签 |
| POST | `/api/revalidate` | Admin | 触发 ISR 重新验证 |
| GET | `/api/search` | 公开 | 全文搜索（返回文章索引数据） |
| POST | `/api/track` | 公开 | 页面访问量上报（path + postId） |
| GET | `/api/analytics` | Admin | 访问分析数据（PV/UV/趋势/热门文章，支持 range 参数） |

## 命名约定

- 资源名复数：`posts`, `tags`
- ID 参数用 `[id]`，字符串 UUID
- 列表查询参数：`page`, `status`, `tag`
- 分页响应格式：`{ posts, total, page, totalPages }`

## 错误处理

- 未授权：返回 `{ error: "Unauthorized" }` + 401
- 服务端错误：返回 `{ error: "..." }` + 500

## 关键约定

- Route Handler 中优先使用 `NextRequest` / `NextResponse`
- 写操作（POST/PUT/DELETE）开头必须 `await requireAdmin()`
- Mock 模式下读取操作使用 `mockDb`，写操作逻辑与真实数据库一致
