"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "仪表盘" },
  { href: "/admin/posts", label: "文章管理" },
  { href: "/admin/tags", label: "标签管理" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="w-56 border-r border-gray-200 dark:border-gray-800 min-h-screen p-4 flex flex-col">
      <div className="text-lg font-bold mb-6">管理后台</div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-gray-100 dark:bg-gray-800 font-medium"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors text-left"
      >
        退出登录
      </button>
    </aside>
  );
}
