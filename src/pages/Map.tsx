import { useState } from 'react';
import MapView from '@/components/MapView';
import Navigation from '@/components/navigation';
import groundFloorMap from '@/assets/revised ground floor.png';
import firstFloorMap from '@/assets/revised 1st floor.png';

const Map = () => {
  const [floor, setFloor] = useState<'ground'|'first'>('ground');
  const img = floor==='ground' ? groundFloorMap : firstFloorMap;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
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
    </div>
  );
};

export default Map;

