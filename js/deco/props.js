/**
 * Ultra-detailed hub + stage props (replaces basic GD_SPRITES shapes when loaded).
 */
(function () {
  "use strict";

  const D = window.GD_DECO;
  const P = D.primitives;
  if (!D || !P) return;

  const R = {};

  function sc(v, s) {
    return v * (s || 1);
  }

  R.bench = function (ctx, x, yb, s) {
    s = s || 1;
    const w = sc(58, s);
    ctx.fillStyle = "#4e342e";
    ctx.fillRect(x - w * 0.5, yb - sc(6, s), w, sc(6, s));
    ctx.fillStyle = "#6d4c41";
    for (let sl = 0; sl < 4; sl++) {
      ctx.fillRect(x - w * 0.45 + sl * (w * 0.28), yb - sc(24, s), sc(5, s), sc(20, s));
    }
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(x - w * 0.48, yb - sc(26, s), w * 0.96, sc(8, s));
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) ctx.strokeRect(x - w * 0.4 + i * (w * 0.18), yb - sc(25, s), w * 0.14, sc(6, s));
  };

  R.bike_rack = function (ctx, x, yb, s) {
    s = s || 1;
    ctx.fillStyle = "#7f8c8d";
    D.fillRoundRect(ctx, x - sc(26, s), yb - sc(5, s), sc(52, s), sc(5, s), 2);
    ctx.strokeStyle = "#95a5a6";
    ctx.lineWidth = sc(3, s);
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(x + i * sc(16, s), yb - sc(20, s), sc(13, s), Math.PI, 0);
      ctx.stroke();
      ctx.fillStyle = "#bdc3c7";
      ctx.beginPath();
      ctx.arc(x + i * sc(16, s), yb - sc(8, s), sc(4, s), 0, Math.PI * 2);
      ctx.fill();
    }
  };

  R.wind_turbine = function (ctx, x, yb, s, t) {
    D.buildings.landmarkWindTurbine(ctx, x, yb, s || 0.85, t);
  };

  R.nyhavn_house = function (ctx, x, yb, s) {
    s = s || 1;
    const w = sc(48, s);
    const h = sc(76, s);
    const colors = ["#c0392b", "#f39c12", "#2980b9", "#8e44ad", "#16a085"];
    const col = colors[(Math.floor(x / 17) % 5 + 5) % 5];
    D.buildings.draw(ctx, x - w * 0.5, yb, w, h, "nordic", Math.floor(x) % 100, 0);
    ctx.fillStyle = col;
    ctx.globalCompositeOperation = "multiply";
    ctx.fillRect(x - w * 0.5, yb - h, w, h);
    ctx.globalCompositeOperation = "source-over";
    D.roofGable(ctx, x - w * 0.5, yb - h, w, sc(24, s), "#2c1810");
    ctx.fillStyle = "#fef5e7";
    ctx.fillRect(x - w * 0.32, yb - h * 0.55, sc(11, s), sc(15, s));
    ctx.fillRect(x + w * 0.06, yb - h * 0.38, sc(10, s), sc(13, s));
    ctx.fillStyle = "#2c1810";
    ctx.fillRect(x - sc(5, s), yb - sc(14, s), sc(10, s), sc(16, s));
  };

  R.canal_water = function (ctx, x0, x1, y, wave) {
    P.canalWater(ctx, x0, x1, y, wave || 0);
  };

  R.cn_tower = function (ctx, x, yb, s) {
    D.buildings.landmarkCnTower(ctx, x, yb, s || 1);
  };

  R.streetcar = function (ctx, x, yb, s) {
    s = s || 1;
    ctx.fillStyle = "#c0392b";
    D.fillRoundRect(ctx, x - sc(44, s), yb - sc(36, s), sc(88, s), sc(32, s), 4);
    ctx.fillStyle = "#922b21";
    ctx.fillRect(x - sc(42, s), yb - sc(8, s), sc(84, s), sc(6, s));
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillRect(x - sc(36, s), yb - sc(30, s), sc(26, s), sc(14, s));
    ctx.fillRect(x + sc(8, s), yb - sc(30, s), sc(26, s), sc(14, s));
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(x - sc(40, s), yb - sc(4, s), sc(80, s), sc(5, s));
    for (let w = 0; w < 4; w++) {
      ctx.fillStyle = "#1a252f";
      ctx.beginPath();
      ctx.arc(x - sc(28, s) + w * sc(18, s), yb, sc(5, s), 0, Math.PI * 2);
      ctx.fill();
    }
  };

  R.ferry = function (ctx, x, yb, s) {
    s = s || 1;
    ctx.fillStyle = "#fdfefe";
    D.fillRoundRect(ctx, x - sc(54, s), yb - sc(30, s), sc(108, s), sc(24, s), 3);
    const g = ctx.createLinearGradient(x, yb - sc(8, s), x, yb + sc(10, s));
    g.addColorStop(0, "#5dade2");
    g.addColorStop(1, "#2874a6");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - sc(58, s), yb - sc(6, s));
    ctx.lineTo(x + sc(58, s), yb - sc(6, s));
    ctx.lineTo(x + sc(48, s), yb + sc(10, s));
    ctx.lineTo(x - sc(48, s), yb + sc(10, s));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#c0392b";
    ctx.fillRect(x - sc(9, s), yb - sc(50, s), sc(18, s), sc(24, s));
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(x - sc(50, s), yb - sc(28, s), sc(30, s), sc(8, s));
  };

  R.dome = function (ctx, x, yb, s) {
    D.buildings.landmarkDome(ctx, x, yb, s || 1);
  };

  R.minaret = function (ctx, x, yb, s) {
    D.buildings.landmarkMinaret(ctx, x, yb, s || 1);
  };

  R.temple_spire = function (ctx, x, yb, s) {
    D.buildings.landmarkTemple(ctx, x, yb, s || 1);
  };

  R.lotus_silhouette = function (ctx, x, yb, s) {
    D.buildings.landmarkLotus(ctx, x, yb, s || 1);
  };

  R.smog_layer = function (ctx, x0, y, w, alpha) {
    P.smogHaze(ctx, x0, y, w, alpha, [90, 80, 70]);
  };

  R.danfo = function (ctx, x, yb, s) {
    s = s || 1;
    ctx.fillStyle = "#f1c40f";
    D.fillRoundRect(ctx, x - sc(38, s), yb - sc(38, s), sc(76, s), sc(34, s), 3);
    ctx.fillStyle = "#27ae60";
    ctx.fillRect(x - sc(38, s), yb - sc(6, s), sc(76, s), sc(6, s));
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(x - sc(34, s), yb - sc(32, s), sc(30, s), sc(16, s));
    ctx.fillRect(x + sc(2, s), yb - sc(32, s), sc(30, s), sc(16, s));
    ctx.fillStyle = "#1a252f";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(x - sc(24, s) + i * sc(16, s), yb, sc(5, s), 0, Math.PI * 2);
      ctx.fill();
    }
  };

  R.palm = function (ctx, x, yb, s) {
    s = s || 1;
    const grad = ctx.createLinearGradient(x, yb, x, yb - sc(70, s));
    grad.addColorStop(0, "#6d4c41");
    grad.addColorStop(1, "#8d6e63");
    ctx.strokeStyle = grad;
    ctx.lineWidth = sc(5, s);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, yb);
    ctx.quadraticCurveTo(x + sc(8, s), yb - sc(38, s), x + sc(28, s), yb - sc(72, s));
    ctx.stroke();
    for (let i = 0; i < 7; i++) {
      const ang = -Math.PI * 0.55 + i * 0.22;
      ctx.strokeStyle = i % 2 ? "#27ae60" : "#1e8449";
      ctx.lineWidth = sc(3, s);
      ctx.beginPath();
      ctx.moveTo(x + sc(26, s), yb - sc(70, s));
      ctx.quadraticCurveTo(
        x + sc(26, s) + Math.cos(ang) * sc(42, s),
        yb - sc(70, s) + Math.sin(ang) * sc(22, s),
        x + sc(26, s) + Math.cos(ang) * sc(58, s),
        yb - sc(56, s)
      );
      ctx.stroke();
    }
  };

  R.sign_plaque = function (ctx, x, yb, s, t, facing, active) {
    s = s || 1;
    ctx.save();
    ctx.translate(x, yb - sc(42, s));
    ctx.fillStyle = active ? "#27ae60" : "#34495e";
    D.fillRoundRect(ctx, -sc(24, s), -sc(30, s), sc(48, s), sc(38, s), 4);
    ctx.strokeStyle = active ? "#abebc6" : "#7f8c8d";
    ctx.lineWidth = 2;
    D.strokeRoundRect(ctx, -sc(24, s), -sc(30, s), sc(48, s), sc(38, s), 4);
    if (active) {
      const g = ctx.createRadialGradient(0, -sc(10, s), 0, 0, -sc(10, s), sc(40, s));
      g.addColorStop(0, "rgba(46,204,113,0.35)");
      g.addColorStop(1, "rgba(46,204,113,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, -sc(10, s), sc(40, s), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#fff";
    ctx.font = "bold " + Math.max(10, sc(12, s)) + "px system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("i", 0, -sc(8, s));
    ctx.fillStyle = "#5d6d7e";
    ctx.fillRect(-sc(3, s), sc(8, s), sc(6, s), sc(14, s));
    ctx.restore();
  };

  R.exit_arch = function (ctx, x, yb, s) {
    s = s || 1;
    const g = ctx.createLinearGradient(x, yb - sc(100, s), x, yb);
    g.addColorStop(0, "#f5b041");
    g.addColorStop(1, "#d68910");
    ctx.fillStyle = g;
    ctx.fillRect(x - sc(52, s), yb - sc(100, s), sc(22, s), sc(100, s));
    ctx.fillRect(x + sc(30, s), yb - sc(100, s), sc(22, s), sc(100, s));
    ctx.beginPath();
    ctx.arc(x, yb - sc(100, s), sc(52, s), Math.PI, 0);
    ctx.lineWidth = sc(18, s);
    ctx.strokeStyle = "#f39c12";
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold " + sc(13, s) + "px system-ui,sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Exit", x, yb - sc(88, s));
  };

  R.street_lamp = function (ctx, x, yb, s, t) {
    P.streetLamp(ctx, x, yb, s || 1, true);
  };

  R.bush = function (ctx, x, yb, s) {
    P.bushCluster(ctx, x, yb, s || 1, Math.floor(x) % 4);
  };

  R.tree = function (ctx, x, yb, s) {
    P.treeDeciduous(ctx, x, yb, s || 1, "summer");
  };

  R.pine = function (ctx, x, yb, s) {
    P.treePine(ctx, x, yb, s || 1);
  };

  R.fence = function (ctx, x, yb, s) {
    P.fenceSegment(ctx, x - sc(30, s), yb, sc(60, s), s || 1);
  };

  R.market_stall = function (ctx, x, yb, s) {
    s = s || 1;
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.moveTo(x - sc(40, s), yb - sc(8, s));
    ctx.lineTo(x, yb - sc(42, s));
    ctx.lineTo(x + sc(40, s), yb - sc(8, s));
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#8d6e63";
    ctx.fillRect(x - sc(35, s), yb - sc(8, s), sc(70, s), sc(10, s));
    ctx.fillStyle = "#f39c12";
    for (let i = 0; i < 4; i++) ctx.fillRect(x - sc(28, s) + i * sc(16, s), yb - sc(6, s), sc(12, s), sc(6, s));
  };

  R.trash_bin = function (ctx, x, yb, s) {
    s = s || 1;
    ctx.fillStyle = "#27ae60";
    D.fillRoundRect(ctx, x - sc(10, s), yb - sc(28, s), sc(20, s), sc(28, s), 3);
    ctx.fillStyle = "#1e8449";
    ctx.fillRect(x - sc(12, s), yb - sc(32, s), sc(24, s), sc(6, s));
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillRect(x - sc(6, s), yb - sc(22, s), sc(3, s), sc(14, s));
  };

  R.flower_pot = function (ctx, x, yb, s) {
    s = s || 1;
    ctx.fillStyle = "#a0522d";
    ctx.beginPath();
    ctx.moveTo(x - sc(12, s), yb);
    ctx.lineTo(x - sc(8, s), yb - sc(14, s));
    ctx.lineTo(x + sc(8, s), yb - sc(14, s));
    ctx.lineTo(x + sc(12, s), yb);
    ctx.closePath();
    ctx.fill();
    P.bushCluster(ctx, x, yb - sc(16, s), s * 0.55, 2);
  };

  R.flag_pole = function (ctx, x, yb, s, t) {
    s = s || 1;
    ctx.fillStyle = "#7f8c8d";
    ctx.fillRect(x - sc(2, s), yb - sc(70, s), sc(4, s), sc(70, s));
    const wave = Math.sin((t || 0) * 3) * sc(4, s);
    ctx.fillStyle = "#3498db";
    ctx.beginPath();
    ctx.moveTo(x, yb - sc(68, s));
    ctx.lineTo(x + sc(28, s) + wave, yb - sc(62, s));
    ctx.lineTo(x + sc(26, s) + wave, yb - sc(54, s));
    ctx.lineTo(x, yb - sc(58, s));
    ctx.closePath();
    ctx.fill();
  };

  R.crate_stack = function (ctx, x, yb, s) {
    s = s || 1;
    const colors = ["#8d6e63", "#6d4c41", "#a1887f"];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col <= row; col++) {
        ctx.fillStyle = colors[(row + col) % 3];
        ctx.fillRect(x - sc(20, s) + col * sc(18, s), yb - sc(12, s) - row * sc(16, s), sc(16, s), sc(14, s));
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.strokeRect(x - sc(20, s) + col * sc(18, s), yb - sc(12, s) - row * sc(16, s), sc(16, s), sc(14, s));
      }
    }
  };

  R.bunting_line = function (ctx, x, yb, s, t) {
    P.bunting(ctx, x - sc(50, s), x + sc(50, s), yb - sc(55, s), t || 0);
  };

  R.hydrant = function (ctx, x, yb, s) {
    s = s || 1;
    ctx.fillStyle = "#c0392b";
    D.fillRoundRect(ctx, x - sc(8, s), yb - sc(22, s), sc(16, s), sc(22, s), 3);
    ctx.fillStyle = "#922b21";
    ctx.fillRect(x - sc(10, s), yb - sc(10, s), sc(20, s), sc(5, s));
    ctx.fillStyle = "#f1c40f";
    ctx.fillRect(x - sc(3, s), yb - sc(18, s), sc(6, s), sc(5, s));
  };

  R.bus_stop = function (ctx, x, yb, s) {
    s = s || 1;
    ctx.fillStyle = "rgba(52,73,94,0.85)";
    D.fillRoundRect(ctx, x - sc(35, s), yb - sc(58, s), sc(70, s), sc(50, s), 4);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(x - sc(30, s), yb - sc(52, s), sc(60, s), sc(28, s));
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(x - sc(4, s), yb - sc(8, s), sc(8, s), sc(8, s));
  };

  R.solar_panel = function (ctx, x, yb, s) {
    s = s || 1;
    ctx.fillStyle = "#5d6d7e";
    ctx.fillRect(x - sc(22, s), yb - sc(6, s), sc(44, s), sc(6, s));
    ctx.fillStyle = "#1a5276";
    ctx.fillRect(x - sc(20, s), yb - sc(28, s), sc(40, s), sc(20, s));
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(x - sc(20, s) + i * sc(10, s), yb - sc(28, s));
      ctx.lineTo(x - sc(20, s) + i * sc(10, s), yb - sc(8, s));
      ctx.stroke();
    }
  };

  D.drawProp = function (ctx, id, x, yb, scale, time, facing, active) {
    const fn = R[id];
    if (typeof fn === "function") {
      fn(ctx, x, yb, scale, time, facing, active);
      return true;
    }
    return false;
  };

  D.propIds = Object.keys(R);
})();
