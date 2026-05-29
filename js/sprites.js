/**
 * Props + player: procedural drawing by default.
 *
 * Optional PNG spritesheet (set window.GD_SPRITE_ATLAS before scripts load):
 *   { imageUrl: "assets/spritesheet.png", manifestUrl: "assets/spritesheet.json" }
 * Manifest JSON: { "image": "spritesheet.png", "frames": { "player": {x,y,w,h}, "hazard_car": {...} } }
 * Frame ids used in-game: player (or player_idle), hazard_car, hazard_cloud, hazard_spike, hazard_water,
 * hazard_patrol, hazard_paper, hazard_block, hazard_gate, hazard_blade.
 *
 * Without manifest, pass frames: { ... } or grid: { cellW, cellH, cols, rows, names: ["player", ...] }.
 */
(function () {
  "use strict";

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  const S = {};
  S._atlas = { img: null, frames: null, loaded: false, error: null };

  function dirnameOfUrl(u) {
    const i = u.lastIndexOf("/");
    return i >= 0 ? u.slice(0, i + 1) : "";
  }

  function mergeFrames(a, b) {
    const o = Object.assign({}, a || {});
    if (b) {
      Object.keys(b).forEach(function (k) {
        o[k] = b[k];
      });
    }
    return o;
  }

  function normalizeFrame(v) {
    if (!v) return null;
    if (Array.isArray(v) && v.length >= 4) {
      return { x: v[0], y: v[1], w: v[2], h: v[3] };
    }
    if (typeof v.x === "number" && typeof v.y === "number" && typeof v.w === "number" && typeof v.h === "number") {
      return { x: v.x, y: v.y, w: v.w, h: v.h };
    }
    return null;
  }

  function normalizeFrames(obj) {
    const out = {};
    if (!obj) return out;
    Object.keys(obj).forEach(function (k) {
      const n = normalizeFrame(obj[k]);
      if (n) out[k] = n;
    });
    return out;
  }

  function framesFromGrid(grid) {
    const cw = grid.cellW | 0;
    const ch = grid.cellH | 0;
    const cols = grid.cols | 0;
    const rows = grid.rows | 0;
    const names = grid.names || [];
    const fw = grid.frameW || cw;
    const fh = grid.frameH || ch;
    const out = {};
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = names[n++];
        if (!id) continue;
        out[id] = { x: c * cw, y: r * ch, w: fw, h: fh };
      }
    }
    return out;
  }

  S.drawAtlasFrame = function (ctx, frameId, dx, dy, dw, dh, flipX) {
    const fr = S._atlas.frames && S._atlas.frames[frameId];
    const img = S._atlas.img;
    if (!fr || !img || !img.complete || img.naturalWidth === 0) return false;
    if (flipX) {
      ctx.save();
      ctx.translate(dx + dw, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(img, fr.x, fr.y, fr.w, fr.h, 0, 0, dw, dh);
      ctx.restore();
    } else {
      ctx.drawImage(img, fr.x, fr.y, fr.w, fr.h, dx, dy, dw, dh);
    }
    return true;
  };

  /**
   * @returns {boolean} true if drawn from atlas (caller skips fallback)
   */
  S.drawHazardFromAtlas = function (ctx, z) {
    if (!S._atlas || !S._atlas.img || !S._atlas.frames) return false;
    const img = S._atlas.img;
    if (!img.complete || img.naturalWidth === 0) return false;
    const fmap = {
      car: "hazard_car",
      cloud: "hazard_cloud",
      spike: "hazard_spike",
      water: "hazard_water",
      patrol: "hazard_patrol",
      paper: "hazard_paper",
      block: "hazard_block",
      gate: "hazard_gate",
      blade: "hazard_blade",
    };
    const key = fmap[z.kind];
    if (!key || !S._atlas.frames[key]) return false;
    const fr = S._atlas.frames[key];
    if (z.kind === "blade") {
      ctx.save();
      ctx.translate(z.x, z.y);
      ctx.rotate(z.ang || 0);
      ctx.drawImage(img, fr.x, fr.y, fr.w, fr.h, -z.w * 0.5, -z.h * 0.5, z.w, z.h);
      ctx.restore();
      return true;
    }
    if (z.kind === "gate") {
      const open = z._open != null ? z._open : 0.5;
      ctx.save();
      ctx.globalAlpha = 0.35 + (1 - open) * 0.45;
      ctx.drawImage(img, fr.x, fr.y, fr.w, fr.h, z.x, z.y, z.w, z.h);
      ctx.restore();
      return true;
    }
    ctx.drawImage(img, fr.x, fr.y, fr.w, fr.h, z.x, z.y, z.w, z.h);
    return true;
  };

  S.loadAtlas = function (callback) {
    callback = callback || function () {};
    const cfg = window.GD_SPRITE_ATLAS;
    if (!cfg || !cfg.imageUrl) {
      S._atlas = { img: null, frames: null, loaded: false, error: null };
      callback(false);
      return;
    }
    let frames = normalizeFrames(mergeFrames({}, cfg.frames));
    if (cfg.grid) {
      frames = mergeFrames(frames, framesFromGrid(cfg.grid));
    }

    function finishWithImage(imageUrl) {
      const img = new Image();
      img.onload = function () {
        S._atlas = { img: img, frames: frames, loaded: true, error: null };
        callback(true);
      };
      img.onerror = function () {
        S._atlas = { img: null, frames: null, loaded: false, error: "image" };
        callback(false);
      };
      img.src = imageUrl;
    }

    if (cfg.manifestUrl) {
      fetch(cfg.manifestUrl)
        .then(function (r) {
          if (!r.ok) throw new Error("manifest");
          return r.json();
        })
        .then(function (data) {
          const dir = dirnameOfUrl(cfg.manifestUrl);
          let imageUrl = cfg.imageUrl;
          if (data && data.image) {
            const di = data.image;
            imageUrl =
              di.indexOf("://") >= 0 || di.charAt(0) === "/" ? di : dir + di;
          }
          if (data && data.frames) {
            frames = mergeFrames(frames, normalizeFrames(data.frames));
          }
          finishWithImage(imageUrl);
        })
        .catch(function () {
          finishWithImage(cfg.imageUrl);
        });
    } else {
      finishWithImage(cfg.imageUrl);
    }
  };

  const PLAYER_DRAW_W = 28;
  const PLAYER_DRAW_H = 44;

  S.player = function (ctx, x, y, facing) {
    // Prefer the atlas sprite if loaded
    const fr = S._atlas && S._atlas.frames;
    const useAtlas =
      S._atlas &&
      S._atlas.img &&
      fr &&
      (fr.player || fr.player_idle) &&
      S._atlas.img.complete &&
      S._atlas.img.naturalWidth > 0;
    if (useAtlas) {
      const id = fr.player ? "player" : "player_idle";
      S.drawAtlasFrame(ctx, id, x, y, PLAYER_DRAW_W, PLAYER_DRAW_H, facing < 0);
      return;
    }
    // Prefer the detailed procedural player from deco/player.js
    if (window.GD_DECO && typeof window.GD_DECO.drawPlayer === "function") {
      // S.player is called with (ctx, x, y, facing) but drawPlayer needs (ctx, p, t, city)
      // Build a minimal player state object so drawPlayer works correctly
      window.GD_DECO.drawPlayer(ctx,
        { x: x, y: y, facing: facing, vx: 0, vy: 0, onGround: true },
        (window._GD_game && window._GD_game.time) || 0,
        (window._GD_game && window._GD_game.currentCity) || null
      );
      return;
    }
    // Last-resort minimal blob fallback
    ctx.save();
    ctx.translate(x + 14, y + 22);
    if (facing < 0) ctx.scale(-1, 1);
    ctx.fillStyle = "#1a5c4a";
    ctx.beginPath();
    ctx.ellipse(0, 6, 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2ecc71";
    ctx.beginPath();
    ctx.arc(0, -10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillRect(3, -14, 4, 3);
    ctx.fillRect(-7, -14, 4, 3);
    ctx.restore();
  };

  S.bench = function (ctx, x, yb, sc) {
    const w = 56 * sc;
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(x - w * 0.5, yb - 8 * sc, w, 8 * sc);
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(x - w * 0.5 - 4 * sc, yb - 22 * sc, 6 * sc, 22 * sc);
    ctx.fillRect(x + w * 0.5 - 2 * sc, yb - 22 * sc, 6 * sc, 22 * sc);
  };

  S.bike_rack = function (ctx, x, yb, sc) {
    ctx.strokeStyle = "#bdc3c7";
    ctx.lineWidth = 3 * sc;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(x + i * 14 * sc, yb - 18 * sc, 12 * sc, Math.PI, 0);
      ctx.stroke();
    }
    ctx.fillStyle = "#7f8c8d";
    ctx.fillRect(x - 24 * sc, yb - 4 * sc, 48 * sc, 4 * sc);
  };

  S.wind_turbine = function (ctx, x, yb, sc, t) {
    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(x - 3 * sc, yb - 120 * sc, 6 * sc, 120 * sc);
    ctx.save();
    ctx.translate(x, yb - 115 * sc);
    ctx.rotate((t || 0) * 0.8);
    ctx.fillStyle = "rgba(236,240,241,0.9)";
    for (let i = 0; i < 3; i++) {
      ctx.rotate((Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.ellipse(22 * sc, 0, 26 * sc, 4 * sc, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.fillStyle = "#95a5a6";
    ctx.beginPath();
    ctx.arc(x, yb - 115 * sc, 5 * sc, 0, Math.PI * 2);
    ctx.fill();
  };

  S.nyhavn_house = function (ctx, x, yb, sc) {
    const w = 44 * sc;
    const h = 70 * sc;
    const colors = ["#c0392b", "#f39c12", "#2980b9", "#8e44ad"];
    ctx.fillStyle = colors[(Math.floor(x / 17) % 4 + 4) % 4];
    ctx.fillRect(x - w * 0.5, yb - h, w, h);
    ctx.fillStyle = "#2c1810";
    ctx.beginPath();
    ctx.moveTo(x - w * 0.55, yb - h);
    ctx.lineTo(x, yb - h - 22 * sc);
    ctx.lineTo(x + w * 0.55, yb - h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fef5e7";
    ctx.fillRect(x - w * 0.35, yb - h * 0.55, 10 * sc, 14 * sc);
    ctx.fillRect(x + w * 0.05, yb - h * 0.4, 10 * sc, 12 * sc);
  };

  S.canal_water = function (ctx, x0, x1, y, wave) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y, x1 - x0, 200);
    ctx.clip();
    const grd = ctx.createLinearGradient(0, y - 30, 0, y + 40);
    grd.addColorStop(0, "rgba(52, 152, 219,0.45)");
    grd.addColorStop(1, "rgba(41, 128, 185,0.75)");
    ctx.fillStyle = grd;
    ctx.fillRect(x0, y - 20, x1 - x0, 80);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      const ox = x0 + i * 80 + (wave || 0) * 40;
      ctx.beginPath();
      ctx.moveTo(ox, y + 4);
      ctx.quadraticCurveTo(ox + 20, y - 2, ox + 40, y + 4);
      ctx.stroke();
    }
    ctx.restore();
  };

  S.cn_tower = function (ctx, x, yb, sc) {
    ctx.fillStyle = "#ecf0f1";
    ctx.beginPath();
    ctx.moveTo(x - 9 * sc, yb);
    ctx.lineTo(x - 4 * sc, yb - 160 * sc);
    ctx.lineTo(x + 4 * sc, yb - 160 * sc);
    ctx.lineTo(x + 9 * sc, yb);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 6; i++) {
      const yy = yb - 30 * sc - i * 22 * sc;
      ctx.strokeStyle = "rgba(52,73,94,0.4)";
      ctx.lineWidth = 2 * sc;
      ctx.beginPath();
      ctx.moveTo(x - 10 * sc, yy);
      ctx.lineTo(x + 10 * sc, yy);
      ctx.stroke();
    }
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.arc(x, yb - 168 * sc, 5 * sc, 0, Math.PI * 2);
    ctx.fill();
  };

  S.streetcar = function (ctx, x, yb, sc) {
    ctx.fillStyle = "#c0392b";
    ctx.fillRect(x - 40 * sc, yb - 34 * sc, 80 * sc, 28 * sc);
    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(x - 32 * sc, yb - 28 * sc, 22 * sc, 12 * sc);
    ctx.fillRect(x + 6 * sc, yb - 28 * sc, 22 * sc, 12 * sc);
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(x - 38 * sc, yb - 8 * sc, 76 * sc, 6 * sc);
  };

  S.ferry = function (ctx, x, yb, sc) {
    ctx.fillStyle = "#fdfefe";
    ctx.fillRect(x - 50 * sc, yb - 28 * sc, 100 * sc, 22 * sc);
    ctx.fillStyle = "#3498db";
    ctx.beginPath();
    ctx.moveTo(x - 55 * sc, yb - 6 * sc);
    ctx.lineTo(x + 55 * sc, yb - 6 * sc);
    ctx.lineTo(x + 45 * sc, yb + 8 * sc);
    ctx.lineTo(x - 45 * sc, yb + 8 * sc);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#c0392b";
    ctx.fillRect(x - 8 * sc, yb - 48 * sc, 16 * sc, 22 * sc);
  };

  S.dome = function (ctx, x, yb, sc) {
    ctx.fillStyle = "#d4ac6e";
    ctx.beginPath();
    ctx.arc(x, yb - 28 * sc, 32 * sc, Math.PI, 0);
    ctx.lineTo(x + 32 * sc, yb);
    ctx.lineTo(x - 32 * sc, yb);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#f4d03f";
    ctx.beginPath();
    ctx.arc(x, yb - 28 * sc, 8 * sc, 0, Math.PI * 2);
    ctx.fill();
  };

  S.minaret = function (ctx, x, yb, sc) {
    ctx.fillStyle = "#eaeaea";
    ctx.fillRect(x - 8 * sc, yb - 100 * sc, 16 * sc, 100 * sc);
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(x - 14 * sc, yb - 100 * sc + i * 22 * sc, 28 * sc, 6 * sc);
    }
    ctx.beginPath();
    ctx.moveTo(x - 10 * sc, yb - 110 * sc);
    ctx.lineTo(x, yb - 130 * sc);
    ctx.lineTo(x + 10 * sc, yb - 110 * sc);
    ctx.closePath();
    ctx.fill();
  };

  S.temple_spire = function (ctx, x, yb, sc) {
    ctx.fillStyle = "#c0392b";
    ctx.beginPath();
    ctx.moveTo(x, yb - 90 * sc);
    ctx.lineTo(x + 22 * sc, yb);
    ctx.lineTo(x - 22 * sc, yb);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 3 * sc;
    ctx.stroke();
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 ? "#922b21" : "#c0392b";
      ctx.fillRect(x - 18 * sc + i * 3 * sc, yb - 50 * sc + i * 8 * sc, 36 * sc - i * 6 * sc, 8 * sc);
    }
  };

  S.lotus_silhouette = function (ctx, x, yb, sc) {
    ctx.fillStyle = "#ecf0f1";
    ctx.beginPath();
    for (let p = 0; p < 9; p++) {
      const a = (p / 9) * Math.PI * 2;
      const rx = 20 * sc * (0.7 + 0.3 * Math.sin(a * 3));
      ctx.lineTo(x + Math.cos(a) * rx, yb - 40 * sc + Math.sin(a) * 12 * sc);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#bdc3c7";
    ctx.fillRect(x - 6 * sc, yb - 20 * sc, 12 * sc, 22 * sc);
  };

  S.smog_layer = function (ctx, x0, y, w, alpha) {
    const g = ctx.createLinearGradient(x0, y - 40, x0 + w, y + 20);
    g.addColorStop(0, "rgba(120,100,90,0)");
    g.addColorStop(0.5, "rgba(90,80,70," + alpha + ")");
    g.addColorStop(1, "rgba(120,100,90,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x0, y - 50, w, 70);
  };

  S.danfo = function (ctx, x, yb, sc) {
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(x - 36 * sc, yb - 36 * sc, 72 * sc, 30 * sc);
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(x - 32 * sc, yb - 30 * sc, 28 * sc, 14 * sc);
    ctx.fillRect(x + 2 * sc, yb - 30 * sc, 28 * sc, 14 * sc);
    ctx.fillStyle = "#27ae60";
    ctx.fillRect(x - 36 * sc, yb - 8 * sc, 72 * sc, 5 * sc);
  };

  S.palm = function (ctx, x, yb, sc) {
    ctx.strokeStyle = "#27ae60";
    ctx.lineWidth = 4 * sc;
    ctx.beginPath();
    ctx.moveTo(x, yb);
    ctx.quadraticCurveTo(x + 10 * sc, yb - 40 * sc, x + 30 * sc, yb - 70 * sc);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      const ang = -Math.PI * 0.6 + i * 0.25;
      ctx.beginPath();
      ctx.moveTo(x + 28 * sc, yb - 68 * sc);
      ctx.quadraticCurveTo(
        x + 28 * sc + Math.cos(ang) * 40 * sc,
        yb - 68 * sc + Math.sin(ang) * 20 * sc,
        x + 28 * sc + Math.cos(ang) * 55 * sc,
        yb - 55 * sc
      );
      ctx.stroke();
    }
  };

  S.sign_plaque = function (ctx, x, yb, sc, t, facing, active) {
    ctx.save();
    ctx.translate(x, yb - 40 * sc);
    ctx.fillStyle = active ? "#2ecc71" : "#34495e";
    ctx.strokeStyle = active ? "#fff" : "#7f8c8d";
    ctx.lineWidth = 2;
    ctx.fillRect(-22 * sc, -28 * sc, 44 * sc, 36 * sc);
    ctx.strokeRect(-22 * sc, -28 * sc, 44 * sc, 36 * sc);
    ctx.fillStyle = "#fff";
    ctx.font = Math.max(8, 10 * sc) + "px system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("i", 0, -8 * sc);
    ctx.restore();
  };

  S.exit_arch = function (ctx, x, yb, sc) {
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(x - 50 * sc, yb - 100 * sc, 20 * sc, 100 * sc);
    ctx.fillRect(x + 30 * sc, yb - 100 * sc, 20 * sc, 100 * sc);
    ctx.beginPath();
    ctx.arc(x, yb - 100 * sc, 50 * sc, Math.PI, 0);
    ctx.lineWidth = 16 * sc;
    ctx.strokeStyle = "#f39c12";
    ctx.stroke();
    ctx.fillStyle = "rgba(241,196,15,0.35)";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "12px system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Exit", x, yb - 85 * sc);
  };

  S.draw = function (ctx, id, x, yb, sc, time, facing, active) {
    if (
      window.GD_DECO &&
      typeof window.GD_DECO.drawProp === "function" &&
      window.GD_DECO.drawProp(ctx, id, x, yb, sc || 1, time, facing, active)
    ) {
      return;
    }
    const fn = S[id];
    if (typeof fn === "function") fn(ctx, x, yb, sc || 1, time, facing, active);
  };

  window.GD_SPRITES = S;
})();
