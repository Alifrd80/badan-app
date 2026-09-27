"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import Icon from "./Icon";
const items=[{href:"/",label:"امروز",icon:"home"},{href:"/program",label:"برنامهٔ تمرین",icon:"calendar"},{href:"/abs",label:"سرکیت شکم",icon:"workout"},{href:"/nutrition",label:"تغذیه",icon:"leaf"},{href:"/more",label:"بیشتر",icon:"more"}];
export default function BottomNav(){
 const path=usePathname();
 return <nav className="app-nav" aria-label="ناوبری اصلی"><div className="nav-caption">مسیر تمرین تو</div><div className="nav-items">{items.map(it=>{const active=it.href==="/"?path==="/":it.href==="/program"?path==="/program"||path.startsWith("/day/"):it.href==="/more"?["/more","/exercises","/pull-no-bar","/calorie","/notes"].includes(path):path===it.href;return <Link key={it.href} href={it.href} className={`nav-link ${active?"active":""}`} aria-current={active?"page":undefined}><Icon name={it.icon}/><span>{it.label}</span></Link>})}</div><div className="nav-bottom"><span className="nav-number">۱۳</span><p>هفته تا نسخهٔ قوی‌تر تو</p><small>تمرین با وزن بدن · در خانه</small></div></nav>
}
