import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, Validators} from '@angular/forms';
import {Product} from '../../../../interfaces/common/product.interface';
import {UiService} from '../../../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../../../services/common/category.service';
import {Subscription} from 'rxjs';
import {FilterData} from '../../../../interfaces/gallery/filter-data';
import {ProductService} from '../../../../services/common/product.service';
import {Category} from '../../../../interfaces/common/category.interface';
import {Select} from '../../../../interfaces/core/select';
import {DATA_BOOLEAN} from '../../../../core/utils/app-data';
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
import {SubCategory} from '../../../../interfaces/common/sub-category.interface';
import {MatSelectChange} from '@angular/material/select';
import {SubCategoryService} from '../../../../services/common/sub-category.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit, OnDestroy {
  // Static Data
  dataBoolean: Select[] = DATA_BOOLEAN;
  isPopupVisible = false;
  inputValue = '';
  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  preventFormReset: boolean = false;

  // Store Data
  isLoading: boolean = false;
  isBarcode: boolean = false;
  isIEMI: boolean = false;
  isStock: boolean = true;
  today: Date = new Date();
  id: string;
  barcodeId?: string;
  product?: Product | any;
  categories: Category[] | any[] = [];
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
    private productService: ProductService,
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
        this.getSubCategoriesByCategoryId(this.product.category._id);
      })

    this.subReloadOne = this.reloadService.refreshSubCategory$.subscribe(() => {
      this.getSubCategoriesByCategoryId(this.product?.category?._id);
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
      name: [null],
      category: [null, Validators.required],
      subcategory: [null],
      brand: [null],
      attribute: [null],
      newPrice: [null],
      batchNumber: [null],
      unit: [null],
      model: [null],
      sku: [null],
      others: [null],
      imei: [
        '',
        [this.validateImeiNumbers],
      ],
      quantity: [null],
      newQuantity: [null],
      purchasePrice: [null],
      salePercent: [null],
      salesman: [null, Validators.required],
      salePrice: [null],
      expireDate: [null],
      soldQuantity: [null],
      status: [this.dataBoolean[0].value],
      description: [null],
      images: [null],
      vendor: [null,Validators.required],
      colors: [null],
      sizes: [null],
      discountType: [null],
      discountAmount: [null],
      currency: [null],
      editSalePrice: [null],
      note: [null],
    });
  }
