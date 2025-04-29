import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ResponsePayload } from '../../interfaces/core/response-payload.interface';
import { FilterData } from '../../interfaces/gallery/filter-data';
import { Observable } from "rxjs";
import {Sale, SaleGroup, SaleCalculation} from '../../interfaces/common/sale.interface';

const API_URL = environment.apiBaseLink + '/api/sales/';


@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * HTTP Methods
   * addSale()
   * getAllSales()
   * getSaleById()
   * updateSaleById()
   * updateMultipleSaleById
   * deleteSaleById()
   * deleteMultipleSaleById()
   */

  addSale(data: Sale): Observable<ResponsePayload> {
    return this.httpClient.post<ResponsePayload>(API_URL + 'add', data);
  }

  getAllSale(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Sale[], count: number, success: boolean, calculation: SaleCalculation }>(API_URL + 'get-all-by-shop/', filterData, { params });
  }

  getProductSales(filterData: FilterData, searchQuery?: string) {
    let params = new HttpParams();
    if (searchQuery) {
      params = params.append('q', searchQuery);
    }
    return this.httpClient.post<{ data: Sale[], count: number, success: boolean, calculation: SaleCalculation }>(API_URL + 'get-all-product-sale', filterData, { params });
  }

  getSaleById(id: string, select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{ data: Sale, message: string, success: boolean }>(API_URL + id, { params });
  }

  updateSaleById(id: string, data: Sale) {
    return this.httpClient.put<{ message: string, success: boolean }>(API_URL + 'update/' + id, data);
  }


  deleteSaleById(id: string, checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.delete<ResponsePayload>(API_URL + 'delete/' + id, { params });
  }

  deleteMultipleSaleById(ids: string[], checkUsage?: boolean) {
    let params = new HttpParams();
    if (checkUsage) {
      params = params.append('checkUsage', checkUsage);
    }
    return this.httpClient.post<ResponsePayload>(API_URL + 'delete-multiple', { ids: ids }, { params });
  }


}
