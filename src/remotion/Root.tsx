import React from "react";
import { Composition } from "remotion";
import { SixActVideo } from "./SixActVideo";
import { ProblemStackVideo } from "./ProblemStackVideo";
import { BeforeAfterVideo, TEMPLATE_7_FRAMES } from "./BeforeAfterVideo";
import { MythBusterVideo, TEMPLATE_8_FRAMES } from "./MythBusterVideo";
import { CinematicMinimalVideo, TEMPLATE_10_FRAMES } from "./CinematicMinimalVideo";
import { ProductPromoVideo, TEMPLATE_11_FRAMES } from "./ProductPromoVideo";
import { CuriosityLoopVideo, TEMPLATE_14_FRAMES } from "./CuriosityLoopVideo";
import { SocialProofSandwichVideo, TEMPLATE_17_FRAMES } from "./SocialProofSandwichVideo";
import { DesktopAgentVideo, TEMPLATE_18_FRAMES } from "./DesktopAgentVideo";
import { FounderDemoVideo, TEMPLATE_19_FRAMES } from "./FounderDemoVideo";
import { AnnouncementVideo, TEMPLATE_20_FRAMES } from "./AnnouncementVideo";
import { SaaSPromoVideo, TEMPLATE_21_FRAMES } from "./SaaSPromoVideo";
import { ComparisonVSVideo, TEMPLATE_22_FRAMES } from "./ComparisonVSVideo";
import { TestimonialCarouselVideo, TEMPLATE_23_FRAMES } from "./TestimonialCarouselVideo";
import { MetricsGrowthVideo, TEMPLATE_24_FRAMES } from "./MetricsGrowthVideo";
import { FeatureChangelogVideo, TEMPLATE_25_FRAMES } from "./FeatureChangelogVideo";
import { ExplainerHowItWorksVideo, TEMPLATE_26_FRAMES } from "./ExplainerHowItWorksVideo";
import { LogoRevealVideo, TEMPLATE_27_FRAMES } from "./LogoRevealVideo";
import { PitchDeckVideo, TEMPLATE_28_FRAMES } from "./PitchDeckVideo";
import { AppWalkthroughVideo, TEMPLATE_29_FRAMES } from "./AppWalkthroughVideo";
import { defaultVideoProps, VideoTemplate, VideoFormat, VIDEO_FORMATS } from "./types";
import { FONT_FAMILY } from "./fonts";

export { FONT_FAMILY };

export const TEMPLATE_3_FRAMES = 930;
export const TEMPLATE_4_FRAMES = 552;

const TEMPLATE_FRAMES: Record<number, number> = {
  3: TEMPLATE_3_FRAMES,
  4: TEMPLATE_4_FRAMES,
  7: TEMPLATE_7_FRAMES,
  8: TEMPLATE_8_FRAMES,
  10: TEMPLATE_10_FRAMES,
  11: TEMPLATE_11_FRAMES,
  14: TEMPLATE_14_FRAMES,
  17: TEMPLATE_17_FRAMES,
  18: TEMPLATE_18_FRAMES,
  19: TEMPLATE_19_FRAMES,
  20: TEMPLATE_20_FRAMES,
  21: TEMPLATE_21_FRAMES,
  22: TEMPLATE_22_FRAMES,
  23: TEMPLATE_23_FRAMES,
  24: TEMPLATE_24_FRAMES,
  25: TEMPLATE_25_FRAMES,
  26: TEMPLATE_26_FRAMES,
  27: TEMPLATE_27_FRAMES,
  28: TEMPLATE_28_FRAMES,
  29: TEMPLATE_29_FRAMES,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TEMPLATE_COMPONENTS: Record<number, React.ComponentType<any>> = {
  3: SixActVideo,
  4: ProblemStackVideo,
  7: BeforeAfterVideo,
  8: MythBusterVideo,
  10: CinematicMinimalVideo,
  11: ProductPromoVideo,
  14: CuriosityLoopVideo,
  17: SocialProofSandwichVideo,
  18: DesktopAgentVideo,
  19: FounderDemoVideo,
  20: AnnouncementVideo,
  21: SaaSPromoVideo,
  22: ComparisonVSVideo,
  23: TestimonialCarouselVideo,
  24: MetricsGrowthVideo,
  25: FeatureChangelogVideo,
  26: ExplainerHowItWorksVideo,
  27: LogoRevealVideo,
  28: PitchDeckVideo,
  29: AppWalkthroughVideo,
};

const TEMPLATE_IDS: Record<number, string> = {
  3: "SixActVideo",
  4: "ProblemStackVideo",
  7: "BeforeAfterVideo",
  8: "MythBusterVideo",
  10: "CinematicMinimalVideo",
  11: "ProductPromoVideo",
  14: "CuriosityLoopVideo",
  17: "SocialProofSandwichVideo",
  18: "DesktopAgentVideo",
  19: "FounderDemoVideo",
  20: "AnnouncementVideo",
  21: "SaaSPromoVideo",
  22: "ComparisonVSVideo",
  23: "TestimonialCarouselVideo",
  24: "MetricsGrowthVideo",
  25: "FeatureChangelogVideo",
  26: "ExplainerHowItWorksVideo",
  27: "LogoRevealVideo",
  28: "PitchDeckVideo",
  29: "AppWalkthroughVideo",
};

export function getFramesForTemplate(template: VideoTemplate): number {
  return TEMPLATE_FRAMES[template] ?? TEMPLATE_3_FRAMES;
}

export function getCompositionId(template: VideoTemplate, format: VideoFormat = "landscape"): string {
  const base = TEMPLATE_IDS[template] ?? "SixActVideo";
  if (format === "landscape") return base;
  return `${base}-${format}`;
}

export const ALL_TEMPLATES: VideoTemplate[] = [3, 4, 7, 8, 10, 11, 14, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];

export const RemotionRoot: React.FC = () => {
  const formats: VideoFormat[] = ["landscape", "vertical", "square"];

  return (
    <>
      {ALL_TEMPLATES.map((templateNum) => {
        const Component = TEMPLATE_COMPONENTS[templateNum];
        const frames = TEMPLATE_FRAMES[templateNum];
        const baseId = TEMPLATE_IDS[templateNum];
        if (!Component || !frames || !baseId) return null;

        return formats.map((format) => {
          const { width, height } = VIDEO_FORMATS[format];
          const id = format === "landscape" ? baseId : `${baseId}-${format}`;
          return (
            <Composition
              key={id}
              id={id}
              component={Component}
              durationInFrames={frames}
              fps={30}
              width={width}
              height={height}
              defaultProps={defaultVideoProps}
            />
          );
        });
      })}
    </>
  );
};
