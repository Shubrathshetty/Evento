import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form, FormControl, FormDescription, FormField,
    FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { eventsService, type Event, type EventCreate } from "@/services/eventsService";
import { useForm } from "react-hook-form";
import { Loader2, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema validation
const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    description: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    location: z.string().min(1, "Location is required"),
    map_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    price: z.coerce.number().min(0).default(0),
    capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
    registration_deadline: z.string().optional().or(z.literal("")),
    is_published: z.boolean().default(false),
});

const EventManagement = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const isEditing = !!id;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            date: "",
            time: "",
            location: "",
            map_link: "",
            image_url: "",
            price: 0,
            capacity: 100,
            registration_deadline: "",
            is_published: false,
        },
    });

    useEffect(() => {
        if (isEditing) {
            const fetchEvent = async () => {
                try {
                    const event = await eventsService.getEventById(id);
                    if (event) {
                        // Format dates for input fields
                        const dateObj = new Date(event.date);
                        const dateStr = dateObj.toISOString().split('T')[0];

                        let deadlinesStr = "";
                        if (event.registration_deadline) {
                            deadlinesStr = new Date(event.registration_deadline).toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
                        }

                        form.reset({
                            title: event.title,
                            description: event.description || "",
                            category: event.category || "",
                            date: dateStr,
                            time: event.time || "",
                            location: event.location || "",
                            map_link: event.map_link || "",
                            image_url: event.image_url || "",
                            price: event.price || 0,
                            capacity: event.capacity || 100,
                            registration_deadline: deadlinesStr,
                            is_published: event.is_published || false,
                        });
                    }
                } catch (error) {
                    toast({
                        title: "Error",
                        description: "Failed to load event details",
                        variant: "destructive",
                    });
                }
            };
            fetchEvent();
        }
    }, [id, isEditing, form, toast]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setLoading(true);
        try {
            // Format data for API
            const eventData: any = {
                ...values,
                date: new Date(values.date).toISOString(),
                registration_deadline: values.registration_deadline ? new Date(values.registration_deadline).toISOString() : null,
                // cleanup empty strings
                map_link: values.map_link || null,
                image_url: values.image_url || null,
                description: values.description || null,
            };

            if (isEditing) {
                await eventsService.updateEvent(id, eventData);
                toast({ title: "Success", description: "Event updated successfully" });
            } else {
                await eventsService.createEvent(eventData);
                toast({ title: "Success", description: "Event created successfully" });
            }
            navigate("/admin");
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: `Failed to ${isEditing ? 'update' : 'create'} event`,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <AdminNavbar />
            <main className="flex-grow container py-10 max-w-3xl">
                <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">{isEditing ? "Edit Event" : "Create New Event"}</h1>
                    <p className="text-muted-foreground">
                        {isEditing ? "Update event details and settings" : "Fill in the details to create a new event"}
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Basic Info */}
                        <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                            <h3 className="font-semibold text-lg">Basic Information</h3>
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Event Name</FormLabel>
                                    <FormControl><Input placeholder="e.g. Tech Conference 2024" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl><Textarea placeholder="Event details..." className="h-32" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="category" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Technology">Technology</SelectItem>
                                                <SelectItem value="Music">Music</SelectItem>
                                                <SelectItem value="Business">Business</SelectItem>
                                                <SelectItem value="Health">Health</SelectItem>
                                                <SelectItem value="Education">Education</SelectItem>
                                                <SelectItem value="Social">Social</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="capacity" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Participants</FormLabel>
                                        <FormControl><Input type="number" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* Date & Location */}
                        <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                            <h3 className="font-semibold text-lg">Date & Location</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="date" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Event Date</FormLabel>
                                        <FormControl><Input type="date" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="time" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time</FormLabel>
                                        <FormControl><Input placeholder="e.g. 7:00 PM" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="location" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location Address</FormLabel>
                                        <FormControl><Input placeholder="123 Event St, City" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="map_link" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Google Maps Link</FormLabel>
                                        <FormControl><Input placeholder="https://maps.google.com/..." {...field} /></FormControl>
                                        <FormDescription>Optional link to map location</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        {/* Media & Settings */}
                        <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                            <h3 className="font-semibold text-lg">Media & Settings</h3>

                            <FormField control={form.control} name="image_url" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Banner Image URL</FormLabel>
                                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                    <FormDescription>URL for the event banner image</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="price" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl><Input type="number" min="0" {...field} /></FormControl>
                                        <FormDescription>Enter 0 for free events</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="registration_deadline" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Registration Deadline</FormLabel>
                                        <FormControl><Input type="datetime-local" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="is_published" render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Publish Event</FormLabel>
                                        <FormDescription>
                                            If checked, this event will be visible to the public immediately.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )} />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => navigate("/admin")}>Cancel</Button>
                            <Button type="submit" className="flex-1 bg-primary" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Save Changes" : "Create Event"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </main>
            <Footer />
        </div>
    );
};

export default EventManagement;
