import { useState } from 'react';
import MapView from '@/components/MapView';

const Map = () => {
  const [floor, setFloor] = useState<'ground'|'first'>('ground');
  const img = floor==='ground' ? '/groundfloor map.png' : '/first floor map.png';

  return (
    <main className="p-3 space-y-3">
      <div className="bg-muted rounded-full p-1 inline-flex">
        {(['ground','first'] as const).map(f=>(
          <button key={f} onClick={()=>setFloor(f)}
            className={`px-3 py-1 rounded-full text-sm ${f===floor?'bg-foreground text-background':''}`}>
            {f==='ground'?'Ground':'First'}
          </button>
        ))}
      </div>
      <MapView floorImage={img} floor={floor} />
    </main>
  );
};

export default Map;

