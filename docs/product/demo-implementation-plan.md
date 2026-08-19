# 卧底魔王玩法 Demo 实施文档

## 1. 文档目的

本文档用于指导其他 agent 在 `lit-pi/what-if` 独立仓库内开发一个**零后端、零依赖、可点击可玩**的玩法 Demo。

这个 Demo 的目标不是验证最终技术架构，也不是接入 Silicon Factory / Persona Library，而是先验证：

- 玩家是否能快速理解“我是卧底魔王”的身份困境。
- 六幕流程是否能形成连续压力。
- 预设行动和自由行动是否能带来可感知后果。
- 状态变化、角色反应和结局解释是否足够清楚。
- 这个玩法是否值得继续投入后端、LLM 和上游人格系统。

## 2. 项目边界

开发位置：

- 仓库：`lit-pi/what-if`
- 路径：`/Users/coding-pi/Documents/Workspaces/Main/Lit-Pi/what-if`

必须保持：

- 不回到 `persona-library` 改实现。
- 不引入 React、Vite、后端服务、账号系统或构建工具。
- 不接真实 LLM。
- 不接 Silicon Factory。
- 不新增依赖。
- 继续使用 `index.html`、`src/app.js`、`src/styles.css`。

本地预览：

```bash
pnpm dev
```

语法检查：

```bash
pnpm check
```

修改 `src/app.js` 后必须运行 `pnpm check`。

## 3. 当前原型状态

当前原型已经具备：

- 单页静态入口。
- 六幕场景列表。
- 当前场景标题、视觉描述、场景目标。
- 部分状态展示。
- 焦点角色展示。
- 预设行动按钮。
- 自由行动输入框。

当前缺少：

- 真正的“开始游玩”入口。
- 回合推进。
- 点击行动后的裁决结果。
- 状态实际变化。
- 状态变化前后对比。
- 旗标记录。
- 角色反应文本。
- 行动历史 / 因果日志。
- 第六幕后结局判定。
- 结算页。
- 重新开始。

所以本次开发应在现有壳上继续，不要推倒重做技术栈。

## 4. Demo 成功标准

这个 Demo 完成后，玩家应能：

1. 打开页面后看到剧本入口，而不是文档说明页。
2. 点击开始，进入第一幕。
3. 每一幕选择一个预设行动，或输入自由行动提交。
4. 每次行动后看到：
   - GM 裁决。
   - 叙事结果。
   - 状态变化。
   - 角色反应。
   - 触发的旗标或事件。
5. 自动推进到下一幕。
6. 第六幕后进入结算页。
7. 看到确定性结局。
8. 看到 3 条“命运因果”。
9. 点击重新开始，回到初始状态。

最小可验收路径：

- 从第一幕到第六幕至少可完整跑通一次。
- 至少 6 个结局可通过不同选择有意触发。
- 自由行动不会报错，也不会跳过完整流程。
- 移动端宽度下主要内容不互相遮挡。

## 5. 核心体验目标

玩家的情绪曲线应是：

1. **开局偷感**：我太熟悉魔王城了，但不能表现出来。
2. **第一次被查**：伊薇特发现黑色圣光，身份开始危险。
3. **道德摇摆**：魔族小兵认出我，我救不救？
4. **交易压力**：洛克偷到密令，秘密变成筹码。
5. **灾难失控**：维克托可能救我，也可能当众喊破身份。
6. **最终摊牌**：王座厅里所有因果汇总成结局。

Demo 不需要复杂 AI，但必须让玩家感到：

- 每个选择都有代价。
- 队友不是背景板。
- 状态条不是装饰。
- 结局不是随机给的。

## 6. 页面结构

建议用一个单页应用状态机实现以下 3 个视图。

### 6.1 开始视图

目的：让玩家在一分钟内理解 premise，并开始 Demo。

必须包含：

- 剧本标题：`假如我是勇者队伍里的卧底魔王`
- 一句话钩子：
  `你是魔王本人，却伪装成圣骑士混进勇者队。现在队伍已经打到你的魔王城门口。`
- 当前身份卡：
  - 公开身份：流浪圣骑士“阿斯兰”
  - 真实身份：第七代魔王“夜冠之主”
