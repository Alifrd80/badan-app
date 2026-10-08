"use client";
import { useEffect, useRef, useState } from "react";
import localVideos from "@/lib/localVideos.json";
import { getPreparedVideo } from "@/lib/data";
import basePath from "@/lib/basePath";
export default function ExerciseVideo({ id, label, paused = false }: { id: string; label: string; paused?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  const [blocked, setBlocked] = useState(false);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(true);
  const source = (localVideos as Record<string,string>)[id];
  const original = getPreparedVideo(id);
  useEffect(()=>{setError(false);setBlocked(false);},[id]);
  useEffect(()=>{
    const element=video.current;
    if(!element)return;
    const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{threshold:0.15});
    observer.observe(element);return()=>observer.disconnect();
  },[id]);
  useEffect(()=>{
    const element=video.current;if(!element)return;
    const sync=()=>{if(paused||!visible||document.hidden)element.pause();else{element.muted=true;element.play().then(()=>setBlocked(false)).catch(()=>setBlocked(true));}};
    sync();document.addEventListener('visibilitychange',sync);return()=>document.removeEventListener('visibilitychange',sync);
  },[id,paused,visible]);
  return <div className="exercise-video">
    {source&&!error?<video ref={video} key={id} src={`${basePath}${source}`} aria-label={`ویدیوی ${label}`} autoPlay muted loop playsInline preload="metadata" onError={()=>setError(true)} />:<div className="video-error"><p>ویدیو بارگذاری نشد.</p>{original.fallbackUrl&&<a href={original.fallbackUrl} target="_blank" rel="noreferrer">نمایش نسخهٔ اصلی (نیاز به اینترنت)</a>}</div>}
    {blocked&&!paused&&!error&&<button className="video-play" onClick={()=>video.current?.play().then(()=>setBlocked(false)).catch(()=>setError(true))}>▶ پخش ویدیو</button>}
  </div>;
}
