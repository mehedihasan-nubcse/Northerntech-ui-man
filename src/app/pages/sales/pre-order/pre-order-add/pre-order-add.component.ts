import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {UiService} from '../../../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Customer} from '../../../../interfaces/common/customer.interface';
import {CustomerService} from '../../../../services/common/customer.service';
import {Product} from '../../../../interfaces/common/product.interface';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '../../../../services/core/utils.service';
import {PointService} from '../../../../services/common/point.service';
import {Point} from '../../../../interfaces/common/point.interface';
import {DiscountTypeEnum} from '../../../../enum/product.enum';
import {DISCOUNT_TYPES} from '../../../../core/utils/app-data';
import {Select} from '../../../../interfaces/core/select';
import {PreOrderService} from '../../../../services/common/pre-order.service';
import {PreOrder} from '../../../../interfaces/common/pre-order.interface';
import {SaleConfirmComponent} from '../../../../shared/dialog-view/sale-confirm/sale-confirm.component';
import {ShopInformation} from '../../../../interfaces/common/shop-information.interface';
import {ShopInformationService} from '../../../../services/common/shop-information.service';


@Component({
  selector: 'app-pre-order-add',
  templateUrl: './pre-order-add.component.html',
  styleUrls: ['./pre-order-add.component.scss']
})
export class PreOrderAddComponent implements OnInit {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  disable = false;

  // Static Data
  discountTypes: Select[] = DISCOUNT_TYPES;


  // Store Data
  today = new Date();
  isViewMode: boolean = false;
  id?: string;
  preOrder?: PreOrder;
  customer: Customer;
  customerInfo = false;
  search = false;
  discountType: number = null;
  discountAmount: number = null;
  paidAmount: number = 0;
  vat: number = 0;
  usePoints: number = 0;
  pointsDiscount: number = 0;
  soldDate: Date = new Date();
  deliveryDate: any = new Date();
  productForm = false;

  // Shop data
  shopInformation: ShopInformation;

