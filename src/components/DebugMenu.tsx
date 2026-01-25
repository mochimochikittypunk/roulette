"use client";

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

export const DebugMenu = () => {
    const { isDebugMode, toggleDebugMode, debugTarget, setDebugTarget } = useGame();
    const [isOpen, setIsOpen] = useState(false);

    if (!isDebugMode) return null;

    return (
        <>
            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="bg-slate-800 text-white p-4 rounded-lg shadow-xl mb-2 border border-slate-700 min-w-[200px]"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-medium text-slate-400">Debug Mode</span>
                                    <button
                                        onClick={toggleDebugMode}
                                        className={`w-12 h-6 rounded-full p-1 transition-colors ${isDebugMode ? 'bg-cyan-500' : 'bg-slate-600'
                                            }`}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full bg-white transition-transform ${isDebugMode ? 'translate-x-6' : 'translate-x-0'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {isDebugMode && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Force Result</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setDebugTarget(null)}
                                                className={`px-2 py-1.5 text-xs rounded border transition-colors ${!debugTarget
                                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                                    : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'
                                                    }`}
                                            >
                                                Random
                                            </button>
                                            <button
                                                onClick={() => setDebugTarget('FULL')}
                                                className={`px-2 py-1.5 text-xs rounded border transition-colors ${debugTarget === 'FULL'
                                                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                                                    : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'
                                                    }`}
                                            >
                                                FULL (Gold)
                                            </button>
                                            <button
                                                onClick={() => setDebugTarget('GEISHA')}
                                                className={`px-2 py-1.5 text-xs rounded border transition-colors ${debugTarget === 'GEISHA'
                                                    ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300'
                                                    : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'
                                                    }`}
                                            >
                                                GEISHA
                                            </button>
                                            <button
                                                onClick={() => setDebugTarget('100')}
                                                className={`px-2 py-1.5 text-xs rounded border transition-colors ${debugTarget === '100'
                                                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                                                    : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'
                                                    }`}
                                            >
                                                100 YEN
                                            </button>
                                            <button
                                                onClick={() => setDebugTarget('LOSE')}
                                                className={`col-span-2 px-2 py-1.5 text-xs rounded border transition-colors ${debugTarget === 'LOSE'
                                                    ? 'bg-red-500/20 border-red-500 text-red-300'
                                                    : 'bg-slate-700 border-slate-600 text-slate-400 hover:bg-slate-600'
                                                    }`}
                                            >
                                                LOSE
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-full transition-colors border border-slate-700"
                >
                    <Settings size={20} className="text-slate-400" />
                </button>
            </div>
        </>
    );
};
