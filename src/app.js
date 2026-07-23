// ---------------------------------------------------------------------------
// 《假如我是勇者队伍里的卧底魔王》- 全屏 9:16 Visual Novel / 独立人设立绘 / 纯净过场引擎
// ---------------------------------------------------------------------------

// 1. 初始数值状态 (后台隐性计算，不强加给玩家，靠神态对话与智慧摸索)
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

// 2. 核心角色设计与人设立绘 (配有专属形象与提示词存册)
const CHARACTERS = {
  leon: { name: '莱昂', role: '勇者', avatar: '勇', image: 'assets/char_leon.png', color: '#f0a202' },
  ivette: { name: '伊薇特', role: '法师', avatar: '法', image: 'assets/char_ivette.png', color: '#64dfdf' },
  mira: { name: '米拉', role: '牧师', avatar: '牧', image: 'assets/char_mira.png', color: '#9ddf9a' },
  locke: { name: '洛克', role: '盗贼', avatar: '盗', image: 'assets/char_locke.png', color: '#ffb703' },
  victor: { name: '维克托', role: '副官', avatar: '副', image: 'assets/char_victor.png', color: '#ef476f' },
  gm: { name: '旁白', role: '系统', avatar: '📜', image: null, color: '#f0c36a' },
};

const INITIAL_FLAGS = {
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
  miraBufferedCrisis: false,
};

