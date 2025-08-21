import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepartmentCardProps {
  id: string;
  name: string;
  teacher?: string;
  room: string;
  floor: string;
  classes: string;
  theme?: string;
  activities: string[];
  onClick: () => void;
  className?: string;
}

export default function DepartmentCard({
  id,
  name,
  teacher,
  room,
  floor,
  classes,
  theme,
  activities,
  onClick,
  className
}: DepartmentCardProps) {
  const getCardGradient = (id: string) => {
    const gradients = {
      'english': 'from-purple-500/10 to-pink-500/10',
      'french': 'from-blue-500/10 to-cyan-500/10',
      'hindi': 'from-orange-500/10 to-red-500/10',
      'maths': 'from-green-500/10 to-emerald-500/10',
      'science_9_12': 'from-blue-600/10 to-purple-600/10',
      'stem_ai': 'from-violet-500/10 to-purple-500/10',
      'commerce': 'from-yellow-500/10 to-orange-500/10',
      'computer_science': 'from-indigo-500/10 to-blue-500/10',
      'art': 'from-pink-500/10 to-rose-500/10',
      'social_science_6_8': 'from-amber-500/10 to-orange-500/10',
      'social_science_9_10': 'from-teal-500/10 to-cyan-500/10',
      'social_science_11_12': 'from-red-500/10 to-pink-500/10'
    };
    return gradients[id as keyof typeof gradients] || 'from-primary/10 to-accent/10';
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-elegant",
        "bg-gradient-to-br border-2 border-transparent hover:border-primary/20",
        getCardGradient(id),
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {name}
            </CardTitle>
            {theme && (
              <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-primary/20">
                {theme}
              </Badge>
            )}
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {teacher && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">{teacher}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">{room} • {floor}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-success" />
            <span className="text-muted-foreground">Classes {classes}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Key Activities:</p>
          <div className="flex flex-wrap gap-1">
            {activities.slice(0, 3).map((activity, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-white/50 border-primary/20 text-foreground"
              >
                {activity}
              </Badge>
            ))}
            {activities.length > 3 && (
              <Badge variant="outline" className="text-xs bg-accent/10 border-accent/20 text-accent">
                +{activities.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-4 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300"
        >
          Explore Department
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </CardContent>
    </Card>
  );
}