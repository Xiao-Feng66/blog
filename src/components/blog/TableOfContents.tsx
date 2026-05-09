"use client";

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";

interface TocHeading {
  id: string;
  text: string;
  level: number;
}

function useHeadings(): TocHeading[] {
  const subscribe = useCallback((cb: () => void) => {
    const observer = new MutationObserver(cb);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const getSnapshot = useCallback(() => {
    const article = document.querySelector("article");
    if (!article) return "[]";
    const els = article.querySelectorAll("h2[id], h3[id], h4[id]");
    const items: TocHeading[] = [];
    els.forEach((el) => {
      items.push({
        id: el.id,
        text: el.textContent || "",
        level: parseInt(el.tagName[1]),
      });
    });
    return JSON.stringify(items);
  }, []);

  const data = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  return JSON.parse(data);
}

export function TableOfContents() {
  const headings = useHeadings();
  const [activeId, setActiveId] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();

    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean) as HTMLElement[];

    if (els.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    els.forEach((el) => observerRef.current!.observe(el));
    return () => observerRef.current?.disconnect();
  }, [headings]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
      }
    },
    []
  );

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block absolute right-full mr-10 w-52 top-0 h-full">
      <div className="sticky top-24">
        <p className="text-xs font-medium text-muted dark:text-muted-dark uppercase tracking-wider mb-3">
          目录
        </p>
        <ul className="space-y-1.5 text-[13px] border-l border-border dark:border-border-dark max-h-[calc(100vh-10rem)] overflow-y-auto">
          {headings.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`block transition-colors duration-200 ${
                  item.level === 3
                    ? "pl-6"
                    : item.level === 4
                      ? "pl-9"
                      : "pl-3"
                } py-0.5 -ml-px border-l-2 ${
                  activeId === item.id
                    ? "border-accent text-accent"
                    : "border-transparent text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
