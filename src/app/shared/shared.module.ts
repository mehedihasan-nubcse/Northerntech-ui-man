import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SnackbarNotificationComponent} from './components/ui/snackbar-notification/snackbar-notification.component';
import {ConfirmDialogComponent} from './components/ui/confirm-dialog/confirm-dialog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {OutSideClickDirective} from './directives/out-side-click.directive';
import { SalesRecordConfirmDialogComponent } from './components/ui/sales-record-confirm-dialog/sales-record-confirm-dialog.component';
import {MaterialModule} from "../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ShopSelectDialogComponent} from "./dialog-view/shop-select-dialog/shop-select-dialog.component";
import { ConfirmDialogPayoutComponent } from './components/ui/confirm-dialog-payout/confirm-dialog-payout.component';


@NgModule({
  declarations: [
    SnackbarNotificationComponent,
    ConfirmDialogComponent,
    OutSideClickDirective,
    SalesRecordConfirmDialogComponent,
    ShopSelectDialogComponent,
    ConfirmDialogPayoutComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SnackbarNotificationComponent,
    ConfirmDialogComponent,
    OutSideClickDirective,
    ShopSelectDialogComponent,
  ],
  providers: []
})
export class SharedModule {
}
