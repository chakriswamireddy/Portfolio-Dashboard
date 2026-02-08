
import { eq } from "drizzle-orm";
import { stockings } from "./app/(backend)/api/models/stockings";
import { db } from "./app/(backend)/api/drizzle/setup";
import { scrapeGoogleFundamentals } from "./app/(backend)/api/lib/GoogleFin";
import { fetchYahooCMP } from "./app/(backend)/api/lib/YahooFin";
 

const INTERVAL_MS = 15_000;
let running = false;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function startScraperWorker() {
  console.log("Scraper worker started");

  while (true) {
    if (!running) {
      running = true;

      try {
        await runScrapeCycle();
      } catch (err) {
        console.error("Scrape cycle failed", err);
      } finally {
        running = false;
      }
    }

    await sleep(INTERVAL_MS);
  }
}


const isMarketOpen =
  (() => {
    const d = new Date();
    return d.getHours() > 9 && d.getHours() < 15 ||
           (d.getHours() === 9 && d.getMinutes() >= 0) ||
           (d.getHours() === 15 && d.getMinutes() <= 30);
  })();




async function runScrapeCycle() {
  const stocks = await db.select().from(stockings);

  for (const stock of stocks) {
    const result = await scrapeGoogleFundamentals({
      symbol: stock.symbol,
      exchange: stock.exchange
    });

    if (!result.success) continue;

    const updates : Record<string, any>= {
      peRatio: result.peRatio,
      earnings: result.earnings,
      fundamentalsUpdatedAt: new Date()
    }



    if (isMarketOpen) {
    console.log("Scraping start......")
      const cmp = await fetchYahooCMP(stock.symbol);
      updates["cmp"] = Number(cmp)
      updates["cmpUpdatedAt"] = new Date()
    }
    
    await db
      .update(stockings)
      .set(updates)
      .where(eq(stockings.id, stock.id));
  }
}




startScraperWorker().catch(console.error);
