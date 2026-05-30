(function () {
  "use strict";

  const G = window.GEOGRAPHY_DASH;
  if (!G) throw new Error("GEOGRAPHY_DASH data missing");

  const PLAYER_W = 28;
  const PLAYER_H = 32;   // reduced so head clears platform undersides at ground level
  const TILE = 40;
  const GOAL_PAD = 56;

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashStr(s) {
    let h = 1779033703 ^ s.length;
    for (let i = 0; i < s.length; i++) {
      h = Math.imul(h ^ s.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
  }

  function aabbOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  }

  // Parse "4/5" → 4, "1/5" → 1, fallback 3
  function parseScore(score) {
    const m = String(score || "3").match(/(\d)/);
    return m ? Math.max(1, Math.min(5, parseInt(m[1], 10))) : 3;
  }

  function generateLevel(city, stageIndex, checkpointsEnabled, viewHeight) {
    const stage = city.stages[stageIndex];
    const rnd = mulberry32(hashStr(city.id + ":" + stageIndex + ":" + stage.hazardTheme));
    const d    = city.difficulty;
    const boss = stage.isBoss;
    const stageScore  = parseScore(stage.score);
    const scorePenalty = (5 - stageScore) / 4;
    const theme = stage.hazardTheme;

    // ── Combined intensity 0→1 used throughout ───────────────────────────────
    // Keeps easy cities EASY at early stages; ramps for hard cities or late stages.
    const stageRamp = Math.min(1, stageIndex / 9);
    // intensity: e.g. Copenhagen S1 = 0.28*0.4 + 0.0 = 0.11  (very easy)
    //            Lagos S9          = 0.95*0.4 + 0.9 = 1.0     (max)
    const intensity = Math.min(1, d * 0.4 + stageRamp * 0.8 + scorePenalty * 0.2);

    // ── Moving-hazard threshold ───────────────────────────────────────────────
    // Cars/patrols/blocks only appear once intensity is high enough.
    // This prevents them from showing up in Copenhagen Stage 1-3.
    const movingHzOk = intensity >= 0.28;
    const fastHzOk   = intensity >= 0.55;

    const vh = Math.max(300, Math.min(viewHeight || 540, 920));
    const width = boss ? 4200 : 2800 + Math.floor(900 * d * stageRamp);
    const groundY = Math.floor(vh * 0.68);
    const platforms = [];
    const hazards = [];

    function addPlat(x, y, w, h) { platforms.push({ x, y, w, h }); }
    function groundSegment(x0, x1) { addPlat(x0, groundY, x1 - x0, 120); }

    groundSegment(-200, width + 200);

    if (window.GD_buildMacroPlatforms) {
      const macro = window.GD_buildMacroPlatforms(
        width, groundY, boss, d, stageIndex,
        hashStr(city.id + "|macro|" + stageIndex), theme
      );
      for (let mi = 0; mi < macro.length; mi++) platforms.push(macro[mi]);
    }

    const aerials = platforms
      .filter(function (pl) { return pl.y < groundY - 22 && pl.h <= 22; })
      .sort(function (a, b) { return a.x - b.x; });

    // ── Ground-level hazard pass ──────────────────────────────────────────────
    // First 480 px always clear (welcome zone). Density scaled by intensity.
    // Below 0.18 the ground is entirely hazard-free so the player can always
    // run through safely (prevents impossible early Copenhagen stages).
    const gndSpikeChance = intensity < 0.25 ? 0 : Math.max(0, 0.07 + intensity * 0.28);
    const gndWaterChance = intensity < 0.32 ? 0 : Math.max(0, 0.04 + intensity * 0.13);
    const gndStep = Math.max(150, 340 - intensity * 160);

    for (let gx = 480; gx < width - 280; gx += gndStep + rnd() * 80) {
      if (rnd() < gndSpikeChance) {
        hazards.push({ kind: "spike", x: gx, y: groundY - 14,
          w: 22 + rnd() * 18, h: 14, lethal: true });
      }
      if (rnd() < gndWaterChance) {
        hazards.push({ kind: "water", x: gx + 40, y: groundY - 10,
          w: 40 + rnd() * 36, h: 12, lethal: true });
      }
    }

    // ── Aerial-platform hazard pass ───────────────────────────────────────────
    // Spacing between placed hazards grows for easy/early stages.
    const hzSpacing = Math.max(90, 260 - intensity * 120);
    const hzChance  = Math.min(0.78, 0.18 + intensity * 0.60);
    let lastHx = -500;

    function pushSpike(x, y, w, h) {
      hazards.push({ kind: "spike", x: x, y: y, w: w || 22, h: h || 14, lethal: true });
    }
    function pushCar(x, y, w, h, vx) {
      if (!movingHzOk) return;
      hazards.push({ kind: "car", x, y, w: w || 54, h: h || 28,
        vx: vx * (fastHzOk ? 1.35 : 0.85), lethal: true });
    }

    for (let ai = 0; ai < aerials.length; ai++) {
      const pl = aerials[ai];
      const cx = pl.x + pl.w * 0.5;
      // Skip welcome zone and enforce spacing between hazards
      if (cx < 480 || cx - lastHx < hzSpacing) continue;
      if (rnd() > hzChance) continue;
      lastHx = cx;
      const platY = pl.y;
      const pw = pl.w;
      const x = pl.x;
      const hzRoll = rnd();

      // Gap to the immediate next/previous aerial platform (edge-to-edge, px).
      // If the gap is already wide, edge spikes make the jump impossible — suppress them.
      const _nextPl    = aerials[ai + 1];
      const _prevPl    = aerials[ai - 1];
      const gapAfter   = _nextPl ? Math.max(0, _nextPl.x - (pl.x + pl.w)) : 0;
      const gapBefore  = _prevPl ? Math.max(0, pl.x - (_prevPl.x + _prevPl.w)) : 0;
      const GAP_LIMIT  = 60; // px — suppress edge spikes once gap reaches this

      // Trailing spike: forces player to jump earlier, eating into a tight gap
      if (intensity > 0.25 && pw > 120 && rnd() < 0.28 && gapAfter < GAP_LIMIT) {
        pushSpike(x + pw - 24, platY - 14, 18, 14);
      }
      // Leading spike: forces player to clear further, same problem from the other side
      if (intensity > 0.5 && pw > 140 && rnd() < 0.18 && gapBefore < GAP_LIMIT) {
        pushSpike(x + 8, platY - 14, 16, 14);
      }

      // ── Theme-specific hazards ──────────────────────────────────────────────
      if ((theme === "car_swarm" || theme === "mobility" || theme === "commute_pulse" || theme === "work") && hzRoll < 0.55) {
        const spd = (1.8 + intensity * 3.8) * (rnd() < 0.5 ? -1 : 1);
        pushCar(x + rnd() * Math.max(8, pw - 40), platY - 26, 52, 26, spd);

      } else if ((theme === "smog_cloud" || theme === "boss_storm") && hzRoll < 0.48) {
        if (movingHzOk) {
          hazards.push({ kind: "cloud", x: x + rnd() * pw * 0.55,
            y: platY - 55 - rnd() * 30, w: 64 + rnd() * 30, h: 32,
            vx: 0.4 + rnd() * 0.9, drift: rnd() * 0.018, lethal: true });
        } else {
          pushSpike(x + pw * 0.4, platY - 14, 22, 14);
        }

      } else if ((theme === "bike_lane" || theme === "safety") && hzRoll < 0.42) {
        pushSpike(x + 16 + rnd() * Math.max(0, pw - 48), platY - 14, 26, 14);
        if (intensity > 0.4 && rnd() < 0.3) pushSpike(x + rnd() * pw * 0.4, platY - 14, 18, 14);

      } else if ((theme === "quake_crack" || theme === "housing") && hzRoll < 0.45) {
        if (theme === "housing" && movingHzOk) {
          hazards.push({ kind: "bill", x: x + rnd() * Math.max(0, pw - 38),
            y: platY - 34, w: 38, h: 18,
            vx: (rnd() < 0.5 ? -1 : 1) * (0.9 + intensity * 1.8), lethal: true });
        } else {
          pushSpike(x + rnd() * Math.max(0, pw - 18), platY - 12, 22, 14);
        }
        if (intensity > 0.45 && rnd() < 0.28) pushSpike(x + pw * 0.6, platY - 12, 16, 12);

      } else if (theme === "flood_zone" && hzRoll < 0.4) {
        hazards.push({ kind: "water", x: x + rnd() * Math.max(8, pw - 44),
          y: platY - 8, w: 40 + rnd() * 24, h: 12,
          phase: rnd() * Math.PI * 2, lethal: true });
        if (intensity > 0.5 && rnd() < 0.3) {
          hazards.push({ kind: "water", x: x + rnd() * Math.max(0, pw - 30),
            y: groundY - 10, w: 36 + rnd() * 24, h: 12, lethal: true });
        }

      } else if ((theme === "patrol_hard" || theme === "patrol_soft") && hzRoll < 0.44) {
        if (movingHzOk) {
          const baseY = platY - 46;
          hazards.push({ kind: "patrol", x: x + rnd() * Math.max(0, pw - 28),
            y: baseY, baseY, w: 28, h: 28, t0: rnd() * 80,
            hard: theme === "patrol_hard",
            amp: 35 + rnd() * (theme === "patrol_hard" ? 65 : 40),
            speed: 0.022 + intensity * 0.028, lethal: true });
        } else {
          pushSpike(x + pw * 0.5 - 11, platY - 14, 22, 14);
        }

      } else if ((theme === "pulse_zone" || theme === "institution_gate" || theme === "health" || theme === "sector") && hzRoll < 0.42) {
        hazards.push({ kind: "gate", x: x + pw * 0.35, y: platY - 62,
          w: 18, h: 62, t0: rnd() * 50, period: 80 + rnd() * 50, lethal: true });

      } else if ((theme === "ballot_wave" || theme === "civic") && hzRoll < 0.38) {
        if (movingHzOk) {
          hazards.push({ kind: "paper", x: x + rnd() * pw,
            y: platY - 90 - rnd() * 28, w: 22, h: 26,
            vy: 1.0 + intensity * 1.8, lethal: true });
        } else {
          pushSpike(x + pw * 0.45 - 10, platY - 14, 20, 14);
        }

      } else if ((theme === "tax_slider" || theme === "income") && hzRoll < 0.45) {
        if (movingHzOk) {
          hazards.push({ kind: "block", x: x + rnd() * Math.max(0, pw - 36),
            y: platY - 34, w: 34, h: 16,
            vx: (rnd() < 0.5 ? -1 : 1) * (0.8 + intensity * 2.0), lethal: true });
        }
        if (intensity > 0.45 && rnd() < 0.3) pushSpike(x + rnd() * pw * 0.4, platY - 14, 18, 14);

      } else if ((theme === "book_stack" || theme === "learning") && hzRoll < 0.42) {
        if (movingHzOk) {
          hazards.push({ kind: "book", x: x + rnd() * pw,
            y: platY - 120 - rnd() * 30, w: 26, h: 34,
            vy: 1.2 + intensity * 1.8, lethal: true });
        } else {
          pushSpike(x + rnd() * Math.max(0, pw - 22), platY - 15, 22, 14);
        }
        if (intensity > 0.55 && rnd() < 0.28) pushSpike(x + 10, platY - 15, 16, 14);

      } else if ((theme === "stage_hazard" || theme === "arts") && hzRoll < 0.4) {
        if (movingHzOk) {
          hazards.push({ kind: "paper", x: x + rnd() * pw,
            y: platY - 95 - rnd() * 35, w: 22, h: 28,
            vy: 1.2 + intensity * 2.0, lethal: true });
        }
        if (intensity > 0.45 && rnd() < 0.32) pushSpike(x + rnd() * pw, platY - 14, 20, 14);

      } else if ((theme === "wind_turbine" || theme === "env") && hzRoll < 0.4) {
        if (intensity > 0.3) {
          hazards.push({ kind: "blade", x: x + pw * 0.5, y: platY - 108,
            r: 44, w: 88, h: 88,
            spin: 0.025 + intensity * 0.04,
            ang: rnd() * Math.PI * 2, lethal: true });
        } else {
          pushSpike(x + pw * 0.4, platY - 14, 20, 14);
        }

      } else if (theme === "boss_tower" || theme === "boss_sprawl") {
        // Housing bosses: flying rent/price-tag bills are the primary hazard
        hazards.push({ kind: "bill", x: x + rnd() * Math.max(0, pw - 40),
          y: platY - 34, w: 40, h: 20,
          vx: (rnd() < 0.5 ? -1 : 1) * (2.0 + d * 2.5), lethal: true });
        if (rnd() < 0.55) {
          pushCar(x + rnd() * pw, platY - 26, 54, 28, (rnd() < 0.5 ? -1 : 1) * (3.0 + d * 3.0));
        }

      } else if (theme === "boss_volatile" || theme === "boss_lagos") {
        pushCar(x, platY - 28, 56, 28, 3.4 + d * 3.0);
        if (hzRoll < 0.42) {
          hazards.push({ kind: "patrol", x: x + pw * 0.5, y: platY - 36,
            baseY: platY - 36, w: 28, h: 28, t0: 0, amp: 75, speed: 0.038, lethal: true });
        }

      } else if (hzRoll < 0.50) {
        pushSpike(x + rnd() * Math.max(0, pw - 18), platY - 12, 20, 14);
        if (intensity > 0.5 && rnd() < 0.28 && theme !== "patrol_soft" && movingHzOk) {
          hazards.push({ kind: "block", x: x + rnd() * Math.max(0, pw - 36),
            y: platY - 32, w: 34, h: 15,
            vx: (rnd() < 0.5 ? -1 : 1) * (0.9 + intensity * 1.8), lethal: true });
        }
      }
    }

    // ── Car-lane sweep for vehicle-themed stages ──────────────────────────────
    if (movingHzOk && (theme === "car_swarm" || theme === "boss_sprawl" || theme === "boss_lagos")) {
      const laneCount = boss ? 3 + Math.floor(d) : 1 + Math.floor(intensity * 2);
      const laneSpacing = Math.max(200, (width - 400) / Math.max(1, laneCount));
      for (let li = 0; li < laneCount; li++) {
        const laneX = 400 + li * laneSpacing;
        const vxDir = li % 2 === 0 ? 1 : -1;
        const spd = (2.0 + intensity * 3.0) * vxDir;
        hazards.push({ kind: "car", x: laneX, y: groundY - 30, w: 54, h: 28, vx: spd, lethal: true });
        if (intensity > 0.55 || boss) {
          hazards.push({ kind: "car", x: laneX + laneSpacing * 0.5,
            y: groundY - 30, w: 50, h: 26, vx: spd * 1.1, lethal: true });
        }
      }
    }

    // ── Boss gauntlet gates ───────────────────────────────────────────────────
    if (boss && (theme === "boss_tower" || theme === "boss_volatile" || theme === "boss_storm")) {
      for (let gi = 0; gi < 3; gi++) {
        const gx = 420 + gi * 880;
        hazards.push({ kind: "gate", x: gx, y: groundY - 88, w: 20, h: 88,
          t0: gi * 18, period: 85 + gi * 18, lethal: true });
        if (theme === "boss_storm") {
          hazards.push({ kind: "cloud", x: gx + 60, y: groundY - 135, w: 84, h: 38,
            vx: 0.7 + d * 0.5, drift: gi * 0.018, lethal: true });
        }
      }
    }

    const goalX = width - GOAL_PAD;

    // ── Spike floor ──────────────────────────────────────────────────────────
    // Tiles the ground with lethal spikes from the end of the welcome zone
    // (x=480) to 800 px before the goal, forcing aerial platforming.
    // Edge-spike suppression above (GAP_LIMIT) handles impossible jumps;
    // the floor itself stays solid.
    {
      const floorStart = 480;
      const floorEnd   = Math.max(floorStart + 200, goalX - 800);
      for (let sx = floorStart; sx < floorEnd; sx += 32) {
        hazards.push({ kind: "spike", x: sx, y: groundY - 14,
                       w: 32, h: 14, lethal: true });
      }
    }

    const level = {
      width,
      groundY,
      platforms,
      hazards,
      decorations: [],
      triggers: [],
      goalX,
      goalY: groundY - PLAYER_H - 4,
      stage,
      city,
      checkpointsEnabled,
      isHub: false,
    };
    if (window.GD_DECO && typeof window.GD_DECO.enrichLevel === "function") {
      window.GD_DECO.enrichLevel(level, city, stage, rnd);
    }
    return level;
  }

  function GeographyDashGame(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.state = "idle";
    this.mode = "run";
    this.level = null;
    this.player = null;
    this.cameraX = 0;
    this.cityIndex = 0;
    this.stageIndex = 0;
    this.checkpointsEnabled = true;
    this.spawnStageIndex = 0;
    this.time = 0;
    this.hubNearTrigger = null;
    this.hubStageIndex = 0;
    this.keys = Object.create(null);
    this._bindKeys();
  }

  GeographyDashGame.prototype._bindKeys = function () {
    const self = this;
    window.addEventListener(
      "keydown",
      function (e) {
        self.keys[e.code] = true;
      },
      { passive: true }
    );
    window.addEventListener(
      "keyup",
      function (e) {
        self.keys[e.code] = false;
      },
      { passive: true }
    );
  };

  GeographyDashGame.prototype.beginStage = function (cityIndex, stageIndex, opts) {
    opts = opts || {};
    this.mode = "run";
    this.cityIndex = cityIndex;
    this.stageIndex = stageIndex;
    this.checkpointsEnabled = opts.checkpointsEnabled !== false;
    if (opts.resetSpawn) this.spawnStageIndex = stageIndex;
    const city = G.cities[cityIndex];
    const vh = this.canvas.clientHeight || 540;
    this.level = generateLevel(city, stageIndex, this.checkpointsEnabled, vh);
    this.player = {
      x: 80,
      y: this.level.groundY - PLAYER_H - 2,
      vx: 0,
      vy: 0,
      onGround: false,
      facing: 1,
      coyote: 0,
      _jw: false,
    };
    this.cameraX = 0;
    this.time = 0;
    this.hubNearTrigger = null;
    this.state = "playing";
  };

  GeographyDashGame.prototype.beginHub = function (cityIndex, stageIndex) {
    this.mode = "hub";
    this.cityIndex = cityIndex;
    this.hubStageIndex = stageIndex == null ? 0 : stageIndex | 0;
    const city = G.cities[cityIndex];
    const vh = this.canvas.clientHeight || 540;
    const build = window.GD_buildHubLevel;
    this.level = build ? build(city, vh, this.hubStageIndex) : null;
    if (!this.level) return;
    this.stageIndex = this.hubStageIndex;
    this.player = {
      x: 80,
      y: this.level.groundY - PLAYER_H - 2,
      vx: 0,
      vy: 0,
      onGround: false,
      facing: 1,
      coyote: 0,
      _jw: false,
    };
    this.cameraX = 0;
    this.time = 0;
    this.hubNearTrigger = null;
    this.state = "playing";
  };

  GeographyDashGame.prototype.respawn = function () {
    const city = G.cities[this.cityIndex];
    const vh = this.canvas.clientHeight || 540;
    if (this.mode === "hub" && window.GD_buildHubLevel) {
      this.level = window.GD_buildHubLevel(city, vh, this.hubStageIndex);
    } else {
      this.level = generateLevel(city, this.stageIndex, this.checkpointsEnabled, vh);
    }
    this.player.x = 80;
    this.player.y = this.level.groundY - PLAYER_H - 2;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.onGround = false;
    this.player.coyote = 0;
    this.player._jw = false;
  };

  GeographyDashGame.prototype.restartFromCityStart = function () {
    this.spawnStageIndex = 0;
    this.stageIndex = 0;
    this.beginStage(this.cityIndex, 0, {
      checkpointsEnabled: this.checkpointsEnabled,
      resetSpawn: true,
    });
  };

  GeographyDashGame.prototype.update = function (dt) {
    if (this.state !== "playing" || !this.level || !this.player) return null;

    const p = this.player;
    const lvl = this.level;
    const gy = lvl.groundY;
    const city = lvl.city;
    const isHub = !!lvl.isHub;
    const d = isHub ? 0.32 : city.difficulty;
    this.time += dt;

    const wantJump = !!(this.keys["Space"] || this.keys["ArrowUp"] || this.keys["KeyW"]);
    const airMult = isHub ? 0.76 : 0.7 - d * 0.1;
    const moveAccel = isHub ? 0.94 : 0.76 + (1 - d) * 0.22;
    const maxRun = isHub ? 5.5 : 4.85 + (1 - d) * 0.5;
    const gravity = isHub ? 0.5 : 0.54 + d * 0.18;
    const jumpVel = isHub ? -10.2 : -(9.6 + (1 - d) * 1.05);
    const maxFall = isHub ? 15.5 : 13.5 + d * 6;

    if (this.keys["ArrowLeft"] || this.keys["KeyA"]) {
      p.vx -= moveAccel * (p.onGround ? 1 : airMult);
      p.facing = -1;
    }
    if (this.keys["ArrowRight"] || this.keys["KeyD"]) {
      p.vx += moveAccel * (p.onGround ? 1 : airMult);
      p.facing = 1;
    }
    p.vx *= p.onGround ? 0.845 : 0.88;
    if (p.vx > maxRun) p.vx = maxRun;
    if (p.vx < -maxRun) p.vx = -maxRun;

    p.vy = Math.min(maxFall, p.vy + gravity);

    const prevBottom = p.y + PLAYER_H;
    p.y += p.vy;
    p.onGround = false;

    for (let i = 0; i < lvl.platforms.length; i++) {
      const pl = lvl.platforms[i];
      if (!aabbOverlap(p.x, p.y, PLAYER_W, PLAYER_H, pl.x, pl.y, pl.w, pl.h)) continue;
      if (p.vy > 0 && prevBottom <= pl.y + 6 && p.y + PLAYER_H >= pl.y - 0.5) {
        p.y = pl.y - PLAYER_H;
        p.vy = 0;
        p.onGround = true;
      } else if (p.vy < 0 && p.y + PLAYER_H > pl.y + pl.h * 0.35 && p.y < pl.y + pl.h) {
        p.y = pl.y + pl.h;
        p.vy = 0;
      }
    }

    if (p.onGround) p.coyote = isHub ? 0.1 : 0.07;
    else p.coyote = Math.max(0, (p.coyote || 0) - dt);

    const edgeJump = wantJump && !p._jw;
    p._jw = wantJump;
    if (edgeJump && (p.onGround || (!isHub && p.coyote > 0))) {
      p.vy = jumpVel;
      p.onGround = false;
      p.coyote = 0;
    }

    if (!isHub && p.vy < -2.9 && !wantJump) {
      p.vy = Math.max(p.vy * 0.86, -3.5);
    }

    p.x += p.vx;
    for (let j = 0; j < lvl.platforms.length; j++) {
      const pl = lvl.platforms[j];
      if (!aabbOverlap(p.x, p.y, PLAYER_W, PLAYER_H, pl.x, pl.y, pl.w, pl.h)) continue;
      const overlapX =
        Math.min(p.x + PLAYER_W - pl.x, pl.x + pl.w - p.x, PLAYER_W, pl.w) <
        Math.min(p.y + PLAYER_H - pl.y, pl.y + pl.h - p.y, PLAYER_H, pl.h);
      // Only block sideways when the player's feet are actually ABOVE the
      // platform's bottom face (+6 px tolerance).  This lets the player walk
      // along the ground under a floating platform without hitting an invisible
      // side-wall – the single root cause of "impossible Level 1" for all cities.
      if (overlapX && (p.y + PLAYER_H) < (pl.y + pl.h + 6)) {
        if (p.vx > 0) p.x = pl.x - PLAYER_W;
        else if (p.vx < 0) p.x = pl.x + pl.w;
        p.vx = 0;
      }
    }

    if (p.y > gy + 220) {
      this._die();
      return { type: "fall" };
    }

    if (!isHub) {
      for (let h = 0; h < lvl.hazards.length; h++) {
        const z = lvl.hazards[h];
        this._integrateHazard(z, dt);
        if (this._hazardHit(z, p)) {
          this._die();
          return { type: "hazard", hazard: z.kind };
        }
      }
    }

    this.hubNearTrigger = null;
    if (isHub && lvl.triggers) {
      for (let ti = 0; ti < lvl.triggers.length; ti++) {
        const tr = lvl.triggers[ti];
        if (aabbOverlap(p.x, p.y, PLAYER_W, PLAYER_H, tr.x, tr.y, tr.w, tr.h)) {
          this.hubNearTrigger = tr;
          if (this.keys["KeyE"]) {
            this.keys["KeyE"] = false;
            return { type: "hub_talk", title: tr.title, text: tr.text, valence: tr.valence };
          }
          break;
        }
      }
    }

    const gx = lvl.goalX;
    const ggy = lvl.goalY;
    if (p.x + PLAYER_W > gx - 4 && p.x < gx + 42 && p.y + PLAYER_H > ggy - 4 && p.y < ggy + 42) {
      if (isHub) {
        this.state = "hub_done";
        return { type: "hub_exit" };
      }
      this.state = "won";
      return { type: "win" };
    }

    const viewW = this.canvas.clientWidth || 800;
    const look = p.vx * 10;
    const targetCam = p.x - viewW * 0.36 + look;
    this.cameraX += (targetCam - this.cameraX) * 0.18;
    if (this.cameraX < 0) this.cameraX = 0;
    if (this.cameraX > lvl.width - viewW + 100) this.cameraX = Math.max(0, lvl.width - viewW + 100);

    return { type: "move" };
  };

  GeographyDashGame.prototype._die = function () {
    if (this.mode === "hub") {
      this.respawn();
      return;
    }
    if (this.checkpointsEnabled) {
      this.respawn();
    } else {
      this.restartFromCityStart();
    }
  };

  GeographyDashGame.prototype._integrateHazard = function (z, dt) {
    if (z.kind === "car") {
      z.x += z.vx * dt * 60;
      const wrapL = this.cameraX - 200;
      const wrapR = this.cameraX + (this.canvas.clientWidth || 800) + 400;
      if (z.x < wrapL) z.x = wrapR;
      if (z.x > wrapR) z.x = wrapL;
    } else if (z.kind === "cloud") {
      z.x += z.vx * dt * 60;
      z.y += Math.sin(this.time * 2 + (z.drift || 0)) * 0.15;
    } else if (z.kind === "patrol") {
      const base = z.baseY != null ? z.baseY : z.y;
      z.y = base + Math.sin(this.time * (z.speed || 0.03) * 60 + (z.t0 || 0)) * z.amp;
    } else if (z.kind === "paper") {
      z.y += z.vy * dt * 60;
      if (z.y > this.level.groundY + 40) z.y = -200;
    } else if (z.kind === "block" || z.kind === "bill") {
      z.x += z.vx * dt * 60;
      if (z.x < this.cameraX - 100 || z.x > this.cameraX + 1200) z.vx *= -1;
    } else if (z.kind === "book") {
      z.y += z.vy * dt * 60;
      if (z.y > this.level.groundY + 40) z.y = -180;
    } else if (z.kind === "blade") {
      z.ang += (z.spin || 0.04) * dt * 60;
    } else if (z.kind === "gate") {
      z.phase = (z.phase || 0) + dt * 60;
      z._open =
        (Math.sin((z.phase / (z.period || 120)) * Math.PI * 2 + (z.t0 || 0) * 0.05) + 1) * 0.5;
    }
  };

  GeographyDashGame.prototype._hazardHit = function (z, p) {
    if (z.kind === "car" || z.kind === "cloud" || z.kind === "block" || z.kind === "bill") {
      return aabbOverlap(p.x, p.y, PLAYER_W, PLAYER_H, z.x, z.y, z.w, z.h);
    }
    if (z.kind === "spike" || z.kind === "water") {
      return aabbOverlap(p.x, p.y, PLAYER_W, PLAYER_H, z.x, z.y, z.w, z.h);
    }
    if (z.kind === "patrol") {
      return aabbOverlap(p.x, p.y, PLAYER_W, PLAYER_H, z.x, z.y, z.w, z.h);
    }
    if (z.kind === "paper" || z.kind === "book") {
      return aabbOverlap(p.x, p.y, PLAYER_W, PLAYER_H, z.x, z.y, z.w, z.h);
    }
    if (z.kind === "blade") {
      const cx = z.x;
      const cy = z.y;
      const pr = 14;
      for (let k = 0; k < 3; k++) {
        const ang = z.ang + (k * Math.PI * 2) / 3;
        const bx = cx + Math.cos(ang) * (z.r * 0.85);
        const by = cy + Math.sin(ang) * (z.r * 0.85);
        if (aabbOverlap(p.x, p.y, PLAYER_W, PLAYER_H, bx - pr, by - pr, pr * 2, pr * 2)) return true;
      }
      return aabbOverlap(p.x, p.y, PLAYER_W, PLAYER_H, cx - 8, cy - z.r, 16, z.r * 2);
    }
    if (z.kind === "gate") {
      const open = z._open != null ? z._open : 0.5;
      if (open > 0.72) return false;
      return aabbOverlap(p.x, p.y, PLAYER_W, PLAYER_H, z.x, z.y, z.w, z.h);
    }
    return false;
  };

  GeographyDashGame.prototype.drawBackdrop = function (ctx, w, h) {
    const city = G.cities[this.cityIndex];
    const gy = this.level ? this.level.groundY : Math.floor(h * 0.68);
    const stage = this.level && this.level.stage;
    if (window.GD_paintCityBackground) {
      window.GD_paintCityBackground(ctx, city, this.cameraX, w, h, this.time, gy, stage);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, city.skyTop);
      g.addColorStop(1, city.skyBot);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }
  };

  GeographyDashGame.prototype.drawWorld = function (ctx, w, h) {
    const lvl = this.level;
    if (!lvl) return;
    const cam = this.cameraX;
    const city = lvl.city;
    const Spr = window.GD_SPRITES;
    const isHub = !!lvl.isHub;

    this.drawBackdrop(ctx, w, h);

    ctx.save();
    ctx.translate(-cam, 0);

    const decs = lvl.decorations || [];
    const Deco = window.GD_DECO;
    if (Spr || Deco) {
      for (let di = 0; di < decs.length; di++) {
        const d = decs[di];
        if ((d.layer || 0) >= 0) continue;
        if (Deco && !Deco.visible(d.x, 120, cam, w)) continue;
        if (Deco && Deco.drawProp) Deco.drawProp(ctx, d.id, d.x, d.yb, d.sc || 1, this.time, 1, false);
        else if (Spr) Spr.draw(ctx, d.id, d.x, d.yb, d.sc || 1, this.time, 1, false);
      }
    }

    for (let i = 0; i < lvl.platforms.length; i++) {
      this._drawPlatform(ctx, lvl.platforms[i], lvl, city);
    }

    if (Spr || Deco) {
      for (let di = 0; di < decs.length; di++) {
        const d = decs[di];
        if ((d.layer || 0) < 0) continue;
        if (Deco && !Deco.visible(d.x, 120, cam, w)) continue;
        if (Deco && Deco.drawProp) Deco.drawProp(ctx, d.id, d.x, d.yb, d.sc || 1, this.time, 1, false);
        else if (Spr) Spr.draw(ctx, d.id, d.x, d.yb, d.sc || 1, this.time, 1, false);
      }
    }

    for (let hi = 0; hi < lvl.hazards.length; hi++) {
      const z = lvl.hazards[hi];
      if (Spr && Spr.drawHazardFromAtlas && Spr.drawHazardFromAtlas(ctx, z)) continue;
      // Detailed hazard renderer (hazards.js)
      if (Deco && Deco.drawHazard) { Deco.drawHazard(ctx, z, this.time, city); continue; }
      if (z.kind === "car") {
        ctx.fillStyle = "#c0392b";
        ctx.fillRect(z.x, z.y, z.w, z.h);
        ctx.fillStyle = "#ecf0f1";
        ctx.fillRect(z.x + (z.vx > 0 ? z.w - 14 : 4), z.y + 6, 10, 10);
        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(z.x + 6, z.y + z.h - 8, z.w - 12, 6);
      } else if (z.kind === "cloud") {
        ctx.fillStyle = "rgba(120,120,130,0.55)";
        ctx.beginPath();
        ctx.ellipse(z.x + z.w * 0.3, z.y + z.h * 0.5, z.w * 0.35, z.h * 0.45, 0, 0, Math.PI * 2);
        ctx.ellipse(z.x + z.w * 0.65, z.y + z.h * 0.45, z.w * 0.28, z.h * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (z.kind === "spike") {
        ctx.fillStyle = "#c0392b";
        ctx.beginPath();
        ctx.moveTo(z.x, z.y + z.h);
        ctx.lineTo(z.x + z.w * 0.5, z.y);
        ctx.lineTo(z.x + z.w, z.y + z.h);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#922b21";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "rgba(231,76,60,0.25)";
        ctx.fillRect(z.x - 2, z.y + z.h - 2, z.w + 4, 4);
      } else if (z.kind === "water") {
        ctx.fillStyle = "rgba(41, 128, 185, 0.65)";
        ctx.fillRect(z.x, z.y, z.w, z.h);
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(z.x + 4, z.y + 2, z.w - 8, 3);
      } else if (z.kind === "patrol") {
        ctx.fillStyle = "#9b59b6";
        ctx.fillRect(z.x, z.y, z.w, z.h);
        ctx.fillStyle = "#fff";
        ctx.fillRect(z.x + 6, z.y + 8, z.w - 12, 6);
      } else if (z.kind === "paper") {
        ctx.fillStyle = "#ecf0f1";
        ctx.fillRect(z.x, z.y, z.w, z.h);
      } else if (z.kind === "block") {
        ctx.fillStyle = "#f39c12";
        ctx.fillRect(z.x, z.y, z.w, z.h);
      } else if (z.kind === "bill") {
        ctx.fillStyle = "#e74c3c";
        ctx.fillRect(z.x, z.y, z.w, z.h);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("RENT", z.x + z.w * 0.5, z.y + z.h * 0.5);
      } else if (z.kind === "book") {
        ctx.fillStyle = "#1a3a6b";
        ctx.fillRect(z.x, z.y, z.w, z.h);
        ctx.fillStyle = "#e8e0d4";
        ctx.fillRect(z.x + z.w - 5, z.y, 5, z.h);
      } else if (z.kind === "blade") {
        ctx.strokeStyle = "#95a5a6";
        ctx.lineWidth = 6;
        for (let k = 0; k < 3; k++) {
          const ang = z.ang + (k * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.moveTo(z.x, z.y);
          ctx.lineTo(z.x + Math.cos(ang) * z.r, z.y + Math.sin(ang) * z.r);
          ctx.stroke();
        }
        ctx.fillStyle = "#7f8c8d";
        ctx.beginPath();
        ctx.arc(z.x, z.y, 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (z.kind === "gate") {
        const open = z._open != null ? z._open : 0.5;
        ctx.fillStyle = "rgba(231, 76, 60, " + (0.35 + (1 - open) * 0.45) + ")";
        ctx.fillRect(z.x, z.y, z.w, z.h);
      }
    }

    if (isHub && lvl.triggers) {
      for (let ti = 0; ti < lvl.triggers.length; ti++) {
        const tr = lvl.triggers[ti];
        const near = this.hubNearTrigger === tr;
        this._drawHubObject(ctx, tr, near, this.time, city);
      }
    }

    const gx = lvl.goalX;
    const gy = lvl.goalY;
    if (isHub && Spr) {
      Spr.exit_arch(ctx, gx + 10, lvl.groundY, 1);
    } else {
      ctx.fillStyle = city.accent;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + 36, gy + 18);
      ctx.lineTo(gx, gy + 36);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "12px system-ui,sans-serif";
      ctx.fillText("Goal", gx - 4, gy - 8);
    }

    const p = this.player;
    if (Deco && Deco.drawPlayer) {
      // Detailed procedural player from deco/player.js — always preferred
      Deco.drawPlayer(ctx, p, this.time, city);
    } else if (Spr && Spr.player) {
      Spr.player(ctx, p.x, p.y, p.facing);
    } else {
      ctx.fillStyle = "#1abc9c";
      ctx.fillRect(p.x, p.y, PLAYER_W, PLAYER_H);
      ctx.fillStyle = "#16a085";
      ctx.fillRect(p.facing > 0 ? p.x + 16 : p.x + 4, p.y + 12, 10, 8);
    }

    ctx.restore();
  };

  // ── Hub object icon renderer ──────────────────────────────────────────────
  GeographyDashGame.prototype._drawHubObject = function (ctx, tr, near, t, city) {
    const cx  = tr.x + tr.w * 0.5;
    const by  = tr.platY != null ? tr.platY : (tr.y + tr.h);
    const acc = city ? (city.accent || "#1abc9c") : "#1abc9c";
    const kind = tr.kind || "stats";
    const glow = near ? 0.9 + 0.1 * Math.sin(t * 6) : 0;

    ctx.save();

    // Glow halo when nearby
    if (near) {
      ctx.shadowColor  = acc;
      ctx.shadowBlur   = 18 + glow * 8;
    }

    // Pedestal
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(cx - 22, by - 12, 44, 12);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(cx - 20, by - 12, 40, 3);

    // ── Kind-specific icon ────────────────────────────────────────────────────
    ctx.shadowBlur = near ? 12 : 0;

    if (kind === "turbine") {
      // Wind turbine
      ctx.strokeStyle = "#ecf0f1"; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(cx, by - 12); ctx.lineTo(cx, by - 80); ctx.stroke();
      ctx.fillStyle = "#bdc3c7";
      ctx.beginPath(); ctx.arc(cx, by - 80, 7, 0, Math.PI * 2); ctx.fill();
      // 3 blades, rotate with time
      const ang0 = t * 1.2;
      ctx.strokeStyle = "#ecf0f1"; ctx.lineWidth = 3;
      for (let b = 0; b < 3; b++) {
        const a = ang0 + b * (Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.moveTo(cx, by - 80);
        ctx.lineTo(cx + Math.cos(a) * 34, by - 80 + Math.sin(a) * 34);
        ctx.stroke();
      }

    } else if (kind === "solar") {
      // Solar panel
      ctx.fillStyle = "#2471a3";
      ctx.fillRect(cx - 30, by - 72, 60, 44);
      ctx.strokeStyle = "#aed6f1"; ctx.lineWidth = 1;
      for (let gx2 = 0; gx2 < 3; gx2++) {
        for (let gy2 = 0; gy2 < 2; gy2++) {
          ctx.strokeRect(cx - 29 + gx2 * 20, by - 71 + gy2 * 22, 18, 20);
        }
      }
      ctx.fillStyle = "#d4e6f1"; ctx.fillRect(cx - 4, by - 72, 8, 4);
      ctx.fillStyle = "#7f8c8d"; ctx.fillRect(cx - 2, by - 68, 4, 56);

    } else if (kind === "leaf") {
      // Green leaf
      ctx.fillStyle = "#27ae60";
      ctx.beginPath();
      ctx.moveTo(cx, by - 14);
      ctx.bezierCurveTo(cx + 30, by - 70, cx + 30, by - 78, cx, by - 78);
      ctx.bezierCurveTo(cx - 30, by - 78, cx - 30, by - 70, cx, by - 14);
      ctx.fill();
      ctx.strokeStyle = "#1e8449"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, by - 14); ctx.lineTo(cx, by - 74); ctx.stroke();

    } else if (kind === "bike") {
      // Bicycle
      ctx.strokeStyle = "#f39c12"; ctx.lineWidth = 3;
      // wheels
      ctx.beginPath(); ctx.arc(cx - 22, by - 28, 18, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 22, by - 28, 18, 0, Math.PI * 2); ctx.stroke();
      // frame
      ctx.beginPath();
      ctx.moveTo(cx + 22, by - 28); ctx.lineTo(cx, by - 50);
      ctx.lineTo(cx - 22, by - 28); ctx.moveTo(cx, by - 50); ctx.lineTo(cx - 4, by - 28);
      ctx.stroke();
      // handlebars
      ctx.beginPath(); ctx.moveTo(cx - 6, by - 52); ctx.lineTo(cx + 6, by - 52); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + 18, by - 50); ctx.lineTo(cx + 28, by - 48); ctx.stroke();

    } else if (kind === "metro") {
      // Subway car
      ctx.fillStyle = "#2980b9";
      ctx.beginPath();
      ctx.moveTo(cx - 36, by - 12);
      ctx.lineTo(cx - 36, by - 60);
      ctx.quadraticCurveTo(cx - 36, by - 68, cx - 28, by - 68);
      ctx.lineTo(cx + 28, by - 68);
      ctx.quadraticCurveTo(cx + 36, by - 68, cx + 36, by - 60);
      ctx.lineTo(cx + 36, by - 12);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#d5e8f5";
      for (let wi = 0; wi < 3; wi++) {
        ctx.fillRect(cx - 30 + wi * 22, by - 58, 16, 16);
      }
      ctx.fillStyle = "#1a6a9a"; ctx.fillRect(cx - 35, by - 35, 70, 4);

    } else if (kind === "ferry") {
      // Ferry boat
      ctx.fillStyle = "#ecf0f1";
      ctx.beginPath(); ctx.moveTo(cx - 38, by - 30); ctx.lineTo(cx + 38, by - 30);
      ctx.lineTo(cx + 28, by - 14); ctx.lineTo(cx - 28, by - 14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#2980b9";
      ctx.fillRect(cx - 20, by - 60, 40, 30);
      ctx.fillStyle = "#d5e8f5"; ctx.fillRect(cx - 12, by - 56, 10, 14);
      ctx.fillRect(cx + 2,  by - 56, 10, 14);
      // Stack/chimney
      ctx.fillStyle = "#7f8c8d";
      ctx.fillRect(cx - 4, by - 78, 8, 20);

    } else if (kind === "car") {
      // Automobile (friendly, not hazard)
      ctx.fillStyle = acc;
      ctx.beginPath();
      ctx.moveTo(cx - 36, by - 18); ctx.lineTo(cx - 36, by - 38);
      ctx.lineTo(cx - 20, by - 54); ctx.lineTo(cx + 20, by - 54);
      ctx.lineTo(cx + 36, by - 38); ctx.lineTo(cx + 36, by - 18);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillRect(cx - 18, by - 50, 14, 14);
      ctx.fillRect(cx +  4, by - 50, 14, 14);
      ctx.fillStyle = "#2c3e50";
      ctx.beginPath(); ctx.arc(cx - 24, by - 14, 9, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 24, by - 14, 9, 0, Math.PI * 2); ctx.fill();

    } else if (kind === "hospital") {
      // Hospital building
      ctx.fillStyle = "#ecf0f1";
      ctx.fillRect(cx - 28, by - 70, 56, 58);
      ctx.fillStyle = "#e74c3c";
      ctx.fillRect(cx - 6, by - 58, 12, 30); // cross vertical
      ctx.fillRect(cx - 18, by - 48, 36, 12); // cross horizontal
      ctx.fillStyle = "#bdc3c7"; ctx.fillRect(cx - 10, by - 12, 20, 12);

    } else if (kind === "vote") {
      // Ballot box
      ctx.fillStyle = "#2c3e50";
      ctx.fillRect(cx - 26, by - 50, 52, 38);
      ctx.fillStyle = "#ecf0f1"; ctx.fillRect(cx - 20, by - 44, 40, 26);
      // Slot
      ctx.fillStyle = "#2c3e50"; ctx.fillRect(cx - 14, by - 56, 28, 8);
      // Ballot paper going in
      ctx.fillStyle = "#fff";
      ctx.fillRect(cx - 8, by - 76 + Math.sin(t * 2) * 4, 16, 22);
      ctx.fillStyle = "#3498db"; // lines on ballot
      for (let li = 0; li < 3; li++) ctx.fillRect(cx - 5, by - 72 + li * 6 + Math.sin(t * 2) * 4, 10, 2);

    } else if (kind === "flag") {
      // Flag pole + waving flag
      ctx.strokeStyle = "#bdc3c7"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx - 8, by - 12); ctx.lineTo(cx - 8, by - 80); ctx.stroke();
      // Flag wave
      ctx.fillStyle = acc;
      ctx.beginPath();
      ctx.moveTo(cx - 8, by - 78);
      ctx.lineTo(cx + 28 + Math.sin(t * 2.5) * 6, by - 68);
      ctx.lineTo(cx + 26 + Math.sin(t * 2.5 + 0.8) * 6, by - 55);
      ctx.lineTo(cx - 8, by - 50);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 4, by - 72); ctx.lineTo(cx + 20, by - 64);
      ctx.stroke();

    } else if (kind === "dollar") {
      // Large dollar sign
      ctx.fillStyle = "#f1c40f";
      ctx.font = "bold 62px serif";
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.fillText("$", cx, by - 12);
      ctx.fillStyle = "rgba(241,196,15,0.18)";
      ctx.beginPath(); ctx.arc(cx, by - 48, 38, 0, Math.PI * 2); ctx.fill();

    } else if (kind === "house") {
      // House silhouette
      ctx.fillStyle = "#e67e22";
      // Roof
      ctx.beginPath();
      ctx.moveTo(cx, by - 78); ctx.lineTo(cx + 38, by - 46); ctx.lineTo(cx - 38, by - 46);
      ctx.closePath(); ctx.fill();
      // Wall
      ctx.fillStyle = "#d35400";
      ctx.fillRect(cx - 28, by - 46, 56, 34);
      // Door
      ctx.fillStyle = "#784212"; ctx.fillRect(cx - 8, by - 28, 16, 28);
      // Window
      ctx.fillStyle = "#aed6f1"; ctx.fillRect(cx + 8, by - 42, 14, 12);

    } else if (kind === "crane") {
      // Construction crane
      ctx.strokeStyle = "#f39c12"; ctx.lineWidth = 4;
      // Mast
      ctx.beginPath(); ctx.moveTo(cx - 4, by - 12); ctx.lineTo(cx - 4, by - 80); ctx.stroke();
      // Boom
      ctx.beginPath(); ctx.moveTo(cx - 4, by - 78); ctx.lineTo(cx + 42, by - 78); ctx.stroke();
      // Counterweight
      ctx.beginPath(); ctx.moveTo(cx - 4, by - 78); ctx.lineTo(cx - 28, by - 78); ctx.stroke();
      ctx.fillStyle = "#f39c12";
      ctx.fillRect(cx - 36, by - 84, 14, 12);
      // Cable + hook
      ctx.strokeStyle = "#ecf0f1"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx + 28, by - 78); ctx.lineTo(cx + 28, by - 38); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + 28, by - 34, 6, 0, Math.PI); ctx.stroke();

    } else if (kind === "book") {
      // Open book
      ctx.fillStyle = "#ecf0f1";
      ctx.beginPath();
      ctx.moveTo(cx, by - 18);
      ctx.lineTo(cx - 36, by - 54); ctx.lineTo(cx - 36, by - 72); ctx.lineTo(cx, by - 40);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx, by - 18);
      ctx.lineTo(cx + 36, by - 54); ctx.lineTo(cx + 36, by - 72); ctx.lineTo(cx, by - 40);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#bdc3c7"; ctx.lineWidth = 1;
      for (let li = 0; li < 3; li++) {
        ctx.beginPath();
        ctx.moveTo(cx - 30, by - 56 + li * 8); ctx.lineTo(cx - 4, by - 44 + li * 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + 30, by - 56 + li * 8); ctx.lineTo(cx + 4, by - 44 + li * 5);
        ctx.stroke();
      }
      ctx.fillStyle = "#7f8c8d"; ctx.fillRect(cx - 2, by - 18, 4, 22);

    } else if (kind === "school") {
      // School building
      ctx.fillStyle = "#d5dbdb";
      ctx.fillRect(cx - 34, by - 62, 68, 50);
      // Roof
      ctx.fillStyle = "#922b21";
      ctx.beginPath();
      ctx.moveTo(cx - 38, by - 62); ctx.lineTo(cx, by - 82); ctx.lineTo(cx + 38, by - 62);
      ctx.closePath(); ctx.fill();
      // Door
      ctx.fillStyle = "#784212"; ctx.fillRect(cx - 8, by - 30, 16, 30);
      // Windows
      ctx.fillStyle = "#aed6f1";
      ctx.fillRect(cx - 30, by - 54, 16, 14);
      ctx.fillRect(cx + 14, by - 54, 16, 14);

    } else if (kind === "factory") {
      // Factory
      ctx.fillStyle = "#7f8c8d";
      ctx.fillRect(cx - 32, by - 54, 64, 42);
      // Chimney
      ctx.fillStyle = "#95a5a6"; ctx.fillRect(cx - 22, by - 78, 14, 26);
      ctx.fillRect(cx + 8, by - 70, 14, 18);
      // Smoke
      ctx.fillStyle = "rgba(200,200,200,0.5)";
      ctx.beginPath();
      ctx.arc(cx - 15, by - 80 - Math.sin(t) * 3, 7, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.arc(cx - 10, by - 92 - Math.sin(t + 0.5) * 3, 9, 0, Math.PI * 2); ctx.fill();
      // Windows
      ctx.fillStyle = "#f39c12";
      for (let wi = 0; wi < 3; wi++) {
        ctx.fillRect(cx - 26 + wi * 20, by - 42, 10, 10);
      }

    } else if (kind === "smog") {
      // Brownish smog cloud
      ctx.fillStyle = "rgba(150,110,70,0.78)";
      ctx.beginPath();
      ctx.ellipse(cx,      by - 52, 32, 22, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 20, by - 62, 24, 18, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx - 20, by - 58, 20, 16, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(100,60,20,0.4)";
      ctx.beginPath();
      ctx.ellipse(cx,      by - 50, 28, 16, 0, 0, Math.PI * 2); ctx.fill();
      // Warning symbol
      ctx.fillStyle = "#e74c3c"; ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("!", cx, by - 52);

    } else if (kind === "temple") {
      // Domed/spired building (works for mosque, temple, historic)
      ctx.fillStyle = "#d4a574";
      ctx.fillRect(cx - 30, by - 54, 60, 42);
      // Dome
      ctx.fillStyle = "#b7935a";
      ctx.beginPath(); ctx.arc(cx, by - 54, 28, Math.PI, 0); ctx.fill();
      // Spire
      ctx.fillStyle = "#c0a070";
      ctx.beginPath();
      ctx.moveTo(cx, by - 88); ctx.lineTo(cx - 8, by - 54); ctx.lineTo(cx + 8, by - 54);
      ctx.closePath(); ctx.fill();
      // Columns
      ctx.fillStyle = "#c8a87a";
      ctx.fillRect(cx - 28, by - 54, 8, 42);
      ctx.fillRect(cx + 20, by - 54, 8, 42);

    } else if (kind === "market") {
      // Market stall with awning
      ctx.fillStyle = "#e74c3c";
      // Awning
      ctx.beginPath();
      ctx.moveTo(cx - 36, by - 54); ctx.lineTo(cx + 36, by - 54);
      ctx.lineTo(cx + 28, by - 36); ctx.lineTo(cx - 28, by - 36);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#c0392b";
      for (let si2 = 0; si2 < 4; si2++) {
        ctx.fillRect(cx - 30 + si2 * 18, by - 54, 10, 18);
      }
      // Table
      ctx.fillStyle = "#795548";
      ctx.fillRect(cx - 30, by - 28, 60, 6);
      ctx.fillRect(cx - 28, by - 22, 4, 22);
      ctx.fillRect(cx + 24, by - 22, 4, 22);
      // Goods
      ctx.fillStyle = "#f39c12"; ctx.beginPath(); ctx.arc(cx - 12, by - 32, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#e74c3c"; ctx.beginPath(); ctx.arc(cx + 4,  by - 32, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#27ae60"; ctx.beginPath(); ctx.arc(cx + 16, by - 32, 4, 0, Math.PI * 2); ctx.fill();

    } else if (kind === "stats") {
      // Bar chart
      const barH = [52, 34, 62, 44];
      const cols  = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12"];
      for (let bi = 0; bi < 4; bi++) {
        ctx.fillStyle = cols[bi];
        ctx.fillRect(cx - 30 + bi * 16, by - 12 - barH[bi], 12, barH[bi]);
      }
      ctx.fillStyle = "#bdc3c7";
      ctx.fillRect(cx - 32, by - 12, 68, 3);

    } else if (kind === "heart") {
      // Heart shape using beziers
      ctx.fillStyle = "#e74c3c";
      ctx.beginPath();
      ctx.moveTo(cx, by - 20);
      ctx.bezierCurveTo(cx, by - 36, cx - 28, by - 56, cx - 28, by - 66);
      ctx.bezierCurveTo(cx - 28, by - 80, cx, by - 80, cx, by - 66);
      ctx.bezierCurveTo(cx, by - 80, cx + 28, by - 80, cx + 28, by - 66);
      ctx.bezierCurveTo(cx + 28, by - 56, cx, by - 36, cx, by - 20);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath(); ctx.arc(cx - 10, by - 68, 10, 0, Math.PI * 2); ctx.fill();

    } else if (kind === "tree") {
      // Tree
      ctx.fillStyle = "#27ae60";
      ctx.beginPath(); ctx.arc(cx, by - 60, 26, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx - 14, by - 52, 18, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 14, by - 52, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#1e8449";
      ctx.beginPath(); ctx.arc(cx, by - 68, 18, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#6d4c41";
      ctx.fillRect(cx - 5, by - 34, 10, 22);

    } else if (kind === "drop") {
      // Water drop
      ctx.fillStyle = "#2980b9";
      ctx.beginPath();
      ctx.moveTo(cx, by - 14);
      ctx.bezierCurveTo(cx + 24, by - 44, cx + 24, by - 60, cx, by - 78);
      ctx.bezierCurveTo(cx - 24, by - 60, cx - 24, by - 44, cx, by - 14);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.beginPath(); ctx.arc(cx - 7, by - 60, 7, 0, Math.PI * 2); ctx.fill();

    } else if (kind === "recycle") {
      // Recycle symbol (3 curved arrows)
      ctx.strokeStyle = "#27ae60"; ctx.lineWidth = 5;
      for (let ri = 0; ri < 3; ri++) {
        const a0 = (ri * Math.PI * 2 / 3) - Math.PI / 2;
        const a1 = a0 + Math.PI * 0.55;
        ctx.beginPath();
        ctx.arc(cx, by - 48, 26, a0, a1);
        ctx.stroke();
        // arrowhead
        const aEnd = a1;
        const ax2 = cx + Math.cos(aEnd) * 26;
        const ay2 = by - 48 + Math.sin(aEnd) * 26;
        const nx = -Math.sin(aEnd) * 8;
        const ny = Math.cos(aEnd) * 8;
        ctx.fillStyle = "#27ae60";
        ctx.beginPath();
        ctx.moveTo(ax2, ay2);
        ctx.lineTo(ax2 + Math.cos(aEnd) * 10 + nx, ay2 + Math.sin(aEnd) * 10 + ny);
        ctx.lineTo(ax2 + Math.cos(aEnd) * 10 - nx, ay2 + Math.sin(aEnd) * 10 - ny);
        ctx.closePath(); ctx.fill();
      }

    } else if (kind === "music") {
      // Musical note
      ctx.fillStyle = "#9b59b6";
      ctx.beginPath(); ctx.arc(cx - 6, by - 18, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(cx + 2, by - 78, 6, 64);
      ctx.beginPath(); ctx.arc(cx + 20, by - 26, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(cx + 28, by - 78, 6, 55);
      // beam
      ctx.fillRect(cx + 2, by - 78, 32, 6);

    } else if (kind === "theatre") {
      // Comedy/drama mask
      ctx.fillStyle = "#f39c12"; // comedy
      ctx.beginPath(); ctx.arc(cx - 14, by - 52, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#2980b9"; // drama
      ctx.beginPath(); ctx.arc(cx + 14, by - 48, 20, 0, Math.PI * 2); ctx.fill();
      // Eyes comedy
      ctx.fillStyle = "#2c3e50";
      ctx.beginPath(); ctx.arc(cx - 20, by - 56, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx - 8,  by - 56, 4, 0, Math.PI * 2); ctx.fill();
      // Smile comedy
      ctx.strokeStyle = "#2c3e50"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx - 14, by - 48, 8, 0, Math.PI); ctx.stroke();
      // Eyes drama
      ctx.fillStyle = "#ecf0f1";
      ctx.beginPath(); ctx.arc(cx + 8,  by - 52, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + 20, by - 52, 4, 0, Math.PI * 2); ctx.fill();
      // Frown drama
      ctx.strokeStyle = "#ecf0f1";
      ctx.beginPath(); ctx.arc(cx + 14, by - 36, 8, Math.PI, 0); ctx.stroke();

    } else if (kind === "palette") {
      // Artist palette
      ctx.fillStyle = "#ecf0f1";
      ctx.beginPath(); ctx.ellipse(cx, by - 46, 30, 24, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#bdc3c7"; ctx.beginPath(); ctx.arc(cx + 14, by - 30, 8, 0, Math.PI * 2); ctx.fill();
      // Colour blobs
      const blobs = [["#e74c3c", -16, -58], ["#3498db", 8, -62], ["#2ecc71", -22, -44], ["#f39c12", 14, -44]];
      for (let bi = 0; bi < blobs.length; bi++) {
        ctx.fillStyle = blobs[bi][0];
        ctx.beginPath(); ctx.arc(cx + blobs[bi][1], by + blobs[bi][2], 6, 0, Math.PI * 2); ctx.fill();
      }
      // Brush
      ctx.strokeStyle = "#7f8c8d"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx + 28, by - 78); ctx.lineTo(cx + 4, by - 24); ctx.stroke();
      ctx.fillStyle = "#2980b9";
      ctx.beginPath(); ctx.arc(cx + 4, by - 24, 5, 0, Math.PI * 2); ctx.fill();

    } else {
      // Generic plaque fallback
      ctx.fillStyle = "#34495e";
      ctx.fillRect(cx - 22, by - 66, 44, 54);
      ctx.fillStyle = acc;
      ctx.fillRect(cx - 18, by - 62, 36, 44);
      ctx.fillStyle = "#2c3e50";
      ctx.fillRect(cx - 14, by - 58, 28, 36);
      // Question mark
      ctx.fillStyle = "#ecf0f1"; ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("?", cx, by - 40);
    }

    ctx.shadowBlur = 0;

    // "Press E" prompt when near
    if (near) {
      ctx.fillStyle = "rgba(0,0,0,0.72)";
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(cx - 32, by - 106, 64, 20, 4)
        : ctx.rect(cx - 32, by - 106, 64, 20);
      ctx.fill();
      ctx.fillStyle = "#f1c40f";
      ctx.font = "bold 11px system-ui,sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("[ E ]  read", cx, by - 96);
    }

    // Valence dot
    const valence = tr.valence;
    if (valence) {
      ctx.fillStyle = valence === "good" ? "#2ecc71" : "#e74c3c";
      ctx.beginPath();
      ctx.arc(cx + 26, by - 68, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  GeographyDashGame.prototype._drawPlatform = function (ctx, pl, lvl, city) {
    if (window.GD_DECO && typeof window.GD_DECO.drawPlatform === "function") {
      window.GD_DECO.drawPlatform(ctx, pl, lvl, city);
      return;
    }
    const st = pl.style || "";
    if (pl.y > lvl.groundY - 10) {
      if (st === "hub_ground") {
        ctx.fillStyle = "#2c3e50";
        ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
        ctx.strokeStyle = "rgba(241,196,15,0.5)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pl.x + 40, pl.y + 12);
        ctx.lineTo(pl.x + pl.w - 40, pl.y + 12);
        ctx.stroke();
        ctx.fillStyle = "#566573";
        ctx.fillRect(pl.x, pl.y, pl.w, 10);
      } else {
        ctx.fillStyle = "#2d3436";
        ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
        ctx.fillStyle = "#636e72";
        ctx.fillRect(pl.x, pl.y, pl.w, 8);
      }
      return;
    }

    if (st === "hub_cobble" || st === "hub_granite") {
      ctx.fillStyle = st === "hub_granite" ? "#7f8c8d" : "#8d6e63";
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      for (let rx = pl.x; rx < pl.x + pl.w; rx += 24) {
        ctx.strokeRect(rx, pl.y, 22, pl.h);
      }
      ctx.strokeStyle = city.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
      return;
    }

    if (st === "hub_concrete") {
      ctx.fillStyle = "#95a5a6";
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.fillStyle = "rgba(231,76,60,0.35)";
      ctx.fillRect(pl.x, pl.y + pl.h - 6, pl.w, 6);
      ctx.strokeStyle = "#7f8c8d";
      ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
      return;
    }

    if (st === "hub_stone") {
      ctx.fillStyle = "#b7956b";
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(pl.x + 4, pl.y + 4, pl.w - 8, pl.h * 0.35);
      ctx.strokeStyle = "#6d4c41";
      ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
      return;
    }

    if (st === "hub_tile") {
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1;
      for (let ty = pl.y; ty < pl.y + pl.h; ty += 10) {
        for (let tx = pl.x; tx < pl.x + pl.w; tx += 20) {
          ctx.strokeRect(tx, ty, 18, 8);
        }
      }
      return;
    }

    if (st === "hub_marble") {
      ctx.fillStyle = "#ecf0f1";
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.strokeStyle = "rgba(149,165,166,0.5)";
      ctx.beginPath();
      ctx.moveTo(pl.x, pl.y + pl.h * 0.4);
      ctx.lineTo(pl.x + pl.w, pl.y + pl.h * 0.2);
      ctx.stroke();
      ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
      return;
    }

    if (st === "hub_dirt") {
      ctx.fillStyle = "#6d4c41";
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.fillStyle = "#8d6e63";
      for (let k = 0; k < 8; k++) {
        ctx.fillRect(pl.x + ((k * 67) % Math.floor(pl.w)), pl.y + ((k * 13) % Math.floor(pl.h)), 12, 4);
      }
      return;
    }

    ctx.fillStyle = "#34495e";
    ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
    ctx.strokeStyle = city.accent;
    ctx.lineWidth = 1;
    ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
  };

  GeographyDashGame.prototype.draw = function () {
    if (!this.level || !this.player) return;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    this.drawWorld(this.ctx, w, h);
  };

  window.GeographyDashGame = GeographyDashGame;
  window.GeographyDashGenerateLevel = generateLevel;
})();
