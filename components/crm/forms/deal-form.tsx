"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "./crm-form-fields";
import { ScrollArea } from "@/components/ui/scroll-area";

const dealSchema = z.object({
  title: z.string().min(2, "Deal title must be at least 2 characters"),
  company: z.string().min(2, "Company name is required"),
  amount: z.string().min(1, "Amount is required"),
  stage: z.enum([
    "prospecting",
    "contact",
    "proposal",
    "negotiation",
    "closed",
  ]),
  probability: z.string().optional(),
});

type DealFormValues = z.infer<typeof dealSchema>;

interface DealFormProps {
  initialData?: Partial<DealFormValues>;
  onSubmit: (data: DealFormValues) => void;
  onCancel: () => void;
}

export function DealForm({ initialData, onSubmit, onCancel }: DealFormProps) {
  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: initialData?.title || "",
      company: initialData?.company || "",
      amount: initialData?.amount || "",
      stage: initialData?.stage || "prospecting",
      probability: initialData?.probability || "20",
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
              label="Deal Title"
              placeholder="e.g. Software License"
            />
            <FormInput
              control={form.control}
              name="company"
              label="Account/Company"
              placeholder="Search accounts..."
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="amount"
                label="Deal Value"
                placeholder="$0.00"
              />
              <FormInput
                control={form.control}
                name="probability"
                label="Probability (%)"
                placeholder="20"
                type="number"
              />
            </div>
            <FormSelect
              control={form.control}
              name="stage"
              label="Pipeline Stage"
              placeholder="Select stage"
              options={[
                { label: "Prospecting", value: "prospecting" },
                { label: "Initial Contact", value: "contact" },
                { label: "Proposal", value: "proposal" },
                { label: "Negotiation", value: "negotiation" },
                { label: "Closed Won", value: "closed" },
              ]}
            />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Button type="submit" className="flex-1">
            Save Deal
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
