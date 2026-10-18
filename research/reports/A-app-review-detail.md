# A · App review analysis: full detail

Everything behind the app-review findings: where the data came from, how it was processed, every table, and the raw coded examples. Scripts and data files are in `ai-builder-cup/research/app-reviews` so anyone can rerun them.

## 1. Data collected

**Source:** Apple's public App Store customer-review RSS feed (`itunes.apple.com/{country}/rss/customerreviews/...`), most recent reviews, up to 10 pages × 50 = 500 per app per country. Collected 26 Sep 2026 by `fetch_reviews.py`. iPhone users only; Google Play has no official public feed.

| App and market | Reviews | 1–2 star | Oldest | Newest |
| --- | --- | --- | --- | --- |
| Bunjang kr | 500 | 376 (75%) | 2026-06-15 | 2026-09-24 |
| Carousell hk | 500 | 166 (33%) | 2025-07-28 | 2026-09-24 |
| Carousell my | 500 | 165 (33%) | 2024-09-11 | 2026-09-22 |
| Carousell ph | 500 | 141 (28%) | 2023-05-21 | 2026-09-24 |
| Carousell sg | 500 | 184 (37%) | 2025-10-10 | 2026-09-24 |
| Carousell tw | 500 | 308 (62%) | 2024-03-10 | 2026-09-21 |
| Cars24 au | 62 | 25 (40%) | 2021-11-25 | 2026-09-09 |
| Cars24 in | 500 | 335 (67%) | 2026-04-26 | 2026-09-25 |
| Cashify in | 500 | 386 (77%) | 2025-05-21 | 2026-09-24 |
| Gumtree au | 500 | 293 (59%) | 2025-09-24 | 2026-09-25 |
| Karrot kr | 500 | 320 (64%) | 2026-07-04 | 2026-09-24 |
| Mercari JP jp | 500 | 276 (55%) | 2026-09-03 | 2026-09-25 |
| Mudah my | 500 | 112 (22%) | 2023-11-15 | 2026-09-20 |
| OLX id | 250 | 213 (85%) | 2026-06-20 | 2026-09-24 |
| OLX in | 500 | 343 (69%) | 2026-07-12 | 2026-09-25 |
| Spinny in | 500 | 272 (54%) | 2025-08-04 | 2026-09-24 |
| Yahoo Flea Market jp | 500 | 156 (31%) | 2026-07-19 | 2026-09-25 |
| **Total** | **7812** | **4071 (52%)** | | |

Note the uneven time spans: Mercari's 500 reviews cover only ~3 weeks; Carousell PH spans 3 years. Reebelo was not found on the App Store.

## 2. Step 1: keyword pass over all reviews

`classify.py` tags every 1–2 star review with themes using English, Malay/Indonesian, Japanese, Korean and Chinese keywords. It's fast and reproducible but noisy (e.g. "not working" catches app bugs; "scam" is used as an insult against managed sellers). That's why the hand labelling below was done.

## 3. Step 2: hand labelling, round 1 (narrow codes)

A random 360 negative reviews (25 per C2C app-market, 20 per managed player; `sample.jsonl`), each read and coded by an AI labeller (`labels.jsonl`). Claude checked 15 "unfair dispute" labels by hand: about 10 were true transaction disputes; the rest were moderation decisions.

**Share of reviews mentioning each code, per app:**

| App | n | app ux | dispute unfair | support poor | fees | company misconduct | fraud user | account ban | other | report ignored | not as described | refund abuse by buyer |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bunjang kr | 25 | 12% | 20% | 12% | 72% | 0% | 12% | 44% | 4% | 4% | 0% | 0% |
| Carousell hk | 25 | 44% | 36% | 28% | 12% | 0% | 16% | 12% | 0% | 12% | 4% | 0% |
| Carousell my | 25 | 32% | 28% | 20% | 8% | 0% | 32% | 16% | 8% | 8% | 4% | 0% |
| Carousell ph | 25 | 48% | 20% | 8% | 20% | 0% | 20% | 8% | 4% | 8% | 0% | 0% |
| Carousell sg | 25 | 44% | 8% | 16% | 4% | 0% | 4% | 12% | 24% | 4% | 0% | 0% |
| Carousell tw | 25 | 24% | 52% | 32% | 0% | 0% | 12% | 20% | 12% | 0% | 4% | 8% |
| Cars24 in | 20 | 0% | 5% | 35% | 35% | 85% | 0% | 0% | 5% | 0% | 10% | 0% |
| Cashify in | 20 | 5% | 0% | 15% | 0% | 80% | 0% | 0% | 10% | 0% | 15% | 0% |
| Gumtree au | 25 | 72% | 0% | 4% | 8% | 0% | 12% | 0% | 8% | 0% | 0% | 0% |
| Karrot kr | 25 | 36% | 24% | 28% | 0% | 0% | 8% | 12% | 20% | 4% | 0% | 16% |
| Mercari JP jp | 25 | 36% | 40% | 36% | 16% | 0% | 24% | 8% | 8% | 8% | 4% | 0% |
| Mudah my | 25 | 84% | 0% | 0% | 12% | 0% | 4% | 0% | 4% | 0% | 0% | 0% |
| OLX in | 25 | 48% | 24% | 4% | 48% | 0% | 4% | 0% | 4% | 0% | 0% | 0% |
| Spinny in | 20 | 10% | 5% | 15% | 5% | 75% | 0% | 0% | 15% | 0% | 5% | 0% |
| Yahoo Flea Market jp | 25 | 32% | 32% | 16% | 4% | 0% | 4% | 16% | 12% | 4% | 8% | 0% |

## 4. Step 3: hand labelling, round 2 (broad, neutral codes)

The same 360 reviews re-coded against 15 neutral complaint types so that disputes compete fairly with discovery, pricing, logistics and others (`labels_broad.jsonl`). "Primary" is the single main complaint.

| App | n | app tech | fees monetisation | support | account moderation | company misconduct | dispute handling | scam fraud | payment | listing effort | discovery | pricing | other | logistics | item quality | meetup safety |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bunjang kr | 25 | 8% | 72% | 20% | 48% | 0% | 8% | 12% | 16% | 4% | 0% | 0% | 8% | 8% | 0% | 0% |
| Carousell hk | 25 | 48% | 24% | 36% | 32% | 0% | 4% | 16% | 4% | 16% | 0% | 0% | 0% | 0% | 4% | 0% |
| Carousell my | 25 | 28% | 20% | 28% | 24% | 0% | 16% | 32% | 16% | 4% | 4% | 0% | 0% | 0% | 0% | 4% |
| Carousell ph | 25 | 40% | 28% | 16% | 36% | 0% | 0% | 20% | 8% | 12% | 8% | 0% | 0% | 8% | 0% | 0% |
| Carousell sg | 25 | 36% | 16% | 20% | 28% | 0% | 8% | 16% | 4% | 12% | 4% | 0% | 0% | 8% | 0% | 8% |
| Carousell tw | 25 | 24% | 8% | 40% | 40% | 0% | 20% | 12% | 32% | 12% | 0% | 8% | 4% | 0% | 8% | 0% |
| Cars24 in | 20 | 5% | 45% | 50% | 0% | 95% | 5% | 0% | 5% | 0% | 0% | 25% | 5% | 0% | 10% | 0% |
| Cashify in | 20 | 5% | 5% | 15% | 0% | 55% | 10% | 0% | 0% | 0% | 0% | 30% | 10% | 5% | 30% | 0% |
| Gumtree au | 25 | 64% | 40% | 4% | 0% | 0% | 0% | 12% | 0% | 4% | 20% | 0% | 4% | 0% | 0% | 0% |
| Karrot kr | 25 | 28% | 0% | 32% | 36% | 0% | 28% | 12% | 16% | 0% | 16% | 4% | 8% | 12% | 0% | 0% |
| Mercari JP jp | 25 | 28% | 24% | 36% | 40% | 0% | 28% | 4% | 16% | 0% | 8% | 4% | 20% | 16% | 4% | 0% |
| Mudah my | 25 | 84% | 16% | 0% | 0% | 0% | 0% | 4% | 0% | 16% | 12% | 0% | 0% | 0% | 0% | 0% |
| OLX in | 25 | 52% | 64% | 8% | 8% | 0% | 8% | 8% | 0% | 16% | 20% | 0% | 0% | 0% | 0% | 0% |
| Spinny in | 20 | 10% | 0% | 30% | 0% | 75% | 10% | 0% | 0% | 0% | 0% | 35% | 25% | 0% | 5% | 0% |
| Yahoo Flea Market jp | 25 | 28% | 4% | 16% | 16% | 0% | 36% | 4% | 4% | 8% | 8% | 8% | 8% | 24% | 8% | 0% |

**Primary complaint, per app:**

| App | Top primary complaints |
| --- | --- |
| Bunjang kr | fees monetisation 16, account moderation 4, dispute handling 2, other 1 |
| Carousell hk | app tech 11, account moderation 5, fees monetisation 3, scam fraud 3 |
| Carousell my | scam fraud 6, app tech 6, fees monetisation 4, account moderation 4 |
| Carousell ph | app tech 10, fees monetisation 6, account moderation 4, scam fraud 4 |
| Carousell sg | app tech 8, account moderation 3, fees monetisation 3, support 2 |
| Carousell tw | account moderation 8, dispute handling 5, support 3, app tech 3 |
| Cars24 in | company misconduct 16, item quality 2, other 1, support 1 |
| Cashify in | company misconduct 9, item quality 4, support 2, pricing 2 |
| Gumtree au | app tech 13, fees monetisation 5, scam fraud 3, discovery 3 |
| Karrot kr | account moderation 8, dispute handling 5, app tech 5, discovery 2 |
| Mercari JP jp | dispute handling 6, app tech 5, other 3, account moderation 3 |
| Mudah my | app tech 20, listing effort 2, fees monetisation 2, scam fraud 1 |
| OLX in | fees monetisation 12, app tech 7, support 1, scam fraud 1 |
| Spinny in | company misconduct 12, other 4, pricing 1, app tech 1 |
| Yahoo Flea Market jp | dispute handling 8, app tech 6, account moderation 4, discovery 2 |

**Example reviews per broad code** (first 220 characters, randomly picked, translated text left as written):

### App Tech (96 primary)

- *Mudah my, 1★:* horrible app / this app is so bad. i can't stand the way it lags. i want to curse so bad
- *Carousell hk, 1★:* 收唔到信息 / 買bump想快速賣二手用品 顯示有賣家interested但是信息欄完全唔提示 呃錢app
- *Cashify in, 1★:* App not working / I downloaded your application and when I click to use the application, it just shows a white screen. No other functions are working. No homepage know any options are visible. I deleted and downloaded ag
- *Mercari JP jp, 1★:* くだらないアップロード / 以前は月数万単位で大口利用していたが、くだらないバージョンアップが多すぎ、OS が置いてけぼりになった。これが本質である。眼には眼を、もう利用しない。

