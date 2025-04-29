import {Inject, Injectable} from '@angular/core';
import * as moment from 'moment';
import {DOCUMENT} from '@angular/common';
import {Product} from '../../interfaces/common/product.interface';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {
  }


  /**
   * UTILS
   */

  getDateString(date: Date, format?: string): string {
    const fm = format ? format : 'YYYY-MM-DD';
    return moment(date).format(fm);
  }

  getDateYear(date: any): number {
    return new Date(date).getFullYear();
  }

  getDateMonth(fromZero: boolean, date?: any): number {
    let d;
    if (date) {
      d = new Date(date)
    } else {
      d = new Date();
    }
    const month = d.getMonth();
    return fromZero ? month : month + 1;
  }

  getCurrentTime() {
    return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

  mergeArrayString(array1: string[], array2: string[]): string[] {
    const c = array1.concat(array2);
    return c.filter((item, pos) => c.indexOf(item) === pos);
  }


  // Generic groupBy function
  groupBy<T>(array: T[], keyGetter: (item: T) => string): Record<string, T[]> {
    return array.reduce((result, item) => {
      const key = keyGetter(item);
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(item);
      return result;
    }, {} as Record<string, T[]>);
  }

  // Process the raw purchase data
  // Process the raw purchase data
  processPurchaseData(data: any[]) {
    // Group data by `dateString`
    const groupedByDate = this.groupBy1(data, (item) => item?.dateString || "unknown");

    // Process each date group
    const allPurchaseByDate = Object.entries(groupedByDate).map(([date, purchases]) => {
      // Group purchases dynamically by product properties (fallback logic for group key)
      const groupedByProduct = this.groupBy1(purchases, (item) => {
        // console.log('item', item.product)
        const product = item?.product;
        if (product?.name && product?.sizes?.name && product?.colors?.name) {
          return `${product.name}-${product.sizes.name}-${product.colors.name}`;
        } else if (product?.name && product?.colors?.name) {
          return `${product.name}-${product.colors.name}`;
        } else if (product?.name && product?.sizes?.name) {
          return `${product.name}-${product.sizes.name}`;
        }
        return product?.name || "unknown";
      });

      // Format data for the current date group
      const formattedPurchases = Object.entries(groupedByProduct).map(([groupKey, items]) => {
        // Aggregate totals for each group
        const updatedQuantity = items.reduce((sum, item) => sum + (item.updatedQuantity || 0), 0);
        const totalPurchase = items.reduce(
          (sum, item) => sum + (item.updatedQuantity || 0) * (item?.product?.purchasePrice || 0),
          0
        );

        // Use the first item for fields that do not require aggregation
        const firstItem = items[0] || {};
        // console.log('items',items)

        return {
          groupKey,
          name: firstItem?.product?.name || "N/A",
          _id: firstItem?.product?._id || "N/A",
          sizes: firstItem?.product?.sizes?.name || "N/A",
          colors: firstItem?.product?.colors?.name || "N/A",
          previousQuantity: firstItem?.previousQuantity || 0,
          updatedQuantity, // Aggregated total
          purchasePrice: firstItem?.product?.purchasePrice || 0,
          totalPurchase, // Aggregated total
          salesman: firstItem?.salesman || "N/A",
          createTime: firstItem?.createTime || "N/A",
          dateString: firstItem?.dateString || "N/A",
          updateTime: firstItem?.updateTime || "N/A",
          quantity: firstItem?.quantity || 0,
          note: firstItem?.note || "N/A",
          imei: firstItem?.product?.imei || "N/A",
          vendor: firstItem?.product?.vendor || "N/A",
          category: firstItem?.product?.category || "N/A",
        };
      });

      // Calculate totals for the current date
      const purchasePriceTotal = formattedPurchases.reduce(
        (sum, item) => sum + (item?.purchasePrice || 0),
        0
      );
      const totalPurchaseTotal = formattedPurchases.reduce(
        (sum, item) => sum + (item?.totalPurchase || 0),
        0
      );

      return {
        date,
        purchasePriceTotal,
        totalPurchaseTotal,
        purchases: formattedPurchases,
      };
    });

    // Grand totals across all dates
    const purchasePriceGrandTotal = allPurchaseByDate.reduce(
      (sum, dateGroup) => sum + dateGroup.purchasePriceTotal,
      0
    );
    const totalPurchaseGrandTotal = allPurchaseByDate.reduce(
      (sum, dateGroup) => sum + dateGroup.totalPurchaseTotal,
      0
    );

    return {
      allPurchaseByDate,
      purchasePriceGrandTotal,
      totalPurchaseGrandTotal,
    };
  }

// Helper function: Group by a specific key
  groupBy1(array: any[], keyFn: (item: any) => string): Record<string, any[]> {
    return array.reduce((acc, item) => {
      const key = keyFn(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, any[]>);
  }

  // Process the raw purchase data
  processOutStockData(data: any[]) {
    // Group data by `dateString`
    const groupedByDate = this.groupBy(data, (item) => item.dateString);

    // Process each date group
    const allPurchaseByDate = Object.keys(groupedByDate).map((date) => {
      const purchases = groupedByDate[date];

      // Further group purchases by `groupKey` (e.g., name-sizes-colors)
      const groupedByProduct = this.groupBy(purchases, (item) => {
        const product = item.product;
        return `${product?.name}-${product?.sizes?.name}-${product?.colors?.name}`;
      });

      // Format data for the current date group
      const formattedPurchases = Object.keys(groupedByProduct).map((groupKey) => {
        const items = groupedByProduct[groupKey];

        // Aggregate totals
        const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPurchase = items.reduce(
          (sum, item) => sum + item.quantity * item.product.purchasePrice,
          0
        );
        // console.log('items',items)

        // Use the first item for fields that do not require aggregation
        const firstItem = items[0];

        return {
          groupKey,
          name: firstItem?.product?.name,
          _id: firstItem?.product?._id,
          sizes: firstItem?.product?.sizes?.name,
          colors: firstItem?.product?.colors?.name,
          previousQuantity: firstItem?.previousQuantity,
          quantity, // Aggregated total
          purchasePrice: firstItem?.product?.purchasePrice,
          totalPurchase, // Aggregated total
          salesman: firstItem?.salesman,
          createTime: firstItem?.createTime,
          dateString: firstItem?.dateString,
          updateTime: firstItem?.updateTime,
          category: firstItem?.product?.category || "N/A",
          // quantity: firstItem.quantity,
          vendor: firstItem?.product?.vendor || "N/A",
          note: firstItem?.note || 'N/A',
          imei: firstItem?.product?.imei || "N/A",
        };
      });

      // Totals for the current date
      const purchasePriceTotal = formattedPurchases.reduce(
        (sum, item) => sum + item?.purchasePrice,
        0
      );
      const totalPurchaseTotal = formattedPurchases.reduce(
        (sum, item) => sum + item?.totalPurchase,
        0
      );

      return {
        date,
        purchasePriceTotal,
        totalPurchaseTotal,
        purchases: formattedPurchases,
      };
    });

    // Grand totals across all dates
    const purchasePriceGrandTotal = allPurchaseByDate.reduce(
      (sum, dateGroup) => sum + dateGroup?.purchasePriceTotal,
      0
    );
    const totalPurchaseGrandTotal = allPurchaseByDate.reduce(
      (sum, dateGroup) => sum + dateGroup?.totalPurchaseTotal,
      0
    );

    return {
      allPurchaseByDate,
      purchasePriceGrandTotal,
      totalPurchaseGrandTotal,
    };
  }
  /**
   * GET RANDOM NUMBER
   */
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getImageName(originalName: string): string {
    const array = originalName.split('.');
    array.pop();
    return array.join('');
  }

  groupByField<T>(dataArray: T[], field: string): T[] {
    const data = dataArray.reduce((group, product) => {
      const uniqueField = product[field]
      group[uniqueField] = group[uniqueField] ?? [];
      group[uniqueField].push(product);
      return group;
    }, {});

    const final = [];

    for (const key in data) {
      final.push({
        _id: key,
        // data: data[key],
        data: this.totalCal(data[key])
      })
    }

    return final as T[];

  }


  totalCal = (data) => {
    const total = data.reduce((acc, value) => acc + value.total, 0);
    const totalPurchasePrice = data.reduce((acc, value) => acc + value.totalPurchasePrice, 0);
    return {
      total,
      totalPurchasePrice,
      profit: total - totalPurchasePrice,
    };
  }

  arrayGroupByField<T>(dataArray: T[], field: string, totalField?: string): any[] {
    const data = dataArray.reduce((group, product) => {
      const uniqueField = product[field]
      group[uniqueField] = group[uniqueField] ?? [];
      group[uniqueField].push(product);
      return group;
    }, {});

    const final = [];

    for (const key in data) {

      let obj;
      if (totalField) {
        const total = data[key].map(t => t[totalField] ?? 0).reduce((acc, value) => acc + value, 0);
        obj = {
          _id: key,
          total: total,
          data: data[key]
        }
      } else {
        obj = {
          _id: key,
          data: data[key]
        }
      }
      final.push(obj)
    }
    return final as T[];
  }



  arrayGroupByFieldComplexCalc<T>(dataArray: T[], field: string, calculationFor: 'purchase_history' | 'sale_return' | 'damage_history' | 'sale' | 'pre_order' | 'sale-statement'): any[] {
    const data = dataArray.reduce((group, product) => {
      const uniqueField = product[field]
      group[uniqueField] = group[uniqueField] ?? [];
      group[uniqueField].push(product);
      return group;
    }, {});

    const final = [];

    for (const key in data) {

      let obj;


      switch(calculationFor) {
        case 'purchase_history': {
          const total = data[key].map(t => t['product']['purchasePrice'] * (t['updatedQuantity'] - t['previousQuantity']) ?? 0).reduce((acc, value) => acc + value, 0);
          obj = {
            _id: key,
            total: total,
            data: data[key].reverse()
          }
          break;
        }
        case 'damage_history': {
          const total = data[key].map(t => t['product']['purchasePrice'] * t['quantity'] ?? 0).reduce((acc, value) => acc + value, 0);
          obj = {
            _id: key,
            total: total,
            data: data[key].reverse()
          }
          break;
        }
        case 'sale_return': {
          const total = data[key].map(t => t['grandTotal']?? 0).reduce((acc, value) => acc + value, 0);
          obj = {
            _id: key,
            total: total,
            data: data[key]
          }
          break;
        }
        // case 'sale': {
        //   const total = data[key].map(t => t['total']?? 0).reduce((acc, value) => acc + value, 0);
        //   const subTotal = data[key].map(t => t['subTotal']?? 0).reduce((acc, value) => acc + value, 0);
        //   const discount = data[key].map(t => t['discount']?? 0).reduce((acc, value) => acc + value, 0);
        //   const vat = data[key].map(t => t['vatAmount']?? 0).reduce((acc, value) => acc + value, 0);
        //   obj = {
        //     _id: key,
        //     total: total,
        //     subTotal: subTotal,
        //     discount: discount,
        //     vat: vat,
        //     data: data[key]
        //   }
        //   break;
        // }

        case 'sale': {
          const total = data[key].map(t => t['total'] ?? 0).reduce((acc, value) => acc + value, 0);
          const subTotal = data[key].map(t => t['subTotal'] ?? 0).reduce((acc, value) => acc + value, 0);
          const discount = data[key].map(t => t['discount'] ?? 0).reduce((acc, value) => acc + value, 0);
          const vat = data[key].map(t => t['vatAmount'] ?? 0).reduce((acc, value) => acc + value, 0);

          // Sort the data by soldDateString, ensuring today's date (2024-11-18) is at the 0 index
          // data[key].sort((a, b) => {
          //   const today = new Date();
          //   const dateA:any = new Date(a['soldDateString']);
          //   const dateB:any = new Date(b['soldDateString']);
          //
          //   // Place today's date at the beginning
          //   if (dateA.toDateString() === today.toDateString()) return -1;
          //   if (dateB.toDateString() === today.toDateString()) return 1;
          //
          //   // Otherwise, sort by the most recent date
          //   return dateB - dateA;
          // });
          data[key].sort((a, b) => {
            return b['invoiceNo'].localeCompare(a['invoiceNo']);
          });



          obj = {
            _id: key,
            total: total,
            subTotal: subTotal,
            discount: discount,
            vat: vat,
            data: data[key]
          };
          break;
        }


        case 'sale-statement': {
          const totalSaleAmount = data[key].map(t => (t['salePrice'] * t['soldQuantity'])?? 0).reduce((acc, value) => acc + value, 0);
          const totalPurchaseAmount = data[key].map(t => (t['purchasePrice'] * t['soldQuantity'])?? 0).reduce((acc, value) => acc + value, 0);
          const saleAmount = data[key].map(t => t['salePrice']?? 0).reduce((acc, value) => acc + value, 0);
          const purchaseAmount = data[key].map(t => t['purchasePrice']?? 0).reduce((acc, value) => acc + value, 0);
          const quantity = data[key].map(t => t['soldQuantity']?? 0).reduce((acc, value) => acc + value, 0);
          const discountAmount = data[key].map(t => t['discount']?? 0).reduce((acc, value) => acc + value, 0);

          obj = {
            _id: key,
            saleAmount: saleAmount,
            purchaseAmount: purchaseAmount,
            totalSaleAmount: totalSaleAmount,
            totalPurchaseAmount: totalPurchaseAmount,
            profit: ((totalSaleAmount - totalPurchaseAmount) - discountAmount),
            quantity: quantity,
            data: data[key],
            percent: Math.floor(((saleAmount - purchaseAmount) / purchaseAmount) * 100),
            percentTotal: Math.floor((((totalSaleAmount - totalPurchaseAmount) - discountAmount) / totalPurchaseAmount) * 100)
          }
          break;
        }
        case 'pre_order': {
          const total = data[key].map(t => t['total']?? 0).reduce((acc, value) => acc + value, 0);
          const subTotal = data[key].map(t => t['subTotal']?? 0).reduce((acc, value) => acc + value, 0);
          const discount = data[key].map(t => t['discount']?? 0).reduce((acc, value) => acc + value, 0);
          const vat = data[key].map(t => t['vatAmount']?? 0).reduce((acc, value) => acc + value, 0);
          const paidAmount = data[key].map(t => t['paidAmount']?? 0).reduce((acc, value) => acc + value, 0);
          obj = {
            _id: key,
            total: total,
            subTotal: subTotal,
            discount: discount,
            paidAmount: paidAmount,
            dueAmount: total - paidAmount,
            vat: vat,
            data: data[key]
          }
          break;
        }
        default: {
          obj = {
            _id: key,
            data: data[key]
          }
          break;
        }
      }
      final.push(obj)
    }
    return final as T[];
  }


  getTotalWithReduce<T>(dataArray: T[], field: string): number {
    return dataArray.map(t => t[field] ?? 0).reduce((acc, value) => acc + value, 0)
  }

  public margeMultipleArrayUnique<T>(uniqueBy: string, arr1: T[], arr2: T[]): T[] {

    const result = [...new Map([...arr1, ...arr2]
      .map((item) => [item[uniqueBy], item])).values()];

    return result as T[];
  }

  /**
   * UI METHODS
   * getProductName()
   */
  public getProductName(data: Product): string {
    let name = data.name;
    if (data.colors) {
      name += ` - ${data.colors?.name}`;
    }
    if (data.sizes) {
      name += ` - ${data.sizes?.name}`;
    }
    if (data.model) {
      name += ` - ${data.model}`;
    }
    if (data.others) {
      name += ` - ${data.others}`;
    }
    if (data.sku) {
      name += ` - (${data.sku})`;
    }

    return name;
  }



}

