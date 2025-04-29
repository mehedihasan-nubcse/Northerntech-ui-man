export interface Vendor {
  select: boolean;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  alternateNumber?: string;
  totalPaid?: number;
  totalPayable?: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
