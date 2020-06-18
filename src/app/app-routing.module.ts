import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './common/login/login.component';
import { PlanningResultsComponent } from './components/planning/planning-results/planning-results.component';
import { DispatchSchedularComponent } from './components/dispatch-scheduler/dispatch-schedular/dispatch-schedular.component';
import { ProcurementDashboardComponent } from './components/procurement/procurement-dashboard/procurement-dashboard.component';
import { VesselManagementComponent } from './components/vessel-management/vessel-management/vessel-management.component';
import { CharteringComponent } from './components/chartering/chartering/chartering.component';
import { ProcurementInputHssComponent } from './components/procurement/procurement-input-hss/procurement-input-hss.component';
import { VesselManagementPortalComponent } from './components/vessel-management/vessel-management-portal/vessel-management-portal.component';
import { CharteringDashboardComponent } from './components/chartering/chartering-dashboard/chartering-dashboard.component';
import { InboundDashboardComponent } from './components/inbound/inbound-dashboard/inbound-dashboard.component';
import { InboundlogsComponent } from './components/inbound/inboundlogs/inboundlogs.component';
import { InboundcalenderComponent } from './components/inbound/inboundcalender/inboundcalender.component';
import { FinancedashboardComponent } from './components/finance/financedashboard/financedashboard.component';
import { CharteringDatadisplayComponent } from './components/chartering/chartering-datadisplay/chartering-datadisplay.component';
import { TopManagementDashboardComponent } from './components/top-management/top-management-dashboard/top-management-dashboard.component';
import { PortDashboardComponent } from './components/port-activities/port-dashboard/port-dashboard.component';
import { LoginfrontComponent } from './common/loginfront/loginfront.component';
import { HomeComponent } from './common/home/home.component';
const routes: Routes = [
  { path: '', redirectTo: 'signin',  pathMatch: 'full'},
  { path: 'designplan-results', component: PlanningResultsComponent },
  { path: 'intelligencescheduler', component: DispatchSchedularComponent },
  { path: 'acquisition', component: ProcurementDashboardComponent },
  { path: 'vessel-portal', component: VesselManagementComponent },
  { path: 'chartering', component: CharteringDashboardComponent },
  { path: 'chartering/:id', component: CharteringComponent },
  { path: 'hss-update/:id', component: ProcurementInputHssComponent },
  { path: 'vessel-logistics/:id', component: VesselManagementPortalComponent },
  { path: 'logistic', component: InboundlogsComponent },
  { path: 'logisticdashboard', component: InboundDashboardComponent },
  { path: 'logisticcalender', component: InboundcalenderComponent },
  { path: 'financedashboard', component: FinancedashboardComponent },
  { path: 'chartering-details/:id', component: CharteringDatadisplayComponent },
  { path: 'top-manage', component: TopManagementDashboardComponent },
  { path: 'shippingdashboard', component: PortDashboardComponent },
  { path: 'designplan', component: LoginComponent },
  { path: 'signin', component: LoginfrontComponent },
  { path: 'home', component: HomeComponent },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: true, useHash: true })
  ],

  exports: [RouterModule]
})
export class AppRoutingModule {}
