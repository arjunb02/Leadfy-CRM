'use client'

import { useState } from 'react'
import { ChevronDown, Calendar, Phone, Mail, MapPin, Briefcase } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

export function RightPanel() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="w-full lg:w-80 flex-shrink-0 border-l border-border">
      <div className="h-full overflow-y-auto p-6 space-y-6">
        {/* Contact Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Contact Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar and Name */}
            <div className="flex flex-col items-center gap-3 pb-4 border-b border-border">
              <Avatar className="w-16 h-16">
                <AvatarImage src="https://avatar.vercel.sh/sarah" alt="Sarah Chen" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-semibold">Sarah Chen</h3>
                <p className="text-xs text-muted-foreground">Account Manager</p>
              </div>
              <Badge>Qualified Lead</Badge>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">sarah.chen@acme.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs">Company</p>
                  <p className="font-medium">Acme Corporation</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs">Location</p>
                  <p className="font-medium">San Francisco, CA</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-muted-foreground text-xs">Last Contact</p>
                  <p className="font-medium">2 hours ago</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button size="sm" className="flex-1">
                Call
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                Email
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <Card>
            <CardHeader className="pb-3">
              <CollapsibleTrigger className="flex w-full items-center justify-between">
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <div className="space-y-4">
                  {/* Activity Items */}
                  {[
                    { time: '2 hours ago', action: 'Call completed', desc: '30 min discussion' },
                    { time: 'Yesterday', action: 'Proposal sent', desc: 'Website redesign' },
                    { time: '2 days ago', action: 'Meeting scheduled', desc: 'Discovery call' },
                    { time: '3 days ago', action: 'Lead created', desc: 'From LinkedIn' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        {idx < 3 && <div className="w-0.5 h-8 bg-border mt-1" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.desc}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Notes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Interested in Q3 timeline. Budget approval needed from CFO. Follow up next week.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
