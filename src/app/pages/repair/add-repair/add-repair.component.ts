import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Repair} from "../../../interfaces/common/repair.interface";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {RepairService} from "../../../services/common/repair.service";
import {FileUploadService} from "../../../services/gallery/file-upload.service";
import {MatDialog} from "@angular/material/dialog";
import {UtilsService} from "../../../services/core/utils.service";
import {AllImagesDialogComponent} from "../../gallery/images/all-images-dialog/all-images-dialog.component";
import {Gallery} from "../../../interfaces/gallery/gallery.interface";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Color} from "../../../interfaces/common/color.interface";
import {FilterData} from "../../../interfaces/gallery/filter-data";
import {ColorService} from "../../../services/common/color.service";
import {Brand} from "../../../interfaces/common/brand.interface";
import {BrandService} from "../../../services/common/brand.service";
import {ProblemService} from "../../../services/common/problem.service";
import {ReloadService} from "../../../services/core/reload.service";
import {ShopInformationService} from "../../../services/common/shop-information.service";
import {ShopInformation} from "../../../interfaces/common/shop-information.interface";
import {DatePipe} from "@angular/common";
import {Model} from "../../../interfaces/common/model.interface";
import {ModelService} from "../../../services/common/model.service";

@Component({
  selector: 'app-add-repair',
  templateUrl: './add-repair.component.html',
  styleUrls: ['./add-repair.component.scss'],
  providers: [DatePipe]
})
export class AddRepairComponent implements OnInit {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  // Shop data
  shopInformation: ShopInformation;
  // Store Data
  today: Date = new Date();
  id?: string;
  repair?: Repair | any;
  repairData?: any;

