import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { Building, Users, MapPin, ArrowLeft } from "lucide-react";
import groundFloorMap from "@/assets/ground-floor-map.png";
import firstFloorMap from "@/assets/first-floor-map.png";

interface MapProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Map = ({ currentPath, onNavigate }: MapProps) => {
  const [selectedFloor, setSelectedFloor] = useState<'ground' | 'first'>('ground');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const groundFloorRooms = [
    { id: 'mi_room', name: 'MI Room', department: 'General', x: 15, y: 20 },
    { id: 'french_room', name: 'French Room', department: 'French', x: 15, y: 60 },
    { id: 'music', name: 'Music Room', department: 'Music', x: 40, y: 30 },
    { id: 'dance', name: 'Dance Room', department: 'Dance', x: 15, y: 80 },
    { id: 'ai_reception', name: 'AI Exhibition', department: 'STEM & AI', x: 50, y: 50 },
    { id: 'ey1', name: 'EY I', department: 'Early Years', x: 85, y: 20 },
    { id: 'ey2', name: 'EY II', department: 'Early Years', x: 85, y: 45 },
    { id: 'ey3a', name: 'EY III (A)', department: 'Early Years', x: 50, y: 85 },
    { id: 'ey3b', name: 'EY III (B)', department: 'Early Years', x: 85, y: 85 },
    { id: 'art_exhibition', name: 'Art & Craft Exhibition', department: 'Fine Arts', x: 50, y: 65 }
  ];

  const firstFloorRooms = [
    { id: 'commerce', name: 'Commerce (6A, 6B)', department: 'Commerce', x: 15, y: 20 },
    { id: 'fine_arts', name: 'Fine Arts Studio', department: 'Fine Arts', x: 25, y: 20 },
    { id: 'stem_lab', name: 'STEM Lab', department: 'Computer Science', x: 35, y: 20 },
    { id: 'math_lab', name: 'Math Labs (8A, 7C, 7A)', department: 'Mathematics', x: 25, y: 60 },
    { id: 'science_labs', name: 'Science Labs (8C, 8B)', department: 'Science (9-12)', x: 15, y: 70 },
    { id: 'social_science_68', name: 'Social Science (2A)', department: 'Social Science (6-8)', x: 75, y: 20 },
    { id: 'english_2c', name: 'English (2C)', department: 'English', x: 85, y: 45 },
    { id: 'hindi_maths_lab', name: 'Hindi & Sanskrit (Maths Lab)', department: 'Hindi & Sanskrit', x: 85, y: 80 },
    { id: 'social_science_910', name: 'Social Science (6C)', department: 'Social Science (9-10)', x: 15, y: 45 }
  ];

  const currentRooms = selectedFloor === 'ground' ? groundFloorRooms : firstFloorRooms;
  const currentMapImage = selectedFloor === 'ground' ? groundFloorMap : firstFloorMap;

  const handleRoomClick = (room: typeof groundFloorRooms[0]) => {
    setSelectedRoom(room.id);
  };

  const selectedRoomData = currentRooms.find(room => room.id === selectedRoom);

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPath={currentPath} onNavigate={onNavigate} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => onNavigate("/")}
            className="btn-glass"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">School Floor Maps</h1>
            <p className="text-muted-foreground">Navigate through the exhibition spaces</p>
          </div>
        </div>

        {/* Floor Selection */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={selectedFloor === 'ground' ? 'default' : 'outline'}
            onClick={() => setSelectedFloor('ground')}
            className="btn-hero"
          >
            <Building className="w-4 h-4 mr-2" />
            Ground Floor
          </Button>
          <Button
            variant={selectedFloor === 'first' ? 'default' : 'outline'}
            onClick={() => setSelectedFloor('first')}
            className="btn-hero"
          >
            <Building className="w-4 h-4 mr-2" />
            First Floor
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Display */}
          <div className="lg:col-span-2">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  {selectedFloor === 'ground' ? 'Ground Floor' : 'First Floor'} Layout
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-muted rounded-lg overflow-hidden">
                  <img 
                    src={currentMapImage} 
                    alt={`${selectedFloor} floor map`}
                    className="w-full h-auto"
                  />
                  
                  {/* Interactive Room Markers */}
                  {currentRooms.map((room) => (
                    <button
                      key={room.id}
                      className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-lg transition-all duration-300 hover:scale-150 ${
                        selectedRoom === room.id 
                          ? 'bg-primary scale-150' 
                          : 'bg-accent hover:bg-primary'
                      }`}
                      style={{ 
                        left: `${room.x}%`, 
                        top: `${room.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      onClick={() => handleRoomClick(room)}
                      title={room.name}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Room Information Sidebar */}
          <div className="space-y-4">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Room Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedRoomData ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{selectedRoomData.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {selectedRoomData.department}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">
                          {selectedFloor === 'ground' ? 'Ground Floor' : 'First Floor'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">
                          {selectedRoomData.name}
                        </span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => onNavigate(`/departments`)}
                      className="w-full btn-hero"
                    >
                      View Department Details
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Click on any room marker to see details
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-accent border-2 border-white"></div>
                    <span className="text-sm text-muted-foreground">Available Rooms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-primary border-2 border-white"></div>
                    <span className="text-sm text-muted-foreground">Selected Room</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-4">
                    Click on any marker to view room details and department information.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Access to Popular Departments */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'STEM & AI', path: '/departments', icon: '🤖' },
              { name: 'Science Labs', path: '/departments', icon: '🔬' },
              { name: 'Art Exhibition', path: '/departments', icon: '🎨' },
              { name: 'Commerce Hub', path: '/departments', icon: '💼' }
            ].map((dept) => (
              <Card key={dept.name} className="card-gradient cursor-pointer group" onClick={() => onNavigate(dept.path)}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                    {dept.icon}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {dept.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;