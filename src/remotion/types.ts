export type VideoTemplate = 3 | 4 | 7 | 8 | 10 | 11 | 14 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29;

export type VideoFormat = "landscape" | "vertical" | "square";

export const VIDEO_FORMATS: Record<VideoFormat, { width: number; height: number; label: string }> = {
  landscape: { width: 1920, height: 1080, label: "16:9 Landscape" },
  vertical: { width: 1080, height: 1920, label: "9:16 Vertical" },
  square: { width: 1080, height: 1080, label: "1:1 Square" },
};

export interface VideoProps {
  companyName: string;
  tagline: string;
  hook: string;
  problem: string;
  solution: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
    lottieUrl?: string;
  }>;
  cta: string;
  websiteUrl: string;
  accentColor: string;
  logoText?: string;
  logoUrl?: string | null;
  template?: VideoTemplate;
  format?: VideoFormat;

  outcome?: string;
  proofMetric?: string;
  proofLogos?: string[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
  bigStat?: string;
  socialProofStat?: string;
  painPoints?: string[];
  beforeState?: string;
  afterState?: string;
  transformationSteps?: string[];
  myths?: Array<{ myth: string; reality: string }>;
  testimonials?: Array<{ quote: string; author: string; role: string }>;
  heroWord?: string;
  differentiator?: string;
  teaseStat?: string;
  intrigueItems?: string[];
  stats?: Array<{ label: string; value: string }>;
  awards?: string[];

  founderName?: string;
  founderTitle?: string;
  demoSteps?: Array<{
    title: string;
    description: string;
  }>;

  titleCards?: Array<{ line1: string; line2: string }>;
  announcementVideoSrc?: string;
  announcementVideoDurationFrames?: number;
  announcementVideoZoom?: {
    startFrame?: number;
    endScale?: number;
    originX?: string;
    originY?: string;
  };
  endVideoSrc?: string;
  endVideoDurationFrames?: number;
  typewriterSpeed?: number;
  holdFrames?: number;

  musicTrack?: "ambient" | "upbeat" | "cinematic" | "none";
  musicVolume?: number;
  sfxEnabled?: boolean;

  // Template 22 (Comparison VS) — uses painPoints as "old way" items
  // Template 23 (Testimonial Carousel) — uses testimonials[], proofLogos, proofMetric
  // Template 24 (Metrics Growth) — uses stats[], awards as milestones
  // Template 25 (Feature Changelog) — uses features
  // Template 26 (Explainer) — uses demoSteps or features for steps
  // Template 27 (Logo Reveal) — minimal: logoUrl/logoText, companyName, tagline
  // Template 28 (Pitch Deck) — uses bigStat, stats, painPoints, testimonialQuote, awards
  // Template 29 (App Walkthrough) — uses features, demoSteps, BrowserMockup
}

export const defaultVideoProps: VideoProps = {
  companyName: "YourStartup",
  tagline: "The fastest way to ship",
  hook: "Still wasting hours on this?",
  problem: "Building great products is hard. Marketing them shouldn't be.",
  solution: "YourStartup automates everything so you can focus on what matters.",
  features: [
    { icon: "⚡", title: "10x Faster", description: "Ship in minutes, not weeks" },
    { icon: "✨", title: "AI-Powered", description: "Smart automation that actually works" },
    { icon: "🚀", title: "Go Viral", description: "Built-in virality from day one" },
  ],
  cta: "Try it free",
  websiteUrl: "yourstartup.com",
  accentColor: "#FF8C68",
  logoText: "YS",
  template: 3,
  outcome: "Ship a polished launch video in under 2 minutes",
  proofMetric: "500+",
  proofLogos: ["Vercel", "Stripe", "Notion"],
  testimonialQuote: "This changed everything for our launch day.",
  testimonialAuthor: "CEO @ Shipfast",
  bigStat: "3x more signups",
  socialProofStat: "Used by 500+ startups",
  painPoints: [
    "Manual workflows eating your day",
    "Spreadsheets breaking at the worst time",
    "Hours lost to repetitive tasks",
    "No visibility into what's working",
  ],
  beforeState: "Wasting hours on manual busywork every single day",
  afterState: "Shipping 10x faster with zero friction",
  transformationSteps: [
    "Automate repetitive tasks",
    "Real-time collaboration",
    "One-click deployment",
  ],
  myths: [
    { myth: "You need a big team to ship fast", reality: "Solo founders ship in minutes with AI" },
    { myth: "Automation is only for enterprise", reality: "Start free, scale when ready" },
    { myth: "It takes weeks to set up", reality: "Go live in under 5 minutes" },
  ],
  testimonials: [
    { quote: "This replaced 3 tools for us overnight.", author: "Sarah Chen", role: "CTO @ LaunchPad" },
    { quote: "We shipped our MVP in a single afternoon.", author: "Marcus Reid", role: "Founder @ Stackflow" },
    { quote: "Best investment we made this year.", author: "Priya Sharma", role: "VP Eng @ Datawise" },
  ],
  heroWord: "Ship",
  differentiator: "The only platform that turns ideas into production in minutes",
  teaseStat: "10x faster",
  intrigueItems: [
    "It's not another project manager",
    "It's not a glorified spreadsheet",
    "It's not just another dashboard",
  ],
  stats: [
    { label: "Active users", value: "50,000+" },
    { label: "Average rating", value: "4.9" },
    { label: "Companies", value: "500+" },
  ],
  awards: ["Product of the Year", "Best in Class", "Editor's Choice"],
  founderName: "Alex Chen",
  founderTitle: "CEO & Co-founder",
  demoSteps: [
    { title: "Create a project", description: "Start with a blank canvas and pick your template" },
    { title: "Customize everything", description: "Drag, drop, and tweak until it's perfect" },
    { title: "Invite your team", description: "Share with one click — everyone gets real-time access" },
    { title: "Ship instantly", description: "Go live to the world with a single button" },
  ],
  titleCards: [
    { line1: "Introducing something new", line2: "that changes everything." },
    { line1: "Built for speed", line2: "designed for clarity." },
    { line1: "Available now", line2: "try it today." },
  ],
  announcementVideoSrc: "",
  announcementVideoDurationFrames: 360,
  announcementVideoZoom: { startFrame: 60, endScale: 1.25, originX: "25%", originY: "0%" },
  endVideoSrc: "",
  endVideoDurationFrames: 120,
  typewriterSpeed: 1,
  holdFrames: 90,
  format: "landscape",
  musicTrack: "ambient",
  musicVolume: 0.15,
  sfxEnabled: true,
};