  // Image Upload
  files: File[] = [];
  chooseImage?: string[] = [];
  sizeForm = false;
  colorForm = false;
  problemForm = false;
  brandForm = false;
  modelForm = false;
  colors: Color[] = [];
  brand: Brand[] = [];
  problem: Brand[] = [];
  model: Model[] = [];
  // Subscriptions
  private subDataOne: Subscription;
  private subShopInfo: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subReloadTwo: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private repairService: RepairService,
    private router: Router,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private colorService: ColorService,
    private brandService: BrandService,
    private problemService: ProblemService,
    private modelService: ModelService,
    private utilsService: UtilsService,
    private reloadService: ReloadService,
    private shopInformationService: ShopInformationService,
  ) {
  }


  ngOnInit(): void {
    // Init Form
    this.initForm();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getRepairById();
      }
    });
    this.subReloadTwo = this.reloadService.refreshColor$
      .subscribe(() => {
        this.getAllColor();
        this.getAllBrand();
        this.getAllProblem();
        this.getAllModel();
      })

    // this.subReloadThree = this.reloadService.refreshSize$
    //   .subscribe(() => {
    //     this.getAllSize();
    //   })

    this.getAllColor();
    this.getAllBrand();
    this.getAllProblem();
    this.getAllModel();
    this.getShopInformation();
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
      repairFor: [null],
      nricNo: [null],
      phoneNo: [null, Validators.required],
      status: ['Pending'],
      brand: [null,Validators.required],
      modelNo: [null,Validators.required],
      color: [null, Validators.required],
      imeiNo: [null],
      problem: [null,Validators.required],
      purchase: [null],
      condition: [null,Validators.required],
      password: [null],
      amount: [null],
      description: [null],
      images: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.repair);

    if (this.repair?.brand) {
      this.dataForm.patchValue({
        brand: this.repair?.brand._id
      });
    }

    if (this.repair?.color) {
      this.dataForm.patchValue({
        color: this.repair.color._id
      });
    }

    if (this.repair?.problem) {
      this.dataForm.patchValue({
        problem: this.repair.problem._id
      });
    }
    if (this.repair?.modelNo) {
      this.dataForm.patchValue({
        modelNo: this.repair.modelNo._id
      });
    }
    // Set Image
    if (this.repair.images && this.repair.images.length) {
      this.chooseImage = this.repair.images;
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

    if (this.dataForm.value.color) {
      mData = {
        ...mData,
        ...{
          color: {
            _id: this.dataForm.value.color,
            name: this.colors.find((f) => f._id === this.dataForm.value.color).name,
          }
        }
      };
    }

    if (this.dataForm.value.brand) {
      mData = {
        ...mData,
        ...{
          brand: {
            _id: this.dataForm.value.brand,
            name: this.brand.find((f) => f._id === this.dataForm.value.brand).name,
          }
        }
      };
    }

    if (this.dataForm.value.problem) {
      mData = {
        ...mData,
        ...{
          problem: {
            _id: this.dataForm.value.problem,
            name: this.problem.find((f) => f._id === this.dataForm.value.problem).name,
          }
        }
      };
    }

    if (this.dataForm.value.modelNo) {
      mData = {
        ...mData,
        ...{
          modelNo: {
            _id: this.dataForm.value.modelNo,
            name: this.model.find((f) => f._id === this.dataForm.value.modelNo).name,
          }
        }
      };
    }

    this.repairData = mData;

    if (this.repair) {

      this.updateRepairById(mData);

    } else {

      this.addRepair(mData);

    }
  }

  /**
   * HTTP REQ HANDLE
   * getRepairById()
   * addRepair()
   * updateRepairById()
   */
  /**
   * Get Shop Info
   * getShopInformation() $
   */
  private getShopInformation() {
    this.subShopInfo = this.shopInformationService.getShopInformation()
      .subscribe({
        next: res => {
          this.shopInformation = res.data;
        },
        error: err => {
          console.log(err);
        }
      })
  }
  private getRepairById() {
    this.spinnerService.show();
    this.subDataTwo = this.repairService.getRepairById(this.id)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.data) {
            this.repair = res.data;
            this.setFormValue();
          }
        }),
        error: (error => {
          this.spinnerService.hide();
          console.log(error);
        })
      });
  }


  private addRepair(data:any) {
    this.spinnerService.show();
    this.subDataOne = this.repairService.addRepair(data)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
            setTimeout(() => {
              this.formElement.resetForm();
              this.onPrint();
            }, 200)
            // this.formElement.resetForm();
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
   * ON PRINT & Enter
   * onPrint()
   * onEnterEvent()
   */
  onPrint() {
    window.print();
    window.close();
  }

  private updateRepairById(data:any) {
    this.spinnerService.show();
    this.subDataThree = this.repairService.updateRepairById(this.repair._id, data)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
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

  onAddNewColor(event: Color) {
    setTimeout(() => {
      this.dataForm.patchValue({
        colors: event._id
      });
      this.colorForm = false;
    }, 500)
  }

  onAddNewBrand(event: Brand) {
    setTimeout(() => {
      this.dataForm.patchValue({
        brand: event._id
      });
      this.brandForm = false;
    }, 500)
  }

  onAddNewProblem(event: Brand) {
    setTimeout(() => {
      this.dataForm.patchValue({
        problem: event._id
      });
      this.problemForm = false;
    }, 500)
  }

  onAddNewModel(event: Brand) {
    setTimeout(() => {
      this.dataForm.patchValue({
        model: event._id
      });
      this.modelForm = false;
    }, 500)
  }

  onToggle(type: 'vendor' | 'category' | 'color' | 'brand' | 'problem' | 'model' | 'subCategory') {
    // if (type === 'vendor') {
    //   this.vendorForm = !this.vendorForm;
    // }
    //
    // if (type === 'category') {
    //   this.categoryForm = !this.categoryForm;
    // }
    //
    // if (type === 'subCategory') {
    //   this.subCategoryForm = !this.subCategoryForm;
    // }


    if (type === 'color') {
      this.colorForm = !this.colorForm;
    }

    if (type === 'brand') {
      this.brandForm = !this.brandForm;
    }

    if (type === 'problem') {
      this.problemForm = !this.problemForm;
    }
    if (type === 'model') {
      this.modelForm = !this.modelForm;
    }

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

  private getAllColor() {
    // Select
    const mSelect = {
      name: 1,
    };

    const filter: FilterData = {
      filter: null,
      pagination: null,
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataThree = this.colorService.getAllColor(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.colors = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getAllBrand() {
    // Select
    const mSelect = {
      name: 1,
    };

    const filter: FilterData = {
      filter: null,
      pagination: null,
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataThree = this.brandService.getAllBrands1(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.brand = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  private getAllProblem() {
    // Select
    const mSelect = {
      name: 1,
    };

    const filter: FilterData = {
      filter: null,
      pagination: null,
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataThree = this.problemService.getAllProblems1(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.problem = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  private getAllModel() {
    // Select
    const mSelect = {
      name: 1,
    };

    const filter: FilterData = {
      filter: null,
      pagination: null,
      select: mSelect,
      sort: {createdAt: -1},
    };

    this.subDataThree = this.modelService.getAllModels1(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.model = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
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
