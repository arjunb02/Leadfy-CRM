"use client";

import { useState } from "react";
import {
  Plus,
  DollarSign,
  TrendingUp,
  Target,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageLayout } from "@/components/crm/page-layout";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { DealForm } from "@/components/crm/forms/deal-form";
import { toast } from "sonner";

import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

const initialStages = [
  {
    id: "prospecting",
    name: "Prospecting",
    color: "bg-blue-500",
    deals: [
      { id: "1", title: "Website Redesign", company: "TechCorp", amount: "$25,000", days: 3, avatar: "TC", probability: 20 },
      { id: "2", title: "App Development", company: "StartupX", amount: "$45,000", days: 7, avatar: "SX", probability: 20 },
    ],
  },
  {
    id: "contact",
    name: "Initial Contact",
    color: "bg-yellow-500",
    deals: [
      { id: "3", title: "Marketing Campaign", company: "RetailCo", amount: "$32,000", days: 12, avatar: "RC", probability: 35 },
    ],
  },
  {
    id: "proposal",
    name: "Proposal",
    color: "bg-purple-500",
    deals: [
      { id: "4", title: "Cloud Migration", company: "EnterpriseTech", amount: "$120,000", days: 5, avatar: "ET", probability: 60 },
      { id: "5", title: "Security Audit", company: "FinanceInc", amount: "$55,000", days: 15, avatar: "FI", probability: 55 },
    ],
  },
  {
    id: "negotiation",
    name: "Negotiation",
    color: "bg-orange-500",
    deals: [
      { id: "6", title: "Infrastructure Setup", company: "DataSys", amount: "$78,000", days: 21, avatar: "DS", probability: 75 },
    ],
  },
  {
    id: "closed",
    name: "Closed Won",
    color: "bg-green-500",
    deals: [
      { id: "7", title: "Analytics Integration", company: "GrowthCo", amount: "$42,000", days: 45, avatar: "GC", probability: 100 },
      { id: "8", title: "API Development", company: "IntegrationHub", amount: "$65,000", days: 60, avatar: "IH", probability: 100 },
    ],
  },
];

function DraggableDeal({ deal, stageColor, onEdit }: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: deal.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-card border rounded-lg p-3 cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between mb-2">
        <p className="text-sm font-medium">{deal.title}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onEdit(deal)}>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Avatar className="w-5 h-5">
          <AvatarFallback>{deal.avatar}</AvatarFallback>
        </Avatar>
        <span className="text-xs">{deal.company}</span>
      </div>

      <div className="text-xs mb-1">{deal.probability}%</div>
      <div className="h-1 bg-muted rounded">
        <div className={`h-full ${stageColor}`} style={{ width: `${deal.probability}%` }} />
      </div>

      <div className="flex justify-between mt-2 text-xs">
        <span>{deal.amount}</span>
        <span>{deal.days}d</span>
      </div>
    </div>
  );
}

function DroppableColumn({ stage, children }: any) {
  const { setNodeRef } = useDroppable({ id: stage.id });

  return (
    <div ref={setNodeRef} className="w-72 shrink-0">
      <div className="bg-muted p-2 rounded mb-2 flex justify-between">
        <span>{stage.name}</span>
        <Badge>{stage.deals.length}</Badge>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export default function DealsPage() {
  const [pipeline, setPipeline] = useState(initialStages);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<any>(null);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    let draggedDeal: any;
    let sourceStageIndex = -1;

    const updated = pipeline.map((stage, index) => {
      const found = stage.deals.find((d) => d.id === active.id);
      if (found) {
        draggedDeal = found;
        sourceStageIndex = index;
        return { ...stage, deals: stage.deals.filter((d) => d.id !== active.id) };
      }
      return stage;
    });

    const targetIndex = updated.findIndex((s) => s.id === over.id);
    if (targetIndex === -1) return;

    updated[targetIndex].deals.push(draggedDeal);
    setPipeline([...updated]);
  };

  return (
    <PageLayout
      title="Deals"
      subtitle="Pipeline"
      actions={
        <Button onClick={() => setIsSheetOpen(true)}>
          <Plus /> New Deal
        </Button>
      }
    >
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {pipeline.map((stage) => (
            <DroppableColumn key={stage.id} stage={stage}>
              {stage.deals.map((deal: any) => (
                <DraggableDeal
                  key={deal.id}
                  deal={deal}
                  stageColor={stage.color}
                  onEdit={(d: any) => {
                    setEditingDeal(d);
                    setIsSheetOpen(true);
                  }}
                />
              ))}

              <Button variant="outline" size="sm" onClick={() => setIsSheetOpen(true)}>
                <Plus /> Add Deal
              </Button>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editingDeal ? "Edit" : "Add"} Deal</SheetTitle>
          </SheetHeader>
          <DealForm
            initialData={editingDeal}
            onSubmit={() => {
              toast.success("Saved");
              setIsSheetOpen(false);
            }}
            onCancel={() => {
              setIsSheetOpen(false);
              setEditingDeal(null);
            }}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
