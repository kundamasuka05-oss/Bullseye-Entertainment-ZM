import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Target, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../constants';
import AdminToolbar from './AdminToolbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  // Helper to generate WhatsApp Link based on current page
  const getWhatsAppLink = () => {
    const baseUrl = `https://wa.me/${COMPANY_INFO.whatsappMain}`;
    const pageName = location.pathname === '/' ? 'Home' : location.pathname.replace('/', '');
    const text = `Hi Bullseye! I'm browsing your ${pageName} page and have a question.`;
    return `${baseUrl}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminToolbar />
      
      {/* Navigation */}
      <nav className="bg-bullseye-black text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-bullseye-red p-1.5 rounded-full">
                <Target size={24} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-wider">BULLSEYE<span className="text-bullseye-red">ZM</span></span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      location.pathname === link.path 
                      ? 'bg-bullseye-red text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-bullseye-black border-t border-gray-700">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                     location.pathname === link.path 
                      ? 'bg-bullseye-red text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4 flex items-center">
              <Target size={20} className="mr-2 text-bullseye-red" /> Bullseye Entertainment ZM
            </h3>
            <p className="text-sm">
              {COMPANY_INFO.tagline} <br/>
              Bringing joy to Lusaka, one event at a time.
            </p>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><Phone size={16} className="mr-2" /> {COMPANY_INFO.phones[0]}</li>
              <li className="flex items-center"><Phone size={16} className="mr-2" /> {COMPANY_INFO.phones[1]}</li>
              <li>{COMPANY_INFO.location}</li>
              <li>{COMPANY_INFO.hours}</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
            <div className="flex space-x-4">
               <Link to="/admin" className="text-xs text-gray-500 hover:text-white">Admin Login</Link>
               <Link to="/shop" className="text-xs text-gray-500 hover:text-white">Rentals</Link>
            </div>
          </div>
        </div>
        <div className="bg-black py-4 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Bullseye Entertainment ZM. All rights reserved.
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a 
        href={getWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl z-[90] transition-transform transform hover:scale-110 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default Layout;