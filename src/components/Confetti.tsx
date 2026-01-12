"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ConfettiProps {
    isFullCashback: boolean;
}

// Generate confetti particles
const generateParticles = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 12,
        color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#FF69B4', '#00CED1'][Math.floor(Math.random() * 6)],
    }));
};

// Generate firework explosions
const generateFireworks = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: 15 + Math.random() * 70,
        y: 20 + Math.random() * 40,
        delay: i * 0.3,
        color: ['#FF0000', '#FFD700', '#FF6347', '#FF1493', '#00FF00', '#00FFFF'][Math.floor(Math.random() * 6)],
    }));
};

// Single firework particle
const FireworkParticle = ({ angle, color, delay }: { angle: number; color: string; delay: number }) => {
    const distance = 80 + Math.random() * 40;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;

    return (
        <motion.div
            className="absolute w-2 h-2 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
                x: x,
                y: y,
                opacity: [1, 1, 0],
                scale: [1, 0.5]
            }}
            transition={{
                duration: 1.2,
                delay: delay,
                ease: "easeOut"
            }}
        />
    );
};

// Firework burst component
const FireworkBurst = ({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) => {
    const particleCount = 12;
    const angles = Array.from({ length: particleCount }, (_, i) => (360 / particleCount) * i);

    return (
        <motion.div
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay }}
        >
            {angles.map((angle, i) => (
                <FireworkParticle key={i} angle={angle} color={color} delay={delay} />
            ))}
            {/* Center flash */}
            <motion.div
                className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 30px ${color}, 0 0 60px ${color}` }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2, 0], opacity: [1, 0.8, 0] }}
                transition={{ duration: 0.6, delay }}
            />
        </motion.div>
    );
};

export const Confetti: React.FC<ConfettiProps> = ({ isFullCashback }) => {
    const particles = generateParticles(isFullCashback ? 40 : 15);
    const fireworks = isFullCashback ? generateFireworks(6) : [];

    return (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            {/* Confetti particles - colored squares/circles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    initial={{
                        x: `${particle.x}vw`,
                        y: -20,
                        rotate: 0,
                        opacity: 1
                    }}
                    animate={{
                        y: '110vh',
                        rotate: 720,
                        opacity: [1, 1, 0]
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        ease: 'linear'
                    }}
                    className="absolute"
                >
                    <div
                        className="rounded-sm"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: particle.color,
                            boxShadow: `0 0 4px ${particle.color}`
                        }}
                    />
                </motion.div>
            ))}

            {/* Animated fireworks for full cashback */}
            {fireworks.map((fw) => (
                <FireworkBurst
                    key={fw.id}
                    x={fw.x}
                    y={fw.y}
                    color={fw.color}
                    delay={fw.delay}
                />
            ))}

            {/* Repeat fireworks after first wave */}
            {isFullCashback && fireworks.map((fw) => (
                <FireworkBurst
                    key={`fw2-${fw.id}`}
                    x={20 + Math.random() * 60}
                    y={15 + Math.random() * 50}
                    color={fw.color}
                    delay={fw.delay + 2}
                />
            ))}
        </div>
    );
};