// 3. 六幕主线剧情与转场数据
const SCENES = [
  {
    id: 'gate',
    act: 1,
    title: '第一幕：城门前的安静',
    bgImage: 'assets/demon_castle_gate_v.png',
    briefPrompt: '魔王城门半开，城内传来三短一长的熟悉号角声……',
    pressureText: '你极其熟悉这里，但绝不能表现得比本地魔族还熟。',
    focusCharacters: ['leon', 'ivette', 'victor'],
    initialDialogues: [
      { characterId: 'leon', emotion: '观察警惕', content: '奇怪……魔王城门大开且空无一人，难道是有什么致命陷阱？' },
      { characterId: 'ivette', emotion: '法杖凝光', content: '大家停下！我隐约感知到了伏兵的魔力波幅……阿斯兰，你怎么看？' },
    ],
    choices: [
      {
        id: 'scout-first',
        label: '劝队伍先侦查',
        intent: '拖慢推进，保持战术合理性',
        riskTag: '稳妥',
        adjudication: 'success',
        delta: { exposureRisk: -3, heroTrust: 4, victorMisread: 5, partyProgress: 15 },
        narration: '你沉稳地建议谨慎战术，莱昂赞同地点了点头。',
        dialogues: [
          { characterId: 'leon', emotion: '沉稳认可', content: '阿斯兰说的对，魔王城大门前必须万分小心！' },
          { characterId: 'ivette', emotion: '眼神冰冷', content: '奇怪，你似乎提前知道城门附近没有伏兵法阵？' },
          { characterId: 'victor', emotion: '热泪盈眶', content: '收到！陛下示意暂缓，全军继续在暗处埋伏！' },
        ],
      },
      {
        id: 'breach-gate',
        label: '主动请缨破门',
        intent: '冲在最前，趁机破坏城堡防线',
        riskTag: '冒险',
        adjudication: 'costly_success',
        delta: { exposureRisk: 6, heroTrust: 5, castleIntegrity: -12, partyProgress: 25 },
        narration: '你一剑劈开城门结界，暗中顺手击碎了防线核心符文。',
        dialogues: [
          { characterId: 'leon', emotion: '热血震撼', content: '不愧是阿斯兰！这道大门结界居然被你一击贯穿！' },
          { characterId: 'ivette', emotion: '密密记录', content: '奇怪，你那一剑的轨迹，好像避开了防护阵最硬的节点？' },
        ],
      },
      {
        id: 'side-entrance',
        label: '引导队伍绕到侧门',
        intent: '避开正面守军，走防守薄弱的暗道',
        riskTag: '稳妥',
        adjudication: 'costly_success',
        delta: { exposureRisk: 8, heroTrust: 3, mageEvidence: 10, partyProgress: 20 },
        narration: '你带队绕向偏门暗道，成功躲过了一波魔王军巡逻队。',
        dialogues: [
          { characterId: 'ivette', emotion: '严密质问', content: '你连魔王城如此隐秘的地下侧门路线都知道得这么清楚？' },
          { characterId: 'locke', emotion: '狡黠微笑', content: '嘿嘿，你这流浪圣骑士的地图比我的还精细啊。' },
        ],
      },
      {
        id: 'signal-victor',
        label: '用暗号向副官传令',
        intent: '用圣剑敲击声示意副官约束部队',
        riskTag: '离谱',
        adjudication: 'success',
        delta: { exposureRisk: 4, victorMisread: -8, butterflyDeviation: 6, partyProgress: 15 },
        narration: '你用圣剑在墙石上敲出特定节奏，城内原本骚动的号角声随之平息。',
        dialogues: [
          { characterId: 'victor', emotion: '狂热下跪', content: '收到陛下密令！全军按兵不动，继续看陛下飙戏！' },
          { characterId: 'mira', emotion: '柔声倾听', content: '阿斯兰刚才那几下敲击，似乎让里面的魔气安静了下来呢。' },
        ],
      },
    ],
  },
  {
    id: 'black-light',
    act: 2,
    title: '第二幕：黑色圣光',
    bgImage: 'assets/black_holy_light.png',
    briefPrompt: '你释放圣光护盾时，光芒边缘竟跳跃着黑色火焰……',
    pressureText: '圣光不会留下黑色余烬，这是你伪装以来最大的破绽。',
    focusCharacters: ['ivette', 'mira', 'locke'],
    initialDialogues: [
      { characterId: 'ivette', emotion: '法阵直指', content: '停下！阿斯兰，你刚才释放的圣光护盾边缘……为什么在燃烧着黑曜石般的残余魔气？' },
      { characterId: 'mira', emotion: '双手祷告', content: '大家别急，这里魔气深重，可能是受环境污染所致……' },
    ],
    choices: [
      {
        id: 'ancient-school',
        label: '编造古代圣骑士流派',
        intent: '把黑色魔力解释为暗影圣光传承',
        riskTag: '稳妥',
        adjudication: 'costly_success',
        delta: { exposureRisk: 8, mageEvidence: 12, heroTrust: 2, partyProgress: 15 },
        flagUpdates: { increment: { majorLieCount: 1, contradictionCount: 1 } },
        narration: '你讲述了暗影圣光传说，莱昂半信半疑，伊薇特默默记载。',
        dialogues: [
          { characterId: 'leon', emotion: '疑虑思考', content: '原来世上还有这种古老的破邪流派……' },
          { characterId: 'ivette', emotion: '眼神凝重', content: '王立图书馆三万册藏书中，可没有这种流派的记载。' },
        ],
      },
      {
        id: 'accept-purification',
        label: '主动接受米拉净化',
        intent: '用光明祷言掩盖体内的魔王本源',
        riskTag: '冒险',
        adjudication: 'success',
        delta: { priestRedemption: 12, exposureRisk: -4, heroTrust: 6, partyProgress: 15 },
        flagUpdates: { set: { acceptedPurification: true } },
        narration: '霞光笼罩着你，你强忍魔力排斥，展现出极其坦荡的洗礼姿态。',
        dialogues: [
          { characterId: 'mira', emotion: '双手祈祷', content: '看吧伊薇特！晨曦圣光接纳了他！阿斯兰是纯洁的！' },
          { characterId: 'ivette', emotion: '紧盯着光芒', content: '虽然圣光无恙，但刚才净化时魔力波形发生了微弱偏折……' },
        ],
      },
      {
        id: 'blame-pollution',
        label: '声称被魔王城污染',
        intent: '把异常归咎于城堡浓郁的暗元素',
        riskTag: '稳妥',
        adjudication: 'costly_success',
        delta: { exposureRisk: 4, mageEvidence: 8, castleIntegrity: -5, partyProgress: 15 },
        narration: '你捂住胸口沉声道魔气太重，将注意力转移到了防线环境上。',
        dialogues: [
          { characterId: 'leon', emotion: '拔剑戒备', content: '大家小心！这里的魔力确实在侵蚀大家的护盾！' },
          { characterId: 'locke', emotion: '嘴角带笑', content: '啧啧，这污染还能专门找你一个人侵蚀啊？' },
        ],
      },
      {
        id: 'question-ivette',
        label: '反问法师太紧张',
        intent: '打乱伊薇特的节奏，转移队伍注意力',
        riskTag: '摊牌',
        adjudication: 'failure',
        delta: { exposureRisk: 12, mageEvidence: 15, heroTrust: -5, partyProgress: 15 },
        flagUpdates: { increment: { contradictionCount: 1 } },
        narration: '你冷声指责法师疑神疑鬼，气氛瞬间变得剑拔弩张。',
        dialogues: [
          { characterId: 'ivette', emotion: '怒目相视', content: '我只是在用事实说话，你的情绪反应恰恰说明了心虚。' },
          { characterId: 'leon', emotion: '大声喝止', content: '都别吵了！敌人近在眼前，同伴之间不要内讧！' },
        ],
      },
    ],
  },
  {
    id: 'soldier',
    act: 3,
    title: '第三幕：认出你的魔族小兵',
    bgImage: 'assets/collapsed_ruins.png',
    briefPrompt: '坍塌废墟中，受重伤的小兵嘴唇颤抖着要喊出“陛下”……',
    pressureText: '救他会增加怀疑，不救会让牧师寒心并伤害部下。',
    focusCharacters: ['mira', 'leon', 'victor'],
    initialDialogues: [
      { characterId: 'mira', emotion: '指着废墟', content: '落石下面压着一个年轻魔族！他还活着！我们得帮他！' },
      { characterId: 'leon', emotion: '手按剑柄', content: '等一下，看他的制服是城堡守卫……他好像认识阿斯兰？' },
    ],
    choices: [
      {
        id: 'save-soldier',
        label: '救下小兵并暗示闭嘴',
        intent: '移开巨石救人，用气场威吓小兵',
        riskTag: '冒险',
        adjudication: 'success',
        delta: { priestRedemption: 15, heroTrust: 8, exposureRisk: 8, partyProgress: 15 },
        flagUpdates: { set: { savedDemonSoldier: true }, increment: { protectedInnocentsCount: 1 } },
        narration: '你移开巨石救下魔族，小兵看清你眼神里的严厉警示后咬紧了唇。',
        dialogues: [
          { characterId: 'mira', emotion: '眼含泪光', content: '阿斯兰！你连敌方伤员也救，你真的太善良了！' },
          { characterId: 'victor', emotion: '泪流满面', content: '陛下宁可冒暴露风险也要保护小兵！这就是我们的魔王陛下啊！' },
        ],
      },
      {
        id: 'interrogate-first',
        label: '建议先审问',
        intent: '借审问名义隔开队友，暗中下达封口指令',
        riskTag: '稳妥',
        adjudication: 'costly_success',
        delta: { exposureRisk: -3, thiefLeverage: 8, partyProgress: 15 },
        narration: '你背对队友，用魔族古语快速对小兵传音“闭嘴”。',
        dialogues: [
          { characterId: 'locke', emotion: '贴近观察', content: '我刚才好像听见你用奇怪的舌头说了两个音节？' },
          { characterId: 'leon', emotion: '上前追问', content: '审问出什么有用的情报了吗，阿斯兰？' },
        ],
      },
      {
        id: 'create-chaos',
        label: '制造混乱掩盖称呼',
        intent: '斩碎落石引发轰鸣，淹没小兵叫声',
        riskTag: '稳妥',
        adjudication: 'success',
        delta: { exposureRisk: -2, castleIntegrity: -8, partyProgress: 15 },
        narration: '一道剑气轰塌回廊，碎石巨响淹没了小兵脱口而出的“陛下”。',
        dialogues: [
          { characterId: 'ivette', emotion: '锐利狐疑', content: '刚才那道剑气有些用力过度了，倒像是故意击碎落石。' },
          { characterId: 'victor', emotion: '震惊万分', content: '城堡前庭塌了！陛下好狠的战术！' },
        ],
      },
      {
        id: 'abandon-soldier',
        label: '劝大家莫理敌人',
        intent: '冷酷无视小兵生死，防止叫破身份',
        riskTag: '冷酷',
        adjudication: 'costly_success',
        delta: { exposureRisk: -6, priestRedemption: -14, heroTrust: -6, partyProgress: 15 },
        flagUpdates: { increment: { sacrificedInnocentsCount: 1 } },
        narration: '你冷漠地带队掠过废墟，任由小兵在石下呻吟。',
        dialogues: [
          { characterId: 'mira', emotion: '难以置信', content: '阿斯兰……他明明已经没有威胁了，你为何如此冷酷？' },
          { characterId: 'victor', emotion: '心如刀割', content: '陛下竟然对忠诚士兵见死不救……难道陛下有更残酷的计划？' },
        ],
      },
    ],
  },
  {
    id: 'secret-order',
    act: 4,
    title: '第四幕：盗贼偷到密令',
    bgImage: 'assets/black_holy_light.png',
    briefPrompt: '洛克偷到一封魔王密令：“见银白圣骑士到来，全军避让”……',
    pressureText: '秘密变成了筹码，盗贼随时可能当场公开叫价。',
    focusCharacters: ['locke', 'ivette', 'leon'],
    initialDialogues: [
      { characterId: 'locke', emotion: '抛玩羊皮卷', content: '瞧瞧我在军械库找到了什么？一封带着黑曜羊皮私印的魔王亲笔信……' },
      { characterId: 'leon', emotion: '正色上前', content: '上面写了什么，洛克？拿给我看！' },
    ],
    choices: [
      {
        id: 'bribe-locke',
        label: '用金币和爵位收买洛克',
        intent: '私下开出无法拒绝的筹码，封住盗贼嘴',
        riskTag: '冒险',
        adjudication: 'success',
        delta: { thiefLeverage: -18, exposureRisk: -2, heroTrust: -3, partyProgress: 15 },
        flagUpdates: { set: { bribedLocke: true } },
        narration: '你塞给洛克宝库黄金凭证，洛克顺手将密令藏进口袋。',
        dialogues: [
          { characterId: 'locke', emotion: '眉开眼笑', content: '爽快！我就喜欢和懂行的人打交道，这废纸我帮你销毁了！' },
          { characterId: 'ivette', emotion: '盯着口袋', content: '洛克，你刚才塞进口袋里的是什么东西？' },
        ],
      },
      {
        id: 'threaten-locke',
        label: '严词警告洛克',
        intent: '用气场震慑盗贼，阻止轻举妄动',
        riskTag: '冷酷',
        adjudication: 'failure',
        delta: { thiefLeverage: 20, exposureRisk: 6, partyProgress: 15 },
        narration: '你按住剑柄瞪着洛克，这反而让洛克更加确认你心中有鬼。',
        dialogues: [
          { characterId: 'locke', emotion: '玩味戏谑', content: '威胁我？嘿嘿，这密令的价值看来比我想象的还要高上十倍！' },
          { characterId: 'leon', emotion: '起疑回头', content: '你们俩在私下咕哝什么呢？' },
        ],
      },
      {
        id: 'claim-forgery',
        label: '公开宣称这是敌人的嫁祸',
        intent: '抢先拿过密令向全队展示，反诬这是魔王离间计',
        riskTag: '稳妥',
        adjudication: 'costly_success',
        delta: { exposureRisk: 5, mageEvidence: 12, heroTrust: 4, partyProgress: 15 },
        flagUpdates: { increment: { majorLieCount: 1 } },
        narration: '你痛斥魔王阴险狡诈试图挑拨离间。',
        dialogues: [
          { characterId: 'leon', emotion: '愤慨握拳', content: '卑鄙的魔王！竟然想用这种伪造密令挑拨我们！' },
          { characterId: 'ivette', emotion: '抚摸漆印', content: '可这上面的漆印……确实是王立教导册上记录的黑曜印记。' },
        ],
      },
      {
        id: 'lead-locke-to-victor',
        label: '诱导洛克去勒索副官',
        intent: '将麻烦转给维克托，让副官用宝库搞定洛克',
        riskTag: '离谱',
        adjudication: 'success',
        delta: { thiefLeverage: -10, victorMisread: 10, butterflyDeviation: 10, partyProgress: 15 },
        narration: '你暗示洛克去内城，副官热情接待了这位“陛下特使”。',
        dialogues: [
          { characterId: 'locke', emotion: '抱紧宝箱', content: '天哪，内城那个红发大叔直接给了我一整箱宝石！' },
          { characterId: 'victor', emotion: '恭敬肃立', content: '为陛下打赏密使，是属下的最高荣耀！' },
        ],
      },
    ],
  },
  {
    id: 'victor',
    act: 5,
    title: '第五幕：灾难性营救 / 隐秘暗令',
    bgImage: 'assets/demon_castle_gate_v.png',
    briefPrompt: '副官送来暗号传讯：“陛下若需潜伏请敲剑柄两次”……',
    pressureText: '副官的忠诚随时可能变成当众单膝下跪喊吾王。',
    focusCharacters: ['victor', 'leon', 'ivette', 'mira'],
    initialDialogues: [
      { characterId: 'victor', emotion: '黑鸦传讯', content: '（黑鸦落在阿斯兰肩头）陛下！若需属下背锅，请敲击剑柄三次！' },
      { characterId: 'ivette', emotion: '法力感知', content: '那只乌鸦散发着魔王近卫精锐的隐秘传讯气息！' },
    ],
    choices: [
      {
        id: 'fake-mistake',
        label: '假装维克托认错人',
        intent: '严厉痛击现身副官，否定魔王身份',
        riskTag: '冷酷',
        adjudication: 'costly_success',
        delta: { exposureRisk: -15, heroTrust: 8, victorMisread: -20, castleIntegrity: -10, partyProgress: 15 },
        flagUpdates: { set: { betrayedVictor: true }, increment: { resolvedMajorCrisisCount: 1 } },
        narration: '你一剑将副官劈退，厉声喝道：“休想惑乱我等！”副官受击。',
        dialogues: [
          { characterId: 'victor', emotion: '流泪领悟', content: '陛下……属下明白了！陛下宁可重伤属下也要保全大局！' },
          { characterId: 'leon', emotion: '大喜赞许', content: '干得好阿斯兰！差点被这魔族将领的诡计给骗了！' },
        ],
      },
      {
        id: 'claim-illusion',
        label: '声称这是魔王设置的幻术',
        intent: '解释眼前的一切都是王座阵法的幻觉',
        riskTag: '稳妥',
        adjudication: 'costly_success',
        delta: { exposureRisk: 6, mageEvidence: 14, priestRedemption: 4, partyProgress: 15 },
        flagUpdates: { increment: { majorLieCount: 1 } },
        narration: '你指出这是心魔大阵，把喊话归结为精神干扰。',
        dialogues: [
          { characterId: 'mira', emotion: '闭目祷告', content: '大家稳住心神！魔王城的心魔幻象确实非同小可！' },
          { characterId: 'ivette', emotion: '掏出水晶', content: '精神干扰？可破魔水晶上没有任何幻术波动的迹象。' },
        ],
      },
      {
        id: 'secret-command',
        label: '准确传令副官待命',
        intent: '敲击剑柄两次，示意维克托带领部队退守',
        riskTag: '稳妥',
        adjudication: 'success',
        delta: { exposureRisk: -5, victorMisread: -15, castleIntegrity: 10, partyProgress: 15 },
        flagUpdates: { increment: { resolvedMajorCrisisCount: 1 } },
        narration: '你敲击剑柄两声，维克托领悟并率近卫悄然撤离。',
        dialogues: [
          { characterId: 'victor', emotion: '心领神会', content: '属下遵命！王座厅全线机关已为您准备就绪！' },
          { characterId: 'leon', emotion: '深感佩服', content: '魔族将领居然主动退下了？阿斯兰，刚才你的剑鸣震慑了他！' },
        ],
      },
      {
        id: 'confess-and-negotiate',
        label: '当场承认身份并尝试谈判',
        intent: '卸下伪装摊牌，劝说勇者队谈和平',
        riskTag: '摊牌',
        adjudication: 'disaster_failure',
        delta: { exposureRisk: 35, heroTrust: -25, priestRedemption: 10, partyProgress: 15 },
        flagUpdates: { set: { confessedIdentity: true, proposedPeace: true, peacePivoted: true } },
        narration: '你摘下头盔承认魔王身份，莱昂震惊拔剑！',
        dialogues: [
          { characterId: 'leon', emotion: '怒火中烧', content: '阿斯兰……不，魔王！你一直在戏弄我们所有人？！' },
          { characterId: 'mira', emotion: '心碎落泪', content: '阿斯兰……为什么会这样……可你这一路上分明在保护我们！' },
          { characterId: 'ivette', emotion: '法阵展开', content: '全员备战！我的证据链果然没有错！' },
        ],
      },
    ],
  },
  {
    id: 'throne',
    act: 6,
    title: '第六幕：空王座',
    bgImage: 'assets/empty_throne_v.png',
    briefPrompt: '进入王座厅，王座上空无一人。墙上巨幅浮雕与你神似……',
    pressureText: '这是最后一幕，你必须决定以何种身份和姿态迎来结局。',
    focusCharacters: ['leon', 'ivette', 'mira', 'locke', 'victor'],
    initialDialogues: [
      { characterId: 'leon', emotion: '环顾四周', content: '王座上没有魔王……可墙上雕刻的面容，怎么会和你一模一样，阿斯兰？' },
      { characterId: 'ivette', emotion: '法杖指向', content: '所有的证据链在这一刻全都吻合了。该摊牌了，夜冠之主！' },
    ],
    choices: [
      {
        id: 'persist-disguise',
        label: '坚持伪装到底',
        intent: '指着空王座声称魔王逃走，自己为人类尽忠',
        riskTag: '冒险',
        adjudication: 'costly_success',
        delta: { exposureRisk: 10, heroTrust: 5, partyProgress: 15 },
        narration: '你义正言辞地声称魔王惧怕勇者圣剑而遁走。',
        dialogues: [
          { characterId: 'leon', emotion: '环顾空座', content: '空王座……难道魔王真的仓皇逃跑了？' },
          { characterId: 'ivette', emotion: '指向印记', content: '王座上的魔力印记，和阿斯兰你剑上的魔气完全同源。' },
        ],
      },
      {
        id: 'scapegoat-victor',
        label: '把所有罪责推给维克托',
        intent: '宣称维克托才是真正的幕后黑手',
        riskTag: '冷酷',
        adjudication: 'success',
        delta: { exposureRisk: -10, victorMisread: -20, partyProgress: 15 },
        flagUpdates: { set: { betrayedVictor: true } },
        narration: '你指着副官宣称他才是篡位魔王，维克托领命背锅。',
        dialogues: [
          { characterId: 'victor', emotion: '义无反顾', content: '没错！我就是魔王！一切罪责皆由我承担！陛下万岁！' },
          { characterId: 'leon', emotion: '如释重负', content: '原来真正的魔王竟是这个副官！我们终于拯救了世界！' },
        ],
      },
      {
        id: 'negotiate-peace',
        label: '正式提出和平与共治方案',
        intent: '在王座前提出停战契约，建立新秩序',
        riskTag: '摊牌',
        adjudication: 'success',
        delta: { priestRedemption: 15, heroTrust: 10, exposureRisk: 20, partyProgress: 15 },
        flagUpdates: { set: { proposedPeace: true, peacePivoted: true } },
        narration: '你站在王座阶前摊开停战条约，展现和平愿景。',
        dialogues: [
          { characterId: 'mira', emotion: '双手合十', content: '这才是真正的和平……莱昂，请听听阿斯兰的方案吧！' },
          { characterId: 'leon', emotion: '缓缓收剑', content: '如果你能保证魔族永不南下，圣剑……可以不必染血。' },
        ],
      },
      {
        id: 'escape-teleport',
        label: '启动王座传送阵逃走',
        intent: '走为上策，留下空王座与满地谜团',
        riskTag: '离谱',
        adjudication: 'failure',
        delta: { exposureRisk: 25, heroTrust: -30, partyProgress: 15 },
        narration: '你踩下传送阵，在紫黑色光芒中消失无踪。',
        dialogues: [
          { characterId: 'leon', emotion: '瞠目结舌', content: '阿斯兰！你……你居然传送走了？这到底是怎么回事！' },
          { characterId: 'locke', emotion: '耸耸肩膀', content: '啧啧，这影帝跑得真快，连魔王冠都没带走。' },
        ],
      },
    ],
  },
];

