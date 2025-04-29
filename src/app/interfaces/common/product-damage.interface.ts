import {Product} from './product.interface';


export interface ProductDamage {
  _id: string;
  product?: Product;
  quantity: number;
  dateString?: string;
  updateTime?: string;
  salesman?: string;
  month?: number;
  year?: number;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}


export interface ProductPurchaseGroup {
  _id?: string;
  data: [ProductDamage];
  select?: boolean;
}
