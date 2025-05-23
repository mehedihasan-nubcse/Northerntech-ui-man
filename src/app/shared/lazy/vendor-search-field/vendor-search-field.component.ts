import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  ReplaySubject,
  Subject,
  Subscription,
  switchMap,
  takeUntil,
  tap
} from 'rxjs';
import {FilterData} from '../../../interfaces/gallery/filter-data';
import {VendorService} from '../../../services/common/vendor.service';
import {Vendor} from '../../../interfaces/common/vendor.interface';
import {MatSelectSearchComponent} from 'ngx-mat-select-search';
import {UtilsService} from '../../../services/core/utils.service';
import {Pagination} from '../../../interfaces/core/pagination';
import {MatSelectChange} from '@angular/material/select';
import {ReloadService} from '../../../services/core/reload.service';

@Component({
  selector: 'app-vendor-search-field',
  templateUrl: './vendor-search-field.component.html',
  styleUrls: ['./vendor-search-field.component.scss']
})
export class VendorSearchFieldComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  // Dynamic Component Data
  @Input('controlName') controlName: FormControl;
  @Input('required') required: boolean = false;
  @Input('placeholder') placeholder: string = 'Select';
  @Input('data') data: Vendor;
  @Output('onSelect') onSelect = new EventEmitter();

  // Store Data
  public dataList: Vendor[] = [];
  public filteredDataList: ReplaySubject<Vendor[]> = new ReplaySubject<Vendor[]>(1);
  searchDataList: Vendor[] = [];

  // Form Control
  public selectCtrl: FormControl;

  // Search Control
  public searchCtrl: FormControl = new FormControl();

  // Search Progress
  public searching = false;

  // Pagination
  currentPage = 1;
  dataPerPage = 10;
  totalData = 0;

  // Destroy
  protected _onDestroy = new Subject<void>();

  @ViewChild('matSearchSelect') matSearchSelect: MatSelectSearchComponent;

  // Subscriptions
  private subReload: Subscription = null;

  constructor(
    private vendorService: VendorService,
    private utilsService: UtilsService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {

    // Reload Data
    this.subReload = this.reloadService.refreshData$
      .subscribe(() => {
        this.getAllVendors();
      })

    if (this.controlName) {
      this.selectCtrl = this.controlName;
    } else {
      this.selectCtrl = new FormControl();
    }
    // Default Data
    this.getAllVendors();
  }


  ngOnChanges() {
    if (this.data) {
      const fIndex = this.dataList.findIndex(f => f._id === this.data._id);
      if (fIndex === -1) {
        this.dataList.push(this.data);
        this.selectCtrl.setValue(this.data);
      }
    }
  }


  /**
   * MAIN SEARCH
   */
  ngAfterViewInit() {
    this.searchCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => {
          if (!this.searchCtrl.value.trim()) {
            this.searching = false;
            if (this.selectCtrl.value) {
              const singleArray = [this.selectCtrl.value];
              const allCategories = [...this.searchDataList, ...this.dataList]
              const selectedData = allCategories.filter(m => {
                return singleArray.some(n => n === m._id)
              });
              const uniqueData = this.utilsService.margeMultipleArrayUnique('_id', selectedData, selectedData);
              this.filteredDataList.next([...uniqueData, ...this.dataList]);
              return EMPTY;
            } else {
              this.filteredDataList.next([...this.dataList]);
              return EMPTY;
            }

          }

          const pagination: Pagination = {
            pageSize: 10,
            currentPage: 0,
          };

          // Select
          const mSelect = {
            name: 1,
            slug: 1,
          };

          const filterData: FilterData = {
            pagination: pagination,
            filter: null,
            select: mSelect,
            sort: {createdAt: -1},
          };

          return this.vendorService.getAllVendors(filterData, search);
        })
      )
      .subscribe({
        next: res => {
          this.searching = false;
          this.searchDataList = [...this.searchDataList, ...res.data];
          this.filteredDataList.next(res.data);
        },
        error: error => {
          this.searching = false;
          console.log(error)
        }

      })
  }

  /**
   * GET NEXT DATA
   */
  getNextTestBatch() {
    if (this.searchCtrl.value) {
      return;
    }
    this.currentPage += 1;
    this.getAllVendors();
  }

  /**
   * HTTP REQ HANDLE
   * getAllVendors()
   */

  private getAllVendors() {

    // Select
    const mSelect = {
      name: 1,
      slug: 1,
    };


    const pagination: Pagination = {
      pageSize: this.dataPerPage,
      currentPage: this.currentPage - 1
    };

    const filter: FilterData = {
      filter: null,
      pagination: pagination,
      select: mSelect,
      sort: {createdAt: -1},
    };


    this.vendorService.getAllVendors(filter, null)
      .subscribe({
        next: res => {
          this.totalData = res.count;
          if (this.selectCtrl.value) {
            const singleArray = [this.selectCtrl.value];
            const allCategories = [...this.searchDataList, ...this.dataList]
            const selectedData = allCategories.filter(m => {
              return singleArray.some(n => n === m._id)
            });
            const uniqueData = this.utilsService.margeMultipleArrayUnique('_id', selectedData, selectedData);
            this.dataList = [...this.dataList, ...res.data];
            this.filteredDataList.next([...uniqueData, ...this.dataList, ...res.data]);
          } else {
            this.dataList = [...this.dataList, ...res.data];
            this.filteredDataList.next(this.dataList);
          }
        },
        error: error => {
          console.log(error);
        }
      })
  }

  /**
   * ON CLEAR SEARCH
   * ON CLOSE PANEL
   */
  onClear() {
    this.searchCtrl.reset();
    this.getDefaultDataArray();
  }

  /**
   * DEFAULT COMPLEX DATA FOR SELECT TRACK
   */
  private getDefaultDataArray() {
    if (this.selectCtrl.value) {
      const singleArray = [this.selectCtrl.value];
      const allCategories = [...this.searchDataList, ...this.dataList]
      const selectedData = allCategories.filter(m => {
        return singleArray.some(n => n._id === m._id)
      });
      const uniqueData = this.utilsService.margeMultipleArrayUnique('_id', selectedData, selectedData);
      this.filteredDataList.next([...uniqueData, ...this.dataList]);
      this.selectCtrl.patchValue(uniqueData[0]);
    } else {
      this.filteredDataList.next([...this.dataList]);
    }
  }

  /**
   * ON SELECTION CHANGE
   * onSelectionChange()
   */
  onSelectionChange(event: MatSelectChange) {
    this.onSelect.emit(event.value);
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
  }

}
