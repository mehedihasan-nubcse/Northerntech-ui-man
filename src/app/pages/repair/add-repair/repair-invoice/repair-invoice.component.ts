import {Component, Input, OnInit} from '@angular/core';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-repair-invoice',
  templateUrl: './repair-invoice.component.html',
  styleUrls: ['./repair-invoice.component.scss']
})
export class RepairInvoiceComponent implements OnInit {

  @Input() shopInformation: any;
  @Input() repairData: any;
  currentDateTime: string;
  constructor(private datePipe: DatePipe) {
    this.currentDateTime = this.datePipe.transform(new Date(), 'dd MMM, yy h:mm a')!;
  }

  ngOnInit(): void {

  }

}

