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
import {DatePipe, DecimalPipe} from '@angular/common';
import {PayoutService} from "../../../services/common/payout.service";
import {Payout} from "../../../interfaces/common/payout.interface";
import {ExpenseService} from "../../../services/common/expense.service";
import {Expense} from "../../../interfaces/common/expense.interface";
import {RepairService} from "../../../services/common/repair.service";
import {Repair} from "../../../interfaces/common/repair.interface";
import {
  ConfirmDialogPayoutComponent
} from "../../../shared/components/ui/confirm-dialog-payout/confirm-dialog-payout.component";

@Component({
  selector: 'app-sale-record',
  templateUrl: './sale-record.component.html',
  styleUrls: ['./sale-record.component.scss'],
  providers: [SortPipe, DecimalPipe, DatePipe]
})
export class SaleRecordComponent implements OnInit, OnDestroy {
  // Admin Base Data
  adminId: string;
  sellerName: string;
  role: string;
  payoutTotalAmount: number;
  permissions: AdminPermissions[];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  processedData: any[] = [];
  payouts?: Payout;
  // Static Data
  months: Select[] = MONTHS;
  years: Select[] = YEARS;
  multiPaymentReport: any[] = [];
  allExpense: Expense[] = [];
  private holdAllExpense: Expense[] = [];
  expenses: { _id: string, data: Expense[], total: number }[] = [];
  holdPrevData: any[] = [];
  categoriesData: any[] = [];
  // id?: string;
  // calculation: { totalAmount: number } = null;
  // holdCalculation: { totalAmount: number } = null;
  // Data Table
  @ViewChild('dataTable') dataTable: ElementRef;

  totalPrices: number;
  totalCostPrices: number;
  totalProfitPrices: number;

  // Store Data
  isLoading: boolean = true;
  private allSales: Sale[] = [];
  private holdAllSales: Sale[] = [];
  reportsData: {
    category: string;
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
    imei: string,
    soldTime: string,
    paymentType?: string,

  }[] = [];

