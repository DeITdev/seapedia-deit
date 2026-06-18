// All money is Indonesian Rupiah (IDR) stored as integers — no floating-point
// currency math. See context/knowledge.md.

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** Format an integer rupiah amount as e.g. `Rp1.250.000`. */
export function formatIDR(amount: number): string {
  return idrFormatter.format(Math.round(amount));
}

/** Round to the nearest whole rupiah (round half up). */
export function roundRupiah(amount: number): number {
  return Math.round(amount);
}
