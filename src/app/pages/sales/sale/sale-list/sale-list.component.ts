import {Component, OnInit, ViewChild} from '@angular/core';
import {UiService} from "../../../../services/core/ui.service";
import {Router} from "@angular/router";
import {ReloadService} from "../../../../services/core/reload.service";
import {EMPTY, Subscription} from "rxjs";
import {FilterData} from "../../../../interfaces/gallery/filter-data";
import {SaleService} from "../../../../services/common/sale.service";
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
import {Sale, SaleCalculation} from '../../../../interfaces/common/sale.interface';
import {AdminService} from '../../../../services/admin/admin.service';
import {AdminRolesEnum} from '../../../../enum/admin.roles.enum';
import {ShopInformation} from '../../../../interfaces/common/shop-information.interface';
import {ShopInformationService} from '../../../../services/common/shop-information.service';
import {NoteComponent} from "../note/note.component";
import {DatePipe} from "@angular/common";
import {Category} from "../../../../interfaces/common/category.interface";
import {CategoryService} from "../../../../services/common/category.service";


@Component({
  selector: 'app-sale-list',
  templateUrl: './sale-list.component.html',
  styleUrls: ['./sale-list.component.scss'],
  providers:[DatePipe]
})
export class SaleListComponent implements OnInit {
  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Static Data
  months: Select[] = MONTHS;
  years: Select[] = YEARS;

  // Store Data
  isLoading: boolean = true;
  private allSales: Sale[] = [];
  private holdAllSales: Sale[] = [];
  sales: { _id: string, data: Sale[], total: number, subTotal: number, discount: number, vat: number }[] = [];
  holdPrevData: any[] = [];
  id?: string;
  calculation: SaleCalculation = null;
  holdCalculation: SaleCalculation = null;
  saleData: Sale = null;
  categories: Category[] = [];

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
  private subGetData1: Subscription;

  constructor(
    private datePipe: DatePipe,
    private saleService: SaleService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private adminService: AdminService,
    private shopInformationService: ShopInformationService,
    private categoryService: CategoryService,
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
            this.allSales = this.holdAllSales;
            this.calculation = this.holdCalculation;
            this.searchQuery = null;
            return EMPTY;
          }

          // Select
          const mSelect = {
            invoiceNo: 1,
            date: 1,
            customer: 1,
            products: 1,
            salesman: 1,
            status: 1,
            vendor: 1,
            month:1,
            soldDate: 1,
            total: 1,
            soldDateString: 1,
            soldTime: 1,
            subTotal: 1,
            note: 1,
            imei: 1,
            category: 1,
            discount: 1,
            vatAmount: 1,
            paidAmount: 1,
            totalPurchasePrice: 1,
            receivedFromCustomer: 1,
            paymentType: 1,
          };

          const filterData: FilterData = {
            pagination: null,
            filter: {...this.filter, ...{status: 'Sale'}},
            select: mSelect,
            sort: {invoiceNo: -1},
          };

          return this.saleService.getAllSale(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.allSales = res.data;
          this.searchSale = res.data;
          this.sales = this.utilsService.arrayGroupByFieldComplexCalc(this.searchSale, 'soldDateString', 'sale');
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
   * getAllSale()
   * deleteSaleById()
   */

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
      month:1,
      soldDate: 1,
      total: 1,
      soldDateString: 1,
      soldTime: 1,
      subTotal: 1,
      note: 1,
      imei: 1,
      category: 1,
      discount: 1,
      vendor: 1,
      vatAmount: 1,
      paidAmount: 1,
      totalPurchasePrice: 1,
      receivedFromCustomer: 1,
      paymentType: 1,


    };

    let mFilter = {...this.filter, ...{status: 'Sale'}};
    // if (this.role === AdminRolesEnum.SALESMAN) {
    //   mFilter = {...mFilter, ...{'salesman._id': this.adminId}}
    // }

    const filter: FilterData = {
      filter: mFilter,
      pagination: null,
      select: mSelect,
      sort: {soldDateString: -1},
    };

