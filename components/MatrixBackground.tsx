"use client";

import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix rain effect
    const characters = "01";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to track the y position of each column
    const drops: number[] = Array(columns).fill(0);

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text
      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      // Loop through each drop
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = characters.charAt(
          Math.floor(Math.random() * characters.length)
        );

        // Draw the character
        ctx.fillStyle = `rgba(0, 255, 0, ${Math.random() * 0.5 + 0.5})`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Move the drop down
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" />;
}
