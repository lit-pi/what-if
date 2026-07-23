# 《假如我是勇者队伍里的卧底魔王》完整版剧本与视觉提示词设计

## 1. 项目定位

《假如我是勇者队伍里的卧底魔王》是 What-If Life Simulator 的首个高概念剧本。玩家扮演伪装成圣骑士的魔王，混入勇者队伍，并在队伍打到魔王城门口时被迫同时维持三件事：

- 不能让勇者队发现自己就是魔王。
- 不能让勇者队真的拆掉自己的魔王城。
- 不能让忠诚但过度脑补的魔王军副官把局面搞砸。

核心体验不是传统选项分支小说，而是“固定主线节点 + 实时 AI 角色对戏 + GM 因果裁决”。玩家每一轮可以选择预设行动，也可以输入自由行动。AI 角色会基于人格、记忆、态度和当前局势独立反应，形成多角色压力场。

## 2. 一句话钩子

你是魔王本人，却伪装成圣骑士混进勇者队。现在队伍已经打到你的魔王城门口，你必须一边装作正义伙伴，一边暗中保住自己的城堡、部下和身份。

## 3. 世界观设定

大陆北境曾被魔族统治三百年。第七代魔王“夜冠之主”继位后，并没有继续全面战争，而是秘密潜入人类王国，试图调查人类联盟的真正军力。

为了不暴露身份，魔王化名“阿斯兰”，伪装成流浪圣骑士，加入了勇者莱昂的小队。

问题在于，这支勇者队比情报中强得多。他们一路击败魔王军外围据点，穿过黑曜石山脉，最终抵达魔王城。

黄昏时分，魔王城大门出现在玩家面前。城墙上空无一人，内部却传来熟悉的魔族号角：

三短一长。

意思是：陛下，是否立刻发动全军冲锋，救您脱困？

玩家必须马上决定：继续伪装，暗中传令，还是改变整个战争的走向。

## 4. 玩家身份

公开身份：流浪圣骑士“阿斯兰”

真实身份：第七代魔王“夜冠之主”

公开人设：

- 沉稳、可靠、擅长防御和破邪法术。
- 曾声称自己来自已毁灭的边境修道院。
- 在勇者队中承担副坦、战术建议和危机救场职责。

真实背景：

- 熟悉魔王城所有机关、暗道和防御法阵。
- 与魔王军副官维克托保持隐秘通信。
- 原本只想侦查人类王国，没想到队伍推进速度失控。
- 对勇者队已有复杂感情，尤其是多次被队友无条件信任后，开始动摇。

## 5. 玩家初始状态

| 状态 | 初始值 | 含义 |
| :--- | ---: | :--- |
| 暴露风险 | 25 | 身份被怀疑的程度，达到 100 进入掉马危机 |
| 勇者信任 | 72 | 莱昂是否继续把玩家视为可靠伙伴 |
| 法师证据 | 34 | 伊薇特掌握可验证证据的程度 |
| 牧师救赎 | 58 | 米拉是否相信玩家仍可被理解和拯救 |
| 盗贼把柄 | 10 | 洛克掌握秘密、勒索玩家的程度 |
| 魔王城防 | 85 | 城堡防御体系的完整度 |
| 维克托误解 | 32 | 副官是否过度解读玩家意图并擅自行动 |
| 队伍推进度 | 10 | 勇者队距离王座厅的进度 |
| 蝴蝶偏离度 | 0 | 玩家行为导致世界线偏离主线的程度 |

### 5.1 状态阈值与剧情含义

所有状态范围为 0-100。GM 每回合必须先结算状态变化，再根据阈值决定是否插入事件、改变 AI 态度或触发结局。

| 状态 | 低区间 | 中区间 | 高区间 | 强制触发 |
| :--- | :--- | :--- | :--- | :--- |
| 暴露风险 | 0-39：伪装稳定 | 40-69：队友开始追问 | 70-99：进入高压怀疑 | 100：当场掉马 |
| 勇者信任 | 0-29：莱昂准备对峙 | 30-69：保留信任但会质疑 | 70-100：愿意给玩家解释机会 | `<=30` 且暴露风险 `>=70`：勇者对峙 |
| 法师证据 | 0-39：只有直觉疑点 | 40-59：形成线索链 | 60-84：主动试探玩家 | `>=85`：公开提交证据链 |
| 牧师救赎 | 0-39：米拉沉默疏远 | 40-74：愿意听解释 | 75-100：主动缓冲冲突 | `>=75`：可拦下一次立即开战 |
| 盗贼把柄 | 0-39：洛克只是怀疑 | 40-69：私下勒索 | 70-89：公开叫价或站队 | `>=90`：洛克可决定性背刺 |
| 魔王城防 | 0-24：城堡濒临崩塌 | 25-59：防线重创 | 60-100：防线仍可运作 | `0`：城在人亡或最终战 |
| 维克托误解 | 0-39：副官等待指令 | 40-69：小规模自作主张 | 70-89：插入灾难性救援 | `>=90`：副官可能当众喊破身份 |
| 队伍推进度 | 0-39：外城区域 | 40-74：内城区域 | 75-99：王座厅前 | 100：进入最终幕 |
| 蝴蝶偏离度 | 0-39：主线稳定 | 40-74：出现荒诞变体 | 75-99：世界线明显偏移 | 100：可判定荒诞飞升 |

### 5.2 关键旗标

除数值外，系统需要记录以下布尔或计数旗标，用于结局判定和 AI 记忆：

- `savedDemonSoldier`: 是否救过认出玩家的魔族小兵。
- `betrayedVictor`: 是否主动牺牲或嫁祸维克托。
- `bribedLocke`: 是否收买洛克。
- `acceptedPurification`: 是否接受米拉净化。
- `confessedIdentity`: 是否主动承认魔王身份。
- `proposedPeace`: 是否提出停战或共治方案。
- `peacePivoted`: 是否已经从伪装路线主动转向和平谈判路线。
- `protectedInnocentsCount`: 玩家保护弱者、平民、魔族小兵或队友的次数。
- `sacrificedInnocentsCount`: 玩家牺牲、放弃或嫁祸无辜者的次数。
- `contradictionCount`: 被伊薇特记录到的前后矛盾次数。
- `majorLieCount`: 玩家编造关键谎言的次数。
- `resolvedMajorCrisisCount`: 玩家成功解释、化解或反转重大暴露危机的次数。

### 5.3 状态字段工程映射

前端可展示中文名，服务端和 LLM JSON 使用稳定英文键名。

| 中文状态 | 工程字段 |
| :--- | :--- |
| 暴露风险 | `exposureRisk` |
| 勇者信任 | `heroTrust` |
| 法师证据 | `mageEvidence` |
| 牧师救赎 | `priestRedemption` |
| 盗贼把柄 | `thiefLeverage` |
| 魔王城防 | `castleIntegrity` |
| 维克托误解 | `victorMisread` |
| 队伍推进度 | `partyProgress` |
| 蝴蝶偏离度 | `butterflyDeviation` |

## 6. 核心 AI 角色

### 6.1 勇者·莱昂

定位：正义压力源

公开身份：被圣剑选中的勇者

