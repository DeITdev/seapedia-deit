"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { storeSchema, type StoreInput } from "@/lib/validation/store";

export function StoreForm({ defaultName = "" }: { defaultName?: string }) {
  const router = useRouter();

  const form = useForm<StoreInput>({
    resolver: zodResolver(storeSchema),
    defaultValues: { name: defaultName },
  });

  async function onSubmit(values: StoreInput) {
    const res = await fetch("/api/seller/store", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 409) {
        form.setError("name", { message: data?.error ?? "Store name is already taken." });
        return;
      }
      toast.error(data?.error ?? "Could not save store.");
      return;
    }

    toast.success(defaultName ? "Store updated." : "Store created.");
    router.push("/seller");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store name</FormLabel>
              <FormControl>
                <Input placeholder="Your unique store name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Saving…"
            : defaultName
              ? "Update store"
              : "Create store"}
        </Button>
      </form>
    </Form>
  );
}
