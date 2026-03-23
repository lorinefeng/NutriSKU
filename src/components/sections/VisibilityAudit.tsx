"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, PlayCircle, Radar } from "lucide-react";

import { GlowButton } from "@/components/ui/GlowButton";
import { useTranslation } from "@/lib/i18n";

const platformGifs = [
  { key: "doubao", labelZh: "豆包", labelEn: "Doubao", src: "/gifs/IMG_5711.gif" },
  { key: "deepseek", labelZh: "DeepSeek", labelEn: "DeepSeek", src: "/gifs/IMG_5712.gif" },
  { key: "kimi", labelZh: "Kimi", labelEn: "Kimi", src: "/gifs/IMG_5713.gif" },
];

export function VisibilityAudit() {
  const { locale } = useTranslation();
  const isZh = locale === "zh";

  return (
    <section id="diagnosis" className="relative overflow-hidden py-24 md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,169,126,0.08),transparent_24%),linear-gradient(180deg,var(--color-void),var(--color-deep),var(--color-surface))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(200,169,126,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(200,169,126,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />
      <div className="absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-[rgba(200,169,126,0.07)] blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-[1180px] px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex max-w-[920px] flex-col items-center text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(200,169,126,0.18)] px-3.5 py-1.5 text-xs md:text-sm text-[#c8a97e]">
            <Radar className="h-3.5 w-3.5" />
            <span>{isZh ? "免费 AI 可见度诊断" : "Free AI Visibility Audit"}</span>
          </div>

          <h2 className="max-w-[900px] text-4xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-6xl md:leading-[1.04]">
            {isZh ? "先看清 AI 现在怎么回答，再决定要不要做 GEO。" : "See how AI answers today before you decide whether to invest in GEO."}
          </h2>
          <p className="mt-5 max-w-[760px] text-base leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
            {isZh
              ? "我们会先生成粗中细三层问题，再真实连接豆包、DeepSeek、Kimi 进行检测。首页只展示入口和平台演示，完整诊断与报告会在独立子页里完成。"
              : "We generate layered prompts, then run real checks against Doubao, DeepSeek, and Kimi. The homepage stays clean: just the entry point and platform demos, while the full diagnosis and report live on a dedicated child page."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/diagnosis" target="_blank" rel="noreferrer">
              <GlowButton variant="gold" size="lg" className="group">
                {isZh ? "打开诊断子页" : "Open the audit workspace"}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </GlowButton>
            </Link>
            <Link
              href="/#demo"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(200,169,126,0.28)] px-6 py-3 text-sm text-[#c8a97e] transition-colors hover:bg-[rgba(200,169,126,0.08)]"
            >
              <PlayCircle className="h-4 w-4" />
              {isZh ? "先看产品演示" : "Watch the demo first"}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-14 grid max-w-[980px] gap-4 sm:grid-cols-3"
        >
          {platformGifs.map((platform) => (
            <div
              key={platform.key}
              className="rounded-[24px] border border-[rgba(200,169,126,0.14)] bg-[linear-gradient(180deg,var(--color-glass),rgba(255,255,255,0.02))] p-4 backdrop-blur-xl"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(200,169,126,0.16)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#c8a97e]">
                  <Bot className="h-3.5 w-3.5" />
                  {isZh ? platform.labelZh : platform.labelEn}
                </div>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  {isZh ? "监测演示" : "Audit demo"}
                </span>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-black/20 p-2">
                <img
                  src={platform.src}
                  alt={isZh ? `${platform.labelZh} 监测演示` : `${platform.labelEn} audit demo`}
                  className="mx-auto h-[138px] w-auto rounded-xl object-contain"
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-muted)]">
                {isZh
                  ? `展示 ${platform.labelZh} 在真实检测阶段的界面反馈，GIF 故意压小展示，避免低分辨率素材被放大后失真。`
                  : `A compact preview of the ${platform.labelEn} monitoring flow. The GIF is intentionally displayed small to avoid magnifying low-resolution footage.`}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
