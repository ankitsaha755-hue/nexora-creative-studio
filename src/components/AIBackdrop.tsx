import { useEffect, useRef } from "react";

/**
 * AIBackdrop
 * A fixed-position, pointer-events-none animated 3D AI-themed background.
 * Renders behind a wrapped section group. Uses CSS 3D transforms + a lightweight
 * canvas neural-net so it stays performant and theme-aware.
 */
const AIBackdrop = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lightweight animated neural-network constellation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let h = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const onResize = () => {
      w = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };
    window.addEventListener("resize", onResize);

    const NODE_COUNT = 38;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25 * window.devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.25 * window.devicePixelRatio,
      r: (Math.random() * 1.6 + 0.6) * window.devicePixelRatio,
    }));

    const LINK_DIST = 160 * window.devicePixelRatio;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // Move
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // Links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.35;
            ctx.strokeStyle = `hsla(265, 85%, 70%, ${alpha})`;
            ctx.lineWidth = 0.8 * window.devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      for (const n of nodes) {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 6);
        grad.addColorStop(0, "hsla(195, 100%, 70%, 0.9)");
        grad.addColorStop(1, "hsla(265, 85%, 60%, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "hsla(195, 100%, 85%, 0.95)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="ai-backdrop pointer-events-none absolute inset-0 overflow-hidden"
      style={{ perspective: "1200px" }}
    >
      {/* Soft gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent/[0.06]" />

      {/* Neural-net canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70"
      />

      {/* 3D floating shapes */}
      <div className="ai-shape ai-cube" style={{ top: "8%", left: "6%" }}>
        <span className="face f1" />
        <span className="face f2" />
        <span className="face f3" />
        <span className="face f4" />
        <span className="face f5" />
        <span className="face f6" />
      </div>

      <div className="ai-shape ai-cube small" style={{ top: "62%", left: "82%" }}>
        <span className="face f1" />
        <span className="face f2" />
        <span className="face f3" />
        <span className="face f4" />
        <span className="face f5" />
        <span className="face f6" />
      </div>

      <div className="ai-shape ai-ring" style={{ top: "30%", right: "8%" }} />
      <div className="ai-shape ai-ring slow" style={{ top: "78%", left: "10%" }} />

      <div className="ai-shape ai-orb" style={{ top: "18%", left: "48%" }} />
      <div className="ai-shape ai-orb alt" style={{ top: "70%", left: "40%" }} />

      {/* Floating AI tokens */}
      <div className="ai-token" style={{ top: "14%", left: "78%" }}>{"{ AI }"}</div>
      <div className="ai-token mono" style={{ top: "48%", left: "4%" }}>{"</ML>"}</div>
      <div className="ai-token" style={{ top: "84%", left: "55%" }}>{"01101"}</div>
    </div>
  );
};

export default AIBackdrop;
