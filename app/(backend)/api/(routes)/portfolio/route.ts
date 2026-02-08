import { NextResponse } from "next/server";
import { db } from "@/app/(backend)/api/drizzle/setup";
import { holdings } from "@/app/(backend)/api/models/holdings";
import { stockings } from "@/app/(backend)/api/models/stockings";
import { eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const userId = "cac4c179-8723-4535-938a-ca2d8549e594";
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Invalid user session" },
                { status: 400 }
            );
        }


        const portfolio = await db
            .select({
                holdingId: holdings.id,
                symbol: stockings.symbol,
                stockName: stockings.stockName,
                sector: stockings.sector,

                quantity: holdings.quantity,
                purchasePrice: holdings.purchasePrice,
                cmp: stockings.cmp,

                investmentValue: sql<number>`
          ${holdings.quantity} * ${holdings.purchasePrice}
        `,

                presentValue: sql<number>`
          ${holdings.quantity} * ${stockings.cmp}
        `,

                gainLoss: sql<number>`
          (${holdings.quantity} * ${stockings.cmp})
          - (${holdings.quantity} * ${holdings.purchasePrice})
        `
            })
            .from(holdings)
            .innerJoin(stockings, eq(holdings.stockId, stockings.id))
            .where(eq(holdings.userId, userId));


        const totals = await db
            .select({
                totalInvestment: sql<number>`
          SUM(${holdings.quantity} * ${holdings.purchasePrice})
        `,
                totalPresentValue: sql<number>`
          SUM(${holdings.quantity} * ${stockings.cmp})
        `,
                totalGainLoss: sql<number>`
          SUM(${holdings.quantity} * ${stockings.cmp})
          - SUM(${holdings.quantity} * ${holdings.purchasePrice})
        `
            })
            .from(holdings)
            .innerJoin(stockings, eq(holdings.stockId, stockings.id))
            .where(eq(holdings.userId, userId));


        const sectorSummary = await db
            .select({
                sector: stockings.sector,

                totalInvestment: sql<number>`
          SUM(${holdings.quantity} * ${holdings.purchasePrice})
        `,

                totalPresentValue: sql<number>`
          SUM(${holdings.quantity} * ${stockings.cmp})
        `,

                gainLoss: sql<number>`
          SUM(${holdings.quantity} * ${stockings.cmp})
          - SUM(${holdings.quantity} * ${holdings.purchasePrice})
        `
            })
            .from(holdings)
            .innerJoin(stockings, eq(holdings.stockId, stockings.id))
            .where(eq(holdings.userId, userId))
            .groupBy(stockings.sector);

        return NextResponse.json({
            success: true,
            portfolio,
            totals: totals[0] ?? null,
            sectors: sectorSummary
        });
        
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}


