"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "./crm-form-fields";
import { ScrollArea } from "@/components/ui/scroll-area";

const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company must be at least 2 characters"),
  status: z.enum([
    "new",
    "contacted",
    "qualified",
    "proposal",
    "negotiation",
    "converted",
  ]),
  value: z.string().optional(),
  phone: z.string().optional(),
  source: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialData?: Partial<LeadFormValues>;
  onSubmit: (data: LeadFormValues) => void;
  onCancel: () => void;
}

export function LeadForm({ initialData, onSubmit, onCancel }: LeadFormProps) {
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      company: initialData?.company || "",
      status: initialData?.status || "new",
      value: initialData?.value || "",
      phone: initialData?.phone || "",
      source: initialData?.source || "",
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
              label="Full Name"
              placeholder="e.g. John Doe"
            />
            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="john@example.com"
              type="email"
            />
            <FormInput
              control={form.control}
              name="company"
              label="Company"
              placeholder="Acme Corp"
            />
            <FormInput
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                control={form.control}
                name="status"
                label="Status"
                placeholder="Select status"
                options={[
                  { label: "New", value: "new" },
                  { label: "Contacted", value: "contacted" },
                  { label: "Qualified", value: "qualified" },
                  { label: "Proposal", value: "proposal" },
                  { label: "Negotiation", value: "negotiation" },
                ]}
              />
              <FormInput
                control={form.control}
                name="value"
                label="Expected Value"
                placeholder="$0.00"
              />
            </div>
            <FormInput
              control={form.control}
              name="source"
              label="Lead Source"
              placeholder="e.g. LinkedIn, Website"
            />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Button type="submit" className="flex-1">
            Save Lead
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
