import {Component, Input, OnInit} from '@angular/core';
import {ShopInformation} from '../../../interfaces/common/shop-information.interface';

@Component({
  selector: 'app-view-print-sale-pos',
  templateUrl: './view-print-sale-pos.component.html',
  styleUrls: ['./view-print-sale-pos.component.scss']
})
export class ViewPrintSalePosComponent implements OnInit {
  @Input() data: any;
  @Input() shopInformation: ShopInformation;

  today: Date = new Date();

  constructor() { }

  ngOnInit(): void {
  }

}
