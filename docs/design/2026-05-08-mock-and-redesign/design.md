# Mock 数据 + 页面美化 + 部署上线

> 状态：待开发

## 背景

博客代码已完成，但没有数据库连接，所有涉及 Prisma 查询的页面和 API 都会报错。需要：
1. 用 mock 数据让页面跑起来，验证展示效果
2. 当前页面样式过于简陋，需要重新设计前台和后台的视觉效果
3. 配置真实环境变量并部署上线

## 方案

### 1. Mock 数据

创建 `src/lib/mockData.ts`，集中存放假数据。在 `src/lib/db.ts` 中导出 `useMock` 标志（判断 `DATABASE_URL` 是否为 placeholder），各页面和 API 路由根据此标志决定返回 mock 数据还是走 Prisma。

**mock 数据内容**：
- 5 篇文章（不同状态：3 篇 published、1 篇 draft、1 篇 hidden）
- 3 个标签（前端、后端、随笔）
- 文章-标签关联关系

**涉及文件**（11 个 Prisma 调用点 + 1 个新文件）：

| 文件 | 改动 |
|------|------|
| `src/lib/mockData.ts` | 新建，集中定义 mock 数据 |
| `src/lib/db.ts` | 导出 `useMock` 标志 |
| `src/app/page.tsx` | 首页：mock 文章列表 + 分页 |
| `src/app/posts/[slug]/page.tsx` | 文章详情：mock 单篇文章 |
| `src/app/tags/page.tsx` | 标签列表：mock 标签 |
| `src/app/tags/[slug]/page.tsx` | 按标签筛选：mock 筛选结果 |
| `src/app/sitemap.ts` | sitemap：mock 文章 slug |
| `src/app/admin/page.tsx` | 仪表盘：mock 统计数据 |
| `src/app/api/posts/route.ts` | 文章 API：mock GET 响应 |
| `src/app/api/posts/[id]/route.ts` | 单篇文章 API：mock GET 响应 |
| `src/app/api/tags/route.ts` | 标签 API：mock GET 响应 |
| `src/app/api/search/route.ts` | 搜索 API：mock 搜索结果 |

### 2. 页面美化

使用 frontend-design skill 重新设计页面样式。

**博客前台**：
- 根布局（导航栏、页脚）
- 首页文章列表
- 文章详情页
- 标签页
- 关于页
- 暗色/亮色模式

**管理后台**：
- 后台布局（侧边栏）
- 登录页
- 仪表盘
- 文章管理列表
- 文章编辑器
- 标签管理页

### 3. 部署上线

- 用户在 Supabase 创建项目，获取连接信息
- 填写 `.env` 环境变量
- 运行 `npx prisma migrate dev` 建表
- 移除 mock 逻辑（或保留 useMock 自动切换）
- Vercel 部署

## 变更评估

```
预估文件数：20+
涉及模块：lib、pages、API routes、components
影响范围：所有页面和 API
```
