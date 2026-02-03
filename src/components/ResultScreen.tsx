"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Copy, Mail, Star, Ticket } from 'lucide-react';

export const ResultScreen = () => {
    const { result, logEvent, remainingSpins, continueToNextSpin } = useGame();

    if (!result) return null;

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        logEvent('CouponCopy', { coupon_code: code });
    };

    // Common review prompt component
    const ReviewPrompt = () => (
        <div className="p-6 bg-slate-800/50 rounded-xl border border-white/5 space-y-4 text-left">
            <p className="text-lg font-medium text-blue-200 text-center">
                オンラインショップにレビューを投稿すると<br />
                さらに3回ルーレットを回すことができます！
            </p>
            <div className="h-px bg-white/10 w-full" />
            <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">A</span>
                    <span>
                        <strong>PayIDで購入した方：</strong><br />
                        注文履歴からレビュー投稿ができます。
                    </span>
                </li>
                <li className="flex gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">B</span>
                    <span>
                        <strong>ウェブから購入した方：</strong><br />
                        発送通知メールからレビュー投稿ができます。
                    </span>
                </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-cyan-200 text-sm font-bold">
                    <Ticket className="w-4 h-4" />
                    <span>再挑戦の方法</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                    レビュー投稿後、<span className="text-white font-bold">24時間以内</span>に3クレジット追加されるので、<br />
                    再度同じ注文IDでチャレンジしてみてください◎
                </p>
            </div>
        </div>
    );

    // Define content based on result type
    const renderContent = () => {
        if (result.type === 'LOSE') {
            return (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                            <span className="text-4xl">😢</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-300">残念、はずれ！</h2>
                    </div>

                    <ReviewPrompt />
                </div>
            );
        }

        if (result.type === '100') {
            return (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="w-20 h-20 mx-auto bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                            <Ticket className="w-10 h-10 text-yellow-300" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]">
                            100円キャッシュバック！
                        </h2>
                    </div>

                    <div className="p-8 bg-gradient-to-br from-yellow-900/40 to-yellow-600/10 rounded-2xl border border-yellow-500/30 space-y-6">
                        <p className="text-yellow-100 font-medium">次回の注文でご利用ください！</p>

                        <div className="bg-slate-900/80 p-6 rounded-xl border border-yellow-500/20 flex flex-col gap-2 relative group cursor-pointer"
                            onClick={() => handleCopy('KYQ4WE35')}>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Coupon Code</p>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-3xl font-mono font-bold text-white tracking-widest">KYQ4WE35</span>
                                <Copy className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">クリックしてコピー</p>
                        </div>
                    </div>

                    <ReviewPrompt />
                </div>
            );
        }

        if (result.type === 'GEISHA') {
            return (
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="w-24 h-24 mx-auto bg-fuchsia-500/20 rounded-full flex items-center justify-center border border-fuchsia-500/50 shadow-[0_0_50px_rgba(217,70,239,0.5)] animate-pulse">
                            <Star className="w-12 h-12 text-fuchsia-300" />
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-fuchsia-200 drop-shadow-[0_0_20px_rgba(232,121,249,0.8)]">
                            {result.label}
                        </h2>
                    </div>

                    <div className="p-8 bg-gradient-to-br from-fuchsia-900/40 to-fuchsia-600/10 rounded-2xl border border-fuchsia-500/30 space-y-6">
                        <p className="text-fuchsia-100 font-medium">
                            次回の注文時に入力すると<br />
                            ゲイシャが無料で同封されます！
                        </p>

                        <div className="bg-slate-900/80 p-6 rounded-xl border border-fuchsia-500/20 flex flex-col gap-2 relative group cursor-pointer"
                            onClick={() => handleCopy('WF45SJCN')}>
                            <p className="text-xs text-slate-400 uppercase tracking-widest">Coupon Code</p>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-3xl font-mono font-bold text-white tracking-widest">WF45SJCN</span>
                                <Copy className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">クリックしてコピー</p>
                        </div>
                    </div>

                    <ReviewPrompt />
                </div>
            );
        }

        // FULL
        return (
            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="w-24 h-24 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.5)] animate-pulse">
                        <Star className="w-12 h-12 text-yellow-300" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-yellow-200 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]">
                        {result.label}
                    </h2>
                </div>

                <div className="p-8 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-yellow-500/30 space-y-6 max-w-lg mx-auto">
                    <div className="flex flex-col items-center gap-4 text-yellow-100">
                        <p className="text-xl font-bold">おめでとうございます！</p>
                        <p className="">
                            ご当選の確認のため、<br />
                            <span className="font-bold text-white border-b border-yellow-400">この画面のスクリーンショット</span><br />
                            を保存してください。
                        </p>
                    </div>

                    <div className="bg-black/30 p-6 rounded-xl text-sm space-y-3">
                        <div className="flex items-center justify-center gap-2 text-yellow-200 mb-2">
                            <Mail className="w-4 h-4" />
                            <span>画像の送付先</span>
                        </div>
                        <code className="block bg-black/40 p-3 rounded font-mono text-center select-all cursor-text text-white border border-white/10">
                            salvadorcoffeebar@gmail.com
                        </code>
                        <p className="text-slate-400 text-xs mt-2">
                            上記メールアドレス宛にスクリーンショットをお送りください。
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm p-4 animate-in fade-in duration-500 overflow-y-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-2xl text-center my-8"
            >
                {renderContent()}

                {remainingSpins > 0 && (
                    <div className="mt-8 animate-bounce-subtle">
                        <button
                            onClick={continueToNextSpin}
                            className="w-full max-w-md mx-auto group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl font-black text-xl text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] transition-all transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center justify-center gap-2">
                                <Ticket className="w-6 h-6" />
                                もう一回回す！
                                <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                                    あと {remainingSpins} 回
                                </span>
                            </span>
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
