import {Customer} from './customer.interface';

export interface PreOrder {
  _id?: string;
  invoiceNo?: string;
  products?: any;
  month?: number;
  year?: number;
  customer?: Customer;
  salesman?: any;
  soldDate?: Date;
  soldDateString?: string;
  subTotal?: number;
  total?: number;
  discount?: number;
  discountType?: number;
  discountAmount?: number;
  vatAmount?: number;
  totalPurchasePrice?: number;
  pointsDiscount?: number;
  receivedFromCustomer?: number;
  paymentType?: string;
  usePoints?: number;
  paidAmount?: number;
  status?: string;
  deliveryDate?: string;
  soldTime?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  calculation?: PreOrderCalculation;
}

export interface PreOrderCalculation {
  grandTotal: number;
}


export interface PreOrderGroup {
  _id: string;
  data: PreOrder[];
  select?: boolean;
}
