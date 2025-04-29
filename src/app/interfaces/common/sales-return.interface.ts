import {Admin} from '../admin/admin';
import {Product} from './product.interface';
import {Customer} from './customer.interface';


export interface SalesReturn {
  _id?: string;
  salesman?: Admin;
  products?: Product[];
  returnDate?: Date;
  returnDateString?: string;
  subTotal?: number;
  charge?: number;
  invoiceNo?: string;
  note?: string;
  totalPurchasePrice?: number;
  grandTotal?: number;
  month?: number;
  year?: number;
  customer?: Customer,
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  calculation?: SaleReturnCalculation;
}


export interface SaleReturnCalculation {
  grandTotal: number;
}


export interface SaleReturnGroup {
  _id: string;
  data: SalesReturn[];
  select?: boolean;
}
