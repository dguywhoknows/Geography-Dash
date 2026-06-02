/**
 * Geography Dash - decoration engine core (RNG, color, parallax, culling).
 */
(function () {
  "use strict";

  const D = (window.GD_DECO = window.GD_DECO || {});

  D.clamp = function (v, a, b) {
    return Math.max(a, Math.min(b, v));
  };

  D.lerp = function (a, b, t) {
    return a + (b - a) * t;
  };

  D.parallaxX = function (x, cam, factor) {
    return x - cam * factor;
  };

  D.seeded = function (seed) {
    let s = seed >>> 0;
    return function () {
      s = (s * 1103515245 + 12345) >>> 0;
      return (s >>> 0) / 4294967296;
    };
  };

  D.hashStr = function (str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
  };

  D.rgba = function (r, g, b, a) {
    return "rgba(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + "," + a + ")";
  };

  D.mix = function (c1, c2, t) {
    const a = parseInt(c1.slice(1, 3), 16);
    const b = parseInt(c1.slice(3, 5), 16);
    const c = parseInt(c1.slice(5, 7), 16);
    const a2 = parseInt(c2.slice(1, 3), 16);
    const b2 = parseInt(c2.slice(3, 5), 16);
    const c2v = parseInt(c2.slice(5, 7), 16);
    const r = Math.round(D.lerp(a, a2, t));
    const g = Math.round(D.lerp(b, b2, t));
    const bl = Math.round(D.lerp(c, c2v, t));
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1)
    );
  };

  D.visible = function (x, w, cam, viewW, pad) {
    pad = pad || 120;
    return x + w > cam - pad && x < cam + viewW + pad;
  };

  D.roundRect = function (ctx, x, y, w, h, r) {
    r = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  D.fillRoundRect = function (ctx, x, y, w, h, r) {
    D.roundRect(ctx, x, y, w, h, r);
    ctx.fill();
  };

  D.strokeRoundRect = function (ctx, x, y, w, h, r) {
    D.roundRect(ctx, x, y, w, h, r);
    ctx.stroke();
  };

  /** Soft horizontal band for hills / smog */
  D.softBand = function (ctx, x0, y, w, h, colorTop, colorMid, colorBot) {
    const g = ctx.createLinearGradient(x0, y, x0, y + h);
    g.addColorStop(0, colorTop);
    g.addColorStop(0.45, colorMid);
    g.addColorStop(1, colorBot);
    ctx.fillStyle = g;
    ctx.fillRect(x0, y, w, h);
  };

  /** Deterministic window grid on a facade */
  D.facadeWindows = function (ctx, bx, by, bw, bh, seed, opts) {
    opts = opts || {};
    const cols = opts.cols || Math.max(2, Math.floor(bw / 14));
    const rows = opts.rows || Math.max(2, Math.floor(bh / 18));
    const padX = opts.padX || 5;
    const padY = opts.padY || 8;
    const ww = (bw - padX * 2) / cols - 3;
    const wh = (bh - padY * 2) / rows - 4;
    const litChance = opts.litChance != null ? opts.litChance : 0.35;
    const litColor = opts.litColor || "rgba(255,230,160,0.75)";
    const darkColor = opts.darkColor || "rgba(20,30,45,0.55)";
    const frameColor = opts.frameColor || "rgba(0,0,0,0.2)";
    let s = seed >>> 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        s = (s * 1103515245 + 12345) >>> 0;
        const wx = bx + padX + c * (ww + 3);
        const wy = by + padY + r * (wh + 4);
        const lit = (s >>> 8) % 100 < litChance * 100;
        ctx.fillStyle = lit ? litColor : darkColor;
        ctx.fillRect(wx, wy, ww, wh);
        ctx.strokeStyle = frameColor;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(wx, wy, ww, wh);
        if (lit && wh > 8) {
          ctx.fillStyle = "rgba(255,255,255,0.15)";
          ctx.fillRect(wx + 1, wy + 1, ww * 0.4, wh * 0.35);
        }
      }
    }
  };

  D.roofGable = function (ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.08, y);
    ctx.lineTo(x + w * 0.5, y - h);
    ctx.lineTo(x + w * 1.08, y);
    ctx.closePath();
    ctx.fill();
  };

  D.roofFlat = function (ctx, x, y, w, h, color, parapet) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y - h, w, h);
    if (parapet) {
      ctx.fillStyle = parapet;
      ctx.fillRect(x, y - h, w, 4);
    }
  };

  D.antenna = function (ctx, x, y, h, sc) {
    sc = sc || 1;
    ctx.strokeStyle = "rgba(80,90,100,0.7)";
    ctx.lineWidth = 1.5 * sc;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - h);
    ctx.stroke();
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(x, y - h, 2 * sc, 0, Math.PI * 2);
    ctx.fill();
  };

  D.powerLine = function (ctx, x0, y0, x1, y1, sag) {
    ctx.strokeStyle = "rgba(40,45,55,0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo((x0 + x1) * 0.5, y0 + sag, x1, y1);
    ctx.stroke();
  };
})();
