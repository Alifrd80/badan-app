const CACHE='badan-offline-v6';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/','/offline/'])).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('badan-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith((async()=>{
   const c=await caches.open(CACHE);const cached=await c.match(r,{ignoreSearch:true});
   if(r.headers.has('range')&&cached){const bytes=await cached.arrayBuffer();const m=/bytes=(\d+)-(\d*)/.exec(r.headers.get('range'));if(m){const start=+m[1],end=m[2]?Math.min(+m[2],bytes.byteLength-1):bytes.byteLength-1;if(start> end)return new Response(null,{status:416});return new Response(bytes.slice(start,end+1),{status:206,headers:{'Content-Type':cached.headers.get('Content-Type')||'video/mp4','Content-Range':`bytes ${start}-${end}/${bytes.byteLength}`,'Accept-Ranges':'bytes','Content-Length':String(end-start+1)}});}}
   if(cached&&r.mode!=='navigate')return cached;
   try{const response=await fetch(r);if(response.ok&&response.status===200)await c.put(r,response.clone());return response;}catch{if(cached)return cached;if(r.mode==='navigate')return (await c.match('/offline/'))||Response.error();return Response.error();}
 })());
});
