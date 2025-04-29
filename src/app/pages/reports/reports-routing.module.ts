import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StatementListComponent} from './statement-list/statement-list.component';
import {SaleListComponent} from './sale-list/sale-list.component';
import {ProductSaleDetailsComponent} from './product-sale-details/product-sale-details.component';
import {SaleRecordComponent} from './sale-record/sale-record.component';

const routes: Routes = [
  {path: '', redirectTo: 'sale-statement', pathMatch: 'full'},
  {path: 'sale-statement', component: SaleListComponent},
  {path: 'sale-record', component: SaleRecordComponent},
  {path: 'product-sale-details/:id', component: ProductSaleDetailsComponent},
  {path: 'account-statement', component: StatementListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
