# 仪表盘数据分析 - 任务清单

> 状态：已完成

## 任务

- [x] 1. Prisma schema 新增 PageView 模型 + 执行迁移
- [x] 2. 新增 `POST /api/track` 路由（数据采集）
- [x] 3. 新增 `<TrackPageView />` 客户端组件 + 集成到 LayoutShell
- [x] 4. 新增 `GET /api/analytics` 路由（数据查询，admin 鉴权）
- [x] 5. 安装 recharts + 新增 `<AnalyticsSection />` 仪表盘组件
- [x] 6. 修改 admin 仪表盘页面集成 AnalyticsSection
- [x] 7. Mock 模式适配（TrackPageView 跳过上报 + analytics API 返回模拟数据）
- [x] 8. 完整自验（lint + build + 运行时检查）
  - lint 0 error，build 通过
  - 运行时：首页 200，/admin 200，POST /api/track 204
- [x] 9. 功能收尾（changelog + 文档同步）
