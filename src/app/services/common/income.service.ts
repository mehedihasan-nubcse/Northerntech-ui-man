import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Income} from '../../interfaces/common/income.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";

const API_URL = environment.apiBaseLink + '/api/income/';


@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * HTTP METHODS
   * addIncome()
   * getAllIncomes()
   * getIncomeById()
   * updateIncomeById()
   * deleteIncomeById()
   * deleteMultipleIncomeById()
   */

  addIncome(data: Income): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllIncome(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{
      data: Income[],
      count: number,
      success: boolean,
      calculation: any
    }>(API_URL + 'get-all-by-shop/', filterData, {params});
  }

  getIncomeById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Income, message: string, success: boolean }>(API_URL + id, {params});
  }

  updateIncomeById(id: string, data: Income) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }

  deleteIncomeById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, {params});
  }

  deleteMultipleIncomeById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', {ids: ids}, {params});
  }


}
