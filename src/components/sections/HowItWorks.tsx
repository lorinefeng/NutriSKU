"use client";

import { motion, type Transition } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { Database, Sparkles, Globe, CheckCircle } from "lucide-react";

const transition: Transition = {
    duration: 0.6,
    ease: [0.22, 1, 0.36, 1],
};

export function HowItWorks() {
    const { t } = useTranslation();

    const steps = [
        {
            number: "01",
            title: t("howItWorks.step1.title"),
            description: t("howItWorks.step1.desc"),
            icon: Database,
        },
        {
            number: "02",
            title: t("howItWorks.step2.title"),
            description: t("howItWorks.step2.desc"),
            icon: Sparkles,
        },
        {
            number: "03",
            title: t("howItWorks.step3.title"),
            description: t("howItWorks.step3.desc"),
            icon: Sparkles,
        },
        {
            number: "04",
            title: t("howItWorks.step4.title"),
            description: t("howItWorks.step4.desc"),
            icon: CheckCircle,
        },
    ];

    return (
        <section id="how-it-works" className="relative py-24 md:py-28 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[var(--color-deep-alt)]" />

            {/* Subtle warm glow */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[rgba(200,169,126,0.04)] rounded-full blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[rgba(200,169,126,0.03)] rounded-full blur-[128px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={transition}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[rgba(200,169,126,0.15)] text-[#c8a97e] text-xs md:text-sm mb-4">
                        <Globe className="w-3.5 h-3.5" />
                        <span>{t("howItWorks.badge")}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4">
                        {t("howItWorks.title.pre")}
                        <span className="gradient-text-gold">{t("howItWorks.title.brand")}</span>
                        {t("howItWorks.title.post")}
                    </h2>
                    <p className="text-base md:text-lg text-[var(--color-text-secondary)]">{t("howItWorks.subtitle")}</p>
                </motion.div>

                {/* Steps */}
                <div className="max-w-4xl mx-auto relative">
                    {/* Timeline line */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px">
                        <div className="h-full bg-gradient-to-b from-[rgba(200,169,126,0.3)] via-[rgba(200,169,126,0.15)] to-[rgba(200,169,126,0.05)]" />
                    </div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ ...transition, delay: index * 0.12 }}
                            className={`relative mb-10 last:mb-0 lg:flex lg:items-center ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                }`}
                        >
                            {/* Card */}
                            <div className={`lg:w-[calc(50%-32px)] ${index % 2 === 0 ? "lg:pr-8 lg:text-right" : "lg:pl-8 lg:text-left"}`}>
                                <div className="group relative p-5 md:p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[rgba(200,169,126,0.22)] transition-all duration-500">
                                    {/* Step badge */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[rgba(200,169,126,0.15)] text-[10px] font-bold text-[#c8a97e] mb-4 tracking-widest">
                                        STEP {step.number}
                                    </div>
                                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 group-hover:text-[#dfc9a8] transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed group-hover:text-[var(--color-text-muted)] transition-colors">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Center icon — Desktop */}
                            <div className="hidden lg:flex items-center justify-center w-16 shrink-0">
                                <div className="relative">
                                    <div className="absolute -inset-3 rounded-full bg-[rgba(200,169,126,0.06)] blur-lg" />
                                    <div className="relative w-12 h-12 rounded-full border border-[rgba(200,169,126,0.2)] bg-[var(--color-deep-alt)] flex items-center justify-center">
                                        <step.icon className="w-5 h-5 text-[#c8a97e]" />
                                    </div>
                                </div>
                            </div>

                            {/* Mobile icon */}
                            <div className="lg:hidden flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl border border-[rgba(200,169,126,0.15)] bg-[rgba(200,169,126,0.05)] flex items-center justify-center">
                                    <step.icon className="w-4 h-4 text-[#c8a97e]" />
                                </div>
                                <span className="text-xs font-bold text-[#c8a97e] tracking-wider">STEP {step.number}</span>
                            </div>

                            {/* Spacer */}
                            <div className="hidden lg:block lg:w-[calc(50%-32px)]" />
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...transition, delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <div className="inline-flex flex-col items-center gap-3 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-glass-light)]">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#c8a97e] animate-gold-pulse" />
                            <span className="text-[var(--color-text-secondary)] text-sm">
                                {t("howItWorks.cta.setup")}
                            </span>
                        </div>
                        <p className="text-sm text-[var(--color-text-muted)]">{t("howItWorks.cta.question")}</p>
                        <a
                            href="#"
                            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#c8a97e] to-[#b8956a] text-[#0c0c10] font-semibold hover:shadow-[0_0_30px_rgba(200,169,126,0.25)] transition-all duration-300"
                        >
                            {t("howItWorks.cta.button")}
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
