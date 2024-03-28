import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value !== undefined && value !== null) {
      let number = Number(value).toFixed(2).toString();
      let afterPoint = '';
      if (number.indexOf('.') > 0) {
        afterPoint = number.substring(number.indexOf('.'), number.length);
      }
      number = Math.floor(Number(number)).toString();
      let lastThree = number.substring(number.length - 3);
      const otherNumbers = number.substring(0, number.length - 3);
      if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
      }
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    }
    return '';
  }

}
