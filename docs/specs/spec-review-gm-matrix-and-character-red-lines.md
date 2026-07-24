# 《卧底魔王》GM裁决、场景矩阵与角色红线规格评审报告

- **文档名称**：`spec-review-gm-matrix-and-character-red-lines.md`
- **评审日期**：2026-07-24
- **评审状态**：已通过（带落地补充要求）
- **评审对象**：
  1. [`docs/specs/gm-adjudication-system-v1.md`](file:///Users/coding-pi/Documents/Workspaces/Main/Lit-Pi/what-if/docs/specs/gm-adjudication-system-v1.md) (v1.0)
  2. [`docs/specs/scene-adjudication-matrix-v1.md`](file:///Users/coding-pi/Documents/Workspaces/Main/Lit-Pi/what-if/docs/specs/scene-adjudication-matrix-v1.md) (v1.0)
  3. [`docs/specs/character-pressure-and-red-lines-v1.md`](file:///Users/coding-pi/Documents/Workspaces/Main/Lit-Pi/what-if/docs/specs/character-pressure-and-red-lines-v1.md) (v1.0)

---

## 1. 评审结论概述 (Executive Summary)

经过对以上三份规格文档的联合比对与代码可行性审查，**评审结论为：整体通过，可直接作为下阶段核心系统代码实装与单元测试的基线标准。**

三份规格成功构建了下游 What-If Life Simulator 核心体验的技术闭环：
- **双引擎分工明确**：LLM 专注自由对话生成与意图建议；JS 运行时（Runtime）掌握数值裁剪 `[0, 100]`、旗标更新与确定性结局判定。
- **场景破绽矩阵覆盖全面**：7 大场景（Act 1 ~ Act 5）均有明确的意图分类适配、红线阻断与即时死局。
- **角色底线（Red Lines）补齐高潮体验**：彻底解决了“终局空王座选结局流于表面”的问题，确保剧情高潮的张力与确定性。

---

## 2. 核心架构与设计亮点

| 维度 | 亮点说明 | 代码与架构价值 |
| :--- | :--- | :--- |
| **双引擎硬隔离** | LLM 仅输出 JSON 候选建议；运行时在 `0-100` 内裁剪数值，并判定合法性 | 彻底消除 LLM 幻觉导致的一句话瞬杀魔王或无条件洗白 |
| **九大行动意图** | 划分 `deceive`, `protect`, `sacrifice`, `bribe`, `confess`, `peace`, `commandVictor`, `absurd`, `generic` | 给自由输入与预设选项提供了统一的数值映射与判定规则 |
| **三级角色压力** | 角色具有“关注 -> 施压 -> 红线”阶梯响应 | 避免 NPC“机械轮流说话”，实现高疑虑下的联合追问与底线对峙 |
| **因果确定性结局** | 结算页能追溯解释“最大风险、最大转机、最大代价” | 让失败和成功均可被解释、可重玩验证 |

---

## 3. 发现的问题与落地补强要求 (Refinement Items)

为保证规格完全无缝落地到 `src/app.js` 运行时中，需针对以下 4 个细节进行补强：

### 3.1 补充 `failure`（普通失败）在 UI 层的标签分级
- **问题描述**：规格中定义了 `success`, `costly_success`, `failure`, `disaster_failure` 四档。代码当前 UI 样式将 `failure` 与死局统一处理，容易让玩家误以为普通失败即 GAME OVER。
- **落地要求**：在 `src/styles.css` 中为 `.adj-failure` 划分独立提示色（如深橙色/灰紫色），提示玩家“行动失败，暴露风险上升但场景继续”。

### 3.2 规范 `appState.flags` 全局计数器 Key 命名
- **问题描述**：三份规格中引用了多个跨场景标志位，需确保在 `INITIAL_FLAGS` 中统一显式初始化。
- **必含 Key 列表**：
  - `sacrificedInnocentsCount`: 0 （牺牲无辜者次数）
  - `savedDemonSoldier`: false （是否拯救重伤魔族小兵）
  - `bribedLocke`: false （是否成功收买洛克）
  - `contradictionCount`: 0 （言行前后矛盾计数）
  - `proposedPeace`: false （是否提出停战协议）
  - `commandVictorSuccess`: false （是否正确使用魔族密语暗号）

### 3.3 Act 5 结局校验中的红线优先拦截链 (Priority Order)
- **问题描述**：在第五幕（`act5_throne`）进行结局判定时，若先判断结局阈值再判断红线，可能导致命中红线的玩家仍误入好结局。
- **落地要求**：结局评估流程必须为：
  `verifyCharacterRedLines(stats, flags)` -> 若有违例 -> 阻断 `dualRuler` / `redeemed` / `perfectSpy` -> 回退到 `confrontation_hard_fail` 或 `stalemate`（王座僵局）。

### 3.4 降级机制（Fallback Protocol）
- **问题描述**：当 LLM 接口超时或返回非法 JSON 时，必须零感知回退。
- **落地要求**：继续保留并增强 `src/app.js` 中的本地正则关键词裁决函数 `adjudicateFreeAction` 作为兜底引擎。

---

## 4. 推荐实装代码片段 (Reference Code Implementations)

### 4.1 角色红线校验函数 `verifyCharacterRedLines`
```javascript
/**
 * 校验玩家当前状态是否触碰 companion 角色的不可逾越底线
 * @param {Object} stats 当前五维数值
 * @param {Object} flags 当前全局旗标
 * @returns {Array} 违例红线列表
 */
function verifyCharacterRedLines(stats, flags) {
  const violations = [];

  // 1. 莱昂（正义与信任底线）
  if (stats.heroTrust < 40) {
    violations.push({ char: 'leon', key: 'leon_trust_broken', text: '莱昂对你的信任已彻底破裂，拒绝同魔王妥协。' });
  }
  if (flags.sacrificedInnocentsCount > 0 && stats.priestRedemption < 85) {
    violations.push({ char: 'leon', key: 'leon_innocent_killed', text: '你曾当众牺牲无辜者，莱昂誓要讨伐你。' });
  }

  // 2. 伊薇特（逻辑与证据链底线）
  if (stats.mageEvidence >= 90) {
    violations.push({ char: 'ivette', key: 'ivette_evidence_closed', text: '伊薇特已掌握不可推翻的魔王真身证据链，坚持推行圣光封印。' });
  }

  // 3. 米拉（救赎与慈悲底线）
  if (stats.priestRedemption < 75) {
    violations.push({ char: 'mira', key: 'mira_redemption_low', text: '米拉未能在你身上看到足够的善意，无法为你向队伍说情。' });
  }

  // 4. 洛克（利益与黑料把柄底线）
  if (stats.thiefLeverage >= 70 && !flags.bribedLocke) {
    violations.push({ char: 'locke', key: 'locke_leverage_high', text: '洛克掌握的黑料把柄过多，将秘密高价卖给了教会高层。' });
  }

  // 5. 维克托（魔族忠诚与误读底线）
  if (stats.victorMisread >= 80 && !flags.commandVictorSuccess) {
    violations.push({ char: 'victor', key: 'victor_misread_explosion', text: '维克托过度误读陛下意图，擅自启动了决死自爆阵。' });
  }

  return violations;
}
```

---

## 5. 签署与下一步行动 (Next Steps)

- **评审结论**：✅ **批准 (Approved)**
- **后续任务**：
  1. 将本评审报告提交至仓库 `docs/specs/spec-review-gm-matrix-and-character-red-lines.md`；
  2. 下游实施 Agent 可直接依据三份规格 + 本评审报告，完成 `src/app.js` 中的底层判定重构与测试编写。
