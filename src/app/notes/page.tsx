"use client";

import { notes } from "@/lib/data";

export default function NotesPage() {
  return (
    <div>
      <h1 className="mb-4 text-lg font-bold">راهنمای برنامه</h1>
      <div className="space-y-3">
        {notes.sections.map((s, i) => (
          <section key={i} className="rounded-xl border border-zinc-200 p-4">
            <h2 className="mb-1.5 text-sm font-bold">{s.title}</h2>
            <p className="text-xs leading-6 text-zinc-600">{s.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-5">
        <h2 className="mb-2 text-sm font-bold">لینک‌های مفید</h2>
        <div className="space-y-2">
          {notes.links.map((l, i) => (
            <a
              key={i}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl bg-zinc-900 p-4 text-sm text-white"
            >
              {l.title}
              <span className="mt-0.5 block text-[11px] text-zinc-400">
                {l.url.replace("https://", "")}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-xl bg-emerald-600 p-4 text-center text-sm font-medium text-white">
        <p>ارتباط با مربی</p>
        <p className="mt-1" dir="ltr">
          {notes.telegram}
        </p>
      </section>
    </div>
  );
}