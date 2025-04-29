import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AdminPermissions} from "../../../../enum/admin-permission.enum";
import {Select} from "../../../../interfaces/core/select";
import {DATA_BOOLEAN} from "../../../../core/utils/app-data";
import {ShopInformation} from "../../../../interfaces/common/shop-information.interface";
import {Product, ProductCalculation} from "../../../../interfaces/common/product.interface";
import {Category} from "../../../../interfaces/common/category.interface";
import {SubCategory} from "../../../../interfaces/common/sub-category.interface";
import {Vendor} from "../../../../interfaces/common/vendor.interface";
import {MatCheckbox, MatCheckboxChange} from "@angular/material/checkbox";
import {FormControl, FormGroup, NgForm} from "@angular/forms";
import {EMPTY, Subscription} from "rxjs";
import {ProductService} from "../../../../services/common/product.service";
import {AdminService} from "../../../../services/admin/admin.service";
import {CategoryService} from "../../../../services/common/category.service";
import {SubCategoryService} from "../../../../services/common/sub-category.service";
import {VendorService} from "../../../../services/common/vendor.service";
import {ProductDamageService} from "../../../../services/common/product-damage.service";
import {MatDialog} from "@angular/material/dialog";
import {UiService} from "../../../../services/core/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ReloadService} from "../../../../services/core/reload.service";
import {UtilsService} from "../../../../services/core/utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ShopInformationService} from "../../../../services/common/shop-information.service";
import {debounceTime, distinctUntilChanged, pluck, switchMap} from "rxjs/operators";
import {Pagination} from "../../../../interfaces/core/pagination";
import {FilterData} from "../../../../interfaces/core/filter-data";
import {ConfirmDialogComponent} from "../../../../shared/components/ui/confirm-dialog/confirm-dialog.component";
import {DamageControllerComponent} from "../../../../shared/dialog-view/damage-controller/damage-controller.component";
import {MatDatepickerInputEvent} from "@angular/material/datepicker";
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-old-product-list',
  templateUrl: './old-product-list.component.html',
  styleUrls: ['./old-product-list.component.scss']
})
export class OldProductListComponent implements OnInit, AfterViewInit, OnDestroy {

  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];
  reportsData: any[] = [];
  holdReportData: any[] = [];
  isStockReport: boolean = false;
  isReport: boolean = false;
  // Static Data
  dataBoolean: Select[] = DATA_BOOLEAN;

  // Shop data
  shopInformation: ShopInformation;

  // Store Data
  isLoading: boolean = true;
  toggleMenu: boolean = true;
  isDefaultFilter: boolean = false;
  products?: Product[] = [];
  products2?: Product[] = [];
  products3?: Product[] = [];
  filterProducts3?: Product[] = [];
  holdPrevData: Product[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  vendors: Vendor[] = [];
  productCalculation: ProductCalculation;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 25;
  totalProductsStore = 0;

  // FilterData
  filter: any = null;
  sortQuery: any = {createdAt: -1};
  activeFilter1: number = null;
  activeFilter2: number = null;
  activeFilter3: number = null;
  activeFilter4: number = null;
  activeFilterCategory: number = null;
  activeFilterSubCategory: number = null;
  activeSort: number;
  paginationData: any = 'ff';

  showPerPageList = [ {num: 25}, {num: 50}, {num: 100}, {num: 500}, {num: 1000}, {num: 'All'},];

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
  searchProducts: Product[] = [];

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subDataSeven: Subscription;
  private subForm: Subscription;
  private subRouteOne: Subscription;
  private subReload: Subscription;
  private subShopInfo: Subscription;

  constructor(
    private el: ElementRef,
    private productService: ProductService,
    private adminService: AdminService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private vendorService: VendorService,
    private productDamageService: ProductDamageService,
    private dialog: MatDialog,
    private uiService: UiService,
    private router: Router,
    private reloadService: ReloadService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private shopInformationService: ShopInformationService,
  ) {
  }

  ngOnInit(): void {
    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllProducts();
    });

    // GET PAGE FROM QUERY PARAM
    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((qParam) => {
      if (qParam && qParam.get('page')) {
        this.currentPage = Number(qParam.get('page'));
      } else {
        this.currentPage = 1;
      }
      this.getAllProducts();
    });


    // Base Data
    this.getAdminBaseData();
    this.getAllCategory();
    this.getAllVendors();
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
            this.searchProducts = [];
            this.products = this.holdPrevData;
            this.totalProducts = this.totalProductsStore;
            this.searchQuery = null;
            return EMPTY;
          }
          const pagination: Pagination = {
            pageSize: Number(this.productsPerPage),
            currentPage: Number(this.currentPage) - 1,
          };

          // Select
          const mSelect = {
            images: 1,
            name: 1,
            sku: 1,
            category: 1,
            brand: 1,
            price: 1,
            unit: 1,
            model: 1,
            quantity: 1,
            imei: 1,
            salesman: 1,
            purchasePrice: 1,
            salePrice: 1,
            status: 1,
            createdAt: 1,
            colors: 1,
            sizes: 1,
            discountType: 1,
            discountAmount: 1,
            vendor: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: {
              ...this.filter, ...{
                $or: [
                  {expireDate: {$gt: this.utilsService.getDateString(new Date())} },
                  {expireDate: {$eq:null}}
                ]

              }
            },
            select: mSelect,
            sort: {createdAt: -1},
          };

          return this.productService.getAllProducts(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.searchProducts = res.data;
          this.products = this.searchProducts;
          this.totalProducts = res.count;
          this.totalProductsStore = res.count;
          this.productCalculation = res.calculation;
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
   * getAdminBaseData()
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
   * UI Essentials
   * onToggle()
   */
  onToggle() {
    this.toggleMenu = !this.toggleMenu;
  }
  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   * openDamageControlDialog()
   */
  public openConfirmDialog(type: string) {
    switch (type) {
      case 'delete': {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          maxWidth: '450px',
          data: {
            title: 'Confirm Delete',
            message: 'Are you sure you want delete this data?',
          },
        });
        dialogRef.afterClosed().subscribe((dialogResult) => {
          if (dialogResult) {
            this.deleteMultipleProductById();
          }
        });
        break;
      }
      case 'print': {
        this.isReport = true;
        this.isStockReport = false;
        this.getAllProducts2();
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

      case 'stock-report': {
        this.isStockReport = true;
        this.isReport = false;
        this.getAllProducts3();
        // this.saleData = this.products;
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

  public openDamageControlDialog(data: Product) {
    const dialogRef = this.dialog.open(DamageControllerComponent, {
      maxWidth: '400px',
      data: data,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (dialogResult.type === 'add') {
          this.addProductDamage(dialogResult.data);
        }
        if (dialogResult.type === 'close') {
          this.dialog.closeAll();
        }
      }
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

  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.products.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.products.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.products.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }


  /**
   * HTTP REQ HANDLE
   * getSubCategoriesByCategoryId()
   * getAllProducts()
   * getAllCategory()
   * getAllVendors()
   * getShopInformation()
   * addProductDamage()
   * deleteMultipleProductById()
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

  private getAllProducts() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: Number(this.productsPerPage),
      currentPage: Number(this.currentPage) - 1,
    };

    const filter: FilterData = {
      filter: {
        ...this.filter, ...{
          $or: [
            {expireDate: {$gt: this.utilsService.getDateString(new Date())} },
            {expireDate: {$eq:null}}
          ]

        }
      },
      pagination: pagination,
      select: {
        name: 1,
        sku: 1,
        category: 1,
        batchNumber: 1,
        salesman: 1,
        imei: 1,
        subcategory: 1,
        attribute: 1,
        model: 1,
        price: 1,
        createdAt: 1,
        createdAtString: 1,
        quantity: 1,
        purchasePrice: 1,
        salePrice: 1,
        colors: 1,
        sizes: 1,
        discountType: 1,
        discountAmount: 1,
        status: 1,
        vendor: 1,
      },
      sort: this.sortQuery,
    };

    this.subDataOne = this.productService
      .getAllProducts(filter, this.searchQuery)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.spinner.hide();
          if (res.success) {
            this.products = res.data;
            this.holdPrevData = res.data;
            this.totalProducts = res.count;
            this.totalProductsStore = res.count;
            this.productCalculation = res.calculation;

            console.log('this.productCalculation', this.productCalculation)

          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
          this.spinner.hide();
        },
      });
  }


  private getAllProducts2() {
    const mSelect = {
      name: 1,
      sku: 1,
      category: 1,
      subcategory: 1,
      attribute: 1,
      model: 1,
      price: 1,
      createdAt: 1,
      createdAtString: 1,
      quantity: 1,
      purchasePrice: 1,
      salePrice: 1,
      colors: 1,
      sizes: 1,
      discountType: 1,
      discountAmount: 1,
      status: 1,
    }

    const filterData: FilterData = {
      pagination: null,
      filter: this.filter,
      select: mSelect,
      sort: {name: 1}
    }

    this.subDataOne = this.productService
      .getAllProducts(filterData, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.products2 = res.data.filter(t => t.quantity !== 0);
            // this.filterProducts3 = res.data.filter(t => t.quantity !== 0);
            // this.productCalculation = res.calculation;
            setTimeout(() => {
              this.isReport = false;
              this.isStockReport = false;
            }, 3000)
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }



  private getAllProducts3() {
    const mSelect = {
      name: 1,
      sku: 1,
      category: 1,
      subcategory: 1,
      attribute: 1,
      model: 1,
      price: 1,
      createdAt: 1,
      createdAtString: 1,
      quantity: 1,
      purchasePrice: 1,
      salePrice: 1,
      colors: 1,
      sizes: 1,
      discountType: 1,
      discountAmount: 1,
      status: 1,
    }

    const filterData: FilterData = {
      pagination: null,
      filter: this.filter,
      select: mSelect,
      sort: {name: 1}
    }

    this.subDataOne = this.productService
      .getAllProducts(filterData, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.products3 = res.data;
            this.filterProducts3 = res.data.filter(t => t.quantity !== 0);
            // this.productCalculation = res.calculation;

            setTimeout(() => {
              this.isReport = false;
              this.isStockReport = false;
            }, 3000)
          }
        },
        error: (err) => {
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

    this.subDataFour = this.categoryService
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

  private addProductDamage(data: any) {
    this.spinner.show();
    this.subDataSeven = this.productDamageService.addProductDamage(data).subscribe({
      next: (res) => {
        this.spinner.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.reloadService.needRefreshData$();
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }


  private deleteMultipleProductById() {
    this.spinner.show();
    this.subDataTwo = this.productService
      .deleteMultipleProductById(this.selectedIds)
      .subscribe({
        next: (res) => {
          this.spinner.hide();
          if (res.success) {
            this.selectedIds = [];
            this.uiService.success(res.message);
            // fetch Data
            if (this.currentPage > 1) {
              this.router.navigate([], {queryParams: {page: 1}});
            } else {
              this.reloadService.needRefreshData$();
            }
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: error => {
          this.spinner.hide();
          console.log(error);
        }
      });
  }

  /**
   * FILTER DATA & Sorting
   * filterData()
   * endChangeRegDateRange()
   * sortData()
   * onRemoveAllQuery()
   * onSubCategorySelect()
   */

  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'category': {
        this.filter = {...this.filter, ...{'category.name': value}};
        this.activeFilter1 = index;
        break;
      } case 'subCategory': {
        this.filter = {...this.filter, ...{'subcategory._id': value}};
        this.activeFilter1 = index;
        break;
      }
      case 'vendor': {
        this.filter = {...this.filter, ...{'vendor.name': value}};
        this.activeFilter3 = index;
        break;
      }
      case 'status': {
        this.filter = {...this.filter, ...{'status': value}};
        this.activeFilter4 = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.reloadService.needRefreshData$();
    }
  }

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.end
      );
      const qData = {createdAtString: {$gte: startDate, $lte: endDate}};
      this.filter = {...qData};
      // const index = this.filter.findIndex(x => x.hasOwnProperty('createdAt'));
      if (this.currentPage > 1) {
        this.router.navigate([], {queryParams: {page: 1}});
      } else {
        this.getAllProducts();
      }
    }
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllProducts();
  }

  onRemoveAllQuery() {
    this.activeSort = null;
    this.activeFilter1 = null;
    this.activeFilter2 = null;
    this.sortQuery = {createdAt: -1};
    this.filter = null;
    this.activeFilterCategory = null;
    this.dataFormDateRange.reset();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllProducts();
    }
  }


  onCategorySelect(name: string, index: number, id: string) {
    this.isDefaultFilter = false;
    this.reportsData = this.holdReportData.filter(f => f.category === name);
    // this.filter = {...this.filter, ...{'category._id': id}};
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
   * PAGINATION
   * onPageChanged()
   * onSelectShowPerPage()
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  onSelectShowPerPage(val) {
    if(val === 'All'){
      this.productsPerPage = 100000;
      this.getAllProducts();
    }else{
      this.productsPerPage = val;
      this.getAllProducts();
    }

  }


  /**
   * EXPORT & Import TO EXCEL
   * exportToExcel()
   * onFileChange()
   */

  exportToAllExcel() {
    const date = this.utilsService.getDateString(new Date());

    this.spinner.show();

    // Select
    const mSelect = {
      name: 1,
      sku: 1,
      category: 1,
      attribute: 1,
      model: 1,
      price: 1,
      createdAt: 1,
      createdAtString: 1,
      quantity: 1,
      purchasePrice: 1,
      salePrice: 1,
      colors: 1,
      sizes: 1,
    }

    const filterData: FilterData = {
      filter: this.filter,
      select: mSelect,
      sort: this.sortQuery,
      pagination: null,
    }


    this.subDataOne = this.productService.getAllProducts(filterData, this.searchQuery)
      .subscribe({
        next: (res => {
          const subscriptionReports = res.data;

          const mData = subscriptionReports.map(m => {
            return {
              'Name': m.name,
              'Storage/Others': m.sizes?.name ?? '-',
              'Color': m?.colors?.name ?? '-',
              'Cost Price': m.purchasePrice,
              'Sale Price': m.salePrice,
              'Unit Profit': (m.salePrice - m?.purchasePrice),
              'Quantity': m.quantity,
              'Total Cost Price': m?.purchasePrice * m.quantity,
              'Total Sale Price': m?.salePrice * m.quantity,
              'Total Profit': (m.salePrice - m?.purchasePrice) * m.quantity,
            }
          })
          // EXPORT XLSX
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Data');
          XLSX.writeFile(wb, `Products_Data_${date}.xlsx`);

          this.spinner.hide();
        }),
        error: (error => {
          this.spinner.hide();
          console.log(error);
        })
      });
  }

  exportStockToAllExcel() {
    const date = this.utilsService.getDateString(new Date());

    const mSelect = {
      name: 1,
      sku: 1,
      category: 1,
      subcategory: 1,
      attribute: 1,
      model: 1,
      price: 1,
      createdAt: 1,
      createdAtString: 1,
      quantity: 1,
      purchasePrice: 1,
      salePrice: 1,
      colors: 1,
      sizes: 1,
      discountType: 1,
      discountAmount: 1,
      status: 1,
      imei: 1,
    }

    const filterData: FilterData = {
      pagination: null,
      filter: this.filter,
      select: mSelect,
      sort: {name: 1}
    }

    this.subDataOne = this.productService
      .getAllProducts(filterData, null)
      .subscribe({
        next: (res) => {
          if (res.success) {

            const products = res.data.filter(t => t.quantity !== 0);
            const finalData = products.map(data => {
              return {
                'Product Name': data.name,
                'Item': data?.category?.name ?? '-',
                'Color': data?.colors?.name ?? '-',
                'Storage': data?.sizes?.name ?? '-',
                'Imei': data?.imei ?? '-',
                'Qty': data?.quantity,
                'Cost Price': data?.purchasePrice,
                'Total Cost Price': data?.purchasePrice * (data?.quantity),
                'Sale Price': data?.salePrice,
                'Unit Profit': (data?.salePrice - data?.purchasePrice),
                'Total Profit': ((data?.salePrice*data?.quantity) - (data?.purchasePrice*data?.quantity)),
              }
            })

            const calData: any = {
              'Product Name': 'Total',
              'Item': '',
              'Color': '',
              'Storage': '',
              'Imei': '',
              'Qty': products.map(t => (t?.quantity ?? 0)).reduce((acc, value) => acc + value, 0),
              'Cost Price': products.map(t => (t?.purchasePrice ?? 0)).reduce((acc, value) => acc + value, 0),
              'Total Cost Price': products.map(t => ((t?.purchasePrice ?? 0) * (t?.quantity ?? 0))).reduce((acc, value) => acc + value, 0),
              'Sale Price': products.map(t => (t?.salePrice ?? 0)).reduce((acc, value) => acc + value, 0),
              'Unit Profit': products.map(t => ((t?.salePrice) - (t?.purchasePrice) ?? 0)).reduce((acc, value) => acc + value, 0),
              'Total Profit': products.map(t => ((t?.salePrice * t?.quantity) - (t?.purchasePrice * t?.quantity) ?? 0)).reduce((acc, value) => acc + value, 0),
            }
            finalData.push(calData);

            // EXPORT XLSX
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalData);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Data');
            XLSX.writeFile(wb, `Stock_Report_${date}.xlsx`);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });



  }


  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];

    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, {type: 'binary'});
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});

      // Modify Attributes
      const products = jsonData.products;
      console.log(products);

      // this.insertManyProducts(products);
    };
    reader.readAsBinaryString(file);
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

    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }

    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }

    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }
    if (this.subDataSeven) {
      this.subDataSeven.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }

    if (this.subForm) {
      this.subForm.unsubscribe();
    }

    if (this.subShopInfo) {
      this.subShopInfo.unsubscribe();
    }
  }

}