// Custom validator to validate multiple IMEI numbers
  validateImeiNumbers(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null; // No validation error if empty
    }

    const imeiArray = value.split(',').map((imei) => imei.trim());
    for (const imei of imeiArray) {
      if (!/^\d{1,15}$/.test(imei)) {
        return { invalidImei: true }; // Error if not numeric or >15 digits
      }
    }

    return null; // Valid input
  }

  // Input change handler for real-time processing
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    // Allow user edits, including deletions
    if (!value) {
      this.dataForm.get('imei')?.setValue(value);
      return;
    }

    // Process each IMEI: trim whitespace and limit to 15 digits
    const processedValue = value
      .split(',')
      .map((imei) => imei.trim().slice(0, 15))
      .join(', ');

    // Update input element and form control only if necessary
    if (processedValue !== value) {
      inputElement.value = processedValue;
      this.dataForm.get('imei')?.setValue(processedValue);
    }
  }

  onInputChange1(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    // Allow user edits, including deletions
    if (!value) {
      this.dataForm.get('imei')?.setValue(value);
      return;
    }

    // Remove non-numeric characters, limit to 15 digits
    const processedValue = value.replace(/\D/g, '').slice(0, 15);

    // Update input element and form control only if necessary
    if (processedValue !== value) {
      inputElement.value = processedValue;
      this.dataForm.get('imei')?.setValue(processedValue);
    }
  }


  private setFormValue() {
    this.dataForm.patchValue({
      ...this.product,
      ...{
        dateString: new Date()
      }
    });


    if (this.product?.category) {
      console.log("")

      const cData = this.categories.find((f) =>
        f.name.replace(/\s+/g, '').toLowerCase() ===
        this.product.category.name.replace(/\s+/g, '').toLowerCase()
      )
      console.log("da", cData)

      this.dataForm.patchValue({
        category: cData?._id
      });


      if (cData.name === 'NEW PHONE' || cData.name === ' NEW PHONE ' || cData.name === 'NEW PHONE ' || cData.name === '2HAND' || cData.name === 'DISPLAY SET' || cData.name === 'EXPORT SET CHINA') {
        this.isIEMI = true
      } else {
        this.isIEMI = false
      }

      if (cData.name === 'ACCESSORIES') {
        this.isStock = false
      }
      else if(cData.name === 'TOP-UP'){
        this.isStock = false
      }
      else if(cData.name === 'REPAIR'){
        this.isStock = false
      }
      else{
        this.isStock = true
      }
    }


    if (this.product.subcategory) {
      this.dataForm.patchValue({
        subcategory: this.subCategories.find((f) =>
          f.name.replace(/\s+/g, '').toLowerCase() ===
          this.product.subcategory.name.replace(/\s+/g, '').toLowerCase()
        )?._id
      })
    }
    // Get Sub Category By Category
    if (this.product.subcategory) {

      const sData = this.subCategories.find((f) =>
        f.name.replace(/\s+/g, '').toLowerCase() ===
        this.product.subcategory.name.replace(/\s+/g, '').toLowerCase()
      )?._id
      this.getSubCategoriesByCategoryId(sData);
    }
    if (this.product?.attribute) {
      this.dataForm.patchValue({
        attribute: this.product.attribute._id
      });
    }
    if (this.product?.sizes) {
      const sData = this.sizes.find((f) =>
        f.name.replace(/\s+/g, '').toLowerCase() ===
        this.product.sizes.name.replace(/\s+/g, '').toLowerCase()
      )?._id

      this.dataForm.patchValue({
        sizes: sData
      });
    }
    if (this.product?.colors) {

      const colorData = this.colors.find((f) =>
        f.name.replace(/\s+/g, '').toLowerCase() ===
        this.product.colors.name.replace(/\s+/g, '').toLowerCase()
      )?._id


      this.dataForm.patchValue({
        colors: colorData
      });
    }


  }

  onSubmit() {

    if (this.dataForm.value.newPrice && !this.dataForm.value.batchNumber) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

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
            name: this.sizes.find((f) => f._id === this.dataForm.value.sizes)?.name,
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
    if (this.product && !this.dataForm.value.newPrice) {
      this.updateProductById(mData);
    } else if (this.product && this.product?.batchNumber && this.product?.batchNumber) {
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
   * onCategorySelect()
   */

  onCategorySelect(event: MatSelectChange) {
    if (event.value) {
      this.getSubCategoriesByCategoryId(event.value);
      const category = this.categories.find(f => f._id === event.value)

      if (category.name === 'NEW PHONE' || category.name === ' NEW PHONE ' || category.name === 'NEW PHONE ' || category.name === '2HAND' || category.name === 'DISPLAY SET' || category.name === 'EXPORT SET CHINA') {
        this.isIEMI = true
      } else {
        this.isIEMI = false
      }
      if (category.name === 'ACCESSORIES') {
        this.isStock = false
      }
      else if(category.name === 'TOP-UP'){
        this.isStock = false
      }
      else if(category.name === 'REPAIR'){
        this.isStock = false
      }
      else {
        this.isStock = true
      }

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
    } else {
      this.dataForm.patchValue({
        quantity: 1,
        imei: null
      })
    }
  }

  onAddNewVendor(event: Vendor) {
    console.log("event", event)
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
   * getProductById()
   * addProduct()
   * updateProductById()
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

  private getProductById() {
    this.spinnerService.show();
    this.subDataSix = this.productService.getProductById(this.id).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.data) {
          this.product = res.data;
          if (this.product) {
            this.vendor = this.product?.vendor;
            this.dataForm.patchValue({
              vendor: this.product?.vendor?._id
            });
            this.vendorForm = false;

            setTimeout(() => {
              this.setFormValue();
            }, 1000)

          }

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
    this.subDataFive = this.productService.addProduct(this.dataForm.value.newPrice ? {...data, ...{quantity: data.newQuantity}} : data).subscribe({
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


  private updateProductById(data: any) {
    this.isLoading = true;
    this.subDataSeven = this.productService.updateProductById(this.product._id, data)
      .subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.success(res.message);
            this.router.navigate(['/inventory/product-list'])
          } else {
            this.uiService.warn(res.message);
          }
        },
        error: (error) => {
          this.uiService.warn('Sorry! No Permission');
          this.isLoading = false;
          console.log(error);
        },
      });
  }

  openPopup() {
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  saveInput() {
    this.dataForm.patchValue({imei:this.inputValue})
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
            name: this.sizes.find((f) => f._id === this.dataForm.value.sizes)?.name,
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
    this.addProduct(mData);

    this.closePopup();
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
