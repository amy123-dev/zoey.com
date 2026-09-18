"""Curated additions cross-checked against all 36 supplied PDF pages. Keeps old IDs."""
import json, re
from pathlib import Path
p=Path('lib/course.json'); course=json.loads(p.read_text(encoding='utf8'))

# Complete sentences replace previously shortened versions without losing progress IDs.
full={
"That's just robbing Peter to pay Paul!":("Never use a credit card to pay a debt—that’s just robbing Peter to pay Paul!",'不要用信用卡还债，那是在拆东墙补西墙'),
"I'll have to take a rain check for dinner this Saturday.":("I’m sorry, but I’ll have to take a rain check for dinner this Saturday. Would next weekend work for you?",'抱歉，周六的晚餐要改期；下周末可以吗？'),
"If you ask me, it's a no-brainer.":("If you ask me, it’s a no-brainer. Of course you should accept the job.",'如果你问我，这不用多想，当然应该接受这份工作'),
"Changed your mind?":("Oh, I thought you were going to have oatmeal for breakfast. Changed your mind?",'我以为你早餐要吃燕麦，你改变主意了吗？'),
"That argument we had is just water under the bridge now.":("That argument we had is just water under the bridge now—don’t even worry about it.",'那场争吵已经过去了，不用担心了'),
"Of course I feel like a hot mess!":("I don’t have a job, and I’m living at home at 38 years old—of course I feel like a hot mess!",'我没有工作，38 岁还住在家里，当然觉得一团糟'),
"Money talks!":("Don’t worry. Money talks!",'别担心，有钱能使鬼推磨'),
"My parents always taught me to shoot for the stars.":("My parents always taught me to shoot for the stars when I was growing up.",'成长过程中父母总教导我要志存高远'),
"I'm really in the mood for ice cream today.":("I don’t know why, but I’m really in the mood for ice cream today.",'不知道为什么，我今天特别想吃冰淇淋'),
"She's a smart cookie!":("Don’t underestimate Cindy’s intelligence—she’s a smart cookie!",'不要低估 Cindy 的智力，她很聪明'),
"Says who?":("He’s not good enough for me? Says who?",'他配不上我？谁说的？'),
"I've got your back.":("You know my door is always open, Lauren. Come on in and tell me what’s going on.",'你知道我随时欢迎你来，Lauren；进来告诉我发生了什么'),
"The ocean is a stone's throw away!":("This vacation home is amazing. The ocean is a stone’s throw away!",'这个度假屋太棒了，离海近在咫尺'),
"It's no use crying over spilt milk now.":("I know you really wanted that job, but you weren’t hired, so it’s no use crying over spilt milk now.",'我知道你很想要那份工作，但没有被录用，现在后悔也无济于事'),
"I have no hard feelings.":("Sure, Jacob and I broke up, but I have no hard feelings. I still think he’s a great guy.",'我和 Jacob 分手了，但没有怨恨，仍然觉得他很好'),
"The boss keeps giving me a hard time.":("I think I’ve done a good job at work, but the boss keeps giving me a hard time.",'我觉得工作做得不错，老板却总找麻烦'),
"Why do you play hard to get?":("Why can’t we go out? Why do you play hard to get?",'为什么不能和我约会？你为什么欲擒故纵？'),
"He must have gotten up on the wrong side of the bed!":("Geez, the boss has been in a really bad mood all day. I guess he must have gotten up on the wrong side of the bed!",'老板一整天心情很差，想必起床就不顺心'),
"He just has to do it at his own pace.":("Don’t worry, he’ll get the project done—he just has to do it at his own pace.",'别担心，他会完成项目，只是要按自己的节奏'),
"They're like two peas in a pod.":("They’re like two peas in a pod; of course they’re married!",'他们那么相像，当然已经结婚了'),
"That was a blessing in disguise.":("She broke up with him, but that was a blessing in disguise.",'她和他分手了，但这是因祸得福'),
"I'm going to put my cards on the table.":("I’m going to put my cards on the table. I can’t offer you this job.",'我摊牌了，我不能给你这份工作'),
"Any time I need help, he's there at the drop of a hat.":("I can always depend on my dad. Any time I need help, he’s there at the drop of a hat.",'我总能依靠爸爸，需要帮助时他总会立刻出现'),
"I have a sweet tooth.":("I have a sweet tooth. I can’t live without blueberry cakes.",'我爱吃甜食，没有蓝莓蛋糕就活不下去'),
"It totally slipped my mind.":("I’m sorry I didn’t call you back sooner. It totally slipped my mind.",'抱歉没有及时回电话，我完全忘了'),
"Changsha is my home away from home.":("Changsha is my home away from home. Although I am not from Changsha, it feels like home.",'长沙是我的第二故乡，虽然不是长沙人，这里却像家'),
"It was a blast from the past.":("Oh, this was my favorite movie in high school! It was a blast from the past.",'这是我高中最喜欢的电影，真是一波回忆杀'),
"She's been under a lot of pressure recently.":("Be nice to her—she’s been under a lot of pressure recently.",'对她好点，她最近压力很大'),
"A leopard cannot change its spots.":("I don’t think he will change. A leopard cannot change its spots.",'我觉得他不会改变，本性难移'),
"You will steal my thunder.":("If you wear that dress to my wedding, you will steal my thunder.",'穿那条裙子来我的婚礼会抢我的风头'),
"He always stretches the truth.":("I don’t trust him. He always stretches the truth.",'我不信任他，他总是夸大事实'),
"You've got to have faith in the relationship.":("I know dating over a long distance can be hard, but you’ve got to have faith in the relationship.",'我知道异地恋很难，但你要对感情有信心'),
"I suggest that you think twice about him.":("Ed may be a good choice, but I suggest that you think twice about him.",'Ed 可能是不错的选择，但我建议你三思'),
"She's a hard nut to crack.":("I’ve been dating Jenny for over a year, and I still think she’s a hard nut to crack!",'和 Jenny 交往一年多了，仍觉得她难以看透'),
"The daily commute to work can be quite mundane.":("The daily commute to work can be quite mundane, but I make it more enjoyable by listening to podcasts or audiobooks.",'每天通勤很枯燥，我通过听播客和有声书让它有趣一些'),
"I just need some me-time.":("Sorry, I’m not going out tonight. I just need some me-time.",'抱歉今晚不出去，我需要独处时间'),
"Cooking's kind of my thing.":("Cooking’s kind of my thing. I’m always trying out new recipes I see online.",'做饭是我的爱好，我总尝试网上的新菜谱'),
"I had a trump card.":("I was pretty sure that I was going to win. I had a trump card.",'我很确信会赢，因为有一张王牌'),
"You're just asking for trouble.":("Don’t talk to me that way. You’re just asking for trouble.",'别那样和我说话，你在自找麻烦'),
"To me, it's like watching paint dry.":("Everyone loves that movie, but to me, it’s like watching paint dry.",'大家都喜欢那部电影，但我觉得无聊极了'),
"Luckily, we're out of the woods now.":("Our business has been terrible all year. Luckily, we’re out of the woods now.",'今年生意一直糟糕，幸运的是终于脱困了')}
for card in course['cards']:
 if card['en'] in full:
  card['en'],card['zh']=full[card['en']]
 card['category']='expression'
 if card['lesson'] in [9,11,20] or (card['lesson']==15 and card['page']==29) or card['en']=='on a regular basis':card['category']='detail'

