import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Ticket, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { registrationsService, type Registration } from "@/services/registrationsService";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;
      try {
        const regs = await registrationsService.getMyRegistrations();
        setRegistrations(regs);
      } catch (error) {
        console.error("Failed to fetch registrations", error);
        toast({
          title: "Error",
          description: "Failed to load your registrations.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [user, toast]);

  const upcomingEvents = registrations.filter(
    (reg) => new Date(reg.event?.date || "") > new Date() && reg.status !== 'cancelled'
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || user?.email}
            </p>
          </div>
          {user?.role === 'admin' && (
            <Link to="/admin">
              <Button className="mt-4 md:mt-0 bg-primary hover:bg-primary/90">
                Go to Admin Dashboard
              </Button>
            </Link>
          )}
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
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.map((reg) => (
                  <Card key={reg.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="w-full sm:w-1/3 bg-gray-100">
                        <img
                          src={reg.event?.image_url || "/placeholder.svg"}
                          alt={reg.event?.title || "Event"}
                          className="h-full w-full object-cover min-h-[150px]"
                        />
                      </div>
                      <CardContent className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{reg.event?.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {reg.event?.date && new Date(reg.event.date).toLocaleDateString()} at {reg.event?.time}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {reg.event?.location}
                            </p>
                            <div className="mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${reg.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <Link to={`/event/${reg.event?.id}`}>
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
            {upcomingEvents.filter(r => r.status === 'confirmed').length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.filter(r => r.status === 'confirmed').map((reg) => (
                  <Card key={reg.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{reg.event?.title}</h3>
                            <div className="rounded-full bg-green-100 text-green-800 text-xs px-2 py-1">
                              Confirmed
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {reg.event?.date && new Date(reg.event.date).toLocaleDateString()} • {reg.event?.time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Ticket ID: {reg.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => alert("Downloading ticket...")}>
                            Download
                          </Button>
                          <Link to={`/event/${reg.event_id}`}>
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
                  You haven't purchased any confirmed tickets yet.
                </p>
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
                      <h3 className="font-semibold">{user?.name || "User"}</h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                      <span className="inline-block mt-1 text-xs bg-gray-100 px-2 py-1 rounded">
                        Role: {user?.role}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile fields placeholder */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input type="email" value={user?.email || ''} disabled className="w-full p-2 border rounded bg-gray-100" />
                    </div>
                  </div>

                  <div className="flex justify-start pt-4">
                    <Button variant="destructive" onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
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
