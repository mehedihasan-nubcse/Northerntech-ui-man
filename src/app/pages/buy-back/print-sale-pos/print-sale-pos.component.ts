import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Sale} from '../../../interfaces/common/sale.interface';
import {ShopInformation} from '../../../interfaces/common/shop-information.interface';
import {Subscription} from "rxjs";
import {ShopInformationService} from "../../../services/common/shop-information.service";
import {UtilsService} from "../../../services/core/utils.service";

@Component({
  selector: 'app-print-sale-pos',
  templateUrl: './print-sale-pos.component.html',
  styleUrls: ['./print-sale-pos.component.scss']
})
export class PrintSalePosComponent implements OnInit, OnChanges {

  @Input() data: any;
  @Input() shopInformation: ShopInformation
  // private subShopInfo: Subscription;
  constructor(
    private shopInformationService: ShopInformationService,
    public utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    // this.getShopInformation();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('data', this.data);
  }





  // private getShopInformation() {
  //   this.subShopInfo = this.shopInformationService.getShopInformation()
  //     .subscribe({
  //       next: res => {
  //         this.shopInformation = res.data;
  //         console.log('this.shopInformation',this.shopInformation)
  //       },
  //       error: err => {
  //         console.log(err);
  //       }
  //     })
  // }

}