# lesson | PDF page | Chinese cue | exact expression(s), separated only when genuine alternatives
additions='''
1|2|太贵了，简直抢钱|That’s highway robbery!
1|3|你住哪里？我住在这个城市|Where do you live? I live in the city.
2|4|电费账单|the electricity bill
2|4|电话账单|the phone bill
2|4|一张钞票|a dollar bill
2|4|房贷|mortgage
2|4|学生贷款账单|the student loan bills
2|4|房奴；房贷让人拮据|house poor
2|4|圣诞铃声|jingle bells
2|4|婚礼钟声|wedding bells
2|5|背景调查|a background check
2|5|体检|a health check / a medical check
2|5|入住|check in
2|5|退房|check out
2|5|通过安检|go through the security check
2|5|让我消停一下|Give me a rest! / Give me a break!
2|6|今日穿搭|Fit check! / Outfit of the day.
3|6|感到忧郁|feel blue
3|7|老爸|my old man
3|7|问与答|question and answer
3|7|咖啡壶|coffee pot
3|8|我会远离那些承诺赚快钱的事，总是骗局|I stay away from anything that promises that I can make fast money—it’s always a scam.
3|8|只做职责内的最低要求|quiet quitting
3|8|你总吹嘘能轻松做四十个俯卧撑，不如做给我看|You keep bragging to me that you can do forty pushups without breaking a sweat, but how about you walk the walk instead of talking the talk?
3|8|电影一塌糊涂，剧情不通，演技很差|This film is just a hot mess—the plot doesn’t make sense and the acting is terrible.
4|10|老铁、伙伴（五种称呼）|bro / dude / homie / man / dawg
4|10|没什么新鲜事；闲着呢；老样子|Not much. / Just chilling. / Same old, same old!
4|10|钞票、现金、钱|dollar bills / cash / money
4|10|钱的口语说法|dough / moolah / dead presidents
4|10|一美元的口语说法|a buck
4|10|祈求好运；但愿别出岔子|Knock on wood.
4|10|三伏天|dog days
4|10|酷热（burning）|It’s burning.
4|10|酷热（boiling）|It’s boiling.
4|10|酷热（roasting）|It’s roasting.
4|10|酷热（scorching）|It’s scorching.
4|10|你疯了吗（其他说法）|Are you insane? / Are you out of your mind? / Are you nuts?
4|10|这是我吃过最好吃的自制凯撒沙拉|This really is the best homemade Caesar salad!
4|10|社交恐惧|social phobia
4|11|他是肇事逃逸的司机|He’s the hit-and-run driver!
4|11|每天|on a daily basis
4|11|日常安排|daily routine
4|11|以……开始我的一天|start off my day with
5|12|完美日记|Perfect Diary
5|12|急诊室|emergency room
5|12|全日制；全职|full-time
5|12|非全日制；兼职|part-time
5|12|对细菌的恐惧（笔记中的“洁癖”）|germophobia
5|12|搭讪话术|a pickup line
6|13|抗糖化|anti-glycation
6|13|遵循无糖饮食计划|follow a no-sugar diet plan
6|13|参加三十天无糖挑战|take part in a thirty-day no-sugar challenge
6|13|限制糖摄入|limit sugar intake
6|13|避免人工甜味剂|avoid artificial sweeteners
6|13|无糖饮食是最健康的（原笔记语言例句）|Sugar-free diets are the healthiest.
6|13|还要再来一点吗|Would you like some more?
6|14|我想以全新的形象开始大学生活|I wanted to start college with a completely new look.
7|14|股东|shareholder
7|14|我喜欢……|I’m fond of
7|14|我痴迷于……|I’m obsessed with
7|14|我对……没有抵抗力|I have a weakness for
7|14|我偏爱……|I’m partial to
7|14|我热衷于……|I’m passionate about
7|14|爱狗的人|a dog person
7|15|唐人街|Chinatown
7|15|餐厅不允许吸烟|Smoking is not allowed in this restaurant.
7|15|易如反掌（拿糖）|It’s as easy as taking candy from a baby.
7|15|易如反掌（桶里射鱼）|It’s as easy as shooting fish in a barrel.
7|15|我一直在这里支持你|I’m always here for you. / I’ve got your back.
7|16|不要放弃希望，机会永远存在|Don’t give up hope. There’s always a chance.
7|16|父母警告我们，他们不在时不要开派对|My parents warned us not to throw a party while they’re gone.
7|16|吃香的工作|a sought-after job
8|16|实话说，地铁都比你的沙发干净|Not gonna lie, the subway’s cleaner than your couch.
10|19|便宜油腻的小饭馆|a greasy spoon
10|19|太酷了|Dope!
10|19|发朋友圈|post on Moments
10|19|群聊|a group chat
10|19|人设|persona
10|19|舔狗（网络贬称）|simp
10|20|被利用的工具人|a cat’s paw
10|20|爆料；泄露秘密|spill the beans
10|20|智商税（直译网络说法）|stupid tax
10|20|集中发一组生活照片|a photo dump
10|20|我们有相同的兴趣爱好|We share the same interests and hobbies.
10|20|这是世界上最好的茶|This is the best tea on the planet.
10|21|因为（bc）|because
10|21|生日快乐（hbd）|Happy birthday!
10|21|马上回来（bbs）|Be back soon.
10|21|亦敌亦友；塑料姐妹|frenemy
10|21|爱恨交织的关系|a love-hate relationship
10|21|我们是铁哥们|We’re tight buddies.
10|21|你是最棒的|You’re the best!
10|21|先再见啦（bfn）|Bye for now.
10|21|宝贝的称呼|bae / boo / baby boo / sugar boo
10|22|世界上没有比长沙更好的地方|There’s no better place in the world than Changsha.
12|24|我喜欢特别辣的食物|I’m really into face-melting spicy food.
12|24|上个月去纽约度了周末，回来满血复活|Last month I went to New York City for a weekend and came back completely refreshed.
12|25|因为我是独生子女，妈妈对我生活中的事总有点大惊小怪|Since I was an only child, my mother tended to be a bit of a drama queen about anything happening in my life.
12|25|自从 Mark 抢走 Greg 的女朋友，他们就成了死对头|They have been deadly enemies ever since Mark stole Greg’s girlfriend.
13|25|他喝醉了|He’s drunk. / He got wasted.
13|25|疯狂购物|a shopping spree
13|25|低头族（smartphone + zombie）|smombie
13|26|我对 Bill 认真了，可惜他对 Mary 认真了|I’m afraid I’m getting serious about Bill. Bill, unfortunately, is pretty serious about Mary.
13|26|我本想回家路上去杂货店，却忘了|I meant to go to the grocery store on my way home, but it slipped my mind.
13|26|我玩得很开心|I had a blast. / I had a ball.
14|27|我最近很抑郁，最后去看了心理医生|I was so depressed lately that I ended up going to the shrink.
14|27|供你参考（FYI）|For your information.
14|27|压力很大|under a lot of pressure
14|27|恢复精力|recharge one’s batteries
14|28|今天有没有特别想做的事|Is there anything special that you really wanna do?
14|28|爷爷给我的笔是我最珍贵的物品之一|This pen that my grandfather gave me is one of my most treasured possessions.
14|28|我这几天没多少时间休闲娱乐|I don’t have much opportunity for leisure pursuits these days.
15|28|蔬菜；蔬菜的口语叫法|vegetables / veggies
15|28|维生素|vitamins
15|29|纯素食者|vegan
15|29|自由女神像|the Statue of Liberty
15|29|庙宇与雕像会衰败，但书籍长存|Temples and statues decay, but books survive.
15|29|商店扒手|shoplifter
15|29|害群之马|black sheep
15|29|时间管理能力|time management skills
15|29|费时的|time-consuming
15|29|费力的|energy-consuming
15|29|我会两种语言|I’m bilingual.
15|29|你不说英语吗|Don’t you speak English?
15|29|你不喜欢上一份工作的哪一点|What didn’t you like about your last job?
15|29|你理想的工作是什么|What would your dream job be?
15|30|我在大学时认识了我的丈夫|I met my husband when we were in college.
15|30|考试前我紧张得发抖|I was shaking like jelly before my exam.
15|30|相亲前我紧张得发抖|I was shaking like jelly before my blind date.
15|30|我奇怪地觉得我们以前见过|I had a strange feeling that we’d met before.
15|31|你有没有背叛我|Have you been cheating on me?
16|31|披萨吃太多，我撑坏了|I ate too much pizza. I’m stuffed!
16|31|我不喜欢这餐厅的氛围，换一家吧|I’m not feeling the vibe of this restaurant. Let’s try somewhere else.
16|31|他给我的感觉不好，总觉得哪里不对|I’m not getting good vibes from him. Something feels off.
17|32|点赞|a thumbs-up
17|32|我受够你的傲慢了|I’m so sick of your arrogance.
17|32|富二代|trust fund baby
17|32|闲聊（两种说法）|shoot the breeze / chew the fat
17|32|人生就像淋浴，转错一下就陷入麻烦（双关）|Life is just like taking a shower: one wrong turn, and you’re in hot water.
17|32|对知之甚少的项目投入这么多钱，也许该三思|Maybe we should think twice about investing so much money in a project we know so little about.
17|32|来生再见|See you in another life!
18|33|秋老虎|Indian summer
18|33|每年夏天成千上万人涌向乡下|Every summer thousands of people flock to the countryside.
18|33|付账单和买菜之类的日常琐事让我提不起兴趣|Mundane matters such as paying bills and shopping for food do not interest me.
18|33|我不喜欢鸡翅，上面没多少肉|I don’t like chicken wings—there’s not much meat on them.
19|34|近看人生是悲剧，远看则是喜剧|Life is a tragedy when seen in close-up, but a comedy in long shot.
19|34|你有麻烦了，妈妈要气死了|Oh, you’re in trouble now. Mom’s gonna kill you!
19|34|和亲戚度假一周足以让我抓狂|A week on vacation with my relatives is enough to drive me up the wall.
19|34|敢想就能做到|If you can dream it, you can do it.
19|34|像看草生长一样无聊|It’s like watching grass grow.
19|35|我不懂为什么 Steve 从不学习却总拿高分|I just don’t get why Steve never studies but always gets good grades.
19|35|高峰时期城市道路堵塞|The roads in the city are congested with traffic during rush hour.
19|35|这本书读了好多遍，内容了如指掌|I’ve read this book so many times, I know it like the back of my hand.
19|35|Tom 昏迷了一整夜，谢天谢地似乎已脱险|Tom was in a coma all night. Thank God he seems to be out of the woods now!
19|35|这是我的一点看法（here）|Here’s my two cents.
'''
for i,line in enumerate(additions.strip().splitlines(),1):
 lesson,page,zh,en=line.split('|');en=en.replace('’',"'")
 if any(c['lesson']==int(lesson) and c['en']==en for c in course['cards']):continue
 course['cards'].append(dict(id=f's1-extra-{i:03}',season=1,lesson=int(lesson),page=int(page),zh=zh,en=en,key=en,tip='来自本课原笔记；对应原页可核对上下文。',correction='',category='expression'))
for c in course['cards']:c['en']=c['en'].replace('’',"'")
course['version']=3
p.write_text(json.dumps(course,ensure_ascii=False,indent=2),encoding='utf8')
print('Expressions and examples:',len(course['cards']))
