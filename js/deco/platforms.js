/**
 * Rich platform surface rendering - cobble, marble, gameplay stone, accents.
 */
(function () {
  "use strict";

  const D = window.GD_DECO;
  if (!D) return;

  function hashPlat(pl) {
    return ((pl.x * 73856093) ^ (pl.y * 19349663) ^ (pl.w * 83492791)) >>> 0;
  }

  function drawCobble(ctx, pl, base, mortar) {
    ctx.fillStyle = base;
    ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
    let s = hashPlat(pl);
    const sz = 11;
    for (let ty = pl.y; ty < pl.y + pl.h; ty += sz) {
      for (let tx = pl.x; tx < pl.x + pl.w; tx += sz) {
        s = (s * 1103515245 + 12345) >>> 0;
        const jitter = (s % 5) - 2;
        ctx.fillStyle = D.mix(base, mortar, ((s >>> 8) % 100) / 200);
        ctx.fillRect(tx + 1, ty + 1 + jitter, sz - 2, sz - 3);
      }
    }
    ctx.strokeStyle = mortar;
    ctx.lineWidth = 1;
    ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
  }

  // Maps hazardTheme to a [base, top, accent, overlay] visual recipe
  const THEME_SURFACE = {
    env:            { base: "#2d4a2d", top: "#3d6b3d", mark: "rgba(46,204,113,0.55)", stripe: "rgba(39,174,96,0.25)" },
    wind_turbine:   { base: "#2d4a2d", top: "#3d6b3d", mark: "rgba(46,204,113,0.55)", stripe: "rgba(39,174,96,0.25)" },
    bike_lane:      { base: "#3a4d5c", top: "#4a6070", mark: "rgba(52,152,219,0.55)", stripe: "rgba(52,152,219,0.2)" },
    mobility:       { base: "#2e3a45", top: "#3f515e", mark: "rgba(52,152,219,0.5)",  stripe: "rgba(52,152,219,0.15)" },
    car_swarm:      { base: "#1f2c35", top: "#2c3e50", mark: "rgba(231,76,60,0.5)",   stripe: "rgba(230,230,230,0.12)" },
    commute_pulse:  { base: "#1f2c35", top: "#2c3e50", mark: "rgba(231,76,60,0.5)",   stripe: "rgba(230,230,230,0.12)" },
    smog_cloud:     { base: "#3d3530", top: "#524840", mark: "rgba(149,165,166,0.4)", stripe: null },
    housing:        { base: "#5d3a28", top: "#7a5040", mark: "rgba(211,84,0,0.5)",    stripe: null },
    quake_crack:    { base: "#4a3828", top: "#604e3c", mark: "rgba(192,57,43,0.45)",  stripe: null },
    flood_zone:     { base: "#1a3550", top: "#254a6a", mark: "rgba(41,128,185,0.55)", stripe: "rgba(100,180,220,0.15)" },
    health:         { base: "#38505a", top: "#4f6e7a", mark: "rgba(255,255,255,0.5)", stripe: "rgba(46,204,113,0.2)" },
    pulse_zone:     { base: "#2f4a38", top: "#3f6248", mark: "rgba(46,204,113,0.5)",  stripe: "rgba(46,204,113,0.18)" },
    patrol_hard:    { base: "#252f3d", top: "#32404e", mark: "rgba(155,89,182,0.5)",  stripe: null },
    patrol_soft:    { base: "#2e3d48", top: "#3d5060", mark: "rgba(127,140,141,0.5)", stripe: null },
    civic:          { base: "#3a4055", top: "#4f5570", mark: "rgba(52,152,219,0.5)",  stripe: "rgba(52,152,219,0.15)" },
    ballot_wave:    { base: "#3a4055", top: "#4f5570", mark: "rgba(52,152,219,0.5)",  stripe: "rgba(52,152,219,0.15)" },
    income:         { base: "#3a3520", top: "#524d30", mark: "rgba(241,196,15,0.5)",  stripe: null },
    tax_slider:     { base: "#3a3520", top: "#524d30", mark: "rgba(241,196,15,0.5)",  stripe: null },
    arts:           { base: "#3a2050", top: "#52306e", mark: "rgba(155,89,182,0.55)", stripe: "rgba(155,89,182,0.18)" },
    stage_hazard:   { base: "#3a2050", top: "#52306e", mark: "rgba(155,89,182,0.55)", stripe: "rgba(155,89,182,0.18)" },
    boss_tower:     { base: "#1a2035", top: "#252e48", mark: "rgba(231,76,60,0.55)",  stripe: null },
    boss_sprawl:    { base: "#1a2035", top: "#252e48", mark: "rgba(231,76,60,0.55)",  stripe: null },
    boss_storm:     { base: "#150e20", top: "#22182e", mark: "rgba(155,89,182,0.6)",  stripe: null },
    boss_volatile:  { base: "#2a1808", top: "#3d2510", mark: "rgba(230,126,34,0.6)",  stripe: null },
    boss_lagos:     { base: "#0e1a10", top: "#182a1c", mark: "rgba(46,204,113,0.5)",  stripe: null },
  };

  function drawGameplayStone(ctx, pl, city, theme) {
    const s   = hashPlat(pl);
    const surf = (theme && THEME_SURFACE[theme]) || null;
    const topColor  = surf ? surf.top  : "#5d6d7e";
    const baseColor = surf ? surf.base : "#3d4f5f";
    const accent    = (surf && surf.mark) || (city && city.accent) || "#3498db";

    const grd = ctx.createLinearGradient(pl.x, pl.y, pl.x, pl.y + pl.h);
    grd.addColorStop(0,    topColor);
    grd.addColorStop(0.32, baseColor);
    grd.addColorStop(1,    "#1a252f");
    ctx.fillStyle = grd;
    ctx.fillRect(pl.x, pl.y, pl.w, pl.h);

    // Top-face highlight
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.fillRect(pl.x + 2, pl.y + 2, pl.w - 4, Math.min(6, pl.h * 0.35));

    // Masonry lines
    ctx.strokeStyle = "rgba(0,0,0,0.22)";
    ctx.lineWidth = 1;
    for (let i = 0; i < Math.floor(pl.w / 28); i++) {
      const lx = pl.x + 14 + i * 28 + ((s + i * 17) % 7);
      ctx.beginPath();
      ctx.moveTo(lx, pl.y + 4);
      ctx.lineTo(lx + 8, pl.y + pl.h - 4);
      ctx.stroke();
    }

    // Theme lane stripe (e.g. bike lane, road markings)
    if (surf && surf.stripe && pl.w > 80) {
      ctx.fillStyle = surf.stripe;
      const sy = pl.y + Math.floor(pl.h * 0.4);
      ctx.fillRect(pl.x + 8, sy, pl.w - 16, 3);
    }

    // Accent border
    ctx.strokeStyle = accent;
    ctx.globalAlpha = 0.42;
    ctx.lineWidth = 2;
    ctx.strokeRect(pl.x + 0.5, pl.y + 0.5, pl.w - 1, pl.h - 1);
    ctx.globalAlpha = 1;

    if (pl.h >= 40) {
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(pl.x, pl.y + pl.h - 4, pl.w, 4);
    }
  }

  D.drawPlatform = function (ctx, pl, lvl, city) {
    const st = pl.style || "";
    const gy = lvl.groundY;

    if (pl.y > gy - 10) {
      if (st === "hub_ground") {
        const g = ctx.createLinearGradient(pl.x, pl.y, pl.x, pl.y + pl.h);
        g.addColorStop(0, "#566573");
        g.addColorStop(0.08, "#2c3e50");
        g.addColorStop(1, "#1a252f");
        ctx.fillStyle = g;
        ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
        ctx.strokeStyle = "rgba(241,196,15,0.55)";
        ctx.lineWidth = 3;
        ctx.setLineDash([18, 12]);
        ctx.beginPath();
        ctx.moveTo(pl.x + 40, pl.y + 14);
        ctx.lineTo(pl.x + pl.w - 40, pl.y + 14);
        ctx.stroke();
        ctx.setLineDash([]);
        drawCobble(ctx, { x: pl.x, y: pl.y, w: pl.w, h: 10 }, "#4a5568", "#2c3e50");
        return;
      }
      const gg = ctx.createLinearGradient(pl.x, pl.y, pl.x, pl.y + pl.h);
      gg.addColorStop(0, "#4a5568");
      gg.addColorStop(1, "#1a252f");
      ctx.fillStyle = gg;
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(pl.x, pl.y, pl.w, 8);
      return;
    }

    if (st === "hub_cobble" || st === "hub_granite") {
      drawCobble(ctx, pl, st === "hub_granite" ? "#7f8c8d" : "#8d6e63", "#5d4037");
      ctx.strokeStyle = city.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
      return;
    }

    if (st === "hub_concrete") {
      ctx.fillStyle = "#95a5a6";
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      for (let i = 0; i < pl.w; i += 40) ctx.fillRect(pl.x + i, pl.y, 20, pl.h);
      ctx.fillStyle = "rgba(231,76,60,0.4)";
      ctx.fillRect(pl.x, pl.y + pl.h - 6, pl.w, 6);
      ctx.strokeStyle = "#7f8c8d";
      ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
      return;
    }

    if (st === "hub_stone") {
      drawCobble(ctx, pl, "#b7956b", "#6d4c41");
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.fillRect(pl.x + 4, pl.y + 4, pl.w - 8, pl.h * 0.35);
      ctx.strokeStyle = "#6d4c41";
      ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
      return;
    }

    if (st === "hub_tile") {
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.strokeStyle = "rgba(0,0,0,0.25)";
      for (let ty = pl.y; ty < pl.y + pl.h; ty += 10) {
        for (let tx = pl.x; tx < pl.x + pl.w; tx += 20) {
          ctx.strokeRect(tx, ty, 18, 8);
          if (((tx + ty) / 10) % 2 === 0) {
            ctx.fillStyle = "rgba(255,255,255,0.06)";
            ctx.fillRect(tx + 1, ty + 1, 16, 6);
            ctx.fillStyle = "#c0392b";
          }
        }
      }
      ctx.strokeStyle = "#922b21";
      ctx.lineWidth = 2;
      ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
      return;
    }

    if (st === "hub_marble") {
      const m = ctx.createLinearGradient(pl.x, pl.y, pl.x + pl.w, pl.y + pl.h);
      m.addColorStop(0, "#fdfefe");
      m.addColorStop(0.5, "#ecf0f1");
      m.addColorStop(1, "#d5dbdb");
      ctx.fillStyle = m;
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      ctx.strokeStyle = "rgba(149,165,166,0.45)";
      ctx.beginPath();
      ctx.moveTo(pl.x, pl.y + pl.h * 0.35);
      ctx.lineTo(pl.x + pl.w, pl.y + pl.h * 0.15);
      ctx.stroke();
      ctx.strokeRect(pl.x, pl.y, pl.w, pl.h);
      return;
    }

    if (st === "hub_dirt") {
      ctx.fillStyle = "#6d4c41";
      ctx.fillRect(pl.x, pl.y, pl.w, pl.h);
      let s = hashPlat(pl);
      for (let k = 0; k < 14; k++) {
        s = (s * 1103515245 + 12345) >>> 0;
        ctx.fillStyle = k % 2 ? "#8d6e63" : "#5d4037";
        ctx.fillRect(pl.x + (s % Math.max(1, pl.w - 12)), pl.y + ((s >>> 8) % Math.max(1, pl.h - 4)), 10 + (s % 8), 3);
      }
      return;
    }

    const theme = lvl && lvl.stage && lvl.stage.hazardTheme;
    drawGameplayStone(ctx, pl, city, theme);
  };
})();
