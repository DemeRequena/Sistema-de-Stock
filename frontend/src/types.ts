export type Role = 'ADMIN' | 'USER';

export type Product = {
  id: number;
  name: string;
  description?: string | null;
  sku: string;
  stockActual: number;
  stockMinimo: number;
  active: boolean;
  createdAt: string;
};

export type StockMovement = {
  id: number;
  type: 'IN' | 'OUT';
  quantity: number;
  createdAt: string;
  product: { id: number; name: string; sku: string };
  user: { id: number; email: string; role: Role };
};
