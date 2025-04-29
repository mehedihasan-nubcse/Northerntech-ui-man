import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportsRoutingModule} from './reports-routing.module';


import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDropzoneModule} from "ngx-dropzone";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgxPaginationModule} from "ngx-pagination";
import {MaterialModule} from 'src/app/material/material.module';
import {NoContentModule} from "../../shared/lazy/no-content/no-content.module";
import {DigitOnlyModule} from '@uiowa/digit-only';
import {StatementListComponent} from './statement-list/statement-list.component';
import {SaleListComponent} from './sale-list/sale-list.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ProductSaleDetailsComponent} from './product-sale-details/product-sale-details.component';
import {SaleRecordComponent} from './sale-record/sale-record.component';
import {TablePrintComponent} from "./table-print/table-print.component";
import { TablePrintCategoryComponent } from './table-print-category/table-print-category.component';


@NgModule({
  declarations: [
    StatementListComponent,
    SaleListComponent,
    SaleRecordComponent,
    ProductSaleDetailsComponent,
    TablePrintComponent,
    TablePrintCategoryComponent
  ],
  exports: [
    TablePrintComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    NgxDropzoneModule,
    MatCheckboxModule,
    MatPaginatorModule,
    FormsModule,
    NgxPaginationModule,
    MaterialModule,
    NoContentModule,
    DigitOnlyModule,
    PipesModule,
  ]
})
export class ReportsModule {
}
