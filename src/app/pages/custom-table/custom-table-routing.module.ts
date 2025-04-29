import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomTableListComponent } from './custom-table-list/custom-table-list.component';
import { CustomTableComponent } from './custom-table.component';

const routes: Routes = [
  { path: '', component: CustomTableComponent },
  { path: 'custom-table-list', component: CustomTableListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomTableRoutingModule { }
