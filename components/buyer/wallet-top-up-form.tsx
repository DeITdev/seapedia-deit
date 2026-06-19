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
import { topUpSchema, type TopUpInput } from "@/lib/validation/wallet";

const PRESET_AMOUNTS = [50_000, 100_000, 250_000, 500_000];

export function WalletTopUpForm() {
  const router = useRouter();

  const form = useForm<TopUpInput>({
    resolver: zodResolver(topUpSchema),
    defaultValues: { amount: 100_000 },
  });

  async function onSubmit(values: TopUpInput) {
    const res = await fetch("/api/buyer/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data?.error ?? "Top-up failed.");
      return;
    }

    toast.success("Wallet topped up successfully.");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {PRESET_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => form.setValue("amount", amount, { shouldValidate: true })}
            >
              Rp{amount.toLocaleString("id-ID")}
            </Button>
          ))}
        </div>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (IDR)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={10_000}
                  step={1000}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Processing…" : "Top up wallet"}
        </Button>
      </form>
    </Form>
  );
}
