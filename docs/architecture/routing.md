# 路由结构

## 概述

App Router 页面路由，前台使用 SSG/ISR，后台使用 CSR。

## 快速参考

| 路径 | 文件 | 渲染策略 | 说明 |
|------|------|---------|------|
| `/` | `app/page.tsx` | SSG | 首页，Hero + 最近文章 |
| `/posts` | `app/posts/page.tsx` | SSG | 文章列表（分页） |
| `/posts/[slug]` | `app/posts/[slug]/page.tsx` | SSG + ISR | 文章详情 |
| `/tags` | `app/tags/page.tsx` | SSG | 标签列表 |
| `/tags/[slug]` | `app/tags/[slug]/page.tsx` | SSG | 标签下文章 |
| `/about` | `app/about/page.tsx` | SSG | 关于页 |
| `/login` | `app/login/page.tsx` | CSR | 登录页 |
| `/admin` | `app/admin/page.tsx` | CSR | 仪表盘 |
| `/admin/posts` | `app/admin/posts/page.tsx` | CSR | 文章管理 |
| `/admin/posts/new` | `app/admin/posts/new/page.tsx` | CSR | 新建文章 |
| `/admin/posts/[id]/edit` | `app/admin/posts/[id]/edit/page.tsx` | CSR | 编辑文章 |
| `/admin/tags` | `app/admin/tags/page.tsx` | CSR | 标签管理 |

## 布局嵌套

```
RootLayout (app/layout.tsx)
├── Header + Footer (全局)
└── children
    ├── 前台页面（page.tsx）
    └── AdminLayout (app/admin/layout.tsx)
        └── Sidebar + 后台页面
```

## 关键约定

- 参数化路由用 `[slug]`（文章详情），不用 `[id]`
- Admin 路由统一在 `app/admin/` 下，受 `AdminLayout` 权限守卫
- 新增前台页面默认 SSG；新增后台页面默认 CSR
- `RootLayout` 已包含 `ThemeProvider`、`Header`、`Footer`，新前台页面无需重复引入
