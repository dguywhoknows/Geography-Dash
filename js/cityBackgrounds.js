/**
 * City backdrop entry — delegates to GD_DECO skyline engine when loaded.
 */
(function () {
  "use strict";

  function paint(ctx, city, cam, w, h, time, groundY, stage) {
    if (window.GD_DECO && typeof window.GD_DECO.paintCityBackground === "function") {
      window.GD_DECO.paintCityBackground(ctx, city, cam, w, h, time, groundY, stage);
      return;
    }
    const gy = groundY || Math.floor(h * 0.68);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, city.skyTop);
    g.addColorStop(1, city.skyBot);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  window.GD_paintCityBackground = paint;
})();
