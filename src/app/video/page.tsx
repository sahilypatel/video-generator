"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { VideoProps, VideoTemplate, VideoFormat, VIDEO_FORMATS, defaultVideoProps } from "@/remotion/types";
import { getFramesForTemplate, ALL_TEMPLATES } from "@/remotion/Root";

const Player = dynamic(
  () => import("@remotion/player").then((m) => m.Player),
  { ssr: false }
);

const ThumbnailComp = dynamic(
  () => import("@remotion/player").then((m) => m.Thumbnail),
  { ssr: false }
);

const SixActVideoComponent = dynamic(() => import("@/remotion/SixActVideo").then((m) => m.SixActVideo), { ssr: false });
const ProblemStackVideoComponent = dynamic(() => import("@/remotion/ProblemStackVideo").then((m) => m.ProblemStackVideo), { ssr: false });
const BeforeAfterVideoComponent = dynamic(() => import("@/remotion/BeforeAfterVideo").then((m) => m.BeforeAfterVideo), { ssr: false });
const MythBusterVideoComponent = dynamic(() => import("@/remotion/MythBusterVideo").then((m) => m.MythBusterVideo), { ssr: false });
const CinematicMinimalVideoComponent = dynamic(() => import("@/remotion/CinematicMinimalVideo").then((m) => m.CinematicMinimalVideo), { ssr: false });
const ProductPromoVideoComponent = dynamic(() => import("@/remotion/ProductPromoVideo").then((m) => m.ProductPromoVideo), { ssr: false });
const CuriosityLoopVideoComponent = dynamic(() => import("@/remotion/CuriosityLoopVideo").then((m) => m.CuriosityLoopVideo), { ssr: false });
const SocialProofSandwichVideoComponent = dynamic(() => import("@/remotion/SocialProofSandwichVideo").then((m) => m.SocialProofSandwichVideo), { ssr: false });
const DesktopAgentVideoComponent = dynamic(() => import("@/remotion/DesktopAgentVideo").then((m) => m.DesktopAgentVideo), { ssr: false });
const FounderDemoVideoComponent = dynamic(() => import("@/remotion/FounderDemoVideo").then((m) => m.FounderDemoVideo), { ssr: false });
const AnnouncementVideoComponent = dynamic(() => import("@/remotion/AnnouncementVideo").then((m) => m.AnnouncementVideo), { ssr: false });
const SaaSPromoVideoComponent = dynamic(() => import("@/remotion/SaaSPromoVideo").then((m) => m.SaaSPromoVideo), { ssr: false });
const ComparisonVSVideoComponent = dynamic(() => import("@/remotion/ComparisonVSVideo").then((m) => m.ComparisonVSVideo), { ssr: false });
const TestimonialCarouselVideoComponent = dynamic(() => import("@/remotion/TestimonialCarouselVideo").then((m) => m.TestimonialCarouselVideo), { ssr: false });
const MetricsGrowthVideoComponent = dynamic(() => import("@/remotion/MetricsGrowthVideo").then((m) => m.MetricsGrowthVideo), { ssr: false });
const FeatureChangelogVideoComponent = dynamic(() => import("@/remotion/FeatureChangelogVideo").then((m) => m.FeatureChangelogVideo), { ssr: false });
const ExplainerHowItWorksVideoComponent = dynamic(() => import("@/remotion/ExplainerHowItWorksVideo").then((m) => m.ExplainerHowItWorksVideo), { ssr: false });
const LogoRevealVideoComponent = dynamic(() => import("@/remotion/LogoRevealVideo").then((m) => m.LogoRevealVideo), { ssr: false });
const PitchDeckVideoComponent = dynamic(() => import("@/remotion/PitchDeckVideo").then((m) => m.PitchDeckVideo), { ssr: false });
const AppWalkthroughVideoComponent = dynamic(() => import("@/remotion/AppWalkthroughVideo").then((m) => m.AppWalkthroughVideo), { ssr: false });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const VIDEO_COMPONENTS: Record<number, any> = {
  3: SixActVideoComponent,
  4: ProblemStackVideoComponent,
  7: BeforeAfterVideoComponent,
  8: MythBusterVideoComponent,
  10: CinematicMinimalVideoComponent,
  11: ProductPromoVideoComponent,
  14: CuriosityLoopVideoComponent,
  17: SocialProofSandwichVideoComponent,
  18: DesktopAgentVideoComponent,
  19: FounderDemoVideoComponent,
  20: AnnouncementVideoComponent,
  21: SaaSPromoVideoComponent,
  22: ComparisonVSVideoComponent,
  23: TestimonialCarouselVideoComponent,
  24: MetricsGrowthVideoComponent,
  25: FeatureChangelogVideoComponent,
  26: ExplainerHowItWorksVideoComponent,
  27: LogoRevealVideoComponent,
  28: PitchDeckVideoComponent,
  29: AppWalkthroughVideoComponent,
};

type TemplateCategory = "all" | "marketing" | "social-proof" | "product" | "brand" | "data";

