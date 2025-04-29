import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandAddComponent } from './brand-add.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MaterialModule} from "../../../material/material.module";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    BrandAddComponent
  ],
  exports: [
    BrandAddComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class BrandAddModule { }
