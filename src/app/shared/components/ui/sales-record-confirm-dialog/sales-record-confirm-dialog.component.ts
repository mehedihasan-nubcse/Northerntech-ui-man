import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Unit} from "../../../../interfaces/common/unit.interface";
import {UiService} from "../../../../services/core/ui.service";
import {Payout} from "../../../../interfaces/common/payout.interface";
import {PayoutService} from "../../../../services/common/payout.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sales-record-confirm-dialog',
  templateUrl: './sales-record-confirm-dialog.component.html',
  styleUrls: ['./sales-record-confirm-dialog.component.scss']
})
export class SalesRecordConfirmDialogComponent implements OnInit {
  payoutDataArray?: FormArray;
  dataForm: FormGroup;
  selectedUnitTypes?: Unit[] = [];
  payouts?: Payout;
  isLoading = false;

// Subscriptions
  private subDataTwo: Subscription;
  private subDataThree: Subscription;


  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  constructor(
    private uiService: UiService,
    private payoutService: PayoutService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SalesRecordConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();

    // GET DATA
    this.getPayout();
  }

  private initDataForm() {
    this.dataForm = this.fb.group({

      payoutAmount: this.fb.array([
        // this.createObjectElement()
      ]),

    });
    this.payoutDataArray = this.dataForm.get('payoutAmount') as FormArray;
  }

  createStringElement() {
    return this.fb.control('');
  }

  createObjectElement() {
    return this.fb.group({
      name: [null],
      value: [null],
    });
  }


  onAddNewPayoutAmount(formControl: string) {
    const f = this.fb.group({
      name: [null],
      value: [null]
    });
    (this.dataForm?.get(formControl) as FormArray).push(f);
  }

  removeFormArrayField(formControl: string, index: number) {
    let formDataArray: FormArray;
    switch (formControl) {
      case 'payoutAmount': {
        formDataArray = this.payoutDataArray;
        break;
      }
      default: {
        formDataArray = null;
        break;
      }
    }
    formDataArray?.removeAt(index);
    this.selectedUnitTypes.splice(index, 1);
  }

  private setFormValue() {
    if (this.payouts.payoutAmount && this.payouts.payoutAmount.length) {
      this.payouts.payoutAmount.map(m => {
        const f = this.fb.group({
          name: [m.name, Validators.required],
          value: [m.value, Validators.required],
        });
        (this.dataForm?.get('payoutAmount') as FormArray).push(f);
      });
    }
  }

  /**
   * ON SUBMIT FORM
   */
  onSubmit() {
    // Check Required Field
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }
    if (!this.payouts) {
      this.addPayout()
    } else {
      this.updatePayoutById()
    }
  }


  private addPayout() {
    this.isLoading = true;
    this.subDataTwo = this.payoutService
      .addPayout(this.dataForm.value)
      .subscribe({
        next: (res) => {
          if (res.success) {

            this.uiService.success(res.message);
            this.formElement.resetForm();
            this.isLoading = false;

          } else {
            this.uiService.warn(res.message);
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
        },
      });
  }

  private getPayout() {
    this.subDataTwo = this.payoutService.getPayout()
      .subscribe(res => {
        this.payouts = res.data;
        if (this.payouts) {
          this.setFormValue();
        }
      }, err => {
        console.log(err);
      });
  }

  private updatePayoutById() {
    this.isLoading = true;
    this.subDataThree = this.payoutService
      .updatePayoutById(this.payouts._id, this.dataForm.value)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.uiService.success(res.message);
            this.isLoading = false;
          } else {
            this.uiService.warn(res.message);
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
        },
      });
  }


  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

}
