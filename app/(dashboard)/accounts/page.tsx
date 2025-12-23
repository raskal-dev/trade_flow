"use client"

import { addMt5Account, getMt5Accounts, testAccount } from "@/app/actions/account-actions"
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
import { AlertCircle, CheckCircle2, Plus, RefreshCw, Wallet } from "lucide-react"
import { useActionState, useEffect, useState } from "react"

export default function AccountsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [testingId, setTestingId] = useState<string | null>(null)

  const [state, formAction, isPending] = useActionState(addMt5Account, null)

  const fetchAccounts = async () => {
    setIsLoading(true)
    const result = await getMt5Accounts()
    if (result.success) {
      setAccounts(result.accounts || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    if (state?.success) {
      setIsAddOpen(false)
      fetchAccounts()
    }
  }, [state])

  const handleTest = async (accountId: string) => {
    setTestingId(accountId)
    const result = await testAccount(accountId)
    if (result.success) {
      alert("Connexion réussie !")
    } else {
      alert("Échec de la connexion : " + (result.error || "Erreur inconnue"))
    }
    setTestingId(null)
  }

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
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : accounts.length > 0 ? (
          accounts.map((account) => (
            <Card key={account.id} className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm font-medium">{account.customName}</CardTitle>
                  <CardDescription className="text-xs">
                    #{account.accountNumber} • {account.server}
                  </CardDescription>
                </div>
                <div className={`h-2 w-2 rounded-full ${account.accountType === 'real' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]'}`} />
              </CardHeader>
              <CardContent>
                <div className="mt-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-semibold capitalize">{account.accountType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status Sync</span>
                    <span className="text-xs flex items-center gap-1">
                      {account.syncEnabled ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-muted-foreground" />
                      )}
                      {account.syncEnabled ? "Activé" : "Désactivé"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleTest(account.id)}
                      disabled={testingId === account.id}
                    >
                      {testingId === account.id ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3" />
                      )}
                      Tester
                    </Button>
                    <Button variant="secondary" size="sm">
                      Détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full rounded-lg border-2 border-dashed p-12 flex flex-col items-center justify-center text-center space-y-4 bg-muted/5">
            <div className="rounded-full bg-primary/10 p-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div className="max-w-[400px] space-y-2">
              <h3 className="text-xl font-bold tracking-tight">Aucun compte lié</h3>
              <p className="text-muted-foreground">
                Connectez vos comptes MetaTrader 5 pour commencer à importer vos trades automatiquement.
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsAddOpen(true)}>
              Lier mon premier compte
            </Button>
          </div>
        )}
      </div>

      {accounts.length > 0 && (
        <div className="rounded-lg border bg-muted/30 p-6 flex flex-col items-center justify-center text-center space-y-2">
          <h3 className="text-sm font-semibold">Besoin d'aide ?</h3>
          <p className="text-xs text-muted-foreground max-w-[500px]">
            La synchronisation automatique s'effectue toutes les 5 minutes par défaut.
            Vous pouvez ajuster cette fréquence dans les paramètres de chaque compte.
          </p>
        </div>
      )}
    </div>
  )
}
