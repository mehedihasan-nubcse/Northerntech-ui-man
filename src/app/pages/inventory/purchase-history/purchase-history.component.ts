import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UiService} from "../../../services/core/ui.service";
import {Router} from "@angular/router";
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
import {PurchaseService} from '../../../services/common/purchase.service';
import {ProductPurchase} from '../../../interfaces/common/product-purchase.interface';
import {ShopInformationService} from '../../../services/common/shop-information.service';
import {ShopInformation} from '../../../interfaces/common/shop-information.interface';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from "rxjs/operators";
import {Pagination} from "../../../interfaces/core/pagination";
import {DatePipe} from "@angular/common";
import {AdminService} from "../../../services/admin/admin.service";
import {Vendor} from "../../../interfaces/common/vendor.interface";
import {VendorService} from "../../../services/common/vendor.service";

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss'],
  providers:[DatePipe]
})
export class PurchaseHistoryComponent implements OnInit, OnDestroy {
  // Admin Base Data
  adminId: string;
  vendors: Vendor[] = [];
  activeFilter4: number = null;
  activeFilter3: number = null;
  role: string;
  permissions: AdminPermissions[];
  allPurchaseByDate: any[] = [];
  purchasePriceGrandTotal: number = 0;
  totalPurchaseGrandTotal: number = 0;
  // Static Data
  months: Select[] = MONTHS;
  years: Select[] = YEARS;
  private subDataFive: Subscription;

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


  // Pagination
  currentPage = 1;
  totalPurchase = 0;
  CategoryPerPage = 25;
  totalPurchaseStore = 0;

  // FilterData
  isDefaultFilter: boolean = false;
  isDefaultFilter1: boolean = false;
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
    private vendorService: VendorService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private shopInformationService: ShopInformationService,
  ) {
  }

  ngOnInit(): void {

    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllPurchase();
    });

    // Set Default Filter
    this.setDefaultFilter();
    // Base Data
    this.getAllPurchase();
    this.getShopInformation();
    this.getAdminBaseData();
    this.getAllVendors();
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
            this.searchPurchase = [];
            this.purchases = this.holdPrevData;
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
            updatedQuantity: 1,
            previousQuantity: 1,
            dateString: 1,
            createdAtString: 1,
            category: 1,
            updatedAtString: 1,
            month: 1,
            year: 1,
            salesman: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: this.filter,
            select: mSelect,
            sort: {createdAt: -1},
          };

          return this.purchaseService
            .getAllPurchase(
              filterData,
              this.searchQuery
            );
        })
      )
      .subscribe({
        next: (res) => {
          this.searchPurchase = res.data;

          this.allPurchase = res.data;
          this.holdAllPurchase = this.allPurchase;

          this.purchases = this.utilsService.processPurchaseData(res.data);

          this.allPurchaseByDate = this.purchases.allPurchaseByDate;
          this.purchasePriceGrandTotal = this.purchases.purchasePriceGrandTotal;
          this.totalPurchaseGrandTotal = this.purchases.totalPurchaseGrandTotal;
          // this.purchases = this.utilsService.arrayGroupByFieldComplexCalc(res.data, 'dateString', 'purchase_history');
          this.holdPrevData = this.purchases;


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
      imei: 1,
      year: 1,
      note: 1,
      salesman: 1,
      vendor: 1,
    };

    const filter: FilterData = {
      filter: {...this.filter,...{'updatedQuantity':{$gt:0}}},
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
    return  formattedDate;
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
      case 'vendor': {
        this.isDefaultFilter1 = true;
        this.filter = {...this.filter, ...{'product.vendor.name': value}};
        this.activeFilter3 = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    this.getAllPurchase();
  }

  private getAllVendors() {
    // Select
    const mSelect = {
      name: 1,
      phone: 1,
    };

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {name: 1},
    };

    this.subDataFive = this.vendorService.getAllVendors(filterData, null).subscribe({
      next: (res) => {
        this.vendors = res.data;
      },
      error: (error) => {
        console.log(error);
      },
    });
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
    this.isDefaultFilter1 = false;
    this.activeFilterMonth = null;
    this.activeFilter3 = null;
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
        const data = this.allPurchaseByDate.find(f => f._id === id);
        selectedSales.push(data);
      });

      const mData = selectedSales.flatMap(sale => {
        return sale.purchases.map(m => {
          return {
            'Product': m.name,
            'Storage': m.sizes,
            'IMEI': m.imei,
            'Colour': m.colors,
            // 'Previous Quantity': m.previousQuantity,
            'Quantity (+/-)': m.updatedQuantity,
            'Purchase Price': m.purchasePrice,
            'Total Purchase': m.purchasePrice * (m.updatedQuantity - m.previousQuantity),
            'Note': m.note,
            'In Person Name': m.salesman,
            'Date': sale.date,
            'Time': m.createTime,
          };
        });
      });

      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Purchase_History_${date}.xlsx`);
    } else {
      const mData = this.allPurchaseByDate.flatMap(sale => {
        return sale.purchases.map(m => {
          return {
            'Product': m.name,
            'Storage': m.sizes,
            'IMEI': m.imei,
            'Colour': m.colors,
            // 'Previous Quantity': m.previousQuantity,
            'Quantity (+/-)': m.updatedQuantity,
            'Purchase Price': m.purchasePrice,
            'Total Purchase': m.purchasePrice * (m.updatedQuantity - m.previousQuantity),
            'Note': m.note,
            'In Person Name': m.salesman,
            'Date': sale.date,
            'Time': m.createTime,
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

  totalPurchaseData(data1:any) {
    return  data1.data.map(data => ( data?.product?.purchasePrice)).reduce((acc, value) => acc + value, 0)
  }


}
