export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <div className="animate-pulse space-y-6">
        <div className="h-5 bg-stone-100 dark:bg-stone-800 rounded w-1/4" />
        <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded w-full" />
        <div className="h-4 bg-stone-100 dark:bg-stone-800 rounded w-2/3" />
      </div>
    </div>
  );
}
