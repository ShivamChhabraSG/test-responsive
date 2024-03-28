import { Component } from '@angular/core';
import { AddEntityServiceService } from '../services/add-entity-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';

@Component({
  selector: 'app-warning-popup',
  templateUrl: './warning-popup.component.html',
  styleUrls: ['./warning-popup.component.css'],
})
export class WarningPopupComponent {
  unitCode: any;
  Status: any;
  CommentText: any;
  PopupShown: any;
  rejectedStatus: any;
  CommentTextUser: any;
  userId: any;
  userStatus: any;
  celldata: any = [];
  showWarningWindow: boolean = false;
  checker: any = []
  maker: any = []
  showAuthorizeDialog: any;
  selectedCellData: any;
  userUploadStatus: any;
  selectedUserCellData: any;
  closedAccountId:any;
  constructor(
    private addEntityService: AddEntityServiceService,
    private http: EntityScreenServiceService,
    private entityService: EntityScreenServiceService,
    private router: Router,
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<WarningPopupComponent>,
    private SharedEntityService: SharedEntityServiceService
  ) { }
  ngOnInit() {
    this.unitCode = sessionStorage.getItem('UnitCode');
    this.Status = sessionStorage.getItem('Status');
    this.userId = sessionStorage.getItem('UserID');
    this.userStatus = sessionStorage.getItem('UserStatus');
    this.PopupShown = sessionStorage.getItem('popupShown');
    if (this.PopupShown == 'UserUploadDeleted') {
      this.selectedUserCellData = sessionStorage.getItem('userUploadData');
      this.selectedUserCellData = JSON.parse(this.selectedUserCellData);
      console.log("SeletedUserData", this.selectedUserCellData)
    }
    // sessionStorage.setItem("popupShown","UploadDeleted");
    this.selectedCellData = sessionStorage.getItem('cellData');
    this.selectedCellData = JSON.parse(this.selectedCellData)
    //  alert(this.PopupShown )
    this.rejectedStatus = sessionStorage.getItem('RejectedStatus');
    this.rejectedStatus = JSON.parse(this.rejectedStatus);
    //  alert(this.rejectedStatus);AuthorizedUser
    let storedUnitCode: any = sessionStorage.getItem('UnitCodeRate');
    this.celldata = JSON.parse(storedUnitCode);
    this.userUploadStatus = sessionStorage.getItem("UserDelete");
    console.log("SelectedCellData", this.selectedCellData)
  }
  deleteEntityData() {
    if (this.unitCode != '') {
      this.addEntityService.deleteEntityDataByUnitCode(this.unitCode).subscribe(
        (res: any) => {
          if ((res.success = true)) {
            let DeleteEntityData = res?.data;
            console.log('DeleteEntityDataResponse', DeleteEntityData);
            this.router.navigate(['/entity-screen']);
            this.dialogRef.close();
          } else {
            alert(res.message);
          }
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
          // alert(err.error.message);
          this.router.navigate(['/entity-screen']);
          this.dialogRef.close();
        }
      );
    }
  }
  deleteUserData() {
    if (this.userId != '') {
      this.addEntityService.deleteUserData(this.userId).subscribe(
        (res: any) => {
          if ((res.success = true)) {
            let DeleteEntityData = res?.data;
            console.log('DeleteEntityDataResponse', DeleteEntityData);
            this.router.navigate(['/user-data']);
            this.dialogRef.close();
          } else {
            alert(res.message);
            console.log("response",res)
          }
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
          // alert(err.error.message);
          this.router.navigate(['/entity-screen']);
          this.dialogRef.close();
        }
      );
    }
  }
  SaveauthorizeEntity() {
    if (this.PopupShown == 'authorized') {
      let data = {
        unitCode: this.unitCode,
        currentStatus: this.Status,
        remarks: this.CommentText,
        isReject: this.rejectedStatus,
      };
      this.addEntityService.authorizeNdRejectEntity(data).subscribe(
        (res: any) => {
          if ((res.success = true)) {
            let authorizeEntityData = res?.data;
            console.log('authorizeEntityDataResponse', authorizeEntityData);
            this.dialogRef.close();
            this.router.navigate(['/entity-screen']);
          } else {
            alert(res.message);
          }
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
          // alert(err.error.message);
          this.dialogRef.close();
        }
      );
    } else
      if (this.PopupShown == 'rateauthorized') {
        let rateAuthStatus: any = sessionStorage.getItem('rateAuthStatus');
        let Authstatus = JSON.parse(rateAuthStatus);
        let body = {
          unitCode: this.celldata.unitCode,
          status: this.celldata.status,
          effectiveDate: this.celldata.effectiveFromDate,
          rateType: this.celldata.rateTypeId,
          remarks: this.CommentText,
          isReject: Authstatus
        };
        console.log('Authresp', body);
        this.http.UpdateRate(body).subscribe(
          (res: any) => {
            console.log(res);
            if (res.success === true) {
              let authorizeRateData = res;
              console.log('authorizeRateDataResponse', authorizeRateData);
              this.dialogRef.close();
              this.showAuthorizeDialog = true; // Add this line to show the authorize dialog
              this.router.navigate(['/interest-rate-screen']);
            } else if (res.success === false) {
              this.showWarningWindow = true;
              this.PopupShown = 'rateauthorized_warning';
              // alert(res.message);
            }
          },
          (err: any) => {
            console.log('ErrorMessage', err.error.message);
            // alert(err.error.message);
            this.dialogRef.close();
          }
        );
      }

      // rate rejected
      else if (this.PopupShown == 'raterejected') {
        let raterejectedStatus: any = sessionStorage.getItem('rateRejectedStatus');
        let rejectedStatus = JSON.parse(raterejectedStatus);
        let body = {
          unitCode: this.celldata.unitCode,
          status: this.celldata.status,
          effectiveDate: this.celldata.effectiveFromDate,
          rateType: this.celldata.rateTypeId,
          remarks: this.CommentText,
          isReject: rejectedStatus,
        };
        console.log('cell resp', body);
        this.http.UpdateRate(body).subscribe(
          (res: any) => {
            if (res.success === true) {
              let authorizeRateData = res;
              console.log('authorizeRateDataResponse', authorizeRateData);
              this.dialogRef.close();
              this.router.navigate(['/interest-rate-screen']);
            } else if (res.success === false) {
              this.showWarningWindow = true;
              // alert(res.message);
            }
          },
          (err: any) => {
            console.log('ErrorMessage', err.error.message);
            // alert(err.error.message);
            this.dialogRef.close();
          }
        );
      }

  }
  commentText(event: any) {
    this.CommentText = event.target.value;
  }
  SaveauthorizeUser() {
    let data = {
      userId: this.userId,
      currentStatus: this.userStatus,
      remarks: this.CommentTextUser,
      isReject: this.rejectedStatus,
    };
    // this.addEntityService.authorizeNdRejectUser(data).subscribe(
    //   (res: any) => {
    //     if ((res.success = true)) {
    //       let authorizeUserData = res?.data;
    //       console.log('authorizeUserDataResponse', authorizeUserData);
    //       this.dialogRef.close();
    //       this.router.navigate(['/user-data']);
    //     } else {
    //       alert(res.message);
    //     }
    //   },
    //   (err: any) => {
    //     console.log('ErrorMessage', err.error.message);
    //     alert(err.error.message);
    //     this.dialogRef.close();
    //   }
    // );
  }
  commentTextWarning(event: any) {
    this.CommentTextUser = event.target.value;
  }
  gobackMain() {
    this.router.navigate(['/entity-screen']);
    this.dialogRef.close();
  }
  gobackUploadScreen() {
    this.router.navigate(['/entity-upload-screen']);
    this.dialogRef.close();
  }
  gobackUploadUserScreen() {
    this.router.navigate(['/nrlm-upload-screen']);
    this.dialogRef.close();
  }
  gobackUserScreen() {
    this.router.navigate(['/add-user-data']);
    this.dialogRef.close();
  }
  gobackClosedUploadScreen() {
    this.router.navigate(['/nrlm-upload-screen']);
    this.dialogRef.close();
  }
  closepopup() {
    this.dialogRef.close();
  }
  DeleteEntityUpload() {

    this.addEntityService.DeleteUploadedFile(this.selectedCellData.entityDataStatusId).subscribe(
      (res: any) => {
        console.log("Selected File Response:", res);
        if (res.success === true) {
          this.dialogRef.close();
          this.router.navigate(['./entity-upload-screen'])
          window.location.reload();
          this.SharedEntityService.filter('Register click')
        }
      },
      (err: any) => {
        if (err.error && err.error.message) {
          console.log("Error:", err.error.message);
        } else {
          console.log("Error:", err);
        }
      }
    );
  }
  DeleteUserUpload() {
    this.addEntityService.delete(this.selectedUserCellData.userDataStatusId).subscribe((response: any) => {
      console.log(response);
      if (response.success == false) {
        this.dialogRef.close();
        this.router.navigate(['./user-upload'])
        window.location.reload();
        this.SharedEntityService.filter('Register click')
      }

    },
      (err: any) => {
        if (err.error && err.error.message) {
          console.log("Error:", err.error.message);
        } else {
          console.log("Error:", err);
        }
      }
    );
  }

  DeleteNRLMUpload() {
    let uploadShgCodesDataStatusId = sessionStorage.getItem('uploadShgCodesDataStatusId')
    this.entityService
      .DeleteuploadNrlm(uploadShgCodesDataStatusId)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
            this.dialogRef.close();
            window.location.reload()
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
  }
  DeleteAccountsUpload() {
    let uploadAccountCodesDataStatusId = sessionStorage.getItem('uploadAccountsDataStatusId');
    this.entityService
      .DeleteuploadAccounts(uploadAccountCodesDataStatusId)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
            this.dialogRef.close();
            window.location.reload()
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
  }
  DeleteClosedAccountsUpload() {
    this.closedAccountId = sessionStorage.getItem("uploadClosedDataStatusId");
    this.entityService
      .DeleteCloseduploadAccounts(this.closedAccountId)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
            this.dialogRef.close();
            window.location.reload()
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
  }
  DeleteClaimsUpload() { 
    this.closedAccountId = sessionStorage.getItem("claimsDataStatusId");
    this.entityService
      .DeleteClaimsUpload(this.closedAccountId)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
            this.dialogRef.close();
            window.location.reload();
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          console.log('ErrorMessage', err.error.message);
        }
      );
  }
}
