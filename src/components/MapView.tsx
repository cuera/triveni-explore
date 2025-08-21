'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type FloorKey = 'ground' | 'first';
interface Hotspot {
  id: string;
  label: string;
  deptId: string | null;
  room: string;
  block: string;
  floor: FloorKey;
  x: number; y: number;
}

export default function MapView({ floorImage, floor }: { floorImage: string; floor: FloorKey }) {
  const [spots, setSpots] = useState<Hotspot[]>([]);
  const [active, setActive] = useState<Hotspot | null>(null);
  const [edit, setEdit] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => { import('@/data/hotspots.json').then(m => setSpots(m.default as Hotspot[])); }, []);

  const filtered = useMemo(() => spots.filter(s => s.floor === floor), [spots, floor]);

  const onMapClick = (e: React.MouseEvent) => {
    if (!edit || !imgRef.current) return;
    const r = imgRef.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = (e.clientY - r.top) / r.height;
    const text = `{ "x": ${nx.toFixed(3)}, "y": ${ny.toFixed(3)} }`;
    navigator.clipboard?.writeText(text); alert(`Copied ${text} → paste into hotspots.json`);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">Tap to open, long-press to zoom (pinch on mobile)</div>
        <button onClick={()=>setEdit(v=>!v)} className={`px-3 py-1 text-xs rounded-full border ${edit?'bg-foreground text-background':''}`}>
          {edit?'Editing (tap map)':'Edit pins'}
        </button>
      </div>

      <div className="relative" onClick={onMapClick}>
        <img ref={imgRef} src={floorImage} alt="floor map" className="w-full h-auto select-none rounded-lg shadow" />
        {filtered.map(s => (
          <button key={s.id} aria-label={s.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.x*100}%`, top: `${s.y*100}%` }}
            onClick={(ev)=>{ ev.stopPropagation(); setActive(s); }}>
            <span className="block w-4 h-4 rounded-full bg-foreground ring-2 ring-background" />
            <span className="absolute left-1/2 top-5 -translate-x-1/2 text-[10px] bg-foreground text-background rounded px-1.5 py-0.5 whitespace-nowrap">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      <Sheet open={!!active} onOpenChange={()=>setActive(null)}>
        <SheetContent side="bottom" className="max-w-md mx-auto">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.label}</SheetTitle>
              </SheetHeader>
              <div className="mt-2 text-sm text-muted-foreground">
                {active.room} • {active.block} • {active.floor}
              </div>
              {active.deptId && (
                <a href={`/departments/${active.deptId}`} className="mt-3 inline-block px-3 py-2 rounded-lg bg-foreground text-background text-sm">
                  Open department
                </a>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

