import Image from "next/image";
import Link from "next/link";

export type GuideCardData = {
  title: string;
  excerpt?: string;
  href: string;
  image: string;
  imageAlt?: string;
  readTime?: string;
};

export function GuideCard({ guide }: { guide: GuideCardData }) {
  return <Link href={guide.href} className="guide-card">
    <div className="guide-card-image">
      <Image
        src={guide.image}
        alt={guide.imageAlt || guide.title}
        fill
        unoptimized
        sizes="(max-width: 700px) 92vw, (max-width: 1000px) 45vw, 31vw"
      />
      <div className="guide-card-shade" />
      <h3>{guide.title}</h3>
    </div>
    <div className="guide-card-copy">
      {guide.excerpt ? <p>{guide.excerpt}</p> : null}
      {guide.readTime ? <span>{guide.readTime}</span> : null}
      <div><b>READ THIS GUIDE</b><span aria-hidden="true">↗</span></div>
    </div>
  </Link>;
}
