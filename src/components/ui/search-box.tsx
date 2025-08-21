import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Department, Room } from "@/types";

interface SearchResult {
  id: string;
  name: string;
  type: 'department' | 'room';
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
  const [departments, setDepartments] = useState<Department[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [deptResponse, roomsResponse] = await Promise.all([
          fetch('/data/departments.json'),
          fetch('/data/rooms.json')
        ]);
        
        const deptData: Department[] = await deptResponse.json();
        const roomsData: Room[] = await roomsResponse.json();
        
        setDepartments(deptData);
        setRooms(roomsData);
      } catch (error) {
        console.error('Failed to load search data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search departments
    departments.forEach(dept => {
      const searchableText = [
        dept.name,
        dept.room,
        dept.classes,
        dept.floor,
        dept.teacher,
        dept.theme,
        ...(dept.activities || [])
      ].join(' ').toLowerCase();

      if (searchableText.includes(q)) {
        searchResults.push({
          id: dept.id,
          name: dept.name,
          type: 'department',
          location: dept.room,
          teacher: dept.teacher
        });
      }
    });

    // Search rooms
    rooms.forEach(room => {
      const searchableText = [
        room.code,
        room.block,
        room.floor,
        room.note
      ].join(' ').toLowerCase();

      if (searchableText.includes(q)) {
        searchResults.push({
          id: room.code,
          name: room.code,
          type: 'room',
          location: `${room.block} ${room.floor}`
        });
      }
    });

    setResults(searchResults);
    setIsOpen(searchResults.length > 0);
  }, [query, departments, rooms]);

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
                  result.type === 'room' && "bg-accent/10 text-accent"
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