(function () {
  var S = window.SITE;
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };
  var mapsLink = function (q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); };

  // Per-viewer settings (finish time, wave start). Storage may be unavailable.
  function load(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; } }
  function save(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  var state = {
    finish: load("finish", S.defaultFinish),
    waveStart: load("waveStart", S.defaultWaveStart)
  };
  if (S.finishOptions.indexOf(state.finish) < 0) state.finish = S.defaultFinish;

  // Time helpers (all wall-clock minutes since midnight, Indianapolis time)
  function hmToMin(s) { var p = s.split(":"); return (+p[0]) * 60 + (+p[1]); }
  function fmtClock(min) {
    min = Math.round(min);
    var h = Math.floor(min / 60) % 24, m = min % 60;
    var ap = h < 12 ? "a.m." : "p.m.";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + (m < 10 ? "0" : "") + m + " " + ap;
  }
  function paceLabel(finish) {
    var secs = hmToMin(finish) * 60 / 26.2;
    var mm = Math.floor(secs / 60), ss = Math.round(secs % 60);
    if (ss === 60) { mm++; ss = 0; }
    return mm + ":" + (ss < 10 ? "0" : "") + ss + "/mi";
  }
  function spotMinutes(spot) {
    if (spot.fixedTime) return hmToMin("07:30");
    return hmToMin(state.waveStart) + spot.mile * hmToMin(state.finish) / 26.2;
  }
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
    $("finish-chips").innerHTML = S.finishOptions.map(function (f) {
      return '<button type="button" class="chip" role="radio" aria-checked="' + (f === state.finish) + '" data-finish="' + f + '">' + f + '</button>';
    }).join("");
  }

  function renderSpots() {
    var nextI = nextSpotIndex(), raceDay = isRaceDay();
    $("spot-list").innerHTML = S.spots.map(function (s, i) {
      var cls = "card spot" + (i === nextI ? " is-next" : "") + (raceDay && nextI >= 0 && i < nextI ? " passed" : "") +
        (raceDay && nextI < 0 && indyNow().min > hmToMin("12:00") ? " passed" : "");
      var time = s.fixedTime ? s.fixedTime : "~" + fmtClock(spotMinutes(s));
      return '<li class="' + cls + '">' +
        '<div class="spot-head"><span class="spot-name">' + esc(s.name) + (i === nextI ? '<span class="badge">Next</span>' : "") + '</span>' +
        '<span class="spot-mile">' + (s.mile === 0 ? "Start" : "Mile " + s.mile) + '</span></div>' +
        '<div class="spot-time">' + time + ' <small>' + (s.fixedTime ? "before the start" : "estimate") + '</small></div>' +
        '<div class="spot-where">' + esc(s.where) + '</div>' +
        '<p class="spot-why">' + esc(s.why) + '</p>' +
        (s.tags && s.tags.length ? '<div class="tags">' + s.tags.map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join("") + '</div>' : "") +
        '<a class="btn" href="' + mapsLink(s.map) + '" target="_blank" rel="noopener">Open in Maps</a>' +
        '</li>';
    }).join("");
  }

  function wireSpotControls() {
    $("finish-chips").addEventListener("click", function (e) {
      var b = e.target.closest("[data-finish]");
      if (!b) return;
      state.finish = b.getAttribute("data-finish");
      save("finish", state.finish);
      renderChips(); renderSpots(); renderNextUp();
    });
    var ws = $("wave-start");
    ws.value = state.waveStart;
    ws.addEventListener("change", function () {
      if (!/^\d{2}:\d{2}$/.test(ws.value)) return;
      state.waveStart = ws.value;
      save("waveStart", state.waveStart);
      renderSpots(); renderNextUp();
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

  // ---------- Tabs ----------
  var tabs = ["home", "spots", "runners", "maps", "info"];
  function route() {
    var t = location.hash.replace("#", "");
    if (tabs.indexOf(t) < 0) t = "home";
    tabs.forEach(function (id) { $("view-" + id).hidden = id !== t; });
    document.querySelectorAll(".tabbar a").forEach(function (a) {
      if (a.getAttribute("data-tab") === t) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }

  renderHome(); renderChips(); renderSpots(); wireSpotControls();
  renderRunners(); renderMaps(); renderInfo();
  window.addEventListener("hashchange", route);
  route();
  setInterval(function () { renderCountdown(); renderNextUp(); if (isRaceDay()) renderSpots(); }, 60000);
})();
