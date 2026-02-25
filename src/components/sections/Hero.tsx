"use client";

import { motion, type Variants, type Transition } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { useTranslation } from "@/lib/i18n";
import { ArrowRight, Zap, TrendingUp, Bot } from "lucide-react";

const transition: Transition = {
    duration: 0.7,
    ease: [0.22, 1, 0.36, 1],
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition },
};

export function Hero() {
    const { t } = useTranslation();

    const stats = [
        { value: "1M+", label: t("hero.stat.skus"), icon: Zap },
        { value: "50x", label: t("hero.stat.boost"), icon: TrendingUp },
        { value: "3", label: t("hero.stat.models"), icon: Bot },
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Subtle background */}
            <div className="absolute inset-0 z-0">
                {/* Fine grain texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
                {/* Warm glow — top center */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(200,169,126,0.06)_0%,transparent_70%)]" />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--color-void)] to-transparent" />
            </div>

            {/* Decorative lines */}
            <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
                <div className="absolute top-[20%] left-[8%] w-px h-32 bg-gradient-to-b from-transparent via-[rgba(200,169,126,0.15)] to-transparent" />
                <div className="absolute top-[15%] right-[12%] w-px h-48 bg-gradient-to-b from-transparent via-[rgba(200,169,126,0.1)] to-transparent" />
                <div className="absolute bottom-[25%] left-[15%] w-24 h-px bg-gradient-to-r from-transparent via-[rgba(200,169,126,0.12)] to-transparent" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center text-center max-w-4xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(200,169,126,0.2)] text-[#c8a97e] text-sm font-medium mb-8"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8a97e] animate-gold-pulse" />
                        <span>{t("hero.badge")}</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
                    >
                        <span className="text-[var(--color-text-primary)]">{t("hero.title.line1")}</span>
                        <br />
                        <span className="gradient-text-hero">{t("hero.title.highlight")}</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        {t("hero.subtitle")}
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full mb-16"
                    >
                        <GlowButton variant="gold" size="lg" className="w-full sm:w-auto group">
                            {t("hero.cta.primary")}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </GlowButton>
                        <GlowButton variant="outline" size="lg" className="w-full sm:w-auto">
                            {t("hero.cta.secondary")}
                        </GlowButton>
                    </motion.div>

                    {/* Stats */}
                    <motion.div variants={itemVariants} className="grid grid-cols-3 gap-8 md:gap-16">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <stat.icon className="w-4 h-4 text-[#c8a97e] opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)]">{stat.value}</span>
                                </div>
                                <span className="text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] transition-colors">{stat.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* AI Chat Demo Card — Refined */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="mt-20 relative w-full max-w-3xl mx-auto"
                >
                    {/* Subtle glow */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[rgba(200,169,126,0.1)] via-[rgba(200,169,126,0.05)] to-[rgba(200,169,126,0.1)] blur-2xl rounded-2xl" />

                    <div className="relative glass rounded-2xl p-6 md:p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.04]">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                                </div>
                                <span className="text-xs text-[var(--color-text-muted)] ml-2">AI Shopping Assistant</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-[rgba(200,169,126,0.2)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c8a97e] animate-gold-pulse" />
                                <span className="text-[10px] text-[#c8a97e]">Live</span>
                            </div>
                        </div>

                        {/* Chat */}
                        <div className="flex flex-col gap-5">
                            {/* User */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-secondary)] text-xs font-medium shrink-0">
                                    U
                                </div>
                                <div className="bg-[var(--color-glass-light)] rounded-2xl rounded-tl-none px-4 py-3 text-[var(--color-text-secondary)] text-sm max-w-[85%] border border-[var(--color-border)]">
                                    推荐一款防风耐穿、适合城市通勤的夹克，预算 500 元以内。
                                </div>
                            </div>
                            {/* AI */}
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c8a97e] to-[#9a7b54] flex items-center justify-center shrink-0">
                                    <svg className="w-4 h-4 text-[#0c0c10]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                        <path d="M2 17l10 5 10-5" />
                                        <path d="M2 12l10 5 10-5" />
                                    </svg>
                                </div>
                                <div className="space-y-3 max-w-[90%]">
                                    <div className="border border-[rgba(200,169,126,0.15)] bg-[rgba(200,169,126,0.03)] rounded-2xl rounded-tl-none px-4 py-3">
                                        <p className="text-[var(--color-text-secondary)] text-sm mb-3">根据您的需求，强烈推荐：</p>
                                        {/* Product Card */}
                                        <div className="flex gap-3 p-3 rounded-xl border border-[rgba(200,169,126,0.12)] bg-[var(--color-glass-light)]">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-surface-elevated)] to-[var(--color-surface)] rounded-lg flex items-center justify-center shrink-0">
                                                <svg className="w-8 h-8 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-[var(--color-text-primary)] text-sm">UltraCommute 通勤夹克</h4>
                                                    <span className="px-1.5 py-0.5 bg-[rgba(200,169,126,0.12)] text-[#c8a97e] text-[9px] font-medium rounded-full border border-[rgba(200,169,126,0.2)]">
                                                        最佳性价比
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[var(--color-text-muted)] mb-1.5">加固缝线、DWR 防水涂层，30 天无忧退换</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">¥449</span>
                                                    <span className="text-xs text-[var(--color-text-muted)] line-through">¥659</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
