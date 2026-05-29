/**
 * Per-stage rest hub levels — one explorable plaza per campaign stage.
 * Each hub has a themed platform layout matching the stage topic, with
 * 4 clickable exhibits drawn as kind-specific icons (dollar, house, turbine…).
 *
 * Hub items come from stage.hubItems[] — set by data.js at the bottom.
 * Each item: { kind, title, body, valence }
 */
(function () {
  "use strict";

  function hashStr(s) {
    let h = 1779033703 ^ s.length;
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
  }

  // ── City surface styles ──────────────────────────────────────────────────────
  const CITY_STYLE = {
    copenhagen: "hub_granite",
    toronto:    "hub_concrete",
    istanbul:   "hub_stone",
    bangkok:    "hub_tile",
    newdelhi:   "hub_marble",
    lagos:      "hub_dirt",
  };

  // ── Theme → layout preset name ───────────────────────────────────────────────
  const THEME_LAYOUT = {
    wind_turbine:     "open",
    env:              "open",
    bike_lane:        "lanes",
    mobility:         "lanes",
    car_swarm:        "lanes",
    commute_pulse:    "office",
    work:             "office",
    patrol_soft:      "checkpoint",
    patrol_hard:      "checkpoint",
    safety:           "checkpoint",
    pulse_zone:       "hospital",
    health:           "hospital",
    ballot_wave:      "civic",
    civic:            "civic",
    institution_gate: "civic",
    sector:           "civic",
    tax_slider:       "towers",
    income:           "towers",
    book_stack:       "library",
    learning:         "library",
    stage_hazard:     "stage",
    arts:             "stage",
    housing:          "urban",
    quake_crack:      "urban",
    flood_zone:       "urban",
    smog_cloud:       "elevated",
    boss_tower:       "grand",
    boss_sprawl:      "grand",
    boss_volatile:    "grand",
    boss_storm:       "grand",
    boss_lagos:       "grand",
  };

  // ── Platform layout generators ───────────────────────────────────────────────
  // Each layout returns an array of platform objects {x,y,w,h,style}
  // relative to groundY. Width of hub varies; gy = groundY passed in.

  function platOpen(gy, hubW, st) {
    // Open hillscape: gentle elevation changes, windmill-view feel
    return [
      { x: 200,           y: gy - 80,  w: 240, h: 18, style: st },
      { x: 560,           y: gy - 130, w: 180, h: 18, style: st },
      { x: 860,           y: gy - 75,  w: 260, h: 18, style: st },
      { x: 1220,          y: gy - 150, w: 200, h: 18, style: st },
      { x: 1560,          y: gy - 90,  w: 220, h: 18, style: st },
      { x: 1900,          y: gy - 140, w: 200, h: 18, style: st },
    ];
  }

  function platLanes(gy, hubW, st) {
    // Transit-lane feel: mostly same height with some steps
    return [
      { x: 180,  y: gy - 68,  w: 300, h: 18, style: st },
      { x: 580,  y: gy - 68,  w: 280, h: 18, style: st },
      { x: 960,  y: gy - 120, w: 240, h: 18, style: st },
      { x: 1310, y: gy - 68,  w: 280, h: 18, style: st },
      { x: 1700, y: gy - 68,  w: 260, h: 18, style: st },
      { x: 340,  y: gy - 175, w: 140, h: 18, style: st },
      { x: 1100, y: gy - 195, w: 140, h: 18, style: st },
    ];
  }

  function platOffice(gy, hubW, st) {
    // Office-building floors: vertical stacking
    return [
      { x: 160,  y: gy - 70,  w: 260, h: 18, style: st },
      { x: 500,  y: gy - 130, w: 200, h: 18, style: st },
      { x: 800,  y: gy - 185, w: 200, h: 18, style: st },
      { x: 1110, y: gy - 240, w: 180, h: 18, style: st },
      { x: 1380, y: gy - 130, w: 240, h: 18, style: st },
      { x: 1720, y: gy - 75,  w: 240, h: 18, style: st },
    ];
  }

  function platCheckpoint(gy, hubW, st) {
    // Checkpoint / guardpost feel: wide flat with inspection booths
    return [
      { x: 200,  y: gy - 62,  w: 320, h: 18, style: st },
      { x: 640,  y: gy - 105, w: 180, h: 18, style: st },
      { x: 950,  y: gy - 62,  w: 300, h: 18, style: st },
      { x: 1370, y: gy - 105, w: 200, h: 18, style: st },
      { x: 1680, y: gy - 62,  w: 280, h: 18, style: st },
      { x: 420,  y: gy - 180, w: 140, h: 18, style: st },
      { x: 1100, y: gy - 170, w: 140, h: 18, style: st },
    ];
  }

  function platHospital(gy, hubW, st) {
    // Hospital corridors: clean even platforms
    return [
      { x: 200,  y: gy - 75,  w: 280, h: 18, style: st },
      { x: 600,  y: gy - 75,  w: 240, h: 18, style: st },
      { x: 960,  y: gy - 140, w: 260, h: 18, style: st },
      { x: 1330, y: gy - 75,  w: 260, h: 18, style: st },
      { x: 1720, y: gy - 75,  w: 240, h: 18, style: st },
      { x: 400,  y: gy - 195, w: 140, h: 18, style: st },
    ];
  }

  function platCivic(gy, hubW, st) {
    // Democratic assembly: wide base steps rising to a central stage
    return [
      { x: 100,  y: gy - 48,  w: 400, h: 18, style: st }, // wide base
      { x: 620,  y: gy - 95,  w: 280, h: 18, style: st },
      { x: 1020, y: gy - 145, w: 260, h: 18, style: st }, // central dais
      { x: 1400, y: gy - 95,  w: 280, h: 18, style: st },
      { x: 1790, y: gy - 48,  w: 380, h: 18, style: st }, // wide base right
      { x: 720,  y: gy - 200, w: 160, h: 18, style: st },
    ];
  }

  function platTowers(gy, hubW, st) {
    // Financial towers: dramatic height differences
    return [
      { x: 180,  y: gy - 60,  w: 200, h: 18, style: st },
      { x: 480,  y: gy - 145, w: 160, h: 18, style: st },
      { x: 750,  y: gy - 225, w: 160, h: 18, style: st },
      { x: 1050, y: gy - 145, w: 200, h: 18, style: st },
      { x: 1360, y: gy - 220, w: 160, h: 18, style: st },
      { x: 1640, y: gy - 100, w: 200, h: 18, style: st },
      { x: 1960, y: gy - 60,  w: 200, h: 18, style: st },
    ];
  }

  function platLibrary(gy, hubW, st) {
    // Library shelves: many platforms at staggered heights
    return [
      { x: 200,  y: gy - 65,  w: 220, h: 18, style: st },
      { x: 480,  y: gy - 110, w: 180, h: 18, style: st },
      { x: 730,  y: gy - 160, w: 180, h: 18, style: st },
      { x: 980,  y: gy - 110, w: 200, h: 18, style: st },
      { x: 1240, y: gy - 65,  w: 200, h: 18, style: st },
      { x: 1530, y: gy - 140, w: 180, h: 18, style: st },
      { x: 1790, y: gy - 80,  w: 200, h: 18, style: st },
      { x: 600,  y: gy - 220, w: 140, h: 18, style: st },
      { x: 1100, y: gy - 200, w: 140, h: 18, style: st },
    ];
  }

  function platStage(gy, hubW, st) {
    // Theatre stage: low wide platforms + raised central stage + boxes
    return [
      { x: 100,  y: gy - 52,  w: 350, h: 18, style: st }, // stalls left
      { x: 550,  y: gy - 100, w: 320, h: 18, style: st }, // main stage
      { x: 980,  y: gy - 52,  w: 350, h: 18, style: st }, // stalls right
      { x: 200,  y: gy - 185, w: 160, h: 18, style: st }, // left box
      { x: 1060, y: gy - 185, w: 160, h: 18, style: st }, // right box
      { x: 620,  y: gy - 195, w: 200, h: 18, style: st }, // upper back
      { x: 1450, y: gy - 80,  w: 260, h: 18, style: st },
      { x: 1800, y: gy - 60,  w: 240, h: 18, style: st },
    ];
  }

  function platUrban(gy, hubW, st) {
    // Urban block: uneven terrain, some cracked platforms
    return [
      { x: 180,  y: gy - 72,  w: 240, h: 18, style: st },
      { x: 520,  y: gy - 110, w: 200, h: 18, style: st },
      { x: 830,  y: gy - 60,  w: 260, h: 18, style: st },
      { x: 1190, y: gy - 140, w: 200, h: 18, style: st },
      { x: 1510, y: gy - 80,  w: 240, h: 18, style: st },
      { x: 1860, y: gy - 125, w: 200, h: 18, style: st },
      { x: 380,  y: gy - 200, w: 140, h: 18, style: st },
    ];
  }

  function platElevated(gy, hubW, st) {
    // Smoggy: platforms high up above the haze
    return [
      { x: 200,  y: gy - 110, w: 220, h: 18, style: st },
      { x: 520,  y: gy - 175, w: 200, h: 18, style: st },
      { x: 840,  y: gy - 230, w: 200, h: 18, style: st },
      { x: 1150, y: gy - 175, w: 220, h: 18, style: st },
      { x: 1480, y: gy - 230, w: 200, h: 18, style: st },
      { x: 1800, y: gy - 130, w: 220, h: 18, style: st },
    ];
  }

  function platGrand(gy, hubW, st) {
    // Boss finale: grand staircase + arena feel
    return [
      { x: 100,  y: gy - 52,  w: 300, h: 18, style: st },
      { x: 500,  y: gy - 100, w: 260, h: 18, style: st },
      { x: 870,  y: gy - 160, w: 300, h: 18, style: st }, // central high
      { x: 1290, y: gy - 100, w: 260, h: 18, style: st },
      { x: 1680, y: gy - 52,  w: 300, h: 18, style: st },
      { x: 600,  y: gy - 240, w: 180, h: 18, style: st },
      { x: 1050, y: gy - 240, w: 180, h: 18, style: st },
      { x: 250,  y: gy - 195, w: 140, h: 18, style: st },
      { x: 1600, y: gy - 195, w: 140, h: 18, style: st },
    ];
  }

  const LAYOUT_FNS = {
    open:       platOpen,
    lanes:      platLanes,
    office:     platOffice,
    checkpoint: platCheckpoint,
    hospital:   platHospital,
    civic:      platCivic,
    towers:     platTowers,
    library:    platLibrary,
    stage:      platStage,
    urban:      platUrban,
    elevated:   platElevated,
    grand:      platGrand,
  };

  // ── Item placement: spread 4 items across platform clusters ─────────────────
  // For each hub item, pick a platform and return trigger bounds at that platform.
  // trigger.y = platY - trigH (above the platform surface)
  const TRIGGER_H = 90; // interaction zone height

  function placeItems(platforms, hubItems, gy) {
    const triggers = [];
    // Pick 4 platforms spread across the level (avoid ground platform = first one)
    const candidatePlats = platforms
      .filter(function (pl) { return pl.y < gy - 30; })
      .sort(function (a, b) { return a.x - b.x; });

    // Evenly distribute across available platforms
    const count = Math.min(hubItems.length, 4);
    const step = Math.max(1, Math.floor(candidatePlats.length / count));
    for (let i = 0; i < count; i++) {
      const hi = hubItems[i];
      const pl = candidatePlats[Math.min(i * step, candidatePlats.length - 1)];
      if (!pl) continue;
      const cx = pl.x + pl.w * 0.45;
      triggers.push({
        kind:   hi.kind,
        title:  hi.title,
        text:   hi.body,
        valence: hi.valence,
        x:  cx - 30,
        y:  pl.y - TRIGGER_H,
        w:  60,
        h:  TRIGGER_H,
        platY: pl.y,
      });
    }
    return triggers;
  }

  // ── Hub base builder ─────────────────────────────────────────────────────────
  function buildHubForStage(city, stageIndex, vh) {
    const st     = city.stages[stageIndex];
    const theme  = st.hazardTheme || "env";
    const layout = THEME_LAYOUT[theme] || "open";
    const style  = CITY_STYLE[city.id] || "hub_granite";
    const hubW   = 2400 + stageIndex * 80 + (st.isBoss ? 600 : 0);
    const groundY = Math.floor(Math.max(300, Math.min(vh || 540, 920)) * 0.68);

    const platforms = [];

    // Ground strip
    platforms.push({ x: -200, y: groundY, w: hubW + 600, h: 140, style: "hub_ground" });

    // Theme layout
    const platFn = LAYOUT_FNS[layout] || platOpen;
    const floaters = platFn(groundY, hubW, style);
    for (let fi = 0; fi < floaters.length; fi++) {
      platforms.push(floaters[fi]);
    }

    // Hub items → triggers
    const hubItems = (st.hubItems && st.hubItems.length) ? st.hubItems
      : [{ kind: "stats", title: st.factor + " — rest plaza",
           body: st.strengths + " · " + st.weaknesses, valence: "good" }];
    const triggers = placeItems(platforms, hubItems, groundY);

    const goalX = hubW - 120;
    const goalY = groundY - 44;

    return {
      width:  hubW,
      groundY,
      platforms,
      hazards:     [],
      decorations: [],
      triggers,
      goalX,
      goalY,
      stage:         st,
      city,
      hubStyle:      style,
      hubLayout:     layout,
      isHub:         true,
      stageIndex,
      hubStageIndex: stageIndex,
      checkpointsEnabled: true,
    };
  }

  window.GD_buildHubLevel = function (city, viewHeight, stageIndex) {
    const si  = stageIndex == null ? 0 : stageIndex | 0;
    const idx = Math.max(0, Math.min(si, city.stages.length - 1));
    return buildHubForStage(city, idx, viewHeight);
  };
})();
