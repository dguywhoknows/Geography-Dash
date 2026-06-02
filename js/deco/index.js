/**
 * Geography Dash decoration engine - public API.
 */
(function () {
  "use strict";

  const D = window.GD_DECO;
  if (!D) return;

  D.enrichLevel = function (level, city, stage, rnd) {
    if (!level.decorations) level.decorations = [];
    const scattered = D.scatterStage(level, city, stage || {}, rnd);
    level.decorations = level.decorations.concat(scattered);
    level.decorations.sort(function (a, b) {
      return (a.layer || 0) - (b.layer || 0);
    });
    return level;
  };

  D.enrichHub = function (level, city, stage) {
    const rnd = D.seeded(D.hashStr(city.id + "|hub|" + (stage && stage.hazardTheme) + "|" + (level.hubStageIndex || 0)));
    const scattered = D.scatterStage(level, city, stage || { hazardTheme: "hub" }, rnd);
    level.decorations = (level.decorations || []).concat(scattered);
    level.decorations.sort(function (a, b) {
      return (a.layer || 0) - (b.layer || 0);
    });
    return level;
  };
})();
