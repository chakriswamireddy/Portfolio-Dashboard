
import { eq } from "drizzle-orm";
import { stockings } from "./app/(backend)/api/models/stockings";
import { db } from "./app/(backend)/api/drizzle/setup";
import { scrapeGoogleFundamentals } from "./app/(backend)/api/lib/GoogleFin";
import { fetchYahooCMP } from "./app/(backend)/api/lib/YahooFin";
 

const INTERVAL_MS = 15_000;
let running = false;

function isMarketOpen(): boolean {
  const now = new Date();

  const hour = now.getHours();
  const minute = now.getMinutes();

  return (
    (hour > 9 && hour < 15) ||
    (hour === 9 && minute >= 0) ||
    (hour === 15 && minute <= 30)
  );
}

async function runScrapeCycle() {
  const stocks = await db.select().from(stockings);

  for (const stock of stocks) {
    try {
      const result = await scrapeGoogleFundamentals({
        symbol: stock.symbol,
        exchange: stock.exchange,
      });

      if (!result.success) continue;

      const updates: Record<string, any> = {
        peRatio: result.peRatio,
        earnings: result.earnings,
        fundamentalsUpdatedAt: new Date(),
      };

      if (isMarketOpen()) {
        const cmp = await fetchYahooCMP(stock.symbol);
        updates.cmp = Number(cmp);
        updates.cmpUpdatedAt = new Date();
      }

      await db
        .update(stockings)
        .set(updates)
        .where(eq(stockings.id, stock.id));

    } catch (err) {
      console.error(`Failed for ${stock.symbol}`, err);
    }
  }
}

async function main() {


  console.log("Running scrape cycle...");
  await runScrapeCycle();
  console.log("Scrape cycle complete.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Worker crashed:", err);
    process.exit(1);
  });