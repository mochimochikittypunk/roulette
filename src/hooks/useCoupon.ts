import { useCallback } from 'react';

export type CouponType = 'FREE_SHIPPING' | 'OFF_500' | 'OFF_1000' | 'NONE';

export interface CouponItem {
    id: string;
    type: CouponType;
    label: string;
    description: string;
    color: string;
    code?: string;
    expiryText?: string;
}

export const COUPON_ITEMS: Record<CouponType, CouponItem> = {
    FREE_SHIPPING: {
        id: 'free_shipping',
        type: 'FREE_SHIPPING',
        label: '送料無料クーポン！',
        description: '次回のお買い物が送料無料になります',
        color: '#3b82f6', // blue-500
        code: 'TZ9PGE2A',
        expiryText: '※ 今回設定したクーポンは【6月末まで】ご使用になれます',
    },
    OFF_500: {
        id: 'off_500',
        type: 'OFF_500',
        label: '500円OFFクーポン！',
        description: '次回のお買い物で使える500円割引',
        color: '#a855f7', // purple-500
        code: 'GCMVEA2L',
        expiryText: '※ 今回設定したクーポンは【6月末まで】ご使用になれます',
    },
    OFF_1000: {
        id: 'off_1000',
        type: 'OFF_1000',
        label: '1,000円OFFクーポン！',
        description: '大当たり！次回のお買い物で使える1,000円割引',
        color: '#f59e0b', // amber-500
        code: 'XP2MYB85',
        expiryText: '※ 今回設定したクーポンは【6月末まで】ご使用になれます',
    },
    NONE: {
        id: 'none',
        type: 'NONE',
        label: 'クーポンなし',
        description: '該当する特典がありません',
        color: '#64748b', // slate-500
    }
};

export const determineCoupon = (count: number): CouponItem => {
    // If there is no valid count, return none. (Should be handled by API but just in case)
    if (count <= 0) {
        return COUPON_ITEMS.NONE;
    }

    // Count is exactly 1 -> Guaranteed Free Shipping
    if (count === 1) {
        return COUPON_ITEMS.FREE_SHIPPING;
    }

    // Count >= 2 -> Lottery mechanism
    // Requirement: 90% chance for 500 OFF, 10% chance for 1000 OFF
    const random = Math.random(); // 0.0 to < 1.0

    if (random < 0.10) {
        // 10% chance
        return COUPON_ITEMS.OFF_1000;
    } else {
        // 90% chance
        return COUPON_ITEMS.OFF_500;
    }
};

export const useCoupon = () => {
    const drawCoupon = useCallback((count: number): CouponItem => {
        return determineCoupon(count);
    }, []);

    return { drawCoupon };
};
