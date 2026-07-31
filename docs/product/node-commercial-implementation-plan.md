# What-If Node.js 商业化架构详细实施文档

状态：商业化 Phase 1 待实施  
日期：2026-07-25  
目标：把当前静态 demo 迁移为 Node.js/TypeScript 前后端分离产品架构  
参考架构：`docs/product/commercial-frontend-backend-architecture.md`  
玩法基线：`docs/specs/undercover-demon-king-runtime-v1.md`

## 0. 生效前提

本实施文档只在项目已明确切换到商业化产品开发阶段后生效。

已确认的阶段决策：

- 当前目标不再是继续堆静态 demo 功能，而是进入正式产品开发。
- 允许引入 Node.js/TypeScript、Fastify、React/Vite、workspace 和测试工具。
- 当前静态 demo 保留为玩法和视觉参考，不再作为商业化规则的最终承载层。

仍然有效的限制：

- 不把实现移回 `persona-library`。
- 不在第一阶段接真实 LLM。
- 不在第一阶段做账号、支付、运营后台、剧本市场。
- 不让前端持有权威状态。

## 1. 实施目标

本阶段不是重做玩法，也不是扩写新剧本，而是把已经验证的《假如我是勇者队伍里的卧底魔王》迁移到正式产品架构：

- 建立 Node.js/TypeScript monorepo。
- 把 GM Runtime 从前端 JS 中抽成服务端权威规则包。
- 把剧本、角色、场景矩阵、结局规则变成版本化配置。
- 建立前后端共享 API contract。
- 实现内存版 API，先不接数据库也能完整跑通会话。
- 禁止浏览器直连 LLM，后续只允许服务端 LLM Orchestrator 调用模型。
- 保留当前 demo 作为视觉和玩法参照，不在前端继续堆权威规则。

## 2. 不做事项

第一轮不要做：

- 账号系统。
- 支付订阅。
- 运营后台。
- 数据库持久化。
- 真实 LLM 接入。
- 剧本市场。
- 多剧本选择。
- 重写 UI 视觉。

这些都是后续阶段。当前只做“Node 架构骨架 + 权威 Runtime + API 可玩闭环”。

## 3. 目标目录结构

```text
what-if/
  apps/
    api/
      src/
        server.ts
        routes/
          sessions.ts
        repositories/
          in-memory-session-repository.ts
        services/
          session-service.ts
        main.ts
      package.json
      tsconfig.json
    web/
      src/
      package.json
      tsconfig.json
  packages/
    contracts/
      src/
        enums.ts
        session.ts
        turn.ts
        llm.ts
        index.ts
      package.json
      tsconfig.json
    scenarios/
      src/
        undercover-demon-king/
          scenario.ts
          stats.ts
          flags.ts
          characters.ts
          scenes.ts
          endings.ts
          preset-actions.ts
          prompt-fragments.ts
        index.ts
      package.json
      tsconfig.json
    runtime/
      src/
        create-initial-state.ts
        apply-turn.ts
        validate-adjudication.ts
        validate-ending-candidate.ts
        verify-character-red-lines.ts
        determine-ending.ts
        build-turn-result.ts
        index.ts
      tests/
        runtime-smoke.test.ts
        validator.test.ts
        endings.test.ts
      package.json
      tsconfig.json
    llm/
      src/
        build-prompt-context.ts
        parse-llm-json.ts
        providers/
          provider.types.ts
        index.ts
      package.json
      tsconfig.json
  legacy-demo/
    index.html
    src/
  docs/
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
```

说明：

- `legacy-demo` 可以稍后迁移；第一轮如果移动文件风险较大，可以先不动现有 `index.html` 和 `src/`。
- `packages/runtime` 必须保持纯函数，不允许读取环境变量、发网络请求或连接数据库。
- `apps/api` 才能组合 repository、runtime、llm、HTTP。

## 4. 根目录配置

### 4.1 `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### 4.2 根 `package.json` scripts

建议先保留旧脚本，再新增 Node 架构脚本：

