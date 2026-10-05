/* Service worker do APP Maria Terra.
   Só guarda o "casco" do app (tela inicial e ícones) para abrir rápido e
   permitir a instalação. NÃO intercepta login Google, Drive, Formulários
   nem nenhum outro endereço externo: tudo isso continua sempre online. */
const VERSAO = 'mt-app-v1';
const CASCO = ['./', './index.html', './manifest.webmanifest', './logo.png',
  './mt-icon-192.png', './mt-icon-512.png', './mt-apple-touch-icon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(CASCO).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return; // externo: não mexe
  // Rede primeiro (sempre a versão mais nova); se estiver sem internet, usa o guardado.
  e.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok) { const cp = res.clone(); caches.open(VERSAO).then((c) => c.put(req, cp)); }
      return res;
    }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});