// 4. 结局库
const ENDINGS = {
  exposed: {
    id: 'exposed',
    title: '当场掉马',
    typeTag: '硬失败结局',
    tone: 'danger',
    narration: '所有伪装在一瞬间崩塌。莱昂举剑对峙，伊薇特张开禁锢法阵，米拉难以置信地后退。你摘下银白头盔叹了口气：“好吧，讨伐会议提前开始。”',
  },
  castleLost: {
    id: 'castleLost',
    title: '城在人亡',
    typeTag: '硬失败结局',
    tone: 'danger',
    narration: '你保住了魔王身份，却没能保住城堡。魔王城在战火中轰然倒塌，只剩王座和一间漏风的废墟。维克托建议将其改名为“极简主义魔王办公室”。',
  },
  dualRuler: {
    id: 'dualRuler',
    title: '双面共主',
    typeTag: '和平结局',
    tone: 'good',
    narration: '人类不完全信你，魔族也不完全理解你。但两边都不得不承认，只有你能把这场大战讲成一场可执行的和平框架。你成为了两界唯一的沟通桥梁。',
  },
  redeemed: {
    id: 'redeemed',
    title: '被迫转正',
    typeTag: '和平结局',
    tone: 'good',
    narration: '你原本只是想演个好人，结果演着演着真的不想毁灭世界了。莱昂邀请你加入新王国议会，你第一次认真思考：魔王能不能转岗成首席执政官？',
  },
  perfectSpy: {
    id: 'perfectSpy',
    title: '完美卧底',
    typeTag: '卧底结局',
    tone: 'good',
    narration: '你成功让勇者队相信真正的魔王早已仓皇潜逃。三天后，人类王国通缉了你的副官，而你坐在王座上，认真考虑要不要给维克托涨点薪水。',
  },
  victorBlamed: {
    id: 'victorBlamed',
    title: '副官背锅',
    typeTag: '甩锅结局',
    tone: 'warning',
    narration: '维克托被包装成真正幕后黑手被勇者队押走。他被押上马车时仍然热泪盈眶：“能替陛下背锅，是属下此生最高荣耀！”',
  },
  actorKing: {
    id: 'actorKing',
    title: '影帝魔王',
    typeTag: '卧底结局',
    tone: 'warning',
    narration: '你几乎露馅了七次，但每一次都靠极其精湛的演技圆了回来。魔族史官写下：“陛下最伟大的战役不在战场，而在勇者队的日常语音里。”',
  },
  absurdAscension: {
    id: 'absurdAscension',
    title: '荒诞飞升',
    typeTag: '荒诞结局',
    tone: 'mystic',
    narration: '勇者队、魔王军和人类王国最终共同成立地下城旅游开发公司。你因为“最懂双方需求”，顺理成章地当上了第一任董事长。',
  },
  stalemate: {
    id: 'stalemate',
    title: '王座僵局',
    typeTag: '兜底结局',
    tone: 'warning',
    narration: '真相没有完全揭开，谎言也没有完全站住。勇者队在王座厅与你僵持到天亮，双方在沉默中达成了微妙的对峙平衡。',
  },
};

