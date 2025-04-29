import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleConfirmComponent } from './sale-confirm.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {PipesModule} from '../../pipes/pipes.module';



@NgModule({
  declarations: [
    SaleConfirmComponent
  ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        PipesModule
    ],
  exports: [
    SaleConfirmComponent
  ]
})
export class SaleConfirmModule { }
