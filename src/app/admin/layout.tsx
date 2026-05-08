import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-surface dark:bg-surface-dark">
      <Sidebar />
      <div className="flex-1 p-6 md:p-10 overflow-auto">{children}</div>
    </div>
  );
}
