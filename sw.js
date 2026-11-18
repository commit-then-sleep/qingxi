/* 清息 · 可选的离线支持
   和 index.html 放在同一个目录即可生效；不放这个文件，应用照常使用（只是没网时打不开）。
   策略：优先走网络（保证你更新 index.html 后立刻生效），没网时退回上一次缓存的页面。 */
const CACHE = 'qingxi-cache-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('./', { ignoreSearch: true })))
  );
});
