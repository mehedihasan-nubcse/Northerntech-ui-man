import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog-payout',
  templateUrl: './confirm-dialog-payout.component.html',
  styleUrls: ['./confirm-dialog-payout.component.scss']
})
export class ConfirmDialogPayoutComponent implements OnInit {
  sellerName: any

  constructor(public dialogRef: MatDialogRef<ConfirmDialogPayoutComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
    this.sellerName= this.data.sellerName
  }

  onConfirm(): void {

    console.log("salerName", this.sellerName)
    this.dialogRef.close({ sellerName: this.sellerName });
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }


}