### Fees Monetisation (56 primary)

- *OLX in, 1★:* Bakwas app now / Ek dum bakwas app hai ye aab … har 1 min mai ads aa jata hai and ads ko hatao toh app hand hoo jati hai … olx ko aab ads se hi kamai kr leni chahiye… deleting this app now.
- *OLX in, 1★:* Olx scam / I paid 500 for 30 days listing and my ad got removed. Bunch of olx scammers
- *OLX in, 1★:* Used to be a great app! / Absolutely down to the ground. Hefty ads & bad interface is all is left now. Get a life OLX. FYI I pay for my listings & still have to go through these shenanigans.
- *OLX in, 1★:* Total fraud / They are taking money from us for elite ads but didn’t showed.Fraud Olx.

### Account Moderation (44 primary)

- *Yahoo Flea Market jp, 1★:* AIの誤判定で利用制限がかかりまくる / 何もしていないのに何度も利用制限をかけまくるので取り引きができなりました とても悪質です
- *Bunjang kr, 1★:* 그냥 ㅈㄴ 구림 / 시스템 개쳐구림 사기 치지도 않응 사람 계정 냅다 정지 그렇다고 사기꾼 제대로 처리하지도않음
- *Carousell sg, 1★:* Anyhow suspend account / My carousell account got suspended with NO warning and i have no idea which “rule” i broke. I forgot my password for my account and the AI chat keeps telling me to fill up this form which require
- *Karrot kr, 1★:* 개빡침 / 하… 채팅 막은거 진쯔 개빡친다 짜증나게하지말고 채팅 풀어라

### Company Misconduct (37 primary)

- *Cars24 in, 1★:* Worst service ever / No proper communication, just deducting amounts with out any discussions , worst customer service
- *Cashify in, 1★:* Disgusting Pickup Executive / Dear team this is to bring to your attention that i had ordered sale of 2 mobile phones over cashify on 27.10.2025 and my pickup was schedule for today 29.10.2025 between 10:00 am to 3:00 pm
- *Cars24 in, 1★:* Worst app / Worst app all….they told me to buy pro membership and now they don’t even answer the call..Don’t download the app or take a pro membership…zero star app..worst at all.
- *Cashify in, 1★:* DO NOT USE CASHIFY / First of all, whatever price you see on the app, expect that to be reduced by 40-60% when the executive diagnoses your device. They expect your used device to be in perfect/brand new condition. How c

### Dispute Handling (33 primary)

- *Yahoo Flea Market jp, 1★:* 最悪 / 事務局が最悪。 相手に取引のためのコメントを送っても全く返答がないので、事務局に問い合わせているのに、相手と話し合いしてくださいって自動返信が届く。取り引き中のコメントに、個人情報を載せたり、キャンセル料を申請してきたり、明らかに規約違反をしており、そのことを事務局に問い合わせても、お気持ちはとても分かりますが、当事者間でのやり取りで解決してくださいですって。あまりにも無責任すぎると思いました。絶対におすすめしません！
- *Yahoo Flea Market jp, 1★:* 一方的な評価 / 商品説明をきちんと読まず勘違いしたまま購入、そのままサイズが小さいなどと悪評をつけらる。Yahooフリマは評価の削除もなければ過去の評価は全部残る。いい加減なんとかしてほしい。某フリマアプリは直近100件の評価、不当な評価は削除してくれます。見習ってほしい。
- *Bunjang kr, 1★:* 어이없고 당황스럽습니다 확인하세요 / 제가 에어팟을 구매하고 급하게 사정이 생겨서 당장 취소해야할것같다고 정중히 판매자님께 말씀드렸는데 판매자측에서 요청해달라고 하셔서 바로 취소요청 드렸는데 그 이후로 연락이 없으시고 자꾸 잠수타시고 한 8시간 뒤에 확인하시고는 구매안할거냐고 물어보셔서 진짜 1차로 너무당황스러웠구요. 진짜 급한 상황이라 취소요청드렸는데 8시간 이후에 답장 오셔서는 구매를 안
- *Yahoo Flea Market jp, 2★:* うっかり評価済みにしてしまい、商品もお金も失いました / 色違いの商品が届いたのに、似た色だったため間違いに気づかず、評価を入れてしまいました。その後郵便局から回収依頼が来て、色違いのせい？と思い渡したら、結局代品の発送はなく、評価後なので返金もできないと言われました。このようなトラブルもあり得ますので、皆様もぜひお気をつけください。

### Scam Fraud (21 primary)

- *Gumtree au, 1★:* Fake accounts / There are a lot of con artists in gumtree that waste your time, trying to rip you off, the platform really needs to verify users
- *Carousell my, 1★:* Scammer friendly / Not really recommended to use this apps as platforms to buy/sell here
- *Gumtree au, 2★:* Not Safe! / So many scammers on Gumtree   Definitely use eBay when possible
- *Carousell ph, 1★:* !!! / This apps has so many scammer! I got scammed and they did nothing. They just told me to report to the nearest police station!!!!

### Support (15 primary)

- *Carousell sg, 1★:* Not helpful. / Too many suspicious accounts. Emailing them doesn’t help because you get directed to their online chatbot. Online chat bot directs you to the email. Waste time.
- *OLX in, 1★:* Can not contact olx team / Very bad how to contact team was not very sure but at the point of payment very sure how to do auto pay
- *Carousell hk, 2★:* 投訴唔回覆 / 投訴唔回覆，容許商家售賣假嘢，你哋仲要頒個獎俾佢，另外網絡成日load唔到。
- *Carousell tw, 1★:* 帳號驗證、客服處理問題糟糕 / 更改郵件到底有多困難，智能客服無法解決，真人客服邏輯也是死的，什麼叫做無法驗證要回答問題等48小時，要一直跑程序等你們是有病嗎

### Other (14 primary)

- *Mercari JP jp, 1★:* 微妙 / だいたいがライブ終わってないのにライブグッズ販売してる時点でオカシイ。本当のファンなら会場でグッズを買う訳で、先にライブ行った奴らが転売してるし。 全て悪いとは言わんけど、規制かけたり無駄なアッフデートやってるなら違反者等も取り締まってほしいし中には遺品とかも売ってそうで怖い。 ついでに、こういうクソアプリはゴミクズやから要らんな…と言うのと、アホな転売ヤーが多いからマジでウザいし。 ぼったくりに近い。 リサイクルショップと同
- *Mercari JP jp, 1★:* メルカリじゃなくテンバイ / ちいかわグッズの転売物凄いね。こんなサイトがあるからゴミが増えるし、モノを大事にしない風潮になる。社会悪の一角だってわからないのかな？ 手数料取れれば良いかもしれないけど、もうメルカリはやる事はないわ。
- *Gumtree au, 1★:* Need to be able to rate time waisters / You need to be able to rate people from first contact. To many people waist your time but you can not rate them unless they keep a conversation going for some time. Let sellers rat
- *Spinny in, 1★:* send unauthorised spam whatsapp messages / I have never downloaded the app but recently they started sending me click bait messages on whatsapp. they will say you have challans awaiting to be paid and to check download t

### Discovery (12 primary)

- *Carousell ph, 1★:* Useless sort and filter features. No data control / Sort by price, then you get lists priced at 1 peso. Filter 1 bed room and you'll get studios listed as 1 bed room. Select only rentals and sellers will list houses but 
- *Karrot kr, 1★:* 지역설정 / 지역 설정을 왜 하는건가요...? 타 지역도 뜨고 하던데 의미가 없는거 같네요
- *Gumtree au, 1★:* Terrible / traffic isn’t as it used be I’m only using because already pay and already lost my money but never using it again unless it gets cheaper and more social media influence
- *Yahoo Flea Market jp, 1★:* 大改悪 / かなり安くしてても売れないのに今回の上位表示の改悪でさらに売れにくくなると思います。前と同じように戻してほしいです

### Item Quality (8 primary)

