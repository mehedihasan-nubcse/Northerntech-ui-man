import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {UiService} from '../../../services/core/ui.service';
import {Subscription} from 'rxjs';
import {ReloadService} from '../../../services/core/reload.service';
import {Category} from '../../../interfaces/common/category.interface';
import {CategoryService} from '../../../services/common/category.service';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss']
})
export class CategoryAddComponent implements OnInit, OnDestroy {

  // Component Methods
  @Output() onAddData = new EventEmitter<Category>();

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  category?: Category;
  isLoading: boolean = false;

  // Subscriptions
  private subDataOne: Subscription = null;


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private categoryService: CategoryService,
    private reloadService: ReloadService
  ) {
  }


  ngOnInit(): void {
    // Init Data Form
    this.initDataForm()

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
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }
    this.addCategory();
  }


  /**
   * HTTP REQ HANDLE
   * addCategory()
   */

  private addCategory() {
    this.isLoading = true;
    this.subDataOne = this.categoryService.addCategory(this.dataForm.value)
      .subscribe({
        next: (res => {
          if (res.success) {
            this.uiService.success(res.message);
            this.reloadService.needRefreshCategory$();
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
