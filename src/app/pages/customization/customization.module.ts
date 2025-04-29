import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomizationRoutingModule } from './customization-routing.module';
import {FormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DigitOnlyModule} from '@uiowa/digit-only';
import { ShopInformationComponent } from './shop-information/shop-information.component';
import {MaterialModule} from '../../material/material.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {DirectivesModule} from '../../shared/directives/directives.module';

@NgModule({
  declarations: [
    ShopInformationComponent,
  ],
  imports: [
    CommonModule,
    CustomizationRoutingModule,
    FormsModule,
    MaterialModule,
    NgxPaginationModule,
    PipesModule,
    FlexLayoutModule,
    DirectivesModule,
    DigitOnlyModule
  ]
})
export class CustomizationModule { }
