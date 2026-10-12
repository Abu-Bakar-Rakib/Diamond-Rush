import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GameMode, GameState, Particle } from '../types';
import { executeMove, createNewGame } from '../gameLogic';
import { CANVAS_WIDTH, CANVAS_HEIGHT, TILE_SIZE, COLS, ROWS, LEVEL_METADATA, getLevelConfig } from '../levels';
import { sounds } from '../audio';
import { Gem, RotateCcw, ArrowLeft, Clock, Footprints, AlertTriangle, RefreshCw } from 'lucide-react';

interface GameCanvasProps {
  mode: GameMode;
  levelNumber: number;
  onVictory: (finalState: GameState) => void;
  onGoHome: () => void;
  onChangeMode: () => void;
}

interface CrushInfo {
  playerX: number;
  playerY: number;
  rockFromX: number;
  rockFromY: number;
  startTime: number;
}

function drawDizzyStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number) {
  ctx.save();
  ctx.fillStyle = '#fde047';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const aOut = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const aIn = aOut + Math.PI / 5;
    if (i === 0) {
      ctx.moveTo(cx + Math.cos(aOut) * outerR, cy + Math.sin(aOut) * outerR);
    } else {
      ctx.lineTo(cx + Math.cos(aOut) * outerR, cy + Math.sin(aOut) * outerR);
    }
    ctx.lineTo(cx + Math.cos(aIn) * innerR, cy + Math.sin(aIn) * innerR);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawComicSplat(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number, alpha: number) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Jagged comic starburst spikes
  const points = 12;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points;
    const r = i % 2 === 0 ? 28 : 15;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = '#ef4444';
  ctx.fill();
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3;
  ctx.stroke();

  // SPLAT! text
  ctx.font = '900 13px "Arial Black", Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.strokeText('SPLAT!', 0, 1);
  ctx.fillText('SPLAT!', 0, 1);

  ctx.restore();
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  mode,
  levelNumber,
  onVictory,
  onGoHome,
  onChangeMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef<GameState>(createNewGame(mode, levelNumber));
  const [hudState, setHudState] = useState<GameState>({ ...gameStateRef.current });
  const [notification, setNotification] = useState<{ text: string; type: 'info' | 'warn' | 'success' } | null>(null);
  const [lastDir, setLastDir] = useState<[number, number]>([0, 1]); // Direction player is facing

  // Visual Crush Animation state
  const crushRef = useRef<CrushInfo | null>(null);
  const deathTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [crushedBanner, setCrushedBanner] = useState<{
    active: boolean;
    boulderCol: number;
    boulderRow: number;
  } | null>(null);

  // Particle systems & screen shake
  const particlesRef = useRef<Particle[]>([]);
  const shakeRef = useRef<number>(0);

  // Initialize or reset game when mode or levelNumber changes
  useEffect(() => {
    if (deathTimeoutRef.current) {
      clearTimeout(deathTimeoutRef.current);
      deathTimeoutRef.current = null;
    }
    crushRef.current = null;
    setCrushedBanner(null);
    gameStateRef.current = createNewGame(mode, levelNumber);
    setHudState({ ...gameStateRef.current });
    particlesRef.current = [];
    shakeRef.current = 0;
  }, [mode, levelNumber]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (deathTimeoutRef.current) clearTimeout(deathTimeoutRef.current);
    };
  }, []);

  // Spawn visual particle burst at (px, py)
  const spawnParticles = (px: number, py: number, color: string, count = 12, speed = 2.5) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const spd = (Math.random() * 0.7 + 0.3) * speed;
      particlesRef.current.push({
        x: px,
        y: py,
        vx: Math.cos(angle) * spd,
        vy: Math.sin(angle) * spd,
        color,
        size: Math.random() * 3 + 2,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 20 + 20,
      });
    }
  };

  // Perform a step in direction (dx, dy)
  const handleMove = useCallback((dx: number, dy: number) => {
    setLastDir([dx, dy]);
    const res = executeMove(gameStateRef.current, dx, dy);

    if (res.moved) {
      // Trigger particles based on action
      if (res.event === 'diamond' && res.diamondAt) {
        const [gx, gy] = res.diamondAt;
        spawnParticles(gx * TILE_SIZE + 20, gy * TILE_SIZE + 20, '#38bdf8', 16, 3.2);
        setNotification({ text: `GEM COLLECTED! (${res.state.collected}/${res.state.total})`, type: 'info' });
      } else if (res.event === 'dug' && res.dugAt) {
        const [gx, gy] = res.dugAt;
        spawnParticles(gx * TILE_SIZE + 20, gy * TILE_SIZE + 20, '#a16207', 8, 1.8);
      } else if (res.event === 'pushed' && res.pushedTo) {
        const [gx, gy] = res.pushedTo;
        spawnParticles(gx * TILE_SIZE + 20, gy * TILE_SIZE + 20, '#f43f5e', 8, 2.0);
      } else if (res.event === 'unlocked') {
        setNotification({ text: 'EXIT UNLOCKED! HEAD TO THE PORTAL!', type: 'success' });
      } else if (res.event === 'crushed') {
        // High-impact dramatic screen shake
        shakeRef.current = 26;

        const [px, py] = res.crushedAt || res.state.player;
        const [rx, ry] = res.crushedFrom || [px, Math.max(0, py - 1)];

        // Record crush details for animation loop
        crushRef.current = {
          playerX: px,
          playerY: py,
          rockFromX: rx,
          rockFromY: ry,
          startTime: performance.now(),
        };

        // Stone debris, dust clouds, and danger sparks
        for (let i = 0; i < 30; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 4.5 + 1.5;
          particlesRef.current.push({
            x: px * TILE_SIZE + 20,
            y: py * TILE_SIZE + 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            color: ['#78716c', '#a8a29e', '#e7e5e4', '#f59e0b', '#ef4444', '#fbbf24'][i % 6],
            size: Math.random() * 4.5 + 2.5,
            alpha: 1,
            life: 0,
            maxLife: 45,
          });
        }

        // Show educational in-game alert banner
        setCrushedBanner({
          active: true,
          boulderCol: rx + 1,
          boulderRow: ry + 1,
        });

        // Give the player enough time to see the animation and understand the physics
        if (deathTimeoutRef.current) clearTimeout(deathTimeoutRef.current);
        deathTimeoutRef.current = setTimeout(() => {
          crushRef.current = null;
          setCrushedBanner(null);
          gameStateRef.current = createNewGame(mode, levelNumber, res.state.deaths, res.state.wins);
          setHudState({ ...gameStateRef.current });
        }, 2200);
      } else if (res.event === 'victory') {
        onVictory(res.state);
      }

      setHudState({ ...res.state });
    }
  }, [mode, levelNumber, onVictory]);

  // Manual reset level (R key)
  const handleRestart = useCallback(() => {
    if (deathTimeoutRef.current) {
      clearTimeout(deathTimeoutRef.current);
      deathTimeoutRef.current = null;
    }
    crushRef.current = null;
    setCrushedBanner(null);
    sounds.playClick();
    gameStateRef.current = createNewGame(mode, levelNumber, gameStateRef.current.deaths + 1, gameStateRef.current.wins);
    setHudState({ ...gameStateRef.current });
    particlesRef.current = [];
    setNotification({ text: 'SECTOR RESTARTED', type: 'info' });
  }, [mode, levelNumber]);

  // Timer tick for live clock
  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameStateRef.current.isComplete && !gameStateRef.current.isDead) {
        const elapsed = Math.floor((Date.now() - gameStateRef.current.startTime) / 1000);
        gameStateRef.current.elapsedSeconds = elapsed;
        setHudState((prev) => ({ ...prev, elapsedSeconds: elapsed }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Clear notifications after timeout
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 2200);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      // If crushed banner is showing, Space or Enter instantly restarts
      if (crushRef.current && (e.key === ' ' || e.key === 'Enter')) {
        handleRestart();
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleMove(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleMove(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleMove(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleMove(1, 0);
          break;
        case 'r':
        case 'R':
          handleRestart();
          break;
        case 'Escape':
          sounds.playClick();
          onGoHome();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, handleRestart, onGoHome]);

  // Canvas Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = (time: number) => {
      const state = gameStateRef.current;
      const isCrushedActive = crushRef.current !== null;

      // Handle screen shake
      ctx.save();
      if (shakeRef.current > 0) {
        const ox = (Math.random() - 0.5) * shakeRef.current;
        const oy = (Math.random() - 0.5) * shakeRef.current;
        ctx.translate(ox, oy);
        shakeRef.current *= 0.88;
        if (shakeRef.current < 0.5) shakeRef.current = 0;
      }

      // 1. Draw Background
      ctx.fillStyle = '#0c0f13';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // 2. Draw Grid Tiles
      const unlocked = state.collected >= state.total;

      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const tile = state.grid[y][x];
          const px = x * TILE_SIZE;
          const py = y * TILE_SIZE;

          if (tile === '#') {
            // Unbreakable Stone Wall
            ctx.fillStyle = '#202731';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#303947';
            ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 2);
            ctx.fillRect(px + 1, py + 1, 2, TILE_SIZE - 2);
            ctx.fillStyle = '#141920';
            ctx.fillRect(px + 1, py + TILE_SIZE - 3, TILE_SIZE - 2, 2);
            ctx.fillRect(px + TILE_SIZE - 3, py + 1, 2, TILE_SIZE - 2);
            ctx.fillStyle = '#2b3340';
            ctx.fillRect(px + 6, py + 6, 12, 10);
            ctx.fillRect(px + 22, py + 20, 12, 12);
          } else if (tile === 'd') {
            // Diggable Dirt
            ctx.fillStyle = '#784e2d';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#8f613a';
            ctx.fillRect(px + 4, py + 5, 14, 3);
            ctx.fillRect(px + 8, py + 29, 12, 3);
            ctx.fillStyle = '#5b3a28';
            ctx.fillRect(px + 23, py + 17, 12, 3);
            ctx.fillRect(px + 28, py + 32, 5, 2);
          } else if (tile === 'O') {
            // Check if this boulder is currently on top of the crushed player
            const isCrushBoulder =
              isCrushedActive &&
              crushRef.current?.playerX === x &&
              crushRef.current?.playerY === y;

            if (isCrushBoulder && crushRef.current) {
              // --- DRAW SQUASHED ACCORDION PANCAKE PLAYER UNDER BOULDER ---
              ctx.save();
              // Flat ground shadow
              ctx.beginPath();
              ctx.ellipse(px + 20, py + 36, 22, 4, 0, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
              ctx.fill();

              // Flattened wide yellow pancake body
              ctx.beginPath();
              ctx.ellipse(px + 20, py + 33, 21, 5, 0, 0, Math.PI * 2);
              ctx.fillStyle = '#ffd650';
              ctx.fill();
              ctx.strokeStyle = '#b45309';
              ctx.lineWidth = 1;
              ctx.stroke();

              // Little flat hands sprawled out horizontally
              ctx.fillStyle = '#f59e0b';
              ctx.beginPath();
              ctx.arc(px - 1, py + 33, 3.5, 0, Math.PI * 2);
              ctx.arc(px + 41, py + 33, 3.5, 0, Math.PI * 2);
              ctx.fill();

              // Dead X_X eyes
              ctx.strokeStyle = '#7f1d1d';
              ctx.lineWidth = 1.6;
              // Left Eye X
              ctx.beginPath();
              ctx.moveTo(px + 13, py + 31); ctx.lineTo(px + 17, py + 35);
              ctx.moveTo(px + 17, py + 31); ctx.lineTo(px + 13, py + 35);
              // Right Eye X
              ctx.moveTo(px + 23, py + 31); ctx.lineTo(px + 27, py + 35);
              ctx.moveTo(px + 27, py + 31); ctx.lineTo(px + 23, py + 35);
              ctx.stroke();

              // Tiny dizzy pink tongue
              ctx.fillStyle = '#f43f5e';
              ctx.beginPath();
              ctx.arc(px + 20, py + 35.5, 2, 0, Math.PI);
              ctx.fill();
              ctx.restore();
            }

            // Crimson Rock Circle with sphere shading
            ctx.beginPath();
            ctx.arc(px + 21, py + 23, 17, 0, Math.PI * 2);
            ctx.fillStyle = '#411622';
            ctx.fill();
            // Main sphere
            ctx.beginPath();
            ctx.arc(px + 19, py + 19, 16, 0, Math.PI * 2);
            ctx.fillStyle = '#972737';
            ctx.fill();
            // Core highlight
            ctx.beginPath();
            ctx.arc(px + 14, py + 13, 6, 0, Math.PI * 2);
            ctx.fillStyle = '#bf424b';
            ctx.fill();
            // Bottom shading
            ctx.beginPath();
            ctx.arc(px + 27, py + 25, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#6b1c2b';
            ctx.fill();

            // If this boulder crushed the player, draw 3D orbiting comic dizzy stars overhead!
            if (isCrushBoulder) {
              for (let si = 0; si < 3; si++) {
                const starAngle = (time / 140) + (si * Math.PI * 2) / 3;
                const sx = px + 20 + Math.cos(starAngle) * 22;
                const sy = py - 4 + Math.sin(starAngle) * 7;
                drawDizzyStar(ctx, sx, sy, 5, 2.5);
              }
            }
          } else if (tile === '*') {
            // Bright Cyan Diamond (Rotated polygon with sparkle glow)
            const pulse = Math.sin(time / 250 + x * 2 + y) * 0.15 + 0.85;

            // Ambient glow
            ctx.save();
            ctx.globalAlpha = 0.2 * pulse;
            ctx.fillStyle = '#45e7f8';
            ctx.beginPath();
            ctx.arc(px + 20, py + 20, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Diamond polygon facets
            ctx.beginPath();
            ctx.moveTo(px + 20, py + 5);
            ctx.lineTo(px + 36, py + 21);
            ctx.lineTo(px + 20, py + 37);
            ctx.lineTo(px + 4, py + 21);
            ctx.closePath();
            ctx.fillStyle = '#14535f';
            ctx.fill();

            // Main body
            ctx.beginPath();
            ctx.moveTo(px + 20, py + 3);
            ctx.lineTo(px + 35, py + 19);
            ctx.lineTo(px + 20, py + 35);
            ctx.lineTo(px + 5, py + 19);
            ctx.closePath();
            ctx.fillStyle = '#45e7f8';
            ctx.fill();

            // Top facet light
            ctx.beginPath();
            ctx.moveTo(px + 20, py + 3);
            ctx.lineTo(px + 20, py + 19);
            ctx.lineTo(px + 5, py + 19);
            ctx.closePath();
            ctx.fillStyle = '#b8faff';
            ctx.fill();

            // Bottom facet shadow
            ctx.beginPath();
            ctx.moveTo(px + 20, py + 19);
            ctx.lineTo(px + 35, py + 19);
            ctx.lineTo(px + 20, py + 35);
            ctx.closePath();
            ctx.fillStyle = '#26a6c5';
            ctx.fill();
          } else if (tile === 'P') {
            // Normal living player (if not in crushed state)
            ctx.beginPath();
            ctx.arc(px + 20, py + 24, 16, 0, Math.PI * 2);
            ctx.fillStyle = '#6a4c18';
            ctx.fill();

            // Body
            ctx.beginPath();
            ctx.arc(px + 20, py + 19, 15, 0, Math.PI * 2);
            ctx.fillStyle = '#ffd650';
            ctx.fill();

            // Hat / Head highlight
            ctx.beginPath();
            ctx.arc(px + 16, py + 13, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#fff09c';
            ctx.fill();

            // Directional Explorer Eyes
            const [dx, dy] = lastDir;
            const eyeX = px + 20 + dx * 4;
            const eyeY = py + 18 + dy * 3;

            // Eye whites
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(eyeX - 3, eyeY, 2.5, 0, Math.PI * 2);
            ctx.arc(eyeX + 3, eyeY, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Eye pupils
            ctx.fillStyle = '#222222';
            ctx.beginPath();
            ctx.arc(eyeX - 3 + dx * 0.8, eyeY + dy * 0.8, 1.2, 0, Math.PI * 2);
            ctx.arc(eyeX + 3 + dx * 0.8, eyeY + dy * 0.8, 1.2, 0, Math.PI * 2);
            ctx.fill();
          } else if (tile === 'E') {
            // Exit Door (Red when locked / Pulsing Green when unlocked)
            const doorColor = unlocked ? '#45cf8a' : '#d4454d';
            const pulse = unlocked ? Math.sin(time / 180) * 0.2 + 0.8 : 1;

            ctx.fillStyle = '#23282e';
            ctx.fillRect(px + 4, py + 2, 32, 38);

            ctx.fillStyle = doorColor;
            ctx.fillRect(px + 8, py + 5, 24, 33);

            ctx.fillStyle = '#172325';
            ctx.fillRect(px + 11, py + 8, 18, 24);

            // Door handle
            ctx.fillStyle = doorColor;
            ctx.beginPath();
            ctx.arc(px + 25, py + 22, 2.5, 0, Math.PI * 2);
            ctx.fill();

            if (unlocked) {
              // Glowing portal effect
              ctx.save();
              ctx.globalAlpha = 0.4 * pulse;
              ctx.fillStyle = '#45cf8a';
              ctx.fillRect(px + 12, py + 9, 16, 22);
              ctx.restore();
            }
          }
        }
      }

      // 3. Render and Update Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity on particles
        p.life++;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          particlesRef.current.splice(i, 1);
        }
      }

      // 4. Dramatic Crushed Visual FX (Overlays, Shockwave, Trajectory & SPLAT Comic Blast)
      if (crushRef.current) {
        const { rockFromX, rockFromY, playerX, playerY, startTime } = crushRef.current;
        const elapsed = time - startTime;

        ctx.save();

        // (a) Falling trajectory dotted guide line
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(rockFromX * TILE_SIZE + 20, rockFromY * TILE_SIZE + 20);
        ctx.lineTo(playerX * TILE_SIZE + 20, playerY * TILE_SIZE + 10);
        ctx.stroke();
        ctx.setLineDash([]);

        // Origin danger marker
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(rockFromX * TILE_SIZE + 20, rockFromY * TILE_SIZE + 20, 5, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing downward hazard arrow
        const travelDistance = Math.max(1, (playerY - rockFromY) * TILE_SIZE - 12);
        const arrowProgress = (elapsed * 0.08) % travelDistance;
        const arrowY = rockFromY * TILE_SIZE + 22 + arrowProgress;
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⬇', rockFromX * TILE_SIZE + 20, arrowY);

        // (b) Expanding ground impact shockwave ring
        if (elapsed < 600) {
          const shockR = Math.min(65, (elapsed / 450) * 65);
          const shockAlpha = Math.max(0, 1 - elapsed / 500);
          ctx.strokeStyle = `rgba(245, 158, 11, ${shockAlpha})`;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(playerX * TILE_SIZE + 20, playerY * TILE_SIZE + 25, shockR, 0, Math.PI * 2);
          ctx.stroke();
        }

        // (c) Comic "SPLAT!" impact blast starburst (first 750ms)
        if (elapsed < 750) {
          const popScale = Math.sin(Math.min(1, elapsed / 180) * (Math.PI / 2));
          const popAlpha = Math.max(0, 1 - (elapsed - 320) / 400);
          drawComicSplat(ctx, playerX * TILE_SIZE + 20, playerY * TILE_SIZE - 20, popScale, popAlpha);
        }

        // (d) Red danger border vignette around canvas frame
        const pulseBorder = Math.sin(time / 110) * 0.25 + 0.55;
        ctx.strokeStyle = `rgba(239, 68, 68, ${pulseBorder})`;
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, CANVAS_WIDTH - 6, CANVAS_HEIGHT - 6);

        ctx.restore();
      }

      // 5. In-Canvas Top Status Header Bar
      ctx.fillStyle = '#1d2227';
      ctx.fillRect(8, 5, 340, 29);
      ctx.font = 'bold 16px Consolas, Monaco, monospace';
      ctx.fillStyle = '#b8faff';
      ctx.fillText(
        `DIAMOND RUSH   ${String(state.collected).padStart(2, '0')}/${String(state.total).padStart(2, '0')}`,
        17,
        25
      );

      ctx.fillStyle = '#1d2227';
      ctx.fillRect(628, 5, 164, 29);
      ctx.fillStyle = unlocked ? '#45cf8a' : '#d4454d';
      ctx.fillText(unlocked ? 'EXIT OPEN' : 'EXIT LOCKED', 648, 25);

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [lastDir]);

  const levelInfo = LEVEL_METADATA[mode];
  const progressPercent = Math.min(100, (hudState.collected / hudState.total) * 100);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };



  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-5xl mx-auto w-full my-auto animate-fade-in select-none">
      {/* Top HUD Controls Bar */}
      <div className="w-full max-w-[800px] flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              onChangeMode();
            }}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 sm:gap-2 transition-all ${levelInfo.badgeBg} hover:opacity-90 active:scale-95`}
            title="Change Difficulty or Stage"
          >
            <span>{levelInfo.id}</span>
            <span className="px-1.5 py-0.5 rounded bg-black/40 text-cyan-300 font-mono text-[10px] sm:text-[11px]">
              STAGE {levelNumber}/5
            </span>
          </button>

          <span className="hidden md:inline text-xs font-bold text-zinc-300 font-mono">
            {getLevelConfig(mode, levelNumber).name}
          </span>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-[11px] sm:text-xs font-mono text-zinc-300">
            <Footprints className="w-3.5 h-3.5 text-cyan-400" />
            <span><strong className="text-white">{hudState.moves}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 text-[11px] sm:text-xs font-mono text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span><strong className="text-white">{formatTimer(hudState.elapsedSeconds)}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-all active:scale-95"
            title="Reset Level (Press R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESTART</span>
            <kbd className="hidden sm:inline text-[10px] text-zinc-500 font-mono">R</kbd>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onGoHome();
            }}
            className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-95"
            title="Return to Menu (ESC)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Arcade Frame & 800x600 Canvas */}
      <div className="relative border-8 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/40 bg-zinc-950">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block"
        />

        {/* Dramatic Interactive Crushed Physics Overlay */}
        {crushedBanner && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 z-20 animate-fade-in pointer-events-auto">
            <div className="max-w-md w-full bg-zinc-950/95 border-2 border-rose-500/80 rounded-2xl p-5 shadow-2xl shadow-rose-950/60 text-center animate-bounce-once">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold mb-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>PHYSICS HAZARD: GRAVITY CRUSH</span>
              </div>

              <h3 className="text-2xl font-black text-white tracking-wide mb-1 flex items-center justify-center gap-2">
                <span>💥 CRUSHED BY BOULDER!</span>
              </h3>

              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                You excavated underneath an unsupported rock! When dirt below a boulder is cleared, gravity drops it straight down.
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-500/25 active:scale-95"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-reverse" />
                  <span>RESPAWN NOW</span>
                </button>
              </div>

              <div className="mt-3 text-[11px] font-mono text-zinc-500">
                Rewinding cavern in 2s • Tap screen or button to retry immediately
              </div>
            </div>
          </div>
        )}

        {/* Floating Notification */}
        {notification && (
          <div
            className={`absolute top-4 sm:top-12 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-[11px] sm:text-xs font-mono font-bold tracking-wider shadow-2xl backdrop-blur-md pointer-events-none animate-bounce ${
              notification.type === 'warn'
                ? 'border-rose-500/60 bg-rose-950/90 text-rose-200'
                : notification.type === 'success'
                ? 'border-emerald-500/60 bg-emerald-950/90 text-emerald-200'
                : 'border-cyan-500/60 bg-cyan-950/90 text-cyan-200'
            }`}
          >
            {notification.text}
          </div>
        )}
      </div>

      {/* Progress Bar & Gem Counter */}
      <div className="w-full max-w-[800px] mt-3 p-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Gem className="w-4 h-4 animate-pulse" />
            <span>DIAMONDS:</span>
          </div>
          <span className="text-sm font-black text-white">
            {hudState.collected} <span className="text-zinc-500">/ {hudState.total}</span>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-2 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-3 text-zinc-400 text-xs">
          <span>PORTAL: <strong className={hudState.isUnlocked ? 'text-emerald-400' : 'text-rose-400'}>{hudState.isUnlocked ? 'OPEN' : 'LOCKED'}</strong></span>
          <span className="text-zinc-500">•</span>
          <span>RESETS: <strong className="text-rose-300">{hudState.deaths}</strong></span>
        </div>
      </div>

      {/* Control reminder */}
      <div className="mt-3 text-center text-xs font-mono text-zinc-500 flex items-center justify-center gap-4">
        <span>Controls: <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Arrow Keys</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">WASD</kbd></span>
        <span>•</span>
        <span>Restart: <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">R</kbd></span>
        <span>•</span>
        <span>Menu: <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">ESC</kbd></span>
      </div>
    </div>
  );
};
