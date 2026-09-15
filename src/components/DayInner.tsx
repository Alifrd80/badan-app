"use client";

import WorkoutPlayer from "@/components/WorkoutPlayer";
import { dayOrder, getDay, getWeek } from "@/lib/data";
import { useSettings } from "@/lib/useProgress";

export default function DayInner({
  week,
  day: dayParameter,
}: {
  week: number;
  day: string;
}) {
  const { level } = useSettings();

  const weekData = getWeek(level, week);
  const valid = weekData && dayOrder.some((d) => d.key === dayParameter);
  const day = getDay(level, week, dayParameter);

  if (!valid || !day) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        روز یا هفته‌ی معتبری نیست.
      </div>
    );
  }

  return <WorkoutPlayer level={level} week={week} day={day.key} />;
}
