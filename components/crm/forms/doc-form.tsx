"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormInput, FormSelect, FormTextarea } from "./crm-form-fields";

const docSchema = z.object({
  name: z.string().min(2, "Document name is required"),
  category: z.enum([
    "Proposal",
    "Contract",
    "Report",
    "Presentation",
    "Legal",
    "Marketing",
  ]),
  folder: z.string().optional(),
  related: z.string().optional(),
  description: z.string().optional(),
});

type DocFormValues = z.infer<typeof docSchema>;

interface DocFormProps {
  initialData?: Partial<DocFormValues>;
  onSubmit: (data: DocFormValues) => void;
  onCancel: () => void;
}

export function DocForm({ initialData, onSubmit, onCancel }: DocFormProps) {
  const form = useForm<DocFormValues>({
    resolver: zodResolver(docSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "Proposal",
      folder: initialData?.folder || "",
      related: initialData?.related || "",
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
              name="name"
              label="Document Name"
              placeholder="e.g. Acme Corp - Proposal v3"
            />
            <FormSelect
              control={form.control}
              name="category"
              label="Category"
              placeholder="Select category"
              options={[
                { label: "Proposal", value: "Proposal" },
                { label: "Contract", value: "Contract" },
                { label: "Report", value: "Report" },
                { label: "Presentation", value: "Presentation" },
                { label: "Legal", value: "Legal" },
                { label: "Marketing", value: "Marketing" },
              ]}
            />
            <FormSelect
              control={form.control}
              name="folder"
              label="Folder"
              placeholder="Select folder (optional)"
              options={[
                { label: "Proposals", value: "Proposals" },
                { label: "Contracts", value: "Contracts" },
                { label: "Reports", value: "Reports" },
                { label: "Templates", value: "Templates" },
              ]}
            />
            <FormInput
              control={form.control}
              name="related"
              label="Related To"
              placeholder="Account, Deal, or Contact name"
            />
            <FormTextarea
              control={form.control}
              name="description"
              label="Description"
              placeholder="Brief description of this document..."
            />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Button type="submit" className="flex-1">
            Create Document
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
