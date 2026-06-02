/**
 * Ambient particles - pollen, drizzle, embers, fireflies (city-specific).
 */
(function () {
  "use strict";

  const D = window.GD_DECO;
  if (!D) return;

  const PT = (D.particles = {});

  const PRESETS = {
    copenhagen: { kind: "pollen", count: 35, color: "rgba(255,255,220,0.45)", speed: 0.4 },
    toronto: { kind: "snow", count: 28, color: "rgba(255,255,255,0.55)", speed: 0.55 },
    istanbul: { kind: "dust", count: 40, color: "rgba(255,230,200,0.35)", speed: 0.35 },
    bangkok: { kind: "pollen", count: 45, color: "rgba(255,240,180,0.4)", speed: 0.5 },
    newdelhi: { kind: "dust", count: 55, color: "rgba(255,200,150,0.38)", speed: 0.45 },
    lagos: { kind: "firefly", count: 22, color: "rgba(200,255,120,0.7)", speed: 0.25 },
  };

  function spawn(seed, count, w, h) {
    const rnd = D.seeded(seed);
    const pts = [];
    for (let i = 0; i < count; i++) {
      pts.push({
        x: rnd() * w,
        y: rnd() * h * 0.75,
        vx: (rnd() - 0.5) * 0.6,
        vy: 0.2 + rnd() * 0.8,
        phase: rnd() * Math.PI * 2,
        size: 1 + rnd() * 2.5,
      });
    }
    return pts;
  }

  PT.paint = function (ctx, cityId, cam, w, h, t) {
    const cfg = PRESETS[cityId] || PRESETS.copenhagen;
    const pts = spawn(D.hashStr(cityId + "|pt"), cfg.count, w + 400, h);
    ctx.save();
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      const px = D.parallaxX(p.x, cam, 0.12) + Math.sin(t * cfg.speed + p.phase) * 12;
      const py = p.y + ((t * 18 * p.vy + p.phase * 40) % (h * 0.8));
      if (cfg.kind === "firefly") {
        const glow = 0.35 + 0.65 * Math.sin(t * 3 + p.phase);
        ctx.fillStyle = cfg.color.replace("0.7", String(0.25 + glow * 0.55));
        ctx.beginPath();
        ctx.arc(px, py, p.size * 1.8, 0, Math.PI * 2);
        ctx.fill();
      } else if (cfg.kind === "snow") {
        ctx.fillStyle = cfg.color;
        ctx.fillRect(px, py, p.size, p.size);
        ctx.fillRect(px + 2, py + 1, 1, 1);
      } else {
        ctx.fillStyle = cfg.color;
        ctx.fillRect(px, py, p.size * 0.8, p.size * 0.5);
      }
    }
    ctx.restore();
  };
})();
