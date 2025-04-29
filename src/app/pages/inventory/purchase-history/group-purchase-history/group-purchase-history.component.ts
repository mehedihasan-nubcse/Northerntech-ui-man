import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AdminPermissions} from "../../../../enum/admin-permission.enum";
import {Select} from "../../../../interfaces/core/select";
import {MONTHS, YEARS} from "../../../../core/utils/app-data";
import {ProductPurchase} from "../../../../interfaces/common/product-purchase.interface";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {ShopInformation} from "../../../../interfaces/common/shop-information.interface";
import {combineLatest, Subscription} from "rxjs";
import {DatePipe} from "@angular/common";
import {PurchaseService} from "../../../../services/common/purchase.service";
import {UiService} from "../../../../services/core/ui.service";
import {UtilsService} from "../../../../services/core/utils.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../../../services/admin/admin.service";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ReloadService} from "../../../../services/core/reload.service";
import {ShopInformationService} from "../../../../services/common/shop-information.service";
import {FilterData} from "../../../../interfaces/gallery/filter-data";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as XLSX from "xlsx";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-group-purchase-history',
  templateUrl: './group-purchase-history.component.html',
  styleUrls: ['./group-purchase-history.component.scss'],
  providers: [DatePipe]
})
export class GroupPurchaseHistoryComponent implements OnInit, OnDestroy {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];
  allPurchaseByDate: any;
  purchasePriceGrandTotal: number = 0;
  date: any;
  totalPurchaseGrandTotal: number = 0;
  // Static Data
  months: Select[] = MONTHS;
  years: Select[] = YEARS;


  // Store Data
  isLoading: boolean = true;
  allPurchase: ProductPurchase[] = [];
  private holdAllPurchase: ProductPurchase[] = [];
  // purchases: { _id: string, data: ProductPurchase[], total: number, test: number }[] = [];
  purchases: any;
  holdPrevData: any[] = [];
  purchase: ProductPurchase[] = [];
  id?: string;
  calculation: { totalAmount: number } = null;
  holdCalculation: { totalAmount: number } = null;
  productId: any;
  dateString: any;

  // Pagination
  currentPage = 1;
  totalPurchase = 0;
  CategoryPerPage = 25;
  totalPurchaseStore = 0;

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
  searchPurchase: ProductPurchase[] = [];

  // Shop data
  shopInformation: ShopInformation;

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
    private purchaseService: PurchaseService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private adminService: AdminService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private shopInformationService: ShopInformationService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  // ngOnInit(): void {
  //   this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
  //     this.productId = param.get('id');
  //
  //     if (this.productId) {
  //       this.getSimilarProducts();
  //     }
  //   });
  //
  //   // GET DATA FORM QUERY PARAM
  //   this.activatedRoute.queryParamMap.subscribe((qParam) => {
  //     this.dateString = qParam.get('dateString');
  //     console.log(
  //       "dateString", this.dateString
  //     )
  //   });
  //   // // Reload Data
  //   this.subReload = this.reloadService.refreshData$.subscribe(() => {
  //     this.getSimilarProducts();
  //   });
  //
  //   // Set Default Filter
  //   this.setDefaultFilter();
  //   // Base Data
  //   // this.getAllPurchase();
  //   this.getShopInformation();
  //   this.getAdminBaseData();
  // }

  ngOnInit(): void {
    // Combine Route Parameters and Query Parameters
    this.subRouteOne = combineLatest([
      this.activatedRoute.paramMap,
      this.activatedRoute.queryParamMap
    ]).subscribe(([param, qParam]) => {
      // Extract Product ID from Route Parameters
      this.productId = param.get('id');

      // Extract Date String from Query Parameters
      this.dateString = qParam.get('dateString');
      console.log("dateString:", this.dateString);

      // Fetch Similar Products if Product ID Exists
      if (this.productId && this.dateString) {
        this.getSimilarProducts();
      }
    });

    // Reload Data on Refresh Event
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getSimilarProducts();
    });

    // Set Default Filter
    this.setDefaultFilter();

    // Fetch Initial Data
    this.getShopInformation();
    this.getAdminBaseData();
  }


  getSimilarProducts() {
    this.purchaseService.getSimilarProducts(this.productId,this.dateString).subscribe(
      (data) => {
        this.purchases = data;

        console.log("data",data)
        this.allPurchaseByDate = [this.purchases];
        this.date = data?.date;
        this.purchasePriceGrandTotal = data.purchasePriceTotal;
        this.totalPurchaseGrandTotal = data.totalPurchaseTotal;
        // this.productCalculation = data?.calculation;
        // console.log('this.products', this.allPurchaseByDate)
      },
      (error) => {
        console.error(error);
      }
    );

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


  /**
   * HTTP REQ HANDLE
   * getAllPurchase()
   * getShopInformation()
   * deleteMultiplePurchaseById()
   */

  private getAllPurchase() {
    // Spinner..
    this.spinner.show();
    // Select
    const mSelect = {
      product: 1,
      updatedQuantity: 1,
      previousQuantity: 1,
      dateString: 1,
      createTime: 1,
      createdAtString: 1,
      updatedAtString: 1,
      month: 1,
      year: 1,
      note: 1,
      salesman: 1,
    };

    const filter: FilterData = {
      filter: {...this.filter, ...{'updatedQuantity': {$gte: 0}}},
      pagination: null,
      select: mSelect,
      sort: {dateString: -1},
    };

    this.subDataOne = this.purchaseService
      .getAllPurchase(filter, null)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.spinner.hide();
          if (res.success) {
            this.allPurchase = res.data;
            this.holdAllPurchase = this.allPurchase;
            this.purchases = this.utilsService.processPurchaseData(res.data);

            this.allPurchaseByDate = this.purchases.allPurchaseByDate;
            this.purchasePriceGrandTotal = this.purchases.purchasePriceGrandTotal;
            this.totalPurchaseGrandTotal = this.purchases.totalPurchaseGrandTotal;

            // this.purchases = this.utilsService.arrayGroupByFieldComplexCalc(res.data, 'dateString', 'purchase_history');
            this.holdPrevData = this.purchases;


            // console.log('Processed Data:', this.allPurchaseByDate);

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
    return formattedDate;
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


  private deleteMultiplePurchaseById() {
    this.spinner.show();
    this.subDataThree = this.purchaseService
      .deleteMultiplePurchaseById(this.selectedIds)
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
    this.getAllPurchase();
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
      this.getAllPurchase();
    }
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllPurchase();
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
    this.getAllPurchase();
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

  onAllSelectChange(event: MatCheckboxChange, data: ProductPurchase[], index: number) {
    console.log('data', data)
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

    // If selectedIds are available, process selected sales
    if (this.selectedIds.length) {
      const selectedSales = [];
      this.selectedIds.forEach(id => {
        const data = this.allPurchaseByDate[0]?.purchases.find(f => f._id === id);
        selectedSales.push(data);
      });

      const mData = selectedSales.map(m => {
        return {
          'Product': m.name,
          'Storage': m.sizes?.name,
          'IMEI': m.imei,
          'Colour': m.colors?.name,
          'Previous Quantity': m.previousQuantity,
          'Quantity (+/-)': m.updatedQuantity,
          'Purchase Price': m.purchasePrice,
          'Total Purchase': m.purchasePrice * (m.updatedQuantity - m.previousQuantity),
          'Note': m.note,
          'In Person Name': m.salesman,
          'Date': m.createdAtString,
          'Time': m.createTime,
        };
      });

      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Purchase_History_${date}.xlsx`);

    } else if (this.allPurchaseByDate[0]?.purchases && this.allPurchaseByDate[0].purchases.length > 0) {
      // If no selected IDs, process all purchases
      const mData = this.allPurchaseByDate[0].purchases.map(m => {
        return {
          'Product': m.name,
          'Storage': m.sizes?.name,
          'IMEI': m.imei,
          'Colour': m.colors?.name,
          'Previous Quantity': m.previousQuantity,
          'Quantity (+/-)': m.updatedQuantity,
          'Purchase Price': m.purchasePrice,
          'Total Purchase': m.purchasePrice * (m.updatedQuantity - m.previousQuantity),
          'Note': m.note,
          'In Person Name': m.salesman,
          'Date': m.createdAtString,
          'Time': m.createTime,
        };
      });

      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Purchase_History_${date}.xlsx`);

    } else {
      console.error('No purchases available to export.');
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
            this.deleteMultiplePurchaseById();
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

    if (this.subShopInfo) {
      this.subShopInfo.unsubscribe();
    }
  }

  totalPurchaseData(data1: any) {
    return data1.data.map(data => (data?.product?.purchasePrice)).reduce((acc, value) => acc + value, 0)
  }



}
