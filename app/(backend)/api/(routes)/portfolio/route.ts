import { NextResponse } from "next/server";
import { db } from "@/app/(backend)/api/drizzle/setup";
import { holdings } from "@/app/(backend)/api/models/holdings";
import { stockings } from "@/app/(backend)/api/models/stockings";
import { and, eq, sql } from "drizzle-orm";
import { cookies } from "next/headers";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;
        if (!userId) {
            return NextResponse.json(
                { success: false, error: "Invalid user session" },
                { status: 400 }
            );
        }


        const portfolio = await db
            .select({
                id: holdings.id,
                stockId: holdings.stockId,
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




export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;
        if (!userId) {
            return NextResponse.json(
                { error: "Invalid user session" },
                { status: 400 }
            );
        }
        const body = await req.json();
        const { stockId, quantity, purchasePrice } = body;

        if (!stockId || !quantity || !purchasePrice) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await db.insert(holdings).values({
            userId,
            stockId,
            quantity,
            purchasePrice: purchasePrice.toString(),
            purchasedAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json({ success: true });

    } catch {
        return NextResponse.json(
            { error: "Failed to create holding" },
            { status: 500 }
        );
    }
}



export async function PUT(req: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;


        if (!userId) {
            return NextResponse.json(
                { error: "Invalid user session" },
                { status: 400 }
            );
        }
        const holdingId = new URL(req.url).searchParams.get("id");

        if (!holdingId) {
            return NextResponse.json(
                { error: "Missing holding ID" },
                { status: 404 }
            );
        }

        const body = await req.json();
        const { stockId, quantity, purchasePrice } = body;

        if (!stockId || !quantity || !purchasePrice) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await db.update(holdings)
            .set({
                quantity,
                purchasePrice: purchasePrice.toString(),
                updatedAt: new Date()
            })
            .where(
                and(eq(holdings.id, holdingId), eq(holdings.userId, userId))
            )
        return NextResponse.json({ success: true });

    } catch {
        return NextResponse.json(
            { error: "Failed to create holding" },
            { status: 500 }
        );
    }
}


export async function DELETE(req: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("userId")?.value;


        if (!userId) {
            return NextResponse.json(
                { error: "Invalid user session" },
                { status: 400 }
            );
        }
        const holdingId = new URL(req.url).searchParams.get("id");

        if (!holdingId) {
            return NextResponse.json(
                { error: "Missing holding ID" },
                { status: 404 }
            );
        }



        await db.delete(holdings)
            .where(
                and(
                    eq(holdings.id, holdingId), eq(holdings.userId, userId)
                )
            )
        return NextResponse.json({ success: true });

    } catch {
        return NextResponse.json(
            { error: "Failed to create holding" },
            { status: 500 }
        );
    }
}