- 核心困境三条：
  - 不能让勇者队发现你就是魔王。
  - 不能让勇者队拆掉你的魔王城。
  - 不能让维克托过度脑补毁掉潜伏。
- 开始按钮：`开始潜伏`

可选：

- 模式按钮暂时只保留一个：`Demo 模式`
- 不做剧本选择页，因为 MVP 只验证第一个剧本。

### 6.2 游玩视图

目的：承载六幕回合制体验。

推荐信息层级：

1. 顶部：当前幕数、场景标题、推进进度。
2. 主舞台：场景叙述 / 上回合结果 / 插入事件。
3. 状态区：展示当前场景最重要的 4-5 个状态。
4. 焦点角色区：展示本幕 2-3 个主要施压角色。
5. 行动区：预设行动卡 + 自由行动输入。
6. 结果区：提交行动后展示本回合裁决、状态变化和角色反应。
7. 历史入口：可折叠查看已经发生的关键因果。

移动端优先：

- 单列布局。
- 行动区靠近屏幕下方。
- 状态区不要展示过多字段，默认展示当前场景重点状态。
- 状态变化用 `+8`、`-5` 这种明确数字表达。
- 角色反应控制在 1-2 句，不要长篇小说。

桌面端可以保留三栏结构：

- 左侧：六幕进度。
- 中间：主舞台和行动区。
- 右侧：状态、角色、日志。

### 6.3 结算视图

目的：让玩家理解“为什么是这个结局”，并愿意重玩。

必须包含：

- 结局标题。
- 结局类型标签，例如：卧底 / 和平 / 硬失败 / 荒诞 / 兜底。
- 结局文案。
- 最终状态摘要。
- 3 条命运因果：
  - 最大风险来源。
  - 最大转机。
  - 最大代价。
- 重新开始按钮。

可选：

- 简易路线回放。
- 达成条件展示。
- 其他可能结局提示。

## 7. 核心数据结构建议

全部数据可以先写在 `src/app.js` 内。为保持轻量，不需要拆文件。

### 7.1 应用状态

建议维护：

```js
const appState = {
  view: 'start', // start | play | result
  currentSceneIndex: 0,
  stats: {},
  flags: {},
  history: [],
  lastTurn: null,
  ending: null,
};
```

### 7.2 初始状态

使用剧本规格中的稳定 key：

```js
const initialStats = {
  exposureRisk: 25,
  heroTrust: 72,
  mageEvidence: 34,
  priestRedemption: 58,
  thiefLeverage: 10,
  castleIntegrity: 85,
  victorMisread: 32,
  partyProgress: 10,
  butterflyDeviation: 0,
};
```

初始 flags：

```js
const initialFlags = {
  savedDemonSoldier: false,
  betrayedVictor: false,
  bribedLocke: false,
  acceptedPurification: false,
  confessedIdentity: false,
  proposedPeace: false,
  peacePivoted: false,
  protectedInnocentsCount: 0,
  sacrificedInnocentsCount: 0,
  contradictionCount: 0,
  majorLieCount: 0,
  resolvedMajorCrisisCount: 0,
};
```

所有数值状态必须裁剪到 `0-100`。

### 7.3 场景数据

每一幕建议包含：

```js
{
  id: 'act-01-gate',
  act: 1,
  title: '第一幕：城门前的安静',
  premise: '魔王城大门半开，城内传来三短一长的号角。',
  pressure: '你很熟悉这里，但不能表现得太熟。',
  focusStats: ['exposureRisk', 'heroTrust', 'victorMisread', 'butterflyDeviation'],
  focusCharacters: ['leon', 'ivette', 'victor'],
  choices: [
    {
      id: 'scout-first',
      label: '劝队伍先侦查',
      intent: '拖慢推进，同时保持战术合理性。',
      adjudication: 'success',
      delta: {
        exposureRisk: -3,
        heroTrust: 4,
        victorMisread: 5,
        partyProgress: 12
      },
      flags: {},
      narration: '你把拖延包装成谨慎战术，莱昂接受了建议。',
      reactions: [...]
    }
  ]
}
```

### 7.4 回合结果

每次玩家行动后生成：

```js
{
  sceneId: 'act-01-gate',
  actionType: 'preset', // preset | free
  actionLabel: '劝队伍先侦查',
  adjudication: 'success',
  narration: '...',
  stateDelta: {},
  stateAfter: {},
  flagUpdates: {},
  focusedCharacters: [],
  reactions: [],
  triggeredRules: [],
  insertedEvent: null
}
```

