# Node.js Phase 1 实施评审优化计划

状态：待实施  
日期：2026-07-31  
范围：Node.js / TypeScript Phase 1 骨架、Runtime、contracts、scenario、API、测试  
背景：开发 agent 已完成第一版 `apps/api`、`packages/contracts`、`packages/scenarios`、`packages/runtime`、`packages/llm` 和 Node 检查脚本。旧 demo 检查与新 Node 检查均已通过，但仍存在若干需要在合并前修复的规则边界和工程卫生问题。

## 1. 评审结论

当前实现已经满足 Phase 1 的大方向：

- 已建立 pnpm workspace。
- 已建立 `apps/api`。
- 已建立 `packages/contracts`、`packages/scenarios`、`packages/runtime`、`packages/llm`。
- 已实现内存 session repository。
- 已实现 API 基础路由。
- 已实现 runtime 初始化、预设行动、自由行动 fallback、validator、结局判定基础逻辑。
- 已实现 null LLM provider，占位但不调用真实模型。
- `pnpm check`、`pnpm test:runtime`、`pnpm check:node`、`pnpm test:node` 均通过。

但还不建议直接合并。原因是：

1. 带 `endingKey` 的预设/LLM 结局目前绕过角色红线。
2. LLM candidate 的 `schemaVersion` 没有被强校验。
3. contracts 的角色枚举遗漏 `narrator` 和 `aslan`。
4. TypeScript 编译产物混入了 `src/`。
5. 新 `determineEnding()` 与 Runtime v1 阈值存在偏差。

下一轮优化目标是先把“服务端权威 Runtime 不能被绕过”这条边界钉死，再清理提交卫生。

## 2. P1：所有结局候选必须经过红线校验

### 问题

当前 `packages/runtime/src/apply-turn.ts` 中：

- 预设行动的 `endingKey` 会写入 `suggestedEndingKey`。
- LLM candidate 的 `suggestedEndingKey` 会写入 `suggestedEndingKey`。
- 之后 `targetEndingKey` 直接取该值并进入 `scenario.endings[targetEndingKey]`。

这意味着 `dualRuler`、`redeemed`、`perfectSpy`、`victorBlamed` 等结局可以绕过 `validateEndingCandidate()` 和 `verifyCharacterRedLines()`。

### 风险

- 莱昂信任低于底线时仍可能进入好结局。
- 洛克把柄过高时仍可能进入 `victorBlamed`。
- 米拉红线被触碰后仍可能进入纯净救赎结局。
- LLM 一旦接入，可能通过合法 `suggestedEndingKey` 越过角色底线。

### 修复要求

在 `applyTurn()` 中统一处理结局候选：

1. 所有来自预设行动或 LLM candidate 的 `suggestedEndingKey` 先经过场景允许结局校验。
2. 所有最终写入 `endingResult` 的 `targetEndingKey` 都必须经过 `validateEndingCandidate(targetEndingKey, stateAfter, flagsAfter)`。
3. 如果被红线阻断，使用 `effectiveEndingKey`，并在 `decisionTrace` 中记录：
   - `ending_candidate_blocked`
   - 原始结局 key
   - 生效结局 key
   - 阻断原因
4. 即时硬失败如 `gate_exposure_ending`、`instantArrest`、`exposed` 也可以经过同一函数，但不能被好结局红线错误阻断。

### 建议实现形态

```ts
if (targetEndingKey) {
  const validation = validateEndingCandidate(targetEndingKey, stateAfter, flagsAfter);
  if (!validation.allowed) {
    rejectedCandidateFields.push(`ending_blocked_${targetEndingKey}`);
    matchedRules.push(`ending.fallback.${validation.effectiveEndingKey}`);
  }
  targetEndingKey = validation.effectiveEndingKey;
}
```

### 测试要求

新增 runtime tests：

- `act5_throne + dualRuler` 在 `heroTrust < 40` 时回退 `stalemate` 或硬失败。
- `act5_throne + victorBlamed` 在 `thiefLeverage >= 70 && !bribedLocke` 时不能进入 `victorBlamed`。
- 预设结局和 LLM candidate 结局都覆盖上述红线。
- 场景专属即时失败仍能正常进入，例如 `gate_exposure_ending`。

## 3. P1：强校验 LLM `schemaVersion`

### 问题

当前 `LLMAdjudicationCandidateSchema` 中 `schemaVersion` 是 optional string，`validateAdjudicationCandidate()` 也没有检查它必须等于：

```text
what-if-llm-adjudication/v1
```

### 风险

后续接真实模型时，旧 schema、半结构化 JSON 或测试 mock 都可能被当作 v1 candidate 使用。

### 修复要求

1. 在 contracts 中将 `schemaVersion` 固定为 literal：

```ts
schemaVersion: z.literal("what-if-llm-adjudication/v1")
```

2. 如果为了兼容现有测试暂时允许 optional，也必须在 `validateAdjudicationCandidate()` 中拒绝缺失或不匹配版本。
3. `NullLLMProvider` 不受影响，因为它返回 `null`。
4. 更新所有测试 mock，补齐 `schemaVersion`。

### 测试要求

新增或修改 tests：

- 缺失 `schemaVersion` 的 candidate validation 失败并 fallback。
- 错误 `schemaVersion` 的 candidate validation 失败并 fallback。
- 正确 `schemaVersion` 的 candidate 可以继续进入后续校验。

## 4. P2：补齐角色枚举 `narrator` 和 `aslan`

### 问题

当前 `CharacterIdSchema` 只包含：

- `leon`
- `ivette`
- `mira`
- `locke`
- `victor`

但现有 demo 和 LLM v1 schema 设计允许：

- `narrator`
- `aslan`
- `leon`
- `ivette`
- `mira`
- `locke`
- `victor`

