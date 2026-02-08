

export async function fetchYahooCMP(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?interval=1m&range=1d`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    return ""
  }

  console.log(res.ok)

  const json = await res.json();

  const result = json.chart?.result?.[0];
  const meta = result?.meta;

  return (meta?.regularMarketPrice ?? null)
 
}


