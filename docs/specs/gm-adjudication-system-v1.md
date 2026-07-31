# 《假如我是勇者队伍里的卧底魔王》GM 裁决系统 v1

状态：草稿，可进入本地 adapter + validator 原型  
对应基线：`docs/specs/undercover-demon-king-runtime-v1.md`  
目标：把自由行动从“关键词 demo”升级为“可解释、可测、可接 LLM 的 GM 裁决规则”。

## 1. 玩家幻想

玩家应该感觉自己不是在点固定选项，而是在真的临场狡辩、救场、甩锅、谈判或搞事。系统允许自由表达，但每次行动都必须被魔王城当前破绽、队友底线和结局规则约束。

## 2. 运行时目的

GM 裁决系统负责决定：

- 玩家行动属于哪类意图。
- 行动在当前场景是否可行。
- 裁决结果是成功、代价成功、失败还是灾难失败。
- 哪些状态变化、旗标、证据和角色反应被写入历史。
- 是否触发即时结局、插入对峙或推进到下一场景。

## 3. 输入

运行时输入：

- 当前场景：`sceneId`、破绽事件、焦点角色、可用行动类型、禁止行动类型。
- 玩家行动：预设选项或自由文本。
- 当前状态：`exposureRisk`、`heroTrust`、`mageEvidence`、`priestRedemption`、`thiefLeverage`、`castleIntegrity`、`victorMisread`、`partyProgress`、`butterflyDeviation`。
- 当前旗标：救人、背锅、收买、和平、牺牲、矛盾计数等。
- 角色底线：来自 `character-pressure-and-red-lines-v1.md`。
- 结局优先级：来自 Runtime v1。

LLM 输入：

- 上述输入的裁剪版。
- 本场景可用裁决边界。
- 角色说话风格和当前压力。

## 4. 输出

GM 裁决输出：

- `actionCategory`
- `adjudication`
- `stateDelta`
- `flagUpdates`
- `triggeredRules`
- `evidenceLog`
- `focusedCharacters`
- `characterResponses`
- `narration`
- `nextSceneId`
- `endingCandidate`

其中 `stateDelta`、`flagUpdates`、`nextSceneId`、`endingCandidate` 必须经过运行时校验后才生效。

字段映射约定：

- LLM 原始响应使用 `suggestedNextSceneId` 和 `suggestedEndingKey`，表示“模型建议”。
- Validator 接受建议后，转换成本地回合数据的 `nextSceneId` 和 `endingKey`。
- GM 文档中的 `endingCandidate` 是概念字段；实现时优先使用 `suggestedEndingKey -> endingKey` 这条映射，避免新增第三套字段。

## 5. 行动分类

| 分类 | 玩家意图 | 主要影响 |
| :--- | :--- | :--- |
| `deceive` | 编造解释、转移逻辑、伪造身份 | 降低或延缓暴露，但可能增加 `mageEvidence`、`contradictionCount` |
| `protect` | 救人、挡伤、治疗、安抚 | 增加 `heroTrust`、`priestRedemption`，但可能增加暴露 |
| `sacrifice` | 灭口、放弃弱者、强行牺牲 | 短期降低风险或推进，伤害信任和救赎 |
| `bribe` | 收买洛克、用金币或情报交易 | 降低 `thiefLeverage`，可能损失城防或提高荒诞偏离 |
| `confess` | 承认身份、主动摊牌 | 高风险，只有最终幕或高救赎路线才可能转和平 |
| `peace` | 提出停战、共治、谈判 | 增加和平旗标，但会提高被审查强度 |
| `commandVictor` | 暗令、戒章、手势、魔族密语 | 可降低 `victorMisread` 或保城，但有暴露风险 |
| `absurd` | 主题乐园、公司化、搞钱经营 | 增加 `butterflyDeviation`，改变终局口味 |
| `generic` | 其他合理但不强命中的行动 | 小幅推进，小幅改变状态 |

## 6. 四档裁决

| 裁决 | 使用条件 | 状态变化范围 | 推进规则 |
| :--- | :--- | :--- | :--- |
| `success` | 行动符合场景、身份、信息与至少一个角色价值观 | 主状态 `-10` 到 `+15` | 可推进场景 |
| `costly_success` | 行动能解决当前危机，但留下证据、代价或关系裂痕 | 主状态 `-15` 到 `+20`，必须有副作用 | 可推进场景 |
| `failure` | 行动不够可行、被焦点角色识破、或试图影响太多人 | 风险类状态 `+8` 到 `+18` | v1.1 目标；Runtime v1 LLM adapter 暂不开放 |
| `disaster_failure` | 行动触碰即时底线、公开自曝、强行绕过主线或残忍破坏核心关系 | 风险类状态可 `+30` 到 `+100` | 进入即时结局或硬失败候选 |

