import React from "react";
import { motion } from "framer-motion";
import LetterByLetterText from "@/components/LetterByLetterText";
interface SlideProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bg: string;
  isTransitioning: boolean;
  onTextComplete?: () => void;
  onTextDeleted?: () => void;
}

const Slide: React.FC<SlideProps> = ({ 
  icon, 
  title, 
  description, 
  bg, 
  isTransitioning, 
  onTextComplete, 
  onTextDeleted 
}) => {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
      {/* App Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`${bg} rounded-3xl p-8 mb-12 shadow-2xl`}
      >
        {icon}
      </motion.div>

      {/* Title */}
      <div className="mb-6">
        <LetterByLetterText
          key={title}
          text={title}
          className="text-5xl font-bold text-gray-800 mb-4"
          delay={0.5}
          isDeleting={isTransitioning}
        />
      </div>

      {/* Description */}
      <div>
        <LetterByLetterText
          text={description}
          className="text-xl text-gray-600 leading-relaxed max-w-lg"
          delay={1.5}
          isDeleting={isTransitioning}
          onComplete={onTextComplete}
          onDeleted={onTextDeleted}
        />
      </div>
    </div>
  );
};

export default Slide;