export interface CharteringdetailsInterface {
  total_alumina_req: string;
  alumina_req_P1: string;
  alumina_req_P2: string;
  total_lanjigarh_supply: string;
  alumina_lanjigarh_supply_p1: string;
  alumina_lanjigarh_supply_p2: string;
}
export class Charteringdetails implements CharteringdetailsInterface {
  public constructor(props?: CharteringdetailsInterface) {
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

  public static getRequestData(datava) {
    let header: any = [];
    const data: any = [];
    const i = 0;
    header = Object.keys(datava[0]);

    datava.forEach((element, index) => {
      const d = [];
      for (const j in element) {
        d.push({ [j]: element[j] });
      }

      data.push(d);
    });

    return { data: data, header: header };
  }
}