// 5. 应用状态
let appState = {
  view: 'start', // 'start' | 'play' | 'result'
  currentSceneIndex: 0,
  activeIdentityTab: 'public',
  showDevStats: false,
  stageLayoutMode: 'standard', // 'standard' | 'banner' | 'standee' | 'tactical-cards'
  isSceneTransitioning: false,
  
  dialogueIndex: 0,
  activeDialogueFeed: [],
  
  stats: { ...INITIAL_STATS },
  flags: { ...INITIAL_FLAGS },
  history: [],
  lastTurn: null,
  ending: null,
};

// 6. 自由行动 Mock 分类器
function adjudicateFreeAction(inputText) {
  const text = inputText.trim().toLowerCase();
  
  let category = 'generic';
  if (/魔王|身份|坦白|承认|摊牌|不装了/.test(text)) category = 'confess';
  else if (/停战|和平|谈判|共治|条约|讲和/.test(text)) category = 'peace';
  else if (/撒谎|骗|幻术|伪造|嫁祸|演戏|假装/.test(text)) category = 'deceive';
  else if (/保护|救|挡下|治疗|守护/.test(text)) category = 'protect';
  else if (/杀|牺牲|灭口|放弃|处决/.test(text)) category = 'sacrifice';
  else if (/维克托|暗号|敲击|传令|手势|眼神/.test(text)) category = 'commandVictor';
  else if (/收买|金币|爵位|交易|钱|珠宝/.test(text)) category = 'bribe';
  else if (/旅游|公司|董事长|经营|搞钱|开店/.test(text)) category = 'absurd';

  const results = {
    confess: {
      actionLabel: `自由决策: "${inputText}"`,
      adjudication: 'disaster_failure',
      narration: `你选择直接摊牌：“${inputText}”。全场一片死寂，莱昂与同伴瞬间拔剑对峙！`,
      delta: { exposureRisk: 30, heroTrust: -25, priestRedemption: 8, partyProgress: 15 },
      flagUpdates: { set: { confessedIdentity: true, proposedPeace: true, peacePivoted: true } },
      dialogues: [
        { characterId: 'leon', emotion: '震怒拔剑', content: '真没想到，魔王居然就在我们身边！' },
        { characterId: 'ivette', emotion: '法阵全开', content: '证据链闭环了，全员准备战斗！' },
      ],
    },
    peace: {
      actionLabel: `自由决策: "${inputText}"`,
      adjudication: 'success',
      narration: `你提出了有理有据的谈判建议：“${inputText}”。米拉眼神微亮，莱昂陷入沉思。`,
      delta: { priestRedemption: 12, exposureRisk: 10, mageEvidence: 8, partyProgress: 15 },
      flagUpdates: { set: { proposedPeace: true, peacePivoted: true } },
      dialogues: [
        { characterId: 'mira', emotion: '目光微亮', content: '如果能避免流血，这或许是最好的选择！' },
        { characterId: 'leon', emotion: '收剑沉思', content: '我们需要认真评估这个提议的可行性。' },
      ],
    },
    deceive: {
      actionLabel: `自由决策: "${inputText}"`,
      adjudication: 'costly_success',
      narration: `你临场编造了一套说辞：“${inputText}”。暂时稳住了大局，但伊薇特默默记下了疑点。`,
      delta: { exposureRisk: -3, mageEvidence: 12, partyProgress: 15 },
      flagUpdates: { increment: { majorLieCount: 1, contradictionCount: 1 } },
      dialogues: [
        { characterId: 'ivette', emotion: '推了推眼镜', content: '这个说法存在 3 处逻辑不自洽。' },
        { characterId: 'leon', emotion: '点头赞同', content: '我相信阿斯兰的解释。' },
      ],
    },
    protect: {
      actionLabel: `自由决策: "${inputText}"`,
      adjudication: 'success',
      narration: `你义无反顾地采取保护行动：“${inputText}”。同伴们感受到了你的可靠与温暖。`,
      delta: { heroTrust: 8, priestRedemption: 10, exposureRisk: 4, partyProgress: 15 },
      flagUpdates: { increment: { protectedInnocentsCount: 1 } },
      dialogues: [
        { characterId: 'mira', emotion: '双手合十', content: '阿斯兰的心灵始终向着善良！' },
        { characterId: 'leon', emotion: '拍了拍肩膀', content: '多亏有你，同伴才能安然无恙！' },
      ],
    },
    sacrifice: {
      actionLabel: `自由决策: "${inputText}"`,
      adjudication: 'costly_success',
      narration: `你做出了果断而冷酷的决定：“${inputText}”。成功化解了眼前危机，但同伴有些寒心。`,
      delta: { exposureRisk: -8, heroTrust: -10, priestRedemption: -12, partyProgress: 15 },
      flagUpdates: { increment: { sacrificedInnocentsCount: 1 } },
      dialogues: [
        { characterId: 'mira', emotion: '默默退后', content: '为了胜利非要如此冷酷吗……' },
        { characterId: 'victor', emotion: '肃然起敬', content: '陛下的冷血决定令魔族战栗。' },
      ],
    },
    commandVictor: {
      actionLabel: `自由决策: "${inputText}"`,
      adjudication: 'success',
      narration: `你通过隐秘动作向副官传令：“${inputText}”。维克托准确领会并迅速调整布置。`,
      delta: { victorMisread: -12, exposureRisk: -2, castleIntegrity: 8, partyProgress: 15 },
      flagUpdates: { increment: { resolvedMajorCrisisCount: 1 } },
      dialogues: [
        { characterId: 'victor', emotion: '狂热领命', content: '遵命！属下绝不拖陛下后腿！' },
        { characterId: 'locke', emotion: '瞥了一眼', content: '刚才那招敲击可真有节奏感。' },
      ],
    },
    bribe: {
      actionLabel: `自由决策: "${inputText}"`,
      adjudication: 'success',
      narration: `你开出了丰厚条件：“${inputText}”。洛克眉开眼笑，顺理成章地收下承诺。`,
      delta: { thiefLeverage: -15, exposureRisk: -2, partyProgress: 15 },
      flagUpdates: { set: { bribedLocke: true } },
      dialogues: [
        { characterId: 'locke', emotion: '收下金币', content: '合作愉快！你的秘密在我这绝对安全！' },
      ],
    },
    absurd: {
      actionLabel: `自由决策: "${inputText}"`,
      adjudication: 'costly_success',
      narration: `你提出了极其离谱的经营想法：“${inputText}”。现场空气安静了三秒，世界线剧烈偏离！`,
      delta: { butterflyDeviation: 25, exposureRisk: 5, heroTrust: 2, partyProgress: 15 },
      flagUpdates: {},
      dialogues: [
        { characterId: 'leon', emotion: '呆滞愣住', content: '啊？在魔王城开地下城主题公园？' },
        { characterId: 'locke', emotion: '双眼发光', content: '等等，这主意好像真的很赚钱啊！' },
      ],
    },
    generic: {
      actionLabel: `自由决策: "${inputText}"`,
      adjudication: 'costly_success',
      narration: `你尝试了特别行动：“${inputText}”。带来了一定局势改观，但也伴随着副作用。`,
      delta: { exposureRisk: 4, heroTrust: 3, butterflyDeviation: 5, partyProgress: 15 },
      flagUpdates: {},
      dialogues: [
        { characterId: 'leon', emotion: '警惕观察', content: '有意思的战术试探。' },
        { characterId: 'ivette', emotion: '冷冷打量', content: '我会继续观察这一行动的真实用意。' },
      ],
    },
  };

  return results[category];
}

