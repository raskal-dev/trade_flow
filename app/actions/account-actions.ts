"use server";

import { auth } from "@/lib/auth";
import { decrypt, encrypt } from "@/lib/encryption";
import { testMt5Connection } from "@/lib/mt5";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const addMt5Account = async (prevState: any, formData: FormData) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const user = session?.user;

    if (!user) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    const customName = formData.get("customName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const accountType = formData.get("accountType") as string;
    const password = formData.get("password") as string;
    const server = formData.get("server") as string;

    if (!customName || !accountNumber || !password || !server) {
      return { success: false, error: "Tous les champs sont obligatoires" };
    }

    const encryptedPassword = encrypt(password);

    const mt5Account = await prisma.mt5Account.create({
      data: {
        customName,
        accountNumber,
        accountType,
        encryptedPassword,
        server,
        userId: user.id,
      }
    });

    revalidatePath("/accounts");
    return { success: true, account: mt5Account };
  } catch (error) {
    console.error("Erreur lors de l'ajout du compte MT5:", error);
    return { success: false, error: "Une erreur est survenue lors de la création du compte" };
  }
};

export const testAccount = async (accountId: string) => {
  try {
    const accountMt5 = await prisma.mt5Account.findUnique({
      where: {
        id: accountId,
      },
    });

    if (!accountMt5) {
      return { success: false, error: "Compte non trouvé" };
    }

    const password = decrypt(accountMt5.encryptedPassword);

    const isConnected = await testMt5Connection({
      accountNumber: accountMt5.accountNumber,
      password,
      server: accountMt5.server,
    });

    return { success: isConnected };
  } catch (error) {
    console.error("Erreur lors du test du compte MT5:", error);
    return { success: false, error: "Une erreur est survenue lors du test du compte" };
  }
};

export const getMt5Accounts = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const user = session?.user;

    if (!user) {
      return { success: false, error: "Utilisateur non authentifié" };
    }

    const accounts = await prisma.mt5Account.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, accounts };
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes MT5:", error);
    return { success: false, error: "Une erreur est survenue lors de la récupération des comptes" };
  }
};