```json
{
  "scripts": {
    "dev": "python3 -m http.server 5177",
    "check": "node --check src/app.js",
    "test:runtime": "node scripts/runtime-smoke-test.js",
    "dev:api": "pnpm --filter @lit-pi/what-if-api dev",
    "check:node": "pnpm -r typecheck",
    "test:node": "pnpm -r test"
  }
}
```

旧 demo 脚本暂时保留，避免迁移中失去参照。

### 4.3 `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "declaration": true,
    "sourceMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

## 5. `packages/contracts` 实施细节

### 5.1 枚举

定义稳定 key：

- `StatKey`
- `FlagKey`
- `CharacterId`
- `SceneId`
- `EndingKey`
- `ActionCategory`
- `Adjudication`

要求：

- key 必须与当前 `src/app.js` 和 Runtime v1 文档一致。
- 所有字符串字面量集中在 contracts 或 scenario config，避免在 API 里散落硬编码。

### 5.2 Turn Request

```ts
export type TurnRequest = {
  clientTurnId: string;
  actionType: "preset" | "free_text";
  presetActionId?: string | null;
  freeText?: string | null;
};
```

校验规则：

- `clientTurnId` 必填。
- `actionType=preset` 时 `presetActionId` 必填。
- `actionType=free_text` 时 `freeText` 必填且长度 `1..200`。

### 5.3 Turn Result

必须包含：

- `turnId`
- `turnIndex`
- `sceneId`
- `adjudication`
- `narration`
- `stateDelta`
- `stateAfter`
- `flagUpdates`
- `focusedCharacters`
- `characterResponses`
- `evidenceLog`
- `nextScene`
- `ending`
- `decisionTrace`

`decisionTrace` 可以先只内部使用，但 contract 要定义清楚。

## 6. `packages/scenarios` 实施细节

### 6.1 Scenario Config

`scenario.ts` 输出：

```ts
export const undercoverDemonKingScenario = {
  id: "undercover-demon-king",
  version: "1.0.0",
  title: "假如我是勇者队伍里的卧底魔王",
  initialSceneId: "gate",
  stats,
  flags,
  characters,
  scenes,
  endings,
  presetActions
};
```

### 6.2 Stats

迁移 9 个状态：

- `exposureRisk`
- `heroTrust`
- `mageEvidence`
- `priestRedemption`
- `thiefLeverage`
- `castleIntegrity`
- `victorMisread`
- `partyProgress`
- `butterflyDeviation`

每个状态包含：

- `key`
- `label`
- `initialValue`
- `min=0`
- `max=100`
- `playerVisible`
- `description`

### 6.3 Flags

迁移 Runtime v1 全部旗标，标注类型：

- boolean flag
- counter flag

计数器默认值为 `0`，布尔默认值为 `false`。

### 6.4 Characters

按 `character-pressure-and-red-lines-v1.md` 迁移：

- 角色价值观。
- 恐惧。
- 可被说服点。
- 压力阈值。
- 红线。
- 结局底线。
- 对白风格。

不要把角色只写成 prompt 文本。

### 6.5 Scenes

按 `scene-adjudication-matrix-v1.md` 迁移：

- `allowedCategories`
- `forbiddenCategories`
- `focusCharacters`
- `legalNextSceneIds`
- `allowedEndingKeys`
- `conditionRules`
- `defaultProgressRule`

场景配置必须能回答：

- 当前破绽是什么？
- 玩家哪些行动可行？
- 哪些行动会灾难失败？
- 哪些条件会触发角色压力？
- 下一场景只能去哪里？
- 当前场景能触发哪些结局？

### 6.6 Endings

每个结局包含：

- `key`
- `title`
- `tone`
- `priority`
- `category`: instant_failure / hard_failure / final / fallback
- `summary`
- `causeTemplate`
- `shareCopy`

终局结局优先级必须迁移自 Runtime v1，不允许由 LLM 决定。

## 7. `packages/runtime` 实施细节

### 7.1 `createInitialSessionState`

输入：scenario config。  
输出：

- `scenarioId`
- `scenarioVersion`
- `currentSceneId`
- `stats`
- `flags`
- `history=[]`
- `status=active`

要求：

- 所有状态按 scenario 初始值生成。
- 所有 flags 初始化，不允许 undefined。

