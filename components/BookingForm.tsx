import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { COMPANY_INFO } from '../constants';

interface BookingFormProps {
  preselectedItems?: Product[];
}

const BookingForm: React.FC<BookingFormProps> = ({ preselectedItems = [] }) => {
  const { products } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: '',
    selectedItems: preselectedItems.map(p => p.id)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemToggle = (itemId: string) => {
    const current = formData.selectedItems;
    if (current.includes(itemId)) {
      setFormData({ ...formData, selectedItems: current.filter(id => id !== itemId) });
    } else {
      setFormData({ ...formData, selectedItems: [...current, itemId] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get product names for the selected items
    const selectedNames = formData.selectedItems
      .map(id => products.find(p => p.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    // Construct the formatted WhatsApp message
    const message = `*📅 BOOKING REQUEST*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Email:* ${formData.email}\n` +
      `*Date:* ${formData.date}\n\n` +
      `*Loadout Items:*\n${selectedNames || 'None'}\n\n` +
      `*Additional Intel:*\n${formData.message || 'None'}`;

    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp in a new tab to avoid iframe/X-Frame-Options blocking
    const url = `https://wa.me/${COMPANY_INFO.whatsappMain}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };


  const inputClasses = "mt-1 block w-full bg-black/50 border border-white/10 rounded-lg shadow-sm focus:border-bullseye-red focus:ring-1 focus:ring-bullseye-red text-white placeholder-gray-600 px-4 py-3 transition-colors";
  const labelClasses = "block text-xs font-bold text-bullseye-blue uppercase tracking-wider mb-1";

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl border-t-4 border-t-bullseye-red shadow-2xl relative overflow-hidden">
      
      {/* Decorative Grid */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-grid opacity-10 pointer-events-none"></div>

      <h3 className="text-3xl font-display font-black text-white mb-8 border-b border-white/10 pb-4">Initiate Booking</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Operator Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="Enter full name" />
          </div>
          <div>
            <label className={labelClasses}>Comms (WhatsApp)</label>
            <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} placeholder="+260..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClasses} placeholder="email@example.com" />
          </div>
          <div>
            <label className={labelClasses}>Mission Date</label>
            <input required type="date" name="date" value={formData.date} onChange={handleChange} className={inputClasses} />
          </div>
        </div>

        <div>
          <label className={labelClasses}>Select Loadout</label>
          <div className="max-h-48 overflow-y-auto border border-white/10 bg-black/30 rounded-lg p-2 grid grid-cols-1 sm:grid-cols-2 gap-2 custom-scrollbar">
            {products.map(product => (
              <label key={product.id} className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-colors border ${formData.selectedItems.includes(product.id) ? 'bg-bullseye-red/10 border-bullseye-red/50' : 'hover:bg-white/5 border-transparent'}`}>
                <input 
                  type="checkbox" 
                  checked={formData.selectedItems.includes(product.id)}
                  onChange={() => handleItemToggle(product.id)}
                  className="rounded text-bullseye-red focus:ring-bullseye-red bg-gray-800 border-gray-600"
                />
                <span className={`text-sm ${formData.selectedItems.includes(product.id) ? 'text-white font-bold' : 'text-gray-400'}`}>
                  {product.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClasses}>Additional Intel</label>
          <textarea name="message" rows={3} value={formData.message} onChange={handleChange} className={inputClasses} placeholder="Location details, special requests..."></textarea>
        </div>

        <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded bg-bullseye-red text-white font-black uppercase tracking-widest hover:bg-red-600 hover:shadow-neon-red transition-all duration-300 transform hover:-translate-y-1">
          Confirm & Open WhatsApp
        </button>
      </div>
    </form>
  );
};

export default BookingForm;