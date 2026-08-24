"use client";
import { useState, useRef, useEffect, useCallback, useLayoutEffect, useMemo } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { trackViewGallery } from "@/lib/ga4";

// ---------- cx utility function ----------
const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(' ');

/* ────────────────────────────────────
   Gallery images
   ──────────────────────────────────── */
const galleryImages = [
  { src: "/images/gallery/gallery-1.jpg", alt: "Overwater villa at sunrise" },
  { src: "/images/gallery/gallery-2.jpg", alt: "Infinity pool overlooking the lagoon" },
  { src: "/images/gallery/gallery-3.jpg", alt: "Beachfront dining under the stars" },
  { src: "/images/gallery/gallery-4.jpg", alt: "Cliff‑edge yoga session" },
  { src: "/images/gallery/gallery-5.jpg", alt: "Sunset from the private deck" },
  { src: "/images/gallery/gallery-6.jpg", alt: "Lush tropical gardens" },
  { src: "/images/gallery/gallery-7.jpg", alt: "Spacious Ocean Junior Suite" },
  { src: "/images/gallery/gallery-8.jpg", alt: "Organic farm‑to‑table breakfast" },
  { src: "/images/gallery/gallery-9.jpg", alt: "Night kayaking under stars" },
];

/* ────────────────────────────────────
   Floating decoration
   ──────────────────────────────────── */
function FloatingDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute top-[10%] left-[5%] w-20 h-20 md:w-24 md:h-24 rounded-full bg-teal-400/10 blur-2xl"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[5%] w-24 h-24 md:w-32 md:h-32 rounded-full bg-emerald-300/10 blur-2xl"
        animate={{ scale: [1, 1.2, 1], rotate: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ────────────────────────────────────
   Lightbox
   ──────────────────────────────────── */
function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: {
  images: typeof galleryImages;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) onPrev();
      else onNext();
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    };

    window.addEventListener("keydown", handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery lightbox"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative max-w-5xl w-full mx-2 md:mx-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full aspect-[4/3] md:aspect-[16/10] rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition backdrop-blur"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition backdrop-blur"
          >
            <ChevronRight size={24} />
          </button>

          <button
            type="button"
            aria-label="Close gallery"
            onClick={onClose}
            className="absolute top-2 md:top-4 right-2 md:right-4 p-1.5 md:p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition backdrop-blur"
          >
            <X size={22} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-2 md:p-4">
            <p className="text-white text-xs md:text-sm text-center">
              {images[currentIndex].alt}
            </p>
            <p className="text-white/60 text-[10px] md:text-xs text-center mt-0.5">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────
   DriftWall Component (Vertical Infinite Scroll with 3D)
   ──────────────────────────────────── */
interface DriftWallItem {
  image: string;
  title?: string;
}

interface DriftWallProps {
  items: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: 'up' | 'down';
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  onItemClick?: (item: DriftWallItem) => void;
  className?: string;
}

const columnFactor = (index: number, variance: number): number => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

function DriftWall({
  items,
  columns = 4,
  tileWidth = 200,
  tileHeight = 132,
  gap = 16,
  radius = 14,
  tilt = 10,
  turn = -8,
  roll = 0,
  perspective = 1200,
  depth = 50,
  speed = 55,
  direction = 'up',
  variance = 0.35,
  parallax = 0.5,
  pauseOnHover = true,
  lift = 24,
  fade = 0.85,
  dim = 0.9,
  grayscale = false,
  overlayColor = 'rgba(10,30,30,0.1)',
  onItemClick,
  className = '',
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef<number>(-1);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);
  const pointerDownInfoRef = useRef<{
    x: number;
    y: number;
    time: number;
    item: DriftWallItem | null;
  }>({ x: 0, y: 0, time: 0, item: null });
  const releaseTimeoutRef = useRef<number | null>(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const columnItems = useMemo<DriftWallItem[][]>(() => {
    const cols: DriftWallItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map((col) => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo<number[]>(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.15) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    applyPlaneTransform(0, 0);

    if (reduced) {
      for (let c = 0; c < trackRefs.current.length; c++) {
        const el = trackRefs.current[c];
        const meta = columnMeta[c];
        if (el && meta) {
          el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }
      return;
    }

    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      for (let c = 0; c < trackRefs.current.length; c++) {
        const meta = columnMeta[c];
        if (!meta) continue;

        const paused = pauseOnHover && hoveredColRef.current === c;
        const factor = paused ? 0 : 1;
        const target = baseVelocities[c] * factor;

        const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
        velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
        let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
        next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
        offsetsRef.current[c] = next;

        const el = trackRefs.current[c];
        if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [
    reduced,
    baseVelocities,
    columnMeta,
    pauseOnHover,
    parallax,
    applyPlaneTransform,
  ]);

  const clearReleaseTimeout = useCallback(() => {
    if (releaseTimeoutRef.current !== null) {
      clearTimeout(releaseTimeoutRef.current);
      releaseTimeoutRef.current = null;
    }
  }, []);

  const activate = useCallback((id: string, index: number): void => {
    clearReleaseTimeout();
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, [clearReleaseTimeout]);

  const release = useCallback((): void => {
    clearReleaseTimeout();
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, [clearReleaseTimeout]);

  const getItemFromTileId = useCallback(
    (id: string): DriftWallItem | null => {
      const parts = id.split('-');
      if (parts.length < 3) return null;
      const c = Number(parts[0]);
      const itemIndex = Number(parts[2]);
      const col = columnItems[c];
      return col ? col[itemIndex] || null : null;
    },
    [columnItems]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest
        ? (hit.closest('[data-tile-id]') as HTMLElement | null)
        : null;

      let item: DriftWallItem | null = null;
      if (tile) {
        const id = tile.dataset.tileId ?? '';
        item = getItemFromTileId(id);
      }

      pointerDownInfoRef.current = {
        x: e.clientX,
        y: e.clientY,
        time: performance.now(),
        item,
      };
    },
    [getItemFromTileId]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const info = pointerDownInfoRef.current;
      const dx = Math.abs(e.clientX - info.x);
      const dy = Math.abs(e.clientY - info.y);
      const dt = performance.now() - info.time;

      if (info.item && dx < 10 && dy < 10 && dt < 600) {
        if (onItemClick) onItemClick(info.item);
      }

      pointerDownInfoRef.current = { x: 0, y: 0, time: 0, item: null };
    },
    [onItemClick]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5,
        };
      }

      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest
        ? (hit.closest('[data-tile-id]') as HTMLElement | null)
        : null;

      if (!tile) {
        // If no tile hovered, schedule a release after a short delay to avoid flicker
        if (activeIdRef.current !== null) {
          if (releaseTimeoutRef.current === null) {
            releaseTimeoutRef.current = window.setTimeout(() => {
              release();
            }, 80); // 80ms delay
          }
        }
        return;
      }

      // Tile found: clear any pending release
      if (releaseTimeoutRef.current !== null) {
        clearReleaseTimeout();
      }

      const id = tile.dataset.tileId;
      if (!id) return; // Safety: tile should always have data-tile-id, but guard for TypeScript
      if (id === activeIdRef.current) return;

      activate(id, Number(tile.dataset.col));
    },
    [parallax, reduced, activate, release, clearReleaseTimeout]
  );

  const handlePointerLeaveWall = useCallback((): void => {
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  useEffect(() => {
    return () => {
      clearReleaseTimeout();
    };
  }, [clearReleaseTimeout]);

  const cssVars = useMemo(
    () =>
      ({
        '--dw-tile-w': `${tileWidth}px`,
        '--dw-tile-h': `${tileHeight}px`,
        '--dw-gap': `${gap}px`,
        '--dw-radius': `${radius}px`,
        '--dw-lift': `${lift}px`,
        '--dw-dim': dim,
        '--dw-gray': grayscale ? 1 : 0,
        '--dw-overlay': overlayColor,
        '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
        perspective: `${perspective}px`,
        perspectiveOrigin: '50% 50%',
        touchAction: 'pan-y',
        WebkitMaskImage:
          'radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%), linear-gradient(to top, #000 var(--dw-edge), transparent 100%)',
        maskImage:
          'radial-gradient(ellipse 78% 82% at 50% 46%, #000 var(--dw-edge), transparent 100%), linear-gradient(to top, #000 var(--dw-edge), transparent 100%)',
      }) as React.CSSProperties,
    [tileWidth, tileHeight, gap, radius, lift, dim, grayscale, overlayColor, fade, perspective]
  );

  const tileClass =
    'group/tile relative block flex-none cursor-pointer outline-none w-[calc(var(--dw-tile-w)+var(--dw-gap))] h-[calc(var(--dw-tile-h)+var(--dw-gap))] [transform-style:preserve-3d]';

  const innerClass =
    'pointer-events-none absolute inset-[calc(var(--dw-gap)/2)] block overflow-hidden bg-[#0b0b12] rounded-[var(--dw-radius)] opacity-[var(--dw-dim)] transition-[transform,opacity,box-shadow] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform transform-gpu group-[.is-active]/tile:opacity-100 group-[.is-active]/tile:[transform:scale(1.03)] group-[.is-active]/tile:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)] group-focus-visible/tile:opacity-100 group-focus-visible/tile:[transform:scale(1.03)] group-focus-visible/tile:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)]';

  const imgClass =
    'block h-full w-full select-none object-cover [filter:grayscale(var(--dw-gray))_saturate(0.92)] transition-[filter] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-[.is-active]/tile:[filter:grayscale(0)_saturate(1.05)] group-focus-visible/tile:[filter:grayscale(0)_saturate(1.05)]';

  const overlayClass =
    'pointer-events-none absolute inset-0 bg-[var(--dw-overlay)] opacity-[0.2] transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-[.is-active]/tile:opacity-0 group-focus-visible/tile:opacity-0';

  const renderTile = (item: DriftWallItem, id: string, colIndex: number) => {
    const inner = (
      <span className={innerClass}>
        <img
          src={item.image}
          alt={item.title || 'Gallery image'}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={imgClass}
        />
        <span className={overlayClass} aria-hidden="true" />
      </span>
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (onItemClick) onItemClick(item);
      }
    };

    return (
      <div
        key={id}
        tabIndex={0}
        role="button"
        aria-label={item.title || 'Gallery image'}
        className={cx(tileClass, activeId === id && 'is-active')}
        data-tile-id={id}
        data-col={colIndex}
        onFocus={() => activate(id, colIndex)}
        onBlur={release}
        onKeyDown={handleKeyDown}
      >
        {inner}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cx('relative h-full w-full overflow-hidden', className)}
      style={cssVars}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of tiles"
    >
      <div
        ref={planeRef}
        className="absolute left-1/2 top-1/2 flex cursor-pointer flex-row [transform-style:preserve-3d] [transform-origin:50%_50%] will-change-transform"
      >
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div
              className="relative w-[calc(var(--dw-tile-w)+var(--dw-gap))] [transform-style:preserve-3d]"
              key={`col-${c}`}
            >
              <div
                className="flex flex-col [transform-style:preserve-3d] will-change-transform"
                ref={(el) => {
                  trackRefs.current[c] = el;
                }}
              >
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) =>
                    renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c)
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────
   Main Gallery Component
   ──────────────────────────────────── */
export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(4);
  const [tileWidth, setTileWidth] = useState(240);
  const [tileHeight, setTileHeight] = useState(150);
  const [gap, setGap] = useState(20);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setColumns(3);
        setTileWidth(100);
        setTileHeight(72);
        setGap(10);
      } else if (w < 768) {
        setColumns(3);
        setTileWidth(110);
        setTileHeight(80);
        setGap(12);
      } else if (w < 1024) {
        setColumns(3);
        setTileWidth(160);
        setTileHeight(110);
        setGap(16);
      } else {
        setColumns(4);
        setTileWidth(240);
        setTileHeight(150);
        setGap(20);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    trackViewGallery({ image_count: galleryImages.length });
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 18 });
  const opacity = useTransform(smoothProgress, [0, 0.2], [0.6, 1]);

  const openLightbox = useCallback((index: number) => setSelectedIndex(index), []);
  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % galleryImages.length : 0
    );
  }, []);

  const prevImage = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0
    );
  }, []);

  const handleTileClick = useCallback(
    (item: { image: string }) => {
      const idx = galleryImages.findIndex((img) => img.src === item.image);
      if (idx !== -1) openLightbox(idx);
    },
    [openLightbox]
  );

  const driftItems = useMemo(
    () => galleryImages.map((img) => ({ image: img.src, title: img.alt })),
    []
  );

  const isMobile = columns <= 3;

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-14 md:py-24 overflow-hidden bg-gradient-to-b from-white to-teal-50/20"
      >
        <FloatingDecorations />

        <motion.div
          style={{ opacity }}
          className="relative z-10 max-w-[90rem] mx-auto px-4 md:px-8"
        >
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-10 md:mb-16"
          >
            <span className="inline-block text-teal-600 uppercase tracking-[0.25em] text-xs md:text-sm font-semibold mb-3">
              Gallery
            </span>
            <h2 className="text-3xl md:text-5xl font-['Playfair_Display',serif] font-extrabold text-gray-800 mb-3 md:mb-4">
              Moments That Stay With You
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg">
              Drift through Zain's Serenity — a curated visual journey of light,
              water, and unforgettable stays.
            </p>
          </motion.div>

          {/* Drift Wall */}
          <div className="h-[400px] sm:h-[480px] md:h-[600px] lg:h-[640px]">
            <DriftWall
              items={driftItems}
              columns={columns}
              tileWidth={tileWidth}
              tileHeight={tileHeight}
              gap={gap}
              radius={14}
              tilt={isMobile ? 6 : 10}
              turn={isMobile ? -4 : -8}
              roll={0}
              perspective={1200}
              depth={isMobile ? 30 : 50}
              speed={isMobile ? 40 : 55}
              direction="up"
              variance={0.35}
              parallax={isMobile ? 0.25 : 0.5}
              pauseOnHover={true}
              lift={isMobile ? 18 : 24}
              fade={0.85}
              dim={0.9}
              grayscale={false}
              overlayColor="rgba(10,30,30,0.1)"
              onItemClick={handleTileClick}
            />
          </div>

          {/* Sparkles */}
          <motion.div
            className="absolute bottom-4 right-4 hidden md:block"
            animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="text-teal-400/40 w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
        </motion.div>
      </section>

      <AnimatePresence>
        {selectedIndex !== null && (
          <ImageLightbox
            images={galleryImages}
            currentIndex={selectedIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </>
  );
}