"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getPreparedVideo } from "@/lib/data";
import { completedGroups, initialSession, restoreSession, sessionReducer, type SessionAction, type SessionState, type SessionStep } from "@/lib/workoutSession";
import { storage } from "@/lib/storage";
import ExerciseVideo from "./ExerciseVideo";
import Icon from "./Icon";

const fa = (n: number) => n.toLocaleString("fa-IR");
const time = (n: number) => `${Math.floor(n / 60).toString().padStart(2, "0")}:${Math.floor(n % 60).toString().padStart(2, "0")}`;
export default function GuidedWorkout({ steps, storageKey, title, onGroupDone, onClose, startAt = 0, resume = false }: {
  steps: SessionStep[]; storageKey: string; title: string; onGroupDone: (group: string) => void; onClose: () => void; startAt?: number; resume?: boolean;
}) {
  const signature = JSON.stringify(steps);
  const [state, setState] = useState<SessionState>(() => {
    if (resume) { try { const saved = restoreSession(storage.getItem(storageKey), signature, steps); if (saved) return saved; } catch {} }
    return { ...initialSession(startAt), completed: steps.slice(0, startAt).map(s => s.key) };
  });
  const latestState = useRef(state);
  latestState.current = state;
  const [exitOpen, setExitOpen] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const onGroup = useRef(onGroupDone);
  onGroup.current = onGroupDone;
  const notified = useRef(new Set<string>());
  const dispatch = (action: SessionAction) => setState(s => sessionReducer(s, action, steps));

  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { node?.close(); document.body.style.overflow = oldOverflow; };
  }, []);
  useEffect(() => {
    const suspend = () => { const paused = {...latestState.current, paused:true}; latestState.current=paused; setState(paused); if(paused.phase!=="finished") { try { storage.setItem(storageKey, JSON.stringify({signature, state:paused})); } catch {} } };
    const hide = () => { if (document.hidden) suspend(); };
    window.addEventListener("badan-background", suspend);
    document.addEventListener("visibilitychange", hide);
    const back = () => { if(latestState.current.phase === "finished") {onClose();return;} setState(s => ({...s, paused:true})); setExitOpen(true); };
    window.addEventListener("badan-back", back);
    return () => {document.removeEventListener("visibilitychange", hide);window.removeEventListener("badan-back", back);window.removeEventListener("badan-background", suspend);};
  }, []);
  useEffect(() => {
    if (state.paused || state.phase === "finished") return;
    let last = Date.now();
    const timer = setInterval(() => {
      if (document.hidden) return;
      const seconds = Math.floor((Date.now() - last) / 1000);
      if (seconds > 0) { last += seconds * 1000; setState(s => sessionReducer(s, { type: "tick", seconds }, steps)); }
    }, 200);
    return () => clearInterval(timer);
  }, [state.paused, state.phase, state.cursor, steps]);
  useEffect(() => {
    try {
      if (state.phase === "finished") storage.removeItem(storageKey);
      else storage.setItem(storageKey, JSON.stringify({ signature, state }));
    } catch { setSaveError(true); }
    completedGroups(state, steps).forEach(group => {
      if (!notified.current.has(group)) { notified.current.add(group); onGroup.current(group); }
    });
  }, [state, signature, steps, storageKey]);

  const step = steps[state.cursor];
  const isRest = state.phase === "rest";
  const isReady = state.phase === "ready";
  const isFinished = state.phase === "finished";
  const video = getPreparedVideo(step.id);
  const displayGroup = (s: SessionStep) => s.group === "abs" ? s.key : s.group;
  const groups = [...new Set(steps.map(displayGroup))];
  const groupIndex = groups.indexOf(displayGroup(step));
  const doneGroups = groups.filter(group => steps.filter(s => displayGroup(s) === group).every(s => state.completed.includes(s.key))).length;
  const askExit = () => { dispatch({ type: "pause" }); setExitOpen(true); };
  const pct = Math.round(state.completed.length / steps.length * 100);
  const restFrom = state.cursor > 0 ? steps[state.cursor - 1] : null;
  const sameExercise = restFrom ? displayGroup(restFrom) === displayGroup(step) : false;

  return createPortal(<dialog ref={dialog} className={`guided-player ${isRest ? "is-rest" : ""}`} aria-label="جلسهٔ تمرین" onCancel={event => { event.preventDefault(); if (isFinished) onClose(); else askExit(); }}>
    <div className="player-shell">
      <div inert={exitOpen}><header className="player-header"><button className="player-exit" onClick={isFinished ? onClose : askExit} aria-label="خروج از تمرین">✕</button><div><span className="player-kicker">{isFinished ? "پایان جلسه" : title}</span><strong>{isFinished ? "خسته نباشی!" : `حرکت ${fa(groupIndex + 1)} از ${fa(groups.length)}`}</strong></div><span className="player-brand">بدن<span>.</span></span></header>
      <div className="player-progress" role="progressbar" aria-label="ست‌های انجام‌شده" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={state.completed.length}><i style={{ width: `${pct}%` }}/></div>
      {isFinished ? <section className="session-finish"><span className="finish-icon"><Icon name="check" size={42}/></span><p className="player-kicker">{doneGroups === groups.length ? "جلسه کامل شد" : "جلسه به پایان رسید"}</p><h1>{doneGroups === groups.length ? "یک قدم قوی‌تر." : "تلاشت ثبت شد."}</h1><p>{doneGroups === groups.length ? "وقتِ نفس گرفتن و استراحته." : "حرکت‌های ردشده انجام‌شده حساب نمی‌شوند."}</p><div className="finish-stats"><div><strong>{fa(doneGroups)} / {fa(groups.length)}</strong><span>حرکت کامل</span></div><div><strong dir="ltr">{time(state.elapsed)}</strong><span>زمان جلسه</span></div><div><strong>{fa(state.completed.length)}</strong><span>ست انجام‌شده</span></div></div><button className="session-primary" onClick={onClose}>بازگشت به برنامه <Icon name="arrow"/></button></section> : <>
        <div className="player-stage"><section className="player-media" aria-label="ویدیوی آموزشی حرکت">
          <div className="media-heading"><span>{isRest ? (sameExercise ? "بعدی · ست بعد" : "بعدی · حرکت بعد") : "آموزش حرکت"}</span><span>{step.seconds ? `${fa(step.seconds)} ثانیه` : `${fa(step.set)} / ${fa(step.sets)} ست`}</span></div>
          <ExerciseVideo id={step.id} label={step.label} paused={state.paused}/>
          <div className="media-footer"><span>ویدیوی آموزشی</span>{video.fallbackUrl && <a href={video.fallbackUrl} target="_blank" rel="noreferrer">باز کردن ویدیو ↗</a>}</div>
        </section>
        <section className="player-control-panel">
          <span className="phase-label" aria-live="polite">{state.paused ? "تایمر متوقف است" : isReady ? "آمادهٔ حرکت؟" : isRest ? "نفس بگیر، استراحت کن" : "نوبت توئه"}</span>
          <h1>{step.label}</h1>
          {!isReady && !isRest && <div className="set-track" aria-label={`ست ${step.set} از ${step.sets}`}>{Array.from({ length: step.sets }, (_, i) => <span key={i} className={i + 1 === step.set ? "current" : i + 1 < step.set ? "past" : ""}>{fa(i + 1)}</span>)}</div>}
          {(isReady || isRest || step.seconds) ? <div className={`session-clock ${isReady ? "ready-clock" : ""}`} role="timer" aria-label={`${Math.ceil(state.remaining)} ثانیه باقی مانده`}><strong dir="ltr">{isReady ? fa(state.remaining) : time(state.remaining)}</strong><span>{isReady ? "ثانیه تا شروع" : isRest ? "تا ادامهٔ تمرین" : "زمان باقی‌مانده"}</span></div> : <div className="rep-counter"><strong>{step.reps ? fa(step.reps) : "تا ناتوانی"}</strong><span>{step.reps ? `تکرار${step.eachSide ? " برای هر طرف" : ""}` : `ست ${fa(step.set)} از ${fa(step.sets)}`}</span></div>}
          <p className="prescription">{step.prescription}{step.holdTop ? " · با مکث در بالا" : ""}{step.eachSide && !step.reps ? " · هر طرف" : ""}</p>
          {step.note && <details className="player-note"><summary>نکتهٔ حرکت</summary><p>{step.note}</p></details>}
          <div className="session-actions">
            {isRest ? <><button className="session-secondary" onClick={() => dispatch({ type: "addRest", seconds: 20 })}>۲۰+ ثانیه</button><button className="session-primary" onClick={() => dispatch({ type: "advance" })}>پایان استراحت <Icon name="arrow"/></button></> : isReady ? <button className="session-primary" onClick={() => dispatch({ type: "advance" })}>آماده‌ام، شروع کن <Icon name="arrow"/></button> : <><button className="session-primary" disabled={state.paused} onClick={() => dispatch({ type: "advance" })}>{step.seconds ? "انجام دادم" : step.set < step.sets ? "ست انجام شد" : "حرکت انجام شد"}<Icon name="check"/></button></>}
          </div>
          <div className="player-transport"><button disabled={state.cursor === 0} onClick={() => dispatch({ type: "previous" })}>قبلی</button><button className="pause-control" onClick={() => dispatch({ type: "toggle" })}>{state.paused ? "▶ ادامه" : "Ⅱ مکث"}</button><button onClick={() => dispatch({ type: "skip" })}>{isReady || isRest ? "رد کردن انتظار" : "رد کردن ست"}</button></div>
          {isRest && <label className="rest-adjust">زمان باقی‌مانده <select aria-label="زمان باقی‌ماندهٔ استراحت" value={Math.ceil(state.remaining)} onChange={e => dispatch({ type: "addRest", seconds: Number(e.target.value) - state.remaining })}><option value={Math.ceil(state.remaining)}>{fa(Math.ceil(state.remaining))} ثانیه</option>{[15,30,45,60,90,120,180].filter(n => n !== Math.ceil(state.remaining)).map(n => <option value={n} key={n}>{fa(n)} ثانیه</option>)}</select></label>}
          {state.paused && <p className="player-hint">تمرین و ویدیو متوقف‌اند؛ هر وقت آماده بودی ادامه بده.</p>}
          <p className="player-saved">{saveError ? "ذخیره روی این مرورگر ممکن نیست؛ با خروج، موقعیت جلسه حفظ نمی‌شود." : "موقعیت جلسه روی همین دستگاه ذخیره می‌شود."}</p>
        </section></div>
      </>}
      </div>{exitOpen && <div className="exit-overlay"><section role="alertdialog" aria-modal="true" aria-labelledby="exit-heading"><h2 id="exit-heading">فعلاً استراحت می‌کنی؟</h2><p>{saveError ? "موقعیت جلسه در این مرورگر ذخیره نمی‌شود." : "ست‌های انجام‌شده و جای فعلی تمرینت حفظ می‌شوند."}</p><button className="session-primary" autoFocus onClick={() => { setExitOpen(false); dispatch({ type: "toggle" }); }}>ادامهٔ تمرین</button><button className="session-secondary" onClick={onClose}>ذخیره و خروج</button></section></div>}
    </div>
  </dialog>, document.body);
}

