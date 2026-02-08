"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getGroupedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import HoldingForm from "./HoldingForm";
import { HoldingFormData, SectorSummary, totalSummary } from "@/lib/types";
import { usePortfolioStore } from "../store/usePortolioStore";

export default function HoldingsTable() {
  const { holdings, loading } = usePortfolioStore();

  // console.log("hodlings", holdings);
  const [grouping, setGrouping] = useState<string[]>(["sector"]);


  const columns = useMemo<ColumnDef<HoldingFormData>[]>(
    () => [
      {
        accessorKey: "sector",
        header: "Sector",
      },
      
      {
        header: "Edit",
        accessorKey: "edit",
        cell: (info) => {
          const id = info.row.original.id;
          // console.log("id", info.row.original);
          // console.log((holdings.portfolio.find((item) => item.id ===  id )))
          return (
            <HoldingForm
              initialData={holdings.portfolio.find((item) => item.id ===  id )}
              submitLabel="Edit"
            />
          );
        },
      },
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
    [holdings.portfolio]
  );

  const table = useReactTable({
    data: holdings.portfolio ?? [],
    columns,
    state: {
      grouping,
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel()
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
