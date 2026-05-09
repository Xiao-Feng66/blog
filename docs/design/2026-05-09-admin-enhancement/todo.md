# 管理后台增强 - 任务清单

> 状态：已完成 | 最后更新：2026-05-09 17:30:00

## 任务

- [x] 1. PostForm 添加文件导入功能（导入按钮 + FileReader）
- [x] 2. PostForm 标签区域支持内联新建标签（输入框 + POST /api/tags）
- [x] 3. 新建 LayoutShell 组件，admin 路径下隐藏 Header/Footer/BackgroundDecor
- [x] 4. 修改根 layout 使用 LayoutShell
- [x] 5. Sidebar 添加"查看博客"链接
- [x] 6. 完整自验（lint + build + 运行时检查）
  - build ✅，lint 有 1 error + 1 warning 均为已有代码（ThemeToggle.tsx / page.tsx），非本次改动
  - 运行时：首页 200 有 header/footer，/admin 307 重定向到 /login（未登录，预期行为）
- [x] 7. 功能收尾（changelog + 文档同步）
