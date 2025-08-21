import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/navigation";
import DepartmentCard from "@/components/department-card";
import { Department } from "@/types";
import { Search, Filter, Users, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import deptsData from "@/data/departments.json";

const Departments = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    setDepartments(deptsData as unknown as Department[]);
    setFilteredDepartments(deptsData as unknown as Department[]);
  }, []);

  useEffect(() => {
    let filtered = departments;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.teacher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.activities?.some(activity => 
          activity.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(dept => {
        switch (selectedFilter) {
          case "languages":
            return ["english-6-12", "french"].includes(dept.id);
          case "science":
            return dept.id.includes("science") || dept.id === "ai";
          case "social":
            return dept.id.includes("social") || dept.id.includes("ss");
          case "arts":
            return dept.id === "art";
          case "commerce":
            return dept.id === "commerce" || dept.id === "computers-6-12";
          default:
            return true;
        }
      });
    }

    setFilteredDepartments(filtered);
  }, [searchQuery, selectedFilter, departments]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleDepartmentClick = (id: string) => {
    navigate(`/departments/${id}`);
  };

  const filters = [
    { id: "all", label: "All Departments", count: departments.length },
    { id: "languages", label: "Languages", count: departments.filter(d => ["english-6-12", "french"].includes(d.id)).length },
    { id: "science", label: "Science & Tech", count: departments.filter(d => d.id.includes("science") || d.id === "ai").length },
    { id: "social", label: "Social Studies", count: departments.filter(d => d.id.includes("social") || d.id.includes("ss")).length },
    { id: "arts", label: "Arts & Culture", count: departments.filter(d => d.id === "art").length },
    { id: "commerce", label: "Commerce & CS", count: departments.filter(d => d.id === "commerce" || d.id === "computers-6-12").length }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPath="/departments" onNavigate={handleNavigate} />
      
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
      </div>
    </div>
  );
};

export default Departments;