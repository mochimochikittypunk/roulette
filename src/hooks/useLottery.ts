import { useCallback } from 'react';

export type LotteryItemType = 'FULL' | 'GEISHA' | '100' | 'LOSE';

export interface LotteryItem {
    id: string;
    type: LotteryItemType;
    label: string;
    labelEn?: string; // Optional English label if needed
    color: string;
}

export const LOTTERY_ITEMS: Record<LotteryItemType, LotteryItem> = {
    FULL: { id: 'full', type: 'FULL', label: '全額キャッシュバック！', color: '#ff0000' },
    GEISHA: { id: 'geisha', type: 'GEISHA', label: 'ゲイシャをプレゼント！', color: '#d946ef' }, // Fuchsia for special item
    '100': { id: '100', type: '100', label: '100円キャッシュバック！', color: '#ffff00' },
    LOSE: { id: 'lose', type: 'LOSE', label: '残念、はずれ！', color: '#cccccc' },
};

// Weights for Normal Mode (Total 10000 for 0.01% precision)
const NORMAL_WEIGHTS = [
    { type: 'FULL', weight: 1 },      // 0.01%
    { type: 'GEISHA', weight: 99 },   // 0.99%
    { type: '100', weight: 1000 },    // 10.00%
    { type: 'LOSE', weight: 8900 },   // 89.00%
] as const;

export const drawLottery = (isDebugMode: boolean): LotteryItem => {
    if (isDebugMode) {
        return LOTTERY_ITEMS.FULL;
    }

    const totalWeight = 10000;
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
