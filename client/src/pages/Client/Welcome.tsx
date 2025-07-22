import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Carousel from '../../components/Carousel';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import LanguageSelection from '@/components/LanguageSelector';
import i18n from '../../i18n/config';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [hasSeenIntro, setHasSeenIntro] = useLocalStorage('hasSeenIntro', false);
  const [selectedLanguage, setSelectedLanguage] = useLocalStorage<string | null>('selectedLanguage', null);

  // On mount, always set i18n language from localStorage if exists
  React.useEffect(() => {
    if (selectedLanguage) {
      i18n.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  // If intro already seen, redirect
  React.useEffect(() => {
    if (hasSeenIntro) {
      navigate('/auth/login');
    }
  }, [hasSeenIntro, navigate]);

  // Language selection handler
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  // Intro complete handler
  const handleIntroComplete = () => {
    setHasSeenIntro(true);
    navigate('/auth/login');
  };

  // If no language selected, show language selection
  if (!selectedLanguage) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LanguageSelection onLanguageSelect={handleLanguageSelect} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // If language selected, show intro/carousel
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center"
    >
      <Carousel onComplete={handleIntroComplete} language={selectedLanguage} />
    </motion.div>
  );
};

export default Welcome;
