import { eq } from "drizzle-orm";
import { db } from "../../drizzle/setup";
import { scrapeGoogleFundamentals } from "../../lib/GoogleFin";

import stocks from '../../lib/stocks.json'
import { stockings } from "../../models/stockings";
 




export async function GET() {
    try {
        const TTL = 15 * 1000;

        const stockData = await db.select().from(stockings);

        return Response.json({
            success: true,
            data: stockData
        });
    } catch (error: any) {
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

