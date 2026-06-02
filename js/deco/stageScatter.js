/**
 * Procedural stage + hub decoration scatter - dense environmental storytelling.
 */
(function () {
  "use strict";

  const D = window.GD_DECO;
  if (!D) return;

  const CITY_PROPS = {
    copenhagen: ["nyhavn_house", "wind_turbine", "bench", "bike_rack", "bush", "street_lamp", "flag_pole", "solar_panel"],
    toronto: ["cn_tower", "streetcar", "bench", "bike_rack", "street_lamp", "bus_stop", "hydrant", "crate_stack"],
    istanbul: ["dome", "minaret", "ferry", "bench", "bush", "street_lamp", "market_stall", "flag_pole"],
    bangkok: ["temple_spire", "palm", "bench", "market_stall", "bush", "bunting_line", "flower_pot", "street_lamp"],
    newdelhi: ["lotus_silhouette", "bench", "bike_rack", "bush", "market_stall", "tree", "hydrant", "crate_stack"],
    lagos: ["palm", "danfo", "bench", "bush", "pine", "market_stall", "fence", "trash_bin"],
  };

  D.stageScatter = D.stageScatter || {};
  D.stageScatter._cityPool = function (cityId) {
    return CITY_PROPS[cityId] || CITY_PROPS.copenhagen;
  };

  const THEME_EXTRA = {
    wind_turbine: ["wind_turbine", "solar_panel"],
    bike_lane: ["bike_rack", "bench"],
    car_swarm: ["street_lamp", "hydrant", "bus_stop"],
    smog_cloud: ["smog_layer"],
    flood_zone: ["bush", "flower_pot"],
    boss_tower: ["cn_tower", "street_lamp"],
    boss_lagos: ["danfo", "palm"],
    hub: [],
  };

  function pushDeco(out, id, x, yb, sc, layer, seen, minGap) {
    const key = Math.floor(x / 40) + "|" + id;
    if (seen[key]) return;
    if (minGap && seen._lastX != null && Math.abs(x - seen._lastX) < minGap) return;
    seen[key] = true;
    seen._lastX = x;
    out.push({ id: id, x: x, yb: yb, sc: sc, layer: layer != null ? layer : 0 });
  }

  D.scatterStage = function (level, city, stage, rnd) {
    const out = [];
    const width = level.width;
    const gy = level.groundY;
    const theme = stage && stage.hazardTheme;
    let pool;
    if (window.GD_DECO && window.GD_DECO.stageThemes) {
      pool = window.GD_DECO.stageThemes.propPool(city, stage);
    } else {
      pool = (CITY_PROPS[city.id] || CITY_PROPS.copenhagen).slice();
    }
    const extras = THEME_EXTRA[theme] || [];
    for (let e = 0; e < extras.length; e++) {
      if (pool.indexOf(extras[e]) < 0) pool.push(extras[e]);
    }

    const seen = { _lastX: null };
    const density = level.isHub ? 1.35 : 1.0;
    const step = Math.max(95, Math.floor(220 / density));

    for (let x = 120; x < width - 80; x += step) {
      const roll = rnd();
      const id = pool[Math.floor(roll * pool.length)];
      let layer = roll < 0.35 ? -1 : roll < 0.82 ? 0 : 1;
      let yb = gy;
      let sc = 0.75 + rnd() * 0.45;

      if (id === "wind_turbine" || id === "cn_tower" || id === "dome" || id === "minaret" || id === "temple_spire" || id === "lotus_silhouette") {
        layer = -2;
        sc *= 0.85;
        yb = gy + 4;
      } else if (id === "nyhavn_house") {
        layer = -1;
        yb = gy + 6;
        sc = 0.8 + rnd() * 0.25;
      } else if (id === "smog_layer") {
        continue;
      } else if (id === "bunting_line") {
        yb = gy - 40 - rnd() * 80;
        sc = 1;
      } else if (layer === -1) {
        yb = gy + 2 + rnd() * 8;
      }

      pushDeco(out, id, x + rnd() * 40 - 20, yb, sc, layer, seen, 55);
    }

    const platforms = level.platforms || [];
    for (let pi = 0; pi < platforms.length; pi++) {
      const pl = platforms[pi];
      if (pl.y >= gy - 12) continue;
      if (pl.w < 100) continue;
      if (rnd() > 0.55) continue;
      const smallPool = ["flower_pot", "bush", "bench", "crate_stack", "trash_bin", "flag_pole"];
      const sid = smallPool[Math.floor(rnd() * smallPool.length)];
      pushDeco(out, sid, pl.x + pl.w * 0.5 + (rnd() - 0.5) * pl.w * 0.3, pl.y + pl.h, 0.55 + rnd() * 0.3, 1, seen, 30);
    }

    out.sort(function (a, b) {
      return (a.layer || 0) - (b.layer || 0);
    });
    return out;
  };

  D.scatterHub = function (level, city) {
    const base = D.scatterStage(level, city, { hazardTheme: "hub" }, D.seeded(D.hashStr(city.id + "|hub|deco")));
    return base;
  };
})();
