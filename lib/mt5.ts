import { prisma } from "./prisma";

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

export const mapMt5TradeToPrisma = (mt5AccountId: string, trade: Mt5Trade) => {
  return {
    mt5AccountId: mt5AccountId,
    ticket: BigInt(trade.ticket),
    symbol: trade.symbol,
    type: trade.type,
    volume: trade.volume,
    priceOpen: trade.openPrice,
    priceClose: trade.closePrice,
    timeOpen: trade.openTime,
    timeClose: trade.closeTime,
    profit: trade.profit,
    commission: trade.commission,
    swap: trade.swap,
    comment: trade.comment,
    isOpen: false,
  }
}

export const syncAccountTrades = async (accountId: string) => {
  try {
    const mt5Trades = await fetchMt5Trades();
    let syncedCount = 0;

    for (const mt5Trade of mt5Trades) {
      const tradeData = mapMt5TradeToPrisma(accountId, mt5Trade);

      await prisma.trade.upsert({
        where: {
          mt5AccountId_ticket: {
            mt5AccountId: accountId,
            ticket: tradeData.ticket,
          },
        },
        update: {},
        create: tradeData,
      });

      syncedCount++;
    }

    await prisma.syncLog.create({
      data: {
        mt5AccountId: accountId,
        status: "success",
        tradesSynced: syncedCount,
        message: `Synchronisation réussie : ${syncedCount} trades traités.`,
      },
    });

    return { success: true, count: syncedCount };
  } catch (error) {
    console.error("Erreur de synchro : ", error);
    return { success: false, error: "Échec de la synchronisation" };
  }
}