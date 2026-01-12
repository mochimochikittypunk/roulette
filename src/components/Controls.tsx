"use client";

import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { motion } from 'framer-motion';

export const Controls = () => {
    const { status, startGame, stopGame, resetGame } = useGame();

    if (status === 'RESULT') {
        return (
            <div className="flex justify-center">
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={resetGame}
                    className="px-12 py-4 bg-cyan-500 text-slate-900 text-xl md:text-2xl font-black tracking-widest rounded-lg shadow-lg hover:bg-cyan-400 active:scale-95 transition-all"
                >
                    リセット
                </motion.button>
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            {status === 'IDLE' ? (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startGame}
                    className="px-16 py-5 bg-cyan-400 text-slate-900 text-2xl md:text-4xl font-black tracking-widest rounded-lg shadow-xl hover:bg-cyan-300 transition-colors"
                >
                    START
                </motion.button>
            ) : (
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={stopGame}
                    disabled={status === 'STOPPING'}
                    className={`px-16 py-5 text-2xl md:text-4xl font-black tracking-widest rounded-lg shadow-xl transition-colors ${status === 'STOPPING'
                            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-400'
                        }`}
                >
                    STOP
                </motion.button>
            )}
        </div>
    );
};
