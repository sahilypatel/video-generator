"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "/viral-video.html";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "'Sora', sans-serif", background: "#FAF9F6" }}>
      <p className="text-gray-400">Redirecting...</p>
    </div>
  );
}
