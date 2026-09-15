"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { matchSearchItems, type SearchItem } from "@/lib/search-types";

type SiteSearchProps = {
  initialQuery?: string;
  items?: SearchItem[];
  variant?: "header" | "page";
};

export function SiteSearch({ initialQuery = "", items: suppliedItems, variant = "header" }: SiteSearchProps) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [items, setItems] = useState<SearchItem[]>(suppliedItems || []);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const results = matchSearchItems(items, query, variant === "header" ? 6 : undefined);

  async function ensureIndex() {
    if (items.length || loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/search-index");
      if (response.ok) setItems(await response.json() as SearchItem[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selected = results[activeIndex];
    if (selected) router.push(selected.href);
    else if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open || !results.length) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setActiveIndex((current) => Math.min(current + 1, results.length - 1)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActiveIndex((current) => Math.max(current - 1, -1)); }
    if (event.key === "Escape") { setOpen(false); setActiveIndex(-1); }
  }

  return <div className={`site-search site-search-${variant}`} ref={rootRef}>
    <form role="search" onSubmit={submit}>
      <label className="sr-only" htmlFor={`${listId}-input`}>Search travel guides</label>
      <input
        id={`${listId}-input`}
        value={query}
        onChange={(event) => { setQuery(event.target.value); setActiveIndex(-1); setOpen(true); }}
        onFocus={() => { void ensureIndex(); setOpen(true); }}
        onKeyDown={handleKeyDown}
        placeholder="Search places and guides..."
        autoComplete="off"
        role={variant === "header" ? "combobox" : undefined}
        aria-autocomplete={variant === "header" ? "list" : undefined}
        aria-controls={listId}
        aria-expanded={variant === "header" && open}
      />
      <button type="submit" aria-label="Search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg></button>
    </form>
    {variant === "header" && open && query.trim() && <div className="search-suggestions" id={listId} role="listbox">
      {loading ? <p>Searching…</p> : results.length ? <>
        {results.map((item, index) => <Link key={item.id} href={item.href} role="option" aria-selected={activeIndex === index} className={activeIndex === index ? "active" : ""} onMouseEnter={() => setActiveIndex(index)} onClick={() => setOpen(false)}><span>{item.type === "article" ? "Guide" : item.type}</span><b>{item.title}</b></Link>)}
        <Link className="search-all" href={`/search?q=${encodeURIComponent(query.trim())}`} onClick={() => setOpen(false)}>See all search results →</Link>
      </> : <p>No guides found. Try another phrase.</p>}
    </div>}
  </div>;
}
