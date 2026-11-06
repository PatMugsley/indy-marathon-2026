(function () {
  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var mapsLink = function (q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); };
  var spotById = {};
  S.spots.forEach(function (s, i) { s.n = i + 1; spotById[s.id] = s; });
  S.plan.forEach(function (it) { if (it.spot && it.who) spotById[it.spot].who = it.who; });


  // ---------- Time helpers (minutes since midnight, Indianapolis time) ----------
  function hmToMin(s) { var p = s.split(":"); return (+p[0]) * 60 + (+p[1]); }
  function fmtClock(min, withAmPm) {
    min = Math.round(min);
    var h = Math.floor(min / 60) % 24, m = min % 60;
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + (m < 10 ? "0" : "") + m + (withAmPm === false ? "" : (h < 12 ? " a.m." : " p.m."));
  }
  function paceMin(p) { var x = p.split(":"); return (+x[0]) + (+x[1]) / 60; }
  function duration(p) {
    var t = Math.round(paceMin(p) * 26.2);
    return Math.floor(t / 60) + ":" + (t % 60 < 10 ? "0" : "") + (t % 60);
  }
  // Best case (fast pace) and worst case (slow pace) for a spot.
  function spotMinutes(spot, pace) {
    if (spot.fixedTime) return hmToMin(spot.fixedTime);
    return hmToMin(S.waveStart) + spot.mile * paceMin(pace);
  }
  function spotRange(s) { return [spotMinutes(s, S.fastPace), spotMinutes(s, S.slowPace)]; }
  // "8:38–8:46 a.m." or "11:33 a.m.–12:39 p.m."
  function rangeText(r) {
    var a = fmtClock(r[0]).split(" "), b = fmtClock(r[1]).split(" ");
    return a[1] === b[1] ? a[0] + "–" + b[0] + " " + b[1] : a.join(" ") + "–" + b.join(" ");
  }
  function indyNow() {
    var o = {};
    new Intl.DateTimeFormat("en-US", {
      timeZone: S.timeZone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    return { date: o.year + "-" + o.month + "-" + o.day, min: (+o.hour) * 60 + (+o.minute) };
  }
  function isRaceDay() { return indyNow().date === S.raceDate; }
  function mileLabel(s) { return s.mile === 0 ? "Start" : "Mile " + s.mile; }

  // Minutes for each plan step, so we can mark the next one on race day.
  function stepMinutes(it) {
    if (it.spot) return spotRange(spotById[it.spot])[1]; // next until the worst-case time passes
    if (it.time) return hmToMin(it.time);
    if (it.meet && S.meetingSpot.time) return hmToMin(S.meetingSpot.time);
    return null;
  }
  function nextStep() {
    if (!isRaceDay()) return -1;
    var now = indyNow().min;
    for (var i = 0; i < S.plan.length; i++) {
      var m = stepMinutes(S.plan[i]);
      if (m !== null && m >= now - 5) return i;
    }
    return -1;
  }

  // ---------- Plan ----------
  function renderStatus() {
    var el = $("status"), now = indyNow();
    var days = Math.round((Date.parse(S.raceDate) - Date.parse(now.date)) / 864e5);
    var text;
    if (days > 1) text = days + " days to go · start 8:00 a.m.";
    else if (days === 1) text = "Tomorrow · start 8:00 a.m.";
    else if (days === 0) {
      var i = nextStep();
      if (i >= 0 && S.plan[i].spot) {
        var s = spotById[S.plan[i].spot];
        text = "Next: " + s.name + " · " + (s.fixedTime ? fmtClock(spotMinutes(s)) : rangeText(spotRange(s)));
      } else text = i >= 0 ? "Race day" : "Race day · thanks for cheering!";
    } else text = "Race complete · thanks for cheering!";
    el.innerHTML = '<strong>' + esc(S.runners) + '</strong><span>Wave ' + esc(S.wave) + ' · ' + esc(text) + '</span>';
  }

  function renderPredicted() {
    $("predicted").innerHTML = '<span class="p-label">Predicted finish time</span>' +
      '<span class="p-value">' + duration(S.fastPace) + "–" + duration(S.slowPace) + '</span>';
  }

  // Clock time for the timeline: big h:mm with a small a.m./p.m.
  function clockHtml(min) {
    var t = fmtClock(min).split(" ");
    return t[0] + '<span class="ap"> ' + t[1] + '</span>';
  }
  function whoHtml(who) { return who ? '<span class="who">' + esc(who) + '</span>' : ""; }
  function spotStep(it, s, cls) {
    var time = s.fixedTime
      ? '<span class="t-main">' + clockHtml(spotMinutes(s)) + '</span>' + (s.until ? '<span class="t-early">to ' + s.until + '</span>' : "")
      : (function (r) {
          var a = fmtClock(r[0]).split(" "), b = fmtClock(r[1]).split(" ");
          return '<span class="t-main">' + a[0] + '–' + b[0] + '</span>' +
            '<span class="t-early">' + (a[1] === b[1] ? b[1] : a[1] + "–" + b[1]) + '</span>';
        })(spotRange(s));
    return '<li class="step spot' + cls + '">' +
      '<div class="when">' + time + '</div>' +
      '<div class="body">' +
        '<p class="mile">' + mileLabel(s) + whoHtml(it.who) + '</p>' +
        '<div class="head"><span class="num">' + s.n + '</span><h3>' + esc(s.name) + '</h3></div>' +
        '<p class="where">' + esc(s.where) + '</p>' +
        ((it.note || s.note) ? '<p class="note">' + esc(it.note || s.note) + '</p>' : "") +
        '<div class="actions"><a href="' + mapsLink(s.map) + '" target="_blank" rel="noopener">Directions ↗</a>' +
        '<a href="#map" data-show-spot="' + s.id + '">On our map</a></div>' +
      '</div></li>';
  }

  function renderPlan() {
    var next = nextStep(), raceDay = isRaceDay();
    $("timeline").innerHTML = S.plan.map(function (it, i) {
      var cls = (i === next ? " is-next" : "") + (raceDay && (next < 0 ? indyNow().min > hmToMin("13:00") : i < next) ? " passed" : "");
      if (it.spot) return spotStep(it, spotById[it.spot], cls);
      if (it.meet) {
        var m = S.meetingSpot;
        return '<li class="step meet' + cls + '"><div class="when"><span class="t-main">' + (m.time ? "~" + clockHtml(hmToMin(m.time)) : "After") + '</span></div><div class="body">' +
          '<p class="mile">Meet up' + whoHtml("Everyone + runners") + '</p>' +
          '<div class="head"><span class="num star">★</span><h3>' + esc(m.name) + '</h3></div>' +
          (m.where ? '<p class="where">' + esc(m.where) + '</p>' : "") + '<p class="note">' + esc(m.detail) + '</p>' +
          '<div class="actions">' + (m.map ? '<a href="' + mapsLink(m.map) + '" target="_blank" rel="noopener">Directions ↗</a>' : "") +
          (m.latlng ? '<a href="#map" data-show-spot="meet">On our map</a>' : "") + '</div>' +
          '</div></li>';
      }
      return '<li class="step fixed' + cls + '"><div class="when"><span class="t-main">' + clockHtml(hmToMin(it.time)) + '</span></div>' +
        '<div class="body">' + (it.who ? '<p class="mile">' + whoHtml(it.who) + '</p>' : "") + '<h3>' + esc(it.title) + '</h3>' + (it.detail ? '<p class="note">' + esc(it.detail) + '</p>' : "") + '</div></li>';
    }).join("");
    var d = $("draft");
    d.hidden = !!S.planFinal;
    d.textContent = "Draft: these are candidate spots. Who goes where is still being decided.";
    $("rule").textContent = S.rule || "";
  }

  function wirePlan() {
    $("timeline").addEventListener("click", function (e) {
      var b = e.target.closest("[data-show-spot]");
      if (b) pendingSpot = b.getAttribute("data-show-spot");
    });
  }

  // ---------- Links ----------
  function renderLinks() {
    $("links-list").innerHTML = S.links.map(function (g) {
      return '<h2>' + esc(g.group) + '</h2><ul class="links">' + g.items.map(function (l) {
        var inner = '<span class="l-title">' + esc(l.title) + (l.url ? ' <span aria-hidden="true">↗</span>' : "") + '</span>' +
          '<span class="l-desc">' + esc(l.desc) + '</span>';
        return '<li>' + (l.url ? '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + inner + '</a>' : '<div>' + inner + '</div>') + '</li>';
      }).join("") + '</ul>';
    }).join("");
    $("map-list").innerHTML = S.maps.map(function (m) {
      var img = "maps/" + m.file + ".jpg";
      return '<figure class="map-card"><a href="' + img + '" target="_blank" rel="noopener">' +
        '<img src="maps/thumbs/' + m.file + '.jpg" alt="' + esc(m.title) + ' (official race map)" loading="lazy"></a>' +
        '<figcaption><span>' + esc(m.title) + '</span><a href="' + esc(m.pdf) + '" target="_blank" rel="noopener">PDF</a></figcaption></figure>';
    }).join("");
  }

  // ---------- Interactive map ----------
  // Course points with a mile on every vertex (anchors are official mile
  // markers; miles in between are spread by straight-line distance).
  var course = (function () {
    var C = window.COURSE || [];
    var d = function (a, b) { return Math.hypot((a[0] - b[0]) * 69.05, (a[1] - b[1]) * 53.0); };
    var pts = C.map(function (c) { return { ll: [c[0], c[1]], mile: c.length > 2 ? c[2] : null }; });
    var lastA = 0;
    for (var i = 1; i < pts.length; i++) {
      if (pts[i].mile === null) continue;
      var total = 0, seg = [];
      for (var j = lastA + 1; j <= i; j++) { total += d(pts[j - 1].ll, pts[j].ll); seg.push(total); }
      for (j = lastA + 1; j < i; j++) pts[j].mile = pts[lastA].mile + (pts[i].mile - pts[lastA].mile) * seg[j - lastA - 1] / total;
      lastA = i;
    }
    return pts;
  })();
  function pointAtMile(m) {
    for (var i = 1; i < course.length; i++) {
      var a = course[i - 1], b = course[i];
      if (m <= b.mile) {
        var t = b.mile === a.mile ? 0 : (m - a.mile) / (b.mile - a.mile);
        return [a.ll[0] + (b.ll[0] - a.ll[0]) * t, a.ll[1] + (b.ll[1] - a.ll[1]) * t];
      }
    }
    return course[course.length - 1].ll;
  }

  var ACCENT = "#2459e0";
  var map = null, markers = {}, runnerMarker = null, meMarker = null, pendingSpot = null;
  function popup(s) {
    var t = s.fixedTime
      ? '<div class="pop-time">' + fmtClock(spotMinutes(s)).replace(" ", (s.until ? "–" + s.until + " " : " ")) + '</div>'
      : '<div class="pop-time">' + rangeText(spotRange(s)) + '</div>';
    return '<div class="pop"><div class="pop-mile">' + mileLabel(s) + (s.who ? " · " + esc(s.who) : "") + '</div>' +
      '<div class="pop-name">' + s.n + '. ' + esc(s.name) + '</div>' + t +
      '<div class="pop-where">' + esc(s.where) + '</div>' +
      '<a class="btn" href="' + mapsLink(s.map) + '" target="_blank" rel="noopener">Open in Maps</a></div>';
  }
  function pinIcon(label, cls) {
    return L.divIcon({ className: "pin " + (cls || ""), html: "<span>" + label + "</span>", iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -14] });
  }
  function initMap() {
    if (map || !window.L) return;
    map = L.map("course-map", { zoomControl: true, zoomSnap: 0.25 });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    var line = course.map(function (p) { return p.ll; });
    L.polyline(line, { color: "#ffffff", weight: 9, opacity: .95 }).addTo(map);
    L.polyline(line, { color: ACCENT, weight: 5 }).addTo(map);
    for (var m = 1; m <= 26; m++) {
      L.marker(pointAtMile(m), { icon: L.divIcon({ className: "mile-dot", html: m, iconSize: [20, 20], iconAnchor: [10, 10] }), interactive: false, keyboard: false }).addTo(map);
    }
    S.spots.forEach(function (s) {
      markers[s.id] = L.marker(s.latlng || pointAtMile(s.mile), {
        icon: pinIcon(s.id === "finish" ? "🏁" : s.n, s.id === "finish" ? "finish" : ""),
        zIndexOffset: 1000, title: s.name
      }).addTo(map);
    });
    var m = S.meetingSpot;
    if (m.latlng) {
      markers.meet = L.marker(m.latlng, { icon: pinIcon("★", "meet"), zIndexOffset: 1500, title: "Meeting spot" }).addTo(map)
        .bindPopup('<div class="pop"><div class="pop-mile">Meet up' + (m.time ? " · ~" + fmtClock(hmToMin(m.time)) : "") + '</div>' +
          '<div class="pop-name">' + esc(m.name) + '</div><div class="pop-where">' + esc(m.where || "") + '</div>' +
          (m.map ? '<a class="btn" href="' + mapsLink(m.map) + '" target="_blank" rel="noopener">Open in Maps</a>' : "") + '</div>');
    }
    refreshMap();
  }
  function fitCourse() { map.fitBounds(L.latLngBounds(course.map(function (p) { return p.ll; })), { padding: [12, 12] }); }
  function refreshMap() {
    if (!map) return;
    S.spots.forEach(function (s) { markers[s.id].bindPopup(popup(s)); });
    // On race day, show roughly where the runners are: between the slow-pace
    // and fast-pace positions, with the pin at the midpoint.
    var mile = null, lo = 0, hi = 0;
    if (isRaceDay()) {
      var el = indyNow().min - hmToMin(S.waveStart);
      lo = Math.max(0, el / paceMin(S.slowPace)); hi = Math.min(26.2, el / paceMin(S.fastPace));
      if (el >= 0 && lo <= 26.2) mile = (lo + hi) / 2;
    }
    if (mile === null) { if (runnerMarker) { map.removeLayer(runnerMarker); runnerMarker = null; } return; }
    var ll = pointAtMile(mile);
    var html = '<div class="pop"><div class="pop-name">Runners, roughly</div><div class="pop-where">Between mile ' + lo.toFixed(1) +
      ' and ' + hi.toFixed(1) + '. Check live tracking.</div></div>';
    if (!runnerMarker) runnerMarker = L.marker(ll, { icon: pinIcon("🏃", "runner"), zIndexOffset: 2000 }).addTo(map);
    runnerMarker.setLatLng(ll).bindPopup(html);
  }
  function showMap() {
    if (!window.L) { $("map-fallback").hidden = false; return; }
    var first = !map;
    initMap();
    setTimeout(function () {
      map.invalidateSize();
      if (first) fitCourse();
      if (pendingSpot && markers[pendingSpot]) {
        map.setView(markers[pendingSpot].getLatLng(), 15);
        markers[pendingSpot].openPopup();
      }
      pendingSpot = null;
    }, 50);
  }
  function wireMap() {
    $("fit-btn").addEventListener("click", function () { if (map) fitCourse(); });
    $("locate-btn").addEventListener("click", function () {
      if (!map || !navigator.geolocation) return;
      var btn = this;
      btn.textContent = "Finding you…";
      navigator.geolocation.getCurrentPosition(function (pos) {
        var ll = [pos.coords.latitude, pos.coords.longitude];
        if (!meMarker) meMarker = L.circleMarker(ll, { radius: 9, color: "#fff", weight: 3, fillColor: "#0f172a", fillOpacity: 1 }).addTo(map);
        meMarker.setLatLng(ll);
        map.setView(ll, 15);
        btn.textContent = "Where am I?";
      }, function () { btn.textContent = "Location unavailable"; }, { enableHighAccuracy: true, timeout: 10000 });
    });
  }

  // ---------- Tabs ----------
  var tabs = ["plan", "map", "links"];
  function route() {
    var t = location.hash.replace("#", "");
    if (tabs.indexOf(t) < 0) t = "plan";
    tabs.forEach(function (id) { $("view-" + id).hidden = id !== t; });
    document.querySelectorAll(".tabs a").forEach(function (a) {
      if (a.getAttribute("data-tab") === t) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.body.setAttribute("data-view", t);
    window.scrollTo(0, 0);
    if (t === "map") showMap();
  }

  renderStatus(); renderPredicted(); renderPlan(); renderLinks();
  wirePlan(); wireMap();
  window.addEventListener("hashchange", route);
  route();
  setInterval(function () { renderStatus(); if (isRaceDay()) { renderPlan(); refreshMap(); } }, 60000);
})();
