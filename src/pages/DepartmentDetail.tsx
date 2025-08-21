import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { ArrowLeft, User, MapPin, Clock, Users, BookOpen } from "lucide-react";

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
  detailedActivities?: string[];
  budget?: string;
}

interface DepartmentDetailProps {
  departmentId: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const DepartmentDetail = ({ departmentId, currentPath, onNavigate }: DepartmentDetailProps) => {
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/departments.json')
      .then(res => res.json())
      .then((data: Department[]) => {
        const dept = data.find(d => d.id === departmentId);
        setDepartment(dept || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load department:', err);
        setLoading(false);
      });
  }, [departmentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentPath={currentPath} onNavigate={onNavigate} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentPath={currentPath} onNavigate={onNavigate} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Department Not Found</h1>
            <Button onClick={() => onNavigate("/departments")}>
              Back to Departments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getGradientClass = (id: string) => {
    const gradients = {
      'english': 'from-purple-500/20 to-pink-500/20',
      'french': 'from-blue-500/20 to-cyan-500/20',
      'hindi': 'from-orange-500/20 to-red-500/20',
      'maths': 'from-green-500/20 to-emerald-500/20',
      'science_9_12': 'from-blue-600/20 to-purple-600/20',
      'stem_ai': 'from-violet-500/20 to-purple-500/20',
      'commerce': 'from-yellow-500/20 to-orange-500/20',
      'computer_science': 'from-indigo-500/20 to-blue-500/20',
      'art': 'from-pink-500/20 to-rose-500/20',
      'social_science_6_8': 'from-amber-500/20 to-orange-500/20',
      'social_science_9_10': 'from-teal-500/20 to-cyan-500/20',
      'social_science_11_12': 'from-red-500/20 to-pink-500/20'
    };
    return gradients[id as keyof typeof gradients] || 'from-primary/20 to-accent/20';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPath={currentPath} onNavigate={onNavigate} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => onNavigate("/departments")}
            className="btn-glass"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Departments
          </Button>
        </div>

        {/* Hero Section */}
        <div className={`bg-gradient-to-br ${getGradientClass(department.id)} rounded-lg p-8 mb-8`}>
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-foreground mb-4">{department.name}</h1>
              {department.theme && (
                <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                  {department.theme}
                </Badge>
              )}
              <p className="text-lg text-muted-foreground mb-6">
                {department.description}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {department.teacher && (
              <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">Teacher</div>
                  <div className="font-medium text-foreground">{department.teacher}</div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
              <MapPin className="w-5 h-5 text-accent" />
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium text-foreground">{department.room}</div>
                <div className="text-xs text-muted-foreground">{department.floor}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white/10 rounded-lg p-4">
              <Users className="w-5 h-5 text-success" />
              <div>
                <div className="text-sm text-muted-foreground">Classes</div>
                <div className="font-medium text-foreground">{department.classes}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Main Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {department.activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div className="text-foreground">{activity}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {department.detailedActivities && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Detailed Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {department.detailedActivities.map((activity, index) => (
                    <div key={index} className="border-l-4 border-accent pl-4 py-2">
                      <p className="text-foreground text-sm leading-relaxed">{activity}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => onNavigate("/map")}
            className="btn-hero flex-1"
          >
            <MapPin className="w-4 h-4 mr-2" />
            Find on Map
          </Button>
          <Button 
            onClick={() => onNavigate("/timeline")}
            variant="outline"
            className="btn-glass flex-1"
          >
            <Clock className="w-4 h-4 mr-2" />
            View Schedule
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;