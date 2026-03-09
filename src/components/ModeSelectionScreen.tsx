"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ModeSelectionScreenProps {
    onSelectMode: (mode: 'ROULETTE' | 'REVIEW') => void;
}

export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onSelectMode }) => {
    return (
        <main className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-2xl text-center space-y-12"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                        どちらの機能を利用しますか？
                    </h1>
                    <p className="text-blue-100/80 text-lg">
                        ご希望の機能を選択してください。
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Roulette Option */}
                    <button
                        onClick={() => onSelectMode('ROULETTE')}
                        className="group relative flex flex-col items-center p-8 bg-slate-800/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl hover:bg-slate-800/80 hover:border-cyan-400 transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                    >
                        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                            <span className="text-3xl">🎰</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">ルーレット</h2>
                        <p className="text-slate-400 text-sm">
                            注文番号を使って<br />豪華景品を当てよう！
                        </p>
                    </button>

                    {/* Review Coupon Option */}
                    <button
                        onClick={() => onSelectMode('REVIEW')}
                        className="group relative flex flex-col items-center p-8 bg-slate-800/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl hover:bg-slate-800/80 hover:border-purple-400 transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                    >
                        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-purple-500 to-pink-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                            <span className="text-3xl">🎁</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">レビュー特典</h2>
                        <p className="text-slate-400 text-sm">
                            レビュー投稿で<br />必ずクーポンがもらえる！
                        </p>
                    </button>
                </div>
            </motion.div>
        </main>
    );
};
