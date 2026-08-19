# AGENTS.md

本仓库是 `lit-pi/what-if`，也就是下游 What-If Life Simulator 项目。

## 项目边界

- 将本仓库视为独立于 Silicon Factory / Persona Library 的项目。
- 除非用户明确要求，不要把实现工作移回 `persona-library`。
- What-If 负责玩家体验、剧本运行时、GM 裁决、AI 角色压力、UI 交互、结算页和剧本资产。
- Silicon Factory 是未来的上游提供方，负责人格包、记忆种子、多 Agent 能力和质量门禁。

## 当前产品阶段

项目已经从静态 demo 验证切换到商业化产品开发阶段。

当前阶段是：

> 商业化 Phase 1：Node.js / TypeScript 前后端分离产品化。

阶段目标：

- 保留当前静态 demo 作为玩法和视觉参考。
- 将 GM 裁决、状态、旗标、结局、角色红线和场景矩阵迁移到服务端权威 Runtime。
- 建立 `apps/api`、`packages/runtime`、`packages/contracts`、`packages/scenarios` 等 Node.js workspace 结构。
- 前端只负责展示和交互，不再持有权威状态。
- 浏览器不再直连真实 LLM，模型调用只允许发生在服务端。

第一轮仍然不要做：

- 账号系统。
- 支付订阅。
- 运营后台。
- 数据库持久化。
- 真实 LLM 接入。
- 剧本市场。

## 当前 demo 形态

- `src/` 仍是已验证的零依赖静态 Web demo。
- 主入口：`index.html`。
- 运行时外壳：`src/app.js`。
- 样式：`src/styles.css`。
- 本地预览：`pnpm dev`。
- 旧 demo 语法检查：`pnpm check`。

MVP 静态阶段“不引入 React、Vite、后端服务或构建工具”的限制只适用于继续维护 demo 或做玩法小实验。商业化 Phase 1 已允许引入 Node.js、TypeScript、Fastify、React/Vite、workspace 和测试工具，但必须遵守商业化实施文档的阶段边界。

## 必读上下文

在进行有意义的设计或实现变更前，先阅读：

- `README.md`
- `docs/context/silicon-factory-downstream-context.md`
- `docs/product/mvp-requirements.md`
- `docs/product/game-development-playbook.md`
- `docs/product/commercial-frontend-backend-architecture.md`
- `docs/product/node-commercial-implementation-plan.md`
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

## 当前优先级

优先打磨第一个剧本：

> 假如我是勇者队伍里的卧底魔王

商业化 Phase 1 需要证明：

- 当前 demo 的六幕/七节点玩法基线可以迁移到服务端 Runtime。
- 预设行动和自由行动 fallback 都可以由服务端裁决。
- 每回合状态变化、旗标、角色反应和结局候选都有确定性规则。
- 角色红线、场景转场、结局优先级不能由 LLM 或前端绕过。
- 至少六个结局可以通过文档化阈值和测试路径到达。
- API 能在无数据库、无真实 LLM 的情况下跑完整局。

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

商业化 Node 架构实施后，还应运行：

- `pnpm check:node`
- `pnpm test:node`

在相关 workspace 脚本尚未建立前，不要假装这些检查已经可用；实施 agent 需要先创建脚本，再把它们纳入验收。
