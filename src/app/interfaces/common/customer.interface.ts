export interface Customer {
  customer: any;
  select: boolean;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  userPoints?: number;
  country?: string;
  city?: string;
  address?: string;
  description?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
