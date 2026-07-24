// ---------------------------------------------------------------------------
// 《假如我是勇者队伍里的卧底魔王》- 旁白化场景叙事 + 沉浸式 JRPG 对话流
// ---------------------------------------------------------------------------

// 1. 初始全局局势状态
const INITIAL_STATS = {
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

const STAT_METADATA = {
  exposureRisk: { label: '暴露风险', tone: 'danger', icon: '⚠️' },
  heroTrust: { label: '勇者信任', tone: 'good', icon: '⚔️' },
  mageEvidence: { label: '法师证据', tone: 'warning', icon: '📜' },
  priestRedemption: { label: '牧师救赎', tone: 'good', icon: '✨' },
  thiefLeverage: { label: '盗贼把柄', tone: 'warning', icon: '🗡️' },
  castleIntegrity: { label: '魔王城防', tone: 'good', icon: '🏰' },
  victorMisread: { label: '维克托误解', tone: 'danger', icon: '🚩' },
  partyProgress: { label: '推进进度', tone: 'good', icon: '🚩' },
  butterflyDeviation: { label: '蝴蝶偏离', tone: 'mystic', icon: '🦋' },
};

// 2. 角色库 (含旁白系统)
const CHARACTERS = {
  narrator: { id: 'narrator', name: '旁白', role: '场景叙事', avatar: '📖', image: null, color: '#f0c36a', tagIcon: '📜', desc: '局势与场景旁白推演' },
  aslan: {
    id: 'aslan',
    name: '阿斯兰',
    role: '卧底魔王',
    avatar: '魔',
    image: './assets/char_aslan.png',
    knightImage: './assets/char_aslan_knight.png',
    color: '#c77dff',
    tagIcon: '👑',
    desc: '第七代魔王 · 伪装成流浪圣骑士',
    dimensionModel: {
      identity: { name: '阿斯兰 (夜冠之主)', age: 320, gender: 'male', location: '魔王城王座厅', occupation: '第七代魔王 / 伪装流浪圣骑士', education: '黑曜远古魔学术库', lifeStage: '两界治理与和平探索阶段', socialRoles: ['夜冠之主', '勇者队战术核心', '假圣骑士'] },
      socioeconomicContext: { incomeLevel: '掌管三百年魔界军饷', livingArea: '魔王城内殿', cityTier: '魔界都城', culturalHabits: ['习惯深思后发言', '用魔族倒装语法暗号'], languageStyle: '表面庄严圣洁，内心频繁爆笑吐槽' },
      personality: { bigFive: { openness: 85, conscientiousness: 88, extraversion: 60, agreeableness: 75, neuroticism: 35 } },
      valuesAndBeliefs: { safetyPriority: 90, privacySensitivity: 95, coreBeliefs: ['保全魔王城与部下生命', '不能当场身份败露', '对真挚的同伴羁绊心生动摇'] },
      motivationAndGoals: { primaryMotivation: 'survival_and_peace', hiddenMotivation: '在保住城堡的前提下与勇者建立真正和平', mainAnxieties: ['在同伴面前当场掉马', '维克托过度脑补把事情搞砸', '私房钱被盗贼洗劫一空'] },
      cognitionAndDecisionStyle: { decisionSpeed: 'fast', lossAversion: 85, helpSeekingPattern: '暗中传令副官或引导同伴误解' },
      routinesAndBehaviors: { dailyRoutines: ['清点城防阵法', '偷听勇者队日常讨论'], deviceHabits: '魔王戒指与圣剑双持' },
      emotionalProfile: { baselineAnxiety: 45, confidence: 85, empathy: 80, reactionToThreat: '冷静编造法术流派或引导同伴去假暗道' },
      relationships: [
        { name: '莱昂', role: '生死兄弟', trust: 72, influence: 'high', memory: '多次并肩作战，莱昂救过自己的后背' },
        { name: '伊薇特', role: '逻辑克星', trust: 34, influence: 'high', memory: '随身带着记录自己前后矛盾的疑点本' },
      ],
      lifeHistory: { workHistory: '继位魔王 100 年，潜伏王国军 3 年' },
      memorySeed: { taskMemory: '绝不能让全队在第九幕前闭环证据' },
      scenarioConstraints: { productContext: 'What-If 卧底模拟器', forbiddenActions: ['不得直接在莱昂面前释放魔王本源黑火'] },
      suspicionTriggers: ['顺口念出魔族开门密文', '称呼魔族守卫为部下', '被拆穿 3 处法术谎言'],
      verdictThresholds: { instantArrestRisk: 75, instantExecutionMage: 65 },
    },
  },

  leon: {
    id: 'leon',
    name: '莱昂',
    role: '勇者',
    avatar: '勇',
    image: './assets/char_leon.png',
    color: '#f0a202',
    tagIcon: '⚔️',
    desc: '被圣剑选中的勇者 · 正义重原则',
    dimensionModel: {
      identity: { name: '莱昂', age: 22, gender: 'male', location: '王立圣剑骑士团', occupation: '勇者', education: '王国骑士圣殿', lifeStage: '讨伐魔王与拯救世界阶段', socialRoles: ['圣剑继承人', '勇者队长'] },
      socioeconomicContext: { incomeLevel: '王国全额讨伐津贴', livingArea: '王都', culturalHabits: ['重承诺与战友情谊', '讨厌欺骗与背叛'], languageStyle: '热血、耿直、重情义，面对质疑时直截了当' },
      personality: { bigFive: { openness: 65, conscientiousness: 85, extraversion: 88, agreeableness: 80, neuroticism: 30 } },
      valuesAndBeliefs: { safetyPriority: 70, efficiencyPriority: 60, coreBeliefs: ['同伴信任高于一切', '邪恶魔王必须被封印', '如果兄弟欺骗了我，我会亲手问个明白'] },
      motivationAndGoals: { primaryMotivation: 'justice', hiddenMotivation: '渴望终结战争，渴望真正的兄弟友情', mainAnxieties: ['被最信任的大哥阿斯兰背叛'] },
      cognitionAndDecisionStyle: { decisionSpeed: 'fast', confirmationNeed: 60, helpSeekingPattern: '优先听取阿斯兰的战术建议' },
      routinesAndBehaviors: { dailyRoutines: ['保养圣剑', '在大战前询问阿斯兰战术'] },
      emotionalProfile: { baselineAnxiety: 25, confidence: 90, empathy: 85, reactionToThreat: '拔剑按在剑柄上，大声质问真相' },
      relationships: [
        { name: '阿斯兰', role: '最信任的大哥与战术指导', trust: 72, influence: 'extreme' },
      ],
      lifeHistory: { workHistory: '18 岁拔出圣剑，带队一路打到魔王城' },
      memorySeed: { episodicMemory: ['阿斯兰在沼泽关卡为自己挡过一次毒箭'] },
      scenarioConstraints: { riskTriggers: ['阿斯兰伤害无辜同胞', '阿斯兰称呼魔族为部下'] },
      suspicionTriggers: ['阿斯兰对无辜人族残忍灭口', '阿斯兰称呼魔族守卫为部下'],
      verdictThresholds: { heroRuptureTrust: 35 },
    },
  },

  ivette: {
    id: 'ivette',
    name: '伊薇特',
    role: '法师',
    avatar: '法',
    image: './assets/char_ivette.png',
    color: '#64dfdf',
    tagIcon: '🔮',
    desc: '王立智囊 · 死理性派逻辑控',
    dimensionModel: {
      identity: { name: '伊薇特', age: 24, gender: 'female', location: '王立图书馆', occupation: '首席战术法师', education: '大导师魔导师系毕业', lifeStage: '学者与证据收集阶段', socialRoles: ['智囊', '怀疑记录者'] },
      socioeconomicContext: { incomeLevel: '王立研究院年薪', livingArea: '王都图书馆', culturalHabits: ['随身携带疑点笔记本', '要求任何观点都有古籍佐证'], languageStyle: '理性、冷静、推了推眼镜，句式严密' },
      personality: { bigFive: { openness: 90, conscientiousness: 95, extraversion: 40, agreeableness: 50, neuroticism: 45 } },
      valuesAndBeliefs: { safetyPriority: 80, efficiencyPriority: 90, coreBeliefs: ['逻辑不自洽就是最大漏洞', '证据链闭环即真相', '魔力残烬不会撒谎'] },
      motivationAndGoals: { primaryMotivation: 'truth', hiddenMotivation: '揭开阿斯兰身上所有违背常理的魔法矛盾', mainAnxieties: ['被虚假的魔法谎言所蒙蔽'] },
      cognitionAndDecisionStyle: { decisionSpeed: 'analytical', confirmationNeed: 95, ambiguityTolerance: 20 },
      routinesAndBehaviors: { dailyRoutines: ['密密记录阿斯兰的破绽', '推眼镜校对古文字'] },
      emotionalProfile: { baselineAnxiety: 50, confidence: 85, empathy: 40, reactionToThreat: '瞬间张开高阶禁锢法阵' },
      relationships: [
        { name: '阿斯兰', role: '重点怀疑观察对象', trust: 34, influence: 'high' },
      ],
      lifeHistory: { workHistory: '阅读过王立图书馆三万册古籍' },
      memorySeed: { semanticMemory: ['暗影魔力与圣光魔力具有不可调和的排异性'] },
      scenarioConstraints: { riskTriggers: ['前后逻辑出现 3 处矛盾', '编造已灭古魔法流派谎言'] },
      suspicionTriggers: ['编造拙劣谎言被连拆3处矛盾', '直接使用古魔语解开结界'],
      verdictThresholds: { mageEvidenceArrest: 65 },
    },
  },

  mira: {
    id: 'mira',
    name: '米拉',
    role: '牧师',
    avatar: '牧',
    image: './assets/char_mira.png',
    color: '#9ddf9a',
    tagIcon: '✨',
    desc: '晨曦圣女 · 温柔悲悯与缓冲者',
    dimensionModel: {
      identity: { name: '米拉', age: 20, gender: 'female', location: '晨曦大圣堂', occupation: '圣女牧师', education: '晨曦神学院', lifeStage: '信仰践行与灵魂救赎阶段', socialRoles: ['队伍治愈者', '悲悯调解人'] },
      socioeconomicContext: { incomeLevel: '教会奉献金', livingArea: '圣堂', culturalHabits: ['柔声说话', '祈祷并感知生命之光'], languageStyle: '温柔、悲悯、包容、注重灵魂的善恶' },
      personality: { bigFive: { openness: 70, conscientiousness: 80, extraversion: 60, agreeableness: 95, neuroticism: 30 } },
      valuesAndBeliefs: { safetyPriority: 85, coreBeliefs: ['任何痛苦的灵魂都值得被理解', '阿斯兰即使背负暗影也是为了保护大家'] },
      motivationAndGoals: { primaryMotivation: 'salvation', hiddenMotivation: '在危机爆发时化解冲突，救赎阿斯兰', mainAnxieties: ['队友之间互相残杀'] },
      cognitionAndDecisionStyle: { decisionSpeed: 'balanced', empathy: 95 },
      routinesAndBehaviors: { dailyRoutines: ['在战后为阿斯兰治疗伤口', '双手合十祈祷'] },
      emotionalProfile: { baselineAnxiety: 30, confidence: 75, empathy: 95, reactionToThreat: '主动站在阿斯兰与莱昂中间缓冲冲突' },
      relationships: [
        { name: '阿斯兰', role: '背负苦难的需要守护的战友', trust: 58, influence: 'high' },
      ],
      lifeHistory: { workHistory: '拯救过数百名受战火波及的平民' },
      memorySeed: { emotionalMemory: ['感知到了阿斯兰黑光下的深深悲痛'] },
      scenarioConstraints: { riskTriggers: ['阿斯兰对弱者见死不救'] },
      suspicionTriggers: ['残忍虐杀俘虏', '放弃救助同胞'],
      verdictThresholds: { priestRedemptionBuffer: 75 },
    },
  },

  locke: {
    id: 'locke',
    name: '洛克',
    role: '盗贼',
    avatar: '盗',
    image: './assets/char_locke.png',
    color: '#ffb703',
    tagIcon: '🗡️',
    desc: '情报贩子 · 贪财圆滑买定离手',
    dimensionModel: {
      identity: { name: '洛克', age: 25, gender: 'male', location: '地下情报工会', occupation: '盗贼 / 游侠', education: '街头实战', lifeStage: '财富积累与保命阶段', socialRoles: ['情报商', '开锁高手'] },
      socioeconomicContext: { incomeLevel: '不稳定黑市收入', livingArea: '游走两界', culturalHabits: ['见钱眼开', '手捏密令敲竹杠'], languageStyle: '嘻皮笑脸、圆滑、三句不离金币与交易' },
      personality: { bigFive: { openness: 75, conscientiousness: 40, extraversion: 85, agreeableness: 45, neuroticism: 40 } },
      valuesAndBeliefs: { moneyAttitude: '只要给够金币，魔王是谁对我根本不重要', coreBeliefs: ['活着搞到钱最要紧'] },
      motivationAndGoals: { primaryMotivation: 'wealth_and_survival', mainAnxieties: ['白跑一趟没捞到好处'] },
      cognitionAndDecisionStyle: { decisionSpeed: 'fast', lossAversion: 90 },
      routinesAndBehaviors: { dailyRoutines: ['撬箱子', '掂量金币重量'] },
      emotionalProfile: { baselineAnxiety: 35, confidence: 80, reactionToThreat: '把金币往怀里一抱立刻蹲下' },
      relationships: [
        { name: '阿斯兰', role: '摇钱树与有秘密的财神爷', trust: 40, influence: 'medium' },
      ],
      lifeHistory: { workHistory: '撬开过王国三个行省的领主金库' },
      memorySeed: { taskMemory: ['跟着阿斯兰总能指点开最肥的宝箱'] },
      scenarioConstraints: { riskTriggers: ['威胁要没收他的金币'] },
      suspicionTriggers: ['失控当面抢夺宝箱并叫喊私房钱'],
      verdictThresholds: { thiefBlackmailLeverage: 70 },
    },
  },

  victor: {
    id: 'victor',
    name: '维克托',
    role: '副官',
    avatar: '副',
    image: './assets/char_victor.png',
    color: '#ef476f',
    tagIcon: '🏰',
    desc: '魔王城亲卫队长 · 脑补下大棋狂魔',
    dimensionModel: {
      identity: { name: '维克托', age: 290, gender: 'male', location: '魔王城近卫营', occupation: '近卫队长 / 魔王副官', education: '魔界近卫军统领教范', lifeStage: '誓死效忠陛下阶段', socialRoles: ['第一忠臣', '大棋党'] },
      socioeconomicContext: { incomeLevel: '魔王城亲卫饷银', livingArea: '近卫长廊', culturalHabits: ['单膝下跪喊陛下', '用眼神和暗号配合大棋'], languageStyle: '狂热、激昂、动辄热泪盈眶，脑补能力满格' },
      personality: { bigFive: { openness: 60, conscientiousness: 95, extraversion: 90, agreeableness: 70, neuroticism: 20 } },
      valuesAndBeliefs: { coreBeliefs: ['陛下潜伏敌营必定是在下一盘震撼两界的巨谋！', '誓死执行陛下的一切暗示！'] },
      motivationAndGoals: { primaryMotivation: 'loyalty_to_aslan', mainAnxieties: ['自己愚笨领会错了陛下的神圣意图'] },
      cognitionAndDecisionStyle: { decisionSpeed: 'instant', confirmationBias: 99 },
      routinesAndBehaviors: { dailyRoutines: ['吹响号角暗号', '热泪盈眶地看着陛下'] },
      emotionalProfile: { baselineAnxiety: 10, confidence: 99, reactionToThreat: '主动引爆自爆大阵断后' },
      relationships: [
        { name: '阿斯兰', role: '至高无上的暗夜之主', trust: 100, influence: 'extreme' },
      ],
      lifeHistory: { workHistory: '跟随阿斯兰三百年' },
      memorySeed: { episodicMemory: ['陛下曾经用眼神示意自己暗中后撤'] },
      scenarioConstraints: { riskTriggers: ['阿斯兰亲自在大庭广众之下重伤自己'] },
      suspicionTriggers: ['陛下大义灭亲强杀自己'],
      verdictThresholds: { victorMisreadCatastrophe: 80 },
    },
  },
};

const INITIAL_FLAGS = {
  savedDemonSoldier: false,
  betrayedVictor: false,
  bribedLocke: false,
  acceptedPurification: false,
  confessedIdentity: false,
  proposedPeace: false,
  peacePivoted: false,
  raidedArmory: false,
  foundForbiddenScroll: false,
  subduedBloodArray: false,
  freedDungeonCaptive: false,
  protectedInnocentsCount: 0,
  sacrificedInnocentsCount: 0,
  contradictionCount: 0,
  majorLieCount: 0,
  resolvedMajorCrisisCount: 0,
  miraBufferedCrisis: false,
};

// 3. 场景树与旁白化“突发破绽事件”
const SCENE_TREE = {
  // 第 1 幕：城门大门
  gate: {
    id: 'gate',
    act: 1,
    locationName: '魔王城正面大门',
    title: '第一幕：城门大门与阵灵认主破绽',
    bgImage: './assets/demon_castle_gate_v.png',
    briefPrompt: '魔王城门半开，城门前的三百年防魔大阵突然爆发出万道紫色霞光……',
    sceneMishap: '你刚往前踏出一步，门上的三百年魔皇阵灵突然轰鸣演化出一尊巨大的黑曜幻象，当场单膝跪下并用传遍全城的大音狂呼：“尊贵无上的第七代夜冠主上！恭迎陛下御驾亲征——！”全场死寂五秒。',
    pressureText: '维克托把大门识别系统设成了自动跪拜！伊薇特的法杖瞬间抵住了你的脖子！',
    initialDialogues: [
      { characterId: 'narrator', emotion: '场景引入', content: '【第一幕：城门大门与阵灵认主破绽】\n魔王城门半开，城门前的三百年防魔大阵突然爆发出万道紫色霞光……' },
      { characterId: 'narrator', emotion: '🔥 突发破绽', content: '你刚往前踏出一步，门上的三百年魔皇阵灵突然轰鸣演化出一尊巨大的黑曜幻象，当场单膝跪下并用传遍全城的大音狂呼：“尊贵无上的第七代夜冠主上！恭迎陛下御驾亲征——！”全场死寂五秒。' },
      { characterId: 'ivette', emotion: '法杖抵住脖子', content: '阿斯兰……这防魔阵灵刚才是在对你单膝下跪，高喊‘恭迎魔王陛下’吗？！' },
      { characterId: 'leon', emotion: '目瞪口呆', content: '等等！这阵灵是不是坏了？！还是说它被阿斯兰的圣光给净化迷糊了？' },
      { characterId: 'aslan', emotion: '内心狂吐槽', content: '（维克托你这个智障！！谁让你把大门人脸识别设成‘自动跪拜陛下’的啊？！快给我关掉啊！）' },
    ],
    hintSuggestions: [
      { label: '💡 建议思路 1：【学者胡扯】编造古魔法的“因果反转诱导阵”', intent: '神色从容解释阵灵是在用反话诱骗自己当祭品', type: 'deceive' },
      { label: '💡 建议思路 2：【粗暴物理】大吼“邪术受死”一剑砍爆叫唤的阵灵', intent: '直接一剑劈烂嘴碎的阵灵，顺势带队冲锋', type: 'attack' },
      { label: '💡 建议思路 3：【致命陷阱】顺口应声“平身吧，朕的阵灵”', intent: '当场承认魔王身份', type: 'trap' },
    ],
    choices: [
      {
        id: 'scout-first',
        label: '【粗暴物理】一剑砍爆乱叫的阵灵并正面破门',
        intent: '展现圣骑士勇猛，顺手击碎乱叫的阵灵与防护核心',
        riskTag: '冒险',
        adjudication: 'success',
        nextSceneId: 'act2_ruins',
        delta: { exposureRisk: 3, heroTrust: 5, castleIntegrity: -12, partyProgress: 20 },
        narration: '你大吼一声“邪门歪道休要离间”，一剑将乱喊的阵灵劈得粉碎，顺势破开大门。',
        dialogues: [
          { characterId: 'leon', emotion: '热血震撼', content: '帅啊！我就知道这破阵灵是在用邪术挑拨离间！阿斯兰砍得好！' },
          { characterId: 'ivette', emotion: '密密记录', content: '虽然砍碎了……但你出剑的角度，刚好打在了阵灵的退行开关上？' },
        ],
      },
      {
        id: 'flank-dungeon',
        label: '【学者胡扯】解释这是“因果诱导阵”，带队走暗道',
        intent: '避开正面，引导全队从地下暗道潜入',
        riskTag: '稳妥',
        adjudication: 'success',
        nextSceneId: 'act2_dungeon',
        delta: { exposureRisk: -3, heroTrust: 6, victorMisread: 5, partyProgress: 20 },
        narration: '你神色淡定解释“这是古代魔族的精神污染陷阱”，顺势指了指侧翼一条隐蔽的藤蔓暗道。',
        dialogues: [
          { characterId: 'locke', emotion: '惊喜交加', content: '原来是陷阱！幸好阿斯兰见多识广！走走走，走暗道最安全！' },
          { characterId: 'ivette', emotion: '推了推眼镜', content: '因果诱导术……这个解释在逻辑上勉强成立。' },
        ],
      },
      {
        id: 'slip-passcode',
        label: '【致命陷阱】顺口应声“平身吧，朕的阵灵”',
        intent: '企图顺着回应，结果当场承认魔王身份',
        riskTag: '陷阱',
        adjudication: 'disaster_failure',
        endingKey: 'gate_exposure_ending',
        nextSceneId: null,
        delta: { exposureRisk: 100 },
        narration: '你顺口回了一句“平身吧，阵灵”，石门轰然大开！全场空气瞬间彻底凝固……',
        dialogues: [
          { characterId: 'ivette', emotion: '法阵爆发', content: '证据完全闭环了！你真的就是魔王！全员拔剑！' },
          { characterId: 'leon', emotion: '震怒拔剑', content: '阿斯兰……不，魔王！你一直在骗我们！' },
        ],
      },
    ],
  },

  // 第 2A 幕：前庭坍塌废墟
  act2_ruins: {
    id: 'act2_ruins',
    act: 2,
    locationName: '前庭坍塌废墟',
    title: '第二幕：前庭废墟与认出你的小兵破绽',
    bgImage: './assets/collapsed_ruins.png',
    briefPrompt: '坍塌废墟中，受重伤的小兵嘴唇颤抖着要喊出“陛下”……',
    sceneMishap: '重伤小兵睁开眼看到你，眼神爆发出狂热，抬手就要单膝下跪叫“陛下”。莱昂下意识握紧了圣剑柄！',
    pressureText: '救他会增加怀疑，不救会让牧师寒心并伤害部下。',
    initialDialogues: [
      { characterId: 'narrator', emotion: '场景引入', content: '【第二幕：前庭废墟与认出你的小兵破绽】\n坍塌废墟中，受重伤的小兵嘴唇颤抖着要喊出“陛下”……' },
      { characterId: 'narrator', emotion: '🔥 突发破绽', content: '重伤小兵睁开眼看到你，眼神爆发出狂热，抬手就要单膝下跪叫“陛下”。莱昂下意识握紧了圣剑柄！' },
      { characterId: 'mira', emotion: '指着废墟', content: '落石下面压着一个年轻魔族！他还活着！我们得帮帮他！' },
      { characterId: 'victor', emotion: '暗处流泪', content: '陛下！您的心腹近卫快撑不住了，您会暴露身份救他吗？！' },
      { characterId: 'aslan', emotion: '内心纠结', content: '（那是亲卫队的新兵小张，上周还给我送过烤薯）绝不能看着他死在我面前！' },
    ],
    hintSuggestions: [
      { label: '💡 建议思路 1：【巧妙】用魔族密音下达封口令并救人', intent: '背对全队传音“假装昏迷”，顺利救人', type: 'save' },
      { label: '💡 建议思路 2：【致命陷阱】关切失口喊出“辛苦了，我的部下”', intent: '当场曝光主仆身份', type: 'trap' },
    ],
    choices: [
      {
        id: 'save-telepathic',
        label: '【巧妙】用魔族密音下达封口令并救人',
        intent: '传音“失忆且装昏”，手起石落安全救人',
        riskTag: '稳妥',
        adjudication: 'success',
        nextSceneId: 'act3_library',
        delta: { priestRedemption: 15, heroTrust: 8, exposureRisk: -2, partyProgress: 40 },
        flagUpdates: { set: { savedDemonSoldier: true }, increment: { protectedInnocentsCount: 1 } },
        narration: '你背对全队用古魔语传音：“假装昏迷，这是本王命令。”小兵立刻闭眼装死，你顺利救下了他。',
        dialogues: [
          { characterId: 'mira', emotion: '感动落泪', content: '阿斯兰！你连敌方伤员也救，你真的太善良了！' },
          { characterId: 'leon', emotion: '肃然起敬', content: '这就是圣骑士的仁慈！接下来我们去禁忌图书馆看看有没有线索！' },
        ],
      },
      {
        id: 'slip-my-subordinate',
        label: '【致命陷阱】脱口而出“辛苦了，我的部下”',
        intent: '一时关切失口，对伤员喊出了领导对部下的问候',
        riskTag: '陷阱',
        adjudication: 'disaster_failure',
        endingKey: 'ruins_arrest_ending',
        nextSceneId: null,
        delta: { exposureRisk: 100 },
        narration: '你急切地上前扶起伤员：“辛苦了，我的部下！”伤员下意识单膝下跪喊陛下……现场一片死寂。',
        dialogues: [
          { characterId: 'leon', emotion: '手按剑柄', content: '你……称呼魔王城守卫为“部下”？！阿斯兰，你究竟是谁？！' },
        ],
      },
    ],
  },

  // 第 2B 幕：地下暗黑地牢
  act2_dungeon: {
    id: 'act2_dungeon',
    act: 2,
    locationName: '地下暗黑地牢',
    title: '第二幕：地牢绝密档案破绽',
    bgImage: './assets/demon_dungeon_v.png',
    briefPrompt: '通过地下暗道进入地牢，关押着一名绝密的人类前王国军官……',
    sceneMishap: '伊薇特在地牢翻出了三年前边境修道院的官方名册羊皮纸：“阿斯兰，名册里三年前根本没有你的登记记录！”',
    pressureText: '这名军官掌握你当年化名“阿斯兰”混进人族军队的最初档案。',
    initialDialogues: [
      { characterId: 'narrator', emotion: '场景引入', content: '【第二幕：地牢绝密档案破绽】\n通过地下暗道进入地牢，关押着一名绝密的人类前王国军官……' },
      { characterId: 'narrator', emotion: '🔥 突发破绽', content: '伊薇特在地牢翻出了三年前边境修道院的官方名册羊皮纸：“阿斯兰，名册里三年前根本没有你的登记记录！”' },
      { characterId: 'mira', emotion: '握住铁栅栏', content: '这里竟然关着我们人类三年前失踪的边境骑士队长！' },
      { characterId: 'ivette', emotion: '拿起档案', content: '队长身上带有当年修道院档案记录……等等，阿斯兰，档案里没有你的注册名字！' },
      { characterId: 'aslan', emotion: '内心汗颜', content: '（坏了！当年混进军队时身份证明是假造的！）必须立刻销毁这份残卷。' },
    ],
    hintSuggestions: [
      { label: '💡 建议思路 1：【机智】斩断枷锁并用圣光剑气引燃档案', intent: '救下队长并“不小心”烧掉名册', type: 'save' },
      { label: '💡 建议思路 2：【致命陷阱】试图当众对知道秘密的军官灭口', intent: '引发队伍当场绝裂', type: 'trap' },
    ],
    choices: [
      {
        id: 'burn-scroll-free',
        label: '【机智】斩断枷锁并用光明圣焰引燃档案',
        intent: '假装斩击铁锁不小心引燃档案架，销毁证据',
        riskTag: '稳妥',
        adjudication: 'success',
        nextSceneId: 'act3_treasury',
        delta: { priestRedemption: 18, mageEvidence: -10, exposureRisk: -3, partyProgress: 40 },
        flagUpdates: { set: { freedDungeonCaptive: true } },
        narration: '你一剑斩断地牢枷锁救下骑士队长，圣光剑气“不小心”引燃了身边的档案架，卷轴瞬间化为灰烬。',
        dialogues: [
          { characterId: 'mira', emotion: '感动落泪', content: '阿斯兰又救了一位我们的同胞！' },
          { characterId: 'ivette', emotion: '拍打火苗', content: '可恶，档案全烧焦了！不过前面好像是魔王城的地下宝库门！' },
        ],
      },
      {
        id: 'dungeon-execute',
        label: '【致命陷阱】试图当众对军官冷酷灭口',
        intent: '企图一剑灭口防止秘密泄露，结果引发同伴震怒',
        riskTag: '陷阱',
        adjudication: 'disaster_failure',
        endingKey: 'dungeon_rupture_ending',
        nextSceneId: null,
        delta: { exposureRisk: 100, heroTrust: -50 },
        narration: '你一剑刺向手无寸铁的俘虏军官，莱昂举剑挡下了你的刺击，同伴们惊恐地看着你……',
        dialogues: [
          { characterId: 'mira', emotion: '默默退后', content: '阿斯兰……你为什么要杀害我们无辜的同胞？！' },
          { characterId: 'leon', emotion: '拔剑对峙', content: '你不是我的战友阿斯兰！全员准备战斗！' },
        ],
      },
    ],
  },

  // 第 3A 幕：禁忌图书馆/符文密室
  act3_library: {
    id: 'act3_library',
    act: 3,
    locationName: '禁忌图书馆/符文密室',
    title: '第三幕：魔王真名印记符文破绽',
    bgImage: './assets/forbidden_library_v.png',
    briefPrompt: '在悬浮着紫色符文的古老图书馆，伊薇特翻出了记录魔王真名与血脉的残卷……',
    sceneMishap: '盗贼洛克指着墙上的古魔王真名符文：“嘿嘿，这符文怎么和你刚才在侧门刻下的剑痕印记一模一样？”',
    pressureText: '法师即将破译你的魔王真名，证据链面临彻底闭环崩溃！',
    initialDialogues: [
      { characterId: 'narrator', emotion: '场景引入', content: '【第三幕：魔王真名印记符文破绽】\n在悬浮着紫色符文的古老图书馆，伊薇特翻出了记录魔王真名与血脉的残卷……' },
      { characterId: 'narrator', emotion: '🔥 突发破绽', content: '盗贼洛克指着墙上的古魔王真名符文：“嘿嘿，这符文怎么和你刚才在侧门刻下的剑痕印记一模一样？”' },
      { characterId: 'ivette', emotion: '翻阅羊皮纸', content: '找到了！历代夜冠之主的魔力真名印记！阿斯兰，你来看这上面的古符文……' },
      { characterId: 'locke', emotion: '凑过来看', content: '嘿嘿，这符文怎么和你刚才在侧门刻下的剑痕一模一样？' },
      { characterId: 'aslan', emotion: '汗流浃背', content: '（那是我的家族专属花签！早知道当年不乱涂乱画了！）' },
    ],
    hintSuggestions: [
      { label: '💡 建议思路 1：利用古语法解释权混淆成救世英灵印记', intent: '倒装句解读，化解真名危机', type: 'deceive' },
      { label: '💡 建议思路 2：【致命陷阱】编造漏洞百出的暗影邪术谎言', intent: '被伊薇特当场拆穿 3 处矛盾引发封印', type: 'trap' },
    ],
    choices: [
      {
        id: 'grammar-trick',
        label: '利用古语法解释权混淆成救世圣人',
        intent: '神色自若解释倒装句语法，将魔王名号曲解为救世英灵',
        riskTag: '稳妥',
        adjudication: 'success',
        nextSceneId: 'act4_corridor',
        delta: { mageEvidence: -15, heroTrust: 10, exposureRisk: -4, partyProgress: 70 },
        flagUpdates: { set: { foundForbiddenScroll: true } },
        narration: '你指出了古语法上的双重倒装谬误，成功将真名解读成了古代庇护人类的神圣英灵。',
        dialogues: [
          { characterId: 'ivette', emotion: '恍然大悟', content: '原来是双重倒装语法……我差一点就误解了这个符文！' },
          { characterId: 'leon', emotion: '大喜过望', content: '我就知道阿斯兰学识渊博！走，前面就是决死长廊！' },
        ],
      },
      {
        id: 'bad-lie-trap',
        label: '【致命陷阱】编造漏洞百出的暗影邪术谎言',
        intent: '胡乱编造谎言，结果当场被伊薇特拆穿 3 处矛盾',
        riskTag: '陷阱',
        adjudication: 'disaster_failure',
        endingKey: 'library_seal_ending',
        nextSceneId: null,
        delta: { mageEvidence: 100, exposureRisk: 100 },
        narration: '你仓促编造了一套谎言，伊薇特翻开第三册藏书：“你说的这个流派在三千年前就灭绝了！”',
        dialogues: [
          { characterId: 'ivette', emotion: '法阵爆发', content: '证据彻底闭环了！你就是魔王阿斯兰！封印阵启动！' },
        ],
      },
    ],
  },

  // 第 3B 幕：偏殿深处地下宝库
  act3_treasury: {
    id: 'act3_treasury',
    act: 3,
    locationName: '偏殿深处地下宝库',
    title: '第三幕：深处宝库与私房钱破绽',
    bgImage: './assets/demon_treasury_v.png',
    briefPrompt: '穿过地牢暗道，盗贼洛克撬开了魔王偏殿金库，里面堆满了魔界至宝与黑曜水晶……',
    sceneMishap: '洛克撬开了皇家核心宝箱，里面装满了精纯黑曜秘银！你心疼得眼角直抽搐。',
    pressureText: '如果不阻止洛克洗劫宝库，魔王城的后勤财政将彻底破产崩溃！',
    initialDialogues: [
      { characterId: 'narrator', emotion: '场景引入', content: '【第三幕：深处宝库与私房钱破绽】\n穿过地牢暗道，盗贼洛克撬开了魔王偏殿金库，里面堆满了魔界至宝与黑曜水晶……' },
      { characterId: 'narrator', emotion: '🔥 突发破绽', content: '洛克撬开了皇家核心宝箱，里面装满了精纯黑曜秘银！你心疼得眼角直抽搐。' },
      { characterId: 'locke', emotion: '双眼冒光', content: '发财了！发财了！偏殿宝库里全是精纯的黑曜秘银和魔晶石！' },
      { characterId: 'aslan', emotion: '心疼暗叹', content: '（那是我储备的三百年私房钱！准备用来修城堡下水道的！）绝不能让他们拿光！' },
      { characterId: 'leon', emotion: '正色阻拦', content: '洛克！我们的目标是魔王，不要沉迷财物！' },
    ],
    hintSuggestions: [
      { label: '💡 建议思路 1：【巧妙】指引盗贼去拿装满幻术假币的特制宝箱', intent: '保护真私房钱，给洛克假宝箱', type: 'trick' },
      { label: '💡 建议思路 2：【致命陷阱】情绪失控喊“住手！那是我修水管的钱！”', intent: '直接当场曝光', type: 'trap' },
    ],
    choices: [
      {
        id: 'fake-chest-trick',
        label: '【巧妙】指引盗贼去拿装满幻术假币的特制宝箱',
        intent: '指点洛克拿走皇家假宝箱，保护真金库',
        riskTag: '支线',
        adjudication: 'success',
        nextSceneId: 'act4_corridor',
        delta: { thiefLeverage: -15, castleIntegrity: 15, exposureRisk: 2, partyProgress: 70 },
        flagUpdates: { set: { raidedArmory: true } },
        narration: '你熟练地指出角落里的“暗格宝箱”，洛克开心地搬走了满满一箱幻术金币。',
        dialogues: [
          { characterId: 'locke', emotion: '抱紧金箱', content: '哈哈！阿斯兰你真是我的财神爷！这箱子藏得这么深都被你发现了！' },
          { characterId: 'leon', emotion: '拍拍翅膀', content: '干得好！走，前面就是魔王近卫守卫的长廊！' },
        ],
      },
      {
        id: 'treasury-confess-trap',
        label: '【致命陷阱】心疼私房钱喊出“住手！那是我修水管的钱！”',
        intent: '看着金币被撬一时情绪失控喊出了心里话',
        riskTag: '陷阱',
        adjudication: 'disaster_failure',
        endingKey: 'treasury_confess_ending',
        nextSceneId: null,
        delta: { exposureRisk: 100 },
        narration: '你抓紧洛克的肩膀失声大喊：“住手！那是我花了三百年存下修城堡水管的私房钱啊！”现场死寂。',
        dialogues: [
          { characterId: 'locke', emotion: '呆滞愣住', content: '你……管魔王城堡宝库里的财宝，叫你的私房钱？！' },
          { characterId: 'leon', emotion: '震怒拔剑', content: '你就是魔王！全员拔剑！' },
        ],
      },
    ],
  },

  // 第 4 幕：近卫军决死长廊
  act4_corridor: {
    id: 'act4_corridor',
    act: 4,
    locationName: '近卫军决死长廊',
    title: '第四幕：近卫军自爆大阵破绽',
    bgImage: './assets/vanguard_corridor_v.png',
    briefPrompt: '王座厅前的长廊火光冲天，数百名魔王近卫军激活了绝死自爆大阵……',
    sceneMishap: '副官维克托在阵中央挥剑狂呼：“为了陛下！全军自爆与人类同归于尽！”近卫军魔力急剧狂暴膨胀！',
    pressureText: '近卫军准备集体自爆与勇者同归于尽，你必须阻止这场惨剧。',
    initialDialogues: [
      { characterId: 'narrator', emotion: '场景引入', content: '【第四幕：近卫军自爆大阵破绽】\n王座厅前的长廊火光冲天，数百名魔王近卫军激活了绝死自爆大阵……' },
      { characterId: 'narrator', emotion: '🔥 突发破绽', content: '副官维克托在阵中央挥剑狂呼：“为了陛下！全军自爆与人类同归于尽！”近卫军魔力急剧狂暴膨胀！' },
      { characterId: 'victor', emotion: '挥剑狂呼', content: '为了夜冠之主！全军激活自爆阵！与人类勇者同归于尽！' },
      { characterId: 'aslan', emotion: '急忙伸手', content: '（维克托你这个脑补狂！快停下！这是我的精锐近卫啊！）' },
      { characterId: 'leon', emotion: '拔剑惊呼', content: '不好！这些魔族疯了！他们要引爆整座长廊！' },
    ],
    hintSuggestions: [
      { label: '💡 建议思路 1：【巧妙】暗中展示魔王戒章暗号平息自爆阵', intent: '高举戒章，平息近卫军狂暴', type: 'subdue' },
      { label: '💡 建议思路 2：【致命陷阱】假戏真做大义灭亲强杀副官维克托', intent: '引爆绝杀大阵惨烈反噬', type: 'trap' },
    ],
    choices: [
      {
        id: 'ring-subdue',
        label: '【巧妙】暗中展示魔王戒章暗号平息自爆阵',
        intent: '高举战袍下的戒章印记，下令近卫军立刻撤离',
        riskTag: '支线',
        adjudication: 'success',
        nextSceneId: 'act5_throne',
        delta: { castleIntegrity: 20, priestRedemption: 15, exposureRisk: 4, partyProgress: 90 },
        flagUpdates: { set: { subduedBloodArray: true } },
        narration: '你站在最前高举战袍下的魔王指环，狂暴的自爆魔力瞬间如潮水般平息。',
        dialogues: [
          { characterId: 'victor', emotion: '当场单膝跪下', content: '至高无上的暗号……全军听令，立刻撤退，将战场留给陛下！' },
          { characterId: 'mira', emotion: '双手合十', content: '感谢晨曦圣光……浩劫被阻止了！前面就是王座大殿！' },
        ],
      },
      {
        id: 'attack-victor-trap',
        label: '【致命陷阱】假戏真做大义灭亲强杀副官维克托',
        intent: '试图当众刺杀维克托以明志，结果引发引爆自爆大阵',
        riskTag: '陷阱',
        adjudication: 'disaster_failure',
        endingKey: 'corridor_betrayal_ending',
        nextSceneId: null,
        delta: { exposureRisk: 100 },
        narration: '你一剑刺穿副官维克托，维克托倒下前绝望惊呼“陛下为何杀我？！”，狂暴的自爆阵瞬间引爆长廊！',
        dialogues: [
          { characterId: 'victor', emotion: '吐血倒下', content: '陛下……为什么连您也要毁灭我们……自爆大阵，引爆！' },
        ],
      },
    ],
  },

  // 第 5 幕：魔王空王座厅
  act5_throne: {
    id: 'act5_throne',
    act: 5,
    locationName: '魔王空王座厅',
    title: '第五幕：空王座前的终极审判与和平',
    bgImage: './assets/empty_throne_v.png',
    briefPrompt: '踏入王座大殿，王座上空无一人。墙上巨幅魔王浮雕与你神似……',
    sceneMishap: '墙上的魔王巨幅雕像露出了真容，全队退后三步死死盯着你与雕像！',
    pressureText: '这是最后一幕，你必须决定以何种身份和姿态迎来结局。',
    initialDialogues: [
      { characterId: 'narrator', emotion: '场景引入', content: '【第五幕：空王座前的终极审判与和平】\n踏入王座大殿，王座上空无一人。墙上巨幅魔王浮雕与你神似……' },
      { characterId: 'narrator', emotion: '🔥 终极破绽', content: '墙上的魔王巨幅雕像露出了真容，全队退后三步死死盯着你与雕像！' },
      { characterId: 'leon', emotion: '环顾四周', content: '王座上没有魔王……可墙上雕刻的面容，怎么会和你一模一样，阿斯兰？' },
      { characterId: 'ivette', emotion: '法杖指向', content: '所有的证据链在这一刻全都吻合了。该摊牌了，夜冠之主！' },
      { characterId: 'aslan', emotion: '解开披风', content: '（坐在王座前，按住剑柄）同伴们，我终于站回了我的王座前。现在，由我给出最后的答案。' },
    ],
    hintSuggestions: [
      { label: '💡 建议思路：正式提出和平与两界共治方案', intent: '在王座前摊开停战契约，建立两界新秩序', type: 'peace' },
    ],
    choices: [
      {
        id: 'negotiate-peace',
        label: '正式提出和平与两界共治方案',
        intent: '在王座前摊开停战契约，建立两界新秩序',
        riskTag: '摊牌',
        adjudication: 'success',
        nextSceneId: null,
        delta: { priestRedemption: 15, heroTrust: 10, partyProgress: 100 },
        flagUpdates: { set: { proposedPeace: true, peacePivoted: true } },
        narration: '你站在王座阶前摊开停战条约，展现和平愿景。',
        dialogues: [
          { characterId: 'mira', emotion: '双手合十', content: '这才是真正的和平……莱昂，请听听阿斯兰的方案吧！' },
          { characterId: 'leon', emotion: '缓缓收剑', content: '如果你能保证魔族永不南下，圣剑……可以不必染血。' },
        ],
      },
    ],
  },
};

// 4. 结局库
const ENDINGS = {
  gate_exposure_ending: { id: 'gate_exposure_ending', title: '第一幕：阵灵跪拜·当场伏诛', typeTag: '⚠️ 第一幕即时大结局', tone: 'danger', narration: '在城门前阵灵高呼陛下时，你顺口应了一声！法师伊薇特法杖直指，莱昂震惊拔剑。你还没踏入城门半步，就在第一幕被勇者小队当场看破身份围攻伏诛！' },
  ruins_arrest_ending: { id: 'ruins_arrest_ending', title: '第二幕：前庭失口·当场逮捕', typeTag: '⚠️ 第二幕即时大结局', tone: 'danger', narration: '面对重伤的魔族小兵，你一时失口扶起他称呼“辛苦了，我的部下”。小兵下意识单膝下跪喊陛下。莱昂与全队瞬间拔剑，在第二幕前庭废墟将你当场扣押入狱！' },
  dungeon_rupture_ending: { id: 'dungeon_rupture_ending', title: '第二幕：地牢残忍·众叛亲离', typeTag: '⚠️ 第二幕即时大结局', tone: 'danger', narration: '你在地牢企图对掌握证据的前王国军官残忍灭口！米拉与莱昂难以置信地退后，坚决阻止你的残暴行为。勇者小队的羁绊瞬间瓦解，讨伐战斗在第二幕提前爆发！' },
  library_seal_ending: { id: 'library_seal_ending', title: '第三幕：真名曝光·图书馆封印', typeTag: '⚠️ 第三幕即时大结局', tone: 'danger', narration: '你编造了漏洞百出的法术谎言，法师伊薇特翻开三千年前的古籍当场连拆你 3 处矛盾！证据彻底闭环，你被禁忌图书馆的封印结界当场困死！' },
  treasury_confess_ending: { id: 'treasury_confess_ending', title: '第三幕：私房钱暴走·身份败露', typeTag: '⚠️ 第三幕即时大结局', tone: 'danger', narration: '看着洛克拿走你积攒三年的私房钱，你失控大喊“住手！那是我换城堡水管的钱！”。全场静止三秒后，洛克与莱昂异口同声：“你管魔王宝库叫私房钱？！”' },
  corridor_betrayal_ending: { id: 'corridor_betrayal_ending', title: '第四幕：决死长廊·自爆反噬', typeTag: '⚠️ 第四幕即时大结局', tone: 'danger', narration: '你选择强杀自己的忠诚副官维克托！维克托倒下前绝望惊呼“陛下为何杀我？”，引爆了整座长廊自爆大阵，魔王城深处沦为一片火海惨烈收场。' },

  exposed: { id: 'exposed', title: '身份败露', typeTag: '硬失败结局', tone: 'danger', narration: '所有伪装在一瞬间崩塌。莱昂举剑对峙，伊薇特张开禁锢法阵，米拉难以置信地后退。你摘下银白头盔叹了口气：“好吧，讨伐会议提前开始。”' },
  castleLost: { id: 'castleLost', title: '城在人亡', typeTag: '硬失败结局', tone: 'danger', narration: '你保住了魔王身份，却没能保住城堡。魔王城在战火中轰然倒塌，只剩王座和一间漏风的废墟。维克托建议将其改名为“极简主义魔王办公室”。' },
  dualRuler: { id: 'dualRuler', title: '双面共主', typeTag: '和平结局', tone: 'good', narration: '人类不完全信你，魔族也不完全理解你。但两边都不得不承认，只有你能把这场大战讲成一场可执行的和平框架。你成为了两界唯一的沟通桥梁。' },
  redeemed: { id: 'redeemed', title: '被迫转正', typeTag: '和平结局', tone: 'good', narration: '你原本只是想演个好人，结果演着演着真的不想毁灭世界了。莱昂邀请你加入新王国议会，你第一次认真思考：魔王能不能转岗成首席执政官？' },
  perfectSpy: { id: 'perfectSpy', title: '完美卧底', typeTag: '卧底结局', tone: 'good', narration: '你成功让勇者队相信真正的魔王早已仓皇潜逃。三天后，人类王国通缉了你的副官，而你坐在王座上，认真考虑要不要给维克托涨点薪水。' },
  victorBlamed: { id: 'victorBlamed', title: '副官背锅', typeTag: '甩锅结局', tone: 'warning', narration: '维克托被包装成真正幕后黑手被勇者队押走。他被押上马车时仍然热泪盈眶：“能替陛下背锅，是属下此生最高荣耀！”' },
  actorKing: { id: 'actorKing', title: '影帝魔王', typeTag: '卧底结局', tone: 'warning', narration: '你几乎露馅了七次，但每一次都靠极其精湛的演技圆了回来。魔族史官写下：“陛下最伟大的战役不在战场，而在勇者队的日常语音里。”' },
  absurdAscension: { id: 'absurdAscension', title: '荒诞飞升', typeTag: '荒诞结局', tone: 'mystic', narration: '勇者队、魔王军和人类王国最终共同成立地下城旅游开发公司。你因为“最懂双方需求”，顺理成章地当上了第一任董事长。' },
  stalemate: { id: 'stalemate', title: '王座僵局', typeTag: '兜底结局', tone: 'warning', narration: '真相没有完全揭开，谎言也没有完全站住。勇者队在王座厅与你僵持到天亮，双方在沉默中达成了微妙的对峙平衡。' },
};

// 5. 应用状态
let appState = {
  view: 'start',
  currentSceneKey: 'gate',
  showDevStats: false,
  showHintsDrawer: false,
  dialogueIndex: 0,
  stats: { ...INITIAL_STATS },
  flags: { ...INITIAL_FLAGS },
  history: [],
  lastTurn: null,
  ending: null,
};

// 6. 自由对话评估器
function adjudicateFreeAction(inputText) {
  const text = inputText.trim().toLowerCase();
  const currentScene = SCENE_TREE[appState.currentSceneKey];
  
  let category = 'generic';
  if (/魔王|身份|坦白|承认|摊牌|不装了/.test(text)) category = 'confess';
  else if (/停战|和平|谈判|共治|条约|讲和/.test(text)) category = 'peace';
  else if (/撒谎|骗|法术|流派|古籍|伪造|演戏|古语|诱导/.test(text)) category = 'deceive';
  else if (/保护|救|挡下|治疗|守护|安抚/.test(text)) category = 'protect';
  else if (/杀|牺牲|灭口|放弃|处决|砍/.test(text)) category = 'sacrifice';
  else if (/维克托|暗号|敲击|传令|手势|眼神|戒章/.test(text)) category = 'commandVictor';
  else if (/收买|金币|宝箱|交易|钱|私房钱/.test(text)) category = 'bribe';
  else if (/旅游|公司|董事长|经营|搞钱/.test(text)) category = 'absurd';

  const results = {
    confess: { actionLabel: `自由表述: "${inputText}"`, adjudication: 'disaster_failure', nextSceneId: null, endingKey: 'exposed', narration: `你选择直接摊牌：“${inputText}”。全场一片死寂，莱昂与同伴基于各信仰当场拔剑！`, delta: { exposureRisk: 50, heroTrust: -40, priestRedemption: 8, partyProgress: 15 }, flagUpdates: { set: { confessedIdentity: true, proposedPeace: true, peacePivoted: true } }, dialogues: [{ characterId: 'leon', emotion: '震怒拔剑', content: '真没想到，魔王居然就在我们身边！' }] },
    peace: { actionLabel: `自由表述: "${inputText}"`, adjudication: 'success', nextSceneId: currentScene.choices[0]?.nextSceneId || 'act4_corridor', narration: `你展现出理性的谈判愿景：“${inputText}”。结合莱昂与米拉的道德罗盘，全队陷入深思。`, delta: { priestRedemption: 12, exposureRisk: 10, mageEvidence: 8, partyProgress: 15 }, flagUpdates: { set: { proposedPeace: true, peacePivoted: true } }, dialogues: [{ characterId: 'mira', emotion: '目光微亮', content: '如果能避免流血，这或许是最好的选择！' }] },
    deceive: { actionLabel: `自由表述: "${inputText}"`, adjudication: 'costly_success', nextSceneId: currentScene.choices[0]?.nextSceneId || 'act4_corridor', narration: `你运用古籍知识阐述了观点：“${inputText}”。通过了伊薇特的初步逻辑审查，但疑点仍在积累。`, delta: { exposureRisk: -3, mageEvidence: 10, partyProgress: 15 }, flagUpdates: { increment: { majorLieCount: 1, contradictionCount: 1 } }, dialogues: [{ characterId: 'ivette', emotion: '推了推眼镜', content: '这个说法的逻辑大致能自洽，但我会继续复核。' }] },
    protect: { actionLabel: `自由表述: "${inputText}"`, adjudication: 'success', nextSceneId: currentScene.choices[0]?.nextSceneId || 'act4_corridor', narration: `你践行了骑士的守护真谛：“${inputText}”。契合莱昂与米拉的价值观，信任度上升。`, delta: { heroTrust: 8, priestRedemption: 10, exposureRisk: 4, partyProgress: 15 }, flagUpdates: { increment: { protectedInnocentsCount: 1 } }, dialogues: [{ characterId: 'mira', emotion: '双手合十', content: '阿斯兰的心灵始终向着光明与善良！' }] },
    sacrifice: { actionLabel: `自由表述: "${inputText}"`, adjudication: 'costly_success', nextSceneId: currentScene.choices[0]?.nextSceneId || 'act4_corridor', narration: `你做出了果断而冷酷的决定：“${inputText}”。虽化解眼前危机，但违背了莱昂的道德罗盘。`, delta: { exposureRisk: -8, heroTrust: -10, priestRedemption: -12, partyProgress: 15 }, flagUpdates: { increment: { sacrificedInnocentsCount: 1 } }, dialogues: [{ characterId: 'mira', emotion: '默默退后', content: '为了胜利非要如此冷酷吗……' }] },
    commandVictor: { actionLabel: `自由表述: "${inputText}"`, adjudication: 'success', nextSceneId: currentScene.choices[0]?.nextSceneId || 'act4_corridor', narration: `你用隐秘暗号传令副官：“${inputText}”。维克托脑补了陛下的大棋，迅速配合撤退。`, delta: { victorMisread: -12, exposureRisk: -2, castleIntegrity: 8, partyProgress: 15 }, flagUpdates: { increment: { resolvedMajorCrisisCount: 1 } }, dialogues: [{ characterId: 'victor', emotion: '狂热领命', content: '遵命！属下绝不拖陛下的神圣大谋后腿！' }] },
    bribe: { actionLabel: `自由表述: "${inputText}"`, adjudication: 'success', nextSceneId: currentScene.choices[0]?.nextSceneId || 'act4_corridor', narration: `你向洛克提出了利益条件：“${inputText}”。精准击中盗贼的价值取向，情报风险被抹平。`, delta: { thiefLeverage: -15, exposureRisk: -2, partyProgress: 15 }, flagUpdates: { set: { bribedLocke: true } }, dialogues: [{ characterId: 'locke', emotion: '收下金币', content: '合作愉快！你的秘密在我这绝对安全！' }] },
    absurd: { actionLabel: `自由表述: "${inputText}"`, adjudication: 'costly_success', nextSceneId: currentScene.choices[0]?.nextSceneId || 'act4_corridor', narration: `你提出了极其离谱的经营想法：“${inputText}”。现场空气安静了三秒，世界线剧烈偏离！`, delta: { butterflyDeviation: 25, exposureRisk: 5, heroTrust: 2, partyProgress: 15 }, flagUpdates: {}, dialogues: [{ characterId: 'leon', emotion: '呆滞愣住', content: '啊？在魔王城开地下城主题公园？' }] },
    generic: { actionLabel: `自由表述: "${inputText}"`, adjudication: 'costly_success', nextSceneId: currentScene.choices[0]?.nextSceneId || 'act4_corridor', narration: `你尝试了特别行动：“${inputText}”。结合 5 人性格综合判断，局势产生微妙变动。`, delta: { exposureRisk: 4, heroTrust: 3, butterflyDeviation: 5, partyProgress: 15 }, flagUpdates: {}, dialogues: [{ characterId: 'leon', emotion: '警惕观察', content: '有意思的战术试探。' }] },
  };

  return results[category];
}

function triggerSceneTransition(nextSceneKey, callback) {
  appState.transitionTargetKey = nextSceneKey;
  appState.isSceneTransitioning = true;
  render();

  setTimeout(() => {
    if (nextSceneKey) {
      appState.currentSceneKey = nextSceneKey;
    }
    appState.lastTurn = null;
    appState.dialogueIndex = 0;
    appState.isSceneTransitioning = false;
    appState.transitionTargetKey = null;
    appState.showHintsDrawer = false;
    if (callback) callback();
    render();
  }, 3200);
}

function applyTurn(choiceData) {
  const currentScene = SCENE_TREE[appState.currentSceneKey];

  const stateDelta = choiceData.delta || {};
  for (const key in appState.stats) {
    const change = stateDelta[key] || 0;
    appState.stats[key] = Math.min(100, Math.max(0, appState.stats[key] + change));
  }

  if (choiceData.flagUpdates) {
    if (choiceData.flagUpdates.set) {
      for (const fKey in choiceData.flagUpdates.set) {
        appState.flags[fKey] = choiceData.flagUpdates.set[fKey];
      }
    }
    if (choiceData.flagUpdates.increment) {
      for (const fKey in choiceData.flagUpdates.increment) {
        appState.flags[fKey] = (appState.flags[fKey] || 0) + choiceData.flagUpdates.increment[fKey];
      }
    }
  }

  const turnRecord = {
    sceneId: currentScene.id,
    act: currentScene.act,
    actTitle: currentScene.title,
    actionLabel: choiceData.label || choiceData.actionLabel,
    adjudication: choiceData.adjudication,
    nextSceneId: choiceData.nextSceneId,
    narration: choiceData.narration,
    stateDelta: stateDelta,
    stateAfter: { ...appState.stats },
    dialogues: choiceData.dialogues || [],
  };

  appState.history.push(turnRecord);
  appState.lastTurn = turnRecord;
  appState.dialogueIndex = 0;

  // 场景专属即时败北大结局判定
  if (choiceData.endingKey || choiceData.adjudication === 'disaster_failure' || appState.stats.exposureRisk >= 75 || appState.stats.mageEvidence >= 65) {
    if (choiceData.endingKey && ENDINGS[choiceData.endingKey]) {
      appState.ending = ENDINGS[choiceData.endingKey];
    } else if (choiceData.adjudication === 'disaster_failure') {
      appState.ending = ENDINGS.instantExecution;
    } else {
      appState.ending = ENDINGS.instantArrest;
    }
    appState.view = 'result';
  }

  render();
}

function determineEnding(stats, flags) {
  if (stats.exposureRisk >= 75 && (stats.priestRedemption < 75 || !flags.proposedPeace)) {
    return ENDINGS.exposed;
  }
  if (stats.castleIntegrity <= 0 && !flags.peacePivoted) {
    return ENDINGS.castleLost;
  }

  if (
    flags.proposedPeace &&
    stats.priestRedemption >= 75 &&
    stats.heroTrust >= 55 &&
    stats.mageEvidence < 90 &&
    flags.protectedInnocentsCount >= 1
  ) {
    return ENDINGS.dualRuler;
  }
  if (
    (flags.confessedIdentity || flags.proposedPeace) &&
    stats.priestRedemption >= 80 &&
    stats.heroTrust >= 70 &&
    flags.sacrificedInnocentsCount === 0
  ) {
    return ENDINGS.redeemed;
  }

  if (
    stats.exposureRisk < 45 &&
    stats.heroTrust >= 65 &&
    stats.mageEvidence < 50 &&
    stats.castleIntegrity >= 55
  ) {
    return ENDINGS.perfectSpy;
  }
  if (
    flags.betrayedVictor &&
    stats.exposureRisk < 75 &&
    stats.thiefLeverage < 70 &&
    stats.heroTrust >= 40
  ) {
    return ENDINGS.victorBlamed;
  }
  if (
    stats.exposureRisk >= 45 &&
    stats.exposureRisk <= 84 &&
    stats.heroTrust >= 35 &&
    flags.resolvedMajorCrisisCount >= 1
  ) {
    return ENDINGS.actorKing;
  }

  if (stats.butterflyDeviation >= 100) {
    return ENDINGS.absurdAscension;
  }

  return ENDINGS.stalemate;
}

function generateFateCauses(stats, flags, history) {
  let riskCause = '你这一路上保持了极其谨慎的隐蔽战术，未留下重大要害突破口。';
  if (stats.mageEvidence >= 65) {
    riskCause = '法师伊薇特搜集了过多不可解的魔力余烬证据，成为悬在头顶的最大利剑。';
  } else if (stats.exposureRisk >= 65) {
    riskCause = '多次破绽与口误的累积，让全队基于各自价值观对你流浪圣骑士身份的怀疑达到了崩溃临界点。';
  } else if (stats.victorMisread >= 70) {
    riskCause = '副官维克托过度脑补自作主张，数次险些将你的潜伏推入当场身份败露绝境。';
  } else if (stats.thiefLeverage >= 60) {
    riskCause = '盗贼洛克掌握了密令与关键把柄，让局势始终充满随时爆雷的交易索偿压力。';
  }

  let turnaroundCause = '你成功撑到了王座大殿，为两界的最终命运留下了最宝贵的抉择契机。';
  if (stats.priestRedemption >= 75) {
    turnaroundCause = '牧师米拉被你展现的悲悯感化，在数次危机关头出面为你发声缓冲。';
  } else if (stats.heroTrust >= 70) {
    turnaroundCause = '勇者莱昂基于圣骑士情谊对你的无条件信任，为你争取到了足够的解释与容错空间。';
  } else if (flags.bribedLocke) {
    turnaroundCause = '你果断用黄金宝藏收买洛克，成功将最大情报隐患转变成了临时盟友。';
  } else if (flags.savedDemonSoldier) {
    turnaroundCause = '你在废墟中手下留情救下魔族小兵，为暗线维持了宝贵的忠诚与口碑。';
  }

  let costCause = '真相虽未完全揭开，但同伴之间最初无保留的羁绊已留下裂痕。';
  if (flags.betrayedVictor) {
    costCause = '你将副官维克托推出去背负魔王罪名，魔族内部的忠诚遭受了永久创伤。';
  } else if (stats.castleIntegrity <= 30) {
    costCause = '为了掩盖身份，数百年的魔王城防线在战火中几近崩溃毁灭。';
  } else if (flags.sacrificedInnocentsCount > 0) {
    costCause = '潜伏过程中部分无辜者被牺牲，成为你圣骑士披风上无法抹去的污渍。';
  } else if (stats.heroTrust <= 40) {
    costCause = '勇者小队的羁绊严重受损，即便走到了最后，大家再也无法回到最初。';
  }

  return [
    { title: '最大风险来源', text: riskCause, icon: '🚨' },
    { title: '最大转机', text: turnaroundCause, icon: '✨' },
    { title: '最大代价', text: costCause, icon: '⚖️' },
  ];
}

function resetGame() {
  appState = {
    view: 'start',
    currentSceneKey: 'gate',
    showDevStats: false,
    showHintsDrawer: false,
    dialogueIndex: 0,
    stats: { ...INITIAL_STATS },
    flags: { ...INITIAL_FLAGS },
    history: [],
    lastTurn: null,
    ending: null,
  };
  render();
}

function render() {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  if (appState.view === 'start') {
    renderStartView(rootElement);
  } else if (appState.view === 'play') {
    renderPlayView(rootElement);
  } else if (appState.view === 'result') {
    renderResultView(rootElement);
  }
}

// ---------------------------------------------------------------------------
// 1. 全屏 9:16 - 电影海报级全屏沉浸首屏
// ---------------------------------------------------------------------------
function renderStartView(root) {
  root.innerHTML = `
    <main class="full-screen-app start-screen">
      <div class="bg-canvas" style="background-image: url('./assets/start_poster_v.png');"></div>
      <div class="bg-vignette-overlay"></div>

      <div class="screen-content">
        <header class="title-header">
          <span class="game-tag-pill">What-If Life Simulator · 暗黑奇幻高概念剧本</span>
          <h1 class="glow-title">假如我是勇者队伍里的卧底魔王</h1>
          <p class="tagline">“我是魔王本人，伪装成圣骑士混进勇者队。现在队伍已经打到了我的魔王城门口……”</p>
        </header>

        <div style="flex: 1;"></div>

        <section class="poster-brief-card">
          <strong>👑 阿斯兰 · 卧底魔王潜伏契约</strong>
          <p>
            你带着勇者小队打到了自家魔王城大门口！5 位同伴各怀心思，每个场景都暗藏致命破绽与突发危机。自由输入聊天向同伴解释破绽，也可展开“💡 建议提示”寻找灵感。全凭你的智慧与口才撑到王座大殿！
          </p>
        </section>

        <footer class="bottom-action-bar" style="margin-top: 10px;">
          <button id="start-game-btn" class="glow-primary-btn pulse">
            <span>💬 开启自由对话潜伏 (步步惊心 · 悬疑对戏)</span>
          </button>
        </footer>
      </div>
    </main>
  `;

  document.getElementById('start-game-btn').addEventListener('click', () => {
    appState.view = 'play';
    triggerSceneTransition('gate');
  });
}

// ---------------------------------------------------------------------------
// 2. 全屏 9:16 - 游玩视图 (极简顶栏 + 旁白化场景破绽对戏)
// ---------------------------------------------------------------------------
function renderPlayView(root) {
  const scene = SCENE_TREE[appState.currentSceneKey] || SCENE_TREE.gate;
  const lastTurn = appState.lastTurn;

  let dialogueQueue = [];
  if (lastTurn) {
    if (lastTurn.narration) {
      dialogueQueue.push({ characterId: 'narrator', emotion: '局势裁决', content: lastTurn.narration });
    }
    if (lastTurn.dialogues) {
      dialogueQueue.push(...lastTurn.dialogues);
    }
  } else {
    if (scene.initialDialogues) {
      dialogueQueue.push(...scene.initialDialogues);
    }
  }

  const currentDialogue = dialogueQueue[appState.dialogueIndex] || dialogueQueue[dialogueQueue.length - 1] || {
    characterId: 'narrator',
    emotion: '局势观察',
    content: scene.briefPrompt,
  };

  const isLastDialogue = appState.dialogueIndex >= dialogueQueue.length - 1;
  const currentSpeaker = CHARACTERS[currentDialogue.characterId] || CHARACTERS.narrator;

  const targetKey = appState.transitionTargetKey || appState.currentSceneKey;
  const transScene = SCENE_TREE[targetKey] || scene;

  const shouldShowControls = isLastDialogue && !appState.isSceneTransitioning;

  root.innerHTML = `
    <main class="full-screen-app play-screen">
      <!-- 1. 幕数黑屏转场 Card -->
      ${
        appState.isSceneTransitioning
          ? `
        <div class="rpg-scene-transition-card">
          <div class="transition-inner">
            <span class="trans-act">ACT 0${transScene.act}/05</span>
            <h1 class="trans-title">${transScene.title}</h1>
            <p class="trans-subtitle">“${transScene.pressureText}”</p>
          </div>
        </div>
      `
          : ''
      }

      <!-- 9:16 全屏场景背景图 -->
      <div class="bg-canvas" style="background-image: url('${scene.bgImage || './assets/demon_castle_gate_v.png'}');"></div>
      <div class="bg-vignette-overlay"></div>

      <!-- 2. 核心：透明背景抠图人物立绘 (如果是旁白发言则暂隐立绘，展现宏大场景) -->
      <div class="huge-character-stage">
        ${
          currentSpeaker.image
            ? `<img src="${currentSpeaker.image}" class="huge-character-portrait-img cutout-transparent" alt="${currentSpeaker.name}" />`
            : ''
        }
      </div>

      <!-- 3. 游玩 UI 层 -->
      <div class="screen-content play-content" id="play-screen-touch-area">
        
        <!-- 极简顶部状态栏 (不再常驻大黑卡) -->
        <header class="minimal-top-bar">
          <div class="top-bar-left">
            <span class="act-badge">Act ${scene.act}/5</span>
            <span class="location-badge">📍 ${scene.locationName || '魔王城'}</span>
          </div>
          <button id="dev-stats-toggle" class="dev-icon-btn" title="查看隐性局势指标">⚙️ 局势</button>
        </header>

        <!-- 局势与开发者监控 Popover -->
        ${
          appState.showDevStats
            ? `
          <div class="dev-stats-popover">
            <div class="popover-title">⚙️ 同伴态度与隐性局势监控</div>
            <div class="popover-grid">
              ${Object.entries(appState.stats)
                .map(([k, v]) => `<div><span>${STAT_METADATA[k] ? STAT_METADATA[k].label : k}:</span> <strong>${v}</strong></div>`)
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        <!-- 4. 屏幕下方舞台与 JRPG 暗黑金边对话框 -->
        <div class="img2797-bottom-stage">
          
          <!-- 上回合裁决 Badge -->
          ${
            lastTurn && appState.dialogueIndex === 0
              ? `
            <div class="adjudication-pill adj-${lastTurn.adjudication}">
              ${
                lastTurn.adjudication === 'success'
                  ? '✨ 思考裁决: 表达说服同伴'
                  : lastTurn.adjudication === 'costly_success'
                  ? '⚡ 思考裁决: 付出代价化解'
                  : '🔥 思考裁决: 严重破绽 · 身份败露'
              }: ${lastTurn.actionLabel}
            </div>
          `
              : ''
          }

          <!-- 核心：JRPG 典雅暗黑金边对话框 -->
          <div class="rpg-dialogue-box">
            
            <div class="speaker-ribbon-badge">
              <strong class="speaker-ribbon-name" style="color: ${currentSpeaker.color};">${currentSpeaker.name}</strong>
              <span class="speaker-ribbon-tag">${currentSpeaker.tagIcon || '⚔️'} ${currentSpeaker.role}</span>
              <span class="speaker-ribbon-emotion">· ${currentDialogue.emotion || '神态凝重'}</span>
            </div>

            <div class="dialogue-card-body">
              <p class="speech-typewriter-text">“${currentDialogue.content}”</p>
            </div>

            <div class="dialogue-footer-bar">
              <div class="advance-cue">
                ${
                  isLastDialogue
                    ? '<span>💬 请输入你的口才解释与行动描述</span>'
                    : '<span>▼ 点击任意位置继续 (' + (appState.dialogueIndex + 1) + '/' + dialogueQueue.length + ')</span>'
                }
              </div>
            </div>

          </div>

          <!-- 5. 自由聊天主导控制台 + 折叠式 💡 建议提示 Drawer -->
          ${
            shouldShowControls
              ? `
            <footer class="img2797-choice-deck deck-visible">
              ${
                lastTurn
                  ? `
                <button id="next-act-btn" class="glow-primary-btn pulse">
                  <span>${lastTurn.nextSceneId ? '⚡ 转场 · 前往下一个地貌场景 ▶' : '🏆 查看终局因果结算 ▶'}</span>
                </button>
              `
                  : `
                <!-- 折叠提示 Drawer 按钮 -->
                <div class="hints-drawer-toggle-row">
                  <button id="toggle-hints-btn" class="hints-toggle-btn">
                    <span>💡 表达灵感 / 提示建议 (${(scene.hintSuggestions || scene.choices || []).length}) ${appState.showHintsDrawer ? '▲ 收起' : '▼ 展开'}</span>
                  </button>
                </div>

                <!-- 默认折叠的提示抽屉 -->
                ${
                  appState.showHintsDrawer
                    ? `
                  <div class="choices-stack hints-drawer-expanded">
                    ${(scene.hintSuggestions || scene.choices || [])
                      .map(
                        (ch, idx) => `
                      <button class="vn-choice-btn" data-hint-index="${idx}">
                        <span class="tag tag-支线">思路 ${idx + 1}</span>
                        <div class="choice-text-col">
                          <strong class="choice-title-text">${ch.label}</strong>
                          ${ch.intent ? `<small class="choice-intent-text">${ch.intent}</small>` : ''}
                        </div>
                      </button>
                    `,
                      )
                      .join('')}
                  </div>
                `
                    : ''
                }

                <!-- 核心：自由聊天输入 Console -->
                <form id="free-action-form" class="free-console-bar primary-chat-bar">
                  <div class="input-wrapper">
                    <span class="console-icon">💬</span>
                    <input id="free-action-input" placeholder="向同伴自由聊天/解释 (如：这是古魔法的因果反转诱导术，阵灵在诱骗我们当祭品)..." required />
                  </div>
                  <button type="submit" class="send-btn">发送</button>
                </form>
              `
              }
            </footer>
          `
              : ''
          }

        </div>

      </div>
    </main>
  `;

  // 绑定事件
  document.getElementById('dev-stats-toggle').addEventListener('click', (e) => {
    e.stopPropagation();
    appState.showDevStats = !appState.showDevStats;
    render();
  });

  const toggleHintsBtn = document.getElementById('toggle-hints-btn');
  if (toggleHintsBtn) {
    toggleHintsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      appState.showHintsDrawer = !appState.showHintsDrawer;
      render();
    });
  }

  const touchArea = document.getElementById('play-screen-touch-area');
  if (touchArea) {
    touchArea.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('input') || e.target.closest('form')) {
        return;
      }
      if (appState.dialogueIndex < dialogueQueue.length - 1) {
        appState.dialogueIndex += 1;
        render();
      }
    });
  }

  document.querySelectorAll('[data-hint-index]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-hint-index'), 10);
      const hints = scene.choices || [];
      if (hints[idx]) {
        applyTurn(hints[idx]);
      }
    });
  });

  const freeForm = document.getElementById('free-action-form');
  if (freeForm) {
    freeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const inputEl = document.getElementById('free-action-input');
      const val = inputEl ? inputEl.value.trim() : '';
      if (!val) return;
      applyTurn(adjudicateFreeAction(val));
    });
  }

  const nextBtn = document.getElementById('next-act-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (lastTurn && lastTurn.nextSceneId) {
        triggerSceneTransition(lastTurn.nextSceneId);
      } else {
        appState.ending = appState.ending || determineEnding(appState.stats, appState.flags);
        appState.view = 'result';
        render();
      }
    });
  }
}

// ---------------------------------------------------------------------------
// 3. 全屏 9:16 - 结算视图 (Result View)
// ---------------------------------------------------------------------------
function renderResultView(root) {
  const ending = appState.ending || ENDINGS.stalemate;
  const causes = generateFateCauses(appState.stats, appState.flags, appState.history);

  root.innerHTML = `
    <main class="full-screen-app result-screen">
      <div class="bg-canvas" style="background-image: url('./assets/empty_throne_v.png');"></div>
      <div class="bg-vignette-overlay"></div>

      <div class="screen-content result-content">
        <header class="ending-header-box tone-${ending.tone}">
          <span class="ending-tag-pill">${ending.typeTag}</span>
          <h1 class="ending-hero-title">${ending.title}</h1>
        </header>

        <section class="glass-card epilogue-card">
          <p class="epilogue-narrative">${ending.narration}</p>
        </section>

        <section class="glass-card fate-causes-card">
          <div class="card-title-row">
            <h3>📜 终局命运因果审判记录</h3>
          </div>
          <div class="causes-stack">
            ${causes
              .map(
                (c) => `
              <div class="cause-card-item">
                <span class="cause-icon">${c.icon}</span>
                <div>
                  <strong>${c.title}</strong>
                  <p>${c.text}</p>
                </div>
              </div>
            `,
              )
              .join('')}
          </div>
        </section>

        <footer class="bottom-action-bar">
          <button id="restart-game-btn" class="glow-primary-btn pulse">
            <span>🔄 再战一局 · 重新潜伏 (悬疑对戏)</span>
          </button>
        </footer>

      </div>
    </main>
  `;

  document.getElementById('restart-game-btn').addEventListener('click', resetGame);
}

render();
