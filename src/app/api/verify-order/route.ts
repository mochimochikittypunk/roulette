import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(req: NextRequest) {
    try {
        const { orderNumber } = await req.json();

        if (!orderNumber) {
            return NextResponse.json({ allowed: false, error: '注文番号を入力してください' }, { status: 400 });
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

        // Find row with orderNumber matching (Assuming Column A / header 'order_number' or first column)
        // If the sheet has headers, we access by header name. 
        // If 'orderNumber' is blindly entered into column A without header, we might assume rows[i]._rawData[0]

        // Let's assume there is a header "number" or we just key off the first column value
        // Better: iterate rows and check the first available value

        const targetRow = rows.find(row => {
            // Check formatted value of first column or key 'order_number'
            // row.toObject() gives keyed object if headers exist.
            // Let's assume the user puts order numbers in the first column.
            const values = row.toObject();
            const firstValue = Object.values(values)[0] as string;
            return firstValue === orderNumber;
        });

        if (targetRow) {
            // --- Success: Delete Row ---
            await targetRow.delete();
            return NextResponse.json({ allowed: true });
        } else {
            return NextResponse.json({ allowed: false, error: '無効な注文番号です' });
        }

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ allowed: false, error: 'サーバー内部エラーが発生しました' }, { status: 500 });
    }
}
