export interface DispatchschedularInterface {
  headcount: string;
  BU_SSU_Description: string;
}

export class Dispatchschedular implements DispatchschedularInterface {
  public static Vededels: any = [];
  public headcount: string;
  public BU_SSU_Description: string;

  public constructor(props?: DispatchschedularInterface) {
    for (const prop in props) {
      if (prop) {
        this[prop] = props[prop];
      }
    }
  }

  public static getDataValues(data, month, quarter, date, dataType) {
    const btap_list: any = [];
    const map = new Map();
    for (const item of data) {
      if (!map.has(item.BTAP_ID)) {
        map.set(item.BTAP_ID, true);
        btap_list.push({ id: item.BTAP_ID, name: item.BTAP_Name, supply: item.btap_supply });
      }
    }
    // ////console.log(dummyArray);
    const ad = this.totalVessales(this.getCurrentMonth(), btap_list, dataType);
    Dispatchschedular.Vededels = ad['data'];
    data.forEach((element, index) => {
      const d = element['datetime'].split('T');
      let nextdestionation;
      const useIndex = d[0].split('-');
      // let nextdestionation = element['next_destination'].charAt(0);
      let nextdestionationfullname = element['next_destination'];

      if (data[index + 1] !== undefined) {
        // nextdestionation = data[index + 1]['next_destination'].charAt(0);
        nextdestionationfullname = data[index + 1]['next_destination']

      }
      let widthobject = this.parseObjectTo(JSON.parse(element['summary']), element) ; 
      // let showName = this.showTitle(widthobject, element);
      Dispatchschedular.Vededels[element['BTAP_Name']]['Day' + useIndex[2]] = {
        supply: element['btap_supply'],
        status: element['BTAP_status'],
        Datetime: useIndex[0] + '-' + useIndex[1] + '-' + useIndex[2],
        remainingTimeofTrip: element['remainingTimeofTrip'],
        plantTimePrePost: element['post_time'] + element['plant_time'] + element['pre_time'],
        next_destination: widthobject.nextDestination != undefined ? widthobject.nextDestination.charAt(0) : '',
        next_destination_fullname: nextdestionationfullname,
        BTAP_Name: element['BTAP_Name'], 
        destination: widthobject.currentDestination != undefined ? widthobject.currentDestination.charAt(0) : '',
        Date: useIndex[2],
        summery: widthobject.main,
        totalWidth: widthobject.width,
        showName : (widthobject.currentDestination != undefined ? widthobject.currentDestination.charAt(0) : '') + "-" + (widthobject.nextDestination != undefined ? widthobject.nextDestination.charAt(0) : ''),
        

      };
    });
    console.log(Dispatchschedular.Vededels)
    return { data: Dispatchschedular.Vededels, keys: ad['keys'], supply: ad['supply'] };
  }

 

  public static parseObjectTo(objectd, element) {
    let a = []
    let totalDivwidth = 0
    let ndestination;
    let cdestination;
    let ppp = 0;
    Object.keys(objectd).forEach(function (key) {
      let width = (objectd[key]['part'] / 41) * 100
      // objectd[key]['part'] = width;
      a.push(objectd[key])
      totalDivwidth += width;


      if (objectd[key]['depot'] == 'pre_load' || objectd[key]['depot'] == 'plant_load' || objectd[key]['depot'] == 'post_load') {
        ppp += objectd[key]['part']
      }
    }); 
    if ((objectd[1]['depot'] == 'pre_load') && ppp > 0) {
      ndestination = element.next_destination;
      cdestination = objectd.plant_name;
    }
    else if ((objectd[2]['depot'] == 'pre_load') && ppp > 0 && (objectd[1]['depot'] != 'txr')) {
      ndestination = objectd.plant_name;
      cdestination = element.next_destination;
    }
    else if ((objectd[3]['depot'] == 'pre_load') && ppp > 0) {
      ndestination = objectd.plant_name;
      cdestination = element.next_destination;
    }
    else if ((objectd[1]['depot'] == 'tavel' || objectd[2]['depot'] == 'tavel' || objectd[4]['depot'] == 'tavel' || objectd[5]['depot'] == 'tavel' )  && (objectd[1]['part'] == 100)) {
      ndestination = element.next_destination;
      cdestination = element.next_destination;
    }
    else if ((objectd[1]['depot'] == 'tavel' || objectd[2]['depot'] == 'txr' )  && (objectd[1]['part'] < 100)) {
      ndestination = element.next_destination;
      cdestination = element.next_destination;
    }
    else if ((objectd[1]['depot'] == 'txr' || objectd[2]['depot'] == 'txr' || objectd[4]['depot'] == 'txr' || objectd[5]['depot'] == 'txr' )  && (objectd[1]['part'] == 100)) {
     
      ndestination = element.next_destination;
      cdestination = element.next_destination;
    }else if(objectd[1]['depot'] == 'txr' && (objectd[1]['part'] < 100)){
      ndestination = element.next_destination;
      cdestination = objectd.plant_name;
    }
    
    if(cdestination==0) cdestination = ""
    if(ndestination=='Out of Circuit') ndestination = ""
    return { 'main': a, 'width': { "depot": 'totalWidth', "part": totalDivwidth * 100 }, 'currentDestination': cdestination, 'nextDestination': ndestination }
    // return {'main':a, 'width':{"depot":'totalWidth',"part":totalDivwidth*100}}
  }

