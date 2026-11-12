type Order = {
  id: number;
  storeId: number;
  storeName: string;
  status: OrderStatus;
  paymentMethod: "COD" | "CARD";
  delayed: boolean;
  total: number;
  createdAt: string;
  closedAt: string | null;
  items: {
    productId: number;
    name: string;
    imageUrl: string;
    quantity: number;
    unitPrice: number;
  }[];
};

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "REFUSED"
  | "REJECTED"
  | "CANCELLED";

type StoreOrder = {
  id: number;
  customerLabel: string;
  status: OrderStatus;
  paymentMethod: "COD" | "CARD";
  delayed: boolean;
  scoreAtOrder: number | null;
  total: number;
  createdAt: string;
  closedAt: string | null;
  items: {
    productId: number;
    name: string;
    imageUrl: string;
    quantity: number;
    unitPrice: number;
  }[];
};
