
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {UiService} from '../../../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SaleService} from '../../../../services/common/sale.service';
import {Customer} from '../../../../interfaces/common/customer.interface';
import {CustomerService} from '../../../../services/common/customer.service';
import {Product} from '../../../../interfaces/common/product.interface';
import {SaleConfirmComponent} from '../../../../shared/dialog-view/sale-confirm/sale-confirm.component';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '../../../../services/core/utils.service';
import {PointService} from '../../../../services/common/point.service';
import {Point} from '../../../../interfaces/common/point.interface';
import {Sale} from '../../../../interfaces/common/sale.interface';
import {Select} from '../../../../interfaces/core/select';
import {DISCOUNT_TYPES, PAYMENT_TYPES} from '../../../../core/utils/app-data';
import {DiscountTypeEnum} from '../../../../enum/product.enum';
import {AdminService} from '../../../../services/admin/admin.service';
import {Admin} from '../../../../interfaces/admin/admin';
import {ShopInformation} from '../../../../interfaces/common/shop-information.interface';
import {ShopInformationService} from '../../../../services/common/shop-information.service';
import {SalesReturnService} from '../../../../services/common/sales-return.service';


@Component({
  selector: 'app-new-sale-return',
  templateUrl: './new-sale-return.component.html',
  styleUrls: ['./new-sale-return.component.scss']
})
export class NewSaleReturnComponent  implements OnInit, OnDestroy {

  // Admin Base Data
  admin: Admin = null;

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  disable = false;

  // Static Data
  discountTypes: Select[] = DISCOUNT_TYPES;
  paymentTypes: Select[] = PAYMENT_TYPES;


  // Store Data
  isLoading: boolean = false;
  isViewMode: boolean = false;
  id?: string;
  sale?: Sale;
  // customer: Customer;
  customer: any;
  customerInfo = false;
  search = false;
  discountType: number = null;
  discountAmount: number = null;
  vat: number = null;
  usePoints: number = null;
  pointsDiscount: number = 0;
  today: Date = new Date();
  soldDate: Date = new Date();
  paymentType: string = 'cash';
  receivedFromCustomer: number = null;
  saleData: Sale = null;
  openDialog = false;

  // Shop data
  shopInformation: ShopInformation;

  //Store Components Data
  products: Product[] = [];
  returnProducts: Product[] = [];
  point: Point;

