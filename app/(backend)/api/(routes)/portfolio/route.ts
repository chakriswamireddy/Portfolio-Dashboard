import { eq } from "drizzle-orm";
import { db } from "../../drizzle/setup";
import { scrapeGoogleFundamentals } from "../../lib/GoogleFin";

import stocks from '../../lib/stocks.json'
import { stockings } from "../../models/stockings";
import {  scrapeYahooCMP } from "../../lib/YahooFin";




export async function GET() {
    try {
        const TTL = 15 * 1000;

        const dbStocks = await db.select().from(stockings);

        let shouldScrape;

        if (dbStocks.length === 0) {
            shouldScrape = true;
        } else {
            const latestUpdatedAt = Math.max(
                ...dbStocks.map(s =>
                    s.fundamentalsUpdatedAt ? s.fundamentalsUpdatedAt.getTime() : 0
                )
            );

            shouldScrape = Date.now() - latestUpdatedAt > TTL;

        }



        if (shouldScrape) {
            for (const stock of stocks) {

                const scraped = await scrapeGoogleFundamentals({
                    symbol: stock.code,
                    exchange: stock.exchange
                });

                const updateData: any = {
                    earnings: scraped.earnings,
                    updatedAt: new Date()
                };


                if (scraped.earnings !== null && scraped.earnings !== undefined) {
                    updateData.earnings = scraped.earnings.toString();
                }



                // await db
                //     .update(stockings)
                //     .set(updateData)
                //     .where(eq(stockings.stockName, stock.name));
            }
        }

        // const freshData = await db.select().from(stockings);

       const cmp =  await scrapeYahooCMP("INFY");

        return Response.json({
            success: true,
            // count: freshData.length,
            // data: freshData
        });
    } catch (error: any) {
        return Response.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

