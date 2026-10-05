/* Registro do app instalável + botão discreto "Instalar app". */
(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {});
    });
  }
  var standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (standalone) return;

  var evento = null;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = 'Instalar app';
  btn.hidden = true;
  btn.setAttribute('style',
    'position:fixed;right:16px;bottom:16px;z-index:9999;padding:12px 20px;border:0;border-radius:999px;' +
    'background:#A85E36;color:#FBF0E4;font:600 15px system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer');
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(btn); });

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); evento = e; btn.hidden = false;
  });
  btn.addEventListener('click', function () {
    if (!evento) return;
    evento.prompt();
    evento.userChoice.finally(function () { evento = null; btn.hidden = true; });
  });
  window.addEventListener('appinstalled', function () { btn.hidden = true; });
})();
