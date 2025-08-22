import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBox from "@/components/ui/search-box";
import Navigation from "@/components/navigation";
import DepartmentCard from "@/components/department-card";
import { Department, TimelineItem } from "@/types";
import { Calendar, MapPin, Users, Clock, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBanner from "@/assets/hero1.avif";

const Index = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [nextEvent, setNextEvent] = useState<TimelineItem | null>(null);

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
        const upcoming = data.find((event: TimelineItem) => event.time > currentTime);
        setNextEvent(upcoming || data[0]);
      })
      .catch(err => console.error('Failed to load timeline:', err));
  }, []);

  const handleSearch = (result: { type: 'department' | 'room'; id: string }) => {
    if (result.type === 'department') {
      navigate(`/departments/${result.id}`);
    } else if (result.type === 'room') {
      navigate(`/map?highlight=${result.id}`);
    }
  };



  const featuredDepartments = departments.slice(0, 15);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-md px-4 pt-4 space-y-5 pb-[calc(100px+var(--safe-bottom))]">
        {/* Hero Card */}
        <section>
          <div className="relative rounded-2xl overflow-hidden soft">
            <img src={heroBanner} alt="Triveni Exhibition" className="w-full h-80 object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 py-8">
              <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Sparkles className="w-3 h-3 mr-1" />
                August 23, 2025
              </Badge>

              <h1 className="text-3xl font-bold text-white leading-tight mb-2">
                Welcome to <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Triveni</span>
              </h1>
              <p className="text-white/90 text-sm mb-4">
                The Ultimate School Exhibition Experience at Royal Global School
              </p>

              <div className="w-full max-w-sm mb-8"><SearchBox onSelect={handleSearch} /></div>
            </div>
            
            {/* Floating Buttons */}
            <div className="absolute bottom-6 left-4 right-4 flex gap-2 justify-center">
              <Button 
                size="sm"
                className="glass pill text-black border border-black/10 hover:bg-white/90 shadow-lg backdrop-blur-sm"
                onClick={() => navigate("/departments")}
              >
                <BookOpen className="mr-1.5 h-4 w-4" />
                Explore Departments
              </Button>
              <Button 
                size="sm"
                className="pill bg-black text-white hover:bg-black/90 shadow-lg"
                onClick={() => navigate("/timeline")}
              >
                <Clock className="mr-1.5 h-4 w-4" />
                View Schedule
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section>
          <div className="grid grid-cols-2 gap-3">
            <div className="glass pill px-3 py-2 text-black">
              <div className="text-base font-semibold">{departments.length}</div>
              <div className="text-[12px] opacity-70">Departments</div>
            </div>
            <div className="glass pill px-3 py-2 text-black">
              <div className="text-base font-semibold">50+</div>
              <div className="text-[12px] opacity-70">Activities</div>
            </div>
            <div className="glass pill px-3 py-2 text-black">
              <div className="text-base font-semibold">3</div>
              <div className="text-[12px] opacity-70">Blocks</div>
            </div>
            <div className="glass pill px-3 py-2 text-black">
              <div className="text-base font-semibold">All Day</div>
              <div className="text-[12px] opacity-70">Open</div>
            </div>
          </div>
        </section>

        {/* Next Event */}
        {nextEvent && (
          <section>
            <div className="rounded-2xl glass soft p-3 text-black">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <div className="flex-1">
                  <div className="text-xs text-black/60">Coming Up Next</div>
                  <div className="text-sm font-medium">{nextEvent.event}</div>
                  <div className="text-[12px] text-black/60">{nextEvent.time} • {nextEvent.location}</div>
                </div>
                <Button onClick={() => navigate('/timeline')} className="pill bg-black text-white text-xs px-3 py-2">Full Schedule</Button>
              </div>
            </div>
          </section>
        )}

        {/* Featured Departments */}
        <section>
          <div>
            <div className="mb-4 space-y-1">
              <h2 className="text-xl font-semibold">Featured Departments</h2>
              <p className="text-sm text-white/60">Discover amazing exhibits and activities</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {featuredDepartments.map((dept) => (
                <DepartmentCard
                  key={dept.id}
                  {...dept}
                  classes={dept.classes || 'All'}
                  activities={dept.activities || []}
                  onClick={() => navigate(`/departments/${dept.id}`)}
                />
              ))}
            </div>

            <div className="text-center mt-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/departments")}
                className="pill bg-black text-white hover:bg-black/90"
              >
                View All Departments
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <div className="grid grid-cols-1 gap-3">
            <div className="glass soft rounded-2xl p-4 text-black" role="button" onClick={() => navigate('/map')}>
              <div className="text-sm font-semibold">Interactive Map</div>
              <div className="text-[12px] text-black/60">Navigate through floors and find departments easily</div>
            </div>
            <div className="glass soft rounded-2xl p-4 text-black" role="button" onClick={() => navigate('/timeline')}>
              <div className="text-sm font-semibold">Event Timeline</div>
              <div className="text-[12px] text-black/60">Stay updated with all performances and activities</div>
            </div>
          </div>
        </section>

        {/* Event Info */}
        <section>
          <div className="text-center">
            <div className="glass soft rounded-2xl p-4 text-black">
              <div className="text-lg font-semibold">Royal Global School</div>
              <div className="mt-2 flex flex-col items-center gap-1 text-[13px] text-black/70">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>August 23, 2025</span></div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>Guwahati, Assam</span></div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>Open to All Visitors</span></div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
