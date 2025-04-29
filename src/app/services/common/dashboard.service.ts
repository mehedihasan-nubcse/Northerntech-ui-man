import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {SaleDashboard} from '../../interfaces/common/dashboard.interface';
import {SaleGroup} from '../../interfaces/common/sale.interface';

const API_DASHBOARD = environment.apiBaseLink + '/api/dashboard/';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  getSalesDashboard(day: number) {
    let params = new HttpParams();
    params = params.append('day', day);
    return this.httpClient.get<{ data: SaleDashboard, message: string, success: boolean }>(API_DASHBOARD + 'sale-dashboard', {params});
  }

  getStatement(filter: {month: number}) {
    return this.httpClient.post<{ data: any, message: string, success: boolean }>(API_DASHBOARD + 'statement', filter);
  }

  salesGroupByField<T>(dataArray: T[], field: string): SaleGroup[] {
    const data = dataArray.reduce((group, product) => {
      const uniqueField = product[field]
      group[uniqueField] = group[uniqueField] ?? [];
      group[uniqueField].push(product);
      return group;
    }, {});

    const final = [];

    for (const key in data) {
      final.push({
        _id: key,
        data: data[key]
      })
    }

    return final as SaleGroup[];

  }

}
