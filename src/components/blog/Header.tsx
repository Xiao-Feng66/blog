import Link from "next/link";
import { Search } from "./Search";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/posts", label: "文章" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface/70 dark:bg-surface-dark/70 backdrop-blur-md transition-colors duration-500">
      <div className="mx-auto max-w-6xl px-8 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium tracking-wide text-ink dark:text-ink-dark hover:text-muted dark:hover:text-muted-dark transition-colors duration-300"
        >
          Blog
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors duration-300"
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
