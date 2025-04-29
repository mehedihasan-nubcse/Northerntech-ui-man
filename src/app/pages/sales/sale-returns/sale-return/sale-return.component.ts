import {Component, OnInit, ViewChild} from '@angular/core';
import {UiService} from '../../../../services/core/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Product} from '../../../../interfaces/common/product.interface';
import {SaleConfirmComponent} from '../../../../shared/dialog-view/sale-confirm/sale-confirm.component';
import {MatDialog} from '@angular/material/dialog';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {UtilsService} from '../../../../services/core/utils.service';
import {Point} from '../../../../interfaces/common/point.interface';
import {Sale} from '../../../../interfaces/common/sale.interface';
import {SalesReturnService} from '../../../../services/common/sales-return.service';
import {SalesReturn} from '../../../../interfaces/common/sales-return.interface';
import {Customer} from '../../../../interfaces/common/customer.interface';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ShopInformation} from '../../../../interfaces/common/shop-information.interface';
import {ShopInformationService} from '../../../../services/common/shop-information.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-sale-return',
  templateUrl: './sale-return.component.html',
  styleUrls: ['./sale-return.component.scss']
})
export class SaleReturnComponent implements OnInit {

  // Data Form
  @ViewChild('formElement') formElement: NgForm;
  dataForm?: FormGroup;
  disable = false;

  // Store Data
  today = new Date();
  isViewMode: boolean = false;
  id?: string;
  sale?: SalesReturn;
  customer: Customer = null;
  customerInfo = false;
  charge: number = 0;
  soldDate: Date = new Date();
  invoiceNo: string = null;
  note: string = null;

  // Shop data
  shopInformation: ShopInformation;

  //Store Components Data
  products: Product[] = [];
  point: Point;

