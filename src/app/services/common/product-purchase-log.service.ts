import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {ProductPurchaseLog} from '../../interfaces/common/product-purchase-log.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";

const API_BRAND = environment.apiBaseLink + '/api/productPurchaseLog/';


@Injectable({
  providedIn: 'root'
})
export class ProductPurchaseLogService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addProductPurchaseLog
   * insertManyProductPurchaseLog
   * getAllProductPurchaseLogs
   * getProductPurchaseLogById
   * updateProductPurchaseLogById
   * updateMultipleProductPurchaseLogById
   * deleteProductPurchaseLogById
   * deleteMultipleProductPurchaseLogById
   */

  addProductPurchaseLog(data: ProductPurchaseLog):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add', data);
  }
  addProductPurchaseLogByShop(data: ProductPurchaseLog):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add-by-shop', data);
  }

  getAllProductPurchaseLogs(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ProductPurchaseLog[], count: number, success: boolean }>(API_BRAND + 'get-all-by-shop/', filterData, {params});
  }
  getAllProductPurchaseLogs1(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ProductPurchaseLog[], count: number, success: boolean }>(API_BRAND + 'get-all/', filterData, {params});
  }

  getProductPurchaseLogById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: ProductPurchaseLog, message: string, success: boolean }>(API_BRAND + id, {params});
  }

  updateProductPurchaseLogById(id: string, data: ProductPurchaseLog) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  deleteProductPurchaseLogById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleProductPurchaseLogById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-multiple', {ids: ids}, {params});
  }
  restoreMultipleProductLogById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'restore-multiple', {ids: ids}, {params});
  }
  // productPurchaseLogGroupByField<T>(dataArray: T[], field: string): ProductPurchaseLogGroup[] {
  //   const data = dataArray.reduce((group, product) => {
  //     const uniqueField = product[field]
  //     group[uniqueField] = group[uniqueField] ?? [];
  //     group[uniqueField].push(product);
  //     return group;
  //   }, {});
  //
  //   const final = [];
  //
  //   for (const key in data) {
  //     final.push({
  //       _id: key,
  //       data: data[key]
  //     })
  //   }
  //
  //   return final as ProductPurchaseLogGroup[];

  // }



}
