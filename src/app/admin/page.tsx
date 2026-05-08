import { prisma, useMock } from "@/lib/db";
import { mockDb } from "@/lib/mockData";

export const dynamic = "force-dynamic";

const statConfig = [
  { label: "总文章数", color: "bg-accent/10 text-accent" },
  { label: "已发布", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { label: "草稿", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
];

export default async function AdminDashboard() {
  let totalPosts, publishedPosts, draftPosts;
  if (useMock) {
    const stats = mockDb.getDashboardStats();
    totalPosts = stats.total;
    publishedPosts = stats.published;
    draftPosts = stats.draft;
  } else {
    [totalPosts, publishedPosts, draftPosts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "published" } }),
      prisma.post.count({ where: { status: "draft" } }),
    ]);
  }

  const values = [totalPosts, publishedPosts, draftPosts];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 mb-8">仪表盘</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statConfig.map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-6 transition-all hover:shadow-sm"
          >
            <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${stat.color} mb-3`}>
              {stat.label}
            </div>
            <div className="text-3xl font-bold text-stone-900 dark:text-stone-50 tabular-nums">{values[i]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
