import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Search } from "@/components/blog/Search";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/tags", label: "标签" },
  { href: "/about", label: "关于" },
];

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Blog
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Search />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