### 风险

- GM 旁白角色无法通过 schema。
- 阿斯兰内心反应无法通过 schema。
- 旧 demo 与 Node contracts 字段不一致。

### 修复要求

1. 在 `packages/contracts/src/enums.ts` 中补齐 `narrator` 和 `aslan`。
2. 在 scenario character config 中决定是否为 `narrator` 和 `aslan` 建立完整角色配置：
   - 如果需要焦点角色/对白输出，则建立配置。
   - 如果只作为特殊系统角色，则在文档和类型中明确。
3. 更新相关 tests。

### 测试要求

- `CharacterResponse` 接受 `narrator`。
- `CharacterResponse` 接受 `aslan`。
- 当前默认角色反应仍能正常生成。

## 5. P2：清理 TypeScript 编译产物

### 问题

`git status --untracked-files=all` 显示 `packages/contracts/src/` 中混入了：

- `*.js`
- `*.d.ts`
- `*.js.map`

这些是 TypeScript 编译产物，不应提交在 `src/`。

### 风险

- 源码目录被生成文件污染。
- 后续 review 噪音变大。
- 可能出现源码和编译产物不一致。

### 修复要求

1. 删除 `packages/contracts/src/*.js`、`*.d.ts`、`*.js.map` 等生成文件。
2. 检查其他 package 的 `src/` 下是否也有生成文件。
3. 确认 `tsconfig.json` 的 `outDir` 指向 `dist`。
4. 更新 `.gitignore`，建议显式加入：

```gitignore
**/dist/
**/*.tsbuildinfo
```

如果后续发现某些构建工具仍会向 `src/` 产物，必须修构建配置，而不是提交产物。

### 验收

运行：

```bash
git status --short --untracked-files=all
```

确认不再出现 `packages/*/src/*.js`、`*.d.ts`、`*.js.map`。

## 6. P2：对齐 Runtime v1 结局阈值

### 问题

新 `packages/runtime/src/determine-ending.ts` 与 `docs/specs/undercover-demon-king-runtime-v1.md` 的终局条件不完全一致。

已发现差异：

- `dualRuler` 少了 `protectedInnocentsCount >= 1`。
- `dualRuler` 的 `heroTrust` 使用 `>=50`，Runtime v1 是 `>=55`。

### 风险

- 迁移后的 Node Runtime 改变结局可达性。
- QA 路线与旧 demo / Runtime v1 文档不一致。
- 后续调参无法判断差异是 bug 还是设计变更。

### 修复要求

Phase 1 应先严格迁移 Runtime v1。调参可以后续单独开文档。

请对照：

- `docs/specs/undercover-demon-king-runtime-v1.md`
- 当前 `src/app.js` 的 `determineEnding()`

修正 `packages/runtime/src/determine-ending.ts`。

### 测试要求

新增结局可达性 tests：

- `dualRuler` 必须要求 `protectedInnocentsCount >= 1`。
- `dualRuler` 必须要求 `heroTrust >= 55`。
- `redeemed`、`perfectSpy`、`victorBlamed`、`actorKing`、`absurdAscension` 与 Runtime v1 条件一致。
- 多个结局同时满足时，优先级与 Runtime v1 一致。

## 7. P3：API 响应形态可进一步收敛

### 现状

当前 API：

- `POST /api/v1/sessions` 返回 `{ sessionState }`。
- `GET /api/v1/sessions/:sessionId` 返回 `{ storedSession }`。
- `POST /api/v1/sessions/:sessionId/turns` 返回 `{ turnResult, sessionState }`。

这可以用于 Phase 1，但前端后续接入时可能需要更稳定的 `SessionSnapshot`。

### 建议

Phase 1 可以暂不阻塞，但建议后续统一：

- 创建会话返回 `SessionSnapshot`。
- 读取会话返回 `SessionSnapshot + turns`。
- 提交回合返回 `TurnResult + SessionSnapshot`。

避免前端依赖 repository 内部结构如 `processedClientTurnIds`。

## 8. 已通过验证

本次评审前已运行并通过：

```bash
pnpm check
pnpm test:runtime
pnpm check:node
pnpm test:node
```

说明：

- 旧 demo 语法检查通过。
- 旧 runtime smoke test 通过。
- Node workspace typecheck 通过。
- Node workspace tests 通过。

这些通过结果说明骨架可运行，但不覆盖上面所有规则边界。

## 9. 建议实施顺序

1. 清理 `src/` 下 TypeScript 生成产物，并补 `.gitignore`。
2. 强制 LLM `schemaVersion`。
3. 修复所有结局候选必须过 `validateEndingCandidate()`。
4. 补齐 `narrator` 和 `aslan` 角色枚举。
5. 对齐 `determineEnding()` 与 Runtime v1。
6. 补充 runtime 和 contracts tests。
7. 重新运行全部检查。

## 10. 最终验收标准

修复完成后必须满足：

- `pnpm check` 通过。
- `pnpm test:runtime` 通过。
- `pnpm check:node` 通过。
- `pnpm test:node` 通过。
- `git status --short --untracked-files=all` 中没有 `src/*.js`、`src/*.d.ts`、`src/*.js.map` 生成产物。
- 预设结局、LLM 结局候选、最终幕优先级结局都经过红线校验。
- LLM candidate 缺失或错误 schemaVersion 时不会被当作 v1 候选执行。
- Node Runtime 的核心结局阈值与 Runtime v1 文档一致。

## 11. 不做事项

本轮优化仍然不要做：

- 真实 LLM API 接入。
- 数据库持久化。
- 账号、支付、额度。
- 运营后台。
- 前端重写。
- 剧本市场。
- 将实现移回 `persona-library`。
