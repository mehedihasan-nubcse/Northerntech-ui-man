import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {IncomeRoutingModule} from './income-routing.module';
import {IncomeListComponent} from './income-list/income-list.component';


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
import {AddIncomeComponent} from './add-income/add-income.component';
import {NgxDropzoneModule} from "ngx-dropzone";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {NgxPaginationModule} from "ngx-pagination";
import {MaterialModule} from 'src/app/material/material.module';
import {NoContentModule} from "../../shared/lazy/no-content/no-content.module";
import {DigitOnlyModule} from '@uiowa/digit-only';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    IncomeListComponent,
    AddIncomeComponent,
  ],
  imports: [
    CommonModule,
    IncomeRoutingModule,
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
export class IncomeModule {
}
