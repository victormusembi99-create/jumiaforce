// Kenya Deals Hub helper: rule-based product finder + WhatsApp hand-off. Runs fully in the browser.
(function () {
  'use strict';
  var MAIN = 'https://jforce.jumia.co.ke/s/eeIzZkk';
  var CATS = { phones: 'Phones', appliances: 'Home appliances', wifi: 'WiFi & accessories' };
  var WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';
  var data = null, wa = '254114499160', mainLink = MAIN, PAGE = 3;

  function safeLink(u, fb) { try { var x = new URL(u); if (x.protocol === 'https:' && /(^|\.)jumia\.co\.ke$/.test(x.hostname)) return x.href; } catch (e) {} return fb; }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function waLink(msg) { return 'https://wa.me/' + wa + '?text=' + encodeURIComponent(msg); }
  function greeting() { var h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; }
  function jlink(p) { return safeLink(p.affiliateUrl, safeLink(p.url, mainLink)); }
  function waIcon() {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', '28'); s.setAttribute('height', '28'); s.setAttribute('fill', 'currentColor');
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', WA_PATH); s.appendChild(p); return s;
  }

  // Floating WhatsApp button
  var wab = el('a', 'cb-wa'); wab.href = waLink('Hi Victor, I saw your Jumia deals website and need help choosing.');
  wab.target = '_blank'; wab.rel = 'noopener noreferrer'; wab.setAttribute('aria-label', 'Chat on WhatsApp'); wab.appendChild(waIcon());
  // Launcher + panel
  var launcher = el('button', 'cb-launcher', 'Help me choose'); launcher.type = 'button'; launcher.setAttribute('aria-expanded', 'false');
  var panel = el('div', 'cb-panel'); panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Product helper');
  var head = el('div', 'cb-head'); head.appendChild(el('strong', null, 'Kenya Deals Hub helper'));
  var close = el('button', 'cb-close', '×'); close.type = 'button'; close.setAttribute('aria-label', 'Close helper'); head.appendChild(close);
  var body = el('div', 'cb-body'); body.setAttribute('aria-live', 'polite');
  var row = el('div', 'cb-input'); var input = el('input'); input.type = 'text'; input.maxLength = 60; input.placeholder = 'Type a product, e.g. kettle'; input.setAttribute('aria-label', 'Search products');
  var go = el('button', null, 'Search'); go.type = 'button'; row.appendChild(input); row.appendChild(go);
  panel.appendChild(head); panel.appendChild(body); panel.appendChild(row);
  document.body.appendChild(wab); document.body.appendChild(launcher); document.body.appendChild(panel);

  function scroll() { body.scrollTop = body.scrollHeight; }
  function say(t) { body.appendChild(el('div', 'cb-msg', t)); scroll(); }
  function me(t) { body.appendChild(el('div', 'cb-msg cb-me', t)); }
  function chips(list) {
    var box = el('div', 'cb-chips');
    list.forEach(function (c) {
      var n;
      if (c.href) { n = el('a', 'cb-chip cb-chip-wa', c.label); n.href = c.href; n.target = '_blank'; n.rel = 'noopener noreferrer'; }
      else { n = el('button', 'cb-chip', c.label); n.type = 'button'; n.addEventListener('click', function () { box.remove(); me(c.label); c.fn(); }); }
      box.appendChild(n);
    });
    body.appendChild(box); scroll();
  }
  function card(p) {
    var c = el('div', 'cb-card');
    if (/^images\/[\w.\-]+$/.test(p.image || '')) { var i = el('img'); i.src = p.image; i.alt = ''; i.loading = 'lazy'; c.appendChild(i); }
    var t = el('div', 'cb-card-t'); t.appendChild(el('strong', null, p.name)); t.appendChild(el('span', null, p.meta || ''));
    var a = el('a', 'cb-view', 'View on Jumia'); a.href = jlink(p); a.target = '_blank'; a.rel = 'sponsored noopener noreferrer'; t.appendChild(a);
    c.appendChild(t); body.appendChild(c);
  }
  function waChip(msg) { return { label: 'Ask Victor on WhatsApp', href: waLink(msg) }; }
  function home() {
    chips([
      { label: 'Phones', fn: function () { show('phones', 0); } },
      { label: 'Home appliances', fn: function () { show('appliances', 0); } },
      { label: 'WiFi & accessories', fn: function () { show('wifi', 0); } },
      waChip('Hi Victor, I need help choosing a product.')
    ]);
  }
  function show(cat, off) {
    var list = (data[cat] || []).slice().sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    var part = list.slice(off, off + PAGE);
    if (!part.length) { say('That\'s everything I have here for now.'); } else {
      say(off === 0 ? 'Here are popular picks in ' + CATS[cat].toLowerCase() + ':' : 'More options:');
      part.forEach(card);
    }
    var next = [];
    if (off + PAGE < list.length) next.push({ label: 'Show more', fn: function () { show(cat, off + PAGE); } });
    next.push({ label: 'Start over', fn: function () { say('What else can I help you find?'); home(); } });
    next.push(waChip('Hi Victor, I need help choosing from ' + CATS[cat] + '. My budget is about KSh '));
    chips(next);
  }
  function search(q) {
    q = q.trim().toLowerCase(); if (!q) return;
    me(q);
    var words = q.split(/\s+/), found = [];
    Object.keys(CATS).forEach(function (cat) {
      (data[cat] || []).forEach(function (p) {
        var hay = (p.name + ' ' + (p.meta || '') + ' ' + (p.description || '')).toLowerCase();
        if (words.every(function (w) { return hay.indexOf(w) !== -1; })) found.push(p);
      });
    });
    if (found.length) { say('I found ' + found.length + ' match' + (found.length > 1 ? 'es' : '') + ':'); found.slice(0, 4).forEach(card); }
    else say('I couldn\'t find "' + q + '" in my list.');
    chips([{ label: 'Start over', fn: function () { say('What are you looking for?'); home(); } }, waChip('Hi Victor, I am looking for: ' + q)]);
    input.value = '';
  }
  function start() {
    say(greeting() + '! 👋 I\'m the Kenya Deals Hub helper. What are you looking for today?'); home();
  }
  var started = false;
  function open() {
    panel.hidden = false; launcher.setAttribute('aria-expanded', 'true'); launcher.hidden = true;
    if (started) return; started = true;
    fetch('products.json').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) {
      data = d;
      if (d.settings && /^\d{9,15}$/.test(d.settings.whatsapp || '')) wa = d.settings.whatsapp;
      mainLink = safeLink(d.settings && d.settings.affiliateLink, MAIN);
      wab.href = waLink('Hi Victor, I saw your Jumia deals website and need help choosing.');
      start();
    }).catch(function () {
      data = { phones: [], appliances: [], wifi: [] };
      say('Sorry, I couldn\'t load the products. You can still chat with Victor directly.'); chips([waChip('Hi Victor, I need help choosing a product.')]);
    });
  }
  function shut() { panel.hidden = true; launcher.hidden = false; launcher.setAttribute('aria-expanded', 'false'); launcher.focus(); }
  launcher.addEventListener('click', open);
  close.addEventListener('click', shut);
  go.addEventListener('click', function () { if (data) search(input.value); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && data) search(input.value); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) shut(); });
})();
