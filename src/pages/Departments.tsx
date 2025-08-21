import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/navigation";
import DepartmentCard from "@/components/department-card";
import { Search, Filter, Users, MapPin, Clock } from "lucide-react";

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
  budget?: string;
}

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [currentPath, setCurrentPath] = useState("/departments");

  useEffect(() => {
    fetch('/data/departments.json')
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        setFilteredDepartments(data);
      })
      .catch(err => console.error('Failed to load departments:', err));
  }, []);

  useEffect(() => {
    let filtered = departments;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.teacher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.theme?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.activities.some(activity => 
          activity.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(dept => {
        switch (selectedFilter) {
          case "languages":
            return ["english", "french", "hindi"].includes(dept.id);
          case "science":
            return dept.id.includes("science") || dept.id === "stem_ai";
          case "social":
            return dept.id.includes("social_science");
          case "arts":
            return dept.id === "art" || dept.id === "english";
          case "commerce":
            return dept.id === "commerce" || dept.id === "computer_science";
          default:
            return true;
        }
      });
    }

    setFilteredDepartments(filtered);
  }, [searchQuery, selectedFilter, departments]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleDepartmentClick = (id: string) => {
    setCurrentPath(`/departments/${id}`);
  };

  const filters = [
    { id: "all", label: "All Departments", count: departments.length },
    { id: "languages", label: "Languages", count: departments.filter(d => ["english", "french", "hindi"].includes(d.id)).length },
    { id: "science", label: "Science & Tech", count: departments.filter(d => d.id.includes("science") || d.id === "stem_ai").length },
    { id: "social", label: "Social Studies", count: departments.filter(d => d.id.includes("social_science")).length },
    { id: "arts", label: "Arts & Culture", count: departments.filter(d => d.id === "art" || d.id === "english").length },
    { id: "commerce", label: "Commerce & CS", count: departments.filter(d => d.id === "commerce" || d.id === "computer_science").length }
  ];

  if (currentPath !== "/departments") {
    return (
      <div className="min-h-screen bg-background">
        <Navigation currentPath={currentPath} onNavigate={handleNavigate} />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            Navigate to: {currentPath}
            <br />
            <Button variant="outline" onClick={() => setCurrentPath("/departments")}>
              Back to Departments
            </Button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPath={currentPath} onNavigate={handleNavigate} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Departments & Exhibitions</h1>
          <p className="text-xl text-muted-foreground">Explore all departments and their amazing activities</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search departments, teachers, or activities..."
              className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-white/20 shadow-lg"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className={selectedFilter === filter.id ? "bg-primary text-primary-foreground" : ""}
              >
                <Filter className="w-3 h-3 mr-1" />
                {filter.label}
                <Badge variant="secondary" className="ml-2 bg-background/20">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-muted-foreground text-center">
            Showing {filteredDepartments.length} of {departments.length} departments
            {searchQuery && (
              <span> matching "{searchQuery}"</span>
            )}
          </p>
        </div>

        {/* Department Grid */}
        {filteredDepartments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredDepartments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                {...dept}
                onClick={() => handleDepartmentClick(dept.id)}
                className="animate-slide-up"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No departments found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="card-gradient">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-primary" />
                Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {new Set(departments.map(d => d.teacher).filter(Boolean)).size}
              </div>
              <p className="text-sm text-muted-foreground">Expert educators</p>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-accent" />
                Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {new Set(departments.map(d => d.floor)).size}
              </div>
              <p className="text-sm text-muted-foreground">Floors & blocks</p>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-success" />
                Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {departments.reduce((total, dept) => total + dept.activities.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Total experiences</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Departments;