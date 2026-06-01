'use client'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Status = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost'

const statusStyles: Record<Status, string> = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  qualified: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  proposal: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
  negotiation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
  closed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
  lost: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
}

const statusLabels: Record<Status, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed: 'Closed Won',
  lost: 'Closed Lost',
}

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge className={cn(statusStyles[status], className)}>
      {statusLabels[status]}
    </Badge>
  )
}
