import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {ProductLog} from '../../interfaces/common/product-log.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";

const API_BRAND = environment.apiBaseLink + '/api/product-log/';


@Injectable({
  providedIn: 'root'
})
export class ProductLogService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addProductLog
   * insertManyProductLog
   * getAllProductLogs
   * getProductLogById
   * updateProductLogById
   * updateMultipleProductLogById
   * deleteProductLogById
   * deleteMultipleProductLogById
   */

  addProductLog(data: ProductLog):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add', data);
  }
  addProductLogByShop(data: ProductLog):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add-by-shop', data);
  }

  getAllProductLogs(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ProductLog[], count: number, success: boolean }>(API_BRAND + 'get-all-by-shop/', filterData, {params});
  }

  getAllProductLogs1(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ProductLog[], count: number, success: boolean }>(API_BRAND + 'get-all/', filterData, {params});
  }

  getProductLogById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: ProductLog, message: string, success: boolean }>(API_BRAND + id, {params});
  }

  updateProductLogById(id: string, data: ProductLog) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  deleteProductLogById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleProductLogById(ids: string[], checkUsage?: boolean) {
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

  // productLogGroupByField<T>(dataArray: T[], field: string): ProductLogGroup[] {
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
  //   return final as ProductLogGroup[];

  // }



}
