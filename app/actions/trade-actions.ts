"use server";

import { syncAccountTrades } from "@/lib/mt5";
import { revalidatePath } from "next/cache";

export const syncTrades = async (accountId: string) => {
  try { 
    const result = await syncAccountTrades(accountId);

    if (result.success) {
      revalidatePath("/accounts");
      revalidatePath("/dashboard");
    }

    return result;
   } catch (error) {
    console.error("Erreur action syncTrades: ", error);
    return { success: false, error: "Une erreur est survenue lors de la synchronisation des trades" };
  }
};