import Image from "next/image";
import { LocaleLink as Link } from "@/components/locale-link";

type PaymentTrustProps = {
  locale?: "en" | "zh";
  compact?: boolean;
};

const paymentMethods = [
  { name: "Visa", icon: "visa" },
  { name: "Mastercard", icon: "mastercard" },
  { name: "Apple Pay", icon: "apple-pay" },
  { name: "Google Pay", icon: "google-pay" },
  { name: "Alipay", icon: "alipay" },
  { name: "WeChat Pay", icon: "wechat-pay" },
] as const;

export function PaymentTrust({ locale = "en", compact = false }: PaymentTrustProps) {
  const zh = locale === "zh";

  return (
    <aside className={`payment-trust${compact ? " payment-trust-compact" : ""}`} aria-label={zh ? "支持的付款方式" : "Accepted payment methods"}>
      <div className="payment-trust-heading">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5.5 8V6a4.5 4.5 0 0 1 9 0v2m-10 0h11a1 1 0 0 1 1 1v7.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm5.5 3.1v3" />
        </svg>
        <span>{zh ? "支持的付款方式" : "Ways to pay when you book"}</span>
      </div>
      <div className="payment-trust-methods" role="list">
        {paymentMethods.map(({ name, icon }) => (
          <span key={icon} className="payment-method" role="listitem">
            <Image src={`/assets/payment-icons/${icon}.svg`} alt={name} width={120} height={80} unoptimized />
          </span>
        ))}
      </div>
      <div className="payment-trust-details">
        <span>{zh ? "20% 定金确认预订" : "20% deposit to confirm"}</span>
        <span className="payment-trust-provider">
          {zh ? "银行卡及数字钱包经由" : "Cards & wallets processed by"}
          <Image src="/assets/payment-icons/stripe.svg" alt="Stripe" width={120} height={80} unoptimized />
        </span>
      </div>
      <p className="payment-trust-note">
        {zh ? "具体可用方式以付款通知为准。" : "Available options are confirmed on your payment request."}{" "}
        <Link href="/booking">{zh ? "查看付款与退款政策" : "Payment & refund policy"}</Link>
      </p>
    </aside>
  );
}
