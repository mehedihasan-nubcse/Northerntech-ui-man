import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";
import {Attribute} from "../../interfaces/common/attribute.interface";

const API_CATEGORY = environment.apiBaseLink + '/api/attribute/';


@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addAttribute
   * insertManyAttribute
   * getAllAttributes
   * getAttributeById
   * updateAttributeById
   * updateMultipleAttributeById
   * deleteAttributeById
   * deleteMultipleAttributeById
   */

  // getAllCategories(filterData: FilterData, searchQuery?: string) {
  //   let params = new HttpParams();
  //   if (searchQuery) {
  //     params = params.append('q', searchQuery);
  //   }
  //   return this.httpClient.post<{ data: Attribute[], count: number, success: boolean }>(API_SUB_CATEGORY + 'get-all', filterData, {params});
  // }

  addAttribute(data: Attribute):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_CATEGORY + 'add', data);
  }

  getAllAttribute(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Attribute[], count: number, success: boolean }>(API_CATEGORY + 'get-all-by-shop/', filterData, {params});
  }

  getAttributeById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Attribute, message: string, success: boolean }>(API_CATEGORY + id, {params});
  }

  updateAttributeById(id: string, data: Attribute) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_CATEGORY + 'update/' + id, data);
  }


  // deleteAttributeById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_CATEGORY + 'delete/' + id);
  // }

  deleteAttributeById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_CATEGORY + 'delete/' + id, {params});
  }

  deleteMultipleAttributeById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_CATEGORY + 'delete-multiple', {ids: ids}, {params});
  }

  // attributeGroupByField<T>(dataArray: T[], field: string): AttributeGroup[] {
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
  //   return final as AttributeGroup[];

  // }



}
