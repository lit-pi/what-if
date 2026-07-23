# AGENTS.md

本仓库是 `lit-pi/what-if`，也就是下游 What-If Life Simulator 项目。

## 项目边界

- 将本仓库视为独立于 Silicon Factory / Persona Library 的项目。
- 除非用户明确要求，不要把实现工作移回 `persona-library`。
- What-If 负责玩家体验、剧本运行时、GM 裁决、AI 角色压力、UI 交互、结算页和剧本资产。
- Silicon Factory 是未来的上游提供方，负责人格包、记忆种子、多 Agent 能力和质量门禁。

## 当前原型形态

- 保持 MVP 轻量，优先快速验证。
- 当前原型是零依赖静态 Web 代码。
- 主入口：`index.html`。
- 运行时外壳：`src/app.js`。
- 样式：`src/styles.css`。
- 本地预览：`pnpm dev`。
- 语法检查：`pnpm check`。

除非有明确的产品理由且用户同意，不要引入 React、Vite、后端服务、账号系统、市场功能或重型构建工具。

## 必读上下文

在进行有意义的设计或实现变更前，先阅读：

- `README.md`
- `docs/context/silicon-factory-downstream-context.md`
- `docs/product/mvp-requirements.md`
- `docs/product/game-development-playbook.md`
- `docs/specs/undercover-demon-king.md`

如果涉及视觉或资产相关工作，还要阅读：

- `docs/assets-prompts/undercover-demon-king-assets.md`

如果涉及剧本选择或未来剧本，还要阅读：

- `docs/specs/what-if-scenario-catalog.md`

## 开发方法

使用 `docs/product/game-development-playbook.md` 作为轻量生产指南。

当新增或修改重要玩法系统时，先使用：

- `docs/product/system-design-template.md`

重要系统包括：

- GM 裁决。
- 自由行动解释。
- AI 角色压力与主动意图。
- 证据、怀疑与信任。
- 状态变化、旗标与数值裁剪。
- 插入事件。
- 结局优先级。
- 结算页因果解释。

## MVP 优先级

优先打磨第一个剧本：

> 假如我是勇者队伍里的卧底魔王

MVP 需要证明：

- 六幕流程可以从开局一直玩到结局。
- 预设行动和自由行动都可以被裁决。
- 每回合后都能看到状态变化。
- AI 角色会根据角色压力和关系状态做出反应。
- 结局选择是确定性的，并且可以解释。
- 至少六个结局可以通过文档化阈值到达。

## 运行时规则

- 关键状态变化必须是确定性的，并由运行时负责。
- 数值状态必须裁剪到 `0-100`。
- 使用剧本规格中的稳定工程 key。
- 旗标和计数器要显式记录。
- 不要依赖不受约束的自由文本来选择结局。
- 结局优先级必须防止漏判或被低优先级覆盖。
- 自由行动可以有表达空间，但不能绕过完整剧本，也不能瞬间解决所有角色冲突。

## 评审视角

交付变更前，用以下视角检查：

- 叙事：是否保留了“卧底魔王”的幻想？
- 玩法：每个行动是否带来有意义的取舍？
- UI：玩家在移动端能否理解压力、选择和后果？
- 技术：状态、旗标和结局是否确定性？
- QA：每一幕和每个结局路径是否都能被有意测试？

## 验证

修改 `src/app.js` 后运行 `pnpm check`。

如果 UI 或玩法变更影响浏览器体验，使用 `pnpm dev` 预览并手动验证流程。
