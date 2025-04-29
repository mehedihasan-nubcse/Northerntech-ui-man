import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Admin} from "../../../../interfaces/admin/admin";
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Select} from "../../../../interfaces/core/select";
import {DISCOUNT_TYPES, PAYMENT_TYPES} from "../../../../core/utils/app-data";
import {Sale} from "../../../../interfaces/common/sale.interface";
import {Customer} from "../../../../interfaces/common/customer.interface";
import {ShopInformation} from "../../../../interfaces/common/shop-information.interface";
import {Product} from "../../../../interfaces/common/product.interface";
import {Point} from "../../../../interfaces/common/point.interface";
import {Subscription} from "rxjs";
import {UiService} from "../../../../services/core/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomerService} from "../../../../services/common/customer.service";
import {SaleService} from "../../../../services/common/sale.service";
import {MatDialog} from "@angular/material/dialog";
import {UtilsService} from "../../../../services/core/utils.service";
import {PointService} from "../../../../services/common/point.service";
import {AdminService} from "../../../../services/admin/admin.service";
import {ShopInformationService} from "../../../../services/common/shop-information.service";
import {SaleConfirmComponent} from "../../../../shared/dialog-view/sale-confirm/sale-confirm.component";

@Component({
  selector: 'app-product-return',
  templateUrl: './product-return.component.html',
  styleUrls: ['./product-return.component.scss']
})
export class ProductReturnComponent implements OnInit, OnDestroy {

  // Admin Base Data
  admin: Admin = null;

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  disable = false;

  // Static Data
  discountTypes: Select[] = DISCOUNT_TYPES;
  paymentTypes: Select[] = PAYMENT_TYPES;
  multiPayment: any[] = [{name: 'cash', amount: null}]
  selectedTabs: string[] = ['cash'];


  // Store Data
  isLoading: boolean = false;
  isViewMode: boolean = false;
  id?: string;
  sale?: Sale;
  customer: Customer;
  customerInfo = false;
  search = false;
  discountType: number = 2;
  discountAmount: number = null;
  salePriceAmount: number = null;
  vat: number = null;
  usePoints: number = null;
  pointsDiscount: number = 0;
  soldDate: Date = new Date();
  paymentType: string = 'cash';
  note: string = null;
  saleData: Sale = null;
  openDialog = false;

  // Shop data
  shopInformation: ShopInformation;

