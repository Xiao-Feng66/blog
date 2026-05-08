export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded-lg w-1/3" />
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-lg w-full" />
        <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded-lg w-2/3" />
      </div>
    </div>
  );
}
