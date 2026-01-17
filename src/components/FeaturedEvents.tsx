
import React from "react";
import { Event } from "@/data/events";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FeaturedEventsProps {
  events: Event[];
}

const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ events }) => {
  return (
    <section className="py-16 bg-event-soft-gray">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Events
            </h2>
            <p className="text-muted-foreground mt-2">
              Discover our handpicked selection of exciting events
            </p>
          </div>
          <Link to="/events" className="mt-4 md:mt-0">
            <Button variant="outline" className="border-event-purple text-event-purple hover:bg-event-light-purple">
              View All Events
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
