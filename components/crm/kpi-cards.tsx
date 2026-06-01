'use client'

import { ArrowUpRight, ArrowDownRight, Users, TrendingUp, DollarSign, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface KPICardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  unit?: string
}

function KPICard({ title, value, change, icon, unit }: KPICardProps) {
  const isPositive = change >= 0

  return (
    <Card className="bg-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="text-primary">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <>
                <ArrowUpRight className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium text-accent">{change}%</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-4 h-4 text-destructive" />
                <span className="text-xs font-medium text-destructive">{Math.abs(change)}%</span>
              </>
            )}
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KPICards() {
  const kpis = [
    {
      title: 'Total Leads',
      value: '2,458',
      change: 12,
      icon: <Users className="w-5 h-5" />,
    },
    {
      title: 'Conversion Rate',
      value: '32.5',
      change: 5.2,
      icon: <TrendingUp className="w-5 h-5" />,
      unit: '%',
    },
    {
      title: 'Pipeline Value',
      value: '$1.2M',
      change: 18,
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      title: 'Deals Won',
      value: '24',
      change: 8,
      icon: <Target className="w-5 h-5" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
          unit={kpi.unit}
        />
      ))}
    </div>
  )
}
