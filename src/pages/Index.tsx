import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBox from "@/components/ui/search-box";
import Navigation from "@/components/navigation";
import DepartmentCard from "@/components/department-card";
import { Calendar, MapPin, Users, Clock, ArrowRight, Sparkles, QrCode, BookOpen } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

interface Department {
  id: string;
  name: string;
  teacher?: string;
  room: string;
  floor: string;
  classes: string;
  theme?: string;
  activities: string[];
  description?: string;
}

interface TimelineEvent {
  time: string;
  event: string;
  location: string;
  type: string;
  departmentId?: string;
}

const Index = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [nextEvent, setNextEvent] = useState<TimelineEvent | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    // Load departments data
    fetch('/data/departments.json')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('Failed to load departments:', err));

    // Load timeline data
    fetch('/data/timeline.json')
      .then(res => res.json())
      .then(data => {
        setTimeline(data);
        // Find next event
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const upcoming = data.find((event: TimelineEvent) => event.time > currentTime);
        setNextEvent(upcoming || data[0]);
      })
      .catch(err => console.error('Failed to load timeline:', err));
  }, []);

  const handleSearch = (result: any) => {
    if (result.type === 'department') {
      setCurrentPath(`/departments/${result.id}`);
    }
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const featuredDepartments = departments.slice(0, 6);

  if (currentPath !== "/") {
    // This is a simple router simulation - in a real app, you'd use Next.js routing
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentPath={currentPath} onNavigate={handleNavigate} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            Navigate to: {currentPath}
            <br />
            <Button variant="outline" onClick={() => setCurrentPath("/")}>
              Back to Home
            </Button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPath={currentPath} onNavigate={handleNavigate} />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-accent/60 to-success/70" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Sparkles className="w-3 h-3 mr-1" />
              August 23, 2025
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Triveni
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              The Ultimate School Exhibition Experience at Royal Global School
            </p>
            
            {/* Search Box */}
            <div className="max-w-md mx-auto mb-8">
              <SearchBox onSelect={handleSearch} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-glass"
                onClick={() => setCurrentPath("/departments")}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Departments
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="btn-glass"
                onClick={() => setCurrentPath("/timeline")}
              >
                <Clock className="mr-2 h-5 w-5" />
                View Schedule
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="card-gradient text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{departments.length}</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </CardContent>
            </Card>
            <Card className="card-gradient text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent">50+</div>
                <div className="text-sm text-muted-foreground">Activities</div>
              </CardContent>
            </Card>
            <Card className="card-gradient text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-success">3</div>
                <div className="text-sm text-muted-foreground">Blocks</div>
              </CardContent>
            </Card>
            <Card className="card-gradient text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-warning">All Day</div>
                <div className="text-sm text-muted-foreground">Open</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Next Event */}
      {nextEvent && (
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <Card className="card-elevated border-success/20 bg-gradient-to-r from-success/5 to-success-glow/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">Coming Up Next</h3>
                    <p className="text-success font-medium">{nextEvent.event}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{nextEvent.time}</span>
                      <span>•</span>
                      <span>{nextEvent.location}</span>
                    </div>
                  </div>
                  <Button onClick={() => setCurrentPath("/timeline")} className="btn-success">
                    View Full Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Featured Departments */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Featured Departments</h2>
            <p className="text-muted-foreground">Discover amazing exhibits and activities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDepartments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                {...dept}
                onClick={() => setCurrentPath(`/departments/${dept.id}`)}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              size="lg" 
              onClick={() => setCurrentPath("/departments")}
              className="btn-hero"
            >
              View All Departments
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-elevated group cursor-pointer" onClick={() => setCurrentPath("/map")}>
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">Interactive Map</h3>
                <p className="text-muted-foreground text-sm">Navigate through floors and find departments easily</p>
              </CardContent>
            </Card>

            <Card className="card-elevated group cursor-pointer">
              <CardContent className="p-6 text-center">
                <QrCode className="w-12 h-12 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">QR Scanner</h3>
                <p className="text-muted-foreground text-sm">Scan QR codes for instant department information</p>
              </CardContent>
            </Card>

            <Card className="card-elevated group cursor-pointer" onClick={() => setCurrentPath("/timeline")}>
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-success mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">Event Timeline</h3>
                <p className="text-muted-foreground text-sm">Stay updated with all performances and activities</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Event Info */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <Card className="card-gradient max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="glow-text text-2xl">Royal Global School</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>August 23, 2025</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Guwahati, Assam</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>Open to All Visitors</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
