import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AdminPermissions} from "../../../enum/admin-permission.enum";
import {Select} from "../../../interfaces/core/select";
import {MONTHS, YEARS} from "../../../core/utils/app-data";
import {ProductDamage} from "../../../interfaces/common/product-damage.interface";
import {ShopInformation} from "../../../interfaces/common/shop-information.interface";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {DatePipe} from "@angular/common";
import {ProductDamageService} from "../../../services/common/product-damage.service";
import {UiService} from "../../../services/core/ui.service";
import {UtilsService} from "../../../services/core/utils.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {NgxSpinnerService} from "ngx-spinner";
import {ReloadService} from "../../../services/core/reload.service";
import {AdminService} from "../../../services/admin/admin.service";
import {ShopInformationService} from "../../../services/common/shop-information.service";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as XLSX from "xlsx";
import {ConfirmDialogComponent} from "../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {ProductPurchase} from "../../../interfaces/common/product-purchase.interface";
import {PurchaseService} from "../../../services/common/purchase.service";
import {AdminRolesEnum} from "../../../enum/admin.roles.enum";
import {SaleService} from "../../../services/common/sale.service";
import {Sale} from "../../../interfaces/common/sale.interface";

@Component({
  selector: 'app-all-details',
  templateUrl: './all-details.component.html',
  styleUrls: ['./all-details.component.scss'],
  providers:[DatePipe]
})
export class AllDetailsComponent implements OnInit, OnDestroy {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Static Data
  months: Select[] = MONTHS;
  years: Select[] = YEARS;

  // Store Data
  isLoading: boolean = true;
  allDamage: ProductDamage[] = [];
  private holdAllDamage: ProductDamage[] = [];
  damages: { _id: string, data: ProductDamage[], total: number }[] = [];
  holdPrevData: any[] = [];
  id?: string;
  calculationPurchase: { totalAmount: number } = null;
  holdCalculationPurchase: { totalAmount: number } = null;


  private allSales: Sale[] = [];
  private holdAllSales: Sale[] = [];
  multiPaymentReport: any[] = [];
  holdReportData: any[] = [];
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
    colors: any,
    sizes: any,
    percentTotal: number,
    soldQuantity: number,
    purchasePrice: number,
    discount: number,
    productName: string,
    soldTime: string,
    paymentType?: string,

  }[] = [];
  saleData: any;

  calculation: { totalAmount: number } = null;
  holdCalculation: { totalAmount: number } = null;

  // Shop data
  shopInformation: ShopInformation;

  // FilterData
  isDefaultFilter: boolean = false;
  filter: any = null;
  filter2: any = null;
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

  purchases: { _id: string, data: ProductPurchase[], total: number, test: number }[] = [];
  allPurchase: ProductPurchase[] = [];
  private holdAllPurchase: ProductPurchase[] = [];

  purchase: ProductPurchase[] = [];

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
    private purchaseService: PurchaseService,
    private saleService: SaleService,
  ) {
  }

  ngOnInit(): void {


    this.activatedRoute.paramMap.subscribe(param => {
      if (param.get('id')) {
        this.filter = {'product._id': param.get('id')}
        this.filter2 = {'products._id': param.get('id')}
      }
    })

    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllDamage();
      this.getAllPurchase();
      this.getAllSale();
    });

    // Set Default Filter
    this.setDefaultFilter();
    // Base Data
    this.getAllDamage();
    this.getShopInformation();

    this.getAdminBaseData();
    this.getAllPurchase();
    this.getAllSale();
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
            this.holdAllDamage = this.allDamage;
            this.damages = this.utilsService.arrayGroupByFieldComplexCalc(res.data, 'dateString', 'damage_history');
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
      filter: this.filter,
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
            this.purchases = this.utilsService.arrayGroupByFieldComplexCalc(res.data, 'dateString', 'purchase_history');
            this.holdPrevData = this.purchases;

            // Calculation Data
            this.calculationPurchase = res.calculation;
            this.holdCalculationPurchase = this.calculationPurchase;
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.spinner.hide();
          console.log(err);
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
      sizes: 1,
      discount: 1,
      vatAmount: 1,
      paidAmount: 1,
      totalPurchasePrice: 1,
      receivedFromCustomer: 1,
      paymentType: 1,
      category: 1,
      subcategory: 1,
      multiPayment: 1
    };

    let mFilter = {...this.filter2, ...{status: 'Sale'}};
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

            // i = 0,1,2
            // Complex Data
            const reports = [];
            this.allSales.forEach(sale => {
              sale.products.forEach((product, i) => {
                const data = {
                  saleId: sale._id,
                  productId: product._id,
                  productName: `${product.name}${product.colors ? ' - ' + product.colors.name : ''}${product.sizes ? ' - ' + product.sizes.name : ''}`,
                  soldQuantity: product.saleType === 'Return' ? -(product.soldQuantity)  : product.soldQuantity,
                  salePrice: product.salePrice - (product.discountAmount ?? 0),
                  paymentType: sale.paymentType,
                  purchasePrice: product.purchasePrice,
                  soldDateString: sale.soldDateString,
                  soldTime: sale.soldTime,
                  category: product.category ? product.category?.name : null,
                  subcategory: product.subcategory ? product.subcategory?.name : null,
                  discount: sale.discount && sale.discount > 0? Number((sale.discount / sale.products.length).toFixed(2)) : 0,
                  profit: ((product?.soldQuantity ) * (product.salePrice - (product.discountAmount ?? 0) ) - (product?.soldQuantity ) * (product?.purchasePrice )),
                  multiPayment: i === 0 ? sale.multiPayment : [],

                }
                reports.push(data);
              })

            })

            // console.log('Pre- reports', reports);
            // console.log('reports', reports.filter(f => f.saleId === '664c88e167a1944d64acb014')) //

            const mReports = reports.filter(f => f.soldQuantity > 0);
            const sortedReport = mReports.sort((a, b) => {
              if (a.saleId < b.saleId) {
                return -1;
              }
              if (a.saleId > b.saleId) {
                return 1;
              }
              return 0;
            });

            const hhh = [...sortedReport];
            this.multiPaymentReport = [];
            hhh.forEach(sale => {
              if (sale.multiPayment && sale.multiPayment.length) {
                sale.multiPayment.forEach(mp => {
                  this.multiPaymentReport.push({...mp, ...{saleId: sale.saleId, product: sale.productName, productId: sale.productId, soldDateString: sale.soldDateString}});
                })

              }
            })

            console.log('hhh-main-data', hhh);
            console.log('multiPaymentReport1' , this.multiPaymentReport);
            // console.log('this.multiPaymentReport', this.multiPaymentReport.filter(f => f.name === 'cash').map(f => f.amount).reduce((acc, val) => acc + val, 0))
            // console.log('this.multiPaymentReport', this.multiPaymentReport.filter(f => f.name === 'cash'))

            this.holdReportData = sortedReport;
            this.reportsData = sortedReport;
            this.saleData = sortedReport;


            // this.totalPrices = this.utilsService.getTotalWithReduce(this.reportsData, 'soldAmount');


            // this.sales = this.utilsService.arrayGroupByFieldComplexCalc([...sortedReport], 'soldDateString', 'sale-statement');

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
        this.filter2 = {'month': value};
        this.activeFilterMonth = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    this.getAllDamage();
    this.getAllPurchase();
    this.getAllSale();
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
    this.filter2 = {
      ...this.filter2, ...{
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
      this.getAllPurchase();

    }
  }

  endChangeRegDateRange1(event: MatDatepickerInputEvent<any>) {
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
      delete this.filter2.month;
      delete this.filter.year;
      delete this.filter2.year;
      this.filter2 = {...qData};


      // const index = this.filter.findIndex(x => x.hasOwnProperty('createdAt'));


      // Re fetch Data
      this.getAllSale();

    }
  }


  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllDamage();
    this.getAllPurchase();
    this.getAllSale();
  }

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilterMonth = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    this.filter2 = null;
    this.dataFormDateRange.reset();
    this.setDefaultFilter();
    // Re fetch Data
    this.getAllDamage();
    this.getAllPurchase();
    this.getAllSale();
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
      this.damages[index].data.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.damages[index].data.find((f) => f._id === m).select = false;
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
      const mData = this.allDamage.map(m => {
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

  totalPurchaseData(data1:any) {
    console.log("data1",data1)
    return  data1.data.map(data => ( data?.product?.purchasePrice)).reduce((acc, value) => acc + value, 0)
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