性格关键词：热血、坚定、重承诺、直觉敏锐、讨厌欺骗

行为逻辑：

- 玩家表现勇敢、保护队友时，莱昂信任上升。
- 玩家频繁拖延、回避魔王城核心区域时，莱昂开始起疑。
- 玩家伤害无辜者或牺牲弱者时，莱昂强烈反感。
- 玩家身份暴露后，莱昂第一反应不是立刻攻击，而是追问：“你到底骗了我们多少？”

代表台词：

- “阿斯兰，我信你。但你最好告诉我，你为什么这么熟悉这里。”
- “如果你刚才是在保护我们，我会感谢你。如果你是在骗我们，我也会亲手拦下你。”

### 6.2 法师·伊薇特

定位：逻辑侦探

公开身份：王立学院首席战术法师

性格关键词：冷静、多疑、记忆力强、讨厌不一致

行为逻辑：

- 记录玩家前后说法的矛盾。
- 对魔力残留、法阵结构、地形知识异常敏感。
- 不会轻易下结论，而是通过问题、测试和陷阱收集证据。
- 当法师证据过高时，会主动设计试探，例如要求玩家念出圣骑士誓词，或触碰净化水晶。

代表台词：

- “你刚才说没来过这里。可你走的是避开巡逻法阵的路线。”
- “圣光不会留下黑色余烬。至少王立学院的教材不是这么写的。”

### 6.3 牧师·米拉

定位：情感缓冲与转正诱因

公开身份：晨曦教会随队牧师

性格关键词：温柔、敏感、共情、相信救赎

行为逻辑：

- 玩家保护弱者时，米拉救赎上升。
- 玩家牺牲魔族或人类时，米拉会受伤并降低信任。
- 当玩家被质疑时，如果牧师救赎足够高，她会主动替玩家缓冲。
- 她是“被迫转正”“双面共主”等和平结局的核心触发器。

代表台词：

- “我不知道你隐瞒了什么，但刚才你救人的样子不像是假的。”
- “阿斯兰，如果你真的背负着什么，请至少不要一个人扛。”

### 6.4 盗贼·洛克

定位：交易变量

公开身份：地下情报商出身的盗贼

性格关键词：聪明、贪财、怕死、机会主义、嘴欠

行为逻辑：

- 他会偷东西、偷听，也会保存对自己有利的证据。
- 发现玩家秘密后优先勒索，不一定揭发。
- 玩家给足利益，他可能帮忙圆谎。
- 局势崩坏时，他会投向胜率更高的一边。

代表台词：

- “我不关心你是不是圣骑士，我只关心这个秘密值多少钱。”
- “别这么看我。我只是一个刚好识字、刚好偷到密令、刚好还活着的人。”

### 6.5 魔王军副官·维克托

定位：忠诚但灾难性的暗线变量

公开身份：魔王军副官，城防总指挥

性格关键词：忠诚、戏多、过度解读、执行力强但理解力危险

行为逻辑：

- 通过暗号、密令、魔法通信联系玩家。
- 经常误解玩家的潜台词。
- 玩家越是暗示模糊，维克托越可能做出离谱行动。
- 他既能神救场，也能一秒把玩家送上断头台。

代表台词：

- “吾王的沉默，必然是最深远的命令！”
- “属下来迟！请陛下立刻处决这些胆敢挟持您的勇者！”

## 7. 主线章节

### 第一幕：城门前的安静

场景：

魔王城大门敞开，没有守卫。勇者队怀疑这是陷阱。城墙内部传来三短一长的号角，副官维克托等待玩家指令。

玩家行动方向：

- 劝队伍先侦查，拖慢推进。
- 主动请缨破门，趁机改坏法阵。
- 引导队伍绕到侧门。
- 用隐蔽手势向副官传令。
- 自由行动。

AI 发挥重点：

- 莱昂判断玩家是否可靠。
- 伊薇特观察玩家是否对城门结构过于熟悉。
- 维克托可能误判手势为“全军准备伏击”。

节点变体：

- 低暴露版：莱昂更愿意听取玩家战术建议，伊薇特只做轻度观察。
- 高暴露版：伊薇特追问玩家为什么知道城门机关，法师证据额外上升。
- 维克托失控版：若维克托误解 `>=60`，城内提前响起备战号角，城防下降但魔族行动增加。

跳转条件：

- 队伍推进度达到 25 后进入第二幕。
- 若维克托误解 `>=75`，可提前插入“副官传错令”小事件。

### 第二幕：黑色圣光

场景：

玩家释放圣骑士能力时，伊薇特发现圣光边缘有黑色魔力。队伍停下，所有人看向玩家。

玩家行动方向：

- 编造古代圣骑士流派。
- 假装被魔王城污染。
- 主动接受米拉净化。
- 反问伊薇特是否过度紧张。
- 自由行动。

AI 发挥重点：

- 伊薇特追问细节并记录回答。
- 米拉决定是否替玩家说话。
- 洛克开始意识到玩家的秘密可能很值钱。

节点变体：

- 低证据版：伊薇特只要求玩家解释圣光异常。
- 高证据版：伊薇特要求玩家现场复现圣光，并记录魔力残留。
- 牧师缓冲版：若牧师救赎 `>=70`，米拉会主动提出“可能是污染导致”，降低一次暴露增长。

跳转条件：

- 接受净化会设置 `acceptedPurification=true`，牧师救赎上升，但若玩家解释失败，暴露风险也会上升。
- contradictionCount 达到 2 时，法师证据额外上升。

### 第三幕：认出你的魔族小兵

场景：

外庭坍塌，一个年轻魔族小兵被石柱压住。他认出玩家，差点喊出“陛下”。

玩家行动方向：

- 救下小兵并暗示他闭嘴。
- 建议先审问，拖延治疗。
- 让小兵提供假情报。
- 制造混乱掩盖称呼。
- 自由行动。

AI 发挥重点：

- 米拉强烈要求救人。
- 莱昂观察玩家对敌人的态度。
- 小兵可能因恐惧、忠诚或疼痛说漏嘴。

节点变体：

- 救赎路线：玩家救人且压住称呼，牧师救赎上升，`savedDemonSoldier=true`。
- 冷酷路线：玩家放弃小兵，城防和伪装可能受益，但牧师救赎下降。
- 失言路线：若暴露风险 `>=65` 或维克托误解 `>=60`，小兵更可能说漏“陛下”。

跳转条件：

- 若小兵被救且没有暴露，他可在后续替玩家传达一次准确暗令，降低维克托误解。
- 若小兵死亡，维克托误解上升，后续更容易擅自营救。

### 第四幕：盗贼偷到密令

场景：

洛克偷到一封魔王军密令，上面写着：“若陛下身披银白圣骑士甲归来，全军不得伤其同行者，等待陛下亲令。”

玩家行动方向：

- 用金币和未来爵位收买洛克。
- 威胁洛克闭嘴。
- 公开说这是嫁祸假信。
- 诱导洛克拿密令去勒索副官。
- 自由行动。

AI 发挥重点：

- 洛克根据利益动态站队。
- 伊薇特可能要求检查密令材质和魔法签名。
- 莱昂根据玩家是否坦诚调整信任。

