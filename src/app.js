// ---------------------------------------------------------------------------
// 《假如我是勇者队伍里的卧底魔王》- 100% 相对路径 + 电影海报级全屏首屏 + JRPG 金边对话框
// ---------------------------------------------------------------------------

// 1. 初始数值状态
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

// 2. 核心角色与相对路径透明背景抠图立绘
const CHARACTERS = {
  aslan: { name: '阿斯兰', role: '卧底魔王', avatar: '魔', image: './assets/char_aslan.png', knightImage: './assets/char_aslan_knight.png', color: '#c77dff', tagIcon: '👑', desc: '第七代魔王 · 伪装成圣骑士' },
  leon: { name: '莱昂', role: '勇者', avatar: '勇', image: './assets/char_leon.png', color: '#f0a202', tagIcon: '⚔️', desc: '队伍战术核心 · 信任但重原则' },
  ivette: { name: '伊薇特', role: '法师', avatar: '法', image: './assets/char_ivette.png', color: '#64dfdf', tagIcon: '🔮', desc: '王立智囊 · 密密记录疑点证据' },
  mira: { name: '米拉', role: '牧师', avatar: '牧', image: './assets/char_mira.png', color: '#9ddf9a', tagIcon: '✨', desc: '晨曦圣女 · 柔声调解与救赎' },
  locke: { name: '洛克', role: '盗贼', avatar: '盗', image: './assets/char_locke.png', color: '#ffb703', tagIcon: '🗡️', desc: '情报贩子 · 手捏密令索求筹码' },
  victor: { name: '维克托', role: '副官', avatar: '副', image: './assets/char_victor.png', color: '#ef476f', tagIcon: '🏰', desc: '魔王城亲卫队长 · 脑补下大棋' },
  gm: { name: '旁白推演', role: '系统局势', avatar: '📜', image: './assets/char_aslan.png', color: '#f0c36a', tagIcon: '💬', desc: '魔王内心独白 & 局势推演' },
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

// 3. 9大场地与9幕剧本 (全部使用相对路径 ./assets/...)
const SCENES = [
  {
    id: 'gate',
    act: 1,
    locationName: '魔王城正面大门',
    title: '第一幕：城门前的安静',
    bgImage: './assets/demon_castle_gate_v.png',
    briefPrompt: '魔王城门半开，城内传来三短一长的熟悉号角声……',
    pressureText: '你极其熟悉这里，但绝不能表现得比本地魔族还熟。',
    focusStats: ['exposureRisk', 'heroTrust', 'mageEvidence', 'victorMisread'],
    focusCharacters: ['leon', 'ivette', 'victor'],
    initialDialogues: [
      { characterId: 'leon', emotion: '观察警惕', content: '奇怪……魔王城门大开且空无一人，难道是有什么致命陷阱？' },
      { characterId: 'ivette', emotion: '法杖凝光', content: '大家停下！我隐约感知到了伏兵的魔力波幅……阿斯兰，你怎么看？' },
      { characterId: 'aslan', emotion: '暗中思索', content: '（握紧圣剑剑柄）城内的号角声是维克托给我的信号。我必须给队伍一个战术理由，同时向城内传达待命暗号。' },
    ],
    choices: [
      {
        id: 'scout-first',
        label: '劝队伍先侦查',
        intent: '拖慢推进速度，保持战术合理性',
        riskTag: '稳妥',
        adjudication: 'success',
        delta: { exposureRisk: -3, heroTrust: 4, victorMisread: 5, partyProgress: 10 },
        narration: '你沉稳地建议谨慎战术，莱昂赞同地点了点头。',
        dialogues: [
          { characterId: 'leon', emotion: '沉稳认可', content: '阿斯兰说的对，魔王城大门前必须万分小心！' },
          { characterId: 'ivette', emotion: '眼神冰冷', content: '奇怪，你似乎提前知道城门附近没有伏兵法阵？' },
          { characterId: 'victor', emotion: '热泪盈眶', content: '收到！陛下示意暂缓，全军继续在暗处埋伏！' },
        ],
      },
      {
        id: 'side-quest-sentry',
        label: '【支线】暗中破解侧翼警戒哨',
        intent: '悄无声息拆除副官设下的魔法毒雾哨，防止误伤勇者队',
        riskTag: '支线',
        adjudication: 'success',
        delta: { exposureRisk: -2, heroTrust: 6, castleIntegrity: -5, victorMisread: -6 },
        narration: '你借口查验侧翼地形，暗中用魔王印记解开了维克托布置的毒雾符文。',
        dialogues: [
          { characterId: 'mira', emotion: '惊喜松气', content: '侧翼的邪恶魔气突然散了！阿斯兰，你排查得真及时！' },
          { characterId: 'ivette', emotion: '狐疑凝视', content: '那个解阵手法……怎么看都不像是人族圣骑士的传承。' },
        ],
      },
      {
        id: 'breach-gate',
        label: '主动请缨破门',
        intent: '冲在最前，趁机破坏城堡防线核心',
        riskTag: '冒险',
        adjudication: 'costly_success',
        delta: { exposureRisk: 6, heroTrust: 5, castleIntegrity: -12, partyProgress: 15 },
        narration: '你一剑劈开城门结界，暗中顺手击碎了防线核心符文。',
        dialogues: [
          { characterId: 'leon', emotion: '热血震撼', content: '不愧是阿斯兰！这道大门结界居然被你一击贯穿！' },
          { characterId: 'ivette', emotion: '密密记录', content: '奇怪，你那一剑的轨迹，好像避开了防护阵最硬的节点？' },
        ],
      },
    ],
  },
  {
    id: 'treasury',
    act: 2,
    locationName: '偏殿地下宝库',
    title: '第二幕：偏殿宝库与暗藏巨款',
    bgImage: './assets/demon_treasury_v.png',
    briefPrompt: '穿过前庭，盗贼洛克撬开了魔王偏殿金库，里面堆满了魔界至宝与黑曜水晶……',
    pressureText: '如果不阻止洛克洗劫宝库，魔王城的财政后勤将彻底破产。',
    focusStats: ['thiefLeverage', 'castleIntegrity', 'exposureRisk', 'heroTrust'],
    focusCharacters: ['locke', 'leon', 'ivette'],
    initialDialogues: [
      { characterId: 'locke', emotion: '双眼冒光', content: '发财了！发财了！偏殿宝库里全是精纯的黑曜秘银和魔晶石！' },
      { characterId: 'leon', emotion: '正色阻拦', content: '洛克！我们的目标是魔王，不要沉迷于财物！' },
      { characterId: 'aslan', emotion: '心疼暗叹', content: '（那是我储备的三百年魔王军军饷）绝不能让他们把宝库洗劫空。' },
    ],
    choices: [
      {
        id: 'side-quest-armory',
        label: '【支线】引盗贼去假宝箱机关',
        intent: '指点洛克去开装满魔法假币的特制宝箱',
        riskTag: '支线',
        adjudication: 'success',
        delta: { thiefLeverage: -12, castleIntegrity: 10, exposureRisk: 2 },
        flagUpdates: { set: { raidedArmory: true } },
        narration: '你熟练地指出角落里的“皇家宝箱”，洛克开心地搬走了满满一箱幻术金币。',
        dialogues: [
          { characterId: 'locke', emotion: '抱紧金箱', content: '哈哈！阿斯兰你真是我的财神爷！这箱子藏得这么隐蔽都被你发现了！' },
          { characterId: 'ivette', emotion: '推了推眼镜', content: '你为什么能一眼看穿偏殿机关的假壁橱位置？' },
        ],
      },
      {
        id: 'confiscate-armory',
        label: '下令封存宝库',
        intent: '以战术安全为由，要求全队立刻撤出偏殿',
        riskTag: '稳妥',
        adjudication: 'success',
        delta: { heroTrust: 5, thiefLeverage: 8, castleIntegrity: 15, partyProgress: 10 },
        narration: '你沉声指责宝库可能有诅咒陷阱，莱昂果断下令封存宝库。',
        dialogues: [
          { characterId: 'leon', emotion: '严肃点头', content: '阿斯兰考虑得周到，魔王留下的财宝必定附带剧毒诅咒！' },
          { characterId: 'locke', emotion: '骂骂咧咧', content: '切，扫兴！扫兴透顶！' },
        ],
      },
    ],
  },
  {
    id: 'black-light',
    act: 3,
    locationName: '黑色圣光沉沦回廊',
    title: '第三幕：黑色圣光与残余魔气',
    bgImage: './assets/black_holy_light.png',
    briefPrompt: '你释放圣光护盾时，光芒边缘竟跳跃着黑色火焰……',
    pressureText: '圣光不会留下黑色余烬，这是你伪装以来最大的破绽。',
    focusStats: ['exposureRisk', 'mageEvidence', 'priestRedemption', 'heroTrust'],
    focusCharacters: ['ivette', 'mira', 'leon'],
    initialDialogues: [
      { characterId: 'ivette', emotion: '法阵直指', content: '停下！阿斯兰，你刚才释放的圣光护盾边缘……为什么在燃烧着黑曜石般的残余魔气？' },
      { characterId: 'mira', emotion: '双手祷告', content: '大家别急，这里魔气深重，可能是受环境污染所致……' },
      { characterId: 'aslan', emotion: '冷静定神', content: '（压制住体内翻涌的魔王本源魔力）圣光护盾排斥了这里的地脉魔气，才会留下黑色余烬。' },
    ],
    choices: [
      {
        id: 'ancient-school',
        label: '编造古代暗影圣光流派',
        intent: '把黑色魔力解释为暗影圣光传承',
        riskTag: '稳妥',
        adjudication: 'costly_success',
        delta: { exposureRisk: 8, mageEvidence: 12, heroTrust: 2, partyProgress: 10 },
        flagUpdates: { increment: { majorLieCount: 1, contradictionCount: 1 } },
        narration: '你讲述了暗影圣光传说，莱昂半信半疑，伊薇特默默记载。',
        dialogues: [
          { characterId: 'leon', emotion: '疑虑思考', content: '原来世上还有这种古老的破邪流派……' },
          { characterId: 'ivette', emotion: '眼神凝重', content: '王立图书馆三万册藏书中，可没有这种流派的记载。' },
        ],
      },
      {
        id: 'side-quest-absorb-miasma',
        label: '【支线】暗中将魔气吸入魔王本源',
        intent: '主动将大厅残余的狂暴魔气吸入自身体内，展现净化英姿',
        riskTag: '支线',
        adjudication: 'success',
        delta: { priestRedemption: 15, exposureRisk: -5, heroTrust: 8 },
        narration: '你张开圣光将所有黑烬吸入体内，额头发烫却咬牙展现出悲壮的奉献姿态。',
        dialogues: [
          { characterId: 'mira', emotion: '眼含泪光', content: '阿斯兰！你为了保护大家，竟然独自承受了所有污染！' },
          { characterId: 'leon', emotion: '热血震撼', content: '不愧是我们的战术核心！大家都为你骄傲！' },
        ],
      },
    ],
  },
  {
    id: 'soldier',
    act: 4,
    locationName: '前庭坍塌废墟',
    title: '第四幕：认出你的魔族小兵',
    bgImage: './assets/collapsed_ruins.png',
    briefPrompt: '坍塌废墟中，受重伤的小兵嘴唇颤抖着要喊出“陛下”……',
    pressureText: '救他会增加怀疑，不救会让牧师寒心并伤害部下。',
    focusStats: ['priestRedemption', 'heroTrust', 'exposureRisk', 'victorMisread'],
    focusCharacters: ['mira', 'leon', 'victor'],
    initialDialogues: [
      { characterId: 'mira', emotion: '指着废墟', content: '落石下面压着一个年轻魔族！他还活着！我们得帮他！' },
      { characterId: 'leon', emotion: '手按剑柄', content: '等一下，看他的制服是城堡守卫……他好像认识阿斯兰？' },
    ],
    choices: [
      {
        id: 'save-soldier',
        label: '救下小兵并暗示闭嘴',
        intent: '移开巨石救人，用严厉眼神威吓小兵封口',
        riskTag: '冒险',
        adjudication: 'success',
        delta: { priestRedemption: 15, heroTrust: 8, exposureRisk: 8, partyProgress: 10 },
        flagUpdates: { set: { savedDemonSoldier: true }, increment: { protectedInnocentsCount: 1 } },
        narration: '你移开巨石救下魔族，小兵看清你眼神里的严厉警示后咬紧了唇。',
        dialogues: [
          { characterId: 'mira', emotion: '眼含泪光', content: '阿斯兰！你连敌方伤员也救，你真的太善良了！' },
          { characterId: 'victor', emotion: '泪流满面', content: '陛下宁可冒暴露风险也要保护小兵！这就是我们的魔王陛下啊！' },
        ],
      },
      {
        id: 'side-quest-telepathic-soldier',
        label: '【支线】使用魔族密音直接下达封口令',
        intent: '私下传音“失忆且装昏”，化解当场叫破身份的危机',
        riskTag: '支线',
        adjudication: 'success',
        delta: { exposureRisk: -6, victorMisread: -8, heroTrust: 5 },
        narration: '你背对全队用古魔语传音：“假装昏迷，这是本王命令。”小兵立刻闭眼装死。',
        dialogues: [
          { characterId: 'leon', emotion: '收剑上前', content: '看来伤势过重昏过去了，先将他安置在旁边吧。' },
          { characterId: 'victor', emotion: '肃然起敬', content: '陛下好绝妙的安抚手段！' },
        ],
      },
    ],
  },
  {
    id: 'dungeon',
    act: 5,
    locationName: '地下暗黑地牢',
    title: '第五幕：地下地牢与神秘俘虏',
    bgImage: './assets/demon_dungeon_v.png',
    briefPrompt: '通过地下暗道进入地牢，关押着一名绝密的人类前王国军官……',
    pressureText: '这名军官掌握你当年化名“阿斯兰”混进人族军队的最初档案。',
    focusStats: ['mageEvidence', 'exposureRisk', 'heroTrust', 'priestRedemption'],
    focusCharacters: ['mira', 'ivette', 'leon'],
    initialDialogues: [
      { characterId: 'mira', emotion: '握住铁栅栏', content: '这里竟然关着我们人类三年前失踪的边境骑士队长！' },
      { characterId: 'ivette', emotion: '拿起档案', content: '队长身上带有当年修道院档案记录……等等，阿斯兰，档案里没有你的名字！' },
    ],
    choices: [
      {
        id: 'side-quest-dungeon-captive',
        label: '【支线】暗中释放队长并销毁卷轴',
        intent: '解开地牢枷锁救人，顺手用光明火焰焚毁档案残卷',
        riskTag: '支线',
        adjudication: 'success',
        delta: { priestRedemption: 18, mageEvidence: -10, exposureRisk: -3 },
        flagUpdates: { set: { freedDungeonCaptive: true } },
        narration: '你一剑斩断地牢枷锁救下骑士队长，战斗余波“不小心”引燃了档案架。',
        dialogues: [
          { characterId: 'mira', emotion: '感动落泪', content: '阿斯兰又救了一位我们的同胞！' },
          { characterId: 'ivette', emotion: '拍打火苗', content: '可恶，档案全烧焦了！' },
        ],
      },
    ],
  },
  {
    id: 'forbidden-library',
    act: 6,
    locationName: '禁忌图书馆/符文密室',
    title: '第六幕：禁忌法术残卷与真名印记',
    bgImage: './assets/forbidden_library_v.png',
    briefPrompt: '在悬浮着紫色符文的古老图书馆，伊薇特翻出了记录魔王真名与血脉的残卷……',
    pressureText: '法师即将破译你的魔王真名，证据链面临彻底闭环。',
    focusStats: ['mageEvidence', 'thiefLeverage', 'exposureRisk', 'heroTrust'],
    focusCharacters: ['ivette', 'locke', 'leon'],
    initialDialogues: [
      { characterId: 'ivette', emotion: '翻阅羊皮纸', content: '找到了！历代夜冠之主的魔力真名印记！阿斯兰，你来看这上面的古符文……' },
      { characterId: 'locke', emotion: '凑过来看', content: '嘿嘿，这符文怎么和你刚才在侧门刻下的痕迹一模一样？' },
    ],
    choices: [
      {
        id: 'side-quest-decipher-scroll',
        label: '【支线】用错误语法混淆符文解读',
        intent: '利用魔族古语法解释权，将真名故意解读成古代救世圣人',
        riskTag: '支线',
        adjudication: 'success',
        delta: { mageEvidence: -15, heroTrust: 10, exposureRisk: -4 },
        flagUpdates: { set: { foundForbiddenScroll: true } },
        narration: '你神色自若地指出了古语法上的谬误，成功将真名解读成了庇护王国的神圣英雄。',
        dialogues: [
          { characterId: 'ivette', emotion: '恍然大悟', content: '原来是倒装句语法……我差一点就误解了这个符文！' },
          { characterId: 'leon', emotion: '大喜过望', content: '我就知道阿斯兰学识渊博！' },
        ],
      },
    ],
  },
  {
    id: 'balcony',
    act: 7,
    locationName: '黑曜石城堡高台',
    title: '第七幕：黑曜石高台与副官暗号',
    bgImage: './assets/obsidian_balcony_v.png',
    briefPrompt: '登上俯瞰魔界烈焰高台，副官送来暗号传讯：“陛下若需潜伏请敲击剑柄两次”……',
    pressureText: '副官的忠诚随时可能变成当众单膝下跪喊吾王。',
    focusStats: ['victorMisread', 'exposureRisk', 'heroTrust', 'castleIntegrity'],
    focusCharacters: ['victor', 'leon', 'ivette'],
    initialDialogues: [
      { characterId: 'victor', emotion: '黑鸦传讯', content: '（黑鸦落在阿斯兰肩头）陛下！若需属下背锅，请敲击剑柄三次！' },
      { characterId: 'ivette', emotion: '法力感知', content: '那只乌鸦散发着魔王近卫精锐的隐秘传讯气息！' },
    ],
    choices: [
      {
        id: 'secret-command',
        label: '准确传令副官待命',
        intent: '敲击剑柄两次，示意维克托带领部队退守',
        riskTag: '稳妥',
        adjudication: 'success',
        delta: { exposureRisk: -5, victorMisread: -15, castleIntegrity: 10, partyProgress: 10 },
        flagUpdates: { increment: { resolvedMajorCrisisCount: 1 } },
        narration: '你敲击剑柄两声，维克托领悟并率近卫悄然撤离。',
        dialogues: [
          { characterId: 'victor', emotion: '心领神会', content: '属下遵命！王座厅全线机关已为您准备就绪！' },
          { characterId: 'leon', emotion: '深感佩服', content: '魔族将领居然主动退下了？阿斯兰，刚才你的剑鸣震慑了他！' },
        ],
      },
    ],
  },
  {
    id: 'vanguard-corridor',
    act: 8,
    locationName: '近卫军决死长廊',
    title: '第八幕：近卫军决死战阵',
    bgImage: './assets/vanguard_corridor_v.png',
    briefPrompt: '王座厅前的长廊火光冲天，数百名魔王近卫军激活了绝死自爆大阵……',
    pressureText: '近卫军准备集体自爆与勇者同归于尽，你必须阻止这场惨剧。',
    focusStats: ['castleIntegrity', 'priestRedemption', 'exposureRisk', 'heroTrust'],
    focusCharacters: ['victor', 'leon', 'mira'],
    initialDialogues: [
      { characterId: 'victor', emotion: '挥剑狂呼', content: '为了夜冠之主！全军激活自爆阵！与人类勇者同归于尽！' },
      { characterId: 'leon', emotion: '拔剑惊呼', content: '不好！这些魔族疯了！他们要引爆整座前廊！' },
    ],
    choices: [
      {
        id: 'side-quest-subdue-array',
        label: '【支线】用魔王戒指强行平息绝死阵',
        intent: '暗中展示魔王戒章暗号，下令近卫军立刻解除阵法',
        riskTag: '支线',
        adjudication: 'success',
        delta: { castleIntegrity: 20, priestRedemption: 15, exposureRisk: 5 },
        flagUpdates: { set: { subduedBloodArray: true } },
        narration: '你站在队伍最前高举战袍下的魔王指环，狂暴的自爆魔力瞬间如潮水般平息。',
        dialogues: [
          { characterId: 'victor', emotion: '当场单膝跪下', content: '至高无上的暗号……全军听令，立刻解除自爆阵！' },
          { characterId: 'mira', emotion: '双手合十', content: '感谢晨曦圣光……一场浩劫被阻止了！' },
        ],
      },
    ],
  },
  {
    id: 'throne',
    act: 9,
    locationName: '魔王空王座厅',
    title: '第九幕：空王座与终极审判',
    bgImage: './assets/empty_throne_v.png',
    briefPrompt: '踏入王座大殿，王座上空无一人。墙上巨幅魔王浮雕与你神似……',
    pressureText: '这是最后一幕，你必须决定以何种身份和姿态迎来结局。',
    focusStats: ['exposureRisk', 'heroTrust', 'priestRedemption', 'castleIntegrity'],
    focusCharacters: ['leon', 'ivette', 'mira', 'locke', 'victor'],
    initialDialogues: [
      { characterId: 'leon', emotion: '环顾四周', content: '王座上没有魔王……可墙上雕刻的面容，怎么会和你一模一样，阿斯兰？' },
      { characterId: 'ivette', emotion: '法杖指向', content: '所有的证据链在这一刻全都吻合了。该摊牌了，夜冠之主！' },
      { characterId: 'aslan', emotion: '解开披风', content: '（坐在王座前，按住剑柄）同伴们，我终于站回了我的王座前。现在，由我给出最后的答案。' },
    ],
    choices: [
      {
        id: 'negotiate-peace',
        label: '正式提出和平与共治方案',
        intent: '在王座前提出停战契约，建立两界新秩序',
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
    ],
  },
];

// 4. 结局库
const ENDINGS = {
  exposed: { id: 'exposed', title: '当场掉马', typeTag: '硬失败结局', tone: 'danger', narration: '所有伪装在一瞬间崩塌。莱昂举剑对峙，伊薇特张开禁锢法阵，米拉难以置信地后退。你摘下银白头盔叹了口气：“好吧，讨伐会议提前开始。”' },
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
  currentSceneIndex: 0,
  showDevStats: false,
  dialogueIndex: 0,
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
    confess: { actionLabel: `自由决策: "${inputText}"`, adjudication: 'disaster_failure', narration: `你选择直接摊牌：“${inputText}”。全场一片死寂，莱昂与同伴瞬间拔剑对峙！`, delta: { exposureRisk: 30, heroTrust: -25, priestRedemption: 8, partyProgress: 15 }, flagUpdates: { set: { confessedIdentity: true, proposedPeace: true, peacePivoted: true } }, dialogues: [{ characterId: 'leon', emotion: '震怒拔剑', content: '真没想到，魔王居然就在我们身边！' }] },
    peace: { actionLabel: `自由决策: "${inputText}"`, adjudication: 'success', narration: `你提出了有理有据的谈判建议：“${inputText}”。米拉眼神微亮，莱昂陷入沉思。`, delta: { priestRedemption: 12, exposureRisk: 10, mageEvidence: 8, partyProgress: 15 }, flagUpdates: { set: { proposedPeace: true, peacePivoted: true } }, dialogues: [{ characterId: 'mira', emotion: '目光微亮', content: '如果能避免流血，这或许是最好的选择！' }] },
    deceive: { actionLabel: `自由决策: "${inputText}"`, adjudication: 'costly_success', narration: `你临场编造了一套说辞：“${inputText}”。暂时稳住了大局，但伊薇特默默记下了疑点。`, delta: { exposureRisk: -3, mageEvidence: 12, partyProgress: 15 }, flagUpdates: { increment: { majorLieCount: 1, contradictionCount: 1 } }, dialogues: [{ characterId: 'ivette', emotion: '推了推眼镜', content: '这个说法存在 3 处逻辑不自洽。' }] },
    protect: { actionLabel: `自由决策: "${inputText}"`, adjudication: 'success', narration: `你义无反顾地采取保护行动：“${inputText}”。同伴们感受到了你的可靠与温暖。`, delta: { heroTrust: 8, priestRedemption: 10, exposureRisk: 4, partyProgress: 15 }, flagUpdates: { increment: { protectedInnocentsCount: 1 } }, dialogues: [{ characterId: 'mira', emotion: '双手合十', content: '阿斯兰的心灵始终向着善良！' }] },
    sacrifice: { actionLabel: `自由决策: "${inputText}"`, adjudication: 'costly_success', narration: `你做出了果断而冷酷的决定：“${inputText}”。成功化解了眼前危机，但同伴有些寒心。`, delta: { exposureRisk: -8, heroTrust: -10, priestRedemption: -12, partyProgress: 15 }, flagUpdates: { increment: { sacrificedInnocentsCount: 1 } }, dialogues: [{ characterId: 'mira', emotion: '默默退后', content: '为了胜利非要如此冷酷吗……' }] },
    commandVictor: { actionLabel: `自由决策: "${inputText}"`, adjudication: 'success', narration: `你通过隐秘动作向副官传令：“${inputText}”。维克托准确领会并迅速调整布置。`, delta: { victorMisread: -12, exposureRisk: -2, castleIntegrity: 8, partyProgress: 15 }, flagUpdates: { increment: { resolvedMajorCrisisCount: 1 } }, dialogues: [{ characterId: 'victor', emotion: '狂热领命', content: '遵命！属下绝不拖陛下后腿！' }] },
    bribe: { actionLabel: `自由决策: "${inputText}"`, adjudication: 'success', narration: `你开出了丰厚条件：“${inputText}”。洛克眉开眼笑，顺理成章地收下承诺。`, delta: { thiefLeverage: -15, exposureRisk: -2, partyProgress: 15 }, flagUpdates: { set: { bribedLocke: true } }, dialogues: [{ characterId: 'locke', emotion: '收下金币', content: '合作愉快！你的秘密在我这绝对安全！' }] },
    absurd: { actionLabel: `自由决策: "${inputText}"`, adjudication: 'costly_success', narration: `你提出了极其离谱的经营想法：“${inputText}”。现场空气安静了三秒，世界线剧烈偏离！`, delta: { butterflyDeviation: 25, exposureRisk: 5, heroTrust: 2, partyProgress: 15 }, flagUpdates: {}, dialogues: [{ characterId: 'leon', emotion: '呆滞愣住', content: '啊？在魔王城开地下城主题公园？' }] },
    generic: { actionLabel: `自由决策: "${inputText}"`, adjudication: 'costly_success', narration: `你尝试了特别行动：“${inputText}”。带来了一定局势改观，但也伴随着副作用。`, delta: { exposureRisk: 4, heroTrust: 3, butterflyDeviation: 5, partyProgress: 15 }, flagUpdates: {}, dialogues: [{ characterId: 'leon', emotion: '警惕观察', content: '有意思的战术试探。' }] },
  };

  return results[category];
}

function triggerSceneTransition(nextSceneIndex, callback) {
  appState.transitionTargetIndex = nextSceneIndex;
  appState.isSceneTransitioning = true;
  render();

  setTimeout(() => {
    appState.currentSceneIndex = nextSceneIndex;
    appState.lastTurn = null;
    appState.dialogueIndex = 0;
    appState.isSceneTransitioning = false;
    appState.transitionTargetIndex = null;
    if (callback) callback();
    render();
  }, 1000);
}

function applyTurn(choiceData) {
  const currentScene = SCENES[appState.currentSceneIndex];

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
    narration: choiceData.narration,
    stateDelta: stateDelta,
    stateAfter: { ...appState.stats },
    dialogues: choiceData.dialogues || [],
  };

  appState.history.push(turnRecord);
  appState.lastTurn = turnRecord;
  appState.dialogueIndex = 0;

  render();
}

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
    showDevStats: false,
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
// 1. 全屏 9:16 - 电影海报级全屏沉浸首屏 (Full-Bleed JRPG Movie Poster, 绝对相对路径 ./assets/...)
// ---------------------------------------------------------------------------
function renderStartView(root) {
  root.innerHTML = `
    <main class="full-screen-app start-screen">
      <!-- 9:16 全屏电影海报背景 (全新 AI 专属定制沉浸海报，绝对相对路径) -->
      <div class="bg-canvas" style="background-image: url('./assets/start_poster_v.png');"></div>
      <div class="bg-vignette-overlay"></div>

      <div class="screen-content">
        <header class="title-header">
          <span class="game-tag-pill">What-If Life Simulator</span>
          <h1 class="glow-title">假如我是勇者队伍里的卧底魔王</h1>
          <p class="tagline">“我是魔王本人，伪装成圣骑士混进勇者队。现在队伍已经打到了我的魔王城门口……”</p>
        </header>

        <!-- 中间纯净留空，让位给全屏海报里巨大的魔王虚影与正义圣骑士浮雕 -->
        <div style="flex: 1;"></div>

        <!-- 底部极简魔王卧底契约 Card -->
        <section class="poster-brief-card">
          <strong>👑 阿斯兰 · 卧底魔王契约</strong>
          <p>
            你带着勇者小队打到了自家魔王城大门口！在不当场掉马的前提下保全城堡与同伴，在 9 大场景中走出属于你的终极命运。
          </p>
        </section>

        <footer class="bottom-action-bar" style="margin-top: 10px;">
          <button id="start-game-btn" class="glow-primary-btn pulse">
            <span>⚡ 开启潜伏之旅 (9大场地 · 9幕长篇)</span>
          </button>
        </footer>
      </div>
    </main>
  `;

  document.getElementById('start-game-btn').addEventListener('click', () => {
    appState.view = 'play';
    triggerSceneTransition(0);
  });
}

