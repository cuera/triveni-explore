'use client';
import { useRef, useState } from 'react';

type FloorKey = 'ground' | 'first';

export default function MapView({ floorImage, floor }: { floorImage: string; floor: FloorKey }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);

  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const lastTapTs = useRef(0);

  const clampOffsets = (nextScale: number, nx: number, ny: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { nx, ny };
    const maxX = (rect.width * (nextScale - 1)) / 2;
    const maxY = (rect.height * (nextScale - 1)) / 2;
    return {
      nx: Math.max(-maxX, Math.min(maxX, nx)),
      ny: Math.max(-maxY, Math.min(maxY, ny)),
    };
  };

  const zoomAtPoint = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newScale = scale === 1 ? 2 : 1;

    // Offset of tap from center
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = clientX - rect.left - cx;
    const dy = clientY - rect.top - cy;

    // Adjust translate so the tapped point tends toward center when zooming in
    let nx = tx - (dx * (newScale - scale)) / newScale;
    let ny = ty - (dy * (newScale - scale)) / newScale;
    const clamped = clampOffsets(newScale, nx, ny);
    setTx(clamped.nx);
    setTy(clamped.ny);
    setScale(newScale);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale === 1) return; // only drag when zoomed
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
        {scale > 1 && (
          <button onClick={() => { setScale(1); setTx(0); setTy(0); }} className="px-3 py-1 text-xs rounded-full border">
            Reset
          </button>
        )}
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
          className={`w-full h-auto select-none transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
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

