"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-6 antialiased">
        <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl text-center space-y-6">
          <h2 className="text-xl font-bold text-white">Critical Error</h2>
          <p className="text-xs text-zinc-400 font-mono">
            {error?.message || "A global error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            Refresh Page
          </button>
        </div>
      </body>
    </html>
  );
}
