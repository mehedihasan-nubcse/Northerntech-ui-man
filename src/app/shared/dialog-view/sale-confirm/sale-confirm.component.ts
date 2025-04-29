import {AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ShopInformation} from '../../../interfaces/common/shop-information.interface';

@Component({
  selector: 'app-note-view',
  templateUrl: './sale-confirm.component.html',
  styleUrls: ['./sale-confirm.component.scss']
})
export class SaleConfirmComponent implements OnInit, AfterViewInit {

  @ViewChild('btnConfirm') btnConfirm: ElementRef;

  sale: any = null;
  type: string = 'sale';

  // Shop data
  shopInformation: ShopInformation;

  constructor(
    public dialogRef: MatDialogRef<SaleConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.type = this.data.type;
      this.sale = this.data.data;
      this.shopInformation = this.data.shopInformation
    }
  }

  ngAfterViewInit() {
    // this.btnConfirm.nativeElement.focus();
  }


  /**
   * ON CLOSE DIALOG
   */
  onClose(type?: string) {
    this.dialogRef.close({type: type})
  }

}
