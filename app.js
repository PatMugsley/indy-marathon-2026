(function () {
  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var mapsLink = function (q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); };

  // Per-viewer settings (expected pace, wave start). Storage may be unavailable.
  function load(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; } }
  function save(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  var state = {
    pace: load("pace", S.defaultPace),
    waveStart: load("waveStart", S.defaultWaveStart)
  };
  if (S.paceOptions.indexOf(state.pace) < 0) state.pace = S.defaultPace;

  // Time helpers (all wall-clock minutes since midnight, Indianapolis time)
  function hmToMin(s) { var p = s.split(":"); return (+p[0]) * 60 + (+p[1]); }
  function fmtClock(min) {
    min = Math.round(min);
    var h = Math.floor(min / 60) % 24, m = min % 60;
    var ap = h < 12 ? "a.m." : "p.m.";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + (m < 10 ? "0" : "") + m + " " + ap;
  }
  // "11:00" (min:sec per mile) -> minutes per mile
  function paceMin(p) { var x = p.split(":"); return (+x[0]) + (+x[1]) / 60; }
  function finishLabel(p) {
    var t = Math.round(paceMin(p) * 26.2);
    return Math.floor(t / 60) + ":" + (t % 60 < 10 ? "0" : "") + (t % 60);
  }
  // Minutes since midnight when the runners reach a spot at the given pace
  function spotMinutes(spot, pace) {
    if (spot.fixedTime) return hmToMin(spot.fixedTime.replace(/[^\d:]/g, ""));
    return hmToMin(state.waveStart) + spot.mile * paceMin(pace || state.pace);
  }
  function earliestMinutes(spot) { return spotMinutes(spot, S.earliestPace); }
  function indyNow() {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: S.timeZone, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    var o = {};
    parts.forEach(function (p) { o[p.type] = p.value; });
    return { date: o.year + "-" + o.month + "-" + o.day, min: (+o.hour) * 60 + (+o.minute) };
  }
  function isRaceDay() { return indyNow().date === S.raceStartISO.slice(0, 10); }

  // ---------- Home ----------
  function renderCountdown() {
    var start = new Date(S.raceStartISO).getTime();
    var diff = start - Date.now();
    var el = $("countdown");
    if (diff > 0) {
      var d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60;
      var big = d > 0 ? d + (d === 1 ? " day " : " days ") + h + " hr" : h + " hr " + m + " min";
      el.innerHTML = '<div class="num">' + big + '</div><div class="sub">until the start · Sat 8:00 a.m.</div>';
    } else if (isRaceDay() && indyNow().min < hmToMin("15:30")) {
      el.innerHTML = '<div class="num">The race is on!</div><div class="sub">Course closes at ' + S.courseCloses + '</div>';
    } else {
      el.innerHTML = '<div class="num">Race complete</div><div class="sub">Thanks for cheering!</div>';
    }
  }

  function nextSpotIndex() {
    if (!isRaceDay()) return -1;
    var now = indyNow().min;
    for (var i = 0; i < S.spots.length; i++) if (spotMinutes(S.spots[i]) >= now - 5) return i;
    return -1;
  }

  function renderNextUp() {
    var el = $("next-up"), i = nextSpotIndex();
    if (i < 0) { el.hidden = true; return; }
    var s = S.spots[i];
    el.hidden = false;
    el.innerHTML = '<div class="label">Next spot (estimate)</div>' +
      '<div class="title">' + esc(s.name) + ' · around ' + (s.fixedTime || fmtClock(spotMinutes(s))) + '</div>' +
      (s.fixedTime ? "" : '<div>Be there by ' + fmtClock(earliestMinutes(s)) + ' in case they\'re fast.</div>') +
      '<div>' + esc(s.where) + '</div>' +
      '<div class="btn-row" style="margin-top:10px"><a class="btn" href="' + mapsLink(s.map) + '" target="_blank" rel="noopener">Open in Maps</a></div>';
  }

  function renderHome() {
    $("track-btn").href = S.trackingUrl;
    var m = S.meetingSpot;
    $("meet").innerHTML = '<div class="label">After the finish, meet at</div>' +
      '<div class="title">' + esc(m.name) + '</div><p>' + esc(m.detail) + '</p>' +
      (m.mapQuery ? '<div class="btn-row" style="margin-top:10px"><a class="btn" href="' + mapsLink(m.mapQuery) + '" target="_blank" rel="noopener">Open in Maps</a></div>' : "");
    var race = S.schedule[S.schedule.length - 1].items;
    $("raceday").innerHTML = race.map(tlItem).join("");
    renderCountdown();
    renderNextUp();
  }

  function tlItem(it) {
    return '<li><div class="tl-time">' + esc(it.time) + '</div><div class="tl-what">' + esc(it.what) + '</div>' +
      (it.detail ? '<div class="tl-detail">' + esc(it.detail) + '</div>' : "") + '</li>';
  }

  // ---------- Spots ----------
  function renderChips() {
    $("pace-chips").innerHTML = S.paceOptions.map(function (p) {
      return '<button type="button" class="chip" role="radio" aria-checked="' + (p === state.pace) + '" data-pace="' + p + '">' + p + '</button>';
    }).join("");
    $("pace-finish").textContent = "That's about a " + finishLabel(state.pace) + " marathon. Earliest times assume " +
      S.earliestPace + "/mi (" + finishLabel(S.earliestPace) + ").";
  }
  function timeHtml(s) {
    if (s.fixedTime) return '<div class="spot-time">' + s.fixedTime + ' <small>before the start</small></div>';
    return '<div class="spot-time">~' + fmtClock(spotMinutes(s)) + ' <small>expected</small></div>' +
      '<div class="spot-early">As early as ' + fmtClock(earliestMinutes(s)) + '</div>';
  }

  function renderSpots() {
    var nextI = nextSpotIndex(), raceDay = isRaceDay();
    $("spot-list").innerHTML = S.spots.map(function (s, i) {
      var cls = "card spot" + (i === nextI ? " is-next" : "") + (raceDay && nextI >= 0 && i < nextI ? " passed" : "") +
        (raceDay && nextI < 0 && indyNow().min > hmToMin("12:00") ? " passed" : "");
      return '<li class="' + cls + '">' +
        '<div class="spot-head"><span class="spot-name">' + esc(s.name) + (i === nextI ? '<span class="badge">Next</span>' : "") + '</span>' +
        '<span class="spot-mile">' + (s.mile === 0 ? "Start" : "Mile " + s.mile) + '</span></div>' +
        timeHtml(s) +
        '<div class="spot-where">' + esc(s.where) + '</div>' +
        '<p class="spot-why">' + esc(s.why) + '</p>' +
        (s.tags && s.tags.length ? '<div class="tags">' + s.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join("") + '</div>' : "") +
        '<div class="btn-row"><a class="btn" href="' + mapsLink(s.map) + '" target="_blank" rel="noopener">Open in Maps</a>' +
        '<a class="btn secondary" href="#map" data-show-spot="' + i + '">Show on map</a></div>' +
        '</li>';
    }).join("");
  }

  function wireSpotControls() {
    $("pace-chips").addEventListener("click", function (e) {
      var b = e.target.closest("[data-pace]");
      if (!b) return;
      state.pace = b.getAttribute("data-pace");
      save("pace", state.pace);
      renderChips(); renderSpots(); renderNextUp(); refreshMap();
    });
    $("spot-list").addEventListener("click", function (e) {
      var b = e.target.closest("[data-show-spot]");
      if (b) pendingSpot = +b.getAttribute("data-show-spot");
    });
    var ws = $("wave-start");
    ws.value = state.waveStart;
    ws.addEventListener("change", function () {
      if (!/^\d{2}:\d{2}$/.test(ws.value)) return;
      state.waveStart = ws.value;
      save("waveStart", state.waveStart);
      renderSpots(); renderNextUp(); refreshMap();
    });
  }

  // ---------- Runners ----------
  function renderRunners() {
    $("runner-list").innerHTML = S.runners.map(function (r) {
      return '<div class="card runner"><h3>' + esc(r.name) + '</h3>' +
        '<div class="outfit">' + esc(r.outfit) + (r.goal ? " · Goal " + esc(r.goal) : "") + '</div>' +
        '<a class="btn" href="' + S.trackingUrl + '" target="_blank" rel="noopener">Track ' + esc(r.name) + '</a></div>';
    }).join("");
  }

  // ---------- Maps ----------
  function renderMaps() {
    $("map-list").innerHTML = S.maps.map(function (m) {
      var img = "maps/" + m.file + ".jpg";
      return '<div class="card map-card"><a href="' + img + '" target="_blank" rel="noopener">' +
        '<img src="' + img + '" alt="' + esc(m.title) + '" loading="lazy"></a>' +
        '<h3>' + esc(m.title) + '</h3><p>' + esc(m.desc) + '</p>' +
        '<div class="btn-row"><a class="btn" href="' + img + '" target="_blank" rel="noopener">View full size</a>' +
        '<a class="btn secondary" href="' + m.pdf + '" target="_blank" rel="noopener">Official PDF</a></div></div>';
    }).join("");
  }

  // ---------- Info ----------
  function renderInfo() {
    $("schedule").innerHTML = S.schedule.map(function (d) {
      return '<h3 class="day-title">' + esc(d.day) + '</h3><ol class="timeline">' + d.items.map(tlItem).join("") + '</ol>';
    }).join("");
    var li = function (x) { return "<li>" + esc(x) + "</li>"; };
    $("bring").innerHTML = S.tips.bring.map(li).join("");
    $("getting-around").innerHTML = S.tips.gettingAround.map(li).join("");
    $("rules").innerHTML = S.tips.rules.map(li).join("");
    $("spectator-link").href = S.spectatorInfoUrl;
  }

  // ---------- Interactive map ----------
  // Course points with a mile value on every vertex (anchors are official
  // mile markers; miles in between are spread by straight-line distance).
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
  function spotLatLng(s) { return s.latlng || pointAtMile(s.mile); }

  var map = null, spotMarkers = [], runnerMarker = null, meMarker = null, pendingSpot = null;
  function spotPopup(s, i) {
    var t = s.fixedTime
      ? '<div class="pop-time">' + s.fixedTime + ' <small>before the start</small></div>'
      : '<div class="pop-time">~' + fmtClock(spotMinutes(s)) + ' <small>expected</small></div>' +
        '<div class="pop-early">As early as ' + fmtClock(earliestMinutes(s)) + '</div>';
    return '<div class="pop"><div class="pop-mile">' + (s.mile === 0 ? "Start" : "Mile " + s.mile) + '</div>' +
      '<div class="pop-name">' + (i + 1) + '. ' + esc(s.name) + '</div>' + t +
      '<div class="pop-where">' + esc(s.where) + '</div>' +
      '<a class="btn" href="' + mapsLink(s.map) + '" target="_blank" rel="noopener">Directions</a></div>';
  }
  function pinIcon(label, cls) {
    return L.divIcon({ className: "pin " + (cls || ""), html: "<span>" + label + "</span>", iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -14] });
  }
  function initMap() {
    if (map || !window.L) return;
    map = L.map("course-map", { zoomControl: true, tap: true, zoomSnap: 0.25 });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    var line = course.map(function (p) { return p.ll; });
    L.polyline(line, { color: "#ffffff", weight: 9, opacity: .9 }).addTo(map);
    var courseLine = L.polyline(line, { color: "#1d3b72", weight: 5 }).addTo(map);
    for (var m = 1; m <= 26; m++) {
      L.marker(pointAtMile(m), { icon: L.divIcon({ className: "mile-dot", html: m, iconSize: [20, 20], iconAnchor: [10, 10] }), interactive: false, keyboard: false }).addTo(map);
    }
    L.marker(course[course.length - 1].ll, { icon: pinIcon("🏁", "finish"), zIndexOffset: 500 }).addTo(map)
      .bindPopup('<div class="pop"><div class="pop-name">Finish</div><div class="pop-where">Washington St at Senate Ave</div></div>');
    spotMarkers = S.spots.map(function (s, i) {
      return L.marker(spotLatLng(s), { icon: pinIcon(i + 1, s.fixedTime ? "start" : ""), zIndexOffset: 1000 }).addTo(map);
    });
    refreshMap();
    map.setView([39.815, -86.17], 12);
  }
  function fitCourse() {
    map.fitBounds(L.latLngBounds(course.map(function (p) { return p.ll; })), { padding: [10, 10] });
  }
  function refreshMap() {
    if (!map) return;
    S.spots.forEach(function (s, i) { spotMarkers[i].bindPopup(spotPopup(s, i)); });
    // On race day, show roughly where the runners should be at the expected pace.
    var mile = null;
    if (isRaceDay()) {
      var m = (indyNow().min - hmToMin(state.waveStart)) / paceMin(state.pace);
      if (m >= 0 && m <= 26.2) mile = m;
    }
    if (mile === null) { if (runnerMarker) { map.removeLayer(runnerMarker); runnerMarker = null; } return; }
    var ll = pointAtMile(mile);
    var html = '<div class="pop"><div class="pop-name">Runners, roughly</div><div class="pop-where">About mile ' + mile.toFixed(1) +
      ' if they\'re on a ' + state.pace + '/mi pace. This is an estimate, so check the tracking app.</div></div>';
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
      if (pendingSpot !== null) {
        map.setView(spotMarkers[pendingSpot].getLatLng(), 15);
        spotMarkers[pendingSpot].openPopup();
        pendingSpot = null;
      }
    }, 50);
  }
  function wireMapControls() {
    $("locate-btn").addEventListener("click", function () {
      if (!map || !navigator.geolocation) return;
      var btn = this;
      btn.textContent = "Finding you…";
      navigator.geolocation.getCurrentPosition(function (pos) {
        var ll = [pos.coords.latitude, pos.coords.longitude];
        if (!meMarker) meMarker = L.circleMarker(ll, { radius: 9, color: "#fff", weight: 3, fillColor: "#2a7bf6", fillOpacity: 1 }).addTo(map);
        meMarker.setLatLng(ll);
        map.setView(ll, 15);
        btn.textContent = "Show where I am";
      }, function () { btn.textContent = "Location unavailable"; }, { enableHighAccuracy: true, timeout: 10000 });
    });
    $("fit-btn").addEventListener("click", function () {
      if (map) fitCourse();
    });
  }

  // ---------- Tabs ----------
  var tabs = ["home", "spots", "map", "runners", "maps", "info"];
  function route() {
    var t = location.hash.replace("#", "");
    if (tabs.indexOf(t) < 0) t = "home";
    tabs.forEach(function (id) { $("view-" + id).hidden = id !== t; });
    document.querySelectorAll(".tabbar a").forEach(function (a) {
      if (a.getAttribute("data-tab") === t) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
    if (t === "map") showMap();
  }

  renderHome(); renderChips(); renderSpots(); wireSpotControls();
  renderRunners(); renderMaps(); renderInfo(); wireMapControls();
  window.addEventListener("hashchange", route);
  route();
  setInterval(function () { renderCountdown(); renderNextUp(); if (isRaceDay()) { renderSpots(); refreshMap(); } }, 60000);
})();