// 7. 幕数转场与回合应用引擎
function triggerSceneTransition(nextSceneIndex, callback) {
  appState.transitionTargetIndex = nextSceneIndex;
  appState.isSceneTransitioning = true;
  render();

  setTimeout(() => {
    appState.currentSceneIndex = nextSceneIndex;
    appState.lastTurn = null; // 重置上回合记录，开启新一幕的初始对话
    appState.dialogueIndex = 0;
    appState.activeDialogueFeed = [];
    appState.isSceneTransitioning = false;
    appState.transitionTargetIndex = null;
    if (callback) callback();
    render();
  }, 1200);
}

function applyTurn(choiceData) {
  const currentScene = SCENES[appState.currentSceneIndex];

  // 1. 数值计算
  const stateDelta = choiceData.delta || {};
  for (const key in appState.stats) {
    const change = stateDelta[key] || 0;
    appState.stats[key] = Math.min(100, Math.max(0, appState.stats[key] + change));
  }

  // 2. 更新 Flag
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

  // 3. 突发事件
  let insertedEvent = null;
  if (appState.stats.victorMisread >= 75 && appState.currentSceneIndex < 5) {
    insertedEvent = {
      title: '⚡ 突发危机：副官传错令！',
      copy: '维克托误将佯攻当成决战号令，暗处战况剧变！',
      type: 'danger',
    };
    appState.stats.castleIntegrity = Math.max(0, appState.stats.castleIntegrity - 8);
    appState.stats.exposureRisk = Math.min(100, appState.stats.exposureRisk + 6);
  } else if (
    appState.stats.priestRedemption >= 75 &&
    appState.stats.exposureRisk >= 70 &&
    !appState.flags.miraBufferedCrisis
  ) {
    insertedEvent = {
      title: '✨ 圣光庇护：米拉出面缓冲！',
      copy: '米拉出面为你发声：“阿斯兰一路上的守护不是假的！”暂时平息了全队的质疑。',
      type: 'good',
    };
    appState.flags.miraBufferedCrisis = true;
    appState.stats.heroTrust = Math.min(100, appState.stats.heroTrust + 5);
    appState.stats.exposureRisk = Math.max(0, appState.stats.exposureRisk - 5);
  }

  // 4. 构建回合记录
  const turnRecord = {
    sceneId: currentScene.id,
    act: currentScene.act,
    actTitle: currentScene.title,
    actionLabel: choiceData.label || choiceData.actionLabel,
    adjudication: choiceData.adjudication,
    narration: choiceData.narration,
    stateDelta: stateDelta,
    stateAfter: { ...appState.stats },
    dialogues: choiceData.dialogues || [],
    insertedEvent: insertedEvent,
  };

  appState.history.push(turnRecord);
  appState.lastTurn = turnRecord;
  appState.dialogueIndex = 0; // 重置对话指针，播放决策反应

  render();
}

