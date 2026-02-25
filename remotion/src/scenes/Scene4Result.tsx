import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    Easing,
} from "remotion";

export const Scene4Result = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Header
    const headerOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Main card
    const cardOpacity = interpolate(
        frame,
        [0.3 * fps, 0.8 * fps],
        [0, 1],
        { extrapolateRight: "clamp" }
    );
    const cardY = interpolate(
        frame,
        [0.3 * fps, 0.8 * fps],
        [24, 0],
        { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
    );

    // Markdown content fade
    const mdOpacity = interpolate(
        frame,
        [0.8 * fps, 1.3 * fps],
        [0, 1],
        { extrapolateRight: "clamp" }
    );

    // Table fade
    const tableOpacity = interpolate(
        frame,
        [1.5 * fps, 2 * fps],
        [0, 1],
        { extrapolateRight: "clamp" }
    );
    const tableY = interpolate(
        frame,
        [1.5 * fps, 2 * fps],
        [16, 0],
        { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
    );

    // Publish button highlight
    const btnScale = interpolate(
        frame,
        [3 * fps, 3.3 * fps, 3.5 * fps],
        [1, 1.05, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const btnGlow = interpolate(
        frame,
        [3 * fps, 3.5 * fps],
        [0, 0.3],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
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
                        background: "#d97706",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: 700,
                    }}
                >
                    3
                </div>
                <div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
                        预览并发布
                    </div>
                    <div style={{ fontSize: 14, color: "#8a8a8a" }}>
                        Markdown 渲染预览，一键发布到目标平台
                    </div>
                </div>
            </div>

            {/* Result card */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    gap: 20,
                    opacity: cardOpacity,
                    transform: `translateY(${cardY}px)`,
                }}
            >
                {/* Content preview */}
                <div
                    style={{
                        flex: 1,
                        background: "#ffffff",
                        border: "1px solid #e8e6e3",
                        borderRadius: 16,
                        padding: 28,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                        overflow: "hidden",
                    }}
                >
                    {/* Title */}
                    <div
                        style={{
                            opacity: mdOpacity,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: "#1a1a1a",
                                marginBottom: 8,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Urban 轻量冲锋衣深度评测：城市通勤最优选
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 20,
                            }}
                        >
                            {["评测", "对比", "冲锋衣", "城市通勤"].map((tag, i) => (
                                <span
                                    key={i}
                                    style={{
                                        padding: "3px 10px",
                                        borderRadius: 10,
                                        fontSize: 11,
                                        background: "#f5f3f0",
                                        color: "#5c5c5c",
                                        border: "1px solid #e8e6e3",
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Fake markdown lines */}
                        <div style={{ borderBottom: "2px solid #e8e6e3", paddingBottom: 16, marginBottom: 16 }}>
                            <div style={{ fontSize: 17, fontWeight: 600, color: "#1a1a1a", marginBottom: 8 }}>
                                一、核心参数对比
                            </div>
                        </div>
                    </div>

                    {/* Comparison table */}
                    <div
                        style={{
                            opacity: tableOpacity,
                            transform: `translateY(${tableY}px)`,
                        }}
                    >
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: 13,
                            }}
                        >
                            <thead>
                                <tr>
                                    {["参数", "Urban", "优衣库", "H&M"].map((h, i) => (
                                        <th
                                            key={i}
                                            style={{
                                                background: "#f5f3f0",
                                                color: "#5c5c5c",
                                                fontWeight: 600,
                                                padding: "10px 14px",
                                                textAlign: "left",
                                                borderBottom: "1px solid #e8e6e3",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.5px",
                                                fontSize: 11,
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ["防水等级", "IPX4", "IPX2", "无"],
                                    ["面料", "GORE-TEX", "涤纶", "棉混纺"],
                                    ["重量", "380g", "520g", "460g"],
                                    ["价格", "¥449", "¥499", "¥399"],
                                ].map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td
                                                key={j}
                                                style={{
                                                    padding: "10px 14px",
                                                    borderBottom: "1px solid #e8e6e3",
                                                    color: j === 0 ? "#5c5c5c" : "#1a1a1a",
                                                    fontWeight: j === 1 ? 600 : 400,
                                                    background: j === 1 ? "rgba(217, 119, 6, 0.04)" : "transparent",
                                                }}
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right sidebar — actions */}
                <div
                    style={{
                        width: 260,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    {/* Publish card */}
                    <div
                        style={{
                            background: "#ffffff",
                            border: "1px solid #e8e6e3",
                            borderRadius: 16,
                            padding: 20,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                        }}
                    >
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#5c5c5c", marginBottom: 12, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
                            发布到平台
                        </div>
                        {["什么值得买", "知乎", "小红书"].map((p, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "10px 0",
                                    borderBottom: i < 2 ? "1px solid #f5f3f0" : "none",
                                }}
                            >
                                <span style={{ fontSize: 14, color: "#1a1a1a" }}>{p}</span>
                                <div
                                    style={{
                                        width: 16,
                                        height: 16,
                                        borderRadius: 4,
                                        border: i === 0 ? "none" : "1px solid #d4d1cc",
                                        background: i === 0 ? "#d97706" : "transparent",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {i === 0 && (
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                            <path d="M20 6L9 17l-5-5" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Publish button */}
                    <div
                        style={{
                            transform: `scale(${btnScale})`,
                            boxShadow: `0 0 ${btnGlow * 60}px rgba(217, 119, 6, ${btnGlow})`,
                            borderRadius: 12,
                        }}
                    >
                        <div
                            style={{
                                background: "linear-gradient(135deg, #d97706, #b45309)",
                                borderRadius: 12,
                                padding: "14px 0",
                                textAlign: "center",
                                color: "#fff",
                                fontSize: 15,
                                fontWeight: 600,
                                letterSpacing: "0.02em",
                            }}
                        >
                            一键发布 →
                        </div>
                    </div>

                    {/* Status */}
                    <div
                        style={{
                            background: "#ffffff",
                            border: "1px solid #e8e6e3",
                            borderRadius: 16,
                            padding: 16,
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                        }}
                    >
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#5c5c5c", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
                            AI 模型覆盖
                        </div>
                        {["DeepSeek", "ChatGPT", "Claude"].map((m, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 6,
                                }}
                            >
                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        background: ["#4f46e5", "#10a37f", "#d97706"][i],
                                    }}
                                />
                                <span style={{ fontSize: 13, color: "#1a1a1a" }}>{m}</span>
                                <span
                                    style={{
                                        marginLeft: "auto",
                                        fontSize: 11,
                                        color: "#059669",
                                        fontWeight: 500,
                                    }}
                                >
                                    ✓ 优化
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
