"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CalendarX, Gift } from 'lucide-react';
import { useReview } from '@/contexts/ReviewContext';

export const ReviewTitleScreen = () => {
    const { status, errorMessage, verifyAndDraw } = useReview();
    const [orderNumber, setOrderNumber] = useState('');
    const [isExpired, setIsExpired] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isVerifying = status === 'VERIFYING';

    useEffect(() => {
        // Check expiration on mount and set state
        // Doing this in useEffect avoids hydration mismatch between server and client
        const checkExpiration = () => {
            const expiryStr = process.env.NEXT_PUBLIC_COUPON_EXPIRY_DATE;
            if (expiryStr) {
                const expiryDate = new Date(expiryStr);
                const now = new Date();
                if (now >= expiryDate) {
                    setIsExpired(true);
                }
            }
            setIsLoading(false);
        };

        checkExpiration();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim() || isExpired) return;

        await verifyAndDraw(orderNumber);
    };

    if (isLoading) {
        return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md space-y-8 relative z-10"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 tracking-tight mb-2 drop-shadow-[0_0_15px_rgba(216,180,254,0.5)]">
                        レビュー特典<br />プレゼント
                    </h1>
                    <p className="text-purple-100/80 text-lg mt-4 font-medium">
                        レビューありがとうございます！<br />
                        該当の注文IDを入力してクーポンをGET！
                    </p>

                    {!isExpired && (
                        <div className="mt-6 inline-flex flex-col text-left bg-purple-900/30 border border-purple-500/30 rounded-2xl p-4 text-purple-200 text-sm shadow-inner backdrop-blur-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Gift className="w-4 h-4 text-pink-400" />
                                <span className="font-bold text-pink-300">プレゼント内容</span>
                            </div>
                            <ul className="space-y-1.5 ml-1">
                                <li>・初回レビュー: <span className="font-bold text-white">送料無料</span></li>
                                <li>・2回目以降: <span className="font-bold text-white">500円OFF</span> <span className="opacity-75">(90%)</span></li>
                                <li className="text-amber-300">　または <span className="font-bold text-amber-100">1,000円OFF</span> <span className="opacity-90">(10%で大当たり！)</span></li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.15)] relative overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

                    {isExpired ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-8 space-y-6 flex flex-col items-center justify-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center shadow-inner mb-2 border border-slate-700">
                                <CalendarX className="w-10 h-10 text-slate-400" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-bold text-slate-300">
                                    配布期間終了
                                </h3>
                                <p className="text-slate-400 font-medium leading-relaxed">
                                    現在のクーポン配布期間は<br />終了いたしました。
                                </p>
                                <p className="text-sm text-slate-500 mt-4 px-4">
                                    次回のクーポン配布キャンペーンを<br />お待ちください！
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 text-left">
                                <label htmlFor="orderNumber" className="text-sm font-medium text-purple-200 ml-1">
                                    注文IDを入力してください
                                </label>
                                <input
                                    id="orderNumber"
                                    type="text"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    placeholder="例: 1234-5678"
                                    className="w-full px-4 py-4 bg-slate-800/80 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none text-white placeholder-slate-500 transition-all text-center text-lg tracking-widest shadow-inner shadow-black/50"
                                    disabled={isVerifying}
                                />
                            </div>

                            <AnimatePresence>
                                {status === 'ERROR' && errorMessage && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0, y: -10 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-red-300 text-sm font-medium bg-red-900/30 border border-red-500/30 py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                                    >
                                        <span>⚠️</span> {errorMessage}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <button
                                type="submit"
                                disabled={isVerifying || !orderNumber.trim()}
                                className="w-full group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-black text-xl text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative flex items-center justify-center gap-2 z-10">
                                    {isVerifying ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            確認中...
                                        </>
                                    ) : (
                                        'クーポンをもらう！'
                                    )}
                                </span>
                            </button>
                        </form>
                    )}
                </div>

                {!isExpired && (
                    <p className="text-slate-400 text-sm bg-slate-800/50 inline-block px-4 py-2 rounded-full border border-slate-700/50">
                        ※ 一度使用した注文IDは再利用できません。
                    </p>
                )}
            </motion.div>
        </div>
    );
};
