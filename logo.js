/**
 * logo.js — Methoryn animated canvas logo
 * Always draws into a 160×44 bitmap. Display size is controlled entirely
 * by CSS — the browser scales the bitmap to fit, just like an <img>.
 * This means the logo shrinks cleanly on mobile without any JS resize logic.
 */

(function () {
  const CHARS  = "░▒▓█▄▀▌▐╱╲◉●◆▲▪!@#$%^&*_-+=?<>[]{}~.,;:|";
  const ACCENT = "#00dcaa";
  const GLOW   = "rgba(0,220,170,0.07)";
  const W = 160, H = 44, cx = W / 2, cy = H / 2;

  function initLogo(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    // Fix the bitmap size — CSS handles display scaling
    canvas.width  = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d");

    const particles = Array.from({ length: 28 }, (_, i) => ({
      char:  CHARS[Math.floor(Math.random() * CHARS.length)],
      angle: (i / 28) * Math.PI * 2,
      radius: 14 + Math.random() * 12,
      speed: (0.004 + Math.random() * 0.006) * (Math.random() < 0.5 ? 1 : -1),
      size:  7 + Math.random() * 4,
      alpha: 0.12 + Math.random() * 0.25,
      tick:  Math.floor(Math.random() * 80),
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Glow
      const grd = ctx.createRadialGradient(cx, cy, 2, cx, cy, 32);
      grd.addColorStop(0, GLOW);
      grd.addColorStop(1, "transparent");
      ctx.save();
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // Orbiting characters
      particles.forEach(p => {
        p.angle += p.speed;
        if (--p.tick <= 0) {
          p.char = CHARS[Math.floor(Math.random() * CHARS.length)];
          p.tick = 40 + Math.floor(Math.random() * 80);
        }
        const x = cx + Math.cos(p.angle) * p.radius;
        const y = cy + Math.sin(p.angle) * p.radius * 0.55;
        ctx.save();
        ctx.globalAlpha  = p.alpha;
        ctx.fillStyle    = ACCENT;
        ctx.font         = `${p.size}px 'SF Mono','Menlo','Courier New',monospace`;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, x, y);
        ctx.restore();
      });

      // Left accent bar
      ctx.save();
      ctx.fillStyle   = ACCENT;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.roundRect(8, 10, 3, 24, 2);
      ctx.fill();
      ctx.restore();

      // "Methoryn" text
      ctx.save();
      ctx.globalAlpha  = 1;
      ctx.fillStyle    = ACCENT;
      ctx.font         = "bold 17px 'SF Mono','Menlo','Courier New',monospace";
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor  = ACCENT;
      ctx.shadowBlur   = 8;
      ctx.fillText("Methoryn", cx + 4, cy + 1);
      ctx.restore();

      requestAnimationFrame(draw);
    }

    draw();
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("canvas[data-Methoryn-logo]").forEach(function (c) {
      initLogo(c.id);
    });
  });

  window.initMethorynLogo = initLogo;
})();
