
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const GalleryShowcase: React.FC = () => {
  const { gallery } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);

  // Auto-rotation (optional, but nice for premium feel)
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const getCardStyles = (index: number) => {
    const diff = (index - currentIndex + gallery.length) % gallery.length;
    
    // Center slide
    if (diff === 0) {
      return {
        zIndex: 30,
        scale: 1,
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
      };
    }
    
    // Right slide
    if (diff === 1 || (currentIndex === gallery.length - 1 && index === 0)) {
      return {
        zIndex: 20,
        scale: 0.85,
        x: '60%',
        opacity: 0.6,
        filter: 'blur(4px)',
      };
    }
    
    // Left slide
    if (diff === gallery.length - 1 || (currentIndex === 0 && index === gallery.length - 1)) {
      return {
        zIndex: 20,
        scale: 0.85,
        x: '-60%',
        opacity: 0.6,
        filter: 'blur(4px)',
      };
    }
    
    // Far slides
    return {
      zIndex: 10,
      scale: 0.7,
      x: diff > gallery.length / 2 ? '-120%' : '120%',
      opacity: 0,
      filter: 'blur(10px)',
    };
  };

  if (!gallery || gallery.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-[#f5f6f8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-black text-gray-900 uppercase tracking-tight"
          >
            Explore <span className="text-bullseye-blue">Moments</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 font-light text-lg tracking-wide"
          >
            A curated collection of experiences
          </motion.p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[450px] md:h-[600px] flex items-center justify-center">
          <div className="relative w-full max-w-[1200px] h-full flex items-center justify-center">
            {gallery.map((item, index) => {
              const styles = getCardStyles(index);
              const isActive = index === currentIndex;

              return (
                <motion.div
                  key={item.id}
                  animate={styles}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    mass: 1,
                  }}
                  className="absolute w-[280px] md:w-[450px] aspect-[3/4] cursor-pointer"
                  onClick={() => isActive ? setSelectedImage(item.url) : setCurrentIndex(index)}
                >
                  <motion.div 
                    className="relative w-full h-full rounded-[24px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.15)] bg-white group"
                    whileHover={isActive ? { y: -8, transition: { duration: 0.3 } } : {}}
                  >
                    <img 
                      src={item.url} 
                      alt={item.caption || 'Gallery Image'} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Overlay for active card */}
                    {isActive && (
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                          <Maximize2 className="text-white w-6 h-6" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-8 mt-12">
          <button 
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white hover:border-gray-900 transition-all active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
          
          <div className="flex gap-2">
            {gallery.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-bullseye-blue' : 'w-2 bg-gray-200'}`} 
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white hover:border-gray-900 transition-all active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              src={selectedImage} 
              alt="Full view" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryShowcase;
