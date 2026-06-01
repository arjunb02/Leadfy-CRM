"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormInput, FormSelect, FormTextarea } from "./crm-form-fields";

const ticketSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  customer: z.string().min(2, "Customer name is required"),
  priority: z.enum(["critical", "high", "medium", "low"]),
  category: z.enum(["Technical", "Bug", "Feature", "Billing", "Account"]),
  assignee: z.string().optional(),
  description: z.string().min(10, "Please provide a description"),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

interface TicketFormProps {
  initialData?: Partial<TicketFormValues>;
  onSubmit: (data: TicketFormValues) => void;
  onCancel: () => void;
}

export function TicketForm({
  initialData,
  onSubmit,
  onCancel,
}: TicketFormProps) {
  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: initialData?.title || "",
      customer: initialData?.customer || "",
      priority: initialData?.priority || "medium",
      category: initialData?.category || "Technical",
      assignee: initialData?.assignee || "",
      description: initialData?.description || "",
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
              label="Issue Title"
              placeholder="e.g. Unable to export data in CSV"
            />
            <FormInput
              control={form.control}
              name="customer"
              label="Customer / Company"
              placeholder="Acme Corp"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                control={form.control}
                name="priority"
                label="Priority"
                placeholder="Select priority"
                options={[
                  { label: "Critical", value: "critical" },
                  { label: "High", value: "high" },
                  { label: "Medium", value: "medium" },
                  { label: "Low", value: "low" },
                ]}
              />
              <FormSelect
                control={form.control}
                name="category"
                label="Category"
                placeholder="Select category"
                options={[
                  { label: "Technical", value: "Technical" },
                  { label: "Bug", value: "Bug" },
                  { label: "Feature Request", value: "Feature" },
                  { label: "Billing", value: "Billing" },
                  { label: "Account", value: "Account" },
                ]}
              />
            </div>
            <FormInput
              control={form.control}
              name="assignee"
              label="Assign To"
              placeholder="Agent name (optional)"
            />
            <FormTextarea
              control={form.control}
              name="description"
              label="Description"
              placeholder="Describe the issue in detail — steps to reproduce, expected vs actual behavior..."
            />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Button type="submit" className="flex-1">
            Create Ticket
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
