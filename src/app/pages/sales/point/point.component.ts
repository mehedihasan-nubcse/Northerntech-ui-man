import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UiService } from '../../../services/core/ui.service';
import { Router } from '@angular/router';
import { PointService } from '../../../services/common/point.service';
import { Point } from '../../../interfaces/common/point.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss']
})
export class PointComponent implements OnInit, OnDestroy{
  dataForm?: FormGroup;

  point: Point;

  // Store Data from param
  id?: string;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    public router: Router,
    private shopInformationService: PointService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // INIT FORM
    this.initFormGroup();

    // GET DATA
    this.getPoint();
  }

  /**
   * FORMS METHODS
   * initFormGroup()
   * setFormData()
   * onSubmit()
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      pointAmount: [null],
      pointValue: [null],
    });
  }

  private setFormData() {
    this.dataForm.patchValue(this.point);
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    this.addPoint(this.dataForm.value);
  }

  /**
   * HTTP REQ HANDLE
   * addPoint()
   * getPoint()
   */
  private addPoint(data: any) {
    this.spinner.show();
    this.subDataOne = this.shopInformationService
      .addPoint(data)
      .subscribe({
        next:res => {
          this.uiService.success(res.message);
          this.spinner.hide();
        }
        ,
        error: err => {
          this.spinner.hide();
          console.log(err);
        }
      });
  }

  private getPoint() {
    this.spinner.show();
    this.subDataTwo = this.shopInformationService.getPoint().subscribe(
      (res) => {
        this.point = res.data;
        this.spinner.hide();
        this.setFormData();
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
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
  }
}
