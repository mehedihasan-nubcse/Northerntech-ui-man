import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Select} from "../../../interfaces/core/select";
import {DATA_BOOLEAN, PAYMENT_TYPES, PAYMENT_TYPES1} from "../../../core/utils/app-data";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {BuyBack} from "../../../interfaces/common/buy-back.interface";
import {Category} from "../../../interfaces/common/category.interface";
import {SubCategory} from "../../../interfaces/common/sub-category.interface";
import {Attribute} from "../../../interfaces/common/attribute.interface";
import {Color} from "../../../interfaces/common/color.interface";
import {Size} from "../../../interfaces/common/size.interface";
import {Vendor} from "../../../interfaces/common/vendor.interface";
import {Subscription} from "rxjs";
import {UiService} from "../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {BuyBackService} from "../../../services/common/buy-back.service";
import {CategoryService} from "../../../services/common/category.service";
import {AttributeService} from "../../../services/common/attribute.service";
import {ColorService} from "../../../services/common/color.service";
import {SizeService} from "../../../services/common/size.service";
import {ReloadService} from "../../../services/core/reload.service";
import {UtilsService} from "../../../services/core/utils.service";
import {SubCategoryService} from "../../../services/common/sub-category.service";
import {MatSelectChange} from "@angular/material/select";
import {Customer} from "../../../interfaces/common/customer.interface";
import {FilterData} from "../../../interfaces/gallery/filter-data";

@Component({
  selector: 'app-add-buy-back',
  templateUrl: './add-buy-back.component.html',
  styleUrls: ['./add-buy-back.component.scss']
})
export class AddBuyBackComponent implements OnInit, OnDestroy {
  // Static Data
  dataBoolean: Select[] = DATA_BOOLEAN;
  paymentTypes: Select[] = PAYMENT_TYPES1;
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  preventFormReset: boolean = false;