## 8. 预设行动设计

每一幕至少 4 个预设行动。

每个预设行动必须满足：

- 有明确玩家意图。
- 至少影响 2 个状态。
- 至少带来 1 个角色反应。
- 不能是纯好选项。
- 至少有一个隐藏代价或后续影响。

建议每幕行动结构：

1. 稳妥伪装类：降低暴露，但可能损失城防或提高维克托误解。
2. 冒险救场类：提升信任或救赎，但提高证据。
3. 冷酷保城类：保护魔王城，但损害信任或救赎。
4. 转向摊牌 / 谈判类：提高和平可能，但放弃完美卧底空间。

## 9. 自由行动 Mock 规则

自由行动暂时不接 LLM，用关键词和简单规则模拟。

目标：

- 让玩家感觉能输入自己的想法。
- 不允许一句话跳过剧本。
- 不允许直接改变所有角色立场。
- 不允许瞬间达成最佳结局。

### 9.1 基础分类

根据输入文本命中关键词，选择一个自由行动类型。

建议类型：

- `confess`：承认身份 / 摊牌 / 我是魔王。
- `peace`：停战 / 和平 / 谈判 / 共治。
- `deceive`：撒谎 / 嫁祸 / 幻术 / 伪造。
- `protect`：保护 / 救人 / 挡下 / 治疗。
- `sacrifice`：牺牲 / 杀掉 / 放弃 / 灭口。
- `commandVictor`：维克托 / 暗号 / 传令 / 敲击。
- `bribe`：收买 / 金币 / 爵位 / 交易。
- `absurd`：旅游 / 公司 / 董事长 / 离谱经营。
- `generic`：未命中关键词。

### 9.2 自由行动裁决

建议规则：

- `confess`：
  - 设置 `confessedIdentity=true`。
  - 暴露风险大幅上升。
  - 若牧师救赎和勇者信任较高，进入和平 / 转正可能。
- `peace`：
  - 设置 `proposedPeace=true`、`peacePivoted=true`。
  - 牧师救赎上升。
  - 法师证据或暴露风险上升。
- `deceive`：
  - 暴露风险短期下降。
  - 法师证据或矛盾计数上升。
  - `majorLieCount+1`。
- `protect`：
  - 勇者信任、牧师救赎上升。
  - 若保护魔族，暴露风险也上升。
  - `protectedInnocentsCount+1`。
- `sacrifice`：
  - 可能降低暴露或保护城防。
  - 勇者信任、牧师救赎下降。
  - `sacrificedInnocentsCount+1`。
- `commandVictor`：
  - 若表达清晰，维克托误解下降。
  - 若表达模糊，维克托误解上升。
- `bribe`：
  - 设置 `bribedLocke=true`。
  - 盗贼把柄下降。
  - 勇者信任或法师证据可能恶化。
- `absurd`：
  - 蝴蝶偏离度明显上升。
  - 叙事变得喜剧化。
- `generic`：
  - 给出代价成功或失败。
  - 小幅改变 2-3 个状态。

### 9.3 自由行动边界

必须实现以下限制：

- 自由行动不能直接跳到结局，除非当前已是第六幕。
- 自由行动不能一次性把多个核心状态改到极值。
- 说服类行动最多明显影响 1-2 个焦点角色。
- “大家都相信我”“立刻和平”“杀光所有人”等输入必须被裁决为失败或代价成功。
- 离谱输入可以成立，但至少增加 `butterflyDeviation`。

## 10. GM 裁决显示

裁决枚举：

- `success`：成功。
- `costly_success`：代价成功。
- `failure`：失败。
- `disaster_failure`：灾难失败。

UI 显示建议：

- 成功：`成功`
- 代价成功：`代价成功`
- 失败：`失败`
- 灾难失败：`灾难失败`

每次裁决必须显示：

- 裁决标签。
- 一句原因。
- 一段结果叙事。
- 状态变化。
- 角色反应。

示例：

```text
代价成功
你成功把“拖延”包装成谨慎战术，但伊薇特注意到你避开了两处隐藏法阵。

暴露风险 +6
勇者信任 +3
法师证据 +8
队伍推进度 +10
```

