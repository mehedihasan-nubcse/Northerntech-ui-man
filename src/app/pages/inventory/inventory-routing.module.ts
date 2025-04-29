import {AddCategoryComponent} from './category/add-category/add-category.component';
import {CategoryListComponent} from './category/category-list/category-list.component';
import {AddProductComponent} from './product/add-product/add-product.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProductListComponent} from './product/product-list/product-list.component';
import {BarcodeGenerateComponent} from './product/product-list/barcode-generate/barcode-generate.component';
import {PurchaseHistoryComponent} from "./purchase-history/purchase-history.component";
import {AddAttributeComponent} from './attribute/add-attribute/add-attribute.component';
import {AttributeListComponent} from './attribute/attribute-list/attribute-list.component';
import {ColorListComponent} from "./color/color-list/color-list.component";
import {AddColorComponent} from "./color/add-color/add-color.component";
import {SizeListComponent} from "./size/size-list/size-list.component";
import {AddSizeComponent} from "./size/add-size/add-size.component";
import {DamageHistoryComponent} from './damage-history/damage-history.component';
import {AddPresaleProductComponent} from './presale-product/add-presale-product/add-presale-product.component';
import {PresaleProductListComponent} from './presale-product/presale-product-list/presale-product-list.component';
import {ExpiredProductListComponent} from './product/expired-product-list/expired-product-list.component';
import {SubCategoryListComponent} from './sub-category/sub-category-list/sub-category-list.component';
import {AddSubCategoryComponent} from './sub-category/add-sub-category/add-sub-category.component';
import {InStockHistoryComponent} from "./in-stock-history/in-stock-history.component";
import {AllDetailsComponent} from "./all-details/all-details.component";
import {GraphComponent} from "../dashboard/graph/graph.component";
import {GroupProductComponent} from "./product/group-product/group-product.component";
import {
  GroupPurchaseHistoryComponent
} from "./purchase-history/group-purchase-history/group-purchase-history.component";
import {
  GroupOutStockHistoryComponent
} from "./damage-history/group-out-stock-history/group-out-stock-history.component";
import {OldProductListComponent} from "./product/old-product-list/old-product-list.component";

const routes: Routes = [
  {path: '', redirectTo: 'product-list', pathMatch: 'full'},
  {path: 'add-product', component: AddProductComponent},
  {path: 'edit-product/:id', component: AddProductComponent},
  {path: 'product-list', component: ProductListComponent},
  {path: 'product-list2', component: OldProductListComponent},
  {path: 'expired-product-list', component: ExpiredProductListComponent},
  {path: 'barcode', component: ProductListComponent},
  {
    path: 'add-presale-product',
    loadChildren: () => import('./presale-product/add-presale-product/add-presale-product.module').then(m => m.AddPresaleProductModule),
  },
  {path: 'edit-presale-product/:id', component: AddPresaleProductComponent},
  {path: 'presale-product-list', component: PresaleProductListComponent},
  {path: 'category-list', component: CategoryListComponent},
  {path: 'add-category', component: AddCategoryComponent},
  {path: 'edit-category/:id', component: AddCategoryComponent},
  {path: 'color-list', component: ColorListComponent},
  {path: 'add-color', component: AddColorComponent},
  {path: 'edit-color/:id', component: AddColorComponent},
  {path: 'size-list', component: SizeListComponent},
  {path: 'add-size', component: AddSizeComponent},
  {path: 'edit-size/:id', component: AddSizeComponent},
  {path: 'purchase-history', component: PurchaseHistoryComponent},
  {path: 'transfer-history', component: DamageHistoryComponent},
  {path: 'transfer-history/:id', component: DamageHistoryComponent},
  {path: 'in-stock-history/:id', component: InStockHistoryComponent},
  {path: 'barcode-generate/:id', component: BarcodeGenerateComponent},
  {path: 'attribute-list', component: AttributeListComponent},
  {path: 'add-attribute', component: AddAttributeComponent},
  {path: 'edit-attribute/:id', component: AddAttributeComponent},
  {path: 'sub-category-list', component: SubCategoryListComponent},
  {path: 'add-sub-category', component: AddSubCategoryComponent},
  {path: 'edit-sub-category/:id', component: AddSubCategoryComponent},
  {path: 'all-details/:id', component: AllDetailsComponent},
  {path: 'group-product/:id', component: GroupProductComponent},
  {path: 'group-purchase/:id', component: GroupPurchaseHistoryComponent},
  {path: 'group-out-stock/:id', component: GroupOutStockHistoryComponent},

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule {
}
