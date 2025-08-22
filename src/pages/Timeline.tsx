import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import TimelineItem from "@/components/timeline-item";
import { TimelineItem as TimelineItemType } from "@/types";
import { Clock, Calendar, MapPin } from "lucide-react";

const Timeline = () => {
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState<TimelineItemType[]>([]);
  useEffect(() => {
    fetch('/data/timeline.json')
      .then(res => res.json())
      .then(data => {
        setTimeline(data);
      })
      .catch(err => console.error('Failed to load timeline:', err));
  }, []);



  const handleTimelineClick = (event: TimelineItemType) => {
    if (event.departmentId) {
      navigate(`/departments/${event.departmentId}`);
    }
  };

  const isEventActive = (event: TimelineItemType) => {
    // First event is always active
    return event === timeline[0];
  };

  const isEventPast = (event: TimelineItemType) => {
    // No events are past since we removed time logic
    return false;
  };





  // Show first two events as featured
  const currentEvent = timeline[0];
  const nextEvent = timeline[1];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Events</h1>
          <p className="text-xl text-muted-foreground">Stay updated with all performances and activities</p>
        </div>

        {/* Current Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {currentEvent && (
            <Card className="card-elevated border-success/20 bg-gradient-to-r from-success/5 to-success-glow/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-success">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
                  Happening Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg text-foreground mb-1">{currentEvent.event}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{currentEvent.location}</span>
                </div>
                {currentEvent.description && (
                  <p className="text-sm text-muted-foreground mt-2">{currentEvent.description}</p>
                )}
              </CardContent>
            </Card>
          )}

          {nextEvent && (
            <Card className="card-elevated border-primary/20 bg-gradient-to-r from-primary/5 to-primary-glow/5">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Clock className="w-4 h-4" />
                  Featured Event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg text-foreground mb-1">{nextEvent.event}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{nextEvent.location}</span>
                </div>
                {nextEvent.description && (
                  <p className="text-sm text-muted-foreground mt-2">{nextEvent.description}</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>



        {/* Timeline */}
        {timeline.length > 0 ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {timeline.map((event, index) => (
              <TimelineItem
                key={index}
                {...event}
                isActive={isEventActive(event)}
                isPast={isEventPast(event)}
                onClick={event.departmentId ? () => handleTimelineClick(event) : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              Loading events...
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          <Card className="card-gradient text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {timeline.filter(e => e.type === 'performance').length}
              </div>
              <div className="text-sm text-muted-foreground">Performances</div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-accent">
                {timeline.filter(e => e.type === 'demonstration').length}
              </div>
              <div className="text-sm text-muted-foreground">Demonstrations</div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-success">
                {timeline.filter(e => e.type === 'exhibition').length}
              </div>
              <div className="text-sm text-muted-foreground">Exhibitions</div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-warning">
                {timeline.filter(e => e.type === 'activity').length}
              </div>
              <div className="text-sm text-muted-foreground">Activities</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Timeline;