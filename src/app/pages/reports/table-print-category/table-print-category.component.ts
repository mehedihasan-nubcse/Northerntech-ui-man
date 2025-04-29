import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs";
import {PayoutService} from "../../../services/common/payout.service";
import {UtilsService} from "../../../services/core/utils.service";

@Component({
  selector: 'app-table-print-category',
  templateUrl: './table-print-category.component.html',
  styleUrls: ['./table-print-category.component.scss']
})
export class TablePrintCategoryComponent implements OnInit, OnChanges {
  @Input() categoryReportsData:any;
  @Input() dataFormDateRange:any;
  @Input() isDefaultFilter:any;
  @Input() multiPaymentReport:any[] = [];
  @Input() payouts:any;
  @Input() allRepair:any;
  @Input() shopInformation:any;
  totalSalePriceAmount:any
  @Input() processedData!: any[];
  @Input() isCategoryFilter!: boolean;

  private subDataTwo: Subscription;
  // payouts?: Payout;

  myDate = new Date();

  constructor(
    private payoutService: PayoutService,
    protected utilsService: UtilsService,
  ) { }

  ngOnInit(): void {



  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('reportsData', this.products);
  }





  totalSalePrice(data: any): number {
    // console.log('products',this.products)
    this.totalSalePriceAmount = data.map(f => f.salePrice *f.soldQuantity).reduce((acc, val) => acc + val, 0)
    return this.totalSalePriceAmount
  }

  totalPurchasePrice(data: any): number {
    return data.map(f => f.purchasePrice *f.soldQuantity).reduce((acc, val) => acc + val, 0)
  }

  totalProfitPrice(data: any): number {
    return data.map(f => f.profit).reduce((acc, val) => acc + val, 0)
  }

  totalQuantity(data: any): number {
    return data.map(f => f.soldQuantity).reduce((acc, val) => acc + val, 0)
  }

  getPaymentTypeAmount(type: string): number {
    return this.multiPaymentReport.filter(m => m.name === type).map(f => f.amount).reduce((acc, val) => acc + val, 0)
  }
  getPayAmount() {
    return this.payouts.map(t => (t?.amount ?? 0)).reduce((acc, value) => acc + value, 0)
  }

  getAllRepairAmount() {
    return this.allRepair.map(t => (t?.amount ?? 0)).reduce((acc, value) => acc + value, 0)
  }

  getProcessedData() {
    return this.processedData.map(t => (t?.totalSale ?? 0)).reduce((acc, value) => acc + value, 0)
  }

  getProcessedDataPurchasePrice() {
    return this.processedData.map(t => (t?.totalPurchasePrice ?? 0)).reduce((acc, value) => acc + value, 0)
  }
  getProcessedDataProfit() {
    return this.processedData.map(t => (t?.totalProfit ?? 0)).reduce((acc, value) => acc + value, 0)
  }

  allCategoryData(categoryData: any) {
     if (categoryData){
       console.log('hi')

    const price = categoryData.data.map(f => f.salePrice *f.soldQuantity).reduce((acc, val) => acc + val, 0)

       console.log("price",price)
     }else {
       console.log('no')
     }
  }
}
