import { Separator } from "@/components/ui/separator";
import type { CheckoutSummary } from "@/lib/checkout/calculate";
import { DELIVERY_METHOD_LABELS } from "@/lib/constants/delivery";
import { formatIDR } from "@/lib/money";

export function CheckoutSummaryCard({
  summary,
  walletBalance,
  canCheckout,
  showWallet = true,
}: {
  summary: CheckoutSummary;
  walletBalance: number;
  canCheckout: boolean;
  showWallet?: boolean;
}) {
  const hasSplitDiscount =
    summary.voucherDiscount > 0 || summary.promoDiscount > 0;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatIDR(summary.subtotal)}</span>
      </div>

      {hasSplitDiscount ? (
        <>
          {summary.voucherDiscount > 0 && (
            <div className="flex justify-between text-success">
              <span>
                Voucher
                {summary.voucherCode ? ` (${summary.voucherCode})` : ""}
              </span>
              <span>−{formatIDR(summary.voucherDiscount)}</span>
            </div>
          )}
          {summary.promoDiscount > 0 && (
            <div className="flex justify-between text-success">
              <span>
                Promo
                {summary.promoCode ? ` (${summary.promoCode})` : ""}
              </span>
              <span>−{formatIDR(summary.promoDiscount)}</span>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-between">
          <span className="text-muted-foreground">Discount</span>
          <span>{formatIDR(summary.discount)}</span>
        </div>
      )}

      <div className="flex justify-between">
        <span className="text-muted-foreground">
          Delivery ({DELIVERY_METHOD_LABELS[summary.deliveryMethod]})
        </span>
        <span>{formatIDR(summary.deliveryFee)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-muted-foreground">PPN 12%</span>
        <span>{formatIDR(summary.ppn)}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Final total</span>
        <span>{formatIDR(summary.finalTotal)}</span>
      </div>
      {showWallet && (
        <>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Wallet balance</span>
            <span className={canCheckout ? "text-success" : "text-destructive"}>
              {formatIDR(walletBalance)}
            </span>
          </div>
          {!canCheckout && (
            <p className="text-destructive text-xs">
              Insufficient balance. Top up your wallet before checkout.
            </p>
          )}
        </>
      )}
    </div>
  );
}
