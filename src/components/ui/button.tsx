import { cn } from "@/lib/utils";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

// Define the interface for the component props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    children: ReactNode;
}

// Define the CommonButton component
const Button: React.FC<ButtonProps> = ({ className, children, ...otherProps }) => {
    return (
        <button
            className={cn(
                "h-[36px]  flex justify-center items-center bg-primary rounded-[8px] w-full text-white text-[14px] font-medium mt-[24px]",
                className
            )}
            {...otherProps}
        >
            {children}
        </button>
    );
};

export default Button;
