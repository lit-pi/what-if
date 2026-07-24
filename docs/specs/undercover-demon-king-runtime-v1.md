# 《假如我是勇者队伍里的卧底魔王》Runtime v1 规格

状态：已实现基线  
对应代码：`src/app.js`  
用途：冻结当前高保真 demo 的真实运行时，作为后续 QA、调参、LLM 裁决和 Silicon Factory 反馈的共同基准。

## 1. 基线说明

当前 Runtime v1 以 `src/app.js` 的可玩 demo 为准。旧文档中出现过 6 幕、7 幕、9 幕等不同表述；在 MVP 1.0 冻结前，统一按“5 个 Act、7 个可达场景节点、17 个结局对象”描述。

这不是最终世界观剧本全集，而是第一个可验证的轻量运行时切片。后续如要扩展幕数，应先更新本文档，再调整代码和 QA 路线。

## 2. 玩家幻想

玩家是伪装成圣骑士的魔王阿斯兰，跟着勇者队打进自己的魔王城。每一幕都发生一个会暴露身份的破绽，玩家必须在“保住身份、保住城堡、保住同伴感情、保住魔族部下”之间做取舍。

## 3. 场景图

| Act | 场景 key | 场景 | 下一步 |
| :--- | :--- | :--- | :--- |
| 1 | `gate` | 魔王城正面大门 | 进入 `act2_ruins` 或 `act2_dungeon`，陷阱触发即时结局 |
| 2A | `act2_ruins` | 前庭坍塌废墟 | 进入 `act3_library`，陷阱触发即时结局 |
| 2B | `act2_dungeon` | 地下暗黑地牢 | 进入 `act3_treasury`，陷阱触发即时结局 |
| 3A | `act3_library` | 禁忌图书馆/符文密室 | 进入 `act4_corridor`，陷阱触发即时结局 |
| 3B | `act3_treasury` | 偏殿深处地下宝库 | 进入 `act4_corridor`，陷阱触发即时结局 |
| 4 | `act4_corridor` | 近卫军决死长廊 | 进入 `act5_throne`，陷阱触发即时结局 |
| 5 | `act5_throne` | 魔王空王座厅 | 进入最终结算或指定结局 |

自由行动默认沿当前场景第一个预设选项的 `nextSceneId` 推进；如果当前场景没有下一幕，则进入终局判定。

## 4. 状态字段

所有数值状态由运行时裁剪到 `0-100`。

| key | 中文名 | 初始值 | Runtime v1 用途 |
| :--- | :--- | ---: | :--- |
| `exposureRisk` | 暴露风险 | 25 | 身份怀疑强度，`>=75` 可触发硬失败 |
| `heroTrust` | 勇者信任 | 72 | 莱昂是否愿意相信或放过玩家 |
| `mageEvidence` | 法师证据 | 34 | 伊薇特证据链强度，`>=65` 可触发硬失败 |
| `priestRedemption` | 牧师救赎 | 58 | 米拉是否愿意缓冲冲突、支持和平 |
| `thiefLeverage` | 盗贼把柄 | 10 | 洛克是否握有交易筹码 |
| `castleIntegrity` | 魔王城防 | 85 | 魔王城是否保得住，`<=0` 可触发城在人亡 |
| `victorMisread` | 维克托误解 | 32 | 副官脑补压力和灾难性救援倾向 |
| `partyProgress` | 推进进度 | 10 | 队伍抵达王座厅的进度 |
| `butterflyDeviation` | 蝴蝶偏离 | 0 | 荒诞路线强度，`>=100` 可触发荒诞飞升 |

## 5. 旗标与计数器

Runtime v1 显式记录：

- `savedDemonSoldier`
- `betrayedVictor`
- `bribedLocke`
- `acceptedPurification`
- `confessedIdentity`
- `proposedPeace`
- `peacePivoted`
- `commandVictorSuccess`
- `raidedArmory`
- `foundForbiddenScroll`
- `subduedBloodArray`
- `freedDungeonCaptive`
- `protectedInnocentsCount`
- `sacrificedInnocentsCount`
- `contradictionCount`
- `majorLieCount`
- `resolvedMajorCrisisCount`
- `miraBufferedCrisis`