  categoryReportsData: {
    invoiceTitle: string;
    category: string;
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
  calculation: any;
  totalPrice: any;
  holdCalculation:any;
  saleData: any;

  // Shop data
  shopInformation: ShopInformation;

  selectedIndices: number[] = []; // Array to store selected indices
  selectedCategories: any[] = []; // Array to store selected categories


  // FilterData
  isDefaultFilter: boolean = false;
  isCategoryFilter: boolean = false;
  isPayout: boolean = false;
  filter: any = null;
  filter2: any = null;
  filter3: any = null;
  sortQuery: any = null;
  categoryName: any = null;
  categoryData: any = null;
  activeFilter1: number = null;
  activeFilterMonth: number = null;
  activeFilterCategory: number = null;
  activeFilterSubCategory: number = null;
  activeFilterYear: number = null;
  activeSort: number;
  public allRepair: Repair[] = [];
  private holdAllRepair: Repair[] = [];
  repairs: { _id: string, data: Repair[], total: number }[] = [];
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
    private expenseService: ExpenseService,
    private datePipe: DatePipe,
    private payoutService: PayoutService,
    private saleService: SaleService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private repairService: RepairService,
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
      this.getAllExpense();
    });

    // Set Default Filter
    this.setDefaultFilter();
    // Base Data
    this.getAllSale();
    this.getAllExpense();
    this.getShopInformation();
    this.getAllCategory();
    this.getAllRepair();
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
      invoiceTitle: 1,
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
      imei: 1,
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

            console.log(" this.allSales ", this.allSales )
            this.holdAllSales = this.allSales;
            // this.sales = this.utilsService.arrayGroupByFieldComplexCalc(this.allSales, 'soldDateString', 'sale');

            // i = 0,1,2
            // Complex Data
            const reports = [];
            this.allSales.forEach(sale => {
              sale.products.forEach((product, i) => {
                const data = {
                  saleId: sale._id,
                  invoiceNo: sale.invoiceNo,
                  productId: product._id,
                  imei: product.imei,
                  productName: `${product.name}${product.colors ? ' - ' + product.colors.name : ''}${product.sizes ? ' - ' + product.sizes.name : ''}`,
                  soldQuantity: product.saleType === 'Return' ? -(product.soldQuantity) : product.soldQuantity,
                  salePrice: product.salePrice - (product.discountAmount ?? 0),
                  paymentType: sale.paymentType,
                  purchasePrice: product.purchasePrice,
                  soldDateString: sale.soldDateString,
                  soldTime: sale.soldTime,
                  category: product.category ? product.category?.name : null,
                  subcategory: product.subcategory ? product.subcategory?.name : null,
                  discount: sale.discount && sale.discount > 0 ? Number((sale.discount / sale.products.length).toFixed(2)) : 0,
                  profit: ((product?.soldQuantity) * (product.salePrice - (product.discountAmount ?? 0)) - (product?.soldQuantity) * (product?.purchasePrice)),
                  multiPayment: i === 0 ? sale.multiPayment : [],
                  multiPayments:  sale.multiPayment ?? [],
                  // paymentCategory: sale.multiPayment.length>1 ?  sale.products.map(m => m.category.name).join() :'',
                  // paymentCategory: sale.multiPayment.length > 1
                  //   ? sale.products.map(m => `(${m.category.name})`).join(", ")
                  //   : '',
                  paymentCategory: sale.multiPayment.length > 1
                    ? (() => {
                      const uniqueCategories = new Set(
                        sale.products.map(product => product.category.name)
                      );

                      return uniqueCategories.size > 1
                        ? Array.from(uniqueCategories)
                          .map(category => `(${category})`)
                          .join(", ")
                        : '';
                    })()
                    : '',



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
                  this.multiPaymentReport.push({
                    ...mp, ...{
                      saleId: sale.saleId,
                      product: sale.productName,
                      productId: sale.productId,
                      soldDateString: sale.soldDateString
                    }
                  });
                })

              }
            })

            // console.log('hhh-main-data', hhh);
            // console.log('multiPaymentReport1', this.multiPaymentReport);
            // console.log('this.multiPaymentReport', this.multiPaymentReport.filter(f => f.name === 'cash').map(f => f.amount).reduce((acc, val) => acc + val, 0))
            // console.log('this.multiPaymentReport', this.multiPaymentReport.filter(f => f.name === 'cash'))

            this.holdReportData = sortedReport;
            this.reportsData = sortedReport;
            this.saleData = sortedReport;
            // console.log("this.reportsData",this.reportsData)
            // if (this.categoryData){
            //   console.log("ee")
            //   this.reportsData = sortedReport.filter(f=> f.category.toLowerCase() === this.categoryData.name.toLowerCase())
            // }else {
            //   this.reportsData = sortedReport;
            // }


            // this.totalPrices = this.utilsService.getTotalWithReduce(this.reportsData, 'soldAmount');


            // this.sales = this.utilsService.arrayGroupByFieldComplexCalc([...sortedReport], 'soldDateString', 'sale-statement');
            console.log(res.calculation)
            this.totalPrice = res.calculation.grandTotal
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

  getDay(data: any) {
    let dateString: string = data;
    let myDate: Date = new Date(dateString); // Parsing the string into a Date object
    let formattedDate: string = this.datePipe.transform(myDate, 'EEEE'); // 'EEEE' is the format for the full name of the day of the week
    return formattedDate;
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


  private getAllExpense() {
    // Spinner..
    this.spinner.show();
    // Select
    const mSelect = {
      images: 1,
      date: 1,
      dateString: 1,
      expenseFor: 1,
      amount: 1,
      description: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter2,
      pagination: null,
      select: mSelect,
      sort: {dateString: -1},
    };

    this.subDataOne = this.expenseService
      .getAllExpense(filter, null)
      .subscribe({
        next: (res) => {
          // console.log('Expense', res.data)
          this.isLoading = false;
          this.spinner.hide();
          if (res.success) {
            this.allExpense = res.data;

            this.holdAllExpense = this.allExpense;
            this.expenses = this.utilsService.arrayGroupByField(res.data, 'dateString', 'amount');
            this.holdPrevData = this.expenses;

            // Calculation Data
            // this.calculation = res.calculation;
            // this.holdCalculation = this.calculation;
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.spinner.hide();
          console.log(err);
        },
      });
  }


  private getAllRepair() {
    // console.log('this.filter2', this.filter2)
    // Spinner..
    this.spinner.show();
    // Select
    const mSelect = {
      images: 1,
      date: 1,
      dateString: 1,
      updateTime: 1,
      repairFor: 1,
      amount: 1,
      description: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter2,
      pagination: null,
      select: mSelect,
      sort: {dateString: -1},
    };

    this.subDataOne = this.repairService
      .getAllRepair(filter, null)
      .subscribe({
        next: (res) => {

          // console.log('res', res)
          this.isLoading = false;
          this.spinner.hide();
          if (res.success) {
            this.allRepair = res.data;
            this.holdAllRepair = this.allRepair;
            this.repairs = this.utilsService.arrayGroupByField(res.data, 'dateString', 'amount');
            this.holdPrevData = this.repairs;
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
    const purchasePrice = data.purchasePrice * data.soldQuantity;
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
    this.filter = {
      'soldDateString': this.utilsService.getDateString(new Date())
    }
    this.filter2 = {
      'dateString': this.utilsService.getDateString(new Date())
    }
    this.filter3 = {
      'soldDateString': this.utilsService.getDateString(new Date())
    }
  }

  filterData(value: any, index: number, type: string) {

    // this.dataFormDateRange.reset();
    switch (type) {
      case 'category': {
        this.filter = {...this.filter, ...{'products.category._id': value._id}};
        this.activeFilter1 = index;
        this.categoryName = value.invoiceTitle
        this.categoryData = value



        break;
      }

      default: {
        break;
      }
    }
    // Re fetch Data
    this.getAllSale();
    // this.getAllExpense();
  }

  // onSelectionChange(event: any): void {
  //   // This function is triggered when selection changes
  //   console.log('Selection Changed:', event);
  // }
  toggleSelection(data: any, index: number): void {
    const idx = this.selectedIndices.indexOf(index);

    if (idx === -1) {
      // Add index if not selected
      this.selectedIndices.push(index);
      this.selectedCategories.push(data);
    } else {
      // Remove index if already selected
      this.selectedIndices.splice(idx, 1);
      this.selectedCategories = this.selectedCategories.filter(item => item !== data);
    }

    // Pass the updated selection to the filterData function
    this.filterData1(this.selectedCategories, index, 'category');
  }

  isSelected(index: number): boolean {
    return this.selectedIndices.includes(index);
  }


  filterData1(value: any, index: number, type: string) {

    // this.dataFormDateRange.reset();
    switch (type) {
      case 'category': {
        this.isCategoryFilter = true

        if (value.length) {

          let groupedData: any[] = []; // Final array to store grouped arrays

          value.forEach((category) => {
            // Filter reportsData based on the current category, ignoring spaces
            const categoryData = this.reportsData.filter((f) =>
              f.category.replace(/\s+/g, '').toLowerCase() ===
              category.name.replace(/\s+/g, '').toLowerCase()
            );

            // Only add categories with data
            if (categoryData.length > 0) {
              groupedData.push({
                invoiceTitle: category.invoiceTitle, // Add title for the category
                data: categoryData,         // Store the filtered data
              });
            }
          });


          // console.log('groupedData', groupedData); // Contains arrays for each category

          this.categoryReportsData = groupedData

          this.processInvoiceData();


        } else {
          this.reportsData = this.reportsData;
        }

        break;
      }

      default: {
        break;
      }
    }
    // Re fetch Data
    // this.getAllSale();
    // this.getAllExpense();
  }


  processInvoiceData(): void {
    this.processedData = this.categoryReportsData.map(item => {
      const totalSale = item.data.reduce((sum, entry) => sum + entry.salePrice * entry.soldQuantity, 0);
      const totalPurchasePrice = item.data.reduce((sum, entry) => sum + entry.purchasePrice * entry.soldQuantity, 0);
      const totalProfit = item.data.reduce((sum, entry) => sum + entry.profit * entry.soldQuantity, 0);
      return {
        invoiceTitle: item.invoiceTitle,
        totalSale,
        totalPurchasePrice,
        totalProfit
      };
    });

    // console.log("  this.processedData",  this.processedData)
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
      const qData2 = {dateString: {$gte: startDate, $lte: endDate}};
      this.isDefaultFilter = false;
      delete this.filter.month;
      delete this.filter2.month;
      delete this.filter3.month;
      delete this.filter.year;
      delete this.filter2.year;
      delete this.filter3.year;
      this.filter = {...qData};
      this.filter3 = {...qData};
      this.filter2 = {...this.filter2, ...qData2};
      // const index = this.filter.findIndex(x => x.hasOwnProperty('createdAt'));


      // Re fetch Data
      this.getAllSale();
      this.getAllExpense();
      this.getAllRepair();
    }
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllSale();
    this.getAllExpense();
  }

  onRemoveAllCategory() {
    this.isDefaultFilter = false;
    this.activeFilter1 = null;
    this.filter = this.filter3
    this.categoryName = null
    this.categoryData = null
    this.getAllSale();
  }

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilterMonth = null;
    this.activeFilterCategory = null;
    this.activeFilterSubCategory = null;
    this.isPayout = false;
    this.isCategoryFilter = false;
    this.categoryReportsData = [];
    this.selectedIndices = [];
    this.selectedCategories = [];
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    this.filter3 = null;
    this.categoryName = null
    this.categoryData = null
    this.dataFormDateRange.reset();
    this.setDefaultFilter();
    // Re fetch Data
    this.getAllSale();
    this.getAllExpense();
    this.getAllCategory();
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

  private getPayout() {
    this.subDataTwo = this.payoutService.getPayout()
      .subscribe(res => {

        this.payouts = res.data;

        if (this.payouts) {
          setTimeout(() => {
            window.print();
            window.close();
          }, 500)
        }

      }, err => {
        console.log(err);
      });
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
          'Total Purchase Price': this.decimalPipe.transform(m.soldQuantity * m.purchasePrice, '1.0-2'),

          'Sale Price': m.salePrice,
          'Total Sale Price': this.decimalPipe.transform(m.soldQuantity * m.salePrice, '1.0-2'),
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
          maxWidth: '600px',
          data: {
            title: 'Confirm Print',
          },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {


            setTimeout(() => {
              window.print();
              window.close();
            }, 300)
          }
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  public openConfirmDialogPayout(type: string, data?: any) {
    switch (type) {

      case 'print-all': {
        // console.log("data")
        this.isCategoryFilter =false
        this.saleData = data;
        const dialogRef = this.dialog.open(ConfirmDialogPayoutComponent, {
          maxWidth: '600px',
          data: {
            title: 'Confirm Print',
            sellerName: this.categoryName ? this.categoryName : this.shopInformation?.sellerName ? this.shopInformation?.sellerName : null
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Handle the confirmed result, e.g., log the seller name
            this.sellerName = result.sellerName;
            this.isPayout = false
            setTimeout(() => {
              window.print();
              window.close();
            }, 300)
          } else {
            // console.log('Dialog was dismissed');
          }
        });
        break;
      }

      case 'print-category': {

        // this.saleData = data;
        const dialogRef = this.dialog.open(ConfirmDialogPayoutComponent, {
          maxWidth: '600px',
          data: {
            title: 'Confirm Print',
            sellerName:  null
          },
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // Handle the confirmed result, e.g., log the seller name
            // console.log("ffff")

              setTimeout(() => {
                window.print();
                window.close();
              }, 300)


          } else {
            // console.log('Dialog was dismissed');
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
