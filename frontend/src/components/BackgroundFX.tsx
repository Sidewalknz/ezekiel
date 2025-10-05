"use client";

import { useEffect, useRef } from "react";
import styles from "./BackgroundFX.module.css";

/** Allowed effect names */
type EffectType =
  | "snow"
  | "roll"
  | "vcr"
  | "wobblex"
  | "wobbley"
  | "scanlines"
  | "vignette"
  | "image"
  | "video";

/** Options per effect (shared superset) */
type EffectConfig = {
  fps?: number;
  blur?: number;
  opacity?: number;
  src?: string;
  miny?: number;
  miny2?: number;
  maxy?: number;
  num?: number;
};

/** Elements we may attach as "node" for an effect */
type EffectNode =
  | HTMLCanvasElement
  | HTMLDivElement
  | HTMLImageElement
  | HTMLVideoElement;

type Effect = {
  wrapper: HTMLElement;
  node?: EffectNode;
  enabled: boolean;
  config: EffectConfig;
  ctx?: CanvasRenderingContext2D | null;
  original?: Element | null;
};

type EffectMap = Partial<Record<EffectType, Effect>>;

type ScreenNodes = {
  container: HTMLDivElement;
  wrapper1: HTMLDivElement;
  wrapper2: HTMLDivElement;
  wrapper3: HTMLDivElement;
};

function getRandomInt(min: number, max: number) {
  const imin = Math.ceil(min);
  const imax = Math.floor(max);
  return Math.floor(Math.random() * (imax - imin + 1)) + imin;
}

class ScreenEffect {
  parent: HTMLElement;
  config: Record<string, unknown>;
  effects: EffectMap = {};
  nodes!: ScreenNodes;
  rect!: DOMRect;
  dpr = 1;

  vcrInterval: number | null = null;
  vcrRAF: number | null = null;
  snowInterval: number | null = null;
  snowframe: number | null = null;

  /** expose so caller can remove listener on cleanup */
  events: { resize: () => void };

  constructor(parent: HTMLElement, options: Record<string, unknown>) {
    this.parent = parent;
    this.config = { ...options };
    this.events = { resize: this.onResize.bind(this) };
    window.addEventListener("resize", this.events.resize, false);
    this.render();
  }

  render() {
    const container = document.createElement("div");
    container.classList.add(styles.screenContainer);

    const wrapper1 = document.createElement("div");
    wrapper1.classList.add(styles.screenWrapper);

    const wrapper2 = document.createElement("div");
    wrapper2.classList.add(styles.screenWrapper);

    const wrapper3 = document.createElement("div");
    wrapper3.classList.add(styles.screenWrapper);

    wrapper1.appendChild(wrapper2);
    wrapper2.appendChild(wrapper3);
    container.appendChild(wrapper1);

    // Insert container before parent; move parent inside wrapper3
    this.parent.parentNode?.insertBefore(container, this.parent);
    wrapper3.appendChild(this.parent);

    this.nodes = { container, wrapper1, wrapper2, wrapper3 };
    this.onResize();
  }

  onResize() {
    this.rect = this.parent.getBoundingClientRect();

    // DPR scale helps reduce shimmer/flicker
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
    this.dpr = dpr;

    // Resize canvases to DPR but keep CSS size the same
    (["vcr", "snow"] as const).forEach((key) => {
      const eff = this.effects[key];
      if (!eff || !eff.node || !(eff.node instanceof HTMLCanvasElement)) return;

      const cssW = this.rect.width;
      const cssH = this.rect.height;

      eff.node.width = Math.max(1, Math.floor(cssW * dpr));
      eff.node.height = Math.max(1, Math.floor(cssH * dpr));
      eff.node.style.width = `${cssW}px`;
      eff.node.style.height = `${cssH}px`;

      if (eff.ctx) {
        eff.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        eff.ctx.imageSmoothingEnabled = false;
      }
    });

    if (this.effects.vcr && this.effects.vcr.enabled) {
      this.generateVCRNoise();
    }
  }

  add(type: EffectType, options?: EffectConfig): this;
  add(types: EffectType[], options?: EffectConfig): this;
  add(typeOrTypes: EffectType | EffectType[], options?: EffectConfig): this {
    const config: EffectConfig = Object.assign({ fps: 30, blur: 1 }, options);

    if (Array.isArray(typeOrTypes)) {
      for (const t of typeOrTypes) this.add(t, options);
      return this;
    }

    const type = typeOrTypes;

    if (type === "snow") {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha: true });

      canvas.classList.add(styles.canvasBase, styles.snowCanvas);

      // DPR-aware sizing
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      const cssW = this.rect?.width || window.innerWidth;
      const cssH = this.rect?.height || window.innerHeight;

      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (ctx) ctx.imageSmoothingEnabled = false;

      this.nodes.wrapper2.appendChild(canvas);

      // Throttle snow to ~15fps
      const intervalMs = 66;
      const tick = () => {
        if (ctx) this.generateSnow(ctx);
      };
      tick();
      this.snowInterval = window.setInterval(tick, intervalMs);

      this.effects.snow = {
        wrapper: this.nodes.wrapper2,
        node: canvas,
        enabled: true,
        config,
      };
      return this;
    }

    if (type === "roll") {
      this.enableRoll();
      return this;
    }

    if (type === "vcr") {
      const canvas = document.createElement("canvas");
      canvas.classList.add(styles.canvasBase, styles.vcrCanvas);
      this.nodes.wrapper2.appendChild(canvas);

      // DPR-aware sizing
      const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1));
      const cssW = this.rect?.width || window.innerWidth;
      const cssH = this.rect?.height || window.innerHeight;

      canvas.width = Math.max(1, Math.floor(cssW * dpr));
      canvas.height = Math.max(1, Math.floor(cssH * dpr));
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      const ctx = canvas.getContext("2d", { alpha: true });
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (ctx) ctx.imageSmoothingEnabled = false;

      this.effects.vcr = {
        wrapper: this.nodes.wrapper2,
        node: canvas,
        ctx,
        enabled: true,
        config,
      };

      this.generateVCRNoise();
      return this;
    }

    // DOM-based effects
    let node: EffectNode | null = null;
    let wrapper: HTMLElement = this.nodes.wrapper2;

    switch (type) {
      case "wobblex":
        wrapper.classList.add(styles.wobblex);
        break;
      case "wobbley":
        wrapper.classList.add(styles.wobbley);
        break;
      case "scanlines": {
        const div = document.createElement("div");
        div.classList.add(styles.scanlines);
        wrapper.appendChild(div);
        node = div; // HTMLDivElement
        break;
      }
      case "vignette": {
        wrapper = this.nodes.container;
        const div = document.createElement("div");
        div.classList.add(styles.vignette);
        wrapper.appendChild(div);
        node = div; // HTMLDivElement
        break;
      }
      case "image": {
        wrapper = this.parent;
        const img = document.createElement("img");
        img.classList.add(styles.image);
        img.src = options?.src || "";
        wrapper.appendChild(img);
        node = img; // HTMLImageElement
        break;
      }
      case "video": {
        wrapper = this.parent;
        const video = document.createElement("video");
        video.classList.add(styles.video);
        video.src = options?.src || "";
        video.crossOrigin = "anonymous";
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        wrapper.appendChild(video);
        node = video; // HTMLVideoElement
        break;
      }
      default:
        break;
    }

    this.effects[type] = {
      wrapper,
      node: node ?? undefined,
      enabled: true,
      config,
    };

    return this;
  }

  remove(type: EffectType) {
    const obj = this.effects[type];
    if (obj && obj.enabled) {
      obj.enabled = false;

      if (type === "roll" && obj.original) {
        this.parent.appendChild(obj.original);
      }
      if (type === "vcr") {
        if (this.vcrInterval !== null) window.clearInterval(this.vcrInterval);
        if (this.vcrRAF !== null) window.cancelAnimationFrame(this.vcrRAF);
        this.vcrInterval = null;
        this.vcrRAF = null;
      }
      if (type === "snow") {
        if (this.snowInterval !== null) window.clearInterval(this.snowInterval);
        if (this.snowframe !== null) window.cancelAnimationFrame(this.snowframe);
        this.snowInterval = null;
        this.snowframe = null;
      }

      if (obj.node) {
        obj.wrapper.removeChild(obj.node);
      } else {
        obj.wrapper.classList.remove(styles.wobblex, styles.wobbley);
      }
    }
    return this;
  }

  enableRoll() {
    const el = this.parent.firstElementChild;
    if (el) {
      const div = document.createElement("div");
      div.classList.add(styles.roller);
      this.parent.appendChild(div);
      div.appendChild(el);
      div.appendChild(el.cloneNode(true));

      this.effects.roll = {
        enabled: true,
        wrapper: this.parent,
        node: div,
        original: el,
        config: {},
      };
    }
  }

  generateVCRNoise() {
    const vcr = this.effects.vcr;
    if (!vcr || !vcr.node || !(vcr.node instanceof HTMLCanvasElement)) return;

    const { config } = vcr;
    const fps = Math.max(10, Math.min(30, config.fps || 24)); // calmer 24–30fps
    const period = Math.round(1000 / fps);

    if (this.vcrRAF !== null) window.cancelAnimationFrame(this.vcrRAF);
    if (this.vcrInterval !== null) window.clearInterval(this.vcrInterval);

    this.vcrInterval = window.setInterval(() => {
      this.renderTrackingNoise();
    }, period);
  }

  // CRT "snow"
  generateSnow(ctx: CanvasRenderingContext2D) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const d = ctx.createImageData(w, h);
    const buf = new Uint32Array(d.data.buffer);
    const len = buf.length;

    for (let i = 0; i < len; i++) {
      buf[i] = ((255 * Math.random()) | 0) << 24;
    }
    ctx.putImageData(d, 0, 0);
  }

  renderTrackingNoise(radius = 2, xmax?: number, ymax?: number) {
    const vcr = this.effects.vcr;
    if (!vcr || !vcr.node || !(vcr.node instanceof HTMLCanvasElement) || !vcr.ctx)
      return;

    const canvas = vcr.node;
    const ctx = vcr.ctx;
    const config = vcr.config;

    let posy1 = config.miny ?? 0;
    const posy2 = config.maxy ?? canvas.height;
    let posy3 = config.miny2 ?? 0;
    const num = Math.min(35, config.num ?? 25); // fewer -> calmer

    if (xmax === undefined) xmax = canvas.width;
    if (ymax === undefined) ymax = canvas.height;

    canvas.style.filter = `blur(${config.blur ?? 1.5}px)`; // soften
    ctx.globalAlpha = 0.6; // less harsh
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `#fff`;

    ctx.beginPath();
    for (let i = 0; i <= num; i++) {
      const x = Math.random() * xmax;
      const y1 = getRandomInt((posy1 += 3), posy2);
      const y2 = getRandomInt(0, (posy3 -= 3));
      ctx.fillRect(x, y1, radius, radius);
      ctx.fillRect(x, y2, radius, radius);

      this.renderTail(ctx, x, y1, radius);
      this.renderTail(ctx, x, y2, radius);
    }
    ctx.closePath();
  }

  renderTail(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    const n = getRandomInt(1, 20); // shorter tails
    const dirs = [1, -1] as const;
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    let rd = radius;

    for (let i = 0; i < n; i++) {
      const step = 0.01;
      const r = getRandomInt((rd -= step), radius);
      let dx = getRandomInt(1, 4);
      radius -= 0.1;
      dx *= dir;
      ctx.fillRect((x += dx), y, r, r);
    }
  }
}

export type BackgroundFXProps = {
  className?: string;
  /** Overlay content (rendered on top of the FX) */
  children?: React.ReactNode;
  /** If true, children are centered; otherwise placed in a non-centered overlay */
  overlayCentered?: boolean;
  /** Toggle certain effects */
  enableSnow?: boolean;
  enableVCR?: boolean;
  enableScanlines?: boolean;
  enableVignette?: boolean;
  enableWobbleY?: boolean;
};

export default function BackgroundFX({
  className,
  children,
  overlayCentered = true,
  enableSnow = true,
  enableVCR = true,
  enableScanlines = true,
  enableVignette = true,
  enableWobbleY = true,
}: BackgroundFXProps) {
  const screenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!screenRef.current) return;

    const screen = new ScreenEffect(screenRef.current, {});

    if (enableVignette) screen.add("vignette");
    if (enableScanlines) screen.add("scanlines");
    if (enableVCR)
      screen.add("vcr", {
        opacity: 0.6,
        miny: 220,
        miny2: 220,
        num: 28,
        fps: 24,
        blur: 1.6,
      });
    if (enableWobbleY) screen.add("wobbley");
    if (enableSnow) screen.add("snow", { opacity: 0.15 });

    return () => {
      screen.remove("snow");
      screen.remove("vcr");
      screen.remove("scanlines");
      screen.remove("vignette");
      screen.remove("wobbley");
      screen.remove("image");
      window.removeEventListener("resize", screen.events.resize, false);
    };
  }, [enableSnow, enableVCR, enableScanlines, enableVignette, enableWobbleY]);

  return (
    <div className={className}>
      <div ref={screenRef} className={styles.screen} />
      {children ? (
        overlayCentered ? (
          <div className={styles.centerTextWrapper}>{children}</div>
        ) : (
          <div className={styles.overlay}>{children}</div>
        )
      ) : null}
    </div>
  );
}
