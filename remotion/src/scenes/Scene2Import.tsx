import {
    AbsoluteFill,
    useCurrentFrame,
    useVideoConfig,
    interpolate,
    Easing,
} from "remotion";

// Simulated product data rows
const products = [
    { name: "Urban 轻量冲锋衣", sku: "JK-2024-001", price: "¥449" },
    { name: "Metro 城市风衣", sku: "JK-2024-002", price: "¥599" },
    { name: "Flex 弹力牛仔裤", sku: "JK-2024-003", price: "¥329" },
];

export const Scene2Import = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Header fade
    const headerOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
        extrapolateRight: "clamp",
    });

    // Workbench container slide up
    const containerY = interpolate(
        frame,
        [0.3 * fps, 1 * fps],
        [40, 0],
        { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
    );
    const containerOpacity = interpolate(
        frame,
        [0.3 * fps, 1 * fps],
        [0, 1],
        { extrapolateRight: "clamp" }
    );

    // Typing animation for search/input bar
    const inputText = "ZARA Urban 轻量冲锋衣 2024秋季新款";
    const typedLength = Math.floor(
        interpolate(frame, [1.2 * fps, 3 * fps], [0, inputText.length], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
        })
    );

    // Cursor blink
    const cursorOpacity = Math.sin(frame * 0.15) > 0 ? 1 : 0;

    // Row animations — staggered entrance
    const getRowOpacity = (i: number) =>
        interpolate(
            frame,
            [2.5 * fps + i * 0.3 * fps, 3 * fps + i * 0.3 * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
    const getRowY = (i: number) =>
        interpolate(
            frame,
            [2.5 * fps + i * 0.3 * fps, 3 * fps + i * 0.3 * fps],
            [12, 0],
            {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
            }
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
                    1
                </div>
                <div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: "#1a1a1a", letterSpacing: "-0.02em" }}>
                        导入商品数据
                    </div>
                    <div style={{ fontSize: 14, color: "#8a8a8a" }}>
                        选择 SKU 模式，输入商品信息或批量导入
                    </div>
                </div>
            </div>

            {/* Mock workbench UI */}
            <div
                style={{
                    opacity: containerOpacity,
                    transform: `translateY(${containerY}px)`,
                    flex: 1,
                    background: "#ffffff",
                    border: "1px solid #e8e6e3",
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
                }}
            >
                {/* Tab bar */}
                <div
                    style={{
                        display: "flex",
                        borderBottom: "1px solid #e8e6e3",
                        background: "#f5f3f0",
                        padding: "0 24px",
                    }}
                >
                    <div
                        style={{
                            padding: "14px 20px",
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#d97706",
                            borderBottom: "2px solid #d97706",
                        }}
                    >
                        SKU 模式
                    </div>
                    <div
                        style={{
                            padding: "14px 20px",
                            fontSize: 14,
                            color: "#8a8a8a",
                        }}
                    >
                        品牌 IP 模式
                    </div>
                </div>

                <div style={{ padding: 28 }}>
                    {/* Input field */}
                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <div style={{ fontSize: 13, fontWeight: 500, color: "#5c5c5c", marginBottom: 8, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
                            商品名称
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "12px 16px",
                                background: "#ffffff",
                                border: frame >= 1.2 * fps ? "1px solid #d97706" : "1px solid #e8e6e3",
                                borderRadius: 10,
                                fontSize: 16,
                                color: "#1a1a1a",
                                boxShadow: frame >= 1.2 * fps ? "0 0 0 2px rgba(217, 119, 6, 0.1)" : "none",
                            }}
                        >
                            <span>{inputText.slice(0, typedLength)}</span>
                            <span
                                style={{
                                    opacity: typedLength < inputText.length ? cursorOpacity : 0,
                                    width: 2,
                                    height: 20,
                                    background: "#d97706",
                                    marginLeft: 1,
                                    display: "inline-block",
                                }}
                            />
                        </div>
                    </div>

                    {/* Product list */}
                    <div style={{ fontSize: 13, fontWeight: 500, color: "#5c5c5c", marginBottom: 12, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
                        已导入商品
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {products.map((p, i) => (
                            <div
                                key={i}
                                style={{
                                    opacity: getRowOpacity(i),
                                    transform: `translateY(${getRowY(i)}px)`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "14px 18px",
                                    background: "#f5f3f0",
                                    borderRadius: 10,
                                    border: "1px solid #e8e6e3",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 8,
                                            background: "linear-gradient(135deg, #f5f3f0, #e8e6e3)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 18,
                                        }}
                                    >
                                        👔
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 15, fontWeight: 500, color: "#1a1a1a" }}>
                                            {p.name}
                                        </div>
                                        <div style={{ fontSize: 12, color: "#8a8a8a" }}>{p.sku}</div>
                                    </div>
                                </div>
                                <div style={{ fontSize: 16, fontWeight: 600, color: "#d97706" }}>
                                    {p.price}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AbsoluteFill>
    );
};
