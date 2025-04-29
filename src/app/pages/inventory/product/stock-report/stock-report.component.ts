import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.scss']
})
export class StockReportComponent implements OnInit {
  @Input() products: any;
  @Input() productCalculation: any;
  @Input() shopInformation: any;

  today = new Date();

  constructor() {
  }

  ngOnInit(): void {
  }

  getQuantity() {
    return this.products.map(t => (t?.quantity ?? 0)).reduce((acc, value) => acc + value, 0)
  }

  getTotalUnitProfit() {

    return this.products.map(t => ((t?.salePrice) - (t?.purchasePrice) ?? 0)).reduce((acc, value) => acc + value, 0)

  }

  getTotalProfit() {

    return this.products.map(t => ((t?.salePrice * t?.quantity) - (t?.purchasePrice * t?.quantity) ?? 0)).reduce((acc, value) => acc + value, 0)

  }

  getTotalPurchasePrice() {
    return this.products.map(t => (t?.purchasePrice ?? 0)).reduce((acc, value) => acc + value, 0)
  }

  getTotalSalePrice() {
    return this.products.map(t => (t?.salePrice ?? 0)).reduce((acc, value) => acc + value, 0)
  }

}
