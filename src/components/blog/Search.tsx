"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import FlexSearch from "flexsearch";

interface PostIndex {
  id: string;
  title: string;
  slug: string;
  summary: string;
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostIndex[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const indexRef = useRef<any>(null);
  const postsRef = useRef<PostIndex[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/search")
      .then((r) => r.json())
      .then((posts: PostIndex[]) => {
        postsRef.current = posts;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const index = new (FlexSearch as any).Index({ tokenize: "forward" });
        posts.forEach((post, i) => {
          index.add(i, `${post.title} ${post.summary}`);
        });
        indexRef.current = index;
      });
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!query || !indexRef.current) {
      setResults([]);
      return;
    }
    const ids = indexRef.current.search(query, 10) as number[];
    setResults(ids.map((i) => postsRef.current[i]));
  }, [query]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg text-muted dark:text-muted-dark hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        aria-label="搜索"
      >
        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/40 backdrop-blur-sm animate-fade-in"
          style={{ animationDuration: "0.15s" }}
          onClick={close}
        >
          <div
            className="w-full max-w-lg bg-card dark:bg-card-dark rounded-2xl shadow-2xl border border-border dark:border-border-dark overflow-hidden animate-slide-up"
            style={{ animationDuration: "0.2s" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 border-b border-border dark:border-border-dark">
              <svg className="w-4 h-4 text-muted dark:text-muted-dark shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章..."
                className="flex-1 py-4 bg-transparent outline-none text-sm placeholder:text-muted dark:placeholder:text-muted-dark"
              />
              <kbd className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-muted dark:text-muted-dark border border-border dark:border-border-dark">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {results.length === 0 && query && (
                <p className="px-5 py-8 text-sm text-muted dark:text-muted-dark text-center">无搜索结果</p>
              )}
              {!query && (
                <p className="px-5 py-8 text-sm text-muted dark:text-muted-dark text-center">
                  输入关键词搜索文章
                </p>
              )}
              {results.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  onClick={close}
                  className="block px-5 py-3 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <div className="font-medium text-sm text-stone-800 dark:text-stone-200">{post.title}</div>
                  <div className="text-xs text-muted dark:text-muted-dark line-clamp-1 mt-0.5">{post.summary}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
