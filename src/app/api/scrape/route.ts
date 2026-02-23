import { NextRequest, NextResponse } from "next/server";
import FirecrawlApp from "@mendable/firecrawl-js";

interface ScrapedData {
  companyName?: string;
  tagline?: string;
  description?: string;
  features?: string[];
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "FIRECRAWL_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const app = new FirecrawlApp({ apiKey });

    const result = await app.scrape(url, {
      formats: [
        "markdown",
        {
          type: "json",
          prompt:
            "Extract: companyName (string), tagline (short value prop 5-10 words, string), description (main product description, string), features (array of 3-5 key features as strings), logoUrl (absolute URL of the logo image if found, string or null), primaryColor (hex color of the main brand/accent color found in buttons, links, or headers, string or null), secondaryColor (hex color of a secondary brand color if found, string or null)",
        },
      ],
    });

    const markdown = (result as Record<string, unknown>).markdown as string ?? "";
    const jsonData = (result as Record<string, unknown>).json as ScrapedData | null;

    // Fallback company name from domain
    let fallbackName = "Your Startup";
    try {
      fallbackName = new URL(url).hostname.replace("www.", "").split(".")[0];
      fallbackName = fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1);
    } catch {}

    // Fallback: parse title from markdown
    const titleMatch = markdown.match(/^#\s+(.+)/m);
    if (titleMatch && fallbackName === "Your Startup") {
      fallbackName = titleMatch[1].trim();
    }

    return NextResponse.json({
      companyName: jsonData?.companyName ?? fallbackName,
      tagline: jsonData?.tagline ?? "The product you've been waiting for",
      description: jsonData?.description ?? markdown.slice(0, 500),
      features: jsonData?.features ?? [],
      logoUrl: jsonData?.logoUrl ?? null,
      primaryColor: jsonData?.primaryColor ?? null,
      secondaryColor: jsonData?.secondaryColor ?? null,
      markdown: markdown.slice(0, 3000),
    });
  } catch (error) {
    console.error("[scrape]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scrape failed" },
      { status: 500 }
    );
  }
}
