import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";
import {ProductDamage} from '../../interfaces/common/product-damage.interface';
const API_URL= environment.apiBaseLink + '/api/product-damage/';


@Injectable({
  providedIn: 'root'
})
export class ProductDamageService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addProductDamage
   * insertManyProductDamage
   * getAllProductDamages
   * getProductDamageById
   * updateProductDamageById
   * updateMultipleProductDamageById
   * deleteProductDamageById
   * deleteMultipleProductDamageById
   */

  addProductDamage(data: ProductDamage):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL+ 'add', data);
  }

  getAllProductDamage(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: ProductDamage[], count: number, success: boolean, calculation: any }>(API_URL+ 'get-all-by-shop/', filterData, {params});
  }

  getSimilarProducts(productId: string ,dateString:any ): Observable<any> {
    const params = { dateString };
    return this.httpClient.get<any>(API_URL + 'similar/' + productId, { params });
  }

  getProductDamageById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: ProductDamage, message: string, success: boolean }>(API_URL+ id, {params});
  }

  updateProductDamageById(id: string, data: ProductDamage) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL+ 'update/' + id, data);
  }


  // deleteProductDamageById(id: string) {
  //   return this.httpClient.delete<ResponsePayload>(API_URL+ 'delete/' + id);
  // }

  deleteProductDamageById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL+ 'delete/' + id, {params});
  }


  deleteMultipleProductDamageById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL+ 'delete-multiple', { ids: ids }, { params });
  }





}
