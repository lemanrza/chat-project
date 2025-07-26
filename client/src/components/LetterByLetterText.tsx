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
    setIsAnimating(false);
    setIsDeletingText(false);
  }, [text]);

  // Handle deletion trigger
  useEffect(() => {
    if (isDeleting && displayedText.length > 0 && !isDeletingText) {
      setIsDeletingText(true);
    }
  }, [isDeleting, displayedText.length, isDeletingText]);

  // Handle typing
  useEffect(() => {
    if (!isAnimating || isDeletingText) return;

    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      } else if (currentIndex === text.length && onComplete) {
        onComplete();
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, isAnimating, isDeletingText, onComplete]);

  // Handle deletion
  useEffect(() => {
    if (!isDeletingText) return;

    const timer = setTimeout(() => {
      setDisplayedText((prev) => prev.slice(0, -1));
    }, speed);

    if (displayedText.length === 0 && onDeleted) {
      onDeleted();
      setIsDeletingText(false);
      setIsAnimating(false);  // Ensure animating is reset after deletion
    }

    return () => clearTimeout(timer);
  }, [isDeletingText, displayedText, speed, onDeleted]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

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
