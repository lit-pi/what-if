# 《假如我是勇者队伍里的卧底魔王》场景判定矩阵 v1

状态：草稿，可进入本地 adapter + validator 原型  
对应基线：`docs/specs/undercover-demon-king-runtime-v1.md`  
目标：为每个场景定义自由行动的可行范围、焦点角色、即时死局和推荐状态变化。

## 1. 使用方式

实现 LLM 或本地 GM 时，每个场景先查本矩阵：

1. 当前破绽是什么。
2. 本场景最适合哪些行动分类。
3. 哪些行动属于危险但可代价成功。
4. 哪些行动必须触发灾难失败。
5. 本场景结束后应该进入哪个下一场景。

本矩阵不替代 `SCENE_TREE`，而是给自由行动和 LLM 裁决提供边界。

## 2. 通用判定

| 行动特征 | 默认裁决 |
| :--- | :--- |
| 合理解释当前破绽，且没有改变世界规则 | `success` 或 `costly_success` |
| 保护弱者、保住队友，但暴露魔族知识 | `costly_success` |
| 当众承认自己是魔王 | 非最终幕 `disaster_failure`；最终幕可进入和平/摊牌判定 |
| 杀害无辜者或俘虏灭口 | 通常 `disaster_failure` |
| 直接命令所有角色相信自己 | Runtime v1 LLM adapter 用 `disaster_failure` 或本地 fallback；`failure` 是 v1.1 目标 |
| 提出和平但不处理当前破绽 | `costly_success`，设置和平旗标但仍推进审查 |
| 离谱经营/搞钱脑洞 | `costly_success`，提高 `butterflyDeviation` |

## 3. `gate`：魔王城正面大门

破绽：阵灵识别阿斯兰并高喊魔王陛下。

焦点角色：

- 伊薇特：立刻质疑阵灵为何认主。
- 莱昂：在信任和震惊之间摇摆。
- 阿斯兰：内心慌张。

推荐行动：

| 分类 | 裁决倾向 | 状态建议 |
| :--- | :--- | :--- |
| `deceive` | `success` | `exposureRisk -3`、`heroTrust +6`、`victorMisread +5` |
| `sacrifice`/攻击阵灵 | `success` 或 `costly_success` | `heroTrust +5`、`castleIntegrity -12`、`exposureRisk +3` |
| `commandVictor` | `costly_success` | `victorMisread -10`、`exposureRisk +5` |
| `confess` | `disaster_failure` | 指定 `gate_exposure_ending` |
| `absurd` | `costly_success` | `butterflyDeviation +10`、`exposureRisk +5` |

禁止：

- 回应阵灵“平身”。
- 当众使用魔王权威开门。
- 让阵灵改口称自己为陛下的双胞胎。

转场：

- 正面突破进入 `act2_ruins`。
- 解释并走暗道进入 `act2_dungeon`。

## 4. `act2_ruins`：前庭坍塌废墟

破绽：重伤魔族小兵认出阿斯兰。

焦点角色：

- 米拉：要求救助伤员。
- 莱昂：关注阿斯兰如何对待敌方弱者。
- 维克托：暗处期待陛下救部下。

推荐行动：

| 分类 | 裁决倾向 | 状态建议 |
| :--- | :--- | :--- |
| `protect` + 暗中封口 | `success` | `priestRedemption +15`、`heroTrust +8`、`exposureRisk -2` |
| `deceive` + 绕过 | `costly_success` | `exposureRisk +6`、`heroTrust -5` |
| `commandVictor` | `success` | `victorMisread -8`、`exposureRisk +3`、`savedDemonSoldier=true` |
| `sacrifice` | `costly_success` 或 `disaster_failure` | `heroTrust -15`、`priestRedemption -20` |
| `confess` | `disaster_failure` | 指定 `ruins_arrest_ending` |

红线：

- 称呼小兵为“我的部下”。
- 让米拉眼前的重伤者被故意放弃。

转场：进入 `act3_library`。

## 5. `act2_dungeon`：地下暗黑地牢

破绽：伊薇特发现修道院名册没有阿斯兰记录。

焦点角色：

- 伊薇特：建立身份档案证据。
- 米拉：关注被囚军官生命。
- 洛克：可被收买撬锁。

推荐行动：

| 分类 | 裁决倾向 | 状态建议 |
| :--- | :--- | :--- |
| `protect` + 烧毁档案 | `success` | `priestRedemption +18`、`mageEvidence -10`、`exposureRisk -3` |
| `bribe` 洛克 | `success` | `thiefLeverage -10`、`bribedLocke=true` |
| `deceive` 档案火灾解释 | `costly_success` | `mageEvidence +8`、`contradictionCount +1` |
| `sacrifice`/灭口 | `disaster_failure` | 指定 `dungeon_rupture_ending` |
| `confess` | `disaster_failure` | `exposed` 或即时硬失败 |

红线：

- 对人类俘虏灭口。
- 当众销毁证据但没有救人理由。

转场：进入 `act3_treasury`。

## 6. `act3_library`：禁忌图书馆/符文密室

破绽：魔王真名符文与阿斯兰剑痕一致。

焦点角色：

- 伊薇特：核心压力源。
- 洛克：嘴欠指出关键证据。
- 莱昂：仍倾向相信但需要解释。

推荐行动：

