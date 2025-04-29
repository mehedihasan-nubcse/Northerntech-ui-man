import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {UiService} from '../../../services/core/ui.service';

import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
// @ts-ignore
import {default as _rollupMoment} from 'moment';
import {Product} from '../../../interfaces/common/product.interface';
import {UtilsService} from '../../../services/core/utils.service';
import {Select} from "../../../interfaces/core/select";
import {PAYMENT_TYPES, STOCK_TYPES} from "../../../core/utils/app-data";

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-damage-controller',
  templateUrl: './damage-controller.component.html',
  styleUrls: ['./damage-controller.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DamageControllerComponent implements OnInit {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  activeTab:string = 'out-stock';
  today = moment();
  product: Product = null;

  stockData: Select[] = STOCK_TYPES;
  stockType: string = 'out-stock';
  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<DamageControllerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
  ) {
  }

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();

    if (this.data) {
      this.product = this.data;
      this.dataForm.patchValue({product: this.product})
    }

  }

  // This method ensures the user cannot input a value greater than the max limit
  onQuantityInput(): void {
    const quantityControl = this.dataForm.get('quantity');
    if (quantityControl?.value > this.product?.quantity) {
      quantityControl.setValue(0); // Set the value back to the max limit if exceeded
    }
  }

  onTabClick(tab: string){
    this.activeTab = tab;
    this.stockType = tab;
  }
  /**
   * INIT FORM & Submit
   * initDataForm()
   * onSubmit()
   */
  private initDataForm() {
    this.dataForm = this.fb.group({
      quantity: [null, [
        Validators.required,
        Validators.min(0),  // Ensures the value is >= 0
        Validators.max(this.product?.quantity)  // Ensures the value is <= product's stock quantity
      ]],
      product: [null],
      date: [this.today, Validators.required],
      salesman: [null, Validators.required],
      note: [null],
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    const data = {
      ...this.dataForm.value,
      ...{
        dateString: this.utilsService.getDateString(this.dataForm.value.date),
        updateTime: this.utilsService.getCurrentTime(),
        month: this.utilsService.getDateMonth(false, this.dataForm.value.date),
        year: new Date( this.dataForm.value.date).getFullYear(),
        quantity: this.stockType=== 'out-stock' ? -this.dataForm.value.quantity : this.dataForm.value.quantity
      }
    }
    this.dialogRef.close({
      data: data,
      type: 'add'
    })
  }

  /**
   * ON CLOSE DIALOG
   */
  onClose() {
    this.dialogRef.close({
      type: 'close'
    })
  }

}
