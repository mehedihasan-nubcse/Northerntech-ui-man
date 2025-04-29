import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {UiService} from "../../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {AttributeService} from "../../../../services/common/attribute.service";
import {Subscription} from "rxjs";
import {Attribute} from "../../../../interfaces/common/attribute.interface";


@Component({
  selector: 'app-add-attribute',
  templateUrl: './add-attribute.component.html',
  styleUrls: ['./add-attribute.component.scss']
})
export class AddAttributeComponent implements OnInit, OnDestroy {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  id?: string;
  attribute?: Attribute;

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
    private attributeService: AttributeService,
  ) {
  }


  ngOnInit(): void {

    // Init Data Form
    this.initDataForm()

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getAttributeById();
      }
    });
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
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.attribute);
  }

  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }
    if (this.attribute) {
      this.updateAttributeById();
    } else {
      this.spinner.show();
      this.addAttribute();
    }

  }


  /**
   * HTTP REQ HANDLE
   * getAttributeById()
   * addAttribute()
   * updateAttributeById()
   */

  private getAttributeById() {
    this.spinnerService.show();
    this.subDataTwo = this.attributeService.getAttributeById(this.id)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.data) {
            this.attribute = res.data;
            this.setFormValue();
          }
        }),
        error: (error => {
          this.spinnerService.hide();
          console.log(error);
        })
      });
  }

  private addAttribute() {
    // Spinner..
    this.spinner.show();
    this.subDataOne = this.attributeService.addAttribute(this.dataForm.value)
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


  private updateAttributeById() {
    // Spinner..
    this.spinner.show();
    this.subDataThree = this.attributeService.updateAttributeById(this.attribute._id, this.dataForm.value)
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
