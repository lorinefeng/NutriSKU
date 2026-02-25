import { AbsoluteFill, useVideoConfig } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { loadFont } from "@remotion/google-fonts/DMSans";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Import } from "./scenes/Scene2Import";
import { Scene3Generate } from "./scenes/Scene3Generate";
import { Scene4Result } from "./scenes/Scene4Result";
import { Scene5Outro } from "./scenes/Scene5Outro";

const { fontFamily } = loadFont("normal", {
    weights: ["400", "500", "600", "700"],
    subsets: ["latin", "latin-ext"],
});

export const DemoVideo = () => {
    const { fps } = useVideoConfig();

    return (
        <AbsoluteFill
            style={{
                backgroundColor: "#faf9f7",
                fontFamily,
            }}
        >
            <TransitionSeries>
                {/* Scene 1: Brand Intro — 4s */}
                <TransitionSeries.Sequence durationInFrames={4 * fps}>
                    <Scene1Intro />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: Math.round(0.5 * fps) })}
                />

                {/* Scene 2: Import product data — 4.5s */}
                <TransitionSeries.Sequence durationInFrames={Math.round(4.5 * fps)}>
                    <Scene2Import />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: Math.round(0.5 * fps) })}
                />

                {/* Scene 3: AI content generation — 5s */}
                <TransitionSeries.Sequence durationInFrames={5 * fps}>
                    <Scene3Generate />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: Math.round(0.5 * fps) })}
                />

                {/* Scene 4: Review result — 4.5s */}
                <TransitionSeries.Sequence durationInFrames={Math.round(4.5 * fps)}>
                    <Scene4Result />
                </TransitionSeries.Sequence>

                <TransitionSeries.Transition
                    presentation={fade()}
                    timing={linearTiming({ durationInFrames: Math.round(0.5 * fps) })}
                />

                {/* Scene 5: Outro with CTA — 4s */}
                <TransitionSeries.Sequence durationInFrames={4 * fps}>
                    <Scene5Outro />
                </TransitionSeries.Sequence>
            </TransitionSeries>
        </AbsoluteFill>
    );
};