  //Store Components Data
  products: Product[] = [];
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
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getSaleById();
      }
    });

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




  onTabClick(value: string) {
    if (this.selectedTabs.includes(value)) {
      this.selectedTabs = this.selectedTabs.filter(tab => tab !== value);
      this.multiPayment = this.multiPayment.filter(tab => tab.name !== value);
    } else {
      this.selectedTabs.push(value);
      this.multiPayment.push({name: value, amount: null})
    }
    // console.log('selectedTabs', this.selectedTabs);
    // console.log('multiPayment', this.multiPayment);
  }

  isActive(value: string): boolean {
    return this.selectedTabs.includes(value);
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


    this.dataForm.patchValue(this.sale)
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


    this.saleData = {
      customer: this.dataForm.valid ? {...this.dataForm.value} : null,
      products: this.products,
      soldDate: this.soldDate,
      soldDateString: this.utilsService.getDateString(this.soldDate),
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
      paymentType: this.multiPayment.map(m => m.name).join(),
      salesman: {
        _id: this.admin?._id,
        name: this.admin?.name
      },
      note: this.note,
      multiPayment: this.multiPayment,
    }
    // console.log('this.saleData', this.saleData)
    if (this.sale) {
      if (this.sale.customer) {
        this.saleData = {
          ...this.saleData,
          ...{
            customer: {...this.sale.customer, ...this.dataForm.value}
          }
        }
      }
      this.updateSaleById();
    } else {
      this.openConfirmDialog()
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

  private addSale() {
    this.isLoading = true;
    this.subDataFive = this.newSalesService.addSale(this.saleData).subscribe({
      next: (res) => {
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
            this.multiPayment = [{name: 'cash', amount: null}];
            this.paymentType = 'cash';
            this.openDialog = false;
            this.isLoading = false;
            this.onPrint();
          }, 200)
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
            this.products = this.sale.products;
            this.discountType = this.sale.discountType;
            this.discountAmount = this.sale.discountAmount;
            this.vat = this.sale.vatAmount;
            this.multiPayment = this.sale.multiPayment;
            this.selectedTabs = this.sale.multiPayment.map(m => m.name);
            this.paymentType = this.sale.paymentType;
            this.note = this.sale.note;
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
            this.getSaleById();
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
    const fIndex = this.products.findIndex(f => f._id === data._id);
    if (fIndex === -1) {
      if (data.quantity > 0) {
        this.products.push({...data, ...{soldQuantity: 1, saleType: 'Sale', discountAmount: null}})
      } else {
        this.products.push({...data, ...{soldQuantity: 0, saleType: 'Sale', discountAmount: null}})
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
    if (event > this.customer?.userPoints ?? 0) {
      this.pointsDiscount = 0;
    } else {
      this.usePoints = event;
      const pointCalculationData = (this.usePoints * this.point?.pointValue)
      this.pointsDiscount = Math.floor(pointCalculationData);
    }

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


    if (this.id) {
      const amount = Number(
        this.products.filter(f => f.saleType !== 'Return').map(t => {
          return ((t.salePrice * t.soldQuantity));
        }).reduce((acc, value) => acc + value, 0).toFixed(2)
      );

      const returnAmount = Number(
        this.products.filter(f => f.saleType === 'Return').map(t => {
          return (t.salePrice * t.soldQuantity);
        }).reduce((acc, value) => acc + value, 0).toFixed(2)
      );

      return Number(((amount) - (this.sale?.returnTotal ?? 0)).toFixed(2));

    } else {

      const amount = Number(
        this.products.filter(f => f.saleType === 'Sale').map(t => {
          return ((t.salePrice * t.soldQuantity));
        }).reduce((acc, value) => acc + value, 0).toFixed(2)
      );

      return Number((amount).toFixed(2));
    }
  }

  get discount() {
    // let dis;
    // if (this.discountType === DiscountTypeEnum.CASH) {
    //   dis = this.discountAmount;
    // } else if (this.discountType === DiscountTypeEnum.PERCENTAGE) {
    //   dis = Number(((this.discountAmount / 100) * this.subTotal).toFixed(2));
    // } else {
    //   dis = 0
    // }
    // return dis;

    const amount = Number(
      this.products.filter(f => f.saleType === 'Sale').map(t => {
        return (t.discountAmount ?? 0);
      }).reduce((acc, value) => acc + value, 0).toFixed(2)
    );

    return Number((amount).toFixed(2));
  }

  // get returnTotal() {
  //   return Number(
  //     this.products.filter(f => f.saleType === 'Return').map(t => {
  //       return (t.salePrice * t.soldQuantity);
  //     }).reduce((acc, value) => acc + value, 0).toFixed(2)
  //   );
  // }

  get grandTotal() {
    return Number(((this.subTotal + this.vat) - this.discount).toFixed(2));
  }

  get purchaseTotalAmount() {
    return Number(this.products.map(t => {
      return (t.purchasePrice * t.soldQuantity);
    }).reduce((acc, value) => acc + value, 0).toFixed(2));
  }


  get totalProfit() {

    if (this.sale) {
      const tProfit = this.sale?.products?.map(m => {
        if (m.saleType === 'Sale') {
          return (m.purchasePrice) * (m.soldQuantity)
        } else {
          return -(m.salePrice * m.soldQuantity);
        }

      }).reduce((acc, value) => acc + value, 0)

      return ((this.sale?.total - this.sale?.vatAmount) - tProfit);
      // return 100;
    } else {
      return 0;
    }

  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog() {
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
          this.addSale();
        }

        if (dialogResult.type === 'print') {
          this.addSale();
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
  onPrint() {
    window.print();
    window.close();
  }

  public onEnterEvent(event: any, type: 'submit') {


    // event.keyCode or event.which  property will have the code of the pressed key
    let keyCode = event.keyCode ? event.keyCode : event.which;
    //
    // 13 points the enter key
    if (keyCode === 13) {
      if (event.target.id === 'product-search-input') {
      } else {
        if (!this.openDialog) {
          if (this.products.length) {
            this.onSubmit();
          }
        }
      }


    }
  }

  get receivedFromCustomer() {
    if (this.multiPayment.length) {
      return this.multiPayment.map(m => m.amount).reduce((acc, val) => acc + val, 0)
    } else {
      return 0;
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

  salePrice(salePrice: number | undefined) {
    this.salePriceAmount = salePrice - this.discountAmount
    return this.salePriceAmount;
  }
}
