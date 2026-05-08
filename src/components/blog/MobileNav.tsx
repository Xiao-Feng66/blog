"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "文章" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 -mr-2 rounded-lg text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors duration-300"
        aria-label="菜单"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-sm border-b border-border dark:border-border-dark animate-fade-in" style={{ animationDuration: "0.2s" }}>
          <nav className="mx-auto max-w-2xl px-6 py-6 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
