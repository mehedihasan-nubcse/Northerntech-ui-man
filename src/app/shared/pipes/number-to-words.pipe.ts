import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) {
      return 'zero';
    }
    let words = '';
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const groups = ['thousand', 'million', 'billion', 'trillion'];
    let groupIndex = 0;
    do {
      const number = value % 1000;
      if (number !== 0) {
        const hundreds = Math.floor(number / 100);
        const tensAndOnes = number % 100;
        if (hundreds !== 0) {
          words = ones[hundreds] + ' hundred ' + words;
        }
        if (tensAndOnes < 10) {
          words = ones[tensAndOnes] + ' ' + words;
        } else if (tensAndOnes < 20) {
          words = teens[tensAndOnes - 10] + ' ' + words;
        } else {
          const tensDigit = Math.floor(tensAndOnes / 10);
          const onesDigit = tensAndOnes % 10;
          words = tens[tensDigit] + ' ' + ones[onesDigit] + ' ' + words;
        }
        if (groupIndex > 0) {
          words = groups[groupIndex - 1] + ' ' + words;
        }
      }
      value = Math.floor(value / 1000);
      groupIndex++;
    } while (value > 0);
    return words.trim();
  }

}
