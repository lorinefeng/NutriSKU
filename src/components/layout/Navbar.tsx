"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GlowButton } from "@/components/ui/GlowButton";
import { useTranslation } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { locale, toggleLocale, t } = useTranslation();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrolled
                    ? "py-3 bg-[var(--color-nav-bg)] backdrop-blur-xl border-b border-[var(--color-border)] shadow-[0_4px_30px_rgba(0,0,0,0.18)]"
                    : "py-5 bg-transparent border-b border-transparent"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="rounded-xl px-2.5 py-1 bg-[rgba(12,12,16,0.9)] border border-[rgba(200,169,126,0.28)] shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                        <Image
                            src="/logo.svg"
                            alt="NutriSKU"
                            width={176}
                            height={48}
                            className="h-8 md:h-9 w-auto"
                            priority
                        />
                    </div>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-text-secondary)]">
                    <Link href="#features" className="hover-gold-border relative pb-1 hover:text-[var(--color-text-primary)] transition-colors">
                        {t("nav.features")}
                    </Link>
                    <Link href="#how-it-works" className="hover-gold-border relative pb-1 hover:text-[var(--color-text-primary)] transition-colors">
                        {t("nav.howItWorks")}
                    </Link>
                    <Link href="#demo" className="hover-gold-border relative pb-1 hover:text-[var(--color-text-primary)] transition-colors">
                        {t("nav.demo")}
                    </Link>
                    <Link href="#showcase" className="hover-gold-border relative pb-1 hover:text-[var(--color-text-primary)] transition-colors">
                        {t("nav.showcase")}
                    </Link>
                </div>

                {/* Right: Theme + Lang + CTA */}
                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        aria-label={`${t("nav.theme")} ${theme === "dark" ? t("nav.themeLight") : t("nav.themeDark")}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(200,169,126,0.2)] text-xs font-medium text-[#c8a97e] hover:bg-[rgba(200,169,126,0.08)] transition-all cursor-pointer"
                    >
                        {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                        <span className="hidden md:inline">{theme === "dark" ? t("nav.themeLight") : t("nav.themeDark")}</span>
                    </button>

                    {/* Language Toggle */}
                    <button
                        onClick={toggleLocale}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[rgba(200,169,126,0.2)] text-xs font-medium text-[#c8a97e] hover:bg-[rgba(200,169,126,0.08)] transition-all cursor-pointer"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        {locale === "zh" ? "EN" : "中"}
                    </button>
                    <Link
                        href="/login"
                        className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hidden md:block transition-colors"
                    >
                        {t("nav.login")}
                    </Link>
                    <GlowButton variant="gold" size="sm">
                        {t("nav.getStarted")}
                    </GlowButton>
                </div>
            </div>
        </nav>
    );
}
