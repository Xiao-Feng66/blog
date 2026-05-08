export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
      </div>
    </div>
  );
}
