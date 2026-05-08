"use client";

import { useState, useEffect, useRef } from "react";
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
        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        aria-label="搜索"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章..."
              className="w-full px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-transparent outline-none"
            />
            <div className="max-h-80 overflow-y-auto">
              {results.length === 0 && query && (
                <p className="p-4 text-sm text-gray-500">无搜索结果</p>
              )}
              {results.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.slug}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="font-medium">{post.title}</div>
                  <div className="text-sm text-gray-500 line-clamp-1">{post.summary}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
