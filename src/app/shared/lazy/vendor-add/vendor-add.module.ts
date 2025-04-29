import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorAddComponent } from './vendor-add.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';



@NgModule({
  declarations: [
    VendorAddComponent
  ],
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        FormsModule,
        MatButtonModule,
    ],
  exports: [
    VendorAddComponent
  ]
})
export class VendorAddModule { }
