import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/article-page";
import { HubPage } from "@/components/hub-page";
import { absoluteUrl, getAllContent, getContentBySlug } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllContent().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getContentBySlug(slug);
  if (!item) return {};
  const { frontmatter } = item;
  const description = frontmatter.excerpt || frontmatter.metaDescription || frontmatter.description;
  const image = frontmatter.ogImage?.url || frontmatter.coverImage;
  return {
    title: frontmatter.seoTitle || frontmatter.title,
    description,
    keywords: frontmatter.keywords,
    alternates: { canonical: absoluteUrl(frontmatter.canonical, slug) },
    openGraph: {
      type: item.kind === "article" ? "article" : "website",
      title: frontmatter.seoTitle || frontmatter.title,
      description,
      url: absoluteUrl(frontmatter.canonical, slug),
      images: image ? [{ url: absoluteUrl(image) }] : undefined,
      publishedTime: item.kind === "article" ? frontmatter.date : undefined,
      modifiedTime: item.kind === "article" ? frontmatter.dateModified : undefined,
    },
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const item = getContentBySlug(slug);
  if (!item) notFound();
  return item.kind === "hub" ? <HubPage item={item} /> : <ArticlePage item={item} />;
}
