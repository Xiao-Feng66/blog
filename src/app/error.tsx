"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center animate-fade-in">
      <p className="text-sm text-muted dark:text-muted-dark mb-10">页面加载时发生错误</p>
      <button
        onClick={reset}
        className="text-sm text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors duration-300 underline underline-offset-4 decoration-border dark:decoration-border-dark hover:decoration-current"
      >
        重试
      </button>
    </div>
  );
}