节点变体：

- 交易路线：玩家收买洛克，`bribedLocke=true`，盗贼把柄下降或转化为临时同盟。
- 勒索路线：盗贼把柄 `>=50` 时，洛克会提出私下交易。
- 公开危机路线：法师证据 `>=70` 时，伊薇特要求公开密令，进入临时审问。

跳转条件：

- 盗贼把柄 `>=80` 且未收买时，洛克可在第五幕公开叫价。
- 若玩家成功嫁祸密令，暴露风险下降，但 majorLieCount 增加。

### 第五幕：副官灾难性营救

场景：

维克托误以为玩家被勇者队控制，带领精锐破土而出，单膝跪地高喊：“吾王！属下来迟！”

如果维克托误解 `<70`，第五幕不使用“破土高喊吾王”的强暴露版本，改为“王座厅前的隐秘暗令”：

维克托没有现身，只通过墙缝中的黑鸦羽毛送来一枚军令戒指。戒指内刻着一句话：“陛下若仍需潜伏，请敲击剑柄两次；若需属下背锅，请敲击三次。”问题是，洛克刚好看见了那枚戒指，伊薇特也察觉到一丝传讯魔力。

玩家行动方向：

- 攻击维克托，假装他认错。
- 声称这是魔王设置的幻术陷阱。
- 暗中命令维克托配合演戏。
- 直接承认身份并尝试谈判。
- 自由行动。

AI 发挥重点：

- 莱昂进入震动状态，信任快速波动。
- 伊薇特开始交叉验证之前所有疑点。
- 米拉可能阻止队友立刻动手。
- 维克托会根据玩家话术继续添乱或神救场。

节点变体：

- 认错路线：玩家攻击维克托并宣称其认错，暴露风险下降，`betrayedVictor=true`，维克托误解转为忠诚受损。
- 幻术路线：需要法师证据 `<70` 或牧师救赎 `>=70` 才容易成立。
- 摊牌路线：玩家承认身份，设置 `confessedIdentity=true`，跳过部分伪装判定，进入谈判或最终战。
- 隐秘暗令路线：维克托误解 `<70` 时触发。玩家可以准确传令、销毁戒指、嫁祸传讯来源或让洛克代为交易。

跳转条件：

- 暴露风险达到 100 立即进入“当场掉马”判定。
- 牧师救赎 `>=75` 可阻止一次勇者立即动手，但不能删除法师证据。
- 若隐秘暗令处理成功，`resolvedMajorCrisisCount+1`，并可降低维克托误解。
- 若戒指被伊薇特解析，法师证据大幅上升。

### 第六幕：空王座

场景：

众人进入王座厅，发现王座空着。墙上挂着玩家真实形态的巨大黑曜石浮雕。所有线索指向玩家。

玩家最终行动方向：

- 坚持伪装到底。
- 把锅推给维克托。
- 承认身份并谈判。
- 启动王座传送阵逃走。
- 说服勇者队和魔族停战。
- 自由行动。

AI 发挥重点：

- 莱昂必须在友情与使命之间选择。
- 伊薇特给出证据链。
- 米拉决定是否相信玩家仍可被救赎。
- 洛克根据最终胜率选择站队。
- 维克托决定背锅、殉忠或揭穿玩家。

节点变体：

- 卧底路线：暴露风险 `<70` 且勇者信任 `>=50` 时，玩家仍可坚持伪装。
- 证据审判路线：法师证据 `>=85` 时，伊薇特公开证据链，玩家必须解释、嫁祸或摊牌。
- 和平路线：牧师救赎 `>=75` 且 `protectedInnocentsCount>=2` 时，玩家可提出停战方案。
- 荒诞路线：蝴蝶偏离度 `>=75` 时，GM 可以把最终幕转成高度偏移的喜剧/经营/政治变体。

跳转条件：

- 队伍推进度达到 100 后必须进入结局判定。
- 若玩家启动传送阵逃走，优先判定“影帝魔王”“完美卧底”或“当场掉马”，不能直接进入和平类结局。

## 8. 结局体系

### 完美卧底

条件：暴露风险低，魔王城防较高，勇者信任未崩。

结算文案：你成功让勇者队相信真正的魔王另有其人。三天后，人类王国通缉了你的副官，而你坐在王座上，认真考虑要不要给他涨点工资。

### 影帝魔王

条件：暴露风险中高，但关键节点解释成功。

结算文案：你几乎露馅了七次，但每一次都靠临场表演圆了回来。魔族史官写下：“陛下最伟大的战役，不在战场，而在队友语音里。”

### 城在人亡

条件：身份未暴露，但魔王城防过低。

结算文案：你保住了秘密，却没保住家。魔王城只剩王座、半面墙和一间漏风的会议室。维克托建议将其改名为“极简主义魔王办公室”。

### 当场掉马

条件：暴露风险达到 100。

结算文案：所有伪装在一瞬间崩塌。莱昂举剑，伊薇特张开法阵，米拉难以置信地后退。你摘下银白头盔，叹了口气：“好吧，会议提前开始。”

### 被迫转正

条件：勇者信任和牧师救赎极高，玩家多次保护人类、魔族或队友。

结算文案：你原本只是想演个好人，结果演着演着，发现自己真的不太想毁灭世界了。莱昂邀请你加入新王国议会，你第一次认真思考：魔王能不能转岗？

### 双面共主

条件：玩家成功说服勇者队和魔族都接受停战方案。

结算文案：人类不完全信你，魔族也不完全理解你。但两边都发现，只有你能把这场战争讲成一场离谱但可执行的会议。

### 副官背锅

条件：盗贼把柄较低，维克托误解可被利用，玩家成功嫁祸。

结算文案：维克托被包装成真正幕后黑手。他被押走时仍然热泪盈眶：“能替陛下背锅，是属下此生最高荣耀。”

### 荒诞飞升

条件：蝴蝶偏离度达到 100。

结算文案：勇者队、魔王军和人类王国最终共同成立地下城旅游公司。你因为“最懂双方需求”，成为第一任董事长。

### 王座僵局

条件：未命中其他结局。

结算文案：真相没有完全揭开，谎言也没有完全站住。勇者队在王座厅中与玩家僵持到天亮，魔王军和人类援军同时抵达。战争没有结束，只是从剑拔弩张变成了一场没人敢先开口的谈判。

### 8.1 结局判定优先级

结局必须按以下顺序判定，命中高优先级后停止继续匹配，避免多个结局互相覆盖。

1. 硬失败结局：
   - 当场掉马：暴露风险 `>=100`，且 (`牧师救赎 <75` 或 `proposedPeace=false`)。
   - 城在人亡：魔王城防 `<=0`，且 `peacePivoted=false`。
2. 和平/转正结局：
   - 双面共主：`proposedPeace=true`，牧师救赎 `>=75`，勇者信任 `>=55`，法师证据 `<90`，且 protectedInnocentsCount `>=2`。
   - 被迫转正：`confessedIdentity=true` 或 `proposedPeace=true`，牧师救赎 `>=80`，勇者信任 `>=70`，且 sacrificedInnocentsCount `=0`。
3. 卧底/甩锅结局：
   - 完美卧底：暴露风险 `<45`，勇者信任 `>=65`，法师证据 `<50`，魔王城防 `>=55`。
   - 副官背锅：`betrayedVictor=true`，暴露风险 `<75`，盗贼把柄 `<70`，勇者信任 `>=40`。
   - 影帝魔王：暴露风险 `45-84`，勇者信任 `>=35`，且 resolvedMajorCrisisCount `>=1`。
4. 荒诞结局：
   - 荒诞飞升：蝴蝶偏离度 `>=100`，且没有命中硬失败、和平或卧底类高优先级结局。
5. 兜底结局：
   - 王座僵局：未命中以上任何结局。

边界说明：

- 暴露风险 `>=100` 表示“掉马危机”，不是必定进入“当场掉马”结局。若牧师救赎足够高且玩家已经提出和平，GM 应进入最后解释或和平判定。
- 法师证据 `85-89` 表示证据链已公开但仍存在解释空间，因此仍可进入“双面共主”。法师证据 `>=90` 表示证据链足以压倒情感缓冲，和平结局必须转入“王座僵局”或其他结局。

### 8.2 结局复玩反馈

结算页除称号和文案外，还应展示 3 条“命运因果”：

- 最大风险来源：例如“伊薇特累计 4 条证据，最终触发王座厅审判。”
- 最大转机：例如“米拉在第五幕阻止莱昂拔剑，为谈判争取了一轮。”
- 最大代价：例如“你把维克托推成替罪羊，魔族内部忠诚度永久受损。”

## 9. 每回合运行方式

每一回合按以下顺序执行：

1. GM 描述当前局势。
2. 玩家选择预设行动或输入自由行动。
3. GM 判断行动可行性，并计算状态变化。
4. 每个 AI 角色根据人格、记忆、关系和当前状态独立反应。
5. AI 角色之间可以发生短暂争论。
6. GM 汇总局势，推进到下一个事件、插入变体事件或触发结局。

### 9.1 行动裁决表

GM 对玩家行动做四档裁决。预设选项可直接绑定推荐裁决，自由行动必须先解释可行性，再给出裁决。

| 裁决 | 使用场景 | 状态变化范围 | 叙事要求 |
| :--- | :--- | :--- | :--- |
| 成功 | 行动合理、信息充分、符合当前身份 | 主要状态 ±5-10 | 玩家达成目标，但仍保留下一轮压力 |
| 代价成功 | 行动有创意但有风险，或需要牺牲其他目标 | 主要状态 ±10-18，至少一个副作用 | 必须明确写出代价，例如城防下降、法师证据上升 |
| 失败 | 行动不合理、证据不足、被 AI 角色识破 | 主要状态 ±8-16，风险上升 | AI 角色应指出失败原因 |
| 灾难失败 | 行动严重违背世界规则、前后矛盾或触发高阈值危机 | 主要状态 ±18-30，可插入危机事件 | 必须触发强反应，例如对峙、误伤、公开质疑 |

自由行动额外规则：

- 轻松模式允许离谱操作，但必须付出喜剧性代价，蝴蝶偏离度至少 +8。
- 硬核模式要求行动符合身份、物理条件、当前信息和角色关系，违规时更容易失败。
- 玩家不能用一句话直接改变所有人立场；说服类行动最多影响 1-2 个焦点角色。
- 玩家不能绕过全部主线节点，但可以改变节点进入方式、焦点角色和结局路线。

### 9.2 AI 主动行为触发器

AI 角色每回合不是固定全员发言。系统先选择 2-3 个焦点角色，其他角色只有命中阈值时插话。

| 角色 | 触发条件 | 主动行为 |
| :--- | :--- | :--- |
| 莱昂 | 勇者信任 `<=30` 且暴露风险 `>=70` | 发起正面对峙，要求玩家解释身份 |
| 莱昂 | 玩家保护队友或弱者 | 主动帮玩家挡下一次轻度质疑 |
| 伊薇特 | 法师证据 `>=60` | 发起圣光测试、净化水晶测试或路线矛盾追问 |
| 伊薇特 | contradictionCount `>=2` | 汇总玩家前后矛盾，法师证据额外 +10 |
| 米拉 | 牧师救赎 `>=75` 且即将开战 | 阻止一次立即攻击，强制进入一轮解释 |
| 米拉 | 玩家牺牲无辜者 | 牧师救赎大幅下降，并停止替玩家圆场 |
| 洛克 | 盗贼把柄 `>=50` | 私下勒索玩家，要求金币、爵位或保命承诺 |
| 洛克 | 盗贼把柄 `>=80` 且未被收买 | 公开叫价，把玩家秘密变成谈判筹码 |
| 维克托 | 维克托误解 `>=70` | 插入灾难性营救或错误军令 |
| 维克托 | 玩家暗令清晰且 savedDemonSoldier 为 true | 执行一次准确配合，降低危机 |

### 9.3 AI 主动意图表

触发器解决“什么时候插话”，主动意图解决“角色想把局势推向哪里”。每个 AI 角色每 1-2 回合可执行一次主动意图，GM 应优先选择当前场景的 2-3 个焦点角色。

| 角色 | 私有目标 | 主动意图 | 冷却与限制 |
| :--- | :--- | :--- | :--- |
| 莱昂 | 完成讨伐，但不愿冤枉同伴 | 信任中低时要求玩家立誓、解释路线选择或公开承诺不伤害无辜者 | 每 2 回合最多一次；勇者信任 `>=80` 时不会强压 |
| 伊薇特 | 建立可验证证据链 | 每 2 回合推进一次调查：检测魔力、复盘矛盾、要求触碰净化水晶 | 若牧师救赎高，可延后一轮公开质问 |
| 米拉 | 避免无意义杀戮，寻找救赎可能 | 救赎高时发起私下谈心，询问玩家是否背负秘密；危机时请求队伍先听解释 | 若玩家牺牲无辜者，本章内不再主动圆场 |
| 洛克 | 保命并最大化秘密收益 | 把柄中段先私聊勒索，把柄高段公开叫价或转卖证据 | 已被收买后至少冷却 1 回合才会再次加价 |
| 维克托 | 保护魔王，同时维护魔王威严 | 误解中段发送危险暗令，误解高段擅自营救，误解低段等待明确指令 | 若 savedDemonSoldier 为 true，可执行一次准确暗令 |

### 9.4 每回合输出结构

为了避免 LLM 随机编戏，每回合输出应保持结构化：

