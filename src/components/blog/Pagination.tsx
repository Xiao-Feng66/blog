import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = "" }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-3">
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-border dark:border-border-dark hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600 transition-all"
        >
          &larr; 上一页
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm text-muted/40 dark:text-muted-dark/40 cursor-not-allowed">
          &larr; 上一页
        </span>
      )}

      <span className="px-3 py-1.5 text-sm font-medium text-muted dark:text-muted-dark tabular-nums">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 text-sm font-medium rounded-lg border border-border dark:border-border-dark hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-600 transition-all"
        >
          下一页 &rarr;
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm text-muted/40 dark:text-muted-dark/40 cursor-not-allowed">
          下一页 &rarr;
        </span>
      )}
    </nav>
  );
}
