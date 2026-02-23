import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const BaseFields = {
  companyName: z.string().describe("Short, clean company or product name"),
  tagline: z.string().describe("Punchy 4-8 word tagline for the intro scene"),
  hook: z
    .string()
    .describe(
      "Attention-grabbing opening question or statement (max 12 words). Creates tension or curiosity."
    ),
  problem: z
    .string()
    .describe(
      "One sentence describing the painful problem this product solves (max 20 words)"
    ),
  solution: z
    .string()
    .describe(
      "One sentence describing how the product solves that problem (max 25 words)"
    ),
  features: z
    .array(
      z.object({
        icon: z.string().describe("Single relevant emoji"),
        title: z.string().describe("Feature name, 2-4 words max"),
        description: z
          .string()
          .describe("One punchy sentence about this feature, max 15 words"),
      })
    )
    .min(2)
    .max(3)
    .describe("2-3 key features or benefits"),
  cta: z
    .string()
    .describe(
      "Strong call-to-action phrase for the outro, 3-6 words. Examples: 'Start shipping today', 'Get it free'"
    ),
  websiteUrl: z
    .string()
    .describe("Clean URL without https:// prefix, e.g. 'mystartup.com'"),
  accentColor: z
    .string()
    .describe(
      "A hex color that fits the brand. Use warm/vibrant colors. Default: #FF8C68 for coral. Must be a valid 6-digit hex like #FF8C68"
    ),
  logoText: z
    .string()
    .max(3)
    .describe("2-3 letter abbreviation for the logo, e.g. 'YS' or 'GP'"),
};

const Template3Schema = z.object({
  ...BaseFields,
  features: z
    .array(
      z.object({
        icon: z.string().describe("Single relevant emoji"),
        title: z.string().describe("Feature headline, 2-4 words"),
        description: z
          .string()
          .describe("One-liner benefit of this feature, max 12 words"),
      })
    )
    .min(2)
    .max(4)
    .describe("2-4 key features for the showcase act"),
  bigStat: z
    .string()
    .describe(
      "Bold outcome stat for the hook, e.g. '3x more signups' or '10,000+ teams' (max 6 words)"
    ),
  socialProofStat: z
    .string()
    .describe(
      "Social proof line like 'Used by 500+ startups' or 'Trusted by top teams' (max 8 words)"
    ),
  proofLogos: z
    .array(z.string())
    .min(2)
    .max(4)
    .describe("2-4 recognizable company names for the logo wall"),
});

const Template4Schema = z.object({
  ...BaseFields,
  painPoints: z
    .array(z.string())
    .min(3)
    .max(4)
    .describe(
      "3-4 specific pain points as short phrases (max 8 words each). These pile up visually like sticky notes. Use relatable, emotional language."
    ),
});

const Template7Schema = z.object({
  ...BaseFields,
  beforeState: z
    .string()
    .describe(
      "The painful 'before' state the user is in, max 15 words. Emotional, specific, relatable."
    ),
  afterState: z
    .string()
    .describe(
      "The aspirational 'after' state with the product, max 15 words. Concrete improvement."
    ),
  transformationSteps: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe(
      "2-3 short bridge steps that connect before→after, max 5 words each (e.g. 'Automate repetitive tasks')"
    ),
  painPoints: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe("2-3 specific pain chips shown in the 'before' state, max 6 words each"),
});

const Template8Schema = z.object({
  ...BaseFields,
  myths: z
    .array(
      z.object({
        myth: z
          .string()
          .describe("A common misconception about the problem space, max 12 words"),
        reality: z
          .string()
          .describe("The truth that the product proves, max 12 words"),
      })
    )
    .min(3)
    .max(3)
    .describe(
      "Exactly 3 myth/reality pairs. Each myth is a belief the audience holds; each reality is the truth the product demonstrates."
    ),
});

const Template10Schema = z.object({
  ...BaseFields,
  heroWord: z
    .string()
    .max(12)
    .describe(
      "One powerful word that captures the product's essence (e.g. 'Ship', 'Scale', 'Create', 'Launch'). Max 12 chars."
    ),
  differentiator: z
    .string()
    .describe(
      "The one-sentence positioning statement that sets this product apart, max 20 words. Premium, confident tone."
    ),
});

const Template11Schema = z.object({
  ...BaseFields,
  features: z
    .array(
      z.object({
        icon: z.string().describe("Single relevant emoji"),
        title: z
          .string()
          .describe("Feature headline, 2-4 words. Punchy and benefit-focused."),
        description: z
          .string()
          .describe(
            "One-liner benefit with an optional stat/number callout, max 15 words"
          ),
      })
    )
    .min(3)
    .max(3)
    .describe(
      "Exactly 3 feature highlights. Each gets ~5 seconds. Include a stat/number in at least one description."
    ),
  proofMetric: z
    .string()
    .describe(
      "A trust metric with number and unit, e.g. '500+ teams' or '10x faster'"
    ),
  proofLogos: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe("2-5 recognizable company names for the logo wall"),
  testimonialQuote: z
    .string()
    .describe(
      "A short, punchy testimonial quote (max 20 words). Feels real and specific."
    ),
  testimonialAuthor: z
    .string()
    .describe("Attribution like 'CEO @ Acme' or 'Head of Product @ Stripe'"),
});

