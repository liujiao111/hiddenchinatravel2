import Image from "next/image";
import type { ReactNode } from "react";

export type CatalogProductCardProps = {
  image?: string;
  imageAlt?: string;
  meta?: ReactNode;
  title: string;
  description?: ReactNode;
  price?: ReactNode;
  action?: ReactNode;
};

/** Standard commerce catalogue card: image above readable content and full-width purchase action.
 *  Pricing and booking logic belong to the caller; this component only renders them.
 */
export function CatalogProductCard({image,imageAlt="",meta,title,description,price,action}:CatalogProductCardProps) {
  return <article className="catalog-product">
    {image ? <div className="catalog-product-photo"><Image src={image} alt={imageAlt} fill sizes="(max-width:590px) 100vw, (max-width:900px) 50vw, 33vw" /></div> : null}
    <div className="catalog-product-copy">
      {meta ? <p className="catalog-product-meta">{meta}</p> : null}
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {price}
      {action}
    </div>
  </article>;
}
