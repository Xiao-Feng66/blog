# 个人博客技术方案

> 状态：进行中

## 背景

搭建个人博客系统，包含博客前台和管理后台。前台注重性能、SEO 和阅读体验；后台支持文章管理、标签管理和可见性控制。

## 技术选型

| 层级 | 选型 | 理由 |
|------|------|------|
| 框架 | Next.js 14+ (App Router) | 主流全栈框架，Vercel 原生支持 |
| 语言 | TypeScript | 全栈类型安全 |
| 样式 | Tailwind CSS | 原子化 CSS，开发快，内置暗色模式支持 |
| 数据库 | Supabase (PostgreSQL) | 免费额度充足，内置 Auth，托管服务免运维 |
| ORM | Prisma | 类型安全查询，schema 即文档 |
| 认证 | Supabase Auth (GitHub OAuth) | 开箱即用，无需自己实现认证逻辑 |
| MDX 渲染 | next-mdx-remote | 服务端编译 MDX |
| 代码高亮 | Shiki | VS Code 级别的语法高亮 |
| 主题切换 | next-themes | 暗色/亮色模式，支持跟随系统 |
| 全文搜索 | flexsearch | 客户端搜索，无需后端服务 |
| 评论 | Giscus | 基于 GitHub Discussions，免费 |
| 部署 | Vercel | Next.js 零配置部署 |

## 渲染策略

- **博客前台**：SSG + ISR。文章页构建时静态生成，数据库内容变更后 ISR 在 60 秒内自动刷新
- **管理后台**：CSR。不需要 SEO，客户端渲染 + API 调用

## 数据模型

```
posts（文章表）
├── id            UUID, 主键
├── title         varchar(200), 标题
├── slug          varchar(200), unique, URL 标识
├── content       text, Markdown 正文
├── summary       varchar(500), 摘要
├── cover_image   varchar(500), nullable, 封面图
├── status        enum(draft/published/hidden), 状态
├── created_at    timestamp, 创建时间
└── updated_at    timestamp, 更新时间

tags（标签表）
├── id            UUID, 主键
├── name          varchar(50), unique, 标签名
└── slug          varchar(50), unique, URL 标识

post_tags（文章-标签关联表）
├── post_id       UUID, FK -> posts.id
└── tag_id        UUID, FK -> tags.id
    (post_id, tag_id) unique 联合约束
```

## API 路由

```
POST   /api/auth/callback     GitHub OAuth 回调
GET    /api/posts              文章列表（分页、标签筛选）
POST   /api/posts              创建文章
GET    /api/posts/[id]         获取文章详情
PUT    /api/posts/[id]         更新文章
DELETE /api/posts/[id]         删除文章
GET    /api/tags               标签列表
POST   /api/tags               创建标签
PUT    /api/tags/[id]          更新标签
DELETE /api/tags/[id]          删除标签
POST   /api/revalidate         触发 ISR 重新验证
```

## 认证流程

1. 访问 `/admin` → 未登录则跳转 GitHub OAuth（通过 Supabase）
2. GitHub 授权回调 → Supabase 创建会话
3. Admin layout 检查会话状态，未认证用户展示登录页
4. 仅配置的 GitHub 用户 ID 拥有管理员权限（单用户博客）

## 文章发布流程

1. 管理员在 Markdown 编辑器中编写文章，右侧实时预览
2. 设置元信息：标题、标签、状态（草稿/已发布/隐藏）
3. 保存 → API 写入 Supabase 数据库（即时生效）
4. 调用 revalidation API → Next.js ISR 刷新相关页面
5. 前台在 60 秒内展示最新内容

## 变更评估

```
预估文件数：30+
预估变更行数：2000+
涉及架构调整：是（全新项目）
影响他人开发：否
需要 design 文档：是（本文档）
理由：全新项目，涉及多个模块
```
