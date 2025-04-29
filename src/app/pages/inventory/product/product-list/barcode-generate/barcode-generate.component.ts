import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Product} from '../../../../../interfaces/common/product.interface';
import {ProductService} from '../../../../../services/common/product.service';
import {ShopInformation} from '../../../../../interfaces/common/shop-information.interface';
import {ShopInformationService} from '../../../../../services/common/shop-information.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-barcode-generate',
  templateUrl: './barcode-generate.component.html',
  styleUrls: ['./barcode-generate.component.scss']
})
export class BarcodeGenerateComponent implements OnInit, OnDestroy {

  printCount: number;
  id: string;
  product: Product = null;
  loop: number[] = [0];


  // Shop data
  shopInformation: ShopInformation;

  // Subscriptions
  private subShopInfo: Subscription;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private shopInformationService: ShopInformationService,
  ) {
  }

  ngOnInit(): void {
    // Get Value from ID..
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.getProductById();
    });

    // Base Data
    this.getShopInformation();
  }

  /**
   * HTTP REQ HANDLE
   * getProductById()
   */

  private getProductById() {
    this.productService.getProductById(this.id)
      .subscribe({
        next: (res) => {
          this.product = res.data;
        },
        error: (error) => {
          console.log(error)
        }
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
   * ON Select Check
   * onGenerate()
   * onClear()
   * onPrintConfirm()
   * onPrint()
   */

  onGenerate() {
    for (let i = 0; i < this.printCount; i++) {
      this.loop.push(i);
    }
    console.log(this.loop);
  }

  onClear() {
    this.loop = [];
    this.printCount = null;
  }

  onPrintConfirm() {
    console.log('Confirm');
  }

  onPrint() {
    window.print()
    window.close()
  }

  /**
   * ON DESTROY
   */

  ngOnDestroy() {
    if (this.subShopInfo) {
      this.subShopInfo.unsubscribe();
    }
  }
}
