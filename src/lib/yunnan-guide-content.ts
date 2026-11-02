export type YunnanGuideLocale = "en" | "zh";

const en = {
  whatsapp: "https://wa.me/8618880441791?text=Hi%20Joy%2C%20I%27m%20planning%20a%20trip%20to%20Yunnan.%20My%20travel%20dates%20are%20____%20and%20I%27m%20interested%20in%20____.",
  facts: [
    ["BEST FOR", "First China trips · Culture · Mountains"],
    ["TIME TO ALLOW", "6–10 days for a first route"],
    ["MAIN GATEWAY", "Kunming"],
    ["EASIEST SEASONS", "Spring and autumn"],
  ],
  routeStops: [
    ["01", "Kunming", "Gateway", "Land, reset after the flight and begin west by high-speed rail. Kunming is the practical start rather than the part to rush through."],
    ["02", "Dali", "2–3 nights", "Use Dali as a slower lake-and-village base: Erhai, Bai culture, a walkable old town and enough time to leave the main streets."],
    ["03", "Shaxi", "1–2 nights", "Private transport makes this Tea Horse Road town easier to reach. Stay after the day visitors leave and let the square become quiet again."],
    ["04", "Lijiang", "2–3 nights", "Finish beneath Jade Dragon Snow Mountain, balancing a mountain day with the quieter lanes and villages beyond central Dayan."],
  ],
  placeCards: [
    { name: "Dali", note: "Erhai Lake, Bai villages and room to slow down.", image: "/assets/blog/dali-travel-guide/cover-cangshan-erhai.webp", alt: "Cangshan mountains and Erhai Lake near Dali", href: "/dali-travel-guide" },
    { name: "Shaxi", note: "A living Tea Horse Road town worth staying overnight for.", image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp", alt: "River and tiled roofs in Shaxi Ancient Town", href: "/shaxi-ancient-town-guide" },
    { name: "Lijiang", note: "Old-town life and the high mountain landscape of northwest Yunnan.", image: "/assets/destinations/yunnan/lijiang.webp", alt: "Rooftops and canals in Lijiang Old Town with mountains beyond", href: "/lijiang-travel-guide" },
  ],
  guides: [
    { title: "How Many Days in Yunnan?", excerpt: "Compare 6, 8, 10 and 14-day routes, with realistic hotel nights and time for transfers.", href: "/how-many-days-in-yunnan", image: "/assets/blog/how-many-days-in-yunnan/cover-erhai-lake.webp", imageAlt: "Evening clouds reflected in Erhai Lake near Dali", readTime: "PLANNING GUIDE" },
    { title: "Kunming Travel Guide", excerpt: "How long to stay at the gateway, whether the Stone Forest is worth a day, and how the private journeys use the city.", href: "/kunming-travel-guide", image: "/assets/blog/kunming-travel-guide/cover-stone-forest.webp", imageAlt: "Limestone pinnacles of the Stone Forest near Kunming", readTime: "DESTINATION GUIDE" },
    { title: "Dali Travel Guide", excerpt: "How long to stay, what Dali is really good for and how it fits a wider Yunnan route.", href: "/dali-travel-guide", image: "/assets/blog/dali-travel-guide/cover-cangshan-erhai.webp", imageAlt: "Cangshan mountains and Erhai Lake near Dali", readTime: "DESTINATION GUIDE" },
    { title: "Shaxi Ancient Town Guide", excerpt: "What to see, how to get there from Dali or Lijiang, where to stay and why one night can make the difference.", href: "/shaxi-ancient-town-guide", image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp", imageAlt: "River and tiled rooftops at Shaxi Ancient Town", readTime: "DESTINATION GUIDE" },
    { title: "Lijiang Travel Guide", excerpt: "Old Town vs Shuhe, Jade Dragon Snow Mountain, and how many nights to keep at the mountain end.", href: "/lijiang-travel-guide", image: "/assets/destinations/yunnan/lijiang.webp", imageAlt: "Rooftops and canals in Lijiang Old Town with mountains beyond", readTime: "DESTINATION GUIDE" },
    { title: "Shangri-La Travel Guide", excerpt: "When the highland loop is worth the extra days — and when to stay on the first route.", href: "/shangri-la-travel-guide", image: "/assets/destinations/yunnan/shangri-la.webp", imageAlt: "Highland lake and forest near Shangri-La", readTime: "DESTINATION GUIDE" },
  ],
  seasons: [
    ["March–May", "Spring", "Comfortable days around Kunming and Dali, with popular dates filling early around public holidays."],
    ["June–August", "Summer", "Green landscapes and afternoon rain. Build weather flexibility into mountain and outdoor days."],
    ["September–November", "Autumn", "Often the easiest balance of stable weather, clearer mountain views and comfortable daytime temperatures."],
    ["December–February", "Winter", "Kunming and Dali remain usable, but mornings in Lijiang and the northwest can be genuinely cold."],
  ],
  practical: [
    ["Payments", "Set up mobile payment and keep a small cash backup before leaving the larger cities.", "/payments-in-china"],
    ["Internet & eSIM", "Arrive with data working so maps, bookings, translation and ride-hailing are available from day one.", "/internet-in-china"],
    ["Transportation", "High-speed rail works well between Kunming, Dali and Lijiang; Shaxi is easier by road.", "/transport-in-china"],
    ["Hotels", "Confirm that each property can register a foreign passport, especially in smaller towns.", "/hotels-in-china"],
  ],
  faqs: [
    ["How many days do you need in Yunnan?", "Six days is enough for a focused Kunming–Dali–Shaxi–Lijiang route when transfers are arranged well. Eight to ten days gives you more unstructured time and makes it easier to add extra nights in Dali or Shaxi."],
    ["Is Yunnan a good first destination in China?", "Yes. It combines convenient rail connections, distinctive local cultures and dramatic landscapes without requiring a special regional permit on the usual route. Practical preparation for payments, data and hotels still matters."],
    ["What is the best first Yunnan itinerary?", "For most first visits, begin in Kunming, spend time around Dali and Erhai, continue by road to Shaxi, then finish in Lijiang. It is a coherent route without trying to include every part of the province."],
    ["Can I travel around Yunnan independently?", "Yes, especially between Kunming, Dali and Lijiang. Places such as Shaxi require more transport planning. A private journey is useful when you want those connections and local experiences arranged without joining a coach group."],
    ["Is Shaxi worth visiting?", "Yes if you can stay overnight. It is roughly two to three hours by road from Dali, so treating it as a rushed return day trip misses the quieter evening and morning that make the town special."],
    ["Should I add Shangri-La or Xishuangbanna?", "Only if you have enough time. Shangri-La extends the highland route north; Xishuangbanna is a separate tropical region far to the south. Adding either to a short first week usually creates more travel than experience."],
    ["When is the best time to visit Yunnan?", "Spring and autumn are the easiest all-round seasons for this route. Summer is greener but wetter, while winter can be pleasant around Kunming and Dali and much colder in Lijiang and the northwest."],
  ],
  copy: {
    home: "Home", current: "Yunnan Travel Guide", heroAlt: "Boardwalk beside a turquoise alpine lake under snow mountains in Yunnan", heroKicker: "YUNNAN TRAVEL GUIDE · 2026", heroTitle: "Yunnan travel guide for a first trip", heroLead: "From Kunming and Dali to Shaxi and Lijiang, plan a first journey with realistic travel times, local insight and room to slow down.", heroJourney: "EXPLORE FIRST ENCOUNTER YUNNAN", heroGuide: "START WITH THE GUIDE", nav: ["Plan", "Places", "Route", "From abroad", "Guides", "Season", "Prepare", "FAQ"],
    introKicker: "START WITH THE SHAPE OF THE TRIP", introTitle: "Yunnan is a province, not one climate or one quick loop.", introMiddle: " is the usual gateway. Dali brings the lake basin and Bai villages. Shaxi rewards an overnight stay on the old Tea Horse Road, while ", introEnd: " leads into the high mountain landscape of northwest Yunnan.", introSecond: "For a first trip, these four places form a coherent route. Xishuangbanna and ", introSecondEnd: " are both worthwhile, but they pull the journey in different directions. Add one only when your dates and interests justify the extra travel.",
    placesKicker: "WHERE TO GO", placesTitle: "Four stops, one natural direction.", placesIntro: "Move west from Kunming rather than treating every famous place in Yunnan as a separate box to tick.", explore: "EXPLORE →", routeKicker: "RECOMMENDED FIRST JOURNEY", routeTitle: "Kunming → Dali → Shaxi → Lijiang", routeP1: "The route works because each place changes the rhythm rather than repeating the last stop. Rail handles the larger city connections; private road transport opens the stretch through Shaxi.", routeP2: "The six-day version is focused and comfortable when the logistics are already arranged. If you prefer longer mornings or more unscheduled time, add nights in Dali or Shaxi rather than adding another region.", routeLink: "See the complete itinerary and pricing →", customPrompt: "Want more days, different stops or a gentler pace?", journeyTitle: "First Encounter Yunnan", journeySubtitle: "Kunming • Dali • Lijiang • Shaxi", journeyFeatures: ["Private journey", "No shopping stops", "Local experiences", "Flexible pace"],
    abroadKicker: "STARTING OUTSIDE CHINA", abroadTitle: "Plan Yunnan from where you live.", abroadIntro: "Entry rules, connections and realistic trip length depend on where your journey begins—and which passport you hold.", guidesKicker: "DESTINATION GUIDES", guidesTitle: "Go from the province to the decisions that shape each day.", guidesIntro: "Use the city guide first, then decide whether the highland loop is worth extra days.", seasonKicker: "WHEN TO GO", seasonTitle: "“Spring all year” does not describe the whole province.", seasonIntro: "Kunming may be mild while Lijiang mornings are cold and the mountains are dealing with entirely different weather.", prepareKicker: "BEFORE YOU ARRIVE", prepareTitle: "Make the unfamiliar systems easier before travel day.", prepareIntro: "A beautiful route still depends on working payments, data, transport and foreign-passport accommodation.", readGuide: "READ THE GUIDE →", survivalKit: "OPEN THE CHINA SURVIVAL KIT", faqKicker: "COMMON QUESTIONS", faqTitle: "Planning a first Yunnan trip", sourceTitle: "Yunnan travel guide", finalKicker: "NOT SURE WHICH ROUTE FITS?", finalTitle: "Tell Joy where you are in the planning process.", finalText: "Dates decided or just researching—share your interests and preferred pace. You’ll get a personal answer without sales pressure.", finalCta: "Start Planning My Journey", whatsappCta: "CHAT WITH JOY ON WHATSAPP →", viewJourney: "VIEW FIRST ENCOUNTER YUNNAN →", priceFrom: "From", jsonDescription: "A practical guide to planning a first Yunnan journey through Kunming, Dali, Shaxi and Lijiang.", touristTypes: ["First-time visitors to China", "Culture travelers", "Slow travel"],
  },
};

const zh: typeof en = {
  whatsapp: "https://wa.me/8618880441791?text=Joy%20%E4%BD%A0%E5%A5%BD%EF%BC%8C%E6%88%91%E6%AD%A3%E5%9C%A8%E8%A7%84%E5%88%92%E4%BA%91%E5%8D%97%E4%B9%8B%E6%97%85%EF%BC%8C%E5%87%BA%E8%A1%8C%E6%97%A5%E6%9C%9F%E6%98%AF____%EF%BC%8C%E6%84%9F%E5%85%B4%E8%B6%A3%E7%9A%84%E6%98%AF____%E3%80%82",
  facts: [["适合人群", "第一次来中国 · 文化 · 山景"], ["建议天数", "第一条路线 6—10 天"], ["主要入口", "昆明"], ["舒适季节", "春季与秋季"]],
  routeStops: [
    ["01", "昆明", "抵达城市", "落地后先缓一缓，再坐高铁向西。昆明是方便的起点，不必匆匆略过，也不用安排得太满。"],
    ["02", "大理", "2—3 晚", "把大理当作湖边的慢生活落脚点：看看洱海和白族村落，逛逛适合步行的古城，也留点时间走进主街之外的小巷。"],
    ["03", "沙溪", "1—2 晚", "包车或专车接送，让这座茶马古道小镇更容易抵达。等一日游的游客散去，广场会重新安静下来。"],
    ["04", "丽江", "2—3 晚", "在玉龙雪山下收尾。除了留一天给雪山，也去大研古城中心之外，走走更安静的街巷与村落。"],
  ],
  placeCards: [
    { name: "大理", note: "洱海、白族村落，以及慢下来的空间。", image: "/assets/blog/dali-travel-guide/cover-cangshan-erhai.webp", alt: "大理附近的苍山与洱海", href: "/dali-travel-guide" },
    { name: "沙溪", note: "仍保有生活气息的茶马古道小镇，值得住一晚。", image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp", alt: "沙溪古镇的河流与瓦屋顶", href: "/shaxi-ancient-town-guide" },
    { name: "丽江", note: "古镇生活与滇西北高山风景。", image: "/assets/destinations/yunnan/lijiang.webp", alt: "丽江古城屋顶、水巷与远山", href: "/lijiang-travel-guide" },
  ],
  guides: [
    { title: "昆明旅行指南", excerpt: "抵达后住多久、石林是否值得留一天，以及私家行程怎样衔接昆明。", href: "/kunming-travel-guide", image: "/assets/blog/kunming-travel-guide/cover-stone-forest.webp", imageAlt: "昆明附近石林的石灰岩峰柱", readTime: "目的地指南" },
    { title: "大理旅行指南", excerpt: "住多久、这里真正值得体验什么，以及怎样衔接更大的云南路线。", href: "/dali-travel-guide", image: "/assets/blog/dali-travel-guide/cover-cangshan-erhai.webp", imageAlt: "大理苍山与洱海", readTime: "目的地指南" },
    { title: "沙溪古镇指南", excerpt: "看什么、从大理或丽江怎么去、住哪里，以及住一晚有何不同。", href: "/shaxi-ancient-town-guide", image: "/assets/blog/dali-hidden-gems-off-the-beaten-path/cover-shaxi.webp", imageAlt: "沙溪古镇河流与瓦屋顶", readTime: "目的地指南" },
    { title: "丽江旅行指南", excerpt: "古城与束河怎么选、玉龙雪山怎么排，以及在雪山脚下住几晚。", href: "/lijiang-travel-guide", image: "/assets/destinations/yunnan/lijiang.webp", imageAlt: "丽江古城屋顶、水巷与远山", readTime: "目的地指南" },
    { title: "香格里拉旅行指南", excerpt: "什么时候值得为高原线增加天数，什么时候应留在第一条路线。", href: "/shangri-la-travel-guide", image: "/assets/destinations/yunnan/shangri-la.webp", imageAlt: "香格里拉附近高原湖泊与森林", readTime: "目的地指南" },
  ],
  seasons: [
    ["3—5 月", "春季", "昆明与大理白天舒适，法定节假日前后的热门日期要早点订。"],
    ["6—8 月", "夏季", "草木葱绿，午后多雨。山地和户外活动要给天气留调整空间。"],
    ["9—11 月", "秋季", "通常更容易兼顾稳定天气、清晰山景与舒适白天气温。"],
    ["12—2 月", "冬季", "昆明和大理仍适合旅行，但丽江与滇西北清晨会非常冷。"],
  ],
  practical: [
    ["移动支付", "离开大城市前设置好移动支付，并带少量现金备用。", "/payments-in-china"],
    ["网络与 eSIM", "抵达时就有可用流量，地图、预订、翻译和打车才能从第一天顺畅使用。", "/internet-in-china"],
    ["交通衔接", "昆明、大理和丽江之间高铁方便；沙溪走公路更顺。", "/transport-in-china"],
    ["酒店入住", "确认每家酒店能登记外国护照，小城镇尤其要提前问。", "/hotels-in-china"],
  ],
  faqs: [
    ["云南需要玩几天？", "交通衔接安排合理时，6 天够走昆明—大理—沙溪—丽江这条主线。8—10 天能有更多自由时间，也方便在大理或沙溪多住几晚。"],
    ["云南适合作为第一次来中国的目的地吗？", "适合。常规路线有便利铁路、鲜明地方文化和壮阔风景，也不需要特殊区域许可。不过支付、网络和酒店仍需提前准备。"],
    ["第一次云南行程怎么安排最好？", "第一次去可先到昆明，在大理与洱海周边停留，再走公路去沙溪，最后到丽江。路线连贯，不必把全省都装进去。"],
    ["云南可以自由行吗？", "可以，尤其昆明、大理和丽江之间。沙溪等地需要更多交通规划。希望有人安排这些衔接和当地体验、又不想跟大巴团，私家行程更合适。"],
    ["沙溪值得去吗？", "能住一晚就值得。从大理坐车约两三小时，若只匆忙一日往返，会错过让小镇特别的安静夜晚与清晨。"],
    ["要加香格里拉或西双版纳吗？", "时间够才加。香格里拉把高原线向北延伸；西双版纳是远在南部的另一片热带区域。如果第一次去只有一周，加任何一个都容易让车程多过体验。"],
    ["什么时候去云南最好？", "这条路线春秋整体最舒适。夏季更绿也更湿；冬季昆明、大理宜人，丽江和滇西北则冷得多。"],
  ],
  copy: {
    home: "首页", current: "云南旅行指南", heroAlt: "云南雪山下碧绿高山湖泊旁的步道", heroKicker: "云南旅行指南 · 2026", heroTitle: "第一次去云南，这样安排路线", heroLead: "从昆明、大理到沙溪、丽江，用真实车程、本地经验和一点留白，规划你的第一趟云南之旅。", heroJourney: "查看初遇云南行程", heroGuide: "先看旅行指南", nav: ["规划", "目的地", "路线", "海外出发", "攻略", "季节", "准备", "常见问题"],
    introKicker: "先确定旅程的轮廓", introTitle: "云南是一个省，不是单一气候，也不是随便绕一圈。", introMiddle: "通常是主要抵达城市。大理有洱海和白族村落。沙溪是茶马古道上的小镇，值得住一晚，而", introEnd: "则把旅程带进滇西北的高山风景。", introSecond: "第一次去，这四个地方能连成一条顺路的路线。西双版纳和", introSecondEnd: "也都值得，但会把旅程拉向不同方向。只有日期和兴趣真正适合时，再选其中一个加入。",
    placesKicker: "去哪里", placesTitle: "四站连成一线，一路向西。", placesIntro: "从昆明一路向西，不要把云南每个有名的地方都当成单独的打卡任务。", explore: "进一步了解 →", routeKicker: "推荐的第一趟旅程", routeTitle: "昆明 → 大理 → 沙溪 → 丽江", routeP1: "这条路线的妙处，在于每一站都有不同的节奏，而不是重复上一站。大城市之间坐高铁，去沙溪的一段则包车走公路。", routeP2: "交通安排妥当的话，6 天既能走完主线，也不会太赶。想睡到自然醒，或多些自由安排的时间，就在大理或沙溪多住一两晚，不必再增加一个地区。", routeLink: "查看完整行程与价格 →", customPrompt: "想多玩几天、换几个地方，或把节奏放慢？", journeyTitle: "初遇云南", journeySubtitle: "昆明 • 大理 • 丽江 • 沙溪", journeyFeatures: ["私家旅程", "无购物安排", "当地体验", "节奏灵活"],
    abroadKicker: "从中国境外出发", abroadTitle: "从你生活的地方，开始规划云南。", abroadIntro: "入境规定、航班衔接与实际需要的天数，取决于你从哪里出发，以及持哪国护照。", guidesKicker: "目的地指南", guidesTitle: "先认识云南，再决定每一天怎么过。", guidesIntro: "先看城市指南，再判断高原线是否值得增加天数。", seasonKicker: "什么时候去", seasonTitle: "“四季如春”，并不能概括整个云南。", seasonIntro: "昆明可能仍温和，丽江清晨已经寒冷，山上又可能是完全不同的天气。", prepareKicker: "抵达之前", prepareTitle: "出发之前，先把陌生的工具用顺手。", prepareIntro: "路线再美，也离不开可用的支付、网络、交通，以及能办理外国护照入住登记的酒店。", readGuide: "阅读指南 →", survivalKit: "打开中国行前工具包", faqKicker: "常见问题", faqTitle: "规划第一趟云南之旅", sourceTitle: "云南旅行指南", finalKicker: "不确定哪条路线适合？", finalTitle: "告诉 Joy，你现在规划到哪一步。", finalText: "日期已定或还在查资料都可以，说说你的兴趣和喜欢的节奏。Joy 会亲自回复，不推销，也不催你决定。", finalCta: "开始规划我的旅程", whatsappCta: "在 WHATSAPP 与 JOY 聊聊 →", viewJourney: "查看初遇云南行程 →", priceFrom: "起价", jsonDescription: "第一次云南旅行的实用指南，涵盖昆明、大理、沙溪和丽江的路线规划。", touristTypes: ["第一次来中国的游客", "文化旅行", "慢旅行"],
  },
};

export function getYunnanGuideContent(locale: YunnanGuideLocale) {
  return locale === "zh" ? zh : en;
}
