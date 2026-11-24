import Image from "next/image";
import type { ExperienceMedia } from "@/lib/experiences";
import type { AppLocale } from "@/lib/i18n-seo";
export function Media({ media, lang, sizes = "(max-width: 680px) 100vw, 33vw", fit = "cover" }: { media: ExperienceMedia; lang: AppLocale; sizes?: string; fit?: "cover" | "contain" }) {
  return media.src ? <Image src={media.src} alt={media.alt[lang]} fill sizes={sizes} style={{objectFit:fit}} /> : <div className="absolute inset-0 flex items-center justify-center p-4 text-center" style={{background:"var(--color-surface-soft)",color:"var(--color-muted)"}}>{lang==="zh"?"图片预留":"Image placeholder"} · {media.alt[lang]}</div>;
}
