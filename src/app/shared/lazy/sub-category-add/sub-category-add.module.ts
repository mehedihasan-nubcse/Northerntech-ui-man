import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubCategoryAddComponent } from './sub-category-add.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';



@NgModule({
  declarations: [
    SubCategoryAddComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
  ],
  exports: [
    SubCategoryAddComponent
  ]
})
export class SubCategoryAddModule { }
