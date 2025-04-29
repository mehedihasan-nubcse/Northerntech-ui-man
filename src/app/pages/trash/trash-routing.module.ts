import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductTrashComponent} from "./product-trash/product-trash.component";
import {PurchaseTrashComponent} from "./purchase-trash/purchase-trash.component";
import {SalesTrashComponent} from "./sales-trash/sales-trash.component";
import {OutStockTrashComponent} from "./out-stock-trash/out-stock-trash.component";


const routes: Routes = [
  {path: 'product-trash', component: ProductTrashComponent},
  {path: 'purchase-trash', component: PurchaseTrashComponent},
  {path: 'sales-trash', component: SalesTrashComponent},
  {path: 'out-stock-trash', component: OutStockTrashComponent},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrashRoutingModule {

}
