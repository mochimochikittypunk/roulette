
import { drawLottery, LotteryItemType } from '../hooks/useLottery'; // Assuming relative path works with ts-node or just compiling

// Mock LOTTERY_ITEMS if needed or just rely on the import. 
// Since strict ESM/Next.js setup might make running isolated TS hard, 
// I'll create a standalone script that duplicates the minimal logic or uses standard require if I can.
// But wait, I can just use `ts-node` if I set it up, or just run valid JS.

// Let's assume we can run this via `npx ts-node` if we fix imports.
// To avoid alias issues (@/), I used relative path `../hooks/useLottery` above.

async function verify() {
    console.log("Starting Verification...");

    // 1. Verify Normal Mode
    const ITERATIONS = 10000;
    const results: Record<string, number> = {};

    for (let i = 0; i < ITERATIONS; i++) {
        const item = drawLottery(false);
        results[item.type] = (results[item.type] || 0) + 1;
    }

    console.log("Normal Mode Results (10000 runs):");
    console.table(results);

    // FULL now has 0.01% probability, so it may appear.
    // We just log the results.
    if (results['FULL']) {
        console.log(`NOTICE: FULL Cashback appeared ${results['FULL']} times (Expected ~1 time).`);
    } else {
        console.log("NOTICE: FULL Cashback did not appear (Expected behavior for low probability).");
    }
    console.log("PASS: Completed Normal Mode runs.");

    // 2. Verify Debug Mode
    const DEBUG_ITERATIONS = 100;
    let debugFailures = 0;
    for (let i = 0; i < DEBUG_ITERATIONS; i++) {
        const item = drawLottery(true);
        if (item.type !== 'FULL') debugFailures++;
    }

    if (debugFailures > 0) {
        console.error(`CRITICAL FAILURE: Debug Mode failed ${debugFailures} times!`);
        process.exit(1);
    } else {
        console.log("PASS: Debug Mode always returned FULL Cashback.");
    }
}

verify().catch(console.error);
