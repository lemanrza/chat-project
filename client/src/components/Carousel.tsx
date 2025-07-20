import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slide from "./Slide";
import { FaBolt, FaUsers, FaShieldAlt } from "react-icons/fa";

const slides = [
    {
        icon: <FaBolt className="text-white text-5xl" />,
        title: "Secure Chat",
        description: "Secure and private conversations.",
        bg: "bg-gradient-to-br from-orange-400 to-red-500"
    },
    {
        icon: <FaUsers className="text-white text-5xl" />,
        title: "Global conection",
        description: "Connect globally, chat locally.",
        bg: "bg-gradient-to-br from-blue-400 to-green-400"
    },
    {
        icon: <FaShieldAlt className="text-white text-5xl" />,
        title: "Privacy First",
        description: "Your data is protected with advanced encryption. Experience peace of mind knowing your.",
        bg: "bg-gradient-to-br from-purple-500 to-pink-400"
    }
];

const Carousel: React.FC = () => {
    const [active, setActive] = useState(0);

    return (
        <>
            <button className="px-6 py-2 font-bold flex uppercase text-lg tracking-widest bg-white rounded-lg shadow text-gray-500 hover:text-green-600 transition-all absolute top-0 right-0 mt-4 mr-4">
                Skip
            </button>
            <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
                <Slide icon={slides[active].icon} title={slides[active].title} description={slides[active].description} bg={slides[active].bg} />
                <div className="flex gap-2 justify-center mt-6">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            className={`w-3 h-3 rounded-full transition-all duration-200 ${active === idx ? "bg-green-500 scale-125" : "bg-gray-300"}`}
                            onClick={() => setActive(idx)}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
                <AnimatePresence>
                    {active === slides.length - 1 && (
                        <motion.button
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="mt-8 px-8 py-3 bg-blue-500 rounded-xl shadow-lg text-white text-xl font-bold uppercase tracking-wide transition-all duration-200 hover:scale-105 hover:bg-gradient-to-r hover:shadow-2xl focus:outline-none"
                        >
                            CONTINUE
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default Carousel;
