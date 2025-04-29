import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PrintSalePosComponent} from './print-sale-pos.component';
import {PipesModule} from '../../pipes/pipes.module';
import {NgxBarcode6Module} from 'ngx-barcode6';
import {QRCodeModule} from 'angularx-qrcode';



@NgModule({
  declarations: [
    PrintSalePosComponent
  ],
  exports: [
    PrintSalePosComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    NgxBarcode6Module,
    QRCodeModule
  ]
})
export class PrintSalePosModule { }
