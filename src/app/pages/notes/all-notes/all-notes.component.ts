import {Component, OnInit, ViewChild} from '@angular/core';
import {AdminPermissions} from '../../../enum/admin-permission.enum';
import {ShopInformation} from '../../../interfaces/common/shop-information.interface';
import {Select} from '../../../interfaces/core/select';
import {MONTHS, YEARS} from '../../../core/utils/app-data';
import {Notes} from '../../../interfaces/common/notes.interface';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {EMPTY, Subscription} from 'rxjs';
import {NotesService} from '../../../services/common/notes.service';
import {UiService} from '../../../services/core/ui.service';
import {UtilsService} from '../../../services/core/utils.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {ReloadService} from '../../../services/core/reload.service';
import {ShopInformationService} from '../../../services/common/shop-information.service';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {FilterData} from '../../../interfaces/gallery/filter-data';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import * as XLSX from 'xlsx';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-all-notes',
  templateUrl: './all-notes.component.html',
  styleUrls: ['./all-notes.component.scss'],
  providers: [DatePipe]
})
export class AllNotesComponent implements OnInit {
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
  private allNotes: Notes[] = [];
  private holdAllNotes: Notes[] = [];
  notess: { _id: string, data: Notes[], total: number }[] = [];
  holdPrevData: any[] = [];
  id?: string;
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
  searchNotes: Notes[] = [];

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
    private notesService: NotesService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private shopInformationService: ShopInformationService,
  ) {
  }

  ngOnInit(): void {

    // Reload Data
    this.subReload = this.reloadService.refreshData$.subscribe(() => {
      this.getAllNotes();
    });

    // Set Default Filter
    this.setDefaultFilter();
    // Base Data
    this.getAllNotes();
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
            this.searchNotes = [];
            this.notess = this.holdPrevData;
            this.allNotes = this.holdAllNotes;
            this.calculation = this.holdCalculation;
            this.searchQuery = null;
            return EMPTY;
          }

          // Select
          const mSelect = {
            date: 1,
            description: 1,
            createdAt: 1,
          };

          const filterData: FilterData = {
            pagination: null,
            filter: this.filter,
            select: mSelect,
            sort: {dateString: -1},
          };

          return this.notesService.getAllNotes(
            filterData,
            this.searchQuery
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.searchNotes = res.data;
          this.allNotes = res.data;
          this.notess = this.utilsService.arrayGroupByField(this.searchNotes, 'dateString', 'amount');
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
   * getAllNotes()
   * deleteNotesById()
   */

  private getAllNotes() {
    // Spinner..
    this.spinner.show();
    // Select
    const mSelect = {

      date: 1,
      description: 1,
      // createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: {dateString: -1},
    };

    this.subDataOne = this.notesService
      .getAllNotes(filter, null)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          this.spinner.hide();
          if (res.success) {
            this.allNotes = res.data;
            this.holdAllNotes = this.allNotes;
            this.notess = this.utilsService.arrayGroupByField(res.data, 'dateString', 'amount');
            this.holdPrevData = this.notess;
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

  deleteNotesById(id: any) {
    this.subDataTwo = this.notesService.deleteNotesById(id).subscribe({
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

  private deleteMultipleNotesById() {
    this.spinner.show();
    this.subDataThree = this.notesService
      .deleteMultipleNotesById(this.selectedIds)
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
        this.filter = {'month': value};
        this.activeFilterMonth = index;
        break;
      }
      default: {
        break;
      }
    }
    // Re fetch Data
    this.getAllNotes();
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
      this.getAllNotes();
    }
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllNotes();
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
    this.getAllNotes();
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

  onAllSelectChange(event: MatCheckboxChange, data: Notes[], index: number) {
    const currentPageIds = data.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.notess[index].data.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.notess[index].data.find((f) => f._id === m).select = false;
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
        const data = this.allNotes.find(f => f._id === id);
        const mData = {
          date: data?.date,
          notes: data?.description
        }
        selectedSales.push(mData);
      })

      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedSales);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Notes_${date}.xlsx`);

    } else {

      const mData = this.allNotes.map(m=>{

        const nData  = {
          date: m?.date,
          notes: m?.description
        }

        return nData

      }


    )


      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `Notes_${date}.xlsx`);
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
            this.deleteMultipleNotesById();
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
}
