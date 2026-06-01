'use client'

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const pipelineData = [
  { name: 'Lead', value: 450 },
  { name: 'Prospect', value: 320 },
  { name: 'Proposal', value: 200 },
  { name: 'Negotiation', value: 120 },
  { name: 'Closed', value: 80 },
]

const revenueData = [
  { month: 'Jan', revenue: 45000, target: 50000 },
  { month: 'Feb', revenue: 52000, target: 50000 },
  { month: 'Mar', revenue: 48000, target: 50000 },
  { month: 'Apr', revenue: 61000, target: 55000 },
  { month: 'May', revenue: 55000, target: 55000 },
  { month: 'Jun', revenue: 67000, target: 60000 },
]

const sourceData = [
  { name: 'Website', value: 35 },
  { name: 'LinkedIn', value: 25 },
  { name: 'Referral', value: 20 },
  { name: 'Email', value: 15 },
  { name: 'Other', value: 5 },
]

const performanceData = [
  { week: 'W1', deals: 12, conversions: 45 },
  { week: 'W2', deals: 19, conversions: 52 },
  { week: 'W3', deals: 15, conversions: 48 },
  { week: 'W4', deals: 22, conversions: 61 },
  { week: 'W5', deals: 18, conversions: 55 },
]

const COLORS = ['#4F46E5', '#7C3AED', '#06B6D4', '#EC4899', '#F59E0B']

export function Charts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Pipeline */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Sales Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={pipelineData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Bar dataKey="value" fill="#4F46E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={revenueData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#06B6D4"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#7C3AED"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lead Source Distribution */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Lead Sources</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart
              data={performanceData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
              />
              <Area
                type="monotone"
                dataKey="deals"
                stroke="#4F46E5"
                fillOpacity={1}
                fill="url(#colorDeals)"
              />
              <Area
                type="monotone"
                dataKey="conversions"
                stroke="#06B6D4"
                fillOpacity={1}
                fill="url(#colorConversions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
