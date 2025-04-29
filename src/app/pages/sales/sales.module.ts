import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SalesRoutingModule} from './sales-routing.module';
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
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SharedModule} from '../../shared/shared.module';
import {CustomerSearchFieldComponent} from './components/customer-search-field/customer-search-field.component';
import {ProductSearchFiledComponent} from './components/product-search-filed/product-search-filed.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {PreOrderAddComponent} from './pre-order/pre-order-add/pre-order-add.component';
import {PreOrderListComponent} from './pre-order/pre-order-list/pre-order-list.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MaterialModule} from 'src/app/material/material.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NoContentModule} from "../../shared/lazy/no-content/no-content.module";
import {PointComponent} from './point/point.component';
import {SaleListComponent} from './sale/sale-list/sale-list.component';
import {NewSalesComponent} from './sale/new-sales/new-sales.component';
import {SaleReturnComponent} from './sale-returns/sale-return/sale-return.component';
import {SaleReturnListComponent} from './sale-returns/sale-return-list/sale-return-list.component';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {PrintSalePosModule} from '../../shared/lazy/print-sale-pos/print-sale-pos.module';
import {ProductSearchFieldModule} from '../../shared/lazy/product-search-field/product-search-field.module';
import {VendorSearchFieldModule} from '../../shared/lazy/vendor-search-field/vendor-search-field.module';
import {AddPresaleProductModule} from '../inventory/presale-product/add-presale-product/add-presale-product.module';
import {
  PreorderProductSearchFiledComponent
} from './components/preorder-product-search-filed/preorder-product-search-filed.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import { NewSaleReturnComponent } from './sale-returns/new-sale-return/new-sale-return.component';
import { InvoiceSearchFieldComponent } from './components/invoice-search-field/invoice-search-field.component';
import { NoteComponent } from './sale/note/note.component';
import { ProductReturnComponent } from './sale/product-return/product-return.component';


@NgModule({
  declarations: [
    SaleListComponent,
    NewSalesComponent,
    SaleReturnComponent,
    SaleReturnListComponent,
    CustomerSearchFieldComponent,
    ProductSearchFiledComponent,
    PreOrderAddComponent,
    PreOrderListComponent,
    PointComponent,
    PreorderProductSearchFiledComponent,
    NewSaleReturnComponent,
    InvoiceSearchFieldComponent,
    NoteComponent,
    ProductReturnComponent
  ],
    imports: [
        CommonModule,
        SalesRoutingModule,
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
        MatCheckboxModule,
        FormsModule,
        SharedModule,
        NgxPaginationModule,
        MatTooltipModule,
        NgxSpinnerModule,
        MaterialModule,
        NoContentModule,
        DigitOnlyModule,
        PrintSalePosModule,
        ProductSearchFieldModule,
        VendorSearchFieldModule,
        AddPresaleProductModule,
        PipesModule,
    ],
})
export class SalesModule {
}
