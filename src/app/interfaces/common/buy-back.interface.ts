import {Category} from './category.interface';
import {SubCategory} from './sub-category.interface';
import {Brand} from './brand.interface';
import {Unit} from './unit.interface';
import {Vendor} from './vendor.interface';
import {Attribute} from './attribute.interface';
import {Size} from './size.interface';
import {Color} from './color.interface';

export interface BuyBack {
  _id?: string;
  productId?: string;
  salesman?: string;
  name?: string;
  category?: Category;
  vendor?: Vendor;
  subcategory?: SubCategory;
  brand?: Brand;
  attribute?: Attribute;
  sizes?: Size;
  colors?: Color;
  unit?: Unit;
  sku?: string;
  others?: string;
  model?: string;
  quantity?: number;
  description?: string;
  purchasePrice?: number;
  productType?: 'damage',
  expireDate?: string;
  salePrice?: number;
  salePercent?: number;
  discountType?: number;
  discountAmount?: number;
  currency?: string;
  status?: boolean;
  soldQuantity?: number;
  images?: [];
  createdAt?: Date;
  updatedAt?: Date;
  editSalePrice?: boolean;
  saleType?: 'Sale' | 'Return';
  select?: boolean;
  tag?: 'new' | 'old';
}


export interface BuyBackCalculation {
  totalQuantity: number,
  totalPurchasePrice: number,
  totalSalePrice: number
  sumPurchasePrice:number,
  sumSalePrice: number,
}
