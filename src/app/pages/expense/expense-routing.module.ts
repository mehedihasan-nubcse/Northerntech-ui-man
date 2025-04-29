import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'expense-list', pathMatch: 'full'},
  {path: 'expense-list', component: ExpenseListComponent},
  {path: 'add-expense', component: AddExpenseComponent},
  {path: 'edit-expense/:id', component: AddExpenseComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }
