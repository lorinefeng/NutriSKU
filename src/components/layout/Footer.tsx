"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";
import Image from "next/image";

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
        <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-deep-alt)]">
            {/* Top border glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,169,126,0.15)] to-transparent" />

            <div className="container mx-auto px-4 md:px-6">
                {/* Upper section */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-5 gap-12">
                    {/* Brand column */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
                            <div className="rounded-xl px-2 py-1 bg-[rgba(12,12,16,0.88)] border border-[rgba(200,169,126,0.22)]">
                                <Image
                                    src="/logo.svg"
                                    alt="SkuGEO"
                                    width={164}
                                    height={44}
                                    className="h-8 w-auto"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-[var(--color-text-muted)] max-w-xs leading-relaxed">
                            {t("footer.desc")}
                        </p>
                    </div>

                    {/* Link columns */}
                    {columns.map((col, i) => (
                        <div key={i}>
                            <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
                                {col.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {col.links.map((link, j) => (
                                    <li key={j}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-[var(--color-text-muted)] hover:text-[#c8a97e] transition-colors"
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
                <div className="py-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-[var(--color-text-dim)]">{t("footer.copyright")}</span>
                    <div className="flex items-center gap-5 text-xs text-[var(--color-text-dim)]">
                        <Link href="#" className="hover:text-[var(--color-text-muted)] transition-colors">{t("footer.privacy")}</Link>
                        <Link href="#" className="hover:text-[var(--color-text-muted)] transition-colors">{t("footer.terms")}</Link>
                        <Link href="#" className="hover:text-[var(--color-text-muted)] transition-colors">{t("footer.cookies")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
