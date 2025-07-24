import React, { useState } from 'react';

interface FormInputProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    showPasswordToggle?: boolean;
    className?: string;
}

function FormInput({
    label,
    name,
    type = "text",
    value,
    onChange,
    onBlur,
    placeholder,
    showPasswordToggle = false,
    className = ""
}: FormInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

    return (
        <div className={className}>
            <label className="text-sm font-medium text-[#222]">{label}</label>
            <div className="relative">
                <input
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    className="mt-1 border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#00B878] pr-10"
                />
                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-4 text-[#00B878] cursor-pointer"
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M6.53 6.53C4.06 8.36 2.25 12 2.25 12s3.75 7.5 9.75 7.5c1.61 0 3.09-.22 4.41-.61M17.47 17.47C19.94 15.64 21.75 12 21.75 12c-.653-1.306-1.86-3.342-3.72-5.06" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export default FormInput;