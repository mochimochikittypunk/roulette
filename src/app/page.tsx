"use client";
import React, { useState } from 'react';
import { RouletteApp } from "@/components/RouletteApp";
import { ReviewApp } from "@/components/ReviewApp";
import { ModeSelectionScreen } from "@/components/ModeSelectionScreen";

export default function Home() {
  // Read feature flags
  const isRouletteEnabled = process.env.NEXT_PUBLIC_ENABLE_ROULETTE === 'true';
  const isReviewEnabled = process.env.NEXT_PUBLIC_ENABLE_REVIEW === 'true';

  // State for user selection when both features are enabled
  const [selectedMode, setSelectedMode] = useState<'ROULETTE' | 'REVIEW' | null>(null);

  // Scenario 1: Both enabled but user hasn't selected yet
  if (isRouletteEnabled && isReviewEnabled && !selectedMode) {
    return <ModeSelectionScreen onSelectMode={setSelectedMode} />;
  }

  // Determine active mode based on selection or which single feature is enabled
  const activeMode = selectedMode || (isRouletteEnabled ? 'ROULETTE' : isReviewEnabled ? 'REVIEW' : null);

  // Scenario 2: Active mode is Roulette and it's enabled
  if (activeMode === 'ROULETTE' && isRouletteEnabled) {
    return <RouletteApp />;
  }

  // Scenario 3: Active mode is Review and it's enabled
  if (activeMode === 'REVIEW' && isReviewEnabled) {
    return <ReviewApp />;
  }

  // Scenario 4: Nothing is enabled
  return (
    <main className="fixed inset-0 flex items-center justify-center bg-slate-900 overflow-hidden">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-300">メンテナンス中</h1>
        <p className="text-slate-400">現在サービスをご利用いただけません。</p>
      </div>
    </main>
  );
}
