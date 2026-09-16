/**
 * @author: @dorianbaffier (adapted)
 * @description: Beams Background — container-sized adaptation of Kokonut UI free component
 * @version: 1.0.0
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { motion } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/shared/lib';

interface AnimatedGradientBackgroundProps {
  className?: string;
  children?: ReactNode;
  intensity?: 'subtle' | 'medium' | 'strong';
  /** Cool cyan/blue (default) or warm terracotta / sand / gold wash for hero. */
  tone?: 'cool' | 'warm';
}

interface Beam {
  x: number;
  y: number;
  width: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  hue: number;
  pulse: number;
  pulseSpeed: number;
}

function hueConfig(isDarkMode: boolean, tone: 'cool' | 'warm') {
  if (tone === 'warm') {
    // terracotta ~18, sandy-brown ~28, light-gold ~42
    return {
      hueBase: isDarkMode ? 18 : 22,
      hueRange: isDarkMode ? 28 : 24,
      saturation: isDarkMode ? '78%' : '72%',
      lightness: isDarkMode ? '58%' : '48%',
    };
  }
  return {
    hueBase: isDarkMode ? 190 : 210,
    hueRange: isDarkMode ? 70 : 50,
    saturation: isDarkMode ? '85%' : '75%',
    lightness: isDarkMode ? '65%' : '45%',
  };
}

function createBeam(
  width: number,
  height: number,
  isDarkMode: boolean,
  tone: 'cool' | 'warm',
): Beam {
  const angle = -35 + Math.random() * 10;
  const { hueBase, hueRange } = hueConfig(isDarkMode, tone);

  return {
    x: Math.random() * width * 1.5 - width * 0.25,
    y: Math.random() * height * 1.5 - height * 0.25,
    width: 30 + Math.random() * 60,
    length: height * 2.5,
    angle,
    speed: 0.6 + Math.random() * 1.2,
    opacity: 0.12 + Math.random() * 0.16,
    hue: hueBase + Math.random() * hueRange,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: 0.02 + Math.random() * 0.03,
  };
}

export function BeamsBackground({
  className,
  children,
  intensity = 'strong',
  tone = 'cool',
}: AnimatedGradientBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beamsRef = useRef<Beam[]>([]);
  const animationFrameRef = useRef<number>(0);
  const MINIMUM_BEAMS = 20;
  const isDarkModeRef = useRef(false);
  const toneRef = useRef(tone);
  const sizeRef = useRef({ width: 0, height: 0 });

  const opacityMap = {
    subtle: 0.7,
    medium: 0.85,
    strong: 1,
  };

  useEffect(() => {
    toneRef.current = tone;
  }, [tone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateDarkMode = () => {
      isDarkModeRef.current = document.documentElement.classList.contains('dark');
    };

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    updateDarkMode();

    const updateCanvasSize = (width: number, height: number) => {
      if (width <= 0 || height <= 0) return;
      const dpr = window.devicePixelRatio || 1;
      sizeRef.current = { width, height };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const totalBeams = Math.floor(MINIMUM_BEAMS * 1.5);
      beamsRef.current = Array.from({ length: totalBeams }, () =>
        createBeam(width, height, isDarkModeRef.current, toneRef.current),
      );
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      updateCanvasSize(width, height);
    });
    resizeObserver.observe(container);

    // Initial size from container
    const rect = container.getBoundingClientRect();
    updateCanvasSize(rect.width, rect.height);

    function resetBeam(beam: Beam, index: number, totalBeams: number) {
      const { width, height } = sizeRef.current;
      if (!width || !height) return beam;

      const column = index % 3;
      const spacing = width / 3;
      const { hueBase, hueRange } = hueConfig(isDarkModeRef.current, toneRef.current);

      beam.y = height + 100;
      beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
      beam.width = 100 + Math.random() * 100;
      beam.length = height * 2.5;
      beam.speed = 0.5 + Math.random() * 0.4;
      beam.hue = hueBase + (index * hueRange) / totalBeams;
      beam.opacity = 0.2 + Math.random() * 0.1;
      return beam;
    }

    function drawBeam(context: CanvasRenderingContext2D, beam: Beam) {
      context.save();
      context.translate(beam.x, beam.y);
      context.rotate((beam.angle * Math.PI) / 180);

      const pulsingOpacity =
        beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * opacityMap[intensity];

      const gradient = context.createLinearGradient(0, 0, 0, beam.length);
      const { saturation, lightness } = hueConfig(isDarkModeRef.current, toneRef.current);

      gradient.addColorStop(0, `hsla(${beam.hue}, ${saturation}, ${lightness}, 0)`);
      gradient.addColorStop(
        0.1,
        `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity * 0.5})`,
      );
      gradient.addColorStop(
        0.4,
        `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity})`,
      );
      gradient.addColorStop(
        0.6,
        `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity})`,
      );
      gradient.addColorStop(
        0.9,
        `hsla(${beam.hue}, ${saturation}, ${lightness}, ${pulsingOpacity * 0.5})`,
      );
      gradient.addColorStop(1, `hsla(${beam.hue}, ${saturation}, ${lightness}, 0)`);

      context.fillStyle = gradient;
      context.fillRect(-beam.width / 2, 0, beam.width, beam.length);
      context.restore();
    }

    function animate() {
      if (!(canvas && ctx)) return;
      const { width, height } = sizeRef.current;
      if (width <= 0 || height <= 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.filter = 'blur(35px)';

      const totalBeams = beamsRef.current.length;
      beamsRef.current.forEach((beam, index) => {
        beam.y -= beam.speed;
        beam.pulse += beam.pulseSpeed;

        if (beam.y + beam.length < -100) {
          resetBeam(beam, index, totalBeams);
        }

        drawBeam(ctx, beam);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      observer.disconnect();
    };
  }, [intensity, tone]);

  const warmSurface =
    tone === 'warm'
      ? 'bg-vanilla-custard-50/80 dark:bg-sandy-brown-950/90'
      : 'bg-neutral-100 dark:bg-neutral-950';

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden', warmSurface, className)}
    >
      <canvas
        className="pointer-events-none absolute inset-0"
        ref={canvasRef}
        style={{ filter: 'blur(15px)' }}
      />

      <motion.div
        aria-hidden
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        className={cn(
          'pointer-events-none absolute inset-0',
          tone === 'warm'
            ? 'bg-fiery-terracotta-900/5 dark:bg-light-gold-950/10'
            : 'bg-neutral-900/5 dark:bg-neutral-950/5',
        )}
        style={{ backdropFilter: 'blur(50px)' }}
        transition={{
          duration: 10,
          ease: 'easeInOut',
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
