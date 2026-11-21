"use client";

import { useLocale } from "next-intl";
import { guestReviews } from "@/lib/guest-reviews";
import styles from "./testimonials.module.css";

export function Testimonials({ firstReview }: { firstReview?: string }) {
  const zh = useLocale() === "zh";
  const first = guestReviews.find((review) => review.id === firstReview);
  const ordered = first ? [first, ...guestReviews.filter((review) => review !== first)] : guestReviews;
  const cards = ordered.map((review) => {
    const publicReview = review.source === "Trustpilot";
    return (
      <figure className={styles.card} key={review.id}>
        <figcaption>
          <strong>{review.topic[zh ? 1 : 0]}</strong>
          <span>{zh && review.source === "Email" ? "邮件" : review.source}</span>
          {publicReview && <span aria-label={zh ? "5 星，满分 5 星" : "5 out of 5 stars"}>★★★★★</span>}
        </figcaption>
        <blockquote lang="en">“{review.quote}”</blockquote>
        {zh && <p className={styles.translation}>译文：{review.translation}</p>}
        <a href={review.href} target="_blank" rel="noopener noreferrer">
          {publicReview
            ? (zh ? "在 Trustpilot 查看原评" : "Read on Trustpilot")
            : (zh ? "查看原始截图" : "View original screenshot")}
          <span aria-hidden="true"> ↗</span>
        </a>
      </figure>
    );
  });

  return (
    <section className={`section ${styles.reviews}`} id="stories" aria-labelledby="guest-reviews-heading">
      <div className="shell">
        <h2 id="guest-reviews-heading">{zh ? "旅客怎么说" : "What our travelers say"}</h2>
        <div className={styles.grid}>{cards.slice(0, 2)}</div>
        <details className={styles.more}>
          <summary>
            <span className={styles.collapsed}>{zh ? `查看全部 ${cards.length} 条评价` : `See all ${cards.length} reviews`}</span>
            <span className={styles.expanded}>{zh ? "收起评价" : "Show fewer reviews"}</span>
          </summary>
          <div className={styles.grid}>{cards.slice(2)}</div>
        </details>
      </div>
    </section>
  );
}
