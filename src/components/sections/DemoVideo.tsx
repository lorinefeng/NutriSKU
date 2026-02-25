"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { MonitorPlay } from "lucide-react";
import { useRef, useState } from "react";

export function DemoVideo() {
    const { t } = useTranslation();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <section id="demo" className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-deep-alt)] via-[var(--color-void)] to-[var(--color-surface)]" />

            {/* Center glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(200,169,126,0.05)_0%,transparent_70%)]" />

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
                        <MonitorPlay className="w-3.5 h-3.5" />
                        <span>{t("demo.badge")}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-text-primary)] mb-6">
                        {t("demo.title")}
                    </h2>
                    <p className="text-lg md:text-xl text-[var(--color-text-secondary)]">
                        {t("demo.subtitle")}
                    </p>
                </motion.div>

                {/* Video Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-deep)] shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
                        {/* Window chrome */}
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.04] bg-white/[0.02]">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                                <div className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
                            </div>
                            <span className="ml-2 text-xs text-[var(--color-text-muted)]">NutriSKU Workbench — Demo</span>
                        </div>

                        {/* Video area */}
                        <div className="relative aspect-video bg-[var(--color-deep-alt)]">
                            <video
                                ref={videoRef}
                                className="absolute inset-0 w-full h-full object-cover"
                                src="/demo-video.mp4"
                                onEnded={() => setIsPlaying(false)}
                                playsInline
                                preload="auto"
                            />

                            {/* Play button overlay */}
                            {!isPlaying && (
                                <button
                                    onClick={handlePlay}
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                                >
                                    <div className="relative">
                                        <div className="absolute -inset-4 rounded-full bg-[rgba(200,169,126,0.15)] blur-xl group-hover:bg-[rgba(200,169,126,0.25)] transition-colors" />
                                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#c8a97e] to-[#9a7b54] flex items-center justify-center shadow-[0_0_30px_rgba(200,169,126,0.3)] group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-6 h-6 text-[#0c0c10] ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
