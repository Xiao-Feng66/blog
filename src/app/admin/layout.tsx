import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-surface dark:bg-surface-dark">
      <Sidebar />
      <div className="flex-1 p-6 md:p-10 overflow-auto">{children}</div>
    </div>
  );
}
