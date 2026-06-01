'use client'

import { Download, TrendingUp, DollarSign, Users, Target, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie,
  CartesianGrid, Tooltip, ResponsiveContainer, XAxis, YAxis, Cell, Legend,
} from 'recharts'
import { PageLayout } from '@/components/crm/page-layout'

const revenueData = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Feb', revenue: 52000, target: 50000 },
  { month: 'Mar', revenue: 48000, target: 55000 },
  { month: 'Apr', revenue: 61000, target: 55000 },
  { month: 'May', revenue: 55000, target: 60000 },
  { month: 'Jun', revenue: 67000, target: 60000 },
]

const conversionData = [
  { stage: 'Leads', count: 450 },
  { stage: 'Contacts', count: 280 },
  { stage: 'Proposals', count: 120 },
  { stage: 'Negotiations', count: 65 },
  { stage: 'Won', count: 32 },
]

const sourceData = [
  { name: 'Website', value: 35 },
  { name: 'LinkedIn', value: 25 },
  { name: 'Referral', value: 20 },
  { name: 'Email', value: 15 },
  { name: 'Other', value: 5 },
]

const performanceData = [
  { name: 'Alice', deals: 12, revenue: 145000, rate: 68 },
  { name: 'Bob', deals: 9, revenue: 98000, rate: 55 },
  { name: 'Carol', deals: 15, revenue: 187000, rate: 72 },
  { name: 'David', deals: 7, revenue: 76000, rate: 48 },
  { name: 'Eve', deals: 11, revenue: 132000, rate: 65 },
]

const COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#EC4899', '#F59E0B']

const tooltipStyle = {
  contentStyle: { backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' },
  labelStyle: { color: 'var(--foreground)' },
  itemStyle: { color: 'var(--muted-foreground)' },
}

const kpis = [
  { label: 'Total Revenue', value: '$328K', change: '+18%', icon: <DollarSign className="w-5 h-5" /> },
  { label: 'Total Leads', value: '2,458', change: '+12%', icon: <Users className="w-5 h-5" /> },
  { label: 'Deals Won', value: '32', change: '+8%', icon: <Target className="w-5 h-5" /> },
  { label: 'Win Rate', value: '32%', change: '+5%', icon: <TrendingUp className="w-5 h-5" /> },
]

export default function ReportsPage() {
  return (
    <PageLayout
      title="Reports"
      subtitle="Analytics and performance insights"
      actions={
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" /> Export Report
        </Button>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
                <div className="text-primary">{kpi.icon}</div>
              </div>
              <p className="text-xl md:text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-accent mt-1">{kpi.change} vs last quarter</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue">
        <TabsList className="flex-wrap h-auto gap-1 mb-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader><CardTitle className="text-base">Revenue vs Target</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} tickFormatter={v => `$${v / 1000}k`} />
                  <Tooltip {...tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, '']} />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" stroke="#4F46E5" fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="target" stroke="#EC4899" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline">
          <Card>
            <CardHeader><CardTitle className="text-base">Conversion Funnel</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="stage" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardHeader><CardTitle className="text-base">Lead Sources</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                      {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2 shrink-0">
                  {sourceData.map((s, i) => (
                    <div key={s.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-sm">{s.name}</span>
                      <span className="text-sm font-semibold ml-auto">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader><CardTitle className="text-base">Team Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Rep</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Deals Won</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Revenue</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((rep, i) => (
                      <tr key={rep.name} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-2 font-medium">{rep.name}</td>
                        <td className="py-3 px-2">{rep.deals}</td>
                        <td className="py-3 px-2 text-accent font-medium">${rep.revenue.toLocaleString()}</td>
                        <td className="py-3 px-2 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[80px]">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${rep.rate}%` }} />
                            </div>
                            <span className="text-xs">{rep.rate}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  )
}
