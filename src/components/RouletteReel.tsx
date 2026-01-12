"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { LOTTERY_ITEMS } from '@/hooks/useLottery';
import { Confetti } from './Confetti';

// Sequence for the reel
const BASE_SEQUENCE = [
    LOTTERY_ITEMS.FULL,
    LOTTERY_ITEMS.LOSE,
    LOTTERY_ITEMS.RETRY,
    LOTTERY_ITEMS['100'],
    LOTTERY_ITEMS['300'],
    LOTTERY_ITEMS.HALF,
];

const ITEM_HEIGHT = 120;

export const RouletteReel = () => {
    const { status, result, finishGame } = useGame();
    const controls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const REPEAT_COUNT = 30;
    const items = Array(REPEAT_COUNT).fill(BASE_SEQUENCE).flat();

    useEffect(() => {
        if (status === 'SPINNING') {
            setShowConfetti(false);
            controls.start({
                y: [0, -ITEM_HEIGHT * BASE_SEQUENCE.length * 3],
                transition: {
                    duration: 4,
                    ease: "linear",
                    repeat: Infinity,
                }
            });
        } else if (status === 'STOPPING' && result) {
            const targetIndexInBase = BASE_SEQUENCE.findIndex(item => item.id === result.id);
            const targetCycleIndex = 15;
            const finalIndex = (targetCycleIndex * BASE_SEQUENCE.length) + targetIndexInBase;

            const containerHeight = containerRef.current?.clientHeight || 400;
            const finalY = (containerHeight / 2) - (ITEM_HEIGHT / 2) - (finalIndex * ITEM_HEIGHT);

            controls.stop();
            controls.start({
                y: finalY,
                transition: {
                    duration: 3.5,
                    ease: [0.1, 0.8, 0.2, 1],
                }
            }).then(() => {
                finishGame();
                // Show confetti for cashback wins
                if (result.type === 'FULL' || result.type === 'HALF' || result.type === '300' || result.type === '100') {
                    setShowConfetti(true);
                }
            });
        } else if (status === 'IDLE') {
            controls.set({ y: 0 });
            setShowConfetti(false);
        }
    }, [status, result, controls, finishGame]);

    const isFullCashback = result?.type === 'FULL';

    return (
        <>
            <div
                ref={containerRef}
                className="relative w-full h-[400px] overflow-hidden"
            >
                {/* Scrolling items - hide when showing result */}
                <motion.div
                    animate={controls}
                    className="absolute top-0 left-0 right-0"
                    style={{ opacity: status === 'RESULT' ? 0.3 : 1 }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-center h-[120px]"
                        >
                            <span className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-blue-200/70 whitespace-nowrap">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </motion.div>

                {/* Result display - centered, one line, no wrap */}
                <AnimatePresence>
                    {status === 'RESULT' && result && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-30"
                        >
                            <motion.span
                                animate={{
                                    scale: isFullCashback ? [1, 1.05, 1] : 1,
                                }}
                                transition={{
                                    repeat: isFullCashback ? Infinity : 0,
                                    duration: 0.8
                                }}
                                className={`font-black tracking-tight whitespace-nowrap ${isFullCashback
                                        ? 'text-3xl md:text-5xl lg:text-6xl text-yellow-300 drop-shadow-[0_0_30px_rgba(253,224,71,0.8)]'
                                        : 'text-3xl md:text-5xl lg:text-6xl text-cyan-300 drop-shadow-[0_0_20px_rgba(103,232,249,0.5)]'
                                    }`}
                            >
                                {result.label}
                            </motion.span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Gradients */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-900 to-transparent z-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent z-20 pointer-events-none" />
            </div>

            {/* Confetti overlay */}
            {showConfetti && <Confetti isFullCashback={isFullCashback} />}
        </>
    );
};
