import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as XLSX from 'xlsx';
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {AdminPermissions} from '../../../enum/admin-permission.enum';
import {Select} from '../../../interfaces/core/select';
import {MONTHS, YEARS} from '../../../core/utils/app-data';
import {Sale, SaleCalculation} from '../../../interfaces/common/sale.interface';
import {ShopInformation} from '../../../interfaces/common/shop-information.interface';
import {Subscription} from 'rxjs';
import {SaleService} from '../../../services/common/sale.service';
import {UiService} from '../../../services/core/ui.service';
import {UtilsService} from '../../../services/core/utils.service';
import {Router} from '@angular/router';
import {ReloadService} from '../../../services/core/reload.service';
import {AdminService} from '../../../services/admin/admin.service';
import {ShopInformationService} from '../../../services/common/shop-information.service';
import {FilterData} from '../../../interfaces/core/filter-data';
import {AdminRolesEnum} from '../../../enum/admin.roles.enum';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {CategoryService} from '../../../services/common/category.service';
import {Category} from '../../../interfaces/common/category.interface';
import {SubCategory} from '../../../interfaces/common/sub-category.interface';
import {SubCategoryService} from '../../../services/common/sub-category.service';
import {SortPipe} from '../../../shared/pipes/sort.pipe';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss'],
  providers: [SortPipe, DecimalPipe]
})
export class SaleListComponent implements OnInit, OnDestroy {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];

  // Static Data
  months: Select[] = MONTHS;
  years: Select[] = YEARS;

  // Data Table
  @ViewChild('dataTable') dataTable: ElementRef;

  // Store Data
  isLoading: boolean = true;
  private allSales: Sale[] = [];
  private holdAllSales: Sale[] = [];
  reportsData: {
    _id: string,
    data: any[],
    saleAmount: number,
    purchaseAmount: number,
    totalSaleAmount: number,
    totalPurchaseAmount: number,
    profit: number,
    percent: number,
    quantity: number,
    salePrice: number,
    percentTotal: number,
    soldQuantity: number,
    purchasePrice: number,
    discount: number,
    productName: string,

  }[] = [];
  sales: {
    _id: string,
    data: any[],
    saleAmount: number,
    purchaseAmount: number,
    totalSaleAmount: number,
    totalPurchaseAmount: number,
    profit: number,
    percent: number,
    quantity: number,
    percentTotal: number
  }[] = [];
  holdReportData: any[] = [];
  id?: string;
  calculation: SaleCalculation = null;
  holdCalculation: SaleCalculation = null;
  saleData: Sale = null;

  // Shop data
  shopInformation: ShopInformation;

  // FilterData
  isDefaultFilter: boolean = false;
  filter: any = null;
  sortQuery: any = null;
  activeFilter1: number = null;
  activeFilterMonth: number = null;
  activeFilterCategory: number = null;
  activeFilterSubCategory: number = null;
  activeFilterYear: number = null;
  activeSort: number;

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
  searchSale: Sale[] = [];

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataExport: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;
  private subShopInfo: Subscription;
  private subDataSeven: Subscription;


  constructor(
    private saleService: SaleService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private adminService: AdminService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private shopInformationService: ShopInformationService,
    private sortPipe: SortPipe,
    private decimalPipe: DecimalPipe,
  ) {
  }

  ngOnInit(): void {

    // Base Admin Data
    this.getAdminBaseData();

    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllSale();
    });

    // Set Default Filter
    this.setDefaultFilter();
    // Base Data
    this.getAllSale();
    this.getShopInformation();
    this.getAllCategory();
  }

  /**
   * CHECK ADMIN PERMISSION
   * checkAddPermission()
   * checkDeletePermission()
   * checkEditPermission()
   * getAdminBaseData()
   */
  get checkAddPermission(): boolean {
    return this.permissions.includes(AdminPermissions.CREATE);
  }

  get checkDeletePermission(): boolean {
    return this.permissions.includes(AdminPermissions.DELETE);
  }

  get checkEditPermission(): boolean {
    return this.permissions.includes(AdminPermissions.EDIT);
  }

  private getAdminBaseData() {
    this.adminId = this.adminService.getAdminId();
    this.role = this.adminService.getAdminRole();
    this.permissions = this.adminService.getAdminPermissions();
  }

  /**
   * HTTP REQ HANDLE
   * getAllCategory()
   * getAllSale()
   * deleteSaleById()
   */

  private getSubCategoriesByCategoryId(categoryId: string) {
    const select = 'name category slug'
    this.subDataSeven = this.subCategoryService.getSubCategoriesByCategoryId(categoryId, select)
      .subscribe(res => {
        this.subCategories = res.data;

      }, error => {
        console.log(error);
      });
  }


  private getAllCategory() {
    // Select
    const mSelect = {
      name: 1,
    };

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {name: 1},
    };

    this.subDataOne = this.categoryService
      .getAllCategory(filterData, null)
      .subscribe({
        next: (res) => {
          this.categories = res.data;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }


  private getAllSale() {
    // Spinner..
    this.spinner.show();
    // Select
    const mSelect = {
      invoiceNo: 1,
      date: 1,
      customer: 1,
      products: 1,
      salesman: 1,
      status: 1,
      month: 1,
      soldDate: 1,
      total: 1,
      soldDateString: 1,
      soldTime: 1,
      subTotal: 1,
      discount: 1,
      vatAmount: 1,
      paidAmount: 1,
      totalPurchasePrice: 1,
      receivedFromCustomer: 1,
      paymentType: 1,
      category: 1,
      subcategory: 1
    };

    let mFilter = {...this.filter, ...{status: 'Sale'}};
    if (this.role === AdminRolesEnum.SALESMAN) {
      mFilter = {...mFilter, ...{'salesman._id': this.adminId}}
    }

    const filter: FilterData = {
      filter: mFilter,
      pagination: null,
      select: mSelect,
      sort: {soldDate: -1},
    };

    this.subDataOne = this.saleService
      .getAllSale(filter, null)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.spinner.hide();
          if (res.success) {
            this.allSales = res.data;

            this.holdAllSales = this.allSales;
            // this.sales = this.utilsService.arrayGroupByFieldComplexCalc(this.allSales, 'soldDateString', 'sale');

            // Complex Data
            const reports = [];
            this.allSales.forEach(sale => {
              sale.products.forEach(product => {
                const fIndex = reports.findIndex(f => f.productId === product._id);
                if (fIndex === -1) {
                  const data = {
                    productId: product._id,
                    productName: `${product.name}${product.colors ? ' - ' + product.colors.name : ''}${product.sizes ? ' - ' + product.sizes.name : ''}`,
                    soldQuantity: product.saleType === 'Return' ? -(product.soldQuantity)  : product.soldQuantity,
                    salePrice: product.salePrice,
                    purchasePrice: product.purchasePrice,
                    soldDateString: sale.soldDateString,
                    category: product.category ? product.category?.name : null,
                    subcategory: product.subcategory ? product.subcategory?.name : null,
                    discount: sale.discount && sale.discount > 0? Number((sale.discount / sale.products.length).toFixed(2)) : 0,

                  }
                  reports.push(data);
                } else {
                  reports[fIndex].soldQuantity += product.saleType === 'Return' ? -(product.soldQuantity) : product.soldQuantity;
                }
              })
            })

            const mReports = reports.filter(f => f.soldQuantity > 0);

            this.holdReportData = mReports;
            this.reportsData = mReports;

            this.sales = this.utilsService.arrayGroupByFieldComplexCalc(mReports, 'soldDateString', 'sale-statement');
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

  deleteSaleById(id: any) {
    this.subDataTwo = this.saleService.deleteSaleById(id).subscribe({
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

  private deleteMultipleSaleById() {
    this.spinner.show();
    this.subDataThree = this.saleService
      .deleteMultipleSaleById(this.selectedIds)
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
   * CALCULATIONS
   * getPercent()
   * getProductPercent()
   */

  getPercent(data: any) {
    return Math.floor(((data.salePrice - data.purchasePrice) / data.purchasePrice) * 100)
  }


  getProductPercent(data: any) {
    const profit = ((data.salePrice * data.soldQuantity) - (data.purchasePrice * data.soldQuantity) - data.discount);
    const purchasePrice = data.purchasePrice *  data.soldQuantity;
    return Math.floor((profit / purchasePrice) * 100);
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

    this.dataFormDateRange.reset();
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

      const qData = {soldDateString: {$gte: startDate, $lte: endDate}};
      this.isDefaultFilter = false;
      delete this.filter.month;
      delete this.filter.year;
      this.filter = {...qData};
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
    this.activeFilterCategory = null;
    this.activeFilterSubCategory = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    this.dataFormDateRange.reset();
    this.setDefaultFilter();
    // Re fetch Data
    this.getAllSale();
  }

  onCategorySelect(name: string, index: number, id: string) {
    this.isDefaultFilter = false;
    this.reportsData = this.holdReportData.filter(f => f.category === name);
    this.activeFilterCategory = index;

    if (id) {
      this.getSubCategoriesByCategoryId(id);
    }


  }

  onSubCategorySelect(name: string, index: number) {
    this.isDefaultFilter = false;
    this.reportsData = this.holdReportData.filter(f => f.subcategory === name);
    this.activeFilterSubCategory = index;

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

  onAllSelectChange(event: MatCheckboxChange, data: Sale[], index: number) {
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

    const data = this.sortPipe.transform(this.reportsData, 'soldQuantity')
      .map(m => {
        return {
          'Product Name': m.productName,
          'Quantity': m.soldQuantity,
          'Purchase Price': m.purchasePrice,
          'Total Purchase Price': this.decimalPipe.transform(m.soldQuantity * m.purchasePrice, '2.2-2'),
          'Sale Price': m.salePrice,
          'Total Sale Price': this.decimalPipe.transform(m.soldQuantity * m.salePrice, '2.2-2'),
        }
      })

    const date = this.utilsService.getDateString(new Date());
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data)
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `Top_Sale_Products_Reports_${date}.xlsx`);
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
      case 'print': {
        this.saleData = data;
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '400px',
          data: {
            title: 'Confirm Print',
          },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            window.print();
            window.close();
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
    if (this.subDataSeven) {
      this.subDataSeven.unsubscribe();
    }
  }

}