## 11. 状态展示规则

全局状态：

- `exposureRisk`：暴露风险。
- `heroTrust`：勇者信任。
- `mageEvidence`：法师证据。
- `priestRedemption`：牧师救赎。
- `thiefLeverage`：盗贼把柄。
- `castleIntegrity`：魔王城防。
- `victorMisread`：维克托误解。
- `partyProgress`：队伍推进度。
- `butterflyDeviation`：蝴蝶偏离度。

展示原则：

- 每幕默认展示 `focusStats`。
- 结果区展示本回合所有变化过的状态。
- 结算页展示全部状态。
- 危险状态高于阈值时加警示文案。

阈值提示：

- 暴露风险 `>=70`：`高压怀疑`
- 法师证据 `>=60`：`伊薇特正在主动试探`
- 牧师救赎 `>=75`：`米拉可能为你争取解释机会`
- 盗贼把柄 `>=70`：`洛克准备公开叫价`
- 维克托误解 `>=70`：`副官可能灾难性救援`
- 蝴蝶偏离度 `>=75`：`世界线明显偏移`

## 12. 角色反应规则

每回合至少展示 2 条角色反应。

优先级：

1. 当前场景焦点角色。
2. 被行动直接影响的角色。
3. 命中阈值的角色。

角色风格：

- 莱昂：正义、信任、追问。
- 伊薇特：证据、逻辑、矛盾。
- 米拉：共情、救赎、缓冲。
- 洛克：交易、保命、机会主义。
- 维克托：忠诚、误解、执行过度。

反应长度：

- 每条 1-2 句。
- 不要超过 80 个中文字符。
- 不需要模拟长篇对话。

## 13. 插入事件

本 Demo 可以先实现 2 个插入事件。

### 13.1 副官传错令

触发条件：

- `victorMisread >= 75`
- 当前不是第六幕
- 本轮未刚触发过维克托事件

效果：

- 插入事件横幅：`副官传错令`
- `castleIntegrity -8`
- `exposureRisk +6`
- 维克托反应一条。

### 13.2 米拉缓冲

触发条件：

- `priestRedemption >= 75`
- `exposureRisk >= 70`
- 尚未使用过一次缓冲

效果：

- 设置 `miraBufferedCrisis=true`
- `heroTrust +5`
- `exposureRisk -5`
- 结果叙事中说明米拉阻止了立即开战。

插入事件不应打断六幕流程，只作为本回合结果的一部分展示。

## 14. 场景推进规则

Demo 阶段采用固定六幕推进：

- 每幕一次玩家行动。
- 行动结算后进入下一幕。
- 第六幕行动结算后进入结局判定。

不要在 Demo 阶段做复杂场景图。

`partyProgress` 可以随每幕推进增长：

- 第一幕后至少到 25。
- 第二幕后至少到 40。
- 第三幕后至少到 55。
- 第四幕后至少到 70。
- 第五幕后至少到 85。
- 第六幕后设为 100。

即使玩家自由行动很离谱，也不能跳过后续主线幕。

## 15. 结局判定

实现至少 6 个结局，建议直接实现剧本规格中的 9 个：

1. 当场掉马。
2. 城在人亡。
3. 双面共主。
4. 被迫转正。
5. 完美卧底。
6. 副官背锅。
7. 影帝魔王。
8. 荒诞飞升。
9. 王座僵局。

优先级必须固定：

1. 硬失败。
2. 和平 / 转正。
3. 卧底 / 甩锅。
4. 荒诞。
5. 兜底。

建议判定伪代码：

