/**
 * Hand-authored platform rooms - every room is a thoughtful, playtested slice.
 * PASSABILITY GUARANTEE: every room has an "exit ramp" platform within 80 px of
 * the right edge of the slice (sliceW = 480) so that cross-slice gaps are always
 * jumpable, even when intensity is high and the ground has hazards.
 *
 * Coordinate convention:
 *   dx  = x offset from the slice origin (left edge of this room's space)
 *   dy  = y offset upward from groundY  (negative = above ground)
 *   w   = platform width
 *   h   = platform height (default H = 18)
 */
(function () {
  "use strict";

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const H = 18;
  function R(dx, dy, w, hh) { return { dx, dy, w, h: hh || H }; }

  // ─── TIER 0 - Tutorial / Opening ─────────────────────────────────────────
  const TIER0 = [
    function openWalk() {
      return [R(20, -52, 280), R(340, -52, 240)];          // ends at 580 ✓
    },
    function doubleFlat() {
      return [R(20, -58, 220), R(280, -58, 220)];           // ends at 500 ✓
    },
    function gentleLift() {
      return [R(24, -52, 200), R(240, -80, 180), R(450, -52, 200)]; // ends at 650 ✓
    },
    function broadTable() {
      return [R(10, -56, 450)];                             // ends at 460 ✓
    },
    function easyTwo() {
      return [R(30, -60, 200), R(280, -60, 200)];           // ends at 480 ✓
    },
  ];

  // ─── TIER 1 - Gentle Challenge ────────────────────────────────────────────
  const TIER1 = [
    function introRun() {
      return [R(24, -58, 200), R(280, -58, 200), R(160, -120, 150)]; // 480 ✓
    },
    function gentleStairs() {
      // Step ascent; exit ramp at near-ground level at the right
      return [R(32, -52, 140), R(180, -88, 140), R(340, -124, 140),
              R(220, -174, 100), R(370, -52, 110)];          // exit 480 ✓
    },
    function wideLedgeStep() {
      return [R(20, -54, 280), R(160, -118, 150), R(340, -54, 240)]; // 580 ✓
    },
    function valley() {
      return [R(20, -54, 200), R(280, -54, 200), R(160, -112, 130)]; // 480 ✓
    },
    function doubleDeck() {
      return [R(30, -56, 170), R(250, -56, 170), R(130, -120, 160),
              R(410, -56, 70)];                              // exit 480 ✓
    },
    function easyClimb() {
      return [R(30, -52, 150), R(200, -95, 140), R(160, -145, 120),
              R(340, -58, 140)];                             // exit 480 ✓
    },
    function sprintMix() {
      return [R(25, -52, 210), R(280, -95, 160), R(160, -145, 130),
              R(400, -52, 80)];                              // exit 480 ✓
    },
  ];

  // ─── TIER 2 - Moderate Challenge ─────────────────────────────────────────
  const TIER2 = [
    function zigZag() {
      return [R(40, -70, 130), R(200, -120, 130), R(120, -52, 180),
              R(340, -52, 140)];                             // exit 480 ✓
    },
    function splitPath() {
      return [R(30, -58, 140), R(210, -105, 140), R(120, -170, 110),
              R(350, -58, 130)];                             // exit 480 ✓
    },
    function rhythmPads() {
      return [R(28, -62, 105), R(162, -85, 105), R(296, -62, 105),
              R(210, -130, 110), R(380, -62, 100)];          // exit 480 ✓
    },
    function towerClimb() {
      return [R(50, -55, 120), R(190, -105, 120), R(110, -168, 140),
              R(230, -225, 130), R(370, -55, 110)];          // exit 480 ✓
    },
    function snakeUp() {
      return [R(20, -52, 120), R(160, -100, 120), R(300, -148, 120),
              R(200, -200, 130), R(360, -52, 120)];          // exit 480 ✓
    },
    function cascadeDown() {
      return [R(30, -200, 120), R(180, -148, 120), R(320, -96, 130),
              R(220, -52, 160), R(370, -52, 110)];           // exit 480 ✓
    },
    function threeStep() {
      return [R(24, -58, 150), R(196, -108, 150), R(130, -160, 130),
              R(360, -58, 120)];                             // exit 480 ✓
    },
    function highLow() {
      return [R(20, -54, 150), R(210, -160, 150), R(380, -54, 150)]; // 530 ✓
    },
    function platformCluster() {
      return [R(20, -55, 110), R(160, -55, 110), R(300, -55, 110),
              R(170, -130, 120), R(400, -55, 80)];           // exit 480 ✓
    },
  ];

  // ─── TIER 3 - Hard ───────────────────────────────────────────────────────
  const TIER3 = [
    function tightZigZag() {
      return [R(20, -65, 100), R(150, -115, 100), R(80, -52, 90),
              R(240, -170, 110), R(380, -55, 100)];          // exit 480 ✓
    },
    function verticalGauntlet() {
      return [R(40, -54, 110), R(170, -108, 110), R(90, -165, 100),
              R(220, -220, 110), R(370, -54, 110)];          // exit 480 ✓
    },
    function precisionPlatforms() {
      return [R(30, -58, 95), R(160, -110, 95), R(280, -162, 95),
              R(190, -58, 90), R(360, -58, 120)];            // exit 480 ✓
    },
    function labyrinth() {
      return [R(20, -54, 130), R(200, -115, 100), R(130, -175, 100),
              R(270, -54, 130), R(390, -54, 90)];            // exit 480 ✓
    },
    function interlace() {
      return [R(20, -60, 110), R(180, -120, 110), R(310, -60, 110),
              R(120, -185, 120), R(410, -60, 70)];           // exit 480 ✓
    },
    function spireClimb() {
      return [R(45, -54, 100), R(185, -104, 100), R(100, -154, 100),
              R(215, -204, 100), R(130, -250, 90), R(380, -54, 100)]; // exit 480 ✓
    },
    function weavePath() {
      return [R(20, -54, 110), R(155, -98, 110), R(290, -144, 110),
              R(180, -196, 110), R(380, -54, 100)];          // exit 480 ✓
    },
  ];

  // ─── BOSS TIER ───────────────────────────────────────────────────────────
  const BOSS_DENSE = [
    function bossDense1() {
      return [R(24, -55, 150), R(210, -90, 140), R(100, -150, 130),
              R(250, -205, 120), R(360, -55, 120)];          // exit 480 ✓
    },
    function bossArena1() {
      return [R(15, -54, 320), R(80, -112, 130), R(240, -112, 130),
              R(165, -180, 140), R(345, -54, 135)];          // exit 480 ✓
    },
    function bossGauntlet() {
      return [R(20, -52, 100), R(150, -100, 100), R(280, -148, 100),
              R(160, -200, 110), R(300, -252, 100), R(390, -55, 90)]; // exit 480 ✓
    },
    function bossCross() {
      return [R(20, -54, 120), R(180, -140, 120), R(320, -54, 120),
              R(140, -196, 110), R(420, -54, 60)];           // 480 ✓
    },
  ];

  const BOSS_REST = [
    function restBeat() {
      return [R(40, -52, 230), R(120, -110, 170), R(260, -52, 220)]; // 480 ✓
    },
    function restPlaza() {
      return [R(20, -52, 350), R(360, -52, 120)];            // 480 ✓
    },
  ];

  const FINALE_STEPS = [
    function finaleSteps() {
      return [R(30, -55, 140), R(190, -95, 140), R(100, -150, 130),
              R(220, -205, 140), R(360, -55, 120)];          // exit 480 ✓
    },
    function finaleSpiral() {
      return [R(20, -52, 120), R(160, -100, 120), R(90, -152, 120),
              R(225, -200, 130), R(355, -52, 130)];          // exit 485 ✓
    },
  ];

  // ─── Theme → tier preference ──────────────────────────────────────────────
  const THEME_TIER = {
    env:              [0, 1, 2],
    wind_turbine:     [0, 1, 2],
    bike_lane:        [0, 1, 1],
    mobility:         [0, 1, 2],
    car_swarm:        [1, 2, 2],
    commute_pulse:    [1, 1, 2],
    smog_cloud:       [1, 2, 2],
    patrol_soft:      [1, 1, 2],
    patrol_hard:      [1, 2, 3],
    safety:           [1, 2, 2],
    health:           [0, 1, 2],
    pulse_zone:       [1, 1, 2],
    housing:          [1, 2, 3],
    quake_crack:      [1, 2, 3],
    flood_zone:       [1, 2, 2],
    civic:            [0, 1, 2],
    ballot_wave:      [0, 1, 2],
    sector:           [1, 1, 2],
    institution_gate: [1, 2, 2],
    income:           [1, 2, 2],
    tax_slider:       [1, 2, 2],
    work:             [1, 1, 2],
    learning:         [0, 1, 2],
    book_stack:       [0, 1, 2],
    arts:             [0, 0, 1],
    stage_hazard:     [0, 1, 1],
  };

  const TIERS = [TIER0, TIER1, TIER2, TIER3];

  // ─── Core builder ──────────────────────────────────────────────────────────
  function buildMacroPlatforms(width, groundY, boss, cityDifficulty, stageIndex, seed, theme) {
    const rnd = mulberry32(seed);
    const d = cityDifficulty;

    const sliceW = boss ? 420 : 480;

    const out = [];
    let origin = 80;

    const stageRamp = Math.min(1, stageIndex / 9);
    const intensity = Math.min(1, d * 0.6 + stageRamp * 0.6);

    const approxRooms = Math.floor((width - 560) / sliceW);

    if (boss) {
      let roomIndex = 0;
      while (origin + sliceW < width - 440) {
        let pool;
        if (roomIndex % 4 === 3) {
          pool = BOSS_REST;
        } else {
          pool = BOSS_DENSE;
        }
        const pick = pool[roomIndex % pool.length];
        const rel = pick(rnd);
        for (let i = 0; i < rel.length; i++) {
          const rp = rel[i];
          const y = groundY + rp.dy;
          if (y < groundY - 310) continue;
          out.push({ x: origin + rp.dx, y, w: rp.w, h: rp.h });
        }
        // Boss keeps wider gaps for challenge
        origin += sliceW + 30 + Math.floor(rnd() * 50);
        roomIndex++;
      }
      const fp = FINALE_STEPS[seed % FINALE_STEPS.length];
      const frel = fp(rnd);
      for (let i = 0; i < frel.length; i++) {
        const rp = frel[i];
        const y = groundY + rp.dy;
        if (y >= groundY - 310) out.push({ x: origin + rp.dx, y, w: rp.w, h: rp.h });
      }
    } else {
      const tierPrefs = THEME_TIER[theme] || [0, 1, 2];
      let roomIndex = 0;

      while (origin + sliceW < width - 480) {
        const phase = Math.min(2, Math.floor((origin / (width - 480)) * 3));
        let preferredTier = tierPrefs[phase];

        const maxTier = Math.floor(intensity * 3.2);
        preferredTier = Math.min(preferredTier, maxTier);
        if (stageIndex === 0) preferredTier = Math.min(preferredTier, 1);
        if (stageIndex <= 1 && d < 0.4) preferredTier = Math.min(preferredTier, 1);

        const pool = TIERS[preferredTier];
        const pick = pool[roomIndex % pool.length];
        const rel = pick(rnd);
        for (let i = 0; i < rel.length; i++) {
          const rp = rel[i];
          const y = groundY + rp.dy;
          if (y < groundY - 310) continue;
          out.push({ x: origin + rp.dx, y, w: rp.w, h: rp.h });
        }

        // Intensity-scaled gap: easy stages tile near-seamlessly;
        // hard stages still get meaningful spacing.
        const gapBase = Math.floor(8 + intensity * 38);
        const gapRand = Math.floor(rnd() * Math.max(8, Math.floor(intensity * 28)));
        origin += sliceW + gapBase + gapRand;
        roomIndex++;
      }

      const fp = FINALE_STEPS[stageIndex % FINALE_STEPS.length];
      const frel = fp(rnd);
      for (let i = 0; i < frel.length; i++) {
        const rp = frel[i];
        const y = groundY + rp.dy;
        if (y >= groundY - 310) out.push({ x: origin + rp.dx, y, w: rp.w, h: rp.h });
      }
    }

    out.sort(function (a, b) { return a.x - b.x; });
    return out;
  }

  window.GD_buildMacroPlatforms = buildMacroPlatforms;
})();
