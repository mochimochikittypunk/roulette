"use client";

import React from 'react';
import { ReviewProvider, useReview } from '@/contexts/ReviewContext';
import { ReviewTitleScreen } from '@/components/ReviewTitleScreen';
import { ReviewResultScreen } from '@/components/ReviewResultScreen';

export const ReviewAppContent = () => {
    const { status } = useReview();

    return (
        <main className="fixed inset-0 flex flex-col bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            <div className="flex-1 flex items-center justify-center">
                {status === 'IDLE' || status === 'VERIFYING' || status === 'ERROR' ? (
                    <ReviewTitleScreen />
                ) : (
                    <ReviewResultScreen />
                )}
            </div>
        </main>
    );
};

export const ReviewApp = () => {
    return (
        <ReviewProvider>
            <ReviewAppContent />
        </ReviewProvider>
    );
};