const Template14Schema = z.object({
  ...BaseFields,
  teaseStat: z
    .string()
    .describe(
      "A bold, context-free stat that creates curiosity, e.g. '10x faster' or '47 seconds'. Max 4 words."
    ),
  intrigueItems: z
    .array(z.string())
    .min(3)
    .max(3)
    .describe(
      "Exactly 3 'It's not...' statements that get struck through. Each max 10 words. Build intrigue about what the product actually is."
    ),
  proofMetric: z
    .string()
    .describe(
      "A live counter metric like '500+ teams' or '10,000+ users'"
    ),
});

const Template17Schema = z.object({
  ...BaseFields,
  features: z
    .array(
      z.object({
        icon: z.string().describe("Single relevant emoji"),
        title: z
          .string()
          .describe("Enterprise feature headline, 2-4 words"),
        description: z
          .string()
          .describe("One-liner benefit, max 15 words"),
      })
    )
    .min(3)
    .max(4)
    .describe("3-4 enterprise-grade features shown in a 2×2 grid"),
  stats: z
    .array(
      z.object({
        label: z.string().describe("Stat label, e.g. 'Active users'"),
        value: z.string().describe("Stat value with suffix, e.g. '50,000+' or '4.9'"),
      })
    )
    .min(2)
    .max(3)
    .describe("2-3 impressive stats for the opening proof scene"),
  awards: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe("2-3 award or recognition badges, e.g. 'Product of the Year'"),
  proofLogos: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe("3-5 recognizable company names for the logo wall"),
  testimonials: z
    .array(
      z.object({
        quote: z.string().describe("A punchy testimonial quote, max 15 words"),
        author: z.string().describe("Person's full name"),
        role: z.string().describe("Their role and company, e.g. 'CTO @ LaunchPad'"),
      })
    )
    .min(3)
    .max(3)
    .describe("Exactly 3 customer testimonials with star ratings"),
});

const Template18Schema = z.object({
  ...BaseFields,
  proofMetric: z
    .string()
    .describe(
      "A trust metric like '500+ teams' or '10x faster'. Include the number and unit."
    ),
  proofLogos: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe(
      "2-5 recognizable company or brand names that could plausibly use this product"
    ),
});

const Template19Schema = z.object({
  ...BaseFields,
  founderName: z
    .string()
    .describe("The founder's first and last name, e.g. 'Alex Chen'"),
  founderTitle: z
    .string()
    .describe("The founder's title, e.g. 'CEO & Co-founder' or 'Founder & CTO'"),
  demoSteps: z
    .array(
      z.object({
        title: z
          .string()
          .describe("Step headline, 2-5 words, e.g. 'Create a project'"),
        description: z
          .string()
          .describe(
            "One sentence describing what happens in this step, max 15 words"
          ),
      })
    )
    .min(3)
    .max(4)
    .describe(
      "3-4 demo walkthrough steps. Each step shows the product in action. Steps should tell a story: setup → customize → collaborate → ship."
    ),
});

const Template21Schema = z.object({
  ...BaseFields,
  features: z
    .array(
      z.object({
        icon: z.string().describe("Single relevant emoji"),
        title: z
          .string()
          .describe("Feature headline, 2-4 words. Punchy and benefit-focused."),
        description: z
          .string()
          .describe(
            "One-liner benefit, max 15 words. Can include a stat or number.",
          ),
      }),
    )
    .min(3)
    .max(3)
    .describe(
      "Exactly 3 feature highlights — one for each 3.5s demo scene with cursor interaction.",
    ),
  painPoints: z
    .array(z.string())
    .min(2)
    .max(2)
    .describe(
      "Exactly 2 pain-point statements shown as floating problem cards, max 10 words each. Use emotional, relatable language — these are highlighted with red borders and a shake animation.",
    ),
  stats: z
    .array(
      z.object({
        label: z.string().describe("Short metric label, 2-3 words, e.g. 'Active users'"),
        value: z
          .string()
          .describe(
            "Metric value with number + suffix, e.g. '10,000+' or '24/7' or '99.9%'. The number will animate as a counter.",
          ),
      }),
    )
    .min(2)
    .max(2)
    .describe(
      "Exactly 2 impressive stats shown as giant animated counters in Scene 5. Pick the two most credible, high-impact metrics.",
    ),
});

const Template20Schema = z.object({
  ...BaseFields,
  titleCards: z
    .array(
      z.object({
        line1: z
          .string()
          .describe(
            "First line of the title card, typed with typewriter effect. Max 6 words. Bold, attention-grabbing."
          ),
        line2: z
          .string()
          .describe(
            "Second line of the title card, typed after line 1 finishes. Max 5 words. Completes the thought."
          ),
      })
    )
    .min(2)
    .max(4)
    .describe(
      "2-4 title cards shown sequentially with typewriter animation. Each builds on the previous to tell a story: tease → explain → call to action."
    ),
  typewriterSpeed: z
    .number()
    .min(1)
    .max(3)
    .describe(
      "Frames per character for the typewriter effect. 1 = fast, 2 = medium, 3 = slow. Default 1."
    ),
  holdFrames: z
    .number()
    .min(30)
    .max(120)
    .describe(
      "Number of frames to hold each title card after typing finishes. 30 = brief, 90 = standard, 120 = dramatic pause. Default 90."
    ),
});

const Template22Schema = z.object({
  ...BaseFields,
  painPoints: z
    .array(z.string())
    .min(3)
    .max(4)
    .describe("3-4 'old way' problems shown on the left side, max 8 words each. These are what competitors or manual processes look like."),
});

