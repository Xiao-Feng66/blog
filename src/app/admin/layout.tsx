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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
