import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Courier} from '../../interfaces/common/courier.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";

const API_URL = environment.apiBaseLink + '/api/courier/';


@Injectable({
  providedIn: 'root'
})
export class CourierService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * HTTP METHODS
   * addCourier()
   * getAllCouriers()
   * getCourierById()
   * updateCourierById()
   * deleteCourierById()
   * deleteMultipleCourierById()
   */

  addCourier(data: Courier): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllCourier(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Courier[],
      count: number,
      success: boolean,
      calculation: any
    }>(API_URL + 'get-all-by-shop/', filterData, {params});
  }

  getCourierById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Courier, message: string, success: boolean }>(API_URL + id, {params});
  }

  updateCourierById(id: string, data: Courier) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  deleteCourierById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, {params});
  }

  deleteMultipleCourierById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', {ids: ids}, {params});
  }


}
