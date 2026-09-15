"use client";

import { useMemo, useState } from "react";
import { calorie } from "@/lib/data";

export default function CaloriePage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return calorie.foodTable;
    return calorie.foodTable
      .map((c) => ({
        ...c,
        rows: c.rows.filter(
          (r) => r.fa.includes(query.trim()) || r.portion.includes(query.trim()),
        ),
      }))
      .filter((c) => c.rows.length > 0);
  }, [query]);

  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">جدول کالری</h1>
      <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-800">
        {calorie.reviewNote}
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="جستجو در جدول (مثلاً مرغ، موز، نان...)"
        className="mb-4 w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
      />

      {filtered.map((cat) => (
        <section key={cat.cat} className="mb-5">
          <h2 className="mb-2 text-sm font-bold">{cat.cat}</h2>
          <div className="overflow-hidden rounded-xl border border-zinc-200">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-zinc-50 text-zinc-400">
                  <th className="px-2 py-2 font-medium">غذا</th>
                  <th className="px-2 py-2 font-medium">مقدار</th>
                  <th className="px-1 py-2 font-medium">پرو</th>
                  <th className="px-1 py-2 font-medium">چربی</th>
                  <th className="px-1 py-2 font-medium">کربو</th>
                  <th className="px-2 py-2 font-medium">کالری</th>
                </tr>
              </thead>
              <tbody>
                {cat.rows.map((r, i) => (
                  <tr key={i} className="border-t border-zinc-100">
                    <td className="px-2 py-2">{r.fa}</td>
                    <td className="px-2 py-2 text-zinc-400">{r.portion}</td>
                    <td className="px-1 py-2 tabular-nums">{r.protein}</td>
                    <td className="px-1 py-2 tabular-nums">{r.fat}</td>
                    <td className="px-1 py-2 tabular-nums">{r.carbs}</td>
                    <td className="px-2 py-2 font-bold tabular-nums">{r.kcal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section className="mb-5">
        <h2 className="mb-2 text-sm font-bold">کالری فعالیت‌های روزانه (در ساعت)</h2>
        <div className="space-y-1.5">
          {calorie.activityCalories.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-xs"
            >
              <span>{a.fa}</span>
              <span className="font-bold tabular-nums">
                {a.kcalPerHour.toLocaleString("fa-IR")}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-bold">
          کالری تمرین برای ورزشکار ۸۰ کیلوگرمی (در ساعت)
        </h2>
        <div className="space-y-1.5">
          {calorie.exerciseCalories80kg.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-xs"
            >
              <span>{a.fa}</span>
              <span className="font-bold tabular-nums">
                {a.kcalPerHour.toLocaleString("fa-IR")}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}