export  type SectorSummary = {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
};

export type totalSummary = {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
};


export   type HoldingFormData = {
    id: string;
    stockId: string;
    stockName: string;
    symbol: string;
    exchange: string;
    sector: string;
    quantity: number;
    purchasePrice: number;
  };