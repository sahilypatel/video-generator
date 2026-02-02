"use client";

import React from "react";
import { FileUpload } from "@/components/file-upload";
import { ChatInterface } from "@/components/chat-interface";
import { usePDF } from "@/hooks/use-pdf";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { file, chunks, isExtracting, processPDF, error } = usePDF();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col items-center p-4 md:p-8">
      <header className="w-full max-w-5xl flex justify-between items-center mb-8 md:mb-12">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="font-bold text-primary">O</span>
            </div>
            <h1 className="font-bold text-xl tracking-tight">Okara Chat</h1>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Product</a>
            <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#" className="hover:text-foreground transition-colors">About</a>
        </nav>
      </header>

      <div className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center relative">
        
        <AnimatePresence mode="wait">
            {!file ? (
                <motion.div 
                    key="upload"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-md space-y-8 text-center"
                >
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Chat with any PDF
                        </h1>
                        <p className="text-muted-foreground">
                            Upload your documents and get answers instantly. Private, secure, and fast.
                        </p>
                    </div>
                    
                    <FileUpload 
                        onFileSelect={processPDF} 
                        isProcessing={isExtracting}
                        className="bg-card shadow-sm"
                    />
                    
                    {error && (
                        <p className="text-destructive text-sm bg-destructive/10 p-2 rounded-md">
                            {error}
                        </p>
                    )}
                </motion.div>
            ) : (
                <motion.div 
                    key="chat"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full flex gap-6"
                >
                   {/* We could split view here if we had a PDF viewer, for now just centered Chat */}
                   <div className="flex-1 h-full max-h-[800px]">
                        <ChatInterface chunks={chunks} fileName={file.name} />
                   </div>
                   
                   {/* Optional: PDF Preview sidebar could go here */}
                   <div className="hidden lg:block w-1/3 h-full max-h-[800px] bg-card rounded-2xl border p-4 shadow-sm opacity-50 cursor-not-allowed flex items-center justify-center text-center text-muted-foreground text-sm">
                        PDF Preview <br/>(Coming Soon)
                   </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
      
      <footer className="w-full max-w-5xl mt-12 py-6 border-t text-center text-sm text-muted-foreground">
        <p>© 2026 Okara.ai. All rights reserved.</p>
      </footer>
    </main>
  );
}
