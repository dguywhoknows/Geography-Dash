/**
 * Per-city cinematic backdrops — deeply layered parallax skylines.
 * Every city has 5-7 distinct rendering layers. Every hazardTheme
 * triggers its own visual treatment: sky palette, landmark emphasis,
 * animated props, and atmospheric effects.
 *
 * Helper drawing library (street furniture, vehicles, people) is
 * defined at the top of this file and shared by all city painters.
 */
(function () {
  "use strict";

  const D = window.GD_DECO;
  const P = D.primitives;
  const B = D.buildings;
  const A = D.ambient;
  if (!D || !P || !B || !A) return;

  // ═══════════════════════════════════════════════════════════════════════════
  //  SHARED DRAWING HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Rounded rectangle path helper
  function rrp(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // ── Window grid on a building facade ──────────────────────────────────────
  function windowGrid(ctx, x, y, w, h, cols, rows, litChance, t, seed) {
    const cw = Math.floor((w - 4) / cols);
    const ch = Math.floor((h - 4) / rows);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const wx = x + 2 + c * cw;
        const wy = y + 2 + r * ch;
        const ww = Math.max(2, cw - 2);
        const wh = Math.max(2, ch - 2);
        const lit = ((seed * (r * cols + c + 1) * 2654435761) >>> 0) % 100 < litChance * 100;
        const flicker = lit ? 0.85 + 0.15 * Math.sin(t * 2.3 + seed + r * c * 0.4) : 0;
        ctx.fillStyle = lit
          ? `rgba(255,230,160,${flicker})`
          : "rgba(10,15,25,0.7)";
        ctx.fillRect(wx, wy, ww, wh);
        if (lit) {
          ctx.fillStyle = `rgba(255,255,200,${flicker * 0.25})`;
          ctx.fillRect(wx, wy, ww, 2);
        }
      }
    }
  }

  // ── Detailed building with windows, AC units, water tanks, antennas ───────
  function detailBuilding(ctx, x, yBase, w, h, wallCol, roofCol, seed, litChance, t) {
    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(x + 3, yBase - h + 3, w, h);

    // Wall
    const wg = ctx.createLinearGradient(x, yBase - h, x + w, yBase);
    wg.addColorStop(0, wallCol);
    wg.addColorStop(1, "rgba(0,0,0,0.14)");
    ctx.fillStyle = wg;
    ctx.fillRect(x, yBase - h, w, h);

    // Vertical trim lines
    ctx.fillStyle = "rgba(0,0,0,0.10)";
    ctx.fillRect(x, yBase - h, 3, h);
    ctx.fillRect(x + w - 3, yBase - h, 3, h);

    // Windows
    const cols = Math.max(1, Math.floor(w / 12));
    const rows = Math.max(1, Math.floor(h / 14));
    windowGrid(ctx, x + 3, yBase - h + 4, w - 6, h - 8, cols, rows, litChance, t, seed);

    // Roof parapet
    ctx.fillStyle = roofCol;
    ctx.fillRect(x - 2, yBase - h - 6, w + 4, 8);

    // Random rooftop features
    const feat = seed % 4;
    if (feat === 0 && w > 20) {
      // Water tank
      ctx.fillStyle = roofCol;
      ctx.fillRect(x + w * 0.6, yBase - h - 22, 10, 16);
      ctx.beginPath();
      ctx.ellipse(x + w * 0.6 + 5, yBase - h - 22, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (feat === 1) {
      // TV antenna
      ctx.strokeStyle = "rgba(160,160,180,0.7)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.4, yBase - h - 6);
      ctx.lineTo(x + w * 0.4, yBase - h - 20);
      ctx.moveTo(x + w * 0.4 - 6, yBase - h - 18);
      ctx.lineTo(x + w * 0.4 + 6, yBase - h - 18);
      ctx.stroke();
    } else if (feat === 2 && w > 24) {
      // AC units
      ctx.fillStyle = "#7f8c8d";
      ctx.fillRect(x + 4, yBase - h - 10, 8, 6);
      ctx.fillRect(x + 16, yBase - h - 10, 8, 6);
    }
  }

  // ── Street lamp post with warm glow ───────────────────────────────────────
  function lampPost(ctx, x, gy, glowCol, t) {
    ctx.fillStyle = "#4a5568";
    ctx.fillRect(x - 2, gy - 72, 4, 72);
    // Arm
    ctx.beginPath();
    ctx.moveTo(x + 2, gy - 68);
    ctx.quadraticCurveTo(x + 14, gy - 72, x + 14, gy - 60);
    ctx.strokeStyle = "#4a5568";
    ctx.lineWidth = 3;
    ctx.stroke();
    // Lamp housing
    ctx.fillStyle = "#e8c870";
    ctx.fillRect(x + 8, gy - 62, 12, 5);
    // Glow cone
    const flick = 0.18 + 0.04 * Math.sin(t * 3.1 + x);
    ctx.save();
    ctx.globalAlpha = flick;
    ctx.fillStyle = glowCol || "rgba(255,220,120,0.4)";
    ctx.beginPath();
    ctx.moveTo(x + 14, gy - 57);
    ctx.lineTo(x + 28, gy - 10);
    ctx.lineTo(x, gy - 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ── Street tree with trunk and canopy ─────────────────────────────────────
  function streetTree(ctx, x, gy, scale, variant, t) {
    scale = scale || 1;
    const h = 55 * scale;
    // Trunk
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(x - 3 * scale, gy - h, 6 * scale, h);
    // Canopy layers
    const swayX = Math.sin(t * 0.6 + x * 0.01) * 2 * scale;
    const greens = variant === 1 ? ["#1e8449","#27ae60","#2ecc71"]
      : variant === 2 ? ["#784212","#a04000","#ca6f1e"]  // autumn
      : ["#196f3d","#1e8449","#27ae60"];
    for (let l = 0; l < 3; l++) {
      ctx.fillStyle = greens[l];
      ctx.beginPath();
      ctx.ellipse(x + swayX, gy - h - 8 - l * 10 * scale, (22 - l * 3) * scale, (18 - l * 2) * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Bench ─────────────────────────────────────────────────────────────────
  function bench(ctx, x, gy) {
    ctx.fillStyle = "#7d6608";
    ctx.fillRect(x, gy - 14, 28, 4);      // seat
    ctx.fillRect(x, gy - 24, 28, 3);      // back
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(x + 2,  gy - 14, 3, 14); // left leg
    ctx.fillRect(x + 23, gy - 14, 3, 14); // right leg
  }

  // ── Fire hydrant ──────────────────────────────────────────────────────────
  function hydrant(ctx, x, gy) {
    ctx.fillStyle = "#c0392b";
    ctx.fillRect(x + 2, gy - 14, 8, 14);
    ctx.fillRect(x,     gy - 16, 12, 4);  // cap
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(x - 2, gy - 9, 4, 4);   // bolt L
    ctx.fillRect(x + 10, gy - 9, 4, 4);  // bolt R
  }

  // ── Pedestrian (tiny person silhouette) ───────────────────────────────────
  function pedestrian(ctx, x, gy, dir, t, phase, col) {
    col = col || "rgba(50,50,60,0.7)";
    const walk = Math.sin(t * 6 + phase) * 4;
    // Body
    ctx.fillStyle = col;
    ctx.fillRect(x - 3, gy - 22, 6, 12);
    // Head
    ctx.beginPath();
    ctx.arc(x, gy - 26, 4, 0, Math.PI * 2);
    ctx.fill();
    // Legs
    ctx.fillRect(x - 3, gy - 10, 3, 10 + walk * 0.5);
    ctx.fillRect(x,     gy - 10, 3, 10 - walk * 0.5);
    // Arms
    ctx.fillRect(x - 6, gy - 20, 3, 8 + walk * 0.3);
    ctx.fillRect(x + 3, gy - 20, 3, 8 - walk * 0.3);
  }

  // ── City bus ──────────────────────────────────────────────────────────────
  function cityBus(ctx, x, gy, dir, bodyCol, stripCol) {
    const w = 70, h = 28;
    const bx = dir > 0 ? x : x - w;
    // Body
    rrp(ctx, bx, gy - h, w, h, 4);
    ctx.fillStyle = bodyCol || "#e74c3c";
    ctx.fill();
    // White stripe
    ctx.fillStyle = stripCol || "rgba(255,255,255,0.85)";
    ctx.fillRect(bx + 4, gy - h * 0.55, w - 8, h * 0.2);
    // Windows
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = "rgba(120,180,220,0.55)";
      ctx.fillRect(bx + 8 + i * 14, gy - h + 4, 10, 9);
    }
    // Wheels
    ctx.fillStyle = "#1a252f";
    ctx.beginPath(); ctx.arc(bx + 14, gy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(bx + w - 14, gy, 7, 0, Math.PI * 2); ctx.fill();
  }

  // ── Small car ─────────────────────────────────────────────────────────────
  function smallCar(ctx, x, gy, dir, col) {
    const w = 44, h = 20;
    const cx2 = dir > 0 ? x : x - w;
    ctx.fillStyle = col || "#3498db";
    rrp(ctx, cx2, gy - h, w, h, 3);
    ctx.fill();
    // Windshield
    ctx.fillStyle = "rgba(100,200,240,0.55)";
    if (dir > 0) {
      ctx.fillRect(cx2 + 22, gy - h + 3, 14, 9);
    } else {
      ctx.fillRect(cx2 + 8,  gy - h + 3, 14, 9);
    }
    // Wheels
    ctx.fillStyle = "#1a252f";
    ctx.beginPath(); ctx.arc(cx2 + 10, gy, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(cx2 + 34, gy, 5, 0, Math.PI * 2); ctx.fill();
  }

  // ── Tuk-tuk (Bangkok/Asia) ────────────────────────────────────────────────
  function tukTuk(ctx, x, gy, dir, t) {
    const bx = x;
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(bx, gy - 22, 36, 18);     // body
    ctx.fillStyle = "rgba(100,200,240,0.5)";
    ctx.fillRect(bx + (dir>0?18:4), gy - 20, 12, 8);  // window
    ctx.fillStyle = "#c0392b";
    ctx.fillRect(bx - 2, gy - 24, 42, 4);  // roof
    ctx.fillStyle = "#1a252f";
    ctx.beginPath(); ctx.arc(bx + 8,  gy, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(bx + 28, gy, 5, 0, Math.PI*2); ctx.fill();
  }

  // ── Bicycle ───────────────────────────────────────────────────────────────
  function bicycle(ctx, x, gy, dir, t) {
    const phase = t * 4 + x * 0.01;
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2;
    // Wheels
    ctx.beginPath(); ctx.arc(x - 10, gy - 5, 8, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(x + 10, gy - 5, 8, 0, Math.PI*2); ctx.stroke();
    // Frame
    ctx.beginPath();
    ctx.moveTo(x - 10, gy - 5);
    ctx.lineTo(x,      gy - 16);
    ctx.lineTo(x + 10, gy - 5);
    ctx.moveTo(x, gy - 16);
    ctx.lineTo(x - 4,  gy - 5);
    ctx.stroke();
    // Handlebar
    ctx.beginPath();
    ctx.moveTo(x + dir * 2, gy - 16);
    ctx.lineTo(x + dir * 8, gy - 18);
    ctx.stroke();
    // Rider legs
    const legA = Math.sin(phase) * 8;
    ctx.strokeStyle = "#34495e";
    ctx.beginPath();
    ctx.moveTo(x, gy - 16);
    ctx.lineTo(x + legA, gy - 8);
    ctx.lineTo(x - 4, gy - 5);
    ctx.stroke();
  }

  // ── Ferry / boat on water ─────────────────────────────────────────────────
  function ferryBoat(ctx, x, wy, t) {
    const bob = Math.sin(t * 0.8 + x * 0.01) * 2;
    const y = wy + bob;
    ctx.fillStyle = "#ecf0f1";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 60, y);
    ctx.lineTo(x + 54, y + 12);
    ctx.lineTo(x + 6, y + 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(x + 14, y - 16, 30, 18);
    ctx.fillStyle = "#bdc3c7";
    ctx.fillRect(x + 26, y - 30, 6, 18);  // funnel/mast
  }

  // ── Fishing boat ──────────────────────────────────────────────────────────
  function fishingBoat(ctx, x, wy, t) {
    const bob = Math.sin(t * 0.9 + x * 0.02) * 2;
    const y = wy + bob;
    ctx.fillStyle = "#5d4037";
    ctx.beginPath();
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x + 4, y);
    ctx.lineTo(x + 36, y);
    ctx.lineTo(x + 40, y + 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#7f8c8d";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 20, y);
    ctx.lineTo(x + 20, y - 22);
    ctx.lineTo(x + 36, y - 8);
    ctx.stroke();
  }

  // ── Spotlight beam ────────────────────────────────────────────────────────
  function spotBeam(ctx, worldX, cam, w, gy, t, phase, col) {
    const sx = D.parallaxX(worldX, cam, 0.20);
    if (!D.visible(sx, 50, cam, w)) return;
    ctx.save();
    ctx.globalAlpha = 0.14 + Math.sin(t * 0.022 + phase) * 0.07;
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(sx, gy + 12);
    ctx.lineTo(sx - 40, gy - 175);
    ctx.lineTo(sx + 40, gy - 175);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ── Pulsing lantern dot ───────────────────────────────────────────────────
  function lanternDot(ctx, worldX, worldY, cam, w, t, phase, col) {
    const lx = D.parallaxX(worldX, cam, 0.19);
    if (!D.visible(lx, 20, cam, w)) return;
    const pulse = 0.55 + Math.sin(t * 0.055 + phase) * 0.4;
    ctx.save();
    ctx.globalAlpha = pulse * 0.85;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(lx, worldY, 7, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = pulse * 0.2;
    ctx.beginPath(); ctx.arc(lx, worldY, 18, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // ── Construction crane ────────────────────────────────────────────────────
  function crane(ctx, worldX, cam, w, gy, par, sc) {
    sc = sc || 1;
    const cx2 = D.parallaxX(worldX, cam, par);
    if (!D.visible(cx2, 70 * sc, cam, w)) return;
    const h = 145 * sc;
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(cx2 - 5 * sc, gy - h, 10 * sc, h);
    ctx.fillRect(cx2 - 18 * sc, gy - h, 100 * sc, 6 * sc);
    ctx.fillRect(cx2 - 18 * sc, gy - h, 4 * sc, 44 * sc);
    ctx.strokeStyle = "#7f8c8d";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx2 + 76 * sc, gy - h + 3 * sc);
    ctx.lineTo(cx2 + 76 * sc, gy - h + 55 * sc);
    ctx.stroke();
    ctx.fillStyle = "#95a5a6";
    ctx.fillRect(cx2 + 73 * sc, gy - h + 53 * sc, 6 * sc, 6 * sc);
    // Blinking light on top
    ctx.save();
    ctx.globalAlpha = 0.6 + 0.4 * Math.sin(Date.now() * 0.003 + worldX);
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(cx2, gy - h - 5 * sc, 4 * sc, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // ── Shared ground line ────────────────────────────────────────────────────
  function groundLine(ctx, cam, w, gy, accent) {
    const gx0 = D.parallaxX(-80, cam, 0.32);
    ctx.fillStyle = "rgba(44,62,80,0.38)";
    ctx.fillRect(gx0, gy - 2, w + 500, 6);
    ctx.strokeStyle = accent || "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(gx0, gy); ctx.lineTo(gx0 + w + 400, gy);
    ctx.stroke();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  SKY BASE CONFIGS
  // ═══════════════════════════════════════════════════════════════════════════
  const SKY = {
    copenhagen: {
      palette: ["#5dade2","#85c1e9","#d6eaf8"],
      clouds: [{ par:0.03, y:48, density:7, alpha:0.55 },{ par:0.06, y:72, density:5, alpha:0.35 }],
      birds: [{ x:0.25, y:0.22, n:5 }],
    },
    toronto: {
      palette: ["#34495e","#5d6d7e","#f5e6d3"],
      clouds: [{ par:0.04, y:60, density:8, alpha:0.45 }],
    },
    istanbul: {
      palette: ["#b9770e","#e8d4b8","#f9f3e8"],
      clouds: [{ par:0.05, y:55, density:6, alpha:0.4 }],
    },
    bangkok: {
      palette: ["#4a235a","#af7ac5","#f5b041","#fdebd0"],
      clouds: [{ par:0.04, y:50, density:5, alpha:0.35 }],
    },
    newdelhi: {
      palette: ["#6e2c00","#d35400","#fadbd8"],
      smog: { alpha:0.22, tint:[100,70,50] },
    },
    lagos: {
      palette: ["#1a252f","#2874a6","#1e8449"],
      stars:true, starSeed:909,
      moon:{ x:0.82, y:0.12, r:22 },
      clouds:[{ par:0.05, y:65, density:4, alpha:0.25 }],
    },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  COPENHAGEN
  // ═══════════════════════════════════════════════════════════════════════════
  function paintCopenhagen(ctx, city, cam, w, h, gy, t, stage) {
    const theme = stage ? stage.hazardTheme : null;
    const acc = city.accent || "#6ec8ff";

    // ── SKY — full per-theme palette ─────────────────────────────────────────
    const sky =
      (theme==="arts"||theme==="stage_hazard") ? ["#06001a","#1a0040","#4a007a","#a03000"] :
      (theme==="housing"||theme==="quake_crack") ? ["#1a2230","#304050","#607080"] :
      (theme==="flood_zone")  ? ["#030c1a","#081828","#103550","#2a6080"] :
      (theme==="smog_cloud")  ? ["#252520","#404038","#7a7a68","#b8b8a0"] :
      (theme==="car_swarm"||theme==="commute_pulse") ? ["#101820","#203040","#506070"] :
      (theme==="patrol_soft"||theme==="patrol_hard") ? ["#080f1e","#14203a","#305060"] :
      (theme==="env"||theme==="wind_turbine") ? ["#082040","#1050a0","#4090c8","#90d0f0"] :
      (theme==="health"||theme==="pulse_zone") ? ["#0e1e30","#1e3a52","#4080a8","#88c0e0"] :
      (theme==="income"||theme==="tax_slider") ? ["#181828","#2a2a48","#505090","#9898c0"] :
      (theme==="learning"||theme==="book_stack") ? ["#204060","#3868a8","#80b8e0","#c0e0f8"] :
      (theme==="civic"||theme==="ballot_wave") ? ["#203050","#3858a0","#78a8d8","#b8d8f0"] :
      (theme==="work"||theme==="sector"||theme==="institution_gate") ? ["#182030","#2a3850","#607890"] :
      ["#4a9fd8","#72b8e8","#a0d0f2","#d0ecff"];
    A.paintSky(ctx, w, h, gy, sky, t);

    // ── AURORA BOREALIS (env / wind_turbine) ─────────────────────────────────
    if (theme==="env"||theme==="wind_turbine") {
      ctx.save();
      const auroraColors = [[0,255,136],[0,136,255],[136,255,0],[200,100,255]];
      for (let ai = 0; ai < 4; ai++) {
        const [ar,ag2,ab] = auroraColors[ai];
        const aAlpha = (0.07 + 0.05 * Math.sin(t * 0.0011 + ai * 1.4));
        const ax = w * (0.08 + ai * 0.24) + Math.sin(t * 0.0009 + ai * 0.7) * 50;
        const aW = 90 + Math.sin(t * 0.0007 + ai) * 20;
        const grad = ctx.createLinearGradient(ax, 0, ax + aW, gy * 0.7);
        grad.addColorStop(0, `rgba(${ar},${ag2},${ab},0)`);
        grad.addColorStop(0.35, `rgba(${ar},${ag2},${ab},${aAlpha})`);
        grad.addColorStop(0.7, `rgba(${ar},${ag2},${ab},${aAlpha * 0.5})`);
        grad.addColorStop(1, `rgba(${ar},${ag2},${ab},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(ax - 20, 0);
        for (let sy2 = 0; sy2 <= gy * 0.7; sy2 += 10) {
          const wave = Math.sin(t * 0.001 + sy2 * 0.025 + ai * 0.9) * 22;
          ctx.lineTo(ax + wave, sy2);
        }
        ctx.lineTo(ax + aW + 20, gy * 0.7);
        ctx.lineTo(ax - 20, gy * 0.7);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // ── STARS (dark-sky themes) ───────────────────────────────────────────────
    if (theme==="arts"||theme==="stage_hazard"||theme==="patrol_soft"||theme==="patrol_hard"||
        theme==="income"||theme==="tax_slider"||theme==="car_swarm"||theme==="commute_pulse") {
      P.starField(ctx, w, h, 42, t);
    }

    // ── SUN (clear-sky themes) ────────────────────────────────────────────────
    if (!theme||theme==="env"||theme==="wind_turbine"||theme==="bike_lane"||
        theme==="mobility"||theme==="health"||theme==="learning"||theme==="civic"||
        theme==="ballot_wave"||theme==="book_stack") {
      ctx.save();
      const sunX = D.parallaxX(w * 0.76, cam, 0.02);
      const sunY  = h * 0.12;
      const sGrd  = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, 65);
      sGrd.addColorStop(0, "rgba(255,252,220,0.95)");
      sGrd.addColorStop(0.15,"rgba(255,240,180,0.55)");
      sGrd.addColorStop(0.5, "rgba(255,220,120,0.20)");
      sGrd.addColorStop(1,   "rgba(255,200,80,0)");
      ctx.fillStyle = sGrd;
      ctx.beginPath(); ctx.arc(sunX, sunY, 65, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(255,250,210,0.98)";
      ctx.beginPath(); ctx.arc(sunX, sunY, 16, 0, Math.PI * 2); ctx.fill();
      // God-ray streaks
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = "#fff8d0";
      ctx.lineWidth = 18;
      for (let sr = 0; sr < 8; sr++) {
        const ang3 = sr * Math.PI / 4 + t * 0.0003;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(ang3) * 18, sunY + Math.sin(ang3) * 18);
        ctx.lineTo(sunX + Math.cos(ang3) * 90, sunY + Math.sin(ang3) * 90);
        ctx.stroke();
      }
      ctx.restore();
    }

    // ── CLOUDS ────────────────────────────────────────────────────────────────
    if (theme==="flood_zone") {
      A.paintClouds(ctx,cam,w,gy,t,[{par:0.02,y:32,density:14,alpha:0.92},{par:0.04,y:52,density:10,alpha:0.78}]);
    } else if (theme==="smog_cloud") {
      A.paintClouds(ctx,cam,w,gy,t,[{par:0.03,y:38,density:9,alpha:0.68},{par:0.05,y:58,density:6,alpha:0.52}]);
    } else if (theme==="housing"||theme==="quake_crack") {
      A.paintClouds(ctx,cam,w,gy,t,[{par:0.03,y:48,density:7,alpha:0.55}]);
    } else if (!theme||theme==="env"||theme==="wind_turbine") {
      A.paintClouds(ctx,cam,w,gy,t,SKY.copenhagen.clouds);
    } else {
      A.paintClouds(ctx,cam,w,gy,t,[{par:0.04,y:52,density:5,alpha:0.40}]);
    }

    // ── SEAGULLS (clean themes) ───────────────────────────────────────────────
    if (!theme||theme==="env"||theme==="wind_turbine"||theme==="health"||theme==="bike_lane") {
      A.paintBirds(ctx,cam,w,gy,t,[{x:0.15,y:0.17,n:9},{x:0.58,y:0.23,n:6}]);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  LAYER 1 — FAR DISTANCE: Swedish coast silhouette + open sea
    // ══════════════════════════════════════════════════════════════════════════
    const seaCol = (theme==="flood_zone")?"rgba(4,12,38,0.65)":(theme==="smog_cloud")?"rgba(55,55,45,0.35)":"rgba(120,168,205,0.28)";
    P.hillSilhouette(ctx, D.parallaxX(-600,cam,0.018), D.parallaxX(w+1400,cam,0.018), gy+62, 22, seaCol, 3);

    // Sea / Øresund water strip (very far)
    const seaY = gy + 58;
    const seaG = ctx.createLinearGradient(0, seaY - 10, 0, seaY + 30);
    seaG.addColorStop(0, (theme==="flood_zone")?"rgba(4,14,45,0.55)":(theme==="smog_cloud")?"rgba(40,42,35,0.45)":"rgba(80,140,190,0.35)");
    seaG.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = seaG;
    ctx.fillRect(D.parallaxX(-400,cam,0.018), seaY - 10, w + 1200, 40);

    // ══════════════════════════════════════════════════════════════════════════
    //  LAYER 2 — FAR BUILDINGS: distant Copenhagen outer-city rooflines
    // ══════════════════════════════════════════════════════════════════════════
    const farPar = 0.052;
    const farBldgs = [
      {dx:-80, w:58, h:55, col:"#7a8898"},  {dx:  -18,w:42,h:48,col:"#6e7e8e"},
      {dx:  28,w:68,h:62, col:"#889aaa"},   {dx:  100,w:46,h:50,col:"#74808e"},
      {dx: 150,w:60,h:70, col:"#6a7888"},   {dx: 214,w:38,h:44,col:"#7e8e9e"},
      {dx: 256,w:72,h:58, col:"#8898a8"},   {dx: 332,w:50,h:65, col:"#72828e"},
      {dx: 386,w:56,h:52, col:"#6c7c8a"},   {dx: 446,w:44,h:68, col:"#80909e"},
      {dx: 494,w:66,h:60, col:"#769090"},   {dx: 564,w:48,h:56, col:"#6e7e8c"},
      {dx: 616,w:54,h:62, col:"#82929f"},   {dx: 674,w:40,h:46, col:"#78889a"},
      {dx: 718,w:62,h:70, col:"#6c7c88"},   {dx: 784,w:52,h:54, col:"#7e8e9c"},
      {dx: 840,w:46,h:48, col:"#6e7e8a"},   {dx: 890,w:64,h:64, col:"#7c8c9a"},
    ];
    farBldgs.forEach(function(b, i) {
      const bx = D.parallaxX(b.dx, cam, farPar);
      if (bx > w + 12 || bx + b.w < -12) return;
      ctx.fillStyle = b.col;
      ctx.fillRect(bx, gy - b.h + 28, b.w, b.h);
      // Pitched roof
      ctx.fillStyle = "rgba(0,0,0,0.20)";
      ctx.beginPath(); ctx.moveTo(bx-2,gy-b.h+28); ctx.lineTo(bx+b.w/2,gy-b.h+28-12); ctx.lineTo(bx+b.w+2,gy-b.h+28); ctx.closePath(); ctx.fill();
      // Windows (tiny)
      const lChF = (theme==="arts"||theme==="stage_hazard") ? 0.65 : 0.22;
      for (let wr3=0;wr3<Math.min(3,Math.floor(b.h/16));wr3++) {
        for (let wc3=0;wc3<Math.min(3,Math.floor(b.w/14));wc3++) {
          const litF = ((i*11+wr3*5+wc3*7+23)%100) < lChF*100;
          ctx.fillStyle = litF?"rgba(255,225,140,0.28)":"rgba(8,15,28,0.35)";
          ctx.fillRect(bx+4+wc3*14, gy-b.h+32+wr3*14, 8, 9);
        }
      }
    });

    // ══════════════════════════════════════════════════════════════════════════
    //  LAYER 3 — MID-FAR: mixed Copenhagen facades with windows + roofs
    // ══════════════════════════════════════════════════════════════════════════
    const mfPar = 0.095;
    const mfBldgs = [
      {dx:-50, w:62,h:98, col:"#8e9db0", roof:"#6a7a88"},
      {dx:  16,w:50,h:115,col:"#a48878", roof:"#7a6058"},
      {dx:  70,w:80,h:90, col:"#9aabad", roof:"#70828a"},
      {dx: 154,w:58,h:122,col:"#b89878", roof:"#8a7050"},
      {dx: 216,w:46,h:96, col:"#90909e", roof:"#686878"},
      {dx: 266,w:88,h:108,col:"#887ea0", roof:"#605870"},
      {dx: 358,w:54,h:92, col:"#a0997a", roof:"#787058"},
      {dx: 416,w:70,h:118,col:"#7898a8", roof:"#586878"},
      {dx: 490,w:52,h:94, col:"#a89080", roof:"#806860"},
      {dx: 546,w:82,h:110,col:"#889a90", roof:"#607068"},
      {dx: 632,w:62,h:100,col:"#9888a2", roof:"#706078"},
      {dx: 698,w:70,h:116,col:"#8090a8", roof:"#5a6880"},
      {dx: 772,w:56,h:92, col:"#a0a880", roof:"#787858"},
      {dx: 832,w:78,h:124,col:"#9878a0", roof:"#705878"},
      {dx: 914,w:60,h:98, col:"#8898a0", roof:"#607080"},
    ];
    mfBldgs.forEach(function(b, i) {
      const bx = D.parallaxX(b.dx, cam, mfPar);
      if (bx > w + 24 || bx + b.w < -24) return;
      ctx.fillStyle = "rgba(0,0,0,0.14)";
      ctx.fillRect(bx+4, gy-b.h+22, b.w, b.h);
      const wg2 = ctx.createLinearGradient(bx, gy-b.h+22, bx+b.w, gy+22);
      wg2.addColorStop(0, b.col); wg2.addColorStop(1, "rgba(0,0,0,0.18)");
      ctx.fillStyle = wg2; ctx.fillRect(bx, gy-b.h+22, b.w, b.h);
      // Nordic peaked roof
      ctx.fillStyle = b.roof;
      ctx.beginPath(); ctx.moveTo(bx-3,gy-b.h+22); ctx.lineTo(bx+b.w/2,gy-b.h+22-20); ctx.lineTo(bx+b.w+3,gy-b.h+22); ctx.closePath(); ctx.fill();
      // Trim
      ctx.fillStyle = "rgba(0,0,0,0.09)";
      ctx.fillRect(bx, gy-b.h+22, 3, b.h); ctx.fillRect(bx+b.w-3, gy-b.h+22, 3, b.h);
      const lCh2 = (theme==="arts"||theme==="stage_hazard") ? 0.78 : 0.32;
      windowGrid(ctx, bx+5, gy-b.h+28, b.w-10, b.h-10, Math.max(2,Math.floor(b.w/14)), Math.max(2,Math.floor(b.h/16)), lCh2, t, i*197+41);
    });

    // ══════════════════════════════════════════════════════════════════════════
    //  LAYER 4 — MID: Vor Frelsers Kirke spiral spire + Christiansborg Palace
    // ══════════════════════════════════════════════════════════════════════════
    const midPar = 0.16;

    // Vor Frelsers Kirke — corkscrew spire church
    const spireX = D.parallaxX(490, cam, midPar);
    if (spireX > -80 && spireX < w + 80) {
      // Church nave
      ctx.fillStyle = "#c8b89a";
      ctx.fillRect(spireX-32, gy-118, 64, 118);
      // Arched nave windows
      for (let nw = 0; nw < 4; nw++) {
        const nwx = spireX - 24 + nw * 14;
        ctx.fillStyle = (theme==="arts"||theme==="stage_hazard") ? "rgba(255,180,80,0.70)" : "rgba(60,100,160,0.55)";
        ctx.fillRect(nwx, gy - 100, 10, 22);
        ctx.beginPath(); ctx.arc(nwx + 5, gy - 100, 5, Math.PI, 0); ctx.fill();
      }
      // Tower base
      ctx.fillStyle = "#baa888";
      ctx.fillRect(spireX - 14, gy - 175, 28, 57);
      // Octagonal spire (corkscrew effect)
      ctx.save(); ctx.translate(spireX, gy - 175);
      for (let sp = 0; sp < 14; sp++) {
        const spW = Math.max(2, 11 - sp * 0.65);
        const spH = 16;
        const spOff = Math.sin(sp * 0.45) * 2;
        ctx.fillStyle = sp % 2 === 0 ? "#c8b89a" : "#a89870";
        ctx.fillRect(-spW/2 + spOff, -sp * spH, spW, spH);
      }
      // Copper tip
      ctx.fillStyle = "#5a8a6a";
      ctx.beginPath(); ctx.moveTo(-5,-224); ctx.lineTo(0,-248); ctx.lineTo(5,-224); ctx.closePath(); ctx.fill();
      // Golden ball
      ctx.fillStyle = "#d4af37";
      ctx.beginPath(); ctx.arc(0, -224, 4, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // Christiansborg Palace
    const palX = D.parallaxX(840, cam, midPar - 0.02);
    if (palX > -110 && palX < w + 110) {
      ctx.fillStyle = "#c0b090";
      ctx.fillRect(palX-60, gy-132, 120, 132);
      // Colonnade pillars
      ctx.fillStyle = "#b0a080";
      for (let ci = 0; ci < 9; ci++) ctx.fillRect(palX - 48 + ci * 12, gy - 128, 7, 128);
      // Central tower
      ctx.fillStyle = "#c8b898"; ctx.fillRect(palX-16, gy-175, 32, 43);
      // Copper dome
      ctx.fillStyle = "#5a8a6a";
      ctx.beginPath(); ctx.arc(palX, gy-175, 18, Math.PI, 0); ctx.fill();
      ctx.fillRect(palX-18, gy-175, 36, 10);
      // Spire
      ctx.fillStyle = "#4a7a5a";
      ctx.beginPath(); ctx.moveTo(palX-3,gy-185); ctx.lineTo(palX,gy-215); ctx.lineTo(palX+3,gy-185); ctx.closePath(); ctx.fill();
      // Window grid on palace
      windowGrid(ctx, palX-52, gy-125, 104, 100, 7, 6, (theme==="arts"||theme==="stage_hazard")?0.85:0.40, t, 7711);
      // Danish flag
      ctx.fillStyle="#555"; ctx.fillRect(palX+62, gy-210, 2, 45);
      ctx.fillStyle="#c8102e"; ctx.fillRect(palX+64, gy-210, 20, 14);
      ctx.fillStyle="#fff"; ctx.fillRect(palX+64+7, gy-210, 3, 14); ctx.fillRect(palX+64, gy-204, 20, 3);
    }

    // Mid-row supporting buildings
    const midBldgs = [
      {dx:-50,  w:68, h:138, col:"#9a8878", roof:"#6a5848"},
      {dx: 24,  w:52, h:118, col:"#8898a8", roof:"#587088"},
      {dx: 80,  w:82, h:148, col:"#a09280", roof:"#787260"},
      {dx:166,  w:58, h:128, col:"#88a098", roof:"#607068"},
      {dx:228,  w:72, h:140, col:"#9888a2", roof:"#706080"},
      {dx:304,  w:54, h:120, col:"#a09878", roof:"#787058"},
      {dx:362,  w:82, h:152, col:"#88929c", roof:"#607082"},
      {dx:598,  w:62, h:142, col:"#98a888", roof:"#708060"},
      {dx:664,  w:76, h:130, col:"#a08898", roof:"#786070"},
      {dx:744,  w:58, h:148, col:"#8898a0", roof:"#607080"},
      {dx:960,  w:74, h:150, col:"#a09888", roof:"#787060"},
      {dx:1038, w:60, h:128, col:"#889898", roof:"#607080"},
    ];
    midBldgs.forEach(function(b, i) {
      const bx = D.parallaxX(b.dx, cam, midPar);
      if (bx > w+32 || bx+b.w < -32) return;
      ctx.fillStyle="rgba(0,0,0,0.12)"; ctx.fillRect(bx+5, gy-b.h, b.w, b.h);
      const wg3 = ctx.createLinearGradient(bx,gy-b.h,bx+b.w,gy);
      wg3.addColorStop(0,b.col); wg3.addColorStop(1,"rgba(0,0,0,0.20)");
      ctx.fillStyle=wg3; ctx.fillRect(bx,gy-b.h,b.w,b.h);
      ctx.fillStyle=b.roof;
      ctx.beginPath(); ctx.moveTo(bx-2,gy-b.h); ctx.lineTo(bx+b.w/2,gy-b.h-24); ctx.lineTo(bx+b.w+2,gy-b.h); ctx.closePath(); ctx.fill();
      ctx.fillStyle="rgba(0,0,0,0.08)"; ctx.fillRect(bx,gy-b.h,3,b.h); ctx.fillRect(bx+b.w-3,gy-b.h,3,b.h);
      windowGrid(ctx,bx+5,gy-b.h+8,b.w-10,b.h-14,Math.max(2,Math.floor(b.w/16)),Math.max(3,Math.floor(b.h/18)),
        (theme==="arts"||theme==="stage_hazard")?0.82:0.38,t,i*211+77);
    });

    // ══════════════════════════════════════════════════════════════════════════
    //  LAYER 5 — CANAL WATER with reflections
    // ══════════════════════════════════════════════════════════════════════════
    const canalPar = 0.22;
    const canalY   = gy + 28;
    const cTopC = (theme==="flood_zone")?"rgba(6,18,55,0.85)":(theme==="smog_cloud")?"rgba(52,55,42,0.72)":"rgba(45,118,182,0.68)";
    const cBotC = (theme==="flood_zone")?"rgba(2,6,22,0.96)":(theme==="smog_cloud")?"rgba(28,30,22,0.90)":"rgba(18,55,98,0.92)";
    P.canalWater(ctx, D.parallaxX(-250,cam,canalPar), D.parallaxX(w+700,cam,canalPar), canalY, t, {top:cTopC, bot:cBotC});

    // Ripple highlights on water
    ctx.save(); ctx.globalAlpha=0.22;
    for (let ri=0; ri<10; ri++) {
      const rx = D.parallaxX(60+ri*175, cam, canalPar+0.01);
      ctx.strokeStyle="rgba(140,195,240,0.55)"; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.ellipse(rx, canalY+10+Math.sin(t*1.3+ri*0.7)*3, 26+ri*3, 5, 0, 0, Math.PI*2); ctx.stroke();
    }
    ctx.restore();

    // ══════════════════════════════════════════════════════════════════════════
    //  LAYER 6 — NYHAVN CANAL HOUSES (6 individual hand-drawn buildings)
    // ══════════════════════════════════════════════════════════════════════════
    const nhPar = 0.268;
    const nhData = [
      {dx: 82, w:48,h:82,  col:"#c0392b",shut:"#8b2500",floors:4,hasTank:true},
      {dx:134, w:42,h:74,  col:"#f39c12",shut:"#b07700",floors:3,hasTank:false},
      {dx:180, w:52,h:90,  col:"#2980b9",shut:"#1a5e82",floors:4,hasTank:true},
      {dx:236, w:46,h:78,  col:"#8e44ad",shut:"#5e2d7a",floors:3,hasTank:false},
      {dx:286, w:50,h:94,  col:"#27ae60",shut:"#1a7a40",floors:4,hasTank:true},
      {dx:340, w:44,h:80,  col:"#e74c3c",shut:"#a03030",floors:3,hasTank:false},
    ];
    const nhLit = (theme==="arts"||theme==="stage_hazard") ? 0.88 : 0.48;
    nhData.forEach(function(b, i) {
      const nx = D.parallaxX(b.dx, cam, nhPar);
      if (nx > w+24 || nx+b.w < -24) return;
      const ny = gy + 10;
      // Shadow
      ctx.fillStyle="rgba(0,0,0,0.22)"; ctx.fillRect(nx+5, ny-b.h+5, b.w, b.h);
      // Wall gradient
      const nwg = ctx.createLinearGradient(nx, ny-b.h, nx+b.w, ny);
      nwg.addColorStop(0, b.col); nwg.addColorStop(0.65, b.col); nwg.addColorStop(1,"rgba(0,0,0,0.28)");
      ctx.fillStyle = nwg; ctx.fillRect(nx, ny-b.h, b.w, b.h);
      // Brick-course lines
      ctx.strokeStyle="rgba(0,0,0,0.07)"; ctx.lineWidth=0.5;
      for (let br=4; br<b.h; br+=7) {
        ctx.beginPath(); ctx.moveTo(nx,ny-b.h+br); ctx.lineTo(nx+b.w,ny-b.h+br); ctx.stroke();
      }
      // Floor dividers
      const flH = Math.floor(b.h/b.floors);
      ctx.fillStyle="rgba(255,255,255,0.10)";
      for (let fl=1; fl<b.floors; fl++) ctx.fillRect(nx, ny-fl*flH, b.w, 2);
      // Windows — 2 per floor with shutters
      for (let fl=0; fl<b.floors; fl++) {
        const wy2 = ny - (fl+1)*flH + 6;
        for (let wc=0; wc<2; wc++) {
          const wx3 = nx + 5 + wc*(b.w-22);
          const lit2 = ((i*13+fl*7+wc*3+19)%100) < nhLit*100;
          ctx.fillStyle=b.shut; ctx.fillRect(wx3-5,wy2,5,14);
          ctx.fillStyle=lit2?"rgba(255,225,148,0.88)":"rgba(18,28,48,0.78)";
          ctx.fillRect(wx3,wy2,12,14);
          if (lit2){ctx.fillStyle="rgba(255,255,190,0.42)"; ctx.fillRect(wx3+1,wy2+1,4,5);}
          ctx.fillStyle=b.shut; ctx.fillRect(wx3+12,wy2,5,14);
          ctx.fillStyle="rgba(255,255,255,0.28)"; ctx.fillRect(wx3-2,wy2+14,20,2);
        }
      }
      // Door
      ctx.fillStyle="rgba(0,0,0,0.72)"; ctx.fillRect(nx+b.w/2-5,ny-24,10,24);
      ctx.fillStyle=b.shut; ctx.fillRect(nx+b.w/2-6,ny-25,12,2);
      // Gabled roof + chimney
      ctx.fillStyle=b.shut;
      ctx.beginPath(); ctx.moveTo(nx-3,ny-b.h); ctx.lineTo(nx+b.w/2,ny-b.h-22); ctx.lineTo(nx+b.w+3,ny-b.h); ctx.closePath(); ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,0.15)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(nx,ny-b.h); ctx.lineTo(nx+b.w/2,ny-b.h-22); ctx.stroke();
      ctx.fillStyle="#5a4a3a"; ctx.fillRect(nx+b.w*0.68-3,ny-b.h-30,7,14);
      ctx.fillStyle="#8a7a6a"; ctx.fillRect(nx+b.w*0.68-5,ny-b.h-32,11,4);
      // Water tank on roof (alternate buildings)
      if (b.hasTank){
        ctx.fillStyle="#556677"; ctx.fillRect(nx+6,ny-b.h-18,10,12);
        ctx.beginPath(); ctx.ellipse(nx+11,ny-b.h-18,7,3,0,0,Math.PI*2); ctx.fill();
      }
      // Smoke from chimney
      if (!theme||theme==="housing"||theme==="smog_cloud"||theme==="work") {
        ctx.save();
        for (let sm=0; sm<4; sm++) {
          const smy = ny-b.h-32-sm*13+Math.sin(t*0.5+sm*0.9)*4;
          const smx = nx+b.w*0.68+Math.sin(t*0.3+sm*0.7+i)*6;
          ctx.globalAlpha=(0.16-sm*0.04);
          ctx.fillStyle="#b0b0a0";
          ctx.beginPath(); ctx.arc(smx,smy,5+sm*3,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
      }
      // Flower boxes (clean themes)
      if (!theme||theme==="env"||theme==="wind_turbine"||theme==="bike_lane"||theme==="mobility"||theme==="health"||theme==="learning") {
        ctx.fillStyle="#3a5a2a"; ctx.fillRect(nx+2, ny-b.h+flH+4, b.w-4, 5);
        const fwc=["#e74c3c","#f39c12","#e91e63","#ff6b6b","#c0392b","#ff9800"];
        for (let fw=0;fw<5;fw++) {
          ctx.fillStyle=fwc[(i*3+fw)%fwc.length];
          ctx.beginPath(); ctx.arc(nx+5+fw*(b.w-10)/4, ny-b.h+flH+2, 3, 0, Math.PI*2); ctx.fill();
        }
      }
      // Canal house reflection in water
      ctx.save();
      ctx.globalAlpha = 0.16 + 0.06*Math.sin(t*1.6+i);
      ctx.scale(1, -0.35);
      const refY = -(canalY + 8) * (1/0.35);
      const refG = ctx.createLinearGradient(0, refY, 0, refY + b.h*0.35);
      refG.addColorStop(0, b.col); refG.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = refG;
      ctx.fillRect(nx, refY, b.w, b.h * 0.35);
      ctx.restore();
      // Danish flag on alternates
      if (i===2||i===4) {
        const fpx=nx+b.w-3, fpy=ny-b.h-28;
        ctx.fillStyle="#5a5a5a"; ctx.fillRect(fpx,fpy,1.5,22);
        ctx.fillStyle="#c8102e"; ctx.fillRect(fpx+1.5,fpy+4,16,11);
        ctx.fillStyle="#fff"; ctx.fillRect(fpx+1.5+6,fpy+4,2,11); ctx.fillRect(fpx+1.5,fpy+4+4,16,2);
      }
    });

    // ══════════════════════════════════════════════════════════════════════════
    //  LAYER 7 — WIND TURBINES (scale with env theme)
    // ══════════════════════════════════════════════════════════════════════════
    const turbN = (theme==="wind_turbine"||theme==="env") ? 6 : (theme==="smog_cloud"||theme==="housing") ? 0 : 2;
    const turbDefs = [
      {dx:310, par:0.08, sc:0.64},{dx:680, par:0.10, sc:0.56},
      {dx:1150,par:0.07, sc:0.70},{dx:480, par:0.12, sc:0.50},
      {dx:950, par:0.09, sc:0.60},{dx:1380,par:0.06, sc:0.72},
    ];
    for (let ti=0; ti<turbN; ti++) {
      const td = turbDefs[ti];
      const tx = D.parallaxX(td.dx, cam, td.par);
      if (tx > -90 && tx < w + 90) B.landmarkWindTurbine(ctx, tx, gy+4, td.sc, t + ti*0.38);
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  LAYER 8 — COBBLESTONE ROAD + BIKE LANE
    // ══════════════════════════════════════════════════════════════════════════
    const rPar = 0.30;
    const rX0  = D.parallaxX(-250, cam, rPar);
    // Asphalt / cobblestone base
    ctx.fillStyle = (theme==="flood_zone")?"rgba(12,24,56,0.60)":"rgba(72,68,62,0.50)";
    ctx.fillRect(rX0, gy-8, w+900, 16);
    // Cobblestone texture
    if (theme!=="flood_zone") {
      ctx.fillStyle="rgba(0,0,0,0.09)";
      for (let co=0; co<45; co++) {
        const cobX=D.parallaxX(-100+co*52,cam,rPar);
        ctx.fillRect(cobX,gy-7,46,7); ctx.fillRect(cobX+26,gy,46,7);
      }
    }
    // Dashed centre line
    ctx.setLineDash([16,12]); ctx.strokeStyle="rgba(255,255,255,0.20)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(rX0,gy-1); ctx.lineTo(rX0+w+900,gy-1); ctx.stroke();
    ctx.setLineDash([]);
    // Bike lane stripe (brighter when bike_lane/mobility theme)
    ctx.fillStyle=(theme==="bike_lane"||theme==="mobility")?"rgba(46,204,113,0.40)":"rgba(46,204,113,0.09)";
    ctx.fillRect(rX0, gy-28, w+900, 22);
    // Bike lane symbol every 400px
    if (theme==="bike_lane"||theme==="mobility") {
      for (let bl=0; bl<8; bl++) {
        const blX=D.parallaxX(60+bl*400,cam,rPar);
        if (blX<-20||blX>w+20) continue;
        ctx.fillStyle="rgba(255,255,255,0.35)"; ctx.font="10px sans-serif"; ctx.textAlign="center";
        ctx.fillText("🚲", blX, gy-15); ctx.textAlign="left";
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  LAYER 9 — STREET FURNITURE (lamps, trees, benches, hydrants)
    // ══════════════════════════════════════════════════════════════════════════
    const fPar = 0.291;
    const lampPos = [65,285,505,725,945,1165,1385,1605];
    lampPos.forEach(function(lp, i) {
      const lx = D.parallaxX(lp, cam, fPar);
      if (lx<-35||lx>w+35) return;
      lampPost(ctx, lx, gy, "rgba(255,210,100,0.42)", t);
      if (i%2===0) streetTree(ctx, lx+38, gy, 0.68+(i%3)*0.06, i%3, t);
      if (i%3===1) bench(ctx, lx-5, gy);
      if (i%4===2) hydrant(ctx, lx+20, gy);
    });

    // ══════════════════════════════════════════════════════════════════════════
    //  LAYER 10 — TRANSIT + CYCLING + PEDESTRIANS
    // ══════════════════════════════════════════════════════════════════════════
    // Red Copenhagen bus (always present, moving left to right)
    const busOff = (t * 0.020) % (w + 240);
    const busX = D.parallaxX(120 + busOff, cam, 0.296);
    if (busX>-90&&busX<w+90) {
      cityBus(ctx, busX, gy, 1, "#c8102e", "#f0f0f0");
      ctx.fillStyle="#fff"; ctx.font="5px sans-serif"; ctx.textAlign="center";
      ctx.fillText("5C Husum", busX+14, gy-22); ctx.textAlign="left";
    }

    // Cyclists — Copenhagen has more cyclists than cars
    const cPar = 0.293;
    const numCyc = (theme==="bike_lane"||theme==="mobility") ? 14 : 5;
    for (let ci=0; ci<numCyc; ci++) {
      const bkOff = ((t*0.026+ci*0.17)%1.4)*(w+420)-210;
      const bkX = D.parallaxX(bkOff, cam, cPar);
      if (bkX<-44||bkX>w+44) continue;
      bicycle(ctx, bkX, gy, ci%4===2?-1:1, t+ci*0.85);
    }

    // Pedestrians — 8 people with varied outfits
    const pedCols=["rgba(48,68,98,0.68)","rgba(78,58,88,0.68)","rgba(38,78,58,0.68)",
                   "rgba(88,68,48,0.68)","rgba(58,78,88,0.68)","rgba(68,48,68,0.68)",
                   "rgba(38,58,78,0.68)","rgba(88,58,58,0.68)"];
    for (let pi=0; pi<8; pi++) {
      const pedOff=((t*0.011+pi*0.14)%1.5)*(w+540)-270;
      const pedX=D.parallaxX(pedOff,cam,0.295);
      if (pedX<-32||pedX>w+32) continue;
      pedestrian(ctx,pedX,gy,pi%3===1?-1:1,t,pi*1.7,pedCols[pi]);
      // Umbrella on flood/smog themes
      if (theme==="flood_zone"||theme==="smog_cloud") {
        ctx.fillStyle=(theme==="flood_zone")?"rgba(28,76,160,0.72)":"rgba(90,86,74,0.72)";
        ctx.beginPath(); ctx.arc(pedX,gy-33,11,Math.PI,0); ctx.fill();
        ctx.fillStyle="#4a5a6a"; ctx.fillRect(pedX-1,gy-33,2,14);
      }
    }

    // ══════════════════════════════════════════════════════════════════════════
    //  THEME-SPECIFIC OVERLAYS
    // ══════════════════════════════════════════════════════════════════════════

    if (theme==="arts"||theme==="stage_hazard") {
      // TIVOLI GARDENS NIGHT — spotbeams, Ferris wheel, lantern strings, marquee
      const artC=["#e74c3c","#3498db","#2ecc71","#f39c12","#9b59b6","#e91e63","#1abc9c","#ff5722"];
      for (let i=0;i<8;i++) spotBeam(ctx,50+i*185,cam,w,gy,t,i*0.82,artC[i%artC.length]);
      // Lantern strings between buildings
      for (let ls=0;ls<6;ls++) {
        const la1x=D.parallaxX(70+ls*270,cam,0.27);
        const la2x=D.parallaxX(210+ls*270,cam,0.27);
        if (la2x<0||la1x>w) continue;
        ctx.strokeStyle="rgba(70,40,20,0.55)"; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(la1x,gy-118); ctx.lineTo(la2x,gy-112); ctx.stroke();
        for (let ln=0;ln<8;ln++) {
          const lnx=la1x+(la2x-la1x)*ln/7;
          const lny=gy-115+Math.sin(ln*0.8)*6;
          lanternDot(ctx,lnx,lny,cam,w,t,ln*0.45+ls,artC[(ls*3+ln)%artC.length]);
        }
      }
      // Tivoli marquee
      const mqX=D.parallaxX(395,cam,0.235);
      if (mqX>-90&&mqX<w+90) {
        ctx.fillStyle="rgba(4,0,12,0.90)"; rrp(ctx,mqX-55,gy-222,110,34,6); ctx.fill();
        ctx.fillStyle="#f39c12"; ctx.font="bold 12px monospace"; ctx.textAlign="center";
        ctx.fillText("✦ TIVOLI ✦", mqX, gy-200); ctx.textAlign="left";
        ctx.fillStyle="#ffcc00"; ctx.font="7px sans-serif"; ctx.textAlign="center";
        ctx.fillText("GARDENS", mqX, gy-190); ctx.textAlign="left";
        for (let bl=0;bl<14;bl++) {
          const bAlpha=0.4+0.6*Math.sin(t*4.5+bl*0.6);
          ctx.globalAlpha=bAlpha;
          ctx.fillStyle=bl%3===0?"#f39c12":bl%3===1?"#e74c3c":"#3498db";
          ctx.beginPath(); ctx.arc(mqX-50+bl*7.5,gy-222,3.8,0,Math.PI*2); ctx.fill();
          ctx.globalAlpha=1;
        }
      }
      // Ferris wheel (Tivoli)
      const fwX=D.parallaxX(1080,cam,0.185);
      if (fwX>-90&&fwX<w+90) {
        ctx.strokeStyle="rgba(160,80,200,0.65)"; ctx.lineWidth=2.5;
        ctx.beginPath(); ctx.arc(fwX,gy-155,58,0,Math.PI*2); ctx.stroke();
        for (let sp=0;sp<12;sp++) {
          const ang3=sp*Math.PI/6+t*0.009;
          ctx.lineWidth=1.2; ctx.strokeStyle="rgba(180,100,220,0.45)";
          ctx.beginPath(); ctx.moveTo(fwX,gy-155); ctx.lineTo(fwX+Math.cos(ang3)*58,gy-155+Math.sin(ang3)*58); ctx.stroke();
        }
        for (let gn=0;gn<8;gn++) {
          const ga=gn*Math.PI/4+t*0.009;
          const gnx=fwX+Math.cos(ga)*58, gny=gy-155+Math.sin(ga)*58;
          ctx.fillStyle=artC[gn%artC.length]; ctx.fillRect(gnx-5,gny-6,10,9);
        }
        ctx.fillStyle="#555"; ctx.fillRect(fwX-4,gy-97,8,97);
      }
      // Coloured neon halos on Nyhavn buildings
      nhData.forEach(function(b,i){
        const nx=D.parallaxX(b.dx,cam,nhPar);
        if(nx>w+30||nx+b.w<-30) return;
        ctx.save(); ctx.globalAlpha=0.18+0.10*Math.sin(t*1.2+i);
        ctx.strokeStyle=artC[i%artC.length]; ctx.lineWidth=3;
        ctx.strokeRect(nx-2,gy+10-b.h,b.w+4,b.h);
        ctx.restore();
      });

    } else if (theme==="env"||theme==="wind_turbine") {
      // CLEAN ENVIRONMENT — sailboats, EV station, solar panels, extra birds
      A.paintBirds(ctx,cam,w,gy,t+6,[{x:0.28,y:0.30,n:14},{x:0.68,y:0.14,n:9}]);
      // Sailboat on Nyhavn canal
      const slX=D.parallaxX(720,cam,0.215);
      if (slX>-55&&slX<w+55) {
        const bob2=Math.sin(t*0.75+slX*0.01)*2;
        ctx.fillStyle="#e8e8f8"; ctx.fillRect(slX-18,canalY+22+bob2,36,8);
        ctx.fillStyle="#c8c8e0"; // hull
        ctx.beginPath(); ctx.moveTo(slX-20,canalY+30+bob2); ctx.lineTo(slX+20,canalY+30+bob2);
        ctx.lineTo(slX+14,canalY+38+bob2); ctx.lineTo(slX-14,canalY+38+bob2); ctx.closePath(); ctx.fill();
        ctx.strokeStyle="#8888a0"; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(slX,canalY+22+bob2); ctx.lineTo(slX,canalY-14+bob2); ctx.stroke();
        ctx.fillStyle="rgba(238,238,255,0.90)";
        ctx.beginPath(); ctx.moveTo(slX,canalY-14+bob2); ctx.lineTo(slX+30,canalY+18+bob2); ctx.lineTo(slX,canalY+18+bob2); ctx.closePath(); ctx.fill();
      }
      // EV charging station
      const evX=D.parallaxX(310,cam,0.292);
      if (evX>-22&&evX<w+22) {
        ctx.fillStyle="#27ae60"; ctx.fillRect(evX,gy-58,3,58);
        rrp(ctx,evX-14,gy-70,30,14,4); ctx.fill();
        ctx.fillStyle="#fff"; ctx.font="7px sans-serif"; ctx.textAlign="center";
        ctx.fillText("⚡ EV", evX+1, gy-60); ctx.textAlign="left";
      }
      // Solar panels on roof of Christiansborg
      if (palX>-110&&palX<w+110) {
        ctx.fillStyle="rgba(30,80,160,0.45)";
        for(let sp2=0;sp2<5;sp2++) ctx.fillRect(palX-50+sp2*22,gy-138,18,10);
        ctx.strokeStyle="rgba(100,140,200,0.35)"; ctx.lineWidth=1;
        for(let sp2=0;sp2<5;sp2++){
          ctx.beginPath(); ctx.moveTo(palX-50+sp2*22+9,gy-138); ctx.lineTo(palX-50+sp2*22+9,gy-128); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(palX-50+sp2*22,gy-133); ctx.lineTo(palX-50+sp2*22+18,gy-133); ctx.stroke();
        }
      }

    } else if (theme==="bike_lane"||theme==="mobility") {
      // CYCLING CITY — counter, bike rack, cargo bikes, green corridor
      const ccX=D.parallaxX(660,cam,0.285);
      if (ccX>-45&&ccX<w+45) {
        ctx.fillStyle="#1a5a28"; rrp(ctx,ccX-38,gy-94,76,32,5); ctx.fill();
        ctx.fillStyle="#50e050"; ctx.font="bold 10px monospace"; ctx.textAlign="center";
        ctx.fillText("🚲 24,847", ccX, gy-73); ctx.textAlign="left";
        ctx.fillStyle="#90f090"; ctx.font="6px sans-serif"; ctx.textAlign="center";
        ctx.fillText("cyclists today", ccX, gy-61); ctx.textAlign="left";
        ctx.fillStyle="#1a5a28"; ctx.fillRect(ccX-1,gy-62,3,62);
      }
      // Cargo bikes
      for (let cb=0;cb<3;cb++) {
        const cbOff=((t*0.018+cb*0.34)%1.3)*(w+380)-190;
        const cbX=D.parallaxX(cbOff,cam,cPar+0.002);
        if (cbX<-60||cbX>w+60) continue;
        bicycle(ctx,cbX,gy,1,t+cb*1.2);
        ctx.fillStyle=["#e74c3c","#3498db","#f39c12"][cb];
        ctx.fillRect(cbX-22,gy-20,20,14); // cargo box
        ctx.strokeStyle="rgba(0,0,0,0.3)"; ctx.lineWidth=1; ctx.strokeRect(cbX-22,gy-20,20,14);
      }

    } else if (theme==="housing"||theme==="quake_crack") {
      // CONSTRUCTION — three cranes, scaffolding, dust, orange fence
      crane(ctx,260,cam,w,gy,0.21,1.0);
      crane(ctx,760,cam,w,gy,0.245,0.88);
      crane(ctx,1240,cam,w,gy,0.19,0.96);
      // Scaffolding on a building
      const scX=D.parallaxX(440,cam,0.26);
      if (scX>-65&&scX<w+65) {
        ctx.strokeStyle="rgba(158,138,98,0.58)"; ctx.lineWidth=2;
        for(let sv=0;sv<5;sv++){ctx.beginPath();ctx.moveTo(scX+sv*14,gy-88);ctx.lineTo(scX+sv*14,gy);ctx.stroke();}
        for(let sh=0;sh<6;sh++){ctx.beginPath();ctx.moveTo(scX,gy-14-sh*14);ctx.lineTo(scX+56,gy-14-sh*14);ctx.stroke();}
        // Builder silhouette
        ctx.fillStyle="rgba(50,40,30,0.75)"; ctx.fillRect(scX+18,gy-100,8,18);
        ctx.beginPath(); ctx.arc(scX+22,gy-104,5,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#f39c12"; ctx.fillRect(scX+18,gy-108,8,5); // hard hat
      }
      // Orange construction fence
      const cfX=D.parallaxX(330,cam,0.295);
      for(let cf=0;cf<10;cf++) {
        ctx.fillStyle="#e6882a"; ctx.fillRect(cfX+cf*14,gy-30,12,30);
        ctx.strokeStyle="#1a1a1a"; ctx.lineWidth=0.5;
        ctx.beginPath(); ctx.moveTo(cfX+cf*14,gy-30); ctx.lineTo(cfX+cf*14+12,gy-5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cfX+cf*14+12,gy-30); ctx.lineTo(cfX+cf*14,gy-5); ctx.stroke();
      }
      P.smogHaze(ctx,D.parallaxX(-120,cam,0.11),gy-140,w+540,0.13,[108,102,92]);

    } else if (theme==="flood_zone") {
      // FLOODED STREETS — dark water, sandbags, emergency signs
      ctx.fillStyle="rgba(8,24,76,0.52)";
      ctx.fillRect(D.parallaxX(-250,cam,0.295),gy-22,w+900,24);
      // Water ripples over road
      ctx.save(); ctx.globalAlpha=0.48;
      for(let wr=0;wr<14;wr++){
        const wrx=D.parallaxX(40+wr*155,cam,0.296);
        ctx.strokeStyle="rgba(70,130,200,0.58)"; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.ellipse(wrx,gy-10+Math.sin(t*1.15+wr*0.62)*2,22+wr*2,4,0,0,Math.PI*2); ctx.stroke();
      }
      ctx.restore();
      // Sandbags
      const sbX=D.parallaxX(460,cam,0.294);
      if(sbX>-45&&sbX<w+45){
        for(let sb=0;sb<6;sb++){
          ctx.fillStyle="#c8b878"; rrp(ctx,sbX+sb*16-2+Math.floor(sb/3)*(-3),gy-12-Math.floor(sb/3)*8,15,10,4); ctx.fill();
          ctx.strokeStyle="rgba(0,0,0,0.15)"; ctx.lineWidth=0.5; ctx.stroke();
        }
      }
      // Emergency alert sign
      const ewX=D.parallaxX(880,cam,0.285);
      if(ewX>-30&&ewX<w+30){
        ctx.fillStyle="#f39c12"; ctx.fillRect(ewX-1,gy-90,3,72);
        ctx.beginPath(); ctx.moveTo(ewX-18,gy-90); ctx.lineTo(ewX+18,gy-90); ctx.lineTo(ewX,gy-114); ctx.closePath(); ctx.fill();
        ctx.fillStyle="#1a1a1a"; ctx.font="bold 9px sans-serif"; ctx.textAlign="center";
        ctx.fillText("!", ewX, gy-96); ctx.textAlign="left";
      }

    } else if (theme==="smog_cloud") {
      // HEAVY SMOG — three haze bands + pollution meter
      P.smogHaze(ctx,D.parallaxX(-120,cam,0.065),gy-205,w+520,0.24,[78,82,68]);
      P.smogHaze(ctx,D.parallaxX(-120,cam,0.105),gy-145,w+520,0.30,[90,86,72]);
      P.smogHaze(ctx,D.parallaxX(-120,cam,0.155),gy-85,w+520,0.20,[102,96,80]);
      const pmX=D.parallaxX(540,cam,0.285);
      if(pmX>-32&&pmX<w+32){
        ctx.fillStyle="rgba(0,0,0,0.72)"; rrp(ctx,pmX-32,gy-108,64,26,4); ctx.fill();
        ctx.fillStyle="#e74c3c"; ctx.font="bold 9px monospace"; ctx.textAlign="center";
        ctx.fillText("AQI 285 ☠", pmX, gy-89); ctx.textAlign="left";
      }

    } else if (theme==="car_swarm"||theme==="commute_pulse") {
      // TRAFFIC JAM — many cars, traffic light
      const carC=["#c0392b","#2980b9","#f39c12","#7f8c8d","#27ae60","#8e44ad","#e74c3c"];
      for(let ci=0;ci<12;ci++){
        const caX=D.parallaxX(25+ci*130,cam,0.295);
        if(caX<-65||caX>w+65) continue;
        smallCar(ctx,caX,gy,ci%4===1?-1:1,carC[ci%carC.length]);
      }
      // Traffic light
      const tlX=D.parallaxX(630,cam,0.294);
      if(tlX>-22&&tlX<w+22){
        ctx.fillStyle="#2c3e50"; ctx.fillRect(tlX-1,gy-92,3,92);
        ctx.fillStyle="#111"; rrp(ctx,tlX-11,gy-94,23,46,4); ctx.fill();
        const ph=Math.floor(t*0.014)%3;
        ["#e74c3c","#f39c12","#2ecc71"].forEach(function(c2,ci2){
          ctx.fillStyle=ci2===ph?c2:"rgba(30,30,30,0.85)";
          ctx.beginPath(); ctx.arc(tlX,gy-86+ci2*14,5.5,0,Math.PI*2); ctx.fill();
        });
      }

    } else if (theme==="patrol_soft"||theme==="patrol_hard") {
      // POLICE — police car with lights, officer silhouettes
      const pcX=D.parallaxX(490,cam,0.294);
      if(pcX>-65&&pcX<w+65){
        smallCar(ctx,pcX,gy,1,"#f0f0f2");
        ctx.fillStyle="#1a5faa"; ctx.fillRect(pcX+2,gy-17,40,5);
        ctx.fillStyle="#f39c12";
        for(let pm=0;pm<4;pm++) ctx.fillRect(pcX+4+pm*10,gy-17,5,5);
        ctx.fillStyle=Math.sin(t*8)>0?"#0044ff":"#ff1111";
        ctx.fillRect(pcX+10,gy-25,22,5);
        // Officer
        pedestrian(ctx,pcX+60,gy,1,t,0,"rgba(20,30,60,0.85)");
        ctx.fillStyle="#1a5faa"; ctx.fillRect(pcX+57,gy-22,8,14);
        ctx.fillStyle="#111"; ctx.fillRect(pcX+57,gy-28,8,6); // cap
      }

    } else if (theme==="health"||theme==="pulse_zone") {
      // HEALTH — hospital H sign, ambulance
      const hcX=D.parallaxX(680,cam,0.215);
      if(hcX>-65&&hcX<w+65){
        ctx.fillStyle="#1a5ea0"; rrp(ctx,hcX-28,gy-192,56,42,6); ctx.fill();
        ctx.fillStyle="#fff"; ctx.font="bold 24px sans-serif"; ctx.textAlign="center";
        ctx.fillText("H", hcX, gy-163); ctx.textAlign="left";
      }
      const amX=D.parallaxX(280,cam,0.296);
      if(amX>-85&&amX<w+85){
        ctx.fillStyle="#f0f0f0"; rrp(ctx,amX-2,gy-28,56,28,3); ctx.fill();
        ctx.fillStyle="#e74c3c"; ctx.fillRect(amX+10,gy-26,18,6); ctx.fillRect(amX+16,gy-31,6,14);
        ctx.fillStyle="rgba(100,160,240,0.58)"; ctx.fillRect(amX+38,gy-24,12,12);
        ctx.fillStyle="#1a1a1a"; ctx.beginPath(); ctx.arc(amX+8,gy,7,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(amX+46,gy,7,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=Math.sin(t*9)>0?"#3498db":"#e74c3c"; ctx.fillRect(amX+20,gy-34,6,6);
      }

    } else if (theme==="civic"||theme==="ballot_wave") {
      // CIVIC — town hall clock tower, vote banners, flags
      const thX=D.parallaxX(580,cam,0.185);
      if(thX>-90&&thX<w+90){
        ctx.fillStyle="#b0a880"; ctx.fillRect(thX-32,gy-165,64,165);
        for(let col=0;col<5;col++) {ctx.fillStyle="#9a9270"; ctx.fillRect(thX-26+col*14,gy-160,10,160);}
        ctx.fillStyle="#c0b898"; ctx.fillRect(thX-16,gy-205,32,40);
        // Clock
        ctx.fillStyle="#f0e8c8"; ctx.beginPath(); ctx.arc(thX,gy-185,20,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#3a2a1a"; ctx.lineWidth=2;
        const hr3=t*0.001;
        ctx.beginPath(); ctx.moveTo(thX,gy-185); ctx.lineTo(thX+Math.cos(hr3)*11,gy-185+Math.sin(hr3)*11); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(thX,gy-185); ctx.lineTo(thX+Math.cos(hr3*12)*15,gy-185+Math.sin(hr3*12)*15); ctx.stroke();
        // Three Danish flags
        for(let fl=0;fl<3;fl++){
          const fpx2=thX-45+fl*45, fpy2=gy-215;
          ctx.fillStyle="#5a5a5a"; ctx.fillRect(fpx2,fpy2,2,48);
          ctx.fillStyle="#c8102e"; ctx.fillRect(fpx2+2,fpy2+5,22,14);
          ctx.fillStyle="#fff"; ctx.fillRect(fpx2+2+7,fpy2+5,3,14); ctx.fillRect(fpx2+2,fpy2+5+5,22,3);
        }
      }
      const vbX=D.parallaxX(1180,cam,0.225);
      if(vbX>-65&&vbX<w+65){
        ctx.fillStyle="rgba(8,44,118,0.82)"; ctx.fillRect(vbX-54,gy-175,108,30);
        ctx.fillStyle="#f0f0f0"; ctx.font="bold 10px sans-serif"; ctx.textAlign="center";
        ctx.fillText("STEM NU!", vbX, gy-154); ctx.textAlign="left";
      }

    } else if (theme==="learning"||theme==="book_stack") {
      // UNIVERSITY — columned entrance, floating books
      const univX=D.parallaxX(680,cam,0.195);
      if(univX>-90&&univX<w+90){
        ctx.fillStyle="#e0d8c8"; ctx.fillRect(univX-55,gy-148,110,148);
        for(let col=0;col<7;col++){ctx.fillStyle="#d0c8b8"; ctx.fillRect(univX-48+col*16,gy-144,11,144);}
        ctx.fillStyle="#c8c0a8"; ctx.fillRect(univX-60,gy-148,120,10);
        ctx.fillStyle="#8a1a1a"; ctx.fillRect(univX-9,gy-136,18,18);
        ctx.fillStyle="#f0d060"; ctx.font="9px serif"; ctx.textAlign="center";
        ctx.fillText("KU", univX, gy-122); ctx.textAlign="left";
        // Latin motto
        ctx.fillStyle="rgba(80,60,40,0.55)"; ctx.font="6px serif"; ctx.textAlign="center";
        ctx.fillText("Fundet 1479", univX, gy-112); ctx.textAlign="left";
      }
      for(let bk=0;bk<5;bk++){
        const bkX=D.parallaxX(90+bk*340,cam,0.225);
        const bkY=gy-175-Math.sin(t*0.48+bk*1.3)*18;
        if(bkX<-24||bkX>w+24) continue;
        ctx.save(); ctx.translate(bkX,bkY); ctx.rotate(Math.sin(t*0.28+bk)*0.12);
        ctx.fillStyle=["#c0392b","#2980b9","#27ae60","#8e44ad","#e67e22"][bk];
        ctx.fillRect(-15,-6,14,18); ctx.fillRect(1,-6,14,18);
        ctx.strokeStyle="rgba(0,0,0,0.22)"; ctx.lineWidth=1;
        for(let ln=1;ln<5;ln++){ctx.beginPath();ctx.moveTo(-14,-6+ln*3.5);ctx.lineTo(-2,-6+ln*3.5);ctx.stroke();}
        for(let ln=1;ln<5;ln++){ctx.beginPath();ctx.moveTo(2,-6+ln*3.5);ctx.lineTo(14,-6+ln*3.5);ctx.stroke();}
        ctx.restore();
      }

    } else if (theme==="work"||theme==="sector"||theme==="institution_gate") {
      // CORPORATE OFFICE PARK
      for(let ow=0;ow<6;ow++){
        const owx=D.parallaxX(140+ow*235,cam,0.295);
        if(owx<-24||owx>w+24) continue;
        pedestrian(ctx,owx,gy,ow%2===0?1:-1,t,ow*2.2,"rgba(28,28,56,0.78)");
        ctx.fillStyle="rgba(75,55,38,0.72)"; ctx.fillRect(owx+5,gy-17,11,9); ctx.fillRect(owx+8,gy-20,5,4);
      }
      const csX=D.parallaxX(880,cam,0.215);
      if(csX>-55&&csX<w+55){
        ctx.fillStyle="rgba(18,28,58,0.88)"; rrp(ctx,csX-50,gy-208,100,32,5); ctx.fill();
        ctx.fillStyle="#a0b8d0"; ctx.font="bold 8px sans-serif"; ctx.textAlign="center";
        ctx.fillText("KBH BUSINESS", csX, gy-188); ctx.textAlign="left";
      }

    } else if (theme==="income"||theme==="tax_slider") {
      // WEALTH THEME — luxury car, money symbols
      const lcX=D.parallaxX(580,cam,0.295);
      if(lcX>-65&&lcX<w+65){
        ctx.fillStyle="#1a1f2a"; rrp(ctx,lcX,gy-22,62,22,5); ctx.fill();
        ctx.fillStyle="rgba(100,200,255,0.52)"; ctx.fillRect(lcX+32,gy-20,24,12);
        ctx.fillStyle="#111"; ctx.beginPath(); ctx.arc(lcX+12,gy,8,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(lcX+50,gy,8,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle="#d4af37"; ctx.lineWidth=1.8;
        ctx.beginPath(); ctx.moveTo(lcX,gy-9); ctx.lineTo(lcX+62,gy-9); ctx.stroke();
      }
      for(let mn=0;mn<6;mn++){
        const mnx=D.parallaxX(70+mn*265,cam,0.225);
        const mny=gy-165-Math.sin(t*0.42+mn)*22;
        if(mnx<-14||mnx>w+14) continue;
        ctx.fillStyle=`rgba(90,190,90,${0.22+0.10*Math.sin(t*0.48+mn)})`;
        ctx.font="bold 15px sans-serif"; ctx.fillText("kr", mnx, mny);
      }
    }

    // ── GROUND LINE ──────────────────────────────────────────────────────────
    groundLine(ctx, cam, w, gy, "rgba(50,148,214,0.48)");

    // ── POST-PROCESS ─────────────────────────────────────────────────────────
    if (D.particles) D.particles.paint(ctx, city.id, cam, w, h, t);
    if (D.foreground) D.foreground.paint(ctx, city, cam, w, h, gy, t);
    A.finish(ctx, w, h, {
      rays:{x:w*0.74, y:0, w:105, h:gy, alpha:0.052},
      vignette:(theme==="flood_zone"||theme==="arts"||theme==="patrol_hard") ? 0.46 : 0.28
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  TORONTO
  // ═══════════════════════════════════════════════════════════════════════════
  function paintToronto(ctx, city, cam, w, h, gy, t, stage) {
    const theme = stage ? stage.hazardTheme : null;

    // Per-theme skies: each captures a different Toronto mood
    const sky =
      theme==="arts"||theme==="stage_hazard"   ? ["#0a0614","#28104a","#b03a00"] :
      theme==="learning"||theme==="book_stack" ? ["#1a2535","#2e4060","#8090b0"] :
      theme==="work"||theme==="commute_pulse"  ? ["#0d1520","#1a2d45","#3a6080"] :
      theme==="civic"||theme==="ballot_wave"   ? ["#0c1825","#1c3050","#3a6090"] :
      theme==="health"||theme==="pulse_zone"   ? ["#0a1a22","#1a3540","#3a7070"] :
      theme==="safety"||theme==="car_swarm"    ? ["#100505","#2a0808","#6a1010"] :
      theme==="sector"||theme==="institution_gate" ? ["#0e1418","#1e2e3c","#3c5468"] :
      theme==="income"||theme==="tax_slider"   ? ["#181208","#352810","#706030"] :
      theme==="env"||theme==="smog_cloud"      ? ["#141008","#2a2414","#685840"] :
      theme==="mobility"||theme==="boss_sprawl"? ["#08060e","#180f22","#3a1838"] :
      theme==="flood_zone"                     ? ["#040c18","#0a1c30","#1c4060"] :
      SKY.toronto.palette;

    const isNight = theme && theme!=="env";
    A.paintSky(ctx, w, h, gy, sky, t);

    // Stars for dark/night themes, sun for clear env theme
    if (theme==="arts"||theme==="stage_hazard"||theme==="boss_sprawl") {
      P.starField(ctx, w, h, 303, t);
    }
    if (theme==="env") {
      ctx.save();
      const sg = ctx.createRadialGradient(D.parallaxX(w*0.75,cam,0.04), h*0.18, 0,
        D.parallaxX(w*0.75,cam,0.04), h*0.18, 55);
      sg.addColorStop(0,"rgba(255,238,180,0.95)"); sg.addColorStop(1,"rgba(255,238,180,0)");
      ctx.fillStyle = sg; ctx.beginPath();
      ctx.arc(D.parallaxX(w*0.75,cam,0.04), h*0.18, 55, 0, Math.PI*2); ctx.fill();
      ctx.restore();
    }

    A.paintClouds(ctx, cam, w, gy, t,
      theme==="smog_cloud" ? [{par:0.05,y:50,density:10,alpha:0.72}] :
      theme==="flood_zone" ? [{par:0.04,y:38,density:12,alpha:0.85}] :
      SKY.toronto.clouds);

    // ── FAR: Toronto suburb low silhouette ────────────────────────────────────
    P.hillSilhouette(ctx, D.parallaxX(-200,cam,0.03), D.parallaxX(w+700,cam,0.03),
      gy+22, 28, "rgba(70,90,110,0.22)", 202);

    // ── MID-FAR glass/concrete towers ─────────────────────────────────────────
    B.row(ctx, -200, w+1000, gy+36, cam, 0.05, 202, ["glass","highrise","brutalist"], 32, 72, t);
    B.row(ctx, -200, w+1000, gy+18, cam, 0.10, 505, ["highrise","glass","warehouse"],  56,130, t);

    // ── NEAR: Detailed glass towers with curtain-wall facades ─────────────────
    for (let i = 0; i < 6; i++) {
      const bx = D.parallaxX(60+i*270, cam, 0.18);
      if (!D.visible(bx, 58, cam, w)) continue;
      const bh = 150 + (i%4)*44;
      const lit = (theme==="arts"||theme==="stage_hazard") ? 0.82 :
                  (theme==="work"||theme==="commute_pulse") ? 0.65 : 0.40;
      detailBuilding(ctx, bx, gy, 50, bh, "#4a6070", "#2c3e50", 400+i, lit, t);
      // Curtain-wall horizontal spandrels
      ctx.save(); ctx.globalAlpha=0.20;
      ctx.fillStyle="#7fb3c8";
      for (let j=0;j<Math.floor(bh/18);j++) ctx.fillRect(bx+2, gy-bh+j*18, 46, 2);
      ctx.restore();
    }

    // ── CN TOWER — detailed with observation deck ring and pod ─────────────────
    const cnx = D.parallaxX(w*0.62+160, cam, 0.14);
    if (D.visible(cnx, 80, cam, w)) {
      B.landmarkCnTower(ctx, cnx, gy+8, 1.08);
      // Observation pod ring glow
      const podY = gy+8-188;
      ctx.save();
      ctx.globalAlpha = 0.30 + Math.sin(t*0.05)*0.10;
      const podG = ctx.createRadialGradient(cnx, podY, 0, cnx, podY, 28);
      podG.addColorStop(0,"rgba(255,220,100,0.6)"); podG.addColorStop(1,"rgba(255,220,100,0)");
      ctx.fillStyle=podG; ctx.beginPath(); ctx.arc(cnx,podY,28,0,Math.PI*2); ctx.fill();
      // Rotating restaurant beacon light
      const beamAng = t*0.018;
      ctx.strokeStyle="rgba(255,200,80,0.45)"; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(cnx,podY);
      ctx.lineTo(cnx+Math.cos(beamAng)*60, podY+Math.sin(beamAng)*60); ctx.stroke();
      ctx.restore();
      // Arts theme: TIFF festival colored rings
      if (theme==="arts"||theme==="stage_hazard") {
        const artsC=["#e74c3c","#3498db","#f39c12","#9b59b6"];
        for (let r=0;r<4;r++) {
          ctx.save(); ctx.globalAlpha=0.25+Math.sin(t*0.04+r*1.2)*0.12;
          ctx.strokeStyle=artsC[r]; ctx.lineWidth=2.5;
          ctx.beginPath(); ctx.arc(cnx,podY,12+r*8,0,Math.PI*2); ctx.stroke();
          ctx.restore();
        }
      }
    }

    // ── TORONTO CITY HALL — curved twin towers silhouette ─────────────────────
    const chx = D.parallaxX(w*0.32, cam, 0.16);
    if (D.visible(chx, 100, cam, w) && (theme==="civic"||theme==="ballot_wave"||theme==="sector"||theme==="institution_gate"||!theme)) {
      // East tower (taller, curved)
      ctx.fillStyle="#3d5468";
      ctx.beginPath();
      ctx.moveTo(chx-48, gy); ctx.lineTo(chx-48, gy-112);
      ctx.quadraticCurveTo(chx-32, gy-130, chx-18, gy-112);
      ctx.lineTo(chx-18, gy); ctx.closePath(); ctx.fill();
      // West tower (shorter, curved opposite)
      ctx.fillStyle="#2c4055";
      ctx.beginPath();
      ctx.moveTo(chx+12, gy); ctx.lineTo(chx+12, gy-88);
      ctx.quadraticCurveTo(chx+28, gy-102, chx+42, gy-88);
      ctx.lineTo(chx+42, gy); ctx.closePath(); ctx.fill();
      // Saucer council chamber (round, between towers)
      ctx.fillStyle="#4a6070";
      ctx.beginPath(); ctx.ellipse(chx-3, gy-68, 28, 10, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle="#3a5060";
      ctx.fillRect(chx-28, gy-68, 56, 68);
      // Windows
      ctx.fillStyle="rgba(255,220,120,0.40)";
      for (let row=0;row<4;row++) for (let col=0;col<3;col++) {
        ctx.fillRect(chx-42+col*10, gy-108+row*22, 6, 14);
      }
    }

    // ── LAKE ONTARIO waterfront ───────────────────────────────────────────────
    P.lakeBand(ctx, D.parallaxX(-100,cam,0.08), D.parallaxX(w+500,cam,0.08), gy+46,
      theme==="flood_zone" ? ["rgba(10,30,70,0.72)","rgba(4,12,30,0.96)"] :
      theme==="env"        ? ["rgba(50,150,210,0.65)","rgba(20,70,110,0.90)"] :
                              ["rgba(90,140,175,0.55)","rgba(38,55,75,0.82)"]);

    // Animated ripple highlights on the lake surface
    for (let i=0;i<6;i++) {
      const rx = D.parallaxX(150+i*280, cam, 0.085);
      if (!D.visible(rx,60,cam,w)) continue;
      ctx.save(); ctx.globalAlpha=0.18+Math.sin(t*0.04+i)*0.08;
      ctx.strokeStyle="#a0c8e0"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.ellipse(rx, gy+52, 30+i*8, 3, 0, 0, Math.PI*2); ctx.stroke();
      ctx.restore();
    }

    // Toronto Island Ferry
    const fTor = D.parallaxX(820, cam, 0.09);
    if (D.visible(fTor,40,cam,w)) {
      ferryBoat(ctx, fTor, gy+50, t);
      ctx.save(); ctx.fillStyle="rgba(255,255,255,0.55)"; ctx.font="6px monospace";
      ctx.fillText("TORONTO ISLAND",fTor-28,gy+42); ctx.restore();
    }

    // ── DISTILLERY DISTRICT brick arch ────────────────────────────────────────
    const ddx = D.parallaxX(w*0.22, cam, 0.21);
    if (D.visible(ddx, 80, cam, w) && (theme==="arts"||theme==="stage_hazard"||theme==="learning"||!theme)) {
      ctx.fillStyle="#7a4030"; // old red brick
      ctx.fillRect(ddx-36, gy-58, 74, 58); // main building
      // Arch opening
      ctx.fillStyle="#1a1008";
      ctx.beginPath(); ctx.arc(ddx, gy-18, 16, Math.PI, 0); ctx.fill();
      ctx.fillRect(ddx-16, gy-18, 32, 18);
      // Brick courses
      ctx.strokeStyle="rgba(0,0,0,0.18)"; ctx.lineWidth=1;
      for (let r=0;r<5;r++) ctx.strokeRect(ddx-36, gy-58+r*11, 74, 11);
      // Keystone
      ctx.fillStyle="#8b5040";
      ctx.beginPath(); ctx.moveTo(ddx,gy-36); ctx.lineTo(ddx-6,gy-28); ctx.lineTo(ddx+6,gy-28); ctx.closePath(); ctx.fill();
    }

    // ── GARDINER EXPRESSWAY — elevated grey concrete deck ─────────────────────
    const gex = D.parallaxX(-80, cam, 0.20);
    {
      ctx.fillStyle="#8090a0";
      ctx.fillRect(gex, gy-52, w+400, 8); // deck
      for (let i=0;i<12;i++) {
        ctx.fillStyle=i%2===0?"#7080a0":"#8898b0";
        ctx.fillRect(gex+i*120, gy-52, 10, 52); // piers
      }
    }

    // ── STREETCAR OVERHEAD WIRES ──────────────────────────────────────────────
    {
      const wx = D.parallaxX(-60, cam, 0.25);
      ctx.save(); ctx.strokeStyle="rgba(200,210,220,0.28)"; ctx.lineWidth=0.8;
      for (let i=0;i<3;i++) {
        ctx.beginPath();
        ctx.moveTo(wx, gy-42-i*4);
        ctx.lineTo(wx+w+200, gy-44-i*4); ctx.stroke();
      }
      ctx.restore();
    }

    // ── STREET LEVEL: lamps, trees, pedestrians ────────────────────────────────
    for (let i=0;i<6;i++) {
      const fx = D.parallaxX(130+i*300, cam, 0.28);
      if (!D.visible(fx,30,cam,w)) continue;
      lampPost(ctx, fx, gy, "rgba(255,200,120,0.38)", t);
      if (i%2===0) streetTree(ctx, fx+42, gy, 0.68, 0, t);
      if (i%3===0) bench(ctx, fx+20, gy);
    }
    // TTC streetcar (animated)
    const tcar = D.parallaxX(-60 + ((t*18)%(w+300)), cam, 0.27);
    if (D.visible(tcar, 70, cam, w)) cityBus(ctx, tcar, gy, 1, "#c0392b", "#ecf0f1");
    // Pedestrians
    for (let i=0;i<5;i++) {
      const px=D.parallaxX(180+i*370, cam, 0.29);
      if (D.visible(px,18,cam,w)) pedestrian(ctx,px,gy,i%2===0?1:-1,t,i*1.9,"rgba(55,65,80,0.70)");
    }

    // ── TTC BUS SHELTER (red) ─────────────────────────────────────────────────
    const bsx = D.parallaxX(660, cam, 0.22);
    if (D.visible(bsx, 90, cam, w)) {
      ctx.fillStyle="#c0392b"; ctx.fillRect(bsx-44, gy-30, 88, 24);
      ctx.fillStyle="#1a252f"; ctx.fillRect(bsx-44, gy-30, 88, 4);
      ctx.fillStyle="rgba(200,230,245,0.55)";
      ctx.fillRect(bsx-36,gy-24,24,14); ctx.fillRect(bsx+10,gy-24,24,14);
      ctx.fillStyle="#fff"; ctx.font="bold 7px monospace"; ctx.textAlign="center";
      ctx.fillText("TTC",bsx,gy-10); ctx.textAlign="left";
    }

    // ── THEME-SPECIFIC OVERLAYS ───────────────────────────────────────────────
    if (theme==="arts"||theme==="stage_hazard") {
      // TIFF Festival: spotlights, colored marquee lights, Caribana banner
      for (let i=0;i<5;i++) spotBeam(ctx, 70+i*240,cam,w,gy,t,i*1.4,["#9b59b6","#e74c3c","#1abc9c","#f39c12","#3498db"][i]);
      const lc=["#9b59b6","#e74c3c","#f39c12","#3498db","#2ecc71","#e91e63"];
      for (let i=0;i<10;i++) lanternDot(ctx,60+i*195,gy-82-(i%3)*28,cam,w,t,i*1.2,lc[i%lc.length]);
      // Caribana flag colours: red/black/gold
      const cf=D.parallaxX(350,cam,0.24);
      if (D.visible(cf,80,cam,w)) {
        ctx.fillStyle="#1a252f"; ctx.fillRect(cf-4, gy-80, 4, 80);
        ctx.fillStyle="#2ecc71"; ctx.fillRect(cf, gy-80, 48, 26);
        ctx.fillStyle="#e74c3c"; ctx.fillRect(cf, gy-54, 48, 26);
        ctx.fillStyle="#f39c12"; ctx.fillRect(cf, gy-28, 48, 28);
      }

    } else if (theme==="learning"||theme==="book_stack") {
      // UofT: sandstone gate arch
      const utx=D.parallaxX(w*0.40,cam,0.20);
      if (D.visible(utx,100,cam,w)) {
        ctx.fillStyle="#c8a870"; // sandstone
        ctx.fillRect(utx-52,gy-82,22,82); ctx.fillRect(utx+30,gy-82,22,82);
        ctx.beginPath(); ctx.arc(utx-9,gy-82,41,Math.PI,0); ctx.fill();
        ctx.fillStyle="rgba(0,0,0,0.4)";
        ctx.beginPath(); ctx.arc(utx-9,gy-82,30,Math.PI,0); ctx.fill();
        ctx.fillRect(utx-30,gy-82,42,82);
        ctx.fillStyle="#b09558"; ctx.font="bold 7px sans-serif"; ctx.textAlign="center";
        ctx.fillText("UNIVERSITAS TORONTONENSIS",utx-9,gy-90); ctx.textAlign="left";
      }
      // Floating books from sky
      for (let i=0;i<3;i++) {
        const bky=((t*0.6+i*55)%(gy+100))-20;
        const bkx=D.parallaxX(200+i*400,cam,0.22);
        if (!D.visible(bkx,30,cam,w)) continue;
        ctx.save(); ctx.translate(bkx,bky);
        ctx.rotate(Math.sin(t*0.02+i)*0.2);
        ctx.fillStyle=["#1a3a6e","#6b0a0a","#1a5a1a"][i%3]; ctx.fillRect(-12,-17,22,34);
        ctx.fillStyle="#e8dfd2"; ctx.fillRect(10,-17,4,34);
        ctx.fillStyle="rgba(255,255,255,0.6)"; ctx.fillRect(-8,-10,12,2); ctx.fillRect(-8,-5,8,2);
        ctx.restore();
      }

    } else if (theme==="work"||theme==="commute_pulse") {
      // Bay Street: dense lit-window office buildings + exodus of workers
      for (let i=0;i<8;i++) {
        const wx2=D.parallaxX(40+i*200,cam,0.17);
        if (!D.visible(wx2,44,cam,w)) continue;
        ctx.save(); ctx.globalAlpha=0.35+Math.sin(t*0.04+i)*0.15;
        ctx.fillStyle="#f39c12";
        ctx.fillRect(wx2,gy-90-(i%3)*30,40,8);
        ctx.restore();
      }
      // Commuter flood (pedestrians walking fast)
      for (let i=0;i<8;i++) {
        const wx3=D.parallaxX(80+i*230,cam,0.29);
        if (D.visible(wx3,14,cam,w)) pedestrian(ctx,wx3,gy,i%2===0?1:-1,t*1.8,i*0.6,"rgba(30,40,55,0.72)");
      }

    } else if (theme==="civic"||theme==="ballot_wave") {
      // City Hall flag pole + Canadian flag
      const flx=D.parallaxX(550,cam,0.23);
      if (D.visible(flx,70,cam,w)) {
        ctx.fillStyle="#95a5a6"; ctx.fillRect(flx-2,gy-110,4,110);
        ctx.fillStyle="#c0392b"; ctx.fillRect(flx+2,gy-110,46,28);
        ctx.fillStyle="#fff"; ctx.fillRect(flx+14,gy-110,12,28);
        // Simple maple leaf (red blob)
        ctx.fillStyle="#c0392b";
        ctx.beginPath(); ctx.arc(flx+20,gy-96,6,0,Math.PI*2); ctx.fill();
      }
      // "VOTE" banners
      for (let i=0;i<3;i++) {
        const vx=D.parallaxX(200+i*450,cam,0.21);
        if (!D.visible(vx,50,cam,w)) continue;
        ctx.fillStyle="rgba(44,62,80,0.85)"; ctx.fillRect(vx-24,gy-72,48,18);
        ctx.fillStyle="#3498db"; ctx.font="bold 8px sans-serif"; ctx.textAlign="center";
        ctx.fillText("VOTE",vx,gy-59); ctx.textAlign="left";
      }

    } else if (theme==="health"||theme==="pulse_zone") {
      // Hospital H sign
      const hpx=D.parallaxX(w*0.38,cam,0.19);
      if (D.visible(hpx,80,cam,w)) {
        ctx.fillStyle="#2c3e50"; ctx.fillRect(hpx-40,gy-100,80,100);
        ctx.fillStyle="#e74c3c";
        ctx.fillRect(hpx-22,gy-84,12,52); ctx.fillRect(hpx+10,gy-84,12,52);
        ctx.fillRect(hpx-22,gy-62,44,12);
        // Flashing beacon
        const hblink=Math.sin(t*3.5)>0;
        ctx.fillStyle=hblink?"rgba(231,76,60,0.8)":"rgba(231,76,60,0.2)";
        ctx.beginPath(); ctx.arc(hpx,gy-106,8,0,Math.PI*2); ctx.fill();
      }
      // Ambulance
      const amx=D.parallaxX(800,cam,0.26);
      if (D.visible(amx,58,cam,w)) {
        ctx.fillStyle="#ecf0f1"; ctx.fillRect(amx,gy-24,54,20);
        ctx.fillStyle="#e74c3c";
        ctx.fillRect(amx+14,gy-12,10,8); ctx.fillRect(amx+10,gy-16,18,4);
        ctx.fillStyle="#2980b9"; ctx.fillRect(amx+6,gy-20,14,10); ctx.fillRect(amx+34,gy-20,14,10);
        ctx.fillStyle="#1a252f";
        ctx.beginPath(); ctx.arc(amx+12,gy-2,6,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(amx+40,gy-2,6,0,Math.PI*2); ctx.fill();
        // Flashing red/blue on roof
        const fl=Math.floor(t*3)%2;
        ctx.fillStyle=fl?"#e74c3c":"#3498db";
        ctx.beginPath(); ctx.arc(amx+27,gy-27,5,0,Math.PI*2); ctx.fill();
      }

    } else if (theme==="safety"||theme==="car_swarm") {
      // Police cruiser with light bar
      const pcx=D.parallaxX(600,cam,0.27);
      if (D.visible(pcx,60,cam,w)) {
        ctx.fillStyle="#2c3e50"; ctx.fillRect(pcx,gy-24,58,20);
        ctx.fillStyle="#ecf0f1"; ctx.fillRect(pcx+6,gy-16,18,10); ctx.fillRect(pcx+34,gy-16,16,10);
        const fl2=Math.floor(t*5)%2;
        ctx.fillStyle=fl2?"#e74c3c":"#3498db";
        ctx.fillRect(pcx+14,gy-30,10,6);
        ctx.fillStyle=fl2?"#3498db":"#e74c3c";
        ctx.fillRect(pcx+30,gy-30,10,6);
        ctx.fillStyle="#1a252f";
        ctx.beginPath(); ctx.arc(pcx+12,gy-2,6,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(pcx+44,gy-2,6,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#fff"; ctx.font="5px monospace"; ctx.textAlign="center";
        ctx.fillText("POLICE",pcx+29,gy-18); ctx.textAlign="left";
      }
      // Auto theft yellow warning tape
      const tapX=D.parallaxX(360,cam,0.23);
      if (D.visible(tapX,120,cam,w)) {
        ctx.save(); ctx.globalAlpha=0.55;
        ctx.strokeStyle="#f39c12"; ctx.lineWidth=3; ctx.setLineDash([10,6]);
        ctx.beginPath(); ctx.moveTo(tapX,gy-8); ctx.lineTo(tapX+110,gy-8); ctx.stroke();
        ctx.setLineDash([]);
        ctx.font="bold 7px monospace"; ctx.fillStyle="#f39c12"; ctx.textAlign="center";
        ctx.fillText("POLICE LINE",tapX+55,gy-14); ctx.textAlign="left";
        ctx.restore();
      }

    } else if (theme==="sector"||theme==="institution_gate") {
      // Red tape and bureaucratic stamps
      for (let i=0;i<4;i++) {
        const rx2=D.parallaxX(160+i*340,cam,0.21);
        if (!D.visible(rx2,40,cam,w)) continue;
        ctx.fillStyle="rgba(192,57,43,0.55)"; ctx.fillRect(rx2-20,gy-50,40,6);
        ctx.fillStyle="rgba(192,57,43,0.35)"; ctx.fillRect(rx2-14,gy-42,28,6);
      }

    } else if (theme==="income"||theme==="tax_slider") {
      // "SOLD" price tag signs on buildings
      for (let i=0;i<4;i++) {
        const sx=D.parallaxX(120+i*350,cam,0.20);
        if (!D.visible(sx,50,cam,w)) continue;
        ctx.fillStyle="#e74c3c"; ctx.fillRect(sx-22,gy-68,44,20);
        ctx.fillStyle="#fff"; ctx.font="bold 7px monospace"; ctx.textAlign="center";
        ctx.fillText("SOLD",sx,gy-55); ctx.textAlign="left";
        ctx.fillStyle="#f39c12"; ctx.font="bold 6px sans-serif"; ctx.textAlign="center";
        ctx.fillText("C$1.1M",sx,gy-44); ctx.textAlign="left";
      }
      crane(ctx, 340, cam, w, gy, 0.21, 0.92);
      crane(ctx, 820, cam, w, gy, 0.24, 0.80);

    } else if (theme==="env"||theme==="smog_cloud") {
      // Gardiner smog: thick haze bands
      P.smogHaze(ctx, D.parallaxX(-80,cam,0.08), gy-185, w+450, 0.25, [90,80,58]);
      P.smogHaze(ctx, D.parallaxX(-50,cam,0.14), gy-110, w+380, 0.18, [75,66,44]);
      // PM2.5 meter display
      const pmx=D.parallaxX(460,cam,0.22);
      if (D.visible(pmx,60,cam,w)) {
        ctx.fillStyle="rgba(20,15,8,0.88)"; ctx.fillRect(pmx-28,gy-60,56,30);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 9px monospace"; ctx.textAlign="center";
        ctx.fillText("PM2.5",pmx,gy-46);
        ctx.fillStyle="#f39c12"; ctx.font="bold 11px monospace";
        ctx.fillText("68 μg",pmx,gy-32); ctx.textAlign="left";
      }

    } else if (theme==="mobility"||theme==="boss_sprawl") {
      // Gridlock: rows of cars backed up
      for (let i=0;i<10;i++) {
        const cx2=D.parallaxX(30+i*155,cam,0.28);
        if (!D.visible(cx2,56,cam,w)) continue;
        smallCar(ctx,cx2,gy,i%2===0?1:-1,i*7,t,["#2980b9","#c0392b","#7f8c8d","#e67e22","#1abc9c"][i%5]);
      }
      // "401" highway sign
      const hsx=D.parallaxX(680,cam,0.22);
      if (D.visible(hsx,60,cam,w)) {
        ctx.fillStyle="#2c3e50"; ctx.fillRect(hsx-30,gy-55,60,24);
        ctx.fillStyle="#ecf0f1"; ctx.font="bold 9px sans-serif"; ctx.textAlign="center";
        ctx.fillText("HWY 401",hsx,gy-39); ctx.textAlign="left";
      }
    } else if (theme==="flood_zone") {
      P.smogHaze(ctx, D.parallaxX(-60,cam,0.09), gy-140, w+400, 0.14, [18,35,65]);
      P.canalWater(ctx, D.parallaxX(-80,cam,0.24), D.parallaxX(w+400,cam,0.24), gy+8, t,
        {top:"rgba(10,28,65,0.60)",bot:"rgba(4,10,30,0.94)"});
    }

    groundLine(ctx, cam, w, gy, "rgba(231,76,60,0.38)");
    if (D.particles) D.particles.paint(ctx, city.id, cam, w, h, t);
    if (D.foreground) D.foreground.paint(ctx, city, cam, w, h, gy, t);
    A.finish(ctx, w, h, {vignette: theme==="smog_cloud"||theme==="env"?0.30:0.18});
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  ISTANBUL
  // ═══════════════════════════════════════════════════════════════════════════
  function paintIstanbul(ctx, city, cam, w, h, gy, t, stage) {
    const theme = stage ? stage.hazardTheme : null;

    const sky =
      theme==="arts"||theme==="stage_hazard"       ? ["#6b2000","#c46000","#f0c850"] :
      theme==="civic"||theme==="ballot_wave"        ? ["#7a3600","#c86800","#f8dc90"] :
      theme==="learning"||theme==="book_stack"      ? ["#141c28","#243448","#4a6888"] :
      theme==="mobility"||theme==="car_swarm"       ? ["#0c1018","#1a2030","#3a5070"] :
      theme==="housing"||theme==="quake_crack"      ? ["#1e1810","#3c3020","#6a5838"] :
      theme==="work"||theme==="commute_pulse"       ? ["#180c08","#382010","#6a4020"] :
      theme==="health"||theme==="pulse_zone"        ? ["#0a1418","#162432","#2c4858"] :
      theme==="safety"||theme==="patrol_soft"       ? ["#101828","#1c2e48","#385878"] :
      theme==="sector"||theme==="institution_gate"  ? ["#14100a","#2a2010","#504030"] :
      theme==="env"||theme==="smog_cloud"           ? ["#0a0c10","#181c24","#303848"] :
      theme==="boss_volatile"||theme==="income"     ? ["#200808","#401010","#7a2020"] :
      theme==="flood_zone"                          ? ["#080e1a","#101c30","#1e3c5a"] :
      SKY.istanbul.palette;

    A.paintSky(ctx, w, h, gy, sky, t);

    // Atmospheric sun haze for warm/arts themes
    if (theme==="arts"||theme==="stage_hazard"||theme==="civic"||theme==="ballot_wave") {
      const sunG=ctx.createRadialGradient(D.parallaxX(w*0.78,cam,0.04),h*0.12,0,D.parallaxX(w*0.78,cam,0.04),h*0.12,120);
      sunG.addColorStop(0,"rgba(255,180,50,0.55)"); sunG.addColorStop(1,"rgba(255,180,50,0)");
      ctx.save(); ctx.fillStyle=sunG;
      ctx.beginPath(); ctx.arc(D.parallaxX(w*0.78,cam,0.04),h*0.12,120,0,Math.PI*2); ctx.fill();
      ctx.restore();
    } else if (!theme||theme==="hub") {
      P.starField(ctx, w, h, 414, t);
    }

    A.paintClouds(ctx, cam, w, gy, t,
      theme==="flood_zone" ? [{par:0.04,y:40,density:12,alpha:0.85}] :
      theme==="smog_cloud" ? [{par:0.05,y:50,density:8,alpha:0.60}] :
      SKY.istanbul.clouds);

    // ── ASIAN SHORE silhouette across the Bosphorus ───────────────────────────
    P.hillSilhouette(ctx, D.parallaxX(-200,cam,0.03), D.parallaxX(w+700,cam,0.03),
      gy+35, 60, "rgba(100,75,40,0.28)", 414);

    // ── FAR BUILDING ROWS (Ottoman + modern mix) ──────────────────────────────
    B.row(ctx, -200, w+900, gy+28, cam, 0.06, 414, ["colonial","brick","mosque"], 38, 95, t);
    B.row(ctx, -200, w+900, gy+10, cam, 0.12, 616, ["brick","artdeco","mosque"],  62,145, t);

    // ── HAGIA SOPHIA — main dome + semi-domes + four minarets ─────────────────
    const hsx = D.parallaxX(w*0.55+100, cam, 0.14);
    if (D.visible(hsx, 160, cam, w)) {
      // Base / walls (warm sandstone)
      ctx.fillStyle="#b89458";
      ctx.fillRect(hsx-70, gy-82, 140, 82);
      // Buttresses
      for (let i=0;i<4;i++) {
        const bpos = [-66,-40,18,44][i];
        ctx.fillStyle="#a07840";
        ctx.fillRect(hsx+bpos, gy-88, 18, 88);
      }
      // Semi-domes (east + west)
      ctx.fillStyle="#c4a468";
      ctx.beginPath(); ctx.arc(hsx-55,gy-78,22,Math.PI,0); ctx.fill();
      ctx.beginPath(); ctx.arc(hsx+55,gy-78,22,Math.PI,0); ctx.fill();
      // Main dome
      const domeG=ctx.createRadialGradient(hsx,gy-120,0,hsx,gy-120,52);
      domeG.addColorStop(0,"#d4b070"); domeG.addColorStop(1,"#9a7040");
      ctx.fillStyle=domeG;
      ctx.beginPath(); ctx.arc(hsx,gy-82,52,Math.PI,0); ctx.fill();
      // Drum (ring of windows)
      ctx.fillStyle="#b89050";
      ctx.beginPath(); ctx.arc(hsx,gy-82,44,Math.PI,0); ctx.fill();
      ctx.fillStyle="#c8a860";
      ctx.fillRect(hsx-44, gy-88, 88, 8);
      // Drum windows
      ctx.fillStyle="rgba(255,200,100,0.35)";
      for (let i=0;i<8;i++) {
        const wa=Math.PI+i*(Math.PI/8)+Math.PI/16;
        ctx.beginPath(); ctx.arc(hsx+Math.cos(wa)*40,gy-86+Math.sin(wa)*10,3.5,0,Math.PI*2); ctx.fill();
      }
      // Minarets (4 thin pencil towers)
      const mPos = [-72,-36,28,64];
      ctx.fillStyle="#c8a860";
      for (let i=0;i<4;i++) {
        const mx=hsx+mPos[i];
        ctx.fillRect(mx-4,gy-138,8,138);
        // Pointed cap
        ctx.beginPath(); ctx.moveTo(mx,gy-152); ctx.lineTo(mx-5,gy-138); ctx.lineTo(mx+5,gy-138); ctx.closePath(); ctx.fill();
        // Balcony ring
        ctx.fillRect(mx-7,gy-112,14,3);
      }
    }

    // ── GALATA TOWER — cylindrical medieval tower ─────────────────────────────
    const gtx = D.parallaxX(w*0.30, cam, 0.17);
    if (D.visible(gtx, 50, cam, w)) {
      const towerH=96;
      ctx.fillStyle="#8a7055";
      ctx.fillRect(gtx-14, gy-towerH, 28, towerH);
      // Conical roof
      ctx.fillStyle="#4a6a4a"; // green patina
      ctx.beginPath(); ctx.moveTo(gtx,gy-towerH-28); ctx.lineTo(gtx-16,gy-towerH); ctx.lineTo(gtx+16,gy-towerH); ctx.closePath(); ctx.fill();
      // Windows
      ctx.fillStyle="rgba(255,160,60,0.40)";
      for (let r=0;r<4;r++) {
        ctx.beginPath(); ctx.arc(gtx,gy-towerH+12+r*20,4,Math.PI,0); ctx.fill();
      }
    }

    // ── DETAILED NEAR OTTOMAN-STYLE BUILDINGS ─────────────────────────────────
    for (let i=0;i<5;i++) {
      const bx=D.parallaxX(50+i*280, cam, 0.20);
      if (!D.visible(bx,50,cam,w)) continue;
      const lit=(theme==="arts"||theme==="stage_hazard")?0.65:0.22;
      detailBuilding(ctx, bx, gy+4, 44, 80+i*22, "#c4a882", "#8d7548", 600+i, lit, t);
      // Arched windows
      ctx.fillStyle="rgba(255,180,80,0.20)";
      for (let j=0;j<3;j++) {
        const wy=gy-(50+i*22)+j*22+8;
        ctx.beginPath(); ctx.arc(bx+12+j*14,wy,5,Math.PI,0); ctx.fill();
        ctx.fillRect(bx+7+j*14,wy,10,10);
      }
    }

    // ── BOSPHORUS — deep blue water with shipping ─────────────────────────────
    P.canalWater(ctx, D.parallaxX(-130,cam,0.10), D.parallaxX(w+530,cam,0.10), gy+42, t, {
      top: theme==="flood_zone" ? "rgba(10,28,68,0.70)" : "rgba(62,108,148,0.55)",
      bot: theme==="flood_zone" ? "rgba(3,10,28,0.96)"  : "rgba(24,52,82,0.88)",
    });

    // Ferries + container ships
    for (let i=0;i<2;i++) {
      const fx=D.parallaxX(280+i*580,cam,0.08+i*0.02);
      if (D.visible(fx,50,cam,w)) ferryBoat(ctx,fx,gy+44,t+i*1.8);
    }
    // Cargo ship (large, slow)
    const cpx=D.parallaxX(500,cam,0.06);
    if (D.visible(cpx,90,cam,w)) {
      ctx.fillStyle="#5a6870"; ctx.fillRect(cpx-40,gy+44,80,14);
      ctx.fillStyle="#7a8890"; ctx.fillRect(cpx-32,gy+34,24,10);
      ctx.fillStyle="#4a5860"; ctx.fillRect(cpx+10,gy+38,16,6);
      // Diesel stack smoke
      ctx.fillStyle="rgba(80,80,80,0.35)";
      for (let s=0;s<3;s++) ctx.beginPath(),ctx.arc(cpx-30,(gy+32)-(s*6),4+s*2,0,Math.PI*2),ctx.fill();
    }

    // ── BOSPHORUS BRIDGE CABLES (far silhouette) ──────────────────────────────
    const bbx=D.parallaxX(-80, cam, 0.05);
    {
      ctx.save(); ctx.globalAlpha=0.18;
      ctx.strokeStyle="#8090a8"; ctx.lineWidth=6;
      // Towers
      ctx.fillStyle="#8090a8";
      ctx.fillRect(bbx+180,gy-80,10,80); ctx.fillRect(bbx+w-80,gy-80,10,80);
      // Main suspension cables
      ctx.lineWidth=2.5; ctx.strokeStyle="#6070a0";
      ctx.beginPath(); ctx.moveTo(bbx+180,gy-80); ctx.quadraticCurveTo(bbx+w*0.5,gy+10,bbx+w-80,gy-80); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bbx+180,gy-68); ctx.quadraticCurveTo(bbx+w*0.5,gy+18,bbx+w-80,gy-68); ctx.stroke();
      ctx.restore();
    }

    // ── STREET LEVEL ──────────────────────────────────────────────────────────
    for (let i=0;i<6;i++) {
      const fx=D.parallaxX(100+i*260,cam,0.28);
      if (!D.visible(fx,30,cam,w)) continue;
      lampPost(ctx, fx, gy, "rgba(255,190,90,0.32)", t);
      if (i%2===0) streetTree(ctx, fx+36, gy, 0.52, 1, t);
    }
    // Taxis (yellow Istanbul taxis)
    for (let i=0;i<2;i++) {
      const tx=D.parallaxX(300+i*550,cam,0.27);
      if (D.visible(tx,50,cam,w)) smallCar(ctx,tx,gy,1,i*8,t,"#f4d03f");
    }
    // Pedestrians
    for (let i=0;i<5;i++) {
      const px=D.parallaxX(120+i*340,cam,0.29);
      if (D.visible(px,16,cam,w)) pedestrian(ctx,px,gy,i%2?1:-1,t,i*1.8,"rgba(70,50,30,0.68)");
    }

    // ── THEME OVERLAYS ────────────────────────────────────────────────────────
    if (theme==="arts"||theme==="stage_hazard") {
      // Golden Horn festival: lanterns, spotbeams, rooftop light strings
      const lc=["#f39c12","#e74c3c","#9b59b6","#3498db","#f4d03f","#e91e63"];
      for (let i=0;i<12;i++) lanternDot(ctx,58+i*192,gy-82-(i%4)*26,cam,w,t,i*1.1,lc[i%lc.length]);
      for (let i=0;i<5;i++) spotBeam(ctx,80+i*250,cam,w,gy,t,i*1.0,["#f39c12","#e67e22","#f4d03f","#d35400","#e74c3c"][i]);

    } else if (theme==="civic"||theme==="ballot_wave") {
      // Turkish flag x2 + opposition green banner
      for (let fi=0;fi<2;fi++) {
        const fpx=D.parallaxX(420+fi*480,cam,0.22);
        if (!D.visible(fpx,70,cam,w)) continue;
        ctx.fillStyle="#7f8c8d"; ctx.fillRect(fpx,gy-118,4,118);
        ctx.fillStyle="#e74c3c"; ctx.fillRect(fpx+4,gy-118,56,36);
        // Crescent + star
        ctx.fillStyle="#ecf0f1"; ctx.beginPath(); ctx.arc(fpx+22,gy-100,10,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#e74c3c"; ctx.beginPath(); ctx.arc(fpx+27,gy-100,8,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#ecf0f1"; ctx.beginPath();
        ctx.arc(fpx+35,gy-100,4,0,Math.PI*2); ctx.fill();
      }

    } else if (theme==="learning"||theme==="book_stack") {
      // Boğaziçi University gate
      const bgx=D.parallaxX(w*0.40,cam,0.19);
      if (D.visible(bgx,100,cam,w)) {
        ctx.fillStyle="#a08860";
        ctx.fillRect(bgx-50,gy-72,20,72); ctx.fillRect(bgx+30,gy-72,20,72);
        ctx.beginPath(); ctx.arc(bgx-10,gy-72,40,Math.PI,0); ctx.fill();
        ctx.fillStyle="rgba(0,0,0,0.45)";
        ctx.beginPath(); ctx.arc(bgx-10,gy-72,28,Math.PI,0); ctx.fill();
        ctx.fillRect(bgx-28,gy-72,38,72);
        ctx.fillStyle="#8a7040"; ctx.font="6px sans-serif"; ctx.textAlign="center";
        ctx.fillText("BOĞAZİÇİ ÜNİVERSİTESİ",bgx-10,gy-80); ctx.textAlign="left";
      }

    } else if (theme==="mobility"||theme==="car_swarm") {
      // Traffic jam on main road
      for (let i=0;i<10;i++) {
        const cx=D.parallaxX(30+i*150,cam,0.28);
        if (!D.visible(cx,52,cam,w)) continue;
        smallCar(ctx,cx,gy,i%2?1:-1,i*9,t,["#f4d03f","#c0392b","#2980b9","#7f8c8d","#e67e22"][i%5]);
      }
      // Metro/Metrobus sign
      const msx=D.parallaxX(660,cam,0.22);
      if (D.visible(msx,60,cam,w)) {
        ctx.fillStyle="#1a6aaa"; ctx.fillRect(msx-28,gy-52,56,20);
        ctx.fillStyle="#fff"; ctx.font="bold 7px sans-serif"; ctx.textAlign="center";
        ctx.fillText("METROBÜS",msx,gy-39); ctx.textAlign="left";
      }

    } else if (theme==="housing"||theme==="quake_crack") {
      // Earthquake damage: cracked buildings + dust
      crane(ctx, 380, cam, w, gy, 0.21, 0.88);
      crane(ctx, 900, cam, w, gy, 0.24, 0.80);
      P.smogHaze(ctx, D.parallaxX(-80,cam,0.10), gy-140, w+420, 0.18, [100,85,65]);
      // Crack lines on buildings
      for (let i=0;i<4;i++) {
        const crx=D.parallaxX(100+i*340,cam,0.20);
        if (!D.visible(crx,30,cam,w)) continue;
        ctx.save(); ctx.strokeStyle="rgba(100,80,50,0.65)"; ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(crx,gy-65); ctx.lineTo(crx+8,gy-45); ctx.lineTo(crx+3,gy-25);
        ctx.stroke(); ctx.restore();
      }

    } else if (theme==="work"||theme==="commute_pulse") {
      // Industrial smoke from Gebze-side factories
      for (let i=0;i<3;i++) {
        const stx=D.parallaxX(200+i*450,cam,0.16);
        if (!D.visible(stx,20,cam,w)) continue;
        ctx.fillStyle="#4a3828"; ctx.fillRect(stx-5,gy-72,10,72);
        for (let s=0;s<4;s++) {
          ctx.save(); ctx.globalAlpha=0.18+s*0.05;
          ctx.fillStyle="#6a5840";
          ctx.beginPath(); ctx.arc(stx,gy-72-(s*14),8+s*4,0,Math.PI*2); ctx.fill();
          ctx.restore();
        }
      }

    } else if (theme==="health"||theme==="pulse_zone") {
      // Red Crescent hospital sign
      const rcx=D.parallaxX(w*0.35,cam,0.20);
      if (D.visible(rcx,70,cam,w)) {
        ctx.fillStyle="#2c3e50"; ctx.fillRect(rcx-34,gy-82,68,82);
        ctx.fillStyle="#e74c3c";
        ctx.beginPath(); ctx.arc(rcx,gy-54,16,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#2c3e50";
        ctx.beginPath(); ctx.arc(rcx+4,gy-54,12,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#e74c3c";
        ctx.beginPath(); ctx.arc(rcx+10,gy-52,5,0,Math.PI*2); ctx.fill();
      }

    } else if (theme==="safety"||theme==="patrol_soft") {
      // Police barrier + flashing checkpoint
      const barX=D.parallaxX(500,cam,0.23);
      if (D.visible(barX,100,cam,w)) {
        ctx.strokeStyle="#e74c3c"; ctx.lineWidth=4; ctx.setLineDash([10,6]);
        ctx.beginPath(); ctx.moveTo(barX,gy-6); ctx.lineTo(barX+88,gy-6); ctx.stroke();
        ctx.setLineDash([]);
        const cp=Math.floor(t*4)%2;
        ctx.fillStyle=cp?"#e74c3c":"#3498db";
        ctx.beginPath(); ctx.arc(barX+44,gy-20,7,0,Math.PI*2); ctx.fill();
      }

    } else if (theme==="sector"||theme==="institution_gate") {
      // Sultanahmet court building
      const crtx=D.parallaxX(w*0.42,cam,0.17);
      if (D.visible(crtx,100,cam,w)) {
        ctx.fillStyle="#c4b090"; ctx.fillRect(crtx-50,gy-82,100,82);
        for (let i=0;i<5;i++) {
          ctx.fillStyle="#a89070"; ctx.fillRect(crtx-44+i*18,gy-72,8,60);
          ctx.beginPath(); ctx.arc(crtx-40+i*18,gy-72,4,Math.PI,0); ctx.fill();
        }
        ctx.fillStyle="#8a7050"; ctx.fillRect(crtx-54,gy-88,108,8);
        ctx.fillStyle="#fff"; ctx.font="5px sans-serif"; ctx.textAlign="center";
        ctx.fillText("ADALET SARAYI",crtx,gy-96); ctx.textAlign="left";
      }

    } else if (theme==="env"||theme==="smog_cloud") {
      // Shipping diesel smog over Bosphorus
      P.smogHaze(ctx, D.parallaxX(-80,cam,0.08), gy-180, w+420, 0.30, [55,50,40]);
      P.smogHaze(ctx, D.parallaxX(-50,cam,0.14), gy-110, w+360, 0.22, [40,38,28]);
      const pmx=D.parallaxX(430,cam,0.22);
      if (D.visible(pmx,60,cam,w)) {
        ctx.fillStyle="rgba(15,10,5,0.90)"; ctx.fillRect(pmx-28,gy-60,56,28);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 7px monospace"; ctx.textAlign="center";
        ctx.fillText("AQI 142",pmx,gy-47);
        ctx.fillStyle="#f39c12"; ctx.font="5px monospace"; ctx.fillText("UNHEALTHY",pmx,gy-36);
        ctx.textAlign="left";
      }

    } else if (theme==="boss_volatile"||theme==="income"||theme==="tax_slider") {
      // Lira collapse: falling ₺ symbols, red price tickers
      for (let i=0;i<6;i++) {
        const ly = ((t*0.8+i*40)%(gy+100))-10;
        const lx = D.parallaxX(120+i*280,cam,0.21);
        if (!D.visible(lx,30,cam,w)) continue;
        ctx.save();
        ctx.globalAlpha=0.70; ctx.fillStyle="#e74c3c";
        ctx.font="bold 14px sans-serif"; ctx.textAlign="center";
        ctx.fillText("₺",lx,ly); ctx.restore();
      }
      // Exchange rate ticker
      const tkx=D.parallaxX(500,cam,0.22);
      if (D.visible(tkx,90,cam,w)) {
        ctx.fillStyle="rgba(20,5,5,0.92)"; ctx.fillRect(tkx-44,gy-52,88,22);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 8px monospace"; ctx.textAlign="center";
        ctx.fillText("1 USD = 32.1 ₺  ▼",tkx,gy-37); ctx.textAlign="left";
      }

    } else if (theme==="flood_zone") {
      P.smogHaze(ctx, D.parallaxX(-80,cam,0.08), gy-165, w+420, 0.20, [14,28,58]);
    }

    groundLine(ctx, cam, w, gy, "rgba(212,172,110,0.42)");
    if (D.particles) D.particles.paint(ctx, city.id, cam, w, h, t);
    if (D.foreground) D.foreground.paint(ctx, city, cam, w, h, gy, t);
    A.finish(ctx, w, h, {rays:{x:w*0.5,y:20,w:80,h:gy,alpha:0.06}, vignette:0.22});
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  BANGKOK
  // ═══════════════════════════════════════════════════════════════════════════
  function paintBangkok(ctx, city, cam, w, h, gy, t, stage) {
    const theme = stage ? stage.hazardTheme : null;

    const sky =
      theme==="arts"||theme==="stage_hazard"       ? ["#030106","#0a0618","#2a0058"] :
      theme==="smog_cloud"||theme==="boss_storm"   ? ["#1c1000","#421e00","#7a4408"] :
      theme==="flood_zone"                         ? ["#04080e","#0a1828","#183850"] :
      theme==="housing"||theme==="income"          ? ["#0a1220","#183040","#304868"] :
      theme==="work"||theme==="commute_pulse"      ? ["#0c0a14","#1c1828","#342e4a"] :
      theme==="learning"||theme==="book_stack"     ? ["#0e1420","#1c2838","#364858"] :
      theme==="civic"||theme==="ballot_wave"       ? ["#100a04","#221808","#3a2a10"] :
      theme==="sector"||theme==="institution_gate" ? ["#0c0e18","#181c2c","#2c3448"] :
      theme==="health"||theme==="pulse_zone"       ? ["#0a1218","#182430","#2c4858"] :
      theme==="safety"||theme==="car_swarm"        ? ["#060408","#100c18","#200c1a"] :
      theme==="mobility"||theme==="tax_slider"     ? ["#06060e","#0e0e20","#1a1a38"] :
      SKY.bangkok.palette;

    A.paintSky(ctx, w, h, gy, sky, t);

    // Night stars for dark themes
    if (theme==="arts"||theme==="stage_hazard"||theme==="boss_storm") {
      P.starField(ctx, w, h, 717, t);
    }
    // Golden temple glow in sky for non-smog themes
    if (theme!=="smog_cloud"&&theme!=="boss_storm"&&theme!=="arts"&&theme!=="stage_hazard") {
      ctx.save(); ctx.globalAlpha=0.10;
      ctx.fillStyle="#f4d03f";
      ctx.beginPath();
      ctx.moveTo(D.parallaxX(0,cam,0.03),gy+80); ctx.lineTo(D.parallaxX(w*0.5,cam,0.03),gy-110); ctx.lineTo(D.parallaxX(w,cam,0.03),gy+80);
      ctx.fill(); ctx.restore();
    }

    A.paintClouds(ctx, cam, w, gy, t,
      theme==="smog_cloud"||theme==="boss_storm" ? [{par:0.04,y:46,density:9,alpha:0.60}] :
      theme==="flood_zone" ? [{par:0.03,y:36,density:12,alpha:0.88}] :
      SKY.bangkok.clouds);

    // ── FAR BUILDING ROWS (tropical + temple + highrise) ──────────────────────
    B.row(ctx,-200,w+950,gy+24,cam,0.07,717,["tropical","temple","highrise"],44,105,t);
    B.row(ctx,-200,w+950,gy+6, cam,0.14,818,["tropical","highrise","artdeco"],62,172,t);

    // ── WAT PHO GILDED CHEDI — the main gold spire ────────────────────────────
    const wpx = D.parallaxX(w*0.58+80, cam, 0.15);
    if (D.visible(wpx, 80, cam, w)) {
      // Base mandapa (low hall)
      ctx.fillStyle="#9a8230";
      ctx.fillRect(wpx-44,gy-48,88,48);
      // Stacked prasad rings (5 rings narrowing upward)
      const rings=[{w:44,h:22},{w:36,h:18},{w:28,h:16},{w:20,h:14},{w:14,h:12}];
      let ry=gy-48;
      for (let r=0;r<rings.length;r++) {
        const rg=ctx.createLinearGradient(wpx-rings[r].w,0,wpx+rings[r].w,0);
        rg.addColorStop(0,"#c8a428"); rg.addColorStop(0.5,"#f4e040"); rg.addColorStop(1,"#c8a428");
        ctx.fillStyle=rg;
        ctx.fillRect(wpx-rings[r].w, ry-rings[r].h, rings[r].w*2, rings[r].h);
        ry-=rings[r].h;
      }
      // Finial spike
      ctx.fillStyle="#f8f060";
      ctx.beginPath(); ctx.moveTo(wpx,ry-24); ctx.lineTo(wpx-5,ry); ctx.lineTo(wpx+5,ry); ctx.closePath(); ctx.fill();
      // Gold glint
      ctx.save(); ctx.globalAlpha=0.30+Math.sin(t*0.04)*0.10;
      ctx.fillStyle="#fff8b0";
      ctx.beginPath(); ctx.arc(wpx,ry-8,6,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }

    // ── GRAND PALACE WALL ─────────────────────────────────────────────────────
    const gpx = D.parallaxX(-40, cam, 0.13);
    {
      ctx.fillStyle="#e8d888"; // white+gold
      ctx.fillRect(gpx, gy-44, w+200, 44);
      // Battlements
      for (let i=0;i<Math.floor((w+200)/22);i++) {
        ctx.fillStyle=i%2===0?"#f0e498":"#d8c870";
        ctx.fillRect(gpx+i*22, gy-54, 14, 10);
      }
      // Mosaic tile line
      ctx.strokeStyle="rgba(180,150,30,0.40)"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(gpx,gy-30); ctx.lineTo(gpx+w+200,gy-30); ctx.stroke();
    }

    // ── DETAILED NEAR BUILDINGS ───────────────────────────────────────────────
    for (let i=0;i<5;i++) {
      const bx=D.parallaxX(60+i*280,cam,0.20);
      if (!D.visible(bx,50,cam,w)) continue;
      const lit=(theme==="arts"||theme==="stage_hazard")?0.82:0.18;
      detailBuilding(ctx, bx, gy, 42, 95+i*22, "#8a7240", "#604c20", 700+i, lit, t);
    }

    // ── BTS SKYTRAIN elevated track (animated train) ──────────────────────────
    {
      const tkx = D.parallaxX(-100, cam, 0.22);
      // Concrete deck
      ctx.fillStyle="#9aacb8"; ctx.fillRect(tkx, gy-68, w+400, 9);
      // Support pillars
      for (let i=0;i<16;i++) {
        ctx.fillStyle=i%2===0?"#8090a0":"#909eb0";
        ctx.fillRect(tkx+i*105,gy-68,10,68);
      }
      // BTS train carriages (animated)
      const tx=(((t*1.3)%(w+500)));
      const btsC=["#2c3e50","#34495e"];
      for (let c=0;c<3;c++) {
        ctx.fillStyle=btsC[c%2]; ctx.fillRect(tkx+tx+c*85,gy-84,80,18);
        // Windows
        ctx.fillStyle="rgba(90,190,230,0.52)";
        for (let wi=0;wi<4;wi++) ctx.fillRect(tkx+tx+c*85+6+wi*18,gy-82,14,9);
        // BTS logo dot
        ctx.fillStyle="#00a550"; ctx.beginPath(); ctx.arc(tkx+tx+c*85+40,gy-78,4,0,Math.PI*2); ctx.fill();
      }
    }

    // ── CHAO PHRAYA (canal strip) ─────────────────────────────────────────────
    P.canalWater(ctx, D.parallaxX(-110,cam,0.11), D.parallaxX(w+530,cam,0.11), gy+38, t, {
      top: theme==="flood_zone" ? "rgba(6,22,55,0.72)" : "rgba(44,88,128,0.50)",
      bot: theme==="flood_zone" ? "rgba(2,8,22,0.96)"  : "rgba(18,48,78,0.88)",
    });
    // Longtail boats on canal
    for (let i=0;i<3;i++) {
      const bx=D.parallaxX(180+i*420,cam,0.09+i*0.01);
      if (!D.visible(bx,40,cam,w)) continue;
      // Simple longtail silhouette
      ctx.fillStyle="#7a6040"; ctx.fillRect(bx-20,gy+38,40,6);
      ctx.fillStyle="#5a4028"; ctx.fillRect(bx+10,gy+32,4,14);
      ctx.strokeStyle="#6a5030"; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(bx+12,gy+34); ctx.lineTo(bx+30,gy+42); ctx.stroke();
    }

    // ── TEMPLE SPIRES in mid-ground ───────────────────────────────────────────
    for (let i=0;i<4;i++) {
      const tx2=D.parallaxX(90+i*300,cam,0.17);
      if (D.visible(tx2,60,cam,w)) B.landmarkTemple(ctx,tx2,gy+10,0.70+(i%3)*0.05);
    }

    // ── STREET LEVEL ──────────────────────────────────────────────────────────
    for (let i=0;i<5;i++) {
      const fx=D.parallaxX(140+i*280,cam,0.28);
      if (!D.visible(fx,30,cam,w)) continue;
      lampPost(ctx, fx, gy, "rgba(255,210,100,0.28)", t);
      streetTree(ctx, fx+36, gy, 0.58, 1, t);
    }
    // Tuk-tuks (electric blue flash)
    for (let i=0;i<3;i++) {
      const tkx=D.parallaxX(320+i*440,cam,0.27);
      if (D.visible(tkx,25,cam,w)) tukTuk(ctx,tkx,gy,1,t);
    }
    // Pedestrians
    for (let i=0;i<5;i++) {
      const px=D.parallaxX(160+i*330,cam,0.29);
      if (D.visible(px,16,cam,w)) pedestrian(ctx,px,gy,i%2?1:-1,t,i*1.6,"rgba(60,40,15,0.68)");
    }

    // BASE smog haze (always present to some degree in Bangkok)
    const bkSmog=theme==="smog_cloud"||theme==="boss_storm" ? 0.42
      : theme==="flood_zone" ? 0.05 : 0.09;
    P.smogHaze(ctx, D.parallaxX(-110,cam,0.22), gy-180, w+450, bkSmog,
      theme==="smog_cloud"||theme==="boss_storm" ? [120,80,20] : [80,65,100]);

    // ── THEME OVERLAYS ────────────────────────────────────────────────────────
    if (theme==="arts"||theme==="stage_hazard") {
      // Yaowarat/Patpong neon district: animated neon bars
      const nc=["#e91e63","#00bcd4","#f39c12","#8e24aa","#26c6da","#ff5722","#4caf50"];
      for (let i=0;i<10;i++) {
        const nx=D.parallaxX(44+i*188,cam,0.17+(i%3)*0.01);
        if (!D.visible(nx,42,cam,w)) continue;
        const ny=gy-58-(i%4)*30;
        ctx.save(); ctx.globalAlpha=0.50+Math.sin(t*0.08+i*0.85)*0.30;
        ctx.fillStyle=nc[i%nc.length]; ctx.fillRect(nx-20,ny,40,5);
        ctx.globalAlpha=0.14; ctx.fillRect(nx-26,ny-4,52,13);
        ctx.restore();
      }
      for (let i=0;i<8;i++) lanternDot(ctx,72+i*210,gy-88-(i%3)*28,cam,w,t,i*1.1,["#f39c12","#e74c3c","#f4d03f"][i%3]);
      // Muay Thai stadium sign
      const mty=D.parallaxX(700,cam,0.21);
      if (D.visible(mty,70,cam,w)) {
        ctx.fillStyle="rgba(10,0,18,0.88)"; ctx.fillRect(mty-34,gy-76,68,28);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 7px monospace"; ctx.textAlign="center";
        ctx.fillText("MUAY THAI",mty,gy-60);
        ctx.fillStyle="#f4d03f"; ctx.font="6px monospace"; ctx.fillText("RAJADAMNERN",mty,gy-50);
        ctx.textAlign="left";
      }

    } else if (theme==="smog_cloud"||theme==="boss_storm") {
      // AQI hazard: thick layered haze + PM2.5 display
      P.smogHaze(ctx, D.parallaxX(-80,cam,0.12), gy-145, w+450, 0.30,[108,72,18]);
      P.smogHaze(ctx, D.parallaxX(-50,cam,0.18), gy-85,  w+370, 0.22,[85,55,10]);
      const pmx=D.parallaxX(440,cam,0.22);
      if (D.visible(pmx,65,cam,w)) {
        ctx.fillStyle="rgba(18,8,0,0.92)"; ctx.fillRect(pmx-32,gy-64,64,32);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 8px monospace"; ctx.textAlign="center";
        ctx.fillText("PM2.5",pmx,gy-52);
        ctx.fillStyle="#ff4136"; ctx.font="bold 12px monospace";
        ctx.fillText("308 μg",pmx,gy-36); ctx.textAlign="left";
      }
      // Bangkok is sinking warning
      const skx=D.parallaxX(280,cam,0.22);
      if (D.visible(skx,80,cam,w)) {
        ctx.fillStyle="rgba(8,22,50,0.88)"; ctx.fillRect(skx-38,gy-52,76,26);
        ctx.fillStyle="#f39c12"; ctx.font="bold 6px monospace"; ctx.textAlign="center";
        ctx.fillText("SEA LEVEL RISK",skx,gy-39);
        ctx.fillStyle="#e74c3c"; ctx.font="5px monospace"; ctx.fillText("-10cm / yr",skx,gy-29);
        ctx.textAlign="left";
      }

    } else if (theme==="flood_zone") {
      // Khlong flooding: water rising over road
      P.canalWater(ctx,D.parallaxX(-100,cam,0.24),D.parallaxX(w+420,cam,0.24),gy+8,t,
        {top:"rgba(6,22,55,0.62)",bot:"rgba(2,8,24,0.96)"});
      P.smogHaze(ctx,D.parallaxX(-70,cam,0.10),gy-135,w+400,0.14,[14,26,55]);
      // Sandbags
      for (let i=0;i<5;i++) {
        const sbx=D.parallaxX(140+i*280,cam,0.26);
        if (!D.visible(sbx,30,cam,w)) continue;
        ctx.fillStyle="#8a7050";
        for (let j=0;j<3;j++) ctx.fillRect(sbx+j*9-14,gy-8,9,8);
        for (let j=0;j<2;j++) ctx.fillRect(sbx+j*9-8,gy-16,9,8);
      }

    } else if (theme==="housing"||theme==="income") {
      // Khlong Toei informal settlement contrast: shacks vs. condo towers
      for (let i=0;i<4;i++) {
        const sx=D.parallaxX(60+i*330,cam,0.21);
        if (!D.visible(sx,40,cam,w)) continue;
        // Shack (corrugated low building)
        ctx.fillStyle="#6a5030"; ctx.fillRect(sx,gy-22,36,22);
        ctx.fillStyle="#7a5a28"; ctx.fillRect(sx,gy-24,36,4);
        // Makeshift roof lines
        ctx.strokeStyle="rgba(0,0,0,0.25)"; ctx.lineWidth=1;
        for (let r=0;r<4;r++) ctx.strokeRect(sx+r*9,gy-24,9,26);
      }
      // "CONDO" for sale sign
      const csx=D.parallaxX(640,cam,0.20);
      if (D.visible(csx,70,cam,w)) {
        ctx.fillStyle="#1a3050"; ctx.fillRect(csx-34,gy-70,68,28);
        ctx.fillStyle="#f4d03f"; ctx.font="bold 7px sans-serif"; ctx.textAlign="center";
        ctx.fillText("CONDO FROM",csx,gy-57);
        ctx.fillStyle="#fff"; ctx.font="bold 8px monospace"; ctx.fillText("฿ 5.8M",csx,gy-46);
        ctx.textAlign="left";
      }

    } else if (theme==="work"||theme==="commute_pulse") {
      // Factory district: smokestacks, packed expressway
      for (let i=0;i<3;i++) {
        const fx=D.parallaxX(180+i*430,cam,0.16);
        if (!D.visible(fx,20,cam,w)) continue;
        ctx.fillStyle="#5a4a30"; ctx.fillRect(fx-4,gy-70,8,70);
        for (let s=0;s<4;s++) {
          ctx.save(); ctx.globalAlpha=0.20+s*0.04;
          ctx.fillStyle="#7a6438";
          ctx.beginPath(); ctx.arc(fx,gy-70-(s*12),7+s*3,0,Math.PI*2); ctx.fill();
          ctx.restore();
        }
      }
      // Average commute display
      const cdx=D.parallaxX(500,cam,0.22);
      if (D.visible(cdx,80,cam,w)) {
        ctx.fillStyle="rgba(10,8,18,0.90)"; ctx.fillRect(cdx-38,gy-58,76,28);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 7px monospace"; ctx.textAlign="center";
        ctx.fillText("AVG COMMUTE",cdx,gy-47);
        ctx.fillStyle="#f39c12"; ctx.font="bold 9px monospace"; ctx.fillText("73 MIN",cdx,gy-34);
        ctx.textAlign="left";
      }

    } else if (theme==="learning"||theme==="book_stack") {
      // Chulalongkorn University gate
      const cux=D.parallaxX(w*0.42,cam,0.20);
      if (D.visible(cux,100,cam,w)) {
        ctx.fillStyle="#c8a840"; // gold
        ctx.fillRect(cux-50,gy-80,22,80); ctx.fillRect(cux+28,gy-80,22,80);
        ctx.beginPath(); ctx.arc(cux-7,gy-80,36,Math.PI,0); ctx.fill();
        ctx.fillStyle="rgba(0,0,0,0.45)";
        ctx.beginPath(); ctx.arc(cux-7,gy-80,24,Math.PI,0); ctx.fill();
        ctx.fillRect(cux-24,gy-80,35,80);
        ctx.fillStyle="#f4d03f"; ctx.font="6px sans-serif"; ctx.textAlign="center";
        ctx.fillText("CHULALONGKORN",cux-7,gy-88); ctx.textAlign="left";
      }

    } else if (theme==="civic"||theme==="ballot_wave") {
      // Thai democracy struggle: protest signage
      for (let i=0;i<3;i++) {
        const px2=D.parallaxX(200+i*400,cam,0.22);
        if (!D.visible(px2,50,cam,w)) continue;
        ctx.fillStyle="rgba(15,8,3,0.82)"; ctx.fillRect(px2-22,gy-62,44,24);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 7px monospace"; ctx.textAlign="center";
        ctx.fillText("DEMOCRACY",px2,gy-50);
        ctx.fillStyle="#f4d03f"; ctx.font="6px monospace"; ctx.fillText("NOW",px2,gy-40);
        ctx.textAlign="left";
      }

    } else if (theme==="sector"||theme==="institution_gate") {
      // Military tanks silhouette (2014 coup reference)
      for (let i=0;i<2;i++) {
        const tnx=D.parallaxX(280+i*520,cam,0.26);
        if (!D.visible(tnx,55,cam,w)) continue;
        ctx.fillStyle="#4a5840"; ctx.fillRect(tnx-26,gy-18,52,16);
        ctx.fillStyle="#3a4830"; ctx.fillRect(tnx-18,gy-28,36,12);
        ctx.fillRect(tnx+16,gy-24,24,4); // barrel
        ctx.fillStyle="#1a252f";
        ctx.beginPath(); ctx.arc(tnx-18,gy-2,8,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(tnx+18,gy-2,8,0,Math.PI*2); ctx.fill();
      }

    } else if (theme==="health"||theme==="pulse_zone") {
      // Bumrungrad hospital (world's busiest private)
      const bhx=D.parallaxX(w*0.38,cam,0.19);
      if (D.visible(bhx,80,cam,w)) {
        ctx.fillStyle="#d8e4e8"; ctx.fillRect(bhx-38,gy-88,76,88);
        ctx.fillStyle="#2980b9"; ctx.fillRect(bhx-34,gy-78,10,58); ctx.fillRect(bhx+24,gy-78,10,58);
        ctx.fillRect(bhx-34,gy-44,68,10);
        ctx.fillStyle="#e74c3c";
        ctx.fillRect(bhx-14,gy-64,6,30); ctx.fillRect(bhx-21,gy-51,20,6);
        const bk=Math.sin(t*3)>0;
        ctx.fillStyle=bk?"rgba(231,76,60,0.75)":"rgba(231,76,60,0.20)";
        ctx.beginPath(); ctx.arc(bhx,gy-96,7,0,Math.PI*2); ctx.fill();
      }

    } else if (theme==="safety"||theme==="car_swarm") {
      // Road fatality scene: overturned tuk-tuk + police tape
      const rtx=D.parallaxX(450,cam,0.27);
      if (D.visible(rtx,100,cam,w)) {
        ctx.save(); ctx.translate(rtx+20,gy-12); ctx.rotate(0.35);
        ctx.fillStyle="#f39c12"; ctx.fillRect(-12,-8,24,14);
        ctx.restore();
        ctx.strokeStyle="#f39c12"; ctx.lineWidth=2.5; ctx.setLineDash([8,5]);
        ctx.beginPath(); ctx.moveTo(rtx-30,gy-5); ctx.lineTo(rtx+80,gy-5); ctx.stroke();
        ctx.setLineDash([]);
      }

    } else if (theme==="mobility"||theme==="boss_lagos") {
      // World-class gridlock: cars backed up everywhere
      for (let i=0;i<12;i++) {
        const cx=D.parallaxX(20+i*145,cam,0.28);
        if (!D.visible(cx,52,cam,w)) continue;
        smallCar(ctx,cx,gy,i%2?1:-1,i*8,t,["#9b59b6","#c0392b","#7f8c8d","#2980b9","#1abc9c"][i%5]);
      }
    }

    groundLine(ctx, cam, w, gy, "rgba(155,89,182,0.38)");
    if (D.particles) D.particles.paint(ctx, city.id, cam, w, h, t);
    if (D.foreground) D.foreground.paint(ctx, city, cam, w, h, gy, t);
    A.finish(ctx, w, h, {vignette:0.28});
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  NEW DELHI
  // ═══════════════════════════════════════════════════════════════════════════
  function paintNewDelhi(ctx, city, cam, w, h, gy, t, stage) {
    const theme = stage ? stage.hazardTheme : null;

    const sky =
      theme==="smog_cloud"||theme==="boss_storm"   ? ["#0c0500","#220b00","#4a2000"] :
      theme==="env"||theme==="wind_turbine"         ? ["#1a4f6c","#2e86ab","#a8d8e8"] :
      theme==="arts"||theme==="stage_hazard"        ? ["#28004a","#680a80","#c03800"] :
      theme==="flood_zone"                          ? ["#060a12","#10182a","#203848"] :
      theme==="civic"||theme==="ballot_wave"        ? ["#4a1c00","#a04200","#f0a040"] :
      theme==="learning"||theme==="book_stack"      ? ["#0e1420","#1c2838","#364860"] :
      theme==="work"||theme==="commute_pulse"       ? ["#100e08","#20180e","#3a2c18"] :
      theme==="health"||theme==="pulse_zone"        ? ["#081016","#10202e","#1c3c52"] :
      theme==="sector"||theme==="institution_gate"  ? ["#0c1018","#18202e","#2c3a4e"] :
      theme==="income"||theme==="tax_slider"        ? ["#100808","#201010","#3a1818"] :
      theme==="mobility"||theme==="car_swarm"       ? ["#080608","#100e14","#201828"] :
      theme==="safety"||theme==="patrol_hard"       ? ["#0a0808","#181010","#2c1818"] :
      theme==="housing"                             ? ["#0e0c08","#1c1808","#362e18"] :
      SKY.newdelhi.palette;

    A.paintSky(ctx, w, h, gy, sky, t);

    // Sun for env/clear day, stars for night themes
    if (theme==="env"||theme==="wind_turbine") {
      const sx=D.parallaxX(w*0.72,cam,0.04);
      ctx.save();
      const sg=ctx.createRadialGradient(sx,h*0.15,0,sx,h*0.15,65);
      sg.addColorStop(0,"rgba(255,230,160,0.95)"); sg.addColorStop(1,"rgba(255,230,160,0)");
      ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(sx,h*0.15,65,0,Math.PI*2); ctx.fill();
      ctx.restore();
      A.paintBirds(ctx,cam,w,gy,t,[{x:0.35,y:0.28,n:7}]);
    } else if (theme && theme!=="arts"&&theme!=="stage_hazard"&&theme!=="civic"&&theme!=="ballot_wave") {
      P.starField(ctx,w,h,929,t);
    }

    A.paintClouds(ctx, cam, w, gy, t,
      theme==="smog_cloud"||theme==="boss_storm" ? [] :
      theme==="flood_zone" ? [{par:0.04,y:38,density:11,alpha:0.85}] :
      [{par:0.04,y:60,density:4,alpha:0.22}]);

    // ── FAR BUILDING ROWS (colonial + brick + shanty + highrise mix) ──────────
    B.row(ctx,-200,w+1050,gy+40,cam,0.05,121,["colonial","brick","artdeco"],  34,82,t);
    B.row(ctx,-200,w+1050,gy+18,cam,0.11,424,["brick","shanty","warehouse"],  52,132,t);
    B.row(ctx,-200,w+1050,gy,    cam,0.17,929,["brick","highrise","shanty"],  72,192,t);

    // ── RED FORT — Mughal sandstone ramparts ──────────────────────────────────
    const rfx = D.parallaxX(w*0.60+60, cam, 0.13);
    if (D.visible(rfx, 180, cam, w)) {
      // Main rampart wall
      ctx.fillStyle="#a84030"; // red sandstone
      ctx.fillRect(rfx-88,gy-62,176,62);
      // Merlons (battlements)
      for (let i=0;i<18;i++) {
        const mx=rfx-88+i*10;
        ctx.fillStyle=i%2===0?"#b84838":"#a03828";
        ctx.fillRect(mx,gy-72,8,12);
      }
      // Lahori Gate arch (central main entrance)
      ctx.fillStyle="#902820";
      ctx.fillRect(rfx-18,gy-62,36,62);
      ctx.fillStyle="#780a10";
      ctx.beginPath(); ctx.arc(rfx,gy-62,18,Math.PI,0); ctx.fill();
      // Tower bastions on each side
      ctx.fillStyle="#9a3828";
      ctx.fillRect(rfx-96,gy-80,16,80); ctx.fillRect(rfx+80,gy-80,16,80);
      // Chhatris (small domed pavilions) on bastions
      ctx.fillStyle="#c05040";
      ctx.beginPath(); ctx.arc(rfx-88,gy-82,10,Math.PI,0); ctx.fill();
      ctx.beginPath(); ctx.arc(rfx+88,gy-82,10,Math.PI,0); ctx.fill();
      // Onion dome finials
      ctx.fillStyle="#d06050";
      ctx.beginPath(); ctx.arc(rfx-88,gy-94,5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(rfx+88,gy-94,5,0,Math.PI*2); ctx.fill();
    }

    // ── QUTUB MINAR — tapering round sandstone tower ─────────────────────────
    const qmx = D.parallaxX(w*0.28, cam, 0.17);
    if (D.visible(qmx, 50, cam, w)) {
      // Tower (5 storeys, tapers)
      for (let s=0;s<5;s++) {
        const sw=(20-s*3); const sh=20+s*2;
        ctx.fillStyle=s%2===0?"#c87848":"#b06038";
        ctx.fillRect(qmx-sw,gy-sh*(s+1),sw*2,sh+2);
        // Balcony ring
        ctx.fillStyle="#d08850";
        ctx.fillRect(qmx-(sw+3),gy-sh*(s+1),sw*2+6,4);
      }
      // Star pattern base
      ctx.fillStyle="#a05030"; ctx.fillRect(qmx-22,gy-8,44,8);
      // Top finial
      ctx.beginPath(); ctx.moveTo(qmx,gy-108); ctx.lineTo(qmx-5,gy-96); ctx.lineTo(qmx+5,gy-96); ctx.closePath();
      ctx.fillStyle="#e0b060"; ctx.fill();
    }

    // ── LOTUS TEMPLE ─────────────────────────────────────────────────────────
    const ltx = D.parallaxX(w*0.44+70, cam, 0.14);
    if (D.visible(ltx, 110, cam, w)) B.landmarkLotus(ctx, ltx, gy+12, 1.05);

    // ── DELHI METRO PILLARS ───────────────────────────────────────────────────
    {
      const mpx=D.parallaxX(-60,cam,0.18);
      ctx.fillStyle="#a0b0c0";
      ctx.fillRect(mpx,gy-52,w+300,8); // viaduct deck
      for (let i=0;i<12;i++) {
        ctx.fillStyle=i%2===0?"#90a0b0":"#a0b0c0";
        ctx.fillRect(mpx+i*115,gy-52,10,52);
      }
      // Metro train (animated)
      const mt=(((t*1.0)%(w+300)));
      ctx.fillStyle="#3498db"; ctx.fillRect(mpx+mt,gy-66,90,18);
      ctx.fillStyle="rgba(200,230,255,0.55)";
      for (let c=0;c<5;c++) ctx.fillRect(mpx+mt+4+c*16,gy-64,12,10);
      ctx.fillStyle="#2980b9"; ctx.font="bold 5px monospace"; ctx.fillText("DMRC",mpx+mt+36,gy-52);
    }

    // ── POWER GRID (tangle of wires) ──────────────────────────────────────────
    A.paintPowerGrid(ctx, cam, w, gy, t);

    // ── STREET LEVEL ──────────────────────────────────────────────────────────
    for (let i=0;i<5;i++) {
      const fx=D.parallaxX(120+i*280,cam,0.28);
      if (!D.visible(fx,30,cam,w)) continue;
      lampPost(ctx, fx, gy, "rgba(255,190,80,0.22)", t);
      if (i%3===0) streetTree(ctx, fx+38, gy, 0.52, 2, t);
    }
    // Street cows (distinctly Indian)
    for (let i=0;i<3;i++) {
      const cowX=D.parallaxX(380+i*520,cam,0.27);
      if (!D.visible(cowX,30,cam,w)) continue;
      ctx.fillStyle="#d5c8a8";
      ctx.fillRect(cowX,gy-14,30,10); ctx.fillRect(cowX+24,gy-20,8,6);
      ctx.fillRect(cowX+2,gy-4,5,14); ctx.fillRect(cowX+18,gy-4,5,14);
      // Hump
      ctx.beginPath(); ctx.arc(cowX+10,gy-14,8,Math.PI,0); ctx.fill();
    }
    // E-rickshaws (green, last-mile)
    for (let i=0;i<2;i++) {
      const rkx=D.parallaxX(560+i*600,cam,0.27);
      if (!D.visible(rkx,30,cam,w)) continue;
      ctx.fillStyle="#27ae60"; ctx.fillRect(rkx,gy-22,30,16);
      ctx.fillStyle="#e74c3c"; ctx.fillRect(rkx-2,gy-24,34,4);
      ctx.fillStyle="#f1c40f"; ctx.font="5px monospace"; ctx.fillText("E-RICK",rkx+2,gy-10);
      ctx.fillStyle="#1a252f";
      ctx.beginPath(); ctx.arc(rkx+7,gy,6,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(rkx+22,gy,6,0,Math.PI*2); ctx.fill();
    }
    // Pedestrians
    for (let i=0;i<6;i++) {
      const px=D.parallaxX(160+i*300,cam,0.29);
      if (D.visible(px,16,cam,w)) pedestrian(ctx,px,gy,i%2?1:-1,t,i*1.7,"rgba(80,50,20,0.68)");
    }

    // Always-present smog layer (Delhi has worst AQI on earth)
    const ndSmog=theme==="smog_cloud"||theme==="boss_storm" ? 0.58
      : theme==="env"||theme==="wind_turbine" ? 0.03
      : SKY.newdelhi.smog.alpha;
    P.smogHaze(ctx, D.parallaxX(-90,cam,0.09), gy-210, w+500, ndSmog, SKY.newdelhi.smog.tint);

    // ── THEME OVERLAYS ────────────────────────────────────────────────────────
    if (theme==="smog_cloud"||theme==="boss_storm") {
      // SEVERE air quality: multiple haze bands + AQI 999 display
      P.smogHaze(ctx,D.parallaxX(-60,cam,0.13),gy-135,w+420,0.38,[72,48,20]);
      P.smogHaze(ctx,D.parallaxX(-40,cam,0.20),gy-80, w+350,0.28,[55,38,14]);
      const pmx=D.parallaxX(430,cam,0.22);
      if (D.visible(pmx,72,cam,w)) {
        ctx.fillStyle="rgba(16,6,0,0.94)"; ctx.fillRect(pmx-36,gy-68,72,38);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 7px monospace"; ctx.textAlign="center";
        ctx.fillText("PM2.5 AQI",pmx,gy-57);
        ctx.fillStyle="#ff1a00"; ctx.font="bold 14px monospace"; ctx.fillText("999+",pmx,gy-38);
        ctx.fillStyle="#f39c12"; ctx.font="5px monospace"; ctx.fillText("HAZARDOUS",pmx,gy-27);
        ctx.textAlign="left";
      }
      // Stubble burning smoke columns (seasonal)
      for (let i=0;i<4;i++) {
        const stx=D.parallaxX(100+i*380,cam,0.10);
        if (!D.visible(stx,20,cam,w)) continue;
        for (let s=0;s<6;s++) {
          ctx.save(); ctx.globalAlpha=0.18-s*0.02;
          ctx.fillStyle="#5a3a18";
          ctx.beginPath(); ctx.arc(stx+(s*5-10),gy-120-(s*18),12+s*5,0,Math.PI*2); ctx.fill();
          ctx.restore();
        }
      }

    } else if (theme==="arts"||theme==="stage_hazard") {
      // Diwali: concentric coloured halos + sparkle dots
      const hc=["#e74c3c","#f39c12","#9b59b6","#2ecc71","#3498db","#e91e63","#f4d03f"];
      for (let i=0;i<10;i++) {
        const hx=D.parallaxX(44+i*198,cam,0.18+(i%2)*0.03);
        if (!D.visible(hx,35,cam,w)) continue;
        ctx.save(); ctx.globalAlpha=0.28+Math.sin(t*0.05+i*1.2)*0.20;
        ctx.fillStyle=hc[i%hc.length];
        ctx.beginPath(); ctx.arc(hx, gy-62-(i%3)*38, 20+(i%3)*6, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
      // Festival lanterns rising
      for (let i=0;i<5;i++) {
        const ly=((t*0.5+i*62)%(gy+80))-15;
        const lx=D.parallaxX(150+i*320,cam,0.20);
        if (!D.visible(lx,20,cam,w)) continue;
        ctx.save(); ctx.globalAlpha=0.65;
        ctx.fillStyle=["#f39c12","#e74c3c","#f4d03f","#e91e63","#9b59b6"][i];
        ctx.beginPath(); ctx.ellipse(lx,ly,10,14,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="rgba(255,255,255,0.6)"; ctx.beginPath(); ctx.arc(lx-3,ly-5,3,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }

    } else if (theme==="civic"||theme==="ballot_wave") {
      // India Gate arch (Lutyens Delhi)
      const gax=D.parallaxX(w*0.46,cam,0.14);
      if (D.visible(gax,70,cam,w)) {
        ctx.fillStyle="#c8a060"; // sandstone
        ctx.fillRect(gax-30,gy-118,14,118); ctx.fillRect(gax+16,gy-118,14,118);
        ctx.beginPath(); ctx.arc(gax-8,gy-118,30,Math.PI,0); ctx.fill();
        ctx.fillRect(gax-36,gy-138,72,22);
        ctx.fillRect(gax-10,gy-158,22,22);
        ctx.fillStyle="#b89048"; ctx.font="5px monospace"; ctx.textAlign="center";
        ctx.fillText("INDIA GATE",gax-8,gy-126); ctx.textAlign="left";
      }
      // Tricolour flag
      const flgx=D.parallaxX(560,cam,0.23);
      if (D.visible(flgx,70,cam,w)) {
        ctx.fillStyle="#8a8a8a"; ctx.fillRect(flgx-2,gy-108,4,108);
        ctx.fillStyle="#ff9933"; ctx.fillRect(flgx+2,gy-108,52,11);
        ctx.fillStyle="#fff"; ctx.fillRect(flgx+2,gy-97,52,11);
        ctx.fillStyle="#138808"; ctx.fillRect(flgx+2,gy-86,52,11);
        // Ashoka Chakra dot
        ctx.fillStyle="#000088"; ctx.beginPath(); ctx.arc(flgx+28,gy-92,5,0,Math.PI*2); ctx.fill();
      }

    } else if (theme==="learning"||theme==="book_stack") {
      // IIT Delhi gate + sprawling campus
      const itx=D.parallaxX(w*0.42,cam,0.20);
      if (D.visible(itx,110,cam,w)) {
        ctx.fillStyle="#d4b870"; // yellow sandstone
        ctx.fillRect(itx-52,gy-80,22,80); ctx.fillRect(itx+30,gy-80,22,80);
        ctx.beginPath(); ctx.arc(itx-9,gy-80,42,Math.PI,0); ctx.fill();
        ctx.fillStyle="rgba(0,0,0,0.42)";
        ctx.beginPath(); ctx.arc(itx-9,gy-80,28,Math.PI,0); ctx.fill();
        ctx.fillRect(itx-28,gy-80,38,80);
        ctx.fillStyle="#b09040"; ctx.font="5px sans-serif"; ctx.textAlign="center";
        ctx.fillText("IIT DELHI",itx-9,gy-88); ctx.textAlign="left";
      }

    } else if (theme==="work"||theme==="commute_pulse") {
      // Gurgaon glass offices
      for (let i=0;i<4;i++) {
        const gx=D.parallaxX(80+i*290,cam,0.18);
        if (!D.visible(gx,46,cam,w)) continue;
        detailBuilding(ctx,gx,gy,42,110+i*24,"#4a6070","#2c3e50",900+i,0.55,t);
        ctx.save(); ctx.globalAlpha=0.18;
        ctx.fillStyle="#7fb3c8";
        for (let j=0;j<6;j++) ctx.fillRect(gx+2,gy-(110+i*24)+j*18,38,2);
        ctx.restore();
      }
      // Commute sign
      const csx=D.parallaxX(520,cam,0.22);
      if (D.visible(csx,80,cam,w)) {
        ctx.fillStyle="rgba(10,8,4,0.90)"; ctx.fillRect(csx-38,gy-58,76,28);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 6px monospace"; ctx.textAlign="center";
        ctx.fillText("AVG COMMUTE",csx,gy-47);
        ctx.fillStyle="#f39c12"; ctx.font="bold 10px monospace"; ctx.fillText("71 MIN",csx,gy-33);
        ctx.textAlign="left";
      }

    } else if (theme==="health"||theme==="pulse_zone") {
      // AIIMS overflow: large hospital, crowded pavement outside
      const aix=D.parallaxX(w*0.38,cam,0.19);
      if (D.visible(aix,88,cam,w)) {
        ctx.fillStyle="#c8d8d8"; ctx.fillRect(aix-42,gy-92,84,92);
        ctx.fillStyle="#e74c3c";
        ctx.fillRect(aix-20,gy-78,8,52); ctx.fillRect(aix+12,gy-78,8,52);
        ctx.fillRect(aix-20,gy-56,40,8);
        ctx.fillStyle="#2980b9"; ctx.fillRect(aix-36,gy-60,14,14); ctx.fillRect(aix+22,gy-60,14,14);
        ctx.fillStyle="#fff"; ctx.font="bold 6px sans-serif"; ctx.textAlign="center";
        ctx.fillText("AIIMS",aix,gy-98); ctx.textAlign="left";
        // Queue of patients
        for (let i=0;i<5;i++) pedestrian(ctx,aix-50+i*22,gy,1,t,i*0.5,"rgba(60,40,20,0.65)");
      }

    } else if (theme==="sector"||theme==="institution_gate") {
      // Parliament / Raisina Hill buildings
      const plx=D.parallaxX(w*0.44,cam,0.15);
      if (D.visible(plx,120,cam,w)) {
        ctx.fillStyle="#c8b890"; ctx.fillRect(plx-58,gy-72,116,72);
        // Colonnade
        for (let i=0;i<9;i++) ctx.fillRect(plx-52+i*12,gy-62,8,62);
        ctx.fillStyle="#d0c0a0"; ctx.fillRect(plx-62,gy-78,124,8);
        // Dome
        ctx.beginPath(); ctx.arc(plx,gy-72,30,Math.PI,0);
        ctx.fillStyle="#b8a880"; ctx.fill();
        ctx.fillStyle="#c8b890"; ctx.fillRect(plx-28,gy-72,56,72);
        ctx.fillStyle="#888"; ctx.font="5px monospace"; ctx.textAlign="center";
        ctx.fillText("SANSAD BHAVAN",plx,gy-82); ctx.textAlign="left";
      }

    } else if (theme==="income"||theme==="tax_slider") {
      // Extreme inequality: Lutyens bungalow next to jhuggi
      const ibx=D.parallaxX(w*0.36,cam,0.21);
      if (D.visible(ibx,120,cam,w)) {
        // Luxury bungalow
        ctx.fillStyle="#d4c8a0"; ctx.fillRect(ibx-50,gy-38,50,38);
        ctx.fillStyle="#c8a070"; ctx.fillRect(ibx-54,gy-42,58,6);
        // Jhuggi (shack) next door
        ctx.fillStyle="#7a5028"; ctx.fillRect(ibx+8,gy-20,30,20);
        ctx.fillStyle="#5a3818"; ctx.fillRect(ibx+6,gy-22,34,4);
        // Income sign
        ctx.fillStyle="rgba(50,10,10,0.88)"; ctx.fillRect(ibx-30,gy-68,70,22);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 6px monospace"; ctx.textAlign="center";
        ctx.fillText("TOP 10% vs",ibx+5,gy-58);
        ctx.fillStyle="#f39c12"; ctx.font="5px monospace"; ctx.fillText("₹5L vs ₹3k/mo",ibx+5,gy-48);
        ctx.textAlign="left";
      }

    } else if (theme==="mobility"||theme==="car_swarm") {
      // 12 million vehicles: gridlock
      for (let i=0;i<12;i++) {
        const cx=D.parallaxX(20+i*145,cam,0.28);
        if (!D.visible(cx,52,cam,w)) continue;
        smallCar(ctx,cx,gy,i%2?1:-1,i*9,t,["#e67e22","#c0392b","#8e44ad","#2980b9","#27ae60"][i%5]);
      }
      // Odd-even sign
      const oex=D.parallaxX(560,cam,0.22);
      if (D.visible(oex,80,cam,w)) {
        ctx.fillStyle="rgba(8,5,2,0.90)"; ctx.fillRect(oex-38,gy-56,76,26);
        ctx.fillStyle="#f39c12"; ctx.font="bold 7px monospace"; ctx.textAlign="center";
        ctx.fillText("ODD-EVEN",oex,gy-45);
        ctx.fillStyle="#95a5a6"; ctx.font="6px monospace"; ctx.fillText("-3% pollution",oex,gy-34);
        ctx.textAlign="left";
      }

    } else if (theme==="safety"||theme==="patrol_hard") {
      // Police barricade + watchtower
      const barx=D.parallaxX(440,cam,0.23);
      if (D.visible(barx,120,cam,w)) {
        ctx.fillStyle="#2c3e50"; ctx.fillRect(barx,gy-6,100,6);
        for (let i=0;i<5;i++) {
          ctx.fillStyle=i%2===0?"#c0392b":"#ecf0f1";
          ctx.fillRect(barx+i*20,gy-12,14,6);
        }
        // Watchtower
        ctx.fillStyle="#34495e"; ctx.fillRect(barx+120,gy-48,14,48);
        ctx.fillStyle="#2c3e50"; ctx.fillRect(barx+114,gy-56,26,10);
        const fl=Math.floor(t*5)%2;
        ctx.fillStyle=fl?"#e74c3c":"rgba(231,76,60,0.20)";
        ctx.beginPath(); ctx.arc(barx+127,gy-52,5,0,Math.PI*2); ctx.fill();
      }

    } else if (theme==="housing"||theme==="flood_zone") {
      // Yamuna flooding: water rising over slums
      P.canalWater(ctx,D.parallaxX(-90,cam,0.24),D.parallaxX(w+400,cam,0.24),gy+6,t,
        {top:"rgba(8,24,55,0.62)",bot:"rgba(3,8,22,0.96)"});
      P.smogHaze(ctx,D.parallaxX(-70,cam,0.10),gy-140,w+400,0.14,[16,26,50]);
      // Jhuggi cluster silhouettes rising from flood
      for (let i=0;i<5;i++) {
        const jx=D.parallaxX(80+i*290,cam,0.26);
        if (!D.visible(jx,30,cam,w)) continue;
        ctx.fillStyle="#5a3818"; ctx.fillRect(jx,gy-18,26,18);
        ctx.fillStyle="#4a2c0e"; ctx.fillRect(jx-2,gy-20,30,4);
      }
    }

    groundLine(ctx, cam, w, gy, "rgba(211,84,0,0.38)");
    if (D.particles) D.particles.paint(ctx, city.id, cam, w, h, t);
    if (D.foreground) D.foreground.paint(ctx, city, cam, w, h, gy, t);
    A.finish(ctx, w, h, {smog:{x:0,y:gy-160,w,alpha:ndSmog*0.42,tint:SKY.newdelhi.smog.tint}, vignette:0.25});
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  LAGOS
  // ═══════════════════════════════════════════════════════════════════════════
  function paintLagos(ctx, city, cam, w, h, gy, t, stage) {
    const theme = stage ? stage.hazardTheme : null;

    // ── SKY ──────────────────────────────────────────────────────────────────
    const sky =
      theme==="stage_hazard"||theme==="arts"         ? ["#020008","#060018","#200030"] :
      theme==="commute_pulse"||theme==="work"        ? ["#100e08","#241a08","#3e2e10"] :
      theme==="ballot_wave"||theme==="civic"         ? ["#0c0a04","#201808","#382e14"] :
      theme==="book_stack"||theme==="learning"       ? ["#080c14","#141e2c","#243448"] :
      theme==="tax_slider"||theme==="income"         ? ["#0c0404","#200808","#3c1010"] :
      theme==="institution_gate"||theme==="sector"   ? ["#060610","#0e0e20","#1a1a34"] :
      theme==="pulse_zone"||theme==="health"         ? ["#060a0e","#101a24","#1e3040"] :
      theme==="flood_zone"||theme==="housing"        ? ["#040810","#0c1628","#182440"] :
      theme==="smog_cloud"||theme==="env"            ? ["#1c1000","#3c2000","#5e3600"] :
      theme==="patrol_hard"||theme==="safety"        ? ["#08040a","#140a12","#260c16"] :
      theme==="boss_lagos"                            ? ["#0c0000","#1e0000","#3c0600"] :
      SKY.lagos.palette;

    A.paintSky(ctx, w, h, gy, sky, t);

    // Stars for night/dark themes
    if (theme==="stage_hazard"||theme==="arts"||theme==="boss_lagos"||
        theme==="patrol_hard"||theme==="safety"||!theme) {
      P.starField(ctx, w, h, SKY.lagos.starSeed || 232, t);
    }
    // Moon for quiet null/hub state
    if (!theme) {
      P.moonDisc(ctx, D.parallaxX(w*0.82,cam,0.04), h*0.12, 22);
    }

    // Smog glow in upper sky for burning themes
    if (theme==="smog_cloud"||theme==="env") {
      ctx.save(); ctx.globalAlpha=0.25;
      const sgG=ctx.createRadialGradient(D.parallaxX(w*0.50,cam,0.03),gy-90,0,D.parallaxX(w*0.50,cam,0.03),gy-90,200);
      sgG.addColorStop(0,"rgba(200,90,0,1)"); sgG.addColorStop(1,"rgba(200,90,0,0)");
      ctx.fillStyle=sgG; ctx.beginPath(); ctx.arc(D.parallaxX(w*0.50,cam,0.03),gy-90,200,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
    // Protest fire glow
    if (theme==="ballot_wave"||theme==="civic") {
      ctx.save(); ctx.globalAlpha=0.16;
      const pgG=ctx.createRadialGradient(D.parallaxX(w*0.38,cam,0.03),gy-60,0,D.parallaxX(w*0.38,cam,0.03),gy-60,180);
      pgG.addColorStop(0,"rgba(255,100,0,1)"); pgG.addColorStop(1,"rgba(255,100,0,0)");
      ctx.fillStyle=pgG; ctx.beginPath(); ctx.arc(D.parallaxX(w*0.38,cam,0.03),gy-60,180,0,Math.PI*2); ctx.fill();
      ctx.restore();
    }
    // Boss: hellish red glow
    if (theme==="boss_lagos") {
      ctx.save(); ctx.globalAlpha=0.18;
      ctx.fillStyle="#600000";
      ctx.fillRect(0,0,w,h);
      ctx.restore();
    }

    A.paintClouds(ctx, cam, w, gy, t,
      theme==="smog_cloud"||theme==="env"     ? [{par:0.04,y:42,density:11,alpha:0.72}] :
      theme==="flood_zone"||theme==="housing" ? [{par:0.03,y:36,density:13,alpha:0.90}] :
      theme==="boss_lagos"                     ? [{par:0.05,y:50,density:9,alpha:0.58}] :
      SKY.lagos.clouds);

    // ── FAR SILHOUETTES — Victoria Island / Ikoyi skyline ─────────────────
    B.row(ctx, -200, w+1020, gy+30, cam, 0.05, 232, ["shanty","warehouse","brick"],  28,  72, t);
    B.row(ctx, -200, w+1020, gy+12, cam, 0.09, 535, ["shanty","brick","highrise"],   44, 120, t);
    B.row(ctx, -200, w+1020, gy-2,  cam, 0.14, 838, ["highrise","glass","brick"],     58, 162, t);

    // ── THIRD MAINLAND BRIDGE — iconic silhouette across the lagoon ───────
    {
      const bmx = D.parallaxX(-80, cam, 0.06);
      ctx.save(); ctx.globalAlpha=0.26;
      // Long bridge deck
      ctx.fillStyle="#303d4c";
      ctx.fillRect(bmx, gy+28, w+1100, 9);
      // Guard rail line
      ctx.fillStyle="#404e5e"; ctx.fillRect(bmx, gy+26, w+1100, 3);
      // Piers (every 200px, dropping into water)
      ctx.fillStyle="#283240";
      for (let pi=0; pi<9; pi++) {
        const px=bmx+60+pi*210;
        ctx.fillRect(px-6, gy+37, 12, 36);
        ctx.fillRect(px-11, gy+30, 22, 7); // cap
      }
      ctx.restore();
    }

    // ── EKO ATLANTIC — half-built luxury towers on reclaimed land ─────────
    {
      const eax = D.parallaxX(w*0.80, cam, 0.11);
      if (D.visible(eax, 80, cam, w)) {
        for (let ei=0; ei<3; ei++) {
          const etx=eax+ei*46, etH=88+ei*32;
          const etG=ctx.createLinearGradient(etx,gy-etH,etx+30,gy);
          etG.addColorStop(0,"#354558"); etG.addColorStop(1,"#1c2938");
          ctx.fillStyle=etG; ctx.fillRect(etx,gy-etH,30,etH);
          // Construction rebar top
          ctx.strokeStyle="#7a6840"; ctx.lineWidth=2;
          for (let r=0;r<5;r++) {
            ctx.beginPath();
            ctx.moveTo(etx+3+r*5,gy-etH);
            ctx.lineTo(etx+3+r*5,gy-etH-12-(r%2)*4);
            ctx.stroke();
          }
          // Windows (sparse lit)
          ctx.fillStyle="rgba(255,190,70,0.28)";
          for (let wr=0;wr<Math.floor(etH/22);wr++) {
            for (let wc=0;wc<2;wc++) {
              if ((ei+wr+wc)%3!==0) continue;
              ctx.fillRect(etx+5+wc*12,gy-etH+10+wr*22,8,10);
            }
          }
        }
      }
    }

    // ── VICTORIA ISLAND GLASS TOWERS (5 towers, mid-parallax) ────────────
    for (let vi=0; vi<5; vi++) {
      const vtx=D.parallaxX(w*0.14+vi*220, cam, 0.13+vi*0.012);
      if (!D.visible(vtx, 60, cam, w)) continue;
      const vtH=98+vi*26;
      const vlitC=(theme==="commute_pulse"||theme==="work")?0.72:
                  (theme==="boss_lagos")?0.88:0.30;
      detailBuilding(ctx, vtx, gy+4, 52, vtH, "#283848", "#182838", 510+vi, vlitC, t);
      ctx.save(); ctx.globalAlpha=0.07;
      ctx.fillStyle="#5a9ac8"; ctx.fillRect(vtx-25,gy-vtH,50,vtH);
      ctx.restore();
    }

    // ── MAKOKO STILT COMMUNITY ────────────────────────────────────────────
    {
      const mkx=D.parallaxX(w*0.27, cam, 0.17);
      if (D.visible(mkx, 140, cam, w)) {
        for (let mi=0; mi<7; mi++) {
          const mhx=mkx+mi*44, mhH=30+(mi%3)*10;
          // Stilt legs
          ctx.strokeStyle="rgba(100,68,28,0.72)"; ctx.lineWidth=2;
          ctx.beginPath(); ctx.moveTo(mhx+5,gy+20); ctx.lineTo(mhx+5,gy+50); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(mhx+23,gy+20); ctx.lineTo(mhx+23,gy+50); ctx.stroke();
          // Hut walls
          ctx.fillStyle=(mi%2===0)?"#7c4c30":"#6a4020";
          ctx.fillRect(mhx, gy+20-mhH, 30, mhH);
          // Corrugated tin roof (irregular)
          const roofC=(mi%3===0)?"#7a7268":(mi%3===1)?"#a07038":"#685030";
          ctx.fillStyle=roofC;
          ctx.beginPath();
          ctx.moveTo(mhx-4, gy+20-mhH);
          ctx.lineTo(mhx+15, gy+10-mhH);
          ctx.lineTo(mhx+34, gy+20-mhH);
          ctx.closePath(); ctx.fill();
          // Window glow
          ctx.fillStyle="rgba(255,160,50,0.28)";
          ctx.fillRect(mhx+7, gy+20-mhH+8, 10, 8);
          // Rope/clothesline between huts
          if (mi>0) {
            ctx.save(); ctx.globalAlpha=0.38;
            ctx.strokeStyle="#8a7060"; ctx.lineWidth=1;
            ctx.beginPath();
            ctx.moveTo(mhx-44+30,gy+14-mhH); ctx.quadraticCurveTo(mhx-14,gy+18-mhH,mhx,gy+14-mhH);
            ctx.stroke(); ctx.restore();
          }
        }
      }
    }

    // ── LAGOS LAGOON — brackish green-brown water ─────────────────────────
    P.canalWater(ctx,
      D.parallaxX(-130,cam,0.09), D.parallaxX(w+520,cam,0.09),
      gy+34, t, {
        top: (theme==="flood_zone"||theme==="housing") ? "rgba(8,20,54,0.70)" : "rgba(22,74,112,0.55)",
        bot: (theme==="flood_zone"||theme==="housing") ? "rgba(2,6,22,0.98)"  : "rgba(10,40,60,0.92)",
      });

    // Canoes + fishing boats + lagoon ferry
    for (let bi=0; bi<3; bi++) {
      const fbx=D.parallaxX(200+bi*440, cam, 0.08+bi*0.015);
      if (D.visible(fbx, 30, cam, w)) fishingBoat(ctx, fbx, gy+38, t+bi*1.6);
    }
    {
      const ferx=D.parallaxX(650, cam, 0.07);
      if (D.visible(ferx, 60, cam, w)) ferryBoat(ctx, ferx, gy+38, t);
    }

    // ── STREET LEVEL ──────────────────────────────────────────────────────
    // Lamp posts (some broken — power cut theme)
    for (let li=0; li<5; li++) {
      const lfx=D.parallaxX(80+li*300, cam, 0.27);
      if (!D.visible(lfx, 30, cam, w)) continue;
      const broken=(theme==="institution_gate"||theme==="sector") && li%2===0;
      lampPost(ctx, lfx, gy, broken?"rgba(0,0,0,0)":"rgba(255,190,58,0.36)", t);
    }

    // Danfo buses — iconic yellow Lagos minibus with black stripe
    for (let di=0; di<3; di++) {
      const dfx=D.parallaxX(130+di*530, cam, 0.28);
      if (!D.visible(dfx, 56, cam, w)) continue;
      const ddir=di%2?1:-1;
      ctx.fillStyle="#f2c400"; ctx.fillRect(dfx,gy-28,56,22);
      ctx.fillStyle="#1a1a1a"; ctx.fillRect(dfx,gy-14,56,4);
      ctx.fillStyle="rgba(100,200,240,0.48)";
      ctx.fillRect(ddir>0?dfx+36:dfx+6, gy-26, 14, 10);
      ctx.fillStyle="#1a252f";
      ctx.beginPath(); ctx.arc(dfx+11,gy,6,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(dfx+44,gy,6,0,Math.PI*2); ctx.fill();
      // Crowded silhouettes inside
      ctx.fillStyle="rgba(40,18,0,0.52)";
      for (let dp=0; dp<3; dp++) ctx.fillRect(dfx+6+dp*14,gy-24,10,10);
      // Exhaust puff
      if (theme!=="flood_zone") {
        ctx.save(); ctx.globalAlpha=0.18;
        ctx.fillStyle="#888";
        ctx.beginPath(); ctx.arc(dfx+(ddir<0?dfx:dfx-8),gy-10,6,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }

    // Okada motorcycle taxis (yellow vests — high crash risk)
    for (let oi=0; oi<4; oi++) {
      const ofx=D.parallaxX(240+oi*360, cam, 0.28);
      if (!D.visible(ofx, 28, cam, w)) continue;
      ctx.fillStyle="#333";       ctx.fillRect(ofx,gy-14,28,8);
      ctx.fillStyle="#f2c400";    ctx.fillRect(ofx+6,gy-23,14,11);
      ctx.fillStyle="#f4d03f";    // helmet
      ctx.beginPath(); ctx.arc(ofx+13,gy-25,6,Math.PI,0); ctx.fill();
      ctx.fillStyle="#1a252f";
      ctx.beginPath(); ctx.arc(ofx+5,gy,5,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(ofx+22,gy,5,0,Math.PI*2); ctx.fill();
    }

    // Pedestrians (6 — busy streets)
    for (let pi=0; pi<6; pi++) {
      const pfx=D.parallaxX(100+pi*270, cam, 0.29);
      if (D.visible(pfx, 18, cam, w))
        pedestrian(ctx, pfx, gy, pi%2===0?1:-1, t, pi*1.35, "rgba(55,28,8,0.72)");
    }

    // Always-present smog haze (Lagos has year-round bad air quality)
    const lgHaze=(theme==="smog_cloud"||theme==="env")?0.32:
                 (theme==="boss_lagos")?0.24:0.09;
    P.smogHaze(ctx, D.parallaxX(-100,cam,0.06), gy-200, w+500, lgHaze, [62,48,26]);

    // ── THEME OVERLAYS ─────────────────────────────────────────────────────
    if (theme==="stage_hazard"||theme==="arts") {
      // ── ARTS: Afrobeats/Nollywood — concert rigs, neon, spotbeams ──────
      const alc=["#f39c12","#e74c3c","#2ecc71","#9b59b6","#e91e63","#1abc9c","#ff5722"];
      for (let ai=0; ai<14; ai++) lanternDot(ctx,42+ai*166,gy-82-(ai%5)*20,cam,w,t,ai*0.70,alc[ai%alc.length]);
      for (let ai=0; ai<5; ai++) spotBeam(ctx,70+ai*230,cam,w,gy,t,ai*1.35,["#f39c12","#e74c3c","#2ecc71","#9b59b6","#ff5722"][ai]);
      // Afrobeats concert billboard
      const abbx=D.parallaxX(460, cam, 0.21);
      if (D.visible(abbx, 106, cam, w)) {
        ctx.fillStyle="rgba(5,0,15,0.92)"; ctx.fillRect(abbx-52,gy-202,104,42);
        ctx.fillStyle="#f39c12"; ctx.font="bold 9px monospace"; ctx.textAlign="center";
        ctx.fillText("BURNA BOY LIVE",abbx,gy-181);
        ctx.fillStyle="#e74c3c"; ctx.font="6px monospace";
        ctx.fillText("TAFAWA BALEWA SQUARE",abbx,gy-168); ctx.textAlign="left";
        for (let ab=0; ab<11; ab++) {
          ctx.fillStyle=ab%2===0?"#e74c3c":"#f39c12";
          ctx.beginPath(); ctx.arc(abbx-48+ab*10,gy-203,3,0,Math.PI*2); ctx.fill();
        }
      }
      // Nollywood clapperboard sign
      const nwx=D.parallaxX(800, cam, 0.23);
      if (D.visible(nwx, 80, cam, w)) {
        ctx.fillStyle="rgba(8,0,4,0.88)"; ctx.fillRect(nwx-38,gy-150,76,30);
        ctx.fillStyle="#f4d03f"; ctx.font="bold 7px sans-serif"; ctx.textAlign="center";
        ctx.fillText("NOLLYWOOD",nwx,gy-133);
        ctx.fillStyle="#e74c3c"; ctx.font="5px sans-serif";
        ctx.fillText("2,500 FILMS/YR",nwx,gy-122); ctx.textAlign="left";
      }

    } else if (theme==="commute_pulse"||theme==="work") {
      // ── WORK: Danfo gridlock, informal market, NSE building ─────────────
      for (let wi=0; wi<10; wi++) {
        const wcx=D.parallaxX(15+wi*162, cam, 0.26);
        if (!D.visible(wcx, 56, cam, w)) continue;
        ctx.fillStyle="#f2c400"; ctx.fillRect(wcx,gy-28,56,22);
        ctx.fillStyle="#1a1a1a"; ctx.fillRect(wcx,gy-14,56,4);
        ctx.fillStyle="#1a252f";
        ctx.beginPath(); ctx.arc(wcx+11,gy,6,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(wcx+44,gy,6,0,Math.PI*2); ctx.fill();
        // Exhaust
        ctx.save(); ctx.globalAlpha=0.20;
        ctx.fillStyle="#888";
        ctx.beginPath(); ctx.arc(wcx-6,gy-10,6,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
      // Nigerian Exchange Group building
      const nsex=D.parallaxX(w*0.55, cam, 0.18);
      if (D.visible(nsex, 66, cam, w)) {
        ctx.fillStyle="#28384a"; ctx.fillRect(nsex-32,gy-118,64,118);
        ctx.fillStyle="#38485a"; ctx.fillRect(nsex-28,gy-114,56,110);
        ctx.fillStyle="#1a8a1a"; ctx.fillRect(nsex-32,gy-126,64,10);
        ctx.fillStyle="#fff"; ctx.font="bold 6px sans-serif"; ctx.textAlign="center";
        ctx.fillText("NGX",nsex,gy-119); ctx.textAlign="left";
        ctx.fillStyle="rgba(255,200,80,0.52)";
        for (let wr=0;wr<5;wr++) for (let wc=0;wc<4;wc++) ctx.fillRect(nsex-22+wc*12,gy-105+wr*20,8,12);
      }
      // Commute time sign
      const wcs2=D.parallaxX(310, cam, 0.23);
      if (D.visible(wcs2, 84, cam, w)) {
        ctx.fillStyle="rgba(10,8,2,0.92)"; ctx.fillRect(wcs2-40,gy-64,80,28);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 8px monospace"; ctx.textAlign="center";
        ctx.fillText("AVG COMMUTE 87 MIN",wcs2,gy-50);
        ctx.fillStyle="#f39c12"; ctx.font="5px monospace";
        ctx.fillText("65% INFORMAL WORKERS",wcs2,gy-38); ctx.textAlign="left";
      }

    } else if (theme==="ballot_wave"||theme==="civic") {
      // ── CIVIC: #ENDSARS bonfire protest scene, Lekki Toll Gate ─────────
      for (let bfi=0; bfi<3; bfi++) {
        const bfx=D.parallaxX(160+bfi*490, cam, 0.24);
        if (!D.visible(bfx, 32, cam, w)) continue;
        ctx.fillStyle="#111"; ctx.beginPath(); ctx.arc(bfx,gy,14,Math.PI,0); ctx.fill();
        for (let fl=0; fl<5; fl++) {
          const fph=t*3.2+fl*0.8+bfi*1.1;
          ctx.save(); ctx.globalAlpha=0.72;
          ctx.fillStyle=["#ff4500","#ff6600","#ff8800","#ffaa00","#ff2200"][fl];
          const fh=16+Math.sin(fph)*5;
          ctx.beginPath();
          ctx.moveTo(bfx-8+fl*4,gy); ctx.quadraticCurveTo(bfx-4+fl*3,gy-fh*0.6,bfx+fl*2-3,gy-fh);
          ctx.quadraticCurveTo(bfx+fl*2+2,gy-fh*0.5,bfx+9-fl*2,gy);
          ctx.closePath(); ctx.fill(); ctx.restore();
        }
        for (let fs=0; fs<4; fs++) {
          ctx.save(); ctx.globalAlpha=0.20+fs*0.04;
          ctx.fillStyle="#2a2a2a";
          ctx.beginPath(); ctx.arc(bfx+Math.sin(t*0.5+fs)*5,gy-30-fs*14,8+fs*5,0,Math.PI*2); ctx.fill();
          ctx.restore();
        }
      }
      // #ENDSARS banner (green — Nigerian flag colour)
      const esxc=D.parallaxX(490, cam, 0.22);
      if (D.visible(esxc, 124, cam, w)) {
        ctx.fillStyle="#1a3a1a"; ctx.fillRect(esxc-60,gy-82,120,34);
        ctx.fillStyle="#2ecc71"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
        ctx.fillText("#ENDSARS",esxc,gy-61);
        ctx.fillStyle="#f39c12"; ctx.font="6px sans-serif";
        ctx.fillText("LEKKI TOLL GATE",esxc,gy-49); ctx.textAlign="left";
      }
      // Protest crowd silhouettes
      for (let ci=0; ci<22; ci++) {
        const cpx=D.parallaxX(290+ci*108, cam, 0.26);
        if (!D.visible(cpx, 12, cam, w)) continue;
        ctx.fillStyle="rgba(16,46,16,0.65)";
        ctx.beginPath(); ctx.arc(cpx,gy-8,5,Math.PI,0); ctx.fill();
        ctx.fillRect(cpx-3,gy-8,6,12);
      }
      // Nigerian flag
      const nfpx=D.parallaxX(730, cam, 0.22);
      if (D.visible(nfpx, 70, cam, w)) {
        ctx.fillStyle="#808080"; ctx.fillRect(nfpx,gy-112,3,112);
        ctx.fillStyle="#2ecc71"; ctx.fillRect(nfpx+3,gy-112,24,18);
        ctx.fillStyle="#fff";    ctx.fillRect(nfpx+3+8,gy-112,8,18);
        ctx.fillStyle="#2ecc71"; ctx.fillRect(nfpx+3+16,gy-112,8,18);
      }

    } else if (theme==="book_stack"||theme==="learning") {
      // ── LEARNING: Overcrowded school, teacher crisis stats ───────────────
      const lscx=D.parallaxX(w*0.44, cam, 0.18);
      if (D.visible(lscx, 108, cam, w)) {
        ctx.fillStyle="#7a8898"; ctx.fillRect(lscx-54,gy-92,108,92);
        ctx.fillStyle="#5a6878"; ctx.fillRect(lscx-58,gy-98,116,8);
        ctx.fillStyle="#a0a8b8"; ctx.font="bold 6px sans-serif"; ctx.textAlign="center";
        ctx.fillText("LAGOS CENTRAL PRIMARY",lscx,gy-101); ctx.textAlign="left";
        // Windows with crowded child silhouettes
        for (let lr=0;lr<3;lr++) for (let lc=0;lc<5;lc++) {
          ctx.fillStyle="rgba(255,175,55,0.20)";
          ctx.fillRect(lscx-48+lc*20,gy-84+lr*26,15,19);
          if ((lr+lc)%2===0) {
            ctx.fillStyle="rgba(28,12,4,0.62)";
            ctx.beginPath(); ctx.arc(lscx-40+lc*20,gy-76+lr*26,3,0,Math.PI*2); ctx.fill();
          }
        }
      }
      // "40% OF TEACHERS FAIL TESTS" sign
      const ltsxc=D.parallaxX(272, cam, 0.23);
      if (D.visible(ltsxc, 92, cam, w)) {
        ctx.fillStyle="#2a1a08"; ctx.fillRect(ltsxc-46,gy-70,92,32);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 8px monospace"; ctx.textAlign="center";
        ctx.fillText("40% TEACHERS",ltsxc,gy-56);
        ctx.fillStyle="#f39c12"; ctx.font="6px monospace";
        ctx.fillText("FAIL COMPETENCY TEST",ltsxc,gy-44); ctx.textAlign="left";
      }
      // Falling books (decorative — represents book shortage)
      for (let lbi=0; lbi<6; lbi++) {
        const lby=((t*0.55+lbi*26)%(gy+55))-20;
        const lbx=D.parallaxX(380+lbi*190, cam, 0.22);
        if (!D.visible(lbx, 20, cam, w)) continue;
        ctx.save(); ctx.globalAlpha=0.50;
        ctx.fillStyle="#1a3a6b"; ctx.fillRect(lbx,lby,18,23);
        ctx.fillStyle="#e8e0d4"; ctx.fillRect(lbx+14,lby,4,23);
        ctx.restore();
      }

    } else if (theme==="tax_slider"||theme==="income") {
      // ── INCOME: Extreme gap — Lekki mansion vs Ajegunle shacks ─────────
      // Lekki Phase 1 mansion
      const lmx=D.parallaxX(w*0.67, cam, 0.17);
      if (D.visible(lmx, 88, cam, w)) {
        ctx.fillStyle="#ece0ca"; ctx.fillRect(lmx-42,gy-118,84,118);
        ctx.fillStyle="#d8ccb4"; ctx.fillRect(lmx-46,gy-126,92,10);
        for (let lci=0;lci<4;lci++) { ctx.fillStyle="#f4ece0"; ctx.fillRect(lmx-36+lci*22,gy-116,12,116); }
        ctx.fillStyle="#c8a030"; ctx.fillRect(lmx-48,gy-46,10,46); ctx.fillRect(lmx+38,gy-46,10,46);
        ctx.fillStyle="#f0d040"; ctx.fillRect(lmx-54,gy-48,108,4);
        ctx.fillStyle="#8a7040"; ctx.font="5px sans-serif"; ctx.textAlign="center";
        ctx.fillText("LEKKI PHASE 1",lmx,gy-130); ctx.textAlign="left";
        ctx.fillStyle="rgba(255,220,110,0.62)";
        for (let lr2=0;lr2<4;lr2++) for (let lc2=0;lc2<3;lc2++) ctx.fillRect(lmx-30+lc2*22,gy-108+lr2*26,14,16);
      }
      // Ajegunle shacks (left cluster)
      for (let asi=0; asi<6; asi++) {
        const asx=D.parallaxX(52+asi*88, cam, 0.20);
        if (!D.visible(asx, 40, cam, w)) continue;
        const asH=36+asi*7;
        ctx.fillStyle=asi%2?"#5a3820":"#4a2e18";
        ctx.fillRect(asx,gy-asH,38,asH);
        ctx.fillStyle="#8a7060";
        ctx.beginPath(); ctx.moveTo(asx-3,gy-asH); ctx.lineTo(asx+19,gy-asH-10); ctx.lineTo(asx+41,gy-asH); ctx.closePath(); ctx.fill();
      }
      // Income gap sign
      const igsx=D.parallaxX(500, cam, 0.22);
      if (D.visible(igsx, 106, cam, w)) {
        ctx.fillStyle="rgba(6,0,0,0.94)"; ctx.fillRect(igsx-52,gy-70,104,32);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 8px monospace"; ctx.textAlign="center";
        ctx.fillText("₦5M vs ₦50k/mo",igsx,gy-55);
        ctx.fillStyle="#f39c12"; ctx.font="6px monospace";
        ctx.fillText("IKOYI vs AJEGUNLE",igsx,gy-43); ctx.textAlign="left";
      }
      // Falling naira notes
      for (let nri=0; nri<7; nri++) {
        const nry=((t*0.48+nri*30)%(gy+60))-10;
        const nrx=D.parallaxX(140+nri*220, cam, 0.21);
        if (!D.visible(nrx, 16, cam, w)) continue;
        ctx.save(); ctx.globalAlpha=0.55;
        ctx.fillStyle="#2ecc71"; ctx.fillRect(nrx,nry,22,13);
        ctx.fillStyle="#1a8a3a"; ctx.font="bold 7px monospace"; ctx.textAlign="center";
        ctx.fillText("₦",nrx+11,nry+10); ctx.textAlign="left";
        ctx.restore();
      }

    } else if (theme==="institution_gate"||theme==="sector") {
      // ── SECTOR: NEPA power outages, generator dependency ─────────────────
      // Tangled power poles
      for (let ppi=0; ppi<5; ppi++) {
        const ppx=D.parallaxX(90+ppi*310, cam, 0.22);
        if (!D.visible(ppx, 22, cam, w)) continue;
        ctx.strokeStyle="rgba(80,60,28,0.82)"; ctx.lineWidth=3;
        ctx.beginPath(); ctx.moveTo(ppx,gy); ctx.lineTo(ppx+(ppi%2?-5:5),gy-84); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ppx-18,gy-68); ctx.lineTo(ppx+18,gy-68); ctx.stroke();
        ctx.strokeStyle="rgba(55,38,16,0.48)"; ctx.lineWidth=1;
        for (let pw=0; pw<3; pw++) {
          ctx.beginPath();
          ctx.moveTo(ppx-16+pw*16,gy-68);
          ctx.quadraticCurveTo(ppx-8+pw*8,gy-56,ppx-4+pw*10,gy-46);
          ctx.stroke();
        }
      }
      // Generator units (smoking)
      for (let gni=0; gni<3; gni++) {
        const gnx=D.parallaxX(188+gni*440, cam, 0.24);
        if (!D.visible(gnx, 42, cam, w)) continue;
        ctx.fillStyle="#4a5038"; ctx.fillRect(gnx,gy-26,40,20);
        ctx.fillStyle="#3a4028"; ctx.fillRect(gnx+32,gy-30,8,8);
        for (let gs=0; gs<3; gs++) {
          ctx.save(); ctx.globalAlpha=0.20+gs*0.07;
          ctx.fillStyle="#505040";
          ctx.beginPath(); ctx.arc(gnx+36,gy-30-gs*12,5+gs*3,0,Math.PI*2); ctx.fill();
          ctx.restore();
        }
      }
      // "NEPA HAS TAKEN LIGHT" sign
      const nsx2=D.parallaxX(580, cam, 0.23);
      if (D.visible(nsx2, 94, cam, w)) {
        ctx.fillStyle="rgba(10,8,2,0.94)"; ctx.fillRect(nsx2-46,gy-66,92,30);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 7px monospace"; ctx.textAlign="center";
        ctx.fillText("NEPA HAS TAKEN LIGHT",nsx2,gy-52);
        ctx.fillStyle="#f39c12"; ctx.font="6px monospace";
        ctx.fillText("GENERATOR: ₦800/LITRE",nsx2,gy-40); ctx.textAlign="left";
      }
      // Flickering window lights (power cuts)
      for (let fli=0; fli<4; fli++) {
        const flx=D.parallaxX(80+fli*356, cam, 0.20);
        if (!D.visible(flx, 20, cam, w)) continue;
        if (Math.floor(t*1.8+fli*2.2)%7 < 2) {
          ctx.fillStyle="rgba(255,175,55,0.62)"; ctx.fillRect(flx,gy-54,16,12);
        }
      }

    } else if (theme==="pulse_zone"||theme==="health") {
      // ── HEALTH: Overcrowded clinic, 1 doctor per 5,000 patients ─────────
      const hcx2=D.parallaxX(w*0.41, cam, 0.19);
      if (D.visible(hcx2, 96, cam, w)) {
        ctx.fillStyle="#8a9898"; ctx.fillRect(hcx2-48,gy-96,96,96);
        ctx.fillStyle="#6a7888"; ctx.fillRect(hcx2-52,gy-102,104,8);
        ctx.save(); ctx.globalAlpha=0.72+Math.sin(t*0.055)*0.22;
        ctx.fillStyle="#e74c3c";
        ctx.fillRect(hcx2-4,gy-82,8,26); ctx.fillRect(hcx2-13,gy-74,26,8);
        ctx.restore();
        // Patient queue overflowing outside
        for (let qi=0; qi<18; qi++) {
          const qpx=D.parallaxX(hcx2-68+qi*20, cam, 0.26);
          if (!D.visible(qpx, 12, cam, w)) continue;
          ctx.fillStyle="rgba(38,18,4,0.64)";
          ctx.beginPath(); ctx.arc(qpx,gy-8,4,Math.PI,0); ctx.fill();
          ctx.fillRect(qpx-3,gy-8,6,11);
        }
        ctx.fillStyle="rgba(4,4,4,0.92)"; ctx.fillRect(hcx2-46,gy-115,92,16);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 6px monospace"; ctx.textAlign="center";
        ctx.fillText("1 DOCTOR : 5,000 PATIENTS",hcx2,gy-103); ctx.textAlign="left";
      }

    } else if (theme==="flood_zone"||theme==="housing") {
      // ── HOUSING/FLOOD: Makoko flooding, 2M displaced ─────────────────────
      P.smogHaze(ctx, D.parallaxX(-90,cam,0.08), gy-175, w+480, 0.26, [8,16,56]);
      // Rising floodwater layer
      const fwG=ctx.createLinearGradient(0,gy-22,0,gy+70);
      fwG.addColorStop(0,"rgba(6,20,58,0.62)"); fwG.addColorStop(1,"rgba(2,6,24,0.97)");
      ctx.fillStyle=fwG; ctx.fillRect(0,gy-22,w,92);
      // Flood ripples
      for (let fri=0; fri<8; fri++) {
        const frx=D.parallaxX(50+fri*198, cam, 0.14), fry=gy-10+fri%3*4;
        ctx.save(); ctx.globalAlpha=0.22;
        ctx.strokeStyle="#2a5a8a"; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.ellipse(frx,fry,18+fri*4,3.5,0,0,Math.PI*2); ctx.stroke();
        ctx.restore();
      }
      // Submerged danfo rooftops
      for (let sri=0;sri<3;sri++) {
        const srx=D.parallaxX(200+sri*390, cam, 0.22);
        if (!D.visible(srx, 52, cam, w)) continue;
        ctx.save(); ctx.globalAlpha=0.38;
        ctx.fillStyle="#f2c400"; ctx.fillRect(srx,gy-10,52,8);
        ctx.restore();
      }
      // Makoko flooded sign
      const mfsxc=D.parallaxX(492, cam, 0.22);
      if (D.visible(mfsxc, 92, cam, w)) {
        ctx.fillStyle="rgba(4,6,20,0.95)"; ctx.fillRect(mfsxc-46,gy-72,92,30);
        ctx.fillStyle="#3498db"; ctx.font="bold 8px monospace"; ctx.textAlign="center";
        ctx.fillText("MAKOKO FLOODED",mfsxc,gy-57);
        ctx.fillStyle="#2980b9"; ctx.font="6px monospace";
        ctx.fillText("2M DISPLACED (2022)",mfsxc,gy-45); ctx.textAlign="left";
      }
      crane(ctx, 280, cam, w, gy, 0.19, 0.82);
      crane(ctx, 860, cam, w, gy, 0.23, 0.70);

    } else if (theme==="smog_cloud"||theme==="env") {
      // ── ENV: Open burning, waste dumps, Lagos Air Quality crisis ─────────
      P.smogHaze(ctx, D.parallaxX(-100,cam,0.07), gy-205, w+500, 0.40, [72,50,18]);
      P.smogHaze(ctx, D.parallaxX(-60,cam,0.12),  gy-120, w+400, 0.30, [52,36,12]);
      P.smogHaze(ctx, D.parallaxX(-30,cam,0.17),  gy-58,  w+300, 0.20, [40,26,6]);
      // Open trash burning piles
      for (let obi=0; obi<5; obi++) {
        const obx=D.parallaxX(78+obi*278, cam, 0.24);
        if (!D.visible(obx, 32, cam, w)) continue;
        ctx.fillStyle="#3a2010"; ctx.beginPath(); ctx.arc(obx,gy+5,16,Math.PI,0); ctx.fill();
        for (let ofl=0; ofl<4; ofl++) {
          const ofph=t*2.6+ofl*0.9+obi*1.2;
          ctx.save(); ctx.globalAlpha=0.62;
          ctx.fillStyle=["#ff4500","#ff6a00","#ff9900","#cc3300"][ofl];
          const ofh=12+Math.sin(ofph)*5;
          ctx.beginPath();
          ctx.moveTo(obx-10+ofl*6,gy); ctx.quadraticCurveTo(obx-5+ofl*4,gy-ofh*0.5,obx+ofl*2,gy-ofh);
          ctx.quadraticCurveTo(obx+ofl*2+4,gy-ofh*0.5,obx+11-ofl*3,gy);
          ctx.closePath(); ctx.fill(); ctx.restore();
        }
      }
      // AQI display
      const aqdx=D.parallaxX(470, cam, 0.22);
      if (D.visible(aqdx, 62, cam, w)) {
        ctx.fillStyle="rgba(10,6,0,0.95)"; ctx.fillRect(aqdx-31,gy-74,62,36);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 9px monospace"; ctx.textAlign="center";
        ctx.fillText("AQI 295",aqdx,gy-56);
        ctx.fillStyle="#c0392b"; ctx.font="6px monospace"; ctx.fillText("VERY UNHEALTHY",aqdx,gy-43);
        ctx.textAlign="left";
      }
      // Waste heap silhouettes
      for (let whi=0; whi<6; whi++) {
        const whx=D.parallaxX(142+whi*208, cam, 0.25);
        if (!D.visible(whx, 20, cam, w)) continue;
        ctx.fillStyle=["#4a3818","#384a18","#5a3a0e","#3a381a","#6a400e","#4a4e1e"][whi];
        ctx.beginPath(); ctx.arc(whx,gy+9,11,Math.PI,0); ctx.fill();
      }

    } else if (theme==="patrol_hard"||theme==="safety") {
      // ── SAFETY: SARS checkpoint, crime stats, armed robbery ──────────────
      // SARS checkpoint barrier
      const scpx=D.parallaxX(448, cam, 0.22);
      if (D.visible(scpx, 140, cam, w)) {
        ctx.strokeStyle="#e74c3c"; ctx.lineWidth=4; ctx.setLineDash([12,6]);
        ctx.beginPath(); ctx.moveTo(scpx-68,gy-8); ctx.lineTo(scpx+68,gy-8); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle="#181818"; ctx.fillRect(scpx-72,gy-24,9,24); ctx.fillRect(scpx+63,gy-24,9,24);
        const sfl=Math.floor(t*5.5)%2;
        ctx.save(); ctx.globalAlpha=sfl?0.72:0.22;
        ctx.fillStyle="#ff0000";
        ctx.beginPath(); ctx.arc(scpx,gy-36,8,0,Math.PI*2); ctx.fill();
        ctx.restore();
        ctx.fillStyle="#1a2818"; ctx.fillRect(scpx-22,gy-30,46,24);
        ctx.fillStyle="#fff"; ctx.font="bold 6px sans-serif"; ctx.textAlign="center";
        ctx.fillText("POLICE",scpx,gy-15); ctx.textAlign="left";
        // Gun barrels (ominous)
        ctx.strokeStyle="#3a3a3a"; ctx.lineWidth=2.5;
        ctx.beginPath(); ctx.moveTo(scpx-20,gy-18); ctx.lineTo(scpx-38,gy-12); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(scpx+22,gy-18); ctx.lineTo(scpx+40,gy-12); ctx.stroke();
      }
      // Crime index sign
      const cxix=D.parallaxX(690, cam, 0.23);
      if (D.visible(cxix, 92, cam, w)) {
        ctx.fillStyle="rgba(10,4,4,0.93)"; ctx.fillRect(cxix-46,gy-68,92,30);
        ctx.fillStyle="#e74c3c"; ctx.font="bold 8px monospace"; ctx.textAlign="center";
        ctx.fillText("CRIME INDEX: 68.5",cxix,gy-53);
        ctx.fillStyle="#f39c12"; ctx.font="6px monospace";
        ctx.fillText("HIGHEST IN CAMPAIGN",cxix,gy-41); ctx.textAlign="left";
      }
      // Watchtower with red beacon
      const wtx2=D.parallaxX(200, cam, 0.20);
      if (D.visible(wtx2, 32, cam, w)) {
        ctx.fillStyle="#3a3020"; ctx.fillRect(wtx2-8,gy-82,16,82);
        ctx.fillStyle="#2a2818"; ctx.fillRect(wtx2-14,gy-90,28,12);
        ctx.save(); ctx.globalAlpha=0.66+Math.sin(t*0.06)*0.26;
        ctx.fillStyle="#ff2020";
        ctx.beginPath(); ctx.arc(wtx2,gy-84,7,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }

    } else if (theme==="boss_lagos") {
      // ── BOSS: Total gridlock + smog + falling naira + chaos lights ───────
      P.smogHaze(ctx, D.parallaxX(-100,cam,0.07), gy-205, w+500, 0.38, [62,40,16]);
      P.smogHaze(ctx, D.parallaxX(-60,cam,0.12),  gy-110, w+400, 0.26, [50,28,8]);
      // Wall-to-wall danfo gridlock
      for (let bgi=0; bgi<18; bgi++) {
        const bgcx=D.parallaxX(8+bgi*144, cam, 0.25);
        if (!D.visible(bgcx, 56, cam, w)) continue;
        if (bgi%3!==0) {
          ctx.fillStyle="#f2c400"; ctx.fillRect(bgcx,gy-28,56,22);
          ctx.fillStyle="#1a1a1a"; ctx.fillRect(bgcx,gy-14,56,4);
          ctx.fillStyle="#1a252f";
          ctx.beginPath(); ctx.arc(bgcx+11,gy,6,0,Math.PI*2); ctx.fill();
          ctx.beginPath(); ctx.arc(bgcx+44,gy,6,0,Math.PI*2); ctx.fill();
          ctx.save(); ctx.globalAlpha=0.22;
          ctx.fillStyle="#888";
          ctx.beginPath(); ctx.arc(bgcx-6,gy-10,6,0,Math.PI*2); ctx.fill();
          ctx.restore();
        } else {
          smallCar(ctx,bgcx,gy,bgi%2?1:-1,["#c0392b","#2980b9","#7f8c8d"][bgi%3]);
        }
      }
      // "APAPA — ALL BLOCKED" highway sign
      const apax=D.parallaxX(w*0.5, cam, 0.22);
      if (D.visible(apax, 128, cam, w)) {
        ctx.fillStyle="#c0392b"; ctx.fillRect(apax-62,gy-82,124,32);
        ctx.fillStyle="#fff"; ctx.font="bold 9px monospace"; ctx.textAlign="center";
        ctx.fillText("APAPA — ALL BLOCKED",apax,gy-64);
        ctx.fillStyle="#ff8800"; ctx.font="6px monospace";
        ctx.fillText("WAIT TIME: UNKNOWN",apax,gy-50); ctx.textAlign="left";
      }
      // Falling naira (economic collapse visual)
      for (let bni=0; bni<9; bni++) {
        const bny=((t*0.58+bni*26)%(gy+60))-10;
        const bnx=D.parallaxX(90+bni*192, cam, 0.21);
        if (!D.visible(bnx, 16, cam, w)) continue;
        ctx.save(); ctx.globalAlpha=0.58;
        ctx.fillStyle="#e74c3c"; ctx.font="bold 14px monospace"; ctx.textAlign="center";
        ctx.fillText("₦",bnx,bny); ctx.restore();
      }
      // Flashing police/chaos lights
      for (let bpi=0; bpi<4; bpi++) {
        const bpx=D.parallaxX(200+bpi*480, cam, 0.26);
        if (!D.visible(bpx, 10, cam, w)) continue;
        const bph=Math.floor(t*4.5+bpi)%2;
        ctx.save(); ctx.globalAlpha=bph?0.68:0.18;
        ctx.fillStyle=bph?"#e74c3c":"#3498db";
        ctx.beginPath(); ctx.arc(bpx,gy-32,8,0,Math.PI*2); ctx.fill();
        ctx.restore();
      }
    }

    groundLine(ctx, cam, w, gy, "rgba(46,204,113,0.22)");
    if (D.particles) D.particles.paint(ctx, city.id, cam, w, h, t);
    if (D.foreground) D.foreground.paint(ctx, city, cam, w, h, gy, t);
    A.finish(ctx, w, h, {vignette:0.30});
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  GENERIC FALLBACK
  // ═══════════════════════════════════════════════════════════════════════════
  function paintGeneric(ctx, city, cam, w, h, gy, t) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, city.skyTop); g.addColorStop(1, city.skyBot);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    B.row(ctx, -200, w+800, gy, cam, 0.15, 42, ["glass","brick","highrise"], 50, 160, t);
    A.finish(ctx, w, h, {});
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════
  const painters = {
    copenhagen: paintCopenhagen,
    toronto:    paintToronto,
    istanbul:   paintIstanbul,
    bangkok:    paintBangkok,
    newdelhi:   paintNewDelhi,
    lagos:      paintLagos,
  };

  D.paintCityBackground = function (ctx, city, cam, w, h, time, groundY, stage) {
    const gy = groundY || Math.floor(h * 0.68);
    const t  = time || 0;
    const fn = painters[city.id] || paintGeneric;
    fn(ctx, city, cam, w, h, gy, t, stage);
    if (stage && stage.hazardTheme && D.stageThemes) {
      D.stageThemes.skyOverlay(ctx, w, h, gy, stage.hazardTheme, t);
      D.stageThemes.banner(ctx, cam, w, gy, stage);
    }
  };
})();
