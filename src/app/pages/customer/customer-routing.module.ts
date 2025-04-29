
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerComponent } from './customer.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CustomerSalesReportComponent} from './customer-sales-report/customer-sales-report.component';

const routes: Routes = [
  {path: '', component: CustomerComponent},
  {path: 'customer-list', component: CustomerListComponent},
  {path: 'add-customer', component: AddCustomerComponent},
  {path: 'customer-report/:id', component: CustomerSalesReportComponent},
  {path: 'edit-customer/:id', component: AddCustomerComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
