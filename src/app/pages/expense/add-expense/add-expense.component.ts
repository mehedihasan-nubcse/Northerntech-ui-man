import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Expense} from 'src/app/interfaces/common/expense.interface';
import {UiService} from "../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {ExpenseService} from "../../../services/common/expense.service";
import {FileUploadService} from 'src/app/services/gallery/file-upload.service';
import {MatDialog} from '@angular/material/dialog';
import {Gallery} from '../../../interfaces/gallery/gallery.interface';
import {UtilsService} from '../../../services/core/utils.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {AllImagesDialogComponent} from '../../gallery/images/all-images-dialog/all-images-dialog.component';


@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss']
})
export class AddExpenseComponent implements OnInit {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;

  // Store Data
  today: Date = new Date();
  id?: string;
  expense?: Expense;

  // Image Upload
  files: File[] = [];
  chooseImage?: string[] = [];

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private expenseService: ExpenseService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
  ) {
  }


  ngOnInit(): void {
    // Init Form
    this.initForm();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getExpenseById();
      }
    });
  }

  /**
   * FORMS METHODS
   * initForm()
   * setFormValue()
   * onSubmit()
   */

  private initForm() {
    this.dataForm = this.fb.group({
      date: [new Date(), Validators.required],
      expenseFor: [null],
      amount: [null],
      description: [null],
      images: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.expense);

    // Set Image
    if (this.expense.images && this.expense.images.length) {
      this.chooseImage = this.expense.images;
    }
  }

  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

   let mData = {
      ...this.dataForm.value,
      ...{
        dateString: this.utilsService.getDateString(this.dataForm.value.date),
        month: this.utilsService.getDateMonth(false, this.dataForm.value.date),
        year: this.utilsService.getDateYear(this.dataForm.value.date),
      }
    }

    if (this.expense) {
        this.updateExpenseById(mData);
    } else {
        this.addExpense(mData);
    }
  }

  /**
   * HTTP REQ HANDLE
   * getExpenseById()
   * addExpense()
   * updateExpenseById()
   */

  private getExpenseById() {
    this.spinnerService.show();
    this.subDataTwo = this.expenseService.getExpenseById(this.id)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.data) {
            this.expense = res.data;
            this.setFormValue();
          }
        }),
        error: (error => {
          this.spinnerService.hide();
          console.log(error);
        })
      });
  }


  private addExpense(data:any) {
    this.spinnerService.show();
    this.subDataOne = this.expenseService.addExpense(data)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
            this.formElement.resetForm();
            // this.dataForm.value.reset()
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

  private updateExpenseById(data:any) {
    this.spinnerService.show();
    this.subDataThree = this.expenseService.updateExpenseById(this.expense._id, data)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
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


  /**
   * OPEN COMPONENT DIALOG
   * openGalleryDialog()
   */

  public openGalleryDialog() {
    const dialogRef = this.dialog.open(AllImagesDialogComponent, {
      data: {type: 'multiple', count: this.chooseImage.length ? (10 - this.chooseImage.length) : 10},
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          this.patchPickedImagesUnique(dialogResult.data);
        }
      }
    });
  }

  /**
   * IMAGE UPLOAD
   * patchPickedImagesUnique()
   * drop()
   * removeSelectImage()
   */

  private patchPickedImagesUnique(images: Gallery[]) {
    if (this.chooseImage && this.chooseImage.length > 0) {
      const nImages = images.map(m => m.url);
      this.chooseImage = this.utilsService.mergeArrayString(nImages, this.chooseImage);
    } else {
      this.chooseImage = images.map(m => m.url);
    }
    this.dataForm.patchValue(
      {images: this.chooseImage}
    );
  }



  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.chooseImage, event.previousIndex, event.currentIndex);
  }


  removeSelectImage(s: string) {
    const index = this.chooseImage.findIndex(x => x === s);
    this.chooseImage.splice(index, 1);
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
    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }
  }

}