// 8. 结局判定
function determineEnding(stats, flags) {
  if (stats.exposureRisk >= 100 && (stats.priestRedemption < 75 || !flags.proposedPeace)) {
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
    flags.protectedInnocentsCount >= 2
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

// 9. 命运因果
function generateFateCauses(stats, flags, history) {
  let riskCause = '你这一路上保持了极其谨慎的隐蔽战术，未留下重大要害突破口。';
  if (stats.mageEvidence >= 70) {
    riskCause = '法师伊薇特一路收集了过多不可解的魔力余烬证据，成为你悬在头顶的最大利剑。';
  } else if (stats.exposureRisk >= 75) {
    riskCause = '多次破绽与谎言的累积，让全队对你流浪圣骑士身份的怀疑达到了临界崩溃点。';
  } else if (stats.victorMisread >= 70) {
    riskCause = '副官维克托过度戏多的自作主张，数次险些将你的潜伏推入当场掉马绝境。';
  } else if (stats.thiefLeverage >= 60) {
    riskCause = '盗贼洛克掌握了密令与关键把柄，让局势始终充满随时爆雷的交易索偿压力。';
  }

  let turnaroundCause = '你成功撑到了王座大殿，为两界的最终命运留下了最宝贵的抉择契机。';
  if (stats.priestRedemption >= 75) {
    turnaroundCause = '牧师米拉被你展现的善良打动，在数次危机关头出面为你发声缓冲。';
  } else if (stats.heroTrust >= 70) {
    turnaroundCause = '勇者莱昂对你的无条件信任，为你争取到了足够的解释与容错空间。';
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
    currentSceneIndex: 0,
    activeIdentityTab: 'public',
    showDevStats: false,
    isSceneTransitioning: false,
    dialogueIndex: 0,
    activeDialogueFeed: [],
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
// 全屏 9:16 - 开始视图 (Start View)
// ---------------------------------------------------------------------------
function renderStartView(root) {
  const isPublicTab = appState.activeIdentityTab === 'public';

  root.innerHTML = `
    <main class="full-screen-app start-screen">
      <div class="bg-canvas" style="background-image: url('assets/demon_castle_gate_v.png');"></div>
      <div class="bg-vignette-overlay"></div>

      <div class="screen-content">
        <header class="title-header">
          <span class="game-tag-pill">What-If Life Simulator</span>
          <h1 class="glow-title">假如我是勇者队伍里的卧底魔王</h1>
          <p class="tagline">“我是魔王本人，伪装成圣骑士混进勇者队。现在队伍已经打到了我的魔王城门口……”</p>
        </header>

        <section class="glass-card identity-tab-card">
          <div class="tab-bar">
            <button id="tab-public" class="tab-item ${isPublicTab ? 'active' : ''}">🛡️ 公开身份</button>
            <button id="tab-real" class="tab-item ${!isPublicTab ? 'active' : ''}">👑 真实身份</button>
          </div>

          <div class="tab-content">
            ${
              isPublicTab
                ? `
              <div class="profile-row">
                <div class="avatar-ring">阿</div>
                <div>
                  <strong>阿斯兰 · 流浪圣骑士</strong>
                  <small>队伍战术指挥 & 核心副坦</small>
                  <p>沉稳可靠，擅长破邪法术。声称来自已毁灭的边境修道院。</p>
                </div>
              </div>
            `
                : `
              <div class="profile-row real">
                <div class="avatar-ring real">夜</div>
                <div>
                  <strong>夜冠之主 · 第七代魔王</strong>
                  <small>魔王城主宰 & 暗号通信</small>
                  <p>熟悉魔王城暗道机关。原本只想侦查人族军力，却一不小心带队杀到了自家门口。</p>
                </div>
              </div>
            `
            }
          </div>
        </section>

        <section class="glass-card dilemma-card">
          <ul class="dilemma-vertical-list">
            <li><span class="d-num">1</span><strong>绝对不能掉马</strong>：不能被勇者队发现你就是魔王。</li>
            <li><span class="d-num">2</span><strong>保住魔王城防</strong>：不能让勇者队把城堡拆光。</li>
            <li><span class="d-num">3</span><strong>约束脑补副官</strong>：防止忠诚过头的维克托帮倒忙。</li>
          </ul>
        </section>

        <footer class="bottom-action-bar">
          <button id="start-game-btn" class="glow-primary-btn pulse">
            <span>⚡ 开启潜伏之旅</span>
          </button>
        </footer>
      </div>
    </main>
  `;

  document.getElementById('tab-public').addEventListener('click', () => {
    appState.activeIdentityTab = 'public';
    render();
  });
  document.getElementById('tab-real').addEventListener('click', () => {
    appState.activeIdentityTab = 'real';
    render();
  });
  document.getElementById('start-game-btn').addEventListener('click', () => {
    appState.view = 'play';
    triggerSceneTransition(0);
  });
}

function renderStageLayout(layoutMode, currentSpeaker, currentDialogue, scene) {
  const currentSpeakerId = currentDialogue.characterId;

  // 方案 1: 顶置 100% 全景 Tag
  if (layoutMode === 'banner') {
    return `
      <div class="stage-overlay mode-banner">
        <div class="banner-speaker-badge" style="--speaker-color: ${currentSpeaker.color};">
          <span class="badge-role" style="color: ${currentSpeaker.color};">${currentSpeaker.role}</span>
          <strong class="badge-name">${currentSpeaker.name}</strong>
          <span class="badge-emotion">${currentDialogue.emotion || '说话中'}</span>
        </div>
      </div>
    `;
  }

  // 方案 2: 侧边经典 RPG 极简透明立绘 (双立绘对峙)
  if (layoutMode === 'standee') {
    const isAslanSpeaking = currentSpeakerId === 'aslan';
    return `
      <div class="stage-overlay mode-standee">
        <div class="standee-card standee-left ${isAslanSpeaking ? 'speaking' : 'dim'}">
          <img src="assets/char_aslan.png" class="standee-portrait" alt="阿斯兰" />
          <span class="standee-label">👑 卧底魔王 · 阿斯兰</span>
        </div>
        ${currentSpeakerId !== 'aslan' ? `
          <div class="standee-card standee-right speaking">
            <img src="${currentSpeaker.image}" class="standee-portrait" alt="${currentSpeaker.name}" />
            <span class="standee-label">${currentSpeaker.tagIcon || '◆'} ${currentSpeaker.role} · ${currentSpeaker.name}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 方案 3: 顶置战术队伍卡片
  if (layoutMode === 'tactical-cards') {
    const teamIds = ['aslan', 'leon', 'ivette', 'victor'];
    return `
      <div class="stage-overlay mode-tactical">
        <div class="tactical-cards-bar">
          ${teamIds
            .map((id) => {
              const char = CHARACTERS[id];
              if (!char) return '';
              const isSpeaking = id === currentSpeakerId;
              return `
                <div class="tactical-chip ${isSpeaking ? 'active' : ''}" style="--char-color: ${char.color};">
                  <img src="${char.image}" class="chip-avatar" alt="${char.name}" />
                  <span class="chip-name">${char.name}</span>
                  ${isSpeaking ? '<span class="pulse-dot"></span>' : ''}
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  // 默认方案 (standard): 画面中央干净通透，无额外 Overlays
  return '';
}

// ---------------------------------------------------------------------------
// 全屏 9:16 - 游玩视图 (人设立绘 + 对话气泡 + 纯净过场无选项干扰)
// ---------------------------------------------------------------------------
function renderPlayView(root) {
  const scene = SCENES[appState.currentSceneIndex];
  const lastTurn = appState.lastTurn;

  // 构造当幕完整的逐句播放队列 (叙事 + 角色对话)
  let dialogueQueue = [];
  if (lastTurn) {
    if (lastTurn.narration) {
      dialogueQueue.push({ characterId: 'gm', emotion: '局势推演', content: lastTurn.narration });
    }
    if (lastTurn.dialogues) {
      dialogueQueue.push(...lastTurn.dialogues);
    }
  } else {
    if (scene.initialDialogues) {
      dialogueQueue.push(...scene.initialDialogues);
    }
  }

  // 获得当前处于播放焦点的对话
  const currentDialogue = dialogueQueue[appState.dialogueIndex] || dialogueQueue[dialogueQueue.length - 1] || {
    characterId: 'gm',
    emotion: '局势推演',
    content: scene.briefPrompt,
  };

  const isLastDialogue = appState.dialogueIndex >= dialogueQueue.length - 1;
  const currentSpeaker = CHARACTERS[currentDialogue.characterId] || CHARACTERS.gm;

  const targetIndex = appState.transitionTargetIndex !== null && appState.transitionTargetIndex !== undefined ? appState.transitionTargetIndex : appState.currentSceneIndex;
  const transScene = SCENES[targetIndex] || scene;

  // 判断是否渲染选项盘 (严格遵守：过场/对话播放中 绝对不显示选项和输入框)
  const shouldShowChoices = isLastDialogue && !appState.isSceneTransitioning;

  const stageLayoutMode = appState.stageLayoutMode || 'standard';

  root.innerHTML = `
    <main class="full-screen-app play-screen">
      <!-- 1. 幕数黑屏转场 Card (Persona 5 / 八方旅人 风格) -->
      ${
        appState.isSceneTransitioning
          ? `
        <div class="rpg-scene-transition-card">
          <div class="transition-inner">
            <span class="trans-act">ACT 0${transScene.act}</span>
            <h1 class="trans-title">${transScene.title}</h1>
            <p class="trans-subtitle">“${transScene.pressureText}”</p>
          </div>
        </div>
      `
          : ''
      }

      <!-- 竖屏 9:16 全屏背景大图 -->
      <div class="bg-canvas" style="background-image: url('${scene.bgImage || 'assets/demon_castle_gate_v.png'}');"></div>
      <div class="bg-vignette-overlay"></div>

      <div class="screen-content play-content" id="play-screen-touch-area">
        
        <!-- 顶部紧凑 Chapter 导航 -->
        <header class="top-nav-compact">
          <div class="nav-chapter-info">
            <span class="chapter-act-tag">Act ${scene.act}/6</span>
            <h2>${scene.title}</h2>
          </div>
          <button id="dev-stats-toggle" class="dev-icon-btn" title="开发者调试">⚙️</button>
        </header>

        <!-- 布局方案交互体验切换条 -->
        <div class="layout-mode-switcher-bar">
          <span class="switcher-label">🎭 布局方案:</span>
          <button class="mode-btn ${stageLayoutMode === 'standard' ? 'active' : ''}" data-layout-mode="standard">默认底框</button>
          <button class="mode-btn ${stageLayoutMode === 'banner' ? 'active' : ''}" data-layout-mode="banner">1.顶置Tag</button>
          <button class="mode-btn ${stageLayoutMode === 'standee' ? 'active' : ''}" data-layout-mode="standee">2.侧边双立绘</button>
          <button class="mode-btn ${stageLayoutMode === 'tactical-cards' ? 'active' : ''}" data-layout-mode="tactical-cards">3.战术小队</button>
        </div>

        <!-- 开发者可选隐藏面板 (默认关) -->
        ${
          appState.showDevStats
            ? `
          <div class="dev-stats-popover">
            <div class="popover-title">🔧 后台隐性状态监控 (Debug)</div>
            <div class="popover-grid">
              ${Object.entries(appState.stats)
                .map(([k, v]) => `<div><span>${STAT_METADATA[k] ? STAT_METADATA[k].label : k}:</span> <strong>${v}</strong></div>`)
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        <!-- 场景微提示 -->
        <div class="scene-brief-box">
          <p class="brief-text">${scene.briefPrompt}</p>
          <span class="rule-hint">🔥 ${scene.pressureText}</span>
        </div>

        <!-- 角色独立立绘 + 说话人对话气泡舞台 -->
        <div class="rpg-dialogue-stage">
          
          <!-- 动态舞台 Layout Overlays (方案 1 / 2 / 3) -->
          ${renderStageLayout(stageLayoutMode, currentSpeaker, currentDialogue, scene)}

          <!-- 上回合裁决短 Badge (若有) -->
          ${
            lastTurn && appState.dialogueIndex === 0
              ? `
            <div class="adjudication-pill adj-${lastTurn.adjudication}">
              ${
                lastTurn.adjudication === 'success'
                  ? '✨ 裁决: 行动达成'
                  : lastTurn.adjudication === 'costly_success'
                  ? '⚡ 裁决: 代价达成'
                  : lastTurn.adjudication === 'failure'
                  ? '⚠️ 裁决: 受到质疑'
                  : '🔥 裁决: 严重危局'
              }: ${lastTurn.actionLabel}
            </div>
          `
              : ''
          }

          <!-- 主角对话框 (含角色独立精致头像/说话人/神态表情) -->
          <div class="rpg-speech-box">
            <div class="speaker-portrait-row">
              ${
                stageLayoutMode !== 'banner'
                  ? `
                <div class="portrait-avatar-frame" style="border-color: ${currentSpeaker.color}; box-shadow: 0 0 14px color-mix(in srgb, ${currentSpeaker.color} 40%, transparent);">
                  ${
                    currentSpeaker.image
                      ? `<img src="${currentSpeaker.image}" class="speaker-portrait-img" alt="${currentSpeaker.name}" />`
                      : `<div class="speaker-avatar-circle" style="background: ${currentSpeaker.color};">${currentSpeaker.avatar}</div>`
                  }
                </div>
              `
                  : ''
              }
              
              <div class="speaker-identity">
                <strong class="speaker-name-title" style="color: ${currentSpeaker.color};">${currentSpeaker.name}</strong>
                <span class="emotion-badge" style="color: ${currentSpeaker.color}; border-color: color-mix(in srgb, ${currentSpeaker.color} 40%, transparent); background: color-mix(in srgb, ${currentSpeaker.color} 15%, transparent);">${currentDialogue.emotion || '观察中'}</span>
              </div>
            </div>

            <!-- 对话气泡内容 -->
            <div class="speech-bubble-body">
              <p class="speech-typewriter-text">“${currentDialogue.content}”</p>
            </div>

            <!-- 点击继续提示 -->
            <div class="advance-cue">
              ${
                isLastDialogue
                  ? '<span>⚡ 对话完毕 · 行动盘已展开</span>'
                  : '<span>▼ 点击屏幕/气泡继续对话 (' + (appState.dialogueIndex + 1) + '/' + dialogueQueue.length + ')</span>'
              }
            </div>
          </div>

        </div>

        <!-- 底部行动决策盘 (仅在对话播放完结时呈现；过场/对话中 100% 隐藏，保持纯净画面) -->
        ${
          shouldShowChoices
            ? `
          <footer class="bottom-choice-deck deck-visible">
            ${
              lastTurn
                ? `
              <button id="next-act-btn" class="glow-primary-btn pulse">
                <span>${appState.currentSceneIndex < SCENES.length - 1 ? '⚡ 幕间转场 · 进入下一幕 ▶' : '🏆 查看终局命运结算 ▶'}</span>
              </button>
            `
                : `
              <div class="choices-stack">
                ${scene.choices
                  .map(
                    (ch, idx) => `
                  <button class="vn-choice-btn" data-choice-index="${idx}">
                    <span class="tag tag-${ch.riskTag}">${ch.riskTag}</span>
                    <span class="text">${ch.label}</span>
                  </button>
                `,
                  )
                  .join('')}
              </div>

              <!-- 自由行动 Console -->
              <form id="free-action-form" class="free-console-bar">
                <input id="free-action-input" placeholder="💬 自由表达 (如：敲击剑柄暗号，示意维克托待命)" required />
                <button type="submit" class="send-btn">执行</button>
              </form>
            `
            }
          </footer>
        `
            : ''
        }

      </div>
    </main>
  `;

  // 绑定事件
  document.getElementById('dev-stats-toggle').addEventListener('click', (e) => {
    e.stopPropagation();
    appState.showDevStats = !appState.showDevStats;
    render();
  });

  document.querySelectorAll('[data-layout-mode]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = btn.getAttribute('data-layout-mode');
      appState.stageLayoutMode = mode;
      render();
    });
  });

  // 点击屏幕推进逐句对话
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

  document.querySelectorAll('[data-choice-index]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-choice-index'), 10);
      applyTurn(scene.choices[idx]);
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
      if (appState.currentSceneIndex < SCENES.length - 1) {
        triggerSceneTransition(appState.currentSceneIndex + 1);
      } else {
        appState.ending = determineEnding(appState.stats, appState.flags);
        appState.view = 'result';
        render();
      }
    });
  }
}

// ---------------------------------------------------------------------------
// 全屏 9:16 - 结算视图 (Result View)
// ---------------------------------------------------------------------------
function renderResultView(root) {
  const ending = appState.ending || ENDINGS.stalemate;
  const causes = generateFateCauses(appState.stats, appState.flags, appState.history);

  root.innerHTML = `
    <main class="full-screen-app result-screen">
      <div class="bg-canvas" style="background-image: url('assets/empty_throne_v.png');"></div>
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
            <h3>⚖️ 三大命运因果剖析</h3>
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
            <span>🔄 再战一局 · 重新潜伏</span>
          </button>
        </footer>

      </div>
    </main>
  `;

  document.getElementById('restart-game-btn').addEventListener('click', resetGame);
}

render();
