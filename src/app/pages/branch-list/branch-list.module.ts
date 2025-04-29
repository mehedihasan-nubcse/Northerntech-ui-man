import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchListRoutingModule } from './branch-list-routing.module';
import { AllBranchComponent } from './all-branch/all-branch.component';
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
import { AddBranchComponent } from './add-branch/add-branch.component';
import { AllBranchListComponent } from './all-branch-list/all-branch-list.component';


@NgModule({
  declarations: [
    AllBranchComponent,
    AddBranchComponent,
    AllBranchListComponent
  ],
  imports: [
    CommonModule,
    BranchListRoutingModule,
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
export class BranchListModule { }
