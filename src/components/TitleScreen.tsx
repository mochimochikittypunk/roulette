"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { Loader2 } from 'lucide-react';

export const TitleScreen = () => {
    const { login, isVerifying } = useGame();
    const [orderNumber, setOrderNumber] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;

        setError('');
        const res = await login(orderNumber);
        if (!res.success) {
            setError(res.message || '認証に失敗しました');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-md space-y-8"
            >
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 tracking-tight mb-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
                        サルバの<br />ドキドキルーレット
                    </h1>
                    <p className="text-blue-100/80 text-lg">へようこそ！</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 text-left">
                            <label htmlFor="orderNumber" className="text-sm font-medium text-blue-200">
                                注文番号を入力してください
                            </label>
                            <input
                                id="orderNumber"
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                placeholder="例: 1234-5678"
                                className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/30 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent outline-none text-white placeholder-slate-500 transition-all text-center text-lg tracking-widest"
                                disabled={isVerifying}
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-red-400 text-sm font-medium bg-red-900/20 py-2 rounded"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={isVerifying || !orderNumber.trim()}
                            className="w-full group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-black text-xl text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative flex items-center justify-center gap-2">
                                {isVerifying ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        確認中...
                                    </>
                                ) : (
                                    '認証する'
                                )}
                            </span>
                        </button>
                    </form>
                </div>

                <p className="text-slate-500 text-sm">
                    ※ 認証に成功するとルーレットが開始されます。<br />
                    一度認証された番号は使用済みとなります。
                </p>
            </motion.div>
        </div>
    );
};
