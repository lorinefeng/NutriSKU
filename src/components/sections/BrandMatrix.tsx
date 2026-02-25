"use client";

import { motion, type Transition } from "framer-motion";
import { useTranslation } from "@/lib/i18n";
import { BriefcaseBusiness } from "lucide-react";
import Image from "next/image";

const transition: Transition = {
    duration: 0.55,
    ease: [0.22, 1, 0.36, 1],
};

const brands = [
    { name: "UNIQLO", since: "2017", src: "/uniqlo.svg", fit: "logo-fit-square" },
    { name: "ZARA", since: "2018", src: "/zara.svg", fit: "logo-fit-wide" },
    { name: "H&M", since: "2018", src: "/hm-logo.svg", fit: "logo-fit-hm" },
    { name: "DECATHLON", since: "2023", src: "/DECATHLON.svg", fit: "logo-fit-wide" },
    { name: "BICESTER VILLAGE", since: "2022", src: "/BICESTER%20VILLAGE.svg", fit: "logo-fit-xwide" },
    { name: "SAINT LAURENT", since: "2024", src: "/SAINT%20LAURENT.svg", fit: "logo-fit-wide" },
    { name: "RALPH LAUREN", since: "2024", src: "/RALPH%20LAUREN.svg", fit: "logo-fit-tall" },
    { name: "BALENCIAGA", since: "2024", src: "/BALENCIAGA.svg", fit: "logo-fit-wide" },
    { name: "MCQUEEN", since: "2024", src: "/MCQUEEN.svg", fit: "logo-fit-wide" },
    { name: "BOTTEGA VENETA", since: "2024", src: "/BOTTEGA%20VENETA.svg", fit: "logo-fit-wide" },
    { name: "LOUIS VUITTON", since: "2025", src: "/LOUIS%20VUITTON.svg", fit: "logo-fit-square" },
    { name: "LOEWE", since: "2026", src: "/LOEWE.svg", fit: "logo-fit-wide" },
];

export function BrandMatrix() {
    const { t, locale } = useTranslation();
    const loopBrands = [...brands, ...brands];

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
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ ...transition, delay: 0.1 }}
                    className="logo-marquee-viewport"
                >
                    <div className="logo-marquee-track">
                        {loopBrands.map((brand, index) => (
                            <article key={`${brand.name}-${index}`} className="logo-marquee-item">
                                <div className="logo-item">
                                    <Image
                                        src={brand.src}
                                        alt={brand.name}
                                        width={160}
                                        height={80}
                                        className={`logo-marquee-image ${brand.fit}`}
                                        priority={index < 4}
                                    />
                                </div>
                                <p className="mt-3 text-center text-xs md:text-sm text-[var(--color-text-muted)] tracking-wide">
                                    {t("brandMatrix.since")} {brand.since} · {t("brandMatrix.today")}
                                </p>
                            </article>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...transition, delay: 0.12 }}
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
