/**
 * Localised content for the China Trip Checklist (/survival-kit).
 *
 * House pattern (see src/lib/journey-trust-i18n.ts and
 * src/lib/booking-terms-i18n.ts): a complete English base plus a complete
 * Simplified Chinese variant, selected by `lang`.
 */
export type Lang = "en" | "zh";

export type KitAction = {
  label: string;
  href: string;
  affiliate?: boolean;
};

export type KitStep = {
  number: string;
  id: string;
  title: string;
  why: string;
  task: string;
  guide: KitAction;
  options?: { name: string; detail: string; action: KitAction }[];
};

export type KitStage = {
  id: string;
  label: string;
  intro: string;
  steps: KitStep[];
};

export type KitConnectionOption = {
  name: string;
  logo: string | null;
  detail: string;
  action: KitAction;
};

export type KitContent = {
  stages: KitStage[];
  connectionOptions: { esim: KitConnectionOption[]; vpn: KitConnectionOption[] };
  faqs: { question: string; answer: string }[];
  checklist: string[];
};

const enContent: KitContent = {
  stages: [
    {
      id: "decide",
      label: "01 · Confirm the trip",
      intro: "Sort the decisions that affect what you can book.",
      steps: [
        {
          number: "01",
          id: "entry",
          title: "Check your entry route",
          why: "Rules depend on your passport, purpose and itinerary. Confirm the current terms with the relevant Chinese embassy or consulate before buying nonrefundable travel.",
          task: "Check visa-free, visa and transit options for your passport.",
          guide: { label: "Read the visa guide", href: "/do-i-need-a-visa-for-china" },
        },
        {
          number: "02",
          id: "route",
          title: "Choose your pace and route",
          why: "Decide how many places you can enjoy without spending the trip in transit. Start with a realistic route, then book around it.",
          task: "Sketch the cities and number of nights; keep room for arrival and travel days.",
          guide: { label: "How to plan a China itinerary", href: "/how-to-plan-china-itinerary" },
        },
      ],
    },
    {
      id: "book",
      label: "02 · Reserve the essentials",
      intro: "Book the parts with limited availability or high stakes for arrival.",
      steps: [
        {
          number: "03",
          id: "hotel",
          title: "Secure your first nights",
          why: "Check location, cancellation terms and that the property can register a guest using a foreign passport. Keep the address in Chinese for your arrival.",
          task: "Book your first hotel and save its Chinese name and address.",
          guide: { label: "Hotels for foreign visitors", href: "/hotels-in-china-for-foreigners" },
          options: [
            {
              name: "Hotels on Trip.com",
              detail: "Compare locations and passport guest policies before payment.",
              action: { label: "Search hotels", href: "/go/trip-hotels", affiliate: true },
            },
          ],
        },
        {
          number: "04",
          id: "transport",
          title: "Plan trains and timed entry",
          why: "Train seats and popular sights may sell out. Enter your name and passport number exactly as shown on your travel document.",
          task: "Reserve intercity trains and any attractions that require advance booking.",
          guide: { label: "Train booking guide", href: "/book-china-high-speed-rail-foreigners" },
          options: [
            {
              name: "High-speed trains",
              detail: "Compare departures and check passport details before checkout.",
              action: { label: "Search trains", href: "/go/trip-trains", affiliate: true },
            },
            {
              name: "Attraction tickets",
              detail: "Check the official reservation rules for each sight first.",
              action: { label: "Search tickets", href: "/go/trip-tickets", affiliate: true },
            },
          ],
        },
      ],
    },
    {
      id: "setup",
      label: "03 · Set up your phone",
      intro: "Build a reliable arrival setup while your usual connection and card support are available.",
      steps: [
        {
          number: "05",
          id: "esim",
          title: "Get mobile data for arrival",
          why: "Choose between home roaming and a travel eSIM. Check that your phone supports eSIM, then compare data allowances, validity and coverage. A travel eSIM usually does not include a mainland Chinese phone number.",
          task: "Install your plan before departure and save the activation instructions offline.",
          guide: { label: "Compare the best eSIMs for China", href: "/best-esim-for-china-travel" },
        },
        {
          number: "06",
          id: "vpn",
          title: "Decide if you need a VPN",
          why: "Your connection type matters. If you expect to use local Wi-Fi or a local SIM, read the guide and set up a VPN before you leave. No provider works consistently on every network.",
          task: "If you choose one, install it, sign in and test it at home.",
          guide: { label: "Read Best VPN for China", href: "/best-vpn-for-china" },
        },
        {
          number: "07",
          id: "payment",
          title: "Prepare two ways to pay",
          why: "Set up Alipay with your own passport and card before leaving. WeChat Pay or a little cash can be a useful backup if verification or a transaction fails.",
          task: "Complete verification and try a small payment when practical.",
          guide: { label: "Set up Alipay", href: "/alipay-for-foreigners-china" },
          options: [
            {
              name: "Payment backup",
              detail: "Know the common failure points before you arrive.",
              action: { label: "Read payment troubleshooting", href: "/why-your-payment-fails-in-china" },
            },
          ],
        },
        {
          number: "08",
          id: "maps",
          title: "Save your first destination",
          why: "Install a map app that works well in mainland China. Save the hotel and arrival station in both English and Chinese.",
          task: "Open Amap, search for your hotel and keep a screenshot of the address.",
          guide: { label: "Amap and navigation guide", href: "/google-maps-china-not-working" },
        },
      ],
    },
  ],
  connectionOptions: {
    esim: [
      {
        name: "Airalo",
        logo: "/assets/survival-kit/apps/airalo.svg",
        detail: "Travel data through a dedicated eSIM app. Check the plan that fits your length of stay.",
        action: { label: "VIEW AIRALO PLANS", href: "/go/airalo", affiliate: true },
      },
      {
        name: "Trip.com eSIM",
        logo: "/assets/survival-kit/apps/trip.svg",
        detail: "Compare daily data and validity against your itinerary before checkout.",
        action: { label: "VIEW TRIP.COM ESIMS", href: "/go/trip-esim", affiliate: true },
      },
    ],
    vpn: [
      {
        name: "ExpressVPN",
        logo: "/assets/survival-kit/apps/expressvpn.svg",
        detail: "Compare setup and current availability in our VPN guide.",
        action: { label: "EXPLORE EXPRESSVPN", href: "/go/expressvpn", affiliate: true },
      },
      {
        name: "NordVPN",
        logo: "/assets/survival-kit/apps/nordvpn.svg",
        detail: "A second option to assess for your devices and network.",
        action: { label: "EXPLORE NORDVPN", href: "/go/nordvpn", affiliate: true },
      },
      {
        name: "Astrill VPN",
        logo: null,
        detail: "An additional option to compare. Test any VPN before your trip.",
        action: { label: "EXPLORE ASTRILL", href: "https://www.astrill.com/a/u4ketarjcwd0", affiliate: true },
      },
    ],
  },
  faqs: [
    {
      question: "What should I prepare first for a trip to China?",
      answer: "Check the entry rules for your passport and route first. Then choose a realistic itinerary, book your first nights and essential transport, and set up mobile data, payments and maps before departure.",
    },
    {
      question: "Can I use a travel eSIM instead of a Chinese SIM card?",
      answer: "For many short trips, a compatible travel eSIM can provide data on arrival. It usually does not provide a mainland Chinese phone number, which some local services require for SMS verification. Compare your own roaming plan and eSIM options before buying.",
    },
    {
      question: "Do I need both an eSIM and a VPN for China?",
      answer: "Not always. A travel eSIM or international roaming can behave differently from a local SIM or hotel Wi-Fi. A VPN is a separate choice for some local connections; availability changes by network. Read the VPN guide and test your setup before leaving.",
    },
    {
      question: "Should I set up Alipay before I travel?",
      answer: "Yes. Install Alipay and link your own passport and payment card while you can still access your bank's verification messages. Keep WeChat Pay or some cash as a backup.",
    },
    {
      question: "What should I save offline before arriving?",
      answer: "Save your first hotel's Chinese name and address, booking confirmations, passport and entry document copies, insurance details, and embassy or consulate contacts. Keep sensitive copies in a secure place.",
    },
  ],
  checklist: [
    "Entry rules checked for my passport and route",
    "First nights and key transport booked",
    "Mobile data ready and VPN tested if needed",
    "Alipay set up with a backup payment method",
    "Amap installed and first hotel saved",
    "Passport details match every booking",
    "Insurance, emergency contacts and booking copies saved offline",
  ],
};

