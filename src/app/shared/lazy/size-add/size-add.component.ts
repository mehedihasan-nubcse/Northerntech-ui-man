import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {UiService} from '../../../services/core/ui.service';
import {Subscription} from 'rxjs';
import {ReloadService} from '../../../services/core/reload.service';
import {Size} from '../../../interfaces/common/size.interface';
import {SizeService} from '../../../services/common/size.service';

@Component({
  selector: 'app-size-add',
  templateUrl: './size-add.component.html',
  styleUrls: ['./size-add.component.scss']
})
export class SizeAddComponent implements OnInit, OnDestroy {

  // Component Methods
  @Output() onAddData = new EventEmitter<Size>();

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  size?: Size;
  isLoading: boolean = false;

  // Subscriptions
  private subDataOne: Subscription = null;


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private sizeService: SizeService,
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
    this.addSize();
  }


  /**
   * HTTP REQ HANDLE
   * addSize()
   */

  private addSize() {
    this.isLoading = true;
    this.subDataOne = this.sizeService.addSize(this.dataForm.value)
      .subscribe({
        next: (res => {
          if (res.success) {
            this.uiService.success(res.message);
            this.reloadService.needRefreshSize$();
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
