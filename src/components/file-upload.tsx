import React, { useCallback } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  className?: string;
}

export function FileUpload({ onFileSelect, isProcessing, className }: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (isProcessing) return;
      
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") {
        onFileSelect(file);
      }
    },
    [onFileSelect, isProcessing]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isProcessing) return;
      const file = e.target.files?.[0];
      if (file && file.type === "application/pdf") {
        onFileSelect(file);
      }
    },
    [onFileSelect, isProcessing]
  );

  return (
    <div
      className={cn(
        "border-2 border-dashed border-input rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-muted/50 cursor-pointer",
        isProcessing && "opacity-50 cursor-not-allowed",
        className
      )}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <input
        id="file-upload"
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleChange}
        disabled={isProcessing}
      />
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <UploadCloud className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {isProcessing ? "Processing PDF..." : "Drop your PDF here"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        Your file stays private. It's processed entirely in your browser.
      </p>
    </div>
  );
}
