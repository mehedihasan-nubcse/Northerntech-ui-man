import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Vendor} from '../../../interfaces/common/vendor.interface';
import {UiService} from '../../../services/core/ui.service';
import {VendorService} from '../../../services/common/vendor.service';
import {Subscription} from 'rxjs';
import {ReloadService} from '../../../services/core/reload.service';

@Component({
  selector: 'app-vendor-add',
  templateUrl: './vendor-add.component.html',
  styleUrls: ['./vendor-add.component.scss']
})
export class VendorAddComponent implements OnInit, OnDestroy {

  // Component Methods
  @Output() onAddData = new EventEmitter<Vendor>();

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  vendor?: Vendor;
  isLoading: boolean = false;

  // Subscriptions
  private subDataOne: Subscription = null;


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private vendorService: VendorService,
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
      company: [null],
      address: [null],
      email: new FormControl(null, [Validators.email]),
      phone: [null],
      alternateNumber: [null],
      image: [null],
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }
    this.addVendor();
  }


  /**
   * HTTP REQ HANDLE
   * addVendor()
   */

  private addVendor() {
    this.isLoading = true;
    this.subDataOne = this.vendorService.addVendor(this.dataForm.value)
      .subscribe({
        next: (res => {
          if (res.success) {
            this.uiService.success(res.message);
            this.reloadService.needRefreshData$();
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
