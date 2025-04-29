import {Component, OnInit, ViewChild} from '@angular/core';
import {AdminPermissions} from "../../../enum/admin-permission.enum";
import {ShopInformation} from "../../../interfaces/common/shop-information.interface";
import {Select} from "../../../interfaces/core/select";
import {MONTHS, YEARS} from "../../../core/utils/app-data";
import {Shop} from "../../../interfaces/common/shop.interface";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {EMPTY, Subscription} from "rxjs";
import {ShopService} from "../../../services/common/shop.service";
import {UiService} from "../../../services/core/ui.service";
import {UtilsService} from "../../../services/core/utils.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ReloadService} from "../../../services/core/reload.service";
import {ShopInformationService} from "../../../services/common/shop-information.service";
import {debounceTime, distinctUntilChanged, pluck, switchMap} from "rxjs/operators";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as XLSX from "xlsx";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {DatePipe} from "@angular/common";
import {DATABASE_KEY} from "../../../core/utils/global-variable";
import {StorageService} from "../../../services/core/storage.service";

@Component({
  selector: 'app-all-branch-list',
  templateUrl: './all-branch-list.component.html',
  styleUrls: ['./all-branch-list.component.scss'],
  providers: [DatePipe]
})
export class AllBranchListComponent  implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Shop data
  shopInformation: ShopInformation;

  // Static Data
  months: Select[] = MONTHS;
  years: Select[] = YEARS;

  // Store Data
  isLoading: boolean = true;
  private allShop: Shop[] = [];
  private holdAllShop: Shop[] = [];
  shops: { _id: string, data: Shop[], total: number }[] = [];
  holdPrevData: any[] = [];
  id?: string;
  shopName?: string;
  calculation: { totalAmount: number } = null;
  holdCalculation: { totalAmount: number } = null;

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
  searchShop: Shop[] = [];

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
    private shopService: ShopService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private shopInformationService: ShopInformationService,
    private storageService: StorageService,
  ) {
  }

  ngOnInit(): void {

    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllShop();
    });

    // Set Default Filter
    this.setDefaultFilter();
    // Base Data
    this.getAllShop();
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
            this.searchShop = [];
            this.shops = this.holdPrevData;
            this.allShop = this.holdAllShop;
            this.calculation = this.holdCalculation;
            this.searchQuery = null;
            return EMPTY;
          }

          // Select
          const mSelect = {
            name: 1,
            email: 1,
            phoneNo: 1,
            address: 1,
            createdAt: 1,
          };

          const filterData: FilterData = {
            pagination: null,
            filter: null,
            select: mSelect,
            sort: {dateString: -1},
          };

          return this.shopService.getAllShop(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.searchShop = res.data;
          this.allShop = res.data;
          this.shops = this.utilsService.arrayGroupByField(this.searchShop, 'dateString', 'amount');
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
   * getAllShop()
   * deleteShopById()
   */

  private getAllShop() {
    // Spinner..
    this.spinner.show();
    // Select
    const mSelect = {

      name: 1,
      email: 1,
      phoneNo: 1,
      address: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: null,
      pagination: null,
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataOne = this.shopService
      .getAllShop(filter, null)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.spinner.hide();
          if (res.success) {
            this.allShop = res.data;
            this.holdAllShop = this.allShop;
            this.shops = this.utilsService.arrayGroupByField(res.data, 'dateString', 'amount');
            this.holdPrevData = this.shops;
            // Calculation Data
            this.calculation = res.calculation;
            this.holdCalculation = this.calculation;

            const shop_Id= this.storageService.getDataFromEncryptLocal(
              DATABASE_KEY.encryptShop
            );

            this.shopName = this.allShop.find(f=> f._id === shop_Id.shop)?.name


          }
        },
        error: (err) => {
          this.isLoading = false;
          this.spinner.hide();
          console.log(err);
        },
      });
  }

  deleteShopById(id: any) {
    this.subDataTwo = this.shopService.deleteShopById(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.uiService.warn(`Brand Deleted`);
          this.reloadService.needRefreshBrand$();
          this.router.navigate(['/product/', 'brand-list']);
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private deleteMultipleShopById() {
    this.spinner.show();
    this.subDataThree = this.shopService
      .deleteMultipleShopById(this.selectedIds)
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
        // this.filter = {'month': value};
        this.activeFilterMonth = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    this.getAllShop();
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
      this.getAllShop();
    }
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllShop();
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
    this.getAllShop();
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

  onAllSelectChange(event: MatCheckboxChange, data: Shop[], index: number) {
    const currentPageIds = data.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.shops[index].data.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.shops[index].data.find((f) => f._id === m).select = false;
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
        const data = this.allShop.find(f => f._id === id);
        const mData = {

          name: data?.name,
          phoneNo: data?.phoneNo,
          email: data?.email,
          address: data?.address,
        }
        selectedSales.push(mData);
      })

      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedSales);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Shop_${date}.xlsx`);

    } else {

      const mData = this.allShop.map(m=>{

          const nData  = {
            name: m?.name,
            phoneNo: m?.phoneNo,
            email: m?.email,
            address: m?.address,
          }

          return nData

        }


      )


      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Branch${date}.xlsx`);
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
            this.deleteMultipleShopById();
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
    if (this.subDataExport) {
      this.subDataExport.unsubscribe();
    }

    if (this.subShopInfo) {
      this.subShopInfo.unsubscribe();
    }
  }

  onSelect(shop: string) {

    this.storageService.addDataToEncryptLocal(
      {shop},
      DATABASE_KEY.encryptShop
    );

    // Get Shop Id
    this.getCurrentShop()
  }


  protected getCurrentShop() {
    setTimeout(()=>{
      window.location.reload()
    },400)

    return this.storageService.getDataFromEncryptLocal(
      DATABASE_KEY.encryptShop
    );
  }
}
