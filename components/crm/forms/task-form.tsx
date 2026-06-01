"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput, FormSelect } from "./crm-form-fields";
import { ScrollArea } from "@/components/ui/scroll-area";

const taskSchema = z.object({
  title: z.string().min(2, "Task title must be at least 2 characters"),
  due: z.string().min(1, "Due date is required"),
  priority: z.enum(["high", "medium", "low"]),
  related: z.string().optional(),
  category: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Partial<TaskFormValues>;
  onSubmit: (data: TaskFormValues) => void;
  onCancel: () => void;
}

export function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: initialData?.title || "",
      due: initialData?.due || "",
      priority: initialData?.priority || "medium",
      related: initialData?.related || "",
      category: initialData?.category || "Task",
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
              label="Task Title"
              placeholder="e.g. Call back Sarah"
            />
            <FormInput
              control={form.control}
              name="due"
              label="Due Date"
              placeholder="Select date or type e.g. Tomorrow"
            />
            <FormSelect
              control={form.control}
              name="priority"
              label="Priority"
              placeholder="Select priority"
              options={[
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },
              ]}
            />
            <FormInput
              control={form.control}
              name="related"
              label="Related To"
              placeholder="Account, Deal, or Lead"
            />
            <FormInput
              control={form.control}
              name="category"
              label="Category"
              placeholder="e.g. Call, Meeting, Email"
            />
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex gap-2">
          <Button type="submit" className="flex-1">
            Save Task
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