    this.subDataOne = this.saleService
      .getAllSale(filter, null)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.spinner.hide();
          if (res.success) {
            this.allSales = res.data;
            // console.log("this.allSales",this.allSales)
            this.holdAllSales = this.allSales;
            this.sales = this.utilsService.arrayGroupByFieldComplexCalc(this.allSales, 'soldDateString', 'sale');
            // console.log('this.sales',this.sales)
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


  getDay(data: any) {
    let dateString: string = data;
    let myDate: Date = new Date(dateString); // Parsing the string into a Date object
    let formattedDate: string = this.datePipe.transform(myDate, 'EEEE'); // 'EEEE' is the format for the full name of the day of the week
    return  formattedDate;
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

      const qData = {soldDateString: {$gte: startDate, $lte: endDate}};
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
    const date = this.utilsService.getDateString(new Date());

    if (this.selectedIds.length) {

      const selectedSales = [];
      this.selectedIds.forEach(id => {
        const data = this.allSales.find(f => f._id === id);
        selectedSales.push(data);
      })

      const mSale = selectedSales.map (m => {
        return {
          ...m,
          ...{
            salesman: m.salesman ? m.salesman.name : '',
            customer: m.customer ? m.customer.phone : '',
            products: m.products.map(p => p.name).join(),
          }
        }
      })

      mSale.push(
        {
          '_id': 'TOTAL=',
          'invoiceNo': '',
          'salesman': '',
          'products': '',
          'soldDate': null,
          'soldDateString': '',
          discount: mSale.map(t => t.discount ?? 0).reduce((acc, value) => acc + value, 0),
          vatAmount: mSale.map(t => t.vatAmount ?? 0).reduce((acc, value) => acc + value, 0),
          status: '',
          'totalPurchasePrice': mSale.map(t => t.totalPurchasePrice ?? 0).reduce((acc, value) => acc + value, 0),
          total: mSale.map(t => t.total ?? 0).reduce((acc, value) => acc + value, 0),
          paidAmount: mSale.map(t => t.paidAmount ?? 0).reduce((acc, value) => acc + value, 0),
          subTotal: mSale.map(t => t.subTotal ?? 0).reduce((acc, value) => acc + value, 0),
          month: null,
          soldTime: '',
          receivedFromCustomer: null,
          paymentType: '',
          customer: ''
        }
      )

      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mSale);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Sale_Reports_${date}.xlsx`);

    } else {
      const mSale = this.allSales.map (m => {
        return {
          ...m,
          ...{
            salesman: m.salesman ? m.salesman.name : '',
            customer: m.customer ? m.customer.phone : '',
            products: m.products.map(p => p.name).join(),
          }
        }
      })

      mSale.push(
        {
          '_id': 'TOTAL=',
          'invoiceNo': '',
          'salesman': '',
          'products': '',
          'soldDate': null,
          'soldDateString': '',
          discount: mSale.map(t => t.discount ?? 0).reduce((acc, value) => acc + value, 0),
          vatAmount: mSale.map(t => t.vatAmount ?? 0).reduce((acc, value) => acc + value, 0),
          status: '',
          'totalPurchasePrice': mSale.map(t => t.totalPurchasePrice ?? 0).reduce((acc, value) => acc + value, 0),
          total: mSale.map(t => t.total ?? 0).reduce((acc, value) => acc + value, 0),
          paidAmount: mSale.map(t => t.paidAmount ?? 0).reduce((acc, value) => acc + value, 0),
          subTotal: mSale.map(t => t.subTotal ?? 0).reduce((acc, value) => acc + value, 0),
          month: null,
          soldTime: '',
          receivedFromCustomer: null,
          paymentType: '',
          customer: ''
        }
      )
      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mSale);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Sale_Reports_${date}.xlsx`);
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
  }

  noteUpdate(id:string, data:string,event?: MouseEvent) {
    event.stopImmediatePropagation();
    this.reloadService.needRefreshData$();
    const dialogRef = this.dialog.open(NoteComponent, {
      panelClass: ['theme-dialog'],
      width: '100%',
      maxWidth: '600px',
      maxHeight: '100%',
      autoFocus: false,
      disableClose: false,
      data: data,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {

        const mData = {
          ...{
            note: dialogResult?.note
          }
        }
         this.updateSalesById(id, mData, event)
      }
    });
  }

  public updateSalesById(id?: string, data?: any, event?: MouseEvent) {
    event.stopImmediatePropagation();
    this.subGetData1 = this.saleService.updateSaleById(id, data).subscribe({
      next: res => {
        if (res.success) {
          this.uiService.success('Sales Update successfully');
          this.reloadService.needRefreshData$();
        }
      },
      error: err => {
        console.log(err);
      }
    })

  }
}
