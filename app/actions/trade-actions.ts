"use server";

import { syncAccountTrades } from "@/lib/mt5";
import { actionError, actionSuccess } from "@/lib/response";
import { revalidatePath } from "next/cache";

export const syncTrades = async (accountId: string) => {
  try { 
    const result = await syncAccountTrades(accountId);

    if (result.success) {
      revalidatePath("/accounts");
      revalidatePath("/dashboard");
      return actionSuccess(result.count, "Synchronisation terminée");
    }

    return actionError(result.error || "Une erreur est survenue");
  } catch (error) {
    console.error("Erreur action syncTrades: ", error);
    return actionError("Une erreur est survenue lors de la synchronisation des trades");
  }
};