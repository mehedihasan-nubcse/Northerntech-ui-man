import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuyBackRoutingModule } from './buy-back-routing.module';
import { AddBuyBackComponent } from './add-buy-back/add-buy-back.component';
import { AllBuyBackComponent } from './all-buy-back/all-buy-back.component';
import {TablePrintComponent} from "./table-print/table-print.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatRadioModule} from "@angular/material/radio";
import {MatNativeDateModule} from "@angular/material/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {DigitOnlyModule} from "@uiowa/digit-only";
import {NgxDropzoneModule} from "ngx-dropzone";
import {MaterialModule} from "../../material/material.module";
import {NgxPaginationModule} from "ngx-pagination";
import {NgxSpinnerModule} from "ngx-spinner";
import {VendorSearchFieldModule} from "../../shared/lazy/vendor-search-field/vendor-search-field.module";
import {NgxPrintModule} from "ngx-print";
import {NgxBarcode6Module} from "ngx-barcode6";
import {NoContentModule} from "../../shared/lazy/no-content/no-content.module";
import {VendorAddModule} from "../../shared/lazy/vendor-add/vendor-add.module";
import {CategoryAddModule} from "../../shared/lazy/category-add/category-add.module";
import {ColorAddModule} from "../../shared/lazy/color-add/color-add.module";
import {SizeAddModule} from "../../shared/lazy/size-add/size-add.module";
import {DamageControllerModule} from "../../shared/dialog-view/damage-controller/damage-controller.module";
import {PipesModule} from "../../shared/pipes/pipes.module";
import {MatMenuModule} from "@angular/material/menu";
import {SubCategoryAddModule} from "../../shared/lazy/sub-category-add/sub-category-add.module";
import {PrintSalePosComponent} from "./print-sale-pos/print-sale-pos.component";
import { ViewPrintSalePosComponent } from './view-print-sale-pos/view-print-sale-pos.component';


@NgModule({
    declarations: [
        AddBuyBackComponent,
        AllBuyBackComponent,
        TablePrintComponent,
        PrintSalePosComponent,
        ViewPrintSalePosComponent
    ],
    exports: [
        TablePrintComponent
    ],
    imports: [
        CommonModule,
        BuyBackRoutingModule,
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
export class BuyBackModule { }
