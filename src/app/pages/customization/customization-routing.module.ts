import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShopInformationComponent} from './shop-information/shop-information.component';

const routes: Routes = [
  {path: '', redirectTo: 'shop-information', pathMatch: 'full'},
  {path: 'shop-information', component: ShopInformationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomizationRoutingModule {
}
