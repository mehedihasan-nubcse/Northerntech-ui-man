import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PayoutService} from "../../../services/common/payout.service";
import {Subscription} from "rxjs";
import {UtilsService} from "../../../services/core/utils.service";

@Component({
  selector: 'app-table-print',
  templateUrl: './table-print.component.html',
  styleUrls: ['./table-print.component.scss']
})
export class TablePrintComponent implements OnInit, OnChanges {
@Input() products:any;
@Input() dataFormDateRange:any;
@Input() isDefaultFilter:any;
@Input() multiPaymentReport:any[] = [];
@Input() productCalculation:any;
@Input() shopInformation:any;
@Input() payouts:any;
@Input() allRepair:any;
  @Input() sellerName!: string;
  @Input() isCategoryFilter!: boolean;
  @Input() isPayout!: boolean;
  private subDataTwo: Subscription;
  // payouts?: Payout;
  myDate = new Date();
  constructor(
    private payoutService: PayoutService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {

    //
    // if (this.products){
    //   console.log('payouts', this.payouts)
    //   console.log('shopInformation', this.shopInformation)
    //   console.log('products', this.products)
    //   this.getPayout();
    // }

  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('reportsData', this.products);
  }

  // private getPayout() {
  //   this.subDataTwo = this.payoutService.getPayout()
  //     .subscribe(res => {
  //       this.payouts = res.data;
  //       console.log('--------------------', this.payouts)
  //     }, err => {
  //       console.log(err);
  //     });
  // }

  // getPayAmount(): number {
  //  return this.payouts?.payoutAmount?.map(f => f.amount).reduce((acc, val) => acc + val, 0)
  // }




  getPayAmount() {
    return this.payouts.map(t => (t?.amount ?? 0)).reduce((acc, value) => acc + value, 0)
  }

  getAllRepairAmount() {
    return this.allRepair.map(t => (t?.amount ?? 0)).reduce((acc, value) => acc + value, 0)
  }

  getPaymentTypeAmount(type: string): number {
    return this.multiPaymentReport.filter(m => m.name === type).map(f => f.amount).reduce((acc, val) => acc + val, 0)
  }

  totalSalePrice(): number {
    // console.log('products',this.products)
    return this.products.map(f => f.salePrice *f.soldQuantity).reduce((acc, val) => acc + val, 0)
  }

  totalPurchasePrice(): number {
    return this.products.map(f => f.purchasePrice *f.soldQuantity).reduce((acc, val) => acc + val, 0)
  }

  totalProfitPrice(): number {
    return this.products.map(f => f.profit).reduce((acc, val) => acc + val, 0)
  }

  totalQuantity(): number {
    return this.products.map(f => f.soldQuantity).reduce((acc, val) => acc + val, 0)
  }
}
