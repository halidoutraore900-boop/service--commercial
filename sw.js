// Toujours la version en ligne ; la copie gardée ne sert que sans
connexion.
const CACHE = 'service-commercial-v2';
const FICHIERS = [
'./',
'manifest.json',
'icon-192.png',
'icon-512.png',
'icon-192-maskable.png',
'icon-512-maskable.png'
];
self.addEventListener('install', e => {
e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)));
self.skipWaiting();
});
// Supprime les anciens caches (v1, etc.)
self.addEventListener('activate', e => {
e.waitUntil(
caches.keys()
.then(noms => Promise.all(noms.filter(n => n !== CACHE).map(n =>
caches.delete(n))))
.then(() => self.clients.claim())
);
});
self.addEventListener('fetch', e => {
const r = e.request;
if (r.method !== 'GET' || new URL(r.url).origin !== location.origin)
return;
e.respondWith(
fetch(r).then(rep => {
if (rep.ok) {
const copie = rep.clone();
caches.open(CACHE).then(c => c.put(r, copie));
}
return rep;
}).catch(() => caches.match(r, { ignoreSearch: true }))
);
});
