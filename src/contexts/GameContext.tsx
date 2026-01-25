"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LotteryItem, useLottery, LotteryItemType, LOTTERY_ITEMS } from '@/hooks/useLottery';

type GameStatus = 'IDLE' | 'SPINNING' | 'STOPPING' | 'RESULT';

interface GameContextType {
    isDebugMode: boolean;
    debugTarget: LotteryItemType | null;
    status: GameStatus;
    result: LotteryItem | null;
    isAuthenticated: boolean;
    isVerifying: boolean;
    toggleDebugMode: () => void;
    setDebugTarget: (target: LotteryItemType | null) => void;
    login: (orderNumber: string) => Promise<{ success: boolean; message?: string }>;
    logEvent: (eventType: string, details?: any, result?: string) => Promise<void>;
    startGame: () => void;
    stopGame: () => void;
    finishGame: () => void;
    resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [isDebugMode, setIsDebugMode] = useState(false);
    const [debugTarget, setDebugTarget] = useState<LotteryItemType | null>(null);
    const [status, setStatus] = useState<GameStatus>('IDLE');
    const [result, setResult] = useState<LotteryItem | null>(null);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const { draw } = useLottery(isDebugMode);

    const toggleDebugMode = () => setIsDebugMode(prev => !prev);

    const login = async (orderNumber: string): Promise<{ success: boolean; message?: string }> => {
        setIsVerifying(true);
        try {
            const response = await fetch('/api/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderNumber }),
            });
            const data = await response.json();

            if (data.allowed) {
                setIsAuthenticated(true);
                return { success: true };
            } else {
                return { success: false, message: data.error || '認証に失敗しました' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: '通信エラーが発生しました' };
        } finally {
            setIsVerifying(false);
        }
    };

    const startGame = () => {
        if (status !== 'IDLE' && status !== 'RESULT') return;
        setStatus('SPINNING');
        setResult(null);
    };

    const stopGame = () => {
        if (status !== 'SPINNING') return;

        let drawResult: LotteryItem;

        if (isDebugMode && debugTarget) {
            drawResult = LOTTERY_ITEMS[debugTarget];
        } else {
            drawResult = draw();
        }

        setResult(drawResult);
        setStatus('STOPPING');
        // The visual component will detect 'STOPPING' and trigger 'RESULT' after animation
    };

    const logEvent = async (eventType: string, details: any = {}, result?: string) => {
        try {
            await fetch('/api/log-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventType,
                    details,
                    result,
                    userAgent: navigator.userAgent
                }),
            });
        } catch (error) {
            console.error('Logging failed:', error);
            // Non-blocking error
        }
    };

    const finishGame = () => {
        if (result) {
            logEvent('GameResult', { type: result.type, label: result.label }, result.label);
        }
        setStatus('RESULT');
    };

    const resetGame = () => {
        setStatus('IDLE');
        setResult(null);
    };

    return (
        <GameContext.Provider value={{
            isDebugMode,
            debugTarget,
            status,
            result,
            isAuthenticated,
            isVerifying,
            toggleDebugMode,
            setDebugTarget,
            login,
            logEvent,
            startGame,
            stopGame,
            finishGame,
            resetGame
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
