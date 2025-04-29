export interface Repair {
  _id?: string;
  date?: string;
  dateString?: string;
  deliveredDate?: string;
  deliveredTime?: string;
  modelNo?: string;
  status?: string;
  month?: number;
  amount?: number;
  repairFor?: string;
  updateTime?: string;
  description?: string;
  brand?: string;
  phoneNo?: string;
  images?: [string];
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
}
