import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {UiService} from '../../../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../../../services/common/category.service';
import {Subscription} from 'rxjs';
import {FilterData} from '../../../../interfaces/gallery/filter-data';
import {Category} from '../../../../interfaces/common/category.interface';
import {Select} from '../../../../interfaces/core/select';
import {CURRENCY_TYPES, DATA_BOOLEAN} from '../../../../core/utils/app-data';
import {Customer} from '../../../../interfaces/common/customer.interface';
import {Vendor} from '../../../../interfaces/common/vendor.interface';
import {Attribute} from '../../../../interfaces/common/attribute.interface';
import {AttributeService} from '../../../../services/common/attribute.service';
import {ColorService} from '../../../../services/common/color.service';
import {Color} from '../../../../interfaces/common/color.interface';
import {SizeService} from '../../../../services/common/size.service';
import {Size} from '../../../../interfaces/common/size.interface';
import {ReloadService} from '../../../../services/core/reload.service';
import {UtilsService} from '../../../../services/core/utils.service';
import {PresaleProduct} from '../../../../interfaces/common/presale-product.interface';
import {PresaleProductService} from '../../../../services/common/presale-product.service';

@Component({
  selector: 'app-add-presale-product',
  templateUrl: './add-presale-product.component.html',
  styleUrls: ['./add-presale-product.component.scss'],
})
export class AddPresaleProductComponent implements OnInit, OnDestroy {
  // Static Data
  dataBoolean: Select[] = DATA_BOOLEAN;

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  preventFormReset: boolean = true;

  // Store Data
  isLoading: boolean = false;
  today: Date = new Date();
  id?: string;
  product?: PresaleProduct;
  categories: Category[] = [];
  attributes: Attribute[] = [];
  colors: Color[] = [];
  sizes: Size[] = [];
  vendor: Vendor = null;
  vendorForm = false;
  categoryForm = false;
  colorForm = false;
  sizeForm = false;

  // Static Data
  currencyTypes: Select[] = CURRENCY_TYPES;

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
    private productService: PresaleProductService,
    private categoryService: CategoryService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private attributeService: AttributeService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private reloadService: ReloadService,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    // Init Data Form
    this.initDataForm();

    // Reload Data
    this.subReloadOne = this.reloadService.refreshCategory$
      .subscribe(() => {
        this.getAllCategory();
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
        this.getProductById();
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
      category: [null],
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
      salePrice: [null],
      soldQuantity: [null],
      status: [this.dataBoolean[0].value],
      description: [null],
      images: [null],
      vendor: [null],
      colors: [null],
      sizes: [null],
      discountType: [null],
      discountAmount: [null],
      currency: [null],
    });
  }

  private setFormValue() {
    this.dataForm.patchValue(this.product);

    if (this.product?.category) {
      this.dataForm.patchValue({
        category: this.product.category._id
      });
    }
    if (this.product?.attribute) {
      this.dataForm.patchValue({
        attribute: this.product.attribute._id
      });
    }
    if (this.product?.sizes) {
      this.dataForm.patchValue({
        sizes: this.product.sizes._id
      });
    }
    if (this.product?.colors) {
      this.dataForm.patchValue({
        colors: this.product.colors._id
      });
    }

    if (this.product?.vendor) {
      this.vendor = this.product?.vendor;
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
    if (this.product) {
      this.updateProductById(mData);
    } else {
      this.addProduct(mData);
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
   */

  onToggle(type: 'vendor' | 'category' | 'color' | 'size') {
    if (type === 'vendor') {
      this.vendorForm = !this.vendorForm;
    }

    if (type === 'category') {
      this.categoryForm = !this.categoryForm;
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
   * HTTP REQ HANDLE
   * getAllCategory()
   * getAllSize()
   * getAllColor()
   * getAllAttribute()
   * getProductById()
   * addProduct()
   * updateProductById()
   */

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

  private getProductById() {
    this.spinnerService.show();
    this.subDataSix = this.productService.getProductById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.product = res.data;
          this.setFormValue();
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });
  }


  private addProduct(data: any) {
    this.isLoading = true;
    this.subDataFive = this.productService.addProduct(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.uiService.success(res.message);
          this.onCheckResetForm();
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


  private updateProductById(data: any) {
    this.isLoading = true;
    this.subDataSeven = this.productService.updateProductById(this.product._id, data)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.success(res.message);
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