| 分类 | 裁决倾向 | 状态建议 |
| :--- | :--- | :--- |
| `deceive` + 古语法解释 | `success` | `mageEvidence -15`、`heroTrust +10`、`exposureRisk -4` |
| 攻击证据 | `costly_success` | `exposureRisk +8`、`castleIntegrity -15` |
| 主动接受测试 | `costly_success` | `mageEvidence -5`、`exposureRisk +8`、`priestRedemption +5` |
| 拙劣编造 | `disaster_failure` | 指定 `library_seal_ending` |
| `confess` | `disaster_failure`，除非已强和平路线 | `exposed` |

红线：

- 连续矛盾导致 `contradictionCount >= 2`。
- 编造已灭绝法术流派并被古籍反证。

转场：进入 `act4_corridor`。

## 7. `act3_treasury`：偏殿深处地下宝库

破绽：洛克撬开魔王私房钱宝库。

焦点角色：

- 洛克：利益和把柄压力。
- 莱昂：要求队伍别沉迷财宝。
- 阿斯兰：私房钱和城防压力。

推荐行动：

| 分类 | 裁决倾向 | 状态建议 |
| :--- | :--- | :--- |
| `bribe`/假宝箱 | `success` | `thiefLeverage -15`、`castleIntegrity +15`、`exposureRisk +2` |
| `protect`/引导去神兵库 | `success` | `heroTrust +10`、`castleIntegrity +20`、`exposureRisk -2` |
| `deceive` 财宝诅咒 | `costly_success` | `mageEvidence +6`、`thiefLeverage +5` |
| 私房钱失控 | `disaster_failure` | 指定 `treasury_confess_ending` |
| `absurd` 商业计划 | `costly_success` | `butterflyDeviation +20`、`thiefLeverage -5` |

红线：

- 承认宝库属于自己。
- 为保护财宝伤害同伴或无辜者。

转场：进入 `act4_corridor`。

## 8. `act4_corridor`：近卫军决死长廊

破绽：维克托带近卫军启动自爆阵。

焦点角色：

- 维克托：忠诚误读爆发。
- 莱昂：要求保护队伍。
- 米拉：要求避免屠杀。

推荐行动：

| 分类 | 裁决倾向 | 状态建议 |
| :--- | :--- | :--- |
| `commandVictor` + 戒章暗号 | `success` | `castleIntegrity +20`、`priestRedemption +15`、`exposureRisk +4` |
| `protect` + 圣光结界 | `success` | `heroTrust +15`、`priestRedemption +10`、`exposureRisk -2` |
| `deceive` 声称敌方内讧 | `costly_success` | `mageEvidence +8`、`victorMisread +8` |
| 强杀维克托 | `disaster_failure` | 指定 `corridor_betrayal_ending` |
| `peace` 当场停战喊话 | `costly_success` | `proposedPeace=true`、`priestRedemption +10`、`exposureRisk +8` |

红线：

- 伤害维克托导致其公开喊陛下或引爆自爆阵。
- 放任近卫军与勇者队同归于尽。

转场：进入 `act5_throne`。

## 9. `act5_throne`：魔王空王座厅

破绽：王座厅雕像与阿斯兰真容一致。

焦点角色：

- 莱昂：最终信任审判。
- 伊薇特：证据链闭环。
- 米拉：和平和救赎缓冲。
- 维克托/洛克：根据路线参与背锅或商业化。

推荐行动：

| 分类 | 裁决倾向 | 状态建议 |
| :--- | :--- | :--- |
| `peace` | `success` 或 `costly_success` | `proposedPeace=true`、`peacePivoted=true`、`priestRedemption +15`、`heroTrust +10` |
| `confess` + 承担责任 | v1.1 目标；Runtime v1 自由文本仍会直接 `exposed` | `confessedIdentity=true`、`exposureRisk +20`、`priestRedemption +10` |
| `deceive` 继续装到底 | `costly_success` | `exposureRisk -5`、`mageEvidence +10` |
| `bribe`/甩锅维克托 | Runtime v1 预设可指定 `victorBlamed`；v1.1 需先过红线 validator | `betrayedVictor=true`、`victorBlamed` |
| `absurd` 主题乐园 | `success`，指定结局 | `absurdAscension` |
| 无代价要求全员臣服 | `disaster_failure` | `instantExecution` 或 `exposed` |

红线：

- 玩家要求莱昂无条件接受自己仍是魔王。
- 玩家要求伊薇特忽略证据。
- 玩家假和平但拒绝承担任何约束。

转场：进入结局判定。

## 10. 结局可达性调参重点

下一轮试玩应重点确认：

- `dualRuler` 和 `redeemed` 是否都能自然触发，是否互相覆盖过强。
- `perfectSpy` 是否需要更低暴露或更高城防路线。
- `actorKing` 是否有自然路径，还是需要给 `resolvedMajorCrisisCount` 更多触发来源。
- `absurdAscension` 当前王座选项可直达，但自然积累 `butterflyDeviation >= 100` 是否过难。
- `instantArrest` 是否太容易打断自由行动。
- 最终幕 `confess` 是否要从当前硬失败改成“承担责任式摊牌”，这个改动必须和红线 validator 一起做。

## 11. 验收标准

- 每个场景至少有 3 类自由行动能被合理裁决。
- 每个场景至少有 1 个明确红线。
- 每个场景的陷阱都能触发指定即时结局。
- 非最终幕和平行动不会直接通关。
- 最终幕至少能进入和平、甩锅、荒诞、硬失败、兜底中的 3 类。
- Runtime v1 LLM adapter 暂不输出 `failure`，直到 UI 和转场 QA 确认。
