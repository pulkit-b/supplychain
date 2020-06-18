import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { NgxPowerBiModule } from 'ngx-powerbi';
import { AppComponent } from './app.component';
import { LoginComponent } from './common/login/login.component';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ChartsModule } from 'ng2-charts';
import { VedantaService } from './services/vedanta.service';
import { KeysPipe } from './common/pipes/keys.pipes';
import { LeftpanelComponent } from './common/leftpanel/leftpanel.component';
import { PlanningResultsComponent } from './components/planning/planning-results/planning-results.component';
import { DispatchSchedularComponent } from './components/dispatch-scheduler/dispatch-schedular/dispatch-schedular.component';
import { DispatchschedularPipe } from './common/pipes/dispatchschedular.pipe';
import { ProcurementDashboardComponent } from './components/procurement/procurement-dashboard/procurement-dashboard.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { VesselManagementComponent } from './components/vessel-management/vessel-management/vessel-management.component';
import { CharteringComponent } from './components/chartering/chartering/chartering.component';
import { ProcurementInputHssComponent } from './components/procurement/procurement-input-hss/procurement-input-hss.component';
import { VesselManagementPortalComponent } from './components/vessel-management/vessel-management-portal/vessel-management-portal.component';
import { BasicvesseldetailsComponent } from './components/vessel-management/basicvesseldetails/basicvesseldetails.component';
import { ChartsComponent } from './components/chartering/charts/charts.component';
import { DocumentListComponent } from './components/planning/document-list/document-list.component';
import { DispatchPopupComponent } from './components/dispatch-scheduler/dispatch-popup/dispatch-popup.component';
import { CharteringDashboardComponent } from './components/chartering/chartering-dashboard/chartering-dashboard.component';
import { ChartCharteringComponent } from './components/chartering/chart-chartering/chart-chartering.component';
import { PortActivitiesComponent } from './components/port-activities/port-activities/port-activities.component';
import { InboundDashboardComponent } from './components/inbound/inbound-dashboard/inbound-dashboard.component';
import { InboundlogsComponent } from './components/inbound/inboundlogs/inboundlogs.component';
import { InboundcalenderComponent } from './components/inbound/inboundcalender/inboundcalender.component';
import { FinancedashboardComponent } from './components/finance/financedashboard/financedashboard.component';
import { CharteringDatadisplayComponent } from './components/chartering/chartering-datadisplay/chartering-datadisplay.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { RouterExtService } from './services/routerext.service';
import { TopManagementDashboardComponent } from './components/top-management/top-management-dashboard/top-management-dashboard.component';
import { PortDashboardComponent } from './components/port-activities/port-dashboard/port-dashboard.component';
import { ErrorModalComponent } from './common/error-modal/error-modal.component';
import { LoginfrontComponent } from './common/loginfront/loginfront.component';
import { HomeComponent } from './common/home/home.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    KeysPipe,
    LeftpanelComponent,
    PlanningResultsComponent,
    DispatchSchedularComponent,
    DispatchschedularPipe,
    ProcurementDashboardComponent,
    VesselManagementComponent,
    CharteringComponent,
    ProcurementInputHssComponent,
    VesselManagementPortalComponent,
    ChartsComponent,
    BasicvesseldetailsComponent,
    DocumentListComponent,
    DispatchPopupComponent,
    CharteringDashboardComponent,
    ChartCharteringComponent,
    PortActivitiesComponent,
    InboundDashboardComponent,
    InboundlogsComponent,
    InboundcalenderComponent,
    FinancedashboardComponent,
    CharteringDatadisplayComponent,
    NavbarComponent,
    TopManagementDashboardComponent,
    PortDashboardComponent,
    ErrorModalComponent,
    LoginfrontComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxPowerBiModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    NgMultiSelectDropDownModule.forRoot(),
    ChartsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  entryComponents: [PortActivitiesComponent, DispatchPopupComponent],
  providers: [VedantaService,RouterExtService],

  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private routerExtService: RouterExtService){}
}
