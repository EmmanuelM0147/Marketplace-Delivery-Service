"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash, Upload } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  unit: z.string().min(1, "Please select a unit"),
  quantity: z.number().int().positive("Quantity must be positive"),
  images: z.array(z.instanceof(File))
    .min(3, "At least 3 images are required")
    .max(10, "Maximum 10 images allowed"),
  certifications: z.array(
    z.object({
      type: z.string().min(1, "Certification type is required"),
      number: z.string().min(1, "Certificate number is required"),
      issueDate: z.string().min(1, "Issue date is required"),
      expiryDate: z.string().optional(),
    })
  ),
});

export function ProductUpload() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      certifications: [{ type: "", number: "", issueDate: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  async function onSubmit(values: z.infer<typeof productSchema>) {
    try {
      setIsSubmitting(true);

      // Upload images
      const imageUrls = await Promise.all(
        values.images.map((file) => uploadImage(file))
      );

      // Create product
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          images: imageUrls,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      toast.success("Product created successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Product creation error:", error);
      toast.error("Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function uploadImage(file: File) {
    // TODO: Implement image upload to storage
    // For now, return mock URL
    return URL.createObjectURL(file);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="livestock">Livestock</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="l">Liter (L)</SelectItem>
                    <SelectItem value="piece">Piece</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity Available</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormControl>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept="image/*"
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Certifications</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ type: "", number: "", issueDate: "" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <FormField
                control={form.control}
                name={`certifications.${index}.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certification Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`certifications.${index}.number`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`certifications.${index}.issueDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`certifications.${index}.expiryDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Product..." : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}