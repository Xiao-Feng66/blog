# 认证与权限

## 概述

Supabase Auth (GitHub OAuth) + 单用户管理员模式。

## 快速参考

| 文件 | 职责 |
|------|------|
| `src/lib/auth.ts` | `getSession()`, `isAdmin()` |
| `src/lib/apiAuth.ts` | `requireAdmin()` — Route Handler 守卫 |
| `src/lib/supabase.ts` | 浏览器端 Supabase 客户端 |
| `src/lib/supabase-server.ts` | 服务端 Supabase 客户端 |
| `src/app/admin/layout.tsx` | 后台布局权限检查（页面级守卫） |
| `src/app/login/page.tsx` | 登录页面 |

## 认证流程

1. 访问 `/admin` → `AdminLayout` 调用 `isAdmin()`
2. 未登录 → 跳转 GitHub OAuth（Supabase 托管）
3. 授权回调 → `/api/auth/callback` → 创建会话
4. 再次检查 → 通过，渲染后台

## 权限模型

- 单用户博客，仅一个 GitHub 用户 ID 拥有管理员权限
- `ADMIN_USER_ID` 环境变量配置管理员 GitHub 用户 ID
- Mock 模式下 `isAdmin()` 恒返回 true

## 守卫使用

- **页面级**：`AdminLayout` 用 `isAdmin()` + `redirect("/login")`
- **API 级**：用 `requireAdmin()`，返回 401 JSON

## 关键约定

- 不要在前台页面直接调用 `getSession()`（性能开销）
- 新增需要鉴权的 API 必须 `await requireAdmin()`
- 鉴权失败统一返回 `{ error: "Unauthorized" }` + 401
