export interface Category {
  invoiceTitle: string;
  _id?: string;
  name?: string;
  code?: string;
  description?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  select: boolean;
}