Runtime v1 当前预设和自由行动主要使用 `success`、`costly_success`、`disaster_failure`。`failure` 已有轻量 UI 标签兜底，但在接 LLM 的第一版 schema 中仍不开放给模型，避免“普通失败但继续推进”的语义还没被完整测试。

## 7. 硬约束

- 玩家不能用一句话跳过全部场景。
- 玩家不能要求所有角色无条件相信自己。
- 玩家不能直接修改数值或旗标。
- 玩家不能让 LLM 生成不存在的场景或结局 key。
- 玩家不能在非最终幕通过“我其实想和平”直接进入最好结局，只能设置和平路线旗标并继续接受审查。
- 自由行动最多显著影响 1-2 个焦点角色，其余角色只做轻反应。
- 每回合至少保留一个新的压力来源：暴露、证据、城防、把柄、维克托误读、信任裂痕或荒诞偏离。

## 8. 裁决流程

1. 读取当前场景的破绽和焦点角色。
2. 将玩家行动归类为 1 个主分类，必要时附加 1 个副分类。
3. 检查是否触碰场景即时死局。
4. 检查是否触碰角色红线。
5. 根据行动分类和场景适配度给出四档裁决。
6. 生成候选 `stateDelta` 和 `flagUpdates`。
7. 运行时裁剪数值到 `0-100`。
8. 运行时执行即时结局与终局优先级。
9. 若在最终幕进入结局判定，先执行红线拦截，再允许好结局。
10. 输出旁白、角色反应和本回合因果记录。

## 9. 状态变化准则

状态变化应保持玩家可学习：

- 成功行动不要只奖励，也要保留下一幕压力。
- 代价成功必须有清晰代价。
- 欺骗类行动不应无限降低风险，连续欺骗会提高 `contradictionCount`。
- 保护类行动通常提高信任和救赎，但在魔族对象上会增加暴露风险。
- 牺牲类行动短期有效，长期伤害和平结局。
- 维克托相关行动必须同时考虑保城和暴露。

建议默认幅度：

| 影响强度 | 数值范围 |
| :--- | :--- |
| 轻微 | `1-5` |
| 标准 | `6-12` |
| 明显 | `13-20` |
| 危机 | `21-35` |
| 即时死局 | `75-100` 或指定 `endingKey` |

## 10. AI 边界

LLM 可以建议：

- 行动分类。
- 裁决理由。
- 角色对白。
- 候选状态变化。
- 候选触发规则。
- 证据描述。

运行时必须决定：

- 最终数值裁剪。
- 是否接受候选旗标。
- 场景推进。
- 结局 key。
- 角色、状态、旗标枚举是否合法。
- 是否降级到本地关键词裁决。
- 是否允许 `failure`；Runtime v1 LLM adapter 默认不允许。

## 11. UI 反馈

每回合至少展示：

- 裁决结果：成功、代价成功、失败、灾难失败。
- 1-4 个主要状态变化。
- 1 条 GM 旁白。
- 1-3 个角色反应。
- 如命中红线，显示对峙或警告语气。
- 如进入结局，结算页解释“最大风险、最大转机、最大代价”。

## 12. 边界情况

- 多个结局同时满足：按 Runtime v1 结局优先级。
- LLM 输出非法 key：丢弃非法字段，使用本地 fallback。
- LLM 输出过大 delta：运行时裁剪并记录 `delta_clamped`。
- 玩家输入空文本：不调用 LLM，提示重新输入。
- 玩家输入极短模糊文本：使用 `generic`，小幅代价推进。
- 玩家试图直接杀死队友或毁灭世界：通常 `disaster_failure`。
- 玩家提出和平但曾牺牲无辜：和平可以推进，但不能直接进入最好结局。
- 王座预设选项若带 `endingKey`，实现红线 validator 后仍必须经过 `validateEndingCandidate()`，不能绕过角色底线。

## 13. 调参旋钮

- 各行动分类的默认状态变化范围。
- `exposureRisk >= 75` 是否立即硬失败。
- `mageEvidence >= 65` 是否立即逮捕，或改为强制对峙一轮。
- 米拉缓冲是否每局只能触发一次。
- 洛克勒索是否会插入额外选择。
- 维克托误读是否会插入灾难性支线。
- `failure` 何时从 v1.1 目标进入真实 LLM schema。

## 14. 商业化 Node Runtime 规则细化

正式 Node Runtime 中，GM 裁决应拆成可配置、可测试的 6 层规则。每一层都要把命中情况写入 `decisionTrace`，方便 QA、运营后台和结算页解释。

### 14.1 回合输入归一化

每个回合先归一化成统一输入：

