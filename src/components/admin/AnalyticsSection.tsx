"use client";

import { useState, useEffect } from "react";
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

function formatDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return formatDate(d);
}

const presets = [
  { label: "近 7 天", from: () => daysAgo(7), to: () => formatDate(new Date()) },
  { label: "近 30 天", from: () => daysAgo(30), to: () => formatDate(new Date()) },
  { label: "近 90 天", from: () => daysAgo(90), to: () => formatDate(new Date()) },
] as const;

export function AnalyticsSection() {
  const [from, setFrom] = useState(daysAgo(7));
  const [to, setTo] = useState(formatDate(new Date()));
  const [activePreset, setActivePreset] = useState(0);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (f: string, t: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?from=${f}&to=${t}`);
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/analytics?from=${daysAgo(7)}&to=${formatDate(new Date())}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled) {
          if (json) setData(json);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handlePreset = (index: number) => {
    const p = presets[index];
    const f = p.from();
    const t = p.to();
    setActivePreset(index);
    setFrom(f);
    setTo(t);
    fetchData(f, t);
  };

  const handleCustomDate = (type: "from" | "to", value: string) => {
    setActivePreset(-1);
    if (type === "from") {
      setFrom(value);
      fetchData(value, to);
    } else {
      setTo(value);
      fetchData(from, value);
    }
  };

  return (
    <div className="mt-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">访问分析</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5">
            {presets.map((p, i) => (
              <button
                key={p.label}
                onClick={() => handlePreset(i)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activePreset === i
                    ? "bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-50 shadow-sm"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <input
              type="date"
              value={from}
              onChange={(e) => handleCustomDate("from", e.target.value)}
              className="px-2 py-1.5 rounded-md border border-border dark:border-border-dark bg-card dark:bg-card-dark text-stone-700 dark:text-stone-300 text-xs"
            />
            <span>—</span>
            <input
              type="date"
              value={to}
              onChange={(e) => handleCustomDate("to", e.target.value)}
              className="px-2 py-1.5 rounded-md border border-border dark:border-border-dark bg-card dark:bg-card-dark text-stone-700 dark:text-stone-300 text-xs"
            />
          </div>
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
      ) : (
        <p className="text-sm text-muted dark:text-muted-dark py-10 text-center">数据加载失败</p>
      )}
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
