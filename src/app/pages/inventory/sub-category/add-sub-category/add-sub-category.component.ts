import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {SubCategory} from '../../../../interfaces/common/sub-category.interface';
import {Subscription} from 'rxjs';
import {UiService} from '../../../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute} from '@angular/router';
import {SubCategoryService} from '../../../../services/common/sub-category.service';
import {FilterData} from '../../../../interfaces/gallery/filter-data';
import {CategoryService} from '../../../../services/common/category.service';
import {Category} from '../../../../interfaces/common/category.interface';


@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html',
  styleUrls: ['./add-sub-category.component.scss']
})

export class AddSubCategoryComponent implements OnInit, OnDestroy {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  subCategory?: SubCategory;
  categories?: Category[];
  // FilterData
  filter: any = null;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subRouteOne: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
  ) {
  }


  ngOnInit(): void {

    // Init Data Form
    this.initDataForm()

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSubCategoryById();
      }
    });
    this.getAllCategory()
  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */

  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      code: [null],
      description: [null],
      img: [null],
      category: [null, Validators.required],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue({...this.subCategory});

  }

  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }
    if (this.subCategory) {
      this.updateSubCategoryById();
    } else {
      this.spinner.show();
      this.addSubCategory();
    }

  }


  /**
   * HTTP REQ HANDLE
   * getAllCategory()
   * getSubCategoryById()
   * addSubCategory()
   * updateSubCategoryById()
   */


  private getAllCategory() {
    this.spinner.show();

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
            this.spinnerService.hide();
          }
        },
        error: (err) => {
          console.log(err);
          this.spinner.hide();
        },
      });
  }

  private getSubCategoryById() {
    this.spinnerService.show();
    this.subDataTwo = this.subCategoryService.getSubCategoryById(this.id)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.data) {
            this.subCategory = res.data;
            this.setFormValue();
          }
        }),
        error: (error => {
          this.spinnerService.hide();
          console.log(error);
        })
      });
  }

  private addSubCategory() {
    // Spinner..
    this.spinner.show();
    this.subDataOne = this.subCategoryService.addSubCategory(this.dataForm.value)
      .subscribe({
        next: (res => {
          // Spinner..
          this.spinner.hide();
          if (res.success) {
            this.uiService.success(res.message);
            this.formElement.resetForm();
          } else {
            this.uiService.warn(res.message);
          }
        }),
        error: (error => {
          this.spinnerService.hide();
          console.log(error);
        })
      });
  }

  private updateSubCategoryById() {
    // Spinner..
    this.spinner.show();
    this.subDataThree = this.subCategoryService.updateSubCategoryById(this.subCategory._id, this.dataForm.value)
      .subscribe({
        next: (res => {
          // Spinner..
          this.spinner.hide();
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }

        }),
        error: (error => {
          this.spinner.hide();
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
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
  }

}
