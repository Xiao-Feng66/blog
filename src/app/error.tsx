"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h2 className="text-2xl font-bold mb-4">出错了</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">页面加载时发生错误</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        重试
      </button>
    </div>
  );
}
