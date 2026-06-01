'use client'

import { KPICards } from '@/components/crm/kpi-cards'
import { Charts } from '@/components/crm/charts'
import { LeadsTable } from '@/components/crm/leads-table'
import { Pipeline } from '@/components/crm/pipeline'
import { PageLayout } from '@/components/crm/page-layout'

export default function Home() {
  return (
    <PageLayout
      title="Dashboard"
      subtitle="Welcome back! Here's your sales overview."
    >
      <KPICards />
      <Charts />
      <Pipeline />
      <LeadsTable />
    </PageLayout>
  )
}
