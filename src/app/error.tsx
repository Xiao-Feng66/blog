"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-24 text-center animate-fade-in">
      <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-50 mb-3">出错了</h2>
      <p className="text-muted dark:text-muted-dark mb-8">页面加载时发生错误</p>
      <button
        onClick={reset}
        className="inline-flex px-5 py-2.5 bg-accent text-white rounded-xl hover:bg-accent-dark transition-colors text-sm font-medium"
      >
        重试
      </button>
    </div>
  );
}
