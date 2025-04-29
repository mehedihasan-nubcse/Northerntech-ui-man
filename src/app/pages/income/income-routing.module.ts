import { AddIncomeComponent } from './add-income/add-income.component';
import { IncomeListComponent } from './income-list/income-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'income-list', pathMatch: 'full'},
  {path: 'income-list', component: IncomeListComponent},
  {path: 'add-income', component: AddIncomeComponent},
  {path: 'edit-income/:id', component: AddIncomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomeRoutingModule { }
