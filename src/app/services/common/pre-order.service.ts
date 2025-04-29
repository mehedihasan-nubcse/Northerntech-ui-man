import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";
import {PreOrder, PreOrderCalculation} from '../../interfaces/common/pre-order.interface';

const API_URL = environment.apiBaseLink + '/api/pre-order/';


@Injectable({
  providedIn: 'root'
})
export class PreOrderService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * HTTP Methods
   * addPreOrder()
   * getAllPreOrders()
   * getPreOrderById()
   * updatePreOrderById()
   * updateMultiplePreOrderById
   * deletePreOrderById()
   * deleteMultiplePreOrderById()
   */

  addPreOrder(data: PreOrder): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllPreOrder(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: PreOrder[], count: number, success: boolean, calculation: PreOrderCalculation }>(API_URL + 'get-all-by-shop/', filterData, { params });
  }

  getPreOrderById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: PreOrder, message: string, success: boolean }>(API_URL + id, { params });
  }

  updatePreOrderById(id: string, data: PreOrder) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }


  deletePreOrderById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, { params });
  }

  deleteMultiplePreOrderById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', { ids: ids }, { params });
  }




}
