import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {SalesLog} from '../../interfaces/common/sales-log.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";

const API_BRAND = environment.apiBaseLink + '/api/salesLog/';


@Injectable({
  providedIn: 'root'
})
export class SalesLogService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addSalesLog
   * insertManySalesLog
   * getAllSalesLogs
   * getSalesLogById
   * updateSalesLogById
   * updateMultipleSalesLogById
   * deleteSalesLogById
   * deleteMultipleSalesLogById
   */

  addSalesLog(data: SalesLog):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add', data);
  }
  addSalesLogByShop(data: SalesLog):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add-by-shop', data);
  }

  getAllSalesLogs(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: SalesLog[], count: number, success: boolean }>(API_BRAND + 'get-all-by-shop/', filterData, {params});
  }
  getAllSalesLogs1(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: SalesLog[], count: number, success: boolean }>(API_BRAND + 'get-all/', filterData, {params});
  }

  getSalesLogById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: SalesLog, message: string, success: boolean }>(API_BRAND + id, {params});
  }

  updateSalesLogById(id: string, data: SalesLog) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  deleteSalesLogById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleSalesLogById(ids: string[], checkUsage?: boolean) {
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
  // salesLogGroupByField<T>(dataArray: T[], field: string): SalesLogGroup[] {
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
  //   return final as SalesLogGroup[];

  // }



}
