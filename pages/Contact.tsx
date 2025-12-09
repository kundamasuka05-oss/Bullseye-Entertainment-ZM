import React from 'react';
import BookingForm from '../components/BookingForm';
import { COMPANY_INFO } from '../constants';
import { Phone, MapPin, Mail, Clock, Radio } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-panel p-8 rounded-2xl border-l-4 border-bullseye-blue">
              <div className="flex items-center space-x-2 mb-4">
                <Radio className="text-bullseye-red animate-pulse" />
                <h1 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Comms Channel</h1>
              </div>
              <p className="text-gray-400 text-sm">Fill out the secure form to initiate a booking request. We will ping you back instantly.</p>
            </div>

            <div className="space-y-4">
              <div className="glass-panel p-6 rounded-xl flex items-start group hover:border-bullseye-red/50 transition-colors">
                <MapPin className="text-bullseye-blue mt-1 mr-4 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wide text-xs mb-1">HQ Location</h3>
                  <p className="text-gray-400 text-sm">{COMPANY_INFO.location}</p>
                </div>
              </div>
              
              <div className="glass-panel p-6 rounded-xl flex items-start group hover:border-bullseye-red/50 transition-colors">
                <Phone className="text-bullseye-blue mt-1 mr-4 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wide text-xs mb-1">Voice Line</h3>
                  {COMPANY_INFO.phones.map(phone => (
                    <a key={phone} href={`tel:${phone}`} className="block text-gray-400 hover:text-white transition-colors text-sm">{phone}</a>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-xl flex items-start group hover:border-bullseye-red/50 transition-colors">
                <Mail className="text-bullseye-blue mt-1 mr-4 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wide text-xs mb-1">Electronic Mail</h3>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-gray-400 hover:text-white transition-colors text-sm">{COMPANY_INFO.email}</a>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-xl flex items-start group hover:border-bullseye-red/50 transition-colors">
                <Clock className="text-bullseye-blue mt-1 mr-4 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-white uppercase tracking-wide text-xs mb-1">Operations Window</h3>
                  <p className="text-gray-400 text-sm">{COMPANY_INFO.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;