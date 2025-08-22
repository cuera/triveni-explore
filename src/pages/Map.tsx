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
      
      {/* Full-bleed immersive map container */}
      <div className="fixed inset-0 top-16 bottom-[calc(80px+var(--safe-bottom))] lg:bottom-0 bg-background">
        <div className="h-full p-3 space-y-3">
          <div className="bg-muted rounded-full p-1 inline-flex">
            {(['ground','first'] as const).map(f=>(
              <button key={f} onClick={()=>setFloor(f)}
                className={`px-3 py-1 rounded-full text-sm ${f===floor?'bg-foreground text-background':''}`}>
                {f==='ground'?'Ground':'First'}
              </button>
            ))}
          </div>
          <div className="h-[calc(100%-60px)]">
            <MapView floorImage={img} floor={floor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;

