"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type Locale = "zh" | "en";

const translations = {
    // Navbar
    "nav.features": { zh: "核心能力", en: "Features" },
    "nav.howItWorks": { zh: "工作流程", en: "How it Works" },
    "nav.demo": { zh: "产品演示", en: "Demo" },
    "nav.showcase": { zh: "产品手册", en: "Showcase" },
    "nav.login": { zh: "登录", en: "Log in" },
    "nav.getStarted": { zh: "立即体验", en: "Get Started" },
    "nav.theme": { zh: "主题", en: "Theme" },
    "nav.themeLight": { zh: "亮", en: "Light" },
    "nav.themeDark": { zh: "暗", en: "Dark" },

    // Hero
    "hero.badge": { zh: "新一代 AI 搜索营销策略", en: "Next-Gen AI Search Marketing" },
    "hero.title.line1": { zh: "让 AI", en: "Make AI Models" },
    "hero.title.highlight": { zh: "推荐你的品牌", en: "Choose Your Brand" },
    "hero.subtitle": {
        zh: "不只是 Google 排名。让 ChatGPT、DeepSeek、Claude 主动推荐你的产品。拾鸽通过生成式引擎优化（GEO），让 AI 搜索成为你的增长引擎。",
        en: "Don't just rank on Google. Get recommended by ChatGPT, DeepSeek, and Claude. SkuGEO optimizes your product data so AI agents choose your brand as the answer.",
    },
    "hero.cta.primary": { zh: "免费诊断", en: "Start Free Audit" },
    "hero.cta.secondary": { zh: "观看演示", en: "Watch Demo" },
    "hero.stat.skus": { zh: "SKU 已优化", en: "SKUs Optimized" },
    "hero.stat.boost": { zh: "AI 曝光提升", en: "AI Visibility Boost" },
    "hero.stat.models": { zh: "主流 AI 模型", en: "Major AI Models" },

    // Features
    "features.badge": { zh: "核心能力", en: "Core Capabilities" },
    "features.title": { zh: "为 GEO 时代而生", en: "Built for the GEO Era" },
    "features.subtitle": {
        zh: '用专为 AI 搜索时代打造的工具，占领"AI 货架"。',
        en: 'Dominate the "AI Shelf" with tools built for AI-powered discovery.',
    },
    "features.dualMode.title": { zh: "双模式内容引擎", en: "Dual-Mode Content Engine" },
    "features.dualMode.desc": {
        zh: "支持 SKU 商品模式与品牌 IP 模式，根据不同营销维度生成差异化的对比评测内容。",
        en: "SKU Product mode and Brand IP mode generate differentiated comparative reviews from different marketing dimensions.",
    },
    "features.geoStrategy.title": { zh: "8 大 GEO 策略引擎", en: "8 GEO Strategy Factors" },
    "features.geoStrategy.desc": {
        zh: "基于权威论文验证的高排名要素：竞品对比、用户意图对齐、权威口吻、社会证明、独特卖点等。",
        en: "Research-backed ranking factors: competitive analysis, user intent alignment, authoritative tone, social proof, USPs, and more.",
    },
    "features.mcpSearch.title": { zh: "MCP 联网竞品检索", en: "MCP Web Search" },
    "features.mcpSearch.desc": {
        zh: "通过 Exa MCP 实时全网检索竞品信息，中国市场优先，支持官网降级策略。",
        en: "Real-time competitor research via Exa MCP with China-market priority and website fallback strategies.",
    },
    "features.multiModel.title": { zh: "多模型内容适配", en: "Multi-Model Optimization" },
    "features.multiModel.desc": {
        zh: "针对 DeepSeek（技术型）、ChatGPT（对话型）、Claude（分析型）不同模型特征定制内容风格。",
        en: "Tailored content for DeepSeek (Technical), ChatGPT (Conversational), and Claude (Analytical).",
    },
    "features.batch.title": { zh: "批量生成 & 自动发布", en: "Batch Processing & Auto-Publish" },
    "features.batch.desc": {
        zh: "支持 JSON 批量导入商品，并发处理，一键发布到什么值得买等目标平台。",
        en: "Batch import via JSON, concurrent generation, one-click publishing to target platforms.",
    },
    "features.template.title": { zh: "模板管理与版本控制", en: "Template Version Control" },
    "features.template.desc": {
        zh: "Prompt 模板按模式独立管理，支持修订历史与一键回滚，确保内容质量可控。",
        en: "Mode-specific prompt templates with revision history and one-click rollback for quality control.",
    },

    // How it Works
    "howItWorks.badge": { zh: "工作流程", en: "How It Works" },
    "howItWorks.title.pre": { zh: "", en: "How " },
    "howItWorks.title.brand": { zh: "拾鸽", en: "SkuGEO" },
    "howItWorks.title.post": { zh: " 如何运作", en: " Works" },
    "howItWorks.subtitle": {
        zh: "从商品数据到 AI 推荐，只需四步。",
        en: "From product data to AI recommendations in days, not months.",
    },
    "howItWorks.step1.title": { zh: "导入商品数据", en: "Import Product Data" },
    "howItWorks.step1.desc": {
        zh: "输入商品信息或品牌官网，支持 JSON 批量导入。系统自动解析商品属性与竞品关系。",
        en: "Enter product info or brand website. Supports JSON batch import. Auto-parses attributes and competitor relationships.",
    },
    "howItWorks.step2.title": { zh: "AI 智能分析", en: "AI-Powered Analysis" },
    "howItWorks.step2.desc": {
        zh: "MCP 联网检索同类竞品，分析市场定位与差异化优势，构建结构化知识图谱。",
        en: "MCP-powered web search for competitors, market positioning analysis, and structured knowledge graph construction.",
    },
    "howItWorks.step3.title": { zh: "多策略内容生成", en: "Multi-Strategy Content Gen" },
    "howItWorks.step3.desc": {
        zh: "基于 8 大 GEO 优化因子自动生成对比评测文章，针对不同 AI 模型特征适配内容风格。",
        en: "Auto-generate comparative reviews based on 8 GEO factors, with content style adapted for each AI model.",
    },
    "howItWorks.step4.title": { zh: "发布与效果追踪", en: "Publish & Track Results" },
    "howItWorks.step4.desc": {
        zh: "一键发布到目标平台，实时验证你的产品是否已被 AI 模型推荐。",
        en: "One-click publish to target platforms. Real-time verification that AI models are recommending your products.",
    },
    "howItWorks.cta.setup": {
        zh: "平均配置时间：15 分钟",
        en: "Average setup time: 15 minutes",
    },
    "howItWorks.cta.question": {
        zh: "准备好让 AI 爱上你的产品了吗？",
        en: "Ready to make AI models love your products?",
    },
    "howItWorks.cta.button": { zh: "预约演示", en: "Schedule a Demo" },

    // Brand Matrix
    "brandMatrix.badge": { zh: "服务客户", en: "Client Portfolio" },
    "brandMatrix.title": { zh: "顶级行业客户矩阵", en: "Top-Tier Client Matrix" },
    "brandMatrix.subtitle": {
        zh: "依据服务年限排序，覆盖快时尚、奢侈品与运动零售核心品牌。",
        en: "Ranked by service years across fast fashion, luxury, and sports retail brands.",
    },
    "brandMatrix.since": { zh: "服务起始", en: "Since" },
    "brandMatrix.today": { zh: "持续至今", en: "Active" },
    "brandMatrix.stat.brands": { zh: "覆盖头部品牌", en: "Top Brands Covered" },
    "brandMatrix.stat.gmv": { zh: "支撑年 GMV", en: "Annual GMV Supported" },
    "brandMatrix.stat.skus": { zh: "处理 SKU 数量", en: "SKUs Processed" },

    // Demo Video
    "demo.badge": { zh: "产品演示", en: "Product Demo" },
    "demo.title": { zh: "亲眼见证 GEO 内容生成", en: "See GEO Content Generation in Action" },
    "demo.subtitle": {
        zh: "观看拾鸽工作台如何在数分钟内完成从商品数据导入到 AI 优化内容生成的完整流程。",
        en: "Watch how SkuGEO generates AI-optimized content from product data in minutes.",
    },
    "demo.placeholder": { zh: "演示视频加载中…", en: "Loading demo video…" },

    // PPT Showcase
    "showcase.badge": { zh: "产品手册", en: "Product Deck" },
    "showcase.title": { zh: "深入了解拾鸽", en: "Explore SkuGEO In-Depth" },
    "showcase.subtitle": {
        zh: "浏览我们的产品宣传手册，了解 GEO 如何重塑电商营销格局。",
        en: "Browse our product deck to learn how GEO reshapes e-commerce marketing.",
    },
    "showcase.preparing": { zh: "产品手册制作中，敬请期待", en: "Product deck coming soon" },
    "showcase.page": { zh: "页", en: "Page" },

    // Footer
    "footer.desc": {
        zh: "让你的产品在 AI 时代可见。面向电商的生成式引擎优化（GEO）解决方案。",
        en: "Making your products visible in the AI era. GEO for modern commerce.",
    },
    "footer.product": { zh: "产品", en: "Product" },
    "footer.resources": { zh: "资源", en: "Resources" },
    "footer.company": { zh: "公司", en: "Company" },
    "footer.features": { zh: "核心能力", en: "Features" },
    "footer.howItWorks": { zh: "工作流程", en: "How it Works" },
    "footer.pricing": { zh: "定价", en: "Pricing" },
    "footer.changelog": { zh: "更新日志", en: "Changelog" },
    "footer.geoGuide": { zh: "GEO 指南 2026", en: "GEO Guide 2026" },
    "footer.blog": { zh: "博客", en: "Blog" },
    "footer.docs": { zh: "文档", en: "Documentation" },
    "footer.api": { zh: "API 文档", en: "API Reference" },
    "footer.about": { zh: "关于我们", en: "About" },
    "footer.careers": { zh: "加入我们", en: "Careers" },
    "footer.contact": { zh: "联系我们", en: "Contact" },
    "footer.pressKit": { zh: "媒体资源", en: "Press Kit" },
    "footer.copyright": { zh: "© 2026 拾鸽 · SkuGEO. 保留所有权利。", en: "© 2026 SkuGEO. All rights reserved." },
    "footer.privacy": { zh: "隐私政策", en: "Privacy Policy" },
    "footer.terms": { zh: "服务条款", en: "Terms of Service" },
    "footer.cookies": { zh: "Cookie 设置", en: "Cookies" },
} as const;

type TranslationKey = keyof typeof translations;

interface I18nContextValue {
    locale: Locale;
    toggleLocale: () => void;
    t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>("zh");

    const toggleLocale = useCallback(() => {
        setLocale((prev) => (prev === "zh" ? "en" : "zh"));
    }, []);

    const t = useCallback(
        (key: TranslationKey): string => {
            const entry = translations[key];
            if (!entry) return key;
            return entry[locale] ?? key;
        },
        [locale]
    );

    return (
        <I18nContext.Provider value={{ locale, toggleLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
    return ctx;
}
