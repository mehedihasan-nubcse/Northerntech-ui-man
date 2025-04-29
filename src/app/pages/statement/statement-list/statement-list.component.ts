import {Component, OnInit} from '@angular/core';
import {UiService} from "../../../services/core/ui.service";
import {Subscription} from "rxjs";
import {Statement} from "../../../interfaces/common/statement.interface";
import {FormControl, FormGroup} from "@angular/forms";
import {UtilsService} from "../../../services/core/utils.service";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as XLSX from 'xlsx';
import {Select} from '../../../interfaces/core/select';
import {MONTHS, YEARS} from '../../../core/utils/app-data';
import {DashboardService} from '../../../services/common/dashboard.service';
import {ShopInformation} from '../../../interfaces/common/shop-information.interface';
import {ShopInformationService} from '../../../services/common/shop-information.service';

@Component({
  selector: 'app-statement-list',
  templateUrl: './statement-list.component.html',
  styleUrls: ['./statement-list.component.scss'],
})
export class StatementListComponent implements OnInit {


  // Shop data
  shopInformation: ShopInformation;

  // Static Data
  months: Select[] = MONTHS;
  years: Select[] = YEARS;

  // Store Data
  isLoading: boolean = true;
  statements: Statement[] = [];
  id?: string;
  totalSold: number = 0;
  totalSoldPurchase: number = 0;
  totalExpense: number = 0;
  totalIncome: number = 0;
  totalPurchaseAmount: number = 0;

  // FilterData
  isDefaultFilter: boolean = false;
  filter: any = null;
  activeFilterMonth: number = null;
  activeFilterYear: number = null;

  // Date
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });


  // Subscriptions
  private subDataOne: Subscription;
  private subShopInfo: Subscription;

  constructor(
    private dashboardService: DashboardService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private shopInformationService: ShopInformationService,
  ) {
  }

  ngOnInit(): void {
    // Set Default Filter
    this.setDefaultFilter();
    // Base Data
    this.getAllStatement();
    this.getShopInformation();
  }


  /**
   * HTTP REQ HANDLE
   * getAllStatement()
   */

  private getAllStatement() {
    this.subDataOne = this.dashboardService.getStatement(this.filter)
      .subscribe({
        next: res => {
          this.statements = res.data;
          this.totalSold = this.utilsService.getTotalWithReduce(this.statements, 'soldAmount');
          this.totalSoldPurchase = this.utilsService.getTotalWithReduce(this.statements, 'soldPurchaseAmount');
          this.totalExpense = this.utilsService.getTotalWithReduce(this.statements, 'expense');
          this.totalIncome = this.utilsService.getTotalWithReduce(this.statements, 'income');
          this.totalPurchaseAmount = this.utilsService.getTotalWithReduce(this.statements, 'purchaseAmount');
        },
        error: err => {
          console.log(err)
        }
      })
  }

  /**
   * FILTER DATA & Sorting
   * setDefaultFilter()
   * filterData()
   * endChangeRegDateRange()
   * sortData()
   * onRemoveAllQuery()
   */

  private setDefaultFilter() {
    this.isDefaultFilter = true;
    const month = this.utilsService.getDateMonth(false, new Date());
    const year = new Date().getFullYear();

    this.filter = {
      ...this.filter, ...{
        month: month - 1,
        year: year,
      }
    }
    this.activeFilterMonth = this.months.findIndex(f => f.value === month);
    this.activeFilterYear = this.years.findIndex(f => f.value === year);
  }

  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'month': {
        this.isDefaultFilter = false;
        this.filter = {'month': value - 1};
        this.activeFilterMonth = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    this.getAllStatement();
  }

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.end
      );

      const qData = {dateString: {$gte: startDate, $lte: endDate}};
      this.isDefaultFilter = false;
      this.filter = {...qData};
      // const index = this.filter.findIndex(x => x.hasOwnProperty('createdAt'));

      // Re fetch Data
      this.getAllStatement();
    }
  }

  onRemoveAllQuery() {
    this.activeFilterMonth = null;
    this.filter = null;
    this.dataFormDateRange.reset();
    this.setDefaultFilter();
    // Re fetch Data
    this.getAllStatement();
  }

  /**
   * EXPORTS TO EXCEL
   * exportToExcel()
   */

  exportToAllExcel() {
    const date = this.utilsService.getDateString(new Date());
    // EXPORT XLSX
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.statements);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `Statement_Reports_${date}.xlsx`);
  }

  /**
   * Get Shop Info
   * getShopInformation() $
   */
  private getShopInformation() {
    this.subShopInfo = this.shopInformationService.getShopInformation()
      .subscribe({
        next: res => {
          this.shopInformation = res.data;
        },
        error: err => {
          console.log(err);
        }
      })
  }

  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

    if (this.subShopInfo) {
      this.subShopInfo.unsubscribe();
    }

  }
}
