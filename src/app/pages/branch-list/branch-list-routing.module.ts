import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllBranchComponent} from "./all-branch/all-branch.component";
import {AddBranchComponent} from "./add-branch/add-branch.component";
import {AllBranchListComponent} from "./all-branch-list/all-branch-list.component";


const routes: Routes = [
  {path: '', redirectTo: 'branch-list', pathMatch: 'full'},
  {path: 'branch-list', component: AllBranchComponent},
  {path: 'all-branch-list', component: AllBranchListComponent},
  {path: 'add-branch', component: AddBranchComponent},
  {path: 'edit-branch/:id', component: AddBranchComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchListRoutingModule { }
