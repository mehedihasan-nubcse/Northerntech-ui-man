import {Product} from './product.interface';


export interface ProductPurchase {
  colors: any;
  sizes: any;
  _id: string;
  product?: Product;
  previousQuantity: number;
  updatedQuantity: number;
  dateString: string;
  createdAtString: string;
  updatedAtString: string;
  createTime: string;
  salesman?: string;
  note?: string;
  month: number;
  year: number;
  select?: boolean;
}


export  interface  ProductPurchaseGroup{
  _id?: string;
  data: [ProductPurchase];
  select?: boolean;
}
