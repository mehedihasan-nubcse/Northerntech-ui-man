import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {SubCategory} from '../../../interfaces/common/sub-category.interface';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UiService} from '../../../services/core/ui.service';
import {SubCategoryService} from '../../../services/common/sub-category.service';
import {ReloadService} from '../../../services/core/reload.service';
import {FilterData} from '../../../interfaces/gallery/filter-data';
import {CategoryService} from '../../../services/common/category.service';
import {Category} from '../../../interfaces/common/category.interface';

@Component({
  selector: 'app-sub-category-add',
  templateUrl: './sub-category-add.component.html',
  styleUrls: ['./sub-category-add.component.scss']
})
export class SubCategoryAddComponent implements OnInit, OnDestroy {

  // Component Methods
  @Output() onAddData = new EventEmitter<SubCategory>();

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  subCategory?: SubCategory;
  isLoading: boolean = false;

  categories?: Category[];
  // FilterData
  filter: any = null;
  // Subscriptions
  private subDataOne: Subscription = null;


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private subCategoryService: SubCategoryService,
    private reloadService: ReloadService,
    private categoryService: CategoryService,
  ) {
  }


  ngOnInit(): void {
    // Init Data Form
    this.initDataForm()
    this.getAllCategory()

  }

  /**
   * Data Form Methods
   * initDataForm()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      code: [null],
      category: [null, Validators.required],
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }
    this.addSubCategory();
  }


  /**
   * HTTP REQ HANDLE
   * addSubCategory()
   */

  private getAllCategory() {


    const mSelect = {
      name: 1,
      createdAt: 1,
    };

    const filter: FilterData = {
      filter: this.filter,
      pagination: null,
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataOne = this.categoryService

      .getAllCategory(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.categories = res.data;

          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private addSubCategory() {
    this.isLoading = true;
    this.subDataOne = this.subCategoryService.addSubCategory(this.dataForm.value)
      .subscribe({
        next: (res => {
          if (res.success) {
            this.uiService.success(res.message);
            this.reloadService.needRefreshSubCategory$();
            this.onAddData.emit({...this.dataForm.value, ...{_id: res.data?._id}});
            this.formElement.resetForm();
            this.isLoading = false;
          } else {
            this.isLoading = false;
            this.uiService.warn(res.message);
          }
        }),
        error: (error => {
          this.isLoading = false;
          console.log(error);
        })
      });
  }

  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }

}
