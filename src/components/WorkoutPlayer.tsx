"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { absCircuit, absRestSeconds, dayOrder, exerciseLabel, getWeek, levels, typeTitle } from "@/lib/data";
import type { LevelKey } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";
import { restoreSession, type SessionStep } from "@/lib/workoutSession";
import basePath from "@/lib/basePath";
import Icon from "./Icon";
import VideoEmbed from "./VideoEmbed";
import GuidedWorkout from "./GuidedWorkout";

const fa = (n: number) => n.toLocaleString("fa-IR");
function absSteps(week: number): SessionStep[] {
  return absCircuit.exercises.map((ex, i) => ({ key: `abs:${i}`, group: "abs", id: ex.id, label: ex.fa, prescription: `${fa(absCircuit.workSeconds)} ثانیه`, set: 1, sets: 1, seconds: absCircuit.workSeconds, restAfter: absRestSeconds(week) }));
}

export default function WorkoutPlayer({ level, week, day }: { level: LevelKey; week: number; day: string }) {
  const d = getWeek(level, week)?.days.find(x => x.key === day);
  const { isDone, toggleItem, isAbsDone, markDayAbs } = useProgress(level);
  const [active, setActive] = useState(false);
  const [resume, setResume] = useState(false);
  const [canResume, setCanResume] = useState(false);
  const [alternatives, setAlternatives] = useState<Record<number, boolean>>({});
  const [loaded, setLoaded] = useState(false);
  const [openVideo, setOpenVideo] = useState<number | null>(null);
  const [startAt, setStartAt] = useState(0);
  const storageKey = `badan:session:v1:${level}:${week}:${day}`;
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`${storageKey}:choices`) ?? "{}");
      if (saved && typeof saved === "object" && !Array.isArray(saved)) setAlternatives(saved);
    } catch {}
    setLoaded(true);
  }, [storageKey]);
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(`${storageKey}:choices`, JSON.stringify(alternatives)); } catch {}
  }, [alternatives, loaded, storageKey]);
  const steps = useMemo<SessionStep[]>(() => {
    if (!d) return [];
    const regular = d.exercises.flatMap((original, i) => {
      const e = alternatives[i] && original.alt ? original.alt : original;
      return Array.from({ length: e.sets }, (_, set) => ({ key: `${i}:${e.id}:${set}`, group: String(i), id: e.id, label: exerciseLabel(e), prescription: e.repsDisplay, set: set + 1, sets: e.sets, reps: e.reps, note: [original.note, e !== original ? e.note : undefined].filter(Boolean).join(" · "), eachSide: e.eachSide, holdTop: e.holdTop, restAfter: set === e.sets - 1 ? 120 : 90 }));
    });
    return d.hasAbs ? [...regular, ...absSteps(week)] : regular;
  }, [d, alternatives, week]);
  useEffect(() => {
    if (!loaded || active) return;
    try { setCanResume(!!restoreSession(localStorage.getItem(storageKey), JSON.stringify(steps), steps)); } catch { setCanResume(false); }
  }, [steps, storageKey, active, loaded]);
  if (!d) return null;
  const done = d.exercises.filter((_, i) => isDone(week, day, i)).length;
  const absDone = isAbsDone(week, day);
  const finished = done === d.exercises.length && (!d.hasAbs || absDone);
  const count = d.exercises.length + (d.hasAbs ? absCircuit.exercises.length : 0);
  const begin = (shouldResume: boolean) => {
    const first = steps.findIndex(s => s.group === "abs" ? !absDone : !isDone(week, day, Number(s.group)));
    setStartAt(first >= 0 ? first : 0);
    setResume(shouldResume);
    setActive(true);
  };
  const nextIndex = dayOrder.findIndex(x => x.key === day) + 1;
  return <div className="workout-overview">
    <Link className="workout-back" href="/program">→ برنامهٔ تمرین</Link>
    <section className="session-hero"><img src={`${basePath}/images/workout.jpg`} alt="تمرین با وزن بدن"/><div><span className="lime-tag">هفتهٔ {fa(week)} · {levels.find(l => l.key === level)?.fa}</span><p>{d.fa}</p><h1>{typeTitle(d.type)}{d.hasAbs && <small> + سرکیت شکم</small>}</h1><span className="session-hero-caption">{d.type === "rest" ? "فرصتی برای بازیابی" : "تمرکز روی یک حرکت، یک ست، یک قدم."}</span></div></section>
    {d.type === "rest" ? <section className="rest-day-card"><Icon name="leaf" size={35}/><h2>امروز، ریکاوری</h2><p>به بدن‌تان ریکاوری بدهید؛ آب کافی بنوشید و شب حتماً استراحت کنید.</p><Link className="session-primary" href="/program">بازگشت به برنامه</Link></section> : <>
      <div className="session-overview-stats"><div><strong>{fa(count)}</strong><span>حرکت</span></div><div><strong>{fa(steps.length)}</strong><span>ست در جلسه</span></div><div><strong>{fa(done)} / {fa(d.exercises.length)}</strong><span>حرکت اصلی کامل</span></div></div>
      <div className="session-list-heading"><h2>مسیر تمرینت</h2><span>ویدیو · ست · استراحت</span></div>
      <div className="session-exercise-list">{d.exercises.map((original, i) => {
        const e = alternatives[i] && original.alt ? original.alt : original;
        return <article key={i} className={`session-exercise ${isDone(week, day, i) ? "done" : ""}`}><div className="exercise-row"><span className="exercise-number">{isDone(week, day, i) ? <Icon name="check"/> : fa(i + 1).padStart(2, "۰")}</span><button className="exercise-name" aria-expanded={openVideo === i} onClick={() => setOpenVideo(openVideo === i ? null : i)}><strong>{exerciseLabel(e)}</strong><span>{e.repsDisplay}{e.eachSide ? " · هر طرف" : ""}{e.holdTop ? " · با مکث در بالا" : ""}</span></button><button className="preview-video" aria-label={`نمایش ویدیوی ${exerciseLabel(e)}`} onClick={() => setOpenVideo(openVideo === i ? null : i)}><Icon name="play"/></button><button className="manual-complete" aria-label={`ثبت انجام ${exerciseLabel(e)}`} aria-pressed={isDone(week, day, i)} onClick={() => toggleItem(week, day, i)}><Icon name="check" size={17}/></button></div>
          {original.alt && <div className="alternative-row"><label>جایگزین همین حرکت <select aria-label={`انتخاب حرکت ${i + 1}`} value={alternatives[i] ? "alt" : "main"} onChange={event => setAlternatives(prev => ({ ...prev, [i]: event.target.value === "alt" }))}><option value="main">{exerciseLabel(original)} · {original.repsDisplay}</option><option value="alt">{exerciseLabel(original.alt)} · {original.alt.repsDisplay}</option></select></label></div>}
          {original.note && <p className="exercise-note">{original.note}</p>}{e !== original && e.note && <p className="exercise-note">{e.note}</p>}{openVideo === i && <div className="overview-video"><VideoEmbed id={e.id} fa={exerciseLabel(e)}/></div>}
        </article>;
      })}</div>
      {d.hasAbs && <section className="overview-abs"><div><Icon name="bolt"/><h2>سرکیت شکم</h2><span>{absDone ? "انجام شده ✓" : `${fa(absCircuit.exercises.length)} حرکت · هر حرکت ${fa(absCircuit.workSeconds)} ثانیه`}</span></div><p>بعد از آخرین حرکت، سرکیت شکم در همین جلسه ادامه پیدا می‌کند.</p><details><summary>دیدن حرکات شکم</summary><ol>{absCircuit.exercises.map((e, i) => <li key={i}>{e.fa}</li>)}</ol><p>{absCircuit.note}</p></details></section>}
      {d.note && <p className="exercise-note">{d.note}</p>}
      <p className="session-info">بین ست‌ها ۹۰ ثانیه و بین حرکات ۲ دقیقه استراحت در نظر گرفته شده؛ می‌توانی زمان استراحت را تغییر بدهی. حرکات تکراری با تأیید خودت جلو می‌روند.</p>
      <div className="session-start-bar"><div><strong>{canResume ? "تمرینت نیمه‌کاره است" : finished ? "جلسه کامل شده" : "آماده‌ای؟"}</strong><span>{canResume ? "از همان ست ادامه بده" : "۱۰ ثانیه آماده‌باش، بعد شروع"}</span></div><button className="session-primary" disabled={!loaded} onClick={() => begin(canResume)}>{canResume ? "ادامهٔ تمرین" : finished ? "تمرین دوباره" : "شروع جلسه"}<Icon name="arrow"/></button></div>
    </>}
    {nextIndex < dayOrder.length && <Link className="next-workout-link" href={`/day/${week}/${dayOrder[nextIndex].key}`}>روز بعد · {dayOrder[nextIndex].fa} ←</Link>}
    {active && <GuidedWorkout steps={steps} title={`${d.fa} · ${typeTitle(d.type)}`} storageKey={storageKey} startAt={startAt} resume={resume} onGroupDone={group => group === "abs" ? markDayAbs(week, day, true) : toggleItem(week, day, Number(group), true)} onClose={() => setActive(false)}/>}
  </div>;
}

