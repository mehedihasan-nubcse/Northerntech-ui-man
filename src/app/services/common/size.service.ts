import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";
import {Size} from "../../interfaces/common/size.interface";

const API_SIZE = environment.apiBaseLink + '/api/size/';


@Injectable({
  providedIn: 'root'
})
export class SizeService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addSize
   * insertManySize
   * getAllSizes
   * getSizeById
   * updateSizeById
   * updateMultipleSizeById
   * deleteSizeById
   * deleteMultipleSizeById
   */

  // getAllCategories(filterData: FilterData, searchQuery?: string) {
  //   let params = new HttpParams();
  //   if (searchQuery) {
  //     params = params.append('q', searchQuery);
  //   }
  //   return this.httpClient.post<{ data: Size[], count: number, success: boolean }>(API_SUB_SIZE + 'get-all', filterData, {params});
  // }

  addSize(data: Size):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_SIZE + 'add', data);
  }

  getAllSize(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Size[], count: number, success: boolean }>(API_SIZE + 'get-all-by-shop/', filterData, {params});
  }

  getSizeById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Size, message: string, success: boolean }>(API_SIZE + id, {params});
  }

  updateSizeById(id: string, data: Size) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_SIZE + 'update/' + id, data);
  }


  // deleteSizeById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_SIZE + 'delete/' + id);
  // }

  deleteSizeById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_SIZE + 'delete/' + id, {params});
  }

  deleteMultipleSizeById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_SIZE + 'delete-multiple', {ids: ids}, {params});
  }

  // sizeGroupByField<T>(dataArray: T[], field: string): SizeGroup[] {
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
  //   return final as SizeGroup[];

  // }



}
