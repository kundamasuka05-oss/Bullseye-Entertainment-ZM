import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Booking } from '../types';
import { Calendar, Send } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Since we can't use uuid lib, we'll write a simple generator or assume uuid availability. 
// Note: For this environment without npm install, I'll use a simple random string.

const generateId = () => Math.random().toString(36).substr(2, 9);

interface BookingFormProps {
  preselectedItems?: Product[];
}

const BookingForm: React.FC<BookingFormProps> = ({ preselectedItems = [] }) => {
  const { addBooking, products } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: '',
    selectedItems: preselectedItems.map(p => p.id)
  });
  const [submitted, setSubmitted] = useState(false);

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
    
    const newBooking: Booking = {
      id: generateId(),
      customerName: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      message: formData.message,
      items: formData.selectedItems,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    addBooking(newBooking);
    setSubmitted(true);
    
    // Simulate email/whatsapp trigger logic here
    // In a real app, this would hit an API endpoint
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 p-8 rounded-lg text-center animate-fade-in">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <Send className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Request Received!</h3>
        <p className="mt-2 text-gray-600">Thanks {formData.name}, we have received your booking request for {formData.date}. We will contact you shortly via WhatsApp or Email to confirm availability.</p>
        <button onClick={() => setSubmitted(false)} className="mt-6 text-bullseye-red font-medium hover:underline">Send another request</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Book Your Event</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input required type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bullseye-red focus:ring-bullseye-red sm:text-sm p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number (WhatsApp)</label>
          <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bullseye-red focus:ring-bullseye-red sm:text-sm p-2 border" placeholder="+260..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bullseye-red focus:ring-bullseye-red sm:text-sm p-2 border" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Date</label>
          <input required type="date" name="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bullseye-red focus:ring-bullseye-red sm:text-sm p-2 border" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Items Needed</label>
        <div className="max-h-48 overflow-y-auto border rounded-md p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {products.map(product => (
            <label key={product.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.selectedItems.includes(product.id)}
                onChange={() => handleItemToggle(product.id)}
                className="rounded text-bullseye-red focus:ring-bullseye-red"
              />
              <span className="text-sm text-gray-700">{product.name} (ZMW {product.price})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Additional Message</label>
        <textarea name="message" rows={3} value={formData.message} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-bullseye-red focus:ring-bullseye-red sm:text-sm p-2 border" placeholder="Tell us more about your event location or specific needs..."></textarea>
      </div>

      <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-bullseye-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bullseye-red transition-all transform hover:scale-[1.02]">
        Submit Booking Request
      </button>
    </form>
  );
};

export default BookingForm;
