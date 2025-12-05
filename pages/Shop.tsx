import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import ProductCard from '../components/ProductCard';
import { Product, SortOption } from '../types';
import { Search, X, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Shop: React.FC = () => {
  const { products } = useStore();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // For Quick View Modal

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

  const handleBookItem = (product: Product) => {
    navigate('/contact');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Rentals & Equipment</h1>
        
        {/* Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat 
                  ? 'bg-bullseye-black text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-full text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-bullseye-red border-gray-300"
              />
            </div>
            
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-bullseye-red"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onQuickView={handleQuickView}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              No items found matching your criteria.
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-fade-in">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 bg-white/50 rounded-full p-1"
            >
              <X size={24} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-full bg-gray-200">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <span className="text-bullseye-red font-bold text-sm tracking-wide mb-2 uppercase">{selectedProduct.category}</span>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>
                <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-2xl font-bold text-gray-900">ZMW {selectedProduct.price}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedProduct.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedProduct.available ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                <button 
                  onClick={() => handleBookItem(selectedProduct)}
                  className="w-full bg-bullseye-red text-white py-3 rounded-full font-bold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>Book This Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
