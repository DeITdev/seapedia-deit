"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ProcessOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function handleProcess() {
    setLoading(true);
    const res = await fetch(`/api/seller/orders/${orderId}/process`, {
      method: "POST",
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data?.error ?? "Failed to process order.");
      return;
    }

    toast.success("Order processed — waiting for driver pickup.");
    router.refresh();
  }

  return (
    <Button className="w-full" disabled={loading} onClick={handleProcess}>
      {loading ? "Processing…" : "Process order"}
    </Button>
  );
}
