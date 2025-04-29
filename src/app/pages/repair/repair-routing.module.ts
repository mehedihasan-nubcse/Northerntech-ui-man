import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RepairListComponent} from "./repair-list/repair-list.component";
import {AddRepairComponent} from "./add-repair/add-repair.component";
import {AllProblemComponent} from "./problem/all-problem/all-problem.component";
import {AddProblemComponent} from "./problem/add-problem/add-problem.component";
import {AddBrandComponent} from "./Brand/add-brand/add-brand.component";
import {AllBrandComponent} from "./Brand/all-brand/all-brand.component";
import {AllModelComponent} from "./model/all-model/all-model.component";
import {AddModelComponent} from "./model/add-model/add-model.component";

const routes: Routes = [
  {path: '', redirectTo: 'repair-list', pathMatch: 'full'},
  {path: 'repair-list', component: RepairListComponent},
  {path: 'add-repair', component: AddRepairComponent},
  {path: 'edit-repair/:id', component: AddRepairComponent},
  {path: 'problem-list', component: AllProblemComponent},
  {path: 'model-list', component: AllModelComponent},
  {path: 'add-model', component: AddModelComponent},
  {path: 'add-problem', component: AddProblemComponent},
  {path: 'edit-model/:id', component: AddModelComponent},
  {path: 'edit-problem/:id', component: AddProblemComponent},
  {path: 'edit-brand/:id', component: AddBrandComponent},
  {path: 'add-brand', component: AddBrandComponent},
  {path: 'brand-list', component: AllBrandComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepairRoutingModule { }
