import { Injectable } from '@angular/core';

@Injectable()
export class AppGlobals {
  readonly baseAppUrl: string = 'http://localhost:57431/';
  readonly baseAPIUrl: string = 'https://api.github.com/';
  public newcockpit: boolean = false;
  Formatter = function(x) {
    // console.log(x)
    if (x >= 0) {
      var num = Math.round(x);
      if (num > 1000 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'
      } else if (num > 1000000 && num < 1000000000) {
        return (num / 1000000).toFixed(1) + 'M'
      } else {
        return num.toFixed(1)
      }
    } else {
      x = x * (-1)
      var num = Math.round(x);
      if (num > 1000 && num < 1000000) {
        return '-' + (num / 1000).toFixed(1) + 'K'
      } else if (num > 1000000 && num < 1000000000) {
        return '-' + (num / 1000000).toFixed(1) + 'M'
      } else {
        return '-' + num.toFixed(1)
      }
    }
  }
  roundTo = function(n, digits) {
    var negative = false;
    if (digits === undefined) {
      digits = 0;
    }
    if (n < 0) {
      negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(digits);
    if (negative) {
      n = (n * -1).toFixed(digits);
    }
    return n;
  }
  isObjectEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }
}
