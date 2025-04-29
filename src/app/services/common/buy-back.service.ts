import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import {BuyBack, BuyBackCalculation} from '../../interfaces/common/buy-back.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";

const API_PRODUCT = environment.apiBaseLink + '/api/buyBack/';


@Injectable({
  providedIn: 'root'
})
export class BuyBackService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addBuyBack
   * insertManyBuyBack
   * getAllBuyBacks
   * getBuyBackById
   * updateBuyBackById
   * updateMultipleBuyBackById
   * deleteBuyBackById
   * deleteMultipleBuyBackById
   */

  // getAllCategories(filterData: FilterData, searchQuery?: string) {
  //   let params = new HttpParams();
  //   if (searchQuery) {
  //     params = params.append('q', searchQuery);
  //   }
  //   return this.httpClient.post<{ data: BuyBack[], count: number, success: boolean }>(API_SUB_CATEGORY + 'get-all', filterData, {params});
  // }

  addBuyBack(data: BuyBack): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_PRODUCT + 'add', data);
  }

  getAllBuyBacks(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: BuyBack[], count: number, success: boolean, calculation: BuyBackCalculation }>(API_PRODUCT + 'get-all-by-shop/', filterData, { params });
  }

  getBuyBackById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: BuyBack, message: string, success: boolean }>(API_PRODUCT + id, { params });
  }

  updateBuyBackById(id: string, data: BuyBack) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_PRODUCT + 'update/' + id, data);
  }


  deleteMultipleBuyBackById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_PRODUCT + 'delete-multiple', { ids: ids }, { params });
  }




  // deleteBuyBackById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_PRODUCT + 'delete/' + id);
  // }

  deleteBuyBackById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_PRODUCT + 'delete/' + id, { params });
  }

  insertManyBuyBacks(data: BuyBack[], option?: any) {
    const mData = { data, option }
    return this.httpClient.post<ResponsePayload>
      (API_PRODUCT + 'insert-many', mData);
  }

  // buyBackGroupByField<T>(dataArray: T[], field: string): BuyBackGroup[] {
  //   const data = dataArray.reduce((group, buyBack) => {
  //     const uniqueField = buyBack[field]
  //     group[uniqueField] = group[uniqueField] ?? [];
  //     group[uniqueField].push(buyBack);
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
  //   return final as BuyBackGroup[];

  // }



}
