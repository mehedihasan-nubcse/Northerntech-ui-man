import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddCourierComponent} from "./add-courier/add-courier.component";
import {AllCourierComponent} from "./all-courier/all-courier.component";

const routes: Routes = [
  {path: '', redirectTo: 'all-courier', pathMatch: 'full'},
  {path: 'all-courier', component: AllCourierComponent},
  {path: 'add-courier', component: AddCourierComponent},
  {path: 'edit-courier/:id', component: AddCourierComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourierRoutingModule { }
