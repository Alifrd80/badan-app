"use client";

import { useMemo, useState } from "react";
import VideoEmbed from "@/components/VideoEmbed";
import { categories, exercises } from "@/lib/data";

export default function ExercisesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const cats = useMemo(() => Object.entries(categories), []);
  const list = useMemo(() => {
    return exercises.filter((e) => {
      if (filter !== "all" && e.cat !== filter) return false;
      if (query.trim()) {
        return e.fa.includes(query.trim());
      }
      return true;
    });
  }, [query, filter]);

  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">آموزش حرکات</h1>
      <p className="mb-4 text-xs text-zinc-400">
        ویدیوی {exercises.length} حرکت با وزن بدن و کیف
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجوی حرکت..."
        className="mb-3 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1.5 text-xs ${
            filter === "all" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
          }`}
        >
          همه
        </button>
        {cats.map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-full px-3 py-1.5 text-xs ${
              filter === k ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {list.map((e) => (
          <div key={e.id} className="rounded-xl border border-zinc-200">
            <button
              className="flex w-full items-center justify-between p-3 text-start"
              onClick={() => setOpenId(openId === e.id ? null : e.id)}
            >
              <div>
                <p className="text-sm font-medium">{e.fa}</p>
                <p className="mt-0.5 text-[11px] text-zinc-400">{categories[e.cat]}</p>
              </div>
              <span className="text-zinc-400">{openId === e.id ? "▴" : "▾"}</span>
            </button>
            {openId === e.id ? (
              <div className="px-3 pb-3">
                <VideoEmbed id={e.id} fa={e.fa} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}