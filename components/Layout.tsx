import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../constants';
import AdminToolbar from './AdminToolbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const getWhatsAppLink = () => {
    const baseUrl = `https://wa.me/${COMPANY_INFO.whatsappMain}`;
    const pageName = location.pathname === '/' ? 'Home' : location.pathname.replace('/', '');
    const text = `Hi Bullseye! I'm browsing your ${pageName} page and have a question.`;
    return `${baseUrl}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-bullseye-base text-gray-200 font-sans selection:bg-bullseye-red selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-bullseye-blue/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-bullseye-red/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>

      <AdminToolbar />
      
      {/* Navbar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 border-b border-white/5 ${
        scrolled ? 'bg-bullseye-base/80 backdrop-blur-md shadow-glass' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            
            {/* Logo */}
            <Link to="/" className="flex items-center group">
               {/* Replace with actual image in production */}
               <img src="/logo.png" alt="Bullseye Logo" className="h-20 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" 
                    onError={(e) => {
                      e.currentTarget.onerror = null; 
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }} 
               />
               <span className="hidden ml-2 font-display font-black text-2xl tracking-widest text-white group-hover:text-bullseye-red transition-colors duration-300">
                 BULL<span className="text-bullseye-red group-hover:text-white">SEYE</span>
               </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative px-1 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 group ${
                      location.pathname === link.path 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-bullseye-blue to-bullseye-red transform origin-left transition-transform duration-300 ${
                      location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}></span>
                  </Link>
                ))}
                
                <Link to="/contact" className="ml-4 px-6 py-2 rounded border border-bullseye-blue text-bullseye-blue font-bold uppercase text-xs tracking-widest hover:bg-bullseye-blue hover:text-white hover:shadow-neon-blue transition-all duration-300">
                  Book Now
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-panel border-t border-white/10 animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-4 text-base font-display font-bold uppercase tracking-wider ${
                     location.pathname === link.path 
                      ? 'text-bullseye-red bg-white/5' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-bullseye-red/30 relative mt-20">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-bullseye-red to-transparent"></div>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-display text-2xl font-black mb-4 tracking-wider">
              BULLSEYE<span className="text-bullseye-red">ZM</span>
            </h3>
            <p className="text-gray-400 text-sm max-w-sm">
              {COMPANY_INFO.tagline} <br/>
              Leveling up entertainment in Zambia with premium rentals, giant games, and immersive experiences.
            </p>
          </div>
          <div>
            <h3 className="text-white font-display text-lg font-bold mb-6 text-glow">CONNECT</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center hover:text-bullseye-blue transition-colors"><Phone size={16} className="mr-3 text-bullseye-red" /> {COMPANY_INFO.phones[0]}</li>
              <li className="flex items-center hover:text-bullseye-blue transition-colors"><Phone size={16} className="mr-3 text-bullseye-red" /> {COMPANY_INFO.phones[1]}</li>
              <li className="flex items-start hover:text-bullseye-blue transition-colors">
                <span className="mr-3 mt-1 text-bullseye-red">📍</span> {COMPANY_INFO.location}
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-display text-lg font-bold mb-6 text-glow">EXPLORE</h3>
            <div className="flex flex-col space-y-2">
               <Link to="/shop" className="text-sm text-gray-400 hover:text-bullseye-blue transition-colors">Browse Gear</Link>
               <Link to="/about" className="text-sm text-gray-400 hover:text-bullseye-blue transition-colors">Our Mission</Link>
               <Link to="/contact" className="text-sm text-gray-400 hover:text-bullseye-blue transition-colors">Book Event</Link>
               <Link to="/admin-login" className="text-xs text-gray-600 hover:text-gray-400 mt-4">Admin Access</Link>
            </div>
          </div>
        </div>
        <div className="bg-black py-6 text-center text-xs text-gray-600 font-mono border-t border-white/5">
          &copy; {new Date().getFullYear()} Bullseye Entertainment ZM. SYSTEM ONLINE.
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a 
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#1ebd59] text-white p-4 rounded-full shadow-neon-blue z-[90] transition-all transform hover:scale-110 flex items-center justify-center group"
        aria-label="Chat on WhatsApp"
      >
        <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#25D366]"></div>
        <MessageCircle size={28} className="relative z-10" />
      </a>
    </div>
  );
};

export default Layout;