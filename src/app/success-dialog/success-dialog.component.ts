import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { UploadPopupComponent } from '../upload-popup/upload-popup.component';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css'],
})
export class SuccessDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private entityService: EntityScreenServiceService,
    public dialog: MatDialog
  ) {}

  closeDialog() {
    this.dialogRef.close();
    window.location.reload();
  }

  deleteClaimSettlement() {
    const {
      approvalAction,
      paymentDate,
      approvalDate,
      approveClaimAmts,
      refNo,
      refId,
    } = this.dialogData.additionalData;
    this.entityService
      .saveApprovalSettlementForSaveSubmitDel(
        refId,
        approvalAction,
        refNo,
        approvalDate,
        approveClaimAmts,
        paymentDate
      )
      .subscribe((res: any) => {
        if (res?.success == true) {
          this.dialogRef.close();
          const dialogRef = this.dialog.open(UploadPopupComponent, {
            data: {
              deletedSettlement: true,
              message: 'Claim Settlement Deleted Successfully',
            },
          });
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
