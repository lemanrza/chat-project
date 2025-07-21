import React from 'react';
import Carousel from '@/components/Carousel';

interface HomeProps {
  selectedLanguage: string;
  onIntroComplete: () => void;
}

const Home: React.FC<HomeProps> = ({ selectedLanguage, onIntroComplete }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Carousel onComplete={onIntroComplete} language={selectedLanguage} />
    </div>
  );
};

export default Home;
