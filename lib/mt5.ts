export interface Mt5Trade {
  ticket: number;
  symbol: string;
  type: "BUY" | "SELL";
  volume: number;
  openPrice: number;
  closePrice: number;
  openTime: Date;
  closeTime: Date;
  profit: number;
  swap: number;
  commission: number;
  comment?: string;
}

export interface Mt5AccountSummary {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
}

export const getTradeNetProfit = (trade: Mt5Trade): number => {
  return trade.profit + trade.swap + trade.commission;
};

export const getFloatingProfit = (summary: Mt5AccountSummary): number => {
  return summary.equity - summary.balance;
};

export const fetchMt5Trades = async () => {
  const data = [
    {
      ticket: 1,
      symbol: "XAUUSD",
      type: "BUY",
      volume: 1,
      openPrice: 1,
      closePrice: 5,
      openTime: new Date(),
      closeTime: new Date(),
      profit: 4,
      swap: 1,
      commission: 1,
    },
    {
      ticket: 2,
      symbol: "XAUUSD",
      type: "BUY",
      volume: 1,
      openPrice: 5,
      closePrice: 8,
      openTime: new Date(),
      closeTime: new Date(),
      profit: 3,
      swap: 1,
      commission: 1,
    }
  ];
  return data;
};

export const testMt5Connection = async (credentials: any): Promise<boolean> => {
  console.log("Tentative de connexion avec :", credentials.server);
  
  // On simule une attente réseau de 2 secondes
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Pour l'instant on accepte tout, mais plus tard on appellera le vrai Bridge
  return true; 
};