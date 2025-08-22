import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { Department } from "@/types";
import { 
  Home, 
  MapPin, 
  User, 
  GraduationCap, 
  Building, 
  Clock, 
  Share2, 
  ChevronLeft
} from "lucide-react";
import data from "@/data/departments.json";

const idAliases: Record<string,string> = {
  english: "english-6-12",
  science_9_12: "science-11-12",
  science9_12: "science-11-12",
  social_science_9_10: "ss-9-10",
  social_9_10: "ss-9-10"
};

const DepartmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDepartment = async () => {
      try {
        setLoading(true);
        const list = data as unknown as Department[];
        const normalizedId = (id && idAliases[id]) || id;
        const dept = list.find(d => d.id === normalizedId);
        if (dept) {
          setDepartment(dept);
        } else {
          setError('Department not found');
        }
      } catch (err) {
        setError('Failed to load department details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDepartment();
    }
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${department?.name} - Triveni Exhibition`,
          text: `Check out the ${department?.name} department at Triveni Exhibition`,
          url: url,
        });
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const navigateToMap = () => {
    navigate(`/map?highlight=${department?.room}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error || 'Department not found'}
            </h1>
            <div className="space-x-4">
              <Button onClick={() => navigate('/departments')}>
                View All Departments
              </Button>
              <Button variant="outline" onClick={() => navigate('/') }>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPath={`/departments/${id}`} onNavigate={(path) => navigate(path)} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/departments" className="text-muted-foreground hover:text-foreground">
              Departments
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{department.name}</span>
          </div>

          {/* Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="mr-4"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {department.name}
                </h1>
                {department.classes && (
                  <p className="text-muted-foreground">
                    Classes {department.classes}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Teacher */}
                  {department.teacher && (
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Teacher</p>
                        <p className="text-foreground">{department.teacher}</p>
                      </div>
                    </div>
                  )}

                  {/* Classes */}
                  {department.classes && (
                    <div className="flex items-start space-x-3">
                      <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Classes</p>
                        <p className="text-foreground">{department.classes}</p>
                      </div>
                    </div>
                  )}

                  {/* Floor */}
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Location</p>
                      <p className="text-foreground">{department.block} • {department.floor}</p>
                    </div>
                  </div>
                </div>

                {/* Description / Activities */}
                {department.activities && department.activities.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Activities & Demonstrations</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {department.activities.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Room</p>
                    <p className="text-foreground">{department.room}</p>
                  </div>
                </div>

                <Button onClick={navigateToMap} className="w-full">
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" onClick={() => navigate('/timeline')} className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-3" />
                  View Timeline
                </Button>

                <Button variant="outline" onClick={() => navigate('/departments')} className="w-full justify-start">
                  Departments
                </Button>

                <Button variant="outline" onClick={() => navigate('/')} className="w-full justify-start">
                  <Home className="h-4 w-4 mr-3" />
                  Back to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;

