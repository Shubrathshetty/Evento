import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { registrationsService, type Registration } from '@/services/registrationsService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Printer, ArrowLeft, CalendarDays, MapPin, Clock, CheckCircle } from 'lucide-react';
import QRCode from "react-qr-code";

const TicketView = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [registration, setRegistration] = useState<Registration | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTicket = async () => {
            if (!id) return;
            try {
                setLoading(true);
                // We'll fetch all user registrations and find the one matching the ID
                // In a real app, you'd have a specific endpoint /api/registrations/:id
                const myRegs = await registrationsService.getMyRegistrations();
                const found = myRegs.find(r => r.id === id);

                if (found) {
                    setRegistration(found);
                } else {
                    setError('Ticket not found or access denied.');
                }
            } catch (err) {
                setError('Failed to load ticket details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTicket();
        }
    }, [id, user]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
            </div>
        );
    }

    if (error || !registration) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl font-bold text-destructive mb-2">Error</h1>
                    <p className="text-muted-foreground mb-4">{error || 'Ticket not found'}</p>
                    <Link to="/dashboard">
                        <Button>Back to Dashboard</Button>
                    </Link>
                </main>
            </div>
        );
    }

    const event = registration.event;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <main className="flex-grow container py-8">
                <div className="mb-6 print:hidden">
                    <Link to="/dashboard">
                        <Button variant="ghost" className="pl-0 gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                <div className="max-w-md mx-auto print:max-w-full print:mx-0">
                    <Card className="border-2 border-event-purple/20 shadow-xl overflow-hidden print:shadow-none print:border-2">
                        <div className="bg-event-purple p-6 text-white text-center print:bg-black/90">
                            <h1 className="text-2xl font-bold mb-1">Event Ticket</h1>
                            <p className="text-purple-100 opacity-90 text-sm">
                                Registration ID: {registration.id.slice(0, 8).toUpperCase()}
                            </p>
                        </div>

                        <CardContent className="p-0">
                            {/* Event Details */}
                            <div className="p-6 bg-white space-y-6">
                                <div className="text-center">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{event?.title}</h2>
                                    <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 py-1 px-3 rounded-full mx-auto w-fit">
                                        <CheckCircle className="h-4 w-4" />
                                        <span className="text-sm font-medium">Confirmed</span>
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-b py-6 border-dashed">
                                    <div className="flex items-start gap-3">
                                        <CalendarDays className="h-5 w-5 text-event-purple mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Date</p>
                                            <p className="font-medium text-gray-900">
                                                {event?.date && new Date(event.date).toLocaleDateString(undefined, {
                                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Clock className="h-5 w-5 text-event-purple mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Time</p>
                                            <p className="font-medium text-gray-900">{event?.time}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-event-purple mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Location</p>
                                            <p className="font-medium text-gray-900">{event?.location}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Attendee Info */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Attendee</p>
                                    <p className="font-bold text-lg text-gray-900">{user?.name}</p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>

                                {/* QR Code */}
                                <div className="flex flex-col items-center justify-center pt-2">
                                    <div className="bg-white p-2 border rounded-lg">
                                        <QRCode
                                            value={JSON.stringify({
                                                id: registration.id,
                                                event: event?.id,
                                                user: user?.id,
                                                status: 'valid'
                                            })}
                                            size={150}
                                            level="H"
                                        />
                                    </div>
                                    <p className="text-xs text-center text-gray-400 mt-2">
                                        Scan at entrance
                                    </p>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 bg-gray-50 border-t flex flex-col gap-3 print:hidden">
                                <Button className="w-full gap-2 text-lg h-12" onClick={handlePrint}>
                                    <Printer className="h-5 w-5" />
                                    Print / Download Ticket
                                </Button>
                                <p className="text-xs text-center text-gray-500">
                                    Please present this ticket at the event entrance.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default TicketView;
