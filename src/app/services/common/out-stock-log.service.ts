import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {OutStockLog} from '../../interfaces/common/out-stock-log.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";

const API_BRAND = environment.apiBaseLink + '/api/outStockLog/';


@Injectable({
  providedIn: 'root'
})
export class OutStockLogService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addOutStockLog
   * insertManyOutStockLog
   * getAllOutStockLogs
   * getOutStockLogById
   * updateOutStockLogById
   * updateMultipleOutStockLogById
   * deleteOutStockLogById
   * deleteMultipleOutStockLogById
   */

  addOutStockLog(data: OutStockLog):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add', data);
  }
  addOutStockLogByShop(data: OutStockLog):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add-by-shop', data);
  }

  getAllOutStockLogs(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: OutStockLog[], count: number, success: boolean }>(API_BRAND + 'get-all-by-shop/', filterData, {params});
  }
  getAllOutStockLogs1(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: OutStockLog[], count: number, success: boolean }>(API_BRAND + 'get-all/', filterData, {params});
  }

  getOutStockLogById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: OutStockLog, message: string, success: boolean }>(API_BRAND + id, {params});
  }

  updateOutStockLogById(id: string, data: OutStockLog) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  deleteOutStockLogById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleOutStockLogById(ids: string[], checkUsage?: boolean) {
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
  // outStockLogGroupByField<T>(dataArray: T[], field: string): OutStockLogGroup[] {
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
  //   return final as OutStockLogGroup[];

  // }



}
