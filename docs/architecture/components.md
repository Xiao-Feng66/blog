# 组件体系

## 概述

三层组件结构，按职责分离。

## 快速参考

| 目录 | 职责 | 示例 |
|------|------|------|
| `components/ui/` | 基础 UI 组件（无业务逻辑） | `ThemeToggle.tsx` |
| `components/blog/` | 博客前台组件 | `PostCard`, `Header`, `Footer`, `Search`, `Comments`, `Pagination` |
| `components/admin/` | 后台管理组件 | `Sidebar`, `PostForm` |

## 关键组件

- `ThemeProvider` (`components/ThemeProvider.tsx`)：next-themes 包装，控制暗色/亮色模式
- `Header` / `Footer`：全局布局组件，已在 `RootLayout` 中引入
- `PostCard`：文章列表卡片
- `Search`：全文搜索弹窗（Client Component，flexsearch）
- `PostForm`：文章编辑表单（Markdown 编辑器 + 预览）

## 命名规范

- 组件文件：PascalCase，如 `PostCard.tsx`
- 工具/Hook：camelCase
- 目录：小写

## "use client" 使用规则

- 默认服务端组件，不需要写
- 需要以下特性时加 `"use client"`：
  - useState/useEffect 等 React Hooks
  - 浏览器 API（localStorage, window 等）
  - 事件处理（onClick, onChange 等）
  - 第三方客户端库（如 flexsearch）

## 样式约定

- 全部使用 Tailwind CSS
- 暗色模式类：`dark:` 前缀
- 主题变量：`bg-surface`, `text-ink`, `dark:bg-surface-dark` 等
