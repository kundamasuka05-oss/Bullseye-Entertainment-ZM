import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Smile, Heart } from 'lucide-react';
import EditableText from '../components/EditableText';
import { useStore } from '../context/StoreContext';
import { INITIAL_CONTENT } from '../constants';

const About: React.FC = () => {
  const { gallery } = useStore();

  return (
    <div className="animate-fade-in">
      <div className="bg-bullseye-black text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">About Bullseye Entertainment ZM</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">We are more than just a rental company; we are creators of joy and memorable experiences in Zambia.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="md:w-1/2">
             <div className="grid grid-cols-2 gap-2">
               {gallery.slice(0, 4).map((item) => (
                 <img key={item.id} src={item.url} alt="Gallery" className="rounded-lg shadow object-cover h-32 w-full" />
               ))}
             </div>
          </div>
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <EditableText 
              contentKey="aboutStory"
              defaultText={INITIAL_CONTENT.aboutStory}
              tag="p"
              className="text-gray-600 leading-relaxed mb-4"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-gray-50 p-6 rounded-xl text-center">
             <Target className="mx-auto text-bullseye-red mb-4" size={40} />
             <h3 className="font-bold text-lg mb-2">Our Mission</h3>
             <EditableText 
               contentKey="aboutMission"
               defaultText={INITIAL_CONTENT.aboutMission}
               className="text-sm text-gray-600"
             />
           </div>
           <div className="bg-gray-50 p-6 rounded-xl text-center">
             <Smile className="mx-auto text-bullseye-red mb-4" size={40} />
             <h3 className="font-bold text-lg mb-2">Our Vibe</h3>
             <EditableText 
               contentKey="aboutVibe"
               defaultText={INITIAL_CONTENT.aboutVibe}
               className="text-sm text-gray-600"
             />
           </div>
           <div className="bg-gray-50 p-6 rounded-xl text-center">
             <Heart className="mx-auto text-bullseye-red mb-4" size={40} />
             <h3 className="font-bold text-lg mb-2">Our Promise</h3>
             <EditableText 
               contentKey="aboutPromise"
               defaultText={INITIAL_CONTENT.aboutPromise}
               className="text-sm text-gray-600"
             />
           </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to plan?</h2>
          <div className="flex justify-center gap-4">
             <Link to="/shop" className="px-6 py-3 bg-bullseye-red text-white font-bold rounded-full hover:bg-red-700 transition-colors">Browse Items</Link>
             <Link to="/contact" className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-100 transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;