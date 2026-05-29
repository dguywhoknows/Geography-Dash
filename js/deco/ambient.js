/**
 * Sky palettes, time-of-day ambience, particles, atmospheric overlays.
 */
(function () {
  "use strict";

  const D = window.GD_DECO;
  const P = D && D.primitives;
  if (!D || !P) return;

  const A = (D.ambient = {});

  A.paintSky = function (ctx, w, h, gy, palette, t) {
    const g = ctx.createLinearGradient(0, 0, 0, gy + 50);
    g.addColorStop(0, palette[0]);
    g.addColorStop(palette.length > 2 ? 0.45 : 0.55, palette[1]);
    g.addColorStop(1, palette[palette.length - 1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    if (palette.horizonGlow) {
      const hg = ctx.createLinearGradient(0, gy - 80, 0, gy + 40);
      hg.addColorStop(0, "rgba(255,200,120,0)");
      hg.addColorStop(0.6, palette.horizonGlow);
      hg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = hg;
      ctx.fillRect(0, gy - 100, w, 140);
    }

    if (palette.stars) {
      P.starField(ctx, w, h, palette.starSeed || 42, t);
    }
    if (palette.sun) {
      P.sunDisc(ctx, palette.sun.x * w, palette.sun.y * h, palette.sun.r, true);
    }
    if (palette.moon) {
      P.moonDisc(ctx, palette.moon.x * w, palette.moon.y * h, palette.moon.r);
    }
  };

  A.paintClouds = function (ctx, cam, w, gy, t, layers) {
    layers = layers || [{ par: 0.04, y: 55, density: 6, alpha: 0.5 }];
    for (let i = 0; i < layers.length; i++) {
      const L = layers[i];
      const x0 = D.parallaxX(-200, cam, L.par);
      const x1 = D.parallaxX(w + 400, cam, L.par);
      P.cloudLayer(ctx, x0, x1, L.y, t + i * 2, L.density, L.alpha);
    }
  };

  A.paintBirds = function (ctx, cam, w, gy, t, spots) {
    spots = spots || [{ x: 0.3, y: 0.18, n: 4 }];
    for (let i = 0; i < spots.length; i++) {
      const s = spots[i];
      const bx = D.parallaxX(w * s.x, cam, 0.08 + i * 0.02);
      P.birdFlock(ctx, bx, gy * s.y, t + i, s.n || 4);
    }
  };

  A.paintPowerGrid = function (ctx, cam, w, gy, t) {
    const x0 = D.parallaxX(0, cam, 0.28);
    for (let i = 0; i < 6; i++) {
      const px = x0 + i * 280;
      if (!D.visible(px, 40, cam, w, 200)) continue;
      ctx.fillStyle = "#5d6d7e";
      ctx.fillRect(px, gy - 90, 6, 90);
      ctx.fillRect(px - 35, gy - 75, 76, 5);
      D.powerLine(ctx, px - 30, gy - 72, px + 120, gy - 68, 12);
      D.powerLine(ctx, px + 10, gy - 72, px + 200, gy - 65, 18);
    }
  };

  A.paintForegroundSilhouette = function (ctx, cam, w, gy, color, seed) {
    P.hillSilhouette(ctx, D.parallaxX(-150, cam, 0.35), D.parallaxX(w + 350, cam, 0.35), gy + 18, 45, color, seed);
  };

  A.finish = function (ctx, w, h, opts) {
    opts = opts || {};
    if (opts.smog) P.smogHaze(ctx, opts.smog.x, opts.smog.y, opts.smog.w, opts.smog.alpha, opts.smog.tint);
    if (opts.rays) P.godRays(ctx, opts.rays.x, opts.rays.y, opts.rays.w, opts.rays.h, opts.rays.alpha);
    P.vignette(ctx, w, h, opts.vignette || 0.2);
  };
})();
