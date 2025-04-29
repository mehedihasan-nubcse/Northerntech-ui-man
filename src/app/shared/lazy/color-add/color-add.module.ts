import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorAddComponent } from './color-add.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';



@NgModule({
  declarations: [
    ColorAddComponent
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
    ColorAddComponent
  ]
})
export class ColorAddModule { }
