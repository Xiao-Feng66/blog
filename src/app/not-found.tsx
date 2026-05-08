import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center animate-fade-in">
      <div className="text-6xl font-bold text-accent mb-4">404</div>
      <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-50 mb-3">页面不存在</h2>
      <p className="text-muted dark:text-muted-dark mb-8">你访问的页面找不到了</p>
      <Link
        href="/"
        className="inline-flex px-5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors text-sm font-medium"
      >
        返回首页
      </Link>
    </div>
  );
}
