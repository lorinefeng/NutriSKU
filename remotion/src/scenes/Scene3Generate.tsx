import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    Easing,
} from "remotion";

const strategies = [
    "竞品对比",
    "用户意图对齐",
    "权威口吻",
    "社会证明",
    "独特卖点",
    "统计数据引用",
    "流畅叙事",
    "技术细节补强",
];

export const Scene3Generate = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Header
    const headerOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Progress bar
    const progress = interpolate(frame, [0.8 * fps, 3.5 * fps], [0, 100], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
    });

    // Strategy tags — staggered
    const getTagOpacity = (i: number) =>
        interpolate(
            frame,
            [1 * fps + i * 0.15 * fps, 1.5 * fps + i * 0.15 * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
    const getTagScale = (i: number) =>
        interpolate(
            frame,
            [1 * fps + i * 0.15 * fps, 1.5 * fps + i * 0.15 * fps],
            [0.8, 1],
            {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
            }
        );

    // Content preview
    const contentOpacity = interpolate(
        frame,
        [2.5 * fps, 3.2 * fps],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const contentY = interpolate(
        frame,
        [2.5 * fps, 3.2 * fps],
        [20, 0],
        {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
        }
    );

    // Simulated typing of generated content
    const genText =
        "在城市通勤场景中，轻量冲锋衣的防风性能和透气性是核心选购要素。我们对市场主流品牌进行了深度评测对比……";
    const genTypedLen = Math.floor(
        interpolate(frame, [3 * fps, 4.5 * fps], [0, genText.length], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        })
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#faf9f7",
                padding: "60px 120px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Step indicator */}
            <div style={{ opacity: headerOpacity, marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "#059669",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: 700,
                    }}
                >
                    2
                </div>
                <div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
                        AI 多策略内容生成
                    </div>
                    <div style={{ fontSize: 14, color: "#8a8a8a" }}>
                        基于 8 大 GEO 优化因子，自动生成对比评测文章
                    </div>
                </div>
            </div>

            {/* Main panel */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    gap: 20,
                }}
            >
                {/* Left: Strategy tags + progress */}
                <div
                    style={{
                        width: "40%",
                        background: "#ffffff",
                        border: "1px solid #e8e6e3",
                        borderRadius: 16,
                        padding: 24,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                    }}
                >
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#5c5c5c", marginBottom: 16, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
                        GEO 策略因子
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                        {strategies.map((s, i) => (
                            <div
                                key={i}
                                style={{
                                    opacity: getTagOpacity(i),
                                    transform: `scale(${getTagScale(i)})`,
                                    padding: "6px 14px",
                                    borderRadius: 20,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    background:
                                        i === 0
                                            ? "#d97706"
                                            : i < 4
                                                ? "rgba(217, 119, 6, 0.1)"
                                                : "#f5f3f0",
                                    color: i === 0 ? "#fff" : i < 4 ? "#d97706" : "#5c5c5c",
                                    border:
                                        i < 4
                                            ? "1px solid rgba(217, 119, 6, 0.2)"
                                            : "1px solid #e8e6e3",
                                }}
                            >
                                {s}
                            </div>
                        ))}
                    </div>

                    {/* Progress */}
                    <div style={{ marginTop: "auto" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 8,
                                fontSize: 13,
                                color: "#5c5c5c",
                            }}
                        >
                            <span>生成进度</span>
                            <span style={{ color: "#d97706", fontWeight: 600 }}>
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div
                            style={{
                                height: 8,
                                borderRadius: 4,
                                background: "#f5f3f0",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    width: `${progress}%`,
                                    height: "100%",
                                    borderRadius: 4,
                                    background:
                                        "linear-gradient(90deg, #d97706 0%, #f59e0b 100%)",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Content preview */}
                <div
                    style={{
                        flex: 1,
                        background: "#ffffff",
                        border: "1px solid #e8e6e3",
                        borderRadius: 16,
                        padding: 28,
                        opacity: contentOpacity,
                        transform: `translateY(${contentY}px)`,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                    }}
                >
                    <div
                        style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#5c5c5c",
                            marginBottom: 16,
                            textTransform: "uppercase" as const,
                            letterSpacing: "0.5px",
                        }}
                    >
                        内容预览
                    </div>
                    <div
                        style={{
                            fontSize: 20,
                            fontWeight: 600,
                            color: "#1a1a1a",
                            marginBottom: 16,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Urban 轻量冲锋衣评测：城市通勤之选
                    </div>
                    <div
                        style={{
                            fontSize: 15,
                            color: "#5c5c5c",
                            lineHeight: 1.8,
                        }}
                    >
                        {genText.slice(0, genTypedLen)}
                        <span
                            style={{
                                width: 2,
                                height: 18,
                                background: "#d97706",
                                display: "inline-block",
                                opacity: genTypedLen < genText.length ? 1 : 0,
                                marginLeft: 1,
                            }}
                        />
                    </div>

                    {/* Tags at bottom */}
                    {progress > 80 && (
                        <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
                            {["DeepSeek", "ChatGPT", "Claude"].map((m, i) => (
                                <div
                                    key={i}
                                    style={{
                                        padding: "4px 12px",
                                        borderRadius: 12,
                                        fontSize: 11,
                                        fontWeight: 500,
                                        background: ["#4f46e5", "#10a37f", "#d97706"][i],
                                        color: "#fff",
                                    }}
                                >
                                    {m}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AbsoluteFill>
    );
};
