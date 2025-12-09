import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Booking, SiteContent, GalleryItem } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CONTENT, INITIAL_GALLERY } from '../constants';

interface StoreContextType {
  products: Product[];
  bookings: Booking[];
  isAdmin: boolean;
  isEditMode: boolean;
  siteContent: SiteContent;
  gallery: GalleryItem[];
  
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  toggleEditMode: () => void;
  
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  
  addBooking: (booking: Booking) => void;
  
  updateContent: (key: string, value: string) => void;
  addGalleryItem: (item: GalleryItem) => void;
  removeGalleryItem: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  // --- STATE ---
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('bullseye_auth') === 'true';
  });
  
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bullseye_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('bullseye_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('bullseye_content');
    return saved ? JSON.parse(saved) : INITIAL_CONTENT;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('bullseye_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  // --- PERSISTENCE ---
  useEffect(() => { localStorage.setItem('bullseye_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('bullseye_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('bullseye_auth', String(isAdmin)); }, [isAdmin]);
  useEffect(() => { localStorage.setItem('bullseye_content', JSON.stringify(siteContent)); }, [siteContent]);
  useEffect(() => { localStorage.setItem('bullseye_gallery', JSON.stringify(gallery)); }, [gallery]);

  // --- AUTHENTICATION ---
  const login = async (email: string, pass: string) => {
    // SIMULATED FIREBASE AUTH
    // In production, use: await signInWithEmailAndPassword(auth, email, pass);
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        if (email === 'admin@bullseye.zm' && pass === 'bullseye123') {
          setIsAdmin(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 500);
    });
  };

  const logout = () => {
    setIsAdmin(false);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  // --- CONTENT MANAGEMENT ---
  const updateContent = (key: string, value: string) => {
    setSiteContent(prev => ({ ...prev, [key]: value }));
  };

  const addGalleryItem = (item: GalleryItem) => {
    setGallery(prev => [...prev, item]);
  };

  const removeGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
  };

  // --- PRODUCT MANAGEMENT ---
  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const toggleProductAvailability = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, available: !p.available } : p
    ));
  };

  // --- BOOKING MANAGEMENT ---
  const addBooking = (booking: Booking) => {
    setBookings([booking, ...bookings]);
  };

  return (
    <StoreContext.Provider value={{
      products,
      bookings,
      isAdmin,
      isEditMode,
      siteContent,
      gallery,
      login,
      logout,
      toggleEditMode,
      addProduct,
      updateProduct,
      deleteProduct,
      toggleProductAvailability,
      addBooking,
      updateContent,
      addGalleryItem,
      removeGalleryItem
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};