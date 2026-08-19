# LLM Adapter 与 Validator 评审优化计划

状态：待实施  
日期：2026-07-25  
范围：`src/app.js`、`scripts/runtime-smoke-test.js`  
背景：其他 agent 已完成本地 LLM 同构 adapter、`validateAdjudication`、`validateEndingCandidate`、`verifyCharacterRedLines`，并进一步接入了真实 Doubao LLM API 在线裁决。本报告基于评审结果整理下一轮优化任务。

## 1. 评审结论

当前实现已经完成了第一阶段机制基线的大部分内容：

- 自由行动已改造成 LLM v1 同构 adapter。
- 已实现 `validateAdjudication()`。
- 已实现 `validateEndingCandidate()` 和 `verifyCharacterRedLines()`。
- 已增加 runtime smoke test 覆盖 schema、非法 key、delta 裁剪、`failure` 降级、红线拦截和 fallback。
- `pnpm check` 与 `pnpm test:runtime` 当前通过。

但实现中出现了 3 个需要先修的阻塞风险：

1. 静态前端直接接真实 Doubao API，会暴露 API key 或导致真实接入不可用。
2. Validator 没有限制 `suggestedNextSceneId` 的合法转场，LLM 可跨场景跳关。
3. Validator 没有限制 `suggestedEndingKey` 的可触发场景，LLM 可在非最终幕提前结束游戏。

结论：下一阶段先做“安全边界与 validator 收紧”，不要继续扩展真实 LLM 能力。

## 2. 优先级

### P0：禁用前端真实 LLM 直连

问题：

- 当前 `src/app.js` 中 `LLM_CONFIG` 会读取 `window.__LLM_API_KEY__` 并向 Doubao API 发起浏览器请求。
- 静态 Web 页面无法安全保存服务端密钥。
- 如果不注入 key，则真实 LLM 实际不会工作；如果注入 key，则用户和 DevTools 都能看到。
- 这与本仓库“零依赖静态原型，先不接真实 LLM”的阶段目标冲突。

要求：

- 移除或默认禁用浏览器直连真实 LLM。
- `requestLLMAdjudication()` 默认只使用本地 adapter。
- 保留 `customFetcher` 作为测试注入点。
- 如果保留真实 API 代码，必须放在明确的“未来后端代理”注释后，不在浏览器路径启用。
- 不在 `window`、HTML、源码或文档示例中要求注入真实 API key。

建议策略：

```text
Runtime v1:
- local adapter only
- customFetcher only for tests
- real LLM requires future server/proxy, not static frontend
```

验收：

- 浏览器默认不会向外部 LLM API 发请求。
- 没有 `window.__LLM_API_KEY__` 作为推荐接入方式。
- `pnpm test:runtime` 仍能通过 customFetcher 测试模拟 LLM 成功和失败。

## 3. P0：限制 LLM 场景转场

问题：

- `validateAdjudication()` 目前只检查 `candidate.suggestedNextSceneId` 是否存在于 `SCENE_TREE`。
- 这允许 LLM 从 `gate` 直接返回 `act5_throne`，绕过剧本主线。
- `buildLLMPromptContext()` 虽然给了 `allowedCategories`，但 validator 没有真正执行场景转场规则。

要求：

- 增加 `ALLOWED_TRANSITIONS` 或从 `SCENE_TREE[currentSceneKey].choices` 推导合法转场。
- `suggestedNextSceneId` 必须满足：
  - 是当前场景任一预设选项的 `nextSceneId`；或
  - 当前场景无下一幕时为 `null`；或
  - 是明确允许的 fallback 转场。
- 非法转场不得只记录 error 后继续使用，应丢弃 `nextSceneId` 并 fallback。

建议实现：

```javascript
function getAllowedNextSceneIds(sceneKey) {
  const scene = SCENE_TREE[sceneKey];
  if (!scene) return [];
  return [...new Set((scene.choices || []).map(choice => choice.nextSceneId).filter(Boolean))];
}
```

验收测试：

- 从 `gate` 返回 `act5_throne` 必须 validation 失败或 fallback。
- 从 `gate` 返回 `act2_ruins` / `act2_dungeon` 可以通过。
- 从 `act5_throne` 返回任何下一场景都应被拒绝。

## 4. P0：限制 LLM 提前触发结局

问题：

- `validateAdjudication()` 目前只检查 `suggestedEndingKey` 是否存在，并对部分好结局执行红线检查。
- 只要 key 存在，LLM 就可以在第一幕返回 `stalemate`、`victorBlamed`、`absurdAscension` 等结局。
- `applyTurn()` 看到 `endingKey` 会直接进入结果页。

要求：

- 增加结局触发阶段限制。
- 非最终幕只允许：
  - 当前场景专属即时结局。
  - Runtime 硬失败兜底：`instantExecution`、`instantArrest`、`exposed`。
- 最终幕 `act5_throne` 才允许终局结局候选。
- 带 `endingKey` 的预设选项也应经过同一套 `validateEndingCandidate()`。

建议配置：

```javascript
const SCENE_ALLOWED_ENDINGS = {
  gate: ['gate_exposure_ending', 'instantExecution', 'instantArrest', 'exposed'],
  act2_ruins: ['ruins_arrest_ending', 'instantExecution', 'instantArrest', 'exposed'],
  act2_dungeon: ['dungeon_rupture_ending', 'instantExecution', 'instantArrest', 'exposed'],
  act3_library: ['library_seal_ending', 'instantExecution', 'instantArrest', 'exposed'],
  act3_treasury: ['treasury_confess_ending', 'instantExecution', 'instantArrest', 'exposed'],
  act4_corridor: ['corridor_betrayal_ending', 'instantExecution', 'instantArrest', 'exposed'],
  act5_throne: [
    'instantExecution',
    'instantArrest',
    'exposed',
    'castleLost',
    'dualRuler',
    'redeemed',
    'perfectSpy',
    'victorBlamed',
    'actorKing',
    'absurdAscension',
    'stalemate'
  ],
};
```

验收测试：

- `validateAdjudication()` 在 `gate` 收到 `suggestedEndingKey: "stalemate"` 必须拒绝。
- `validateAdjudication()` 在 `gate` 收到 `suggestedEndingKey: "gate_exposure_ending"` 可以通过。
- `validateAdjudication()` 在 `act5_throne` 收到 `suggestedEndingKey: "dualRuler"` 可以进入红线校验。

## 5. P1：红线覆盖 `victorBlamed`

问题：

- 当前 `GOOD_ENDINGS` 包含 `dualRuler`、`redeemed`、`perfectSpy`、`actorKing`、`absurdAscension`。
- `victorBlamed` 不在红线校验范围内。
- 这会让王座甩锅继续绕过洛克把柄、莱昂信任等底线。

要求：

- `victorBlamed` 应进入 `validateEndingCandidate()` 的结局条件校验。
- 至少检查：
  - `thiefLeverage < 70`
  - `heroTrust >= 40`
  - `exposureRisk < 75`
  - `betrayedVictor === true` 或本回合明确设置背锅旗标
- 如果不满足，回退到 `stalemate`、`exposed` 或 `instantArrest`。

验收测试：

- `thiefLeverage >= 70` 且未收买洛克时，`victorBlamed` 被阻断。
- `heroTrust < 40` 时，`victorBlamed` 被阻断。
- 条件满足时，王座甩锅仍可进入 `victorBlamed`。

## 6. P1：统一 delta 裁剪范围

问题：

- Prompt 要求 LLM 单次 delta 在 `-30..+30`。
- `validateAdjudication()` 实际裁剪到 `-50..+50`。
- 由于 Runtime 硬失败阈值是 `exposureRisk >= 75`、`mageEvidence >= 65`，`+50` 很容易让自由行动一回合硬失败。

要求：

