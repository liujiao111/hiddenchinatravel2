type PaymentTrustProps = {
  locale?: "en" | "zh";
  compact?: boolean;
};

function MastercardMark() {
  return (
    <span className="payment-brand payment-brand-mastercard" aria-hidden="true">
      <i /><i />
    </span>
  );
}

function WechatMark() {
  return (
    <span className="payment-brand payment-brand-wechat" aria-hidden="true">
      <i /><i />
    </span>
  );
}

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
          <span className="payment-method payment-method-visa" role="listitem" aria-label="Visa"><b>VISA</b></span>
          <span className="payment-method payment-method-mastercard" role="listitem" aria-label="Mastercard"><MastercardMark /><small>mastercard</small></span>
          <span className="payment-method payment-method-apple" role="listitem" aria-label="Apple Pay"><b aria-hidden="true">●</b><span>Pay</span></span>
          <span className="payment-method payment-method-google" role="listitem" aria-label="Google Pay"><b aria-hidden="true"><i>G</i></b><span>Pay</span></span>
          <span className="payment-method payment-method-stripe" role="listitem" aria-label="Stripe"><b>stripe</b></span>
          <span className="payment-method payment-method-alipay" role="listitem" aria-label="Alipay"><b aria-hidden="true">支</b><span>Alipay</span></span>
          <span className="payment-method payment-method-wechat" role="listitem" aria-label="WeChat Pay"><WechatMark /><span>WeChat Pay</span></span>
        </div>
      </div>

      <p className="payment-trust-copy">
        <span>{zh ? "SSL/TLS 加密结账" : "SSL/TLS-encrypted checkout"}</span>
        <span>{zh ? "仅需支付 20% 可退定金" : "Only a 20% refundable deposit"}</span>
        <span>{zh ? "尾款通常抵达云南后支付" : "Balance normally payable on arrival in Yunnan"}</span>
      </p>
      <p className="payment-trust-note">
        {zh
          ? "支持 Stripe（银行卡与数字钱包）、支付宝及微信支付。特殊资源需提前付款时，会在书面方案中说明。"
          : "Pay through Stripe (cards and wallets), Alipay or WeChat Pay. Any itinerary requiring earlier final payment is disclosed in your written proposal."}
      </p>
    </aside>
  );
}
