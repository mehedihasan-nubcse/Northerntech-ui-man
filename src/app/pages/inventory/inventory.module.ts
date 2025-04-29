import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddProductComponent} from './product/add-product/add-product.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InventoryRoutingModule} from './inventory-routing.module';
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
import {ProductListComponent} from './product/product-list/product-list.component';
import {CategoryListComponent} from './category/category-list/category-list.component';
import {AddCategoryComponent} from './category/add-category/add-category.component';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {MaterialModule} from "../../material/material.module";
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';
import {VendorSearchFieldModule} from '../../shared/lazy/vendor-search-field/vendor-search-field.module';
import {BarcodeGenerateComponent} from './product/product-list/barcode-generate/barcode-generate.component';
import {NgxPrintModule} from 'ngx-print';
import {NgxBarcode6Module} from 'ngx-barcode6';
import {NoContentModule} from 'src/app/shared/lazy/no-content/no-content.module';
import {PurchaseHistoryComponent} from './purchase-history/purchase-history.component';
import {AddAttributeComponent} from './attribute/add-attribute/add-attribute.component';
import {AttributeListComponent} from './attribute/attribute-list/attribute-list.component';

import {VendorAddModule} from '../../shared/lazy/vendor-add/vendor-add.module';

import {ColorListComponent} from './color/color-list/color-list.component';
import {AddColorComponent} from './color/add-color/add-color.component';
import {AddSizeComponent} from './size/add-size/add-size.component';
import {SizeListComponent} from './size/size-list/size-list.component';
import {CategoryAddModule} from '../../shared/lazy/category-add/category-add.module';
import {ColorAddModule} from '../../shared/lazy/color-add/color-add.module';
import {SizeAddModule} from '../../shared/lazy/size-add/size-add.module';
import {DamageControllerModule} from '../../shared/dialog-view/damage-controller/damage-controller.module';
import {DamageHistoryComponent} from './damage-history/damage-history.component';
import {PresaleProductListComponent} from './presale-product/presale-product-list/presale-product-list.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ExpiredProductListComponent} from './product/expired-product-list/expired-product-list.component';
import { AddSubCategoryComponent } from './sub-category/add-sub-category/add-sub-category.component';
import {SubCategoryListComponent} from './sub-category/sub-category-list/sub-category-list.component';
import {SubCategoryAddModule} from '../../shared/lazy/sub-category-add/sub-category-add.module';
import { TablePrintComponent } from './product/table-print/table-print.component';
import {MatMenuModule} from "@angular/material/menu";
import { StockReportComponent } from './product/stock-report/stock-report.component';
import { InStockHistoryComponent } from './in-stock-history/in-stock-history.component';
import { AllDetailsComponent } from './all-details/all-details.component';
import { GroupProductComponent } from './product/group-product/group-product.component';
;
import { GroupPurchaseHistoryComponent } from './purchase-history/group-purchase-history/group-purchase-history.component';
import { GroupOutStockHistoryComponent } from './damage-history/group-out-stock-history/group-out-stock-history.component';
import { OldProductListComponent } from './product/old-product-list/old-product-list.component';


@NgModule({
  declarations: [
    AddProductComponent,
    ProductListComponent,
    CategoryListComponent,
    AddCategoryComponent,
    BarcodeGenerateComponent,
    AddAttributeComponent,
    AttributeListComponent,
    ColorListComponent,
    AddColorComponent,
    AddSizeComponent,
    SizeListComponent,
    PurchaseHistoryComponent,
    DamageHistoryComponent,
    PresaleProductListComponent,
    ExpiredProductListComponent,
    AddSubCategoryComponent,
    SubCategoryListComponent,
    TablePrintComponent,
    StockReportComponent,
    InStockHistoryComponent,
    AllDetailsComponent,
    GroupProductComponent,

    GroupPurchaseHistoryComponent,
      GroupOutStockHistoryComponent,
      OldProductListComponent,

  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    DigitOnlyModule,
    NgxDropzoneModule,
    MaterialModule,
    NgxPaginationModule,
    FormsModule,
    MaterialModule,
    NgxSpinnerModule,
    VendorSearchFieldModule,
    NgxPrintModule,
    NgxBarcode6Module,
    NoContentModule,
    VendorAddModule,
    CategoryAddModule,
    ColorAddModule,
    SizeAddModule,
    DamageControllerModule,
    PipesModule,
    MatMenuModule,
    SubCategoryAddModule,
  ]
})
export class InventoryModule {
}