```json
{
  "sessionId": "ses_...",
  "turnIndex": 3,
  "scenarioId": "undercover-demon-king",
  "scenarioVersion": "1.0.0",
  "sceneId": "act3_library",
  "action": {
    "type": "free_text",
    "presetActionId": null,
    "text": "我用古语解释这个剑痕是封印反噬"
  },
  "statsBefore": {},
  "flagsBefore": {},
  "recentTurns": []
}
```

归一化规则：

- 空文本不进入 LLM，返回 `input_empty`。
- 自由文本长度默认限制为 200 个中文字符；超出部分截断并记录 `input_truncated`。
- 预设行动必须存在于当前场景，否则拒绝并返回 `invalid_preset_action`。
- 同一 `clientTurnId` 重复提交时返回第一次结算结果，不重复应用状态。

### 14.2 行动分类评分

自由行动先由 LLM 或本地分类器给出候选 `actionCategory`，Runtime 再按当前场景校验。

分类评分使用三项：

| 评分项 | 范围 | 含义 |
| :--- | ---: | :--- |
| `sceneFit` | 0-3 | 是否处理当前破绽 |
| `characterFit` | 0-3 | 是否符合至少一个焦点角色价值观 |
| `riskTouch` | 0-3 | 是否触碰暴露、证据、红线或硬失败 |

默认裁决：

| 条件 | 裁决 |
| :--- | :--- |
| `sceneFit >= 2` 且 `characterFit >= 2` 且 `riskTouch <= 1` | `success` |
| `sceneFit >= 1` 且没有命中红线 | `costly_success` |
| 没有处理当前破绽，但未触碰硬失败 | `costly_success`，并追加风险 |
| 命中场景即时死局或角色硬红线 | `disaster_failure` |

Runtime v1 仍不开放普通 `failure` 给 LLM。等 UI 能清晰展示“失败但不推进”后，再作为 v1.1 引入。

### 14.3 场景条件校验

每个场景配置：

```json
{
  "allowedCategories": ["deceive", "protect", "generic"],
  "forbiddenCategories": ["confess"],
  "legalNextSceneIds": ["act4_corridor"],
  "allowedEndingKeys": ["library_seal_ending", "instantArrest", "exposed"],
  "hardFailureRules": []
}
```

校验顺序：

1. `actionCategory` 不在 `allowedCategories` 中：降级为 `generic` 或 fallback。
2. 命中 `forbiddenCategories`：按场景配置转 `disaster_failure` 或 fallback。
3. `suggestedNextSceneId` 不在 `legalNextSceneIds`：丢弃，并记录 `invalid_scene_transition`。
4. `suggestedEndingKey` 不在 `allowedEndingKeys`：丢弃，并记录 `ending_not_allowed_in_scene`。
5. 非最终幕不能触发终局结局，只能触发场景专属即时结局或 Runtime 硬失败兜底。

### 14.4 角色压力合成

每回合最多选择 3 个焦点角色：

1. 当前场景固定焦点角色。
2. 命中阈值的压力角色。
3. 被玩家行动直接影响的角色。

优先级：

| 优先级 | 条件 |
| :--- | :--- |
| P0 | 命中红线或即时对峙 |
| P1 | 当前破绽的核心角色 |
| P2 | 数值接近阈值的角色 |
| P3 | 适合补充情绪反馈的角色 |

LLM 可以写对白，但 Runtime 必须决定谁必须发言、谁不能缺席。

### 14.5 状态变化合成

最终 `stateDelta` 来自三部分：

1. `baseDelta`：场景 + 行动分类默认变化。
2. `pressureDelta`：角色压力或红线追加变化。
3. `llmCandidateDelta`：LLM 候选变化，只能在允许范围内微调。

合成规则：

- 单项 LLM 候选 delta 裁剪到 `-30..+30`。
- 最终状态裁剪到 `0..100`。
- 同一回合最多重点展示 4 个状态变化。
- 若 LLM 候选与场景默认方向冲突，以场景默认方向为准。例如当众承认身份不能降低 `exposureRisk`。

### 14.6 决策追踪 `decisionTrace`

服务端每回合应输出内部追踪：

```json
{
  "matchedRules": ["scene.act3_library.deceive", "character.ivette.evidence_pressure"],
  "rejectedCandidateFields": ["suggestedNextSceneId"],
  "fallbackUsed": false,
  "llmUsed": true,
  "endingCandidateSource": "runtime_threshold",
  "stateClampEvents": ["mageEvidence:+44->+30"]
}
```

普通玩家不一定看到完整 `decisionTrace`，但结算页和运营后台应使用它解释因果。

## 15. 验收标准

- 同一输入、同一状态、同一场景下，运行时最终结果确定。
- LLM 挂掉时仍可用本地裁决玩完整局。
- 至少 6 个结局可通过文档化路线到达。
- 任一硬失败都能在结算页解释原因。
- 自由行动不会绕过场景图或直接修改结局。
- 下个实现 agent 先交付本地 adapter + validator，再接真实 LLM。
