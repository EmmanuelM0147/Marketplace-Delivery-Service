"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload } from "lucide-react";

const disputeSchema = z.object({
  rideId: z.string().min(1, "Ride ID is required"),
  description: z.string().min(10, "Please provide more details"),
  evidence: z.array(z.instanceof(File))
    .max(5, "Maximum 5 files allowed")
    .optional(),
});

interface DisputeFormProps {
  userId: string;
}

export function DisputeForm({ userId }: DisputeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof disputeSchema>>({
    resolver: zodResolver(disputeSchema),
  });

  async function onSubmit(values: z.infer<typeof disputeSchema>) {
    try {
      setIsSubmitting(true);

      // Upload evidence files
      const evidenceUrls = values.evidence 
        ? await Promise.all(values.evidence.map(uploadEvidence))
        : [];

      // Create dispute
      const response = await fetch("/api/disputes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          evidence: evidenceUrls,
        }),
      });

      if (!response.ok) throw new Error("Failed to create dispute");

      const { dispute } = await response.json();

      toast.success("Dispute submitted successfully");
      router.push(`/disputes/${dispute.id}`);
    } catch (error) {
      console.error("Dispute submission error:", error);
      toast.error("Failed to submit dispute");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function uploadEvidence(file: File): Promise<string> {
    // TODO: Implement file upload to storage
    // For now, return mock URL
    return URL.createObjectURL(file);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rideId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ride ID</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe the Issue</FormLabel>
              <FormControl>
                <Textarea 
                  {...field}
                  placeholder="Please provide details about your dispute..."
                  className="h-32"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="evidence"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Supporting Evidence</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*,video/*,.pdf"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      onChange(files);
                    }}
                    {...field}
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Dispute"}
        </Button>
      </form>
    </Form>
  );
}