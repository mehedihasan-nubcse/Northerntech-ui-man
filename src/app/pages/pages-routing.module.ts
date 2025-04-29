import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckAuthAccessGuard } from '../auth-guard/check-auth-access.guard';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [CheckAuthAccessGuard]
      },
      {
        path: 'customization',
        loadChildren: () => import('./customization/customization.module').then(m => m.CustomizationModule),
        canActivate: [CheckAuthAccessGuard]
      },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      },
      {
        path: 'inventory',
        loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule),
      },
      {
        path: 'sales',
        loadChildren: () => import('./sales/sales.module').then(m => m.SalesModule),
      },
      {
        path: 'purchase',
        loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule),
      },
      {
        path: 'expense',
        loadChildren: () => import('./expense/expense.module').then(m => m.ExpenseModule),
      },
      {
        path: 'repair',
        loadChildren: () => import('./repair/repair.module').then(m => m.RepairModule),
      },
      {
        path: 'courier',
        loadChildren: () => import('./courier/courier.module').then(m => m.CourierModule),
      },
      {
        path: 'income',
        loadChildren: () => import('./income/income.module').then(m => m.IncomeModule),
      },
      {
        path: 'notes',
        loadChildren: () => import('./notes/notes.module').then(m => m.NotesModule),
      },
      {
        path: 'statement',
        loadChildren: () => import('./statement/statement.module').then(m => m.StatementModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
      },
      {
        path: 'gallery',
        loadChildren: () => import('./gallery/gallery.module').then(m => m.GalleryModule),
        // canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'admin-control',
        loadChildren: () => import('./admin-control/admin-control.module').then(m => m.AdminControlModule),
        // canActivate: [CheckAuthAccessGuard]
      },
      {
        path: 'custom-table',
        loadChildren: () => import('./custom-table/custom-table.module').then(m => m.CustomTableModule),
      },
      {
        path: 'buy-back',
        loadChildren: () => import('./buy-back/buy-back.module').then(m => m.BuyBackModule),
      },
      {
        path: 'branch-list',
        loadChildren: () => import('./branch-list/branch-list.module').then(m => m.BranchListModule),
      },
      {
        path: 'trash',
        loadChildren: () => import('./trash/trash.module').then(m => m.TrashModule),
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class PagesRoutingModule {
}
