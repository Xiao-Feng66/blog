import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center animate-fade-in">
      <div className="text-6xl font-light text-border dark:text-border-dark mb-6">404</div>
      <p className="text-sm text-muted dark:text-muted-dark mb-10">页面不存在</p>
      <Link
        href="/"
        className="text-sm text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors duration-300 underline underline-offset-4 decoration-border dark:decoration-border-dark hover:decoration-current"
      >
        返回首页
      </Link>
    </div>
  );
}