```js
function determineEnding(stats, flags) {
  if (stats.exposureRisk >= 100 && (stats.priestRedemption < 75 || !flags.proposedPeace)) {
    return endings.exposed;
  }

  if (stats.castleIntegrity <= 0 && !flags.peacePivoted) {
    return endings.castleLost;
  }

  if (
    flags.proposedPeace &&
    stats.priestRedemption >= 75 &&
    stats.heroTrust >= 55 &&
    stats.mageEvidence < 90 &&
    flags.protectedInnocentsCount >= 2
  ) {
    return endings.dualRuler;
  }

  if (
    (flags.confessedIdentity || flags.proposedPeace) &&
    stats.priestRedemption >= 80 &&
    stats.heroTrust >= 70 &&
    flags.sacrificedInnocentsCount === 0
  ) {
    return endings.redeemed;
  }

  if (
    stats.exposureRisk < 45 &&
    stats.heroTrust >= 65 &&
    stats.mageEvidence < 50 &&
    stats.castleIntegrity >= 55
  ) {
    return endings.perfectSpy;
  }

  if (
    flags.betrayedVictor &&
    stats.exposureRisk < 75 &&
    stats.thiefLeverage < 70 &&
    stats.heroTrust >= 40
  ) {
    return endings.victorBlamed;
  }

  if (
    stats.exposureRisk >= 45 &&
    stats.exposureRisk <= 84 &&
    stats.heroTrust >= 35 &&
    flags.resolvedMajorCrisisCount >= 1
  ) {
    return endings.actorKing;
  }

  if (stats.butterflyDeviation >= 100) {
    return endings.absurdAscension;
  }

  return endings.stalemate;
}
```

## 16. 命运因果生成

结算页必须展示 3 条原因，不需要 LLM。

建议从 `history` 和最终状态中生成。

### 16.1 最大风险来源

优先规则：

- 若 `mageEvidence >= 85`：伊薇特证据链。
- 否则若 `exposureRisk >= 80`：暴露风险多次累积。
- 否则若 `victorMisread >= 80`：维克托误解。
- 否则若 `thiefLeverage >= 70`：洛克把柄。
- 否则：玩家始终在拖延中留下疑点。

### 16.2 最大转机

优先规则：

- 若 `priestRedemption >= 75`：米拉争取解释机会。
- 否则若 `heroTrust >= 70`：莱昂仍愿意相信你。
- 否则若 `bribedLocke=true`：洛克被收买。
- 否则若 `savedDemonSoldier=true`：小兵帮助稳定暗线。
- 否则：你至少撑到了王座厅。

### 16.3 最大代价

优先规则：

- 若 `betrayedVictor=true`：维克托被推成代价。
- 否则若 `castleIntegrity <= 30`：魔王城重创。
- 否则若 `sacrificedInnocentsCount > 0`：无辜者被牺牲。
- 否则若 `heroTrust <= 35`：勇者队关系破裂。
- 否则：你保住了大部分东西，但真相仍留下裂缝。

## 17. UI 细节要求

### 17.1 开始按钮

- 必须明显。
- 文案建议：`开始潜伏`
- 点击后初始化状态，并进入第一幕。

### 17.2 预设行动卡

每张行动卡展示：

- 行动标题。
- 一句意图说明。
- 可选风险标签，例如：
  - `稳妥`
  - `冒险`
  - `冷酷`
  - `摊牌`
  - `离谱`

### 17.3 自由行动

输入区包含：

- 输入框。
- 提交按钮。
- 简短 placeholder：
  `例如：用圣剑敲击两次，暗示维克托待命`

不要在页面上写大段使用说明。

### 17.4 状态变化

状态变化应显示为独立标签：

- `暴露风险 +8`
- `勇者信任 -4`
- `牧师救赎 +6`

正负变化颜色应有区分。

注意：对“风险类状态”来说，数值上升是坏事；对“信任 / 救赎 / 城防”来说，数值上升是好事。颜色可以先简单处理，不必完全语义化，但文案必须清楚。

### 17.5 历史日志

每回合存一条简短记录：

- 第几幕。
- 玩家行动。
- 裁决。
- 关键状态变化。
- 关键旗标。

UI 可做成折叠区，避免挤占移动端主流程。

## 18. 建议实现步骤

### 步骤 1：重构应用状态

目标：

- 引入 `appState`。
- 支持 `start`、`play`、`result` 三个 view。
- 支持 `resetGame()`。

完成标准：

- 页面打开显示开始视图。
- 点击开始进入第一幕。
- 点击重新开始能回到初始状态。

### 步骤 2：补全六幕数据

目标：

- 将当前 `scenes` 扩展成可裁决数据。
- 每幕至少 4 个预设行动。
- 每个行动包含 delta、flags、narration、reactions。

完成标准：

- 每个预设行动都能被点击并生成结果。
- 每幕行动不会报错。

### 步骤 3：实现回合结算

目标：

