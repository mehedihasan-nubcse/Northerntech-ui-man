import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from '../../../../services/common/category.service';
import {UiService} from '../../../../services/core/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ReloadService} from '../../../../services/core/reload.service';
import {EMPTY, Subscription} from 'rxjs';
import {Product, ProductCalculation} from '../../../../interfaces/common/product.interface';
import {ProductService} from '../../../../services/common/product.service';
import {FilterData} from '../../../../interfaces/gallery/filter-data';
import {Category} from '../../../../interfaces/common/category.interface';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {Pagination} from '../../../../interfaces/core/pagination';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {UtilsService} from '../../../../services/core/utils.service';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {AdminPermissions} from '../../../../enum/admin-permission.enum';
import {ConfirmDialogComponent} from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {AdminService} from '../../../../services/admin/admin.service';
import * as XLSX from 'xlsx';
import {VendorService} from "../../../../services/common/vendor.service";
import {Vendor} from "../../../../interfaces/common/vendor.interface";
import {DamageControllerComponent} from '../../../../shared/dialog-view/damage-controller/damage-controller.component';
import {ProductDamageService} from '../../../../services/common/product-damage.service';
import {ShopInformation} from '../../../../interfaces/common/shop-information.interface';
import {ShopInformationService} from '../../../../services/common/shop-information.service';
import {Select} from '../../../../interfaces/core/select';
import {DATA_BOOLEAN} from '../../../../core/utils/app-data';

@Component({
  selector: 'app-expired-product-list',
  templateUrl: './expired-product-list.component.html',
  styleUrls: ['./expired-product-list.component.scss'],
})
export class ExpiredProductListComponent implements OnInit, AfterViewInit, OnDestroy {

  // Admin Base Data
  adminId: string;
  role: string;
  permissions: AdminPermissions[];

  // Static Data
  dataBoolean: Select[] = DATA_BOOLEAN;

  // Shop data
  shopInformation: ShopInformation;

  // Store Data
  isLoading: boolean = true;
  toggleMenu: boolean = false;
  products?: Product[] = [];
  holdPrevData: Product[] = [];
  categories: Category[] = [];
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
  activeSort: number;

  showPerPageList = [{num: 25}, {num: 50}, {num: 100}, {num: 500}, {num: 1000}];

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
    private productService: ProductService,
    private adminService: AdminService,
    private categoryService: CategoryService,
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
            purchasePrice: 1,
            salePrice: 1,
            status: 1,
            createdAt: 1,
            colors: 1,
            sizes: 1,
            discountType: 1,
            discountAmount: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: {
              ...this.filter, ...{expireDate: {$lte: this.utilsService.getDateString(new Date())}}
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
   * getAllProducts()
   * getAllCategory()
   * getAllVendors()
   * getShopInformation()
   * addProductDamage()
   * deleteMultipleProductById()
   */

  private getAllProducts() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: Number(this.productsPerPage),
      currentPage: Number(this.currentPage) - 1,
    };

    const filter: FilterData = {
      filter: {
        ...this.filter, ...{expireDate: {$lte: this.utilsService.getDateString(new Date())}}
      },
      pagination: pagination,
      select: {
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
        discountType: 1,
        discountAmount: 1,
        status: 1,
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

          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
          this.spinner.hide();
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
   */

  filterData(value: any, index: number, type: string) {
    switch (type) {
      case 'category': {
        this.filter = {...this.filter, ...{'category._id': value}};
        this.activeFilter1 = index;
        break;
      }
      case 'vendor': {
        this.filter = {...this.filter, ...{'vendor._id': value}};
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
    this.dataFormDateRange.reset();
    // Re fetch Data
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllProducts();
    }
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
    this.productsPerPage = val;
    this.getAllProducts();
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
              'Product Id': m.productId,
              'Name': m.name,
              'Category': m?.category?.name,
              'Attribute': m?.attribute?.name,
              'Code': m.sku,
              'Color': m.colors?.name,
              'Size': m.sizes?.name,
              'Purchase Price': m.purchasePrice,
              'Sale Price': m.salePrice,
              'Quantity': m.quantity,
              'T T.P': m?.purchasePrice * m?.quantity,
              'Total Amount': m?.salePrice * m?.quantity,
              'Created Date': this.utilsService.getDateString(m.createdAt),
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
