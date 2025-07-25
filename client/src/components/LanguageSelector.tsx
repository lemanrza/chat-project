import chatlogo from "../assets/images/chatlogo.png";
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';  // Import useTranslation hook
import LanguageOption from './LanguageOption';

interface LanguageSelectionProps {
    onLanguageSelect: (language: string) => void;
}

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'az', name: 'Azərbaycan', flag: '🇦🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
];

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onLanguageSelect }) => {
    const { i18n } = useTranslation();  // Use t function from useTranslation hook

    const handleLanguageSelect = (languageCode: string) => {
        i18n.changeLanguage(languageCode);  // Change language using i18n
        onLanguageSelect(languageCode);  // Call parent callback if needed
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl p-8 max-w-md w-full transition-colors duration-300"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="flex items-center justify-center mb-6"
                >
                    <h1 className="text-3xl gap-2 font-bold text-center flex mx-auto items-center">
                        <img src={chatlogo} alt="chat logo" className="w-10" />
                        <span className="text-neutral-700 dark:text-neutral-200">Chat</span>
                        <span className="text-green-500">Wave</span>
                    </h1>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-2xl font-bold text-center text-neutral-800 dark:text-neutral-100 mb-2"
                >
                    Choose Language
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="text-neutral-600 dark:text-neutral-400 text-center mb-8"
                >
                    Select Language Prompt
                </motion.p>

                <div className="space-y-3">
                    {languages.map((language, index) => (
                        <motion.button
                            key={language.code}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleLanguageSelect(language.code)}
                            className="w-full bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 border border-gray-200 dark:border-neutral-700 hover:border-green-400 rounded-2xl p-4 flex items-center justify-between transition-all duration-200 group"
                        >
                            <LanguageOption code={language.code} name={language.name} />
                            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-neutral-400 group-hover:text-green-500 transition-colors" />
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default LanguageSelection;
