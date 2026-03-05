import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { Product, SortOption } from '../types';
import { Search, X, MessageCircle, Filter } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const Shop: React.FC = () => {
  const { products } = useStore();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories = ['All', 'Games', 'Inflatables', 'Equipment', 'Team Building'];

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => 
      (selectedCategory === 'All' || p.category === selectedCategory) &&
      (p.name.toLowerCase().includes(search.toLowerCase()))
    );

    if (sortOption === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortOption === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortOption === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, search, selectedCategory, sortOption]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleWhatsAppBook = (product: Product) => {
    const message = `Hello, I want to book ${product.name} for ZMW ${product.price}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${COMPANY_INFO.whatsappMain}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in relative">
      <div className="absolute top-20 left-10 w-64 h-64 bg-bullseye-purple/10 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
           <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4 uppercase tracking-tighter">Inventory <span className="text-bullseye-blue">Loadout</span></h1>
           <p className="text-gray-400">Select your gear for the upcoming mission.</p>
        </div>
        
        {/* Controls */}
        <div className="glass-panel p-6 rounded-2xl mb-12 flex flex-col xl:flex-row gap-6 justify-between items-center">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded border text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  selectedCategory === cat 
                  ? 'bg-bullseye-red/20 border-bullseye-red text-white shadow-neon-red' 
                  : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="SEARCH DATABASE..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-4 py-3 bg-bullseye-base border border-white/10 rounded text-white text-sm w-full sm:w-64 focus:outline-none focus:border-bullseye-blue focus:shadow-neon-blue transition-all"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="pl-12 pr-8 py-3 bg-bullseye-base border border-white/10 rounded text-white text-sm focus:outline-none focus:border-bullseye-blue appearance-none cursor-pointer w-full sm:w-auto"
              >
                <option value="name-asc">NAME (A-Z)</option>
                <option value="price-asc">PRICE (LOW-HIGH)</option>
                <option value="price-desc">PRICE (HIGH-LOW)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={handleQuickView}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-32 border border-dashed border-white/10 rounded-2xl">
              <p className="text-gray-500 font-mono">NO ITEMS MATCH SEARCH QUERY.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-bullseye-surface border border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative animate-fade-in flex flex-col md:flex-row">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white bg-black/50 rounded-full p-2 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-black relative">
               <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover opacity-90" />
               <div className="absolute inset-0 bg-gradient-to-t from-bullseye-surface to-transparent"></div>
            </div>
            
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-2">
                 <span className="text-bullseye-blue text-xs font-bold uppercase tracking-widest border border-bullseye-blue/30 px-2 py-1 rounded">
                    {selectedProduct.category}
                 </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4 leading-none">{selectedProduct.name}</h2>
              <p className="text-gray-400 mb-8 leading-relaxed font-light border-l-2 border-white/10 pl-4">
                {selectedProduct.description}
              </p>
              
              <div className="flex items-center justify-between mb-8 p-4 bg-white/5 rounded-lg border border-white/5">
                <div>
                   <span className="text-xs text-gray-500 block uppercase tracking-wider">Daily Rate</span>
                   <span className="text-3xl font-display font-bold text-bullseye-red">ZMW {selectedProduct.price}</span>
                </div>
                <div className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center ${selectedProduct.available ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${selectedProduct.available ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                  {selectedProduct.available ? 'Online' : 'Offline'}
                </div>
              </div>

              <button 
                onClick={() => handleWhatsAppBook(selectedProduct)}
                disabled={!selectedProduct.available}
                className={`w-full py-4 rounded font-bold uppercase tracking-widest hover:bg-green-500 transition-all shadow-lg flex items-center justify-center space-x-3 ${
                  selectedProduct.available ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <MessageCircle size={20} />
                <span>Book via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Shop;