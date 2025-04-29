import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProblemAddComponent } from './problem-add.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";



@NgModule({
  declarations: [
    ProblemAddComponent
  ],
  exports: [
    ProblemAddComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class ProblemAddModule { }
