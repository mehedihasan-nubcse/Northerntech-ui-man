import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Model} from "../../../interfaces/common/model.interface";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {ModelService} from "../../../services/common/model.service";
import {ReloadService} from "../../../services/core/reload.service";

@Component({
  selector: 'app-model-add',
  templateUrl: './model-add.component.html',
  styleUrls: ['./model-add.component.scss']
})
export class ModelAddComponent implements OnInit, OnDestroy {

  // Component Methods
  @Output() onAddData = new EventEmitter<Model>();

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  model?: Model;
  isLoading: boolean = false;

  // Subscriptions
  private subDataOne: Subscription = null;


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private modelService: ModelService,
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
      // code: [null],
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }
    this.addModel();
  }


  /**
   * HTTP REQ HANDLE
   * addModel()
   */

  private addModel() {
    this.isLoading = true;
    this.subDataOne = this.modelService.addModelByShop(this.dataForm.value)
      .subscribe({
        next: (res => {
          if (res.success) {
            this.uiService.success(res.message);
            this.reloadService.needRefreshColor$();
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
