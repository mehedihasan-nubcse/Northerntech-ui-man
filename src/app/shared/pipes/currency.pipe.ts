import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'currencyIcon',
  pure: true
})
export class CurrencyPipe implements PipeTransform {

  transform(value: string): string {
    switch(value) {
      case 'BDT': {
        return  '৳'
      }
      case 'SGD': {
        return  'S$'
      }
      case 'Dollar': {
        return  '$'
      }
      default: {
        return '৳'
      }
    }
  }

}
