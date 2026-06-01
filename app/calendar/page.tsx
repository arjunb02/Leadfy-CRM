"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Video,
  Phone,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageLayout } from "@/components/crm/page-layout";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EventForm } from "@/components/crm/forms/event-form";
import { toast } from "sonner";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const events = [
  {
    day: 11,
    title: "Discovery Call - Acme",
    time: "10:00 AM",
    type: "call",
    color: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
  {
    day: 11,
    title: "Proposal Review",
    time: "2:00 PM",
    type: "meeting",
    color:
      "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
  },
  {
    day: 13,
    title: "Demo - TechStartup",
    time: "11:00 AM",
    type: "demo",
    color:
      "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
  },
  {
    day: 14,
    title: "Follow-up: FinTech",
    time: "3:30 PM",
    type: "call",
    color: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
  {
    day: 17,
    title: "Team Standup",
    time: "9:00 AM",
    type: "internal",
    color: "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30",
  },
  {
    day: 20,
    title: "Negotiation - DataSys",
    time: "1:00 PM",
    type: "meeting",
    color:
      "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30",
  },
  {
    day: 25,
    title: "QBR Presentation",
    time: "10:00 AM",
    type: "demo",
    color:
      "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30",
  },
];

const upcomingEvents = [
  {
    title: "Discovery Call - Acme Corp",
    time: "Today, 10:00 AM",
    type: "call",
    duration: "30 min",
    attendees: 2,
  },
  {
    title: "Proposal Review Meeting",
    time: "Today, 2:00 PM",
    type: "meeting",
    duration: "1 hour",
    attendees: 4,
  },
  {
    title: "Product Demo - TechStartup",
    time: "Mar 13, 11:00 AM",
    type: "demo",
    duration: "45 min",
    attendees: 3,
  },
  {
    title: "Follow-up Call - FinTech",
    time: "Mar 14, 3:30 PM",
    type: "call",
    duration: "20 min",
    attendees: 2,
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  call: <Phone className="w-4 h-4" />,
  meeting: <Users className="w-4 h-4" />,
  demo: <Video className="w-4 h-4" />,
  internal: <Users className="w-4 h-4" />,
};

export default function CalendarPage() {
  const [currentDate] = useState(new Date(2026, 2, 1));
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const getEvents = (day: number) => events.filter((e) => e.day === day);

  const handleDayClick = (day: number | null) => {
    if (day) {
      setSelectedDay(day);
      setIsSheetOpen(true);
    }
  };

  const handleSubmit = (data: any) => {
    console.log("Event created:", data);
    toast.success("Event created successfully");
    setIsSheetOpen(false);
    setSelectedDay(null);
  };

  return (
    <PageLayout
      title="Calendar"
      subtitle="Schedule and manage your meetings"
      actions={
        <Button
          size="sm"
          className="gap-2"
          onClick={() => {
            setSelectedDay(null);
            setIsSheetOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> New Event
        </Button>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="xl:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {MONTHS[month]} {year}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-semibold text-muted-foreground py-2"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden border border-border">
                {cells.map((day, i) => {
                  const dayEvents = day ? getEvents(day) : [];
                  const isToday = day === 11;
                  return (
                    <div
                      key={i}
                      onClick={() => handleDayClick(day)}
                      className={`bg-card min-h-[60px] sm:min-h-[80px] p-1 sm:p-1.5 ${day ? "hover:bg-muted/50 cursor-pointer" : ""}`}
                    >
                      {day && (
                        <>
                          <span
                            className={`text-xs sm:text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? "bg-primary text-primary-foreground" : "text-foreground"}`}
                          >
                            {day}
                          </span>
                          <div className="space-y-0.5">
                            {dayEvents.slice(0, 2).map((ev, ei) => (
                              <div
                                key={ei}
                                className={`text-xs px-1 py-0.5 rounded border truncate hidden sm:block ${ev.color}`}
                              >
                                {ev.title}
                              </div>
                            ))}
                            {dayEvents.length > 0 && (
                              <div
                                className={`sm:hidden w-2 h-2 rounded-full ${dayEvents[0].color.split(" ")[0].replace("/20", "")}`}
                              />
                            )}
                            {dayEvents.length > 2 && (
                              <p className="text-xs text-muted-foreground hidden sm:block">
                                +{dayEvents.length - 2} more
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((ev, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="text-muted-foreground mt-0.5 shrink-0">
                      {typeIcons[ev.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ev.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ev.time}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ev.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {ev.attendees}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { type: "Call", color: "bg-blue-500", count: 2 },
                  { type: "Meeting", color: "bg-purple-500", count: 2 },
                  { type: "Demo", color: "bg-green-500", count: 2 },
                  { type: "Internal", color: "bg-gray-500", count: 1 },
                ].map((t) => (
                  <div
                    key={t.type}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${t.color}`} />
                      <span className="text-sm">{t.type}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {t.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Event Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="p-0 sm:max-w-md">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>
              New Event {selectedDay ? `— March ${selectedDay}` : ""}
            </SheetTitle>
          </SheetHeader>
          <EventForm
            initialData={
              selectedDay
                ? { date: `2026-03-${String(selectedDay).padStart(2, "0")}` }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </PageLayout>
  );
}
