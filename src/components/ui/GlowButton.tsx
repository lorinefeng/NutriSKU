"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "gold" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

const GlowButton = forwardRef<HTMLButtonElement, GlowButtonProps>(
    ({ className, variant = "gold", size = "md", children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-400 rounded-full cursor-pointer",
                    // Size
                    size === "sm" && "px-5 py-2 text-sm",
                    size === "md" && "px-7 py-3 text-sm",
                    size === "lg" && "px-9 py-4 text-base",
                    // Variant
                    variant === "gold" &&
                    "bg-gradient-to-r from-[#c8a97e] to-[#b8956a] text-[#0c0c10] font-semibold hover:from-[#dfc9a8] hover:to-[#c8a97e] hover:shadow-[0_0_40px_rgba(200,169,126,0.25)]",
                    variant === "outline" &&
                    "border border-[rgba(200,169,126,0.3)] text-[#c8a97e] hover:bg-[rgba(200,169,126,0.08)] hover:border-[rgba(200,169,126,0.5)]",
                    variant === "ghost" &&
                    "text-[#9a9498] hover:text-[#f0ece6] hover:bg-white/5",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

GlowButton.displayName = "GlowButton";

export { GlowButton };
