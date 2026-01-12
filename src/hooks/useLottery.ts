import { useCallback } from 'react';

export type LotteryItemType = 'FULL' | 'HALF' | '300' | '100' | 'RETRY' | 'LOSE';

export interface LotteryItem {
    id: string;
    type: LotteryItemType;
    label: string;
    labelEn?: string; // Optional English label if needed
    color: string;
}

export const LOTTERY_ITEMS: Record<LotteryItemType, LotteryItem> = {
    FULL: { id: 'full', type: 'FULL', label: '全額キャッシュバック！', color: '#ff0000' },
    HALF: { id: 'half', type: 'HALF', label: '半額キャッシュバック！', color: '#ff6600' },
    '300': { id: '300', type: '300', label: '300円キャッシュバック！', color: '#ffcc00' },
    '100': { id: '100', type: '100', label: '100円キャッシュバック！', color: '#ffff00' },
    RETRY: { id: 'retry', type: 'RETRY', label: 'もう一回チャレンジできる！', color: '#00ccff' },
    LOSE: { id: 'lose', type: 'LOSE', label: '残念、はずれ！', color: '#cccccc' },
};

// Weights for Normal Mode (Total 100)
// Using expanded scale for precision (e.g., 0.3% -> 3 in 1000)
const NORMAL_WEIGHTS = [
    { type: 'FULL', weight: 0 },    // 0%
    { type: 'HALF', weight: 3 },    // 0.3%
    { type: '300', weight: 30 },    // 3.0%
    { type: '100', weight: 300 },   // 30.0%
    { type: 'RETRY', weight: 300 }, // 30.0%
    { type: 'LOSE', weight: 367 },  // 36.7%
] as const;

export const drawLottery = (isDebugMode: boolean): LotteryItem => {
    if (isDebugMode) {
        return LOTTERY_ITEMS.FULL;
    }

    const totalWeight = 1000;
    const random = Math.floor(Math.random() * totalWeight);

    let currentWeight = 0;
    for (const item of NORMAL_WEIGHTS) {
        currentWeight += item.weight;
        if (random < currentWeight) {
            return LOTTERY_ITEMS[item.type as LotteryItemType];
        }
    }

    // Fallback
    return LOTTERY_ITEMS.LOSE;
};

export const useLottery = (isDebugMode: boolean) => {
    const draw = useCallback((): LotteryItem => {
        return drawLottery(isDebugMode);
    }, [isDebugMode]);

    return { draw };
};
