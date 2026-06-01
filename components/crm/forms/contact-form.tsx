"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "./crm-form-fields";
import { ScrollArea } from "@/components/ui/scroll-area";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.string().optional(),
  tag: z.enum(["Customer", "Prospect", "Lead"]),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactFormProps {
  initialData?: Partial<ContactFormValues>;
  onSubmit: (data: ContactFormValues) => void;
  onCancel: () => void;
}

export function ContactForm({
  initialData,
  onSubmit,
  onCancel,
}: ContactFormProps) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      company: initialData?.company || "",
      role: initialData?.role || "",
      tag: initialData?.tag || "Prospect",
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
              placeholder="e.g. Jane Smith"
            />
            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="jane@example.com"
              type="email"
            />
            <FormInput
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
            />
            <FormInput
              control={form.control}
              name="company"
              label="Company"
              placeholder="InnovateTech"
            />
            <FormInput
              control={form.control}
              name="role"
              label="Job Title"
              placeholder="CEO, Manager, etc."
            />
            <FormSelect
              control={form.control}
              name="tag"
              label="Contact Type"
              placeholder="Select type"
              options={[
                { label: "Customer", value: "Customer" },
                { label: "Prospect", value: "Prospect" },
                { label: "Lead", value: "Lead" },
              ]}
            />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Button type="submit" className="flex-1">
            Save Contact
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
