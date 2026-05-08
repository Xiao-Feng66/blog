import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border dark:border-border-dark">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-muted dark:text-muted-dark">
            <Link href="/" className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors">首页</Link>
            <Link href="/tags" className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors">标签</Link>
            <Link href="/about" className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors">关于</Link>
          </div>
          <p className="text-sm text-muted dark:text-muted-dark">
            &copy; {new Date().getFullYear()} Blog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
