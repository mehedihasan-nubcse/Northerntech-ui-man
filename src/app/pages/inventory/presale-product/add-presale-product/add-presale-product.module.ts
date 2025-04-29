import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddPresaleProductComponent} from './add-presale-product.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {VendorSearchFieldModule} from '../../../../shared/lazy/vendor-search-field/vendor-search-field.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {MatOptionModule} from '@angular/material/core';
import {RouterModule, Routes} from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {CategoryAddModule} from '../../../../shared/lazy/category-add/category-add.module';
import {ColorAddModule} from '../../../../shared/lazy/color-add/color-add.module';
import {MatInputModule} from '@angular/material/input';
import {SizeAddModule} from '../../../../shared/lazy/size-add/size-add.module';
import {MatButtonModule} from '@angular/material/button';
import {VendorAddModule} from '../../../../shared/lazy/vendor-add/vendor-add.module';


const routes: Routes = [
  {
    path: '',
    component: AddPresaleProductComponent,
  },
];

@NgModule({
  declarations: [
    AddPresaleProductComponent
  ],
  exports: [
    AddPresaleProductComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    VendorSearchFieldModule,
    NgxSpinnerModule,
    MatFormFieldModule,
    MatDatepickerModule,
    DigitOnlyModule,
    MatOptionModule,
    MatSelectModule,
    CategoryAddModule,
    ColorAddModule,
    MatInputModule,
    SizeAddModule,
    MatButtonModule,
    VendorAddModule,
  ]
})
export class AddPresaleProductModule {
}
