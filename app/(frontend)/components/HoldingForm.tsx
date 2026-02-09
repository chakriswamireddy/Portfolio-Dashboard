"use client";

import { useState } from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import Modal from "./ui/Modal";
import StockSelect from "./ui/StockSelect";
import { HoldingFormData } from "@/lib/types";
import { usePortfolioStore } from "../store/usePortolioStore";

type Props = {
  initialData?: Partial<HoldingFormData>;
  submitLabel?: string;
};

export default function HoldingForm({
  initialData = {},
  submitLabel = "Create Holding",
}: Props) {
  const [form, setForm] = useState<HoldingFormData>({
    id: initialData.id ?? "",
    stockId: initialData.stockId ?? "",
    stockName: initialData.stockName ?? "",
    symbol: initialData.symbol ?? "",
    exchange: initialData.exchange ?? "NSE",
    sector: initialData.sector ?? "",
    quantity: initialData.quantity ?? 0,
    purchasePrice: initialData.purchasePrice ?? 0,
  });

  const {fetchHoldings} = usePortfolioStore();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function updateField<K extends keyof HoldingFormData>(
    key: K,
    value: HoldingFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.SubmitEvent) {
    try {
      console.log(initialData);
      e.preventDefault();
      setLoading(true);

      if (initialData.id) {
        await fetch(`/api/portfolio/?id=${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, stockId: initialData.stockId }),
        });
        setLoading(false);
        return;
      } else {
        await fetch("/api/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
    } catch (error) {
      console.log("Error saving holding:", error);
    } finally {
      setOpen(false);

      fetchHoldings();

      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`px-4 py-2 cursor-pointer ${initialData?.id ?  " border border-pink-500":"bg-pink-500"}   text-white rounded-lg hover:bg-pink-600 transition-colors`}
      >
        {submitLabel}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={submitLabel}>
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold text-zinc-100">{submitLabel}</h2>

          <div className="grid grid-cols-2 gap-4">
            <StockSelect
              disabled={!!initialData.id}
              onSelect={(stock) => {
                updateField("stockId", stock.id);
              }}
              value={form.stockId}
            />

            <Input
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={(v) => updateField("quantity", Number(v))}
            />

            <Input
              label="Purchase Price"
              type="number"
              value={form.purchasePrice}
              onChange={(v) => updateField("purchasePrice", Number(v))}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-pink-600 py-2 text-sm font-medium text-black hover:bg-pink-500 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : submitLabel}
          </button>
        </form>
      </Modal>
    </>
  );
}
