import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {FilterData} from '../../interfaces/core/filter-data';
import {Point} from '../../interfaces/common/point.interface';

const API_SHOP_INFO = environment.apiBaseLink + '/api/point/';


@Injectable({
  providedIn: 'root'
})
export class PointService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addPoint
   * insertManyPoint
   * getAllPoints
   * getPointById
   * updatePointById
   * updateMultiplePointById
   * deletePointById
   * deleteMultiplePointById
   */

  addPoint(data: Point) {
    return this.httpClient.post<ResponsePayload>
    (API_SHOP_INFO + 'add', data);
  }


  getPoint(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Point, message: string, success: boolean }>(API_SHOP_INFO + 'get', {params});
  }

  insertManyPoint(data: Point, option?: any) {
    const mData = {data, option}
    return this.httpClient.post<ResponsePayload>
    (API_SHOP_INFO + 'insert-many', mData);
  }

  getAllPoints(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Point[], count: number, success: boolean }>(API_SHOP_INFO + 'get-all', filterData, {params});
  }

  getPointById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Point, message: string, success: boolean }>(API_SHOP_INFO + id, {params});
  }

  updatePointById(id: string, data: Point) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_SHOP_INFO + 'update/' + id, data);
  }

  updateMultiplePointById(ids: string[], data: Point) {
    const mData = {...{ids: ids}, ...data}
    return this.httpClient.put<ResponsePayload>(API_SHOP_INFO + 'update-multiple', mData);
  }

  deletePointById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_SHOP_INFO + 'delete/' + id, {params});
  }

  deleteMultiplePointById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_SHOP_INFO + 'delete-multiple', {ids: ids}, {params});
  }


}
