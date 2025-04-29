
import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Customer} from '../../../../interfaces/common/customer.interface';
import {NgForm} from '@angular/forms';
import {debounceTime, distinctUntilChanged, EMPTY, pluck, Subscription, switchMap} from 'rxjs';
import {CustomerService} from '../../../../services/common/customer.service';
import {FilterData} from '../../../../interfaces/gallery/filter-data';
import {SaleService} from '../../../../services/common/sale.service';
import {Sale} from '../../../../interfaces/common/sale.interface';


@Component({
  selector: 'app-invoice-search-field',
  templateUrl: './invoice-search-field.component.html',
  styleUrls: ['./invoice-search-field.component.scss']
})
export class InvoiceSearchFieldComponent implements OnInit, AfterViewInit {

  @Output() onSelect = new EventEmitter<Sale>();

  // Store data

  totalCustomers: number = 0;

  // SEARCH AREA
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  // searchInvoice: Customer[] = [];
  searchInvoice: Sale[] = [];
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // Subscriptions
  private subForm: Subscription;

  constructor(
    private salesService: SaleService,
  ) {
  }

  ngOnInit(): void {
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
          this.searchInvoice = [];
          this.totalCustomers = 0;
          this.searchQuery = null;
          return EMPTY;
        }

        // Select
        const mSelect = {
          name: 1,
          phone: 1,
          products: 1,
          customer: 1,
          invoiceNo: 1,
        }

        const filterData: FilterData = {
          pagination: null,
          filter: null,
          select: mSelect,
          sort: {createdAt: -1}
        }

        // return this.customerService.getAllCustomers(filterData, this.searchQuery);
        return this.salesService.getAllSale(filterData, this.searchQuery);
      })
    )
      .subscribe({
        next: res => {
          this.searchInvoice = res.data;
          this.totalCustomers = res.count;
          if (this.searchInvoice.length > 0) {
            this.isOpen = true;
            this.overlay = true;
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
    if (this.searchInvoice.length > 0) {
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
    if (this.searchInvoice.length > 0) {
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
    this.searchInvoice = [];
    this.isFocused = false;
  }

  onSelectItem(data: Sale): void {
    this.handleCloseAndClear();
    this.searchForm.resetForm();
    this.onSelect.emit(data);
  }


}
