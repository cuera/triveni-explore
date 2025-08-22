import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import Navigation from "@/components/navigation";
import DepartmentCard from "@/components/department-card";
import { Department } from "@/types";
import { Calendar, MapPin, Users, Clock, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBanner from "@/assets/hero1.avif";

const Index = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  useEffect(() => {
    // Load departments data
    fetch('/data/departments.json')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('Failed to load departments:', err));
  }, []);





  // Simple shuffle to give all departments equal visibility
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const featuredDepartments = shuffleArray(departments); // Show ALL departments shuffled

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-md px-4 pt-4 space-y-5 pb-[calc(100px+var(--safe-bottom))]">
        {/* Hero Card */}
        <section>
          <div className="relative rounded-2xl overflow-hidden soft">
            <img src={heroBanner} alt="Triveni Exhibition" className="w-full h-80 object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <Badge className="mb-6 bg-white/15 text-white border-white/20 hover:bg-white/25 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 mr-1.5" />
                August 23, 2025
              </Badge>

              <h1 className="text-4xl font-bold text-white leading-tight mb-3 tracking-tight">
                Welcome to <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Triveni</span>
              </h1>
              <p className="text-white/95 text-base font-medium mb-2 max-w-sm leading-relaxed">
                The Ultimate School Exhibition Experience
              </p>
              <p className="text-white/75 text-sm">
                Royal Global School
              </p>
            </div>
            
            {/* Floating Buttons */}
            <div className="absolute bottom-8 left-6 right-6 flex gap-3 justify-center">
              <Button 
                size="sm"
                className="glass pill text-black border border-white/20 hover:bg-white/95 shadow-xl backdrop-blur-md px-4 py-2.5"
                onClick={() => navigate("/departments")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Explore Departments
              </Button>
              <Button 
                size="sm"
                className="pill bg-white/10 text-white border border-white/30 hover:bg-white/20 shadow-xl backdrop-blur-md px-4 py-2.5"
                onClick={() => navigate("/timeline")}
              >
                <Clock className="mr-2 h-4 w-4" />
                View Events
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
              <div className="text-base font-semibold">{departments.reduce((total, dept) => total + (dept.activities?.length || 0), 0)}+</div>
              <div className="text-[12px] opacity-70">Activities</div>
            </div>
            <div className="glass pill px-3 py-2 text-black">
              <div className="text-base font-semibold">3</div>
              <div className="text-[12px] opacity-70">Blocks</div>
            </div>
            <div className="glass pill px-3 py-2 text-black">
              <div className="text-base font-semibold">9:30 AM</div>
              <div className="text-[12px] opacity-70">till 1:30 PM</div>
            </div>
          </div>
        </section>



        {/* Quick Actions */}
        <section>
          <div className="grid grid-cols-1 gap-3">
            <div className="glass soft rounded-2xl p-4 text-black" role="button" onClick={() => window.open('/Layout of Classroom (Floor-wiser).pdf', '_blank')}>
              <div className="text-sm font-semibold">Interactive Map</div>
              <div className="text-[12px] text-black/60">View detailed floor plans and classroom layouts</div>
            </div>
            <div className="glass soft rounded-2xl p-4 text-black" role="button" onClick={() => navigate('/timeline')}>
              <div className="text-sm font-semibold">Events</div>
              <div className="text-[12px] text-black/60">Stay updated with all performances and activities</div>
            </div>
          </div>
        </section>

        {/* Featured Departments */}
        <section>
          <div>
                               <div className="mb-4 space-y-1">
                     <h2 className="text-xl font-semibold">All Departments</h2>
                     <p className="text-sm text-white/60">Discover all amazing exhibits and activities</p>
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
