import { NextRequest, NextResponse } from "next/server";
import path from "path";
import os from "os";
import fs from "fs";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const videoProps = await req.json();
    const template = videoProps.template ?? 3;
    const format = videoProps.format ?? "landscape";
    const outputFormat: "mp4" | "gif" = videoProps.outputFormat === "gif" ? "gif" : "mp4";

    const { bundle } = await import("@remotion/bundler");
    const { renderMedia, selectComposition } = await import(
      "@remotion/renderer"
    );

    const baseIds: Record<number, string> = {
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

    const baseId = baseIds[template] ?? "SixActVideo";
    const compositionId = format === "landscape" ? baseId : `${baseId}-${format}`;

    const outputDir = path.join(os.tmpdir(), "launchclip");
    fs.mkdirSync(outputDir, { recursive: true });
    const fileExt = outputFormat === "gif" ? "gif" : "mp4";
    const outputPath = path.join(outputDir, `${Date.now()}.${fileExt}`);

    const entryPoint = path.join(
      process.cwd(),
      "src",
      "remotion",
      "index.tsx"
    );

    const bundleLocation = await bundle({
      entryPoint,
      webpackOverride: (config) => config,
    });

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
      inputProps: videoProps,
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: outputFormat === "gif" ? "gif" : "h264",
      outputLocation: outputPath,
      inputProps: videoProps,
      onProgress: ({ progress }) => {
        console.log(`[render] Progress: ${Math.round(progress * 100)}%`);
      },
    });

    const videoBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(outputPath);

    const contentType = outputFormat === "gif" ? "image/gif" : "video/mp4";
    const fileName = outputFormat === "gif" ? "launch-video.gif" : "launch-video.mp4";

    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": String(videoBuffer.length),
      },
    });
  } catch (error) {
    console.error("[render]", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Render failed",
        hint: "Make sure ffmpeg is installed and REMOTION_CHROME_EXECUTABLE is set if needed.",
      },
      { status: 500 }
    );
  }
}
