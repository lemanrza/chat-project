import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Slide from "./Slide";
import { MessageCircle, Users, Shield } from "lucide-react";

const slides = [
  {
    icon: <MessageCircle className="text-white text-6xl" />,
    title: "Chat Wave",
    description: "Real-time messaging with friends",
    bg: "bg-gradient-to-br from-blue-500 to-purple-600"
  },
  {
    icon: <Users className="text-white text-6xl" />,
    title: "Connect Instantly",
    description: "Join conversations and meet new people",
    bg: "bg-gradient-to-br from-green-500 to-blue-500"
  },
  {
    icon: <Shield className="text-white text-6xl" />,
    title: "Secure & Private",
    description: "Your conversations are protected and encrypted",
    bg: "bg-gradient-to-br from-purple-500 to-pink-500"
  }
];

interface CarouselProps {
  onComplete: () => void;
  language: string;
}

const Carousel: React.FC<CarouselProps> = ({ onComplete }) => {
  const [active, setActive] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const handleSkip = () => {
    onComplete();
    navigate('/auth/login');
  };

  const handleContinue = () => {
    onComplete();
    navigate('/auth/login');
  };

  const nextSlide = async () => {
    if (active < slides.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActive(active + 1);
        setIsTransitioning(false);
      }, 800);
    }
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleSkip}
        className="absolute top-8 right-8 px-6 py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors z-10"
      >
        Skip
      </motion.button>

      <div className="flex flex-col items-center justify-center flex-1 px-6">
        <AnimatePresence mode="wait">
          <Slide
            key={active}
            icon={slides[active].icon}
            title={slides[active].title}
            description={slides[active].description}
            bg={slides[active].bg}
            isTransitioning={isTransitioning}
            onTextComplete={() => {
              if (active < slides.length - 1) {
                setTimeout(() => {
                  nextSlide();
                }, 2000);
              }
            }}
            onTextDeleted={() => {
            }}
          />
        </AnimatePresence>
      </div>

      <div className="pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-3 justify-center mt-8"
        >
          {slides.map((_, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                active === idx 
                  ? "bg-green-500 scale-125" 
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setActive(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </motion.div>
        <AnimatePresence>
          {active === slides.length - 1 && (
            <motion.button
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinue}
              className="mt-8 px-12 py-4 bg-green-500 hover:bg-green-600 rounded-2xl shadow-xl text-white text-lg font-semibold transition-all duration-300 hover:shadow-2xl focus:outline-none"
            >
              Continue
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

};

export default Carousel;