### 7.2 `applyTurn`

输入：

```ts
type ApplyTurnInput = {
  scenario: ScenarioConfig;
  sessionState: SessionState;
  request: TurnRequest;
  llmCandidate?: LLMAdjudicationCandidate | null;
};
```

流程：

1. 校验会话是否 active。
2. 读取当前场景。
3. 根据 `actionType` 获取预设行动或自由行动候选。
4. 自由行动先走 `validateAdjudication`；失败时走本地 fallback。
5. 合成 `stateDelta`。
6. 裁剪状态到 `0..100`。
7. 应用 flag updates。
8. 校验转场。
9. 校验结局候选。
10. 执行即时硬失败和终局优先级。
11. 生成 `TurnResult` 和新的 `SessionState`。

### 7.3 `validateAdjudication`

必须检查：

- schemaVersion。
- actionCategory 枚举。
- 当前场景 allowed/forbidden category。
- adjudication 枚举；`failure` 在 v1 降级或 fallback。
- stateDelta key 白名单。
- 单项 delta `-30..+30`。
- flag key 白名单。
- characterId 白名单。
- suggestedNextSceneId 合法转场。
- suggestedEndingKey 当前场景允许。

非法关键字段时建议 fallback，不要“修一修就让它过”。

### 7.4 `verifyCharacterRedLines`

输入 stats、flags、scene、candidate ending。  
输出红线列表：

```ts
type RedLineViolation = {
  characterId: CharacterId;
  ruleId: string;
  severity: "warning" | "blocking";
  message: string;
  blocksEndings: EndingKey[];
};
```

第一阶段至少覆盖：

- 莱昂信任底线。
- 伊薇特证据底线。
- 米拉无辜者底线。
- 洛克把柄底线。
- 维克托误读底线。
- `victorBlamed` 专属底线。

### 7.5 `determineEnding`

迁移当前 Runtime v1 结局优先级：

1. 暴露/证据硬失败。
2. 城防崩溃。
3. 双面共主。
4. 被迫转正。
5. 完美卧底。
6. 甩锅维克托。
7. 戏精魔王。
8. 荒诞飞升。
9. 僵局。

所有好结局先过 `validateEndingCandidate`。

## 8. `apps/api` 实施细节

### 8.1 Fastify Server

最小路由：

- `GET /health`
- `POST /api/v1/sessions`
- `GET /api/v1/sessions/:sessionId`
- `POST /api/v1/sessions/:sessionId/turns`

### 8.2 In-memory Repository

第一阶段用内存实现：

```ts
type StoredSession = {
  id: string;
  state: SessionState;
  turns: TurnResult[];
  processedClientTurnIds: Record<string, TurnResult>;
};
```

要求：

- 支持创建、读取、更新。
- 支持 `clientTurnId` 幂等。
- 不要求服务重启后保留数据。

### 8.3 Session Service

负责组合：

- contracts 校验。
- repository。
- scenario registry。
- runtime。
- llm placeholder。

第一阶段自由行动可先不调用真实 LLM，直接传 `llmCandidate=null`，由 runtime fallback 裁决。

### 8.4 API 响应策略

错误码：

- `400`：请求格式错误。
- `404`：会话不存在。
- `409`：会话已结束仍提交回合。
- `429`：后续额度/限流使用，第一阶段可保留。
- `500`：未知错误。

所有错误响应统一：

```json
{
  "error": {
    "code": "SESSION_ENDED",
    "message": "当前会话已经结束。"
  }
}
```

## 9. `packages/llm` 第一阶段占位

第一阶段只实现：

- `buildPromptContext`
- `parseLLMJson`
- provider types

不调用真实模型。

保留接口：

```ts
export type LLMAdjudicationService = {
  requestCandidate(input: PromptContext): Promise<LLMAdjudicationCandidate | null>;
};
```

`apps/api` 中先注入 `nullLLMService`。

## 10. 迁移顺序

### Step 1：建立 workspace 骨架

交付：

- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `apps/api/package.json`
- `packages/*/package.json`

验证：

```bash
pnpm install
pnpm -r typecheck
```

