# 个人博客任务清单

> 状态：进行中 | 最后更新：2026-05-08 20:00:00

## Phase 1：项目脚手架

- [x] 初始化 Next.js 项目（TypeScript + Tailwind CSS）
- [x] 配置 Prisma + Supabase PostgreSQL 连接
- [x] 定义数据库 schema 并执行首次迁移
- [x] 配置 Supabase Auth（GitHub OAuth）
- [x] 创建 .env.example，说明所需环境变量
- [x] 配置 ESLint

## Phase 2：博客前台

- [x] 根布局（导航栏、页脚、主题切换、字体）
- [x] 首页（文章列表 + 分页）
- [x] 文章详情页（MDX 渲染 + Shiki 代码高亮）
- [x] 标签列表页
- [x] 按标签筛选文章页
- [x] 关于页
- [x] 暗色/亮色模式切换（next-themes）
- [x] 响应式布局适配
- [x] SEO（sitemap、Open Graph meta）

## Phase 3：管理后台

- [x] 后台布局（侧边栏导航 + 认证守卫）
- [x] 登录页（GitHub OAuth）
- [x] 仪表盘（文章数量统计）
- [x] 文章列表管理（状态筛选）
- [x] 文章编辑器（Markdown 编辑 + 实时预览）
- [x] 文章创建/编辑表单（标题、标签、状态、摘要）
- [x] 标签管理页（增删改）
- [x] 文章删除确认

## Phase 4：集成与完善

- [x] 全文搜索（flexsearch）
- [x] Giscus 评论系统集成
- [x] 内容变更后 ISR 重新验证
- [x] 加载状态和错误边界
- [ ] Vercel 部署配置
- [ ] 生产环境冒烟测试

