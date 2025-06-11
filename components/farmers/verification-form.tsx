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
import { toast } from "sonner";
import { Upload } from "lucide-react";

const verificationSchema = z.object({
  businessLicense: z.instanceof(File)
    .refine((file) => file.size <= 5000000, 'File size must be less than 5MB')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      'File must be PDF, JPEG, or PNG'
    ),
  identityDocument: z.instanceof(File)
    .refine((file) => file.size <= 5000000, 'File size must be less than 5MB')
    .refine(
      (file) => ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
      'File must be PDF, JPEG, or PNG'
    ),
});

export function VerificationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
  });

  async function onSubmit(values: z.infer<typeof verificationSchema>) {
    try {
      setIsSubmitting(true);

      // Upload files to storage
      const documents = await Promise.all([
        uploadDocument(values.businessLicense, 'business-license'),
        uploadDocument(values.identityDocument, 'identity-document'),
      ]);

      // Submit verification request
      const response = await fetch('/api/farmers/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documents }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit verification');
      }

      toast.success('Verification documents submitted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to submit verification documents');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function uploadDocument(file: File, type: string) {
    // TODO: Implement file upload to storage
    // For now, return mock data
    return {
      type,
      url: URL.createObjectURL(file),
    };
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="businessLicense"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Business License</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
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

        <FormField
          control={form.control}
          name="identityDocument"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Identity Document</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
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
          {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
        </Button>
      </form>
    </Form>
  );
}