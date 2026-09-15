import type { Metadata } from "next";
import DayInner from "@/components/DayInner";
import { dayOrder, getDay, getLevelWeeks, getWeek, levels } from "@/lib/data";

export function generateStaticParams() {
  const params: { week: string; day: string }[] = [];
  for (const level of levels) {
    for (const w of getLevelWeeks(level.key)) {
      for (const d of w.days) {
        params.push({ week: String(w.index), day: d.key });
      }
    }
  }
  // حداقل کلیدها برای هفته و روز به‌صورت دستی
  for (let week = 1; week <= 13; week++) {
    for (const d of dayOrder) {
      if (!params.some((p) => p.week === String(week) && p.day === d.key)) {
        params.push({ week: String(week), day: d.key });
      }
    }
  }
  return params;
}

export const metadata: Metadata = {
  title: "تمرین روز",
};

export default async function DayPage(props: {
  params: Promise<{ week: string; day: string }>;
}) {
  const { week, day } = await props.params;
  return <DayInner week={Number(week)} day={day} />;
}

export function isDayValid(week: string, day: string) {
  const weekData = getWeek("beginner", Number(week));
  return Boolean(weekData && dayOrder.some((d) => d.key === day));
}

export function getDayData(week: string, day: string) {
  return getDay("beginner", Number(week), day);
}