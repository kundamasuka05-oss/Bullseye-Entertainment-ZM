import React from 'react';
import { Product } from '../types';
import { Eye, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  return (
    <div className="group relative bg-bullseye-surface rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-bullseye-red/50 hover:shadow-neon-red hover:-translate-y-2 flex flex-col h-full">
      
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-t from-bullseye-surface to-transparent opacity-60 z-10"></div>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
        />
        
        {/* Availability Badge */}
        {!product.available && (
          <div className="absolute inset-0 z-20 bg-black/70 backdrop-blur-sm flex items-center justify-center border-2 border-red-500 m-2 rounded-lg">
            <span className="text-red-500 font-display font-bold text-xl tracking-widest uppercase animate-pulse">Offline</span>
          </div>
        )}

        {/* Category Tag */}
        <div className="absolute top-3 right-3 z-20">
           <span className="bg-black/60 backdrop-blur border border-bullseye-blue/30 text-bullseye-blue text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
             {product.category}
           </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between relative z-20">
        <div>
          <h3 className="font-display font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-bullseye-red transition-colors">{product.name}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 h-10 mb-4 font-light">{product.description}</p>
        </div>
        
        <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
          <div className="text-white font-display font-bold text-xl">
            <span className="text-bullseye-red text-sm mr-1">ZMW</span>{product.price}
          </div>
          
          <button 
            onClick={() => onQuickView(product)}
            className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
          >
            <Eye size={14} />
            <span>View Specs</span>
          </button>
        </div>
      </div>

      {/* Hover Line Animation */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-bullseye-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  );
};

export default ProductCard;