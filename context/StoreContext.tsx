
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Booking, SiteContent, GalleryItem } from '../types';
import { INITIAL_CONTENT, INITIAL_GALLERY } from '../constants';

interface LoginResponse {
  success: boolean;
  error?: string;
}

interface StoreContextType {
  products: Product[];
  isAdmin: boolean;
  siteContent: SiteContent;
  gallery: GalleryItem[];
  loading: boolean;
  
  login: (username: string, pass: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductAvailability: (id: string) => Promise<void>;
  
  updateContent: (key: string, value: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]); 
  const [siteContent, setSiteContent] = useState<SiteContent>(INITIAL_CONTENT);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [pRes, authRes] = await Promise.all([
        fetch('/api/games', { headers }),
        fetch('/api/auth/check', { headers })
      ]);

      if (pRes.ok) {
        const data = await pRes.json();
        setProducts(data);
      }

      if (authRes.ok) {
        const { isAdmin } = await authRes.json();
        setIsAdmin(isAdmin);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const login = async (username: string, pass: string): Promise<LoginResponse> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });
      const data = await res.json();
      if (data.success) {
        if (data.token) localStorage.setItem('admin_token', data.token);
        setIsAdmin(true);
        return { success: true };
      }
      return { success: false, error: data.error || "Authentication failed." };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      await fetch('/api/auth/logout', { method: 'POST', headers });
      localStorage.removeItem('admin_token');
      setIsAdmin(false);
      window.location.href = '/'; 
    } catch (e) {
      console.error("Logout error:", e);
      window.location.href = '/';
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    console.log("STORE: Adding product...", product.name);
    const token = localStorage.getItem('admin_token');
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch('/api/games', {
      method: 'POST',
      headers,
      body: JSON.stringify(product)
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Unknown server error' }));
      console.error("STORE: Add product failed:", errorData);
      throw new Error(errorData.error || "Failed to add product");
    }
    
    const newProduct = await res.json();
    console.log("STORE: Product added successfully:", newProduct.id);
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = async (updatedProduct: Product) => {
    console.log("STORE: Updating product...", updatedProduct.id);
    const token = localStorage.getItem('admin_token');
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/games/${updatedProduct.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updatedProduct)
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Unknown server error' }));
      console.error("STORE: Update product failed:", errorData);
      throw new Error(errorData.error || "Failed to update product");
    }
    
    console.log("STORE: Product updated successfully:", updatedProduct.id);
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const deleteProduct = async (id: string) => {
    const token = localStorage.getItem('admin_token');
    const headers: any = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/games/${id}`, { 
      method: 'DELETE', 
      headers
    });
    if (!res.ok) throw new Error("Failed to delete product");
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductAvailability = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      const updated = { ...product, available: !product.available };
      await updateProduct(updated);
    }
  };

  const updateContent = (key: string, value: string) => {
    setSiteContent(prev => ({ ...prev, [key]: value }));
  };

  return (
    <StoreContext.Provider value={{
      products, isAdmin, siteContent, gallery, loading,
      login, logout,
      addProduct, updateProduct, deleteProduct, toggleProductAvailability,
      updateContent
    }}>
      {loading ? (
        <div className="min-h-screen bg-bullseye-base flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-bullseye-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-display text-sm tracking-[0.3em] uppercase">Booting System...</p>
          </div>
        </div>
      ) : children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
