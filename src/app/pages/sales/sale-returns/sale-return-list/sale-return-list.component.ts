import {Component, OnInit, ViewChild} from '@angular/core';
import {UiService} from "../../../../services/core/ui.service";
import {Router} from "@angular/router";
import {ReloadService} from "../../../../services/core/reload.service";
import {EMPTY, Subscription} from "rxjs";
import {FilterData} from "../../../../interfaces/gallery/filter-data";
import {AdminPermissions} from '../../../../enum/admin-permission.enum';
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {UtilsService} from "../../../../services/core/utils.service";
import {debounceTime, distinctUntilChanged, pluck, switchMap} from "rxjs/operators";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as XLSX from 'xlsx';
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {Select} from '../../../../interfaces/core/select';
import {MONTHS, YEARS} from '../../../../core/utils/app-data';
import {SalesReturnService} from '../../../../services/common/sales-return.service';
import {SaleReturnCalculation, SalesReturn} from '../../../../interfaces/common/sales-return.interface';
import {ShopInformation} from '../../../../interfaces/common/shop-information.interface';
import {ShopInformationService} from '../../../../services/common/shop-information.service';

@Component({
  selector: 'app-sale-return-list',
  templateUrl: './sale-return-list.component.html',
  styleUrls: ['./sale-return-list.component.scss'],
})
export class SaleReturnListComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Static Data
  months: Select[] = MONTHS;
  years: Select[] = YEARS;

  // Store Data
  isLoading: boolean = true;
  sales: { _id: string, data: SalesReturn[], total: number }[] = [];
  holdPrevData: any[] = [];
  id?: string;
  calculation: SaleReturnCalculation = null;
  holdCalculation: SaleReturnCalculation = null;

  // FilterData
  isDefaultFilter: boolean = false;
  filter: any = null;
  sortQuery: any = null;
  activeFilter1: number = null;
  activeFilterMonth: number = null;
  activeFilterYear: number = null;
  activeSort: number;
  number = [{num: '10'}, {num: '25'}, {num: '50'}, {num: '100'}];

  // Shop data
  shopInformation: ShopInformation;

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  // Date
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  // Search Area
  @ViewChild('searchForm') searchForm: NgForm;
  searchQuery = null;
  searchSale: SalesReturn[] = [];

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataExport: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;
  private subShopInfo: Subscription;

  constructor(
    private salesReturnService: SalesReturnService,
    private uiService: UiService,
    protected utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private shopInformationService: ShopInformationService,
  ) {
  }

  ngOnInit(): void {

    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllSale();
    });

    // Set Default Filter
    this.setDefaultFilter();
    // Base Data
    this.getAllSale();
    this.getShopInformation();
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue
      .pipe(
        // map(t => t.searchTerm)
        // filter(() => this.searchForm.valid),
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          this.searchQuery = data;
          if (this.searchQuery === '' || this.searchQuery === null) {
            this.searchSale = [];
            this.sales = this.holdPrevData;
            this.calculation = this.holdCalculation;
            this.searchQuery = null;
            return EMPTY;
          }

          // Select
          const mSelect = {
            salesman: 1,
            returnDate: 1,
            returnDateString: 1,
            charge: 1,
            subTotal: 1,
            grandTotal: 1,
            totalPurchasePrice: 1,
            customer: 1,
            note: 1,
            invoiceNo: 1,
            products: 1,
          };

          const filterData: FilterData = {
            pagination: null,
            filter: this.filter,
            select: mSelect,
            sort: {returnDate: -1},
          };

          return this.salesReturnService.getAllSalesReturn(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.searchSale = res.data;
          this.sales = this.utilsService.arrayGroupByField(this.searchSale, 'returnDate', 'amount');
          // Calculation Data
          this.calculation = res.calculation;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  /**
   * CHECK ADMIN PERMISSION
   * checkAddPermission()
   * checkDeletePermission()
   * checkEditPermission()
   * getAdminBaseData()
   */
  checkAddPermission(): boolean {
    return this.permissions.includes(AdminPermissions.CREATE);
  }

  checkDeletePermission(): boolean {
    return this.permissions.includes(AdminPermissions.DELETE);
  }

  checkEditPermission(): boolean {
    return this.permissions.includes(AdminPermissions.EDIT);
  }


  /**
   * HTTP REQ HANDLE
   * getAllSale()
   * deleteSaleById()
   */

  private getAllSale() {
    // Spinner..
    this.spinner.show();
    // Select
    const mSelect = {
      salesman: 1,
      returnDate: 1,
      returnDateString: 1,
      charge: 1,
      subTotal: 1,
      grandTotal: 1,
      totalPurchasePrice: 1,
      customer: 1,
      note: 1,
      invoiceNo: 1,
      products: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: {returnDate: -1},
    };

    this.subDataOne = this.salesReturnService
      .getAllSalesReturn(filter, null)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.spinner.hide();
          if (res.success) {
            this.sales = this.utilsService.arrayGroupByFieldComplexCalc(res.data, 'returnDateString', 'sale_return');
            this.holdPrevData = this.sales;
            // Calculation Data
            this.calculation = res.calculation;
            this.holdCalculation = this.calculation;
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.spinner.hide();
          console.log(err);
        },
      });
  }

  private deleteMultipleSaleById() {
    this.spinner.show();
    this.subDataThree = this.salesReturnService
      .deleteMultipleSalesReturnById(this.selectedIds)
      .subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.selectedIds = [];
            this.uiService.success(res.message);
            this.reloadService.needRefreshData$();
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.spinner.hide();
          console.log(error);
        }
      })
  }

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
        month: month,
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
        this.filter = {'month': value};
        this.activeFilterMonth = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    this.getAllSale();
  }

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.end
      );

      const qData = {returnDateString: {$gte: startDate, $lte: endDate}};
      this.isDefaultFilter = false;
      this.filter = { ...qData};
      // const index = this.filter.findIndex(x => x.hasOwnProperty('createdAt'));

      // Re fetch Data
      this.getAllSale();
    }
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllSale();
  }

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilterMonth = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    this.dataFormDateRange.reset();
    this.setDefaultFilter();
    // Re fetch Data
    this.getAllSale();
  }


  /**
   * ON Select Check
   * onCheckChange()
   * onAllSelectChange()
   * checkSelectionData()
   */

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.findIndex((f) => f === id);
      this.selectedIds.splice(i, 1);
    }
  }

  onAllSelectChange(event: MatCheckboxChange, data: SalesReturn[], index: number) {
    const currentPageIds = data.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.sales[index].data.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.sales[index].data.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }

  /**
   * EXPORTS TO EXCEL
   * exportToExcel()
   */

  exportToAllExcel() {
    const date = this.utilsService.getDateString(new Date());

    // Select
    const mSelect = {
      date: 1,
      dateString: 1,
      saleFor: 1,
      amount: 1,
      description: 1,
      createdAt: 1,
    };

    const filterData: FilterData = {
      filter: this.filter,
      select: mSelect,
      sort: {dateString: -1},
    };

    this.subDataExport = this.salesReturnService
      .getAllSalesReturn(filterData, this.searchQuery)
      .subscribe({
        next: (res) => {
          // EXPORT XLSX
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(res.data);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Data');
          XLSX.writeFile(wb, `Sale_Reports_${date}.xlsx`);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   */
  public openConfirmDialog(type: string, data?: any) {
    switch (type) {
      case 'delete': {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Delete',
            message: 'Are you sure you want delete this data?',
          },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            this.deleteMultipleSaleById();
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }


  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }

    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }


    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }

    if (this.subForm) {
      this.subForm.unsubscribe();
    }

    if (this.subReload) {
      this.subReload.unsubscribe();
    }
    if (this.subDataExport) {
      this.subDataExport.unsubscribe();
    }
    if (this.subShopInfo) {
      this.subShopInfo.unsubscribe();
    }
  }
}
