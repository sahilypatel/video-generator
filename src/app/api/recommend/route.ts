import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export async function POST(req: NextRequest) {
  try {
    const { companyName, tagline, description, features, markdown } = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const schema = z.object({
      recommended: z.number().describe("The best template number"),
      reason: z.string().describe("One sentence explaining why this template fits best"),
      alternatives: z.array(z.number()).min(2).max(3).describe("2-3 alternative template numbers"),
    });

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema,
      prompt: `You are a video marketing expert. Based on the following website data, recommend the best video template.

Available templates:
- 3: "6-Act" (31s) - Classic story arc: hook → pain → reveal → features → proof → CTA. Best for general SaaS products.
- 4: "Problem Stack" (18s) - Pain points pile up then vanish. Best for products solving multiple frustrations.
- 7: "Before/After" (24s) - Dramatic transformation. Best for products with clear before/after states.
- 8: "Myth Buster" (28s) - Challenges false beliefs. Best for disruptive products in established markets.
- 10: "Cinematic" (25s) - Apple-style minimal. Best for premium/developer tools.
- 11: "Product Promo" (40s) - Full product showcase with stats. Best for Product Hunt launches.
- 14: "Curiosity Loop" (29s) - Tease → Intrigue → Reveal. Best for novel/unique products.
- 17: "Social Proof" (35s) - Proof → Product → Proof. Best for B2B/enterprise with strong social proof.
- 18: "App Showcase" (27s) - macOS-style demo. Best for desktop/web apps.
- 19: "Founder Demo" (40s) - Founder walkthrough. Best for early-stage startups.
- 21: "SaaS Promo" (25s) - Dark kinetic promo. Best for modern SaaS targeting developers.
- 22: "Comparison" (25s) - Us vs Them. Best for products competing against clear alternatives.
- 23: "Testimonials" (27s) - Quote carousel. Best for products with strong customer feedback.
- 24: "Metrics" (27s) - Growth stats. Best for products with impressive numbers/traction.
- 25: "Changelog" (22s) - What's New. Best for feature updates/releases.
- 26: "How It Works" (30s) - Step-by-step. Best for complex products that need explanation.
- 27: "Logo Reveal" (15s) - Brand intro. Best for brand awareness/YouTube intros.
- 28: "Pitch Deck" (35s) - Investor pitch. Best for fundraising.
- 29: "App Tour" (30s) - Browser walkthrough. Best for web apps with strong UI.

Website data:
Company: ${companyName ?? "Unknown"}
Tagline: ${tagline ?? ""}
Description: ${description ?? ""}
Features: ${features?.join(", ") ?? ""}
Context: ${markdown?.slice(0, 1500) ?? ""}

Recommend the single best template based on the product type, stage, and content available. Consider what data is available (testimonials? stats? clear before/after?) when choosing.`
    });

    return NextResponse.json(object);
  } catch (error) {
    console.error("[recommend]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Recommendation failed" },
      { status: 500 }
    );
  }
}
