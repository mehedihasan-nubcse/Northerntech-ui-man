import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StatementListComponent} from './statement-list/statement-list.component';
import {SaleListComponent} from './sale-list/sale-list.component';

const routes: Routes = [
  {path: '', redirectTo: 'sale-statement', pathMatch: 'full'},
  {path: 'sale-statement', component: SaleListComponent},
  {path: 'account-statement', component: StatementListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatementRoutingModule { }
