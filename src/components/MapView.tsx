'use client';
import { useRef, useState, useEffect } from 'react';

type FloorKey = 'ground' | 'first';

export default function MapView({ floorImage, floor }: { floorImage: string; floor: FloorKey }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  const [dragging, setDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const lastTapTs = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const clampOffsets = (nextScale: number, nx: number, ny: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const imgRect = imgRef.current?.getBoundingClientRect();
    if (!rect || !imgRect) return { nx, ny };
    
    // Calculate the scaled image dimensions
    const scaledWidth = imgRect.width * nextScale;
    const scaledHeight = imgRect.height * nextScale;
    
    // Calculate maximum offsets to keep image within container
    const maxX = Math.max(0, (scaledWidth - rect.width) / 2);
    const maxY = Math.max(0, (scaledHeight - rect.height) / 2);
    
    return {
      nx: Math.max(-maxX, Math.min(maxX, nx)),
      ny: Math.max(-maxY, Math.min(maxY, ny)),
    };
  };

  const smoothZoomTo = (targetScale: number, targetTx: number, targetTy: number, duration = 400) => {
    if (isAnimating) return; // Prevent multiple animations
    
    const startScale = scale;
    const startTx = tx;
    const startTy = ty;
    const startTime = performance.now();
    
    setIsAnimating(true);
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for natural feel (ease-out-quart)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentScale = startScale + (targetScale - startScale) * easeOutQuart;
      const currentTx = startTx + (targetTx - startTx) * easeOutQuart;
      const currentTy = startTy + (targetTy - startTy) * easeOutQuart;
      
      setScale(currentScale);
      setTx(currentTx);
      setTy(currentTy);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        animationRef.current = null;
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const zoomAtPoint = (clientX: number, clientY: number) => {
    if (isAnimating) return; // Don't allow zoom during animation
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Multi-level zoom: 1 → 1.5 → 2.5 → 4 → 1
    const zoomLevels = [1, 1.5, 2.5, 4];
    const currentIndex = zoomLevels.findIndex(level => Math.abs(level - scale) < 0.1);
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % zoomLevels.length : 1;
    const newScale = zoomLevels[nextIndex];

    // Offset of tap from center
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = clientX - rect.left - cx;
    const dy = clientY - rect.top - cy;

    // Adjust translate so the tapped point tends toward center when zooming in
    let nx = tx - (dx * (newScale - scale)) / newScale;
    let ny = ty - (dy * (newScale - scale)) / newScale;
    const clamped = clampOffsets(newScale, nx, ny);
    
    // Use smooth animation instead of instant change
    smoothZoomTo(newScale, clamped.nx, clamped.ny);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return; // only drag when zoomed beyond 1x
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, tx, ty };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !dragStart.current) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const nextX = dragStart.current.tx + dx;
    const nextY = dragStart.current.ty + dy;
    const clamped = clampOffsets(scale, nextX, nextY);
    setTx(clamped.nx);
    setTy(clamped.ny);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    setDragging(false);
    dragStart.current = null;

    // Double-tap detection (touch & mouse)
    const now = Date.now();
    if (now - lastTapTs.current < 300) {
      zoomAtPoint(e.clientX, e.clientY);
      lastTapTs.current = 0;
    } else {
      lastTapTs.current = now;
    }
  };

  const onDoubleClick = (e: React.MouseEvent) => {
    zoomAtPoint(e.clientX, e.clientY);
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex justify-between items-center mb-2 flex-shrink-0">
        <div className="text-sm text-muted-foreground">Double‑tap to zoom • Drag to pan</div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{scale.toFixed(1)}x</span>
          {scale > 1 && (
            <button onClick={() => smoothZoomTo(1, 0, 0)} className="px-3 py-1 text-xs rounded-full border">
              Reset
            </button>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg shadow touch-pan-y flex-1"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onDoubleClick={onDoubleClick}
        style={{
          minHeight: '400px' // ensure minimum height for the map
        }}
      >
        <img
          ref={imgRef}
          src={floorImage}
          alt={`${floor} floor map`}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-contain select-none transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        />
        <div className="absolute right-2 bottom-2 text-xs px-2 py-1 rounded-full bg-background/80 border">
          {floor === 'ground' ? 'Ground Floor' : 'First Floor'}
        </div>
      </div>
    </div>
  );
}

