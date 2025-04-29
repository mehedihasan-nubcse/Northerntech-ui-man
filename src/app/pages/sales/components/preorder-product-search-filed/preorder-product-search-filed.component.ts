import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {debounceTime, distinctUntilChanged, EMPTY, pluck, Subscription, switchMap} from 'rxjs';
import {Product} from '../../../../interfaces/common/product.interface';
import {FilterData} from '../../../../interfaces/gallery/filter-data';
import {UtilsService} from '../../../../services/core/utils.service';
import {PresaleProductService} from '../../../../services/common/presale-product.service';
import {ShopInformation} from '../../../../interfaces/common/shop-information.interface';
import {ShopInformationService} from '../../../../services/common/shop-information.service';

@Component({
  selector: 'app-preorder-product-search-filed',
  templateUrl: './preorder-product-search-filed.component.html',
  styleUrls: ['./preorder-product-search-filed.component.scss']
})
export class PreorderProductSearchFiledComponent implements OnInit, AfterViewInit {

  @Output() onSelect = new EventEmitter<Product>();
  isScanner: boolean = false;

  // Shop data
  shopInformation: ShopInformation;

  // SEARCH AREA
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  searchProducts: Product[] = [];
  products: Product[] = [];
  searchQuery = null;
  totalProducts: number = 0;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;


  // Subscriptions
  private subForm: Subscription;
  private subShopInfo: Subscription;


  constructor(
    private productService: PresaleProductService,
    public utilsService: UtilsService,
    private shopInformationService: ShopInformationService,
  ) {
  }

  ngOnInit(): void {
    // Base Data
    this.getShopInformation();
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue.pipe(
      // map(t => t.searchTerm)
      // filter(() => this.searchForm.valid),
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.searchQuery = data;
        if (this.searchQuery === '' || this.searchQuery === null) {
          this.overlay = false;
          this.searchProducts = [];
          this.totalProducts = 0;
          this.searchQuery = null;
          return EMPTY;
        }

        // Select
        const mSelect = {
          name: 1,
          productId: 1,
          sku: 1,
          colors: 1,
          sizes: 1,
          salePrice: 1,
          quantity: 1,
          purchasePrice: 1,
          model: 1,
          others: 1,
          attribute: 1,
        }

        const filterData: FilterData = {
          pagination: null,
          filter: {status: true},
          select: mSelect,
          sort: {createdAt: -1}
        }

        return this.productService.getAllProducts(filterData, this.searchQuery);
      })
    )
      .subscribe({
        next: res => {
          this.searchProducts = res.data;
          this.products = this.searchProducts;
          this.totalProducts = res.count;

          if (this.isScanner) {
            if (this.searchProducts.length > 0) {
              this.onSelectItem(this.products[0]);
            }
          } else {
            if (this.searchProducts.length > 0) {
              this.isOpen = true;
              this.overlay = true;
            }
          }
        },
        error: error => {
          console.log(error)
        }
      })
  }


  /**
   * HANDLE SEARCH Area
   * onClickHeader()
   * onClickSearchArea()
   * handleOverlay()
   * handleFocus()
   * setPanelState()
   * handleOpen()
   * handleOutsideClick()
   * handleCloseOnly()
   * handleCloseAndClear()
   * onSelectItem()
   */


  onClickHeader(): void {
    this.handleCloseOnly();
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

  handleOverlay(): void {
    this.overlay = false;
    this.isOpen = false;
    this.isFocused = false;
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.setPanelState(event);
    }
    this.isFocused = true;
  }

  private setPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.handleOpen();
  }

  handleOpen(): void {
    if (this.isOpen || this.isOpen && !this.isLoading) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  handleOutsideClick(): void {
    if (!this.isOpen) {
      // this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseOnly(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchProducts = [];
    this.isFocused = false;
  }

  onSelectItem(data: Product): void {
    this.handleCloseAndClear();
    this.searchForm.resetForm();
    this.onSelect.emit(data);
  }

  onKey(event: any) {
    if (event && event.keyCode === 13) {
      if (this.searchQuery?.trim()) {
        this.isScanner = true;
      }
    } else {
      this.isScanner = false;
    }
  }

  /**
   * HTTP REQ HANDLE
   * getShopInformation()
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
    if (this.subForm) {
      this.subForm.unsubscribe();
    }

    if (this.subShopInfo) {
      this.subShopInfo.unsubscribe();
    }
  }


}
