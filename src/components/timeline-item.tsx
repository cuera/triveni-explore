import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimelineItemProps {
  time: string;
  event: string;
  location: string;
  type: 'ceremony' | 'performance' | 'demonstration' | 'exhibition' | 'activity' | 'workshop' | 'break';
  description?: string;
  departmentId?: string;
  isActive?: boolean;
  isPast?: boolean;
  onClick?: () => void;
}

export default function TimelineItem({
  time,
  event,
  location,
  type,
  description,
  departmentId,
  isActive = false,
  isPast = false,
  onClick
}: TimelineItemProps) {
  const typeConfig = {
    ceremony: { color: "bg-primary text-primary-foreground", icon: "🎉" },
    performance: { color: "bg-accent text-accent-foreground", icon: "🎭" },
    demonstration: { color: "bg-success text-success-foreground", icon: "🔬" },
    exhibition: { color: "bg-warning text-warning-foreground", icon: "🏛️" },
    activity: { color: "bg-secondary text-secondary-foreground", icon: "🎮" },
    workshop: { color: "bg-violet-500 text-white", icon: "🛠️" },
    break: { color: "bg-muted text-muted-foreground", icon: "☕" }
  };

  const config = typeConfig[type];

  return (
    <Card 
      className={cn(
        "transition-all duration-300 cursor-pointer",
        isActive && "ring-2 ring-primary shadow-glow scale-[1.02]",
        isPast && "opacity-60",
        !isPast && !isActive && "hover:shadow-card hover:scale-[1.01]",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex flex-col items-center min-w-0">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-lg",
              config.color
            )}>
              {config.icon}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className={cn(
                "font-semibold text-foreground leading-tight",
                isActive && "text-primary"
              )}>
                {event}
              </h3>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs shrink-0",
                  config.color.includes('primary') && "border-primary/20 bg-primary/10 text-primary",
                  config.color.includes('accent') && "border-accent/20 bg-accent/10 text-accent",
                  config.color.includes('success') && "border-success/20 bg-success/10 text-success",
                  config.color.includes('warning') && "border-warning/20 bg-warning/10 text-warning",
                  config.color.includes('violet') && "border-violet-500/20 bg-violet-500/10 text-violet-600"
                )}
              >
                {type}
              </Badge>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{location}</span>
            </div>

            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            )}

            {isActive && (
              <div className="flex items-center gap-1 text-sm text-primary font-medium">
                <Calendar className="h-3 w-3" />
                <span>Happening Now</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}