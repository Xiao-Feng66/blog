import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">页面不存在</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">你访问的页面找不到了</p>
      <Link
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        返回首页
      </Link>
    </div>
  );
}
