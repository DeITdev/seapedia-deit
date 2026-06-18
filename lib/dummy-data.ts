// Dummy catalog data for Level 1. Real products backed by Seller stores arrive
// in Level 2. Prices are integer rupiah (IDR).

export interface DummyProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  store: string;
  category: string;
  stock: number;
}

export const DUMMY_PRODUCTS: DummyProduct[] = [
  {
    id: "kopi-arabika-gayo",
    name: "Kopi Arabika Gayo 250g",
    description:
      "Single-origin Arabica beans from the Gayo highlands. Medium roast with notes of brown sugar and citrus.",
    price: 85000,
    store: "Rumah Kopi Nusantara",
    category: "Food & Beverage",
    stock: 42,
  },
  {
    id: "batik-tulis-pekalongan",
    name: "Batik Tulis Pekalongan",
    description:
      "Hand-drawn batik fabric, 2 meters. Traditional motifs created by master artisans in Pekalongan.",
    price: 320000,
    store: "Warisan Batik",
    category: "Fashion",
    stock: 12,
  },
  {
    id: "headphone-wireless-x1",
    name: "Wireless Headphone X1",
    description:
      "Over-ear Bluetooth headphone with 40-hour battery life and active noise cancellation.",
    price: 749000,
    store: "Gadget Corner",
    category: "Electronics",
    stock: 25,
  },
  {
    id: "tas-rotan-handmade",
    name: "Tas Rotan Handmade",
    description:
      "Eco-friendly woven rattan bag, handcrafted in Bali. Spacious and lightweight for daily use.",
    price: 195000,
    store: "Warisan Batik",
    category: "Fashion",
    stock: 30,
  },
  {
    id: "matcha-premium-100g",
    name: "Premium Matcha Powder 100g",
    description:
      "Ceremonial-grade matcha, stone-ground and vibrant green. Perfect for lattes and baking.",
    price: 130000,
    store: "Rumah Kopi Nusantara",
    category: "Food & Beverage",
    stock: 60,
  },
  {
    id: "mechanical-keyboard-65",
    name: "Mechanical Keyboard 65%",
    description:
      "Compact hot-swappable mechanical keyboard with PBT keycaps and tactile switches.",
    price: 899000,
    store: "Gadget Corner",
    category: "Electronics",
    stock: 18,
  },
  {
    id: "madu-hutan-liar",
    name: "Madu Hutan Liar 500ml",
    description:
      "Raw wild forest honey harvested sustainably. Unprocessed with a rich, floral aroma.",
    price: 110000,
    store: "Tani Sehat",
    category: "Food & Beverage",
    stock: 50,
  },
  {
    id: "sepatu-kanvas-lokal",
    name: "Sepatu Kanvas Lokal",
    description:
      "Locally produced canvas sneakers with a durable rubber sole. Comfortable for everyday wear.",
    price: 275000,
    store: "Langkah Lokal",
    category: "Fashion",
    stock: 40,
  },
];

export function getDummyProducts(): DummyProduct[] {
  return DUMMY_PRODUCTS;
}

export function getDummyProduct(id: string): DummyProduct | undefined {
  return DUMMY_PRODUCTS.find((p) => p.id === id);
}
