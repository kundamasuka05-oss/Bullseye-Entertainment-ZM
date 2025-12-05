import { Product, SiteContent, GalleryItem } from './types';

export const COMPANY_INFO = {
  name: "Bullseye Entertainment ZM",
  tagline: "Get the party started!",
  location: "Ibex Third Street, Lusaka, Zambia",
  phones: ["+260975909975", "+260963213509"],
  email: "bookings@bullseye.zm",
  hours: "Mon–Sat 08:00–18:00",
  whatsappMain: "260975909975"
};

export const INITIAL_CONTENT: SiteContent = {
  heroTitle: "Bullseye Entertainment ZM",
  heroSubtitle: "Get the party started!",
  heroDescription: "Zambia's premier choice for event rentals, giant games, inflatables, and corporate team building.",
  aboutStory: "Started in the heart of Lusaka, Bullseye Entertainment began with a simple idea: bringing people together through play. We realized that whether it's a kid's birthday or a corporate retreat, the key to a great event is engagement.",
  aboutMission: "To provide high-quality, safe, and fun entertainment solutions that create lasting memories.",
  aboutVibe: "Energetic, professional, and reliable. We take the stress out of party planning.",
  aboutPromise: "Clean equipment, on-time delivery, and transparent pricing. No hidden fees."
};

export const INITIAL_GALLERY: GalleryItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070' },
  { id: '2', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069' },
  { id: '3', url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=2070' },
  { id: '4', url: 'https://images.unsplash.com/photo-1530103862676-de3c9da59af7?q=80&w=2069' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // Games
  { id: '1', name: 'Giant Jenga', price: 250, category: 'Games', available: true, description: 'Classic block stacking game, but giant!', image: 'https://picsum.photos/400/300?random=1' },
  { id: '2', name: 'Giant Connect 4', price: 300, category: 'Games', available: true, description: 'Strategy game for two players or teams.', image: 'https://picsum.photos/400/300?random=2' },
  { id: '3', name: 'Cornhole Set', price: 200, category: 'Games', available: true, description: 'Toss the bean bags into the hole.', image: 'https://picsum.photos/400/300?random=3' },
  { id: '4', name: 'Tug of War Rope', price: 150, category: 'Games', available: true, description: 'Heavy duty rope for team competitions.', image: 'https://picsum.photos/400/300?random=4' },
  { id: '5', name: 'Sack Race Bags (Set of 4)', price: 100, category: 'Games', available: true, description: 'Old school fun for everyone.', image: 'https://picsum.photos/400/300?random=5' },
  { id: '6', name: 'Giant Chess', price: 450, category: 'Games', available: true, description: 'Intellectual battle on a large scale.', image: 'https://picsum.photos/400/300?random=6' },
  { id: '7', name: 'Limbo Set', price: 150, category: 'Games', available: true, description: 'How low can you go?', image: 'https://picsum.photos/400/300?random=7' },
  { id: '8', name: 'Beer Pong Table', price: 200, category: 'Games', available: true, description: 'Foldable table for competitive fun.', image: 'https://picsum.photos/400/300?random=8' },
  
  // Inflatables
  { id: '9', name: 'Standard Bouncy Castle', price: 850, category: 'Inflatables', available: true, description: 'Perfect for kids parties. 4x4 meters.', image: 'https://picsum.photos/400/300?random=9' },
  { id: '10', name: 'Water Slide', price: 1200, category: 'Inflatables', available: false, description: 'Cool off with this giant slide.', image: 'https://picsum.photos/400/300?random=10' },
  { id: '11', name: 'Obstacle Course', price: 1500, category: 'Inflatables', available: true, description: 'Race through the inflatable tunnels.', image: 'https://picsum.photos/400/300?random=11' },
  { id: '12', name: 'Bubble Soccer (Set of 4)', price: 1000, category: 'Inflatables', available: true, description: 'Bounce into each other safely.', image: 'https://picsum.photos/400/300?random=12' },

  // Equipment
  { id: '13', name: 'Popcorn Machine', price: 400, category: 'Equipment', available: true, description: 'Includes kernels for 50 servings.', image: 'https://picsum.photos/400/300?random=13' },
  { id: '14', name: 'Candy Floss Machine', price: 400, category: 'Equipment', available: true, description: 'Sweet treat for any event.', image: 'https://picsum.photos/400/300?random=14' },
  { id: '15', name: 'PA System (Speaker + Mic)', price: 600, category: 'Equipment', available: true, description: 'Bluetooth enabled loud speaker.', image: 'https://picsum.photos/400/300?random=15' },
  { id: '16', name: 'Projector & Screen', price: 750, category: 'Equipment', available: true, description: 'HD Projector for movies or presentations.', image: 'https://picsum.photos/400/300?random=16' },
  { id: '17', name: 'Plastic Chairs (Pack of 10)', price: 100, category: 'Equipment', available: true, description: 'Standard white event chairs.', image: 'https://picsum.photos/400/300?random=17' },
  { id: '18', name: 'Foldable Tables', price: 50, category: 'Equipment', available: true, description: '6-foot rectangular tables.', image: 'https://picsum.photos/400/300?random=18' },
  { id: '19', name: 'Red Carpet (10m)', price: 300, category: 'Equipment', available: true, description: 'VIP entrance experience.', image: 'https://picsum.photos/400/300?random=19' },
  { id: '20', name: 'Fog Machine', price: 250, category: 'Equipment', available: true, description: 'Add atmosphere to the dance floor.', image: 'https://picsum.photos/400/300?random=20' },

  // Team Building
  { id: '21', name: 'Blindfold Challenge Kit', price: 150, category: 'Team Building', available: true, description: 'Communication exercise tools.', image: 'https://picsum.photos/400/300?random=21' },
  { id: '22', name: 'Plank Walk Ski', price: 200, category: 'Team Building', available: true, description: 'Coordinate steps to move forward.', image: 'https://picsum.photos/400/300?random=22' },
  { id: '23', name: 'Hula Hoops (Set of 10)', price: 80, category: 'Team Building', available: true, description: 'Fitness and fun challenges.', image: 'https://picsum.photos/400/300?random=23' },
  { id: '24', name: 'Egg & Spoon Race Kit', price: 50, category: 'Team Building', available: true, description: 'Classic balance game.', image: 'https://picsum.photos/400/300?random=24' }
];

export const FAQS = [
  { q: "How do I book?", a: "Browse our shop, note the items you want, and fill out the booking form on the Contact page. We will confirm via WhatsApp." },
  { q: "Do you deliver?", a: "Yes, we offer delivery within Lusaka for a small fee depending on the distance from Ibex Hill." },
  { q: "Is a deposit required?", a: "Yes, a 50% commitment fee is required to secure your date and items." },
  { q: "What if it rains?", a: "For outdoor inflatables, we can reschedule if weather permits, but we recommend having a backup indoor plan." },
];