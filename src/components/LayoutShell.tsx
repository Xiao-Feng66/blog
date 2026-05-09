"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/blog/Header";
import { Footer } from "@/components/blog/Footer";
import { BackgroundDecor } from "@/components/blog/BackgroundDecor";
import { TrackPageView } from "@/components/TrackPageView";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <TrackPageView />
      <BackgroundDecor />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
