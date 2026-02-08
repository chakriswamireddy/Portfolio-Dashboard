"use client";

import { useEffect, useState } from "react";
import { usePortfolioStore } from "../../store/usePortolioStore";
import Tooltip from "./ToolTip";

export type Stock = {
  id: string;
  stockName: string;
  symbol: string;
  exchange: string;
  sector: string;
  cmp: number | null;
};

type Props = {
  value?: string;
  onSelect: (stock: Stock) => void;
  disabled?: boolean;
};

export default function StockSelect({ value, onSelect, disabled }: Props) {

  const [selStock, setSelStock] = useState<Stock | null>(null);



  const { stocks , loading} = usePortfolioStore();

  return (
    <div>
      
      <label className="block mb-1 text-xs text-zinc-400">Stock</label>
      <Tooltip  
        content={disabled ? "You cannot change the stock of an existing holding" : "Select the stock for this holding."}
      >
      <select
        value={value ?? ""}
        disabled={ disabled || loading}
        onChange={(e) => {
          const selected = stocks.find((s) => s.id === e.target.value);
          if (selected) {
            onSelect(selected);
            setSelStock(selected);
          }
        }}
        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="">
          {loading ? "Loading stocks..." : "Select a stock"}
        </option>

        {stocks.map((stock) => (
          <option key={stock.id} value={stock.id}>
            {stock.stockName} ({stock.symbol}) 
          </option>
        ))}
      </select>

      </Tooltip>

      {selStock && (
        <div className="mt-2 text-xs text-zinc-400">
          Currently, the CMP Value is &nbsp;
          {selStock.cmp}
        </div>
      )}

      <p></p>
    </div>
  );
}
