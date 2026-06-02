/**
 * Stage-topic visuals - skies, particles, and prop pools keyed to hazard theme / category.
 */
(function () {
  "use strict";

  const D = window.GD_DECO;
  if (!D) return;

  const T = (D.stageThemes = {});

  T.PROPS = {
    wind_turbine: ["wind_turbine", "solar_panel", "bike_rack", "bush"],
    env: ["wind_turbine", "solar_panel", "bush", "flag_pole"],
    bike_lane: ["bike_rack", "bench", "street_lamp", "bush"],
    mobility: ["streetcar", "street_lamp", "hydrant", "bus_stop", "danfo"],
    car_swarm: ["streetcar", "danfo", "hydrant", "bus_stop", "street_lamp"],
    patrol_soft: ["bench", "street_lamp", "flag_pole"],
    patrol_hard: ["bench", "hydrant", "fence", "street_lamp"],
    safety: ["street_lamp", "bench", "hydrant"],
    pulse_zone: ["bench", "flag_pole", "flower_pot"],
    health: ["bench", "flower_pot", "flag_pole"],
    ballot_wave: ["flag_pole", "bench", "bunting_line"],
    civic: ["flag_pole", "bench", "bunting_line"],
    institution_gate: ["bench", "crate_stack", "street_lamp"],
    sector: ["crate_stack", "street_lamp", "fence"],
    tax_slider: ["crate_stack", "market_stall", "hydrant"],
    income: ["market_stall", "crate_stack", "danfo"],
    book_stack: ["crate_stack", "bench", "tree"],
    learning: ["tree", "bench", "crate_stack"],
    commute_pulse: ["streetcar", "danfo", "bus_stop", "hydrant"],
    work: ["streetcar", "crate_stack", "bus_stop"],
    stage_hazard: ["bunting_line", "market_stall", "flag_pole", "bench"],
    arts: ["bunting_line", "market_stall", "flag_pole", "bench"],
    smog_cloud: ["smog_layer", "street_lamp", "tree"],
    flood_zone: ["bush", "flower_pot", "palm", "ferry"],
    quake_crack: ["crate_stack", "fence", "market_stall"],
    housing: ["nyhavn_house", "crate_stack", "fence"],
    boss_tower: ["cn_tower", "nyhavn_house", "street_lamp"],
    boss_sprawl: ["cn_tower", "streetcar", "street_lamp"],
    boss_volatile: ["market_stall", "minaret", "flag_pole"],
    boss_storm: ["smog_layer", "temple_spire", "palm"],
    boss_lagos: ["danfo", "palm", "market_stall"],
    hub: ["bench", "flower_pot", "street_lamp", "bush"],
  };

  T.SKY = {
    wind_turbine: { palette: ["#4a90a4", "#7ec8e3", "#d4eef8"], particles: "pollen" },
    env: { palette: ["#2e7d32", "#66bb6a", "#c8e6c9"], particles: "pollen" },
    bike_lane: { palette: ["#546e7a", "#90a4ae", "#eceff1"], particles: "pollen" },
    mobility: { palette: ["#37474f", "#78909c", "#cfd8dc"], particles: "dust" },
    car_swarm: { palette: ["#455a64", "#90a4ae", "#ffccbc"], particles: "dust" },
    smog_cloud: { palette: ["#5d4037", "#8d6e63", "#bcaaa4"], particles: "dust", smog: 0.35 },
    flood_zone: { palette: ["#1565c0", "#4fc3f7", "#e1f5fe"], particles: "rain" },
    quake_crack: { palette: ["#4e342e", "#8d6e63", "#d7ccc8"], particles: "dust" },
    pulse_zone: { palette: ["#e8f5e9", "#a5d6a7", "#ffffff"], particles: "pollen" },
    health: { palette: ["#e3f2fd", "#90caf9", "#ffffff"], particles: "pollen" },
    patrol_hard: { palette: ["#263238", "#455a64", "#78909c"], particles: "dust" },
    boss_storm: { palette: ["#4a148c", "#7b1fa2", "#ff8f00", "#fff3e0"], particles: "dust", smog: 0.4 },
    boss_lagos: { palette: ["#1b5e20", "#fbc02d", "#ff6f00"], particles: "dust" },
    arts: { palette: ["#6a1b9a", "#ab47bc", "#ffe082"], particles: "pollen" },
    stage_hazard: { palette: ["#ad1457", "#f48fb1", "#fff9c4"], particles: "pollen" },
    hub: null,
  };

  T.propPool = function (city, stage) {
    const theme = (stage && stage.hazardTheme) || "hub";
    const cat = (stage && stage.category) || "";
    const pool = (T.PROPS[theme] || T.PROPS[cat] || []).slice();
    const cityPool = D.stageScatter && D.stageScatter._cityPool
      ? D.stageScatter._cityPool(city.id)
      : [];
    if (pool.length === 0) return cityPool;
    return pool.concat(cityPool.filter(function (p) {
      return pool.indexOf(p) < 0;
    }));
  };

  T.skyOverlay = function (ctx, w, h, gy, themeKey, t) {
    const cfg = T.SKY[themeKey];
    if (!cfg || !cfg.palette) return;
    const g = ctx.createLinearGradient(0, 0, 0, gy + 40);
    const pal = cfg.palette;
    g.addColorStop(0, pal[0]);
    g.addColorStop(0.5, pal[1] || pal[0]);
    g.addColorStop(1, pal[2] || pal[1] || pal[0]);
    ctx.save();
    ctx.globalAlpha = 0.42;
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    if (cfg.smog && D.primitives) {
      D.primitives.smogHaze(ctx, 0, gy - 180, w, cfg.smog, [80, 70, 60]);
    }
    if (cfg.particles === "rain" && D.primitives) {
      ctx.strokeStyle = "rgba(100,180,255,0.25)";
      for (let i = 0; i < 40; i++) {
        const rx = (i * 97 + t * 80) % w;
        const ry = (i * 53 + t * 120) % (gy * 0.9);
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 4, ry + 14);
        ctx.stroke();
      }
    }
  };

  T.banner = function (ctx, cam, w, gy, stage) {
    if (!stage || !stage.factor) return;
    const bx = D.parallaxX(120, cam, 0.02);
    if (!D.visible(bx, 200, cam, w)) return;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    D.fillRoundRect(ctx, bx, 18, Math.min(280, 40 + stage.factor.length * 7), 36, 6);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px system-ui,sans-serif";
    ctx.fillText(stage.factor, bx + 12, 42);
    ctx.restore();
  };
})();
