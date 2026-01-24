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
    LOTTERY_ITEMS.GEISHA,
    LOTTERY_ITEMS['100'],
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
                // Add a small delay so the user sees where it stopped before valid "screen transition" feeling
                setTimeout(() => {
                    finishGame();
                }, 1500);
            });
        } else if (status === 'IDLE') {
            controls.set({ y: 0 });
        }
    }, [status, result, controls, finishGame]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[400px] overflow-hidden"
        >
            {/* Scrolling items */}
            <motion.div
                animate={controls}
                className="absolute top-0 left-0 right-0"
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

            {/* Gradients */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-slate-900 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent z-20 pointer-events-none" />
        </div>
    );
};
