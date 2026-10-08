"use client";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { storage, readValue } from "@/lib/storage";
import { levelFromAnswers, questions, validProfile } from "@/lib/assessment";
import { levels } from "@/lib/data";
export default function AppSetup({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const path = usePathname();
  useEffect(() => {
    const p = readValue("badan:profile", null);
    setComplete(validProfile(p));
    if (!validProfile(p)) {
      const draft = readValue<number[]>("badan:assessment-draft", []);
      if (Array.isArray(draft) && draft.every((n,i)=>i<questions.length && Number.isInteger(n) && n>=0 && n<questions[i].options.length)) setAnswers(draft.slice(0, questions.length));
    }
    
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => { const theme = readValue<string>("badan:theme", "system"); document.documentElement.dataset.theme = theme === "system" ? (mq.matches ? "dark" : "light") : theme; };
    apply(); mq.addEventListener("change", apply); window.addEventListener("badan-storage", apply); setReady(true);
    return () => { mq.removeEventListener("change", apply); window.removeEventListener("badan-storage", apply); };
  }, []);
  useEffect(() => { if (ready && complete && path && !path.includes("_not-found")) { try { storage.setItem("badan:last-page", path); } catch {} } }, [path, ready, complete]);
  const finish = () => {
    try {
      const level = levelFromAnswers(answers);
      storage.setItem("badan:level", level);
      storage.setItem("badan:profile", JSON.stringify({version:1, level, answers, createdAt:new Date().toISOString()}));
      storage.removeItem("badan:assessment-draft"); setComplete(true);
    } catch { setError("ذخیره انجام نشد. فضای ذخیره‌سازی دستگاه را بررسی کن و دوباره بزن."); }
  };
  if (!ready) return <div className="setup-loading" role="status">بدن. <span>آمادهٔ یک قدم قوی‌تر</span></div>;
  if (complete) return children;
  const q = questions[step];
  return <main className="setup-screen"><section className="setup-card"><div className="setup-brand">بدن<span>.</span></div><p className="eyebrow">برنامهٔ تو، از نقطهٔ شروع تو</p><div className="setup-progress" aria-label={`مرحله ${step+1} از ۴`}>{[0,1,2,3].map(i=><i className={i<=step?"active":""} key={i}/>)}</div>
    {q ? <><p className="setup-count">سؤال {(step+1).toLocaleString("fa-IR")} از ۳</p><h1>{q.title}</h1><p className="setup-hint">{q.hint}</p><div className="setup-options">{q.options.map((option,i)=><button key={option} aria-pressed={answers[step]===i} onClick={()=>{const next=[...answers];next[step]=i;setAnswers(next);try{storage.setItem("badan:assessment-draft",JSON.stringify(next));}catch{}}}>{option}<span>{answers[step]===i?"✓":"○"}</span></button>)}</div><button className="session-primary" disabled={answers[step]===undefined} onClick={()=>setStep(step+1)}>ادامه ←</button></> : <><span className="setup-result">شروع تو: {levels.find(l=>l.key===levelFromAnswers(answers))?.fa}</span><h1>مسیرت آماده‌ست.</h1><p className="setup-hint">طبق معیار شنا در راهنمای همین برنامه، تمرین‌های سطح تو انتخاب شدند. این پرسش‌ها فقط بار اول نمایش داده می‌شوند.</p>{answers[2]===0&&<p className="setup-hint">میله نداری؟ جایگزین هر حرکت و «پول بدون میله» در برنامه موجود است.</p>}<p className="setup-privacy">پاسخ‌ها و پیشرفتت فقط روی همین دستگاه ذخیره می‌شوند.</p><button className="session-primary" onClick={finish}>بریم سراغ برنامه ←</button></>}
    {step>0&&<button className="setup-back" onClick={()=>setStep(step-1)}>برگشت و اصلاح پاسخ</button>}{error&&<p role="alert">{error}</p>}
  </section></main>;
}
