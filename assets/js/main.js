/* ==========================================================================
   ADORA — Interacción y render del catálogo
   Los datos viven en assets/js/data.js (window.ADORA).
   ========================================================================== */
(function () {
  "use strict";

  var D = window.ADORA;
  if (!D) return;

  var PENDING = "[CONFIRMAR CON ADORA]";
  var BOOKING_PENDING = "[AGREGAR LINK DE RESERVA]";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function colones(n) {
    return "₡" + Number(n).toLocaleString("es-CR").replace(/\s|,/g, ".").replace(/ /g, ".");
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function byId(id) {
    for (var i = 0; i < D.services.length; i++) if (D.services[i].id === id) return D.services[i];
    return null;
  }
  function isUrl(v) { return typeof v === "string" && /^https?:\/\//.test(v); }

  var ICONS = {
    hand: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M11 17V7.5a1.5 1.5 0 0 1 3 0V15m0-1V5.5a1.5 1.5 0 0 1 3 0V15m0-1V6.5a1.5 1.5 0 0 1 3 0V16m0-3.5a1.5 1.5 0 0 1 3 0V19c0 5-3 8-7.5 8S9 24.5 7.5 21.5l-2-4a1.6 1.6 0 0 1 2.7-1.7L11 19" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 6.4c0-.8.4-1.4 1-1.4s1 .6 1 1.4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    foot: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 28c-3.5 0-5-2.6-5-5.5 0-3.5 2-5.5 2.5-9S9 7 12.5 7 17 10 17 13s-1 5-1 8 1.5 3 1.5 4.5S15.5 28 12 28Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="19.5" cy="7" r="1.6" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="22.5" cy="9.5" r="1.3" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="24.5" cy="12.8" r="1.1" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="25.4" cy="16.4" r="1" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
    eye: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 18c3.5-4.5 7.5-6.5 12-6.5S24.5 13.5 28 18c-3.5 3.5-7.5 5-12 5S7.5 21.5 4 18Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><circle cx="16" cy="17.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M6 8.5c4-2.5 7-3 10-3s6 .5 10 3M9 13.5 7.5 11M13 12l-.6-3M19 12l.6-3M23 13.5l1.5-2.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    cup: '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 12h16v6a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-6Z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M23 14h1.5a3 3 0 0 1 0 6H22.5M6 28h20M12 5c-1 1.5 1 2.5 0 4M16 4c-1 1.5 1 2.5 0 4M20 5c-1 1.5 1 2.5 0 4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  };

  /* ---------- toast (enlaces pendientes / error) ---------- */
  var toast = $("[data-toast]");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.hidden = false;
    requestAnimationFrame(function () { toast.classList.add("is-visible"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () { toast.hidden = true; }, 300);
    }, 3800);
  }

  /* ---------- enlaces de reserva ---------- */
  function bookingHref(serviceName) {
    var wa = (D.links.whatsapp || "").replace(/\D/g, "");
    if (wa) {
      var txt = "Hola Adora, quiero reservar una cita" + (serviceName ? " para: " + serviceName : "") + ".";
      return "https://wa.me/" + wa + "?text=" + encodeURIComponent(txt);
    }
    if (isUrl(D.links.booking)) return D.links.booking;
    return null;
  }

  function wireLink(el, href, pendingMsg) {
    if (href) {
      el.setAttribute("href", href);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      el.removeAttribute("data-pending");
    } else {
      el.setAttribute("data-pending", pendingMsg);
      el.setAttribute("href", "#reserva");
    }
  }

  function wireBookingButtons(ctx) {
    $$("[data-booking]", ctx).forEach(function (el) {
      wireLink(el, bookingHref(el.getAttribute("data-service")), "Enlace de reserva pendiente " + BOOKING_PENDING);
    });
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-pending]");
    if (!el) return;
    showToast(el.getAttribute("data-pending"));
    // Si ya estamos en #reserva no hace falta desplazar
    if (el.closest("#reserva")) e.preventDefault();
  });

  /* ---------- imágenes con loading / error ---------- */
  // compact: sin nombre visible (cuando la tarjeta ya tiene su propio título)
  function placeholderHTML(label, compact) {
    return '<div class="ph" role="img" aria-label="' + esc("Foto pendiente: " + label) + '">' +
      '<svg class="ph-ornament" viewBox="0 0 120 160" aria-hidden="true"><path d="M60 8c18 0 30 16 30 40v70c0 18-13 30-30 30S30 136 30 118V48C30 24 42 8 60 8Z" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>' +
      '<span class="ph-label">' + (compact ? "" : esc(label) + "<br>") + "<small>[foto pendiente]</small></span></div>";
  }

  function imgHTML(src, alt, cls, w, h) {
    return '<img class="' + (cls || "") + '" src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async"' +
      (w ? ' width="' + w + '" height="' + h + '"' : "") + ">";
  }

  // Marca contenedores .media como cargando y cambia a placeholder si falla.
  function watchImages(ctx) {
    $$(".media img", ctx).forEach(function (img) {
      var box = img.closest(".media");
      function done() { box.classList.remove("is-loading"); box.classList.add("is-loaded"); }
      function fail() {
        box.classList.remove("is-loading");
        box.classList.add("is-error");
        box.innerHTML = placeholderHTML(box.getAttribute("data-label") || "Imagen no disponible", box.hasAttribute("data-compact"));
      }
      if (img.complete && img.naturalWidth) return done();
      if (img.complete && !img.naturalWidth && img.src) return fail();
      box.classList.add("is-loading");
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", fail, { once: true });
    });
  }

  function media(src, alt, label, cls, compact) {
    return '<div class="media ' + (cls || "") + '" data-label="' + esc(label) + '"' + (compact ? " data-compact" : "") + ">" +
      (src ? imgHTML(src, alt) : placeholderHTML(label, compact)) + "</div>";
  }

  /* ---------- HERO ---------- */
  (function hero() {
    var fig = $("[data-hero-photo]");
    if (!fig || !D.hero || !D.hero.image) return;
    var img = new Image();
    img.alt = D.hero.alt || "Adora";
    img.className = "hero-img";
    img.decoding = "async";
    img.onload = function () {
      fig.innerHTML = "";
      fig.appendChild(img);
      fig.classList.add("is-loaded");
      fig.parentNode.classList.add("has-photo");
    };
    img.src = D.hero.image; // si falla, queda el placeholder
  })();

  /* ---------- SERVICIOS (tabs) ---------- */
  var tabsEl = $("[data-tabs]");
  var panelsEl = $("[data-panels]");
  var boardTitle = $("[data-board-title]");
  var boardKicker = $("[data-board-kicker]");
  var selectTab = function () {};

  function serviceCard(s, i) {
    var cat = D.categories.filter(function (c) { return c.id === s.category; })[0] || {};
    var visual = s.image
      ? media(s.image, s.name, s.name, "svc-media")
      : '<span class="svc-icon" aria-hidden="true">' + (ICONS[cat.icon] || "") + "</span>";
    var tags = "";
    if (s.addon) tags += '<span class="tag tag-addon">Adicional · retiro</span>';
    if (s.badge) tags += '<span class="tag">' + esc(s.badge) + "</span>";

    return '<li class="svc reveal" style="--i:' + i + '">' +
      '<span class="svc-n" aria-hidden="true">' + pad(i + 1) + "</span>" +
      visual +
      '<div class="svc-body">' +
        '<h4 class="svc-name">' + esc(s.name) + "</h4>" +
        '<p class="svc-desc">' + esc(s.description) + "</p>" +
        '<p class="svc-meta">' + (s.duration ? esc(s.duration) : "Duración por confirmar") + "</p>" +
        (tags ? '<div class="svc-tags">' + tags + "</div>" : "") +
      "</div>" +
      '<div class="svc-side">' +
        '<p class="svc-price"><span class="sr-only">Precio: </span>' + colones(s.price) + "</p>" +
        '<a class="btn btn-pink-outline btn-xs" data-booking data-service="' + esc(s.name) + '" href="#reserva" aria-label="Reservar ' + esc(s.name) + '">Reservar</a>' +
      "</div>" +
    "</li>";
  }

  function renderPanel(cat) {
    var list = D.services.filter(function (s) { return s.category === cat.id; });
    var groups = [];
    list.forEach(function (s) {
      var g = s.group || "";
      var last = groups[groups.length - 1];
      if (!last || last.name !== g) groups.push((last = { name: g, items: [] }));
      last.items.push(s);
    });
    var idx = 0;
    var html = "";
    groups.forEach(function (g) {
      html += '<div class="svc-group">' +
        (g.name ? '<h4 class="svc-group-title"><span>' + esc(g.name) + "</span></h4>" : "") +
        '<ul class="svc-list" role="list">' +
        g.items.map(function (s) { return serviceCard(s, idx++); }).join("") +
        "</ul></div>";
    });
    if (cat.note) html += '<p class="board-note"><span class="todo todo-light">' + esc(cat.note) + "</span></p>";
    return html;
  }

  function buildTabs() {
    if (!tabsEl || !panelsEl) return;
    tabsEl.innerHTML = D.categories.map(function (c, i) {
      var count = D.services.filter(function (s) { return s.category === c.id; }).length;
      return '<button class="tab" role="tab" type="button" id="tab-' + c.id + '" aria-controls="panel-' + c.id + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' +
        '<span class="tab-icon" aria-hidden="true">' + (ICONS[c.icon] || "") + "</span>" +
        '<span class="tab-label">' + esc(c.label) + "</span>" +
        '<span class="tab-count" aria-label="' + count + ' servicios">' + count + "</span></button>";
    }).join("");

    panelsEl.innerHTML = D.categories.map(function (c, i) {
      return '<div class="panel" role="tabpanel" id="panel-' + c.id + '" aria-labelledby="tab-' + c.id + '" tabindex="0"' + (i === 0 ? "" : " hidden") + ">" + renderPanel(c) + "</div>";
    }).join("");

    var tabs = $$(".tab", tabsEl);
    function select(i, focus) {
      var c = D.categories[i];
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute("aria-selected", on);
        t.tabIndex = on ? 0 : -1;
        $("#panel-" + D.categories[j].id).hidden = !on;
      });
      boardTitle.textContent = c.label;
      boardKicker.textContent = c.kicker || "servicios";
      var panel = $("#panel-" + c.id);
      panel.classList.remove("is-entering");
      void panel.offsetWidth;
      panel.classList.add("is-entering");
      $$(".reveal", panel).forEach(function (el) { el.classList.add("is-in"); });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i); });
      t.addEventListener("keydown", function (e) {
        var k = e.key, n = tabs.length, to = null;
        if (k === "ArrowRight") to = (i + 1) % n;
        else if (k === "ArrowLeft") to = (i - 1 + n) % n;
        else if (k === "Home") to = 0;
        else if (k === "End") to = n - 1;
        if (to !== null) { e.preventDefault(); select(to, true); }
      });
    });
    boardTitle.textContent = D.categories[0].label;
    selectTab = function (id) {
      var at = D.categories.map(function (c) { return c.id; }).indexOf(id);
      if (at > -1) select(at);
    };

    // Permitir enlaces directos: #servicios-pedicure
    var m = location.hash.match(/^#servicios-(.+)$/);
    if (m) {
      var at = D.categories.map(function (c) { return c.id; }).indexOf(m[1]);
      if (at > -1) select(at);
    }
  }

  /* ---------- DESTACADOS ---------- */
  function buildFeatured() {
    var el = $("[data-featured]");
    if (!el) return;
    el.innerHTML = D.featured.map(function (f, i) {
      var items = f.services.map(byId).filter(Boolean);
      var prices = items.map(function (s) { return s.price; });
      var min = Math.min.apply(null, prices);
      var many = items.length > 1;
      var first = items[0] ? items[0].name : f.title;
      return '<article class="feat feat-' + (f.tone || "cream") + " feat-" + (i + 1) + ' reveal" style="--i:' + i + '">' +
        media(f.image, f.alt || f.title, f.title, "feat-media") +
        '<div class="feat-body">' +
          '<p class="feat-kicker"><span>' + pad(i + 1) + "</span> " + esc(f.kicker) + "</p>" +
          '<h3 class="feat-title">' + esc(f.title) + "</h3>" +
          '<p class="feat-text">' + esc(f.text) + "</p>" +
          (many
            ? '<ul class="feat-prices">' + items.map(function (s) {
                return "<li><span>" + esc(s.name.replace(f.title + " · ", "").replace(f.title, "Clásico")) + "</span><span>" + colones(s.price) + "</span></li>";
              }).join("") + "</ul>"
            : '<p class="feat-price">' + colones(min) + "</p>") +
          '<a class="btn btn-sm feat-btn" data-booking data-service="' + esc(many ? f.title : first) + '" href="#reserva">Reservar <span class="btn-arrow" aria-hidden="true">→</span></a>' +
        "</div></article>";
    }).join("");
  }

  /* ---------- COFFEE ---------- */
  function buildCoffee() {
    var grid = $("[data-coffee]");
    var index = $("[data-coffee-index]");
    var note = $("[data-coffee-note]");
    if (!grid) return;
    var items = D.coffee.items;
    grid.innerHTML = items.map(function (c, i) {
      return '<li class="cup reveal" style="--i:' + i + '; --float-d:' + (5.5 + (i % 3) * 0.9) + 's; --float-delay:-' + (i * 0.7) + 's" tabindex="0">' +
        '<span class="cup-n" aria-hidden="true">' + esc(c.n) + "</span>" +
        '<div class="cup-figure media" data-label="' + esc(c.name) + '">' + imgHTML(c.image, c.name, "cup-img", 480, 480) + "</div>" +
        '<p class="cup-name"><span class="sr-only">' + esc(c.n) + ". </span>" + esc(c.name) + "</p>" +
        "</li>";
    }).join("");

    // Índice en 3 columnas, como el menú impreso
    var cols = [items.slice(0, 3), items.slice(3, 6), items.slice(6, 9)];
    index.innerHTML = '<ul class="coffee-cols" aria-hidden="true">' + cols.map(function (col) {
      return "<li><ul>" + col.map(function (c) { return "<li><b>" + esc(c.n) + "</b> " + esc(c.name) + "</li>"; }).join("") + "</ul></li>";
    }).join("") + "</ul>" +
      '<p class="coffee-price">' + esc(D.coffee.priceLabel) + "</p>";
    if (note) note.textContent = D.coffee.note;

    // En touch: tocar activa la micro-animación
    $$(".cup", grid).forEach(function (cup) {
      cup.addEventListener("click", function () {
        $$(".cup.is-active", grid).forEach(function (o) { if (o !== cup) o.classList.remove("is-active"); });
        cup.classList.toggle("is-active");
      });
    });
  }

  /* ---------- GALERÍA ---------- */
  function buildGallery() {
    var el = $("[data-gallery]");
    if (!el) return;
    el.innerHTML = D.gallery.map(function (g, i) {
      return '<figure class="g-item ' + (g.size ? "g-" + g.size : "") + (g.cream ? " g-cream" : "") + (g.contain ? " g-contain" : "") + ' reveal" style="--i:' + (i % 4) + '">' +
        media(g.image, g.alt, g.label, "g-media", true) +
        '<figcaption>' + esc(g.label) + "</figcaption></figure>";
    }).join("");
  }

  /* ---------- ACCESOS RÁPIDOS ---------- */
  function buildQuick() {
    $$("[data-icon]").forEach(function (el) { el.innerHTML = ICONS[el.getAttribute("data-icon")] || ""; });
    $$("[data-goto-tab]").forEach(function (a) {
      a.addEventListener("click", function () {
        selectTab(a.getAttribute("data-goto-tab"));
        $$(".quick-chip").forEach(function (o) { o.classList.toggle("is-active", o === a); });
      });
    });
  }

  /* ---------- DISEÑOS (trending) ---------- */
  function buildTrending() {
    var el = $("[data-trending]");
    if (!el || !D.trending) return;
    var saved = {};
    try { saved = JSON.parse(localStorage.getItem("adora-favs") || "{}"); } catch (e) { saved = {}; }
    el.innerHTML = D.trending.map(function (t, i) {
      return '<li class="trend reveal" style="--i:' + i + '">' +
        media(t.image, t.alt || t.name, t.name, "trend-media", true) +
        '<div class="trend-foot"><span class="trend-name">' + esc(t.name) + "</span>" +
        '<button class="fav" type="button" aria-pressed="' + !!saved[t.name] + '" aria-label="Guardar ' + esc(t.name) + ' en favoritos" data-fav="' + esc(t.name) + '">' + ICONS.heart + "</button></div></li>";
    }).join("");
    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-fav]");
      if (!b) return;
      var on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on);
      saved[b.getAttribute("data-fav")] = on;
      try { localStorage.setItem("adora-favs", JSON.stringify(saved)); } catch (err) { /* sin storage */ }
    });
  }

  /* ---------- SELECTOR DE RESERVA ---------- */
  function buildPlanner() {
    var form = $("[data-planner]");
    if (!form) return;
    var catsEl = $("[data-planner-cats]", form);
    var svcEl = $("[data-planner-services]", form);
    var datesEl = $("[data-planner-dates]", form);
    var timesEl = $("[data-planner-times]", form);
    var summary = $("[data-planner-summary]", form);
    var state = { cat: D.categories[0].id, service: null, date: null, time: null };

    function pill(group, value, label, on, extra) {
      return '<button type="button" class="pill' + (extra || "") + '" data-group="' + group + '" data-value="' + esc(value) + '" aria-pressed="' + !!on + '">' + label + "</button>";
    }
    function renderCats() {
      catsEl.innerHTML = D.categories.map(function (c) { return pill("cat", c.id, esc(c.label), c.id === state.cat); }).join("");
    }
    function renderServices() {
      svcEl.innerHTML = D.services.filter(function (s) { return s.category === state.cat; }).map(function (s) {
        return pill("service", s.id, esc(s.name) + ' <small>' + colones(s.price) + "</small>", s.id === state.service, " pill-svc");
      }).join("");
    }
    function renderDates() {
      var days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
      var out = "", d = new Date();
      for (var i = 0; i < 7; i++) {
        var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
        var v = x.getFullYear() + "-" + pad(x.getMonth() + 1) + "-" + pad(x.getDate());
        var lbl = i === 0 ? "Hoy" : days[x.getDay()];
        out += pill("date", v, '<span class="date-d">' + lbl + '</span><span class="date-n">' + x.getDate() + "</span>", state.date === v, " pill-date");
      }
      datesEl.innerHTML = out;
    }
    function renderTimes() {
      timesEl.innerHTML = (D.bookingTimes || []).map(function (t) { return pill("time", t, esc(t), state.time === t); }).join("");
    }
    function text() {
      var s = byId(state.service);
      var parts = [];
      if (s) parts.push(s.name + " (" + colones(s.price) + ")");
      if (state.date) {
        var dt = new Date(state.date + "T12:00:00");
        parts.push(dt.toLocaleDateString("es-CR", { weekday: "long", day: "numeric", month: "long" }));
      }
      if (state.time) parts.push(state.time.toLowerCase());
      return parts.join(" · ");
    }
    function update() { summary.textContent = text() ? "Tu selección: " + text() : ""; }

    form.addEventListener("click", function (e) {
      var b = e.target.closest(".pill");
      if (!b) return;
      var g = b.getAttribute("data-group"), v = b.getAttribute("data-value");
      if (g === "cat") { state.cat = v; state.service = null; renderCats(); renderServices(); }
      else {
        state[g] = state[g] === v ? null : v;
        $$('.pill[data-group="' + g + '"]', form).forEach(function (o) { o.setAttribute("aria-pressed", o.getAttribute("data-value") === state[g]); });
      }
      update();
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!state.service) { showToast("Elegí un servicio para continuar."); svcEl.querySelector(".pill").focus(); return; }
      var href = bookingHref(text());
      if (href) window.open(href, "_blank", "noopener");
      else showToast("Enlace de reserva pendiente " + BOOKING_PENDING);
    });
    renderCats(); renderServices(); renderDates(); renderTimes(); update();
  }

  /* ---------- INFO DEL LOCAL ---------- */
  function buildInfo() {
    var b = D.business, l = D.links;
    var hoursHTML = b.hours && b.hours.length
      ? '<dl class="hours">' + b.hours.map(function (h) { return "<div><dt>" + esc(h.days) + "</dt><dd>" + esc(h.hours) + "</dd></div>"; }).join("") + "</dl>"
      : '<p class="pending">' + PENDING + "</p>";
    $$("[data-hours]").forEach(function (el) { el.innerHTML = hoursHTML; });

    var loc = b.address
      ? "<p>" + esc(b.address) + (b.city ? ", " + esc(b.city) : "") + "</p>" + (isUrl(b.mapsUrl) ? '<p><a class="link" href="' + esc(b.mapsUrl) + '" target="_blank" rel="noopener">Ver en Google Maps ↗</a></p>' : "")
      : "<p>" + esc(b.country) + '</p><p class="pending">Dirección ' + PENDING + "</p>";
    $$("[data-location]").forEach(function (el) { el.innerHTML = loc; });

    var pol = $("[data-policies]");
    if (pol) { pol.textContent = b.policies || PENDING; if (!b.policies) pol.className = "pending"; }

    var contact = $("[data-contact]");
    if (contact) {
      var rows = [];
      rows.push(isUrl(l.instagram) ? '<li><a class="link" href="' + esc(l.instagram) + '" target="_blank" rel="noopener">Instagram ↗</a></li>' : '<li>Instagram <span class="pending">' + PENDING + "</span></li>");
      var wa = (l.whatsapp || "").replace(/\D/g, "");
      rows.push(wa ? '<li><a class="link" href="https://wa.me/' + wa + '" target="_blank" rel="noopener">WhatsApp ↗</a></li>' : '<li>WhatsApp <span class="pending">' + PENDING + "</span></li>");
      if (isUrl(l.facebook)) rows.push('<li><a class="link" href="' + esc(l.facebook) + '" target="_blank" rel="noopener">Facebook ↗</a></li>');
      if (isUrl(l.tiktok)) rows.push('<li><a class="link" href="' + esc(l.tiktok) + '" target="_blank" rel="noopener">TikTok ↗</a></li>');
      rows.push(b.phone ? '<li><a class="link" href="tel:' + esc(b.phone.replace(/\s/g, "")) + '">' + esc(b.phone) + "</a></li>" : "");
      rows.push(b.email ? '<li><a class="link" href="mailto:' + esc(b.email) + '">' + esc(b.email) + "</a></li>" : "");
      contact.innerHTML = rows.join("");
    }

    // Botones de canal en la sección de reserva
    $$("[data-link]").forEach(function (el) {
      var k = el.getAttribute("data-link");
      var href = k === "whatsapp" ? (wa ? "https://wa.me/" + wa : null) : (isUrl(l[k]) ? l[k] : null);
      wireLink(el, href, "Enlace de " + (k === "whatsapp" ? "WhatsApp" : "Instagram") + " pendiente " + PENDING);
    });

    var y = $("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Schema.org (negocio local) ---------- */
  function buildSchema() {
    var b = D.business;
    var data = {
      "@context": "https://schema.org",
      "@type": "NailSalon",
      name: b.name,
      slogan: b.tagline,
      currenciesAccepted: "CRC",
      priceRange: colones(Math.min.apply(null, D.services.map(function (s) { return s.price; }))) + " – " + colones(Math.max.apply(null, D.services.map(function (s) { return s.price; }))),
      image: "assets/img/og-image.jpg",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servicios de Adora",
        itemListElement: D.categories.map(function (c) {
          return {
            "@type": "OfferCatalog",
            name: c.label,
            itemListElement: D.services.filter(function (s) { return s.category === c.id; }).map(function (s) {
              return { "@type": "Offer", price: s.price, priceCurrency: "CRC", itemOffered: { "@type": "Service", name: s.name, description: s.description } };
            }),
          };
        }),
      },
    };
    if (b.address) data.address = { "@type": "PostalAddress", streetAddress: b.address, addressLocality: b.city || undefined, addressCountry: "CR" };
    if (b.phone) data.telephone = b.phone;
    var same = [D.links.instagram, D.links.facebook, D.links.tiktok].filter(isUrl);
    if (same.length) data.sameAs = same;
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ---------- Menú móvil ---------- */
  function mobileMenu() {
    var btn = $(".menu-toggle");
    var menu = $("#mobile-menu");
    if (!btn || !menu) return;
    var label = $(".sr-only", btn);
    function set(open) {
      btn.setAttribute("aria-expanded", open);
      label.textContent = open ? "Cerrar menú" : "Abrir menú";
      document.body.classList.toggle("menu-open", open);
      if (open) {
        menu.hidden = false;
        requestAnimationFrame(function () { menu.classList.add("is-open"); });
        var first = $("a", menu); if (first) first.focus();
      } else {
        menu.classList.remove("is-open");
        setTimeout(function () { if (!menu.classList.contains("is-open")) menu.hidden = true; }, reduceMotion ? 0 : 280);
      }
    }
    btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
    menu.addEventListener("click", function (e) {
      if (e.target === menu || e.target.closest("a")) set(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { set(false); btn.focus(); }
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (m) { if (m.matches) set(false); });
  }

  /* ---------- Header con sombra al hacer scroll ---------- */
  function headerScroll() {
    var h = $(".site-header");
    var ticking = false;
    function upd() { h.classList.toggle("is-scrolled", window.scrollY > 8); ticking = false; }
    window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(upd); ticking = true; } }, { passive: true });
    upd();
  }

  /* ---------- Reveal on scroll ---------- */
  function reveals() {
    var els = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });

    // Las animaciones flotantes del coffee menu solo corren cuando la sección está visible
    var coffee = $("#coffee");
    if (coffee) {
      new IntersectionObserver(function (en) {
        coffee.classList.toggle("is-visible", en[0].isIntersecting);
      }, { threshold: 0.05 }).observe(coffee);
    }
  }

  /* ---------- init ---------- */
  buildTabs();
  buildQuick();
  buildTrending();
  buildPlanner();
  buildFeatured();
  buildCoffee();
  buildGallery();
  buildInfo();
  buildSchema();
  wireBookingButtons(document);
  watchImages(document);
  mobileMenu();
  headerScroll();
  reveals();
})();
