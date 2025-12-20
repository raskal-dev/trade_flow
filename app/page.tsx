import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Clock, TrendingDown, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Bienvenue, Trader</h2>
        <p className="text-muted-foreground">Voici un aperçu de vos performances de trading.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+$12,450.00</div>
            <p className="text-xs text-muted-foreground">+12% depuis le mois dernier</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.5%</div>
            <p className="text-xs text-muted-foreground">Stable sur 127 trades</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h 15m</div>
            <p className="text-xs text-muted-foreground">Swing trading dominant</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <p className="text-xs text-muted-foreground">Gestion du risque optimale</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        <Card className="md:col-span-4 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Courbe d'équité</CardTitle>
            <CardDescription>Visualisation de votre croissance de capital (Demo data)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t border-dashed mt-4 text-muted-foreground italic">
            Graphique Recharts à intégrer ici...
          </CardContent>
        </Card>
        <Card className="md:col-span-3 bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Dernières Activités</CardTitle>
            <CardDescription>Vos 5 derniers trades synchronisés</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {[
                { symbol: "EURUSD", type: "BUY", pl: "+$125.00", time: "Il y a 2h" },
                { symbol: "GBPUSD", type: "SELL", pl: "-$45.00", time: "Il y a 5h" },
                { symbol: "XAUUSD", type: "BUY", pl: "+$210.00", time: "Hier" },
              ].map((trade, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{trade.symbol}</span>
                    <span className="text-xs text-muted-foreground">{trade.type} • {trade.time}</span>
                  </div>
                  <span className={trade.pl.startsWith('+') ? "text-emerald-500 font-medium" : "text-destructive font-medium"}>
                    {trade.pl}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