  public static totalWidth(currentIndex, nextIndex) {
    return ((((currentIndex['remainingTimeofTrip'] + (currentIndex['post_time'] + currentIndex['plant_time'] + currentIndex['pre_time'])) / 24) + (nextIndex !== undefined ? ((nextIndex['remainingTimeofTrip'] + (nextIndex['post_time'] + nextIndex['plant_time'] + nextIndex['pre_time'])) / 24) : 0)) * 41)

  }
  public static holdWidth(currentIndex, nextIndex) {
    let a = 0;
    let runningWidth = 0;
    let plantWidth = 0;
    let nextdayrunning = 0
    let planttime = currentIndex['post_time'] + currentIndex['plant_time'] + currentIndex['pre_time'];
    let nextplanttime = nextIndex != undefined ? nextIndex['post_time'] + nextIndex['plant_time'] + nextIndex['pre_time'] : 0;
    let currentRemaingingTrips = currentIndex['remainingTimeofTrip']
    let nextRemaingingTrips = nextIndex != undefined ? nextIndex['remainingTimeofTrip'] : 0
    // if(currentIndex['remainingTimeofTrip'] < 24 ) {

    // runningWidth =  (((20) / 24) * 41) / ((((20) / 24) * 41) + (((110.72) / 24) * 41))
    // plantWidth =   ((3.98 / 24) * 41) / (((3.98 / 24) * 41) + ((23.98 / 24) * 41))
    // nextdayrunning = (((110.72) / 24) *41) / ((((20) / 24) * 41) + (((110.72) / 24) * 41)) - ((3.98 / 24) * 41) / (((3.98 / 24) * 41) + ((23.98 / 24) * 41))

    // runningWidth =  (((currentRemaingingTrips) / 24) * 41) / ((((currentRemaingingTrips) / 24) * 41) + (((nextRemaingingTrips) / 24) * 41))
    // plantWidth =   ((planttime / 24) * 41) / (((planttime / 24) * 41) + ((nextplanttime / 24) * 41))
    // nextdayrunning = (((nextRemaingingTrips) / 24) *41) / ((((currentRemaingingTrips) / 24) * 41) + (((nextRemaingingTrips) / 24) * 41)) - ((planttime / 24) * 41) / (((planttime / 24) * 41) + ((nextplanttime / 24) * 41))

    plantWidth = nextplanttime / 24 * 100;
    runningWidth = currentRemaingingTrips / 24 * 100;
    let finalJson = { 'running': runningWidth, 'plantTime': plantWidth }
    if (nextIndex != undefined) {
      if (Math.round(planttime) >= 24) {
        finalJson = { 'plantTime': plantWidth, 'running': runningWidth }
      }
    }

    // runningWidth = (((currentIndex['remainingTimeofTrip'] * 24) / 41) / (((currentIndex['remainingTimeofTrip'] * 24) / 41) + (nextIndex!=undefined ? ((nextIndex['remainingTimeofTrip'] * 24) / 41) : 0) )));
    //   plantWidth =   (((planttime * 24) / 41) / (((planttime * 24) / 41) + nextIndex!=undefined ? ((nextplanttime * 24) / 41) : 0 ))) 
    //   nextdayrunning =  ((nextIndex!=undefined ? (((nextIndex['remainingTimeofTrip'] - nextplanttime)  * 24) / 41) : 0 ) /  ((((currentIndex['remainingTimeofTrip'] - planttime)  * 24) / 41) + (nextIndex!=undefined ? (((nextIndex['remainingTimeofTrip'] - nextplanttime)  * 24) / 41) : 0) ))
    // }
    // else if(currentIndex['remainingTimeofTrip'] > 24 ) {
    //     // (((item[JSObject.keys(item)[j+1]] ? ((item[JSObject.keys(item)[j+1]]['remainingTimeofTrip'] /24) * 41 ) : 0) / (((item[JSObject.keys(item)[j]]['remainingTimeofTrip'] /24) * 41 ) + (item[JSObject.keys(item)[j+1]] ? ((item[JSObject.keys(item)[j+1]]['remainingTimeofTrip'] /24) * 41 ) : 0)))*100)
    //   // plantWidth =  ((currentIndex['remainingTimeofTrip'] * 24) / 41) 
    //   plantWidth = (((currentIndex['remainingTimeofTrip'] * 24) / 41) / (((currentIndex['remainingTimeofTrip'] * 24) / 41) +  (nextIndex!=undefined ? ((nextIndex['remainingTimeofTrip'] * 24) / 41) : 0 ))))
    //   runningWidth =   (((nextplanttime * 24) / 41) / (((nextplanttime * 24) / 41) + nextIndex!=undefined ? ((planttime * 24) / 41) : 0 )))
    //   nextdayrunning =  ((nextIndex!=undefined ? (((nextIndex['remainingTimeofTrip'] - planttime)  * 24) / 41) : 0 ) /  ((((currentIndex['remainingTimeofTrip'] - nextplanttime)  * 24) / 41) + (nextIndex!=undefined ? (((nextIndex['remainingTimeofTrip'] - planttime)  * 24) / 41) : 0) ))
    // } 
    return finalJson
  }
  public static runningWidth(currentIndex, nextIndex) {
    let a = 0;
    //  a = ((   (  (nextIndex!==undefined ? ((nextIndex['remainingTimeofTrip'] + (nextIndex['post_time'] + nextIndex['plant_time'] + nextIndex['pre_time'])) / 24) : 0)  / (((currentIndex['remainingTimeofTrip'] - (currentIndex['post_time'] + currentIndex['plant_time'] + currentIndex['pre_time'])) / 24) + (nextIndex!==undefined ? ((nextIndex['remainingTimeofTrip'] + (nextIndex['post_time'] + nextIndex['plant_time'] + nextIndex['pre_time'])) / 24) : 0)) )) * 100)
    return a;
  }
  public static plantWidth(currentIndex, nextIndex) {
    let a = 0;
    // a = ((((nextIndex!==undefined ? ((nextIndex['remainingTimeofTrip'] - (nextIndex['post_time'] + nextIndex['plant_time'] + nextIndex['pre_time'])) / 24) : 0)  / (((currentIndex['remainingTimeofTrip'] - (currentIndex['post_time'] + currentIndex['plant_time'] + currentIndex['pre_time'])) / 24) + (nextIndex!==undefined ? ((nextIndex['remainingTimeofTrip'] + (nextIndex['post_time'] + nextIndex['plant_time'] + nextIndex['pre_time'])) / 24) : 0)) )) * 100)
    return a;
  }

