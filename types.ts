export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Games' | 'Inflatables' | 'Equipment' | 'Team Building';
  description: string;
  image: string;
  available: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  items: string[]; // Array of Product IDs
  createdAt: string;
}

export interface User {
  email: string;
  role: 'admin' | 'user';
}

export interface GalleryItem {
  id: string;
  url: string;
  caption?: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutStory: string;
  aboutMission: string;
  aboutVibe: string;
  aboutPromise: string;
  [key: string]: string; // Allow dynamic indexing
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc';