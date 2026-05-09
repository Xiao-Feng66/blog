"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import FlexSearch from "flexsearch";
import { formatDate } from "@/lib/formatDate";

interface TagInfo {
  name: string;
  slug: string;
}

interface PostIndex {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  createdAt: string;
  tags: TagInfo[];
}

interface SearchResult extends PostIndex {
  snippet: string;
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-accent/20 text-accent-dark dark:text-accent-light rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function extractSnippet(content: string, query: string, maxLen = 120): string {
  const lower = content.toLowerCase();
  const qLower = query.toLowerCase();
  const idx = lower.indexOf(qLower);
  if (idx === -1) return content.slice(0, maxLen);
  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + query.length + 80);
  let snippet = content.slice(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < content.length) snippet = snippet + "...";
  return snippet;
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const indexRef = useRef<any>(null);
  const postsRef = useRef<PostIndex[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(0);
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
          index.add(i, `${post.title} ${post.summary} ${post.content}`);
        });
        indexRef.current = index;
      });
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!query || !indexRef.current) {
      setResults([]);
      setActiveIndex(0);
      return;
    }
    const ids = indexRef.current.search(query, 10) as number[];
    setResults(
      ids.map((i) => {
        const post = postsRef.current[i];
        return { ...post, snippet: extractSnippet(post.content, query) };
      })
    );
    setActiveIndex(0);
  }, [query]);

  const onKeyDownInSearch = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[activeIndex]) {
        e.preventDefault();
        close();
        window.location.href = `/posts/${results[activeIndex].slug}`;
      }
    },
    [results, activeIndex, close]
  );

  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.children[activeIndex] as HTMLElement;
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const isMac = useMemo(() => {
    if (typeof navigator === "undefined") return true;
    return /Mac|iPhone|iPad/.test(navigator.userAgent);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors duration-300"
        aria-label="搜索"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
          onClick={close}
        >
          {/* Blurred backdrop */}
          <div
            className="absolute inset-0 bg-white/30 dark:bg-black/30"
            style={{
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
            }}
          />

          {/* Search panel */}
          <div
            className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-slide-up
              bg-white/70 dark:bg-stone-900/65
              border border-white/50 dark:border-white/10
              ring-1 ring-black/5 dark:ring-white/5"
            style={{
              animationDuration: "0.2s",
              backdropFilter: "blur(40px) saturate(150%)",
              WebkitBackdropFilter: "blur(40px) saturate(150%)",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDownInSearch}
          >
            {/* Input area */}
            <div className="flex items-center gap-3 px-5 border-b border-black/5 dark:border-white/10">
              <svg className="w-5 h-5 text-muted dark:text-muted-dark shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章..."
                className="flex-1 py-4 bg-transparent outline-none text-base text-ink dark:text-ink-dark placeholder:text-muted/60 dark:placeholder:text-muted-dark/60"
              />
              <kbd className="hidden sm:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-muted dark:text-muted-dark border border-black/10 dark:border-white/10">
                ESC
              </kbd>
            </div>

            {/* Results area */}
            <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
              {results.length === 0 && query && (
                <p className="px-5 py-10 text-sm text-muted dark:text-muted-dark text-center">无搜索结果</p>
              )}
              {!query && (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-muted dark:text-muted-dark">输入关键词搜索文章</p>
                  <p className="text-xs text-muted/50 dark:text-muted-dark/50 mt-2">
                    {isMac ? "⌘" : "Ctrl"} + K 快速打开搜索
                  </p>
                </div>
              )}
              {results.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  onClick={close}
                  className={`block px-5 py-4 transition-colors duration-150 border-b border-black/5 dark:border-white/5 last:border-b-0 ${
                    i === activeIndex
                      ? "bg-black/5 dark:bg-white/10"
                      : "hover:bg-black/[0.03] dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="text-sm font-medium text-ink dark:text-ink-dark leading-snug">
                    {highlightText(post.title, query)}
                  </div>
                  <div className="text-xs text-muted dark:text-muted-dark line-clamp-2 mt-1.5 leading-relaxed">
                    {highlightText(post.snippet, query)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.slug}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent-dark dark:text-accent-light"
                      >
                        {tag.name}
                      </span>
                    ))}
                    <span className="text-[10px] text-muted/60 dark:text-muted-dark/60 ml-auto">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Footer hint */}
            {results.length > 0 && (
              <div className="px-5 py-2.5 border-t border-black/5 dark:border-white/10 flex items-center gap-3 text-[10px] text-muted/60 dark:text-muted-dark/60">
                <span><kbd className="font-mono px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">↑↓</kbd> 导航</span>
                <span><kbd className="font-mono px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">↵</kbd> 打开</span>
                <span><kbd className="font-mono px-1 py-0.5 rounded bg-black/5 dark:bg-white/10">esc</kbd> 关闭</span>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
