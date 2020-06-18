import { Pipe, PipeTransform, Injectable } from '@angular/core';
@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    const keys = [];
    // console.log(value);
    for (const key in value) {
      keys.push({ key: key, value: value[key] });
    }
    return keys;
  }
}
