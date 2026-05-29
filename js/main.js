(function () {
  "use strict";

  const G = window.GEOGRAPHY_DASH;
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const screens = {
    title: document.getElementById("screen-title"),
    cities: document.getElementById("screen-cities"),
    city: document.getElementById("screen-city"),
    pause: document.getElementById("screen-pause"),
    win: document.getElementById("screen-win"),
  };
  const hud = document.getElementById("hud");
  const citationsFooter = document.getElementById("citations-footer");
  const btnCitations = document.getElementById("btn-citations");
  const cityCards = document.getElementById("city-cards");
  const stageTableBody = document.getElementById("stage-table-body");
  const stageDetailPlaceholder = document.getElementById("stage-detail-placeholder");
  const stageDetailContent = document.getElementById("stage-detail-content");
  const optCheckpoints = document.getElementById("opt-checkpoints");
  const hubReadoutEl = document.getElementById("hub-readout");

  let game = new window.GeographyDashGame(canvas);
  if (window.GD_SPRITES && typeof window.GD_SPRITES.loadAtlas === "function") {
    window.GD_SPRITES.loadAtlas(function () {});
  }
  let currentCityIndex = 0;
  let activeScreen = "title";
  let paused = false;
  let hubReadoutOpen = false;
  let lastTs = performance.now();
  let selectedStageIndex = 0;

  // ── Progression tracking ──────────────────────────────────────────────────
  // Shape: { "copenhagen": { "0": true, "1": true, … }, "toronto": { … } }
  let PROGRESS = {};
  try {
    PROGRESS = JSON.parse(localStorage.getItem("gd_progress") || "{}");
  } catch (_) { PROGRESS = {}; }

  function saveProgress() {
    try { localStorage.setItem("gd_progress", JSON.stringify(PROGRESS)); } catch (_) {}
  }

  function isStageComplete(cityId, si) {
    return !!(PROGRESS[cityId] && PROGRESS[cityId][String(si)]);
  }

  function markStageComplete(cityId, si) {
    if (!PROGRESS[cityId]) PROGRESS[cityId] = {};
    PROGRESS[cityId][String(si)] = true;
    saveProgress();
  }

  function isCityComplete(cityId) {
    const city = G.cities.find(function (c) { return c.id === cityId; });
    if (!city) return false;
    for (let i = 0; i < city.stages.length; i++) {
      if (!isStageComplete(cityId, i)) return false;
    }
    return true;
  }

  function cityUnlocked(/* cityIdx */) {
    return true; // all cities unlocked — stages within a city still require the previous stage
  }

  function stageUnlocked(cityIdx, si) {
    if (!cityUnlocked(cityIdx)) return false;
    if (si === 0) return true;
    return isStageComplete(G.cities[cityIdx].id, si - 1);
  }

  // ── Layout helpers ────────────────────────────────────────────────────────
  function resize() {
    const wrap = document.getElementById("canvas-wrap");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.max(320, Math.floor(wrap.clientWidth));
    const ch = Math.max(200, Math.floor(wrap.clientHeight));
    const w = Math.floor(cw * dpr);
    const h = Math.floor(ch * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function showScreen(name) {
    activeScreen = name;
    Object.keys(screens).forEach(function (key) {
      const el = screens[key];
      const on = key === name;
      el.classList.toggle("hidden", !on);
      el.hidden = !on;
    });
    const inPlay = name === "play";
    hud.classList.toggle("hidden", !inPlay);
    hud.hidden = !inPlay;
  }

  function show(el) { el.classList.remove("hidden"); el.hidden = false; }
  function hide(el) { el.classList.add("hidden"); el.hidden = true; }

  function hazardThemeLabel(theme) {
    const map = {
      car_swarm: "Moving traffic lanes",
      smog_cloud: "Drifting smog banks",
      bike_lane: "Kerbs & wheel traps",
      quake_crack: "Surface cracks / debris",
      flood_zone: "Surface water / surge",
      patrol_soft: "Low patrol drones",
      patrol_hard: "Aggressive patrol drones",
      pulse_zone: "Pulsing barriers",
      institution_gate: "Institutional gates",
      ballot_wave: "Falling paper / leaflets",
      tax_slider: "Sliding fiscal blocks",
      income: "Income squeeze blocks",
      book_stack: "Stack hazards",
      learning: "Academic clutter",
      wind_turbine: "Rotor sweep zones",
      env: "Environmental rotor zones",
      boss_tower: "Tower finale traffic",
      boss_sprawl: "Sprawl finale traffic",
      boss_volatile: "Volatile economy finale",
      boss_lagos: "Gridlock finale",
      boss_storm: "Storm smog finale",
      hub: "Exploration only",
    };
    return map[theme] || theme;
  }

  // ── City cards ────────────────────────────────────────────────────────────
  function populateCities() {
    cityCards.innerHTML = "";
    G.cities.forEach(function (city, idx) {
      const unlocked = cityUnlocked(idx);
      const complete = isCityComplete(city.id);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "city-card" + (unlocked ? "" : " city-card--locked") + (complete ? " city-card--done" : "");
      b.style.setProperty("--city-accent", city.accent || "#1abc9c");
      b.innerHTML =
        '<span class="city-card-kicker">Campaign ' + (idx + 1) + (complete ? " ✓" : "") + '</span>' +
        "<strong>" + city.name + (unlocked ? "" : " 🔒") + "</strong>" +
        '<span class="live">' + city.liveability + "</span>" +
        '<span class="diff">Route intensity ' + Math.round(city.difficulty * 100) +
        "% · 11 stages</span>" +
        (!unlocked ? '<span class="lock-hint">Complete ' + G.cities[idx - 1].name + ' first</span>' : "");
      b.addEventListener("click", function () {
        if (!unlocked) return;
        openCity(idx);
      });
      if (!unlocked) b.setAttribute("title", "Complete " + G.cities[idx - 1].name + " to unlock");
      cityCards.appendChild(b);
    });
  }

  // ── Stage detail panel ────────────────────────────────────────────────────
  function showStageDetail(city, si) {
    selectedStageIndex = si;
    const st = city.stages[si];
    document.getElementById("detail-kicker").textContent =
      "Stage " + (si + 1) + " of " + city.stages.length + (st.isBoss ? " · Boss sector" : "");
    document.getElementById("detail-title").textContent = st.factor;
    document.getElementById("detail-score").textContent = "Liveability slice score: " + st.score;
    document.getElementById("detail-str").textContent = st.strengths;
    document.getElementById("detail-weak").textContent = st.weaknesses;
    document.getElementById("detail-theme").textContent =
      "Hazard palette for this sector: " + hazardThemeLabel(st.hazardTheme) + ".";
    hide(stageDetailPlaceholder);
    show(stageDetailContent);
  }

  // ── Open city screen ──────────────────────────────────────────────────────
  function openCity(idx) {
    if (!cityUnlocked(idx)) return;
    currentCityIndex = idx;
    selectedStageIndex = 0;
    const city = G.cities[idx];
    document.getElementById("city-title").textContent = city.name;
    document.getElementById("city-meta").textContent = city.liveability;
    document.getElementById("city-blurb").textContent = city.blurb;
    document.getElementById("city-stat-live").textContent = city.liveability;
    document.getElementById("city-stat-diff").textContent =
      Math.round(city.difficulty * 100) + "% · macro rooms scale with weight";
    const ribbon = document.getElementById("city-ribbon");
    ribbon.style.background = "linear-gradient(90deg," + (city.accent || "#1abc9c") + ",transparent)";
    const tbl = document.querySelector(".stage-table");
    if (tbl) tbl.style.setProperty("--city-accent", city.accent || "#1abc9c");

    stageTableBody.innerHTML = "";
    show(stageDetailPlaceholder);
    hide(stageDetailContent);

    city.stages.forEach(function (st, si) {
      const unlocked = stageUnlocked(idx, si);
      const complete = isStageComplete(city.id, si);
      const tr = document.createElement("tr");
      tr.className = "stage-row" +
        (si === 0 ? " is-selected" : "") +
        (unlocked ? "" : " stage-row--locked") +
        (complete ? " stage-row--done" : "");
      tr.setAttribute("data-si", String(si));

      const lockIcon = unlocked ? "" : ' <span class="lock-icon" title="Beat the previous stage first">🔒</span>';
      const doneIcon = complete ? ' <span class="done-icon">✓</span>' : "";

      tr.innerHTML =
        "<td>" + (si + 1) + doneIcon + "</td>" +
        "<td><strong>" + st.factor + "</strong>" +
        (st.isBoss ? ' <span class="badge-boss">Boss</span>' : "") +
        lockIcon + "</td>" +
        "<td>" + st.score + "</td>" +
        '<td class="stage-actions">' +
        '<button type="button" class="btn btn-primary btn-compact" data-play="' + si + '"' +
        (unlocked ? "" : " disabled") + ">Play</button> " +
        '<button type="button" class="btn btn-secondary btn-compact" data-hub="' + si + '"' +
        ">Hub</button></td>";   // hub always accessible

      tr.addEventListener("click", function (e) {
        if (e.target.closest("button")) return;
        if (!unlocked) return;
        selectedStageIndex = si;
        document.querySelectorAll(".stage-row").forEach(function (row) {
          row.classList.toggle("is-selected", row === tr);
        });
        showStageDetail(city, si);
      });

      const playBtn = tr.querySelector("[data-play]");
      const hubBtn  = tr.querySelector("[data-hub]");
      if (unlocked) {
        playBtn.addEventListener("click", function (ev) {
          ev.stopPropagation();
          startPlay(idx, si);
        });
      }
      // Hub is always accessible regardless of stage lock
      hubBtn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        startHubPlay(idx, si);
      });
      stageTableBody.appendChild(tr);
    });

    showStageDetail(city, 0);
    showScreen("city");
  }

  // ── Start gameplay ────────────────────────────────────────────────────────
  function startPlay(cityIndex, stageIndex, options) {
    if (!stageUnlocked(cityIndex, stageIndex)) return;
    options = options || {};
    currentCityIndex = cityIndex;
    resize();
    showScreen("play");
    paused = false;
    hubReadoutOpen = false;
    hide(hubReadoutEl);
    hide(screens.pause);
    hide(screens.win);
    game.beginStage(cityIndex, stageIndex, {
      checkpointsEnabled: optCheckpoints.checked,
      resetSpawn: options.resetSpawn !== false,
    });
    updateHud();
  }

  function updateHud() {
    const city = G.cities[game.cityIndex];
    document.getElementById("hud-city").textContent = city.name;
    if (game.mode === "hub") {
      const st = city.stages[game.hubStageIndex != null ? game.hubStageIndex : 0];
      document.getElementById("hud-stage").textContent =
        "Rest hub · " + st.factor + " — walk & press E at exhibits · reach exit";
      document.getElementById("hud-check").textContent =
        "Exploration plaza (stage " + (game.hubStageIndex + 1) + ")";
    } else {
      const st = city.stages[game.stageIndex];
      document.getElementById("hud-stage").textContent =
        "Stage " + (game.stageIndex + 1) + "/" + city.stages.length + " — " + st.factor;
      document.getElementById("hud-check").textContent = game.checkpointsEnabled
        ? "Checkpoints on" : "Hardcore city run";
    }
  }

  function closeHubReadout() {
    hide(hubReadoutEl);
    hubReadoutOpen = false;
  }

  function openHubReadout(title, text, valence) {
    document.getElementById("hub-readout-title").textContent = title;
    document.getElementById("hub-readout-body").textContent = text;
    const readout = hubReadoutEl;
    readout.classList.remove("hub-readout--good", "hub-readout--bad");
    if (valence === "good") readout.classList.add("hub-readout--good");
    if (valence === "bad")  readout.classList.add("hub-readout--bad");
    show(readout);
    hubReadoutOpen = true;
  }

  function exitHubToCity() {
    paused = false;
    hide(screens.pause);
    closeHubReadout();
    game.state = "idle";
    game.mode = "run";
    game.level = null;
    game.player = null;
    openCity(game.cityIndex);
  }

  function startHubPlay(cityIndex, stageIndex) {
    // hubs are always accessible — no stage-lock check here
    currentCityIndex = cityIndex;
    const si = stageIndex == null ? selectedStageIndex : stageIndex;
    resize();
    showScreen("play");
    paused = false;
    closeHubReadout();
    hide(screens.pause);
    hide(screens.win);
    game.beginHub(cityIndex, si);
    if (!game.level) { openCity(cityIndex); return; }
    updateHud();
  }

  // ── Win screen ────────────────────────────────────────────────────────────
  function openWinModal() {
    const city = G.cities[game.cityIndex];
    const si = game.stageIndex;
    const st = city.stages[si];

    // Record completion
    markStageComplete(city.id, si);

    const el = document.getElementById("win-summary");
    el.textContent =
      st.factor + " (" + st.score + ") — strengths: " + st.strengths +
      " · pressure: " + st.weaknesses;

    // Show/hide "Next stage" button based on lock
    const btnNext = document.getElementById("btn-next-stage");
    const nextSi = si + 1;
    const hasNext = nextSi < city.stages.length;
    if (hasNext) {
      btnNext.textContent = "Next stage →";
      btnNext.style.display = "";
    } else {
      btnNext.textContent = "City complete!";
      btnNext.style.display = "";
    }

    show(screens.win);
  }

  // ── Button wiring ─────────────────────────────────────────────────────────
  document.getElementById("btn-detail-play").addEventListener("click", function () {
    if (!stageUnlocked(currentCityIndex, selectedStageIndex)) return;
    startPlay(currentCityIndex, selectedStageIndex);
  });
  document.getElementById("btn-detail-hub").addEventListener("click", function () {
    startHubPlay(currentCityIndex, selectedStageIndex); // always accessible
  });

  document.getElementById("btn-start").addEventListener("click", function () {
    populateCities();
    showScreen("cities");
  });

  document.querySelectorAll(".back-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const t = btn.getAttribute("data-back");
      if (t === "title") showScreen("title");
      if (t === "cities") { populateCities(); showScreen("cities"); }
    });
  });

  document.getElementById("btn-city-hub").addEventListener("click", function () {
    startHubPlay(currentCityIndex, selectedStageIndex);
  });

  document.getElementById("btn-pause").addEventListener("click", function () {
    if (activeScreen === "play" && game.state === "playing") {
      paused = true;
      show(screens.pause);
    }
  });

  document.getElementById("btn-resume").addEventListener("click", function () {
    paused = false;
    hide(screens.pause);
  });

  document.getElementById("btn-quit-stage").addEventListener("click", function () {
    paused = false;
    hide(screens.pause);
    game.state = "idle";
    game.mode = "run";
    game.level = null;
    game.player = null;
    closeHubReadout();
    openCity(currentCityIndex);
  });

  document.getElementById("hub-readout-close").addEventListener("click", function () {
    closeHubReadout();
  });

  document.getElementById("btn-next-stage").addEventListener("click", function () {
    hide(screens.win);
    const city = G.cities[game.cityIndex];
    const next = game.stageIndex + 1;
    if (next < city.stages.length) {
      // Stage was just beaten so next is now unlocked
      startPlay(game.cityIndex, next, { resetSpawn: false });
    } else {
      populateCities();
      showScreen("cities");
    }
  });

  document.getElementById("btn-win-hub").addEventListener("click", function () {
    hide(screens.win);
    startHubPlay(game.cityIndex, game.stageIndex);
  });

  document.getElementById("btn-win-stages").addEventListener("click", function () {
    hide(screens.win);
    game.state = "idle";
    game.mode = "run";
    game.level = null;
    game.player = null;
    openCity(game.cityIndex);
  });

  btnCitations.addEventListener("click", function () {
    const isHidden = citationsFooter.classList.contains("hidden") || citationsFooter.hidden;
    if (isHidden) {
      citationsFooter.classList.remove("hidden");
      citationsFooter.hidden = false;
      btnCitations.textContent = "Hide sources & citations";
      btnCitations.setAttribute("aria-expanded", "true");
    } else {
      citationsFooter.classList.add("hidden");
      citationsFooter.hidden = true;
      btnCitations.textContent = "Show sources & citations";
      btnCitations.setAttribute("aria-expanded", "false");
    }
    resize();
  });

  window.addEventListener("keydown", function (e) {
    if (e.code === "Escape") {
      if (hubReadoutOpen) { closeHubReadout(); e.preventDefault(); return; }
      if (!screens.win.classList.contains("hidden")) {
        hide(screens.win);
        game.state = "idle"; game.mode = "run"; game.level = null; game.player = null;
        openCity(game.cityIndex);
        e.preventDefault(); return;
      }
      if (activeScreen === "play" && paused) {
        paused = false; hide(screens.pause); e.preventDefault(); return;
      }
      if (activeScreen === "play" && game.mode === "hub" && game.state === "playing") {
        exitHubToCity(); e.preventDefault(); return;
      }
      if (activeScreen === "play" && game.state === "playing") {
        paused = !paused;
        if (paused) show(screens.pause); else hide(screens.pause);
        e.preventDefault();
      }
    }
  });

  window.addEventListener("resize", function () { resize(); });

  // ── Citations ─────────────────────────────────────────────────────────────
  (function initCitations() {
    const ul = document.getElementById("citations-list");
    G.citations.forEach(function (c) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = c.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.textContent = c.label;
      li.appendChild(a); ul.appendChild(li);
    });
  })();

  document.getElementById("hint-controls").textContent = G.controls;

  populateCities();
  showScreen("title");
  resize();

  // ── Game loop ─────────────────────────────────────────────────────────────
  function frame(ts) {
    const dt = Math.min(0.045, (ts - lastTs) / 1000);
    lastTs = ts;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    const blockInput = paused || hubReadoutOpen;
    if (activeScreen === "play" && game.level && game.player && !blockInput) {
      const ev = game.update(dt);
      if (ev && ev.type === "win") {
        openWinModal();
      }
      if (ev && ev.type === "hub_talk") {
        openHubReadout(ev.title, ev.text, ev.valence);
      }
      if (ev && ev.type === "hub_exit") {
        exitHubToCity();
      }
    }

    if (activeScreen === "play" && game.state !== "idle") {
      game.draw();
    } else {
      ctx.fillStyle = "#0f0f14";
      ctx.fillRect(0, 0, cw, ch);
      ctx.fillStyle = "#555";
      ctx.font = "14px system-ui,sans-serif";
      ctx.fillText("Select a city and stage to run", 20, 32);
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
