/**
 * Localised copy for the China visa checker rule engine.
 *
 * The rule engine (evaluate.ts) runs outside React — inside a server action —
 * so it cannot use next-intl hooks. Instead every user-facing string lives
 * here, in two complete variants (en / zh), and is selected by `lang`.
 *
 * English strings are byte-identical to the previous hardcoded copy so the
 * English pages and the English-only country pages never change.
 */
export type VisaLang = "en" | "zh";

export type VisaCopy = {
  purposeLabels: Record<string, string>;
  transitLabels: Record<string, string>;
  stayLabels: Record<string, string>;
  policyTypeLabels: Record<string, string>;
  requirementLabels: Record<string, string>;
  portTypeLabels: Record<string, string>;
  portCityLabels: Record<string, string>;
  portNameLabels: Record<string, string>;
  stayAreaLabels: Record<string, string>;
  /** Single-line templates. `{token}` placeholders are filled at runtime. */
  texts: Record<string, string>;
  /** Multi-line checklist / condition lists. */
  lists: Record<string, string[]>;
};

export const enCopy: VisaCopy = {
  purposeLabels: {
    tourism: "Tourism",
    business: "Business",
    family_visit: "Family / Friends Visit",
    exchange: "Exchange / Short Visit",
    transit: "Transit",
    study: "Study",
    work: "Work",
    journalism: "Journalism",
    other: "Other / Not Sure",
  },
  transitLabels: {
    no_transit: "No transit",
    third_country_confirmed: "Third country/region with confirmed onward ticket",
    same_country_return: "Returning to the same country/region",
    not_sure: "Not sure yet",
  },
  stayLabels: {
    "3": "1–3 days",
    "10": "4–10 days",
    "30": "11–30 days",
    "31": "More than 30 days",
  },
  policyTypeLabels: {
    "Unilateral visa-free": "unilateral visa-free",
    "Mutual visa-free": "mutual visa-free",
  },
  requirementLabels: {
    "Must transit to a third country or region with a confirmed onward ticket":
      "Must transit to a third country or region with a confirmed onward ticket",
    "Enter through a Hainan open port and remain inside Hainan Province":
      "Enter through a Hainan open port and remain inside Hainan Province",
  },
  portTypeLabels: {
    Airport: "Airport",
    Seaport: "Seaport",
    "Land Port": "Land Port",
    Railway: "Railway",
  },
  portCityLabels: {},
  portNameLabels: {},
  stayAreaLabels: {},
  texts: {
    stayDaysFallback: "{days} days",
    visaFreeKickerMutual: "Likely eligible · Mutual visa-free",
    visaFreeKickerUnilateral: "Likely eligible · Unilateral visa-free",
    visaFreeHeadline: "You may enter China visa-free for up to {days} days",
    visaFreeSummary:
      "Based on your passport ({country}), you appear to qualify under China’s {policy} policy for short stays of up to {days} days.",
    visaFreeNote:
      "Immigration officers make the final decision at the border. Carry a valid passport and supporting itinerary documents.",
    hainanKicker: "May qualify · Hainan 30-day visa-free",
    hainanHeadline: "You may stay in Hainan visa-free for up to {days} days",
    hainanSummary:
      "From 20 August 2026, {country} ordinary-passport holders may enter through a Hainan open port and stay up to {days} days inside Hainan Province only. This is not nationwide mainland visa-free entry.",
    transitKicker: "May qualify · 240-hour visa-free transit",
    transitHeadline:
      "You may qualify for {hours}-hour ({days}-day) transit without a visa",
    transitSummary:
      "Your passport ({country}) is on China’s 240-hour transit visa-free list. Entering via {port} allows a stay within {area}, subject to transit conditions.",
    nearMissKicker: "Almost · 240-hour transit conditions incomplete",
    nearMissHeadline:
      "Your passport may qualify for 240-hour transit — but not with these details",
    nearMissSummary:
      "{country} is on the 240-hour transit visa-free list, but your current trip details do not fully meet the published conditions.",
    requiredKickerSpecial: "Visa required · Special purpose",
    requiredKicker: "Visa likely required",
    requiredHeadlineSpecial:
      "You will need the correct visa category before travel",
    requiredHeadline: "You will probably need a China visa before travel",
    requiredNoteStandard:
      "Apply at a Chinese embassy, consulate, or authorized visa application center. Processing times vary by country and season.",
    requiredNoteSpecial:
      "Immigration officers make the final decision. Work, study, and journalism still need a visa in advance.",
    incompleteDetails:
      "Incomplete trip details — please complete all fields and try again.",
    specialPurposeSummary:
      "Your purpose ({purpose}) generally requires a dedicated China visa and is not covered by short-stay visa-free or transit policies.",
    overstaySummary:
      "Your passport may qualify for {days}-day visa-free entry, but your planned stay ({stay}) exceeds that limit. Apply for a visa for longer trips.",
    twoPathsSummary:
      "From 20 August 2026, {country} ordinary-passport holders have two visa-free paths: (1) 240-hour transit with a confirmed onward ticket to a third country through a designated port, or (2) up to 30 days in Hainan Province only after entering through a Hainan open port. A mainland round-trip holiday that starts and ends at home still needs a visa.",
    twoPathsKicker:
      "Two visa-free paths · mainland holiday still needs a visa",
    twoPathsHeadline:
      "240-hour transit and Hainan 30-day stay — not nationwide visa-free",
    standaloneSummary:
      "For a standalone {purpose} to China (no third-country transit), {country} passport holders typically need a China visa before travel. 240-hour transit is a separate path only when you have a confirmed onward ticket to a third country.",
    standaloneKicker:
      "240-hour transit possible · mainland holiday needs a visa",
    standaloneHeadline:
      "A mainland holiday still needs a visa — 240-hour transit is a separate path",
    noMatchSummary:
      "We did not find a short-stay visa-free or 240-hour transit match for {country} with your trip details. Plan to apply for a China visa before travel.",
    ctaVisaFree: "Read visa-free arrival guide",
    ctaOfficial: "Official sources",
    ctaHainan: "Read Hainan stay notes",
    ctaTransit: "Read transit visa-free guide",
    ctaSeeTransit: "See how transit visa-free works",
    ctaBrowseGuides: "Browse visa application guides",
    hainanPolicyType: "Hainan 30-day visa-free (island only)",
    portLabelFallback: "—",
  },
  lists: {
    visaFreeChecklist: [
      "Passport valid for at least the length of your stay (policy max: {days} days)",
      "Purpose of visit should match permitted short-stay activities",
      "Round-trip or onward ticket may be requested",
      "Hotel / police registration within 24 hours if required",
      "Do not overstay — extensions are generally not available under visa-free entry",
    ],
    hainanChecklist: [
      "Hold an ordinary passport",
      "Enter through a Hainan open port — you selected {port}",
      "Remain inside Hainan Province for the whole stay",
      "Leave within {days} days",
      "Tourism, business, family visits, and similar short activities only — work, study, and journalism still need a visa in advance",
    ],
    transitChecklist: [
      "Confirmed onward ticket to a third country or region (not returning to the same origin)",
      "Enter through an eligible port — you selected {port}",
      "Remain within the allowed stay area: {area}",
      "Leave within {hours} hours ({days} days)",
      "Do not treat transit as a substitute for a tourist visa if your trip is a round-trip holiday",
    ],
    nearMissChecklist: [
      "Confirm an onward ticket to a different third country/region",
      "Choose an eligible 240-hour transit port of entry",
      "Keep your stay within 10 days (240 hours)",
      "Stay only within the allowed regional area for that port",
      "If you cannot meet transit rules, apply for a tourist visa instead",
    ],
    nearMissConditions: [
      "Confirmed onward ticket to a third country/region (not a same-country return)",
      "Stay within {days} days ({hours} hours)",
      "Enter through an eligible 240-hour transit port",
    ],
    requiredChecklistSpecial: [
      "Confirm the correct visa type (e.g. Z work, X study, J journalism)",
      "Gather invitation letters and supporting documents early",
      "Do not travel on a tourist (L) visa for work or long study",
      "Check biometrics / interview requirements for your country",
      "Avoid non-refundable tickets until the visa is issued",
    ],
    requiredChecklistStandard: [
      "Typical tourist visa is category L; business is often M",
      "Prepare passport, photo, itinerary, and invitations if needed",
      "Apply several weeks before departure",
      "Some nationalities use visa centers or online pre-applications",
      "Confirm entry requirements with your airline before check-in",
    ],
    twoPathsChecklist: [
      "Hainan 30-day stay: enter through Haikou, Sanya, or another Hainan open port and remain on the island",
      "240-hour transit: confirmed onward ticket to a third country through a designated port",
      "A mainland round-trip holiday that starts and ends at home still needs a visa",
      "Tourism, business, visits, and family stays only — work, study, and journalism need a visa in advance",
      "Ordinary passport required",
    ],
    standaloneChecklist: [
      "Confirmed onward ticket to a third country or region (not a same-country return)",
      "Enter through an eligible 240-hour port",
      "Stay within 240 hours and inside the allowed region for that port",
      "A standalone holiday that starts and ends at home still needs a tourist visa",
      "Confirm entry requirements with your airline before check-in",
    ],
  },
};

export const zhCopy: VisaCopy = {
  purposeLabels: {
    tourism: "旅游",
    business: "商务",
    family_visit: "探亲访友",
    exchange: "交流 / 短期访问",
    transit: "过境",
    study: "留学",
    work: "工作",
    journalism: "记者",
    other: "其他 / 不确定",
  },
  transitLabels: {
    no_transit: "不过境",
    third_country_confirmed: "持确认的续程机票前往第三国或第三地区",
    same_country_return: "返回同一个国家或地区",
    not_sure: "还没确定",
  },
  stayLabels: {
    "3": "1–3 天",
    "10": "4–10 天",
    "30": "11–30 天",
    "31": "超过 30 天",
  },
  policyTypeLabels: {
    "Unilateral visa-free": "单方面免签",
    "Mutual visa-free": "互免签证",
  },
  requirementLabels: {
    "Must transit to a third country or region with a confirmed onward ticket":
      "须持确认的续程机票前往第三国或第三地区",
    "Enter through a Hainan open port and remain inside Hainan Province":
      "须经海南开放口岸入境，并在海南省境内停留",
  },
  portTypeLabels: {
    Airport: "机场口岸",
    Seaport: "港口客运码头",
    "Land Port": "陆路口岸",
    Railway: "铁路口岸",
  },
  portCityLabels: {
    Beijing: "北京",
    Tianjin: "天津",
    Shijiazhuang: "石家庄",
    Qinhuangdao: "秦皇岛",
    Shenyang: "沈阳",
    Dalian: "大连",
    Shanghai: "上海",
    Nanjing: "南京",
    Wuxi: "无锡",
    "Yangzhou / Taizhou": "扬州 / 泰州",
    Lianyungang: "连云港",
    Hangzhou: "杭州",
    Ningbo: "宁波",
    Wenzhou: "温州",
    Yiwu: "义乌",
    Zhoushan: "舟山",
    Hefei: "合肥",
    Huangshan: "黄山",
    Fuzhou: "福州",
    Xiamen: "厦门",
    Quanzhou: "泉州",
    Wuyishan: "武夷山",
    Jinan: "济南",
    Qingdao: "青岛",
    Yantai: "烟台",
    Weihai: "威海",
    Zhengzhou: "郑州",
    Wuhan: "武汉",
    Changsha: "长沙",
    Zhangjiajie: "张家界",
    Guangzhou: "广州",
    Shenzhen: "深圳",
    Jieyang: "揭阳",
    Zhongshan: "中山",
    "Zhuhai / Hengqin": "珠海 / 横琴",
    Zhuhai: "珠海",
    "Guangzhou-Shenzhen-Hong Kong Express Rail Link": "广深港高铁",
    Haikou: "海口",
    Sanya: "三亚",
    Chongqing: "重庆",
    Guiyang: "贵阳",
    "Xi'an": "西安",
    Taiyuan: "太原",
    Harbin: "哈尔滨",
    Nanchang: "南昌",
    Nanning: "南宁",
    Guilin: "桂林",
    Beihai: "北海",
    Chengdu: "成都",
    Kunming: "昆明",
    Lijiang: "丽江",
    "Xishuangbanna / Mohan": "西双版纳 / 磨憨",
  },
  portNameLabels: {
    "Beijing Capital International Airport Port": "北京首都国际机场口岸",
    "Beijing Daxing International Airport Port": "北京大兴国际机场口岸",
    "Tianjin Binhai International Airport Port": "天津滨海国际机场口岸",
    "Tianjin Dongjiang Port Passenger Terminal": "天津东疆港客运码头",
    "Shijiazhuang Zhengding International Airport Port": "石家庄正定国际机场口岸",
    "Qinhuangdao Seaport Passenger Terminal": "秦皇岛港客运码头",
    "Shenyang Taoxian International Airport Port": "沈阳桃仙国际机场口岸",
    "Dalian Zhoushuizi International Airport Port": "大连周水子国际机场口岸",
    "Dalian Seaport Passenger Terminal": "大连港客运码头",
    "Shanghai Hongqiao International Airport Port": "上海虹桥国际机场口岸",
    "Shanghai Pudong International Airport Port": "上海浦东国际机场口岸",
    "Shanghai Seaport Passenger Terminal": "上海港客运码头",
    "Nanjing Lukou International Airport Port": "南京禄口国际机场口岸",
    "Sunan Shuofang International Airport Port": "苏南硕放国际机场口岸",
    "Yangzhou Taizhou International Airport Port": "扬州泰州国际机场口岸",
    "Lianyungang Seaport Passenger Terminal": "连云港港客运码头",
    "Hangzhou Xiaoshan International Airport Port": "杭州萧山国际机场口岸",
    "Ningbo Lishe International Airport Port": "宁波栎社国际机场口岸",
    "Wenzhou Longwan International Airport Port": "温州龙湾国际机场口岸",
    "Yiwu Airport Port": "义乌机场口岸",
    "Wenzhou Seaport Passenger Terminal": "温州港客运码头",
    "Zhoushan Seaport Passenger Terminal": "舟山港客运码头",
    "Hefei Xinqiao International Airport Port": "合肥新桥国际机场口岸",
    "Huangshan Tunxi International Airport Port": "黄山屯溪国际机场口岸",
    "Fuzhou Changle International Airport Port": "福州长乐国际机场口岸",
    "Xiamen Gaoqi International Airport Port": "厦门高崎国际机场口岸",
    "Quanzhou Jinjiang International Airport Port": "泉州晋江国际机场口岸",
    "Wuyishan Airport Port": "武夷山机场口岸",
    "Xiamen Seaport Passenger Terminal": "厦门港客运码头",
    "Jinan Yaoqiang International Airport Port": "济南遥墙国际机场口岸",
    "Qingdao Jiaodong International Airport Port": "青岛胶东国际机场口岸",
    "Yantai Penglai International Airport Port": "烟台蓬莱国际机场口岸",
    "Weihai Dashuibo International Airport Port": "威海大水泊国际机场口岸",
    "Qingdao Seaport Passenger Terminal": "青岛港客运码头",
    "Zhengzhou Xinzheng International Airport Port": "郑州新郑国际机场口岸",
    "Wuhan Tianhe International Airport Port": "武汉天河国际机场口岸",
    "Changsha Huanghua International Airport Port": "长沙黄花国际机场口岸",
    "Zhangjiajie Hehua International Airport Port": "张家界荷花国际机场口岸",
    "Guangzhou Baiyun International Airport Port": "广州白云国际机场口岸",
    "Shenzhen Bao'an International Airport Port": "深圳宝安国际机场口岸",
    "Jieyang Chaoshan International Airport Port": "揭阳潮汕国际机场口岸",
    "Nansha Seaport Passenger Terminal": "南沙港客运码头",
    "Shekou Seaport Passenger Terminal": "蛇口港客运码头",
    "Guangzhou Port Pazhou Hong Kong-Macao Passenger Terminal":
      "广州港琶洲港澳客运码头",
    "Zhongshan Port Passenger Terminal": "中山港客运码头",
    "Hengqin Port": "横琴口岸",
    "Hong Kong-Zhuhai-Macao Bridge Zhuhai Highway Port":
      "港珠澳大桥珠海公路口岸",
    "West Kowloon Station Port": "西九龙站口岸",
    "Haikou Meilan International Airport Port": "海口美兰国际机场口岸",
    "Sanya Phoenix International Airport Port": "三亚凤凰国际机场口岸",
    "Chongqing Jiangbei International Airport Port": "重庆江北国际机场口岸",
    "Guiyang Longdongbao International Airport Port": "贵阳龙洞堡国际机场口岸",
    "Xi'an Xianyang International Airport Port": "西安咸阳国际机场口岸",
    "Taiyuan Wusu International Airport Port": "太原武宿国际机场口岸",
    "Harbin Taiping International Airport Port": "哈尔滨太平国际机场口岸",
    "Nanchang Changbei International Airport Port": "南昌昌北国际机场口岸",
    "Nanning Wuxu International Airport Port": "南宁吴圩国际机场口岸",
    "Guilin Liangjiang International Airport Port": "桂林两江国际机场口岸",
    "Beihai Fucheng Airport Port": "北海福成机场口岸",
    "Beihai Seaport Passenger Terminal": "北海港客运码头",
    "Chengdu Shuangliu International Airport Port": "成都双流国际机场口岸",
    "Chengdu Tianfu International Airport Port": "成都天府国际机场口岸",
    "Kunming Changshui International Airport Port": "昆明长水国际机场口岸",
    "Lijiang Sanyi International Airport Port": "丽江三义国际机场口岸",
    "Mohan Railway Port": "磨憨铁路口岸",
  },
  stayAreaLabels: {
    "Beijing Municipality": "北京市",
    "Tianjin Municipality": "天津市",
    "Hebei Province": "河北省",
    "Liaoning Province": "辽宁省",
    "Shanghai Municipality": "上海市",
    "Jiangsu Province": "江苏省",
    "Zhejiang Province": "浙江省",
    "Anhui Province": "安徽省",
    "Fujian Province": "福建省",
    "Shandong Province": "山东省",
    "Henan Province": "河南省",
    "Hubei Province": "湖北省",
    "Hunan Province": "湖南省",
    "Guangdong Province; exit allowed from any open port in Guangdong":
      "广东省（可从广东省任一开放口岸离境）",
    "Hainan Province": "海南省",
    "Chongqing Municipality": "重庆市",
    "Guizhou Province": "贵州省",
    "Shaanxi Province": "陕西省",
    "Taiyuan City; Datong City": "太原市；大同市",
    "Harbin City": "哈尔滨市",
    "Nanchang City; Jingdezhen City": "南昌市；景德镇市",
    "Nanning; Liuzhou; Guilin; Wuzhou; Beihai; Fangchenggang; Qinzhou; Guigang; Yulin; Hezhou; Hechi; Laibin":
      "南宁；柳州；桂林；梧州；北海；防城港；钦州；贵港；玉林；贺州；河池；来宾",
    "Chengdu; Zigong; Luzhou; Deyang; Suining; Neijiang; Leshan; Yibin; Ya'an; Meishan; Ziyang":
      "成都；自贡；泸州；德阳；遂宁；内江；乐山；宜宾；雅安；眉山；资阳",
    "Kunming; Yuxi; Chuxiong; Honghe; Wenshan; Pu'er; Xishuangbanna; Dali; Lijiang":
      "昆明；玉溪；楚雄；红河；文山；普洱；西双版纳；大理；丽江",
  },
  texts: {
    stayDaysFallback: "{days} 天",
    visaFreeKickerMutual: "很可能符合 · 互免签证",
    visaFreeKickerUnilateral: "很可能符合 · 单方面免签",
    visaFreeHeadline: "你可能可以免签入境中国，停留最长 {days} 天",
    visaFreeSummary:
      "根据你的护照（{country}），你似乎符合中国的{policy}政策，适用最长 {days} 天的短期停留。",
    visaFreeNote:
      "最终是否准入由口岸移民官决定。请携带有效护照和行程证明文件。",
    hainanKicker: "可能符合 · 海南 30 天免签",
    hainanHeadline: "你可能在海南免签停留最长 {days} 天",
    hainanSummary:
      "自 2026 年 8 月 20 日起，持有 {country} 普通护照者可经海南开放口岸入境，在海南省境内停留最长 {days} 天。这不是全国范围的内地免签入境。",
    transitKicker: "可能符合 · 240 小时免签过境",
    transitHeadline: "你可能符合 {hours} 小时（{days} 天）免签过境",
    transitSummary:
      "你的护照（{country}）在中国的 240 小时免签过境名单上。经 {port} 入境，可在 {area} 范围内停留，但仍须满足过境条件。",
    nearMissKicker: "接近符合 · 240 小时过境条件尚未满足",
    nearMissHeadline: "你的护照可能符合 240 小时过境政策——但目前的行程信息还不满足要求",
    nearMissSummary:
      "{country} 在中国的 240 小时免签过境名单上，但你当前填写的行程信息尚未完全满足已公布的条件。",
    requiredKickerSpecial: "需要签证 · 特殊目的",
    requiredKicker: "大概率需要签证",
    requiredHeadlineSpecial: "出发前你需要申请对应类别的签证",
    requiredHeadline: "出发前你大概率需要办理中国签证",
    requiredNoteStandard:
      "请在中国使领馆或授权签证申请中心递交申请。审理时间因国家和季节而异。",
    requiredNoteSpecial:
      "最终由口岸移民官决定。工作、学习和记者类目仍需提前办理签证。",
    incompleteDetails: "行程信息不完整——请补全所有字段后重试。",
    specialPurposeSummary:
      "你的出行目的（{purpose}）通常需要专门类别的签证，短期免签或过境免签政策并不适用。",
    overstaySummary:
      "你的护照可能符合 {days} 天免签入境政策，但你计划的停留时长（{stay}）超过该上限。行程较长的话请申请签证。",
    twoPathsSummary:
      "自 2026 年 8 月 20 日起，持有 {country} 普通护照者有两条免签路径：(1) 持确认的续程机票，经指定口岸过境 240 小时；或 (2) 经海南开放口岸入境，仅在海南省境内停留最多 30 天。始于本国、终于本国的内地往返度假仍然需要签证。",
    twoPathsKicker: "两条免签路径 · 内地度假仍需签证",
    twoPathsHeadline: "240 小时过境与海南 30 天停留——不等于全国免签",
    standaloneSummary:
      "如果只是单程赴中国旅行（不经第三国过境），{country} 护照持有人通常需要在出发前办理中国签证。240 小时过境是另一条路径，仅适用于持确认的续程机票前往第三国的情况。",
    standaloneKicker: "可尝试 240 小时过境 · 内地度假仍需签证",
    standaloneHeadline: "内地度假仍需签证——240 小时过境是另一条路径",
    noMatchSummary:
      "根据你填写的行程信息，我们没有为 {country} 找到对应的短期免签或 240 小时过境方案。请计划在出发前申请中国签证。",
    ctaVisaFree: "阅读免签入境指南",
    ctaOfficial: "官方信息源",
    ctaHainan: "阅读海南停留说明",
    ctaTransit: "阅读过境免签指南",
    ctaSeeTransit: "了解过境免签如何运作",
    ctaBrowseGuides: "浏览签证申请指南",
    hainanPolicyType: "海南 30 天免签（仅限海南岛）",
    portLabelFallback: "—",
  },
  lists: {
    visaFreeChecklist: [
      "护照有效期至少覆盖整个停留期（政策上限：{days} 天）",
      "出行目的应符合短期停留允许的活动范围",
      "可能会被要求出示往返或续程机票",
      "如被要求，需在 24 小时内完成酒店或派出所登记",
      "不要逾期停留——免签入境通常无法办理延期",
    ],
    hainanChecklist: [
      "持普通护照",
      "经海南开放口岸入境——你选择的是{port}",
      "整个停留期间都不得离开海南省",
      "在 {days} 天内离境",
      "仅限旅游、商务、探亲等短期活动——工作、学习和记者类目仍需提前办理签证",
    ],
    transitChecklist: [
      "持确认的续程机票前往第三国或第三地区（不能返回原出发国）",
      "经符合条件的口岸入境——你选择的是{port}",
      "停留在允许停留区域内：{area}",
      "在 {hours} 小时（{days} 天）内离境",
      "如果你的行程是往返度假，不要把过境当作旅游签证的替代方案",
    ],
    nearMissChecklist: [
      "确认前往另一个第三国或第三地区的续程机票",
      "选择符合 240 小时过境政策的入境口岸",
      "把停留时间控制在 10 天（240 小时）以内",
      "只在该口岸允许的区域范围内活动",
      "如果无法满足过境条件，请改为申请旅游签证",
    ],
    nearMissConditions: [
      "持确认的续程机票前往第三国或第三地区（不能从原国家返回）",
      "停留不超过 {days} 天（{hours} 小时）",
      "经符合 240 小时过境政策的口岸入境",
    ],
    requiredChecklistSpecial: [
      "确认正确的签证类型（例如 Z 字工作、X 字留学、J 字记者）",
      "尽早准备邀请函和证明材料",
      "不要用旅游签证（L 字）从事工作或长期学习",
      "确认你所在国家的生物信息采集与面谈要求",
      "签证签发前不要购买不可退款的机票",
    ],
    requiredChecklistStandard: [
      "常见的旅游签证是 L 字，商务多数是 M 字",
      "准备护照、照片、行程单，必要时准备邀请函",
      "提前数周递交申请",
      "部分国家的申请人需要通过签证中心或线上预申请",
      "值机前与航空公司确认入境材料要求",
    ],
    twoPathsChecklist: [
      "海南 30 天停留：经海口、三亚或其他海南开放口岸入境，并留在岛上",
      "240 小时过境：持确认的续程机票，经指定口岸前往第三国",
      "始于本国、终于本国的内地往返度假仍然需要签证",
      "仅限旅游、商务、访问和探亲——工作、学习和记者类目需提前办理签证",
      "需要持普通护照",
    ],
    standaloneChecklist: [
      "持确认的续程机票前往第三国或第三地区（不能从原国家返回）",
      "经符合 240 小时过境政策的口岸入境",
      "停留不超过 240 小时，并在该口岸允许的区域范围内活动",
      "始于本国、终于本国的单程度假仍然需要旅游签证",
      "值机前与航空公司确认入境材料要求",
    ],
  },
};

const copies: Record<VisaLang, VisaCopy> = { en: enCopy, zh: zhCopy };

export function getVisaCopy(lang: VisaLang): VisaCopy {
  return copies[lang] ?? enCopy;
}

/** English-only aliases kept for backwards compatibility. */
export const PURPOSE_LABELS = enCopy.purposeLabels;
export const TRANSIT_LABELS = enCopy.transitLabels;
export const STAY_LABELS = enCopy.stayLabels;

/** Replace `{token}` placeholders. Unknown tokens are left untouched. */
export function fillTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