const TEMPLATE_INFO: Record<number, { name: string; time: string; category: TemplateCategory[]; description: string }> = {
  3: { name: "6-Act", time: "~31s", category: ["marketing"], description: "Classic 6-act story arc" },
  4: { name: "Problem Stack", time: "~18s", category: ["marketing"], description: "Pain points pile up, then vanish" },
  7: { name: "Before/After", time: "~24s", category: ["marketing"], description: "Dramatic transformation reveal" },
  8: { name: "Myth Buster", time: "~28s", category: ["marketing"], description: "Challenge false beliefs" },
  10: { name: "Cinematic", time: "~25s", category: ["brand"], description: "Apple-style minimal reveal" },
  11: { name: "Product Promo", time: "~40s", category: ["marketing", "product"], description: "Full product showcase" },
  14: { name: "Curiosity Loop", time: "~29s", category: ["marketing"], description: "Tease → Intrigue → Reveal" },
  17: { name: "Social Proof", time: "~35s", category: ["social-proof"], description: "Proof → Product → Proof" },
  18: { name: "App Showcase", time: "~27s", category: ["product"], description: "macOS-style app demo" },
  19: { name: "Founder Demo", time: "~40s", category: ["product"], description: "Founder-led walkthrough" },
  20: { name: "Announcement", time: "~29s", category: ["brand"], description: "Typewriter title cards" },
  21: { name: "SaaS Promo", time: "~25s", category: ["marketing"], description: "Dark kinetic SaaS promo" },
  22: { name: "Comparison", time: "~25s", category: ["marketing"], description: "Us vs Them side-by-side" },
  23: { name: "Testimonials", time: "~27s", category: ["social-proof"], description: "Customer quote carousel" },
  24: { name: "Metrics", time: "~27s", category: ["data", "social-proof"], description: "Growth stats & counters" },
  25: { name: "Changelog", time: "~22s", category: ["product"], description: "What's New feature cards" },
  26: { name: "How It Works", time: "~30s", category: ["product"], description: "Step-by-step explainer" },
  27: { name: "Logo Reveal", time: "~15s", category: ["brand"], description: "Cinematic brand intro" },
  28: { name: "Pitch Deck", time: "~35s", category: ["data"], description: "Investor-ready pitch" },
  29: { name: "App Tour", time: "~30s", category: ["product"], description: "Browser walkthrough" },
};

const TEMPLATE_PREVIEW_FRAMES: Record<number, number> = {
  3: 510,
  4: 150,
  7: 300,
  8: 330,
  10: 420,
  11: 330,
  14: 375,
  17: 465,
  18: 340,
  19: 555,
  20: 630,
  21: 255,
  22: 480,
  23: 330,
  24: 435,
  25: 270,
  26: 570,
  27: 153,
  28: 420,
  29: 375,
};

const CATEGORIES: { id: TemplateCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "marketing", label: "Marketing" },
  { id: "product", label: "Product" },
  { id: "social-proof", label: "Social Proof" },
  { id: "brand", label: "Brand" },
  { id: "data", label: "Data & Metrics" },
];

function getVideoDurationLabel(template: VideoTemplate, format: VideoFormat) {
  const info = TEMPLATE_INFO[template];
  const fmt = VIDEO_FORMATS[format];
  return `${fmt.width}×${fmt.height} · 30fps · ${info?.time ?? "~30s"}`;
}

type Step = "input" | "scraping" | "customize" | "generating" | "preview" | "rendering";

function VideoPageContent() {
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get("url") ?? "";
  const initialTemplate = (parseInt(searchParams.get("template") ?? "3") || 3) as VideoTemplate;

  const [url, setUrl] = useState(initialUrl);
  const [template, setTemplate] = useState<VideoTemplate>(
    ALL_TEMPLATES.includes(initialTemplate) ? initialTemplate : 3
  );
  const [format, setFormat] = useState<VideoFormat>("landscape");
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState<string | null>(null);
  const [videoProps, setVideoProps] = useState<VideoProps>({ ...defaultVideoProps, template });
  const [renderProgress, setRenderProgress] = useState(0);
  const [scrapedData, setScrapedData] = useState<Record<string, unknown> | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory>("all");
  const [recommendation, setRecommendation] = useState<{ recommended: number; reason: string; alternatives: number[] } | null>(null);
  const [exportFormat, setExportFormat] = useState<"mp4" | "gif">("mp4");

  const handleScrape = useCallback(async () => {
    if (!url.trim()) return;
    setError(null);
    try {
      setStep("scraping");
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!scrapeRes.ok) {
        const err = await scrapeRes.json();
        throw new Error(err.error ?? "Scraping failed");
      }
      const scraped = await scrapeRes.json();
      setScrapedData(scraped);

      // Apply extracted brand color if available
      if (scraped.primaryColor) {
        setVideoProps((p) => ({ ...p, accentColor: scraped.primaryColor }));
      }

      // Fire AI recommendation in background
      fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scraped),
      })
        .then((r) => r.ok ? r.json() : null)
        .then((rec) => {
          if (rec?.recommended) {
            setRecommendation(rec);
            if (ALL_TEMPLATES.includes(rec.recommended)) {
              setTemplate(rec.recommended as VideoTemplate);
            }
          }
        })
        .catch(() => {});

      setStep("customize");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    }
  }, [url]);

  const handleGenerateScript = useCallback(async () => {
    if (!scrapedData) return;
    setError(null);
    try {
      setStep("generating");
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...scrapedData, url, template }),
      });
      if (!genRes.ok) {
        const err = await genRes.json();
        throw new Error(err.error ?? "Generation failed");
      }
      const script = await genRes.json();
      const normalizedTitleCardsForAnnouncement =
        template === 20
          ? (() => {
              const cards =
                Array.isArray(script.titleCards) && script.titleCards.length > 0
                  ? [...script.titleCards]
                  : [{ line1: "", line2: "" }];
              const hookLine = typeof script.hook === "string" ? script.hook.trim() : "";
              if (hookLine) cards[0] = { ...cards[0], line1: hookLine };
              return cards;
            })()
          : script.titleCards;
      setVideoProps({ ...script, template, format, titleCards: normalizedTitleCardsForAnnouncement });
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("customize");
    }
  }, [scrapedData, url, template, format]);

  useEffect(() => {
    if (initialUrl && step === "input") handleScrape();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExport = useCallback(async (overrideFormat?: "mp4" | "gif") => {
    const outputFormat = overrideFormat ?? exportFormat;
    setStep("rendering");
    setRenderProgress(0);
    setError(null);
    const interval = setInterval(() => {
      setRenderProgress((p) => Math.min(p + 2, 90));
    }, 1000);
    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...videoProps, template, format, outputFormat }),
      });
      clearInterval(interval);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Render failed");
      }
      setRenderProgress(100);
      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      const ext = outputFormat === "gif" ? "gif" : "mp4";
      a.download = `${videoProps.companyName.toLowerCase().replace(/\s+/g, "-")}-launch.${ext}`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Render failed");
    } finally {
      setStep("preview");
    }
  }, [videoProps, template, format, exportFormat]);

  const updateField = (key: keyof VideoProps, value: string) => {
    setVideoProps((prev) => {
      const next = { ...prev, [key]: value };
      if (template === 20 && key === "hook") {
        const cards = [...(next.titleCards ?? [])];
        if (cards.length === 0) cards.push({ line1: value, line2: "" });
        else cards[0] = { ...cards[0], line1: value };
        next.titleCards = cards;
      }
      return next;
    });
  };

  const filteredTemplates = ALL_TEMPLATES.filter((t) => {
    if (categoryFilter === "all") return true;
    return TEMPLATE_INFO[t]?.category.includes(categoryFilter);
  });

  const thumbnailProps = useMemo(
    () => ({
      ...defaultVideoProps,
      accentColor: videoProps.accentColor || defaultVideoProps.accentColor,
    }),
    [videoProps.accentColor]
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6]" style={{ fontFamily: "'Sora', sans-serif" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/viral-video.html" className="flex items-center gap-2 text-black font-semibold text-xl">
            <svg className="w-6 h-6" viewBox="0 0 100 100" fill="currentColor">
              <rect x="35" y="8" width="30" height="5" rx="2.5"/>
              <rect x="22" y="18" width="22" height="5" rx="2.5"/>
              <rect x="56" y="18" width="22" height="5" rx="2.5"/>
              <rect x="14" y="28" width="20" height="5" rx="2.5"/>
              <rect x="66" y="28" width="20" height="5" rx="2.5"/>
              <rect x="8" y="48" width="18" height="5" rx="2.5"/>
              <rect x="38" y="48" width="24" height="5" rx="2.5"/>
              <rect x="74" y="48" width="18" height="5" rx="2.5"/>
              <rect x="35" y="88" width="30" height="5" rx="2.5"/>
            </svg>
            <span>Okara</span>
            <span className="text-gray-300 mx-1">/</span>
            <span className="text-gray-500 font-medium">LaunchClip</span>
          </a>
          {step === "preview" && (
            <button
              onClick={() => handleExport("mp4")}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #FF8C68, #FF5E68)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export MP4
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Input step */}
        {step === "input" && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
                style={{ background: "linear-gradient(135deg, rgba(255,140,104,0.15), rgba(255,94,104,0.15))", border: "1px solid rgba(255,94,104,0.3)", color: "#FF5E68" }}>
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: "linear-gradient(135deg, #FF8C68, #FF5E68)" }} />
                Paste URL &rarr; Get viral launch video
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-4">
                What&apos;s your startup&apos;s URL?
              </h1>
              <p className="text-lg text-gray-500 max-w-lg mx-auto">
                We&apos;ll scrape your site, write cinematic copy, and render a viral product launch video.
              </p>
            </div>
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 p-3 flex gap-3">
                <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-xl px-4 py-3">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScrape()}
                    placeholder="https://yourstartup.com"
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-400 text-base font-medium outline-none"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleScrape}
                  disabled={!url.trim()}
                  className="px-6 py-3 rounded-xl font-semibold text-base text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #FF8C68, #FF5E68)" }}
                >
                  Generate &rarr;
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
              )}
              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  Smart web scraping
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  AI-written script
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  20 template styles
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Customize step */}
        {step === "customize" && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
                style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.18))", border: "1px solid rgba(16,185,129,0.3)", color: "#059669" }}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Website scraped successfully
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-3">
                Choose your video style
              </h1>
              <p className="text-base text-gray-500 max-w-lg mx-auto">
                Pick a template and format for your video.
              </p>
            </div>

            <div className="w-full max-w-4xl space-y-8">
              {/* Format selector */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">Video Format</p>
                <div className="flex items-center justify-center gap-3">
                  {(["landscape", "vertical", "square"] as VideoFormat[]).map((f) => {
                    const fmtInfo = VIDEO_FORMATS[f];
                    const icons: Record<string, React.ReactNode> = {
                      landscape: <div className="w-8 h-5 rounded border-2" style={{ borderColor: format === f ? "#FF5E68" : "#d1d5db" }} />,
                      vertical: <div className="w-4 h-7 rounded border-2" style={{ borderColor: format === f ? "#FF5E68" : "#d1d5db" }} />,
                      square: <div className="w-6 h-6 rounded border-2" style={{ borderColor: format === f ? "#FF5E68" : "#d1d5db" }} />,
                    };
                    return (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`flex flex-col items-center gap-2 px-5 py-3 rounded-xl transition-all ${format === f ? "shadow-sm" : "hover:bg-gray-50"}`}
                        style={{
                          border: `1.5px solid ${format === f ? "rgba(255,94,104,0.5)" : "#e5e7eb"}`,
                          background: format === f ? "linear-gradient(135deg, rgba(255,140,104,0.08), rgba(255,94,104,0.08))" : "white",
                        }}
                      >
                        {icons[f]}
                        <span className={`text-xs font-semibold ${format === f ? "text-[#FF5E68]" : "text-gray-500"}`}>
                          {fmtInfo.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* AI Recommendation */}
              {recommendation && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span className="text-sm font-semibold text-purple-700">AI Recommended</span>
                  </div>
                  <p className="text-sm text-purple-600 mb-2">{recommendation.reason}</p>
                  <div className="flex items-center gap-2 text-xs text-purple-400">
                    <span>Also consider:</span>
                    {recommendation.alternatives.map((alt) => (
                      <button
                        key={alt}
                        onClick={() => setTemplate(alt as VideoTemplate)}
                        className="px-2 py-0.5 rounded bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors font-medium"
                      >
                        {TEMPLATE_INFO[alt]?.name ?? `#${alt}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category filter */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">Category</p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        categoryFilter === cat.id
                          ? "text-[#FF5E68] bg-[rgba(255,94,104,0.08)] border-[rgba(255,94,104,0.3)]"
                          : "text-gray-500 bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                      style={{ border: `1px solid ${categoryFilter === cat.id ? "rgba(255,94,104,0.3)" : "#e5e7eb"}` }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template grid */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 text-center">Video Template</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredTemplates.map((s) => (
                    <TemplateThumbnail
                      key={s}
                      templateId={s}
                      isSelected={template === s}
                      onSelect={() => setTemplate(s as VideoTemplate)}
                      isRecommended={recommendation?.recommended === s}
                      previewProps={thumbnailProps}
                    />
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <div className="flex flex-col items-center gap-3 pt-2">
                <button
                  onClick={handleGenerateScript}
                  className="px-8 py-3.5 rounded-xl font-semibold text-base text-white transition-all hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, #FF8C68, #FF5E68)" }}
                >
                  Generate Video &rarr;
                </button>
                <button
                  onClick={() => { setStep("input"); setScrapedData(null); }}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  &larr; Change URL
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">{error}</div>
              )}
            </div>
          </div>
        )}

        {/* Scraping loading state */}
        {step === "scraping" && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="relative w-20 h-20">
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0%, #FF8C68 50%, transparent 100%)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))",
                }}
              />
              <div className="absolute inset-2 rounded-full bg-[#FAF9F6] flex items-center justify-center">
                <svg className="w-7 h-7 text-[#FF8C68]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black mb-2">Scraping your website...</h2>
              <p className="text-gray-500">We&apos;re extracting your logo, copy, and product details</p>
            </div>
            <StepIndicator current={1} />
          </div>
        )}

        {/* Generating loading state */}
        {step === "generating" && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="relative w-20 h-20">
              <div
                className="absolute inset-0 rounded-full animate-spin"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0%, #FF8C68 50%, transparent 100%)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px))",
                }}
              />
              <div className="absolute inset-2 rounded-full bg-[#FAF9F6] flex items-center justify-center">
                <svg className="w-7 h-7 text-[#FF8C68]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black mb-2">Writing your video script...</h2>
              <p className="text-gray-500">We&apos;re crafting hooks, scenes, and a viral CTA</p>
            </div>
            <StepIndicator current={3} />
          </div>
        )}

        {/* Preview step */}
        {step === "preview" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-black">Your launch video is ready</h1>
                <p className="text-gray-500 text-sm mt-1">Preview below. Edit any field, then export your MP4.</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setStep("input"); setUrl(""); setScrapedData(null); setRecommendation(null); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  &larr; New video
                </button>
                <button
                  onClick={() => handleExport("mp4")}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, #FF8C68, #FF5E68)" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Export MP4
                </button>
                <button
                  onClick={() => handleExport("gif")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="m21 15-5-5L5 21"/>
                  </svg>
                  GIF
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Player */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-800/20">
                  <Suspense fallback={
                    <div className="aspect-video bg-gray-900 flex items-center justify-center">
                      <div className="text-white/50 text-sm">Loading player...</div>
                    </div>
                  }>
                    {(() => {
                      const VideoComp = VIDEO_COMPONENTS[template];
                      const frames = getFramesForTemplate(template);
                      const { width, height } = VIDEO_FORMATS[format];
                      return VideoComp ? (
                        <Player
                          component={VideoComp}
                          inputProps={videoProps as unknown as Record<string, unknown>}
                          durationInFrames={frames}
                          fps={30}
                          compositionWidth={width}
                          compositionHeight={height}
                          style={{ width: "100%", borderRadius: 16 }}
                          controls
                          autoPlay
                          loop
                        />
                      ) : null;
                    })()}
                  </Suspense>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">{getVideoDurationLabel(template, format)}</p>
              </div>

              {/* Script editor */}
              <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Edit Script</h3>

                <ScriptEditor label="Company Name" value={videoProps.companyName} onChange={(v) => updateField("companyName", v)} />
                <ScriptEditor label="Tagline" value={videoProps.tagline} onChange={(v) => updateField("tagline", v)} />
                <ScriptEditor label="Hook" value={videoProps.hook} onChange={(v) => updateField("hook", v)} multiline />
                <ScriptEditor label="Problem" value={videoProps.problem} onChange={(v) => updateField("problem", v)} multiline />
                <ScriptEditor label="Solution" value={videoProps.solution} onChange={(v) => updateField("solution", v)} multiline />
                <ScriptEditor label="CTA" value={videoProps.cta} onChange={(v) => updateField("cta", v)} />
                <ScriptEditor label="Website URL" value={videoProps.websiteUrl} onChange={(v) => updateField("websiteUrl", v)} />

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Logo</label>
                  <div className="flex items-center gap-3">
                    {videoProps.logoUrl ? (
                      <img src={videoProps.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-lg border border-gray-200 bg-white p-1" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">?</div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="text-sm text-center py-2 px-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-600 font-medium">
                        {videoProps.logoUrl ? "Change logo" : "Upload logo"}
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => setVideoProps((p) => ({ ...p, logoUrl: reader.result as string }));
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                    {videoProps.logoUrl && (
                      <button onClick={() => setVideoProps((p) => ({ ...p, logoUrl: null }))} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Remove</button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={videoProps.accentColor} onChange={(e) => updateField("accentColor", e.target.value)} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
                    <span className="text-sm text-gray-500 font-mono">{videoProps.accentColor}</span>
                  </div>
                </div>

                {/* Audio Settings */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                    </svg>
                    Audio
                  </h4>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Background Music</label>
                    <div className="flex gap-2">
                      {(["ambient", "upbeat", "cinematic", "none"] as const).map((track) => (
                        <button
                          key={track}
                          onClick={() => setVideoProps((p) => ({ ...p, musicTrack: track }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            (videoProps.musicTrack ?? "ambient") === track
                              ? "bg-[#FF8C68]/10 text-[#FF5E68] border-[#FF8C68]/30"
                              : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                          }`}
                          style={{ border: `1px solid ${(videoProps.musicTrack ?? "ambient") === track ? "rgba(255,140,104,0.3)" : "#e5e7eb"}` }}
                        >
                          {track === "none" ? "Off" : track.charAt(0).toUpperCase() + track.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(videoProps.musicTrack ?? "ambient") !== "none" && (
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Music Volume</label>
                      <input
                        type="range"
                        min="0"
                        max="0.5"
                        step="0.05"
                        value={videoProps.musicVolume ?? 0.15}
                        onChange={(e) => setVideoProps((p) => ({ ...p, musicVolume: parseFloat(e.target.value) }))}
                        className="w-full accent-[#FF8C68]"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-500">Sound Effects</label>
                    <button
                      onClick={() => setVideoProps((p) => ({ ...p, sfxEnabled: !(p.sfxEnabled ?? true) }))}
                      className={`relative w-9 h-5 rounded-full transition-colors ${(videoProps.sfxEnabled ?? true) ? "bg-[#FF8C68]" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${(videoProps.sfxEnabled ?? true) ? "left-[18px]" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Features</h4>
                  <div className="space-y-3">
                    {videoProps.features.map((f, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                        <div className="flex items-center gap-2">
                          <input type="text" value={f.icon} onChange={(e) => {
                            const features = [...videoProps.features];
                            features[i] = { ...features[i], icon: e.target.value };
                            setVideoProps((p) => ({ ...p, features }));
                          }} className="w-10 text-center text-lg bg-white rounded-lg border border-gray-200 p-1" />
                          <input type="text" value={f.title} onChange={(e) => {
                            const features = [...videoProps.features];
                            features[i] = { ...features[i], title: e.target.value };
                            setVideoProps((p) => ({ ...p, features }));
                          }} className="flex-1 text-sm font-semibold bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                        </div>
                        <input type="text" value={f.description} onChange={(e) => {
                          const features = [...videoProps.features];
                          features[i] = { ...features[i], description: e.target.value };
                          setVideoProps((p) => ({ ...p, features }));
                        }} className="w-full text-xs text-gray-500 bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Template-specific fields */}
                <TemplateFields template={template} videoProps={videoProps} setVideoProps={setVideoProps} />
              </div>
            </div>
          </div>
        )}

        {/* Rendering step */}
        {step === "rendering" && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
              style={{ background: "linear-gradient(135deg, rgba(255,140,104,0.15), rgba(255,94,104,0.15))", border: "1px solid rgba(255,94,104,0.2)" }}>
              🎬
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black mb-2">Rendering your MP4...</h2>
              <p className="text-gray-500">We&apos;re encoding each frame. This takes 1-2 minutes.</p>
            </div>
            <div className="w-full max-w-sm">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Encoding frames</span>
                <span className="font-semibold" style={{ color: "#FF8C68" }}>{renderProgress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${renderProgress}%`, background: "linear-gradient(90deg, #FF8C68, #FF5E68)" }} />
              </div>
            </div>
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm max-w-sm text-center">
                <p className="font-semibold mb-1">Render failed</p>
                <p>{error}</p>
                <p className="mt-2 text-xs text-red-400">Make sure ffmpeg is installed: brew install ffmpeg</p>
                <button onClick={() => setStep("preview")} className="mt-3 text-xs underline text-red-500">&larr; Back to preview</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function TemplateThumbnail({
  templateId,
  isSelected,
  onSelect,
  isRecommended,
  previewProps,
}: {
  templateId: number;
  isSelected: boolean;
  onSelect: () => void;
  isRecommended: boolean;
  previewProps: VideoProps;
}) {
  const info = TEMPLATE_INFO[templateId];
  const VideoComp = VIDEO_COMPONENTS[templateId];
  const totalFrames = getFramesForTemplate(templateId as VideoTemplate);
  const [isHovering, setIsHovering] = useState(false);
  const [playFrame, setPlayFrame] = useState<number | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const stillFrame = TEMPLATE_PREVIEW_FRAMES[templateId] ?? Math.floor(totalFrames * 0.45);
  const displayFrame = playFrame ?? stillFrame;

  useEffect(() => {
    if (!isHovering) {
      cancelAnimationFrame(rafRef.current);
      setPlayFrame(null);
      return;
    }

    startTimeRef.current = performance.now();

    const animate = () => {
      const elapsed = performance.now() - startTimeRef.current;
      const frame = Math.floor(elapsed / (1000 / 30)) % totalFrames;
      setPlayFrame(frame);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isHovering, totalFrames]);

  if (!info || !VideoComp) return null;

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`group relative flex flex-col rounded-2xl overflow-hidden text-left transition-all duration-200 ${
        isSelected
          ? "shadow-lg scale-[1.02]"
          : "hover:shadow-xl hover:-translate-y-1"
      }`}
      style={{
        border: `2px solid ${isSelected ? "rgba(255,94,104,0.6)" : "transparent"}`,
        background: isSelected
          ? "linear-gradient(135deg, rgba(255,140,104,0.05), rgba(255,94,104,0.05))"
          : "white",
        boxShadow: isSelected
          ? "0 8px 30px rgba(255,94,104,0.15), 0 0 0 1px rgba(255,94,104,0.1)"
          : undefined,
      }}
    >
      {isRecommended && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/90 text-white backdrop-blur-sm shadow-sm">
          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          AI Pick
        </div>
      )}

      <div className="relative aspect-video bg-[#0A0A0A] overflow-hidden">
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border-2 border-gray-700 border-t-gray-400 animate-spin" />
            </div>
          }
        >
          <ThumbnailComp
            component={VideoComp}
            inputProps={previewProps as unknown as Record<string, unknown>}
            compositionWidth={1920}
            compositionHeight={1080}
            durationInFrames={totalFrames}
            fps={30}
            frameToDisplay={displayFrame}
            style={{ width: "100%", height: "100%" }}
          />
        </Suspense>

        {isHovering && playFrame !== null && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/40">
            <div
              style={{
                height: "100%",
                width: `${(playFrame / Math.max(totalFrames - 1, 1)) * 100}%`,
                background: "linear-gradient(90deg, #FF8C68, #FF5E68)",
              }}
            />
          </div>
        )}

        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/50 text-white/90 backdrop-blur-sm tabular-nums">
          {info.time}
        </div>

        {!isHovering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-3.5 h-3.5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 pt-2.5">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 transition-colors"
            style={{
              background: isSelected
                ? "linear-gradient(135deg, #FF8C68, #FF5E68)"
                : "#d1d5db",
              boxShadow: isSelected ? "0 0 8px rgba(255,94,104,0.4)" : "none",
            }}
          />
          <span
            className={`text-sm font-semibold truncate ${
              isSelected ? "text-[#FF5E68]" : "text-gray-700"
            }`}
          >
            {info.name}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 leading-snug mt-1 ml-4 line-clamp-1">
          {info.description}
        </p>
      </div>
    </button>
  );
}

function StepIndicator({ current }: { current: number }) {
  const steps = ["Scrape website", "Choose template", "Preview & export"];
  return (
    <div className="flex items-center gap-4 text-sm text-gray-400">
      {steps.map((label, i) => {
        const num = i + 1;
        const isComplete = num < current;
        const isCurrent = num === current;
        return (
          <React.Fragment key={i}>
            {i > 0 && <div className="w-8 h-px bg-gray-200" />}
            <div className={`flex items-center gap-2 ${isComplete ? "text-green-500" : isCurrent ? "text-[#FF8C68]" : "text-gray-300"}`}>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${isComplete ? "bg-green-100" : isCurrent ? "bg-orange-100 text-orange-600" : "bg-gray-100"}`}>
                {isComplete ? "✓" : num}
              </div>
              {label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function TemplateFields({ template, videoProps, setVideoProps }: {
  template: VideoTemplate;
  videoProps: VideoProps;
  setVideoProps: React.Dispatch<React.SetStateAction<VideoProps>>;
}) {
  return (
    <>
      {/* Pain Points - used by templates 4, 7, 22, 28 */}
      {[4, 7, 22, 28].includes(template) && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            {template === 22 ? "Old Way (Pain Points)" : "Pain Points"}
          </h4>
          <div className="space-y-2">
            {(videoProps.painPoints ?? []).map((pt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="text" value={pt} onChange={(e) => {
                  const pts = [...(videoProps.painPoints ?? [])];
                  pts[i] = e.target.value;
                  setVideoProps((p) => ({ ...p, painPoints: pts }));
                }} className="flex-1 text-sm text-gray-700 bg-white rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                <button onClick={() => setVideoProps((p) => ({ ...p, painPoints: (p.painPoints ?? []).filter((_, idx) => idx !== i) }))} className="text-gray-400 hover:text-red-500 transition-colors text-xs">✕</button>
              </div>
            ))}
            {(videoProps.painPoints ?? []).length < 4 && (
              <button onClick={() => setVideoProps((p) => ({ ...p, painPoints: [...(p.painPoints ?? []), ""] }))} className="text-xs text-[#FF8C68] hover:text-[#FF5E68] font-medium transition-colors">+ Add pain point</button>
            )}
          </div>
        </div>
      )}

      {/* Before/After - template 7 */}
      {template === 7 && (
        <div className="space-y-3">
          <ScriptEditor label="Before State" value={videoProps.beforeState ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, beforeState: v }))} multiline />
          <ScriptEditor label="After State" value={videoProps.afterState ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, afterState: v }))} multiline />
          <ArrayEditor label="Transformation Steps" items={videoProps.transformationSteps ?? []} onChange={(items) => setVideoProps((p) => ({ ...p, transformationSteps: items }))} max={4} />
        </div>
      )}

      {/* Myths - template 8 */}
      {template === 8 && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Myths & Realities</h4>
          <div className="space-y-3">
            {(videoProps.myths ?? []).map((m, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Myth #{i + 1}</span>
                  {(videoProps.myths ?? []).length > 1 && (
                    <button onClick={() => setVideoProps((p) => ({ ...p, myths: (p.myths ?? []).filter((_, idx) => idx !== i) }))} className="text-gray-400 hover:text-red-500 transition-colors text-xs">✕</button>
                  )}
                </div>
                <input type="text" value={m.myth} placeholder="The myth..." onChange={(e) => {
                  const myths = [...(videoProps.myths ?? [])];
                  myths[i] = { ...myths[i], myth: e.target.value };
                  setVideoProps((p) => ({ ...p, myths }));
                }} className="w-full text-sm text-gray-700 bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                <input type="text" value={m.reality} placeholder="The reality..." onChange={(e) => {
                  const myths = [...(videoProps.myths ?? [])];
                  myths[i] = { ...myths[i], reality: e.target.value };
                  setVideoProps((p) => ({ ...p, myths }));
                }} className="w-full text-sm text-gray-500 bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
              </div>
            ))}
            {(videoProps.myths ?? []).length < 4 && (
              <button onClick={() => setVideoProps((p) => ({ ...p, myths: [...(p.myths ?? []), { myth: "", reality: "" }] }))} className="text-xs text-[#FF8C68] hover:text-[#FF5E68] font-medium transition-colors">+ Add myth</button>
            )}
          </div>
        </div>
      )}

      {/* Hero Word + Differentiator - template 10 */}
      {template === 10 && (
        <div className="space-y-3">
          <ScriptEditor label="Hero Word" value={videoProps.heroWord ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, heroWord: v }))} />
          <ScriptEditor label="Differentiator" value={videoProps.differentiator ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, differentiator: v }))} multiline />
        </div>
      )}

      {/* Social Proof - templates 3, 11, 14, 18, 23 */}
      {[3, 11, 14, 18, 23].includes(template) && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Social Proof</h4>
          <div className="space-y-3">
            {template === 3 && <ScriptEditor label="Big Stat (hook)" value={videoProps.bigStat ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, bigStat: v }))} />}
            {template === 3 && <ScriptEditor label="Social Proof Line" value={videoProps.socialProofStat ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, socialProofStat: v }))} />}
            {[11, 14, 18, 23].includes(template) && <ScriptEditor label="Proof Metric" value={videoProps.proofMetric ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, proofMetric: v }))} />}
            {[14].includes(template) && <ScriptEditor label="Tease Stat" value={videoProps.teaseStat ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, teaseStat: v }))} />}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Proof Logos <span className="font-normal opacity-60">(comma-separated)</span></label>
              <input type="text" value={(videoProps.proofLogos ?? []).join(", ")} onChange={(e) => setVideoProps((p) => ({ ...p, proofLogos: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} className="w-full text-sm text-gray-700 bg-white rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
            </div>
            {[11].includes(template) && <ScriptEditor label="Testimonial Quote" value={videoProps.testimonialQuote ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, testimonialQuote: v }))} multiline />}
            {[11].includes(template) && <ScriptEditor label="Testimonial Author" value={videoProps.testimonialAuthor ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, testimonialAuthor: v }))} />}
          </div>
        </div>
      )}

      {/* Intrigue Items - template 14 */}
      {template === 14 && (
        <ArrayEditor label="Intrigue Items (It's not...)" items={videoProps.intrigueItems ?? []} onChange={(items) => setVideoProps((p) => ({ ...p, intrigueItems: items }))} max={4} />
      )}

      {/* Stats - templates 17, 21, 24, 28 */}
      {[17, 21, 24, 28].includes(template) && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Stats</h4>
          <div className="space-y-2">
            {(videoProps.stats ?? []).map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Stat #{i + 1}</span>
                  {(videoProps.stats ?? []).length > 1 && (
                    <button onClick={() => setVideoProps((p) => ({ ...p, stats: (p.stats ?? []).filter((_, idx) => idx !== i) }))} className="text-gray-400 hover:text-red-500 transition-colors text-xs">✕</button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={s.value} placeholder="50,000+" onChange={(e) => {
                    const stats = [...(videoProps.stats ?? [])];
                    stats[i] = { ...stats[i], value: e.target.value };
                    setVideoProps((p) => ({ ...p, stats }));
                  }} className="w-24 text-sm font-semibold text-gray-700 bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                  <input type="text" value={s.label} placeholder="Active users" onChange={(e) => {
                    const stats = [...(videoProps.stats ?? [])];
                    stats[i] = { ...stats[i], label: e.target.value };
                    setVideoProps((p) => ({ ...p, stats }));
                  }} className="flex-1 text-sm text-gray-500 bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                </div>
              </div>
            ))}
            {(videoProps.stats ?? []).length < 3 && (
              <button onClick={() => setVideoProps((p) => ({ ...p, stats: [...(p.stats ?? []), { label: "", value: "" }] }))} className="text-xs text-[#FF8C68] hover:text-[#FF5E68] font-medium transition-colors">+ Add stat</button>
            )}
          </div>
        </div>
      )}

      {/* Awards - templates 17, 24, 28 */}
      {[17, 24, 28].includes(template) && (
        <ArrayEditor label="Awards / Milestones" items={videoProps.awards ?? []} onChange={(items) => setVideoProps((p) => ({ ...p, awards: items }))} max={3} />
      )}

      {/* Testimonials - templates 17, 23 */}
      {[17, 23].includes(template) && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Testimonials</h4>
          <div className="space-y-3">
            {(videoProps.testimonials ?? []).map((t, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Testimonial #{i + 1}</span>
                  {(videoProps.testimonials ?? []).length > 1 && (
                    <button onClick={() => setVideoProps((p) => ({ ...p, testimonials: (p.testimonials ?? []).filter((_, idx) => idx !== i) }))} className="text-gray-400 hover:text-red-500 transition-colors text-xs">✕</button>
                  )}
                </div>
                <textarea value={t.quote} placeholder="Quote..." rows={2} onChange={(e) => {
                  const testimonials = [...(videoProps.testimonials ?? [])];
                  testimonials[i] = { ...testimonials[i], quote: e.target.value };
                  setVideoProps((p) => ({ ...p, testimonials }));
                }} className="w-full text-sm text-gray-700 bg-white rounded-lg border border-gray-200 px-3 py-1.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                <div className="flex gap-2">
                  <input type="text" value={t.author} placeholder="Author name" onChange={(e) => {
                    const testimonials = [...(videoProps.testimonials ?? [])];
                    testimonials[i] = { ...testimonials[i], author: e.target.value };
                    setVideoProps((p) => ({ ...p, testimonials }));
                  }} className="flex-1 text-sm text-gray-700 bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                  <input type="text" value={t.role} placeholder="Role @ Company" onChange={(e) => {
                    const testimonials = [...(videoProps.testimonials ?? [])];
                    testimonials[i] = { ...testimonials[i], role: e.target.value };
                    setVideoProps((p) => ({ ...p, testimonials }));
                  }} className="flex-1 text-sm text-gray-500 bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                </div>
              </div>
            ))}
            {(videoProps.testimonials ?? []).length < 4 && (
              <button onClick={() => setVideoProps((p) => ({ ...p, testimonials: [...(p.testimonials ?? []), { quote: "", author: "", role: "" }] }))} className="text-xs text-[#FF8C68] hover:text-[#FF5E68] font-medium transition-colors">+ Add testimonial</button>
            )}
          </div>
        </div>
      )}

      {/* Founder fields - template 19 */}
      {template === 19 && (
        <div className="space-y-3">
          <ScriptEditor label="Founder Name" value={videoProps.founderName ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, founderName: v }))} />
          <ScriptEditor label="Founder Title" value={videoProps.founderTitle ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, founderTitle: v }))} />
        </div>
      )}

      {/* Demo Steps - templates 19, 26, 29 */}
      {[19, 26, 29].includes(template) && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            {template === 26 ? "How It Works Steps" : template === 29 ? "Walkthrough Steps" : "Demo Steps"}
          </h4>
          <div className="space-y-3">
            {(videoProps.demoSteps ?? []).map((s, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Step {i + 1}</span>
                  {(videoProps.demoSteps ?? []).length > 1 && (
                    <button onClick={() => setVideoProps((p) => ({ ...p, demoSteps: (p.demoSteps ?? []).filter((_, idx) => idx !== i) }))} className="text-gray-400 hover:text-red-500 transition-colors text-xs">✕</button>
                  )}
                </div>
                <input type="text" value={s.title} placeholder="Step title..." onChange={(e) => {
                  const steps = [...(videoProps.demoSteps ?? [])];
                  steps[i] = { ...steps[i], title: e.target.value };
                  setVideoProps((p) => ({ ...p, demoSteps: steps }));
                }} className="w-full text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                <input type="text" value={s.description} placeholder="What happens..." onChange={(e) => {
                  const steps = [...(videoProps.demoSteps ?? [])];
                  steps[i] = { ...steps[i], description: e.target.value };
                  setVideoProps((p) => ({ ...p, demoSteps: steps }));
                }} className="w-full text-xs text-gray-500 bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
              </div>
            ))}
            {(videoProps.demoSteps ?? []).length < 4 && (
              <button onClick={() => setVideoProps((p) => ({ ...p, demoSteps: [...(p.demoSteps ?? []), { title: "", description: "" }] }))} className="text-xs text-[#FF8C68] hover:text-[#FF5E68] font-medium transition-colors">+ Add step</button>
            )}
          </div>
        </div>
      )}

      {/* Title Cards - template 20 */}
      {template === 20 && (
        <div className="space-y-5">
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Title Cards</h4>
            <p className="text-xs text-gray-400 mb-3">Each card types out line by line on screen.</p>
            <div className="space-y-3">
              {(videoProps.titleCards ?? []).map((card, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Card {i + 1}</span>
                    {(videoProps.titleCards ?? []).length > 1 && (
                      <button onClick={() => setVideoProps((p) => ({ ...p, titleCards: (p.titleCards ?? []).filter((_, idx) => idx !== i) }))} className="text-gray-400 hover:text-red-500 transition-colors text-xs">✕</button>
                    )}
                  </div>
                  <input type="text" value={card.line1} placeholder="Line 1 (bold, large)" onChange={(e) => {
                    const cards = [...(videoProps.titleCards ?? [])];
                    cards[i] = { ...cards[i], line1: e.target.value };
                    setVideoProps((p) => ({ ...p, titleCards: cards }));
                  }} className="w-full text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                  <input type="text" value={card.line2} placeholder="Line 2 (smaller, dimmer)" onChange={(e) => {
                    const cards = [...(videoProps.titleCards ?? [])];
                    cards[i] = { ...cards[i], line2: e.target.value };
                    setVideoProps((p) => ({ ...p, titleCards: cards }));
                  }} className="w-full text-sm text-gray-500 bg-white rounded-lg border border-gray-200 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
                </div>
              ))}
              {(videoProps.titleCards ?? []).length < 4 && (
                <button onClick={() => setVideoProps((p) => ({ ...p, titleCards: [...(p.titleCards ?? []), { line1: "", line2: "" }] }))} className="text-xs text-[#FF8C68] hover:text-[#FF5E68] font-medium transition-colors">+ Add card</button>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Video Uploads</h4>
            <p className="text-xs text-gray-400 mb-3">Upload MP4 or WebM videos to include. Both are optional.</p>
            <div className="space-y-4">
              <VideoUploadField label="Announcement Video" value={videoProps.announcementVideoSrc ?? ""} onChange={(url) => setVideoProps((p) => ({ ...p, announcementVideoSrc: url }))} />
              <VideoUploadField label="End Card Video" value={videoProps.endVideoSrc ?? ""} onChange={(url) => setVideoProps((p) => ({ ...p, endVideoSrc: url }))} />
            </div>
          </div>
        </div>
      )}

      {/* Big Stat - template 28 */}
      {template === 28 && (
        <div className="space-y-3">
          <ScriptEditor label="Big Stat (market size)" value={videoProps.bigStat ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, bigStat: v }))} />
          <ScriptEditor label="Testimonial Quote" value={videoProps.testimonialQuote ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, testimonialQuote: v }))} multiline />
          <ScriptEditor label="Testimonial Author" value={videoProps.testimonialAuthor ?? ""} onChange={(v) => setVideoProps((p) => ({ ...p, testimonialAuthor: v }))} />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Proof Logos <span className="font-normal opacity-60">(comma-separated)</span></label>
            <input type="text" value={(videoProps.proofLogos ?? []).join(", ")} onChange={(e) => setVideoProps((p) => ({ ...p, proofLogos: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} className="w-full text-sm text-gray-700 bg-white rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
          </div>
        </div>
      )}
    </>
  );
}

function ArrayEditor({ label, items, onChange, max = 4 }: { label: string; items: string[]; onChange: (items: string[]) => void; max?: number }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="text" value={item} onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }} className="flex-1 text-sm text-gray-700 bg-white rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500 transition-colors text-xs">✕</button>
          </div>
        ))}
        {items.length < max && (
          <button onClick={() => onChange([...items, ""])} className="text-xs text-[#FF8C68] hover:text-[#FF5E68] font-medium transition-colors">+ Add item</button>
        )}
      </div>
    </div>
  );
}

function ScriptEditor({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} className="w-full text-sm text-gray-700 bg-white rounded-xl border border-gray-200 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full text-sm text-gray-700 bg-white rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF8C68]/30" />
      )}
    </div>
  );
}

function VideoUploadField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {value ? (
        <div className="flex items-center gap-2">
          <video src={value} className="w-32 h-20 object-cover rounded-lg border border-gray-200" muted />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500 truncate max-w-[160px]">{value.split("/").pop()}</span>
            <div className="flex gap-2">
              <label className="text-xs text-[#FF8C68] cursor-pointer hover:underline">
                Replace
                <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleFile} />
              </label>
              <button onClick={() => onChange("")} className="text-xs text-red-400 hover:underline">Remove</button>
            </div>
          </div>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center w-full h-24 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${uploading ? "border-[#FF8C68]/50 bg-[#FF8C68]/5" : "border-gray-200 hover:border-[#FF8C68]/40 hover:bg-gray-50"}`}>
          <span className="text-sm text-gray-400">{uploading ? "Uploading..." : "Click to upload MP4 or WebM"}</span>
          {error && <span className="text-xs text-red-400 mt-1">{error}</span>}
          <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      )}
    </div>
  );
}

export default function VideoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <VideoPageContent />
    </Suspense>
  );
}
