"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Eye,
  LoaderCircle,
  RefreshCcw,
  ScanSearch,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

import { GlowButton } from "@/components/ui/GlowButton";
import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  buildUnavailableAuditResult,
  defaultForm,
  generateFallbackQuestions,
  platformLabels,
  type AuditResult,
  type AuditStage,
  type IntakeForm,
  type PlatformName,
  type PlatformResult,
  type QuestionItem,
  type QuestionsResponse,
  type StreamEvent,
} from "@/lib/visibility-audit/shared";

const initialPlatforms = (Object.keys(platformLabels) as PlatformName[]).map((platform) => ({
  platform,
  status: "pending" as const,
  completion: 0,
  answers: [],
}));

function parseStreamBuffer(buffer: string) {
  const parts = buffer.split("\n");
  const remainder = parts.pop() || "";
  const events = parts
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line) as StreamEvent;
      } catch {
        return null;
      }
    })
    .filter(Boolean) as StreamEvent[];

  return { events, remainder };
}

export function DiagnosisWorkspace() {
  const { locale } = useTranslation();
  const [stage, setStage] = useState<AuditStage>("intake");
  const [form, setForm] = useState<IntakeForm>(defaultForm);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [results, setResults] = useState<AuditResult | null>(null);
  const [progressMessage, setProgressMessage] = useState("");
  const [warning, setWarning] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<PlatformName | null>(null);
  const [platformProgress, setPlatformProgress] = useState<PlatformResult[]>(initialPlatforms);

  const isZh = locale === "zh";
  const isBrandMode = form.entityType === "brand";
  const canGenerate = isBrandMode ? form.name.trim() && form.industry.trim() : form.name.trim() && form.category.trim();

  const selectedQuestions = useMemo(
    () => questions.filter((item) => selectedIds.includes(item.id)),
    [questions, selectedIds]
  );

  const handleInputChange = (key: keyof IntakeForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEntityTypeChange = (value: IntakeForm["entityType"]) => {
    setForm((prev) => ({
      ...prev,
      entityType: value,
      category: value === "brand" ? "" : prev.category,
      priceBand: value === "brand" ? "" : prev.priceBand,
      sellingPoints: value === "brand" ? "" : prev.sellingPoints,
      industry: value === "product" ? "" : prev.industry,
      companyType: value === "product" ? "" : prev.companyType,
      brandPositioning: value === "product" ? "" : prev.brandPositioning,
      coreOfferings: value === "product" ? "" : prev.coreOfferings,
    }));
  };

  const productFields = [
    ["name", isZh ? "商品名称" : "Product name", isZh ? "例如：轻量防风通勤夹克" : "e.g. commuter wind jacket"],
    ["category", isZh ? "所属品类" : "Category", isZh ? "例如：夹克 / 男装" : "e.g. jackets / menswear"],
    ["priceBand", isZh ? "价格带" : "Price band", isZh ? "例如：300-500 元" : "e.g. RMB 300-500"],
    ["targetAudience", isZh ? "目标人群" : "Target audience", isZh ? "例如：城市白领 / 年轻妈妈" : "e.g. urban commuters"],
  ] as const;

  const brandFields = [
    ["name", isZh ? "品牌名称" : "Brand name", isZh ? "例如：某营养品牌 / 某 SaaS 品牌" : "e.g. a nutrition or SaaS brand"],
    ["industry", isZh ? "所属行业" : "Industry", isZh ? "例如：营养健康 / 企业服务" : "e.g. nutrition / B2B SaaS"],
    ["companyType", isZh ? "企业类型" : "Company type", isZh ? "例如：消费品牌 / SaaS / 连锁机构" : "e.g. consumer brand / SaaS / chain"],
    ["targetAudience", isZh ? "目标客群" : "Target audience", isZh ? "例如：健身人群 / 中小企业主" : "e.g. fitness users / SMB owners"],
  ] as const;

  const handleGenerateQuestions = async () => {
    if (!canGenerate) return;

    setStage("question_loading");
    setWarning(null);
    setResults(null);
    setPlatformProgress(initialPlatforms);
    setProgressMessage(isZh ? "正在生成你的高价值检测问题..." : "Generating high-value audit questions...");

    try {
      const response = await fetch("/api/visibility-audit/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, form }),
      });

      if (!response.ok) {
        throw new Error(isZh ? "问题生成接口返回失败" : "Question generation failed");
      }

      const payload = (await response.json()) as QuestionsResponse;
      const nextQuestions = payload.questions?.length ? payload.questions : generateFallbackQuestions(form, locale);
      setQuestions(nextQuestions);
      setSelectedIds(nextQuestions.filter((item) => item.recommended).map((item) => item.id));
      setWarning(payload.warning || null);
      setStage("questions");
    } catch (error) {
      const fallback = generateFallbackQuestions(form, locale);
      setQuestions(fallback);
      setSelectedIds(fallback.filter((item) => item.recommended).map((item) => item.id));
      setWarning(error instanceof Error ? error.message : isZh ? "问题生成失败，已回退本地规则。" : "Question generation failed, using local fallback.");
      setStage("questions");
    }
  };

  const handleToggleQuestion = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleRunAudit = async () => {
    if (!selectedQuestions.length) return;

    setStage("audit_running");
    setResults(null);
    setWarning(null);
    setActivePlatform(null);
    setPlatformProgress(initialPlatforms);
    setProgressMessage(isZh ? "正在向平台发起检测..." : "Submitting platform checks...");

    try {
      const response = await fetch("/api/visibility-audit/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, form, questions: selectedQuestions }),
      });

      if (!response.ok || !response.body) {
        throw new Error(isZh ? "诊断接口不可用，已切换回退结果。" : "Audit endpoint unavailable. Falling back.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parsed = parseStreamBuffer(buffer);
        buffer = parsed.remainder;

        parsed.events.forEach((event) => {
          if (event.type === "init") {
            setProgressMessage(event.message);
            return;
          }
          if (event.type === "warning") {
            setWarning(event.message);
            return;
          }
          if (event.type === "platform_start") {
            setActivePlatform(event.platform);
            setProgressMessage(event.message);
            setPlatformProgress((prev) =>
              prev.map((item) => (item.platform === event.platform ? { ...item, status: "running", completion: 35 } : item))
            );
            return;
          }
          if (event.type === "platform_complete") {
            setActivePlatform(null);
            setPlatformProgress((prev) =>
              prev.map((item) => (item.platform === event.platform ? { ...event.result, completion: 100 } : item))
            );
            return;
          }
          if (event.type === "complete") {
            setResults(event.result);
            setPlatformProgress(event.result.platformResults);
            setProgressMessage(isZh ? "报告已生成" : "Your report is ready");
            setStage("results");
            return;
          }
          if (event.type === "error") {
            throw new Error(event.message);
          }
        });
      }
    } catch (error) {
      const fallback = buildUnavailableAuditResult(
        form,
        locale,
        error instanceof Error ? error.message : isZh ? "诊断执行失败。" : "Audit execution failed."
      );
      setResults(fallback);
      setPlatformProgress(fallback.platformResults);
      setWarning(error instanceof Error ? error.message : isZh ? "诊断执行失败，已展示回退结果。" : "Audit failed, showing fallback result.");
      setStage("results");
    }
  };

  const handleReset = () => {
    setStage("intake");
    setQuestions([]);
    setSelectedIds([]);
    setResults(null);
    setWarning(null);
    setActivePlatform(null);
    setProgressMessage("");
    setPlatformProgress(initialPlatforms);
  };

  const stageLabel =
    stage === "intake"
      ? isZh
        ? "输入诊断对象"
        : "Describe your target"
      : stage === "question_loading"
        ? isZh
          ? "生成问题中"
          : "Generating questions"
        : stage === "questions"
          ? isZh
            ? "选择关注问题"
            : "Select priority questions"
          : stage === "audit_running"
            ? isZh
              ? "多平台检测中"
              : "Running platform checks"
            : isZh
              ? "诊断结果"
              : "Audit results";

  return (
    <section className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,169,126,0.08),transparent_30%),linear-gradient(180deg,var(--color-void),var(--color-deep),var(--color-surface))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(200,169,126,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(200,169,126,0.025)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="container relative z-10 mx-auto max-w-[1120px] px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-col items-center text-center"
        >
          <Link href="/" className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(200,169,126,0.18)] px-4 py-2 text-sm text-[#c8a97e] transition-colors hover:bg-[rgba(200,169,126,0.08)]">
            <ArrowLeft className="h-4 w-4" />
            {isZh ? "返回官网首页" : "Back to homepage"}
          </Link>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(200,169,126,0.18)] px-3.5 py-1.5 text-xs md:text-sm text-[#c8a97e]">
            <ScanSearch className="h-3.5 w-3.5" />
            <span>{isZh ? "AI 可见度诊断工作区" : "AI visibility audit workspace"}</span>
          </div>
          <h1 className="max-w-[840px] text-3xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-5xl md:leading-[1.08]">
            {isZh ? "把真实平台回答、截图证据和 GEO 结论放到同一份报告里。" : "Turn live platform answers, screenshots, and GEO conclusions into one report."}
          </h1>
          <p className="mt-4 max-w-[760px] text-sm leading-relaxed text-[var(--color-text-secondary)] md:text-base">
            {isZh
              ? "这里是独立诊断子页。你先定义商品或品牌，再生成问题、挑选关心的问法，最后拿到包含真实平台截图的监测结果。"
              : "This is the standalone audit workspace. Define the product or brand, generate questions, choose the prompts you care about, and get a report grounded in live platform screenshots."}
          </p>
        </motion.div>

        <div className="relative overflow-hidden rounded-[32px] border border-[rgba(200,169,126,0.18)] bg-[linear-gradient(180deg,var(--color-glass),rgba(255,255,255,0.02))] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl md:p-7 xl:p-8">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,169,126,0.28)] to-transparent" />

          <div className="mb-6 flex flex-col gap-3 border-b border-white/[0.06] pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.22em] text-[#c8a97e]">Audit Flow</div>
              <div className="text-xl font-semibold text-[var(--color-text-primary)]">{stageLabel}</div>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[rgba(200,169,126,0.18)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] md:self-auto">
              <span className="h-2 w-2 rounded-full bg-[#c8a97e] animate-pulse" />
              {stage === "results" ? (isZh ? "真实诊断结果" : "Live audit result") : isZh ? "实时执行" : "Live execution"}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {(stage === "intake" || stage === "question_loading") && (
              <motion.div
                key="intake"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 gap-3">
                  {([
                    ["product", isZh ? "商品" : "Product"],
                    ["brand", isZh ? "品牌" : "Brand"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleEntityTypeChange(value)}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-left transition-all",
                        form.entityType === value
                          ? "border-[rgba(200,169,126,0.48)] bg-[rgba(200,169,126,0.12)]"
                          : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[rgba(200,169,126,0.24)]"
                      )}
                    >
                      <div className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</div>
                      <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                        {value === "product"
                          ? isZh
                            ? "适合 SKU / 单品 / 单个服务"
                            : "For SKU, item, or single offer"
                          : isZh
                            ? "适合品牌 / 企业 / 机构"
                            : "For brands, companies, or institutions"}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {(isBrandMode ? brandFields : productFields).map(([key, label, placeholder]) => (
                    <label key={key} className="block">
                      <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{label}</span>
                      <input
                        value={form[key as keyof IntakeForm]}
                        onChange={(event) => handleInputChange(key as keyof IntakeForm, event.target.value)}
                        placeholder={placeholder}
                        className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-dim)] focus:border-[rgba(200,169,126,0.4)]"
                      />
                    </label>
                  ))}
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    {isBrandMode ? (isZh ? "官网链接" : "Website URL") : isZh ? "官网或商品链接" : "Website or product URL"}
                  </span>
                  <input
                    value={form.url}
                    onChange={(event) => handleInputChange("url", event.target.value)}
                    placeholder={
                      isBrandMode
                        ? isZh
                          ? "选填，用于品牌定位和后续证据抽取"
                          : "Optional, for richer brand grounding"
                        : isZh
                          ? "选填，用于问题生成和后续证据抽取"
                          : "Optional, for richer prompt grounding"
                    }
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-dim)] focus:border-[rgba(200,169,126,0.4)]"
                  />
                </label>

                <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                      {isBrandMode ? (isZh ? "品牌定位" : "Brand positioning") : isZh ? "核心卖点" : "Core selling points"}
                    </span>
                    <textarea
                      value={isBrandMode ? form.brandPositioning : form.sellingPoints}
                      onChange={(event) => handleInputChange(isBrandMode ? "brandPositioning" : "sellingPoints", event.target.value)}
                      placeholder={
                        isBrandMode
                          ? isZh
                            ? "例如：高客单抗衰、临床营养、服务中小企业"
                            : "e.g. premium wellness, SMB growth, clinical nutrition"
                          : isZh
                            ? "可填写 1-3 个，用逗号分隔，例如：防风、耐穿、适合通勤"
                            : "1-3 points separated by commas"
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-dim)] focus:border-[rgba(200,169,126,0.4)]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                      {isBrandMode ? (isZh ? "核心业务 / 核心产品线" : "Core offerings / product lines") : isZh ? "市场范围" : "Market"}
                    </span>
                    <textarea
                      value={isBrandMode ? form.coreOfferings : form.market}
                      onChange={(event) => handleInputChange(isBrandMode ? "coreOfferings" : "market", event.target.value)}
                      placeholder={
                        isBrandMode
                          ? isZh
                            ? "例如：蛋白粉、营养补剂、体重管理方案"
                            : "e.g. protein, supplements, weight programs"
                          : isZh
                            ? "例如：中国 / 东南亚 / 主要一二线城市"
                            : "e.g. China / SEA / Tier 1-2 cities"
                      }
                      rows={4}
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-dim)] focus:border-[rgba(200,169,126,0.4)]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{isZh ? "补充说明" : "Additional notes"}</span>
                  <textarea
                    value={form.notes}
                    onChange={(event) => handleInputChange("notes", event.target.value)}
                    placeholder={isZh ? "选填，例如上新时间、渠道重点、当前增长压力" : "Optional context for future audits"}
                    rows={3}
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-dim)] focus:border-[rgba(200,169,126,0.4)]"
                  />
                </label>

                {warning ? (
                  <div className="rounded-2xl border border-[rgba(200,169,126,0.14)] bg-[rgba(200,169,126,0.05)] px-4 py-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                    {warning}
                  </div>
                ) : null}

                {stage === "question_loading" ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-5 text-sm text-[var(--color-text-secondary)]">
                    <LoaderCircle className="h-4 w-4 animate-spin text-[#c8a97e]" />
                    {progressMessage}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <GlowButton
                    variant="gold"
                    size="md"
                    className="w-full sm:w-auto"
                    onClick={handleGenerateQuestions}
                    disabled={!canGenerate || stage === "question_loading"}
                  >
                    {isZh ? "生成 10 个诊断问题" : "Generate 10 audit prompts"}
                    <ArrowRight className="h-4 w-4" />
                  </GlowButton>
                  <Link
                    href="/#demo"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(200,169,126,0.28)] px-6 py-3 text-sm text-[#c8a97e] transition-colors hover:bg-[rgba(200,169,126,0.08)]"
                  >
                    {isZh ? "先看工作台演示" : "Watch the workbench demo"}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )}

            {stage === "questions" && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">{isZh ? "推荐先勾选 3-5 个最关键问题" : "Pick 3-5 prompts that matter most"}</div>
                    <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {isZh ? `已生成 ${questions.length} 个问题，当前选中 ${selectedIds.length} 个。` : `${questions.length} prompts generated, ${selectedIds.length} selected.`}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-xs text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    {isZh ? "重新填写" : "Start over"}
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {questions.map((question) => {
                    const isChecked = selectedIds.includes(question.id);
                    return (
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => handleToggleQuestion(question.id)}
                        className={cn(
                          "w-full rounded-2xl border p-4 text-left transition-all",
                          isChecked
                            ? "border-[rgba(200,169,126,0.42)] bg-[rgba(200,169,126,0.08)]"
                            : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[rgba(200,169,126,0.24)]"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border",
                              isChecked ? "border-[#c8a97e] bg-[#c8a97e] text-[#0c0c10]" : "border-[var(--color-border-bright)] text-transparent"
                            )}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full border border-[rgba(200,169,126,0.2)] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-[#c8a97e]">{question.granularity}</span>
                              {question.recommended ? (
                                <span className="rounded-full bg-[rgba(255,255,255,0.05)] px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                                  {isZh ? "推荐" : "Recommended"}
                                </span>
                              ) : null}
                            </div>
                            <div className="mb-2 text-sm font-medium leading-relaxed text-[var(--color-text-primary)]">{question.question}</div>
                            <div className="grid gap-2 text-xs leading-relaxed text-[var(--color-text-muted)] sm:grid-cols-2">
                              <div>
                                <span className="text-[var(--color-text-secondary)]">{isZh ? "为什么问" : "Why ask"}：</span>
                                {question.intent}
                              </div>
                              <div>
                                <span className="text-[var(--color-text-secondary)]">{isZh ? "暴露风险" : "Risk focus"}：</span>
                                {question.riskFocus}
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <GlowButton variant="gold" size="md" className="w-full sm:w-auto" onClick={handleRunAudit} disabled={!selectedQuestions.length}>
                    {isZh ? "开始多平台免费诊断" : "Run the free multi-platform audit"}
                    <ScanSearch className="h-4 w-4" />
                  </GlowButton>
                  <GlowButton variant="outline" size="md" className="w-full sm:w-auto" onClick={handleGenerateQuestions}>
                    {isZh ? "重新生成问题" : "Regenerate prompts"}
                  </GlowButton>
                </div>
              </motion.div>
            )}

            {stage === "audit_running" && (
              <motion.div
                key="running"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="space-y-4"
              >
                <div className="rounded-2xl border border-[rgba(200,169,126,0.16)] bg-[rgba(200,169,126,0.06)] p-4">
                  <div className="mb-2 flex items-center gap-3">
                    <LoaderCircle className="h-4 w-4 animate-spin text-[#c8a97e]" />
                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">{progressMessage}</div>
                  </div>
                  <div className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                    {isZh
                      ? "这个阶段会优先尝试真实平台连接、发送问题、等待回答并抓取截图。若平台要求登录、触发风控或运行环境不支持浏览器自动化，结果会明确标记为 blocked / error。"
                      : "This step attempts live platform checks, submits the prompts, waits for answers, and captures screenshots. If a platform requires login, trips risk controls, or the runtime cannot support browser automation, it is marked as blocked or error explicitly."}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {platformProgress.map((platform) => {
                    const label = platformLabels[platform.platform][locale];
                    const statusText =
                      platform.status === "completed"
                        ? isZh
                          ? "检测完成"
                          : "Completed"
                        : platform.status === "blocked"
                          ? isZh
                            ? "被拦截"
                            : "Blocked"
                          : platform.status === "error"
                            ? isZh
                              ? "执行失败"
                              : "Error"
                            : activePlatform === platform.platform
                              ? isZh
                                ? "正在执行"
                                : "Running"
                              : isZh
                                ? "等待中"
                                : "Queued";

                    return (
                      <div key={platform.platform} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(200,169,126,0.18)] bg-[rgba(200,169,126,0.08)] text-[#c8a97e]">
                              {platform.status === "completed" ? <CheckCircle2 className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</div>
                              <div className="text-xs text-[var(--color-text-muted)]">{statusText}</div>
                            </div>
                          </div>
                          <div className="text-xs text-[var(--color-text-secondary)]">{platform.completion}%</div>
                        </div>
                        <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/[0.04]">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#c8a97e] to-[#dfc9a8] transition-all duration-700" style={{ width: `${platform.completion}%` }} />
                        </div>
                        {platform.note ? <div className="text-xs leading-relaxed text-[var(--color-text-muted)]">{platform.note}</div> : null}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {stage === "results" && results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
                className="space-y-5"
              >
                <div className="rounded-[24px] border border-[rgba(200,169,126,0.18)] bg-[linear-gradient(180deg,rgba(200,169,126,0.10),rgba(255,255,255,0.03))] p-5">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[rgba(200,169,126,0.16)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#c8a97e]">
                    <CircleAlert className="h-3.5 w-3.5" />
                    {isZh ? "AI 风险扫描结果" : "AI risk scan"}
                  </div>
                  <div className="mb-2 text-2xl font-semibold leading-snug text-[var(--color-text-primary)]">{results.headline}</div>
                  <div className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{results.subhead}</div>
                </div>

                {warning ? (
                  <div className="rounded-2xl border border-[rgba(200,169,126,0.14)] bg-[rgba(200,169,126,0.05)] px-4 py-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                    {warning}
                  </div>
                ) : null}

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <div className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">{isZh ? "关键风险" : "Key risks"}</div>
                    <div className="space-y-2.5">
                      {results.keyRisks.map((risk) => (
                        <div key={risk} className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-[#c8a97e]" />
                          <span>{risk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                    <div className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">{isZh ? "建议的 GEO 动作" : "Suggested GEO moves"}</div>
                    <div className="space-y-2.5">
                      {results.suggestions.map((suggestion) => (
                        <div key={suggestion} className="flex gap-3 text-sm text-[var(--color-text-secondary)]">
                          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#c8a97e]" />
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {results.platformResults.map((platform) => {
                    const label = platformLabels[platform.platform][locale];
                    return (
                      <div key={platform.platform} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(200,169,126,0.18)] bg-[rgba(200,169,126,0.08)] text-[#c8a97e]">
                              <Bot className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</div>
                              <div className="text-xs text-[var(--color-text-muted)]">
                                {platform.status === "completed"
                                  ? isZh
                                    ? "真实回答截图 + 片段 + 摘要判断"
                                    : "Live screenshot + snippet + summary"
                                  : platform.status === "blocked"
                                    ? isZh
                                      ? "平台被拦截"
                                      : "Platform blocked"
                                    : isZh
                                      ? "平台执行失败"
                                      : "Platform error"}
                              </div>
                            </div>
                          </div>
                          <span className="rounded-full border border-[rgba(200,169,126,0.16)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#c8a97e]">
                            {platform.status}
                          </span>
                        </div>

                        {platform.answers.length === 0 ? (
                          <div className="rounded-2xl border border-white/[0.04] bg-[var(--color-glass-light)] p-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                            {platform.note || (isZh ? "该平台本轮未拿到可用回答。" : "No usable answer was captured for this platform.")}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {platform.answers.map((answer) => (
                              <div key={answer.questionId} className="overflow-hidden rounded-2xl border border-white/[0.04] bg-[var(--color-glass-light)]">
                                <div className="border-b border-white/[0.04] px-4 py-3 text-sm font-medium text-[var(--color-text-primary)]">{answer.question}</div>
                                <div className="grid gap-4 p-4 lg:grid-cols-[0.92fr_1.08fr]">
                                  <div className="space-y-3">
                                    <div>
                                      <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{isZh ? "平台回答截图" : "Platform screenshot"}</div>
                                      {answer.screenshotDataUrl ? (
                                        <img
                                          src={answer.screenshotDataUrl}
                                          alt={answer.question}
                                          className="w-full rounded-xl border border-white/[0.06] object-cover"
                                        />
                                      ) : (
                                        <div className="rounded-xl border border-dashed border-white/[0.08] bg-black/10 px-4 py-10 text-center text-xs text-[var(--color-text-muted)]">
                                          {isZh ? "本轮未抓到可用截图。" : "No usable screenshot was captured."}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{isZh ? "AI 原始回答片段" : "Raw answer snippet"}</div>
                                      <div className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{answer.rawSnippet}</div>
                                    </div>
                                    <div>
                                      <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{isZh ? "摘要判断" : "Summary"}</div>
                                      <div className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{answer.summary}</div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <span className="rounded-full bg-[rgba(255,255,255,0.05)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                                        {answer.mentionsTarget ? (isZh ? "提到目标对象" : "Target mentioned") : isZh ? "未提到目标对象" : "Target missing"}
                                      </span>
                                      {answer.competitors.map((competitor) => (
                                        <span key={competitor} className="rounded-full border border-[rgba(200,169,126,0.14)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[#c8a97e]">
                                          {competitor}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-[24px] border border-[rgba(200,169,126,0.18)] bg-[linear-gradient(180deg,rgba(200,169,126,0.08),rgba(255,255,255,0.03))] p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">{isZh ? "如果这就是你的真实 AI 可见度，我们建议尽快补位。" : "If this reflects your real AI visibility, we should close the gap fast."}</div>
                      <div className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {isZh
                          ? "接下来最自然的动作不是继续观察，而是围绕这些高意图问题补内容、补评测、补可检索信号。"
                          : "The natural next move is not more waiting. It is building content, reviews, and retrievable signals around these intent-rich prompts."}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <GlowButton variant="gold" size="md">
                        {isZh ? "添加企业微信" : "Add WeCom"}
                        <ArrowRight className="h-4 w-4" />
                      </GlowButton>
                      <GlowButton variant="outline" size="md">
                        <Eye className="h-4 w-4" />
                        {isZh ? "预约演示" : "Schedule demo"}
                      </GlowButton>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <GlowButton variant="outline" size="md" className="w-full sm:w-auto" onClick={handleReset}>
                    {isZh ? "再测一个对象" : "Audit another target"}
                  </GlowButton>
                  <Link
                    href="/#showcase"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(200,169,126,0.28)] px-6 py-3 text-sm text-[#c8a97e] transition-colors hover:bg-[rgba(200,169,126,0.08)]"
                  >
                    {isZh ? "查看产品手册" : "View the deck"}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
