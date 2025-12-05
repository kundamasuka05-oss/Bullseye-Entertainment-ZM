import React from 'react';
import BookingForm from '../components/BookingForm';
import { COMPANY_INFO } from '../constants';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h1>
              <p className="text-gray-600">Fill out the form to request a booking. We'll check availability and confirm your reservation instantly via WhatsApp.</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="text-bullseye-red mt-1 mr-3" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900">Visit Us</h3>
                  <p className="text-gray-600">{COMPANY_INFO.location}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="text-bullseye-red mt-1 mr-3" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900">Call Us</h3>
                  {COMPANY_INFO.phones.map(phone => (
                    <a key={phone} href={`tel:${phone}`} className="block text-gray-600 hover:text-bullseye-red">{phone}</a>
                  ))}
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="text-bullseye-red mt-1 mr-3" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="text-gray-600 hover:text-bullseye-red">{COMPANY_INFO.email}</a>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="text-bullseye-red mt-1 mr-3" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900">Hours</h3>
                  <p className="text-gray-600">{COMPANY_INFO.hours}</p>
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