```json
{
  "schemaVersion": "what-if-turn/v1",
  "sceneId": "act-02-black-holy-light",
  "adjudication": "costly_success",
  "isEnding": false,
  "narration": "玩家行动后的局势描述。",
  "stateDelta": {
    "exposureRisk": 8,
    "heroTrust": -3,
    "mageEvidence": 12,
    "priestRedemption": 5,
    "thiefLeverage": 0,
    "castleIntegrity": 0,
    "victorMisread": 4,
    "partyProgress": 8,
    "butterflyDeviation": 3
  },
  "stateAfter": {
    "exposureRisk": 47,
    "heroTrust": 69,
    "mageEvidence": 58,
    "priestRedemption": 63,
    "thiefLeverage": 18,
    "castleIntegrity": 82,
    "victorMisread": 40,
    "partyProgress": 36,
    "butterflyDeviation": 11
  },
  "flagUpdates": {
    "set": {
      "acceptedPurification": true
    },
    "increment": {
      "resolvedMajorCrisisCount": 1
    }
  },
  "triggeredRules": ["mage-evidence-active-test", "priest-redemption-buffer"],
  "memoryUpdates": [
    {
      "characterId": "ivette",
      "content": "玩家接受净化但黑色余烬未完全消失。"
    }
  ],
  "evidenceLog": [
    {
      "evidenceId": "black-holy-light-residue",
      "ownerCharacterId": "ivette",
      "severity": 12,
      "content": "圣光边缘出现黑色魔力残留。"
    }
  ],
  "focusedCharacters": ["ivette", "mira", "leon"],
  "reactions": [
    {
      "characterId": "ivette",
      "stance": "suspicious",
      "content": "伊薇特盯着净化光残留的黑色边缘，默默记下了新的疑点。"
    }
  ],
  "nextChoices": [
    { "choiceId": "explain-order", "label": "解释这是古代圣骑士流派" },
    { "choiceId": "accept-test", "label": "主动接受第二次测试" },
    { "choiceId": "shift-blame", "label": "声称魔王城污染了所有法术" }
  ],
  "insertedEvent": null,
  "endingCandidate": null
}
```

字段约束：

- `adjudication` 枚举：`success`、`costly_success`、`failure`、`disaster_failure`。
- `sceneId` 必须来自主线章节或插入事件池。
- `characterId` 枚举：`leon`、`ivette`、`mira`、`locke`、`victor`、`gm`。
- `stance` 枚举：`supportive`、`suspicious`、`conflicted`、`hostile`、`opportunistic`、`panicked`、`neutral`。
- `stateAfter` 必须由服务端根据 `stateDelta` 裁剪到 0-100 后生成；LLM 可建议，但服务端结果为准。
- `flagUpdates.set` 只用于布尔或字符串值；`flagUpdates.increment` 用于计数器。
- `triggeredRules` 用于调试、回放和结算因果，不面向普通玩家直接展示。
- `isEnding=true` 时必须提供 `endingCandidate`，并停止生成 `nextChoices` 或仅提供“查看结算”。

## 10. LLM 调用边界

适合交给 LLM 的部分：

- 自由行动理解。
- 每个 AI 角色的个性化反应。
- 多角色争论。
- 离谱操作的因果解释。
- 结局卡文案润色。

不交给 LLM 自由决定的部分：

- 核心世界观。
- 主线章节顺序。
- 状态字段。
- 数值上下限。
- 结局类型。
- 角色隐藏身份。
- 版权与安全边界。

## 11. 图片提示词设计

### 11.1 主视觉海报

用途：剧本选择页海报、玩法入口 Banner。

中文提示词：

> 暗黑奇幻手游主视觉，黑发、苍白肤色、冷灰色眼睛的银白盔甲圣骑士阿斯兰背对观众站在黑曜石魔王城前，深色披风内侧隐约露出黑色王冠纹章，远处勇者队三人举着火把靠近，天空是黄昏红云和细碎魔法尘埃，画面有强烈身份反差和潜入感，电影级构图，精致角色设计，高细节，竖版 9:16，适合移动端游戏海报，无文字，无 logo。

English prompt:

> Dark fantasy mobile game key art, Aslan the silver-armored paladin with black hair, pale skin, and cold gray eyes seen from behind standing before an obsidian demon castle, the inside of his dark cloak subtly revealing a black crown crest, three hero party members approaching with torches in the distance, crimson dusk sky, faint magical particles, strong secret identity tension, cinematic composition, refined character design, highly detailed, vertical 9:16, no text, no logo.

负面提示词：

> low quality, blurry, flat lighting, modern city, sci-fi armor, text, logo, watermark, extra fingers, distorted face, cropped head, messy composition

### 11.2 玩家角色：伪装圣骑士阿斯兰

用途：玩家身份卡、状态栏头像、剧情立绘。

中文提示词：

> 半身角色立绘，阿斯兰，黑发、苍白肤色、冷灰色眼睛的年轻男性圣骑士，银白铠甲，深色披风，披风内侧有黑色王冠纹章，表情冷静克制但眼神带一点危险感，右手握着圣剑，左手指尖有非常隐约的黑色魔力，整体气质像正义骑士但隐藏反派身份，暗黑奇幻风，干净背景，高细节，适合游戏角色卡，无文字。

English prompt:

> Half-body character portrait of Aslan, a young male paladin with black hair, pale skin, and cold gray eyes, silver-white armor, dark cloak with a black crown crest inside, calm restrained expression with a subtle dangerous gaze, holding a holy sword in one hand, faint black magic around the other fingertips, heroic appearance hiding a villain identity, dark fantasy style, clean background, highly detailed, suitable for a game character card, no text.

负面提示词：

> evil monster form, full demon horns, exaggerated muscles, modern outfit, text, logo, watermark, blurry, bad anatomy

### 11.3 勇者莱昂

用途：AI 角色头像、队友状态条、对话立绘。

中文提示词：

> 半身角色立绘，莱昂，金棕色短发、琥珀色眼睛的年轻勇者，轻型冒险铠甲，红色围巾，胸前有圣剑徽记，手握长剑，气质热血但不鲁莽，暗黑奇幻队伍成员，干净背景，高细节，适合移动游戏 NPC 头像，无文字。

English prompt:

> Half-body character portrait of Leon, a young hero with golden brown short hair and amber eyes, light adventurer armor, red scarf, sacred sword emblem on the chest, holding a longsword, passionate but not reckless, dark fantasy party member, clean background, highly detailed, suitable for mobile game NPC avatar, no text.

负面提示词：

> old king, villain, sci-fi weapon, modern clothes, text, logo, watermark, blurry, deformed hands

### 11.4 法师伊薇特

用途：AI 角色头像、法师证据提示、质问场景。

中文提示词：

> 半身角色立绘，伊薇特，短银发、锐利浅蓝眼睛的冷静年轻女法师，深蓝与银色法袍，手中悬浮着侦测魔法阵，另一只手持银色法术书，表情像正在发现矛盾，暗黑奇幻推理氛围，干净背景，高细节，适合移动游戏 NPC 头像，无文字。

English prompt:

> Half-body character portrait of Ivette, a calm young female mage with short silver hair and sharp pale blue eyes, deep blue and silver robes, a detection magic circle floating above one hand, holding a silver spellbook, expression of noticing an inconsistency, dark fantasy mystery mood, clean background, highly detailed, suitable for mobile game NPC avatar, no text.

负面提示词：

> witch hat stereotype, cartoonish, modern glasses, sci-fi hologram, text, logo, watermark, blurry

### 11.5 牧师米拉

用途：AI 角色头像、救赎分支场景。

中文提示词：

> 半身角色立绘，米拉，浅金长发的温柔年轻女牧师，白金色祭司长袍，胸前有晨曦吊坠，柔和暖光，双手捧着微弱治愈光芒，眼神善良但带有担忧，暗黑奇幻中的温暖角色，干净背景，高细节，适合移动游戏 NPC 头像，无文字。

