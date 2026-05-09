"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function TrackPageView() {
  const pathname = usePathname();
  const tracked = useRef("");

  useEffect(() => {
    if (tracked.current === pathname) return;
    tracked.current = pathname;

    const body: Record<string, string> = { path: pathname };

    const slugMatch = pathname.match(/^\/posts\/([^/]+)$/);
    if (slugMatch) {
      const meta = document.querySelector<HTMLMetaElement>('meta[name="x-post-id"]');
      if (meta?.content) body.postId = meta.content;
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
