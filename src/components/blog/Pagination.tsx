import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = "" }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-16 flex items-center justify-center gap-8 text-sm">
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors duration-300"
        >
          &larr; 上一页
        </Link>
      ) : (
        <span className="text-border dark:text-border-dark cursor-default">
          &larr; 上一页
        </span>
      )}

      <span className="text-xs text-muted dark:text-muted-dark tabular-nums tracking-wider">
        {currentPage} / {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="text-muted dark:text-muted-dark hover:text-ink dark:hover:text-ink-dark transition-colors duration-300"
        >
          下一页 &rarr;
        </Link>
      ) : (
        <span className="text-border dark:text-border-dark cursor-default">
          下一页 &rarr;
        </span>
      )}
    </nav>
  );
}
