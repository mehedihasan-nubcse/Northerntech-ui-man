import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { CustomTableListComponent } from './custom-table-list/custom-table-list.component';
import { CustomTableRoutingModule } from './custom-table-routing.module';
import { CustomTableComponent } from './custom-table.component';


@NgModule({
  declarations: [
    CustomTableComponent,
    CustomTableListComponent
  ],
  imports: [
    CommonModule,
    CustomTableRoutingModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomTableModule { }
