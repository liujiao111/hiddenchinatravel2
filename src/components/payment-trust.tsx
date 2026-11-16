type PaymentTrustProps = {
  locale?: "en" | "zh";
  compact?: boolean;
};

export function PaymentTrust({ locale = "en", compact = false }: PaymentTrustProps) {
  const zh = locale === "zh";

  return (
    <aside className={`payment-trust${compact ? " payment-trust-compact" : ""}`} aria-label={zh ? "支持的安全付款方式" : "Secure payment methods"}>
      <div className="payment-trust-heading">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5.5 8V6a4.5 4.5 0 0 1 9 0v2m-10 0h11a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm5.5 3.1v3" />
        </svg>
        <span>{zh ? "预订时可安全支付" : "Secure ways to pay when you book"}</span>
      </div>

      <div className="payment-trust-scroll">
        <div className="payment-trust-methods" role="list">
          <span className="payment-method payment-method-visa" role="listitem">Visa</span>
          <span className="payment-method payment-method-mastercard" role="listitem">Mastercard</span>
          <span className="payment-method payment-method-apple" role="listitem">Apple Pay</span>
          <span className="payment-method payment-method-google" role="listitem">Google Pay</span>
          <span className="payment-method payment-method-stripe" role="listitem"><small>{zh ? "由" : "Processed by"}</small> Stripe</span>
          <span className="payment-method payment-method-alipay" role="listitem">Alipay</span>
          <span className="payment-method payment-method-wechat" role="listitem">WeChat Pay</span>
        </div>
      </div>

      <p className="payment-trust-copy">
        <span>{zh ? "SSL/TLS 加密结账" : "SSL/TLS-encrypted checkout"}</span>
        <span>{zh ? "20% 定金 · 出发前超过 7 个完整自然日取消可全额退回" : "20% deposit · fully refundable more than 7 full days before departure"}</span>
        <span>{zh ? "尾款通常抵达昆明并与向导会合后支付" : "Balance normally payable after arrival in Kunming"}</span>
      </p>
      <p className="payment-trust-note">
        {zh
          ? "支持 Stripe（银行卡与数字钱包）、支付宝及微信支付。特殊资源需提前付款时，会在书面方案中说明。"
          : "Pay through Stripe (cards and wallets), Alipay or WeChat Pay. Any itinerary requiring earlier final payment is disclosed in your written proposal."}
      </p>
    </aside>
  );
}
