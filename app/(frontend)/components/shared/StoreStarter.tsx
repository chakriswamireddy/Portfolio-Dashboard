"use client";
import React, { useEffect } from "react";
import { usePortfolioStore } from "../../store/usePortolioStore";

function StoreStarter() {
  const { fetchHoldings, fetchStocks } = usePortfolioStore();

  useEffect(() => {
    fetchHoldings();
    fetchStocks();
  }, []);

  return <></>;
}

export default StoreStarter;
