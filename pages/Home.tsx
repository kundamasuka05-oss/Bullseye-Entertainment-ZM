import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import EditableText from '../components/EditableText';
import GalleryShowcase from '../components/GalleryShowcase';
import { INITIAL_CONTENT } from '../constants';

const Home: React.FC = () => {
  const { products } = useStore();
  const featuredProducts = products.slice(0, 4); 

  return (
    <div className="animate-fade-in overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center pt-10">
        
        {/* Background Elements */}
        <div className="absolute inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-bullseye-red/5 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left Column: Imagery (Ref: Controller/Object) */}
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-bullseye-blue/20 blur-[100px] rounded-full animate-pulse-slow"></div>
              
              {/* Floating Holographic Container */}
              <div className="relative z-10 animate-float">
                <div className="relative bg-bullseye-surface/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-glass transform rotate-[-2deg] transition-transform group-hover:rotate-0 duration-500">
                   <div className="absolute -top-4 -left-4 w-20 h-20 border-t-4 border-l-4 border-bullseye-blue rounded-tl-xl"></div>
                   <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-4 border-r-4 border-bullseye-red rounded-br-xl"></div>
                   
                   <img 
                     src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop" 
                     alt="Event Gaming Setup" 
                     className="rounded-xl w-full h-auto shadow-2xl border border-white/5"
                   />
                   
                   {/* HUD Overlay */}
                   <div className="absolute bottom-10 left-10 bg-black/80 backdrop-blur px-4 py-2 rounded border-l-4 border-bullseye-red">
                      <p className="text-bullseye-red text-xs font-mono font-bold tracking-widest">STATUS</p>
                      <p className="text-white text-sm font-bold">READY TO PLAY</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Right Column: Text & CTA */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="inline-block mb-4 px-3 py-1 rounded bg-bullseye-blue/10 border border-bullseye-blue/30 text-bullseye-blue text-xs font-bold tracking-[0.2em] uppercase">
                Premium Event Rentals
              </div>
              
              <EditableText 
                contentKey="heroTitle" 
                defaultText={INITIAL_CONTENT.heroTitle} 
                tag="h1" 
                className="font-display font-black text-5xl md:text-7xl text-white leading-tight mb-2 tracking-tight drop-shadow-lg"
              />
              
              <EditableText 
                contentKey="heroSubtitle" 
                defaultText={INITIAL_CONTENT.heroSubtitle} 
                tag="h2" 
                className="font-display font-bold text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-bullseye-red to-purple-500 mb-6"
              />
              
              <EditableText 
                contentKey="heroDescription" 
                defaultText={INITIAL_CONTENT.heroDescription} 
                tag="p" 
                className="text-gray-400 text-lg mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light"
              />

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link to="/contact" className="relative group px-8 py-4 bg-bullseye-red text-white font-bold uppercase tracking-wider overflow-hidden rounded transform skew-x-[-10deg] hover:skew-x-0 transition-transform duration-300 shadow-neon-red">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></span>
                  <span className="relative inline-block transform skew-x-[10deg] group-hover:skew-x-0 transition-transform">Book Now</span>
                </Link>
                
                <Link to="/shop" className="px-8 py-4 bg-transparent border border-bullseye-blue text-bullseye-blue font-bold uppercase tracking-wider rounded transform skew-x-[-10deg] hover:bg-bullseye-blue/10 hover:shadow-neon-blue transition-all duration-300">
                   <span className="inline-block transform skew-x-[10deg]">Explore Gear</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- STATS / FEATURES BAR --- */}
      <section className="bg-bullseye-surface border-y border-white/5 py-10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-bullseye-blue/30">
              <div className="w-14 h-14 mx-auto mb-4 bg-bullseye-blue/20 rounded-full flex items-center justify-center text-bullseye-blue group-hover:scale-110 transition-transform shadow-neon-blue">
                <Zap size={28} />
              </div>
              <h3 className="text-white font-display font-bold text-lg mb-2">High Energy</h3>
              <p className="text-sm text-gray-500">Equipment designed to keep the party moving and guests engaged.</p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-bullseye-red/30">
              <div className="w-14 h-14 mx-auto mb-4 bg-bullseye-red/20 rounded-full flex items-center justify-center text-bullseye-red group-hover:scale-110 transition-transform shadow-neon-red">
                <Shield size={28} />
              </div>
              <h3 className="text-white font-display font-bold text-lg mb-2">Safe & Clean</h3>
              <p className="text-sm text-gray-500">Rigorous sanitation and safety checks before every single deployment.</p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-bullseye-purple/30">
              <div className="w-14 h-14 mx-auto mb-4 bg-bullseye-purple/20 rounded-full flex items-center justify-center text-bullseye-purple group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(154,0,255,0.4)]">
                <Users size={28} />
              </div>
              <h3 className="text-white font-display font-bold text-lg mb-2">Team Bonding</h3>
              <p className="text-sm text-gray-500">Curated activities to strengthen connection and morale.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS --- */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display font-black text-white mb-2">TOP TIER <span className="text-bullseye-red">LOOT</span></h2>
              <p className="text-gray-400">Our most requested entertainment hardware.</p>
            </div>
            <Link to="/shop" className="text-bullseye-blue font-bold uppercase tracking-wider flex items-center hover:text-white transition-colors mt-4 md:mt-0">
              View All Inventory <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* --- GALLERY SHOWCASE --- */}
      <GalleryShowcase />

      {/* --- CTA SECTION --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-bullseye-red/10 to-bullseye-blue/10 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-display font-black text-white mb-6 uppercase tracking-tighter">
            Game On?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            The calendar fills up fast. Secure your gear now and make your event legendary.
          </p>
          <Link to="/contact" className="inline-block px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-lg rounded hover:bg-bullseye-blue hover:text-white transition-all duration-300 hover:shadow-neon-blue">
            Start Booking
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;