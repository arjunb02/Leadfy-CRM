'use client'

import { Search, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBadge } from './status-badge'
import { useState } from 'react'

interface Lead {
  id: string
  name: string
  email: string
  company: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal'
  value: string
  phone: string
  avatar: string
}

const leads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@acme.com',
    company: 'Acme Corp',
    status: 'qualified',
    value: '$45,000',
    phone: '+1 (555) 123-4567',
    avatar: 'SC',
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'mrodriguez@techstartup.io',
    company: 'TechStartup',
    status: 'proposal',
    value: '$78,000',
    phone: '+1 (555) 234-5678',
    avatar: 'MR',
  },
  {
    id: '3',
    name: 'Emily Watson',
    email: 'emily@innovatetech.com',
    company: 'InnovateTech',
    status: 'contacted',
    value: '$32,000',
    phone: '+1 (555) 345-6789',
    avatar: 'EW',
  },
  {
    id: '4',
    name: 'David Kumar',
    email: 'dkumar@globalventures.com',
    company: 'Global Ventures',
    status: 'new',
    value: '$56,000',
    phone: '+1 (555) 456-7890',
    avatar: 'DK',
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    email: 'jmartinez@fintech.io',
    company: 'FinTech Solutions',
    status: 'qualified',
    value: '$92,000',
    phone: '+1 (555) 567-8901',
    avatar: 'JM',
  },
]



export function LeadsTable() {
  const [search, setSearch] = useState('')

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Recent Leads</CardTitle>
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-muted"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{lead.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="font-medium text-sm">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{lead.company}</TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{lead.value}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">View</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Convert</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{lead.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">View</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Convert</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="font-medium">{lead.company}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Value</p>
                  <p className="font-medium">{lead.value}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status:</span>
                <StatusBadge status={lead.status} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
