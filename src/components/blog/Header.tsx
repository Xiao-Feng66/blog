import Link from "next/link";
import { Search } from "./Search";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-lg border-b border-border dark:border-border-dark transition-colors">
      <div className="mx-auto max-w-3xl px-6 h-16 flex items-center justify-between relative">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50 hover:text-accent transition-colors"
        >
          Blog<span className="text-accent">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Search />
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
