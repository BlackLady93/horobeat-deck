// HOROBEAT ファンツール：アプリ化（PWA）用のサービスワーカー
// ・サイトのファイル（html/js）：まずネットから新しいものを取り、つながらないときだけ保存したものを使う
// ・カード画像：一度見たものを保存しておき、次からはそれを使う（電波がなくても表示できる）
// ※保存したものを全部入れ替えたいときは VER の数字を上げる
const VER = "1";
const APP = "hb-app-" + VER, IMG = "hb-img-v1";
const CORE = ["./", "index.html", "cards.js", "i18n.js", "manifest.webmanifest", "favicon-32.png", "favicon-192.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  // ないファイルがあっても止まらないように1つずつ保存
  e.waitUntil(caches.open(APP).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("hb-app-") && k !== APP).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  // カード画像（公式サイト）：保存したものを優先
  if (/\/img\/card\//.test(url.pathname) || url.hostname === "wsrv.nl") {
    e.respondWith(caches.open(IMG).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      const res = await fetch(req); if (res && (res.ok || res.type === "opaque")) c.put(req, res.clone()); return res;
    }));
    return;
  }
  // 同じサイトのファイル：ネット優先、だめなら保存したもの
  if (url.origin === location.origin) {
    e.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(APP).then(c => c.put(req, copy)); } return res; })
      .catch(() => caches.match(req).then(r => r || caches.match("index.html"))));
  }
});
