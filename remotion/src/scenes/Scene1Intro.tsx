import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    Easing,
} from "remotion";

export const Scene1Intro = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Badge fade in
    const badgeOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
        extrapolateRight: "clamp",
    });
    const badgeY = interpolate(frame, [0, 0.5 * fps], [20, 0], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
    });

    // Title line 1
    const title1Opacity = interpolate(
        frame,
        [0.4 * fps, 1 * fps],
        [0, 1],
        { extrapolateRight: "clamp" }
    );
    const title1Y = interpolate(
        frame,
        [0.4 * fps, 1 * fps],
        [30, 0],
        { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
    );

    // Title line 2
    const title2Opacity = interpolate(
        frame,
        [0.8 * fps, 1.4 * fps],
        [0, 1],
        { extrapolateRight: "clamp" }
    );
    const title2Y = interpolate(
        frame,
        [0.8 * fps, 1.4 * fps],
        [30, 0],
        { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
    );

    // Subtitle
    const subOpacity = interpolate(
        frame,
        [1.4 * fps, 2 * fps],
        [0, 1],
        { extrapolateRight: "clamp" }
    );

    // Logo box
    const logoScale = interpolate(
        frame,
        [0, 0.6 * fps],
        [0.8, 1],
        { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
    );

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#faf9f7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 24,
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
                        "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(217, 119, 6, 0.06) 0%, transparent 70%)",
                }}
            />

            {/* Logo */}
            <div
                style={{
                    opacity: badgeOpacity,
                    transform: `translateY(${badgeY}px) scale(${logoScale})`,
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                    boxShadow: "0 8px 32px rgba(217, 119, 6, 0.25)",
                }}
            >
                <svg
                    width="32"
                    height="32"
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

            {/* Badge */}
            <div
                style={{
                    opacity: badgeOpacity,
                    transform: `translateY(${badgeY}px)`,
                    padding: "8px 20px",
                    borderRadius: 24,
                    border: "1px solid rgba(217, 119, 6, 0.2)",
                    color: "#d97706",
                    fontSize: 16,
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                }}
            >
                GEO 内容生成工作台
            </div>

            {/* Title */}
            <div
                style={{
                    textAlign: "center",
                }}
            >
                <div
                    style={{
                        opacity: title1Opacity,
                        transform: `translateY(${title1Y}px)`,
                        fontSize: 72,
                        fontWeight: 700,
                        color: "#1a1a1a",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                    }}
                >
                    让 AI 推荐你的品牌
                </div>
                <div
                    style={{
                        opacity: title2Opacity,
                        transform: `translateY(${title2Y}px)`,
                        fontSize: 48,
                        fontWeight: 400,
                        color: "#5c5c5c",
                        marginTop: 12,
                    }}
                >
                    NutriSKU 产品演示
                </div>
            </div>

            {/* Subtitle */}
            <div
                style={{
                    opacity: subOpacity,
                    fontSize: 20,
                    color: "#8a8a8a",
                    maxWidth: 600,
                    textAlign: "center",
                    lineHeight: 1.6,
                }}
            >
                从商品数据到 AI 优化内容，全流程自动化
            </div>
        </AbsoluteFill>
    );
};
