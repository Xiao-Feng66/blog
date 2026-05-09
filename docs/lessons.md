# 经验教训

## 2026-05-09: 跳过工作流直接编码

**错误**：收到多需求任务后，在 plan mode 中做了变更评估和方案，但退出 plan mode 后直接开始编码，跳过了 Step 2（创建 design 文档 + todo.md）和 Step 3（方案评审）。

**规则**：plan mode 的产出不能替代 `docs/design/` 下的 design 文档。工作流要求方案落地为持久化文件（技术方案.md + todo.md），经用户评审后才进入编码。

**防止再犯**：退出 plan mode 后，第一步永远是 `read docs/workflow.md` 并按步骤执行，不直接写代码。
