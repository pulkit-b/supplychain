import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dispatchschedular'
})
export class DispatchschedularPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const a = [];
    const v = [];
    value.forEach(element => {
      for (const key in element) {
        v.push(element[key]);
      }
    });
    // console.log(v);
    return v;
  }
}