const zhContent: KitContent = {
  stages: [
    {
      id: "decide",
      label: "01 · 先确认这趟行程",
      intro: "先把会影响订票的决策理清楚。",
      steps: [
        {
          number: "01",
          id: "entry",
          title: "核对入境路线",
          why: "规则取决于你的护照、出行目的和行程路线。在购买不可退款的机票或门票之前，请向相关中国使领馆确认当前规定。",
          task: "查一查你的护照适用免签、需签还是过境政策。",
          guide: { label: "阅读签证指南", href: "/do-i-need-a-visa-for-china" },
        },
        {
          number: "02",
          id: "route",
          title: "确定节奏和路线",
          why: "先想清楚在不把整趟旅行耗在路上的前提下，你真正能玩几个地方。从一条写得下手的路线开始，再围绕它订行程。",
          task: "列出城市和每地停留的夜数，为抵达日和转场日留出余量。",
          guide: { label: "如何规划中国行程", href: "/how-to-plan-china-itinerary" },
        },
      ],
    },
    {
      id: "book",
      label: "02 · 预订关键项目",
      intro: "优先预订名额紧张、或者出错代价很高的部分。",
      steps: [
        {
          number: "03",
          id: "hotel",
          title: "落实抵达后的头几晚",
          why: "确认位置、取消条款，以及酒店是否能用外国护照为客人登记。把地址的中文版存好，到店时直接给司机看。",
          task: "订好第一晚的酒店，并保存它的中文名称和地址。",
          guide: { label: "外国游客住宿指南", href: "/hotels-in-china-for-foreigners" },
          options: [
            {
              name: "在 Trip.com 订酒店",
              detail: "付款前先比较位置，以及酒店登记外国护照客人的政策。",
              action: { label: "搜索酒店", href: "/go/trip-hotels", affiliate: true },
            },
          ],
        },
        {
          number: "04",
          id: "transport",
          title: "安排火车和限流预约",
          why: "火车票和热门景点都可能售罄。姓名和护照号码必须与旅行证件上的完全一致。",
          task: "预订城际火车，以及需要提前预约的景点门票。",
          guide: { label: "火车票预订指南", href: "/book-china-high-speed-rail-foreigners" },
          options: [
            {
              name: "高铁票",
              detail: "比较不同班次，付款前再核对一遍护照信息。",
              action: { label: "搜索火车票", href: "/go/trip-trains", affiliate: true },
            },
            {
              name: "景点门票",
              detail: "先查清每个景点的官方预约规则。",
              action: { label: "搜索门票", href: "/go/trip-tickets", affiliate: true },
            },
          ],
        },
      ],
    },
    {
      id: "setup",
      label: "03 · 配好你的手机",
      intro: "趁你原有的网络和银行卡还能正常使用时，把抵达后的基本设置搭好。",
      steps: [
        {
          number: "05",
          id: "esim",
          title: "准备好抵达后的移动数据",
          why: "在漫游和旅行 eSIM 之间做选择。先确认手机支持 eSIM，再比较流量额度、有效期和覆盖范围。旅行 eSIM 通常不提供中国大陆手机号。",
          task: "出发前安装好套餐，并把激活说明离线保存一份。",
          guide: { label: "对比中国旅行 eSIM 推荐", href: "/best-esim-for-china-travel" },
        },
        {
          number: "06",
          id: "vpn",
          title: "决定是否需要 VPN",
          why: "你用哪种网络很关键。如果打算用当地 Wi-Fi 或本地 SIM，请先读指南，并在出发前把 VPN 装好。没有哪一家在所有网络上都稳定可用。",
          task: "如果决定使用，提前安装、登录，并在家里测试一遍。",
          guide: { label: "阅读中国 VPN 指南", href: "/best-vpn-for-china" },
        },
        {
          number: "07",
          id: "payment",
          title: "准备两种付款方式",
          why: "出发前用自己的护照和银行卡完成支付宝绑定。如果认证或某笔交易失败，微信支付或少量现金可以应急。",
          task: "完成实名认证，方便的话先试着做一笔小额支付。",
          guide: { label: "开通支付宝", href: "/alipay-for-foreigners-china" },
          options: [
            {
              name: "备用付款方式",
              detail: "出发前先了解最常见的几个失败原因。",
              action: { label: "阅读支付排错指南", href: "/why-your-payment-fails-in-china" },
            },
          ],
        },
        {
          number: "08",
          id: "maps",
          title: "收藏你的第一个目的地",
          why: "安装一款在中国大陆用起来顺手的地图软件。酒店和抵达车站都保存中英文两份。",
          task: "打开高德地图，搜索你的酒店，并把地址截图保存。",
          guide: { label: "高德地图与导航指南", href: "/google-maps-china-not-working" },
        },
      ],
    },
  ],
  connectionOptions: {
    esim: [
      {
        name: "Airalo",
        logo: "/assets/survival-kit/apps/airalo.svg",
        detail: "通过专门的 eSIM 应用购买旅行流量。按你的停留时长挑选合适的套餐。",
        action: { label: "查看 AIRALO 套餐", href: "/go/airalo", affiliate: true },
      },
      {
        name: "Trip.com eSIM",
        logo: "/assets/survival-kit/apps/trip.svg",
        detail: "付款前把每日流量和有效期与你的行程逐项对照。",
        action: { label: "查看 TRIP.COM ESIM", href: "/go/trip-esim", affiliate: true },
      },
    ],
    vpn: [
      {
        name: "ExpressVPN",
        logo: "/assets/survival-kit/apps/expressvpn.svg",
        detail: "在我们的 VPN 指南里对比安装难度和当前可用性。",
        action: { label: "了解 EXPRESSVPN", href: "/go/expressvpn", affiliate: true },
      },
      {
        name: "NordVPN",
        logo: "/assets/survival-kit/apps/nordvpn.svg",
        detail: "可以对照一下它对你的设备和网络的适配情况。",
        action: { label: "了解 NORDVPN", href: "/go/nordvpn", affiliate: true },
      },
      {
        name: "Astrill VPN",
        logo: null,
        detail: "另一个可以一并比较的选项。无论选哪家，出发前都先实测。",
        action: { label: "了解 ASTRILL", href: "https://www.astrill.com/a/u4ketarjcwd0", affiliate: true },
      },
    ],
  },
  faqs: [
    {
      question: "去中国旅行，第一步应该准备什么？",
      answer: "先核对你护照和路线对应的入境规则。然后定一条走得通的行程，订好头几晚的住宿和关键交通，并在出发前把移动数据、支付和地图都准备好。",
    },
    {
      question: "可以用旅行 eSIM 代替中国的实体 SIM 卡吗？",
      answer: "对大多数短途旅行来说，兼容的旅行 eSIM 足以在抵达后提供流量。但它通常不提供中国大陆手机号，而部分本地服务需要手机号接收短信验证码。购买前请对比你自己的漫游套餐和 eSIM 方案。",
    },
    {
      question: "在中国需要同时准备 eSIM 和 VPN 吗？",
      answer: "不一定。旅行 eSIM 或国际漫游的表现，与本地 SIM 或酒店 Wi-Fi 并不相同。VPN 是针对部分本地网络的另一项选择，可用性也会随网络变化。出发前请读 VPN 指南并实测一遍。",
    },
    {
      question: "应该出发前就开通支付宝吗？",
      answer: "应该。在你还能收到银行验证短信的时候，装好支付宝并绑定自己的护照和银行卡。同时保留微信支付或一些现金作为备用。",
    },
    {
      question: "抵达前应该离线保存哪些资料？",
      answer: "保存第一家酒店的中文名称和地址、所有预订确认单、护照与入境证件的复印件、保险信息，以及使领馆联系方式。含敏感信息的副本要放在安全的地方。",
    },
  ],
  checklist: [
    "已核对我护照和路线对应的入境规则",
    "已订好头几晚住宿和关键交通",
    "移动数据已就绪，需要的话 VPN 也已实测",
    "已开通支付宝，并准备了备用付款方式",
    "已安装高德地图并收藏第一家酒店",
    "护照信息与每一笔预订完全一致",
    "保险、紧急联系人和预订凭证已离线保存",
  ],
};

const contents: Record<Lang, KitContent> = { en: enContent, zh: zhContent };

export function getSurvivalKitContent(lang: Lang): KitContent {
  return contents[lang] ?? enContent;
}
