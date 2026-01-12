"use client";

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

export const DebugMenu = () => {
    const { isDebugMode, toggleDebugMode } = useGame();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Fixed button at bottom-right */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="bg-slate-800 text-white p-4 rounded-lg shadow-xl mb-2 border border-slate-700"
                        >
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleDebugMode}
                                    className={`w-14 h-7 rounded-full p-1 transition-colors ${isDebugMode ? 'bg-cyan-500' : 'bg-slate-600'
                                        }`}
                                >
                                    <div
                                        className={`w-5 h-5 rounded-full bg-white transition-transform ${isDebugMode ? 'translate-x-7' : 'translate-x-0'
                                            }`}
                                    />
                                </button>
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
