
import React from "react";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-event-purple text-white">
      <div className="hero-gradient py-20 md:py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-bold mb-6 animate-fade-in">
              Discover Amazing Events Near You
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Find and join events that match your passions and interests.
              Connect with people and create unforgettable memories.
            </p>

            <div className="max-w-xl mx-auto mb-8">
              <SearchBar 
                placeholder="Search events, categories, locations..."
                className="bg-white rounded-lg shadow-lg"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/events">
                <Button size="lg" className="bg-white text-event-purple hover:bg-gray-100">
                  Browse All Events
                </Button>
              </Link>
              <Link to="/create">
                <Button size="lg" className="bg-transparent border-2 border-white hover:bg-white/10">
                  Create Your Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-white" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}></div>
    </div>
  );
};

export default HeroSection;
