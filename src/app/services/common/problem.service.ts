import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {ResponsePayload} from '../../interfaces/core/response-payload.interface';
import {Problem} from '../../interfaces/common/problem.interface';
import {FilterData} from '../../interfaces/gallery/filter-data';
import {Observable} from "rxjs";

const API_BRAND = environment.apiBaseLink + '/api/problem/';


@Injectable({
  providedIn: 'root'
})
export class ProblemService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * addProblem
   * insertManyProblem
   * getAllProblems
   * getProblemById
   * updateProblemById
   * updateMultipleProblemById
   * deleteProblemById
   * deleteMultipleProblemById
   */

  addProblem(data: Problem):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add', data);
  }
  addProblemByShop(data: Problem):Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'add-by-shop', data);
  }

  getAllProblems(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Problem[], count: number, success: boolean }>(API_BRAND + 'get-all-by-shop/', filterData, {params});
  }
  getAllProblems1(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Problem[], count: number, success: boolean }>(API_BRAND + 'get-all/', filterData, {params});
  }

  getProblemById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Problem, message: string, success: boolean }>(API_BRAND + id, {params});
  }

  updateProblemById(id: string, data: Problem) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_BRAND + 'update/' + id, data);
  }

  deleteProblemById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_BRAND + 'delete/' + id, {params});
  }

  deleteMultipleProblemById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_BRAND + 'delete-multiple', {ids: ids}, {params});
  }

  // problemGroupByField<T>(dataArray: T[], field: string): ProblemGroup[] {
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
  //   return final as ProblemGroup[];

  // }



}
