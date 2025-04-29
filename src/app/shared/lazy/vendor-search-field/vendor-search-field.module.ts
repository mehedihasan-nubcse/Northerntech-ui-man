import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VendorSearchFieldComponent} from './vendor-search-field.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSelectInfiniteScrollModule} from 'ng-mat-select-infinite-scroll';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [
    VendorSearchFieldComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSelectInfiniteScrollModule,
    NgxMatSelectSearchModule,
    MatIconModule,
  ],
  exports: [
    VendorSearchFieldComponent
  ]
})
export class VendorSearchFieldModule {
}
