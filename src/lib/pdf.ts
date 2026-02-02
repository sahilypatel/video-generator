// Dynamic import types for pdfjs-dist
type PDFDocumentProxy = any;
type TextItem = any;

export interface PDFPage {
  pageNumber: number;
  text: string;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  // Ensure this only runs on the client
  if (typeof window === "undefined") {
    throw new Error("PDF extraction must run in the browser");
  }
  
  // Dynamic import to avoid SSR issues
  const pdfjsLib = await import("pdfjs-dist");
  
  // Set worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    
    fullText += pageText + "\n\n";
  }

  return fullText;
}

export interface DocumentChunk {
  text: string;
  metadata: {
    pageNumber?: number;
  };
}

// Simple chunking strategy
export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    let chunkText = text.slice(start, end);
    
    chunks.push({
      text: chunkText,
      metadata: {},
    });

    start += chunkSize - overlap;
  }

  return chunks;
}

export function findRelevantChunks(query: string, chunks: DocumentChunk[], limit: number = 3): DocumentChunk[] {
    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    
    if (queryTerms.length === 0) return chunks.slice(0, limit);

    const scoredChunks = chunks.map(chunk => {
        const text = chunk.text.toLowerCase();
        let score = 0;
        queryTerms.forEach(term => {
            // Simple frequency count
            const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            const matches = text.match(regex);
            if (matches) {
                score += matches.length;
            }
        });
        return { chunk, score };
    });

    scoredChunks.sort((a, b) => b.score - a.score);
    
    // Filter out chunks with 0 score if possible, or just return top K
    return scoredChunks.filter(s => s.score > 0).slice(0, limit).map(s => s.chunk);
}