const Template23Schema = z.object({
  ...BaseFields,
  testimonials: z
    .array(
      z.object({
        quote: z.string().describe("A punchy testimonial quote, max 20 words"),
        author: z.string().describe("Person's full name"),
        role: z.string().describe("Their role and company, e.g. 'CTO @ LaunchPad'"),
      })
    )
    .min(3)
    .max(3)
    .describe("Exactly 3 customer testimonials with star ratings"),
  proofLogos: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe("3-5 recognizable company names for the logo wall"),
  proofMetric: z
    .string()
    .describe("A trust metric like '500+ teams' or '10x faster'"),
});

const Template24Schema = z.object({
  ...BaseFields,
  stats: z
    .array(
      z.object({
        label: z.string().describe("Stat label, e.g. 'Active users'"),
        value: z.string().describe("Stat value with suffix, e.g. '50,000+' or '4.9'"),
      })
    )
    .min(3)
    .max(3)
    .describe("3 impressive growth metrics with concrete numbers"),
  awards: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe("2-3 milestones or achievements, e.g. 'Series A raised', 'Product Hunt #1'"),
});

const Template25Schema = z.object({
  ...BaseFields,
  features: z
    .array(
      z.object({
        icon: z.string().describe("Single relevant emoji"),
        title: z.string().describe("Feature headline, 2-4 words"),
        description: z.string().describe("What's new about this feature, max 15 words"),
      })
    )
    .min(3)
    .max(3)
    .describe("Exactly 3 new features or updates to showcase"),
});

const Template26Schema = z.object({
  ...BaseFields,
  demoSteps: z
    .array(
      z.object({
        title: z.string().describe("Step headline, 2-5 words"),
        description: z.string().describe("What happens in this step, max 15 words"),
      })
    )
    .min(3)
    .max(4)
    .describe("3-4 steps explaining how the product works, in sequential order"),
});

const Template27Schema = z.object({
  ...BaseFields,
});

const Template28Schema = z.object({
  ...BaseFields,
  stats: z
    .array(
      z.object({
        label: z.string().describe("Metric label like 'Monthly Revenue' or 'Active Users'"),
        value: z.string().describe("Metric value with number, e.g. '$2.5M' or '50,000+'"),
      })
    )
    .min(2)
    .max(3)
    .describe("2-3 key traction/growth metrics for investors"),
  awards: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe("2-3 milestones, awards, or recognitions"),
  painPoints: z
    .array(z.string())
    .min(2)
    .max(3)
    .describe("2-3 market pain points shown as problem cards"),
  bigStat: z
    .string()
    .describe("A bold market/opportunity stat like '$50B market' or '10M underserved users'"),
  proofLogos: z
    .array(z.string())
    .min(2)
    .max(5)
    .describe("2-5 recognizable company names"),
  testimonialQuote: z
    .string()
    .describe("A short testimonial, max 20 words"),
  testimonialAuthor: z
    .string()
    .describe("Attribution like 'CEO @ Acme'"),
});

const Template29Schema = z.object({
  ...BaseFields,
  demoSteps: z
    .array(
      z.object({
        title: z.string().describe("Step title, 2-5 words"),
        description: z.string().describe("What the cursor demonstrates, max 15 words"),
      })
    )
    .min(3)
    .max(3)
    .describe("Exactly 3 walkthrough steps showing the product in action"),
});

