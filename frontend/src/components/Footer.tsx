
import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-6 w-6 text-event-purple" />
              <span className="text-xl font-bold">EventHub</span>
            </div>
            <p className="text-muted-foreground">
              Discover amazing events and create unforgettable experiences.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-event-purple transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-event-purple transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/create" className="text-muted-foreground hover:text-event-purple transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground hover:text-event-purple transition-colors">
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=Technology" className="text-muted-foreground hover:text-event-purple transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/events?category=Music" className="text-muted-foreground hover:text-event-purple transition-colors">
                  Music
                </Link>
              </li>
              <li>
                <Link to="/events?category=Business" className="text-muted-foreground hover:text-event-purple transition-colors">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/events?category=Sports" className="text-muted-foreground hover:text-event-purple transition-colors">
                  Sports
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                Email: support@eventhub.com
              </li>
              <li className="text-muted-foreground">
                Phone: (123) 456-7890
              </li>
              <li className="text-muted-foreground">
                Address: 123 Event St, City
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EventHub. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-event-purple transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-event-purple transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-event-purple transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
