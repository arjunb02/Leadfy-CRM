"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormInput, FormSelect, FormTextarea } from "./crm-form-fields";

const automationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  trigger: z.string().min(1, "Trigger is required"),
  action: z.string().min(1, "Action is required"),
  category: z.enum([
    "Email",
    "Tasks",
    "Notifications",
    "Scoring",
    "Assignment",
  ]),
});

type AutomationFormValues = z.infer<typeof automationSchema>;

interface AutomationFormProps {
  initialData?: Partial<AutomationFormValues>;
  onSubmit: (data: AutomationFormValues) => void;
  onCancel: () => void;
}

export function AutomationForm({
  initialData,
  onSubmit,
  onCancel,
}: AutomationFormProps) {
  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      trigger: initialData?.trigger || "",
      action: initialData?.action || "",
      category: initialData?.category || "Email",
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
              name="name"
              label="Automation Name"
              placeholder="e.g. New Lead Welcome Email"
            />
            <FormTextarea
              control={form.control}
              name="description"
              label="Description"
              placeholder="What does this automation do?"
            />
            <FormSelect
              control={form.control}
              name="category"
              label="Category"
              placeholder="Select category"
              options={[
                { label: "Email", value: "Email" },
                { label: "Tasks", value: "Tasks" },
                { label: "Notifications", value: "Notifications" },
                { label: "Scoring", value: "Scoring" },
                { label: "Assignment", value: "Assignment" },
              ]}
            />
            <div className="rounded-lg border border-dashed border-border p-4 space-y-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Workflow
              </p>
              <FormSelect
                control={form.control}
                name="trigger"
                label="When (Trigger)"
                placeholder="Select trigger event"
                options={[
                  { label: "Lead Created", value: "Lead Created" },
                  { label: "Deal Stage Changed", value: "Deal Stage Changed" },
                  { label: "Deal Won", value: "Deal Won" },
                  { label: "Deal Lost", value: "Deal Lost" },
                  { label: "No Activity (7 days)", value: "No Activity (7d)" },
                  { label: "Email Opened", value: "Email Opened" },
                  { label: "Form Submitted", value: "Form Submitted" },
                  { label: "Ticket Created", value: "Ticket Created" },
                ]}
              />
              <FormSelect
                control={form.control}
                name="action"
                label="Then Do (Action)"
                placeholder="Select action"
                options={[
                  { label: "Send Email", value: "Send Email" },
                  { label: "Create Task", value: "Create Task" },
                  { label: "Send Notification", value: "Send Notification" },
                  { label: "Update Lead Score", value: "Update Lead Score" },
                  {
                    label: "Assign to Team Member",
                    value: "Assign to Team Member",
                  },
                  { label: "Add to Sequence", value: "Add to Sequence" },
                  { label: "Create Deal", value: "Create Deal" },
                ]}
              />
            </div>
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Button type="submit" className="flex-1">
            Create Automation
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
