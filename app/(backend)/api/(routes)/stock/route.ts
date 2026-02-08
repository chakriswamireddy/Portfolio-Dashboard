import { NextResponse } from "next/server";
import { db } from "../../drizzle/setup";
import { StockingInterface, stockings } from "../../models/stockings";


const stockData = [
  { "name": "IDFC First Bank", "exchange": "NSE", "code": "IDFCFIRSTB", "sector": "Financials" },
  { "name": "Bajaj Finance", "exchange": "NSE", "code": "BAJFINANCE", "sector": "Financials" },
  { "name": "ICICI Bank", "exchange": "NSE", "code": "ICICIBANK", "sector": "Financials" },
  { "name": "Bajaj Finserv", "exchange": "NSE", "code": "BAJAJFINSV", "sector": "Financials" },
  { "name": "Savani Financials", "exchange": "NSE", "code": "SAVANIFIN", "sector": "Financials" },

  { "name": "Affle India", "exchange": "NSE", "code": "AFFLE", "sector": "Technology" },
  { "name": "LTIMindtree", "exchange": "NSE", "code": "LTIM", "sector": "Technology" },
  { "name": "Tata Technologies", "exchange": "NSE", "code": "TATATECH", "sector": "Technology" },
  { "name": "BLS International Services", "exchange": "NSE", "code": "BLS", "sector": "Technology" },
  { "name": "Tania Industries", "exchange": "NSE", "code": "TANIA", "sector": "Technology" },

  { "name": "Tata Consumer Products", "exchange": "NSE", "code": "TATACONSUM", "sector": "Consumer" },
  { "name": "Hindalco Industries", "exchange": "NSE", "code": "HINDALCO", "sector": "Consumer" },

  { "name": "Tata Power", "exchange": "NSE", "code": "TATAPOWER", "sector": "Power" },
  { "name": "KPI Green Energy", "exchange": "NSE", "code": "KPIGREEN", "sector": "Power" },
  { "name": "Suzlon Energy", "exchange": "NSE", "code": "SUZLON", "sector": "Power" },
  { "name": "Gensol Engineering", "exchange": "NSE", "code": "GENSOL", "sector": "Power" },

  { "name": "Hariom Pipe Industries", "exchange": "NSE", "code": "HARIOMPIPE", "sector": "Pipes" },
  { "name": "Astral", "exchange": "NSE", "code": "ASTRAL", "sector": "Pipes" },
  { "name": "Polycab India", "exchange": "NSE", "code": "POLYCAB", "sector": "Pipes" },

  { "name": "Clean Science and Technology", "exchange": "NSE", "code": "CLEAN", "sector": "Others" },
  { "name": "Deepak Nitrite", "exchange": "NSE", "code": "DEEPAKNTR", "sector": "Others" },
  { "name": "Fine Organic Industries", "exchange": "NSE", "code": "FINEORG", "sector": "Others" },
  { "name": "Gravita India", "exchange": "NSE", "code": "GRAVITA", "sector": "Others" },
  { "name": "SBI Life Insurance", "exchange": "NSE", "code": "SBILIFE", "sector": "Others" }
]

export async function GET() {
    try {

        const stockData = await db.select().from(stockings);

        return Response.json({
            success: true,
            data: stockData
        });
    } catch (error: any) {
        return Response.json(
            { success: false, error: error },
            { status: 500 }
        );
    }
}

interface StockSeed {
  name: string;
  code: string;
  sector: string;
}


export async function POST() {
    try {

      if (!Array.isArray(stockData)) {
        return NextResponse.json(
          { success: false, error: "Invalid stocks.json format" },
          { status: 400 }
        );
      }
  
      const values = (stockData as StockSeed[]).map((s) => ({
        stockName: s.name,
        symbol: s.code,
        sector: s.sector,
        exchange: "NSE"
      }));
  
      await db
        .insert(stockings)
        .values(values)
        .onConflictDoNothing({ target: stockings.symbol });
  
      return NextResponse.json({
        success: true,
        insertedCount: values.length
      });
    } catch (error: any) {
      console.error(error);
      return NextResponse.json(
        { success: false, error: error },
        { status: 500 }
      );
    }
  }


