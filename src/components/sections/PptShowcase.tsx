"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const TOTAL_PAGES = 25;

// Generate slide paths: /slides/slide-01.png ... /slides/slide-25.png
const slides = Array.from({ length: TOTAL_PAGES }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return `/slides/slide-${num}.png`;
});

// Show 5 thumbnails at a time in the strip
const THUMB_VISIBLE = 5;

export function PptShowcase() {
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(0);

    const thumbStart = Math.min(
        Math.max(0, currentPage - Math.floor(THUMB_VISIBLE / 2)),
        TOTAL_PAGES - THUMB_VISIBLE
    );

    return (
        <section id="showcase" className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)] via-[var(--color-void)] to-[var(--color-deep-alt)]" />

            {/* Subtle gold accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,169,126,0.1)] to-transparent" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(200,169,126,0.15)] text-[#c8a97e] text-sm mb-6">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{t("showcase.badge")}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-text-primary)] mb-6">
                        {t("showcase.title")}
                    </h2>
                    <p className="text-lg md:text-xl text-[var(--color-text-secondary)]">
                        {t("showcase.subtitle")}
                    </p>
                </motion.div>

                {/* Slides Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="relative">
                        {/* Main slide area */}
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-deep)] shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentPage}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={slides[currentPage]}
                                        alt={`Slide ${currentPage + 1}`}
                                        fill
                                        className="object-contain"
                                        priority={currentPage < 3}
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Left/Right click zones */}
                            <button
                                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                disabled={currentPage === 0}
                                className="absolute left-0 top-0 bottom-0 w-1/5 flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-default"
                            >
                                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80">
                                    <ChevronLeft className="w-5 h-5" />
                                </div>
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(TOTAL_PAGES - 1, currentPage + 1))}
                                disabled={currentPage === TOTAL_PAGES - 1}
                                className="absolute right-0 top-0 bottom-0 w-1/5 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-default"
                            >
                                <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/80">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </button>
                        </div>

                        {/* Navigation bar */}
                        <div className="flex items-center justify-between mt-6">
                            {/* Progress indicator */}
                            <div className="flex items-center gap-1.5">
                                {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i)}
                                        className={`transition-all duration-300 cursor-pointer rounded-full ${i === currentPage
                                                ? "w-6 h-1.5 bg-[#c8a97e]"
                                                : "w-1.5 h-1.5 bg-white/[0.1] hover:bg-white/[0.2]"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Page counter & arrows */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-[var(--color-text-muted)]">
                                    {t("showcase.page")} {currentPage + 1} / {TOTAL_PAGES}
                                </span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                        disabled={currentPage === 0}
                                        className="w-8 h-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-glass-light)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-bright)] disabled:opacity-30 disabled:cursor-default transition-all cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(TOTAL_PAGES - 1, currentPage + 1))}
                                        disabled={currentPage === TOTAL_PAGES - 1}
                                        className="w-8 h-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-glass-light)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:border-[var(--color-border-bright)] disabled:opacity-30 disabled:cursor-default transition-all cursor-pointer"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Thumbnail strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-6 max-w-5xl mx-auto"
                >
                    <div className="flex gap-2 justify-center">
                        {slides.slice(thumbStart, thumbStart + THUMB_VISIBLE).map((src, idx) => {
                            const pageIdx = thumbStart + idx;
                            return (
                                <motion.button
                                    key={pageIdx}
                                    onClick={() => setCurrentPage(pageIdx)}
                                    className={`relative aspect-[16/9] w-[18%] rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${pageIdx === currentPage
                                            ? "border-[rgba(200,169,126,0.5)] shadow-[0_0_16px_rgba(200,169,126,0.15)]"
                                            : "border-white/[0.04] hover:border-white/[0.1]"
                                        }`}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Image
                                        src={src}
                                        alt={`Thumbnail ${pageIdx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="160px"
                                    />
                                    {pageIdx === currentPage && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c8a97e] to-[#dfc9a8]" />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
