# 渲染策略

## 概述

前台静态生成（SSG + ISR），后台客户端渲染（CSR）。

## 策略矩阵

| 区域 | 策略 | 理由 |
|------|------|------|
| 前台页面 (`/`, `/posts`, `/tags`, `/about`) | SSG + ISR | SEO、性能、CDN 缓存 |
| 文章详情 (`/posts/[slug]`) | SSG + ISR | 同前台，内容更新后自动刷新 |
| 后台 (`/admin/*`) | CSR | 不需要 SEO，交互密集 |

## ISR 配置

- 文章页默认 ISR，重新验证间隔根据实际配置
- 文章创建/更新/删除后，调用 `/api/revalidate` 主动刷新
- 主动刷新路径：`/`, `/posts`, `/posts/[slug]`

## 动态 vs 静态

- `generateStaticParams` 用于文章详情页，构建时生成静态路径
- 新增文章后首次访问会走 SSR（或按需生成），随后缓存

## 关键约定

- 前台 `page.tsx` 尽量保持为服务端组件（直接查库）
- 需要交互的部分抽离为 Client Component，通过 props 传数据
- 不要在前台页面滥用 `"use client"`，会破坏 SSG/SEO 收益
