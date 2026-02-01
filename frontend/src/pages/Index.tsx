
import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedEvents from "@/components/FeaturedEvents";
import Footer from "@/components/Footer";
import { getFeaturedEvents } from "@/data/events";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const featuredEvents = getFeaturedEvents();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        <FeaturedEvents events={featuredEvents} />

        {/* Categories Section */}
        <section className="py-16 container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">
            Explore Event Categories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Technology", icon: <CalendarDays className="h-8 w-8 mb-2 mx-auto" />, color: "bg-blue-100" },
              { name: "Music", icon: <CalendarDays className="h-8 w-8 mb-2 mx-auto" />, color: "bg-pink-100" },
              { name: "Business", icon: <CalendarDays className="h-8 w-8 mb-2 mx-auto" />, color: "bg-yellow-100" },
              { name: "Food", icon: <CalendarDays className="h-8 w-8 mb-2 mx-auto" />, color: "bg-green-100" },
              { name: "Art", icon: <CalendarDays className="h-8 w-8 mb-2 mx-auto" />, color: "bg-purple-100" },
              { name: "Sports", icon: <CalendarDays className="h-8 w-8 mb-2 mx-auto" />, color: "bg-red-100" },
              { name: "Education", icon: <CalendarDays className="h-8 w-8 mb-2 mx-auto" />, color: "bg-indigo-100" },
              { name: "Charity", icon: <CalendarDays className="h-8 w-8 mb-2 mx-auto" />, color: "bg-orange-100" },
            ].map((category) => (
              <Link 
                key={category.name}
                to={`/events?category=${category.name}`}
                className={`${category.color} p-6 rounded-lg text-center transition-transform hover:scale-105`}
              >
                {category.icon}
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-event-soft-gray">
          <div className="container">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              How EventO Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-event-purple rounded-full flex items-center justify-center mb-4">
                  <Ticket className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Find Events</h3>
                <p className="text-muted-foreground">
                  Discover events that match your interests and fit your schedule.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-event-purple rounded-full flex items-center justify-center mb-4">
                  <CalendarDays className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Join & Attend</h3>
                <p className="text-muted-foreground">
                  Register for events easily and get all the information you need.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-event-purple rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Events</h3>
                <p className="text-muted-foreground">
                  Host your own events and reach the right audience effortlessly.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/events">
                <Button className="bg-event-purple hover:bg-event-dark-purple">
                  Start Exploring
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-event-purple text-white">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Ready to Host Your Own Event?
              </h2>
              <p className="text-lg mb-8">
                Create, manage, and promote your events easily with our platform.
                Reach the right audience and make your event a success!
              </p>
              <Link to="/create">
                <Button size="lg" className="bg-white text-event-purple hover:bg-gray-100">
                  Create an Event
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