  // Subscriptions
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subShopInfo: Subscription;


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinnerService: NgxSpinnerService,
    private salesReturnService: SalesReturnService,
    private router: Router,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private shopInformationService: ShopInformationService,
  ) {
    (window as any).pdfMake.vfs = pdfFonts.pdfMake.vfs;
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
    this.getShopInformation();
  }

  /**
   * FORM METHODS
   * initDataForm()
   * onSubmit()
   */


  private initDataForm() {
    this.dataForm = this.fb.group({
      name: [null],
      phone: [null, Validators.required],
      // phone: new FormControl(
      //   {value: null, disabled: false},
      //   [
      //     Validators.minLength(11)
      //   ]
      // ),
      address: [null],
      userPoints: [null],
      birthdate: [null],
    });
  }

  onSubmit() {
    if (!this.products.length) {
      this.uiService.warn('Please Add some products to continue sale return');
      return;
    }
    const mData = {
      customer: this.customer,
      products: this.products,
      returnDate: this.soldDate,
      returnDateString: this.utilsService.getDateString(this.soldDate),
      charge: this.charge ?? 0,
      subTotal: this.subTotal,
      grandTotal: this.grandTotal,
      totalPurchasePrice: this.purchaseTotalAmount,
      month: this.utilsService.getDateMonth(false, new Date()),
      year: new Date().getFullYear(),
      invoiceNo: this.invoiceNo,
      note: this.note,
    }
    this.openConfirmDialog(mData)

  }


  /**
   * HTTP REQ HANDLE
   * addSalesReturn()
   */

  private addSalesReturn(data: any) {
    this.spinnerService.show();
    this.subDataOne = this.salesReturnService.addNewSalesReturn(data)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.success) {
            this.uiService.success(res.message);
            this.products = [];
            this.customer = null;
            this.note = null;
            this.invoiceNo = null;
            this.charge = null;
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

  private getSaleById() {
    this.spinnerService.show();
    this.subDataTwo = this.salesReturnService.getSalesReturnById(this.id)
      .subscribe({
        next: (res => {
          this.spinnerService.hide();
          if (res.data) {
            this.sale = res.data;
            this.soldDate = new Date(this.sale.returnDate);
            this.products = this.sale.products;
            this.charge = this.sale.charge;
            this.note = this.sale.note;
            this.invoiceNo = this.sale.invoiceNo;

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
    this.products.push({...data, ...{soldQuantity: 1}})
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
    return this.products.map(t => {
      return (t.salePrice * t.soldQuantity);
    }).reduce((acc, value) => acc + value, 0);
  }

  get grandTotal() {
    return this.subTotal - this.charge;
  }

  get purchaseTotalAmount() {
    return this.products.map(t => {
      return (t.purchasePrice * t.soldQuantity);
    }).reduce((acc, value) => acc + value, 0);
  }


  /**
   * COMPONENT DIALOG VIEW
   * openConfirmDialog()
   */
  public openConfirmDialog(data: any) {
    const dialogRef = this.dialog.open(SaleConfirmComponent, {
      data: {type: 'sale-return', data: data},
      maxWidth: '98%',
      minWidth: '750px',
      maxHeight: '90%',
      height: 'auto',
      panelClass: ['my-custom-dialog-class', 'my-class']
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.type === 'confirm') {
          this.addSalesReturn(data);
        }

        if (dialogResult.type === 'print') {
          this.addSalesReturn(data);
        }

        if (dialogResult.type === 'cancel') {
          this.dialog.closeAll();
        }

      }
    });
  }


  /**
   * Invoice PDF
   */

  async downloadPdfInvoice(type?: string, m?: Sale) {


    const documentDefinition = await this.getInvoiceDocument(m);

    if (type === 'download') {
      pdfMake.createPdf(documentDefinition).download(`Invoice_${m?.invoiceNo}.pdf`);
    } else if (type === 'print') {
      pdfMake.createPdf(documentDefinition).print();
    } else {
      pdfMake.createPdf(documentDefinition).download(`Invoice_${m?.invoiceNo}.pdf`);
    }

  }


  private async getInvoiceDocument(m: Sale) {

    const documentObject = {
      content: [
        {
          columns: [
            await this.getProfilePicObjectPdf(),
            [
              {
                width: 'auto',
                text: ``,
                style: 'p',
              },
              {
                width: 'auto',
                text: ``,
                style: 'p',
              },
              {
                width: 'auto',
                text: ``,
                style: 'p',
              },
              {
                width: 'auto',
                text: ``,
                style: 'p',
              },
            ],
            [
              {
                width: '*',
                text: [
                  `Invoice ID: `,
                  {
                    text: m?.invoiceNo,
                    bold: true
                  }
                ],
                style: 'p',
                alignment: 'right'
              },
              {
                width: '*',
                text: `${this.utilsService.getDateString(m.soldDate, 'll')}`,
                style: 'p',
                alignment: 'right'
              },
            ]
          ],
          columnGap: 16
        }, // END TOP INFO SECTION
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 5,
              x2: 535,
              y2: 5,
              lineWidth: 0.5,
              lineColor: '#E8E8E8'
            }
          ]
        }, // END TOP INFO BORDER
        {
          columns: [
            [
              // {
              //   width: 'auto',
              //   text: [
              //     `Salesman Id: `,
              //     {
              //       text: '#' + m?.salesmanId,
              //       bold: true
              //     }
              //   ],
              //   style: 'p',
              // },
              // {
              //   width: 'auto',
              //   text: `Customer Info`,
              //   style: 'p',
              //   margin: [0, 8, 0, 0]
              // },
              // {
              //   width: 'auto',
              //   text: [
              //     `Customer Id: `,
              //     {
              //       text: '#' + m?.customerId,
              //       bold: true
              //     }
              //   ],
              //   style: 'p',
              // },
              // {
              //   width: 'auto',
              //   text: `Date Added: ${this.utilsService.getDateString(new Date(), 'll')}`,
              //   style: 'p',
              // },
              {
                width: 'auto',
                text: [
                  `Customer Name: `,
                  {
                    text: m.customer ? m.customer?.name : 'n/a',
                    bold: true
                  }
                ],
                style: 'p',
                margin: [0, 5, 0, 0]
              },
              {
                width: 'auto',
                text: [
                  `Customer Phone Number: `,
                  {
                    text: m.customer ? m.customer?.phone : 'n/a',
                    bold: true
                  }
                ],
                style: 'p',
              },
              {
                width: 'auto',
                text: [
                  `Customer Address: `,
                  {
                    text: m.customer ? m.customer?.address : 'n/a',
                    bold: true
                  }
                ],
                style: 'p',
              },
            ],
            {
              width: '*',
              alignment: 'left',
              text: '',
            },
          ],
          columnGap: 16
        },
        {
          style: 'gapY',
          columns: [
            this.getItemTable(m),
          ]
        }, // END ITEM TABLE SECTION
        {
          style: 'gapY',
          columns: [
            {
              width: '*',
              alignment: 'left',
              text: '',
            }, // Middle Space for Make Column Left & Right
            [
              this.getCalculationTable(m)
            ]
          ]
        }, // END CALCULATION SECTION
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 5,
              x2: 535,
              y2: 5,
              lineWidth: 0.5,
              lineColor: '#E8E8E8'
            }
          ]
        }, // END TOP INFO BORDER
        {
          style: 'gapXY',
          margin: [0, 200, 0, 0],
          columns: [
            [
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0,
                    y1: 5,
                    x2: 100,
                    y2: 5,
                    lineWidth: 1,
                    lineColor: '#767676',
                  }
                ]
              },
              {
                width: 'auto',
                text: [
                  `Received By `,
                ],
                style: 'p',
                margin: [22, 10]
              }
            ],
            {
              width: '*',
              alignment: 'left',
              text: '',
            }, // Middle Space for Make Column Left & Right
            [
              {
                alignment: 'right',
                canvas: [
                  {
                    type: 'line',
                    x1: 0,
                    y1: 5,
                    x2: 100,
                    y2: 5,
                    lineWidth: 1,
                    lineColor: '#767676',
                  }
                ]
              },
              {
                width: '100',
                text: [
                  `Authorized By `,
                ],
                style: 'p',
                alignment: 'right',
                margin: [22, 10]
              }
            ],

          ],

        },
        {
          width: '*',
          text: [
            `30 Roberts Lane # 01 -00 Singapore 218309, Phone: 09611677835/01894885631, natco.info@gmail.com `
          ],
          style: 'p',
          margin: [0, 60, 0, 0],
          alignment: 'center',
        },
        // {
        //   width: '*',
        //   text: [
        //     `Mirpur 14, Dhaka `
        //   ],
        //   style: 'p',
        //   alignment: 'center',
        // },
        // {
        //   width: '*',
        //   text: [
        //     `Telephone: +880 ---`
        //   ],
        //   style: 'p',
        //   alignment: 'center',
        // },
        // {
        //   width: '*',
        //   text: [
        //     `Email: info@sunelectronics.softlabit.com`
        //   ],
        //   style: 'p',
        //   alignment: 'center',
        // },
        {
          text: 'Thank you for your purchase',
          style: 'p',
          alignment: 'center',
          margin: [0, 10]
        },
      ],
      styles: this.pdfMakeStyleObject
    };


    return documentObject;
  }


  async getProfilePicObjectPdf() {
    return {
      image: await this.getBase64ImageFromURL('https://ftp.natco.polson.com/uploads/logo/sun-pos.png'),
      width: 200,
      alignment: 'left'
    };
  }

  getBase64ImageFromURL(url): Promise<any> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }


  dataTableForPdfMake(m: Sale) {
    const tableHead = [
      {
        text: 'SL',
        style: 'tableHead',
        // border: [true, true, true, true],
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Name',
        style: 'tableHead',
        // border: [true, true, true, true],
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Product Code',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Sold Quantity',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Unit Price',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
      {
        text: 'Total',
        style: 'tableHead',
        fillColor: '#DEDEDE',
        borderColor: ['#eee', '#eee', '#eee', '#eee'],
      },
    ];

    const finalTableBody = [tableHead];

    m.products.forEach((s, i) => {
      const res = [
        {
          text: i + 1,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: `${s.name} (${s.model || ""}, ${s.others || ""})`,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: s.sku,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: s.soldQuantity,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: s.salePrice,
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
        {
          text: (s.salePrice * s.soldQuantity),
          style: 'tableBody',
          borderColor: ['#eee', '#eee', '#eee', '#eee'],
        },
      ];
      // @ts-ignore
      finalTableBody.push(res);
    });


    return finalTableBody;

  }


  getItemTable(m: Sale) {
    return {
      table: {
        widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
        body: this.dataTableForPdfMake(m)
      }
    };
  }

  getCalculationTable(m: Sale) {
    return {
      table: {
        widths: ['*', '*'],
        body: [
          [
            {
              text: 'Sub Total',
              style: 'tableHead',
              // border: [true, true, true, true],
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
            {
              text: `${m?.subTotal} TK`,
              style: 'tableBody',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            }
          ],
          [
            {
              text: 'Discount(-)',
              style: 'tableHead',
              // border: [true, true, true, true],
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
            {
              text: `${m?.discountAmount || 0} TK`,
              style: 'tableBody',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            }
          ],
          [
            {
              text: 'Total',
              style: 'tableHead',
              // border: [true, true, true, true],
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            },
            {
              text: `${m?.total} TK`,
              style: 'tableBody',
              borderColor: ['#eee', '#eee', '#eee', '#eee'],
            }
          ],
        ]
      }
    };
  }

  get pdfMakeStyleObject(): object {
    return {
      p: {
        fontSize: 9,
      },
      pBn: {
        fontSize: 9,
        lineHeight: 2
      },
      tableHead: {
        fontSize: 9,
        bold: true,
        margin: [5, 2],
      },
      tableBody: {
        fontSize: 9,
        margin: [5, 2],
      },
      gapY: {
        margin: [0, 8]
      },
      gapXY: {
        margin: [0, 40]
      }

    };
  }


  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subShopInfo) {
      this.subShopInfo.unsubscribe();
    }
  }
}
