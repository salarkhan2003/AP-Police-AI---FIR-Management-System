'use client';

import { AlertOctagon, Home, ArrowLeft } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-[#0A0E27] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
            <AlertOctagon className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Critical Error
          </h1>

          <p className="text-gray-400 mb-8">
            A critical error occurred. Please refresh the page or return home.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Try Again
            </button>

            <a href="/">
              <button className="px-6 py-3 bg-white/10 backdrop-blur text-white font-semibold rounded-xl flex items-center justify-center gap-2 border border-white/20">
                <Home className="w-5 h-5" />
                Go Home
              </button>
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}

