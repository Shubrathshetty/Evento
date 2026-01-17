
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number | null;
  image: string;
  category: string;
  organizer: string;
  capacity: number;
  attendees: number;
  featured: boolean;
}

export const events: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description: "Join us for an exciting tech conference featuring the latest in tech innovations and networking opportunities with industry leaders.",
    date: "2025-06-15",
    time: "09:00 AM - 05:00 PM",
    location: "Convention Center, New York",
    price: 299,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Technology",
    organizer: "Tech Events Inc.",
    capacity: 500,
    attendees: 342,
    featured: true
  },
  {
    id: "2",
    title: "Music Festival",
    description: "A weekend of amazing music performances across multiple stages featuring top artists and emerging talents.",
    date: "2025-07-20",
    time: "12:00 PM - 11:00 PM",
    location: "City Park, Los Angeles",
    price: 150,
    image: "https://images.unsplash.com/photo-1521543832500-49e69fb2bea2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Music",
    organizer: "Sound Wave Productions",
    capacity: 5000,
    attendees: 3850,
    featured: true
  },
  {
    id: "3",
    title: "Business Leadership Summit",
    description: "Develop your leadership skills and gain valuable insights from successful business leaders and industry experts.",
    date: "2025-05-10",
    time: "10:00 AM - 04:00 PM",
    location: "Grand Hotel, Chicago",
    price: 399,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Business",
    organizer: "Leadership Institute",
    capacity: 300,
    attendees: 275,
    featured: true
  },
  {
    id: "4",
    title: "Art Exhibition",
    description: "Explore amazing artwork from local and international artists showcasing various styles and mediums.",
    date: "2025-04-25",
    time: "11:00 AM - 07:00 PM",
    location: "Modern Art Gallery, San Francisco",
    price: 25,
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Art",
    organizer: "Creative Arts Association",
    capacity: 200,
    attendees: 150,
    featured: false
  },
  {
    id: "5",
    title: "Food & Wine Festival",
    description: "Sample delicious cuisines and wines from top chefs and wineries in a festive atmosphere.",
    date: "2025-08-05",
    time: "02:00 PM - 10:00 PM",
    location: "Waterfront Park, Seattle",
    price: 75,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Food",
    organizer: "Culinary Events Co.",
    capacity: 1000,
    attendees: 820,
    featured: true
  },
  {
    id: "6",
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their ideas to investors and compete for funding opportunities.",
    date: "2025-06-03",
    time: "01:00 PM - 06:00 PM",
    location: "Innovation Hub, Boston",
    price: 50,
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Business",
    organizer: "Venture Capital Group",
    capacity: 250,
    attendees: 200,
    featured: false
  },
  {
    id: "7",
    title: "Fitness Challenge",
    description: "Join athletes of all levels in this challenging fitness event that tests your strength and endurance.",
    date: "2025-05-30",
    time: "07:00 AM - 12:00 PM",
    location: "Memorial Park, Houston",
    price: 35,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Sports",
    organizer: "ActiveLife Promotions",
    capacity: 500,
    attendees: 310,
    featured: false
  },
  {
    id: "8",
    title: "Web Development Workshop",
    description: "Learn the fundamentals of web development in this hands-on workshop for beginners and intermediate developers.",
    date: "2025-04-15",
    time: "09:00 AM - 03:00 PM",
    location: "Tech Campus, Austin",
    price: 120,
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    category: "Technology",
    organizer: "Code Academy",
    capacity: 50,
    attendees: 42,
    featured: false
  }
];

export const getEventById = (id: string): Event | undefined => {
  return events.find(event => event.id === id);
};

export const getFeaturedEvents = (): Event[] => {
  return events.filter(event => event.featured);
};

export const getEventsByCategory = (category: string): Event[] => {
  return events.filter(event => event.category === category);
};
