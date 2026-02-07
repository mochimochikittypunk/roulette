import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(req: NextRequest) {
    try {
        const { orderNumber } = await req.json();

        if (!orderNumber) {
            return NextResponse.json({ allowed: false, error: '注文IDを入力してください' }, { status: 400 });
        }

        // --- Configuration Check ---
        const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY;
        const sheetId = process.env.GOOGLE_SHEET_ID;

        if (!serviceAccountEmail || !privateKey || !sheetId) {
            console.error('Google Sheets credentials missing');
            // For development/demo purposes without credentials, you might want a bypass
            // but for now strict implementation:
            return NextResponse.json({
                allowed: false,
                error: 'サーバー設定エラー: Google Sheets認証情報が不足しています'
            }, { status: 500 });
        }

        // --- Google Sheets Auth ---
        const serviceAccountAuth = new JWT({
            email: serviceAccountEmail,
            key: privateKey.replace(/\\n/g, '\n'),
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
            ],
        });

        const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);

        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0]; // Assuming first sheet

        // --- Search Logic (Column A check) ---
        // Efficient way: get range or all rows. 
        // For simple usage ~1000 rows, `getRows` is fine.
        const rows = await sheet.getRows();

        // Find ALL rows with orderNumber matching
        const matchingRows = rows.filter(row => {
            const values = row.toObject();
            const firstValue = Object.values(values)[0] as string;
            return firstValue === orderNumber;
        });

        if (matchingRows.length > 0) {
            // --- Success: Delete ONE Row ---
            const targetRow = matchingRows[0];
            await targetRow.delete();

            // Remaining count (excluding the one just deleted)
            const remaining = matchingRows.length - 1;

            return NextResponse.json({ allowed: true, remaining });
        } else {
            return NextResponse.json({ allowed: false, error: '無効な注文IDです。発送通知メールを受信後に再度お試しください。' });
        }

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ allowed: false, error: 'サーバー内部エラーが発生しました' }, { status: 500 });
    }
}
