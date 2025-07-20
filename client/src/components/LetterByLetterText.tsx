import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LetterByLetterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  isDeleting?: boolean;
  onComplete?: () => void;
  onDeleted?: () => void;
}

const LetterByLetterText: React.FC<LetterByLetterTextProps> = ({
  text,
  className = '',
  delay = 0,
  speed = 50,
  isDeleting = false,
  onComplete,
  onDeleted
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDeletingText, setIsDeletingText] = useState(false);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsDeletingText(false);
    if (delay === 0) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [text, delay]);

  // Handle deletion trigger
  useEffect(() => {
    if (isDeleting && displayedText.length > 0) {
      setIsDeletingText(true);
    }
  }, [isDeleting, displayedText.length]);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  useEffect(() => {
    if (isDeletingText && displayedText.length > 0) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1));
      }, 30);

      return () => clearTimeout(timer);
    } else if (isDeletingText && displayedText.length === 0) {
      setIsDeletingText(false);
      if (onDeleted) {
        onDeleted();
      }
      // Restart animation for new text after deletion
      if (delay === 0) {
        setIsAnimating(true);
      } else {
        setIsAnimating(false);
      }
      setCurrentIndex(0);
    }
  }, [isDeletingText, displayedText, onDeleted]);

  useEffect(() => {
    if (!isAnimating || isDeletingText) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, isAnimating, isDeletingText, onComplete]);

  const letters = displayedText.split('').map((letter, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
      className="inline-block"
    >
      {letter === ' ' ? '\u00A0' : letter}
    </motion.span>
  ));

  return (
    <div className={className}>
      <AnimatePresence>
        {letters}
      </AnimatePresence>
      {(isAnimating && !isDeletingText) && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-0.5 h-6 bg-current ml-1"
        />
      )}
    </div>
  );
};

export default LetterByLetterText;