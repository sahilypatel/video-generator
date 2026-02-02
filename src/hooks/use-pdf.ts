import { useState, useCallback } from "react";
import { extractTextFromPDF, chunkText, DocumentChunk } from "@/lib/pdf";

export function usePDF() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [chunks, setChunks] = useState<DocumentChunk[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processPDF = useCallback(async (file: File) => {
    setIsExtracting(true);
    setError(null);
    setFile(file);
    try {
      const text = await extractTextFromPDF(file);
      const newChunks = chunkText(text);
      setChunks(newChunks);
      console.log(`Extracted ${newChunks.length} chunks from PDF`);
    } catch (err) {
      console.error("Error processing PDF:", err);
      setError("Failed to process PDF. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  }, []);

  return {
    file,
    chunks,
    isExtracting,
    error,
    processPDF,
  };
}
