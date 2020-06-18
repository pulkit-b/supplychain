export interface PlanningdataInterface {
  total_alumina_req: string;
  alumina_req_P1: string;
  alumina_req_P2: string;
  total_lanjigarh_supply: string;
  alumina_lanjigarh_supply_p1: string;
  alumina_lanjigarh_supply_p2: string;
}
export class Planningdata implements PlanningdataInterface {
  public constructor(props?: PlanningdataInterface) {
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
  public year: string;
  public currentquarter;

  public static getRequestData(data, cMonth, currentquarter, cDate) {
    const da: any = [];
    const a = this.getCurrentFiscalYear();

    const total_alumina_req = { total_alumina_req: {} };
    const alumina_req_P1 = { alumina_req_P1: {} };
    const alumina_req_P2 = { alumina_req_P2: {} };
    const total_lanjigarh_supply = { total_lanjigarh_supply: {} };
    const alumina_lanjigarh_supply_p1 = { alumina_lanjigarh_supply_p1: {} };
    // let month = { 'month': {} };
    const alumina_lanjigarh_supply_p2 = { alumina_lanjigarh_supply_p2: {} };

    const no_of_vessels = { no_of_vessels: {} };
    const total_no_of_trips_of_BTAP_lanji_needed = {
      total_no_of_trips_of_BTAP_lanji_needed: {}
    };
    const total_number_of_btap_for_KSPL = { total_number_of_btap_for_KSPL: {} };
    // let year = { 'year': {} };
    let j = 4;
    for (let i = 1; i <= 12; i++) {
      let fyear = this.cYear;
      if (i <= 3) {
        fyear = this.nYear;
      }
      total_alumina_req['total_alumina_req'][
        this.getMonthName(i) + ' ' + fyear
      ] = 0;
      alumina_req_P1['alumina_req_P1'][this.getMonthName(i) + ' ' + fyear] = 0;
      alumina_req_P2['alumina_req_P2'][this.getMonthName(i) + ' ' + fyear] = 0;
      total_lanjigarh_supply['total_lanjigarh_supply'][
        this.getMonthName(i) + ' ' + fyear
      ] = 0;
      alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1'][
        this.getMonthName(i) + ' ' + fyear
      ] = 0;
      // month['month'][this.getMonthName(i) + ' ' + fyear] = 0
      alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2'][
        this.getMonthName(i) + ' ' + fyear
      ] = 0;

      if (i % 3 == 0) {
        total_alumina_req['total_alumina_req']['Quarter' + j] = 0;
        alumina_req_P1['alumina_req_P1']['Quarter' + j] = 0;
        alumina_req_P2['alumina_req_P2']['Quarter' + j] = 0;
        total_lanjigarh_supply['total_lanjigarh_supply']['Quarter' + j] = 0;
        alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1'][
          'Quarter' + j
        ] = 0;
        // month['month']['Quarter' + j] = 0
        alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2'][
          'Quarter' + j
        ] = 0;