  // Subscriptions
  private adminSubData: Subscription;
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
    private newSalesService: SaleService,
    private salesReturnService: SalesReturnService,
    private router: Router,
    private dialog: MatDialog,
    public utilsService: UtilsService,
    private pointService: PointService,
    private adminService: AdminService,
    private shopInformationService: ShopInformationService,
  ) {
  }


  ngOnInit(): void {
    // Init Data Form
    this.initDataForm()

    // GET ID FORM PARAM
    // this.activatedRoute.paramMap.subscribe((param) => {
    //   this.id = param.get('id');
    //   if (this.id) {
    //     this.getSaleById();
    //   }
    // });

    // GET DATA FORM QUERY PARAM
    this.activatedRoute.queryParamMap.subscribe((qParam) => {
      const isViewMode = qParam.get('view');
      this.isViewMode = isViewMode == 'true';
    });
    // Base Data
    this.getLoggedInAdminData();
    this.getPoint();
    this.getShopInformation();

    // Keyup On Enter
    // this.onEnterEvent();
  }


  /**
   * Admin Data
   * getLoggedInAdminData()
   */

  private getLoggedInAdminData() {
    this.adminSubData = this.adminService.getLoggedInAdminData('name')
      .subscribe({
        next: (res) => {
          this.admin = res.data;
        },
        error: error => {
          console.log(error)
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
      name: [null],
      phone: [null, Validators.required],
      address: [null],
      userPoints: [null],
      birthdate: [null],
    });
  }

  private setFormValue() {
    if (this?.sale.customer?.phone) {
      this.dataForm.patchValue({...this.sale.customer});
      this.customerInfo = true;
    }

    if (this.sale.pointsDiscount) {
      this.pointsDiscount = this.sale.pointsDiscount;
    }

    if (this.sale.usePoints) {
      this.usePoints = this.sale.usePoints;
    }
  }

  onSubmit() {
    if (!this.sale && !this.products.length) {
      this.uiService.warn('Please Add some products to continue sales');
      return;
    }

    if (this.customerInfo && this.dataForm.invalid) {
      this.uiService.warn('Please add customer phone number');
      this.dataForm.markAllAsTouched();
      return;
    }

    const mProducts = [];
    this.products.forEach(p => {
      p.saleType = 'Sale';
      mProducts.push(p);
    });

    this.returnProducts.forEach(p => {
      p.saleType = 'Return';
      mProducts.push(p);
    })

    this.saleData = {
      customer: this.dataForm.valid ? {...this.dataForm.value} : null,
      products: mProducts,
      soldDate: this.today,
      soldDateString: this.utilsService.getDateString(this.today),
      soldTime: this.utilsService.getCurrentTime(),
      discount: this.discount ?? 0,
      discountAmount: this.discountType ? (this.discountAmount ?? 0) : 0,
      discountType: this.discountType ?? 0,
      usePoints: this.pointsDiscount ? this.usePoints : 0,
      pointsDiscount: this.pointsDiscount ?? 0,
      vatAmount: this.vat ?? 0,
      total: this.grandTotal,
      subTotal: this.subTotal,
      paidAmount: this.grandTotal,
      totalPurchasePrice: this.purchaseTotalAmount,
      month: this.utilsService.getDateMonth(false, new Date()),
      year: new Date().getFullYear(),
      status: 'Sale',
      receivedFromCustomer: this.receivedFromCustomer ? this.receivedFromCustomer : this.grandTotal,
      paymentType: this.paymentType,
      salesman: {
        _id: this.admin?._id,
        name: this.admin?.name
      },
      returnTotal: this.returnTotal,
    }

    const returnData = {
      customer: this.customer,
      products: this.returnProducts,
      returnDate: this.today,
      returnDateString: this.utilsService.getDateString(this.today),
      charge: 0,
      subTotal: this.returnTotal,
      grandTotal: this.returnTotal,
      totalPurchasePrice: this.sale.totalPurchasePrice,
      month: this.utilsService.getDateMonth(false, new Date()),
      year: new Date().getFullYear(),
      invoiceNo: this.sale.invoiceNo,
      note: null,
    }

    if (this.sale) {
      if (this.sale.customer) {
        this.saleData = {
          ...this.saleData,
          ...{
            customer: {...this.sale.customer, ...this.dataForm.value}
          }
        }
      }
      this.openConfirmDialog(returnData);
    } else {
      this.openConfirmDialog(returnData);
    }

  }

  customerInfoToggle() {
    this.customerInfo = !this.customerInfo;
  }

  /**
   * HTTP REQ HANDLE
   * getSaleById()
   * addSale()
   * updateSaleById()
   */

  private addSale(returnData: any) {
    this.isLoading = true;
    this.subDataFive = this.newSalesService.addSale(this.saleData).subscribe({
      next: (res) => {
        this.spinnerService.hide();
        if (res.success) {
          this.addSalesReturn(returnData);
        } else {
          this.isLoading = false;
          this.uiService.warn(res.message);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      },
    });

  }

  private addSalesReturn(data: any) {
    this.spinnerService.show();
    this.subDataOne = this.salesReturnService.addNewSalesReturn(data)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
            this.saleData = {...this.saleData, ...{invoiceNo: res.data.invoiceNo}};
            setTimeout(() => {
              this.formElement.resetForm();
              this.products = []
              this.customer = null;
              this.vat = 0;
              this.usePoints = 0;
              this.pointsDiscount = 0;
              this.discountType = null;
              this.discountAmount = null;
              this.receivedFromCustomer = null;
              this.paymentType = 'cash';
              this.openDialog = false;
              this.isLoading = false;
              this.onPrint();
            }, 200)
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

  private getSaleById() {
    this.spinnerService.show();
    this.subDataThree = this.newSalesService.getSaleById(this.id)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.data) {
            this.sale = res.data;
            this.soldDate = new Date(this.sale.soldDate);
            this.products = this.sale.products.map(m => {
              return {
                ...m,
                ...{
                  tag: 'old'
                }
              }
            });
            this.discountType = this.sale.discountType;
            this.discountAmount = this.sale.discountAmount;
            this.vat = this.sale.vatAmount;

            this.setFormValue();

          }
        }),
        error: (error => {
          this.spinnerService.hide();
          console.log(error);
        })
      });
  }

  private updateSaleById() {
    this.isLoading = true;
    this.subDataFour = this.newSalesService.updateSaleById(this.sale._id, this.saleData)
      .subscribe({
        next: (res => {
          this.isLoading = false;
          if (res.success) {
            this.uiService.success(res.message);
          } else {
            this.uiService.warn(res.message);
          }

        }),
        error: (error => {
          this.isLoading = false;
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
   * onSelectCustomerList()
   * onPaymentTypeChanged()
   */

  onSelectProduct(data: Product) {
    const fIndex = this.products.findIndex(f => f._id === data._id && f.tag === data.tag);
    if (fIndex === -1) {
      if (data.quantity > 0) {
        this.products.push({...data, ...{soldQuantity: 1, tag: 'new'}})
      } else {
        this.products.push({...data, ...{soldQuantity: 0, tag: 'new'}})
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

  deleteProduct(index: number, tag: "new" | "old") {
    const soldProductCount = this.sale?.products.length;

    const discountDeletedProduct = this.discountAmount && this.discountAmount > 0 ? (this.discountAmount / soldProductCount) : 0;

    let discount;
    if (this.discountType === DiscountTypeEnum.PERCENTAGE) {
      discount =  Number(((discountDeletedProduct / 100) * this.sale?.subTotal).toFixed(2));
    } else if (this.discountType === DiscountTypeEnum.CASH) {
      discount = Number(discountDeletedProduct)
    } else {
      discount = 0;
    }

    this.discountAmount = this.discountAmount - discountDeletedProduct;

    const rProduct = {...this.products[index]};
    rProduct.salePrice = rProduct.salePrice - discount;
    if (tag === 'old') {
      this.returnProducts.push(rProduct);
    }

    // this.discountAmount -= this.products[index].discountAmount ?? 0;

    this.products.splice(index, 1);


    // console.log('this.deletedProducts', this.returnProducts)
  }

  deleteReturnProduct(index: number) {
    this.products.push(this.returnProducts[index]);
    this.returnProducts.splice(index, 1);
  }

  onChangeWithdrawPoints(event) {
    if (event > this.customer?.userPoints ?? 0) {
      this.pointsDiscount = 0;
    } else {
      this.usePoints = event;
      const pointCalculationData = (this.usePoints * this.point?.pointValue)
      this.pointsDiscount = Math.floor(pointCalculationData);
    }

  }

  onSelectCustomerList(data: any) {

    this.customer = data?.customer;
    this.id = data?._id
    if (this.id) {
      this.getSaleById();
    }
    this.dataForm.patchValue(this.customer);
  }

  onPaymentTypeChanged(event: any) {
    if (event !== 'cash') {
      this.receivedFromCustomer = this.grandTotal;
    }
  }


  /**
   * Calculation Area
   * subTotal()
   * grandTotal()
   */


  get subTotal() {
    if (this.returnProducts.length) {
      const sGrandTotal = this.sale?.total;

      const productAmount =  Number(
        this.products.map(t => {
          return (t.salePrice * t.soldQuantity);
        }).reduce((acc, value) => acc + value, 0).toFixed(2)
      );
      return Number((productAmount - sGrandTotal).toFixed(2))
    } else {
      const amount =  Number(
        this.products.map(t => {
          return (t.salePrice * t.soldQuantity);
        }).reduce((acc, value) => acc + value, 0).toFixed(2)
      );

      return Number((amount - this.returnTotal).toFixed(2));
    }

  }

  get discount() {
    let dis;
    if (this.returnProducts.length) {
      if (this.discountType === DiscountTypeEnum.CASH) {
        dis = this.discountAmount;
      } else if (this.discountType === DiscountTypeEnum.PERCENTAGE) {
        dis = Number(((this.discountAmount / 100) * this.sale?.subTotal).toFixed(2));
      } else {
        dis = 0
      }
      return dis;
    } else {
      if (this.discountType === DiscountTypeEnum.CASH) {
        dis = this.discountAmount;
      } else if (this.discountType === DiscountTypeEnum.PERCENTAGE) {
        dis = Number(((this.discountAmount / 100) * this.subTotal).toFixed(2));
      } else {
        dis = 0
      }
      return dis;
    }

  }

  get returnTotal() {
    return Number(
      this.returnProducts.map(t => {
        return (t.salePrice * t.soldQuantity);
      }).reduce((acc, value) => acc + value, 0).toFixed(2)
    );
  }

  get grandTotal() {
    return Number(((this.subTotal + this.vat) - (this.discount + this.pointsDiscount)).toFixed(2));
  }

  get purchaseTotalAmount() {
    return Number(this.products.map(t => {
      return (t.purchasePrice * t.soldQuantity);
    }).reduce((acc, value) => acc + value, 0).toFixed(2));
  }


  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(returnData: any) {
    this.openDialog = true;
    const dialogRef = this.dialog.open(SaleConfirmComponent, {
      data: {type: 'sale', data: this.saleData, shopInformation: this.shopInformation},
      maxWidth: '98%',
      minWidth: '750px',
      maxHeight: '90%',
      height: 'auto',
      panelClass: ['my-custom-dialog-class', 'my-class']
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.openDialog = false;
      if (dialogResult) {
        if (dialogResult.type === 'confirm') {
          this.addSale(returnData);
        }

        if (dialogResult.type === 'print') {
          this.addSale(returnData);
        }

        if (dialogResult.type === 'cancel') {
          this.dialog.closeAll();
        }
      }
    });
  }


  /**
   * ON PRINT & Enter
   * onPrint()
   * onEnterEvent()
   */
  private onPrint() {
    window.print();
    window.close();
  }

  public onEnterEvent(event: any, type: 'submit') {


    // event.keyCode or event.which  property will have the code of the pressed key
    let keyCode = event.keyCode ? event.keyCode : event.which;
    //
    // 13 points the enter key
    if (keyCode === 13) {
      // console.log('Here....')
      // console.log(event.target.id)
      if (event.target.id === 'product-search-input') {
        // console.log('From Input')
      } else {
        // console.log('Body Input')
        if (!this.openDialog) {
          if (this.products.length) {
            this.onSubmit();
          }
        }
      }


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
    if (this.subShopInfo) {
      this.subShopInfo.unsubscribe();
    }
  }

}

