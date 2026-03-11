"use server";

import { auth } from "@/lib/auth";
import { decrypt, encrypt } from "@/lib/encryption";
import { testMt5Connection } from "@/lib/mt5";
import { prisma } from "@/lib/prisma";
import { actionError, actionSuccess } from "@/lib/response";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const addMt5Account = async (prevState: any, formData: FormData) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const user = session?.user;

    if (!user) {
      return actionError("Utilisateur non authentifié", "AUTH_REQUIRED");
    }

    const customName = formData.get("customName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const accountType = formData.get("accountType") as string;
    const password = formData.get("password") as string;
    const server = formData.get("server") as string;

    if (!customName || !accountNumber || !password || !server) {
      return actionError("Tous les champs sont obligatoires");
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
    return actionSuccess(mt5Account, "Compte lié avec succès");
  } catch (error) {
    console.error("Erreur lors de l'ajout du compte MT5:", error);
    return actionError("Une erreur est survenue lors de la création du compte");
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
      return actionError("Compte non trouvé");
    }

    const password = decrypt(accountMt5.encryptedPassword);

    const isConnected = await testMt5Connection({
      accountNumber: accountMt5.accountNumber,
      password,
      server: accountMt5.server,
    });

    if (isConnected) {
      return actionSuccess(true, "Connexion réussie");
    } else {
      return actionError("Échec de la connexion");
    }
  } catch (error) {
    console.error("Erreur lors du test du compte MT5:", error);
    return actionError("Une erreur est survenue lors du test du compte");
  }
};

export const getMt5Accounts = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const user = session?.user;

    if (!user) {
      return actionError("Utilisateur non authentifié", "AUTH_REQUIRED");
    }

    const accounts = await prisma.mt5Account.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return actionSuccess(accounts);
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes MT5:", error);
    return actionError("Une erreur est survenue lors de la récupération des comptes");
  }
};