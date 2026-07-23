# What-If Life Simulator

What-If 是 Lit-Pi 的下游互动叙事系统。它有意从 Silicon Factory / Persona Library 中拆出，作为独立产品先验证玩法和体验。

近期目标是在这里先设计并验证玩法、UI、状态机、AI 角色行为和内容管线。等这些需求足够清晰后，再反向调整 Silicon Factory，让上游提供这个产品真正需要的人格、记忆和模拟能力。

## 当前 MVP

第一个剧本是：

> 假如我是勇者队伍里的卧底魔王

玩家是魔王，伪装成圣骑士混在勇者队中。队伍已经抵达魔王城。玩家必须保护自己的身份、城堡，以及过度忠诚又容易脑补的副官，同时不能失去勇者队的信任。

## 项目结构

- `src/`：下游产品外壳的零依赖静态原型。
- `docs/context/`：说明为什么本系统是 Silicon Factory 的下游，以及承接了哪些上下文。
- `docs/product/`：产品需求和 MVP 验收标准。
- `docs/specs/`：剧本目录和完整可玩剧本规格。
- `docs/assets-prompts/`：视觉提示词提取和资产规划。

## 本地开发

```bash
pnpm dev
```

开发服务器使用 Python 内置静态文件服务器，端口为 `5177`。

也可以直接在浏览器中打开 `index.html` 做快速预览。

## 关键文档

- [下游系统上下文](docs/context/silicon-factory-downstream-context.md)
- [产品需求](docs/product/mvp-requirements.md)
- [轻量游戏开发 Playbook](docs/product/game-development-playbook.md)
- [卧底魔王玩法 Demo 实施文档](docs/product/demo-implementation-plan.md)
- [系统设计模板](docs/product/system-design-template.md)
- [剧本目录](docs/specs/what-if-scenario-catalog.md)
- [卧底魔王剧本规格](docs/specs/undercover-demon-king.md)

## 工作原则

本仓库不应该一开始就镜像上游人格数据模型，而应该先定义真实的产品体验：

1. 玩家看到什么、做什么。
2. 世界 GM 必须裁决什么。
3. 每个 AI 角色需要记住什么、追求什么。
4. 为了可复玩的结局，需要哪些状态变化。
5. Silicon Factory 未来必须作为上游服务提供什么。
