"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormInput, FormSelect, FormTextarea } from "./crm-form-fields";

const eventSchema = z.object({
  title: z.string().min(2, "Title is required"),
  type: z.enum(["call", "meeting", "demo", "internal"]),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.string().optional(),
  attendees: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  initialData?: Partial<EventFormValues>;
  onSubmit: (data: EventFormValues) => void;
  onCancel: () => void;
}

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || "",
      type: initialData?.type || "meeting",
      date: initialData?.date || "",
      time: initialData?.time || "",
      duration: initialData?.duration || "1h",
      attendees: initialData?.attendees || "",
      location: initialData?.location || "",
      notes: initialData?.notes || "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-4">
            <FormInput
              control={form.control}
              name="title"
              label="Event Title"
              placeholder="e.g. Discovery Call - Acme"
            />
            <FormSelect
              control={form.control}
              name="type"
              label="Event Type"
              placeholder="Select type"
              options={[
                { label: "Call", value: "call" },
                { label: "Meeting", value: "meeting" },
                { label: "Demo", value: "demo" },
                { label: "Internal", value: "internal" },
              ]}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="date"
                label="Date"
                placeholder="YYYY-MM-DD"
                type="date"
              />
              <FormInput
                control={form.control}
                name="time"
                label="Time"
                placeholder="HH:MM"
                type="time"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                control={form.control}
                name="duration"
                label="Duration"
                placeholder="Select duration"
                options={[
                  { label: "15 minutes", value: "15m" },
                  { label: "30 minutes", value: "30m" },
                  { label: "45 minutes", value: "45m" },
                  { label: "1 hour", value: "1h" },
                  { label: "1.5 hours", value: "1.5h" },
                  { label: "2 hours", value: "2h" },
                ]}
              />
              <FormInput
                control={form.control}
                name="attendees"
                label="Attendees"
                placeholder="Names or emails"
              />
            </div>
            <FormInput
              control={form.control}
              name="location"
              label="Location / Link"
              placeholder="Conference room or Zoom link"
            />
            <FormTextarea
              control={form.control}
              name="notes"
              label="Notes"
              placeholder="Agenda or meeting notes..."
            />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Button type="submit" className="flex-1">
            Create Event
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