  public static getCurrentMonth() {
    const date = new Date();
    // ////console.log(date.getMonth())
    const totalDays = this.daysInMonth(date.getMonth() + 1, date.getFullYear());
    // ////console.log(totalDays)
    return totalDays;
  }

  public static daysInMonth(iMonth, iYear) {
    return new Date(iYear, iMonth, 0).getDate();;
  }

  public static totalVessales(totalDays, btapList, dataType) {
    // ////console.log(totalDays, btapList.length);
    const ved = {};
    const keys: any = [];
    const supply: any = [];
    const btaplist = btapList.sort(function (a, b) {
      return parseInt(a.id) - parseInt(b.id);
    });

    for (let i: any = 1; i <= btaplist.length; i++) {
      const montObject = {};
      let k: any = 1;
      for (let j = 1; j <= totalDays; j++) {
        if (j <= 9) {
          k = '0' + j;
        } else {
          k = j;
        }
        montObject['Day' + k] = {};
      }
      Object.assign(ved, { [btaplist[i - 1].name]: montObject });
      keys.push([btaplist[i - 1].name]);
      supply.push([btaplist[i - 1].supply]);
    }
    // ////console.log(btaplist);
    // ////console.log({ data: ved, keys: keys });
    return { data: ved, keys: keys, supply: supply };
  }
}
