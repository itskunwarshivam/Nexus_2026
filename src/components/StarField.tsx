'use client';
import { useEffect, useRef } from 'react';

export default function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let stars: any[] = [];
    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const initStars = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      const isMobile = width < 768;
      const factor = isMobile ? 0.4 : 1.0;
      
      const count1 = Math.floor(200 * factor);
      const count2 = Math.floor(80 * factor);
      const count3 = Math.floor(30 * factor);

      stars = [];
      
      // Layer 1: distant tiny stars, slow drift
      for (let i = 0; i < count1; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 0.5 + 0.5,
          opacity: Math.random() * 0.2 + 0.3,
          speed: Math.random() * 0.05 + 0.01,
          layer: 1
        });
      }

      // Layer 2: medium stars, medium drift
      for (let i = 0; i < count2; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 0.5 + 1.0,
          opacity: Math.random() * 0.3 + 0.5,
          speed: Math.random() * 0.1 + 0.05,
          layer: 2
        });
      }

      // Layer 3: bright foreground stars, slight twinkle
      for (let i = 0; i < count3; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.0 + 1.5,
          opacity: Math.random() * 0.2 + 0.8,
          speed: Math.random() * 0.2 + 0.1,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleDir: 1,
          layer: 3
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        // Update position
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        // Twinkle logic for layer 3
        if (star.layer === 3) {
          star.opacity += star.twinkleSpeed * star.twinkleDir;
          if (star.opacity > 1) {
            star.opacity = 1;
            star.twinkleDir = -1;
          } else if (star.opacity < 0.4) {
            star.opacity = 0.4;
            star.twinkleDir = 1;
          }
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    initStars();
    draw();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        initStars();
      }, 200);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={ref} id="star-canvas" className="fixed inset-0 z-0 pointer-events-none" />;
}
