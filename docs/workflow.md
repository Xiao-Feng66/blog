# 开发工作流

> 最后更新：2026-05-08 20:00:00

收到需求后，按以下流程执行。人只在方案评审环节决策，其余步骤自动执行。

```
需求进入
  │
  ▼
Step 1: 变更评估
  │  输出 [变更评估]，判断规模和是否需要 design 文档
  │
  ▼
Step 2: 方案设计
  │  创建 docs/design/YYYY-MM-DD-topic/ 目录
  │  撰写 design.md（技术方案）+ todo.md（任务清单）
  │
  ▼
Step 3: 方案评审  ◀── 唯一人工决策点
  │  用户审阅方案，同意 / 要求修改 / 推翻
  │
  ▼
Step 4: 创建分支
  │  从 main 新建分支：feat/功能名 或 fix/修复名
  │
  ▼
Step 5: 开发循环（按 todo 逐项执行）
  │  ┌─────────────────────────────────────┐
  │  │ 完成一个 todo 项后自动执行：         │
  │  │  1. todo.md 打勾 + 补充新发现的任务  │
  │  │  2. git add + commit               │
  │  └──────────┬──────────────────────────┘
  │             │ 还有未完成的 todo？→ 继续循环
  │             │ 全部完成 ↓
  ▼
Step 6: 功能收尾
  │  1. CLAUDE.md 一致性检查（项目结构、数据模型等是否与代码一致，过时则更新）
  │  2. changelog.md 追加一条记录（需求/功能维度）
  │
  ▼
Step 7: 提交 PR
  │  git push + 创建 PR（附 Summary + 变更清单）
  │
  ▼
Step 8: Code Review
  │  用户审阅 PR，有问题则修复后追加 commit
  │
  ▼
Step 9: 合入 main
```

## Commit message 格式

`类型: 简述改动`

类型：`feat` 新功能 / `fix` 修复 / `refactor` 重构 / `docs` 文档 / `chore` 配置与杂项
