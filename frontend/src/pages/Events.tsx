import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Loader2 } from "lucide-react";
import { eventsService, type Event } from "@/services/eventsService";

const CATEGORIES = [
    "All",
    "Technology",
    "Music",
    "Business",
    "Food",
    "Art",
    "Sports",
    "Education",
    "Charity",
];

const Events = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get("category") || "All"
    );
    const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

    useEffect(() => {
        fetchEvents();
    }, [selectedCategory, searchQuery]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            let fetchedEvents: Event[];

            if (searchQuery) {
                fetchedEvents = await eventsService.searchEvents(searchQuery);
            } else if (selectedCategory !== "All") {
                fetchedEvents = await eventsService.getEventsByCategory(selectedCategory);
            } else {
                fetchedEvents = await eventsService.getAllEvents();
            }

            setEvents(fetchedEvents);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        if (category !== "All") {
            setSearchParams({ category });
        } else {
            setSearchParams({});
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery) {
            setSearchParams({ q: searchQuery });
        } else {
            setSearchParams({});
        }
        fetchEvents();
    };

    // Filter events by price
    const filteredEvents = events.filter((event) => {
        if (priceFilter === "free") return !event.price || event.price === 0;
        if (priceFilter === "paid") return event.price && event.price > 0;
        return true;
    });

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-gradient-to-r from-event-purple to-event-dark-purple text-white py-16">
                    <div className="container">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Discover Amazing Events
                        </h1>
                        <p className="text-xl mb-8 opacity-90">
                            Find and attend events that match your interests
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="max-w-2xl">
                            <div className="flex gap-2">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search events..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 bg-white text-black"
                                    />
                                </div>
                                <Button type="submit" className="bg-white text-event-purple hover:bg-gray-100">
                                    Search
                                </Button>
                            </div>
                        </form>
                    </div>
                </section>

                <div className="container py-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <aside className="md:w-64 space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center">
                                    <Filter className="h-4 w-4 mr-2" />
                                    Categories
                                </h3>
                                <div className="space-y-2">
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => handleCategoryChange(category)}
                                            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${selectedCategory === category
                                                    ? "bg-event-purple text-white"
                                                    : "hover:bg-gray-100"
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Price</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setPriceFilter("all")}
                                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${priceFilter === "all"
                                                ? "bg-event-purple text-white"
                                                : "hover:bg-gray-100"
                                            }`}
                                    >
                                        All Events
                                    </button>
                                    <button
                                        onClick={() => setPriceFilter("free")}
                                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${priceFilter === "free"
                                                ? "bg-event-purple text-white"
                                                : "hover:bg-gray-100"
                                            }`}
                                    >
                                        Free Events
                                    </button>
                                    <button
                                        onClick={() => setPriceFilter("paid")}
                                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${priceFilter === "paid"
                                                ? "bg-event-purple text-white"
                                                : "hover:bg-gray-100"
                                            }`}
                                    >
                                        Paid Events
                                    </button>
                                </div>
                            </div>
                        </aside>

                        {/* Events Grid */}
                        <div className="flex-grow">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">
                                    {searchQuery
                                        ? `Search results for "${searchQuery}"`
                                        : selectedCategory !== "All"
                                            ? `${selectedCategory} Events`
                                            : "All Events"}
                                </h2>
                                <Badge variant="secondary">
                                    {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
                                </Badge>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-event-purple" />
                                </div>
                            ) : filteredEvents.length === 0 ? (
                                <div className="text-center py-20">
                                    <p className="text-xl text-muted-foreground mb-4">
                                        No events found
                                    </p>
                                    <p className="text-muted-foreground mb-6">
                                        Try adjusting your filters or search query
                                    </p>
                                    <Button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCategory("All");
                                            setPriceFilter("all");
                                            setSearchParams({});
                                        }}
                                        variant="outline"
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredEvents.map((event) => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Events;
