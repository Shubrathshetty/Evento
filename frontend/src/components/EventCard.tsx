
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { type Event } from "@/services/eventsService";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Fallback image if none provided
  const eventImage = event.image_url || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop`;
  const eventTime = event.time || formatTime(event.date);

  return (
    <Card className="event-card h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <img
          src={eventImage}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {event.category && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-event-purple hover:bg-event-dark-purple">
              {event.category}
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-xl font-semibold line-clamp-2 mb-1">
          {event.title}
        </h3>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-2 text-event-purple" />
            {formatDate(event.date)}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-event-purple" />
            {eventTime}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-event-purple" />
            {event.location || "TBD"}
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
          {event.description || "No description available"}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm">
          {event.price ? (
            <span className="font-semibold">${event.price}</span>
          ) : (
            <span className="text-green-600 font-semibold">Free</span>
          )}
        </div>
        <Link
          to={`/event/${event.id}`}
          className="text-event-purple hover:text-event-dark-purple font-semibold text-sm underline-offset-4 hover:underline"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
