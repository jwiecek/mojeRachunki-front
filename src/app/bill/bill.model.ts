import * as moment from 'moment';

export interface Bill {
  _id: string;
  imageBillPath?: string;
  imageProductPath?: string;
  price: string; // do50zł, 50-100zł
  purchaseDate: string;
  purchaseType: string[]; // odzież, narzedzia, agd
  shop: string; // Obi, Zara
  product: string[]; // spodnie, wkrętarka, pralka
  brand: string[]; // Lee, Philips
  warranty: number; // 2 lata
  description?: string; // czerwona bluzka dla siostry
  createdAt: string;
  updatedAt: string;
  expand?: boolean;
  purchaseDay?: number;
  purchaseMonth?: number;
  purchaseYear?: number;
  warrantyEndDate?: string;
}
