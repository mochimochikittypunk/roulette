"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useReview } from '@/contexts/ReviewContext';
import { Gift, RefreshCw, Copy, Check } from 'lucide-react';

export const ReviewResultScreen = () => {
    const { result, resetReview } = useReview();
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Safe check for window
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });

        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!result) return null;

    const isHighPrize = result.type === 'OFF_1000' || result.type === 'OFF_500';

    const handleCopy = () => {
        if (result.code) {
            navigator.clipboard.writeText(result.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 w-full">
            {/* Confetti effect specifically for discounts */}
            {isHighPrize && (
                <div className="fixed inset-0 pointer-events-none z-50">
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        recycle={false}
                        numberOfPieces={500}
                        gravity={0.15}
                        colors={['#f59e0b', '#ec4899', '#a855f7', '#3b82f6', '#10b981']}
                    />
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    duration: 0.8
                }}
                className="w-full max-w-lg space-y-12"
            >
                {/* Header Section */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-300 mb-2">
                            おめでとうございます！
                        </h2>
                        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                            クーポン獲得
                        </h1>
                    </motion.div>
                </div>

                {/* Coupon Card */}
                <motion.div
                    initial={{ opacity: 0, rotateX: -90 }}
                    animate={{ opacity: 1, rotateX: 0 }}
                    transition={{ delay: 0.5, type: "spring", duration: 1.2 }}
                    style={{ perspective: 1000 }}
                >
                    <div
                        className="relative overflow-hidden rounded-3xl p-[3px] shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        style={{
                            background: `linear-gradient(135deg, ${result.color}80, ${result.color}, ${result.color}40)`,
                        }}
                    >
                        <div className="bg-slate-900/90 backdrop-blur-xl rounded-[22px] p-8 md:p-12 relative overflow-hidden h-full">

                            <div
                                className="absolute top-0 right-0 w-64 h-64 opacity-20 transform translate-x-1/3 -translate-y-1/3 rounded-full blur-3xl pointer-events-none"
                                style={{ backgroundColor: result.color }}
                            />

                            <div className="relative z-10 space-y-6">
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="flex justify-center"
                                >
                                    <div
                                        className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${result.color}, ${result.color}80)`,
                                            boxShadow: `0 0 30px ${result.color}80`
                                        }}
                                    >
                                        <Gift className="w-12 h-12 text-white" />
                                    </div>
                                </motion.div>

                                <div className="space-y-4">
                                    <h3
                                        className="text-3xl md:text-4xl font-black tracking-tight"
                                        style={{ color: result.color }}
                                    >
                                        {result.label}
                                    </h3>
                                    <p className="text-slate-300 text-lg md:text-xl font-medium">
                                        {result.description}
                                    </p>
                                </div>

                                {/* Coupon Code Section */}
                                {result.code && (
                                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                                        <p className="text-sm font-medium text-slate-400 mb-3">クーポンコード</p>
                                        <div
                                            className="flex items-center justify-between bg-slate-950/50 rounded-xl p-2 border border-slate-700/50 hover:border-slate-500 transition-colors cursor-pointer group"
                                            onClick={handleCopy}
                                        >
                                            <span className="text-2xl font-mono font-bold text-white tracking-widest pl-4">
                                                {result.code}
                                            </span>
                                            <button
                                                className={`p-3 rounded-lg flex items-center justify-center transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                                                    }`}
                                            >
                                                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-slate-700/50 mt-8 space-y-2">
                                    {result.expiryText && (
                                        <p className="text-sm font-bold text-pink-400">
                                            {result.expiryText}
                                        </p>
                                    )}
                                    <p className="text-sm text-slate-400">
                                        ※ クーポンコードを決済画面で入力してください。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <button
                        onClick={resetReview}
                        className="group flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors border border-slate-700"
                    >
                        <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        <span>タイトルに戻る</span>
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};
