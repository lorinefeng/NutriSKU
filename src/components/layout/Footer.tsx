"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
    const { t } = useTranslation();

    const columns = [
        {
            title: t("footer.product"),
            links: [
                { label: t("footer.features"), href: "#features" },
                { label: t("footer.howItWorks"), href: "#how-it-works" },
                { label: t("footer.pricing"), href: "#pricing" },
                { label: t("footer.changelog"), href: "#" },
            ],
        },
        {
            title: t("footer.resources"),
            links: [
                { label: t("footer.geoGuide"), href: "#" },
                { label: t("footer.blog"), href: "#" },
                { label: t("footer.docs"), href: "#" },
                { label: t("footer.api"), href: "#" },
            ],
        },
        {
            title: t("footer.company"),
            links: [
                { label: t("footer.about"), href: "#" },
                { label: t("footer.careers"), href: "#" },
                { label: t("footer.contact"), href: "#" },
                { label: t("footer.pressKit"), href: "#" },
            ],
        },
    ];

    return (
        <footer className="relative border-t border-white/[0.04] bg-[#0a0a0e]">
            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,169,126,0.15)] to-transparent" />

            <div className="container mx-auto px-4 md:px-6">
                {/* Upper section */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
                    {/* Brand column */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#c8a97e] to-[#9a7b54] flex items-center justify-center">
                                <svg className="w-3.5 h-3.5 text-[#0c0c10]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="text-lg font-semibold tracking-tight">
                                <span className="text-[#5e5a60]">Nutri</span>
                                <span className="text-[#f0ece6]">SKU</span>
                            </span>
                        </Link>
                        <p className="text-sm text-[#5e5a60] max-w-xs leading-relaxed">
                            {t("footer.desc")}
                        </p>
                    </div>

                    {/* Link columns */}
                    {columns.map((col, i) => (
                        <div key={i}>
                            <h4 className="text-xs font-semibold text-[#9a9498] uppercase tracking-wider mb-4">
                                {col.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link, j) => (
                                    <li key={j}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[#5e5a60] hover:text-[#c8a97e] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="py-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-[#3a3a44]">{t("footer.copyright")}</span>
                    <div className="flex items-center gap-5 text-xs text-[#3a3a44]">
                        <Link href="#" className="hover:text-[#5e5a60] transition-colors">{t("footer.privacy")}</Link>
                        <Link href="#" className="hover:text-[#5e5a60] transition-colors">{t("footer.terms")}</Link>
                        <Link href="#" className="hover:text-[#5e5a60] transition-colors">{t("footer.cookies")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
