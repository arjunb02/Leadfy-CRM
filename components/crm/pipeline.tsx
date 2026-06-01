"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Deal {
  id: string;
  title: string;
  company: string;
  amount: string;
  stage: string;
  avatar: string;
}

interface Stage {
  name: string;
  deals: Deal[];
  color: string;
}

const stages: Stage[] = [
  {
    name: "Prospecting",
    color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    deals: [
      {
        id: "1",
        title: "Website Redesign",
        company: "TechCorp",
        amount: "$25k",
        stage: "prospecting",
        avatar: "TC",
      },
      {
        id: "2",
        title: "App Development",
        company: "StartupX",
        amount: "$45k",
        stage: "prospecting",
        avatar: "SX",
      },
    ],
  },
  {
    name: "Initial Contact",
    color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    deals: [
      {
        id: "3",
        title: "Marketing Campaign",
        company: "RetailCo",
        amount: "$32k",
        stage: "contact",
        avatar: "RC",
      },
    ],
  },
  {
    name: "Proposal",
    color: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    deals: [
      {
        id: "4",
        title: "Cloud Migration",
        company: "EnterpriseTech",
        amount: "$120k",
        stage: "proposal",
        avatar: "ET",
      },
      {
        id: "5",
        title: "Security Audit",
        company: "FinanceInc",
        amount: "$55k",
        stage: "proposal",
        avatar: "FI",
      },
    ],
  },
  {
    name: "Negotiation",
    color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
    deals: [
      {
        id: "6",
        title: "Infrastructure Setup",
        company: "DataSys",
        amount: "$78k",
        stage: "negotiation",
        avatar: "DS",
      },
    ],
  },
  {
    name: "Closed Won",
    color: "bg-green-500/10 text-green-700 dark:text-green-400",
    deals: [
      {
        id: "7",
        title: "Analytics Integration",
        company: "GrowthCo",
        amount: "$42k",
        stage: "closed",
        avatar: "GC",
      },
      {
        id: "8",
        title: "API Development",
        company: "IntegrationHub",
        amount: "$65k",
        stage: "closed",
        avatar: "IH",
      },
    ],
  },
];

export function Pipeline() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Opportunity Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max pr-4">
            {stages.map((stage) => (
              <div key={stage.name} className="flex-shrink-0 w-72 space-y-3">
                {/* Stage Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-muted rounded-lg">
                  <h3 className="font-semibold text-sm">{stage.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {stage.deals.length}
                  </Badge>
                </div>

                {/* Deal Cards */}
                <div className="space-y-2">
                  {stage.deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3 bg-card border border-border rounded-lg hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                    >
                      <div className="space-y-2">
                        <p className="font-medium text-sm line-clamp-2">
                          {deal.title}
                        </p>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-xs">
                                {deal.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-muted-foreground truncate">
                              {deal.company}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="font-semibold text-sm text-accent">
                            {deal.amount}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {stage.name}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
