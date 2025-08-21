import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  name: string;
  type: 'department' | 'room' | 'activity';
  location?: string;
  teacher?: string;
}

interface SearchBoxProps {
  onSelect: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBox({ onSelect, placeholder = "Search departments, rooms, or activities...", className }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Simulate search functionality - in real app, this would fetch from departments.json
    const mockResults: SearchResult[] = [
      { id: "english", name: "English", type: "department", location: "2C", teacher: "Ms. Rumi Bora" },
      { id: "french", name: "French", type: "department", location: "French Room", teacher: "Mr. Debapratim Bharali" },
      { id: "stem_ai", name: "STEM & AI", type: "department", location: "B Block Reception", teacher: "Nabojyoti Gupta" },
      { id: "science_9_12", name: "Science (9-12)", type: "department", location: "8C, Language Room, 8B", teacher: "Dr. Utpal Saha" },
      { id: "2c", name: "Room 2C", type: "room", location: "A Block 1st Floor" },
      { id: "french_room", name: "French Room", type: "room", location: "B Block Ground Floor" },
      { id: "slam_poetry", name: "Slam Poetry Performance", type: "activity", location: "2C" }
    ];

    const filtered = mockResults.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.location?.toLowerCase().includes(query.toLowerCase()) ||
      item.teacher?.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
    setIsOpen(filtered.length > 0);
  }, [query]);

  const handleSelect = (result: SearchResult) => {
    setQuery("");
    setIsOpen(false);
    onSelect(result);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 bg-white/80 backdrop-blur-sm border-white/20 shadow-lg focus:shadow-glow transition-all duration-300"
        />
        {query && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-white/20 rounded-lg shadow-elegant z-50 max-h-64 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="w-full p-3 text-left hover:bg-primary/5 border-b border-border/10 last:border-0 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{result.name}</p>
                  <p className="text-sm text-muted-foreground">{result.location}</p>
                  {result.teacher && (
                    <p className="text-xs text-primary">{result.teacher}</p>
                  )}
                </div>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  result.type === 'department' && "bg-primary/10 text-primary",
                  result.type === 'room' && "bg-accent/10 text-accent",
                  result.type === 'activity' && "bg-success/10 text-success"
                )}>
                  {result.type}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}