"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

type Holding = {
  stockName: string;
  symbol: string;
  exchange: string;
  sector: string;
  quantity: number;
  purchasePrice: number;
  cmp: number;
  investment: number;
  presentValue: number;
  gainLoss: number;
};

type SectorSummary = {
  sector: string;
  totalInvestment: number;
  totalPresentValue: number;
  gainLoss: number;
};

type totalSummary = {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
};

export default function HoldingsTable() {
  const [data, setData] = useState<{
    portfolio: Holding[];
    sectors: SectorSummary[];
    totals: totalSummary;
  }>({
    portfolio: [],
    sectors: [],
    totals: {
      totalInvestment: 0,
      totalPresentValue: 0,
      totalGainLoss: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        setData({
          portfolio: data.portfolio ?? [],
          sectors: data.sectors ?? [],
          totals: data.totals ?? {
            totalInvestment: 0,
            totalPresentValue: 0,
            totalGainLoss: 0,
          },
        });
      })
      .catch(() => {
        setData({
          portfolio: [],
          sectors: [],
          totals: {
            totalInvestment: 0,
            totalPresentValue: 0,
            totalGainLoss: 0,
          },
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const columns = useMemo<ColumnDef<Holding>[]>(
    () => [
      { header: "Stock", accessorKey: "stockName" },
      { header: "Symbol", accessorKey: "symbol" },
      { header: "Qty", accessorKey: "quantity" },
      {
        header: "Buy Price",
        accessorKey: "purchasePrice",
        cell: (info) => {
          const val = Number(info.getValue());
          return `₹${val.toFixed(2)}`;
        },
      },
      {
        header: "CMP",
        accessorKey: "cmp",
        cell: (info) => {
          const val = Number(info.getValue());
          return `₹${val.toFixed(2)}`;
        },
      },
      {
        header: "Investment",
        accessorKey: "investmentValue",
        cell: (info) => {
          const val = Number(info.getValue());
          return `₹${val.toFixed(2)}`;
        },
      },
      {
        header: "Present Value",
        accessorKey: "presentValue",
        cell: (info) => {
          const val = Number(info.getValue());
          return `₹${val.toFixed(2)}`;
        },
      },
      {
        header: "P/L",
        accessorKey: "gainLoss",
        cell: (info) => {
          const val = info.getValue<number>();
          return (
            <span className={val >= 0 ? "text-emerald-400" : "text-red-400"}>
              ₹{val.toLocaleString()}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: data.portfolio ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <p className="text-zinc-400">Loading portfolio...</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-zinc-800 text-zinc-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 text-left font-medium">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-t border-zinc-800 hover:bg-zinc-800/40"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