function getSchemaForTemplate(template: number) {
  switch (template) {
    case 3: return Template3Schema;
    case 4: return Template4Schema;
    case 7: return Template7Schema;
    case 8: return Template8Schema;
    case 10: return Template10Schema;
    case 11: return Template11Schema;
    case 14: return Template14Schema;
    case 17: return Template17Schema;
    case 18: return Template18Schema;
    case 19: return Template19Schema;
    case 20: return Template20Schema;
    case 21: return Template21Schema;
    case 22: return Template22Schema;
    case 23: return Template23Schema;
    case 24: return Template24Schema;
    case 25: return Template25Schema;
    case 26: return Template26Schema;
    case 27: return Template27Schema;
    case 28: return Template28Schema;
    case 29: return Template29Schema;
    default: return Template3Schema;
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      companyName,
      tagline,
      description,
      features,
      markdown,
      url,
      template = 3,
    } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const contextBlock = `Company: ${companyName ?? "Unknown"}
Tagline: ${tagline ?? ""}
Description: ${description ?? ""}
Features: ${features?.join(", ") ?? ""}
URL: ${url ?? ""}

Additional context from the website:
${markdown?.slice(0, 2000) ?? "No additional content"}`;

    const viralPrinciples = `You are an expert viral video scriptwriter and motion graphics director. You write scroll-stopping, shareable product promo scripts for Remotion-rendered motion graphics videos.

CORE PRINCIPLES (apply to every script):
1. First 3 seconds decide everything — lead with outcome, bold claim, or sharp question. No slow intros.
2. Pattern interrupt — open with something unexpected (surprising stat, challenge, "Stop believing this").
3. Curiosity gap — tease a payoff viewers must watch to resolve.
4. Benefits over features — what changes for the user; features are proof, not the headline.
5. Brevity — every scene is 2-6 seconds. Cut filler. One idea per beat.
6. Emotion — aim for surprise, relief, or aspiration; avoid dry explanation.
7. Social proof — use numbers + logos when credible; make stats concrete ("500+ teams", "10x faster").
8. Single CTA — one clear action at the end.

OUTPUT: Copy must fit on screen in 2-4 seconds. Hooks max 10-12 words. Features max 15 words. No jargon. Infer brand personality from the website. Accent color: match brand or use #FF8C68.

---

`;

    const templatePrompts: Record<number, string> = {
      3: `You are an expert viral video scriptwriter. You specialize in the "6-Act" template for 28-second product videos.

${contextBlock}

Write a script following this exact 6-act template:

1. ACT 1 — HOOK (2.5s): Lead with the biggest outcome, not the product. A bold stat or striking result.
2. ACT 2 — PAIN POINT (3.5s): Empathize with the problem. One short line that mirrors the user's frustration.
3. ACT 3 — PRODUCT REVEAL (5s): Introduce the product with a clean entrance. This is the money shot.
4. ACT 4 — FEATURE SHOWCASE (10s): Cycle through 2-4 key features. Each feature: icon + headline + one-liner benefit.
5. ACT 5 — SOCIAL PROOF (4s): A "used by X companies" stat + 2-4 recognizable logo names. Builds trust fast.
6. ACT 6 — CTA (5s): One clear call to action. Big text, URL.

The tone: punchy, visual-first, scroll-stopping. The bigStat should be the most impressive number you can credibly claim.
Keep all copy ultra-short — every scene is only a few seconds. Brevity is everything.
For the accent color, infer the brand's color from context, or default to a vibrant coral/orange.`,

      4: `You are an expert viral video scriptwriter. You specialize in the "Problem Stack" template — an oddly-satisfying format where pain points pile up visually, then get wiped away to reveal the product.

${contextBlock}

Write a script following this exact template (18s total):

1. HOOK (2.5s): A short, relatable question like "Sound familiar?" or "Every. Single. Day." — creates instant empathy.
2. PROBLEM STACK (6s): 3-4 pain points that pile up on screen like messy sticky notes. Each should be a short, punchy phrase (max 8 words). Use frustrating, emotional language. They should feel like things the viewer has said themselves.
3. PRODUCT REVEAL (4.5s): After all problems are swept away, the product appears on a clean canvas. Company name + tagline.
4. FEATURE GRID (4s): 2-3 key features shown all at once in a clean grid — visual contrast with the messy pile.
5. CTA (3.5s): Strong call to action with confetti energy.

The contrast between chaos (problem stack) and order (features) is the whole point. Make the pain points feel viscerally relatable.
For the accent color, infer the brand's color from context, or default to a vibrant coral/orange.`,

      7: `You are an expert viral video scriptwriter. You specialize in the "Before/After Transformation" framework — the most emotionally compelling format for product marketing. The B-A-B (Before-After-Bridge) template shows the ugly "before" state, then reveals the beautiful "after" — and the audience fills in the emotional gap themselves.

${contextBlock}

Write a script following this exact template (~24s total):

1. HOOK (3s): A provocative statement or question that immediately creates tension, e.g. "What if this didn't have to be so hard?" or "Your team deserves better than this."
2. BEFORE STATE (5s): Paint the frustrating "before" picture. One headline sentence describing life without the product (desaturated, stressful). Plus 2-3 specific pain chips (short phrases, max 6 words each) shown as red tags.
3. TRANSFORMATION (6s): The product is introduced with a dramatic visual wipe — like color flooding into a grayscale scene. Company name + "Introducing" label.
4. AFTER STATE (5s): The aspirational "after" — one sentence showing the upgraded reality. Plus 2-3 green "transformation steps" chips showing what changed.
5. BRIDGE / HOW (4s): Quick feature grid showing how the product bridges before→after. 2-3 features.
6. CTA (4s): Clear call to action.

Guidelines:
- The contrast between BEFORE (gray, shaky, red accents) and AFTER (colorful, smooth, green accents) is the core emotional driver.
- The beforeState should feel viscerally painful. The afterState should feel aspirational but credible.
- Pain points are short red-tagged phrases. Transformation steps are short green-tagged phrases.
- Accent color should match inferred brand color, or default to vibrant coral/orange.`,

      8: `You are an expert viral video scriptwriter. You specialize in the "Myth Buster" format — one of the highest-engagement frameworks on TikTok, Reels, and Shorts. It challenges false beliefs the audience holds, then reveals reality with the product as proof.

${contextBlock}

Write a script following this exact template (~28s total):

1. HOOK (3s): A bold pattern interrupt like "Everything you've been told about X is wrong" or "Stop believing this."
2. MYTH #1 (6s): Present a common misconception in quotes — then dramatically strike through it and reveal the truth. The myth should be something the audience genuinely believes.
3. MYTH #2 (6s): Same format. Different misconception. Each myth/reality pair should highlight a different angle.
4. MYTH #3 (6s): Same format. This one should directly connect to the product's strongest differentiator.
5. PRODUCT REVEAL (4.5s): After busting all myths, reveal the product. "The truth is: [CompanyName]" + tagline.
6. CTA (4s): Strong call to action.

Guidelines:
- Myths should sound like things the target audience has actually said or believed. NOT strawmen.
- Realities should be surprising, specific, and product-adjacent. Each reality naturally leads to wanting the product.
- The visual contrast between myth (dim, strikethrough) and reality (bright, confident) creates the dopamine hit.
- Keep myth and reality lines to max 12 words each. Brevity is power.
- Accent color should match inferred brand color, or default to vibrant coral/orange.`,

      10: `You are an expert video scriptwriter. You specialize in the "Cinematic Minimal" format — Apple-style dramatic reveals with maximum whitespace, slow kinetic typography, and premium restraint. Every pixel earns its place. No visual noise, no clutter, just confidence.

${contextBlock}

Write a script following this exact template (~22s total):

1. HERO WORD (4s): One single powerful word fills the screen in massive type. This word captures the product's essence — "Ship", "Scale", "Create", "Automate", "Launch", "Build", "Transform". Just the word, nothing else.
2. DIFFERENTIATOR (5s): One elegant sentence that positions the product. Premium, confident, no hype. Think Apple keynote energy: "The only platform that turns ideas into production in minutes." Max 20 words.
3. FEATURE 1 (4s): Clean feature presentation: emoji + title + one-line description. Minimal, sophisticated.
4. FEATURE 2 (4s): Same format. Each feature should feel like a distinct capability.
5. FEATURE 3 (4s): Same format. The third feature should be the most impressive differentiator.
6. CTA (5s): Clean, understated CTA. Outlined button style, not loud gradient. Premium aesthetic.

Guidelines:
- Everything is on near-black (#0A0A0A) backgrounds. No gradients, no particles, no visual noise. Pure typography.
- The heroWord should be one word, max 12 characters. It's displayed at 200px font size.
- The differentiator is the most important line — it should position the product as premium and indispensable.
- Features should sound sophisticated, not salesy. Benefits over features, but stated elegantly.
- All transitions are slow fades (no wipes, slides, or flips). Every movement is deliberate.
- Accent color is used sparingly — only for the thin accent line and CTA button border.
- This format works best for developer tools, design tools, and premium SaaS.`,

      11: `You are an expert viral video scriptwriter. You specialize in the "Product Promo" format — a battle-tested, high-energy template that hooks fast, shows the pain, dramatically reveals the product, highlights key features with stat callouts, builds trust with social proof, and closes with a clear CTA. Think polished Product Hunt launch video.

${contextBlock}

Write a script following this exact template (~40s total):

1. HOOK (3s): The first 3 seconds decide if people keep watching. Bold product name or tagline SLAMS in. No fluff, no slow intros. Spring physics energy — punchy and alive. Max 10 words.
2. PROBLEM STATEMENT (5s): Show the pain point your product solves. Keep it relatable and punchy. One sentence max 20 words. Words fade in one by one with a subtle shake and red flash to signal "bad."
3. PRODUCT REVEAL (8s): The hero moment — your product enters the frame dramatically. This is the longest, most animation-heavy section. Show the UI or the core feature with a 3D perspective tilt entrance and expanding drop shadow. Company name + "Introducing" label + one sentence solution.
4. FEATURE HIGHLIGHTS (16.5s): 3 features, one at a time, ~5.5s each. Each slides in from the right with spring physics. Include a stat/number callout in at least one feature description (e.g. "10x faster", "saves 5 hours/week"). SVG checkmarks animate, numbers count up from 0.
5. SOCIAL PROOF (6s): One trust metric (e.g. "500+ teams"), a logo wall of 2-5 recognizable companies, and one short testimonial quote with attribution. The testimonial card flips in with a Y-axis rotation.
6. CTA (5s): One clear call-to-action. No confusion about what to do next. Pulsing button with glow halo + confetti burst.

Guidelines:
- The video builds energy: hook grabs attention → problem creates empathy → reveal creates excitement → features inform → proof validates → CTA converts.
- Keep all copy ultra-concise — every scene is only a few seconds.
- Features should include at least one numerical stat/callout for the counter animation.
- The testimonial should feel authentic and specific — not generic praise.
- proofMetric should be the most impressive number you can credibly use.
- Accent color should match inferred brand color, or default to vibrant coral/orange.`,

      14: `You are an expert viral video scriptwriter. You specialize in the "Curiosity Loop" template — Tease → Intrigue → Reveal → Payoff. This leverages the information gap theory of curiosity to keep viewers watching.

${contextBlock}

Write a script following this exact template (~29s total):

1. TEASE (3s): Show one bold stat or claim with NO context. Just a big number like "10x faster" or "47 seconds" — it blurs into focus. The viewer immediately wants to know "10x faster than WHAT?"
2. INTRIGUE (6s): 3 lines that say what the product is NOT: "It's not another project manager", "It's not a glorified spreadsheet", etc. Each gets animated with a strikethrough. Builds tension about what it actually IS.
3. REVEAL (9s): The product dramatically rotates into frame in 3D perspective. Expanding rings pulse outward. Company name appears big and bold. Solution tagline fades in below.
4. PAYOFF (8s): Features displayed in cards + a live user counter animating up with a green pulse dot. Satisfies the curiosity gap with concrete proof.
5. CTA (5s): Clear call to action.

Guidelines:
- The teaseStat should be bold and context-free — it must CREATE curiosity, not satisfy it.
- Intrigue items should sound like genuine things the target audience might assume. NOT strawmen.
- The reveal should feel like a satisfying payoff — "THAT'S what it is!"
- proofMetric is used as the live counter value.
- Accent color should match inferred brand color, or default to vibrant coral/orange.`,

      17: `You are an expert viral video scriptwriter. You specialize in the "Social Proof Sandwich" template — Proof → Product → Proof. This format puts trust FIRST and LAST, sandwiching the product demo between layers of credibility. Best for established products, B2B, and enterprise.

${contextBlock}

Write a script following this exact template (~35s total):

1. OPENING PROOF (7s): 3 animated stat counters (e.g. "50,000+" users, "4.9" rating, "500+" companies). Each counts up with spring animation. Below: 2-3 award badges stagger in.
2. PRODUCT (18s): 3-4 enterprise features shown in a polished 2×2 grid with scale-in animation. "Inside [Product]" subtitle. Each card has icon + title + description.
3. CLOSING PROOF (7s): Logo wall of 3-5 recognizable companies fading in + 3 customer testimonial cards with star rating reveals. Each testimonial has quote, author name, and role.
4. CTA (5s): Two-button layout: primary gradient CTA + secondary outline "Book a demo" button. Premium feel.

Guidelines:
- Stats should be the 3 most impressive numbers. Use real-feeling metrics. Value field should include number + suffix (e.g. "50,000+", "4.9", "500+").
- Awards should sound credible — "Product of the Year", "Best in Class", "G2 Leader", etc.
- Testimonials should feel authentic — specific details, casual language, real-sounding names and roles.
- proofLogos should be recognizable companies in the target industry.
- This format works best when you have strong social proof. Lean into credibility over hype.
- Accent color should match inferred brand color, or default to vibrant coral/orange.`,

      18: `You are an expert viral video scriptwriter. You specialize in the "App Showcase" format — a premium, dark-themed template with macOS AppWindow chrome that works for any software product. Clean, developer-focused aesthetic with spring animations and elegant typography.

${contextBlock}

Write a script following this exact 6-scene template (~27s total):

1. PRODUCT INTRO (4s): macOS-style app window with typing animation revealing the company name in elegant serif font, logo badge, and tagline fading in below. Creates a premium first impression.

2. PRODUCT OVERVIEW (5s): Show the product's main value prop inside an AppWindow with a dashboard placeholder and the solution text below.

3. FEATURE PANELS (6s): 3 features displayed as dark dashboard-style cards inside an AppWindow. Each card has an emoji icon in an accent-tinted box, bold title, and one-liner description. Cards stagger in with spring animations.

4. HOW IT WORKS (5s): 3 numbered steps shown horizontally with dashed arrow connectors between them. Each step has the feature icon, a numbered badge, title, and description. Clean, step-by-step layout.

5. SOCIAL PROOF (5s): Trust metrics with a live counter animation (number counting up), recognizable company logos in dark cards, and a tagline. Green pulse dot next to the metric.

6. CTA (4s): Logo badge, bold CTA text with breathing animation, gradient accent button, and website URL in monospace on a dark card. Subtle grid background.

Guidelines:
- This template works for ANY product — SaaS, dev tools, mobile apps, platforms.
- Keep copy concise — each scene is short. Benefits over features.
- The dark theme (#0c0a09 bg) with subtle floating particles creates a premium feel.
- proofMetric should be the most impressive number + unit you can credibly use.
- proofLogos should be 2-5 recognizable companies in the target industry.
- Generate exactly 3 features. Each should highlight a distinct benefit.
- Accent color should match inferred brand color, or default to amber (#fbbf24) for tech products.`,

      19: `You are an expert viral video scriptwriter. You specialize in the "Founder Demo" format — a personal, authentic walkthrough where the founder shows off their product step by step. This format works because founders are the most credible advocates and viewers love seeing the real person behind the product.

${contextBlock}

Write a script following this exact template (~40s total):

1. FOUNDER INTRO (4s): "Let me show you [Product]" — warm, personal opening. The founder's name and title appear in a badge below. This feels like the start of a 1-on-1 demo call.

2. APP OVERVIEW (7s): Show the product's main screen with company name, tagline, and one-sentence solution. This is the "here's what it looks like" moment.

3. DEMO STEP 1 (6s): First step of using the product. Title + description. This should be the setup/onboarding step.

4. DEMO STEP 2 (6s): Second step — the customization or core workflow step. Different content. Show the product's flexibility.

5. DEMO STEP 3 (6s): Third step — the collaboration or sharing moment. Show how teams or users interact with the product.

6. DEMO STEP 4 (6s): Fourth step — the payoff. The "ship it" or "go live" moment. This should feel like the climax of the demo.

7. FEATURE RECAP (5s): Quick 2×2 grid showing all key features with icons. "Everything you get with [Product]" subtitle.

8. CTA (4s): Strong call to action with the founder's name as attribution: "— [FounderName], [CompanyName]".

Guidelines:
- The founderName should be a realistic full name (first + last). Infer from website content if possible.
- The founderTitle should be something like "CEO & Co-founder", "Founder & CTO", etc.
- Each demoStep should tell a sequential story: setup → use → collaborate → ship.
- Step titles should be action-oriented: "Create a project", "Customize everything", "Invite your team", "Ship instantly".
- Step descriptions should be benefit-focused, max 15 words each.
- Features should complement the demo steps — showing capabilities the steps didn't cover.
- Accent color should match inferred brand color, or default to vibrant coral/orange.`,

      21: `You are an expert viral video scriptwriter. You specialize in the "SaaS Promo" format — a high-conversion 25-second dark-themed product promo built for social media virality. It follows a precise 6-scene kinetic motion graphics structure designed to hook, empathize, reveal, demo, prove, and convert.

${contextBlock}

Write a script following this exact template (~25 seconds total):

1. KINETIC HOOK (3s): A single bold, scroll-stopping statement — max 10 words. This is a PATTERN INTERRUPT. It should slam in with kinetic energy. Lead with the biggest outcome, tension, or provocative question. Example: "Still wasting hours on this?" or "Your competitors are already using this." The text explodes onto a pure black background word-by-word.

2. PROBLEM VISUALIZATION (4s): Two short, specific pain-point statements that the viewer feels in their gut. Each is shown as a floating red-bordered card on screen. Max 10 words each. Use emotional, first-person frustration language. NOT generic — specific to this product's audience.

3. PRODUCT REVEAL (5s): "{CompanyName} solves this." — That exact format. Plus a one-sentence solution description (max 20 words). This is the hero moment: the logo badge springs in with pulsing glow rings and a cinematic light-leak sweep.

4. FEATURE DEMO (3 features × 3.5s = ~10.5s): 3 key features of the product, each shown as a separate scene with a cursor clicking on a mini app UI. Each feature: icon + title (2-4 words) + description (max 15 words). The cursor visually "navigates" to each feature — this is the demo moment.

5. SOCIAL PROOF (3s): Two impressive stats shown as giant animated counters. Pick the 2 most credible, high-impact metrics. Each needs a number that can count up (e.g. "10,000+" not "Unlimited"). One should be about scale (users/teams), the other about performance/reliability.

6. CTA OUTRO (3s): One clear call-to-action phrase, 3-6 words max. Pulsing gradient button. Logo + website URL. Cinematic fade to black.

Guidelines:
- The hook MUST feel like a pattern interrupt — surprising, visual, kinetic.
- Pain points should use "you" language — make the viewer feel seen.
- The reveal uses the literal phrase "{companyName} solves this." — keep the companyName short and clean.
- Features should each highlight a distinct capability — not variations of the same thing.
- Stats must use real numbers that can animate up (avoid "unlimited" or "—").
- Keep ALL copy ultra-concise. Every second counts.
- Accent color should match inferred brand color, or default to vibrant coral/orange.`,

      20: `You are an expert viral video scriptwriter. You specialize in the "Announcement" format — a clean, typographic, Apple-style reveal using typewriter-animated title cards. This format is perfect for product launches, major updates, and "introducing..." moments. Minimal visuals, maximum impact through words alone.

${contextBlock}

Write a script following this exact template (~29s total):

The video consists of 2-4 sequential title cards, each with two lines typed out with a typewriter effect on a near-black background. After the title cards, optional video playback and end card scenes can follow (those are user-provided, not AI-generated).

TITLE CARD 1: The tease — create intrigue without revealing the product yet.
- Line 1: A provocative or intriguing opening statement (max 6 words)
- Line 2: Completes the thought with a twist or pause (max 5 words)
- Example: "Introducing something new" / "that changes everything."

TITLE CARD 2: The value proposition — explain what makes this special.
- Line 1: The core benefit or differentiator (max 6 words)
- Line 2: A supporting detail (max 5 words)
- Example: "Built for speed" / "designed for clarity."

TITLE CARD 3: The call to action — drive the viewer to act.
- Line 1: Availability or urgency (max 6 words)
- Line 2: Direct action prompt (max 5 words)
- Example: "Available now" / "try it today."

Guidelines:
- Each title card should feel like a standalone moment — dramatic pause between cards.
- Line 1 is displayed in large, bold white text (72px). Line 2 is slightly smaller and dimmer (56px, 70% opacity).
- The typewriter cursor blinks in the accent color between lines.
- Keep language premium, confident, and minimal. No emojis, no exclamation marks. Think Apple keynote energy.
- typewriterSpeed: Use 1 for fast-paced announcements (default), 2 for more dramatic pacing.
- holdFrames: Use 60-90 for standard pacing, 90-120 for dramatic pauses between cards.
- The overall arc should be: intrigue → explain → convert.
- Accent color is used sparingly (cursor, subtle glow). Match brand color or default to vibrant coral/orange.`,

      22: `You are an expert viral video scriptwriter. You specialize in the "Comparison / VS" format — a side-by-side "Us vs Them" or "Old Way vs New Way" comparison that creates instant contrast.

${contextBlock}

Write a script following this template (~25s total):

1. HOOK (3s): Bold statement that creates contrast, e.g. "There's a better way" or "Stop settling for less"
2. THE OLD WAY (6s): 3-4 pain points representing the competitor/manual approach. Short phrases, max 8 words each. Red-accented, chaotic energy.
3. VS DIVIDER (1s): Quick animated "VS" split
4. THE NEW WAY (6s): Product benefits that directly counter each pain point. Green-accented, clean energy.
5. COMPARISON GRID (4s): Side-by-side 3-row grid with ✕ (old) vs ✓ (new)
6. PRODUCT REVEAL (4s): Company name + tagline + confetti
7. CTA (4s): Clear call to action

Pain points = "old way" problems. Features = "new way" solutions. Each pain point should directly map to a feature. Accent color for the "new way" side.`,

      23: `You are an expert viral video scriptwriter. You specialize in the "Testimonial Carousel" format — social proof as the star of the show. Quotes, stars, and credibility build unstoppable trust.

${contextBlock}

Write a script following this template (~27s total):

1. HOOK (3s): A big stat metric + company name, e.g. "Trusted by 10,000+ teams"
2. TESTIMONIAL 1 (6s): First customer quote (max 20 words), 5-star rating, author name + role
3. TESTIMONIAL 2 (6s): Second quote, different perspective (e.g. about speed, ease, results)
4. TESTIMONIAL 3 (6s): Third quote, most powerful/emotional one
5. LOGO WALL (4s): 3-5 recognizable company logos + "Trusted by industry leaders" text
6. CTA (5s): Gradient button CTA + website URL

Testimonials should feel authentic — specific details, casual language, real-sounding names. Each testimonial highlights a different benefit. proofMetric should be the most impressive trust metric.`,

      24: `You are an expert viral video scriptwriter. You specialize in the "Metrics & Growth" format — a data-driven video showing traction, growth, and impressive numbers. Perfect for fundraising, investor updates, and showing momentum.

${contextBlock}

Write a script following this template (~27s total):

1. HOOK (3s): "The numbers speak for themselves" style opening
2. STAT 1 (3.3s): First big metric counter animating up (e.g. "50,000+ users")
3. STAT 2 (3.3s): Second metric (e.g. "$2.5M ARR")
4. STAT 3 (3.3s): Third metric (e.g. "99.9% uptime")
5. GROWTH TIMELINE (5s): 2-3 milestone achievements on a timeline
6. FEATURE GRID (5s): 2x2 feature grid showing capabilities
7. COMPANY NAME (3s): Company name + tagline
8. CTA (4s): Call to action

Stats must include concrete numbers that can animate as counters. Awards/milestones should be time-ordered achievements. Accent color matches brand.`,

      25: `You are an expert viral video scriptwriter. You specialize in the "Feature Changelog" format — a "What's New" style update video showcasing recent features. Modern, clean changelog aesthetic.

${contextBlock}

Write a script following this template (~22s total):

1. WHAT'S NEW (3s): "What's New" title with company name and version badge
2. FEATURE 1 (4.7s): First new feature with emoji icon, bold title, description
3. FEATURE 2 (4.7s): Second new feature, different capability
4. FEATURE 3 (4.7s): Third new feature, most impressive one
5. RECAP (4s): All 3 feature icons with titles in a row
6. CTA (4s): "Try it now" with gradient button

Features should focus on what's NEW — recent additions, improvements, or updates. Each feature should feel like an exciting addition. Accent color matches brand.`,

      26: `You are an expert viral video scriptwriter. You specialize in the "Explainer / How It Works" format — a step-by-step walkthrough that makes complex products simple. Clear, visual, educational.

${contextBlock}

Write a script following this template (~30s total):

1. HOOK (3s): Question like "How does it work?" or "Getting started is easy"
2. STEP 1 (4s): First step — setup/onboarding. Numbered circle, title, description.
3. STEP 2 (4s): Second step — core workflow. Different content.
4. STEP 3 (4s): Third step — collaboration or key feature.
5. STEP 4 (4s): Fourth step — the payoff (ship/deploy/go live).
6. FLOW DIAGRAM (5s): All steps shown as a horizontal flow with arrows
7. CTA (6s): Solution statement + website URL

Steps should tell a sequential story: setup → use → collaborate → get results. Each step title is action-oriented (verb first). Max 15 words per description.`,

      27: `You are an expert viral video scriptwriter. You specialize in cinematic "Logo Reveal" brand intros. Maximum drama, minimal text, pure visual impact.

${contextBlock}

Write a script for a 15-second logo reveal. Keep it minimal:
- companyName: the brand name
- tagline: one-line tagline (max 8 words)
- accentColor: match the brand color
- logoText: 2-3 letter abbreviation

This is a pure visual intro. The AI generates only the text content; the animation (particles, glow, shine) is pre-built in the template.`,

      28: `You are an expert viral video scriptwriter. You specialize in the "Pitch Deck Video" format — a polished investor-facing video showing problem, solution, traction, and opportunity. Premium and data-driven.

${contextBlock}

Write a script following this template (~35s total):

1. TITLE CARD (3s): Company name + tagline with "Investor Update" badge
2. PROBLEM (5s): Problem statement + 2-3 pain point cards
3. SOLUTION (5s): Solution + 2x2 feature grid
4. TRACTION (5s): 2-3 key metrics (users, revenue, growth) + award badges
5. SOCIAL PROOF (5s): Testimonial + proof logos
6. MARKET (4s): Big market opportunity stat (e.g. "$50B market")
7. CTA (4s): "Get in touch" / "Learn more" with website
8. END CARD (4s): Logo

Stats should be investor-relevant metrics (revenue, users, growth rate). BigStat should be the TAM/market opportunity. Awards can be funding milestones or recognition. Accent color matches brand.`,

      29: `You are an expert viral video scriptwriter. You specialize in the "App Walkthrough" format — a product tour with a simulated browser showing the app in action. Cursor animations demonstrate features.

${contextBlock}

Write a script following this template (~30s total):

1. HOOK (3s): "Let me show you [product]" style opening with company badge
2. BROWSER ENTRANCE (5s): Browser mockup appears showing the product URL in the address bar
3. FEATURE DEMO 1 (4s): Cursor clicks on first feature area. Tooltip shows feature title + description.
4. FEATURE DEMO 2 (4s): Cursor navigates to second feature. Different tooltip.
5. FEATURE DEMO 3 (4s): Cursor demonstrates third feature. Third tooltip.
6. FULL VIEW (4s): Pull back to show all features as checkmark badges
7. CTA (6s): "Try it yourself" with website URL

demoSteps = the 3 cursor walkthrough moments. Each step title is what the cursor "clicks on". Each description explains what happens. Features complement the demo steps.`,

    };

    const prompt =
      viralPrinciples + (templatePrompts[template] ?? templatePrompts[3]);
    const schema = getSchemaForTemplate(template);

    const { object } = await generateObject({
      model: openai("gpt-5.2"),
      schema,
      prompt,
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("[generate]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