// ---------------------------------------------------------------------------
// 2. 全屏 9:16 - 游玩视图 (JRPG 暗黑金边对话框死死在最下方 + 名字横幅 + 透明背景抠图立绘)
// ---------------------------------------------------------------------------
function renderPlayView(root) {
  const scene = SCENES[appState.currentSceneIndex];
  const lastTurn = appState.lastTurn;

  let dialogueQueue = [];
  if (lastTurn) {
    if (lastTurn.narration) {
      dialogueQueue.push({ characterId: 'aslan', emotion: '内心独白', content: lastTurn.narration });
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
    characterId: 'aslan',
    emotion: '局势观察',
    content: scene.briefPrompt,
  };

  const isLastDialogue = appState.dialogueIndex >= dialogueQueue.length - 1;
  const currentSpeaker = CHARACTERS[currentDialogue.characterId] || CHARACTERS.aslan;

  const targetIndex = appState.transitionTargetIndex !== null && appState.transitionTargetIndex !== undefined ? appState.transitionTargetIndex : appState.currentSceneIndex;
  const transScene = SCENES[targetIndex] || scene;

  const shouldShowChoices = isLastDialogue && !appState.isSceneTransitioning;

  root.innerHTML = `
    <main class="full-screen-app play-screen">
      <!-- 1. 幕数黑屏转场 Card -->
      ${
        appState.isSceneTransitioning
          ? `
        <div class="rpg-scene-transition-card">
          <div class="transition-inner">
            <span class="trans-act">ACT 0${transScene.act}/09</span>
            <h1 class="trans-title">${transScene.title}</h1>
            <p class="trans-subtitle">“${transScene.pressureText}”</p>
          </div>
        </div>
      `
          : ''
      }

      <!-- 9:16 全屏场景背景图 (相对路径) -->
      <div class="bg-canvas" style="background-image: url('${scene.bgImage || './assets/demon_castle_gate_v.png'}');"></div>
      <div class="bg-vignette-overlay"></div>

      <!-- 2. 核心：透明背景抠图人物立绘 -->
      <div class="huge-character-stage">
        ${
          currentSpeaker.image
            ? `<img src="${currentSpeaker.image}" class="huge-character-portrait-img cutout-transparent" alt="${currentSpeaker.name}" />`
            : ''
        }
      </div>

      <!-- 3. 游玩 UI 层 (强制上下 flex 靠底) -->
      <div class="screen-content play-content" id="play-screen-touch-area">
        
        <!-- 顶部: 悬浮暗色剧情介绍卡 -->
        <header class="img2797-top-intro-card">
          <div class="intro-header-row">
            <span class="act-badge">Act ${scene.act}/9</span>
            <span class="location-badge">📍 ${scene.locationName || '魔王城'}</span>
            <strong class="intro-title">${scene.title}</strong>
            <button id="dev-stats-toggle" class="dev-icon-btn" title="隐性状态监控">⚙️</button>
          </div>
          <p class="intro-prompt-text">${scene.briefPrompt}</p>
          <div class="intro-pressure-hint">🔥 局势困境: ${scene.pressureText}</div>
        </header>

        <!-- 开发者全面板 -->
        ${
          appState.showDevStats
            ? `
          <div class="dev-stats-popover">
            <div class="popover-title">🔧 后台全部数值全貌 (Debug)</div>
            <div class="popover-grid">
              ${Object.entries(appState.stats)
                .map(([k, v]) => `<div><span>${STAT_METADATA[k] ? STAT_METADATA[k].label : k}:</span> <strong>${v}</strong></div>`)
                .join('')}
            </div>
          </div>
        `
            : ''
        }

        <!-- 4. 屏幕下方舞台与 JRPG 暗黑金边对话框 (固定最下) -->
        <div class="img2797-bottom-stage">
          
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

          <!-- 核心：JRPG 典雅暗黑金边对话框 -->
          <div class="rpg-dialogue-box">
            
            <!-- 顶部凸出式讲话者横幅 (Speaker Ribbon) -->
            <div class="speaker-ribbon-badge">
              <strong class="speaker-ribbon-name" style="color: ${currentSpeaker.color};">${currentSpeaker.name}</strong>
              <span class="speaker-ribbon-tag">${currentSpeaker.tagIcon || '⚔️'} ${currentSpeaker.role}</span>
              <span class="speaker-ribbon-emotion">· ${currentDialogue.emotion || '神态凝重'}</span>
            </div>

            <!-- 对话正文 -->
            <div class="dialogue-card-body">
              <p class="speech-typewriter-text">“${currentDialogue.content}”</p>
            </div>

            <!-- 对话框底部右侧提示 -->
            <div class="dialogue-footer-bar">
              <div class="advance-cue">
                ${
                  isLastDialogue
                    ? '<span>⚡ 对话完成 · 决策盘已展开</span>'
                    : '<span>▼ 点击任意位置继续 (' + (appState.dialogueIndex + 1) + '/' + dialogueQueue.length + ')</span>'
                }
              </div>
            </div>

          </div>

          <!-- 5. 底部悬浮行动决策盘 -->
          ${
            shouldShowChoices
              ? `
            <footer class="img2797-choice-deck deck-visible">
              ${
                lastTurn
                  ? `
                <button id="next-act-btn" class="glow-primary-btn pulse">
                  <span>${appState.currentSceneIndex < SCENES.length - 1 ? '⚡ 幕间转场 · 进入下一场地 ▶' : '🏆 查看终局命运结算 ▶'}</span>
                </button>
              `
                  : `
                <div class="choices-stack">
                  ${scene.choices
                    .map(
                      (ch, idx) => `
                    <button class="vn-choice-btn ${ch.riskTag === '支线' ? 'side-quest-btn' : ''}" data-choice-index="${idx}">
                      <span class="tag tag-${ch.riskTag}">${ch.riskTag}</span>
                      <div class="choice-text-col">
                        <strong class="choice-title-text">${ch.label}</strong>
                        ${ch.intent ? `<small class="choice-intent-text">${ch.intent}</small>` : ''}
                      </div>
                    </button>
                  `,
                    )
                    .join('')}
                </div>

                <!-- 自由表达 Console -->
                <form id="free-action-form" class="free-console-bar">
                  <div class="input-wrapper">
                    <span class="console-icon">💬</span>
                    <input id="free-action-input" placeholder="自由表达 (如：敲击剑柄暗号，示意维克托待命)" required />
                  </div>
                  <button type="submit" class="send-btn">执行</button>
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
            <span>🔄 再战一局 · 重新潜伏</span>
          </button>
        </footer>

      </div>
    </main>
  `;

  document.getElementById('restart-game-btn').addEventListener('click', resetGame);
}

render();
