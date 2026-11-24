import type { AppLocale } from "@/lib/i18n-seo";

export type Localized = Record<AppLocale, string>;
export const bilingual = (en: string, zh: string): Localized => ({ en, zh });
export type ExperienceMedia = { src?: string; alt: Localized };
export type ExperienceText = { title: Localized; text: Localized };
export type ExperiencePackage = {
  id: string; name: Localized; minutes?: number; description: Localized;
  price?: { currency: "USD" | "CNY"; min: number; max?: number; confirmed: boolean; currencyPending?: boolean };
  pieces?: { id: string; name: Localized; media?: ExperienceMedia }[];
  media: ExperienceMedia;
};
export type ExperienceProduct = {
  slug: string; title: Localized; shortTitle: Localized; city: Localized; category: Localized;
  description: Localized; closing: ExperienceText; priceNote: Localized; seo: { title: Localized; description: Localized };
  hero: ExperienceMedia; duration: Localized; highlights: ExperienceText[];
  packages: ExperiencePackage[]; process?: (ExperienceText & { media: ExperienceMedia })[];
  story?: ExperienceText & { media: ExperienceMedia }; included: Localized[]; excluded?: Localized[];
  location: ExperienceText; gallery?: ExperienceMedia[]; faqs: ExperienceText[];
  addons?: { id: string; title: Localized; sourcePrice: string; media?: ExperienceMedia }[];
  booking: { mode: "preview"; pricingUnit: "person" | "group" | "piece"; timeSlots: string[]; maxParticipants?: number };
};
const t = bilingual;
const media = (en: string, zh: string): ExperienceMedia => ({ alt: t(en, zh) });
const piece = (id: string, en: string, zh: string) => ({ id, name: t(en, zh), media: media(en, zh) });
export const experiences: ExperienceProduct[] = [{
  slug: "dali-tie-dye-workshop",
  title: t("Traditional Bai Tie-Dye Workshop in Dali", "大理白族扎染体验"),
  shortTitle: t("Bai Tie-Dye Workshop", "白族扎染体验"),
  city: t("Dali", "大理"), category: t("Arts & Crafts", "传统手工艺"),
  description: t("Make your own Bai tie-dye in Dali. Learn traditional indigo dyeing with local instruction, choose a textile to personalise, and take home a piece you made yourself.", "走进大理白族扎染工艺，在当地老师指导下亲手设计纹样、捆扎和染色，从方巾到帆布包，带走自己制作的云南纪念品。"),
  closing: { title:t("Make a Memory of Dali with Your Own Hands","亲手制作属于你的大理旅行纪念品"),text:t("Choose a textile and explore the experience that fits your time in Dali.","选一件喜欢的作品，安排适合你旅行节奏的扎染体验。") },
  priceNote:t("Draft prices are per participant and include one main piece. Signature pricing varies by piece; final item prices, Premium currency and optional add-ons require confirmation.","暂定价格按参与者计，每人含一件主作品。进阶套餐因作品不同而异；具体作品价格、深度套餐币种和增购价格仍待确认。"),
  seo: { title: t("Dali Tie-Dye Workshop | Traditional Bai Craft Experience", "大理白族扎染体验｜非遗手工制作与预约"), description: t("Explore a 45–90 minute Bai tie-dye workshop in Dali, Yunnan. Compare packages, make your own scarf or bag and take home your handmade indigo textile.", "大理白族非遗扎染体验，约45–90分钟。比较不同套餐，亲手制作方巾、帆布包等作品，体验传统靛蓝染色。") },
  hero: media("Guest creating a tie-dye piece in a Dali workshop", "游客在大理作坊制作扎染作品"),
  duration: t("Approx. 45–90 min", "约45–90分钟"),
  highlights: [
    { title: t("A Living Bai Tradition", "白族传统非遗"), text: t("Discover the craft passed down through generations in Dali.", "了解大理代代相传的白族扎染技艺。") },
    { title: t("Create Your Own Pattern", "亲手设计图案"), text: t("Fold, bind and dye your own piece with instructor assistance.", "在老师指导下折叠、捆扎和染制自己的作品。") },
    { title: t("Choose Your Own Piece", "自由选择作品"), text: t("From small scarves to bags and more detailed textiles.", "从方巾、帆布包到更复杂的织物。") },
    { title: t("Take Your Creation Home", "带走亲手制作的纪念品"), text: t("Keep a unique piece of your journey in Yunnan.", "把云南之旅的独特记忆带回家。") },
  ],
  packages: [
    { id:"essential", name:t("Essential Experience","入门体验"), minutes:45, description:t("A short introduction for first-time makers. Choose one main piece; includes instructor assistance, materials, apron, gloves, English step-by-step card and gift bag.","适合首次体验，任选一件主作品，包含老师指导、材料、围裙、手套、英文步骤卡及礼品袋。"), price:{currency:"USD",min:18.8,confirmed:false}, media:media("Essential package finished pieces","入门套餐作品"), pieces:[piece("square-scarf","Square scarf","方巾"),piece("bucket-hat","Bucket hat","渔夫帽"),piece("small-tote","Small canvas tote","小帆布包")] },
    { id:"signature", name:t("Signature Experience","特色进阶体验"), minutes:60, description:t("More time to create, with upgraded material choices and a local tea break. Includes the Essential benefits and one selected main piece.","在入门体验基础上，延长制作时间、升级作品材料，并享用当地茶歇，任选一件主作品。"), price:{currency:"USD",min:25.8,max:28.8,confirmed:false}, media:media("Signature package finished pieces","进阶套餐作品"), pieces:[piece("silk-scarf","Silk scarf","真丝围巾"),piece("cushion","Cushion cover","抱枕套"),piece("doll","Doll","玩偶"),piece("large-tote","Large canvas tote","大帆布包")] },
    { id:"premium", name:t("Premium Experience","深度体验"), minutes:90, description:t("Spend longer on a more detailed textile. Includes Signature benefits, a planned small-group or private setting, illustrated culture booklet, premium tea break and gift packaging.","在特色体验基础上制作更复杂的织物，拟安排小团或私人体验，含文化图册、高级茶歇及礼品包装。"), price:{currency:"CNY",min:32.8,confirmed:false,currencyPending:true}, media:media("Premium package finished pieces","深度套餐作品"), pieces:[piece("long-scarf","Long scarf","长围巾"),piece("complex-tote","Complex canvas tote","复杂帆布包"),piece("skirt","Half-length skirt","半身裙"),piece("tshirt","T-shirt","T恤")] },
    { id:"bespoke", name:t("Bespoke Experience","高级定制体验"), description:t("Table runners, curtains, shirts, dresses and wall hangings. Timing and price depend on the design.","桌旗、门帘、衬衫、连衣裙和墙面挂饰等，时长及价格依设计确认。"), media:media("Bespoke textile pieces","高级定制作品") },
  ],
  process: [
    { title:t("Learn the Techniques","了解技艺"),text:t("Learn how folding, twisting, binding and stitching prevent dye from reaching parts of the cloth, with an English step-by-step card.","借助英文步骤卡了解折叠、扭转、捆扎与缝制如何形成防染纹样。"),media:media("Instructor explaining tie-dye","老师讲解") },
    { title:t("Design Your Pattern","设计图案"),text:t("Choose your pattern and tie the cloth. Tight bindings create clearer white lines; looser ties produce softer edges. Your instructor checks the binding before dyeing.","选择纹样并捆扎布料。紧扎形成更清晰的白色纹路，松扎产生柔和边缘，染色前由老师检查。"),media:media("Binding fabric","捆扎布料") },
    { title:t("Dip into Indigo","浸染靛蓝"),text:t("Soak and dip your piece into the indigo vat. Watch the colour turn blue as it meets the air; repeated dips deepen the shade.","浸泡后放入靛蓝染缸，观察布料接触空气后逐渐变蓝，多次浸染可加深色泽。"),media:media("Indigo dyeing","靛蓝染色") },
    { title:t("Reveal Your Creation","揭开作品"),text:t("Rinse, remove the ties with instructor guidance and reveal your design. Your piece is rinsed again and dried or packed damp before you leave.","漂洗后在老师指导下拆开扎线，揭晓独特纹样。作品再次漂洗，晾干或湿装打包后带走。"),media:media("Revealing a finished pattern","展开成品") },
  ],
  story: { title:t("A Craft Passed Down Through Generations","代代相传的白族手工艺"),text:t("For centuries, Bai families around Erhai Lake have folded, bound and dyed cloth with indigo. Bai tie-dye was added to China's national intangible cultural heritage list in 2006. The workshop is a chance to take part in the craft rather than simply watch a demonstration.","数百年来，洱海周边的白族家庭通过折叠、捆扎和靛蓝染色传承这门技艺。2006年，白族扎染技艺入选中国国家级非物质文化遗产名录。在体验中，你不只是观看，更能亲自参与制作。"),media:media("Traditional Bai tie-dye workshop","白族传统扎染作坊") },
  included:[t("Materials for your selected main piece","所选主作品材料"),t("Instructor assistance","老师现场指导"),t("English step-by-step guide card","英文步骤指引卡"),t("Apron and gloves","围裙和手套"),t("Your finished piece and gift bag","成品及礼品袋")],
  excluded:[t("Additional pieces outside the selected package (subject to final terms)","所选套餐外的额外作品（以最终条款为准）")],
  location:{title:t("Dali, Yunnan","云南大理"),text:t("Workshop address, meeting point, opening hours and arrival instructions to be confirmed.","具体作坊地址、集合点、营业时间和到达说明待确认。")},
  gallery:[media("Workshop setting","作坊环境"),media("Guest making a piece","游客制作"),media("Finished textile","完成的作品")],
  faqs:[
    {title:t("Do I need previous tie-dye experience?","需要扎染经验吗？"),text:t("The proposed basic package includes guided instruction and an English step-by-step card.","拟定的入门套餐包含老师指导和英文步骤卡。")},
    {title:t("Can I take my finished piece home?","可以带走作品吗？"),text:t("Yes. The source plan includes a final rinse and drying or damp packing before you leave.","可以。原方案包含最后漂洗、晾干或湿装打包。")},
    {title:t("Is the instructor English-speaking?","老师会英语吗？"),text:t("An English instruction card is included in the proposed package. Spoken English support still needs confirmation.","拟定套餐包含英文指引卡，老师英语沟通能力仍待确认。")},
    {title:t("Can children join?","儿童可以参加吗？"),text:t("Minimum age, supervision and safety rules are pending workshop confirmation.","最低年龄、陪同和安全规则待作坊确认。")},
    {title:t("Can I cancel or change my booking?","可以取消或改期吗？"),text:t("Final cancellation and rescheduling terms are not yet confirmed. No payment is taken in this preview.","最终取消与改期规则尚未确认；本预览不会收款。")},
  ],
  addons:[{id:"pouch",title:t("Pocket tissue pouch","纸巾收纳袋"),sourcePrice:"¥9.8",media:media("Tissue pouch","纸巾收纳袋")},{id:"hair-ties",title:t("Hair ties ×3","发圈×3"),sourcePrice:"¥12.8",media:media("Hair ties","发圈")}],
  booking:{mode:"preview",pricingUnit:"person",timeSlots:[]},
}];
export const getExperience = (slug: string) => experiences.find(p => p.slug === slug);
export const experiencePath = (slug: string) => "/experiences/" + slug;
export const displayDraftPrice = (pkg: ExperiencePackage, locale: AppLocale) => {
  if (!pkg.price) return locale === "zh" ? "单独询价（待确认）" : "Custom quote (pending)";
  const p = pkg.price;
  if (p.currencyPending) return locale === "zh" ? "价格待确认" : "Price to be confirmed";
  const symbol = p.currency === "USD" ? "US$" : "¥";
  return symbol + p.min.toFixed(2) + (p.max !== undefined ? "–" + p.max.toFixed(2) : "") + (locale === "zh" ? "（暂定）" : " (draft)");
};
