/* KWanus University — offline support.
 *
 * Strategy is deliberately split:
 *   - The page itself is network-first, so a new version of the registrar
 *     lands the moment you are online. A stale campus is worse than a slow one.
 *   - Fonts and icons are cache-first. They never change and they are the
 *     slow part of a cold load.
 *
 * Your record lives in localStorage, not here. Clearing this cache costs you
 * nothing but a re-download; clearing site data costs you the transcript.
 */
const VERSION='ku-v2';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(VERSION)
      /* Individual failures must not abort the whole install. */
      .then(c=>Promise.allSettled(SHELL.map(u=>c.add(u))))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==VERSION).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;

  const url=new URL(req.url);
  const sameOrigin=url.origin===self.location.origin;

  /* The page: fresh when online, cached when not. */
  if(req.mode==='navigate'||(sameOrigin&&url.pathname.endsWith('.html'))){
    e.respondWith(
      fetch(req)
        .then(res=>{
          const copy=res.clone();
          caches.open(VERSION).then(c=>c.put(req,copy)).catch(()=>{});
          return res;
        })
        .catch(()=>caches.match(req).then(hit=>hit||caches.match('./index.html')))
    );
    return;
  }

  /* Everything else: cache first, then network, then give up quietly. */
  e.respondWith(
    caches.match(req).then(hit=>hit||fetch(req).then(res=>{
      /* Opaque cross-origin font responses are still worth keeping. */
      if(res&&(res.ok||res.type==='opaque')){
        const copy=res.clone();
        caches.open(VERSION).then(c=>c.put(req,copy)).catch(()=>{});
      }
      return res;
    }).catch(()=>hit))
  );
});
