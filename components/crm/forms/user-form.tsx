"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "./crm-form-fields";
import { ScrollArea } from "@/components/ui/scroll-area";

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Please select a role"),
  status: z.enum(["active", "inactive"]),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  initialData?: Partial<UserFormValues>;
  onSubmit: (data: UserFormValues) => void;
  onCancel: () => void;
}

export function UserForm({ initialData, onSubmit, onCancel }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      role: initialData?.role || "",
      status: (initialData?.status as any) || "active",
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
              placeholder="e.g. Jane Doe"
            />
            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="jane@example.com"
              type="email"
            />
            <FormSelect
              control={form.control}
              name="role"
              label="Assigned Role"
              placeholder="Select a role"
              options={[
                { label: "Admin", value: "Admin" },
                { label: "Sales Manager", value: "Sales Manager" },
                { label: "Sales Executive", value: "Sales Executive" },
                { label: "Support Agent", value: "Support Agent" },
              ]}
            />
            <FormSelect
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
            />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2 mt-auto">
          <Button type="submit" className="flex-1">
            {initialData ? "Save Changes" : "Create User"}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
