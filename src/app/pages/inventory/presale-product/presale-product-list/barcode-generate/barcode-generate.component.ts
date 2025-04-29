import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Product} from '../../../../../interfaces/common/product.interface';
import {ProductService} from '../../../../../services/common/product.service';

@Component({
  selector: 'app-barcode-generate',
  templateUrl: './barcode-generate.component.html',
  styleUrls: ['./barcode-generate.component.scss']
})
export class BarcodeGenerateComponent implements OnInit {

  printCount: number;
  id: string;
  product: Product = null;
  loop: number[] = [0];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    // Get Value from ID..
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.getProductById();
    });
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


  /**
   * ON Select Check
   * onGenerate()
   * onClear()
   * onPrintConfirm()
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
}
