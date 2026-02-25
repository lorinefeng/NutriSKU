import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    Easing,
} from "remotion";

export const Scene5Outro = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Logo
    const logoOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
        extrapolateRight: "clamp",
    });
    const logoScale = interpolate(
        frame,
        [0, 0.8 * fps],
        [0.85, 1],
        { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
    );

    // Title
    const titleOpacity = interpolate(
        frame,
        [0.5 * fps, 1 * fps],
        [0, 1],
        { extrapolateRight: "clamp" }
    );
    const titleY = interpolate(
        frame,
        [0.5 * fps, 1 * fps],
        [20, 0],
        { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
    );

    // CTA
    const ctaOpacity = interpolate(
        frame,
        [1 * fps, 1.5 * fps],
        [0, 1],
        { extrapolateRight: "clamp" }
    );
    const ctaScale = interpolate(
        frame,
        [1 * fps, 1.5 * fps],
        [0.9, 1],
        { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
    );

    // Features pills
    const pillOpacity = (i: number) =>
        interpolate(
            frame,
            [1.5 * fps + i * 0.2 * fps, 2 * fps + i * 0.2 * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 28,
            }}
        >
            {/* Subtle warm gradient */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                        "radial-gradient(ellipse 50% 40% at 50% 45%, rgba(217, 119, 6, 0.08) 0%, transparent 70%)",
                }}
            />

            {/* Logo */}
            <div
                style={{
                    opacity: logoOpacity,
                    transform: `scale(${logoScale})`,
                    width: 72,
                    height: 72,
                    borderRadius: 18,
                    background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 12px 40px rgba(217, 119, 6, 0.3)",
                }}
            >
                <svg
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
            </div>

            {/* Title */}
            <div
                style={{
                    opacity: titleOpacity,
                    transform: `translateY(${titleY}px)`,
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        fontSize: 56,
                        fontWeight: 700,
                        color: "#f0f0f0",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.2,
                    }}
                >
                    让 AI 爱上你的产品
                </div>
                <div
                    style={{
                        fontSize: 24,
                        color: "#a0a0a0",
                        marginTop: 12,
                    }}
                >
                    NutriSKU — GEO 内容生成工作台
                </div>
            </div>

            {/* CTA Button */}
            <div
                style={{
                    opacity: ctaOpacity,
                    transform: `scale(${ctaScale})`,
                    marginTop: 8,
                }}
            >
                <div
                    style={{
                        padding: "16px 48px",
                        borderRadius: 32,
                        background: "linear-gradient(135deg, #d97706, #f59e0b)",
                        color: "#1a1a1a",
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                        boxShadow: "0 8px 32px rgba(217, 119, 6, 0.35)",
                    }}
                >
                    立即体验 →
                </div>
            </div>

            {/* Feature pills */}
            <div
                style={{
                    display: "flex",
                    gap: 12,
                    marginTop: 12,
                }}
            >
                {["双模式引擎", "8 大 GEO 策略", "多模型适配", "自动发布"].map(
                    (f, i) => (
                        <div
                            key={i}
                            style={{
                                opacity: pillOpacity(i),
                                padding: "8px 18px",
                                borderRadius: 20,
                                fontSize: 14,
                                color: "#d97706",
                                border: "1px solid rgba(217, 119, 6, 0.25)",
                                background: "rgba(217, 119, 6, 0.06)",
                            }}
                        >
                            {f}
                        </div>
                    )
                )}
            </div>

            {/* URL */}
            <div
                style={{
                    position: "absolute",
                    bottom: 48,
                    fontSize: 16,
                    color: "#6a6a6a",
                    letterSpacing: "0.03em",
                    opacity: ctaOpacity,
                }}
            >
                nutri-sku.vercel.app
            </div>
        </AbsoluteFill>
    );
};
