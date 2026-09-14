export type ContentStatus = "draft" | "review" | "published";

export interface ContentFrontmatter {
  title: string;
  metaDescription: string;
  slug: string;
  primaryKeyword: string;
  secondaryKeywords?: string[];
  cluster: string;
  clusterRole: "pillar" | "supporting" | "product";
  pillarPage?: string;
  status: ContentStatus;
}
