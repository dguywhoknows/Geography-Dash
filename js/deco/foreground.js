/**
 * Near-parallax foreground silhouettes — cables, awnings, distant traffic glow.
 */
(function () {
  "use strict";

  const D = window.GD_DECO;
  const P = D.primitives;
  if (!D || !P) return;

  const F = (D.foreground = {});

  F.paint = function (ctx, city, cam, w, h, gy, t) {
    const id = city.id;
    const x0 = D.parallaxX(-100, cam, 0.38);
    const x1 = D.parallaxX(w + 400, cam, 0.38);

    ctx.strokeStyle = "rgba(30,35,45,0.35)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const ax = x0 + i * 180;
      D.powerLine(ctx, ax, gy - 120, ax + 220, gy - 115, 14 + i * 2);
    }

    if (id === "copenhagen" || id === "toronto") {
      for (let i = 0; i < 5; i++) {
        const bx = x0 + 100 + i * 240;
        if (!D.visible(bx, 60, cam, w)) continue;
        ctx.fillStyle = "rgba(52,73,94,0.25)";
        ctx.beginPath();
        ctx.moveTo(bx, gy + 20);
        ctx.lineTo(bx + 50, gy - 30);
        ctx.lineTo(bx + 100, gy + 20);
        ctx.closePath();
        ctx.fill();
      }
    }

    if (id === "istanbul" || id === "bangkok") {
      for (let i = 0; i < 4; i++) {
        const lx = x0 + 160 + i * 310;
        if (!D.visible(lx, 80, cam, w)) continue;
        P.bunting(ctx, lx, gy - 80 - (i % 2) * 30, t + i);
      }
    }

    if (id === "newdelhi" || id === "lagos") {
      ctx.fillStyle = "rgba(255,180,60,0.08)";
      for (let i = 0; i < 6; i++) {
        const gx = x0 + i * 200;
        ctx.fillRect(gx, gy - 8, 120, 14);
      }
    }

    for (let i = 0; i < 7; i++) {
      const tx = x0 + 80 + i * 260;
      if (!D.visible(tx, 40, cam, w)) continue;
      P.streetLamp(ctx, tx, gy + 2, 0.45, true);
    }
  };
})();
