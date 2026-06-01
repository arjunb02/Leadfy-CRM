"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "./crm-form-fields";
import { ScrollArea } from "@/components/ui/scroll-area";

const accountSchema = z.object({
  name: z.string().min(2, "Account name must be at least 2 characters"),
  industry: z.string().min(2, "Industry is required"),
  size: z.enum(["SMB", "Mid-Market", "Enterprise"]),
  location: z.string().optional(),
  website: z.string().optional(),
  status: z.enum(["Active", "At Risk", "Inactive"]),
});

type AccountFormValues = z.infer<typeof accountSchema>;

interface AccountFormProps {
  initialData?: Partial<AccountFormValues>;
  onSubmit: (data: AccountFormValues) => void;
  onCancel: () => void;
}

export function AccountForm({
  initialData,
  onSubmit,
  onCancel,
}: AccountFormProps) {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: initialData?.name || "",
      industry: initialData?.industry || "",
      size: initialData?.size || "SMB",
      location: initialData?.location || "",
      website: initialData?.website || "",
      status: initialData?.status || "Active",
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
              label="Company Name"
              placeholder="e.g. Global Ventures"
            />
            <FormInput
              control={form.control}
              name="industry"
              label="Industry"
              placeholder="Technology, Healthcare, etc."
            />
            <FormSelect
              control={form.control}
              name="size"
              label="Company Size"
              placeholder="Select size"
              options={[
                { label: "SMB (1-50)", value: "SMB" },
                { label: "Mid-Market (51-500)", value: "Mid-Market" },
                { label: "Enterprise (501+)", value: "Enterprise" },
              ]}
            />
            <FormInput
              control={form.control}
              name="location"
              label="Location"
              placeholder="San Francisco, CA"
            />
            <FormInput
              control={form.control}
              name="website"
              label="Website"
              placeholder="https://..."
            />
            <FormSelect
              control={form.control}
              name="status"
              label="Account Status"
              placeholder="Select status"
              options={[
                { label: "Active", value: "Active" },
                { label: "At Risk", value: "At Risk" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Button type="submit" className="flex-1">
            Save Account
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
