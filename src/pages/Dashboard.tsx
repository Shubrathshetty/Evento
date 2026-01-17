import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Ticket, User } from "lucide-react";
import { events, Event } from "@/data/events";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for user's registered events
const registeredEvents: Event[] = [events[0], events[2]];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}
            </p>
          </div>
          <Link to="/create">
            <Button className="mt-4 md:mt-0 bg-event-purple hover:bg-event-dark-purple">
              Create New Event
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8 max-w-md">
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="hidden sm:inline">Upcoming</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              <span className="hidden sm:inline">My Tickets</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
            {registeredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registeredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="w-full sm:w-1/3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {new Date(event.date).toLocaleDateString()} at {event.time}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {event.location}
                            </p>
                          </div>
                          <Link to={`/event/${event.id}`}>
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't registered for any events yet.
                </p>
                <Link to="/events">
                  <Button>Browse Events</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">My Tickets</h2>
            {registeredEvents.length > 0 ? (
              <div className="space-y-4">
                {registeredEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{event.title}</h3>
                            <div className="rounded-full bg-green-100 text-green-800 text-xs px-2 py-1">
                              Confirmed
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(event.date).toLocaleDateString()} • {event.time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Ticket #: EVENT-{Math.random().toString().slice(2, 10)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                          <Link to={`/event/${event.id}`}>
                            <Button variant="ghost" size="sm">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't purchased any tickets yet.
                </p>
                <Link to="/events">
                  <Button>Find Events</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">User</h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        disabled
                        className="w-full rounded-md border border-input bg-muted p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Add phone number"
                        className="w-full rounded-md border border-input bg-background p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Add location"
                        className="w-full rounded-md border border-input bg-background p-2"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-event-purple hover:bg-event-dark-purple">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