- *Cashify in, 1★:* Writing this review here because in the app there is no option for write a review / Never buy a phone from  Cashify￼.  Most of the phones have boosted battery and within just one month, the battery health drops from 100%
- *Cashify in, 1★:* Worst Phone & Service experience with cashify!! / One of the worst experience with cashify.  After buying a phone in good condition, which was defected. Upper sensor wasn't working, While charging battery percentage was 
- *Carousell tw, 1★:* 賣假貨的都說日本購入、還有假的翡翠一堆。 / 裡面賣一些假的珠寶，騙人說在早期珠寶店或百貨公司。而且還有很多大陸製作的假名牌。賣家會說日本購入⋯也管一管吧！另外不能播放影片。真的很差勁的賣場。服務人員也很難聯繫！
- *Cars24 in, 1★:* Low quality cars, no support, fraud. Accidental cars passed off as good - they hide it / I and a few of my acquaintances have purchased cars from them - their cars are of questionable quality (they say accident free car,

### Payment (7 primary)

- *Carousell my, 1★:* Money transfer / Super slow transferring money from balance to bank. Since sunday until wednesday no update
- *Mercari JP jp, 1★:* 売上金の出金ができない / 金に汚い運営。  売上金を失効させる仕組みが緻密に確立されている。  売上金が180日で失効するのに出金ができない。本人確認が出来ないため。本人確認はもう一つアカウントがあると言われ、それを削除するためにログインしようとするとできない。連携しているFacebookのアカウントにはログインできるのに、エラーが発生する。本人確認が出来ないと出勤もできないため、売上金はメルカリの懐に消えていった。  ポケモンカード
- *Mercari JP jp, 2★:* クーポンが適用されない / 手順通りに購入したのにクーポンが適用されず、問い合わせしようと思ってもどこから問い合わせたらいいかわからない。 ヘルプを見て問い合わせはこちらを探したが見つからない。
- *Karrot kr, 1★:* 당근걷기 포인트 / 당근 걷기 포인트 쌓아서 계좌로 바로 넣을수 있었는데 바뀐거 맞나요??? 어느순간부터 캐시워크처럼 변해가지고 그 포인트를 모바일쿠폰으로 바뀌게 해놨던데 ㅡㅡ ㅋㅋㅋㅋㅋ   그렇게 할꺼면 배민 쿠팡이츠 쿠폰도 넣어주세요 ㅡㅡ ㅋㅋㅋㅋㅋ

### Listing Effort (6 primary)

- *Bunjang kr, 2★:* 오류 / 사진 업로드 안되고 상품수정시 상품정보 다 사라져서 다시 입력해야됨
- *OLX in, 1★:* Product was not uploaded / Unable to upload my product in olx. And not showing i pad name in this olx system
- *Carousell sg, 1★:* Weekly Updates Unnecessary / I started selling my items on Carousell about a month ago, and overtime, I had a certain specific way of naming my items & such. Now Carousell's new update merged the title of one's product a
- *Mudah my, 1★:* Upload pics issue / This issue has been awhile… why aren’t we able to upload pics from albums???… so difficult when we selling items that requires old pics… everytime we have to go to the web to post an ad and only use t

### Pricing (6 primary)

- *Spinny in, 1★:* Spinny / Spinny se gadi lena matlb 1 lakh milake new gadi lena bhaii lutne vala ghar hai spinny
- *Yahoo Flea Market jp, 1★:* 悪質な購入者が多い / 極端な値下げ要求、値下げ後に購入しない、到着しても評価をしてくれない、一方的な不当な評価。これはYahooフリマをやってる出品者が必ず直面するものです。これだけレビューに書かれてるのにも関わらず一向に改善しないのはなぜ。あと、レビューの評価を高評価に見せようとする策略も痛い。
- *Cashify in, 1★:* Worst app for selling / Worst app for selling when you want to sell its give you worst price of your product and when you want to buy same product like your its double of the price they are giving you for your product us
- *Yahoo Flea Market jp, 1★:* 某フリマサイトから乗り換えだけど… / メルカリで状態はいいのに値下げ交渉は不可にも関わらず、値下げ交渉ラッシュで辟易した為、Yahooフリマの方がしっかりしてるとの評判を聞くので最近になってYahooフリマを利用したら、相場より安くて最安価の値段にしてるのに価格の相談の通知が連続で届いた。すごいストレス。 1000円以下の値段なのに買えない事はないと思う値段。相手も5000円代のなかなかな値段の出品をしてるのに、悪い意味でしっかりして

### Logistics (3 primary)

- *Carousell sg, 1★:* Delivery guys never do their job. / The SPX guys got 2 unsuccessful pick up attempts. I’m not able to pick up their call but they didn’t sms me on that 2 events. They don’t know how to use sms?
- *Karrot kr, 1★:* 대처 미흡 너무 화납니다 / 바로구매 옵션에서 문 앞에 둘게요 를 선택하였는데 택배기사가 임의로 연락와서 1층에 둬달라고 한 뒤에 1층만 확인하고 그냥 가서 이틀 연속으로 똑같은 방법으로 거래가 늦춰졌습니다 문의하려고 당근 바로구매 전담 번호로 연락하였지만 계속 상담자 전부 통화중이라며 연락도 한 번 안 닿았습니다 또한 택배 건이 2개가 있었는데 한 택배 기사가 택배 2개 다 가져가버려놓고 
- *Yahoo Flea Market jp, 2★:* 発送方法の変更ができない / 落札されたので梱包したら、ヤマト便では入りきらなかった時、ゆうパケットプラスに変更したいのに、発送方法が変更できないのがとても不便です。 仕方なく落札者さんにお願いしてキャンセル、再出品の流れが過去数回あります。  メルカリみたいに、落札後も発送方法の変更ができる仕様にして欲しいです。

### Meetup Safety (2 primary)

- *Carousell sg, 1★:* From good app to Bad app / Bad app Users Always confirm deal And on meet up date go missing  Hope app team aware of this  And fake spam in apps also A lot scam in app
- *Carousell my, 1★:* I got first warning because seller didn’t turn up!! Seller got 3star and bad reviews still. Useless! / How come carousell can backup bad seller. For 2 days going to customer place but didn’t turn up and never reply my ms

## 5. Step 4: dispute anatomy (199 dispute-related reviews)

Reviews rated ≤3 stars, over 120 characters, containing dispute, refund, evidence or cancellation words in 7 languages; up to 22 per C2C app-market (`dispute_sample.jsonl`). Each was coded by hand for side, trigger, evidence, platform action and what the user wanted (`dispute_labels.jsonl`). 119 described a real buyer–seller problem. **Bias:** selected by dispute keywords, so it describes disputes; it can't show how common they are.

| App | Side | Trigger | Platform action | Evidence | User wanted | Excerpt |
| --- | --- | --- | --- | --- | --- | --- |
| Carousell sg | buyer | not received | no response | none mentioned | refund, platform to intervene | Refund Request / I was scammed in carousell with buy protection. Seller has many 5 start reviews who knows she is a scammer. Shopash.com scammed me. Never recei |
| Carousell sg | seller | seller cancel | penalised account | none mentioned | explanation, fair decision, platform to intervene | Customer Support does NOT support / Have been a user well over a decade.   Have over 150 all 5 stars review.  Had asked buyers of my items to use the Buy button |
| Carousell sg | seller | buyer cancel or no confirm | no response | none mentioned | fair decision, platform to intervene | horrible seller protection / recently faced a super rude and hypocritical potential buyer, in which he backdealed and i wanted to report him. The team behind ca |
| Carousell sg | seller | buyer cancel or no confirm | unclear | none mentioned | refund, fair decision | Scam platform fee / While the platform is great to sell your pre-loved item, take caution never to enter your credit card details.  The platform charged me a pl |
| Carousell sg | seller | other | froze funds | none mentioned | release funds, faster decision | Poor System Detection of Duplicate Listings and Problems Withdrawing Wallet Amounts / The automated system used to detect duplicate listings is heavily flawed,  |
| Carousell sg | buyer | not as described | told users to settle themselves | none mentioned | refund, platform to intervene | Terrible follow up / I bought something through Carousell and seller sent me the wrong thing. I tried to get a refund, seller gave all types of excuses and when |
| Carousell sg | seller | other | sided with buyer, penalised account | none mentioned | fair decision, explanation | Unhelpful Carousell Support / Carousell is terrible at handling disputes and cases. For example, if a buyer reports a seller for something the seller didn’t do, |
| Carousell sg | unclear | counterfeit claim | canned reply | none mentioned | human review, look at evidence | Abetting Scams / I reported a counterfeit product but the report was processed by AI and rejected. I’m told I can appeal with evidence but the link given only w |
| Carousell sg | buyer | not received | sided with seller, told users to settle themselves | none mentioned | refund, fair decision, platform to intervene | Scammers and more scammers / Terrible service. Carousel has a fantastic team of crazy customer service who is of no service to those who are scammed at all. I r |
| Carousell sg | buyer | other | no response | none mentioned | platform to intervene, fair decision | Many illegal stuffs sold on Carousell / 12 years on Carousell and today is the day I delete this app and will no longer use this for buy/sell.  Carousell starte |
| Carousell sg | seller | other | unclear | none mentioned | platform to intervene | Bad experience on the enable delivery / This is my first time using the pick-up service. I selected a pick-up date, but no one came to collect the item, and the |
| Carousell sg | buyer | seller cancel | auto closed or auto confirmed, no response | none mentioned | refund, human review | Carousell buy is a scam / Their customer service is nonexistent. I bought a shirt using carousell pay and the transaction was automatically voided because selle |
| Carousell my | seller | buyer cancel or no confirm | froze funds | none mentioned | release funds, platform to intervene | We as seller also need protection / don’t you ever think to give seller a protection not just buyer protection only? just now the buyer doesn’t confirmed that h |
| Carousell my | unclear | scam off platform | unclear | none mentioned | platform to intervene | Dangerous 隐藏诈骗风险 / A lot of scammer in this app, they will EMAIL you with FAKE email address and website . Please check carefully  Please improve your app secur |
| Carousell my | unclear | scam off platform | unclear | none mentioned | platform to intervene | A LOT OF SCAMMERS / Be careful with this app, as there are many scammers. They will provide their number in ur chat and ask you to WhatsApp them, then send an e |
| Carousell my | buyer | not as described | no response | none mentioned | refund, faster decision, platform to intervene | Carousell Support Neglect: Unresolved Fraudulent Transaction / I am writing to express my extreme disappointment and frustration with Carousell's customer suppo |
| Carousell my | buyer | counterfeit claim | canned reply, sided with seller | none mentioned | platform to intervene, fair decision | Greedy move ruins Carousell / Where do I even start? Every year, buying and selling through Carousell just doesn’t make sense anymore, especially the latter one |
| Carousell my | buyer | not received | no response | none mentioned | refund, faster decision | Bad service / Pay thru carousell. Pstu barang hilang. Cstmer dpt refund. Habistu barang aku ni tak dapat dapat refund lagi. Live chat pun tak reply reply. Nak c |
| Carousell my | buyer | refund request other | no response | none mentioned | refund, faster decision | Scammer company / Be careful to deal using the so called safe buy using fpx payment to this company. My issue was once mu order cancelled the money was not refu |
| Carousell my | seller | refund request other | sided with buyer, refunded | none mentioned | fair decision, look at evidence | Unfair judgement / To seller, do not sell via Carousll Pay. Better COD. I had worst experience when buyer want return and Carousell team proceed with refund to  |
| Carousell my | buyer | refund request other | unclear | none mentioned | refund | Non- refundable / I been made transaction on this website, but after cancel and request for the refund. It unable to refund. I suspect this is scam app. |
| Carousell my | seller | scam off platform | unclear | chat | platform to intervene, refund, fair decision | Scam Application / I was scammed through the Carousell app. After listing an item for sale, I was contacted by a buyer with the username @nabila94766, who claim |
| Carousell ph | seller | counterfeit claim | canned reply | receipt or proof of purchase | look at evidence, human review, fair decision | YOUR REVIEW TEAM ISN’T KNOWLEDGEABLE ENOUGH! / Every time I post an item especially NIKE SHOES, they always remove my post and said that it was a counterfeit, a |
| Carousell ph | unclear | other | unclear | photos | human review, platform to intervene | Flagged for dealing outside of Carousell / I was just sending proof ng booking ng courier pero images were blocked. Please hire real time image moderators. The  |
| Carousell ph | buyer | not as described | unclear | none mentioned | refund, platform to intervene | Lacks of security. / I enjoyed using this app since its my only way of income as a student. But there are lots of downsides regarding the marketing. Theres what |
| Carousell ph | unclear | other | no response | none mentioned | platform to intervene, look at evidence, faster decision | Cant send or receive videos + SCAMMERS / both as a seller and a buyer it's really hard for me to assess the items im buying because i cant receive videos as wel |
| Carousell ph | buyer | other | no response | none mentioned | platform to intervene, fair decision | INFESTED WITH SCAMMERS / ive been scammed twice already despite checking if the seller has a lot of good reviews and if theyve been a seller for a long time alr |
| Carousell ph | seller | refund request other | penalised account, sided with buyer | none mentioned | fair decision, platform to intervene | No Protection For Sellers / I strongly do not recommend downloading this app. A buyer tried to scam me. I sent the item with a heavy discount and Carousell susp |
| Carousell ph | buyer | refund request other | no response, canned reply | photos | refund, look at evidence, human review | No refund from stupid seller / No help, ignored your request to refund while in Lazada and Shopee so fast refund transaction… here wala pakialam even you seek h |
| Carousell ph | seller | not as described | penalised account, sided with buyer | none mentioned | human review, fair decision, explanation | UNFAIR JUDGEMENT / HAD A BAD EXPERIENCE WITH THIS APP, I HAD BEEN SELLING VERY WELL AND HAD 5/5 RATINGS. I HAD ONE CLIENT CLAIM THAT OUR ITEM IS DAMAGED HOWEVER |
| Carousell ph | seller | other | no response | chat | fair decision, look at evidence, platform to intervene | Lame Customer Support / They want a respective and safe environment for their platform, but they can’t do something about a User who violates their rules and re |
| Carousell ph | buyer | not received | no response | none mentioned | refund, platform to intervene, fair decision | Will not help with refunds / I approached four different customer service agents and none of them could help me with refunding an item that never came. Thousand |
| Carousell hk | buyer | counterfeit claim | no response | none mentioned | refund, platform to intervene, fair decision | 越嚟越多賣家已讀不回，無心放售，越嚟越唔好用，亦冇心監管 / 連續三次，賣家已讀不回，有啲明明應承咗話賣比我，之後就潛咗水，有啲明明話可以旺角交收，問佢可唔可以旺角交收之後，再表明要買，又係已讀不回，一係就勁多假貨，但Carousell都唔會理，就算已經舉報過，個Account仲要聲稱自己好多好評，睇嚟好好生意，開咗幾 |
| Carousell hk | buyer | other | no response | photos | human review, look at evidence, faster decision, platform to intervene | Zero Moderation & Ignored Reports 買家態度惡劣，客服不處理問題 / Zero platform moderation! I reported a seller for unprovoked verbal harassment and blatantly self-generating  |
| Carousell hk | seller | other | froze funds | none mentioned | release funds, explanation, fair decision | Makes your money frozen if you use buy button / The app forces you to submit tax information or else it will freeze your money when you sell your items. Claimin |
| Carousell hk | seller | other | penalised account, no response | none mentioned | fair decision, human review, faster decision | 不復初衷 規條多且隨心所欲 / 作為賣家得不到尊重，平台會隨意決定用家上架的產品是否違規。按客服要求上架產品仍會因惡意檢舉被認定違規而下架，賣家帳號會因此受懲罰而被限制。即使證明沒違規也沒有用，賣家只能重新上架產品，「新產品」仍有機會再被下架，增添新的違規記錄。平台沒有投訴途徑，只能經客服反映意見，客服質素差參，遇到每 |
| Carousell hk | seller | buyer cancel or no confirm | unclear | none mentioned | unclear | 評分高也有怪人。不可信！ / 本人試過買一件貨品，已經議價是標價的接近七折以下，那人是那人為五星的高級評分者，在內容對話方面不停向賣方即是我作出附加條件Offer。基於尊重承諾所以為她hold 貨結果完全冇誠意買拖完一次又一次不是改日期是改時間時間仲要改時段並且拒絕確實交收時間，而並沒有任何原因陳述。亦遲遲不肯出「出價 |
| Carousell hk | unclear | scam off platform | no response | none mentioned | look at evidence, refund, platform to intervene | Fraud group / After being scammed, all the evidence provided was ignored. When I tried to use their payment function, they required an enormous amount of person |
| Carousell hk | buyer | not received | no response | none mentioned | refund, platform to intervene | Terrible service,bad seller / l bought three things at here that is about games,the seller didn’t even do what l have bought and absolutely destroy my account,s |
| Carousell hk | unclear | other | canned reply, no response | none mentioned | platform to intervene, fair decision, look at evidence | 平台不處理客戶投訴，助長騙按橫行及收買佬任意滋擾！ / 平台對二手價格豪無認知，助長騙按及收買佬任意滋擾用戶！向客戶服務report投訴，敷衍說證據不足，就不了了之！對市場二手價格豪無認知，不能分辨用戶 ，助長騙子任意橫生，以及收買佬任意滋擾用戶。Carousel只顧收廣告費，卻無視客戶的意見反映，致客戶於無助情況境地 |
| Carousell hk | buyer | seller cancel | unclear | none mentioned | fair decision, platform to intervene | Don’t trust the review of the app or seller / Bought an item, seller cancelled it, seller left up on sale. Had a few others that cancelled out on me but raise t |
| Carousell hk | unclear | other | unclear | photos | platform to intervene, faster decision | Why you blocked my photos? / I was encountered on the chat while trading i had sending general photos to confirm my meeting spot for trade but often been blocke |
| Carousell hk | buyer | not as described | told users to settle themselves, sided with seller | none mentioned | refund, human review, fair decision, platform to intervene | Deeply Disappointed with Carousell’s team Handling of Seller’s misconduct / I had a highly frustrating experience with a so-called “Professional Seller” on Caro |
| Carousell tw | seller | other | no response, canned reply | none mentioned | fair decision, faster decision, platform to intervene | 服務差勁客服回覆極慢 / 1.各種理由被下架商品說違規卻看到其他賣家也都在賣違規商品卻沒下架。 2.贈送商品也會有問題被說違反規定就會限制你帳號。3.客服效率非常差也不積極，等了一週才回覆。 4.假貨商品和詐騙帳號層出不窮，也會有惡意出價的。 絕對不推薦使用這問題很多的平台，寧可被蝦皮賺也不要用旋轉！ |
| Carousell tw | seller | other | froze funds, penalised account | none mentioned | fair decision, explanation | 非常不行 / 非常的爛 剛加入沒有要求什麼銀行認證通通沒有 刊登商品也沒有顯示資料不齊全 等到買家來下單才把買賣家一起凍結 要求賣家半小時內完全驗證不然要求賠償三倍！  別人都不用做事！ 莫名其妙的一個app!  駭客入侵是你們工程師沒有做到完善 搞得好像每個都詐騙集團！ |
| Carousell tw | seller | buyer cancel or no confirm | unclear | none mentioned | platform to intervene | 這平台是專門開給惡意不取貨慣犯的庇護所嗎？ / 優點：手續費低 缺點：買家評價爛成怎樣、不取貨紀錄多精彩，大家眼睛都看得一清二楚，就你們平台的系統瞎了？身為賣家想取消訂單自我防衛，系統竟然死活不給取消，逼著人家把商品送給慣犯浪費運費浪費耗材浪費時間。大概有近十筆未取貨被系統判定的買家一樣可以這樣下單⋯⋯ |
| Carousell tw | unclear | not as described | told users to settle themselves | none mentioned | platform to intervene, fair decision | 發生爭議交易平台政策與作為令人傻眼 / 本人於旋轉拍賣平台進行超過10筆買賣，不幸遇到買賣雙方不樂見的商品瑕疵。  然而官方政策與客服並無有力且有效的手段，則以「建議買賣家雙方私下自行協調 透過賣貨便、旋轉平台將商品買回」；平台在每筆交易有收取手續費，雖抽成幅度極小，仍理應善盡交易平台責任與義務。  此次事件能解決 完 |
| Carousell tw | seller | counterfeit claim | froze funds, sided with buyer | receipt or proof of purchase | release funds, look at evidence, human review, fair decision, faster decision | 買家最大，賣家沒人權？ / 事情經過我這邊必須完整說明清楚。  這位買家指控我販售假貨，但我已經提出證明，證實該香水為 1976 購入的來源。在有明確證明的情況下，買家卻回覆我：「沒差，反正我不想信，妳也別想解凍資金。」 對方甚至直接表態，如果我不配合，她就不會同意官方處理，導致帳號與款項持續被凍結。在這樣被威脅的情況 |
| Carousell tw | seller | scam off platform | unclear | none mentioned | platform to intervene | 詐騙詐騙詐騙 / ㄧ刊登商品馬上有詐騙要裝成成買家聲稱說無法下單  再提供假的客服給你接洽認證更新個人資訊 假客服再用話術說買家帳戶被凍結無法認證成功要賣家賠買家三倍錢 都是詐騙不要聽信 接著再給你假銀行人員接洽說你帳戶有問題 接著開始一連串的表演需要按照他只是操作轉帳匯款 慘痛經驗這麼軟體趕緊卸載太可怕了 |
| Carousell tw | seller | missing parts | froze funds, sided with buyer | none mentioned | fair decision, release funds | 賺賣家錢卻單方面挺惡客 / 小心台灣惡質客人，東西拿到手，要求二手品要跟專櫃一樣，沒錢在專櫃買，殺價客家精神。 東西拿到了再說東西有什麼配件缺少，對於vintage原商品是否有配件搞不清楚，狂要求賣家要怎麼樣，旋轉客服直接凍結賣家金錢。 今天這個平台賺的是賣家的費用，惡質客人拿了你的東西，不退你還要求退錢，客服沒有任何 |
| Carousell tw | seller | counterfeit claim | auto closed or auto confirmed | none mentioned | fair decision, human review, explanation | 非常差 / 還刪評價？一星都不想給，商品上架就會被隱藏刪除疑似仿冒品，比外面人家鑒定還厲害，憑照片賣場就認定仿冒品，而且是上架一件隱藏一件，真的是爛到爆！以前還比較好賣，現在流量很差，不知道是不是隱藏刪除關係，你的商品會沒人看到賣不動，越來越難賣賣不出去 |
| Carousell tw | seller | refund request other | froze funds, no response, canned reply | none mentioned | release funds, fair decision, human review | 對賣家保障很差的app / 相比於淘寶客服來說旋轉拍賣簡直爛到一個不行，我本身是賣家，與客人有消費上有糾紛，旋轉直接凍結我的錢包不讓我提款，時隔一年後我再與客服溝通，還是用一年前的官腔話術跟我擺爛！後面我再回覆直接不演了已讀不回！這種敷衍至極的態度對賣家的權益毫無保障，體驗感極差！實名diss旋轉的台灣真人客服，你們是 |
| Carousell tw | seller | other | froze funds, canned reply | none mentioned | release funds, faster decision | 體驗極差 / 平台算是方便 也有一定的保障 但問題審核存在極大的問題 對於賣家極度不友善 有時候正常的商品會被平台無故下架 並且是無理由的 想從新上架還需要額外申訴 需要花時間卻又不一定能成功 還有交易成功之後 錢入帳極慢 一開始買家跟我都完成訂單了 錢從超商入帳到平台錢包需要至少三天 從錢包提轉到我本人帳戶也是至少四 |
| Carousell tw | seller | scam off platform | unclear | none mentioned | unclear | 一上傳商品就遇到詐騙集團 / 說實在完全不推薦的平台，安全性太差了，上面是滿滿的詐騙集團嗎？才剛上傳商品上去就遇到詐騙⋯對方是一整套的，先假裝買家說沒辦法購買說要加賴傳照片，然後再說我有什麼認證沒過，再讓我加官方的賴（假的），之後再假裝行員打過來⋯還好口音大陸腔太重了⋯才慢慢升起警覺⋯後來直接封鎖 改密碼 刪app 嚇 |
| Karrot kr | seller | buyer cancel or no confirm | unclear | video | faster decision, fair decision, platform to intervene | 걍 번개장터만 쓸게요 / 바로구매 이거 뭐 물건을 팔기가 싫어집니다.  적어도 뭐 구매자랑 정상적으로 대화를 할 수 있게 해주던가 배송 완료되었다, 48시간 후에 자동 구매 확정된다 기다려라 이러기만 하고 다른 플렛폼인 번개장터는 구매 확정 요청이라도 있지…여기서 자동 구매확정 보류는  |
| Karrot kr | seller | buyer cancel or no confirm | froze funds, no response | none mentioned | release funds, faster decision, platform to intervene | 진짜 장난하냐? 야 고객센터 문의좀읽어 / 미친거아니야 ㅋㅋ 지금 안심결제했는데 구매자가 잠수타버려서 그대로 제 돈이 묶여있다고요;; 취소요청도 안누르고 읽씹해서 이러면 평생 제 돈을 못돌려받나요? 자동으로 언제까지 택배 안보내면 취소가 되게끔 해줘야죠 고객센터에 문의해도 쳐 읽으실 생 |
| Karrot kr | seller | refund request other | froze funds, no response | none mentioned | release funds, faster decision, fair decision | 바로구매 판매자 피해 / 바로구매로 물건을 판매하여 잘 포장해 보냈으나, 구매자가 물건을 받고도 정당한 이유 없이 환불 요구 멫 정산 보류 신청을 해서, 당근으로부터 계속 물품값을 못받고 있습니다. 고객 센터도 5일째 답변이 없고요. 네이버 검색하니 정산보류를 악의적으로 이용하는 구매자 |
| Karrot kr | buyer | not as described | unclear | none mentioned | platform to intervene, explanation, fair decision | 바로구매 사용해보셧나요?의문입니다.상당히불편함. / 바로구매로 질문을할수없고,답답햇음.결국 속이고 판매하신판매자분.당당함.어이없다.구매자입장에선시간낭비,답답하게 구매신청햇지만,사용한물건임에도 새상품이라고 글 적혀잇고.사진교묘하게가리고 찍어올리고,택배비도 비싸게측정해서바가지엿고,왜이런걸만 |
| Karrot kr | buyer | counterfeit claim | sided with seller, canned reply, auto closed or auto confirmed | photos, chat | look at evidence, human review, explanation, fair decision | 가품도 우기면 정품되는 신기한 서비스 / 가품 사기당한 구매자에게만 입증 자료를 요구하고, 검토 결과나 근거없이 통보식 분쟁 처리가 최악이네요. 구매자 보호 수수료와 분쟁조정 절차가 왜 존재하는지 의문입니다. 왜 받나요? 결국 보호가 필요한 구매자가 시간과 비용을 들여 직접 증명해야 하 |
| Karrot kr | seller | refund request other | told users to settle themselves, froze funds, no response | none mentioned | release funds, human review, fair decision | 고객센터 전화도 없는 기업 / 바로구매로 물건 팔았는데 진상 만나서 이상한 걸로 트집잡히고 분쟁신청 당했는데요. 당근측에 사실 확인서도 제출했는데 당근측은 그냥 너네끼리 잘 조율해서 합의봐라 말만하고 고객센터 전화도 ai가 계속 앱으로 문의하라는 음성만 나옵니다. 기업 규모 치고는 고객 |
| Karrot kr | buyer | not as described | auto closed or auto confirmed, sided with seller | chat | refund, fair decision, platform to intervene | 신뢰성, 대처 부족 / 판매자 측에서 안전상의 결함이 있는 물건을 판매하였고 판매자도 그 부분을 인정하였으나 그저 환불을 꺼려 분쟁위원회 신청을 하였습니다. 판매자 측에서는 어떠한 반박자료도 제출하지 않았지만 당근측에서 귀찮다고 구매확정 처리해버려서 중간에서 수수료까지 떼갔지만 신뢰할  |
| Bunjang kr | buyer | counterfeit claim | told users to settle themselves, canned reply | none mentioned | refund, look at evidence, fair decision | 소비자한테 가품확인서 제출하라는 이상한 앱 / 정품으로 구매했는데 택이 다른 가품을 받아서 가품의심된다니까 바로 가품확인서 제출하래;; 가챠나 작은 물건들은 어떻게 제조가 가서 너네쪽에서 구매했는데 이거 짭이지? 짭확인 증명서 보내줘~ 라고 해서 피해자인 소비자가 자료찾고 증명서 확인서 |
| Bunjang kr | seller | other | penalised account, canned reply, no response | photos | fair decision, human review, explanation | 화나네욤ㅠㅠ / 저도 번개장터 오래동안 이용했고 별점도 5.0이였고 후기도 50개 넘게 보유했던 사람입니다. 안전결제가 도입된 후 구매자 판매자 모두 뜻하지 않은 피해를 많이 봤다고 생각해요 되게 사소한 거로 정지도 많이먹고 저 또한 제 의지가 아닌 다른 이유로도 계속 차단 걸려서 결국 |
| Bunjang kr | seller | other | froze funds, penalised account, no response, canned reply | chat | explanation, fair decision, release funds, human review | 번개장터 / 직거래를 할때도 안전거래를 하라고 안내해서 안전거래를 하고 구매확정을 하니 부정거래 의심된다고 정산 보류하고 계정을 영구정지 시키네요 고객센터에 연락하니 답변은 아주 느리고 구매자와 연락한 내용들을 증거로 보내도 계속 똑같이 구매자가 물건을 가지고 있는 사진을 받아 오라고  |
| Bunjang kr | seller | buyer cancel or no confirm | no response, penalised account | none mentioned | fair decision, explanation, platform to intervene | 정말 갑질 영업에 시스템 관리 최악, 독단적인 폭군이 따로 없고 행패란 행패는 다 부림 / 실제로 구매자가 잠수타거나 반값 택배 수령 안하고 그대로 반송되어 택배비 위약금 물고 난리칠 때는 저희는 아무것도 할 수 있는 게 없어요~ 뭐 이런 답변 조차 없이 그냥 묵살. 읽씹.   그래놓고 |
| Bunjang kr | seller | refund request other | sided with buyer | none mentioned | fair decision, faster decision | 1점도 아까운 수수료 장사치 앱 / 안전결제 강제하고 업계에서 가장 높은 수수료를 판매자한테 떼어감 근데 막상 분쟁 생겨도 구매자한테 유리한 판결을 냄ㅋ 구매자한테만 유리한 안전결제인지 처음 알았네여^^ㅎ 수수료도 많이 받아먹으면서 책임감있게 공정한 중재를 해야지 무슨 전부 판매자탓이라 |
| Bunjang kr | buyer | seller cancel | no response | none mentioned | faster decision, refund, platform to intervene, fair decision | 안전거래좋긴해요 근데 / 안전결제가 좋은건 알겠는데 판매자가 물건을 보내지 않고 잠수타면 고객센터에 문의해도 결국 판매자에게 문자만 보내는 수준 아닌가요?? 이럴 거면 도대체 왜 안전결제를 만든건지 이해가 안됩니다ㅠㅠ 반대로 안전결제가 아닌 다른 방식으로 결제하려고 하면 강제로 30일  |
| Bunjang kr | seller | other | penalised account | none mentioned | fair decision, explanation, human review | 1점도 아까워요 / 몇개월째 성실히 50번 이상 5.0점 거래하던 판매자입니다. 어느날 갑자기 해킹당한 제 상점 보호해주지는 못할망정 임시보호 요청했더니 사기꾼이라고 영구정지시켜버리고, 새로만든 상점은 구매자분들께 천원짜리 물건 배송비 몇천원씩 받는게 죄송해서 우편으로 무료배송해드리려고 |
| Bunjang kr | seller | other | penalised account, canned reply, no response | none mentioned | explanation, human review, fair decision | 절대 쓰지 마세요.. 쓰는걸 후회 안하실수가 없어요 / 아니 신고를 아무 증거도 없이 접수해서 페널티까지 추고 상품 삭제를 시켜놓고 도용이 아니라는걸 아무리 증명해도 아무것도 못해주겠고, 제 잘못이라네요 ;; 언제부터 번개장터라는 일개 어플리케이션이 대한민국 법률의 기본 판단원칙인 무죄 |
| Bunjang kr | seller | other | penalised account, canned reply | none mentioned | explanation, fair decision, human review | 1점도아깝다ㅋㅋ / 본인들이 해주는 게 뭔데 별 같잖은 이유들로 30일 정지나 먹이는지ㅋㅋ 안전결제 사용을 촉진할 만한 괜찮은 시스템을 도입할 생각을 해야지 냅다 강압적으로 여기저기 정지 먹이고 다니는 게 전략이라고 할 수 있을까요 ㅋㅋ 수수료를 미친 듯이 떼 가는데 누가 쓰고 싶어 하 |
| Mercari JP jp | seller | buyer cancel or no confirm | auto closed or auto confirmed | none mentioned | fair decision, platform to intervene | 仕組みそもそもの改善を強く望みます / 受け取りを通知をせず、連絡しても無視を貫き事務局での取引終了に持ち込むことで、自分に悪い評価が入らないようにするような悪知恵の働く人間が多くいます。 事務局で取引終了にした場合評価が入らないという仕組みがそもそも誤っており、その場合は良くないの評価に強制的にしなければ、何の落ち度 |
| Mercari JP jp | buyer | not as described | no response, canned reply | none mentioned | refund, faster decision, fair decision | 儲けあるなら… / システムは使いやすくて売れやすくて助かっていますが売り上げの10%もらうとちょっと多くないですか？キャンペーンでもいいので8%とかにしてほしい。あと、最近配送トラブルになった場合適当な雰囲気出してきた。返金手続きは分かりづらくして誤魔化してきた。  配送後に壊れていたのに知らん顔してくる癖が最近にな |
| Mercari JP jp | buyer | other | told users to settle themselves, no response | none mentioned | human review, fair decision, explanation, platform to intervene | ユーザーの信用に関わる評価なのに異議申し立てできない / 取引評価はユーザーの信頼に直結する重要な機能なのに、明らかに納得できない評価を受けた場合でも、実質的な異議申し立てや確認の導線がほとんどありません。 今回、購入後から継続して連絡を取り、商品到着後も2日以内に確認・受取評価を行い、出品者には「良かった」と評価しま |
| Mercari JP jp | buyer | other | penalised account, canned reply | none mentioned | fair decision, explanation | 運営対応が急悪化している / ここ数年、運営の対応内容が急悪化しており、過去の安心感はもはやありません。トラブルが出品者の落ち度でも購入者にペナルティが付き、メルカードの還元率まで下げられ、返信は定型文のみ。一方、他のフリマはクーポンや補償が充実してきており、最近はそちらを使うことが多くなりました。 |
| Mercari JP jp | seller | other | sided with buyer | none mentioned | fair decision, explanation | 誤送にはお気をつけください。💢 / 腹が立ったので吐き出させて下さい。  ２つの商品を誤って逆のお客様に郵送してしまいました。 片方のお客様から連絡いただき、実費で再送しようとしましたが、もう片方のお客様と連絡が取れませんでした。仕方なく連絡の取れるお客様には商品をそのままお渡しして返金しました。（返品対応もお手数をお |
| Mercari JP jp | seller | buyer cancel or no confirm | penalised account, no response | none mentioned | explanation, fair decision | 変な購入者のせいで / 利用制限かけられた。よくわからない。 間違えて、購入してしまった！って ならない様に確認の質問に答えて くれなくて、違う事聞いてこられて 不安やったからキャンセルしましょうってなっただけやのに。 問い合わせても返事ないし。 不信感だけが残ります。 |
| Mercari JP jp | seller | other | penalised account | none mentioned | fair decision, platform to intervene | インストールしない方がいい / 2017年から出品しているがお菓子の原材料などを写した写真を載せているが嫌がらせなのか24時間の取り引き制限をされる。削除した人は老眼か？メルカリ最悪などで検索されて下さい。他の人がレビューに書いてある通りです。最近はPayPayフリマにみなさん移行していますね。 |
| Mercari JP jp | buyer | seller cancel | unclear | none mentioned | fair decision, platform to intervene | 購入後の未発送キャンセル / 何度か購入しても無視される事がありました。なぜ、購入者が悪意の出品者に対してコメントで呼びかけて、キャンセル申請の手間をかけなくてはいけないのか。悪意の出品者は呼びかけても無視で、キャンセルだけは即応じる。購入者としては、その待ってる時間に他の商品を購入する事ができるはずなのに、悪意の出品 |
| Mercari JP jp | seller | buyer cancel or no confirm | unclear | none mentioned | platform to intervene | 購入方法の制限設けて下さい / 購入者がコンビニ払いを指定した場合手続きを長引かせた挙句後から支払わずにキャンセルにするという迷惑行為が頻発しています。 手続きをキャンセルすればいいだけの問題ではありません。 その間商品が売れず大変迷惑しています。 出品時点での購入方法の制限機能を設けていただけないと解決しない話です。 |
| Mercari JP jp | buyer | other | told users to settle themselves, no response | none mentioned | platform to intervene, human review, explanation | ⚠️個人情報を盗む奴がいる⚠️ / 昨年から配送方法の仕様が変更されたようで､普通郵便や未定と設定して出品した物が､購入された後でもメルカリ便(匿名配送)に変えて､出品者は送る事が可能になった⚠️しかし､非匿名で出品されている商品を購入した場合､その時点で購入側の個人情報は全て出品者に筒抜け⚠️出品者は匿名になっても､ |
| Mercari JP jp | seller | other | auto closed or auto confirmed | none mentioned | explanation, fair decision | 最悪のアプリ / 安心鑑定というハイブランド物の取引がの際に事務局に発送された後に鑑定されるシステムがあるのですが、私が正規店で購入し、大切に使い続けていたものを、不適切なカスタムがされてる為、鑑定基準を満たせなかった。とのことで強制的に取引キャンセル。 正直かなり気分が悪いです。 意味がわかりません。 |
| Mercari JP jp | buyer | counterfeit claim | no response, unclear | none mentioned | platform to intervene, fair decision | 偽物多過ぎ / 偽物が多くはびこり、偽物を取締まる能力がないのにこちらが悪いと決め付けるようなとても不快な思いをした。 そもそも偽物を出品させる方が悪くないですか？ 数が多いから取締りきれないというのはそちらの事情で、利用者側が不利益被りまくってるのに対しては何の対応もしないの馬鹿げてると思いますがいかがですか？ 非常 |
| Mercari JP jp | seller | buyer cancel or no confirm | auto closed or auto confirmed | none mentioned | fair decision, platform to intervene | 不用品が巡る🎵 / 人が不要なものが私には必要だったりその逆だったりと物が巡って不用品がなくなるのはとても良いことだと思います。一期一会の出会いも楽しいです。 ただ、受け取りをしない方のお取引が事務局での終了となり評価が出来ないことが残念…そういった方が悪いの評価なくいるのはどうかと思います。 |
| Yahoo Flea Market jp | buyer | seller cancel | unclear | none mentioned | fair decision, platform to intervene | そりゃ負けるわ / メルカリと違って取引キャンセルが購入者の同意なく行えるため、様子見の値段で出品→発送せず相場の変動を待つ→高騰したら一方的にキャンセルし再出品、が出来る。おまけに出品者にはペナルティなし。そりゃメルカリに負けるだろ。一生クーポンばら撒いてまともじゃない出品者抱えてればいい。二度と使わん。 |
| Yahoo Flea Market jp | buyer | not as described | told users to settle themselves | none mentioned | refund, fair decision, platform to intervene | 悪質出品者の逃げ得と機能しないサポート体制に強く失望 / 「未使用に近い」とされたDAC(音楽関係の電子機器)を購入したところ、電源は入るがデータ通信できない不良品でした。複数の端末・ケーブルで確認後、返品を求めましたが、出品者は「動作未確認」「3N」を盾に対応を一切拒否。それはジャンクではないの・・・ 運営に助けを求 |
| Yahoo Flea Market jp | buyer | other | told users to settle themselves, no response, canned reply | chat | platform to intervene, fair decision, human review | 最悪 / 事務局が最悪。 相手に取引のためのコメントを送っても全く返答がないので、事務局に問い合わせているのに、相手と話し合いしてくださいって自動返信が届く。取り引き中のコメントに、個人情報を載せたり、キャンセル料を申請してきたり、明らかに規約違反をしており、そのことを事務局に問い合わせても、お気持ちはとても分かります |
| Yahoo Flea Market jp | buyer | seller cancel | unclear | none mentioned | platform to intervene, fair decision | 色々言いたい事はある。 メル〇リと変わらん。 / 1.イタズラ違反通報の対策を何かしてくれてる様子も無い。 本当に迷惑だから、アカウント停止とかの処置をしてほしい。  2.出品者側が勝手に、一方的にキャンセルが出来るのが意味が分からない。 メルカリも害悪だけど、メルカリは一方的なキャンセルが出来ないから、その点は凄くい |
| Yahoo Flea Market jp | buyer | seller cancel | unclear | none mentioned | fair decision, platform to intervene | 出品者都合で一方的にキャンセルされます。 / 購入後に、出品者都合で一方的にキャンセルされたことが数回ありました。最近では、購入して5分後に「発送の準備をしていたところ、商品の不備に気付いてしまいました。」との連絡が来て、一方的にキャンセルされました。おそらす、他のフリマにも同時に出品していて、そちらが売れてしまったの |
| Yahoo Flea Market jp | unclear | other | unclear | none mentioned | fair decision, platform to intervene | グッズ交換について / Yahooフリマ様のグッズ交換をよく利用するのですが取引成立後に同意もなく相手からキャンセルされました。 相手からキャンセルされるとこちらも強制的にキャンセルしないといけない仕組みを変えて欲しいです。 キャンセルされた理由も理不尽で別の方の方が取引条件がいいから、レートが高いものを出したからキャ |
| Yahoo Flea Market jp | buyer | counterfeit claim | told users to settle themselves | photos | refund, fair decision, platform to intervene | 最初はいいと思っていたが… / 毎月クーポンが配信され、メルカリよりも安く買えることが多く、日常多様するPAYPAYが使える点が魅力なのだが、誰でも出品出来、また登録がメルカリと比べて敷居が低いからか、これまたメルカリと比べて、質の悪い出品者が目立つ傾向にある。  自身の体験としてだが、こちらとメルカリを月10回程度、 |
| Yahoo Flea Market jp | seller | refund request other | no response | none mentioned | fair decision, platform to intervene | 手数料は安いがシステムはイマイチ / 販売手数料は5%と安いのはいいです。  システムは悪いところが目立ちます。 ブロック機能は、ブロックした相手がおすすめから非表示になるだけで検索には出てくるので、関係ないキーワードでスパム出品をしている人を検索から除外できず、ジャンルによっては検索が機能していません。  また、通報 |
| Yahoo Flea Market jp | seller | buyer cancel or no confirm | unclear | none mentioned | fair decision, platform to intervene | 良くも悪くも購入者天国 / 他のレビューでもありましたが、私も初回出品手数料無料を狙ってせっかく高価なものを出品しましたが購入者にキャンセルされ初回無料がなくなりました。 価格相談され、手数料無料になるからと安くして購入て貰いましたが、初めての出品だからか購入者が迷い出し、結局キャンセル。 翌日、諦め切れないから昨日の |
| Yahoo Flea Market jp | buyer | seller cancel | told users to settle themselves | none mentioned | platform to intervene, fair decision, faster decision | 購入者は要注意！ / 出品者の民度が低過ぎると思います。前日、こちらのアプリから購入・入金をした所、理由も分からないまま突然の出品者から一方的なキャンセルされました。連絡にも応じてもらえず、早く商品を手元に欲しかったので別の出品者より商品を購入。 入金の連絡をしても返信無く、発送の期日を過ぎても連絡無し。再度こちらから |
| Yahoo Flea Market jp | buyer | other | unclear | none mentioned | explanation, fair decision | 勝手な請求 / いつのか分からないが送料が足りないためと請求がきました。  なぜそのときに連絡しないのですか？4ヶ月ほど前のものとか知るわけないわって感じです。  普通のフリマでも完了したら2週間とかでキャンセルも請求もできませんよ。  せめて足りないときにすぐメールしてほしいです（なんならメールも通知もなし）  ある |
| Yahoo Flea Market jp | buyer | not as described | told users to settle themselves | none mentioned | platform to intervene, fair decision | 購入者はリスクが高い / 購入者はほとんど何も補償されていないため安心して取引できません 出品者は例え説明と違うものを送ろうが、約束を違えようが知らんぷりしてれば得をするような仕組みになっています そうした特性もあって横暴な出品者が多くなってると思います メルカリではまだ事務局が多少介入してくれますが、こちらは完全に当 |
| Yahoo Flea Market jp | seller | buyer cancel or no confirm | unclear | none mentioned | fair decision, platform to intervene | 出品者に不利 / こちらの発送が3〜7日にしていたにもかかわらず購入から1日で「まだ発送されてないからキャンセルしてくれ」との要望がありました。 断るとごねられ、ヤフフリでは購入者しか評価がつけられずこのままお取引を続けても不当に悪い評価をつけられそうだと感じしぶしぶキャンセルに応じました。  グッズ交換でも中身のない |
| Yahoo Flea Market jp | buyer | seller cancel | auto closed or auto confirmed, no response | none mentioned | fair decision, explanation | あ / 購入後、こちらから何度か連絡しましたが最後まで返信がなく、取引キャンセルとなりました。その結果、1000円分のクーポンを2枚とも期限切れで失ってしまいました。こちらには落ち度がなかっただけに、とても残念です。運営もそれを対処してくれなくてとても残念でした。 |
| Yahoo Flea Market jp | seller | buyer cancel or no confirm | unclear, no response | none mentioned | explanation, platform to intervene | 要注意で！困っても電話の問い合わせの記入は無し！ / 購入者の都合でキャンセルの連絡が あり。キャンセルにしてもらいましたが 数日後 購入します。というこでしたが 個人情報を共有しないといけないことになり 怖いので断り 商品も返ってくることがありませんでしたが かなり日が経ってから おそらくその時の送料と思われる金額の |
| Yahoo Flea Market jp | buyer | seller cancel | unclear | none mentioned | fair decision, platform to intervene | 無法地帯 / 高騰したら出品者が一方的にキャンセル出来て、しかもなんのペナルティーもなく再出品出来る無法地帯を運営は充分理解しているのに放置している最低最悪のフリマサイト！ 責めて一方的にキャンセル出来る状態を放置するなら、購入者側で一方的にキャンセルした出品者に対し評価をつけれるようにしないと、被害者出し続けるだけ、 |
| Yahoo Flea Market jp | buyer | not as described | unclear | none mentioned | refund, fair decision | うっかり評価済みにしてしまい、商品もお金も失いました / 色違いの商品が届いたのに、似た色だったため間違いに気づかず、評価を入れてしまいました。その後郵便局から回収依頼が来て、色違いのせい？と思い渡したら、結局代品の発送はなく、評価後なので返金もできないと言われました。このようなトラブルもあり得ますので、皆様もぜひお気 |
| Yahoo Flea Market jp | seller | other | no response | none mentioned | fair decision, platform to intervene | 出品者に対する扱いが酷い / 購入者の民度が低い。  事前に質問せずに商品を購入し後から質問をしてくる購入者や、商品説明欄に明記した事で理不尽な評価をしてくる購入者、身勝手な取引キャンセル、大幅な値下げ相談、上から目線の質問、不当な要求、嫌がらせ目的と思われる違反報告など、出品者として利用を初めて半年しか経っていないに |
| Yahoo Flea Market jp | buyer | not received | told users to settle themselves, canned reply | none mentioned | platform to intervene, refund | 星ゼロです / もう二度と使いたくありません。 商品が届かない等のトラブル時も、当事者間の解決を促すだけで運営側は関与する気は全くありません。 問い合わせてもデフォルトの回答しかありません。 クーポンでお安く買えても商品が届かなければ無意味です。 トラブルに巻き込まれない自信がある方が利用されれば良いかと思います。 |
| OLX in | seller | refund request other | no response | none mentioned | refund | Fraud / Don’t fall prey to the paid promise sale add. Didn’t get a buyer and as promised they don’t refund. You can’t connect to their customer service team |
| OLX in | seller | scam off platform | refunded, unclear | none mentioned | refund, fair decision | Total fraud customers / Totally fraud no genuine buyers 98% companies Spinny and cars 24 c customer care calls old paid service is totally fraud this is my seco |
| OLX in | buyer | counterfeit claim | unclear | none mentioned | platform to intervene, fair decision | Fake products / Most of the elite members scammers they list fake product all over india you guys are encouraging them just because of elite membership |
| OLX in | seller | refund request other | no response | none mentioned | refund | Glitchy app / They stole my money after a glitch on the ad promotion that never went through. My account was deducted and after contacting them for several days |
| OLX in | seller | scam off platform | unclear | none mentioned | refund, platform to intervene | Too many fraud account / I got only fake enquiries. And they used to agree with offers and they send ka scanner to steal my money .not safe at all . I paid too  |
| OLX in | seller | other | unclear | none mentioned | unclear | Badwaye Saale Teri maa ka bhosda / Third class gu wala site Saale benchot paise Kama ne baithe Badwaye saale all fake buyers and no proper insight Saale aid ha  |
| OLX in | seller | refund request other | no response | none mentioned | refund | False promises on featured post / No money returns if not sold.they have advertised money refund or guarantee sale .both not done i have info about the ads.i wi |
| OLX in | seller | refund request other | unclear | none mentioned | refund | Unnecessary charging elite scheme / Why taking charge for elite and all badges if you cannot help or assist in selling good properties in good locations. I want |
| OLX in | seller | refund request other | unclear | none mentioned | refund, fair decision | Worstest website to sell or buy a product. / They ask for subscription and even after purchasing subscription they didn’t sell the product only fake people ask  |
| OLX in | seller | refund request other | unclear | none mentioned | refund | Sad experience / OLX was useful initially, but my recent experience has been extremely disappointing. The platform is almost fully automated, with no easy acces |
| OLX in | seller | scam off platform | unclear | none mentioned | platform to intervene | Scammers platform -  very dangerous app / Every time when  I posted a new ad I get lot of offers immediately with full acceptance of expected price, sooner I re |
| OLX in | buyer | other | unclear | none mentioned | platform to intervene | More bugs and Fake products / More bugs-unable to follow the seller, unable to wishlist the products  Genuine owners adds are less recent days, most of the adds |
| OLX in | seller | refund request other | unclear | none mentioned | refund | The apps packages are a scam / Use your free ad but never buy a package to sell anything. Half the time it won’t activate and they will say they can’t refund it |
| OLX in | unclear | scam off platform | unclear | none mentioned | platform to intervene | Worst  application / Place were you can find different types scammers regardless of having verified ID is like joke. Just go offline shop and purchase your desi |
| OLX in | seller | refund request other | unclear | none mentioned | refund | Couldn’t sell my bike even after getting subscriptions / I took that guarantee subscription 4 times , then also couldn’t sell my bike in reasonalble prices , ei |
| OLX in | seller | other | unclear | none mentioned | platform to intervene, refund | Fake leads / Worst experience ever, i have tried listing my car twice after purchasing premium packages, more than half leads are fake ones, either they deactiv |
| OLX in | seller | scam off platform | unclear | none mentioned | refund, platform to intervene | My experience / I paid money rs399 to sell a jacket.They charged my bank account. After that I received a fake buying request from them. I didn’t receive any be |

## 6. Step 5: what users wish existed (190 reviews rated 3–5 stars)

Reviews rated 3–5 stars containing wish or request words in 6 languages, up to 20 per app-market (`wish_sample.jsonl`), coded with a wish type and a short English paraphrase (`wish_labels.jsonl`). 145 contained a real wish. All of them:

| App | Rating | Wish type | Wish (paraphrased) |
| --- | --- | --- | --- |
| Bunjang kr | 5★ | fees, payment | Lower 6% seller fee and allow direct bank transfers without penalties. |
| Bunjang kr | 5★ | communication | Trash bin to recover deleted chats, useful for scam disputes. |
| Bunjang kr | 5★ | payment, fees | Make safe payment optional, cut fees, pay sellers sooner. |
| Bunjang kr | 5★ | dispute support, fees | Handle transaction disputes properly given the fees charged. |
| Bunjang kr | 5★ | dispute support, fees | Consistent moderation, fewer AI false suspensions, lower fees. |
| Bunjang kr | 5★ | listing ease, payment | Pre-order shipping deadline on listings, escrow until seller ships, split-order page. |
| Bunjang kr | 4★ | fees, communication, safety trust | Lower fee, reminders for unread messages, more report types, penalise reservation cancellations. |
| Bunjang kr | 4★ | fees, payment | Less burdensome mandatory safe payment and lower fees. |
| Bunjang kr | 5★ | fees, payment | Transparent fee rationale and faster instant payout of seller funds. |
| Bunjang kr | 5★ | fees, dispute support | Remove fees, resolve scam cases, stop wrongful AI chat suspensions. |
| Bunjang kr | 4★ | dispute support, logistics | Allow sharing phone and pickup store for exchanges; faster restriction appeals. |
| Bunjang kr | 5★ | dispute support, logistics | Human support, no wrongful sales limits, allow address sharing for exchanges. |
| Bunjang kr | 5★ | fees, payment | Lower fees and no hidden refund charge on wallet payouts. |
| Bunjang kr | 5★ | fees, payment | Drop forced safe payment and its high fee and slow payout. |
| Bunjang kr | 5★ | safety trust, logistics, payment | Seller protection when buyer never collects half-price delivery; prepay shipping cost. |
| Carousell hk | 4★ | communication | English translation or filter for Chinese listing descriptions. |
| Carousell hk | 3★ | discovery | Blocked sellers' listings hidden from search results. |
| Carousell hk | 5★ | safety trust | ID verification for sellers before they can list. |
| Carousell my | 5★ | other | Fewer ads. |
| Carousell my | 5★ | app tech | Landscape layout for tablets. |
| Carousell my | 5★ | safety trust | Better anti-scammer protection, especially for sellers. |
| Carousell my | 4★ | payment | Faster seller cash-out to bank. |
| Carousell my | 5★ | discovery | Folders to organise liked items. |
| Carousell my | 5★ | communication, other | Restore cross-border trading and chat without foreign phone number. |
| Carousell my | 5★ | communication | Push notifications for new messages. |
| Carousell my | 5★ | other | Make the app available in Pakistan. |
| Carousell my | 3★ | other | Option to turn off spammy ads, even if paid. |
| Carousell my | 5★ | communication | Let sellers send offers to users who liked their item. |
| Carousell my | 5★ | payment | Release-payment button when item arrives, like Shopee, for faster seller payout. |
| Carousell ph | 4★ | other | More buyers on the platform so items sell faster. |
| Carousell ph | 3★ | app tech | Fix login failures and constant notification permission popup. |
| Carousell ph | 3★ | other, dispute support, app tech | Fewer ads, stable layout, proper conflict handling beyond suspensions. |
| Carousell ph | 3★ | safety trust, dispute support | Scam protection and action on scam reports; publish seller reviews. |
| Carousell ph | 5★ | listing ease | Allow appeals for same item posted separately, not flagged duplicate. |
| Carousell ph | 5★ | app tech | Login with phone number or other email in the app. |
| Carousell ph | 5★ | safety trust | Thorough vetting of members to prevent scams. |
| Carousell ph | 5★ | dispute support | Consistently helpful customer service staff. |
| Carousell ph | 3★ | safety trust, payment, dispute support, condition info | Secure payment, defective-item return and refund like Shopee, seller reviews. |
| Carousell ph | 3★ | fees, other | Feature improvements alongside new chat and offer limits and subscription. |
| Carousell ph | 3★ | discovery | Organise likes by category and bulk-remove sold items. |
| Carousell sg | 3★ | listing ease, fees | Archive listings instead of marking sold; keep features free; no forced buy button. |
| Carousell sg | 4★ | app tech | Fix long-standing chat bug. |
| Carousell sg | 5★ | safety trust, fees, payment | Stay free; safer transactions; escrow intermediary for high-value items. |
| Carousell sg | 4★ | app tech | Fix app failing to message other users. |
| Carousell sg | 3★ | pricing help | Bring back the pricing tip feature. |
| Carousell sg | 3★ | app tech | Fix slow loading and laggy typing. |
| Carousell sg | 3★ | listing ease | Clearer wording for 'no owner staying' option on rental listings. |
| Carousell sg | 4★ | payment, dispute support | Release stuck seller payout; human support instead of AI. |
| Carousell sg | 5★ | safety trust | Fewer time-wasting unserious buyers. |
| Carousell tw | 5★ | safety trust | Penalties or records for buyers who cancel or vanish. |
| Carousell tw | 5★ | discovery | Filter out specific sellers (businesses) in search. |
| Carousell tw | 3★ | dispute support | Proper dispute mechanism for defective items beyond telling users to settle privately. |
| Carousell tw | 4★ | safety trust, payment | Option to wipe saved bank details to limit hacking risk. |
| Carousell tw | 4★ | fees, logistics | Remove fees and shipping costs, funded by advertising. |
| Carousell tw | 3★ | payment, other | Combined checkout for same seller's items, wallet-balance payment, third-party payment. |
| Carousell tw | 3★ | app tech, listing ease, dispute support | Fix auto-hiding of listings, reserve bug, reachable human support. |
| Carousell tw | 4★ | discovery | Show item city in listings without opening the map. |
| Carousell tw | 4★ | other | More stylish, modern interface like Korean competitor. |
| Carousell tw | 4★ | discovery | Categorise and search wishlist, sort by price. |
| Carousell tw | 3★ | app tech | Fix lag and likes not saving. |
| Carousell tw | 5★ | listing ease, condition info, other | Video on listings and shopping cart for multiple items. |
| Carousell tw | 3★ | listing ease | Better photo editing, more categories, remember previous listing options. |
| Cars24 au | 5★ | payment, app tech | Show payment details in app promptly. |
| Cars24 in | 5★ | safety trust, fees | Honest final offers and no fee to receive the final offer. |
| Cashify in | 4★ | pricing help, condition info, dispute support | Transparent valuation practices and prompt action on fake device complaints. |
| Gumtree au | 5★ | app tech, other | Fix search glitches and freezes; fewer ad pop-ups. |
| Gumtree au | 3★ | app tech | Fix messages not showing in the app. |
| Gumtree au | 5★ | discovery, communication | Smaller watchlist thumbnails, sort by nearest, exclude words, opt out of message emails. |
| Gumtree au | 3★ | discovery, other | Default to newest listings first; option to stop autoplay ads. |
| Gumtree au | 3★ | app tech | Fix glitchy scrolling. |
| Gumtree au | 5★ | app tech | Fix search glitches that erase progress. |
| Gumtree au | 3★ | safety trust | Protection from scammers, trolls and no-show buyers. |
| Gumtree au | 4★ | listing ease, other | Better listing technology and more users on platform. |
| Gumtree au | 3★ | fees | Return to free selling. |
| Gumtree au | 3★ | fees | Free first listing for newcomers. |
| Gumtree au | 4★ | dispute support, communication | More helpful support; allow paragraphs in first message. |
| Karrot kr | 3★ | payment, other | Shopping cart for buying several items without chatting. |
| Karrot kr | 4★ | communication | Allow chat with sellers in other regions before buying. |
| Karrot kr | 5★ | communication | Allow asking sellers questions before buy-now. |
| Karrot kr | 3★ | discovery | Fix search that misses listings. |
| Karrot kr | 3★ | communication | Add chat for buy-now items in other regions. |
| Karrot kr | 5★ | communication | Allow pre-purchase questions on buy-now listings. |
| Karrot kr | 5★ | communication, discovery | Chat on buy-now items or option to hide buy-now listings. |
| Karrot kr | 5★ | discovery, other | Show current local range; stop silent range shrinking and buy-now-only results. |
| Karrot kr | 3★ | app tech | Fix job application text field not editing. |
| Karrot kr | 4★ | communication, logistics | More preset questions for buy-now such as shipping method, extra photos, or free text. |
| Karrot kr | 4★ | communication, condition info, safety trust | Allow chat to ask item condition before buying from other regions. |
| Karrot kr | 4★ | discovery | Toggle to hide buy-now listings from other regions. |
| Karrot kr | 5★ | communication | Transaction-only notification setting without disabling dozens of others. |
| Karrot kr | 5★ | other | Age check by birth year; separate jobs from marketplace. |
| Karrot kr | 5★ | communication | Restore free chat for buy-now listings. |
| Karrot kr | 3★ | communication | Allow questions on buy-now items. |
| Karrot kr | 4★ | condition info, logistics, fees | Ask about defects, convenience-store shipping on buy-now, remove fees. |
| Karrot kr | 4★ | discovery | Add three-room option in property listing type filter. |
| Karrot kr | 5★ | communication | Allow chatting with sellers in other regions. |
| Mercari JP jp | 5★ | dispute support | Cancel order automatically after 24 hours if seller unresponsive, as promised. |
| Mercari JP jp | 4★ | logistics | Ship multiple parcels anonymously without asking for recipient's address. |
| Mercari JP jp | 4★ | dispute support, condition info | Refunds and returns when item differs from photos. |
| Mercari JP jp | 5★ | fees, other | Halve the fee to 5% and bring back time sales. |
| Mercari JP jp | 5★ | fees, logistics | No fee when shipping cost exceeds profit on clothing; cheaper shipping. |
| Mercari JP jp | 4★ | dispute support, logistics | Better compensation or replacement when item breaks in delivery. |
| Mercari JP jp | 3★ | other | Stronger control of resellers overpricing. |
| Mercari JP jp | 4★ | dispute support, fees | Transparent restriction rules, return tracking, support worth the fees. |
| Mercari JP jp | 4★ | listing ease, discovery | Hide instead of delete finished listings; default seller listings to newest. |
| Mercari JP jp | 4★ | discovery, safety trust, listing ease | Hide unwanted items, richer search result info, filter seller listings, fuller seller ratings. |
| Mercari JP jp | 3★ | app tech, listing ease | No AI auto-fill when listing; fix slow input. |
| Mercari JP jp | 5★ | app tech | Fix app freezing on receipt rating screen. |
| Mercari JP jp | 3★ | payment | Option to hide available-balance display in wallet. |
| Mercari JP jp | 4★ | logistics | In-person pickup flow for item handover. |
| Mercari JP jp | 4★ | communication | Explain reasons when bulk-purchase requests are cancelled. |
| Mercari JP jp | 4★ | communication | English platform and support for foreigners. |
| Mudah my | 3★ | app tech | App should remember last opened page. |
| Mudah my | 4★ | discovery | Bulk-remove sold vehicles from saved list. |
| Mudah my | 5★ | safety trust | Continued improvements in scam protection. |
| Mudah my | 5★ | safety trust | Better scam and scammer prevention. |
| Mudah my | 5★ | safety trust | Stronger anti-scammer protection against fake car dealers. |
| Mudah my | 3★ | app tech | Fix repeated login prompts. |
| Mudah my | 4★ | app tech | Add dark mode. |
| Mudah my | 4★ | discovery | Price range filter. |
| OLX id | 3★ | app tech, other | Fix filter buttons unresponsive; fewer ads. |
| OLX in | 5★ | discovery, app tech | Filter by owner or dealer in cars; remember last search. |
| Spinny in | 5★ | other, communication | Add alternate phone number and choose which number support calls. |
| Spinny in | 5★ | dispute support | Contact number to follow up on deals. |
| Spinny in | 4★ | app tech | Notifications should open the specific new vehicle page. |
| Spinny in | 3★ | other | Lower prices on used cars. |
| Spinny in | 5★ | dispute support | Continued strong post-delivery support. |
| Spinny in | 5★ | dispute support | Better client management and assured relationship manager assignment. |
| Yahoo Flea Market jp | 4★ | communication | Stamp reactions in transaction messages. |
| Yahoo Flea Market jp | 3★ | listing ease | Allow deleting finished listings after a set period. |
| Yahoo Flea Market jp | 3★ | app tech | Stop screen jumping while browsing search results. |
| Yahoo Flea Market jp | 3★ | logistics | Allow choosing Yamato or Japan Post after purchase. |
| Yahoo Flea Market jp | 5★ | communication | Make answered questions leave to-do list; stop notifications being buried. |
| Yahoo Flea Market jp | 3★ | communication | Option to turn off operator announcement notifications. |
| Yahoo Flea Market jp | 4★ | listing ease, pricing help, communication | Bulk price cuts, group listings by genre, message templates, 7-day sold price lookup. |
| Yahoo Flea Market jp | 3★ | communication | Option to turn off 'lower your price' like notifications. |
| Yahoo Flea Market jp | 4★ | communication | Notification badge that clears once read. |
| Yahoo Flea Market jp | 3★ | communication, listing ease | Turn off price-drop nudges; restore copy-and-repost; repost reminders. |
| Yahoo Flea Market jp | 3★ | communication, payment | Faster card payment; clearer notification of seller messages. |
| Yahoo Flea Market jp | 3★ | safety trust, discovery, logistics | Seller profile text, filter bulk requests to liked items, carrier-change warnings. |
| Yahoo Flea Market jp | 4★ | app tech | Fix camera slowness, freezing and delayed sale notifications. |
| Yahoo Flea Market jp | 4★ | safety trust | Let sellers rate buyers too. |
| Yahoo Flea Market jp | 4★ | discovery | Search exchange partners by name or ID. |
| Yahoo Flea Market jp | 5★ | communication | Message templates and one-click reactions. |
| Yahoo Flea Market jp | 3★ | app tech | Fix frequent crashes while listing; add autosave. |
| Yahoo Flea Market jp | 4★ | communication | Notify poster of comments; allow comment unsend. |

## 7. Limits

- iPhone users only; Android dominates in India and Southeast Asia.
- Reviews skew towards angry users and app bugs.
- 25 reviews per app means per-app numbers are rough (±18 points); pooled C2C numbers (300) are about ±5 points.
- Labels were made by AI with limited human checks, and with no second labeller to compare against.
- Mercari's reviews span only 3 weeks.
