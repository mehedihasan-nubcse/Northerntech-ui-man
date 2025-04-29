export interface ShopInformation {
  payoutTitle: any;
  sellerName: any;
  _id?: string;
  siteName?: string;
  shortDescription?: string;
  siteLogo?: string;
  metaLogo?: string;
  addresses: ShopObject[];
  emails?: ShopObject[];
  phones: ShopObject[];
  downloadUrls: ShopObject[];
  socialLinks: ShopObject[];
  navLogo?: string;
  footerLogo?: string;
  uenNo?: string;
  footerText?: string;
  othersLogo?: string;
  currency?: string;
}

export interface ShopObject {
  type: number;
  value: string;
}
