import React, { useState } from 'react';
import { FAQS } from '../constants';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen py-20 px-4 animate-fade-in relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-bullseye-red/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
           <HelpCircle className="mx-auto text-bullseye-red mb-4" size={50} />
           <h1 className="text-4xl font-display font-black text-white uppercase tracking-widest">Support <span className="text-bullseye-red">Hub</span></h1>
           <p className="text-gray-500 mt-2">Common queries and tactical information.</p>
        </div>
        
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div key={index} className="glass-panel rounded-lg overflow-hidden transition-all duration-300 hover:border-white/20">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none bg-white/5 hover:bg-white/10 transition-colors"
              >
                <span className="font-display font-bold text-lg text-white tracking-wide">{faq.q}</span>
                {openIndex === index ? (
                  <ChevronUp className="text-bullseye-red" size={24} />
                ) : (
                  <ChevronDown className="text-gray-500" size={24} />
                )}
              </button>
              
              <div className={`transition-all duration-300 overflow-hidden ${openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-8 pt-2">
                  <p className="text-gray-400 leading-relaxed border-l-2 border-bullseye-blue pl-4">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;