  // Store Data
  isLoading: boolean = false;
  isBarcode: boolean = false;
  today: Date = new Date();
  id: string;
  barcodeId?: string;
  buyBack?: BuyBack;
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  attributes: Attribute[] = [];
  colors: Color[] = [];
  sizes: Size[] = [];
  vendor: Vendor = null;
  vendorForm = false;
  categoryForm = false;
  subCategoryForm = false;
  colorForm = false;
  sizeForm = false;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subDataSix: Subscription;
  private subDataSeven: Subscription;
  private subRouteOne: Subscription;
  private subReloadOne: Subscription;
  private subReloadTwo: Subscription;
  private subReloadThree: Subscription;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private buyBackService: BuyBackService,
    private categoryService: CategoryService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private attributeService: AttributeService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private reloadService: ReloadService,
    private utilsService: UtilsService,
    private subCategoryService: SubCategoryService,
  ) {
  }

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();

    // Reload Data
    this.subReloadOne = this.reloadService.refreshCategory$
      .subscribe(() => {
        this.getAllCategory();
        this.getSubCategoriesByCategoryId(this.buyBack.category._id);
      })

    this.subReloadOne = this.reloadService.refreshSubCategory$.subscribe(() => {
      this.getSubCategoriesByCategoryId(this.buyBack?.category?._id);
    })

    this.subReloadTwo = this.reloadService.refreshColor$
      .subscribe(() => {
        this.getAllColor();
      })

    this.subReloadThree = this.reloadService.refreshSize$
      .subscribe(() => {
        this.getAllSize();
      })

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getBuyBackById();
        this.isBarcode = true;
        this.barcodeId = this.id;
      }
    });

    // Base Data
    this.getAllCategory();
    this.getAllAttribute();
    this.getAllColor();
    this.getAllSize();
  }

  /**
   * FORM METHODS
   * initDataForm()
   * setFormValue()
   * onSubmit()
   */

  private initDataForm() {
    this.dataForm = this.fb.group({
      dateString: [new Date()],
      name: [null,],
      imei: [null],
      payby: [null],
      customerName: [null],
      nric: [null,Validators.required],
      phoneNo: [null,Validators.required],
      postCode: [null],
      address: [null],
      personName: [null],
      unitNo: [null],
      // category: [null,Validators.required],
      subcategory: [null],
      brand: [null],
      attribute: [null],
      unit: [null],
      model: [null],
      sku: [null],
      others: [null],

      quantity: [null],
      newQuantity: [null],
      purchasePrice: [null],
      salePercent: [null],
      // salesman: [null,Validators.required],
      salePrice: [null],
      expireDate: [null],
      soldQuantity: [null],
      status: [this.dataBoolean[0].value],
      description: [null],
      images: [null],
      vendor: [null],
      colors: [null],
      sizes: [null,Validators.required],
      discountType: [null],
      discountAmount: [null],
      currency: [null],
      editSalePrice: [null],
      note: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue({
      ...this.buyBack,
      ...{
        dateString: new Date()
      }
    });


    if (this.buyBack?.category) {
      this.dataForm.patchValue({
        category: this.buyBack.category._id
      });
    }

    if (this.buyBack.subcategory) {
      this.dataForm.patchValue({
        subcategory: this.buyBack.subcategory._id,
      })
    }
    // Get Sub Category By Category
    if (this.buyBack.subcategory) {
      this.getSubCategoriesByCategoryId(this.buyBack.category._id);
    }
    if (this.buyBack?.attribute) {
      this.dataForm.patchValue({
        attribute: this.buyBack.attribute._id
      });
    }
    if (this.buyBack?.sizes) {
      this.dataForm.patchValue({
        sizes: this.buyBack.sizes._id
      });
    }
    if (this.buyBack?.colors) {
      this.dataForm.patchValue({
        colors: this.buyBack.colors._id
      });
    }

    if (this.buyBack?.vendor) {
      this.vendor = this.buyBack?.vendor;
      this.dataForm.patchValue({
        vendor: this.vendor._id
      });
    }
  }

  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }
    // Modify Form data
    let mData = {
      ...this.dataForm.value,
      ...{
        dateString: this.utilsService.getDateString(this.dataForm.value.dateString),
        createTime: this.utilsService.getCurrentTime(),
        expireDate: this.dataForm.value.expireDate && this.dataForm.value.expireDate !== 'Invalid date' ? this.utilsService.getDateString(this.dataForm.value.expireDate) : null,
        discountAmount: this.dataForm.value.discountType ? this.dataForm.value.discountAmount : null
      }
    };

    if (this.dataForm.value.category) {
      mData = {
        ...mData,
        ...{
          category: {
            _id: this.dataForm.value.category,
            name: this.categories.find(
              (f) => f._id === this.dataForm.value.category).name,
          }
        }
      };
    }

    if (this.dataForm.value.subcategory) {
      mData = {
        ...mData,
        ...{
          subcategory: {
            _id: this.dataForm.value.subcategory,
            name: this.subCategories.find(
              (f) => f._id === this.dataForm.value.subcategory).name,
          }
        }
      };
    }

    if (this.dataForm.value.attribute) {
      mData = {
        ...mData,
        ...{
          attribute: {
            _id: this.dataForm.value.attribute,
            name: this.attributes.find((f) => f._id === this.dataForm.value.attribute).name,
          }
        }
      };
    }

    if (this.dataForm.value.colors) {
      mData = {
        ...mData,
        ...{
          colors: {
            _id: this.dataForm.value.colors,
            name: this.colors.find((f) => f._id === this.dataForm.value.colors).name,
          }
        }
      };
    }
    if (this.dataForm.value.sizes) {
      mData = {
        ...mData,
        ...{
          sizes: {
            _id: this.dataForm.value.sizes,
            name: this.sizes.find((f) => f._id === this.dataForm.value.sizes).name,
          }
        }
      };
    }

    if (this.dataForm.value.vendor) {
      mData = {
        ...mData,
        ...{
          vendor: {
            _id: this.vendor?._id,
            name: this.vendor?.name,
            phone: this.vendor?.phone,
          }
        }
      };
    }
    if (this.buyBack) {
      this.updateBuyBackById(mData);
    } else {
      this.addBuyBack(mData);
    }
  }

  /**
   * LOGICAL & UI Methods
   * onToggle()
   * onCheckResetForm()
   * onAddNewVendor()
   * onAddNewCategory()
   * onAddNewColor()
   * onAddNewSize()
   * onCategorySelect()
   */

  onCategorySelect(event: MatSelectChange) {
    if (event.value) {
      this.getSubCategoriesByCategoryId(event.value);
    }
  }


  onToggle(type: 'vendor' | 'category' | 'color' | 'size' | 'subCategory') {
    if (type === 'vendor') {
      this.vendorForm = !this.vendorForm;
    }

    if (type === 'category') {
      this.categoryForm = !this.categoryForm;
    }

    if (type === 'subCategory') {
      this.subCategoryForm = !this.subCategoryForm;
    }


    if (type === 'color') {
      this.colorForm = !this.colorForm;
    }

    if (type === 'size') {
      this.sizeForm = !this.sizeForm;
    }

  }

  onCheckResetForm() {
    if (!this.preventFormReset) {
      this.formElement.resetForm();
      this.vendor = null;
      this.dataForm.patchValue({
        status: this.dataBoolean[0].value,
        dateString: this.today
      })
    }
  }

  onAddNewVendor(event: Vendor) {
    setTimeout(() => {
      this.vendor = event;
      this.dataForm.patchValue({
        vendor: event._id
      });
      this.vendorForm = false;
    }, 500)
  }

  onAddNewCategory(event: Category) {
    setTimeout(() => {
      this.dataForm.patchValue({
        category: event._id
      });
      this.categoryForm = false;
    }, 500)
  }

  onAddNewSubCategory(event: SubCategory) {
    setTimeout(() => {
      this.dataForm.patchValue({
        subcategory: event._id

      });
      this.subCategoryForm = false;
    }, 500)
    const catId: any = event.category
    this.getSubCategoriesByCategoryId(catId)
  }

  onAddNewColor(event: Color) {
    setTimeout(() => {
      this.dataForm.patchValue({
        colors: event._id
      });
      this.colorForm = false;
    }, 500)
  }

  onAddNewSize(event: Size) {
    setTimeout(() => {
      this.dataForm.patchValue({
        sizes: event._id
      });
      this.sizeForm = false;
    }, 500)
  }

  /**
   * ON SELECT Methods
   * onSelectVendorList()
   */
  onSelectVendorList(data: Customer) {
    this.vendor = data;
    this.vendorForm = false;
    this.dataForm.patchValue({
      vendor: this.vendor._id
    });
  }

  /**
   * CALCULATIONS
   * salePrice()
   */

  get salePrice() {
    if (this.dataForm.value.purchasePrice && this.dataForm.value.salePercent) {
      const pAmount = (this.dataForm.value.salePercent / 100) * this.dataForm.value.purchasePrice;
      this.dataForm.patchValue({salePrice: Number((this.dataForm.value.purchasePrice + pAmount).toFixed(2))});
      return Number((this.dataForm.value.purchasePrice + pAmount).toFixed(2));
    } else {
      return this.dataForm.value.salePrice;
    }
  }


  /**
   * HTTP REQ HANDLE
   * getAllCategory()
   * getAllSize()
   * getAllColor()
   * getAllAttribute()
   * getBuyBackById()
   * addBuyBack()
   * updateBuyBackById()
   */


  private getSubCategoriesByCategoryId(categoryId: string) {
    const select = 'name category slug'
    this.subDataSeven = this.subCategoryService.getSubCategoriesByCategoryId(categoryId, select)
      .subscribe(res => {
        this.subCategories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getAllCategory() {
    // Select
    const mSelect = {
      name: 1,
    };

    const filterData: FilterData = {
      pagination: null,
      filter: null,
      select: mSelect,
      sort: {name: 1},
    };

    this.subDataOne = this.categoryService
      .getAllCategory(filterData, null)
      .subscribe({
        next: (res) => {
          this.categories = res.data;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  private getAllSize() {
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

    this.subDataTwo = this.sizeService.getAllSize(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.sizes = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
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

  private getAllAttribute() {
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

    this.subDataFour = this.attributeService.getAllAttribute(filter, null)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.attributes = res.data;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  private getBuyBackById() {
    this.spinnerService.show();
    this.subDataSix = this.buyBackService.getBuyBackById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.buyBack = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }

  private addBuyBack(data: any) {
    this.isLoading = true;
    this.subDataFive = this.buyBackService.addBuyBack(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.uiService.success(res.message);
          this.onCheckResetForm();
          this.isBarcode = true;
          this.barcodeId = res?.data?._id;
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      },
    });
  }


  private updateBuyBackById(data: any) {
    this.isLoading = true;
    this.subDataSeven = this.buyBackService.updateBuyBackById(this.buyBack._id, data)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.success(res.message);
            this.router.navigate([ '/inventory/buyBack-list'])
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error);
        },
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

    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }

    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }

    if (this.subDataSix) {
      this.subDataSix.unsubscribe();
    }

    if (this.subDataSeven) {
      this.subDataSeven.unsubscribe();
    }

    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }

    if (this.subReloadOne) {
      this.subReloadOne.unsubscribe();
    }

    if (this.subReloadTwo) {
      this.subReloadTwo.unsubscribe();
    }

    if (this.subReloadThree) {
      this.subReloadThree.unsubscribe();
    }
  }


}
