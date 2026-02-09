"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
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
        // enableHiding: true,
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
              initialData={holdings.portfolio.find((item) => item.id === id)}
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
        header: "Portfolio %",
        accessorKey: "portfolioPercentage",
        cell: (info) => {
          const val = Number(info.getValue());
          return `${val.toFixed(2)}%`;
        },
      },
      {
        header: "PE Ratio",
        accessorKey: "peRatio",
        cell: (info) => {
          const val = Number(info.getValue());
          return `${val.toFixed(2)}`;
        },
      },
      {
        header: "Exchange",
        accessorKey: "exchange",
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

  const data = useMemo(
    () =>
      (holdings.portfolio ?? []).map((h) => ({
        ...h,
        sector: h.sector,
      })),
    [holdings.portfolio]
  );

  const sectorSummaryMap = useMemo(() => {
    const map: Record<string, SectorSummary> = {};
    holdings.sectors?.forEach((s) => {
      map[s.sector] = s;
    });
    return map;
  }, [holdings.sectors]);

  const table = useReactTable({
    data,
    columns,
    state: {
      grouping,
      expanded: true,
      columnVisibility: {
        sector: false,
      },
    },
    onGroupingChange: setGrouping,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="overflow-auto rounded-xl border border-zinc-800 bg-zinc-900">
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
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  {table.getVisibleFlatColumns().map((column) => (
                    <td key={column.id} className="px-4 py-3">
                      <div className="h-4 w-full animate-pulse rounded bg-zinc-700/60" />
                    </td>
                  ))}
                </tr>
              ))
            : table.getRowModel().rows.map((row) => {
                if (row.getIsGrouped()) {
                  const sector = row.getValue("sector") as string;
                  const summary = sectorSummaryMap[sector];

                  return (
                    <tr
                      key={row.id}
                      className="border-t border-zinc-700 bg-zinc-800 font-semibold"
                    >
                      {row.getVisibleCells().map((cell, index) => {
                        const columnId = cell.column.id;

                        if (index === 0) {
                          return (
                            <td key={columnId} className="px-4 py-3">
                              {sector}
                            </td>
                          );
                        }

                        if (columnId === "investmentValue") {
                          return (
                            <td key={cell.id} className="px-4 py-3">
                              ₹
                              {Number(
                                summary?.totalInvestment ?? 0
                              ).toLocaleString()}
                            </td>
                          );
                        }

                        if (columnId === "presentValue") {
                          return (
                            <td key={cell.id} className="px-4 py-3">
                              ₹
                              {Number(
                                summary?.totalPresentValue ?? 0
                              ).toLocaleString()}
                            </td>
                          );
                        }

                        if (columnId === "gainLoss") {
                          const val = Number(summary?.gainLoss ?? 0);
                          return (
                            <td
                              key={cell.id}
                              className={`px-4 py-3 ${
                                val >= 0 ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              ₹{val.toLocaleString()}
                            </td>
                          );
                        }

                        return <td key={cell.id} className="px-4 py-3"></td>;
                      })}
                    </tr>
                  );
                }

                return (
                  <tr
                    key={row.id}
                    className="border-t border-zinc-800 hover:bg-zinc-800/40"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
        </tbody>

        <tfoot className="bg-zinc-600 text-zinc-200 font-semibold">
          <tr className="border-t border-zinc-700">
            {table.getVisibleFlatColumns().map((column) => {
              const id = column.id;

              if (id === "edit") {
                return (
                  <td key={id} className="px-4 py-3">
                    Total
                  </td>
                );
              }

              if (id === "investmentValue") {
                return (
                  <td key={id} className="px-4 py-3">
                    ₹
                    {Number(
                      holdings.totals?.totalInvestment ?? 0
                    ).toLocaleString()}
                  </td>
                );
              }

              if (id === "presentValue") {
                return (
                  <td key={id} className="px-4 py-3">
                    ₹
                    {Number(
                      holdings.totals?.totalPresentValue ?? 0
                    ).toLocaleString()}
                  </td>
                );
              }

              if (id === "gainLoss") {
                const val = Number(holdings.totals?.totalGainLoss ?? 0);
                return (
                  <td
                    key={id}
                    className={`px-4 py-3 ${
                      val >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    ₹{val.toLocaleString()}
                  </td>
                );
              }

              return <td key={id} className="px-4 py-3"></td>;
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
