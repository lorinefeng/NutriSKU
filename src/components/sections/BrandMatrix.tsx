"use client";

import { motion, type Variants, type Transition } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { BriefcaseBusiness } from "lucide-react";

const transition: Transition = {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition },
};

const brands = [
    { name: "UNIQLO", since: "2017" },
    { name: "ZARA", since: "2018" },
    { name: "H&M", since: "2018" },
    { name: "DECATHLON", since: "2023" },
    { name: "BICESTER VILLAGE", since: "2022" },
    { name: "SAINT LAURENT", since: "2024" },
    { name: "RALPH LAUREN", since: "2024" },
    { name: "BALENCIAGA", since: "2024" },
    { name: "MCQUEEN", since: "2024" },
    { name: "BOTTEGA VENETA", since: "2024" },
    { name: "LOUIS VUITTON", since: "2025" },
    { name: "LOEWE", since: "2026" },
];

const logoStyles = [
    "text-[1.35rem] tracking-[0.25em] font-black",
    "text-[1.45rem] tracking-[0.1em] font-semibold",
    "text-[1.7rem] tracking-[0.08em] font-black italic",
    "text-[1.35rem] tracking-[0.06em] font-black",
    "text-[1.1rem] tracking-[0.22em] font-semibold",
    "text-[1.4rem] tracking-[0.05em] font-medium",
    "text-[1.15rem] tracking-[0.2em] font-medium",
    "text-[1.55rem] tracking-[0.14em] font-black",
    "text-[1.45rem] tracking-[0.18em] font-semibold",
    "text-[1.35rem] tracking-[0.1em] font-medium",
    "text-[1.45rem] tracking-[0.05em] font-semibold",
    "text-[1.7rem] tracking-[0.06em] font-semibold",
];

export function BrandMatrix() {
    const { t, locale } = useTranslation();

    return (
        <section id="client-matrix" className="relative py-20 md:py-24 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-deep)] via-[var(--color-void)] to-[var(--color-deep-alt)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(200,169,126,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(200,169,126,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />
            <div className="absolute top-16 -left-28 h-72 w-72 rounded-full bg-[rgba(200,169,126,0.06)] blur-3xl" />
            <div className="absolute bottom-10 -right-20 h-64 w-64 rounded-full bg-[rgba(200,169,126,0.05)] blur-3xl" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={transition}
                    className="text-center max-w-3xl mx-auto mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(200,169,126,0.2)] text-[#c8a97e] text-sm mb-5">
                        <BriefcaseBusiness className="w-3.5 h-3.5" />
                        <span>{t("brandMatrix.badge")}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-text-primary)] mb-4">
                        {t("brandMatrix.title")}
                    </h2>
                    <p className="text-base md:text-lg text-[var(--color-text-secondary)]">
                        {t("brandMatrix.subtitle")}
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
                >
                    {brands.map((brand, index) => (
                        <motion.article
                            key={brand.name}
                            variants={cardVariants}
                            whileHover={{ y: -4, scale: 1.01 }}
                            transition={{ duration: 0.25 }}
                            className="logo-tile rounded-2xl px-4 py-5 md:px-5 md:py-6 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent_10%,rgba(200,169,126,0.1)_45%,transparent_90%)]" />
                            <div className={`text-center text-[var(--color-text-primary)] leading-none ${logoStyles[index]}`}>
                                {brand.name}
                            </div>
                            <p className="mt-4 text-center text-xs md:text-sm text-[var(--color-text-muted)] tracking-wide">
                                {t("brandMatrix.since")} {brand.since} · {t("brandMatrix.today")}
                            </p>
                        </motion.article>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...transition, delay: 0.1 }}
                    className="mt-12 border-t border-[var(--color-border)] pt-7 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
                >
                    <div>
                        <div className="text-4xl md:text-5xl font-semibold text-[var(--color-text-primary)] mb-2">10+</div>
                        <div className="text-sm md:text-base text-[var(--color-text-secondary)]">{t("brandMatrix.stat.brands")}</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-semibold text-[var(--color-text-primary)] mb-2">
                            {locale === "zh" ? "¥50亿+" : "¥5B+"}
                        </div>
                        <div className="text-sm md:text-base text-[var(--color-text-secondary)]">{t("brandMatrix.stat.gmv")}</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-5xl font-semibold text-[var(--color-text-primary)] mb-2">
                            {locale === "zh" ? "100万+" : "1M+"}
                        </div>
                        <div className="text-sm md:text-base text-[var(--color-text-secondary)]">{t("brandMatrix.stat.skus")}</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