### Step 2：建立 contracts

交付：

- 枚举。
- Zod schema。
- 类型导出。

验证：

```bash
pnpm --filter @lit-pi/what-if-contracts test
```

### Step 3：迁移 scenario config

交付：

- stats。
- flags。
- characters。
- scenes。
- endings。
- preset actions。

验证：

- 所有 `nextSceneId` 都存在。
- 所有 `endingKey` 都存在。
- 所有状态和旗标 key 都在 contracts 中。

### Step 4：实现 runtime 纯函数

交付：

- 初始状态。
- 预设行动回合。
- 自由行动 fallback。
- validator。
- 红线。
- 结局优先级。

验证：

```bash
pnpm --filter @lit-pi/what-if-runtime test
```

测试必须覆盖：

- 合法转场。
- 非法跨场景转场。
- 非最终幕提前结局拒绝。
- delta 裁剪。
- 红线阻断。
- 至少 6 个结局可达。

### Step 5：实现内存 API

交付：

- 创建会话。
- 读取会话。
- 提交回合。
- clientTurnId 幂等。

验证：

```bash
pnpm dev:api
```

手动请求：

1. 创建 `undercover-demon-king` 会话。
2. 提交一个预设行动。
3. 提交一个自由行动。
4. 重复提交同一个 `clientTurnId`，确认不重复结算。
5. 连续提交到结局。

### Step 6：端到端 smoke test

新增 API smoke test：

- `create session`
- `turn 1 gate -> act2_*`
- `turn 2 -> act3_*`
- `turn 3 -> act4_corridor`
- `turn 4 -> act5_throne`
- `turn 5 -> ending`

验证：

```bash
pnpm test:node
```

### Step 7：前端 API 化准备

本实施文档不要求重写前端，但需要给后续前端 agent 留出：

- `SessionSnapshot` contract。
- `TurnResult` contract。
- 状态展示字段。
- 角色对白字段。
- 结局字段。
- 网络错误字段。

## 11. 测试清单

### Runtime Tests

- 初始化状态完整。
- 所有状态裁剪到 `0..100`。
- 所有 flag 初始化。
- 所有预设行动 key 合法。
- 所有场景转场合法。
- 非法 LLM category fallback。
- 非法 LLM scene transition fallback。
- 非法 LLM ending fallback。
- `gate + confess` 触发场景即时失败。
- `act5_throne + peace` 可以进入和平候选但需红线通过。
- `victorBlamed` 被高 `thiefLeverage` 阻断。

### API Tests

- 创建会话成功。
- 不存在剧本创建失败。
- 读取会话成功。
- 提交预设行动成功。
- 提交自由行动成功。
- 空自由文本失败。
- 重复 `clientTurnId` 幂等。
- 已结束会话不能继续提交。

### Regression Tests

用当前 demo 的典型路线做对照：

- 普通暴露失败。
- 和平路线。
- 完美卧底路线。
- 甩锅维克托路线。
- 荒诞飞升路线。
- 僵局路线。

## 12. 验收标准

本阶段完成条件：

- `pnpm check` 和旧 `pnpm test:runtime` 仍通过。
- `pnpm check:node` 通过。
- `pnpm test:node` 通过。
- API 能在无数据库、无真实 LLM 的情况下跑完整局。
- 浏览器端没有真实 LLM API key 路径。
- Runtime 纯函数不依赖 HTTP、DB、环境变量。
- 每个回合结果都有 `decisionTrace`。
- 文档中的 GM、角色、场景规则能在 scenario config 中找到对应结构。

## 13. 给实施 agent 的注意事项

- 不要把实现移回 `persona-library`。
- 不要在第一阶段接真实模型。
- 不要让前端继续成为权威状态机。
- 不要为了快速迁移删除现有 demo；它是视觉和玩法参照。
- 不要引入两套 schema 校验库。
- 不要在 runtime 包里读取 `process.env`。
- 不要让 LLM candidate 直接决定结局。

如果发现当前 `src/app.js` 行为和文档冲突，以 `docs/specs/undercover-demon-king-runtime-v1.md` 为产品基线，再记录需要修正的代码差异。
