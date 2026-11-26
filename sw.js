// Toujours la version en ligne ; la copie gardée ne sert que sans
connexion.
const CACHE = 'service-commercial-v1';
const FICHIERS = ['./', 'manifest.json', 'icon-192.png', 'icon-
512.png'];
self.addEventListener('install', e => {
e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)));
self.skipWaiting();
});
self.addEventListener('activate', e =>
e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
const r = e.request;
if (r.method !== 'GET' || new URL(r.url).origin !== location.origin)
return;
e.respondWith(
fetch(r).then(rep => {
if (rep.ok) { const copie = rep.clone();
caches.open(CACHE).then(c => c.put(r, copie)); }
return rep;
}).catch(() => caches.match(r, { ignoreSearch: true }))
);
});