  //Store Components Data
  products: Product[] = [];
  point: Point;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;
  private subDataFour: Subscription;
  private subDataFive: Subscription;
  private subShopInfo: Subscription;


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private preOrderService: PreOrderService,
    private router: Router,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private pointService: PointService,
    private shopInformationService: ShopInformationService,
  ) {
  }


  ngOnInit(): void {

    // Init Data Form
    this.initDataForm()

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getPreOrderById();
      }
    });

    // GET DATA FORM QUERY PARAM
    this.activatedRoute.queryParamMap.subscribe((qParam) => {
      const isViewMode = qParam.get('view');
      this.isViewMode = isViewMode == 'true';
    });
    this.getPoint();
    this.getShopInformation();
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
      phone: new FormControl(
        {value: null, disabled: false},
        [
          Validators.minLength(11)
        ]
      ),
      address: [null],
      userPoints: [null],
      birthdate: [null],
    });
  }

  private setFormValue() {
    if (this?.preOrder.customer?.phone) {
      this.dataForm.patchValue({...this.preOrder.customer});
      this.customerInfo = true;
    }

    if (this.preOrder.pointsDiscount) {
      this.pointsDiscount = this.preOrder.pointsDiscount;
    }

    if (this.preOrder.usePoints) {
      this.usePoints = this.preOrder.usePoints;
    }

    if (this.preOrder.paidAmount) {
      this.paidAmount = this.preOrder.paidAmount;
    }
    if (this.preOrder.deliveryDate) {
      this.deliveryDate = new Date(this.preOrder.deliveryDate);
    }
  }

  onSubmit() {
    if (!this.preOrder && !this.products.length) {
      this.uiService.warn('Please Add some products to continue preOrders');
      return;
    }

    if (!this.dataForm.value.phone) {
      this.uiService.warn('Please add a contact no for confirm order');
      return;
    }

    let mData = {
      customer: this.dataForm.valid ? {...this.dataForm.value} : null,
      products: this.products,
      soldDate: this.soldDate,
      discount: this.discount ?? 0,
      discountAmount: this.discountType ? (this.discountAmount ?? 0) : 0,
      discountType: this.discountType ?? 0,
      usePoints: this.usePoints,
      pointsDiscount: this.pointsDiscount,
      vatAmount: this.vat,
      total: this.grandTotal,
      subTotal: this.subTotal,
      paidAmount: this.paidAmount,
      totalPurchasePrice: this.purchaseTotalAmount,
      month: this.utilsService.getDateMonth(false, new Date()),
      year: new Date().getFullYear(),
      status: 'Pre Order',
      deliveryDate: this.utilsService.getDateString(this.deliveryDate),
    }

    if (this.preOrder) {
      if (this.preOrder.customer) {
        mData = {
          ...mData,
          ...{
            customer: {...this.preOrder.customer, ...this.dataForm.value}
          }
        }
      }
      this.updatePreOrderById(mData);
    } else {
      this.openConfirmDialog(mData)
    }

  }

  customerInfoToggle() {
    this.customerInfo = !this.customerInfo;
  }

  /**
   * HTTP REQ HANDLE
   * getPreOrderById()
   * addPreOrder()
   * updatePreOrderById()
   */

  private addPreOrder(data: any) {
    this.spinnerService.show();
    this.subDataFive = this.preOrderService.addPreOrder(data).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.success) {
          this.uiService.success(res.message);
          this.formElement.resetForm();
          this.products = []
          this.discountType = null;
          this.discountAmount = null;

          this.customer = null;
          this.vat = 0;
          this.usePoints = 0;
          this.pointsDiscount = 0;
          this.paidAmount = 0;
        } else {
          this.uiService.warn(res.message);
        }
      },
      error: (error) => {
        this.spinnerService.hide();
        console.log(error);
      },
    });

  }


  private getPoint() {

    this.subDataTwo = this.pointService.getPoint().subscribe(
      (res) => {
        this.point = res.data;

      },
      (err) => {

        console.log(err);
      }
    );
  }

  private getPreOrderById() {
    this.spinnerService.show();
    this.subDataThree = this.preOrderService.getPreOrderById(this.id)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.data) {
            this.preOrder = res.data;
            this.soldDate = new Date(this.preOrder.soldDate);
            this.products = this.preOrder.products;
            this.discountType = this.preOrder.discountType;
            this.discountAmount = this.preOrder.discountAmount;
            this.vat = this.preOrder.vatAmount;

            this.setFormValue();

          }
        }),
        error: (error => {
          this.spinnerService.hide();
          console.log(error);
        })
      });
  }

  private updatePreOrderById(data: any) {
    this.spinnerService.show();
    this.subDataFour = this.preOrderService.updatePreOrderById(this.preOrder._id, data)
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

  /**
   * Handle Product Search & Product Table Action
   * onSelectProduct()
   * incrementQuantity()
   * decrementQuantity()
   * deleteProduct()
   */

  onSelectProduct(data: Product) {
    const fIndex = this.products.findIndex(f => f._id === data._id);
    if (fIndex === -1) {
      if (data.quantity > 0) {
        this.products.push({...data, ...{soldQuantity: 1}})
      } else {
        this.products.push({...data, ...{soldQuantity: 0}})
      }

    } else {
      if (this.products[fIndex].soldQuantity < data.quantity) {
        this.products[fIndex].soldQuantity += 1;
      } else {
        this.uiService.warn('Sorry! No Available Quantity');
      }

    }
  }

  incrementQuantity(index: number, data: Product) {
    if (data.quantity > this.products[index].soldQuantity) {
      this.products[index].soldQuantity++;
    } else {
      this.uiService.warn("You can't add more quantity")
    }
  }

  decrementQuantity(index: number) {
    if (this.products[index].soldQuantity > 1) {
      this.products[index].soldQuantity--;
    } else {
      this.uiService.warn("You can't decrease more quantity")
    }
  }

  deleteProduct(index: number) {
    this.products.splice(index, 1)
  }

  onChangeWithdrawPoints(event) {
    this.usePoints = event;
    const pointCalculationData = (this.usePoints * this.point?.pointValue)
    this.pointsDiscount = Math.floor(pointCalculationData);
  }

  onSelectCustomerList(data: Customer) {
    this.customer = data;
    this.dataForm.patchValue(this.customer);
  }


  /**
   * Calculation Area
   * subTotal()
   * grandTotal()
   */

  get subTotal() {
    return Number(
      this.products.map(t => {
        return (t.salePrice * t.soldQuantity);
      }).reduce((acc, value) => acc + value, 0).toFixed(2)
    );
  }

  get discount() {
    let dis;
    if (this.discountType === DiscountTypeEnum.CASH) {
      dis = this.discountAmount;
    } else if (this.discountType === DiscountTypeEnum.PERCENTAGE) {
      dis = Number(((this.discountAmount / 100) * this.subTotal).toFixed(2));
    } else {
      dis = 0
    }
    return dis;
  }

  get grandTotal() {
    return Number(((this.subTotal + this.vat) - (this.discount + this.pointsDiscount)).toFixed(2));
  }

  get dueAmount() {
    return this.grandTotal - this.paidAmount;
  }

  get purchaseTotalAmount() {
    return Number(this.products.map(t => {
      return (t.purchasePrice * t.soldQuantity);
    }).reduce((acc, value) => acc + value, 0).toFixed(2));
  }


  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data: any) {
    const dialogRef = this.dialog.open(SaleConfirmComponent, {
      data: {type: 'pre-sale', data: data},
      maxWidth: '98%',
      minWidth: '750px',
      maxHeight: '90%',
      height: 'auto',
      panelClass: ['my-custom-dialog-class', 'my-class']
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.type === 'confirm') {
          this.addPreOrder(data);
        }

        if (dialogResult.type === 'print') {
          this.addPreOrder(data);
        }

        if (dialogResult.type === 'cancel') {
          this.dialog.closeAll();
        }
      }
    });
  }

  onToggle(type: 'product') {
    if (type === 'product') {
      this.productForm = !this.productForm;
    }
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
  }
}
