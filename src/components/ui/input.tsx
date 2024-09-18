import React, { ChangeEvent, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface InputProps {
    label?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    type?: string;
    disabled?: boolean;
    showPasswordToggle?: boolean; // New prop for password toggle
}

const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    value,
    onChange,
    className,
    type,
    disabled,
    showPasswordToggle = false, // Default is false unless specified
}) => {
    const [isPasswordVisible, setPasswordVisibility] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisibility(!isPasswordVisible);
    };

    return (
        <div className={`${className} relative`}>
            {label && <p className="text-inputLabel font-medium text-[14px]">{label}</p>}
            <input
                type={showPasswordToggle && isPasswordVisible ? "text" : type || "text"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full h-[36px] rounded-[8px] bg-white shadow-sm border border-gray-100 text-[14px] px-[12px] outline-none"
            />
            {/* Conditionally render the eye icon for password fields */}
            {showPasswordToggle && (
                <div
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-[70%] transform -translate-y-[50%] cursor-pointer"
                >
                    {isPasswordVisible ? <FiEyeOff className="text-[#9CA3AF]" /> : <FiEye className="text-[#9CA3AF]" />}
                </div>
            )}
        </div>
    );
};

export default Input;
