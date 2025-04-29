import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelAddComponent } from './model-add.component';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    ModelAddComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  exports:[
    ModelAddComponent
  ]
})
export class ModelAddModule { }