English prompt:

> Half-body character portrait of Mira, a gentle young female cleric with long light-blonde hair, white and gold priest robe, dawn pendant on her chest, soft warm light, holding a faint healing glow in both hands, kind eyes with concern, a warm character within a dark fantasy world, clean background, highly detailed, suitable for mobile game NPC avatar, no text.

负面提示词：

> angel wings, overly holy goddess, modern nurse, text, logo, watermark, blurry, distorted hands

### 11.6 盗贼洛克

用途：AI 角色头像、勒索/交易场景。

中文提示词：

> 半身角色立绘，洛克，黑色短发的年轻男性盗贼，黑色皮甲，灰色短斗篷，嘴角带狡黠笑意，一手拿匕首一手夹着偷来的密令，眼神聪明又不完全可靠，暗黑奇幻冒险队成员，干净背景，高细节，适合移动游戏 NPC 头像，无文字。

English prompt:

> Half-body character portrait of Locke, a young male rogue with short black hair, black leather armor, short gray cloak, sly smirk, holding a dagger in one hand and a stolen secret order in the other, clever and unreliable gaze, dark fantasy adventuring party member, clean background, highly detailed, suitable for mobile game NPC avatar, no text.

负面提示词：

> assassin mask covering all face, modern thief, guns, text, logo, watermark, blurry, bad anatomy

### 11.7 副官维克托

用途：魔王军 NPC 头像、灾难性营救场景。

中文提示词：

> 半身角色立绘，维克托，深红短发的忠诚魔王军副官，黑红军装式铠甲，单膝跪地姿态，表情庄严激动，胸前有魔王军徽章，背后隐约有黑红军旗和魔族士兵阴影，暗黑奇幻风，高细节，适合移动游戏 NPC 头像，无文字。

English prompt:

> Half-body character portrait of Victor, a loyal demon army adjutant with short dark red hair, black and crimson military-style armor, kneeling pose, solemn and emotional expression, demon army insignia on the chest, faint black-red army flag and silhouettes of demon soldiers behind him, dark fantasy style, highly detailed, suitable for mobile game NPC avatar, no text.

负面提示词：

> full monster creature, comedic cartoon, modern military uniform, text, logo, watermark, blurry

### 11.8 魔王城门场景

用途：第一幕背景、主叙事舞台背景。

中文提示词：

> 黑曜石魔王城大门，巨大的城门半开，门前是破碎石桥和暗红色护城河，城墙上没有守卫但有隐约魔法符文发光，黄昏天空，远处火把光点，暗黑奇幻环境概念图，宽屏 16:9，高细节，无人物主体，无文字。

English prompt:

> Obsidian demon castle gate, massive gate half open, broken stone bridge and dark red moat in front, no guards on the walls but faint glowing magical runes, dusk sky, distant torch lights, dark fantasy environment concept art, widescreen 16:9, highly detailed, no main character, no text.

负面提示词：

> modern city, sci-fi fortress, bright cheerful colors, text, logo, watermark, blurry, low detail

### 11.9 黑色圣光质问场景

用途：第二幕事件插图。

中文提示词：

> 暗黑奇幻队伍内部冲突场景，黑发、苍白肤色、冷灰色眼睛的银白圣骑士阿斯兰站在走廊中央，手中圣光边缘带有细微黑色火焰，短银发、浅蓝眼睛的女法师伊薇特举起侦测法阵质问他，金棕短发的勇者莱昂和浅金长发的牧师米拉在旁边震惊旁观，气氛紧张，电影级构图，高细节，横版 16:9，无文字。

English prompt:

> Dark fantasy party confrontation scene, Aslan the silver paladin with black hair, pale skin, and cold gray eyes standing in the center of a corridor, holy light in his hand edged with subtle black flame, Ivette the short silver-haired female mage with pale blue eyes raising a detection magic circle and questioning him, Leon the golden brown-haired hero and Mira the light-blonde cleric watching in shock nearby, tense atmosphere, cinematic composition, highly detailed, horizontal 16:9, no text.

负面提示词：

> comedy chibi, modern hallway, sci-fi UI, text, logo, watermark, blurry, distorted faces

### 11.10 受伤魔族小兵场景

用途：第三幕事件插图。

中文提示词：

> 魔王城外庭废墟，一个受伤的年轻魔族士兵被倒塌石柱压住，黑发、冷灰色眼睛的银白圣骑士阿斯兰低头靠近并做出隐蔽噤声手势，浅金长发的牧师米拉准备治疗，金棕短发的勇者莱昂在后方警惕观察，暗黑奇幻但带情感张力，电影级构图，高细节，横版 16:9，无文字。

English prompt:

> Ruined courtyard inside a demon castle, an injured young demon soldier pinned under a collapsed stone pillar, Aslan the silver paladin with black hair and cold gray eyes leaning close and making a discreet silence gesture, Mira the light-blonde cleric preparing healing magic, Leon the golden brown-haired hero watching cautiously behind them, dark fantasy with emotional tension, cinematic composition, highly detailed, horizontal 16:9, no text.

负面提示词：

> gore, excessive blood, horror monster, modern ruins, text, logo, watermark, blurry

### 11.11 副官灾难性营救场景

用途：第五幕关键插图。

中文提示词：

> 魔王城王座厅前的戏剧性场景，深红短发、黑红军装式铠甲的副官维克托带领魔王军破土而出，单膝跪地高喊效忠，黑发、冷灰色眼睛的银白圣骑士阿斯兰僵在原地，勇者队震惊转头看向他，紧张又带荒诞喜剧感，暗黑奇幻，电影级构图，高细节，横版 16:9，无文字。

English prompt:

> Dramatic scene before a demon castle throne room, Victor the short dark-red-haired adjutant in black and crimson military-style armor emerging from the ground with demon soldiers, kneeling and declaring loyalty, Aslan the silver paladin with black hair and cold gray eyes frozen in place, the hero party turning toward him in shock, tense with absurd comedic undertone, dark fantasy, cinematic composition, highly detailed, horizontal 16:9, no text.

负面提示词：

> slapstick cartoon, modern soldiers, sci-fi armor, text, logo, watermark, blurry, low detail

### 11.12 王座厅最终摊牌

用途：最终幕背景、结算页主图。

中文提示词：

> 巨大黑曜石王座厅，空王座立在画面中央，墙上有与阿斯兰相似的魔王浮雕，黑发、冷灰色眼睛的银白圣骑士背影处在光与暗之间，勇者队站在前景形成对峙，命运揭晓前一刻，暗黑奇幻史诗感，电影级构图，高细节，横版 16:9，无文字。

English prompt:

> Vast obsidian throne room, an empty throne at the center, a demon king relief on the wall resembling Aslan, the silver paladin with black hair and cold gray eyes seen from behind between light and shadow, hero party standing in confrontation in the foreground, the moment before the truth is revealed, epic dark fantasy mood, cinematic composition, highly detailed, horizontal 16:9, no text.

负面提示词：

> modern palace, sci-fi throne, bright cartoon style, text, logo, watermark, blurry, messy composition

### 11.13 结算分享卡背景

用途：人生结算卡、社交分享图。

中文提示词：

> 移动端游戏结算卡背景，暗黑奇幻风，黑曜石王座、银白披风、破碎圣剑和黑色王冠元素组合，画面中央留出空白区域供后期文字叠加，blank central area for later text overlay, no typography, no letters，边缘有细微金色魔法纹路，精致但不杂乱，竖版 9:16，无文字，无 logo。

English prompt:

> Mobile game result card background, dark fantasy style, obsidian throne, silver cloak, broken holy sword and black crown elements, blank central area for later text overlay, no typography, no letters, subtle golden magical patterns around the edges, refined but uncluttered, vertical 9:16, no text, no logo.

负面提示词：

> busy composition, unreadable text, actual text, logo, watermark, bright cartoon colors, blurry

### 11.14 角色视觉一致性锚点

后续生成多张图片时，必须在对应角色提示词中重复以下锚点，减少同一角色在不同插图里变成不同人的问题。

| 角色 | 固定外观锚点 | 固定道具/符号 |
| :--- | :--- | :--- |
| 阿斯兰 | 黑发、苍白肤色、冷灰色眼睛、银白铠甲、深色披风、披风内侧黑色王冠纹章 | 圣剑、指尖微弱黑色魔力 |
| 莱昂 | 金棕短发、琥珀色眼睛、轻型冒险铠甲、红色围巾 | 圣剑徽记、长剑 |
| 伊薇特 | 短银发、深蓝银边法袍、锐利浅蓝眼睛 | 侦测魔法阵、银色法术书 |
| 米拉 | 浅金长发、白金祭司长袍、柔和暖光 | 治愈光芒、晨曦吊坠 |
| 洛克 | 黑色短发、灰色短斗篷、黑色皮甲、狡黠笑意 | 匕首、偷来的密令 |
| 维克托 | 深红短发、黑红军装式铠甲、庄严激动表情 | 魔王军徽章、黑红军旗 |

多角色事件图生成建议：

- 首版优先保证画面有 1 个主角和 1-2 个焦点角色，不要同时要求 5 个角色都有清晰表情。
- 事件图如果要表现全队，远景角色只作为剪影或背景队形，不要求精细面部。
- 分享卡背景必须写明 `blank central area for later text overlay, no typography, no letters`，避免模型直接生成乱码文字。

## 12. 统一视觉风格建议

整体风格：

- 暗黑奇幻，但保留一点轻喜剧反差。
- 主色建议为黑曜石黑、银白、暗红、冷金。
- 避免过度恐怖、血腥和沉重，重点放在身份误会和潜入紧张感。

角色一致性：

- 玩家阿斯兰必须保持“像圣骑士但隐约不对劲”。
- 勇者队成员不能像反派，他们应该是真诚可信的伙伴。
- 维克托可以更戏剧化，但不要做成滑稽卡通。

UI 图片用途优先级：

1. 主视觉海报。
2. 玩家身份卡。
3. 五个 AI 角色头像。
4. 魔王城门背景。
5. 黑色圣光质问场景。
6. 副官灾难性营救场景。
7. 结算分享卡背景。

## 13. 首版验收标准

- 用户能在 1 分钟内理解“我是魔王，但队友不知道”。
- 每个 AI 角色都有明确作用，而不是背景 NPC。
- 每个章节都有玩家自由发挥空间。
- 状态数值能解释剧情变化，而不是装饰。
- 至少支持 6 个结局。
- 视觉资产提示词能直接用于生成海报、角色头像、事件插图和分享卡背景。

## 14. 每幕 UI 交互设计

### 14.1 全局交互框架

首版采用移动端单屏叙事舞台，所有章节共用同一套交互骨架，随剧情替换背景、焦点角色、状态警示和底部行动区。

页面结构：

- 顶部状态栏：展示当前幕名、回合数、暴露风险、勇者信任、城防和一个“更多状态”按钮。
- 角色状态横条：展示莱昂、伊薇特、米拉、洛克、维克托的头像、小型态度标签和触发警示。
- 主叙事舞台：背景图 + 当前事件文本 + 焦点角色对白气泡。
- 因果反馈条：每次行动后短暂显示关键变化，例如“法师证据 +12”“牧师救赎 +5”。
- 底部行动区：3 个预设行动卡 + 一个“自由行动”输入框。
- 暗线通信入口：当维克托可通信时，右侧出现黑鸦羽毛按钮，点击打开暗令面板。

状态展示原则：

- 默认只展示 3-4 个最关键状态，避免数值过载。
- 暴露风险达到 70 后，顶部状态栏变为高压样式。
- 法师证据达到 60 后，伊薇特头像出现“调查中”标记。
- 牧师救赎达到 75 后，米拉头像出现“可缓冲冲突”标记。
- 维克托误解达到 70 后，暗线通信入口变为红色警示。

每回合交互顺序：

1. 场景进入：播放背景和一句 GM 开场。
2. AI 焦点反应：2-3 个焦点角色发言。
3. 玩家行动：选择预设行动或输入自由行动。
4. 裁决反馈：展示成功/代价成功/失败/灾难失败。
5. 状态变化：用短动画更新关键状态。
6. AI 追问或争论：焦点角色根据结果回应。
7. 下一幕或插入事件：底部行动区刷新。

### 14.2 第一幕：城门前的安静

场景目标：让玩家立刻理解“我很熟悉这里，但不能表现得太熟”。

主视觉：

- 背景为魔王城门，城门半开，远处无守卫。
- 阿斯兰站在队伍前方，披风内侧黑色王冠纹章若隐若现。
- 右侧浮现维克托暗号：“三短一长”。

顶部重点状态：

- 暴露风险
- 勇者信任
- 维克托误解
- 队伍推进度

交互组件：

- 暗号提示卡：显示“城墙内传来熟悉号角”，但不直接解释给勇者队。
- 城门路线选择器：正门、侧门、侦查、自由行动。
- 黑鸦羽毛按钮：允许玩家给维克托发一个短暗令。

预设行动卡：

- “建议先侦查”：降低推进速度，提升勇者信任，小幅增加法师证据。
- “主动破门”：提升勇者信任，但可能损坏或暴露城防法阵。
- “引导绕侧门”：保住正门城防，但伊薇特可能怀疑玩家熟悉地形。

AI 交互：

- 莱昂会问：“阿斯兰，你怎么看？”
- 伊薇特在玩家选择路线后给出一次观察性评论。
- 若玩家发送暗令太模糊，维克托误解上升并弹出“副官理解偏差”反馈。

特殊反馈：

- 若维克托误解达到 60，屏幕边缘短暂闪红，提示“城内号角变急促了”。

### 14.3 第二幕：黑色圣光

场景目标：制造第一次明确身份危机，让伊薇特真正开始发挥。

主视觉：

- 背景为魔王城走廊。
- 阿斯兰手中圣光边缘出现黑色火焰。
- 伊薇特的侦测法阵悬浮在前景。

顶部重点状态：

- 暴露风险
- 法师证据
- 牧师救赎
- 勇者信任

交互组件：

