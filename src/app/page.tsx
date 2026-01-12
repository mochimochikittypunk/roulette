"use client";

import { Controls } from "@/components/Controls";
import { DebugMenu } from "@/components/DebugMenu";
import { RouletteReel } from "@/components/RouletteReel";

export default function Home() {
  return (
    <main className="fixed inset-0 flex flex-col bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Roulette Area - takes most of the screen */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <RouletteReel />
        </div>
      </div>

      {/* Controls - directly below reel */}
      <div className="flex-none pb-8 pt-2">
        <Controls />
      </div>

      {/* Debug Menu - Fixed to bottom right */}
      <DebugMenu />
    </main>
  );
}
