import { create } from "zustand";
import { Stock } from "../components/ui/StockSelect";
 
import { HoldingFormData, SectorSummary, totalSummary } from "@/lib/types";

type PortfolioState = {
  holdings: {
    portfolio: HoldingFormData[];
    sectors: SectorSummary[];
    totals: totalSummary;
  };
  stocks: Stock[];
  loading: boolean;

  fetchHoldings: () => Promise<void>;
  fetchStocks: () => Promise<void>;

};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  holdings: {
    portfolio: [],
    sectors: [],
    totals: {
      totalInvestment: 0,
      totalPresentValue: 0,
      totalGainLoss: 0,
    },
  },
  stocks: [],
  loading: false,

  fetchHoldings: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();

      set({
        holdings: ({
          portfolio: data.portfolio ?? [],
          sectors: data.sectors ?? [],
          totals: data.totals ?? {
            totalInvestment: 0,
            totalPresentValue: 0,
            totalGainLoss: 0,
          },
        }),
        loading: false
      });
    } catch {
      set({ loading: false });
    }
  },

  fetchStocks: async () => {
    try {
      const res = await fetch("/api/stocks");
      const json = await res.json();

      set({
        stocks: json.data ?? []
      });
    } catch { }
  }


}));
