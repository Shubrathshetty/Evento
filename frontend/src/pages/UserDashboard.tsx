import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registrationsService, type Registration } from '@/services/registrationsService';
import { CalendarDays, MapPin, Ticket, User as UserIcon, LogOut, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const UserDashboard = () => {
    const { user, updateProfile, signOut } = useAuth();
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    // Profile Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            loadRegistrations();
        }
    }, [user]);

    const loadRegistrations = async () => {
        try {
            setLoading(true);
            const data = await registrationsService.getMyRegistrations();
            setRegistrations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            const { error } = await updateProfile(name, email);
            if (error) throw error;

            toast({
                title: "Profile Updated",
                description: "Your details have been saved successfully.",
            });
        } catch (error) {
            toast({
                title: "Update Failed",
                description: (error as Error).message,
                variant: "destructive"
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/50">
            <Navbar />

            <main className="flex-grow container py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">My Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Manage your events and account details.</p>
                    </div>
                    <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                    </Button>
                </div>

                <Tabs defaultValue="registrations" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                        <TabsTrigger value="registrations">My Registrations</TabsTrigger>
                        <TabsTrigger value="profile">Profile Settings</TabsTrigger>
                    </TabsList>

                    {/* MY REGISTRATIONS */}
                    <TabsContent value="registrations">
                        <div className="grid gap-6">
                            {loading ? (
                                <div className="flex justify-center p-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : registrations.length === 0 ? (
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                                        <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">No Registrations Yet</h3>
                                        <p className="text-muted-foreground mb-6">You haven't registered for any events yet.</p>
                                        <Link to="/events">
                                            <Button>Browse Events</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ) : (
                                registrations.map(reg => (
                                    <Card key={reg.id} className="overflow-hidden">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Event Image (optional specific implementation or generic) */}
                                            <div className="bg-event-light-purple/30 p-6 flex flex-col justify-center items-center md:w-48 shrink-0">
                                                <div className="text-center">
                                                    <p className="font-bold text-2xl text-event-purple">
                                                        {new Date(reg.event?.date || '').getDate()}
                                                    </p>
                                                    <p className="font-medium text-gray-600 uppercase text-sm">
                                                        {new Date(reg.event?.date || '').toLocaleString('default', { month: 'short' })}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex-1 p-6 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-xl font-bold">{reg.event?.title}</h3>
                                                        <Badge variant={
                                                            reg.status === 'confirmed' ? "default" :
                                                                reg.status === 'cancelled' ? "destructive" : "secondary"
                                                        }>
                                                            {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <CalendarDays className="h-4 w-4" />
                                                            {new Date(reg.event?.date || '').toLocaleDateString()} at {reg.event?.time}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            {reg.event?.location}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 mt-4 md:mt-0">
                                                    {reg.status === 'confirmed' && (
                                                        <Link to={`/tickets/${reg.id}`}>
                                                            <Button className="gap-2">
                                                                <Ticket className="h-4 w-4" />
                                                                View Ticket
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {reg.status !== 'cancelled' && (
                                                        <Button
                                                            variant="outline"
                                                            className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50"
                                                            onClick={async () => {
                                                                if (confirm("Are you sure you want to cancel your registration?")) {
                                                                    await registrationsService.cancelRegistration(reg.id);
                                                                    loadRegistrations(); // Refresh list
                                                                }
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    {/* PROFILE SETTINGS */}
                    <TabsContent value="profile">
                        <Card className="max-w-xl">
                            <CardHeader>
                                <CardTitle>Profile Details</CardTitle>
                                <CardDescription>Update your personal information.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleUpdateProfile}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">This is used for login and ticket delivery.</p>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={isUpdating}>
                                        {isUpdating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : 'Save Changes'}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>

            </main>
            <Footer />
        </div>
    );
};

export default UserDashboard;
