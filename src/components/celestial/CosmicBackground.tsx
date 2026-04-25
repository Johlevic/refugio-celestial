import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  spikes: number;
  color: string;
  twinkle: number;
  rotation: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  type: "trail" | "nebula";
}

const PARTICLE_CONFIG = {
  mouseTrail: { count: 15, lifetime: 1000, size: [2, 8] as const },
  nebula: {
    count: 8,
    spread: 80,
    colors: ["#7b2ff7", "#2f80ed", "#56ccf2", "#e040fb", "#c9a227", "#d4af37"],
  },
  stars: {
    small: 60,
    large: 12,
    colors: ["#ffffff", "#ffe9c4", "#d4d4ff", "#ffd4e8", "#b8d4ff", "#f3e5ab"],
  },
};

function drawSpikeStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation = 0
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.beginPath();
  const outerRadius = size;
  const innerRadius = size * 0.4;

  for (let i = 0; i < 8; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / 4;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  const secSize = size * 0.6;
  const secInner = secSize * 0.35;
  ctx.rotate(Math.PI / 4);

  for (let i = 0; i < 8; i++) {
    const radius = i % 2 === 0 ? secSize : secInner;
    const angle = (i * Math.PI) / 4;
    const px = Math.cos(angle) * radius;
    const py = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function createNebulaParticle(x: number, y: number): Particle {
  const color =
    PARTICLE_CONFIG.nebula.colors[
      Math.floor(Math.random() * PARTICLE_CONFIG.nebula.colors.length)
    ]!;
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 2 + 0.5;

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size:
      Math.random() *
        (PARTICLE_CONFIG.mouseTrail.size[1] -
          PARTICLE_CONFIG.mouseTrail.size[0]) +
      PARTICLE_CONFIG.mouseTrail.size[0],
    color,
    life: 1,
    maxLife: Math.random() * 500 + PARTICLE_CONFIG.mouseTrail.lifetime,
    type: "nebula",
  };
}

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initStars = (width: number, height: number) => {
      starsRef.current = [];

      for (let i = 0; i < PARTICLE_CONFIG.stars.small; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.05 + 0.01;
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2 + 0.5,
          spikes: 0,
          color:
            PARTICLE_CONFIG.stars.colors[
              Math.floor(Math.random() * PARTICLE_CONFIG.stars.colors.length)
            ]!,
          twinkle: Math.random() * Math.PI * 2,
          rotation: 0,
        });
      }

      for (let i = 0; i < PARTICLE_CONFIG.stars.large; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.08 + 0.02;
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 4,
          spikes: 4,
          color:
            PARTICLE_CONFIG.stars.colors[
              Math.floor(Math.random() * PARTICLE_CONFIG.stars.colors.length)
            ]!,
          twinkle: Math.random() * Math.PI * 2,
          rotation: (Math.random() * Math.PI) / 4,
        });
      }
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      initStars(w, h);
    };

    const onPointer = (clientX: number, clientY: number) => {
      mouseRef.current = { x: clientX, y: clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      onPointer(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onPointer(t.clientX, t.clientY);
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -100, y: -100 };
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: -100, y: -100 };
    };

    const tick = () => {
      const width = canvas.width;
      const height = canvas.height;
      if (width < 1 || height < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#0a0a1e");
      gradient.addColorStop(0.45, "#0d0d32");
      gradient.addColorStop(1, "#060612");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      const { x: mouseX, y: mouseY } = mouseRef.current;
      frameRef.current += 1;

      if (mouseX > 0 && mouseY > 0 && frameRef.current % 5 === 0) {
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push(
            createNebulaParticle(
              mouseX + (Math.random() - 0.5) * PARTICLE_CONFIG.nebula.spread,
              mouseY + (Math.random() - 0.5) * PARTICLE_CONFIG.nebula.spread
            )
          );
        }
      }

      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.012;

        if (particle.life <= 0) return false;

        const g = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size
        );
        g.addColorStop(0, `${particle.color}55`);
        g.addColorStop(0.5, `${particle.color}22`);
        g.addColorStop(1, "transparent");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      if (particlesRef.current.length > 120) {
        particlesRef.current = particlesRef.current.slice(-90);
      }

      starsRef.current.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;

        // Recycle stars when they leave the viewport so they appear from another edge.
        if (star.x < -24) {
          star.x = width + 24;
          star.y = Math.random() * height;
        } else if (star.x > width + 24) {
          star.x = -24;
          star.y = Math.random() * height;
        }
        if (star.y < -24) {
          star.y = height + 24;
          star.x = Math.random() * width;
        } else if (star.y > height + 24) {
          star.y = -24;
          star.x = Math.random() * width;
        }

        star.twinkle += 0.02;
        const alpha = 0.45 + Math.sin(star.twinkle) * 0.45;

        if (star.spikes === 4) {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.shadowBlur = star.size * 3;
          ctx.shadowColor = star.color;
          ctx.fillStyle = star.color;
          drawSpikeStar(ctx, star.x, star.y, star.size, star.rotation);
          ctx.shadowBlur = 0;
          ctx.restore();
        } else {
          ctx.save();
          ctx.globalAlpha = alpha;
          const g = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            star.size * 3
          );
          g.addColorStop(0, star.color);
          g.addColorStop(0.45, `${star.color}99`);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
      style={{ background: "#060612" }}
    />
  );
}
