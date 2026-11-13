import { brandIdentity, bookingSteps, bookingFaq, operatorFaq, bookingTermCards, contractCopy, paymentCopy, cancellationCopy } from "./booking-terms";
import { licensedOperator } from "./journey-trust";

type Lang = "en" | "zh";

/**
 * Chinese versions of the shared agency / booking copy. English pages keep
 * using the source constants untouched. Wording here must stay consistent
 * with the zh homepage FAQ (payment, cancellation, insurance).
 */

const zhBrand = {
  short: "Hidden China Travel 是 Joy Liu 独立运营的中国入境游品牌，也是云南持证合作旅行社入境游业务的官方海外品牌与线上渠道。",
  consultant: "Joy 负责初步沟通和品牌规划，云南行程由持证旅行社审核报价、签约收款及履约。",
};

const zhPaymentProduct = `确认书面行程单和旅游合同后，向${licensedOperator.nameZh}的对公账户支付 20% 定金，支持支付宝、微信或银行转账，收款账户名与合同公司一致。随后我们预订酒店、门票和车辆，剩余 80% 在首次接站、行程开始后支付。`;

const zhCancellation = "行程开始前 7 天以上取消，定金可退，但需扣除已预订且无法退回的酒店或门票费用；出发前 7 天以内取消按约定保留定金，但不排除适用法律及正式合同规定的退款权利。";

const zhContract = `旅游合同与所有付款均与${licensedOperator.nameZh}办理。旅行社业务经营许可证号：${licensedOperator.permitNumber}。`;

const zhInsurance = "云南行程包含由持证旅行社安排的旅行社责任险；具体承保公司、保障范围及适用条件由经营方在确认预订前说明，并按要求登记旅客姓名及护照信息。旅行社责任险不等于个人旅行医疗或紧急救援保险，建议旅客自行购买相应保障。";

const zhBookingSteps = [
  ["01", "告诉我们你的想法", "发来你的日期、人数，以及你想要怎样的旅行感觉。"],
  ["02", "审阅书面方案", "Joy 协助规划路线，持证云南旅行社确认书面行程、费用明细与报价，预订前可以审阅和调整。"],
  ["03", "确认并支付定金", "与持牌旅行社签订旅游合同，向其对公账户支付 20% 定金。"],
  ["04", "出发，然后付尾款", "定金到账后安排酒店、门票与车辆，剩余 80% 在首次接站后支付。"],
] as const;

export function getBrandIdentity(lang: Lang) {
  return lang === "zh" ? { ...brandIdentity, ...zhBrand } : brandIdentity;
}

export function getBookingSteps(lang: Lang): readonly (readonly [string, string, string])[] {
  return lang === "zh" ? zhBookingSteps : bookingSteps;
}

export function getBookingFaq(lang: Lang) {
  return lang === "zh" ? { question: "付款和取消规则是怎样的？", answer: `${zhPaymentProduct}${zhCancellation}` } : bookingFaq;
}

export function getOperatorFaq(lang: Lang) {
  return lang === "zh" ? { question: "和谁签约预订？", answer: `${zhBrand.short}${zhBrand.consultant}${zhContract}` } : operatorFaq;
}

export function getOperatorPaymentCopy(lang: Lang) {
  if (lang !== "zh") return `${brandIdentity.short} ${contractCopy.full} ${paymentCopy.product} ${cancellationCopy.full}`;
  return `${zhBrand.short}${zhContract}${zhPaymentProduct}${zhCancellation}`;
}

export function getBookingTermCards(lang: Lang): readonly (readonly [string, string])[] {
  if (lang !== "zh") return bookingTermCards;
  return [
    ["和谁签约", zhContract],
    ["如何付款", zhPaymentProduct],
    ["如果计划有变", zhCancellation],
    ["保险", zhInsurance],
  ] as const;
}