- Runtime v1 validator 对 LLM 候选 delta 使用 `-30..+30`。
- 如需要更大变化，应由预设陷阱选项或 Runtime 自己指定，不由 LLM 候选直接给出。

验收测试：

- LLM 返回 `exposureRisk: 250` 时，sanitized delta 应为 `30`。
- LLM 返回 `heroTrust: -99` 时，sanitized delta 应为 `-30`。

## 7. P1：真实请求超时后中止 fetch

问题：

- `requestLLMAdjudication()` 使用 `Promise.race` 超时 fallback。
- 但实际 `fetch` 没有被 AbortController 中止。
- 如果未来接真实计费 API，超时后请求仍可能在后台继续执行。

要求：

- 如果保留真实 API 调用，必须使用 `AbortController`。
- 超时后 abort 请求，再 fallback。
- Runtime v1 如果回退为本地 adapter，则无需实现真实 fetch。

验收：

- 超时后 fallback。
- 超时后不会继续等待或重复应用结果。

## 8. P2：Prompt 与 Validator 对齐

问题：

- Prompt context 提供 `allowedCategories` / `forbiddenCategories`。
- System prompt 没明确要求必须遵守。
- Validator 也没有强制校验 actionCategory 是否允许。

要求：

- Validator 根据当前场景拒绝 `forbiddenCategories`。
- 对不在 `allowedCategories` 的 actionCategory 降级为 `generic` 或 fallback。
- System prompt 增加一句：必须遵守当前场景 `allowedCategories` / `forbiddenCategories`。

验收测试：

- `gate` 场景中 LLM 返回 `confess` 应被拒绝或转为本地硬失败路径，而不能当作普通合法候选。
- 非最终幕返回 `peace` 不直接通关，只能作为带代价推进。

## 9. 测试补充清单

在 `scripts/runtime-smoke-test.js` 中新增或补充：

- 非法跨场景转场：
  - `gate -> act5_throne` 拒绝。
  - `act2_ruins -> act3_treasury` 拒绝。
- 合法分支转场：
  - `gate -> act2_ruins` 通过。
  - `gate -> act2_dungeon` 通过。
- 非最终幕终局：
  - `gate + stalemate` 拒绝。
  - `act3_library + dualRuler` 拒绝。
- 场景专属即时结局：
  - `gate + gate_exposure_ending` 通过。
  - `act4_corridor + corridor_betrayal_ending` 通过。
- 王座结局红线：
  - `act5_throne + dualRuler` 在低信任时阻断。
  - `act5_throne + victorBlamed` 在高 `thiefLeverage` 时阻断。
- delta 范围：
  - 候选 `+250` 裁为 `+30`。
  - 候选 `-99` 裁为 `-30`。
- fallback：
  - 非法 schema fallback。
  - LLM 超时 fallback。
  - LLM 返回非 JSON fallback。

## 10. 建议实施顺序

1. 先禁用前端真实 LLM 直连，保留本地 adapter 与 customFetcher。
2. 增加场景转场 validator。
3. 增加结局触发阶段 validator。
4. 将 `victorBlamed` 纳入结局条件校验。
5. 统一 delta 裁剪为 `-30..+30`。
6. 补齐 smoke tests。
7. 跑 `pnpm check` 与 `pnpm test:runtime`。

## 11. 不做事项

本轮不要做：

- 不要引入 React、Vite、后端服务或账号系统。
- 不要把实现移回 `persona-library`。
- 不要在静态前端保存或注入真实 API key。
- 不要新增剧本场景或结局 key。
- 不要扩大 UI 改版范围。

## 12. 交付标准

本优化完成后，应满足：

- 默认运行完全本地、零依赖、无外部 API 调用。
- LLM 候选不能跳关、不能提前终局、不能新增 key。
- 红线 validator 能阻断主要好结局和 `victorBlamed` 的明显违规路径。
- 冒烟测试覆盖 validator 的关键安全边界。
- `pnpm check` 和 `pnpm test:runtime` 通过。
