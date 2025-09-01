import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import { vConfetti } from '../directives/confetti';
import type { ConfigOptions } from '../../types';

// CONFETTI LOGIC IS BASED ON https://confettijs.org/

// simple 2D vector
class Vector2 {
  constructor(public x = 0, public y = 0) { }
}

// internal config class: merges defaults + overrides
class Config {
  gravity = 10;
  particleCount = 75;
  particleSize = 1;
  explosionPower = 25;
  destroyTarget = true;
  fade = false;
  fadeSpeed = 1;
  zIndex = 999999999;

  constructor(base: Required<ConfigOptions>, override: ConfigOptions = {}) {
    Object.assign(this, base, override);
  }
}

// single particle
class Particle {
  size: Vector2;
  pos: Vector2;
  vel: Vector2;
  rot = Math.random() * 360;
  rotSpeed = 10 * (Math.random() - 0.5);
  hue = Math.random() * 360;
  opacity = 100;
  life = Math.random() + 0.25;

  constructor(origin: Vector2, private cfg: Config) {
    const w = (16 * Math.random() + 4) * this.cfg.particleSize;
    const h = (4 * Math.random() + 4) * this.cfg.particleSize;
    this.size = new Vector2(w, h);
    this.pos = new Vector2(origin.x - w / 2, origin.y - h / 2);
    this.vel = ParticleUtils.gen(this.cfg.explosionPower);
  }

  update(dt: number) {
    this.vel.y +=
      this.cfg.gravity *
      (this.size.y / (10 * this.cfg.particleSize)) *
      dt;
    this.vel.x += 25 * (Math.random() - 0.5) * dt;
    this.vel.x *= 0.98;
    this.vel.y *= 0.98;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.rot += this.rotSpeed;
    if (this.cfg.fade) this.opacity -= (this.life * this.cfg.fadeSpeed);
  }

  outOfBounds() {
    return this.pos.y - 2 * this.size.x > window.innerHeight * 2 || this.opacity <= 0.01;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
    ctx.rotate((this.rot * Math.PI) / 180);
    ctx.beginPath();
    ctx.rect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    ctx.fillStyle = `hsla(${this.hue}deg,90%,65%,${this.opacity}%)`;
    ctx.fill();
    ctx.restore();
  }
}

// random velocity
const ParticleUtils = {
  gen(exp: number) {
    let vx = Math.random() - 0.5;
    let vy = Math.random() - 0.7;
    const len = Math.hypot(vx, vy) || 1;
    vx /= len;
    vy /= len;
    return new Vector2(
      vx * (Math.random() * exp),
      vy * (Math.random() * exp)
    );
  },
};

// draws all bursts
class Renderer {
  private canvas = document.createElement('canvas');
  private ctx = this.canvas.getContext('2d')!;
  private bursts: Particle[][] = [];
  private last = performance.now();
  private rafId: number | null = null;
  private resizeHandler = () => this.resize();
  private lastActive = performance.now();
  private readonly IDLE_MS = 3000;

  constructor(private zIndex: number, private onDestroy?: (z: number) => void) {
    this.resize();
    Object.assign(this.canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      margin: '0',
      padding: '0',
      zIndex: String(this.zIndex),
      pointerEvents: 'none'
    });
    document.body.appendChild(this.canvas);
    window.addEventListener('resize', this.resizeHandler);
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  private resize() {
    this.canvas.width = window.innerWidth * 2;
    this.canvas.height = window.innerHeight * 2;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  clearBursts() {
    this.bursts = [];
    this.lastActive = performance.now();
  }

  addBurst(p: Particle[]) {
    this.bursts.push(p);
    this.lastActive = performance.now();
  }

  private loop() {
    const now = performance.now();
    const dt = (now - this.last) / 1000;
    this.last = now;

    this.clear();
    this.bursts = this.bursts.filter(list => {
      list.forEach(p => { p.update(dt); p.draw(this.ctx); });
      return list.some(p => !p.outOfBounds());
    });

    if (this.bursts.length === 0 && (performance.now() - this.lastActive) > this.IDLE_MS) {
      this.destroy();
      return;
    }

    this.rafId = requestAnimationFrame(() => this.loop());
  }

  destroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    window.removeEventListener('resize', this.resizeHandler);
    if (this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);

    if (this.onDestroy) this.onDestroy(this.zIndex);
  }
}

// exposed service
export class ConfettiService {
  private base = useRuntimeConfig().public.confetti as Required<ConfigOptions>;
  private renderers = new Map<number, Renderer>();
  private getRenderer(z: number) {
    let r = this.renderers.get(z);
    if (!r) {
      r = new Renderer(z, (zIdx) => {
        this.renderers.delete(zIdx);
      });
      this.renderers.set(z, r);
    }
    return r;
  }

  /** burst on an element; optional overrides */
  burst(el: HTMLElement, cfg: ConfigOptions = {}) {
    const config = new Config(this.base, cfg);
    const rect = el.getBoundingClientRect();
    const origin = new Vector2((rect.left + rect.width / 2) * 2, (rect.top + rect.height / 2) * 2);
    const ps = Array.from({ length: config.particleCount }, () => new Particle(origin, config));
    const renderer = this.getRenderer(config.zIndex);
    renderer.addBurst(ps);
    if (cfg.destroyTarget ?? config.destroyTarget) {
      el.style.visibility = 'hidden';
    }
  }

  /** clear all confetti */
  clear() {
    this.renderers.forEach(r => {
      r.clearBursts();
      r.clear();
    });
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.client) return;
  const svc = new ConfettiService();

  nuxtApp.vueApp.directive('confetti', vConfetti);

  return {
    provide: {
      confetti: svc,
    }
  };
});
