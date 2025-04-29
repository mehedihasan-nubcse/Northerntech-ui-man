import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepairRoutingModule } from './repair-routing.module';
import { AddRepairComponent } from './add-repair/add-repair.component';
import { RepairListComponent } from './repair-list/repair-list.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatRadioModule} from "@angular/material/radio";
import {MatNativeDateModule} from "@angular/material/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {NgxDropzoneModule} from "ngx-dropzone";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgxPaginationModule} from "ngx-pagination";
import {MaterialModule} from "../../material/material.module";
import {NoContentModule} from "../../shared/lazy/no-content/no-content.module";
import {DigitOnlyModule} from "@uiowa/digit-only";
import {PipesModule} from "../../shared/pipes/pipes.module";
import { PrintInvoiceComponent } from './repair-list/print-invoice/print-invoice.component';
import {PrintSalePosModule} from "../../shared/lazy/print-sale-pos/print-sale-pos.module";
import {QRCodeModule} from "angularx-qrcode";
import {ColorAddModule} from "../../shared/lazy/color-add/color-add.module";
import {BrandAddModule} from "../../shared/lazy/brand-add/brand-add.module";
import {ProblemAddModule} from "../../shared/lazy/problem-add/problem-add.module";
import { RepairInvoiceComponent } from './add-repair/repair-invoice/repair-invoice.component';
import { AddBrandComponent } from './Brand/add-brand/add-brand.component';
import { AllBrandComponent } from './Brand/all-brand/all-brand.component';
import {AddProblemComponent} from "./problem/add-problem/add-problem.component";
import {AllProblemComponent} from "./problem/all-problem/all-problem.component";
import { UpdateStatusComponent } from './repair-list/update-status/update-status.component';
import { AddModelComponent } from './model/add-model/add-model.component';
import { AllModelComponent } from './model/all-model/all-model.component';
import {ModelAddModule} from "../../shared/lazy/model-add/model-add.module";



@NgModule({
  declarations: [
    AddRepairComponent,
    RepairListComponent,
    PrintInvoiceComponent,
    RepairInvoiceComponent,
    AddBrandComponent,
    AllBrandComponent,
    AddProblemComponent,
    AllProblemComponent,
    UpdateStatusComponent,
    AddModelComponent,
    AllModelComponent
  ],
    imports: [
        CommonModule,
        RepairRoutingModule,
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
        PrintSalePosModule,
        QRCodeModule,
        ColorAddModule,
        BrandAddModule,
        ProblemAddModule,
        ModelAddModule,
    ]
})
export class RepairModule { }
