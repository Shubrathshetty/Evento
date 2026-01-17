
import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getEventById } from "@/data/events";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Users, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const event = getEventById(id || "");

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p className="mb-8">The event you're looking for doesn't exist.</p>
          <Link to="/events">
            <Button>Browse Events</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{event.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="md:col-span-2">
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-80 object-cover"
              />
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <Badge className="bg-event-purple hover:bg-event-dark-purple">
                  {event.category}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="flex items-center text-muted-foreground">
                  <CalendarDays className="h-5 w-5 mr-2 text-event-purple" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-5 w-5 mr-2 text-event-purple" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-2 text-event-purple" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="h-5 w-5 mr-2 text-event-purple" />
                  <span>
                    {event.price ? `$${event.price}` : "Free"}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-3">About this event</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {event.description}
                <br /><br />
                Join us for an unforgettable experience at {event.title}. This event offers 
                a unique opportunity to connect with others who share your interests and learn 
                from experts in the field.
                <br /><br />
                Don't miss out on this fantastic event! Seats are limited, so reserve 
                your spot today.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-3">Organizer</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-event-light-purple rounded-full flex items-center justify-center">
                  <span className="font-bold text-event-purple">
                    {event.organizer.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{event.organizer}</p>
                  <p className="text-sm text-muted-foreground">Event Organizer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6">Registration</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-semibold">
                      {event.price ? `$${event.price}` : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Availability</span>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-event-purple" />
                      <span>
                        {event.capacity - event.attendees} spots left
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-event-purple hover:bg-event-dark-purple">
                    Register Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save for Later
                  </Button>
                </div>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  <p>Need help? Contact the organizer</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
