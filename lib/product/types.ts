export interface PublicProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  store: { id: string; name: string };
}

export interface SellerProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
