export interface PlanningresultInterface {
  total_alumina_req: string;
  alumina_req_P1: string;
  alumina_req_P2: string;
  total_lanjigarh_supply: string;
  alumina_lanjigarh_supply_p1: string;
  alumina_lanjigarh_supply_p2: string;
  Import_qty_for_P1: string;
  Import_qty_for_P2: string;
  import_qty: string;
}
export class Planningresult implements PlanningresultInterface {
  public constructor(props?: PlanningresultInterface) {
    for (const prop in props) {
      if (prop) {
        this[prop] = props[prop];
      }
    }
  }
  public static cYear;
  public static nYear;
  public total_alumina_req: string;
  public alumina_req_P1: string;
  public alumina_req_P2: string;
  public total_lanjigarh_supply: string;
  public alumina_lanjigarh_supply_p1: string;
  public alumina_lanjigarh_supply_p2: string;
  public Import_qty_for_P1: string;
  public Import_qty_for_P2: string;
  public import_qty: string;
  public year: string;
  public currentquarter;

  public static getRequestData(data, cMonth, currentquarter, cDate, year, type) { 
    if (type.toLowerCase() == 'balco') {
      return this.getRequestDataBalco(data, cMonth, currentquarter, cDate, year)
    }
    const da: any = [];
    const a = this.getCurrentFiscalYear(year);

    const total_alumina_req = { total_alumina_req: {} };
    const alumina_req_P1 = { alumina_req_P1: {} };
    const alumina_req_P2 = { alumina_req_P2: {} };
    const total_lanjigarh_supply = { total_lanjigarh_supply: {} };
    const alumina_lanjigarh_supply_p1 = { alumina_lanjigarh_supply_p1: {} };
    const alumina_lanjigarh_supply_p2 = { alumina_lanjigarh_supply_p2: {} };
    const Import_qty_for_P1 = { Import_qty_for_P1: {} };
    const Import_qty_for_P2 = { Import_qty_for_P2: {} };
    const import_qty = { import_qty: {} };
    let j = 4;
    for (let i = 1; i <= 12; i++) {
      let fyear = this.cYear;
      if (i <= 3) {
        fyear = this.nYear;
      }

      alumina_req_P1['alumina_req_P1'][this.getMonthName(i) + ' ' + fyear] = 0;
      alumina_req_P2['alumina_req_P2'][this.getMonthName(i) + ' ' + fyear] = 0;
      total_alumina_req['total_alumina_req'][this.getMonthName(i) + ' ' + fyear] = 0;
      alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1'][this.getMonthName(i) + ' ' + fyear] = 0;
      alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2'][this.getMonthName(i) + ' ' + fyear] = 0;
      total_lanjigarh_supply['total_lanjigarh_supply'][this.getMonthName(i) + ' ' + fyear] = 0;
      Import_qty_for_P1['Import_qty_for_P1'][this.getMonthName(i) + ' ' + fyear] = 0;
      Import_qty_for_P2['Import_qty_for_P2'][this.getMonthName(i) + ' ' + fyear] = 0;
      import_qty['import_qty'][this.getMonthName(i) + ' ' + fyear] = 0;


      if (i % 3 === 0) {
        alumina_req_P1['alumina_req_P1']['Quarter' + j] = 0;
        alumina_req_P2['alumina_req_P2']['Quarter' + j] = 0;
        total_alumina_req['total_alumina_req']['Quarter' + j] = 0;
        alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1']['Quarter' + j] = 0;
        alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2']['Quarter' + j] = 0;
        total_lanjigarh_supply['total_lanjigarh_supply']['Quarter' + j] = 0;
        Import_qty_for_P1['Import_qty_for_P1']['Quarter' + j] = 0;
        Import_qty_for_P2['Import_qty_for_P2']['Quarter' + j] = 0;
        import_qty['import_qty']['Quarter' + j] = 0;

        if (j === 4) { j = 0; }
        j++;
      }
    }
    j = 4;
    data.forEach(element => {
      j = 4;
      for (let i = 1; i <= 12; i++) {
        if (i < cMonth + 1) {
        } else {
        }
        let fyear = this.cYear;
        if (i <= 3) {
          fyear = this.nYear;
        }
        if (i === parseInt(element.month)) {
          alumina_req_P1['alumina_req_P1'][this.getMonthName(i) + ' ' + fyear] = element.alumina_req_P1;
          alumina_req_P2['alumina_req_P2'][this.getMonthName(i) + ' ' + fyear] = element.alumina_req_P2;
          total_alumina_req['total_alumina_req'][this.getMonthName(i) + ' ' + fyear] = element.total_alumina_req;
          alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1'][this.getMonthName(i) + ' ' + fyear] = element.alumina_lanjigarh_supply_p1;
          alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2'][this.getMonthName(i) + ' ' + fyear] = element.alumina_lanjigarh_supply_p2;
          total_lanjigarh_supply['total_lanjigarh_supply'][this.getMonthName(i) + ' ' + fyear] = element.total_lanjigarh_supply;
          Import_qty_for_P1['Import_qty_for_P1'][this.getMonthName(i) + ' ' + fyear] = element.Import_qty_for_P1;
          Import_qty_for_P2['Import_qty_for_P2'][this.getMonthName(i) + ' ' + fyear] = element.Import_qty_for_P2;
          import_qty['import_qty'][this.getMonthName(i) + ' ' + fyear] = element.import_qty;

          alumina_req_P1['alumina_req_P1']['Quarter' + j] = parseFloat(alumina_req_P1['alumina_req_P1']['Quarter' + j]) + parseFloat(element.alumina_req_P1);
          alumina_req_P2['alumina_req_P2']['Quarter' + j] = parseFloat(alumina_req_P2['alumina_req_P2']['Quarter' + j]) + parseFloat(element.alumina_req_P2);
          total_alumina_req['total_alumina_req']['Quarter' + j] = parseFloat(total_alumina_req['total_alumina_req']['Quarter' + j]) + parseFloat(element.total_alumina_req);
          alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1']['Quarter' + j] = parseFloat(alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1']['Quarter' + j]) + parseFloat(element.alumina_lanjigarh_supply_p1);
          alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2']['Quarter' + j] = parseFloat(alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2']['Quarter' + j]) + parseFloat(element.alumina_lanjigarh_supply_p2);
          total_lanjigarh_supply['total_lanjigarh_supply']['Quarter' + j] = parseFloat(total_lanjigarh_supply['total_lanjigarh_supply']['Quarter' + j]) + parseFloat(element.total_lanjigarh_supply);
          Import_qty_for_P1['Import_qty_for_P1']['Quarter' + j] = parseFloat(Import_qty_for_P1['Import_qty_for_P1']['Quarter' + j]) + parseFloat(element.Import_qty_for_P1);
          Import_qty_for_P2['Import_qty_for_P2']['Quarter' + j] = parseFloat(Import_qty_for_P2['Import_qty_for_P2']['Quarter' + j]) + parseFloat(element.Import_qty_for_P2);
          import_qty['import_qty']['Quarter' + j] = parseFloat(import_qty['import_qty']['Quarter' + j]) + parseFloat(element.import_qty);

        }
        if (i % 3 === 0) {
          alumina_req_P1['alumina_req_P1']['Quarter' + j] = alumina_req_P1['alumina_req_P1']['Quarter' + j];
          alumina_req_P2['alumina_req_P2']['Quarter' + j] = alumina_req_P2['alumina_req_P2']['Quarter' + j];
          total_alumina_req['total_alumina_req']['Quarter' + j] = total_alumina_req['total_alumina_req']['Quarter' + j];
          alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1']['Quarter' + j] = alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1']['Quarter' + j];
          alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2']['Quarter' + j] = alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2']['Quarter' + j];
          total_lanjigarh_supply['total_lanjigarh_supply']['Quarter' + j] = total_lanjigarh_supply['total_lanjigarh_supply']['Quarter' + j];
          Import_qty_for_P1['Import_qty_for_P1']['Quarter' + j] = Import_qty_for_P1['Import_qty_for_P1']['Quarter' + j];
          Import_qty_for_P2['Import_qty_for_P2']['Quarter' + j] = Import_qty_for_P2['Import_qty_for_P2']['Quarter' + j];
          import_qty['import_qty']['Quarter' + j] = import_qty['import_qty']['Quarter' + j];

          if (j === 4) { j = 0; }
          j++;
        }
      }
    });

    const keys = [
      'alumina_req_P1',
      'alumina_req_P2',
      'total_alumina_req',
      'alumina_lanjigarh_supply_p1',
      'alumina_lanjigarh_supply_p2',
      'total_lanjigarh_supply',
      'Import_qty_for_P1',
      'Import_qty_for_P2',
      'import_qty'
    ];
    for (let i = 0; i < keys.length; i++) {
      eval(keys[i])[keys[i]] = this.sortData(eval(keys[i])[keys[i]]);
      da.push(eval(keys[i]));
    }

    return { data: da, keys: keys };
  }
  public static getRequestDataBalco(data, cMonth, currentquarter, cDate, year) { 
    const da: any = [];
    const a = this.getCurrentFiscalYear(year);

    const total_alumina_req_balco = { total_alumina_req_balco: {} };
    const total_lanjigarh_supply_balco = { total_lanjigarh_supply_balco: {} };
    const import_qty_balco = { import_qty_balco: {} };
    let j = 4;
    for (let i = 1; i <= 12; i++) {
      let fyear = this.cYear;
      if (i <= 3) {
        fyear = this.nYear;
      }

      total_alumina_req_balco['total_alumina_req_balco'][this.getMonthName(i) + ' ' + fyear] = 0;
      total_lanjigarh_supply_balco['total_lanjigarh_supply_balco'][this.getMonthName(i) + ' ' + fyear] = 0;
      import_qty_balco['import_qty_balco'][this.getMonthName(i) + ' ' + fyear] = 0;


      if (i % 3 === 0) {
        total_alumina_req_balco['total_alumina_req_balco']['Quarter' + j] = 0;
        total_lanjigarh_supply_balco['total_lanjigarh_supply_balco']['Quarter' + j] = 0;
        import_qty_balco['import_qty_balco']['Quarter' + j] = 0;

        if (j === 4) { j = 0; }
        j++;
      }
    }
    j = 4;
    data.forEach(element => {
      j = 4;
      for (let i = 1; i <= 12; i++) {
        if (i < cMonth + 1) {
        } else {
        }
        let fyear = this.cYear;
        if (i <= 3) {
          fyear = this.nYear;
        }
        //console.log(element)
        if (i === parseInt(element.month)) {
          total_alumina_req_balco['total_alumina_req_balco'][this.getMonthName(i) + ' ' + fyear] = element.total_alumina_req_balco;
          total_lanjigarh_supply_balco['total_lanjigarh_supply_balco'][this.getMonthName(i) + ' ' + fyear] = element.total_lanjigarh_supply_balco;
          import_qty_balco['import_qty_balco'][this.getMonthName(i) + ' ' + fyear] = element.import_qty_balco;

          total_alumina_req_balco['total_alumina_req_balco']['Quarter' + j] = parseFloat(total_alumina_req_balco['total_alumina_req_balco']['Quarter' + j]) + parseFloat(element.total_alumina_req_balco);
          total_lanjigarh_supply_balco['total_lanjigarh_supply_balco']['Quarter' + j] = parseFloat(total_lanjigarh_supply_balco['total_lanjigarh_supply_balco']['Quarter' + j]) + parseFloat(element.total_lanjigarh_supply_balco);
          import_qty_balco['import_qty_balco']['Quarter' + j] = parseFloat(import_qty_balco['import_qty_balco']['Quarter' + j]) + parseFloat(element.import_qty_balco);

        }
        if (i % 3 === 0) {
          total_alumina_req_balco['total_alumina_req_balco']['Quarter' + j] = total_alumina_req_balco['total_alumina_req_balco']['Quarter' + j];
          total_lanjigarh_supply_balco['total_lanjigarh_supply_balco']['Quarter' + j] = total_lanjigarh_supply_balco['total_lanjigarh_supply_balco']['Quarter' + j];
          import_qty_balco['import_qty_balco']['Quarter' + j] = import_qty_balco['import_qty_balco']['Quarter' + j];

          if (j === 4) { j = 0; }
          j++;
        }
      }
    });

    const keys = [
      'total_alumina_req_balco',
      'total_lanjigarh_supply_balco',
      'import_qty_balco'
    ];
    for (let i = 0; i < keys.length; i++) {
      eval(keys[i])[keys[i]] = this.sortData(eval(keys[i])[keys[i]]);
      da.push(eval(keys[i]));
    }

    return { data: da, keys: keys };
  }
  public static sortData(d) {
    const th = this;
    const ordered1 = {};
    const ordered = {};
    const j = 0;
    for (const [index, [key, value]] of Object.entries(Object.entries(d))) {
      if (parseInt(index) < 4) {
        if (key.indexOf('Quarter') >= 0) { ordered1[key] = Number(value).toFixed(2); }
        else { ordered1[key] = Number(value).toFixed(2); }
      } else {
        if (key.indexOf('Quarter') >= 0) { ordered[key] = Number(value).toFixed(2); }
        else { ordered[key] = Number(value).toFixed(2); }
      }
    }
    Object.assign(ordered, ordered1);
    return ordered;
  }

  public static getMonthName(name) {
    if (name === 1) { return 'Jan'; }
    if (name === 2) { return 'Feb'; }
    if (name === 3) { return 'Mar'; }
    if (name === 4) { return 'Apr'; }
    if (name === 5) { return 'May'; }
    if (name === 6) { return 'Jun'; }
    if (name === 7) { return 'Jul'; }
    if (name === 8) { return 'Aug'; }
    if (name === 9) { return 'Sep'; }
    if (name === 10) { return 'Oct'; }
    if (name === 11) { return 'Nov'; }
    if (name === 12) { return 'Dec'; }
  }

  public static getCurrentFiscalYear(year) {
    const today = new Date();
    // get current month
    const curMonth = today.getMonth();
    const fiscalYr = '';
    if (curMonth > 3) {
      //
      const nextYr1 = (parseInt(year) + 1).toString();
      this.cYear = year.toString();
      this.nYear = nextYr1;
    } else {
      const nextYr2 = year.toString();
      this.cYear = year.toString();
      this.nYear = nextYr2;
    }
    const q = [4, 1, 2, 3];
    return {
      quarter: q[Math.floor(curMonth / 3)],
      cYear: this.cYear,
      nYear: this.nYear
    };
  }

  public getMonthIndex(key: any) {
    if (key === 'Jan') { return 0; }
    if (key === 'Feb') { return 1; }
    if (key === 'Mar') { return 2; }
    if (key === 'Apr') { return 3; }
    if (key === 'May') { return 4; }
    if (key === 'Jun') { return 5; }
    if (key === 'Jul') { return 6; }
    if (key === 'Aug') { return 7; }
    if (key === 'Sep') { return 8; }
    if (key === 'Oct') { return 9; }
    if (key === 'Nov') { return 10; }
    if (key === 'Dec') { return 11; }
  }
}
