"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface TrendItem {
  date: string;
  pv: number;
  uv: number;
}

interface TopPost {
  postId: string;
  title: string;
  slug: string;
  views: number;
}

interface AnalyticsData {
  pv: number;
  uv: number;
  trend: TrendItem[];
  topPosts: TopPost[];
}

const ranges = [
  { value: "7d", label: "近 7 天" },
  { value: "30d", label: "近 30 天" },
] as const;

export function AnalyticsSection() {
  const [range, setRange] = useState<string>("7d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (r: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${r}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(range);
  }, [range, fetchData]);

  const handleRange = (r: string) => {
    if (r !== range) setRange(r);
  };

  return (
    <div className="mt-10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">访问分析</h2>
        <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => handleRange(r.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                range === r.value
                  ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-sm"
                  : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-6 animate-pulse">
              <div className="h-4 w-16 bg-stone-200 dark:bg-stone-700 rounded mb-3" />
              <div className="h-8 w-24 bg-stone-200 dark:bg-stone-700 rounded" />
            </div>
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard label="页面访问量" value={data.pv} color="bg-blue-500/10 text-blue-600 dark:text-blue-400" />
            <StatCard label="独立访客数" value={data.uv} color="bg-purple-500/10 text-purple-600 dark:text-purple-400" />
          </div>

          <div className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-6">
            <h3 className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-4">访问趋势</h3>
            {data.trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={data.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v: string) => v.slice(5)}
                    stroke="#a8a29e"
                  />
                  <YAxis tick={{ fontSize: 11 }} stroke="#a8a29e" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e7e5e4",
                      fontSize: 12,
                    }}
                    labelFormatter={(v) => String(v)}
                  />
                  <Line type="monotone" dataKey="pv" name="PV" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="uv" name="UV" stroke="#a855f7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted dark:text-muted-dark py-10 text-center">暂无数据</p>
            )}
          </div>

          <div className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-6">
            <h3 className="text-sm font-medium text-stone-600 dark:text-stone-400 mb-4">热门文章</h3>
            {data.topPosts.length > 0 ? (
              <div className="space-y-3">
                {data.topPosts.map((post, i) => (
                  <div key={post.postId} className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800 text-xs font-medium text-stone-500 dark:text-stone-400 shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-stone-700 dark:text-stone-300 truncate flex-1">{post.title}</span>
                    <span className="text-xs text-muted dark:text-muted-dark tabular-nums shrink-0">{post.views} 次</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted dark:text-muted-dark py-6 text-center">暂无数据</p>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-border dark:border-border-dark bg-card dark:bg-card-dark p-6 transition-all hover:shadow-sm">
      <div className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${color} mb-3`}>
        {label}
      </div>
      <div className="text-3xl font-bold text-stone-900 dark:text-stone-50 tabular-nums">{value.toLocaleString()}</div>
    </div>
  );
}
