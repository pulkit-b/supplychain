export interface RequestdataInterface {
  headcount: string;
  BU_SSU_Description: string;
}
export class Requestdata implements RequestdataInterface {
  public headcount: string;
  public BU_SSU_Description: string;
  public constructor(props?: RequestdataInterface) {
    for (const prop in props) {
      if (prop) {
        this[prop] = props[prop];
      }
    }
  }

  public static getOldList(data) {
    const dataResult = data.data;
    const dataColumns = data.column;
    const totalRecords = data.total_records;

    let a = [];
    a = dataResult.map(result => {
      return this.getRequestData(result);
    });
    const b = [];
    dataColumns.forEach((element, index) => {
      if (element == 'Bu Ssu') {
        b.push({
          name: element.toLowerCase().replace(/ /g, '_'),
          columnName: element.replace(' ', '/').toUpperCase()
        });
      } else {
        b.push({
          name: element.toLowerCase().replace(/ /g, '_'),
          columnName: element
        });
      }
    });

    //console.log(b);

    return { list: a, columns: b, totalRecords: totalRecords };
  }

  public static getRequestData(data) {
    let da: any = [];
    da = {
      position_id: data.Position_ID,
      effective_date: data.Effective_Date,
      status: data.Status,
      original_shadow_pid: data.Original_Shadow_PID,
      original_shadow_pid_description: data.Original_Shadow_PID_Description,
      legal_entity: data.Legal_Entity,
      bu_ssu: data.Bu_Ssu,
      lob_segment: data.Lob_Segment,
      vertical: data.Vertical,
      sub_vertical: data.Sub_Vertical,
      cost_center: data.Cost_Center,
      geozone: data.Geozone,
      facility: data.Facility,
      employee_class: data.Employee_Class,
      employee_type: data.Employee_Type,
      job_family: data.Job_Family,
      job_code: data.Job_Code,
      internal_specialization: data.Internal_Specialization,
      variable_pay_plan_type: data.Variable_Pay_Plan_Type,
      reporting_manager: data.Reporting_Manager,
      bu_hr_spoc: data.BU_HR_SPOC,
      action: data.Action,
      ticket: data.ticket_no
    };

    return da;
  }
}
