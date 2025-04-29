import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PreOrderAddComponent} from "./pre-order/pre-order-add/pre-order-add.component";
import {PreOrderListComponent} from "./pre-order/pre-order-list/pre-order-list.component";
import {PointComponent} from './point/point.component';
import {SaleListComponent} from './sale/sale-list/sale-list.component';
import {NewSalesComponent} from './sale/new-sales/new-sales.component';
import {SaleReturnComponent} from './sale-returns/sale-return/sale-return.component';
import {SaleReturnListComponent} from './sale-returns/sale-return-list/sale-return-list.component';
import {NewSaleReturnComponent} from './sale-returns/new-sale-return/new-sale-return.component';
import {ProductReturnComponent} from "./sale/product-return/product-return.component";

const routes: Routes = [
  {path: '', redirectTo: 'sales-list', pathMatch: 'full'},
  {path: 'sales-list', component: SaleListComponent},
  {path: 'new-sales', component: NewSalesComponent},
  {path: 'product-return', component: ProductReturnComponent},
  {path: 'new-sales/:id', component: NewSalesComponent},
  {path: 'sale-return', component: SaleReturnComponent},
  {path: 'sale-return/:id', component: SaleReturnComponent},
  {path: 'sale-return-list', component: SaleReturnListComponent},
  {path: 'pre-order', component: PreOrderAddComponent},
  {path: 'pre-order/:id', component: PreOrderAddComponent},
  {path: 'pre-order-list', component: PreOrderListComponent},
  {path: 'point', component: PointComponent},
  {path: 'new-sale-return', component: NewSaleReturnComponent},
  {path: 'new-sale-return/:id', component: NewSaleReturnComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
