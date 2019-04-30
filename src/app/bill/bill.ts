export class Bill {
  id: string;
  imageBillPath?: string;
  imageProductPath?: string;
  price: string;
  purchaseDate: string;
  purchaseType: string[];
  shop: string;
  product: string[];
  brand: string[];
  warranty: number;
  description?: string;
  createdAt: string;
  updatedAt: string;

  constructor(
    id: string,
    imageBillPath: string,
    imageProductPath: string,
    price: string,
    purchaseDate: string,
    purchaseType: string[],
    shop: string,
    product: string[],
    brand: string[],
    warranty: number,
    description: string,
    createdAt: string,
    updatedAt: string
  ) {
    this.id = id;
    this.imageBillPath = imageBillPath;
    this.imageProductPath = imageProductPath;
    this.price = price;
    this.purchaseDate = purchaseDate;
    this.purchaseType = purchaseType;
    this.shop = shop;
    this.product = product;
    this.brand = brand;
    this.warranty = warranty;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
