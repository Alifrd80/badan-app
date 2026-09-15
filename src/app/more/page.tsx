"use client";

import Link from "next/link";
import { absCircuit, exercises, notes } from "@/lib/data";

const items = [
  { href: "/exercises", title: "آموزش حرکات", desc: `ویدیوی ${exercises.length} حرکت` },
  { href: "/pull-no-bar", title: "پول بدون میله", desc: "برنامه جایگزین پول" },
  { href: "/calorie", title: "جدول کالری", desc: "غذاها و فعالیت‌ها" },
  { href: "/notes", title: "راهنمای برنامه", desc: "نکات و لینک‌ها" },
];

export default function MorePage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-bold">بیشتر</h1>

      <section className="mb-5 rounded-2xl bg-zinc-900 p-4 text-white">
        <h2 className="text-sm font-bold">درباره برنامه</h2>
        <ul className="mt-2 space-y-1.5 text-xs leading-6 text-zinc-300">
          <li>۱۳ هفته · ۳ سطح (مبتدی، متوسط، حرفه‌ای)</li>
          <li>{exercises.length} حرکت با ویدیو</li>
          <li>سرکیت شکم: {absCircuit.exercises.length} حرکت × {absCircuit.workSeconds} ثانیه</li>
          <li>هر دو هفته یک بار سختی تمرینات زیاد می‌شود</li>
        </ul>
        <p className="mt-3 text-[11px] leading-5 text-zinc-400">
          محتوای برنامه از جزوات تمرین خانگی تهیه شده و به زبان فارسی بومی‌سازی
          شده است. برای پرسش با مربی در تلگرام: {notes.telegram}
        </p>
      </section>

      <section className="mb-5">
        <h2 className="mb-2 text-sm font-bold">دسترسی سریع</h2>
        <div className="space-y-2">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 transition-colors hover:border-emerald-300"
            >
              <div>
                <p className="text-sm font-medium">{it.title}</p>
                <p className="mt-0.5 text-[11px] text-zinc-400">{it.desc}</p>
              </div>
              <span className="text-zinc-300">←</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="space-y-2">
        {notes.links.map((l, i) => (
          <a
            key={i}
            href={l.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-xl bg-emerald-600 p-4 text-sm font-medium text-white"
          >
            {l.title}
            <span>↗</span>
          </a>
        ))}
      </div>

      <p className="mt-6 text-center text-[11px] text-zinc-400">
        نسخه ۱٫۰ · برنامه تمرین در خانه
      </p>
    </div>
  );
}