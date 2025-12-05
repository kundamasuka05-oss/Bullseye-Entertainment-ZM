import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, Users } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import EditableText from '../components/EditableText';
import { INITIAL_CONTENT } from '../constants';

const Home: React.FC = () => {
  const { products } = useStore();
  const featuredProducts = products.slice(0, 4); 

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-bullseye-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-bullseye-black to-gray-900 opacity-90 z-0"></div>
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="mb-6">
            <EditableText 
              contentKey="heroTitle" 
              defaultText={INITIAL_CONTENT.heroTitle} 
              tag="h1" 
              className="text-4xl md:text-6xl font-extrabold tracking-tight block"
            />
            <EditableText 
              contentKey="heroSubtitle" 
              defaultText={INITIAL_CONTENT.heroSubtitle} 
              tag="span" 
              className="block text-bullseye-red mt-2 text-3xl md:text-5xl font-bold"
            />
          </div>
          
          <EditableText 
            contentKey="heroDescription" 
            defaultText={INITIAL_CONTENT.heroDescription} 
            tag="p" 
            className="mt-4 max-w-2xl text-xl text-gray-300"
          />

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link to="/shop" className="px-8 py-3 rounded-full bg-bullseye-red text-white font-bold text-lg hover:bg-red-700 transition-all shadow-lg transform hover:scale-105">
              Shop Rentals
            </Link>
            <Link to="/contact" className="px-8 py-3 rounded-full bg-white text-bullseye-black font-bold text-lg hover:bg-gray-200 transition-all shadow-lg">
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 text-bullseye-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Reliable Delivery</h3>
              <p className="text-gray-600">We deliver straight to your venue in Lusaka, ensuring everything is set up before your guests arrive.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 text-bullseye-red rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Gear</h3>
              <p className="text-gray-600">Our equipment is cleaned, maintained, and safety-checked before every single event.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 text-bullseye-red rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Team Building</h3>
              <p className="text-gray-600">Expertly crafted activities designed to boost morale and improve communication.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Rentals</h2>
            <Link to="/shop" className="text-bullseye-red font-semibold flex items-center hover:underline">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={() => window.location.hash = `#/shop`} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bullseye-black py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to host an unforgettable event?</h2>
          <p className="text-gray-400 mb-8">Contact us today to secure your date. Our calendar fills up fast!</p>
          <Link to="/contact" className="inline-block px-8 py-3 border-2 border-bullseye-red text-bullseye-red font-bold rounded-full hover:bg-bullseye-red hover:text-white transition-colors">
            Get a Quote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;