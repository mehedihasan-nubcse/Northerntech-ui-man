import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NumberMinDigitPipe} from './number-min-digit.pipe';
import {SecToTimePipe} from './sec-to-time.pipe';
import {NumberToWordsPipe} from './number-to-words.pipe';
import {CurrencyPipe} from './currency.pipe';
import {DecimalPipe} from './decimal.pipe';
import {SortPipe} from './sort.pipe';


@NgModule({
  declarations: [
    NumberMinDigitPipe,
    SecToTimePipe,
    NumberToWordsPipe,
    CurrencyPipe,
    DecimalPipe,
    SortPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NumberMinDigitPipe,
    SecToTimePipe,
    NumberToWordsPipe,
    CurrencyPipe,
    DecimalPipe,
    SortPipe
  ]
})
export class PipesModule {
}
