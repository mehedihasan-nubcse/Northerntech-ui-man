import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";
import {Color} from "../../interfaces/common/color.interface";

const API_COLOR = environment.apiBaseLink + '/api/color/';


@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addColor
   * insertManyColor
   * getAllColors
   * getColorById
   * updateColorById
   * updateMultipleColorById
   * deleteColorById
   * deleteMultipleColorById
   */

  // getAllCategories(filterData: FilterData, searchQuery?: string) {
  //   let params = new HttpParams();
  //   if (searchQuery) {
  //     params = params.append('q', searchQuery);
  //   }
  //   return this.httpClient.post<{ data: Color[], count: number, success: boolean }>(API_SUB_COLOR + 'get-all', filterData, {params});
  // }

  addColor(data: Color):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_COLOR + 'add', data);
  }

  getAllColor(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Color[], count: number, success: boolean }>(API_COLOR + 'get-all-by-shop/', filterData, {params});
  }

  getColorById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Color, message: string, success: boolean }>(API_COLOR + id, {params});
  }

  updateColorById(id: string, data: Color) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_COLOR + 'update/' + id, data);
  }


  // deleteColorById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_COLOR + 'delete/' + id);
  // }

  deleteColorById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_COLOR + 'delete/' + id, {params});
  }

  deleteMultipleColorById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_COLOR + 'delete-multiple', {ids: ids}, {params});
  }

  // colorGroupByField<T>(dataArray: T[], field: string): ColorGroup[] {
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
  //   return final as ColorGroup[];

  // }



}
