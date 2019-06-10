export interface Bill {
  _id: string;
  imageBillPath?: string;
  imageProductPath?: string;
  price: number;
  purchaseDate: string;
  purchaseType: string[];
  shop: string;
  product: string[];
  brand: string[];
  warranty: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  expand?: boolean;
  purchaseDay?: number;
  purchaseMonth?: number;
  purchaseYear?: number;
  warrantyEndDate?: string;
  createdById: string;
  updatedById?: string;
  selected?: boolean;
}
