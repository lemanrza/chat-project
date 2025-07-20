import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Carousel from '../../components/Carousel';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import LanguageSelection from '@/components/LanguageSelector';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [hasSeenIntro, setHasSeenIntro] = useLocalStorage('hasSeenIntro', false);
  const [selectedLanguage, setSelectedLanguage] = useLocalStorage<string | null>('selectedLanguage', null);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleIntroComplete = () => {
    setHasSeenIntro(true);
    navigate('/auth/login');
  };

  React.useEffect(() => {
    if (hasSeenIntro) {
      navigate('/auth/login');
    }
  }, [hasSeenIntro, navigate]);

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gray-100 flex items-center justify-center"
    >
      <Carousel onComplete={handleIntroComplete} language={selectedLanguage} />
    </motion.div>
  );
};

export default Welcome;