注意：不是所有旗标都已被当前 UI 路线充分使用。MVP 1.0 的标准不是“全部系统完整”，而是“已使用旗标可解释，未使用旗标不影响确定性结局”。

## 6. 自由行动裁决

当前自由行动是本地关键词分类器，不调用后端或 LLM。

| 分类 | 触发关键词示例 | 裁决倾向 |
| :--- | :--- | :--- |
| `confess` | 魔王、身份、坦白、承认、摊牌 | 灾难失败，进入 `exposed` |
| `peace` | 停战、和平、谈判、共治、条约 | 成功，设置和平路线旗标 |
| `deceive` | 撒谎、法术、流派、古籍、伪造 | 代价成功，增加矛盾和证据 |
| `protect` | 保护、救、治疗、守护、安抚 | 成功，提升信任和救赎 |
| `sacrifice` | 杀、牺牲、灭口、放弃、处决 | 代价成功，伤害信任和救赎 |
| `commandVictor` | 维克托、暗号、传令、戒章 | 成功，降低副官误解 |
| `bribe` | 收买、金币、宝箱、交易、钱 | 成功，降低盗贼把柄 |
| `absurd` | 旅游、公司、董事长、经营、搞钱 | 代价成功，增加荒诞偏离 |
| `generic` | 其他输入 | 代价成功，小幅推进 |

LLM 后续可以替换“分类与叙述生成”，但不能直接决定数值裁剪、结局优先级或跳过场景图。

## 7. 结局优先级

回合结算后立即检查：

1. 选择自带 `endingKey`：直接进入该指定结局。
2. `adjudication === "disaster_failure"`：进入 `instantExecution`。
3. `exposureRisk >= 75` 或 `mageEvidence >= 65`：进入 `instantArrest`。
4. 若没有即时结局，继续当前场景结果展示与转场。

Runtime v1 还没有完整红线 validator。下一阶段实现 `validateEndingCandidate()` 后，带 `endingKey` 的王座选项也需要经过角色底线校验。

终局 `determineEnding(stats, flags)` 的优先级：

1. `exposureRisk >= 75` 且不满足和平缓冲：`exposed`
2. `castleIntegrity <= 0` 且未转和平：`castleLost`
3. 和平提案、牧师救赎、勇者信任、证据未爆、保护弱者：`dualRuler`
4. 主动承认或提出和平、救赎与信任足够、没有牺牲无辜：`redeemed`
5. 暴露低、信任高、证据低、城防稳：`perfectSpy`
6. 已嫁祸维克托、暴露未爆、盗贼把柄可控、信任不低：`victorBlamed`
7. 暴露中高但还能圆、信任未崩、至少化解一次重大危机：`actorKing`
8. 蝴蝶偏离 `>=100`：`absurdAscension`
9. 兜底：`stalemate`

## 8. 结局对象

即时/硬失败：

- `gate_exposure_ending`
- `ruins_arrest_ending`
- `dungeon_rupture_ending`
- `library_seal_ending`
- `treasury_confess_ending`
- `corridor_betrayal_ending`
- `instantExecution`
- `instantArrest`
- `exposed`
- `castleLost`

终局/变体：

- `dualRuler`
- `redeemed`
- `perfectSpy`
- `victorBlamed`
- `actorKing`
- `absurdAscension`
- `stalemate`

## 9. MVP 1.0 冻结标准

- 所有场景可从开局按文档路线到达。
- 所有预设选项的 `nextSceneId` 指向存在的场景或为空。
- 所有 `endingKey` 指向存在的结局对象。
- 所有 `ENDINGS.xxx` 引用都存在。
- 所有图片资源存在。
- `pnpm check` 与 `pnpm test:runtime` 通过。
- 人工至少跑通一条普通结局、一条和平结局、一条即时死局。

## 10. 下一阶段建议

先不要接真实 LLM。下一阶段应先完成 MVP 1.0 QA 冻结：

1. 用本文档统一口径，暂时不再扩写幕数。
2. 按 QA 计划跑通分支和结局。
3. 调整数值阈值，让至少 6 个结局可被玩家有意触达。
4. 先实现本地自由行动 JSON adapter、validator 与 fallback。
5. 再接真实 LLM 或 Silicon Factory agent。
