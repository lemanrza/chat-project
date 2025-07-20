import React from "react";

interface LanguageOptionProps {
    code: string;
    name: string;
}

const LanguageOption: React.FC<LanguageOptionProps> = ({ code, name }) => (
    <div
        className="w-full flex items-center gap-2 px-13 py-3 rounded-lgshadow-sm text-base font-semibold transition-all duration-200 group  hover:scale-[1.03]"
    >
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-blue-400 text-white font-bold text-sm transition-all duration-200 group-hover:scale-100">
            {code}
        </span>
        <span className="ml-2 transition-colors duration-200 group-hover:text-green-600 group-hover:font-bold">
            {name}
        </span>
    </div>
);

export default LanguageOption;
