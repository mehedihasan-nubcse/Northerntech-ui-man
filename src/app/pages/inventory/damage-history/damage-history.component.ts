import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UiService} from "../../../services/core/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ReloadService} from "../../../services/core/reload.service";
import {EMPTY, Subscription} from "rxjs";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {AdminPermissions} from 'src/app/enum/admin-permission.enum';
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {UtilsService} from "../../../services/core/utils.service";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as XLSX from 'xlsx';
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {Select} from '../../../interfaces/core/select';
import {MONTHS, YEARS} from '../../../core/utils/app-data';
import {ProductDamage} from '../../../interfaces/common/product-damage.interface';
import {ProductDamageService} from '../../../services/common/product-damage.service';
import {ShopInformation} from '../../../interfaces/common/shop-information.interface';
import {ShopInformationService} from '../../../services/common/shop-information.service';
import {DatePipe} from "@angular/common";
import {AdminService} from '../../../services/admin/admin.service';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from "rxjs/operators";
import {Pagination} from "../../../interfaces/core/pagination";

@Component({
  selector: 'app-damage-history',
  templateUrl: './damage-history.component.html',
  styleUrls: ['./damage-history.component.scss'],
  providers:[DatePipe]
})
export class DamageHistoryComponent implements OnInit, OnDestroy {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];
  allPurchaseByDate: any[] = [];
  purchasePriceGrandTotal: number = 0;
  totalPurchaseGrandTotal: number = 0;
  // Static Data
  months: Select[] = MONTHS;
  years: Select[] = YEARS;

  // Store Data
  isLoading: boolean = true;
  allDamage: ProductDamage[] = [];
  private holdAllDamage: ProductDamage[] = [];
  // damages: { _id: string, data: ProductDamage[], total: number }[] = [];
  damages: any;
  holdPrevData: any[] = [];
  id?: string;
  calculation: { totalAmount: number } = null;
  holdCalculation: { totalAmount: number } = null;
  // Pagination
  currentPage = 1;
  totalPurchase = 0;
  CategoryPerPage = 25;
  totalPurchaseStore = 0;

  // Shop data
  shopInformation: ShopInformation;

  // FilterData
  isDefaultFilter: boolean = false;
  filter: any = null;
  sortQuery: any = null;
  activeFilter1: number = null;
  activeFilterMonth: number = null;
  activeFilterYear: number = null;
  activeSort: number;
  number = [{num: '10'}, {num: '25'}, {num: '50'}, {num: '100'}];

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
  searchDamage: ProductDamage[] = [];

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;
  private subDataExport: Subscription;
  private subShopInfo: Subscription;

  constructor(
    private datePipe: DatePipe,
    private damageService: ProductDamageService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private adminService: AdminService,
    private shopInformationService: ShopInformationService,
  ) {
  }

  ngOnInit(): void {

    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllDamage();
    });

    this.activatedRoute.paramMap.subscribe(param => {
      if (param.get('id')) {
        this.filter = {'product._id': param.get('id')}
      }
    })

    // Set Default Filter
    this.setDefaultFilter();
    // Base Data
    this.getAllDamage();
    this.getShopInformation();

    this.getAdminBaseData();
  }


  /**
   * CHECK ADMIN PERMISSION
   * checkAddPermission()
   * checkDeletePermission()
   * checkEditPermission()
   */
  private getAdminBaseData() {
    this.adminId = this.adminService.getAdminId();
    this.role = this.adminService.getAdminRole();
    this.permissions = this.adminService.getAdminPermissions();
  }

  get checkAddPermission(): boolean {
    return this.permissions.includes(AdminPermissions.CREATE);
  }

  get checkDeletePermission(): boolean {
    return this.permissions.includes(AdminPermissions.DELETE);
  }

  get checkEditPermission(): boolean {
    return this.permissions.includes(AdminPermissions.EDIT);
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue
      .pipe(
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          this.searchQuery = data;
          if (this.searchQuery === '' || this.searchQuery === null) {
            this.searchDamage = [];
            this.damages = this.holdPrevData;
            this.totalPurchase = this.totalPurchaseStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.CategoryPerPage),
            currentPage: Number(this.currentPage) - 1,
          };

          // Select
          const mSelect = {
            product: 1,
            quantity: 1,
            updateTime: 1,
            category: 1,
            salesman: 1,
            dateString: 1,
            month: 1,
            year: 1,
            note: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: {createdAt: -1},
          };

          return this.damageService
            .getAllProductDamage(
              filterData,
              this.searchQuery
            );
        })
      )
      .subscribe({
        next: (res) => {
          this.searchDamage = res.data;

          this.allDamage = res.data;
          this.holdAllDamage = this.allDamage;

          this.damages = this.utilsService.processOutStockData(res?.data);
          // console.log('erqwr334e', this.damages);
          this.allPurchaseByDate = this.damages.allPurchaseByDate;
          this.purchasePriceGrandTotal = this.damages.purchasePriceGrandTotal;
          this.totalPurchaseGrandTotal = this.damages.totalPurchaseGrandTotal;

          this.holdAllDamage = this.allDamage;
          // this.damages = this.utilsService.arrayGroupByFieldComplexCalc(res.data, 'dateString', 'damage_history');
          // console.log('erqwre', this.damages);
          this.holdPrevData = this.damages;


          // this.purchase = this.searchPurchase;
          this.totalPurchase = res.count;
          this.currentPage = 1;
          this.router.navigate([], {queryParams: {page: this.currentPage}});
        },
        error: (error) => {
          console.log(error);
        },
      });
  }


  /**
   * HTTP REQ HANDLE
   * getAllDamage()
   * deleteMultipleDamageById()
   */

  private getAllDamage() {
    // Spinner..
    this.spinner.show();
    // Select
    const mSelect = {
      product: 1,
      quantity: 1,
      updateTime: 1,
      category: 1,
      salesman: 1,
      dateString: 1,
      month: 1,
      year: 1,
      note: 1,

    };

    const filter: FilterData = {
      filter: {...this.filter,...{'quantity':{$lte:0}}},
      pagination: null,
      select: mSelect,
      sort: {dateString: -1},
    };

    this.subDataOne = this.damageService
      .getAllProductDamage(filter, null)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.spinner.hide();
          if (res.success) {
            this.allDamage = res.data;
            // this.allDamage = res.data.filter(f=> f.quantity <0);
            // console.log("this.allDamage",this.allDamage)
            this.damages = this.utilsService.processOutStockData(res?.data);
            // console.log('erqwr334e', this.damages);
            this.allPurchaseByDate = this.damages.allPurchaseByDate;
            this.purchasePriceGrandTotal = this.damages.purchasePriceGrandTotal;
            this.totalPurchaseGrandTotal = this.damages.totalPurchaseGrandTotal;

            this.holdAllDamage = this.allDamage;
            // this.damages = this.utilsService.arrayGroupByFieldComplexCalc(res.data, 'dateString', 'damage_history');
            // console.log('erqwre', this.damages);
            this.holdPrevData = this.damages;
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

  getDay(data: any) {
    let dateString: string = data;
    let myDate: Date = new Date(dateString); // Parsing the string into a Date object
    let formattedDate: string = this.datePipe.transform(myDate, 'EEEE'); // 'EEEE' is the format for the full name of the day of the week
    return  formattedDate;
  }

  private deleteMultipleDamageById() {
    this.spinner.show();
    this.subDataThree = this.damageService
      .deleteMultipleProductDamageById(this.selectedIds)
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



  /**
   * FILTER DATA & Sorting
   * filterData()
   * setDefaultFilter()
   * endChangeRegDateRange()
   * sortData()
   * onRemoveAllQuery()
   */


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
    this.getAllDamage();
  }

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
      this.getAllDamage();
    }
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllDamage();
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
    this.getAllDamage();
  }


  /**
   * ON Select Check
   * onCheckChange()
   * onAllSelectChange()
   */

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.findIndex((f) => f === id);
      this.selectedIds.splice(i, 1);
    }
  }

  onAllSelectChange(event: MatCheckboxChange, data: ProductDamage[], index: number) {
    const currentPageIds = data.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.allPurchaseByDate[index].purchases.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.allPurchaseByDate[index].purchases.find((f) => f._id === m).select = false;
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

    if (this.selectedIds.length) {

      const selectedSales = [];
      this.selectedIds.forEach(id => {
        const data = this.allDamage.find(f => f._id === id);
        selectedSales.push(data);
      });

      const mData = selectedSales.map(m => {
        return {
          'Date': m.dateString,
          'Time': m.updateTime,
          'Product': m.product?.name,
          'Out Person Name': m.salesman,
          'Quantity (+/-)': m.quantity,
          'Amount': (m?.product?.purchasePrice * m?.quantity),
          'Note': m.note,
        }
      })

      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Out_Stock_History_${date}.xlsx`);

    } else {
      const mData = this.allPurchaseByDate.flatMap(sale => {
        return sale.purchases.map(m => {
          return {
                'Date': m.dateString,
                'Time': m.updateTime,
                'Product': m.name,
                'Out Person Name': m.salesman,
                'Quantity (+/-)': m.quantity,
                'Amount': (m?.purchasePrice * m?.quantity),
                'Note': m.note,
          };
        });
      });

      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Purchase_History_${date}.xlsx`);
    }
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
            this.deleteMultipleDamageById();
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
    if (this.subShopInfo) {
      this.subShopInfo.unsubscribe();
    }
  }
}
