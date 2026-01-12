"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LotteryItem, useLottery } from '@/hooks/useLottery';

type GameStatus = 'IDLE' | 'SPINNING' | 'STOPPING' | 'RESULT';

interface GameContextType {
    isDebugMode: boolean;
    status: GameStatus;
    result: LotteryItem | null;
    toggleDebugMode: () => void;
    startGame: () => void;
    stopGame: () => void;
    finishGame: () => void;
    resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [isDebugMode, setIsDebugMode] = useState(false);
    const [status, setStatus] = useState<GameStatus>('IDLE');
    const [result, setResult] = useState<LotteryItem | null>(null);

    const { draw } = useLottery(isDebugMode);

    const toggleDebugMode = () => setIsDebugMode(prev => !prev);

    const startGame = () => {
        if (status !== 'IDLE' && status !== 'RESULT') return;
        setStatus('SPINNING');
        setResult(null);
    };

    const stopGame = () => {
        if (status !== 'SPINNING') return;

        const drawResult = draw();
        setResult(drawResult);
        setStatus('STOPPING');
        // The visual component will detect 'STOPPING' and trigger 'RESULT' after animation
    };

    const finishGame = () => {
        setStatus('RESULT');
    };

    const resetGame = () => {
        setStatus('IDLE');
        setResult(null);
    };

    return (
        <GameContext.Provider value={{
            isDebugMode,
            status,
            result,
            toggleDebugMode,
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
