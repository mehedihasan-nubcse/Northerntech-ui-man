import {Customer} from './customer.interface';
import {Admin} from '../admin/admin';

export interface Sale {
  _id?: string;
  invoiceNo?: string;
  products?: any;
  month?: number;
  year?: number;
  customer?: Customer;
  salesman?: any;
  visaCharge?: any;
  soldDate?: Date;
  soldDateString?: string;
  vendor?: any;
  subTotal?: number;
  returnTotal?: number;
  total?: number;
  discount?: number;
  discountType?: number;
  discountAmount?: number;
  vatAmount?: number;
  multiPayment?: any[];
  totalPurchasePrice?: number;
  pointsDiscount?: number;
  receivedFromCustomer?: number;
  paymentType?: string;
  usePoints?: number;
  paidAmount?: number;
  status?: string;
  deliveryDate?: string;
  soldTime?: string;
  note?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  calculation?: SaleCalculation;
}

export interface SaleCalculation {
  totalAmount: number;
  grandTotal: number;
}


export interface SaleGroup {
  _id: string;
  data: Sale[];
  select?: boolean;
}
