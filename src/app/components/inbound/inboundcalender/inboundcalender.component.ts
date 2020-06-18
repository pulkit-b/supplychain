import { Component, OnInit } from '@angular/core';
import { VedantaService } from 'src/app/services/vedanta.service';
import { DatePipe, JsonPipe } from '@angular/common';
import * as $ from 'jquery';
@Component({
  selector: 'app-inboundcalender',
  templateUrl: './inboundcalender.component.html',
  styleUrls: ['./inboundcalender.component.css'],
  providers: [DatePipe]
})
export class InboundcalenderComponent implements OnInit {
  today = new Date();
  currentMonth = this.today.getMonth();
  currentYear = this.today.getFullYear();
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  public open = true;

  constructor(
    public vedentaService: VedantaService,
    private datePipe: DatePipe
  ) { }

  public calenderdata: any;
  public calenderdataplant: any;
  public calenderdatastock: any;
  public datesdatatoget: any;

  ngOnInit() {
    this.getdata();
  }

  getdata() {
    this.vedentaService.showLoader();
    let addedmonth = this.currentMonth + 1;
    let month = ('0' + addedmonth).slice(-2);
    let payload = {
      month: month,
      year: this.currentYear
    };
    this.vedentaService.inboundcalenderdata(payload).then(data => {
      //console.log(data);
      this.calenderdata = data['success'];
      this.calenderdataplant = data['success']['data']['plant_details'];
      this.calenderdatastock = data['success']['data']['stock'];
      //console.log(this.calenderdataplant, this.calenderdatastock);
      this.showCalendar(this.currentMonth, this.currentYear);
      this.vedentaService.hideLoader();
    });
  }

  toggleSidenav() {
    this.open = !this.open;
    //console.log(this.open);
  }

  next() {
    this.currentYear =
      this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
    this.currentMonth = (this.currentMonth + 1) % 12;
    this.getdata();
  }

  previous() {
    this.currentYear =
      this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
    this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
    this.getdata();
  }

