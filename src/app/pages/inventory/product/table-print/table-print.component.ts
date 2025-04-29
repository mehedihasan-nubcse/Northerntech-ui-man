import {Component, Input, OnInit} from '@angular/core';
import {UtilsService} from "../../../../services/core/utils.service";

@Component({
  selector: 'app-table-print',
  templateUrl: './table-print.component.html',
  styleUrls: ['./table-print.component.scss']
})
export class TablePrintComponent implements OnInit {
  @Input() products: any;
  @Input() productCalculation: any;
  @Input() shopInformation: any;

  today = new Date();

  constructor(
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
  }

}
