import { brandIdentity, bookingSteps, bookingFaq, operatorFaq, bookingTermCards } from "./booking-terms";
import { licensedOperator } from "./journey-trust";

type Lang = "en" | "zh";

/**
 * Chinese versions of the shared agency / booking copy. English pages keep
 * using the source constants untouched. Wording here must stay consistent
 * with the zh homepage FAQ (payment, cancellation, insurance).
 */

const zhBrand = {
  short: "Hidden China Travel 是云南美珍国际旅行社有限公司的英文服务网站，这是一家位于昆明的持牌旅行社。",
  consultant: "Joy Liu 是你的旅行顾问——从第一次咨询到行程结束，你都直接和 Joy 沟通。",
};

const zhPaymentProduct = `确认书面行程单和旅游合同后，向${licensedOperator.nameZh}的对公账户支付 20% 定金，支持支付宝、微信或银行转账，收款账户名与合同公司一致。随后我们预订酒店、门票和车辆，剩余 80% 在首次接站、行程开始后支付。`;

const zhCancellation = "行程开始前 7 天以上取消，定金可退，但需扣除已预订且无法退回的酒店或门票费用；出发前 7 天以内取消，定金不退。";

const zhContract = `旅游合同与所有付款均与${licensedOperator.nameZh}办理。旅行社业务经营许可证号：${licensedOperator.permitNumber}。`;

const zhInsurance = "旅行社已投保 2026 年度旅行社责任险（中国太平洋财产保险承保，保单号 AKUM0AC10625QAAA1R9T），对其依法应承担的人身伤害责任，每人最高赔付 180 万元人民币，在你的姓名和护照号登记后生效。请自行购买国际医疗与救援保险，此费用不包含在报价内。";

const zhBookingSteps = [
  ["01", "告诉我们你的想法", "发来你的日期、人数，以及你想要怎样的旅行感觉。"],
  ["02", "审阅书面方案", "Joy 会发来行程、费用明细与报价，任何预订发生之前都可以调整。"],
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

export function getBookingTermCards(lang: Lang): readonly (readonly [string, string])[] {
  if (lang !== "zh") return bookingTermCards;
  return [
    ["和谁签约", zhContract],
    ["如何付款", zhPaymentProduct],
    ["如果计划有变", zhCancellation],
    ["保险", zhInsurance],
  ] as const;
}
