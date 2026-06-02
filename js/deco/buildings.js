/**
 * Procedural facade system - detailed buildings with roofs, windows, ornaments.
 */
(function () {
  "use strict";

  const D = window.GD_DECO;
  if (!D) return;

  const B = (D.buildings = {});

  const STYLES = {
    nordic: { wall: "#8fa4b8", trim: "#6c7f92", roof: "#4a5568", lit: 0.42, roofType: "gable" },
    brick: { wall: "#a0522d", trim: "#6d3b1f", roof: "#3e2723", lit: 0.28, roofType: "gable" },
    glass: { wall: "#5d6d7e", trim: "#3498db", roof: "#2c3e50", lit: 0.55, roofType: "flat" },
    colonial: { wall: "#d7ccc8", trim: "#8d6e63", roof: "#5d4037", lit: 0.32, roofType: "gable" },
    brutalist: { wall: "#7f8c8d", trim: "#566573", roof: "#566573", lit: 0.18, roofType: "flat" },
    artdeco: { wall: "#c9a86c", trim: "#8d6e3a", roof: "#5d4e37", lit: 0.38, roofType: "step" },
    tropical: { wall: "#f5cba7", trim: "#d68910", roof: "#922b21", lit: 0.25, roofType: "gable" },
    mosque: { wall: "#eaecee", trim: "#d4ac6e", roof: "#d4ac6e", lit: 0.2, roofType: "dome" },
    temple: { wall: "#c0392b", trim: "#f1c40f", roof: "#922b21", lit: 0.15, roofType: "spire" },
    highrise: { wall: "#566573", trim: "#2c3e50", roof: "#1a252f", lit: 0.48, roofType: "flat" },
    shanty: { wall: "#6d4c41", trim: "#4e342e", roof: "#3e2723", lit: 0.12, roofType: "sheet" },
    warehouse: { wall: "#95a5a6", trim: "#7f8c8d", roof: "#5d6d7e", lit: 0.08, roofType: "flat" },
  };

  B.pickStyle = function (seed, pool) {
    pool = pool || Object.keys(STYLES);
    return pool[seed % pool.length];
  };

  B.draw = function (ctx, x, yBase, w, h, styleKey, seed, time) {
    const st = STYLES[styleKey] || STYLES.brick;
    const wallX = x;
    const wallY = yBase - h;
    const shadow = ctx.createLinearGradient(wallX, wallY, wallX + w, wallY);
    shadow.addColorStop(0, "rgba(0,0,0,0.12)");
    shadow.addColorStop(0.5, st.wall);
    shadow.addColorStop(1, "rgba(0,0,0,0.18)");
    ctx.fillStyle = shadow;
    ctx.fillRect(wallX, wallY, w, h);

    ctx.fillStyle = st.trim;
    ctx.fillRect(wallX, wallY, 3, h);
    ctx.fillRect(wallX + w - 3, wallY, 3, h);
    ctx.fillRect(wallX, wallY + h - 6, w, 6);

    D.facadeWindows(ctx, wallX + 4, wallY + 8, w - 8, h - 18, seed, {
      litChance: st.lit + 0.08 * Math.sin((time || 0) * 0.4 + seed),
      litColor: styleKey === "glass" ? "rgba(120,200,255,0.65)" : "rgba(255,230,160,0.72)",
    });

    if (st.roofType === "gable") {
      D.roofGable(ctx, wallX, wallY, w, 22 + (seed % 12), st.roof);
    } else if (st.roofType === "flat") {
      D.roofFlat(ctx, wallX, wallY, w, 8, st.roof, st.trim);
      if (h > 90 && seed % 3 === 0) {
        ctx.fillStyle = "rgba(180,190,200,0.35)";
        ctx.fillRect(wallX + w * 0.2, wallY - 14, w * 0.25, 12);
        ctx.fillRect(wallX + w * 0.55, wallY - 10, w * 0.2, 8);
      }
    } else if (st.roofType === "step") {
      for (let s = 0; s < 3; s++) {
        const inset = s * 6;
        ctx.fillStyle = D.mix(st.roof, st.trim, s * 0.2);
        ctx.fillRect(wallX + inset, wallY - 10 - s * 8, w - inset * 2, 10);
      }
    } else if (st.roofType === "dome") {
      ctx.fillStyle = st.roof;
      ctx.beginPath();
      ctx.arc(wallX + w * 0.5, wallY, w * 0.35, Math.PI, 0);
      ctx.lineTo(wallX + w * 0.85, wallY);
      ctx.lineTo(wallX + w * 0.15, wallY);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#f4d03f";
      ctx.beginPath();
      ctx.arc(wallX + w * 0.5, wallY - w * 0.12, w * 0.08, 0, Math.PI * 2);
      ctx.fill();
    } else if (st.roofType === "spire") {
      ctx.fillStyle = st.roof;
      ctx.beginPath();
      ctx.moveTo(wallX + w * 0.5, wallY - h * 0.35);
      ctx.lineTo(wallX + w * 0.85, wallY);
      ctx.lineTo(wallX + w * 0.15, wallY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = st.trim;
      ctx.lineWidth = 2;
      ctx.stroke();
    } else if (st.roofType === "sheet") {
      ctx.fillStyle = st.roof;
      ctx.beginPath();
      ctx.moveTo(wallX, wallY);
      ctx.lineTo(wallX + w * 0.3, wallY - 14);
      ctx.lineTo(wallX + w * 0.7, wallY - 10);
      ctx.lineTo(wallX + w, wallY);
      ctx.closePath();
      ctx.fill();
    }

    if (seed % 5 === 0 && h > 70) D.antenna(ctx, wallX + w * 0.75, wallY, 28 + (seed % 20), 1);
    if (seed % 7 === 0) {
      ctx.fillStyle = "#7f8c8d";
      ctx.fillRect(wallX + w - 12, wallY + h - 28, 8, 10);
    }
    if (styleKey === "nordic" && seed % 2 === 0) {
      ctx.fillStyle = "#c0392b";
      ctx.fillRect(wallX + w * 0.42, wallY + h - 22, 10, 16);
    }
  };

  B.row = function (ctx, x0, x1, yBase, cam, parallax, seed, stylePool, hMin, hMax, winLayer) {
    let x = x0;
    let s = seed >>> 0;
    while (x < x1) {
      s = (s * 1103515245 + 12345) >>> 0;
      const w = 32 + (s % 48);
      const h = hMin + ((s >>> 8) % (hMax - hMin));
      const px = D.parallaxX(x, cam, parallax);
      if (px + w > -100 && px < x1 - x0 + 220) {
        const style = B.pickStyle(s, stylePool);
        B.draw(ctx, px, yBase, w, h, style, s, winLayer || 0);
      }
      x += w + 8 + (s % 18);
    }
  };

  B.landmarkCnTower = function (ctx, x, yb, sc) {
    sc = sc || 1;
    const grad = ctx.createLinearGradient(x, yb - 170 * sc, x, yb);
    grad.addColorStop(0, "#ecf0f1");
    grad.addColorStop(1, "#bdc3c7");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x - 10 * sc, yb);
    ctx.lineTo(x - 5 * sc, yb - 165 * sc);
    ctx.lineTo(x + 5 * sc, yb - 165 * sc);
    ctx.lineTo(x + 10 * sc, yb);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 7; i++) {
      const yy = yb - 28 * sc - i * 20 * sc;
      ctx.strokeStyle = "rgba(52,73,94,0.35)";
      ctx.lineWidth = 2 * sc;
      ctx.beginPath();
      ctx.moveTo(x - 11 * sc, yy);
      ctx.lineTo(x + 11 * sc, yy);
      ctx.stroke();
    }
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(x, yb - 172 * sc, 6 * sc, 0, Math.PI * 2);
    ctx.fill();
    const glow = ctx.createRadialGradient(x, yb - 172 * sc, 0, x, yb - 172 * sc, 40 * sc);
    glow.addColorStop(0, "rgba(231,76,60,0.35)");
    glow.addColorStop(1, "rgba(231,76,60,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, yb - 172 * sc, 40 * sc, 0, Math.PI * 2);
    ctx.fill();
  };

  B.landmarkDome = function (ctx, x, yb, sc) {
    sc = sc || 1;
    ctx.fillStyle = "#d4ac6e";
    ctx.beginPath();
    ctx.arc(x, yb - 30 * sc, 34 * sc, Math.PI, 0);
    ctx.lineTo(x + 34 * sc, yb);
    ctx.lineTo(x - 34 * sc, yb);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 2;
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const a = Math.PI + (i / 8) * Math.PI;
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.beginPath();
      ctx.moveTo(x, yb - 30 * sc);
      ctx.lineTo(x + Math.cos(a) * 34 * sc, yb - 30 * sc + Math.sin(a) * 20 * sc);
      ctx.stroke();
    }
    ctx.fillStyle = "#f4d03f";
    ctx.beginPath();
    ctx.arc(x, yb - 30 * sc, 9 * sc, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#eaecee";
    ctx.fillRect(x - 38 * sc, yb - 8 * sc, 76 * sc, 10 * sc);
  };

  B.landmarkMinaret = function (ctx, x, yb, sc) {
    sc = sc || 1;
    const g = ctx.createLinearGradient(x, yb - 110 * sc, x, yb);
    g.addColorStop(0, "#fdfefe");
    g.addColorStop(1, "#d5d8dc");
    ctx.fillStyle = g;
    ctx.fillRect(x - 9 * sc, yb - 105 * sc, 18 * sc, 105 * sc);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = "#bdc3c7";
      ctx.fillRect(x - 15 * sc, yb - 100 * sc + i * 20 * sc, 30 * sc, 5 * sc);
    }
    ctx.fillStyle = "#eaecee";
    ctx.beginPath();
    ctx.moveTo(x - 11 * sc, yb - 112 * sc);
    ctx.lineTo(x, yb - 135 * sc);
    ctx.lineTo(x + 11 * sc, yb - 112 * sc);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f4d03f";
    ctx.beginPath();
    ctx.arc(x, yb - 138 * sc, 4 * sc, 0, Math.PI * 2);
    ctx.fill();
  };

  B.landmarkTemple = function (ctx, x, yb, sc) {
    sc = sc || 1;
    for (let tier = 0; tier < 5; tier++) {
      const tw = (40 - tier * 5) * sc;
      ctx.fillStyle = tier % 2 ? "#922b21" : "#c0392b";
      ctx.fillRect(x - tw * 0.5, yb - tier * 14 * sc - 14 * sc, tw, 12 * sc);
      ctx.strokeStyle = "#f1c40f";
      ctx.lineWidth = 1.5 * sc;
      ctx.strokeRect(x - tw * 0.5, yb - tier * 14 * sc - 14 * sc, tw, 12 * sc);
    }
    ctx.fillStyle = "#c0392b";
    ctx.beginPath();
    ctx.moveTo(x, yb - 95 * sc);
    ctx.lineTo(x + 24 * sc, yb);
    ctx.lineTo(x - 24 * sc, yb);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 3 * sc;
    ctx.stroke();
  };

  B.landmarkLotus = function (ctx, x, yb, sc) {
    sc = sc || 1;
    ctx.fillStyle = "rgba(236,240,241,0.95)";
    for (let p = 0; p < 12; p++) {
      const a = (p / 12) * Math.PI * 2;
      const rx = 22 * sc * (0.65 + 0.35 * Math.sin(a * 4));
      ctx.beginPath();
      ctx.ellipse(
        x + Math.cos(a) * rx * 0.3,
        yb - 42 * sc + Math.sin(a) * 14 * sc,
        rx,
        10 * sc,
        a,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.fillStyle = "#bdc3c7";
    ctx.fillRect(x - 7 * sc, yb - 22 * sc, 14 * sc, 24 * sc);
    ctx.fillStyle = "rgba(52,152,219,0.35)";
    ctx.fillRect(x - 50 * sc, yb, 100 * sc, 8 * sc);
  };

  B.landmarkWindTurbine = function (ctx, x, yb, sc, t) {
    sc = sc || 1;
    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(x - 3 * sc, yb - 125 * sc, 6 * sc, 125 * sc);
    ctx.fillStyle = "#95a5a6";
    ctx.beginPath();
    ctx.arc(x, yb - 120 * sc, 6 * sc, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.translate(x, yb - 120 * sc);
    ctx.rotate((t || 0) * 0.85);
    for (let b = 0; b < 3; b++) {
      ctx.rotate((Math.PI * 2) / 3);
      const bg = ctx.createLinearGradient(0, 0, 28 * sc, 0);
      bg.addColorStop(0, "rgba(236,240,241,0.95)");
      bg.addColorStop(1, "rgba(200,210,220,0.7)");
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.ellipse(24 * sc, 0, 28 * sc, 4 * sc, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };
})();
