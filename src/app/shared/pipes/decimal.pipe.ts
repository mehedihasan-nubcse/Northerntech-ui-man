import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'decimal',
  pure: true
})
export class DecimalPipe implements PipeTransform {

  transform(value: number): number {

    const decimalValue = Number(value.toFixed(2));


    const spiltV = decimalValue.toString().split('.');

    let noDecimalV = Number(spiltV[0]);
    let newDecimalV = 0;

    // console.log('1- noDecimalV', noDecimalV);
    // console.log('1- newDecimalV', newDecimalV);


    if (spiltV.length && spiltV.length > 1) {
      const decimalP = Number(spiltV[1]);
      if (decimalP > 0 && decimalP <= 5) {
        newDecimalV = 5;
      } else if(decimalP > 5) {
        newDecimalV = 0
        noDecimalV += 1;
      } else {
        newDecimalV = 0
      }
    }

    // console.log('2- noDecimalV', noDecimalV);
    // console.log('2- newDecimalV', newDecimalV);

    const finalNum = noDecimalV + Number('.' + newDecimalV);
    // console.log('decimalValue', decimalValue)
    return decimalValue;

    // switch(value) {
    //   case 'BDT': {
    //     return  '৳'
    //   }
    //   case 'SGD': {
    //     return  'S$'
    //   }
    //   case 'Dollar': {
    //     return  '$'
    //   }
    //   default: {
    //     return '৳'
    //   }
    // }
  }

}