        if (j == 4) { j = 0; }
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
        if (i == parseInt(element.month)) {
          (total_alumina_req['total_alumina_req'][
            this.getMonthName(i) + ' ' + fyear
          ] = element.total_alumina_req),
            (alumina_req_P1['alumina_req_P1'][
              this.getMonthName(i) + ' ' + fyear
            ] = element.alumina_req_P1);
          alumina_req_P2['alumina_req_P2'][this.getMonthName(i) + ' ' + fyear] =
            element.alumina_req_P2;
          total_lanjigarh_supply['total_lanjigarh_supply'][
            this.getMonthName(i) + ' ' + fyear
          ] = element.total_lanjigarh_supply;
          alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1'][
            this.getMonthName(i) + ' ' + fyear
          ] = element.alumina_lanjigarh_supply_p1;
          alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2'][
            this.getMonthName(i) + ' ' + fyear
          ] = element.alumina_lanjigarh_supply_p2;

          total_alumina_req['total_alumina_req']['Quarter' + j] =
            parseFloat(total_alumina_req['total_alumina_req']['Quarter' + j]) +
            parseFloat(element.total_alumina_req);
          alumina_req_P1['alumina_req_P1']['Quarter' + j] =
            parseFloat(alumina_req_P1['alumina_req_P1']['Quarter' + j]) +
            parseFloat(element.alumina_req_P1);
          alumina_req_P2['alumina_req_P2']['Quarter' + j] =
            parseFloat(alumina_req_P2['alumina_req_P2']['Quarter' + j]) +
            parseFloat(element.alumina_req_P2);
          total_lanjigarh_supply['total_lanjigarh_supply']['Quarter' + j] =
            parseFloat(
              total_lanjigarh_supply['total_lanjigarh_supply']['Quarter' + j]
            ) + parseFloat(element.total_lanjigarh_supply);
          alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1'][
            'Quarter' + j
          ] =
            parseFloat(
              alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1'][
                'Quarter' + j
              ]
            ) + parseFloat(element.alumina_lanjigarh_supply_p1);

          alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2'][
            'Quarter' + j
          ] =
            parseFloat(
              alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2'][
                'Quarter' + j
              ]
            ) + parseFloat(element.alumina_lanjigarh_supply_p2);
        }
        if (i % 3 == 0) {
          total_alumina_req['total_alumina_req']['Quarter' + j] =
            total_alumina_req['total_alumina_req']['Quarter' + j];
          alumina_req_P1['alumina_req_P1']['Quarter' + j] =
            alumina_req_P1['alumina_req_P1']['Quarter' + j];
          alumina_req_P2['alumina_req_P2']['Quarter' + j] =
            alumina_req_P2['alumina_req_P2']['Quarter' + j];
          total_lanjigarh_supply['total_lanjigarh_supply']['Quarter' + j] =
            total_lanjigarh_supply['total_lanjigarh_supply']['Quarter' + j];
          alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1'][
            'Quarter' + j
          ] =
            alumina_lanjigarh_supply_p1['alumina_lanjigarh_supply_p1'][
              'Quarter' + j
            ];
          alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2'][
            'Quarter' + j
          ] =
            alumina_lanjigarh_supply_p2['alumina_lanjigarh_supply_p2'][
              'Quarter' + j
            ];
          if (j == 4) { j = 0; }
          j++;
        }
      }
    });

    const keys = [
      'total_alumina_req',
      'alumina_req_P1',
      'alumina_req_P2',
      'total_lanjigarh_supply',
      'alumina_lanjigarh_supply_p1',

      'alumina_lanjigarh_supply_p2'
    ];
    for (let i = 0; i < keys.length; i++) {
      eval(keys[i])[keys[i]] = this.sortData(eval(keys[i])[keys[i]]);
      da.push(eval(keys[i]));
    }

    //console.log(da);
    return { data: da, keys: keys };
  }

  public static sortData(d) {
    const th = this;
    const ordered1 = {};
    const ordered = {};
    const j = 0;
    for (const [index, [key, value]] of Object.entries(Object.entries(d))) {
      if (parseInt(index) < 4) {
        if (key.indexOf('Quarter') >= 0) { ordered1[key] = Number(value) / 3; }
        else { ordered1[key] = value; }
      } else {
        if (key.indexOf('Quarter') >= 0) { ordered[key] = Number(value) / 3; }
        else { ordered[key] = value; }
      }
    }
    Object.assign(ordered, ordered1);
    return ordered;
  }

  public static getMonthName(name) {
    if (name == 1) { return 'Jan'; }
    if (name == 2) { return 'Feb'; }
    if (name == 3) { return 'Mar'; }
    if (name == 4) { return 'Apr'; }
    if (name == 5) { return 'May'; }
    if (name == 6) { return 'Jun'; }
    if (name == 7) { return 'Jul'; }
    if (name == 8) { return 'Aug'; }
    if (name == 9) { return 'Sep'; }
    if (name == 10) { return 'Oct'; }
    if (name == 11) { return 'Nov'; }
    if (name == 12) { return 'Dec'; }
  }

  public static getCurrentFiscalYear() {
    const today = new Date();
    // get current month
    const curMonth = today.getMonth();
    const fiscalYr = '';
    if (curMonth > 3) {
      //
      const nextYr1 = (today.getFullYear() + 1).toString();
      this.cYear = today.getFullYear().toString();
      this.nYear = nextYr1;
    } else {
      const nextYr2 = today.getFullYear().toString();
      this.cYear = today.getFullYear().toString();
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
    if (key == 'Jan') { return 0; }
    if (key == 'Feb') { return 1; }
    if (key == 'Mar') { return 2; }
    if (key == 'Apr') { return 3; }
    if (key == 'May') { return 4; }
    if (key == 'Jun') { return 5; }
    if (key == 'Jul') { return 6; }
    if (key == 'Aug') { return 7; }
    if (key == 'Sep') { return 8; }
    if (key == 'Oct') { return 9; }
    if (key == 'Nov') { return 10; }
    if (key == 'Dec') { return 11; }
  }
}
