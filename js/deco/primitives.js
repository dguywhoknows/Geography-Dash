/**
 * Rich procedural primitives — clouds, water, foliage, street furniture, vehicles.
 */
(function () {
  "use strict";

  const D = window.GD_DECO;
  if (!D) return;

  const P = (D.primitives = {});

  P.cloudPuff = function (ctx, cx, cy, rx, ry, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha != null ? alpha : 0.85;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + rx * 0.7, cy - ry * 0.2, rx * 0.65, ry * 0.75, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - rx * 0.55, cy + ry * 0.1, rx * 0.5, ry * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  P.cloudLayer = function (ctx, x0, x1, yBase, t, density, alpha) {
    const span = x1 - x0;
    const count = density || 8;
    for (let i = 0; i < count; i++) {
      const fx = x0 + (i / count) * span + Math.sin(t * 0.15 + i * 1.7) * 40;
      const fy = yBase + Math.sin(i * 2.1) * 12;
      const rx = 36 + (i % 3) * 18;
      P.cloudPuff(ctx, fx, fy, rx, rx * 0.38, alpha || 0.55);
    }
  };

  P.sunDisc = function (ctx, x, y, r, glow) {
    if (glow) {
      const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 3.2);
      g.addColorStop(0, "rgba(255,220,120,0.45)");
      g.addColorStop(0.4, "rgba(255,200,80,0.12)");
      g.addColorStop(1, "rgba(255,200,80,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
    const sg = ctx.createRadialGradient(x, y, 0, x, y, r);
    sg.addColorStop(0, "#fff8e0");
    sg.addColorStop(0.65, "#ffd54f");
    sg.addColorStop(1, "rgba(255,180,50,0)");
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  P.moonDisc = function (ctx, x, y, r) {
    ctx.fillStyle = "#f5f3e8";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(200,200,210,0.35)";
    ctx.beginPath();
    ctx.arc(x + r * 0.35, y - r * 0.2, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y + r * 0.3, r * 0.15, 0, Math.PI * 2);
    ctx.fill();
  };

  P.starField = function (ctx, w, h, seed, twinkleT) {
    let s = seed >>> 0;
    for (let i = 0; i < 85; i++) {
      s = (s * 1103515245 + 12345) >>> 0;
      const sx = (s % 10000) / 10000 * w;
      s = (s * 1103515245 + 12345) >>> 0;
      const sy = (s % 10000) / 10000 * h * 0.55;
      s = (s * 1103515245 + 12345) >>> 0;
      const br = 0.35 + ((s >>> 4) % 100) / 100;
      const tw = 0.7 + 0.3 * Math.sin(twinkleT * 2 + i * 0.9);
      ctx.fillStyle = "rgba(255,255,255," + br * tw + ")";
      const sz = 1 + (i % 3 === 0 ? 1 : 0);
      ctx.fillRect(sx, sy, sz, sz);
    }
  };

  P.birdFlock = function (ctx, cx, cy, t, count) {
    ctx.strokeStyle = "rgba(30,35,45,0.55)";
    ctx.lineWidth = 1.2;
    count = count || 5;
    for (let i = 0; i < count; i++) {
      const bx = cx + i * 22 + Math.sin(t * 1.2 + i) * 8;
      const by = cy + Math.cos(t * 0.9 + i * 0.7) * 6;
      const wing = Math.sin(t * 8 + i * 2) * 4;
      ctx.beginPath();
      ctx.moveTo(bx - 6, by + wing);
      ctx.quadraticCurveTo(bx, by - 3, bx + 6, by + wing);
      ctx.stroke();
    }
  };

  P.hillSilhouette = function (ctx, x0, x1, yBase, h, color, seed) {
    let s = seed >>> 0;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x0, yBase);
    let x = x0;
    while (x < x1) {
      s = (s * 1103515245 + 12345) >>> 0;
      const seg = 60 + (s % 80);
      const peak = yBase - h * (0.35 + ((s >>> 8) % 100) / 100 * 0.65);
      ctx.lineTo(x + seg * 0.5, peak);
      ctx.lineTo(x + seg, yBase);
      x += seg;
    }
    ctx.lineTo(x1, yBase);
    ctx.closePath();
    ctx.fill();
  };

  P.canalWater = function (ctx, x0, x1, y, t, palette) {
    palette = palette || {};
    const top = palette.top || "rgba(52, 152, 219,0.5)";
    const bot = palette.bot || "rgba(41, 128, 185,0.82)";
    const ripple = palette.ripple || "rgba(255,255,255,0.18)";
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y - 30, x1 - x0, 120);
    ctx.clip();
    const grd = ctx.createLinearGradient(0, y - 35, 0, y + 45);
    grd.addColorStop(0, top);
    grd.addColorStop(1, bot);
    ctx.fillStyle = grd;
    ctx.fillRect(x0, y - 25, x1 - x0, 90);
    ctx.strokeStyle = ripple;
    ctx.lineWidth = 1;
    const wave = Math.sin(t * 0.6) * 0.5;
    for (let i = 0; i < 18; i++) {
      const ox = x0 + i * 72 + wave * 35;
      ctx.beginPath();
      ctx.moveTo(ox, y + 5);
      ctx.quadraticCurveTo(ox + 22, y - 3, ox + 44, y + 5);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let r = 0; r < 6; r++) {
      ctx.fillRect(x0 + r * 140 + t * 12 % 140, y + 12, 80, 3);
    }
    ctx.restore();
  };

  P.lakeBand = function (ctx, x0, x1, y, colors) {
    const g = ctx.createLinearGradient(0, y - 25, 0, y + 55);
    g.addColorStop(0, colors[0]);
    g.addColorStop(1, colors[1]);
    ctx.fillStyle = g;
    ctx.fillRect(x0, y - 15, x1 - x0, 70);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(x0 + i * 90, y + 8);
      ctx.lineTo(x0 + i * 90 + 50, y + 4);
      ctx.stroke();
    }
  };

  P.streetLamp = function (ctx, x, yb, sc, lit) {
    sc = sc || 1;
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(x - 2 * sc, yb - 58 * sc, 4 * sc, 58 * sc);
    ctx.fillStyle = "#34495e";
    ctx.beginPath();
    ctx.arc(x, yb - 58 * sc, 5 * sc, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2c3e50";
    ctx.lineWidth = 2 * sc;
    ctx.beginPath();
    ctx.moveTo(x, yb - 56 * sc);
    ctx.lineTo(x + 14 * sc, yb - 62 * sc);
    ctx.stroke();
    if (lit) {
      const g = ctx.createRadialGradient(x + 14 * sc, yb - 62 * sc, 0, x + 14 * sc, yb - 62 * sc, 28 * sc);
      g.addColorStop(0, "rgba(255,230,150,0.55)");
      g.addColorStop(1, "rgba(255,230,150,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x + 14 * sc, yb - 62 * sc, 28 * sc, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = lit ? "#f9e79f" : "#bdc3c7";
    ctx.beginPath();
    ctx.arc(x + 14 * sc, yb - 64 * sc, 4 * sc, 0, Math.PI * 2);
    ctx.fill();
  };

  P.bushCluster = function (ctx, x, yb, sc, hue) {
    sc = sc || 1;
    hue = hue || 0;
    const greens = ["#27ae60", "#2ecc71", "#1e8449", "#229954"];
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = greens[(i + hue) % greens.length];
      const ox = x + (i - 2) * 10 * sc;
      const oy = yb - (8 + (i % 3) * 6) * sc;
      const rx = (14 + (i % 2) * 4) * sc;
      const ry = (10 + (i % 3) * 3) * sc;
      ctx.beginPath();
      ctx.ellipse(ox, oy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  P.treeDeciduous = function (ctx, x, yb, sc, season) {
    sc = sc || 1;
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(x - 4 * sc, yb - 28 * sc, 8 * sc, 28 * sc);
    const foliage =
      season === "autumn"
        ? ["#d35400", "#e67e22", "#c0392b"]
        : ["#1e8449", "#27ae60", "#2ecc71"];
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = foliage[i % foliage.length];
      ctx.beginPath();
      ctx.arc(x + (i - 1.5) * 8 * sc, yb - (38 + i * 6) * sc, (16 - i * 2) * sc, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  P.treePine = function (ctx, x, yb, sc) {
    sc = sc || 1;
    ctx.fillStyle = "#4e342e";
    ctx.fillRect(x - 3 * sc, yb - 18 * sc, 6 * sc, 18 * sc);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = i % 2 ? "#1b5e20" : "#2e7d32";
      ctx.beginPath();
      ctx.moveTo(x, yb - (22 + i * 14) * sc);
      ctx.lineTo(x - (20 - i * 3) * sc, yb - (8 + i * 14) * sc);
      ctx.lineTo(x + (20 - i * 3) * sc, yb - (8 + i * 14) * sc);
      ctx.closePath();
      ctx.fill();
    }
  };

  P.fenceSegment = function (ctx, x, yb, w, sc) {
    sc = sc || 1;
    ctx.strokeStyle = "#7f8c8d";
    ctx.lineWidth = 2 * sc;
    for (let i = 0; i <= Math.floor(w / (14 * sc)); i++) {
      const fx = x + i * 14 * sc;
      ctx.beginPath();
      ctx.moveTo(fx, yb);
      ctx.lineTo(fx, yb - 22 * sc);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(x, yb - 16 * sc);
    ctx.lineTo(x + w, yb - 16 * sc);
    ctx.moveTo(x, yb - 22 * sc);
    ctx.lineTo(x + w, yb - 22 * sc);
    ctx.stroke();
  };

  P.bunting = function (ctx, x0, x1, y, t) {
    const colors = ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71", "#9b59b6"];
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, y);
    ctx.quadraticCurveTo((x0 + x1) * 0.5, y + 8 + Math.sin(t) * 2, x1, y);
    ctx.stroke();
    const n = Math.floor((x1 - x0) / 28);
    for (let i = 0; i < n; i++) {
      const fx = x0 + i * 28 + 14;
      const sag = Math.sin(t * 2 + i) * 3;
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.moveTo(fx, y + sag);
      ctx.lineTo(fx - 8, y + 16 + sag);
      ctx.lineTo(fx + 8, y + 16 + sag);
      ctx.closePath();
      ctx.fill();
    }
  };

  P.smogHaze = function (ctx, x0, y, w, alpha, tint) {
    tint = tint || [90, 80, 70];
    const g = ctx.createLinearGradient(x0, y - 60, x0 + w, y + 30);
    g.addColorStop(0, "rgba(" + tint.join(",") + ",0)");
    g.addColorStop(0.45, "rgba(" + tint.join(",") + "," + alpha + ")");
    g.addColorStop(1, "rgba(" + tint.join(",") + ",0)");
    ctx.fillStyle = g;
    ctx.fillRect(x0, y - 70, w, 90);
  };

  P.vignette = function (ctx, w, h, strength) {
    const g = ctx.createRadialGradient(w * 0.5, h * 0.55, h * 0.2, w * 0.5, h * 0.55, h * 0.85);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0," + (strength || 0.22) + ")");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  };

  P.godRays = function (ctx, x, y, w, h, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha || 0.08;
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(x + i * 40, y);
      ctx.lineTo(x + i * 40 + 60, y + h);
      ctx.lineTo(x + i * 40 + 20, y + h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  };
})();