export function AbsPanel({ week, isDone, onDone }: { week: number; isDone: boolean; onDone: () => void }) {
  const [active, setActive] = useState(false);
  const [canResume, setCanResume] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const steps = useMemo(() => absSteps(week), [week]);
  const storageKey = `badan:session:v1:abs:${week}`;
  useEffect(() => {
    if (active) return;
    try { setCanResume(!!restoreSession(localStorage.getItem(storageKey), JSON.stringify(steps), steps)); } catch {}
  }, [active, steps, storageKey]);
  return <section className="abs-guided-overview"><p className="session-info">{absCircuit.note}</p><div className="session-list-heading"><h2>سرکیت شکم</h2><span>{fa(absCircuit.workSeconds)} ثانیه تمرین · {fa(absRestSeconds(week))} ثانیه استراحت</span></div><div className="session-exercise-list">{absCircuit.exercises.map((e, i) => <article className="session-exercise" key={i}><button className="exercise-row abs-exercise-row" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}><span className="exercise-number">{fa(i + 1)}</span><span className="exercise-name"><strong>{e.fa}</strong><span>{fa(absCircuit.workSeconds)} ثانیه</span></span><Icon name="play"/></button>{open === i && <div className="overview-video"><VideoEmbed id={e.id} fa={e.fa}/></div>}</article>)}</div><div className="session-start-bar"><div><strong>{fa(steps.length)} حرکت</strong><span>{isDone ? "انجام شده ✓" : "با تایمر و استراحت خودکار"}</span></div><button className="session-primary" onClick={() => setActive(true)}>{canResume ? "ادامهٔ سرکیت" : "شروع سرکیت"}<Icon name="arrow"/></button></div>{active && <GuidedWorkout steps={steps} storageKey={storageKey} title="سرکیت شکم" resume={canResume} onGroupDone={() => { if (!isDone) onDone(); }} onClose={() => setActive(false)}/>}</section>;
}
