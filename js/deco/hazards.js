/**
 * Detailed hazard visuals — purpose-drawn per kind, city-tinted where relevant.
 * Exposes GD_DECO.drawHazard(ctx, hazard, time, city).
 */
(function () {
  "use strict";
  const D = window.GD_DECO;
  if (!D) return;

  // ── Colour helpers ───────────────────────────────────────────────────────────
  function hexToRgb(hex) {
    if (!hex || hex.charAt(0) !== "#" || hex.length < 7) return [192, 57, 43];
    return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  }
  function darken(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    return "rgb(" + Math.max(0, Math.round(r * (1 - amt))) + "," +
                    Math.max(0, Math.round(g * (1 - amt))) + "," +
                    Math.max(0, Math.round(b * (1 - amt))) + ")";
  }
  function rgba(hex, a) {
    const [r, g, b] = hexToRgb(hex);
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }

  // City-keyed currency symbols for income/housing hazards
  const CITY_CURRENCY = {
    copenhagen: "kr", toronto: "C$", istanbul: "₺",
    bangkok: "฿",    newdelhi: "₹",  lagos: "₦",
  };

  // City-keyed car body colours so traffic looks local
  const CAR_COLORS = {
    copenhagen: ["#2980b9", "#1a6b9a", "#3498db"],
    toronto:    ["#c0392b", "#922b21", "#e74c3c"],
    istanbul:   ["#d4ac6e", "#b7950b", "#f39c12"],
    bangkok:    ["#8e44ad", "#6c3483", "#9b59b6"],
    newdelhi:   ["#e67e22", "#ca6f1e", "#f0a500"],
    lagos:      ["#27ae60", "#1e8449", "#2ecc71"],
  };

  function carColor(city, seed) {
    const pool = (city && CAR_COLORS[city.id]) || CAR_COLORS.toronto;
    return pool[((seed | 0) >>> 0) % pool.length];
  }

  // ── CAR ─────────────────────────────────────────────────────────────────────
  function drawCar(ctx, z, t, city) {
    const x = z.x, y = z.y;
    const w = z.w || 54, h = z.h || 28;
    const dir   = (z.vx || 1) >= 0 ? 1 : -1;
    const speed = Math.abs(z.vx || 0);
    const col   = carColor(city, Math.abs(z.x + z.y) * 7);
    const wR    = h * 0.33;          // wheel radius
    const wY    = y + h - wR * 0.5; // wheel centre Y

    // Motion blur streaks
    if (speed > 2.5) {
      for (let i = 1; i <= 3; i++) {
        ctx.fillStyle = rgba(col, 0.07 / i);
        ctx.fillRect(x - dir * i * 13, y + h * 0.18, w, h * 0.64);
      }
    }

    // Drop shadow
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(x + w * 0.5, y + h + 4, w * 0.38, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Wheels (drawn first so body overlaps) ──────────────────────────────
    const wX1 = x + w * 0.22;
    const wX2 = x + w * 0.78;
    [wX1, wX2].forEach(function (wx) {
      // Tyre
      ctx.fillStyle = "#1a252f";
      ctx.beginPath(); ctx.arc(wx, wY, wR, 0, Math.PI * 2); ctx.fill();
      // Hub rim
      ctx.fillStyle = "#7f8c8d";
      ctx.beginPath(); ctx.arc(wx, wY, wR * 0.54, 0, Math.PI * 2); ctx.fill();
      // Spokes
      ctx.strokeStyle = "#95a5a6";
      ctx.lineWidth = 1.5;
      for (let s = 0; s < 4; s++) {
        const ang = t * dir * 5.5 + s * Math.PI * 0.5;
        ctx.beginPath();
        ctx.moveTo(wx + Math.cos(ang) * wR * 0.14, wY + Math.sin(ang) * wR * 0.14);
        ctx.lineTo(wx + Math.cos(ang) * wR * 0.46, wY + Math.sin(ang) * wR * 0.46);
        ctx.stroke();
      }
      // Hub cap
      ctx.fillStyle = "#bdc3c7";
      ctx.beginPath(); ctx.arc(wx, wY, wR * 0.18, 0, Math.PI * 2); ctx.fill();
    });

    // ── Lower body ────────────────────────────────────────────────────────
    const bg = ctx.createLinearGradient(x, y + h * 0.35, x, y + h);
    bg.addColorStop(0, col);
    bg.addColorStop(1, darken(col, 0.28));
    ctx.fillStyle = bg;
    D.fillRoundRect(ctx, x + 1, y + h * 0.33, w - 2, h * 0.67, 5);

    // ── Cabin ─────────────────────────────────────────────────────────────
    const cabX = x + w * 0.14;
    const cabW = w * 0.70;
    const cabH = h * 0.50;
    const cg = ctx.createLinearGradient(cabX, y, cabX + cabW, y + cabH);
    cg.addColorStop(0, col);
    cg.addColorStop(1, darken(col, 0.16));
    ctx.fillStyle = cg;
    D.fillRoundRect(ctx, cabX, y + 1, cabW, cabH + 4, 6);

    // ── Windows ───────────────────────────────────────────────────────────
    const winY = y + 5;
    const winH = cabH - 8;
    const halfW = cabW * 0.44;
    const windX = dir > 0 ? cabX + 4        : cabX + cabW - halfW - 4;
    const rearX  = dir > 0 ? cabX + cabW - halfW - 2 : cabX + 4;

    ctx.fillStyle = "rgba(160,215,245,0.84)";
    D.fillRoundRect(ctx, windX, winY, halfW, winH, 3);
    // Shine
    ctx.fillStyle = "rgba(255,255,255,0.30)";
    ctx.fillRect(windX + 2, winY + 2, 4, winH * 0.38);

    ctx.fillStyle = "rgba(120,180,210,0.72)";
    D.fillRoundRect(ctx, rearX, winY, halfW - 2, winH, 3);

    // ── Lights ────────────────────────────────────────────────────────────
    const hlX = dir > 0 ? x + w - 4 : x + 4;
    // Headlight glow
    const hlG = ctx.createRadialGradient(hlX, y + h * 0.58, 0, hlX, y + h * 0.58, 20);
    hlG.addColorStop(0, "rgba(255,248,180,0.7)");
    hlG.addColorStop(1, "rgba(255,248,180,0)");
    ctx.fillStyle = hlG;
    ctx.beginPath(); ctx.arc(hlX, y + h * 0.58, 20, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fffde7";
    ctx.beginPath(); ctx.arc(hlX, y + h * 0.58, 4, 0, Math.PI * 2); ctx.fill();

    // Taillight
    const tlX = dir > 0 ? x + 4 : x + w - 4;
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath(); ctx.arc(tlX, y + h * 0.58, 3, 0, Math.PI * 2); ctx.fill();

    // Bumper line
    ctx.strokeStyle = darken(col, 0.35);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 3, y + h * 0.48);
    ctx.lineTo(x + w - 3, y + h * 0.48);
    ctx.stroke();
  }

  // ── SMOG CLOUD ───────────────────────────────────────────────────────────────
  function drawCloud(ctx, z, t) {
    const blink = 0.62 + 0.14 * Math.sin(t * 1.9);
    // Three overlapping puffs
    const puffs = [
      { ox: 0.20, oy: 0.54, rx: 0.36, ry: 0.46 },
      { ox: 0.58, oy: 0.42, rx: 0.31, ry: 0.42 },
      { ox: 0.38, oy: 0.16, rx: 0.25, ry: 0.36 },
    ];
    ctx.save();
    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i];
      const cx = z.x + z.w * p.ox + Math.sin(t * 0.75 + i * 1.4) * 2.2;
      const cy = z.y + z.h * p.oy + Math.cos(t * 0.55 + i * 1.1) * 1.6;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, z.w * p.rx);
      g.addColorStop(0,    "rgba(105,93,80," + blink + ")");
      g.addColorStop(0.52, "rgba(82,70,58," + (blink * 0.72) + ")");
      g.addColorStop(1,    "rgba(65,54,44,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, cy, z.w * p.rx, z.h * p.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Danger ✕ symbol
    const ix = z.x + z.w * 0.44;
    const iy = z.y + z.h * 0.36;
    const r  = 5;
    ctx.strokeStyle = "rgba(231,76,60,0.6)";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(ix - r, iy - r); ctx.lineTo(ix + r, iy + r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ix + r, iy - r); ctx.lineTo(ix - r, iy + r); ctx.stroke();
    ctx.restore();
  }

  // ── SPIKE CLUSTER ────────────────────────────────────────────────────────────
  function drawSpike(ctx, z, t) {
    const count = Math.max(1, Math.round(z.w / 12));
    const sw    = z.w / count;
    const pulse = 0.22 + 0.1 * Math.sin(t * 5.2);

    for (let i = 0; i < count; i++) {
      const sx   = z.x + i * sw;
      const tipX = sx + sw * 0.5;
      const tipY = z.y;
      const botY = z.y + z.h;

      // Metal-to-blood gradient
      const sg = ctx.createLinearGradient(tipX, tipY, tipX, botY);
      sg.addColorStop(0,    "#d5d8dc"); // silver tip
      sg.addColorStop(0.28, "#c0392b"); // danger red
      sg.addColorStop(1,    "#5d1a14"); // dark base
      ctx.fillStyle = sg;

      ctx.beginPath();
      ctx.moveTo(tipX,          tipY);
      ctx.lineTo(sx + sw * 0.14, botY);
      ctx.lineTo(sx + sw * 0.86, botY);
      ctx.closePath();
      ctx.fill();

      // Left highlight edge
      ctx.strokeStyle = "rgba(255,255,255,0.38)";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(tipX,           tipY + 2);
      ctx.lineTo(sx + sw * 0.30, botY - 2);
      ctx.stroke();
    }

    // Glow pool at base
    ctx.fillStyle = "rgba(192,57,43," + pulse + ")";
    ctx.fillRect(z.x - 3, z.y + z.h - 3, z.w + 6, 5);

    // Hazard stripes
    for (let i = 0; i < 6; i++) {
      if (i % 2 === 0) {
        ctx.fillStyle = "rgba(231,76,60,0.42)";
        ctx.fillRect(z.x + i * (z.w / 6), z.y + z.h - 1, z.w / 6, 2);
      }
    }
  }

  // ── FLOOD / WATER ────────────────────────────────────────────────────────────
  function drawWater(ctx, z, t) {
    // Depth gradient
    const wg = ctx.createLinearGradient(z.x, z.y, z.x, z.y + z.h);
    wg.addColorStop(0, "rgba(41,128,185,0.82)");
    wg.addColorStop(1, "rgba(18,55,95,0.96)");
    ctx.fillStyle = wg;
    ctx.fillRect(z.x, z.y, z.w, z.h);

    // Animated surface wave
    ctx.strokeStyle = "rgba(133,193,233,0.88)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let xi = 0; xi <= z.w; xi += 3) {
      const wy = z.y + Math.sin((xi / z.w) * Math.PI * 4 + t * 5.5) * 1.8;
      xi === 0 ? ctx.moveTo(z.x + xi, wy) : ctx.lineTo(z.x + xi, wy);
    }
    ctx.stroke();

    // Foam crest
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.fillRect(z.x + 3, z.y + 1, z.w - 6, 2);

    // Sub-surface sheen
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(z.x + 4,     z.y + z.h * 0.62);
    ctx.lineTo(z.x + z.w - 4, z.y + z.h * 0.62);
    ctx.stroke();
  }

  // ── PATROL DRONE ─────────────────────────────────────────────────────────────
  // z.hard === true → militaristic red enforcement drone (patrol_hard)
  // z.hard === false/undefined → community policing drone (patrol_soft)
  function drawPatrol(ctx, z, t) {
    const hard  = !!z.hard;
    const cx    = z.x + z.w * 0.5;
    const cy    = z.y + z.h * 0.5;
    const bR    = z.w * 0.28;
    const arm   = z.w * 0.44;
    const pulse = 0.22 + 0.11 * Math.sin(t * 6.2);

    // Ambient glow — red for hard, purple for soft
    const glowCol = hard ? "rgba(192,57,43," : "rgba(155,89,182,";
    const glowG = ctx.createRadialGradient(cx, cy, 0, cx, cy, z.w * 0.8);
    glowG.addColorStop(0, glowCol + (pulse + 0.08) + ")");
    glowG.addColorStop(1, glowCol + "0)");
    ctx.fillStyle = glowG;
    ctx.beginPath(); ctx.arc(cx, cy, z.w * 0.8, 0, Math.PI * 2); ctx.fill();

    // Four arms + spinning rotors
    const strutW = hard ? 3.5 : 2.5; // hard drone has thicker arms
    for (let i = 0; i < 4; i++) {
      const aAng = i * Math.PI * 0.5 + Math.PI * 0.25;
      const ax   = cx + Math.cos(aAng) * arm;
      const ay   = cy + Math.sin(aAng) * arm;

      ctx.strokeStyle = hard ? "#4a1010" : "#566573";
      ctx.lineWidth = strutW;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ax, ay); ctx.stroke();

      ctx.strokeStyle = "rgba(189,195,199,0.9)";
      ctx.lineWidth = 1.5;
      for (let b = 0; b < 2; b++) {
        const ba = t * (hard ? 28 : 22) + b * Math.PI + aAng;
        ctx.beginPath();
        ctx.moveTo(ax + Math.cos(ba) * 8,           ay + Math.sin(ba) * 2.5);
        ctx.lineTo(ax + Math.cos(ba + Math.PI) * 8, ay + Math.sin(ba + Math.PI) * 2.5);
        ctx.stroke();
      }
    }

    // Body — hexagonal for soft, angular octagon for hard
    ctx.fillStyle = hard ? "#8b0000" : "#8e44ad";
    ctx.beginPath();
    const sides = hard ? 8 : 6;
    for (let i = 0; i < sides; i++) {
      const ha = i * (Math.PI * 2 / sides) + (hard ? Math.PI / 8 : 0);
      i === 0
        ? ctx.moveTo(cx + Math.cos(ha) * bR, cy + Math.sin(ha) * bR)
        : ctx.lineTo(cx + Math.cos(ha) * bR, cy + Math.sin(ha) * bR);
    }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = hard ? "#5c0000" : "#6c3483";
    ctx.lineWidth = hard ? 2 : 1.5;
    ctx.stroke();

    // Targeting crosshair on hard drones
    if (hard) {
      ctx.strokeStyle = "rgba(255,60,60,0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx - bR * 1.4, cy); ctx.lineTo(cx + bR * 1.4, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy - bR * 1.4); ctx.lineTo(cx, cy + bR * 1.4); ctx.stroke();
      ctx.strokeStyle = "rgba(255,60,60,0.35)";
      ctx.beginPath(); ctx.arc(cx, cy, bR * 0.72, 0, Math.PI * 2); ctx.stroke();
    }

    // LED eye — always red for hard, blinks for soft
    const blink = hard ? true : Math.sin(t * 9.5) > 0.25;
    ctx.fillStyle = blink ? (hard ? "#ff2020" : "#e74c3c") : "#922b21";
    ctx.beginPath(); ctx.arc(cx, cy, hard ? 5 : 4, 0, Math.PI * 2); ctx.fill();
    if (blink) {
      ctx.fillStyle = hard ? "rgba(255,30,30,0.45)" : "rgba(231,76,60,0.32)";
      ctx.beginPath(); ctx.arc(cx, cy, hard ? 11 : 9, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ── PAPER BALLOT ─────────────────────────────────────────────────────────────
  function drawPaper(ctx, z, t) {
    const rot = Math.sin(t * 2.5 + z.x * 0.013) * 0.18;
    const hw  = z.w * 0.5;
    const hh  = z.h * 0.5;

    ctx.save();
    ctx.translate(z.x + hw, z.y + hh);
    ctx.rotate(rot);

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    D.fillRoundRect(ctx, -hw + 2, -hh + 2, z.w, z.h, 2);

    // Paper body
    ctx.fillStyle = "#fdfefe";
    D.fillRoundRect(ctx, -hw, -hh, z.w, z.h, 2);

    // Fold crease
    ctx.strokeStyle = "rgba(189,195,199,0.55)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-hw + 5, hh * 0.25);
    ctx.lineTo( hw - 4, hh * 0.25);
    ctx.stroke();

    // Text lines
    ctx.fillStyle = "rgba(52,73,94,0.36)";
    for (let i = 0; i < 4; i++) {
      const ly = -hh + 4 + i * (z.h - 8) / 4;
      const lw = (i === 3) ? z.w * 0.48 : z.w - 8;
      ctx.fillRect(-hw + 4, ly, lw, 1.8);
    }

    // Green checkmark
    ctx.strokeStyle = "#27ae60";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-hw * 0.55, hh * 0.40);
    ctx.lineTo(-hw * 0.18, hh * 0.62);
    ctx.lineTo( hw * 0.42, -hh * 0.10);
    ctx.stroke();

    ctx.restore();
  }

  // ── TAX / INCOME BLOCK ───────────────────────────────────────────────────────
  function drawBlock(ctx, z, t, city) {
    const speed = Math.abs(z.vx || 0);

    // Motion trail
    if (speed > 1.5) {
      const dir = (z.vx || 0) > 0 ? -1 : 1;
      for (let i = 1; i <= 2; i++) {
        ctx.fillStyle = "rgba(241,196,15," + (0.11 / i) + ")";
        ctx.fillRect(z.x + dir * i * 12, z.y + z.h * 0.1, z.w, z.h * 0.8);
      }
    }

    // Floor shadow
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(z.x + 2, z.y + z.h, z.w, 4);

    // Body
    const bg = ctx.createLinearGradient(z.x, z.y, z.x, z.y + z.h);
    bg.addColorStop(0, "#f4d03f");
    bg.addColorStop(0.6, "#f1c40f");
    bg.addColorStop(1, "#d4ac0d");
    ctx.fillStyle = bg;
    D.fillRoundRect(ctx, z.x, z.y, z.w, z.h, 3);

    // Mid stripe
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(z.x, z.y + z.h * 0.38, z.w, z.h * 0.07);

    // Currency symbol — city-specific
    const sym = (city && CITY_CURRENCY[city.id]) || "$";
    ctx.fillStyle = "#6d4c0a";
    ctx.font = "bold " + Math.max(9, Math.round(z.h * 0.58)) + "px system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(sym, z.x + z.w * 0.5, z.y + z.h * 0.5);

    // Shine
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    D.fillRoundRect(ctx, z.x + 2, z.y + 2, z.w - 4, z.h * 0.27, 2);
  }

  // ── RENT / PRICE-TAG BILL ────────────────────────────────────────────────────
  // Urgent red moving notice — housing cost pressure hazard
  function drawBill(ctx, z, t, city) {
    const cur  = (city && CITY_CURRENCY[city.id]) || "$";
    const speed = Math.abs(z.vx || 0);

    // Motion blur ghost
    if (speed > 1.5) {
      const dir = (z.vx || 0) > 0 ? -1 : 1;
      ctx.fillStyle = "rgba(231,76,60,0.10)";
      ctx.fillRect(z.x + dir * 14, z.y + 2, z.w, z.h - 4);
    }

    // Drop shadow
    ctx.fillStyle = "rgba(0,0,0,0.20)";
    ctx.fillRect(z.x + 2, z.y + z.h, z.w, 3);

    // Body: urgent red-orange (immediately reads "danger")
    const bg = ctx.createLinearGradient(z.x, z.y, z.x, z.y + z.h);
    bg.addColorStop(0, "#ff4d4d");
    bg.addColorStop(0.55, "#e74c3c");
    bg.addColorStop(1,   "#c0392b");
    ctx.fillStyle = bg;
    D.fillRoundRect(ctx, z.x, z.y, z.w, z.h, 3);

    // Warning hazard stripes along bottom edge
    const strW = z.w / 5;
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 === 0 ? "rgba(255,193,7,0.92)" : "rgba(220,50,35,0.85)";
      ctx.fillRect(z.x + i * strW, z.y + z.h - 4, strW, 4);
    }

    // "RENT" overdue label — small but legible
    ctx.fillStyle = "rgba(255,255,255,0.82)";
    ctx.font = "bold 6px system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("RENT DUE", z.x + z.w * 0.5, z.y + 3);

    // Large currency symbol — the visual anchor
    const pulse = 1 + 0.06 * Math.sin(t * 4.5);
    ctx.save();
    ctx.translate(z.x + z.w * 0.5, z.y + z.h * 0.52);
    ctx.scale(pulse, pulse);
    ctx.fillStyle = "#fff";
    ctx.font = "bold " + Math.max(8, Math.round(z.h * 0.52)) + "px system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(cur, 0, 0);
    ctx.restore();

    // Top-face shine
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    D.fillRoundRect(ctx, z.x + 2, z.y + 2, z.w - 4, z.h * 0.28, 2);
  }

  // ── FALLING TEXTBOOK ─────────────────────────────────────────────────────────
  // Heavy academic hazard — falls from above, clearly not a jump aid
  function drawBook(ctx, z, t) {
    const rot = Math.sin(t * 1.6 + z.x * 0.009) * 0.13;
    const hw  = z.w * 0.5;
    const hh  = z.h * 0.5;

    ctx.save();
    ctx.translate(z.x + hw, z.y + hh);
    ctx.rotate(rot);

    // Cast shadow
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    D.fillRoundRect(ctx, -hw + 3, -hh + 3, z.w, z.h, 2);

    // Page block (right/top exposed edges — cream colour)
    ctx.fillStyle = "#e8dfd2";
    D.fillRoundRect(ctx, -hw + 4, -hh, z.w - 4, z.h, 2);

    // Cover — dark academic navy
    const cg = ctx.createLinearGradient(-hw, -hh, -hw, hh);
    cg.addColorStop(0,   "#1b3a6e");
    cg.addColorStop(0.5, "#1f4492");
    cg.addColorStop(1,   "#162e56");
    ctx.fillStyle = cg;
    D.fillRoundRect(ctx, -hw, -hh, z.w - 6, z.h, 3);

    // Spine crease line
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-hw + 6, -hh + 3);
    ctx.lineTo(-hw + 6, hh - 3);
    ctx.stroke();

    // Cover title bar lines
    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.fillRect(-hw + 10, -hh * 0.5,  z.w * 0.46, 2.5);
    ctx.fillStyle = "rgba(255,255,255,0.38)";
    ctx.fillRect(-hw + 10, -hh * 0.18, z.w * 0.36, 1.5);
    ctx.fillRect(-hw + 10,  hh * 0.08, z.w * 0.40, 1.5);

    // Page layering lines on exposed edge
    ctx.strokeStyle = "rgba(160,140,110,0.55)";
    ctx.lineWidth = 0.9;
    for (let i = 0; i < 5; i++) {
      const ly = -hh + (i + 1) * (z.h / 6);
      ctx.beginPath();
      ctx.moveTo(hw - 7, ly);
      ctx.lineTo(hw, ly);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ── WIND TURBINE BLADE ROTOR ─────────────────────────────────────────────────
  function drawBlade(ctx, z, t) {
    const cx = z.x;
    const cy = z.y;
    const r  = z.r || 48;

    // Tower pole
    const pg = ctx.createLinearGradient(cx - 4, cy, cx + 4, cy);
    pg.addColorStop(0, "#bdc3c7");
    pg.addColorStop(0.5, "#ecf0f1");
    pg.addColorStop(1, "#95a5a6");
    ctx.fillStyle = pg;
    ctx.fillRect(cx - 3.5, cy, 7, r * 0.9);

    // Hub glow
    const hg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 20);
    hg.addColorStop(0, "rgba(90,195,240,0.48)");
    hg.addColorStop(1, "rgba(90,195,240,0)");
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.fill();

    // Three blades
    for (let k = 0; k < 3; k++) {
      const ang = z.ang + (k * Math.PI * 2) / 3;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ang);

      const bl = ctx.createLinearGradient(0, 0, r, 0);
      bl.addColorStop(0,   "rgba(220,232,242,0.98)");
      bl.addColorStop(0.6, "rgba(188,210,228,0.88)");
      bl.addColorStop(1,   "rgba(155,182,202,0.30)");
      ctx.fillStyle = bl;
      ctx.beginPath();
      ctx.ellipse(r * 0.5, 0, r * 0.5, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Leading edge line
      ctx.strokeStyle = "rgba(100,140,170,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(r, 0); ctx.stroke();

      ctx.restore();
    }

    // Hub cap
    ctx.fillStyle = "#7f8c8d";
    ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#95a5a6";
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
  }

  // ── INSTITUTIONAL GATE ───────────────────────────────────────────────────────
  function drawGate(ctx, z, t) {
    const open = z._open != null ? z._open : 0.5;
    if (open > 0.88) return; // invisible when fully open

    const closed = 1 - open;
    ctx.save();
    ctx.globalAlpha = 0.38 + closed * 0.52;

    const barCount = 4;
    const gap = (z.w - barCount * 4) / (barCount + 1);

    // Side posts
    ctx.fillStyle = "#7f8c8d";
    ctx.fillRect(z.x - 5, z.y, 5, z.h);
    ctx.fillRect(z.x + z.w, z.y, 5, z.h);

    // Top crossbar
    ctx.fillStyle = "#95a5a6";
    ctx.fillRect(z.x - 4, z.y, z.w + 8, 5);

    // Bars
    for (let i = 0; i < barCount; i++) {
      const bx = z.x + gap + i * (4 + gap);

      // Bar with sheen
      const bg2 = ctx.createLinearGradient(bx, 0, bx + 4, 0);
      bg2.addColorStop(0,   "#6d7b8a");
      bg2.addColorStop(0.5, "#bdc3c7");
      bg2.addColorStop(1,   "#6d7b8a");
      ctx.fillStyle = bg2;
      ctx.fillRect(bx, z.y + 5, 4, z.h - 5);

      // Spike top
      ctx.fillStyle = "#c0392b";
      ctx.beginPath();
      ctx.moveTo(bx + 2, z.y - 9);
      ctx.lineTo(bx,     z.y + 5);
      ctx.lineTo(bx + 4, z.y + 5);
      ctx.closePath();
      ctx.fill();
    }

    // Red pulse warning when near-closed
    if (open < 0.30) {
      const pulse = 0.16 + Math.sin(t * 10) * 0.1;
      ctx.fillStyle = "rgba(231,76,60," + pulse + ")";
      ctx.fillRect(z.x, z.y, z.w, z.h);
    }

    ctx.restore();
  }

  // ── Public API ────────────────────────────────────────────────────────────────
  D.drawHazard = function (ctx, z, t, city) {
    ctx.save();
    switch (z.kind) {
      case "car":    drawCar(ctx, z, t, city);    break;
      case "cloud":  drawCloud(ctx, z, t);         break;
      case "spike":  drawSpike(ctx, z, t);         break;
      case "water":  drawWater(ctx, z, t);         break;
      case "patrol": drawPatrol(ctx, z, t);        break;
      case "paper":  drawPaper(ctx, z, t);         break;
      case "block":  drawBlock(ctx, z, t, city);   break;
      case "blade":  drawBlade(ctx, z, t);         break;
      case "gate":   drawGate(ctx, z, t);          break;
      case "bill":   drawBill(ctx, z, t, city);    break;
      case "book":   drawBook(ctx, z, t);          break;
    }
    ctx.restore();
  };
})();
