import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-table-print',
  templateUrl: './table-print.component.html',
  styleUrls: ['./table-print.component.scss']
})
export class TablePrintComponent implements OnInit {
@Input() products:any;
@Input() productCalculation:any;
@Input() shopInformation:any;
  myDate = new Date();
  constructor() { }

  ngOnInit(): void {
  }
  getTotalPurchasePrice() {
    return this.products.map(t => (t?.purchasePrice ?? 0)).reduce((acc, value) => acc + value, 0)
  }
}
