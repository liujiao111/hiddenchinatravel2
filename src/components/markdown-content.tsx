import Image from "next/image";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function headingId(children: ReactNode) {
  return String(children)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const components = {
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => <h2 id={headingId(children)} {...props}>{children}</h2>,
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => <h3 id={headingId(children)} {...props}>{children}</h3>,
  a: ({ href = "", children, ...props }: ComponentPropsWithoutRef<"a">) => {
    if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
  },
  img: ({ src = "", alt = "" }: ComponentPropsWithoutRef<"img">) => (
    <span className="article-image">
      <Image src={String(src)} alt={alt} fill unoptimized sizes="(max-width: 900px) 100vw, 760px" />
    </span>
  ),
  table: ({ children }: ComponentPropsWithoutRef<"table">) => <div className="article-table"><table>{children}</table></div>,
};

export function MarkdownContent({ children, compact = false }: { children: string; compact?: boolean }) {
  return <div className={compact ? "markdown-content compact" : "markdown-content"}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{children}</ReactMarkdown>
  </div>;
}
