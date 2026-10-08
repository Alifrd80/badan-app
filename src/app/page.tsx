"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {getWeek,levels,todayKey,typeTitle,weekdayTitleForToday,absCircuit,exercises} from "@/lib/data";
import {useProgress,useSettings} from "@/lib/useProgress";
import Icon from "@/components/Icon";
import basePath from "@/lib/basePath";
const fa=(n:number)=>n.toLocaleString("fa-IR");
export default function Home(){
 const {level,week,changeWeek}=useSettings();
 const {isDone,isAbsDone}=useProgress(level);
 const [today,setToday]=useState("");
 const [todayTitle,setTodayTitle]=useState("");
 useEffect(()=>{const update=()=>{setToday(todayKey());setTodayTitle(weekdayTitleForToday())};update();const timer=setInterval(update,60000);return()=>clearInterval(timer)},[]);
 const weekData=getWeek(level,week);
 if(!weekData)return null;
 const todayDay=weekData.days.find(d=>d.key===today);
 const restDay=!todayDay||todayDay.type==="rest";
 const doneCount=todayDay?.exercises.filter((_,i)=>isDone(week,today,i)).length??0,totalCount=todayDay?.exercises.length??0;
 const allDone=!restDay&&doneCount===totalCount&&(!todayDay?.hasAbs||isAbsDone(week,today));
 const trainingDays=weekData.days.filter(d=>d.type!=="rest");
 const completedDays=trainingDays.filter(d=>d.exercises.length>0&&d.exercises.every((_,i)=>isDone(week,d.key,i))&&(!d.hasAbs||isAbsDone(week,d.key))).length;
 const percent=trainingDays.length?Math.round(completedDays/trainingDays.length*100):0;
 return <div className="dashboard">
 <div className="page-heading"><div><p className="eyebrow">هر روز، یک قدم قوی‌تر</p><h1>وقتِ تمرین توئه<span>!</span></h1></div><span className="date-tag"><Icon name="calendar" size={18}/>{todayTitle} · هفتهٔ {fa(week)}</span></div>
 <div className="dashboard-grid"><div className="training-column">
 <section className="today-card mahdi-hero"><img className="workout-photo" src={`${basePath}/images/hero-mahdi.webp`} alt="تصویر ورزشکار برای تمرین امروز"/><div className="today-content"><span className="lime-tag">{allDone?"تمرین امروز انجام شد":restDay?"فرصت بازیابی":"تمرین امروز"}</span><h2>{restDay?"امروز، ریکاوری":typeTitle(todayDay!.type)}{!restDay&&todayDay?.hasAbs&&<small>+ سرکیت شکم</small>}</h2><p>{restDay?"به بدن‌تان ریکاوری بدهید؛ آب کافی بنوشید و شب حتماً استراحت کنید.":`${fa(totalCount)} حرکت · سطح ${levels.find(l=>l.key===level)?.fa} · با وزن بدن`}</p><Link className="primary-action" href={restDay?"/program":`/day/${week}/${today}`}>{restDay?"مشاهدهٔ برنامه":allDone?"مرور تمرین امروز":doneCount?"ادامهٔ تمرین":"شروع تمرین"}<Icon name="arrow" size={20}/></Link>{!restDay&&<div className="today-progress"><span>{fa(doneCount)} از {fa(totalCount)} حرکت انجام شده</span><div><i style={{width:`${totalCount?doneCount/totalCount*100:0}%`}}/></div></div>}</div><span className="photo-caption" dir="ltr">HOME / WORKOUT</span></section>
 <section className="week-section"><div className="section-heading"><h2>برنامهٔ این هفته</h2><Link href="/program">برنامهٔ کامل <Icon name="arrow" size={17}/></Link></div><div className="week-days">{weekData.days.map((d,index)=>{const rest=d.type==="rest",done=d.exercises.filter((_,i)=>isDone(week,d.key,i)).length,complete=!rest&&d.exercises.length>0&&done===d.exercises.length&&(!d.hasAbs||isAbsDone(week,d.key));const contents=<><span className="day-index">{complete?<Icon name="check" size={19}/>:fa(index+1).padStart(2,"۰")}</span><div className="day-description"><strong>{d.fa}{d.key===today&&<em>امروز</em>}</strong><span>{typeTitle(d.type)}{d.hasAbs?" + شکم":""}</span></div><span className="day-count">{rest?"بازیابی بدن":`${fa(done)}/${fa(d.exercises.length)} حرکت`}</span>{!rest&&<span className="day-open"><Icon name="arrow" size={18}/></span>}</>;return rest?<div className="day-row rest" key={d.key}>{contents}</div>:<Link className={`day-row ${d.key===today?"is-today":""} ${complete?"complete":""}`} href={`/day/${week}/${d.key}`} key={d.key}>{contents}</Link>})}</div></section></div>
 <aside className="settings-column"><section className="settings-card"><div className="section-heading"><h2>برنامهٔ من</h2><Icon name="workout" size={21}/></div><p className="field-label">سطح تمرین</p><div className="assigned-level"><strong>{levels.find(l=>l.key===level)?.fa}</strong><span>انتخاب‌شده براساس ارزیابی اولیه</span></div><div className="week-label"><p className="field-label">هفتهٔ تمرین</p><span>{fa(week)} از ۱۳</span></div><div className="week-picker">{Array.from({length:13},(_,i)=><button key={i} onClick={()=>changeWeek(i+1)} aria-label={`هفته ${fa(i+1)}`} aria-pressed={week===i+1} className={week===i+1?"selected":""}>{fa(i+1)}</button>)}</div></section>
 <section className="progress-card"><div className="section-heading"><h2>قدم‌های این هفته</h2><Icon name="bolt" size={21}/></div><div className="progress-detail"><div className="progress-ring" style={{background:`conic-gradient(var(--accent) ${percent}%,#33372d 0)`}}><div><strong>{fa(percent)}<small>٪</small></strong></div></div><div><strong>{fa(completedDays)} <span>از {fa(trainingDays.length)} جلسه</span></strong><p>تمرین کامل‌شده</p></div></div><div className="progress-note">{completedDays?"هر جلسه، یک قدم رو به جلو.":"اولین قدم را همین امروز بردار."}</div></section>
 <section className="quick-section"><div className="section-heading"><h2>کنارِ تمرین</h2></div><div className="quick-links">{[{href:"/exercises",title:"آموزش حرکات",desc:`ویدیوی ${fa(exercises.length)} حرکت`,icon:"play"},{href:"/abs",title:"سرکیت شکم",desc:`${fa(absCircuit.workSeconds)} ثانیه هر حرکت`,icon:"workout"},{href:"/pull-no-bar",title:"پول بدون میله",desc:"برنامهٔ جایگزین",icon:"bolt"},{href:"/nutrition",title:"تغذیه",desc:"محاسبهٔ کالری و رژیم",icon:"leaf"}].map(it=><Link key={it.href} href={it.href}><span className="quick-icon"><Icon name={it.icon}/></span><div><strong>{it.title}</strong><span>{it.desc}</span></div><Icon name="arrow" size={17}/></Link>)}</div></section></aside></div></div>
}

