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
  │  │  3. 🔴 轻量验证：npm run build      │
  │  │       - 通过 → 继续下一个 todo      │
  │  │       - 失败 → 修复 → 重新 build → 通过后才能继续  │
  │  └──────────┬──────────────────────────┘
  │             │ 还有未完成的 todo？→ 继续循环
  │             │ 全部完成 ↓
  ▼
Step 6: 完整自验（🔴 必须执行，不可跳过）
  │  静态检查（npm run lint + npm run build）
  │  运行时检查（curl 访问改动的页面/API）
  │  任一步报错 → 修复 → 重新自验 → 通过后再继续
  │
  ▼
Step 7: 功能收尾
  │  🔴 1. changelog.md 追加记录（需求/功能维度）—— 不可跳过
  │        要求：日期标题 + [类型]标题 + 背景 + 核心改动 + 涉及文件
  │     2. CLAUDE.md 一致性检查（项目结构、数据模型等是否与代码一致，过时则更新）
  │     3. `docs/architecture/` 一致性检查（新增路由、改 schema、新增组件等，过时则更新）
  │
  ▼
Step 8: 提交 PR
  │  git push + 创建 PR（附 Summary + 变更清单）
  │
  ▼
Step 9: Code Review
  │  用户审阅 PR，有问题则修复后追加 commit
  │
  ▼
Step 10: 合入 main
```

## Step 6: 完整自验 详细说明

目的：在提交 PR 前做最终兜底检查（每个 todo 后已做过 build，这里补充 lint 和运行时检查）。
原则：任一步报错 → 立即修复 → 重新自验 → 通过后再继续。

### 1. 静态检查

```bash
npm run lint    # ESLint 代码规范检查
npm run build   # TypeScript 编译 + 路由检查 + SSG 生成验证
```

`build` 是最关键的检查项，能发现 80% 的运行时错误：
- TypeScript 类型错误
- 路由配置错误（如 generateStaticParams 缺失）
- 缺失 import / 命名拼写错误
- 服务端组件误用 `"use client"`
- SSG 生成失败（如服务端组件直接调用浏览器 API）

### 2. 运行时检查（仅针对本次改动的页面/API）

前提：本地 dev server 可启动（有数据库连接或 Mock 模式）。

执行：
```bash
npm run dev &                               # 后台启动
curl -s http://localhost:3000/改动的路径    # 检查页面/API 是否 200
# 预期内容包含关键词，如页面标题或 API 字段
```

验证：
- HTTP 200
- 响应包含预期内容

若无数据库（Mock 模式）：build 通过即可，跳过 curl。

### 3. 结果处理

- 全部通过 → 继续后续步骤
- 任一步失败 → 修复 → 回到 Step 6 重新自验

## Commit message 格式

`类型: 简述改动`

类型：`feat` 新功能 / `fix` 修复 / `refactor` 重构 / `docs` 文档 / `chore` 配置与杂项

## Changelog 条目规范

每条记录必须包含以下结构：

```
## YYYY-MM-DD

### [类型] 标题

- **背景**：（为什么改）
- **核心改动**：（编号列表）
- **涉及文件**：（关键文件路径）
```

类型：`[新功能]` / `[修复]` / `[重构]` / `[文档]` / `[配置]`

**强制要求**：
- 每个需求合入 main 前必须更新 `docs/changelog.md`
- 若 Step 5 和 Step 7 均遗漏，Step 10 合入后必须立即补充（事后补救，不可跳过）
