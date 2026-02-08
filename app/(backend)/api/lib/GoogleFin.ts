

import { chromium } from "playwright";
import puppeteer from "puppeteer";
import { getBrowser } from "./browser";

export async function scrapeGoogleFundamentals({
    symbol, exchange
}: {
    symbol: string;
    exchange: string;
}) {


    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        const url = `https://www.google.com/finance/quote/${symbol}:${exchange}`;

        await page.goto(url, {
            waitUntil: "networkidle0",
            timeout: 30000
        });


        const data = await page.evaluate(() => {
            let peRatio: string | null = null;
            let earnings: string | null = null;

            const elements = Array.from(document.querySelectorAll("*"));

            for (let i = 0; i < elements.length; i++) {
                const el = elements[i];

                if (el.children.length !== 0) continue;

                const text = el.textContent?.trim().toLowerCase();
                if (!text) continue;

                if (text === "p/e ratio" || text === "pe ratio") {

                    for (let j = i + 1; j < elements.length; j++) {
                        const val = elements[j].textContent?.trim();
                        if (val && /^[\d,.]+$/.test(val)) {
                            peRatio = val;
                            break;
                        }
                    }
                }

                if (text.toLowerCase() === "eps" || text === "earnings per share") {
                    for (let j = i + 1; j < elements.length; j++) {
                        const val = elements[j].textContent?.trim();
                        if (!val) continue;

                        const num = Number(val.replace(/[₹,]/g, ""));
                        if (num > 0) {
                            earnings = val;
                            break;
                        }
                    }
                }
                if (peRatio && earnings) break;
            }

            return { peRatio, earnings };
        });

        // console.log(data)

        return {
            success: true,
            peRatio: data.peRatio,
            earnings: data.earnings,
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        return {
            success: false,
            error,
            timestamp: new Date().toISOString()
        };
    }
    finally {
        await page.close();  
    }
}


