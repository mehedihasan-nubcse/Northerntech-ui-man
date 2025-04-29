import {Component, Input, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-print-invoice',
  templateUrl: './print-invoice.component.html',
  styleUrls: ['./print-invoice.component.scss'],
  providers: [DatePipe]
})
export class PrintInvoiceComponent implements OnInit {
  @Input() shopInformation: any;
  @Input() repairData: any;
  currentDateTime: string;
  constructor(private datePipe: DatePipe) {
    this.currentDateTime = this.datePipe.transform(new Date(), 'dd MMM, yy h:mm a')!;
  }

  ngOnInit(): void {
  }

}
