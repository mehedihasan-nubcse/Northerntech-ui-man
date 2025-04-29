import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrashRoutingModule } from './trash-routing.module';
import { ProductTrashComponent } from './product-trash/product-trash.component';
import { PurchaseTrashComponent } from './purchase-trash/purchase-trash.component';
import { SalesTrashComponent } from './sales-trash/sales-trash.component';
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MaterialModule} from "../../material/material.module";
import {NgxPaginationModule} from "ngx-pagination";
import {NgxSpinnerModule} from "ngx-spinner";
import {NoContentModule} from "../../shared/lazy/no-content/no-content.module";
import {PipesModule} from "../../shared/pipes/pipes.module";
import { OutStockTrashComponent } from './out-stock-trash/out-stock-trash.component';
import {PrintSalePosModule} from "../../shared/lazy/print-sale-pos/print-sale-pos.module";


@NgModule({
  declarations: [
    ProductTrashComponent,
    PurchaseTrashComponent,
    SalesTrashComponent,
    OutStockTrashComponent
  ],
  imports: [
    CommonModule,
    TrashRoutingModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MaterialModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    NoContentModule,
    PipesModule,
    PrintSalePosModule
  ]
})
export class TrashModule { }
