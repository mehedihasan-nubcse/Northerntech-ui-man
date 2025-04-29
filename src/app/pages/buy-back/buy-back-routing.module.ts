import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddBuyBackComponent} from "./add-buy-back/add-buy-back.component";
import {AllBuyBackComponent} from "./all-buy-back/all-buy-back.component";

const routes: Routes = [
  {path: '', redirectTo: 'buy-back', pathMatch: 'full'},
  {path: 'add-buy-back', component: AddBuyBackComponent},
  {path: 'edit-buy-back/:id', component: AddBuyBackComponent},
  {path: 'all-buy-back', component: AllBuyBackComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyBackRoutingModule { }
