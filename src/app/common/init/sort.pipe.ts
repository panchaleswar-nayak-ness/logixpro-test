import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(array: any[], property: string, reverse: boolean = false): any[] {
    if (!array || !property) {
      return array;
    }

    array.sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];

      if (aValue < bValue) {
        return reverse ? 1 : -1;
      } else if (aValue > bValue) {
        return reverse ? -1 : 1;
      } else {
        return 0;
      }
    });

    return array;
  }
}
