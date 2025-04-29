import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {OrderStatus} from "../../../../enum/order.enum";
import {UiService} from "../../../../services/core/ui.service";

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.component.html',
  styleUrls: ['./update-status.component.scss']
})
export class UpdateStatusComponent implements OnInit, OnDestroy {
  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  isLoading = false;

  // Store Data from param
  // order: Order = null;

  today = new Date();


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    public dialogRef: MatDialogRef<UpdateStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      status: [null, Validators.required],
      deliveredDate: [null, Validators.required],
    });

    if (this.data) {
      this.dataForm.patchValue({ status: this.data.status,deliveredDate: this.data.deliveredDate});
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    this.onCloseDialog(this.dataForm.value);
  }


  /**
   * ON CLOSE DIALOG
   */
  onCloseDialog(data: any) {
    this.dialogRef.close({ data: data });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
