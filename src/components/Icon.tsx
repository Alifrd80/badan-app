import type { ReactNode } from 'react';
export default function Icon({name,size=22}:{name:string;size?:number}) {
 const paths:Record<string,ReactNode>={
 home:<><path d="m3 10 9-7 9 7v11H3Z"/><path d="M9 21v-8h6v8"/></>,
 calendar:<><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-14 4h2m4 0h2"/></>,
 workout:<path d="m6 4-2 2 14 14 2-2M3 9l6-6M2 6l4-4m9 19 6-6m-3 7 4-4"/>,
 play:<><rect x="3" y="4" width="18" height="16" rx="4"/><path d="m10 8 6 4-6 4Z"/></>,
 leaf:<><path d="M20 3C7 2 2 8 5 15s17 4 15-12Z"/><path d="m3 22 12-13"/></>,
 more:<><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
 arrow:<path d="M20 12H4m6-6-6 6 6 6"/>,check:<path d="m5 12 4 4L19 6"/>,bolt:<path d="m13 2-9 12h7l-1 8 10-13h-8Z"/>
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.workout}</svg>;
}
