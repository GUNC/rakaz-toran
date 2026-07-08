const C="rakaz-toran-v2";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>clients.claim())));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method==="GET"&&u.origin===location.origin&&u.pathname.includes("/assets/")){
    e.respondWith(caches.open(C).then(c=>c.match(e.request).then(m=>m||fetch(e.request).then(r=>{c.put(e.request,r.clone());return r}))));
    return;
  }
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{const cl=r.clone();caches.open(C).then(c=>c.put(e.request,cl));return r})
      .catch(()=>caches.match(e.request).then(m=>m||caches.match("./"))));
  }
});
