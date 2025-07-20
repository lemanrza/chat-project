import React from "react";
import { useNavigate } from "react-router-dom";
import LanguageOption from "../components/LanguageOption";
import chatlogo from "../assets/images/chatlogo.png";

const languages = [
    { code: "US", name: "English" },
    { code: "AZ", name: "Azərbaycan" },
    { code: "RU", name: "Русский" },
    { code: "TR", name: "Türkçe" },
];

const LanguageSelector: React.FC = () => {
    const navigate = useNavigate();
    const handleSelect = () => {
        navigate("/app");
    };
    return (
        <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-xl flex flex-col gap-6">
            <h1 className="text-3xl gap-2 font-bold text-center flex mx-auto items-center">
                <img src={chatlogo} alt="chat logo" className="w-10" />
                <span className="text-gray-700">Chat</span> <span className="text-green-500">Wave</span>
            </h1>
            <p className="text-center text-gray-500 mb-6 text-lg">Choose your language</p>
            <div className="flex flex-col gap-4">
                {languages.map(lang => (
                    <button key={lang.code} onClick={handleSelect}>
                        <LanguageOption code={lang.code} name={lang.name} />
                    </button>
                ))}
            </div>
            <button className="mt-4 text-gray-400 hover:text-green-500 text-sm transition-all" onClick={handleSelect}>Skip (Continue with English)</button>
        </div>
    );
};

export default LanguageSelector;