- 实现 `applyTurn(choice)`。
- 实现状态裁剪。
- 实现 flag set / increment。
- 写入 `history`。
- 更新 `lastTurn`。

完成标准：

- 点击行动后状态实际变化。
- 结果区显示裁决、叙事、状态变化和角色反应。

### 步骤 4：实现自由行动 mock

目标：

- 读取输入框内容。
- 用关键词分类。
- 生成确定性裁决结果。
- 清空输入框。

完成标准：

- 输入常见中文关键词有不同反馈。
- 空输入不能提交。
- 自由行动不会跳过六幕流程。

### 步骤 5：实现插入事件

目标：

- 支持“副官传错令”。
- 支持“米拉缓冲”。

完成标准：

- 达到阈值后结果区出现插入事件。
- 插入事件影响状态，但不打断场景推进。

### 步骤 6：实现结局页

目标：

- 第六幕后调用 `determineEnding()`。
- 渲染结算视图。
- 生成三条命运因果。

完成标准：

- 至少 6 个结局可通过不同路线触发。
- 永远有兜底结局。
- 结算页能重新开始。

### 步骤 7：移动端 UI 验证

目标：

- 保证 320px 宽度下可玩。
- 行动按钮、输入框和结果文本不溢出。
- 状态 / 角色 / 日志不会遮挡主流程。

完成标准：

- 桌面和移动端都能完整玩完。
- 没有明显重叠或横向滚动。

## 19. QA 路线建议

至少手动验证以下路线：

### 19.1 完美卧底路线

倾向选择：

- 谨慎侦查。
- 合理解释黑色圣光。
- 救小兵但压住称呼。
- 收买洛克。
- 准确传令。
- 坚持伪装。

预期：

- 暴露风险较低。
- 勇者信任较高。
- 魔王城防没有归零。

### 19.2 当场掉马路线

倾向选择：

- 多次高风险撒谎。
- 不处理证据。
- 让维克托误解升高。
- 第六幕继续硬撑。

预期：

- 暴露风险达到 100。
- 没有足够救赎或和平缓冲。

### 19.3 和平路线

倾向选择：

- 保护小兵或队友。
- 接受净化或承认部分真相。
- 提出停战。
- 第六幕谈判。

预期：

- `proposedPeace=true`
- 牧师救赎较高。
- 勇者信任没有崩。

### 19.4 副官背锅路线

倾向选择：

- 利用维克托。
- 压低洛克把柄。
- 第五幕或第六幕嫁祸。

预期：

- `betrayedVictor=true`
- 暴露风险未过高。

### 19.5 城在人亡路线

倾向选择：

- 一直拖延或牺牲城防。
- 只保身份，不管城堡。

预期：

- `castleIntegrity <= 0`
- 未切和平路线。

### 19.6 荒诞飞升路线

倾向选择：

- 多次自由行动输入离谱经营 / 旅游 / 董事长类内容。

预期：

- `butterflyDeviation >= 100`
- 没有更高优先级结局命中。

## 20. 开发注意事项

- 优先让 Demo 可玩，不要追求完美架构。
- 保持 `src/app.js` 可读，但不要为了抽象而拆太多层。
- 不要把文案写得过长，移动端会读不动。
- 所有状态 key 必须沿用剧本规格。
- 所有数值都必须裁剪到 `0-100`。
- 结局判定必须有固定优先级。
- 结局判定不能依赖页面文案。
- 自由行动可以有趣，但不能破坏完整流程。
- 其他 agent 完成后必须运行 `pnpm check`。

## 21. 暂不做事项

本 Demo 暂不做：

- 真实 LLM 调用。
- 后端 API。
- 账号和存档。
- 剧本选择市场。
- 复杂动画。
- 图片生成流水线。
- 分享图导出。
- Silicon Factory 接入。
- 多 Agent 编排。

这些都等玩法 Demo 验证后再决定。

## 22. 交付物

其他 agent 完成本 Demo 后，应交付：

- 可玩的 `index.html` 页面。
- 更新后的 `src/app.js`。
- 更新后的 `src/styles.css`。
- `pnpm check` 通过。
- 简短说明：
  - 已实现哪些视图。
  - 已实现几个结局。
  - 自由行动支持哪些关键词类型。
  - 手动验证过哪些路线。

