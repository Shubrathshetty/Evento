import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    price: "",
    capacity: "",
    imageUrl: "",
  });

  const categories = [
    "Technology",
    "Music",
    "Business",
    "Food",
    "Art",
    "Sports",
    "Education",
    "Charity",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create an event.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select a date for your event.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement actual API call to save event
      // For now, we'll simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Event Created Successfully!",
        description: "Your event has been published and is now live.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12 bg-event-soft-gray">
        <div className="container max-w-3xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Event</h1>
            <p className="text-muted-foreground mb-8">
              Fill in the details below to create and publish your event.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a catchy event title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your event in detail..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  required
                />
              </div>

              {/* Category and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, category: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Event Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="Event venue or address"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Price and Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Ticket Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="pl-10"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Leave blank for free events
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      placeholder="Max attendees"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className="pl-10"
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Event Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
                <p className="text-xs text-muted-foreground">
                  Provide a URL to an image that represents your event
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-event-purple hover:bg-event-dark-purple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Event..." : "Create Event"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateEvent;
