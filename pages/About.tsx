import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Smile, Heart, Crosshair } from 'lucide-react';
import EditableText from '../components/EditableText';
import { useStore } from '../context/StoreContext';
import { INITIAL_CONTENT } from '../constants';

const About: React.FC = () => {
  const { siteContent } = useStore();

  const aboutImages = [
    siteContent.aboutImage1 || INITIAL_CONTENT.aboutImage1,
    siteContent.aboutImage2 || INITIAL_CONTENT.aboutImage2,
    siteContent.aboutImage3 || INITIAL_CONTENT.aboutImage3,
    siteContent.aboutImage4 || INITIAL_CONTENT.aboutImage4,
  ];

  return (
    <div className="animate-fade-in text-gray-300">
      
      {/* Header */}
      <div className="relative py-24 text-center overflow-hidden">
         <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-full bg-bullseye-blue/5 blur-[100px] pointer-events-none"></div>
         <h1 className="relative z-10 text-5xl md:text-6xl font-display font-black text-white mb-6 uppercase tracking-tight text-glow">
           The <span className="text-bullseye-blue">Origin</span> Story
         </h1>
         <p className="relative z-10 text-xl text-gray-400 max-w-2xl mx-auto font-light">
           Leveling up entertainment standards in Zambia since Day 1.
         </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20 space-y-24">
        
        {/* Story Section */}
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 grid grid-cols-2 gap-4">
             {aboutImages.map((url, i) => (
               <div key={i} className={`rounded-xl overflow-hidden border border-white/10 shadow-lg ${i % 2 === 0 ? 'translate-y-4' : '-translate-y-4'}`}>
                 <img src={url} alt={`Origin Story ${i + 1}`} className="object-cover h-40 w-full opacity-80 hover:opacity-100 transition-opacity" />
               </div>
             ))}
          </div>
          <div className="md:w-1/2">
            <div className="flex items-center mb-4">
               <Crosshair className="text-bullseye-red mr-2" />
               <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">Mission Brief</h2>
            </div>
            <EditableText 
              contentKey="aboutStory"
              defaultText={INITIAL_CONTENT.aboutStory}
              tag="p"
              className="text-gray-400 leading-relaxed mb-6 text-lg"
            />
            <div className="h-1 w-20 bg-gradient-to-r from-bullseye-red to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="glass-panel p-8 rounded-2xl text-center group hover:bg-white/5 transition-colors relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-bullseye-blue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
             <Target className="mx-auto text-bullseye-blue mb-6 group-hover:scale-110 transition-transform" size={48} />
             <h3 className="font-display font-bold text-xl text-white mb-4">Objective</h3>
             <EditableText 
               contentKey="aboutMission"
               defaultText={INITIAL_CONTENT.aboutMission}
               className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors"
             />
           </div>
           
           <div className="glass-panel p-8 rounded-2xl text-center group hover:bg-white/5 transition-colors relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-bullseye-red transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
             <Smile className="mx-auto text-bullseye-red mb-6 group-hover:scale-110 transition-transform" size={48} />
             <h3 className="font-display font-bold text-xl text-white mb-4">Vibe</h3>
             <EditableText 
               contentKey="aboutVibe"
               defaultText={INITIAL_CONTENT.aboutVibe}
               className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors"
             />
           </div>
           
           <div className="glass-panel p-8 rounded-2xl text-center group hover:bg-white/5 transition-colors relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-bullseye-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
             <Heart className="mx-auto text-bullseye-purple mb-6 group-hover:scale-110 transition-transform" size={48} />
             <h3 className="font-display font-bold text-xl text-white mb-4">Promise</h3>
             <EditableText 
               contentKey="aboutPromise"
               defaultText={INITIAL_CONTENT.aboutPromise}
               className="text-sm text-gray-500 group-hover:text-gray-300 transition-colors"
             />
           </div>
        </div>

        <div className="text-center bg-gradient-to-r from-bullseye-surface to-black p-12 rounded-3xl border border-white/5">
          <h2 className="text-3xl font-display font-bold text-white mb-8">Ready to deploy?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <Link to="/shop" className="px-8 py-3 bg-bullseye-blue text-white font-bold uppercase tracking-wider rounded hover:bg-blue-600 transition-colors shadow-neon-blue">Browse Inventory</Link>
             <Link to="/contact" className="px-8 py-3 border border-white/20 text-white font-bold uppercase tracking-wider rounded hover:bg-white/10 transition-colors">Contact Base</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;