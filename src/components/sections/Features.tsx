"use client";

import { motion, type Transition } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Layers, Target, Search, Cpu, Rocket, GitBranch } from "lucide-react";

const transition: Transition = {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
};

export function Features() {
    const { t } = useTranslation();

    const features = [
        {
            title: t("features.dualMode.title"),
            description: t("features.dualMode.desc"),
            icon: Layers,
        },
        {
            title: t("features.geoStrategy.title"),
            description: t("features.geoStrategy.desc"),
            icon: Target,
        },
        {
            title: t("features.mcpSearch.title"),
            description: t("features.mcpSearch.desc"),
            icon: Search,
        },
        {
            title: t("features.multiModel.title"),
            description: t("features.multiModel.desc"),
            icon: Cpu,
        },
        {
            title: t("features.batch.title"),
            description: t("features.batch.desc"),
            icon: Rocket,
        },
        {
            title: t("features.template.title"),
            description: t("features.template.desc"),
            icon: GitBranch,
        },
    ];

    return (
        <section id="features" className="relative py-24 md:py-28 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-void)] via-[var(--color-surface)] to-[var(--color-void)]" />

            {/* Subtle grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(200,169,126,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(200,169,126,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />

            {/* Warm glow accents */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[rgba(200,169,126,0.04)] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[rgba(200,169,126,0.03)] rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={transition}
                    className="text-center max-w-3xl mx-auto mb-14"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(200,169,126,0.15)] text-[#c8a97e] text-xs md:text-sm mb-4">
                        <Target className="w-3.5 h-3.5" />
                        <span>{t("features.badge")}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4">
                        {t("features.title")}
                    </h2>
                    <p className="text-base md:text-lg text-[var(--color-text-secondary)]">{t("features.subtitle")}</p>
                </motion.div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ ...transition, delay: i * 0.08 }}
                            className="group relative"
                        >
                            <div className="relative h-full p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[rgba(200,169,126,0.22)] transition-all duration-500 overflow-hidden">
                                {/* Hover accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(200,169,126,0.03)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

                                {/* Icon */}
                                <div className="relative mb-5">
                                    <div className="w-11 h-11 rounded-xl bg-[rgba(200,169,126,0.08)] border border-[rgba(200,169,126,0.12)] flex items-center justify-center group-hover:bg-[rgba(200,169,126,0.12)] transition-colors duration-300">
                                        <feature.icon className="w-5 h-5 text-[#c8a97e]" />
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="relative text-base md:text-lg font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[#dfc9a8] transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="relative text-sm text-[var(--color-text-secondary)] leading-relaxed group-hover:text-[var(--color-text-muted)] transition-colors">
                                    {feature.description}
                                </p>

                                {/* Bottom line */}
                                <div className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-[rgba(200,169,126,0.2)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
