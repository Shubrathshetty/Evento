import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Users, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuth } from "@/contexts/AuthContext";
import { eventsService, type Event } from "@/services/eventsService";
import { registrationsService } from "@/services/registrationsService";
import { paymentsService } from "@/services/paymentsService";
import { useToast } from "@/hooks/use-toast";
import PaymentModal from "@/components/PaymentModal";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        const eventData = await eventsService.getEventById(id);
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
        toast({
          title: "Error",
          description: "Failed to load event details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, toast]);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!user || !id) return;

      try {
        const registered = await registrationsService.isUserRegistered(id);
        setIsRegistered(registered);

        if (registered) {
          // Get registration status from user's registrations
          const myRegistrations = await registrationsService.getMyRegistrations();
          const thisReg = myRegistrations.find(r => r.event_id === id);
          setRegistrationStatus(thisReg?.status || null);
        }
      } catch (error) {
        console.error('Error checking registration:', error);
      }
    };

    checkRegistration();
  }, [user, id]);

  const handleRegisterClick = () => {
    if (!user || !event) return;

    if (event.price && event.price > 0) {
      setShowPaymentModal(true);
    } else {
      performRegistration();
    }
  };

  const performRegistration = async () => {
    if (!user || !event) return;

    setRegistering(true);
    try {
      await registrationsService.registerForEvent(event.id);
      setIsRegistered(true);
      setRegistrationStatus('pending');
      toast({
        title: "Registration Successful",
        description: event.price ? "Payment processed and registration confirmed!" : "You have successfully registered for this event.",
      });
    } catch (error) {
      console.error('Error registering:', error);
      toast({
        title: "Registration Failed",
        description: "Failed to register for this event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!event) return;

    // 1. Process Payment
    await paymentsService.processPayment({
      event_id: event.id,
      amount: event.price || 0,
      payment_method_id: "tok_visa", // Mock token
    });

    // 2. Perform Registration
    await performRegistration();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container py-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Fallback values for missing fields
  const eventImage = event.image_url || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop`;
  const eventTime = event.time || formatTime(event.date);
  const eventOrganizer = event.organizer || "Event Organizer";
  const eventAttendees = event.attendees || event.registration_count || 0;
  const eventCapacity = event.capacity || 100;

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
            <div className="rounded-lg overflow-hidden mb-6 shadow-md">
              <img
                src={eventImage}
                alt={event.title}
                className="w-full h-96 object-cover"
              />
            </div>

            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{event.title}</h1>
                {event.category && (
                  <Badge className="bg-event-purple hover:bg-event-dark-purple text-sm px-3 py-1">
                    {event.category}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center text-gray-700">
                  <CalendarDays className="h-5 w-5 mr-3 text-event-purple" />
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-3 text-event-purple" />
                  <span className="font-medium">{eventTime}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-3 text-event-purple" />
                  <span className="font-medium">{event.location || "TBD"}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <DollarSign className="h-5 w-5 mr-3 text-event-purple" />
                  <span className="font-medium text-lg">
                    {event.price ? `$${event.price}` : "Free"}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4 text-gray-900">About this event</h2>
              <div className="prose max-w-none text-gray-600 leading-relaxed mb-8">
                <p className="whitespace-pre-line text-lg">
                  {event.description || "No description available."}
                </p>
                <p className="mt-4">
                  Do not miss this opportunity to connect with like-minded individuals and be part of an amazing experience.
                  Whether you are looking to learn, network, or just have fun, this event has something for everyone.
                </p>
              </div>

              <div className="border-t pt-8">
                <h2 className="text-xl font-semibold mb-4">Organizer</h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-event-light-purple rounded-full flex items-center justify-center text-xl">
                    <span className="font-bold text-event-purple">
                      {eventOrganizer.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{eventOrganizer}</p>
                    <p className="text-sm text-muted-foreground">Hosted by {eventOrganizer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Card */}
          <div>
            <Card className="sticky top-24 shadow-lg border-t-4 border-t-event-purple">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6 text-center">Registration</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Price</span>
                    <span className="font-bold text-xl text-event-purple">
                      {event.price ? `$${event.price}` : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{eventTime}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Availability</span>
                    <div className="flex items-center text-green-600 font-medium">
                      <Users className="h-4 w-4 mr-1" />
                      <span>
                        {Math.max(0, eventCapacity - eventAttendees)} spots left
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {!user ? (
                    <Link to="/auth">
                      <Button className="w-full bg-event-purple hover:bg-event-dark-purple h-12 text-lg">
                        Sign In to Register
                      </Button>
                    </Link>
                  ) : isRegistered ? (
                    <div className="space-y-3">
                      <div className={`p-4 rounded-lg text-center ${registrationStatus === 'approved' ? 'bg-green-50 text-green-700 border border-green-200' :
                          registrationStatus === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}>
                        <p className="font-semibold">
                          {registrationStatus === 'approved' ? 'Ticket Confirmed' :
                            registrationStatus === 'rejected' ? 'Registration Rejected' : 'Pending Approval'}
                        </p>
                      </div>

                      {registrationStatus === 'approved' && (
                        <Button className="w-full" variant="outline">
                          View Ticket
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-event-purple hover:bg-event-dark-purple h-12 text-lg shadow-md hover:shadow-lg transition-all"
                      onClick={handleRegisterClick}
                      disabled={registering || (eventCapacity - eventAttendees <= 0)}
                    >
                      {registering ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (eventCapacity - eventAttendees <= 0) ? (
                        'Sold Out'
                      ) : (
                        'Register Now'
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {event && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            onConfirm={handlePaymentConfirm}
            amount={event.price || 0}
            eventName={event.title}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
