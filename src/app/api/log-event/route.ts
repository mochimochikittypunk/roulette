import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(req: NextRequest) {
    try {
        const { eventType, details, result, userAgent } = await req.json();

        // Basic Config Check
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY;
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!serviceAccountEmail || !privateKey || !sheetId) {
            // Silently fail or log to console in dev, but don't crash app flow
            console.error('Log API: Credentials missing');
            return NextResponse.json({ success: false }, { status: 500 });
        }

        // Auth
        const serviceAccountAuth = new JWT({
            email: serviceAccountEmail,
            key: privateKey.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
        await doc.loadInfo();

        // Get the "Log" sheet. If not found, try index 1, else fallback to index 0 (risky, maybe just fail)
        let sheet = doc.sheetsByTitle['Log'];
        if (!sheet) {
            // Try to find the second sheet if "Log" doesn't exist
            if (doc.sheetCount > 1) {
                sheet = doc.sheetsByIndex[1];
            } else {
                console.error('Log API: "Log" sheet not found');
                return NextResponse.json({ success: false, error: 'Log sheet missing' }, { status: 404 });
            }
        }

        // Parse User Agent for simple device type
        const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent || '');
        const deviceType = isMobile ? 'Mobile' : 'Desktop';

        // Timestamp
        const timestamp = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

        // Append Row
        await sheet.addRow({
            timestamp: timestamp,
            event: eventType,
            details: JSON.stringify(details), // Ensure simple string format
            device: deviceType,
            result: result || ''
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Log API Error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
