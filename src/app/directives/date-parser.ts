import {
  NgbDateParserFormatter,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
// import {
//   isNumber,
//   toInteger,
//   padNumber
// } from '@ng-bootstrap/ng-bootstrap/util/util';
export abstract class NgbDateCustomParserFormatter<D> {
  abstract fromModel(value: D): NgbDateStruct; // from your model -> internal model
  abstract toModel(date: NgbDateStruct): D; // from internal model -> your mode
}
import * as moment from 'moment'; // add this 1 of 4

@Injectable()
export class NgbDateCustomParserFormatter1 extends NgbDateParserFormatter {
  public moment_now: any;
  readonly DT_FORMAT = 'DD-MM-YYYY';
  constructor() {
    super();
    this.moment_now = moment(); // add this 2 of 4
  }
  parse(value: string): NgbDateStruct {
    if (value) {
      value = value.trim();
      const mdt = moment(value, this.DT_FORMAT);
    }
    return null;
  }
  format(date: NgbDateStruct): string {
    if (!date) {
      return '';
    }
    const mdt = moment([date.year, date.month - 1, date.day]);
    if (!mdt.isValid()) {
      return '';
    }
    return mdt.format(this.DT_FORMAT);
  }
  //   parse(value: string): NgbDateStruct {
  //     if (value) {
  //       const dateParts = value.trim().split('/');
  //       if (dateParts.length === 1 && isNumber(dateParts[0])) {
  //         return { day: toInteger(dateParts[0]), month: null, year: null };
  //       } else if (
  //         dateParts.length === 2 &&
  //         isNumber(dateParts[0]) &&
  //         isNumber(dateParts[1])
  //       ) {
  //         return {
  //           day: toInteger(dateParts[0]),
  //           month: toInteger(dateParts[1]),
  //           year: null
  //         };
  //       } else if (
  //         dateParts.length === 3 &&
  //         isNumber(dateParts[0]) &&
  //         isNumber(dateParts[1]) &&
  //         isNumber(dateParts[2])
  //       ) {
  //         return {
  //           day: toInteger(dateParts[0]),
  //           month: toInteger(dateParts[1]),
  //           year: toInteger(dateParts[2])
  //         };
  //       }
  //     }
  //     return null;
  //   }

  //   format(date: NgbDateStruct): string {
  //     return date
  //       ? `${isNumber(date.day) ? padNumber(date.day) : ''}-${
  //           isNumber(date.month) ? padNumber(date.month) : ''
  //         }-${date.year}`
  //       : '';
  //   }
}