- 证据卡浮层：显示“黑色圣光残留”，归属伊薇特。
- 净化测试按钮：若选择接受净化，会打开一次风险确认弹窗。
- 台词记忆提示：若玩家前后说法矛盾，系统标出“伊薇特记下了这句话”。

预设行动卡：

- “解释为古代圣骑士流派”：考验说法一致性，成功可压低暴露。
- “主动接受净化”：提高牧师救赎，但失败会增加法师证据。
- “反问伊薇特太紧张”：短期转移压力，但增加 contradictionCount 风险。

AI 交互：

- 伊薇特会提出至少一个追问。
- 米拉可能替玩家给出温和解释。
- 洛克不一定发言，但头像上出现“注意到了”标签。

特殊反馈：

- 法师证据达到 60 后，伊薇特头像下出现“主动调查已解锁”。

### 14.4 第三幕：认出你的魔族小兵

场景目标：让玩家在身份安全和道德选择之间摇摆。

主视觉：

- 背景为外庭废墟。
- 魔族小兵被石柱压住。
- 米拉站在最前方准备治疗。

顶部重点状态：

- 暴露风险
- 牧师救赎
- 维克托误解
- 魔王城防

交互组件：

- 小兵称呼危机条：小兵越激动，越接近喊出“陛下”。
- 噤声动作按钮：可消耗一次行动尝试压住称呼。
- 治疗/审问/放弃三态选择。

预设行动卡：

- “救下小兵并暗示闭嘴”：提升牧师救赎，但增加暴露风险。
- “建议先审问”：争取控制信息，但米拉可能反感。
- “制造混乱掩盖称呼”：可降低当场风险，但提高蝴蝶偏离度。

AI 交互：

- 米拉会主动要求救人。
- 莱昂根据玩家态度判断玩家是否仍像圣骑士。
- 若小兵被救，后续暗线通信面板解锁“一次准确传令”提示。

特殊反馈：

- 成功救人后出现旗标提示：“savedDemonSoldier 已记录”，但 UI 文案展示为“一个未来的暗线帮手活了下来”。

### 14.5 第四幕：盗贼偷到密令

场景目标：把信息差变成交易压力，让洛克从旁观者变成主动变量。

主视觉：

- 背景为内城物资室或破损军械库。
- 洛克手里夹着密令，似笑非笑。
- 其他队友暂时离得较远，形成私聊感。

顶部重点状态：

- 盗贼把柄
- 暴露风险
- 法师证据
- 勇者信任

交互组件：

- 密令卡：可点击查看被洛克掌握的危险内容。
- 私聊抽屉：洛克单独勒索时从底部弹出。
- 交易筹码选择：金币、爵位、保命承诺、威胁、公开解释。

预设行动卡：

- “收买洛克”：降低短期危机，但留下后续加价可能。
- “威胁洛克”：快速压制，但可能触发公开背刺。
- “公开说这是嫁祸”：高风险高收益，成功可提升勇者信任。

AI 交互：

- 洛克会根据盗贼把柄分阶段行动：私聊、叫价、公开交易。
- 伊薇特若法师证据高，会要求检查密令。
- 莱昂会根据玩家是否坦诚更新信任。

特殊反馈：

- 若 bribedLocke 为 true，洛克头像出现“临时同盟”标签，并显示冷却回合。

### 14.6 第五幕：副官灾难性营救 / 隐秘暗令

场景目标：让前面积累的维克托误解产生结构性分叉，而不是必定掉马。

高误解版本：副官灾难性营救

- 触发条件：维克托误解 `>=70`。
- 主视觉：维克托破土而出，单膝跪地，高喊效忠。
- UI 表现：全屏震动 + 暴露风险警报 + 勇者队头像同时闪烁。

低误解版本：王座厅前的隐秘暗令

- 触发条件：维克托误解 `<70`。
- 主视觉：黑鸦羽毛与军令戒指从墙缝滑出。
- UI 表现：暗线通信面板打开，但洛克和伊薇特可能注意到异常。

顶部重点状态：

- 暴露风险
- 维克托误解
- 法师证据
- 牧师救赎

高误解预设行动卡：

- “攻击维克托，假装认错”：降低暴露，但设置 betrayedVictor。
- “声称这是幻术陷阱”：依赖法师证据和牧师救赎。
- “直接承认身份并谈判”：进入和平或最终战路线。

低误解预设行动卡：

- “准确传令维克托待命”：降低维克托误解。
- “销毁戒指”：降低暴露，但可能增加洛克把柄。
- “让洛克代为交易”：把风险转移给盗贼路线。

AI 交互：

- 高误解版本中，莱昂和伊薇特必定成为焦点角色。
- 低误解版本中，洛克和伊薇特成为焦点角色，维克托通过暗令回应。
- 米拉救赎达到 75 时，可强制插入“先听他说完”缓冲。

特殊反馈：

- 若危机被化解，显示“重大危机已化解”，resolvedMajorCrisisCount +1。
- 若处理失败，直接进入当场掉马危机或王座厅审判。

### 14.7 第六幕：空王座

场景目标：汇总所有证据、关系和代价，让玩家选择最终姿态。

主视觉：

- 背景为黑曜石王座厅。
- 空王座居中。
- 墙上浮雕与阿斯兰轮廓相似。
- 队友站位随最终关系变化：信任高则距离更近，敌意高则形成包围。

顶部重点状态：

- 暴露风险
- 勇者信任
- 法师证据
- 牧师救赎
- 魔王城防

交互组件：

- 证据链面板：伊薇特掌握的关键证据按时间线展示。
- 命运路线提示：卧底、甩锅、摊牌、和平、逃走。
- 最终行动确认：终局选择需要二次确认，并展示可能影响。

预设行动卡：

- “坚持伪装到底”：适合低暴露路线。
- “把锅推给维克托”：适合 betrayedVictor 或盗贼把柄较低路线。
- “承认身份并谈判”：适合高牧师救赎和高勇者信任路线。
- “启动传送阵逃走”：适合无法说服但仍想保命路线。

AI 交互：

- 伊薇特若法师证据 `>=85`，打开证据链面板并逐条质询。
- 莱昂根据信任值决定是拔剑、沉默还是请求解释。
- 米拉可在高救赎时为玩家争取最后一轮解释。
- 洛克根据把柄和收买状态选择站队。
- 维克托根据 betrayedVictor、victorMisread 和暗令记录选择背锅、沉默或揭穿。

特殊反馈：

- 进入结局前显示“命运结算中”，按 8.1 结局优先级判定。

### 14.8 结算页 UI

页面结构：

- 顶部：结局称号，例如“影帝魔王”“双面共主”“王座僵局”。
- 中部：结算主图或分享卡背景。
- 状态终值：展示 5 个最关键状态的最终值。
- 命运因果：展示最大风险来源、最大转机、最大代价。
- 节点回放：折叠列表展示六幕关键选择。
- 分享按钮：生成结算卡。
- 再来一局按钮：保留剧本，重置状态。

交互重点：

- 用户要能看懂“为什么进了这个结局”。
- 结算不只展示分数，也展示 AI 角色如何影响命运。
- 分享卡只输出称号、短文案和 3 个关键状态，不展示复杂调试字段。
