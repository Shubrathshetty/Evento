
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import { eventsService, type Event } from "@/services/eventsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Loader2 } from "lucide-react";

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

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Update URL params when filters change
    const params: any = {};
    if (searchQuery) params.q = searchQuery;
    if (selectedCategory !== "All") params.category = selectedCategory;
    setSearchParams(params);

    filterEvents();
  }, [searchQuery, selectedCategory, priceFilter, events]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const fetchedEvents = await eventsService.getAllEvents();
      setEvents(fetchedEvents);
      // Determine unique categories from actual data if needed, 
      // but we'll stick to fixed categories for consistent UI
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let result = [...events];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((event) => event.category === selectedCategory);
    }

    // Price filter
    if (priceFilter === "free") {
      result = result.filter((event) => !event.price || event.price === 0);
    } else if (priceFilter === "paid") {
      result = result.filter((event) => event.price && event.price > 0);
    }

    setFilteredEvents(result);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect, this just prevents form submission
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPriceFilter("all");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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
              <div className="flex gap-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Input
                  type="text"
                  placeholder="Search events by name, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white text-black border-none shadow-lg text-lg"
                />
              </div>
            </form>
          </div>
        </section>

        <div className="container py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center text-lg">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </h3>
                  {(searchQuery || selectedCategory !== "All" || priceFilter !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs text-red-500 hover:text-red-600 h-auto p-0"
                    >
                      Reset
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-gray-500 uppercase tracking-wider">Category</h4>
                    <div className="space-y-1">
                      {CATEGORIES.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${selectedCategory === category
                              ? "bg-event-light-purple text-event-purple font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Price */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm text-gray-500 uppercase tracking-wider">Price</h4>
                    <div className="space-y-1">
                      {[
                        { id: "all", label: "Any Price" },
                        { id: "free", label: "Free" },
                        { id: "paid", label: "Paid" },
                      ].map((price) => (
                        <button
                          key={price.id}
                          onClick={() => setPriceFilter(price.id as any)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${priceFilter === price.id
                              ? "bg-event-light-purple text-event-purple font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                          {price.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Events Grid */}
            <div className="flex-grow">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === "All" ? "All Events" : `${selectedCategory} Events`}
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Showing {filteredEvents.length} result{filteredEvents.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col justify-center items-center py-20 min-h-[400px]">
                  <Loader2 className="h-10 w-10 animate-spin text-event-purple mb-4" />
                  <p className="text-muted-foreground">Loading events...</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    We couldn't find any events matching your current filters. Try searching for something else or adjusting your criteria.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
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

export default EventsPage;
