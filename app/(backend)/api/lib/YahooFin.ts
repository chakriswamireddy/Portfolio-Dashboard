import * as cheerio from "cheerio";

export async function scrapeYahooCMP(symbol: string) {
  const url = `https://finance.yahoo.com/quote/${symbol}.NS`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "en-US,en;q=0.9"
    }
  });

  if (!res.ok) {
    throw new Error("Failed to load Yahoo HTML");
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const priceText = $('fin-streamer[data-field="regularMarketPrice"]').first().text();

  const cmp = Number(priceText.replace(/,/g, ""));

  console.log("cmp",cmp)

  return {
    cmp,
    fetchedAt: new Date()
  };
}
