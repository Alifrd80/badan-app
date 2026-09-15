"use client";

import { useMemo, useState } from "react";
import { nutrition } from "@/lib/data";

export default function NutritionPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState(80);
  const [height, setHeight] = useState(180);
  const [age, setAge] = useState(30);
  const [active, setActive] = useState(0);

  const bmr = useMemo(() => {
    const base = 10 * weight + 6.25 * height - 5 * age;
    return gender === "male" ? base + 5 : base - 161;
  }, [gender, weight, height, age]);

  const total = Math.round(bmr + active);
  const rounded = Math.round(total / 100) * 100;

  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">تغذیه</h1>
      <p className="mb-4 text-xs leading-6 text-zinc-500">
        محاسبه کالری مورد نیاز روزانه بر اساس فرمول Mifflin-St Jeor از جزوه تغذیه
        برنامه.
      </p>

      {/* محاسبه */}
      <section className="mb-5 rounded-2xl border border-zinc-200 p-4">
        <h2 className="mb-3 text-sm font-bold">کالری روزانه</h2>
        <div className="mb-3 grid grid-cols-2 gap-2">
          {(
            [
              { k: "male", l: "مرد" },
              { k: "female", l: "زن" },
            ] as const
          ).map((g) => (
            <button
              key={g.k}
              onClick={() => setGender(g.k)}
              className={`rounded-xl border py-2.5 text-sm ${
                gender === g.k
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-zinc-200 text-zinc-600"
              }`}
            >
              {g.l}
            </button>
          ))}
        </div>

        <Field label="وزن (کیلوگرم)" value={weight} onChange={setWeight} max={200} />
        <Field label="قد (سانتی‌متر)" value={height} onChange={setHeight} max={250} />
        <Field label="سن (سال)" value={age} onChange={setAge} max={100} />

        <div className="mt-3">
          <p className="mb-1 text-xs text-zinc-400">فعالیت روزانه (کالری تقریبی)</p>
          <div className="flex flex-wrap gap-1.5">
            {[0, 183, 400, 700, 1050, 1400].map((v) => (
              <button
                key={v}
                onClick={() => setActive(v)}
                className={`rounded-full px-3 py-1 text-xs ${
                  active === v ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {v === 0 ? "کم‌تحرک" : v === 1050 ? `مثل نویسنده (${v})` : v.toLocaleString("fa-IR")}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-center">
          <div className="rounded-xl bg-zinc-50 p-3">
            <p className="text-[11px] text-zinc-400">BMR</p>
            <p className="text-xl font-bold tabular-nums">
              {bmr.toLocaleString("fa-IR")}
            </p>
          </div>
          <div className="rounded-xl bg-emerald-600 p-3 text-white">
            <p className="text-[11px] opacity-80">نیاز روزانه</p>
            <p className="text-xl font-bold tabular-nums">
              ≈ {rounded.toLocaleString("fa-IR")}
            </p>
          </div>
        </div>
        <p className="mt-2 text-center text-[11px] text-zinc-400">
          فعال/غیرفعال: مجموع {bmr.toLocaleString("fa-IR")} + {active.toLocaleString("fa-IR")} ={" "}
          {total.toLocaleString("fa-IR")}
        </p>
      </section>

      {/* تقسیم درصدی */}
      <section className="mb-5">
        <h2 className="mb-2 text-sm font-bold">تقسیم کالری (ماکروها)</h2>
        <div className="space-y-2">
          {nutrition.splits.map((s) => (
            <div key={s.key} className="rounded-xl border border-zinc-200 p-3">
              <p className="text-sm font-medium">{s.fa}</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <MacroPie label="کربوهیدرات" pct={s.carbsPct} cal={s.carbsCal as number | null} />
                <MacroPie label="پروتئین" pct={s.proteinPct} cal={s.proteinCal as number | null} />
                <MacroPie label="چربی" pct={s.fatPct} cal={s.fatCal as number | null} />
              </div>
              {s.note ? <p className="mt-2 text-[11px] leading-5 text-zinc-400">{s.note}</p> : null}
            </div>
          ))}
        </div>
      </section>

      {/* الگوی وعده‌ها */}
      <section className="mb-5">
        <h2 className="mb-2 text-sm font-bold">نمونه چیدن وعده‌ها (۲۶۰۰ کالری)</h2>
        <div className="space-y-2">
          {nutrition.exampleMealPlan2600.map((m, i) => (
            <div key={i} className="rounded-xl border border-zinc-200 p-3">
              <p className="text-sm font-medium">{m.meal}</p>
              <p className="mt-1 text-xs leading-6 text-zinc-500">{m.desc}</p>
              {m.kcal != null ? (
                <p className="mt-1 text-[11px] text-zinc-400 tabular-nums">
                  {m.kcal.toLocaleString("fa-IR")} کالری
                  {m.protein != null ? ` · پروتئین ${m.protein.toLocaleString("fa-IR")} گرم` : ""}
                  {m.carbs != null ? ` · کربو ${m.carbs.toLocaleString("fa-IR")} گرم` : ""}
                  {m.fat != null ? ` · چربی ${m.fat.toLocaleString("fa-IR")} گرم` : ""}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* قوانین */}
      <section>
        <h2 className="mb-2 text-sm font-bold">نکات مهم از جزوه</h2>
        <ul className="space-y-2">
          {nutrition.rules.map((r, i) => (
            <li key={i} className="rounded-xl bg-zinc-50 p-3 text-xs leading-6 text-zinc-600">
              {r}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  max: number;
}) {
  return (
    <label className="mb-2 block">
      <span className="mb-1 block text-xs text-zinc-400">{label}</span>
      <input
        type="range"
        min={20}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-600"
      />
      <span className="mt-0.5 block text-sm font-bold tabular-nums">
        {value.toLocaleString("fa-IR")}
      </span>
    </label>
  );
}

function MacroPie({
  label,
  pct,
  cal,
}: {
  label: string;
  pct: number;
  cal: number | null;
}) {
  return (
    <div className="rounded-lg bg-zinc-50 p-2">
      <p className="text-[11px] text-zinc-400">{label}</p>
      <p className="text-sm font-bold tabular-nums">{pct.toLocaleString("fa-IR")}%</p>
      {cal != null ? (
        <p className="text-[10px] text-zinc-400 tabular-nums">
          {cal.toLocaleString("fa-IR")} کالری
        </p>
      ) : null}
    </div>
  );
}