  showCalendar(month, year) {
    const firstDay = new Date(year, month).getDay();
    const daysInMonth = 32 - new Date(year, month, 32).getDate();

    const tbl = document.getElementById('calendar-body'); // body of the calendar
    // tbl.style.width = '100%';
    // clearing all previous cells
    tbl.innerHTML = '';
    document.getElementById('monthAndYear').innerHTML =
      this.months[month] + ' ' + year;
    document.getElementById('monthAndYear').setAttribute('align', 'center');
    //console.log(this.months, daysInMonth, new Date(year, month));

    let alldates: any = [];

    // creating all cells
    let date = 1;
    let cellData = 0;
    for (let i = 0; i < 6; i++) {
      // creates a table row
      const row = document.createElement('tr');

      // creating individual cells, filing them up with data.
      let j = 0;
      for (j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          const cell = document.createElement('td');
          // const cellText = document.createTextNode('');
          const div = document.createElement('div');
          div.setAttribute('class', 'emptydiv')

          cell.appendChild(div);
          row.appendChild(cell);
        } else if (date > daysInMonth) {

          break;
        } else {
          //console.log(j)
          let monthdata = month + 1;
          this.datesdatatoget =
            year +
            '-' +
            ('0' + monthdata).slice(-2) +
            '-' +
            ('0' + date).slice(-2);
          alldates.push(
            year +
            '-' +
            ('0' + monthdata).slice(-2) +
            '-' +
            ('0' + date).slice(-2)
          );
          const cell = document.createElement('td');
          const cellText = document.createTextNode(`${date.toString()}`);
          const divdate = document.createElement('div');
          divdate.setAttribute('class', 'dotinboundcalender');
          divdate.innerHTML += `${date.toString()}`;
          let plantp1,
            plantp2,
            portp1,
            portp2,
            transitp1,
            transitp2,
            btaparrivalp1,
            btapdepp1,
            btaparrivalp2,
            btapdepp2,
            bulkerarrp1,
            bulkerarrp2,
            bulkerdepp1,
            bulkerdepp2,
            truckarrp1,
            truckarrp2,
            truckdepp1,
            truckdepp2 = '';
          if (this.calenderdatastock[this.datesdatatoget] != undefined) {
            if (
              this.calenderdatastock[this.datesdatatoget]['plant'] != undefined
            ) {
              plantp1 = this.calenderdatastock[this.datesdatatoget]['plant'][
                'p1'
              ];
              plantp2 = this.calenderdatastock[this.datesdatatoget]['plant'][
                'p2'
              ];
            } else {
              plantp1 = '';
              plantp2 = '';
            }
            if (
              this.calenderdatastock[this.datesdatatoget]['port'] != undefined
            ) {
              portp1 = this.calenderdatastock[this.datesdatatoget]['port'][
                'p1'
              ];
              portp2 = this.calenderdatastock[this.datesdatatoget]['port'][
                'p2'
              ];
            } else {
              portp1 = '';
              portp2 = '';
            }
            if (
              this.calenderdatastock[this.datesdatatoget]['transit'] !=
              undefined
            ) {
              transitp1 = this.calenderdatastock[this.datesdatatoget][
                'transit'
              ]['p1'];
              transitp2 = this.calenderdatastock[this.datesdatatoget][
                'transit'
              ]['p2'];
            } else {
              transitp1 = '';
              transitp2 = '';
            }
          } else {
            plantp1 = plantp2 = portp1 = portp2 = transitp1 = transitp2 = '';
          }

          if (this.calenderdataplant[this.datesdatatoget] != undefined) {
            if (
              this.calenderdataplant[this.datesdatatoget]['btap']['arrival'] !=
              undefined
            ) {
              btaparrivalp1 = this.calenderdataplant[this.datesdatatoget][
                'btap'
              ]['arrival']['p1'];
              btaparrivalp2 = this.calenderdataplant[this.datesdatatoget][
                'btap'
              ]['arrival']['p2'];
            } else {
              btaparrivalp1 = '';
              btaparrivalp2 = '';
            }
            if (
              this.calenderdataplant[this.datesdatatoget]['btap'][
              'departure'
              ] != undefined
            ) {
              btapdepp1 = this.calenderdataplant[this.datesdatatoget]['btap'][
                'departure'
              ]['p1'];
              btapdepp2 = this.calenderdataplant[this.datesdatatoget]['btap'][
                'departure'
              ]['p2'];
            } else {
              btapdepp2 = '';
              btapdepp1 = '';
            }
            if (
              this.calenderdataplant[this.datesdatatoget]['bulker'][
              'arrival'
              ] != undefined
            ) {
              bulkerarrp1 = this.calenderdataplant[this.datesdatatoget][
                'bulker'
              ]['arrival']['p1'];
              bulkerarrp2 = this.calenderdataplant[this.datesdatatoget][
                'bulker'
              ]['arrival']['p2'];
            } else {
              bulkerarrp2 = '';
              bulkerarrp1 = '';
            }
            if (
              this.calenderdataplant[this.datesdatatoget]['bulker'][
              'departure'
              ] != undefined
            ) {
              bulkerdepp1 = this.calenderdataplant[this.datesdatatoget][
                'bulker'
              ]['departure']['p1'];
              bulkerdepp2 = this.calenderdataplant[this.datesdatatoget][
                'bulker'
              ]['departure']['p2'];
            } else {
              bulkerdepp1 = '';
              bulkerdepp2 = '';
            }
            if (
              this.calenderdataplant[this.datesdatatoget]['truck']['arrival'] !=
              undefined
            ) {
              truckarrp1 = this.calenderdataplant[this.datesdatatoget]['truck'][
                'arrival'
              ]['p1'];
              truckarrp2 = this.calenderdataplant[this.datesdatatoget]['truck'][
                'arrival'
              ]['p2'];
            } else {
              truckarrp1 = '';
              truckarrp2 = '';
            }
            if (
              this.calenderdataplant[this.datesdatatoget]['truck'][
              'departure'
              ] != undefined
            ) {
              truckdepp1 = this.calenderdataplant[this.datesdatatoget]['truck'][
                'departure'
              ]['p1'];
              truckdepp2 = this.calenderdataplant[this.datesdatatoget]['truck'][
                'departure'
              ]['p2'];
            } else {
              truckdepp1 = '';
              truckdepp2 = '';
            }
          } else {
            btaparrivalp1 = btapdepp1 = btaparrivalp2 = btapdepp2 = bulkerarrp1 = bulkerarrp2 = bulkerdepp1 = bulkerdepp2 = truckarrp1 = truckarrp2 = truckdepp1 = truckdepp2 =
              '';
          }

          //  divdate.appendChild(cellText);
          const div = document.createElement('div');
          div.setAttribute('class', 'dateDiv')
          div.innerHTML = `<div class="dotinboundcalender">${(date).toString()}</div><table class="inboundcalendertable">
          <thead>
            <tr>
              <th class='text-left'>Stock</th>
              <th>P1</th>
              <th>P2</th>
            </tr>
          </thead>
          <tbody>
          <tr>
              <td  class='text-left'>Plant</td>
              <td>${plantp1}</td>
              <td>${plantp2}</td>
            </tr>
            <tr>
            <td  class='text-left'>Port</td>
            <td>${portp1}</td>
            <td>${portp2}</td>
          </tr>
          <tr>
          <td  class='text-left'>Transit</td>
          <td>${transitp1}</td>
          <td>${transitp2}</td>
        </tr>
          </tbody>
        </table>`;

          const divsectable = document.createElement('div');
          div.innerHTML += `<table class="inboundcalendertable">
          <thead>
            <tr>
              <th  class='text-left'>QTY</th>
              <th>
              <div class="text-center" style="margin-right: 0px;margin-left: 0px;">Loaded
              </div>
              <div class="row" style="margin-right: 0px;margin-left: 0px;">
              <div class="col-6" style="padding-right: 0px;padding-left: 0px;">P1</div>
              <div class="col-6" style="padding-right: 0px;padding-left: 0px;">P2</div>
              </div>
              </th>
              <th>
              <div class="text-center" style="margin-right: 0px;margin-left: 0px;">Reciept
              </div>
              <div class="row" style="margin-right: 0px;margin-left: 0px;">
              <div class="col-6" style="padding-right: 0px;padding-left: 0px;">P1</div>
              <div class="col-6" style="padding-right: 0px;padding-left: 0px;">P2</div>
              </div></th>
            </tr>
          </thead>
          <tbody>
          <tr>
              <td  class='text-left'>BOBSN</td>
              <td>
               <div class="row" style="margin-right: 0px;margin-left: 0px;">
              <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${btaparrivalp1}</div>
              <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${btaparrivalp2}</div>
              </div></td>
              <td>
               <div class="row" style="margin-right: 0px;margin-left: 0px;">
              <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${btapdepp1}</div>
              <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${btapdepp2}</div>
              </div></td>
            </tr>
            <tr>
            <td  class='text-left'>BULKER</td>
            <td>
            <div class="row" style="margin-right: 0px;margin-left: 0px;">
            <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${bulkerarrp1}</div>
            <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${bulkerarrp2}</div>
            </div>
            </td>
            <td>
            <div class="row" style="margin-right: 0px;margin-left: 0px;">
            <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${bulkerdepp1}</div>
            <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${bulkerdepp2}</div>
            </div>
            </td>
          </tr>
          <tr>
          <td  class='text-left'>Truck</td>
          <td>
           <div class="row" style="margin-right: 0px;margin-left: 0px;">
          <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${truckarrp1}</div>
          <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${truckarrp2}</div>
          </div>
          </td>
          <td>
          <div class="row" style="margin-right: 0px;margin-left: 0px;">
          <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${truckdepp1}</div>
          <div class="col-6" style="padding-right: 0px;padding-left: 0px;">${truckdepp2}</div>
          </div>
          </td>
        </tr>
          </tbody>
        </table>`;
          // if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
          //   cell.classList.add('bg-info');
          // } // color today's date
          // cell.appendChild(cellText);
          // cell.appendChild(divdate);
          cell.appendChild(div);
          // cell.appendChild(divsectable);
          row.appendChild(cell);
          date++;
        }

      }
 
      if (i === 4 && j > 0) {
        for (; j < 7; j++) {
          const cell = document.createElement('td');
          const div = document.createElement('div');
          div.setAttribute('class', 'emptydiv') 
          cell.appendChild(div);
          row.appendChild(cell);

        }
      }
      tbl.appendChild(row); // appending each row into calendar body.
    }
    let he = $('.dateDiv').height();
    $(".emptydiv").attr('style', 'height:' + he + 'px;')
  }
}
