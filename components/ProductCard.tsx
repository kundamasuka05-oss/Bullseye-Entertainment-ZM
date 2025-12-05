import React from 'react';
import { Product } from '../types';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold rounded">UNAVAILABLE</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
           <span className="bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded-full shadow-sm text-gray-800">
             {product.category}
           </span>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{product.name}</h3>
          <p className="text-gray-500 text-sm mt-1 line-clamp-2 h-10">{product.description}</p>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-bullseye-red font-bold text-lg">ZMW {product.price}</span>
          <button 
            onClick={() => onQuickView(product)}
            className="flex items-center space-x-1 text-gray-600 hover:text-bullseye-red transition-colors text-sm font-medium"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
