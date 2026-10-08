import { readdirSync, writeFileSync, copyFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
const paths=[];
function walk(dir){for(const file of readdirSync(dir,{withFileTypes:true})){const p=join(dir,file.name);if(file.isDirectory())walk(p);else if(!p.endsWith('.map')){let rel=relative('out',p).replaceAll('\\','/');const marker=rel.indexOf('/__next.');if(marker>=0&&rel.slice(marker+1).includes('/')){const alias=rel.slice(0,marker+1)+rel.slice(marker+1).replaceAll('/','.');copyFileSync(p,join('out',alias));paths.push('/'+alias);}let url='/'+rel;if(url.endsWith('/index.html'))url=url.slice(0,-10);paths.push(url);}}}
walk('out');writeFileSync('out/offline-assets.json',JSON.stringify([...new Set(paths)]));
