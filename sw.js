/* Service worker skorupy: strona ma sie otwierac takze bez zasiegu.
   Wlasne pliki - najpierw siec (zeby poprawki dochodzily od razu), a gdy
   siec nie odpowie w 4 s albo jej nie ma - kopia z pamieci urzadzenia.
   Czcionki - najpierw pamiec. Zapytan do API GitHuba nie dotyka. */
var C = "bm-skorupa-v1";

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(function (c) {
    return c.addAll(["./", "manifest.webmanifest", "ikona-192.png"]);
  }).catch(function () {}));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(self.clients.claim());
});

function siecPotemPamiec(zap) {
  return caches.open(C).then(function (c) {
    return new Promise(function (gotowe) {
      var oddane = false;
      function oddaj(odp) { if (!oddane && odp) { oddane = true; gotowe(odp); } }
      var t = setTimeout(function () {
        c.match(zap, { ignoreSearch: true }).then(oddaj);
      }, 4000);
      fetch(zap).then(function (odp) {
        clearTimeout(t);
        if (odp && odp.ok) c.put(zap, odp.clone());
        oddaj(odp);
      }).catch(function () {
        clearTimeout(t);
        c.match(zap, { ignoreSearch: true }).then(function (m) { oddaj(m || Response.error()); });
      });
    });
  });
}

function pamiecPotemSiec(zap) {
  return caches.open(C).then(function (c) {
    return c.match(zap).then(function (m) {
      return m || fetch(zap).then(function (odp) {
        if (odp && (odp.ok || odp.type === "opaque")) c.put(zap, odp.clone());
        return odp;
      });
    });
  });
}

self.addEventListener("fetch", function (e) {
  var zap = e.request;
  if (zap.method !== "GET") return;
  var u = new URL(zap.url);
  if (u.origin === self.location.origin) {
    if (/\/_(github|test)\//.test(u.pathname)) return;   /* atrapa API w testach lokalnych */
    e.respondWith(siecPotemPamiec(zap));
  } else if (/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)) {
    e.respondWith(pamiecPotemSiec(zap));
  }
});
