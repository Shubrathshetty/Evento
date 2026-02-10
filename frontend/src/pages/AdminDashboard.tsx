import React, { useState, useEffect } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarDays, Users, Settings, BarChart3, Plus,
  ExternalLink, Edit, Trash2, Eye, EyeOff
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { eventsService, type Event } from "@/services/eventsService";
import { registrationsService, type Registration } from "@/services/registrationsService";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    activeEvents: 0,
    totalRegistrations: 0,
  });

  // Filters
  const [eventStatus, setEventStatus] = useState<"upcoming" | "closed" | "completed">("upcoming");

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch stats (mocked or real)
      const allEvents = await eventsService.getAdminEvents(1, 100); // get all for stats
      const allRegs = await registrationsService.getAllRegistrations();

      setStats({
        users: 120, // Mock for now if no endpoint
        events: allEvents.total,
        activeEvents: allEvents.events.filter(e => e.is_published).length,
        totalRegistrations: allRegs.length
      });

      setRegistrations(allRegs);

      // Load current tab events
      await loadEvents(eventStatus);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async (status: string) => {
    try {
      const result = await eventsService.getAdminEvents(1, 50, status);
      setEvents(result.events);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadEvents(eventStatus);
  }, [eventStatus]);

  const handlePublishToggle = async (event: Event) => {
    try {
      const newState = !event.is_published;
      await eventsService.publishEvent(event.id, newState);

      // Update local state
      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, is_published: newState } : e));

      toast({
        title: newState ? "Published" : "Unpublished",
        description: `Event "${event.title}" is now ${newState ? 'live' : 'hidden'}.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This cannot be undone.")) return;

    try {
      await eventsService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      toast({ title: "Deleted", description: "Event deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <AdminNavbar />

      <main className="flex-grow container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}. Manage your platform here.
            </p>
          </div>
          <Link to="/admin/events/new">
            <Button className="bg-primary hover:bg-primary/90 shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.events}</div>
              <p className="text-xs text-muted-foreground">{stats.activeEvents} Active / Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRegistrations}</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>
          {/* Add more stats as needed */}
        </div>

        <Tabs defaultValue="events" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* EVENTS TAB */}
          <TabsContent value="events" className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Event Management</h2>
              <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
                {(["upcoming", "closed", "completed"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setEventStatus(s)}
                    className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-all ${eventStatus === s
                      ? "bg-white text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">Event</th>
                    <th className="p-4 text-left font-medium hidden md:table-cell">Date & Time</th>
                    <th className="p-4 text-left font-medium hidden md:table-cell">Status</th>
                    <th className="p-4 text-left font-medium hidden md:table-cell">Attendees</th>
                    <th className="p-4 text-left font-medium hidden md:table-cell">Reg. Deadline</th>
                    <th className="p-4 text-left font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No events found in this category.</td></tr>
                  ) : (
                    events.map((event) => (
                      <tr key={event.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4">
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-xs text-muted-foreground md:hidden mt-1">
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex flex-col">
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <span className="text-xs text-today-foreground">{event.time}</span>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            {event.is_published ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Published</Badge>
                            ) : (
                              <Badge variant="secondary">Draft</Badge>
                            )}
                            {event.is_full && <Badge variant="destructive">Full</Badge>}
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{event.registration_count || 0}</span>
                            <span className="text-muted-foreground">/ {event.capacity || "∞"}</span>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">
                          {event.registration_deadline ? new Date(event.registration_deadline).toLocaleDateString() : "None"}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePublishToggle(event)}
                              title={event.is_published ? "Unpublish" : "Publish"}
                            >
                              {event.is_published ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
                            </Button>
                            <Link to={`/admin/events/${event.id}/edit`}>
                              <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* REGISTRATIONS TAB */}
          <TabsContent value="registrations" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Registration Management</CardTitle>
                <Button variant="outline" size="sm" onClick={() => loadData()}>
                  Refresh
                </Button>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-4 text-left font-medium">User</th>
                        <th className="p-4 text-left font-medium">Event</th>
                        <th className="p-4 text-left font-medium hidden md:table-cell">Date Registered</th>
                        <th className="p-4 text-left font-medium">Status</th>
                        <th className="p-4 text-right font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No registrations found.</td></tr>
                      ) : (
                        registrations.map((reg) => (
                          <tr key={reg.id} className="border-b transition-colors hover:bg-muted/50">
                            <td className="p-4">
                              <div className="font-medium">{reg.user?.name || "Unknown User"}</div>
                              <div className="text-xs text-muted-foreground">{reg.user?.email}</div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium">{reg.event?.title || "Unknown Event"}</div>
                              <div className="text-xs text-muted-foreground">
                                {reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : ""}
                              </div>
                            </td>
                            <td className="p-4 hidden md:table-cell text-muted-foreground">
                              {new Date(reg.registration_date).toLocaleString()}
                            </td>
                            <td className="p-4">
                              <Badge variant={
                                reg.status === 'confirmed' ? "default" :
                                  reg.status === 'cancelled' ? "destructive" : "secondary"
                              }>
                                {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              {reg.status !== 'cancelled' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={async () => {
                                    if (confirm("Cancel this registration?")) {
                                      await registrationsService.cancelRegistration(reg.id);
                                      loadData(); // Refresh
                                    }
                                  }}
                                >
                                  Cancel
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium">Platform Settings</h3>
                <p className="text-muted-foreground">Configure system preferences here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
