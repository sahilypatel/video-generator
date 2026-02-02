"use client";

import React, { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Send, User, Bot, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DocumentChunk, findRelevantChunks } from "@/lib/pdf";
import { AnimatePresence, motion } from "framer-motion";

interface ChatInterfaceProps {
  chunks: DocumentChunk[];
  fileName?: string;
}

export function ChatInterface({ chunks, fileName }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Find relevant chunks
    const relevantChunks = findRelevantChunks(input, chunks);
    const context = relevantChunks.map(c => c.text).join("\n\n---\n\n");
    
    // Clear input immediately
    const message = input;
    setInput("");
    
    // Send message with context
    await sendMessage({
      text: message,
    }, {
      body: {
        context,
      }
    });
  };
  
  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col h-full max-h-[800px] w-full max-w-2xl mx-auto bg-card rounded-2xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
                <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
                <h2 className="font-semibold text-sm">Chat with PDF</h2>
                {fileName && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{fileName}</p>}
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <Bot className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Ask any question about your document.</p>
                <p className="text-xs opacity-70 mt-2">Examples: "Summarize this file", "What are the key points?"</p>
            </div>
        )}
        
        <AnimatePresence initial={false}>
            {messages.map((m) => {
              // Extract text content from parts
              const textContent = m.parts
                .filter((part: any) => part.type === 'text')
                .map((part: any) => part.text)
                .join('');
                
              return (
                <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                    "flex w-full",
                    m.role === "user" ? "justify-end" : "justify-start"
                    )}
                >
                    <div
                    className={cn(
                        "flex max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                        m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    )}
                    >
                    {textContent}
                    </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
        
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                    <span className="text-xs opacity-50">Thinking...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={onFormSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
