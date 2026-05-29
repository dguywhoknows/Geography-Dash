/**
 * Animated player character — redesigned for PLAYER_W=28, PLAYER_H=32.
 * All skeleton heights are measured in px ABOVE the feet baseline (by = p.y + PH).
 *
 * Features preserved from the original:
 *  – Two-segment legs (thigh+shin) with kneecap dot
 *  – Two-segment arms (upper+forearm) with hand ellipse
 *  – Walk / run / jump / fall animations
 *  – Squash-and-stretch idle breathing
 *  – Hoodie body with zipper stripe, chest pocket, shoulder band
 *  – Belt with buckle
 *  – Chunky two-tone sneakers with sole, toe-cap, lace accent
 *  – Rich head: hair mass + highlight strand + tuft, iris (city accent),
 *    pupil, highlight, eyebrow, nose, mouth, ear
 *  – Speed-trail ghost when sprinting
 *  – Landing dust puffs
 */
(function () {
  "use strict";
  const D = window.GD_DECO;
  if (!D) return;

  // ── colour helpers ──────────────────────────────────────────────────────────
  function hex(h) {
    if (!h || h[0] !== "#" || h.length < 7) return [80, 180, 160];
    return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  }
  function dark(h, a) {
    const [r,g,b] = hex(h);
    return "rgb("+Math.round(r*(1-a))+","+Math.round(g*(1-a))+","+Math.round(b*(1-a))+")";
  }
  function light(h, a) {
    const [r,g,b] = hex(h);
    return "rgb("+Math.min(255,Math.round(r+(255-r)*a))+","+Math.min(255,Math.round(g+(255-g)*a))+","+Math.min(255,Math.round(b+(255-b)*a))+")";
  }
  function rgba(h, alpha) {
    const [r,g,b] = hex(h);
    return "rgba("+r+","+g+","+b+","+alpha+")";
  }

  // ── rounded-rect helper ─────────────────────────────────────────────────────
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w/2, h/2);
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  }

  // ── two-point quadratic limb stroke ─────────────────────────────────────────
  function limb(ctx, x0, y0, kx, ky, x1, y1, w, col) {
    ctx.strokeStyle = col;
    ctx.lineWidth   = w;
    ctx.lineCap     = "round";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(kx, ky, x1, y1);
    ctx.stroke();
  }

  // ── landing dust pool ───────────────────────────────────────────────────────
  const _dust = [];
  let   _lastGround = false;

  function spawnDust(cx, by, accent) {
    for (let i = 0; i < 4; i++) {
      const ang = Math.PI + (Math.random()-0.5) * 1.1;
      const spd = 0.4 + Math.random() * 1.1;
      _dust.push({ x: cx+(Math.random()-0.5)*8, y: by,
                   vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd-0.7,
                   life: 1, r: 1.5+Math.random()*2, col: accent });
    }
  }

  // ── main entry ──────────────────────────────────────────────────────────────
  D.drawPlayer = function(ctx, p, t, city) {
    const PW = 28, PH = 32;   // matches game.js PLAYER_W / PLAYER_H
    const px     = p.x,  py  = p.y;
    const cx     = px + PW * 0.5;
    const by     = py + PH;              // feet baseline
    const accent = (city && city.accent) || "#1abc9c";
    const f      = p.facing || 1;
    const vx     = p.vx  || 0;
    const vy     = p.vy  || 0;
    const onGnd  = !!p.onGround;
    const speed  = Math.abs(vx);
    const running = speed > 1.5 && onGnd;
    const walking = speed > 0.4 && onGnd && !running;
    const airUp   = !onGnd && vy < -2;
    const airDown = !onGnd && vy >  1;
    const sprint  = speed > 3.8 && onGnd;

    // landing squash trigger
    if (!_lastGround && onGnd) spawnDust(cx, by, accent);
    _lastGround = onGnd;

    // ── dust particles ────────────────────────────────────────────────────────
    ctx.save();
    for (let i = _dust.length - 1; i >= 0; i--) {
      const d = _dust[i];
      d.x += d.vx;  d.y += d.vy;
      d.vy += 0.12;
      d.life -= 0.08;
      if (d.life <= 0) { _dust.splice(i, 1); continue; }
      ctx.globalAlpha = d.life * 0.55;
      ctx.fillStyle   = rgba(d.col, 0.5);
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * d.life, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ── sprint ghost ──────────────────────────────────────────────────────────
    if (sprint) {
      for (let g = 1; g <= 2; g++) {
        ctx.save();
        ctx.globalAlpha = 0.09 - g * 0.03;
        ctx.translate(-f * g * 7, 0);
        ctx.fillStyle = rgba(accent, 1);
        rr(ctx, px + 3, py + 7, PW - 6, PH - 12, 3);
        ctx.fill();
        ctx.restore();
      }
    }

    ctx.save();
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    // idle breathing squash around feet
    let squashY = 1, squashX = 1;
    if (onGnd && speed < 0.3) {
      const breathe = Math.sin(t * 0.8) * 0.010;
      squashY = 1 - breathe;
      squashX = 1 + breathe * 0.5;
    }
    ctx.translate(cx, by);
    ctx.scale(squashX, squashY);
    ctx.translate(-cx, -by);

    // ── skeleton heights (all px ABOVE feet = by) ─────────────────────────────
    //  ankleH  =  0   (feet)
    //  kneeH   =  8
    //  hipH    = 14
    //  waistH  = 16
    //  shldH   = 21
    //  neckH   = 23
    //  headCH  = 27   (head centre — skull top at ~33 px, hair ~35 px)

    const hipY   = by - 14;
    const waistY = by - 16;
    const shldY  = by - 21;
    const neckY  = by - 23;
    const headCY = by - 27;

    // ── ground shadow ─────────────────────────────────────────────────────────
    if (onGnd) {
      ctx.fillStyle = "rgba(0,0,0,0.17)";
      ctx.beginPath();
      ctx.ellipse(cx, by + 2, 10, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── leg animation ─────────────────────────────────────────────────────────
    const runT  = running ? t * 13 : (walking ? t * 7 : 0);
    const swing = running ? 11 : (walking ? 6 : 0);

    const thighA_L = Math.sin(runT)           * swing;
    const thighA_R = Math.sin(runT + Math.PI) * swing;
    const shinA_L  = Math.sin(runT + 0.8)     * swing * 0.65;
    const shinA_R  = Math.sin(runT + Math.PI + 0.8) * swing * 0.65;

    const jumpLegOff = airUp ? -4 : (airDown ? 3 : 0);

    function drawLeg(thighA, shinA, isBack) {
      const depth    = isBack ? 0.78 : 1.0;
      const shadowOff= isBack ? 1 : 0;
      const tCol     = isBack ? "#2c3e50" : "#34495e";
      const sCol     = isBack ? "#1f2d3d" : "#2c3e50";
      const shoeUp   = isBack ? "#263240" : "#2c3e50";

      // hip → knee
      const kx  = cx + thighA * 0.5 + shadowOff;
      const ky  = hipY + 3;
      const kneX= cx + thighA * 0.85 + shadowOff;
      const kneY= by - 8 + jumpLegOff;
      limb(ctx, cx, hipY, kx, ky, kneX, kneY, 5 * depth, tCol);

      // knee cap
      ctx.fillStyle = isBack ? "#1a252f" : "#2c3e50";
      ctx.beginPath();
      ctx.arc(kneX, kneY, 2.5 * depth, 0, Math.PI * 2);
      ctx.fill();

      // knee → ankle
      const ax  = cx + shinA * 0.6 + shadowOff;
      const ay  = (ky + kneY) * 0.5;
      const ankX= cx + shinA * 1.0 + shadowOff;
      const ankY= by - 2 + jumpLegOff * 0.35;
      limb(ctx, kneX, kneY, ax, ay, ankX, ankY, 4 * depth, sCol);

      // sneaker
      const sx   = ankX - 1 + f * 1.5;
      const sBase= ankY + 2;
      // sole
      ctx.fillStyle = dark(accent, 0.55);
      rr(ctx, sx - 2, sBase - 1, 10, 3.5, 1.5);
      ctx.fill();
      // upper
      ctx.fillStyle = shoeUp;
      rr(ctx, sx - 1, sBase - 4, 9, 4, 1.5);
      ctx.fill();
      // toe-cap highlight
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      rr(ctx, sx + f*1.5, sBase - 4, 4, 2.5, 1);
      ctx.fill();
      // lace accent strip
      ctx.fillStyle = rgba(accent, 0.65);
      ctx.fillRect(sx + 1, sBase - 2, 6, 1.2);
    }

    drawLeg(thighA_R, shinA_R, true);   // back leg first

    // ── torso ─────────────────────────────────────────────────────────────────
    const lean = running ? -f * 3 : 0;
    ctx.save();
    ctx.translate(cx, waistY);
    ctx.rotate((lean * Math.PI) / 180);
    ctx.translate(-cx, -waistY);

    const torsoW = 13, torsoH = 9;   // 21-16+4 = 9 px tall
    const tg = ctx.createLinearGradient(cx - torsoW/2, waistY - torsoH, cx + torsoW/2, waistY);
    tg.addColorStop(0, light(accent, 0.14));
    tg.addColorStop(0.5, accent);
    tg.addColorStop(1, dark(accent, 0.2));
    ctx.fillStyle = tg;
    rr(ctx, cx - torsoW/2, waistY - torsoH, torsoW, torsoH, 2.5);
    ctx.fill();
    ctx.strokeStyle = dark(accent, 0.38);
    ctx.lineWidth = 0.8;
    rr(ctx, cx - torsoW/2, waistY - torsoH, torsoW, torsoH, 2.5);
    ctx.stroke();

    // zipper stripe
    ctx.strokeStyle = dark(accent, 0.5);
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(cx, waistY - torsoH + 2);
    ctx.lineTo(cx, waistY - 3);
    ctx.stroke();

    // chest pocket
    ctx.fillStyle = dark(accent, 0.22);
    ctx.strokeStyle = dark(accent, 0.4);
    ctx.lineWidth = 0.7;
    rr(ctx, cx + f * 1.5, waistY - torsoH + 3, 4, 3, 0.8);
    ctx.fill(); ctx.stroke();

    // shoulder accent band
    ctx.fillStyle = light(accent, 0.28);
    ctx.fillRect(cx - torsoW/2, waistY - torsoH, torsoW, 2);

    // belt
    ctx.fillStyle = "#1a252f";
    ctx.fillRect(cx - torsoW/2 - 1, waistY - 3, torsoW + 2, 3);
    ctx.fillStyle = "#f39c12";
    ctx.fillRect(cx - 3, waistY - 2.5, 6, 2);   // buckle plate
    ctx.fillStyle = "#1a252f";
    ctx.fillRect(cx - 1, waistY - 2, 2, 1.5);   // buckle hole

    ctx.restore();

    drawLeg(thighA_L, shinA_L, false);  // front leg overlaps torso bottom

    // ── arms ──────────────────────────────────────────────────────────────────
    const armSwA   = running ? 9 : (walking ? 5 : 0);
    const armA_L   = Math.sin(runT + Math.PI) * armSwA;
    const armA_R   = Math.sin(runT)           * armSwA;
    const jumpArmOff = airUp ? -10 : (airDown ? 4 : 0);

    function drawArm(armA, isBack) {
      const depth = isBack ? 0.80 : 1.0;
      const sCol  = isBack ? dark(accent, 0.32) : dark(accent, 0.18);
      const fCol  = isBack ? dark(accent, 0.42) : dark(accent, 0.28);
      const side  = isBack ? -f : f;
      const sx    = cx + side * 4;
      const sy    = shldY + 1;

      // shoulder → elbow
      const elX = sx + armA * 0.55;
      const elY = sy + 7 + jumpArmOff * 0.5;
      limb(ctx, sx, sy, (sx+elX)*0.5, (sy+elY)*0.5, elX, elY, 3.5*depth, sCol);

      // elbow → hand
      const hx = elX + armA * 0.45;
      const hy = elY + 5 + jumpArmOff;
      limb(ctx, elX, elY, (elX+hx)*0.5, (elY+hy)*0.5, hx, hy, 3*depth, fCol);

      // hand
      ctx.fillStyle = "#f0b47a";
      ctx.beginPath();
      ctx.ellipse(hx, hy, 2.5*depth, 2*depth, 0, 0, Math.PI*2);
      ctx.fill();
    }

    drawArm(armA_R, true);
    drawArm(armA_L, false);

    // ── head ──────────────────────────────────────────────────────────────────
    const headBob = running ? Math.sin(runT * 2) * 0.9 : 0;
    const headY   = headCY + headBob;
    const HR      = 5.5;   // head radius

    // neck
    ctx.fillStyle = "#e8a06a";
    ctx.fillRect(cx - 2.5, neckY, 5, headY - neckY + HR * 0.9);

    // head depth shadow
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.arc(cx + 1.5, headY + 1.5, HR, 0, Math.PI * 2);
    ctx.fill();

    // ear (back)
    ctx.fillStyle = "#e8a06a";
    ctx.beginPath();
    ctx.ellipse(cx - f * 7, headY + 0.5, 2.5, 3.5, f * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d4906a";
    ctx.beginPath();
    ctx.ellipse(cx - f * 7, headY + 0.5, 1.4, 2.2, f * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // skull
    ctx.fillStyle = "#f0c090";
    ctx.beginPath();
    ctx.arc(cx, headY, HR, 0, Math.PI * 2);
    ctx.fill();

    // chin highlight
    ctx.fillStyle = "rgba(255,200,140,0.28)";
    ctx.beginPath();
    ctx.ellipse(cx, headY + HR * 0.7, 3.5, 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── hair ──────────────────────────────────────────────────────────────────
    ctx.fillStyle = "#3d2b1f";
    ctx.beginPath();
    ctx.arc(cx, headY - 0.5, HR + 0.3, Math.PI * 0.88, 0);
    ctx.lineTo(cx + HR, headY + 1.5);
    ctx.arc(cx, headY, HR, 0, Math.PI * 0.12, true);
    ctx.closePath();
    ctx.fill();

    // highlight strand
    ctx.strokeStyle = "#6b4a36";
    ctx.lineWidth   = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 3.5, headY - HR - 0.5);
    ctx.quadraticCurveTo(cx, headY - HR - 2, cx + 3, headY - HR + 0.5);
    ctx.stroke();

    // front tuft
    ctx.fillStyle = "#3d2b1f";
    ctx.beginPath();
    ctx.ellipse(cx + f * 1.5, headY - HR - 0.5, 3.5, 2.3, -f * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // ── face ──────────────────────────────────────────────────────────────────
    const eyeX = cx + f * 3.5;

    // eyebrow
    ctx.strokeStyle = "#3d2b1f";
    ctx.lineWidth = 1.1;
    const browLift = airUp ? -1.2 : 0;
    ctx.beginPath();
    ctx.moveTo(eyeX - 2.5, headY - 2.5 + browLift);
    ctx.quadraticCurveTo(eyeX, headY - 3.8 + browLift, eyeX + 2.5, headY - 2.2 + browLift);
    ctx.stroke();

    // eye socket shadow
    ctx.fillStyle = "rgba(0,0,0,0.09)";
    ctx.beginPath();
    ctx.ellipse(eyeX, headY + 0.2, 3, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // eye white
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.ellipse(eyeX, headY + 0.2, 2.3, 1.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // iris (city accent)
    ctx.fillStyle = rgba(accent, 0.85);
    ctx.beginPath();
    ctx.arc(eyeX + 0.4, headY + 0.4, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // pupil
    ctx.fillStyle = "#111";
    ctx.beginPath();
    ctx.arc(eyeX + 0.5, headY + 0.5, 0.75, 0, Math.PI * 2);
    ctx.fill();

    // eye highlight
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(eyeX + 0.1, headY - 0.2, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // lower lid
    ctx.strokeStyle = "rgba(180,120,80,0.38)";
    ctx.lineWidth   = 0.7;
    ctx.beginPath();
    ctx.arc(eyeX, headY + 0.2, 2.3, 0.05, Math.PI - 0.05);
    ctx.stroke();

    // nose
    ctx.fillStyle = "rgba(180,110,70,0.38)";
    ctx.beginPath();
    ctx.arc(cx + f * 1.5, headY + 2.3, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // mouth
    const moodOff = airUp ? -0.4 : 0;
    ctx.strokeStyle = "rgba(140,80,50,0.7)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx + f * 0.8, headY + 4 + moodOff);
    ctx.quadraticCurveTo(cx + f * 2.2, headY + 5.2 + moodOff, cx + f * 3.8, headY + 3.8 + moodOff);
    ctx.stroke();

    if (airUp) {
      ctx.strokeStyle = "rgba(140,80,50,0.45)";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.ellipse(cx + f * 2.3, headY + 4.5, 1.4, 1.1, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  };
})();
