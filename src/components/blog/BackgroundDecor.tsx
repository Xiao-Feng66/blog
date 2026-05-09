"use client";

import { usePathname } from "next/navigation";

export function BackgroundDecor() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-70 dark:opacity-30 blur-3xl
          bg-gradient-to-br from-amber-400/80 via-orange-300/60 to-transparent
          dark:from-amber-700/50 dark:via-orange-800/30 dark:to-transparent"
        style={{ animation: "drift-1 25s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[700px] h-[700px] rounded-full opacity-60 dark:opacity-25 blur-3xl
          bg-gradient-to-tr from-teal-400/70 via-cyan-300/50 to-transparent
          dark:from-teal-700/40 dark:via-cyan-800/25 dark:to-transparent"
        style={{ animation: "drift-2 30s ease-in-out infinite" }}
      />
      <div
        className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full opacity-45 dark:opacity-20 blur-3xl
          bg-gradient-to-l from-rose-300/60 via-pink-200/40 to-transparent
          dark:from-rose-800/35 dark:via-pink-900/20 dark:to-transparent"
        style={{ animation: "drift-3 20s ease-in-out infinite" }}
      />
    </div>
  );
}
