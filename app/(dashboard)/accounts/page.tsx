"use client"

import { addMt5Account } from "@/app/actions/account-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Plus, RefreshCw, Wallet } from "lucide-react"
import { useActionState, useEffect, useState } from "react"

export default function AccountsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(addMt5Account, null)

  useEffect(() => {
    if (state?.success) {
      setIsAddOpen(false)
    }
  }, [state])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Comptes MT5</h2>
          <p className="text-muted-foreground">Gérez vos connexions MetaTrader 5</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un compte
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form action={formAction}>
              <DialogHeader>
                <DialogTitle>Lier un compte MT5</DialogTitle>
                <DialogDescription>
                  Entrez les détails de votre compte MetaTrader 5 pour commencer la synchronisation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {state?.error && (
                  <div className="flex items-center gap-2 p-3 text-sm rounded bg-destructive/10 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{state.error}</span>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="customName">Nom personnalisé</Label>
                  <Input
                    id="customName"
                    name="customName"
                    placeholder="Ex: Mon Compte Scalping"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="accountNumber">Numéro de compte</Label>
                  <Input
                    id="accountNumber"
                    name="accountNumber"
                    placeholder="12345678"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="accountType">Type de compte</Label>
                  <select
                    id="accountType"
                    name="accountType"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="real" className="bg-background">Réel</option>
                    <option value="demo" className="bg-background">Démo</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Mot de passe Trading</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="server">Serveur</Label>
                  <Input
                    id="server"
                    name="server"
                    placeholder="Ex: Exness-MT5Real"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Vérification..." : "Lier le compte"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Mock Account Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Mon Compte Principal</CardTitle>
              <CardDescription className="text-xs">#12345678 • Exness-MT5Real</CardDescription>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          </CardHeader>
          <CardContent>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Solde</span>
                <span className="font-bold">$10,245.67</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dernière synchro</span>
                <span className="text-xs">Il y a 2 min</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="h-3 w-3" />
                  Sync
                </Button>
                <Button variant="secondary" size="sm">
                  Détails
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account with Error */}
        <Card className="bg-card/50 backdrop-blur-sm border-destructive/20 opacity-80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Compte Demo</CardTitle>
              <CardDescription className="text-xs">#55554444 • FTMO-Server</CardDescription>
            </div>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="mt-2 p-2 rounded bg-destructive/10 text-[10px] text-destructive flex items-start gap-2">
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>Erreur de connexion : identifiants incorrects ou serveur indisponible.</span>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button variant="outline" size="sm" className="w-full">
                Reconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border-2 border-dashed p-12 flex flex-col items-center justify-center text-center space-y-4 bg-muted/5">
        <div className="rounded-full bg-primary/10 p-4">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <div className="max-w-[400px] space-y-2">
          <h3 className="text-xl font-bold tracking-tight">Prêt à synchroniser ?</h3>
          <p className="text-muted-foreground">
            Connectez vos comptes MetaTrader 5 pour que nous puissions importer vos trades automatiquement et générer des analyses.
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsAddOpen(true)}>
          En savoir plus sur la sécurité
        </Button>
      </div>
    </div>
  )
}
