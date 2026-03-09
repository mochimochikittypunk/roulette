"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CouponItem, useCoupon } from '@/hooks/useCoupon';
import { useGame } from '@/contexts/GameContext'; // Required just for logEvent

type ReviewStatus = 'IDLE' | 'VERIFYING' | 'RESULT' | 'ERROR';

interface ReviewContextType {
    status: ReviewStatus;
    result: CouponItem | null;
    errorMessage: string;
    currentOrderNumber: string;
    verifyAndDraw: (orderNumber: string) => Promise<void>;
    resetReview: () => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider = ({ children }: { children: ReactNode }) => {
    const [status, setStatus] = useState<ReviewStatus>('IDLE');
    const [result, setResult] = useState<CouponItem | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [currentOrderNumber, setCurrentOrderNumber] = useState('');

    const { drawCoupon } = useCoupon();
    // We can reuse the logEvent from GameContext since it handles API sending gracefully
    // But since GameProvider will be high up, we can access it.
    // However, if we want full isolation, we could duplicate the fetch('/api/log-event'),
    // but pulling useGame inside ReviewContext is fine since they are nested.
    const { logEvent } = useGame();

    const verifyAndDraw = async (orderNumber: string) => {
        setStatus('VERIFYING');
        setErrorMessage('');
        setResult(null);

        try {
            const response = await fetch('/api/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNumber, mode: 'REVIEW' }),
            });
            const data = await response.json();

            if (data.allowed) {
                // Number of occurrences in sheet is returned directly as count in REVIEW mode
                const count = data.count || 0;

                // Process Coupon Draw based on the count
                const awardedCoupon = drawCoupon(count);
                setResult(awardedCoupon);
                setCurrentOrderNumber(orderNumber);
                setStatus('RESULT');

                // Log the event asynchronously
                logEvent('ReviewCouponAwarded', {
                    orderNumber,
                    count_in_sheet: count,
                    coupon_type: awardedCoupon.type
                });

            } else {
                setErrorMessage(data.error || '該当する注文番号がありません');
                setStatus('ERROR');
                logEvent('ReviewAuthFail', { orderNumber, error: data.error });
            }
        } catch (error) {
            console.error('Verify error:', error);
            setErrorMessage('通信エラーが発生しました。再度お試しください。');
            setStatus('ERROR');
            logEvent('ReviewSystemError', { error: String(error) });
        }
    };

    const resetReview = () => {
        setStatus('IDLE');
        setResult(null);
        setErrorMessage('');
        setCurrentOrderNumber('');
    };

    return (
        <ReviewContext.Provider value={{
            status,
            result,
            errorMessage,
            currentOrderNumber,
            verifyAndDraw,
            resetReview
        }}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReview = () => {
    const context = useContext(ReviewContext);
    if (context === undefined) {
        throw new Error('useReview must be used within a ReviewProvider');
    }
    return context;
};
