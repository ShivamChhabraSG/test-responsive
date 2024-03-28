import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AddEntityServiceService } from '../services/add-entity-service.service';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { Router } from '@angular/router';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.css']
})
export class WarningDialogComponent implements OnInit {
  @Output() claimPEvent = new EventEmitter<string>();
  show = false;
  PopupDelete: any | null;
  userId: any | null;
  unitCode: any | null;
  entityData: any | null;
  selectedCellData: any | null;
  userStatus: any | null;
  selectedUserCellData: any;
  closedAccountId:any;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  constructor(
    private addEntityService: AddEntityServiceService,
    private http: EntityScreenServiceService,
    private entityService: EntityScreenServiceService,
    private router: Router,
    private SharedEntityService: SharedEntityServiceService,
    private addentityService: AddEntityServiceService,
    private spinner : NgxSpinnerService
  ) { 

  }

  ngOnInit(){
   //this.PopupDelete = sessionStorage.getItem('popupDelete');
    // this.userId = sessionStorage.getItem('UserId');
    this.unitCode = sessionStorage.getItem('UnitCode');
    this.entityData = sessionStorage.getItem('entityData');
    console.log(this.PopupDelete);
  }
  openDialog() {
    this.PopupDelete = sessionStorage.getItem('popupDelete');
    this.selectedCellData = sessionStorage.getItem('cellData');
    this.userId = sessionStorage.getItem('UserID');
    this.userStatus = sessionStorage.getItem('UserStatus');
    if (this.PopupDelete == 'UserUploadDeleted') {
      this.selectedUserCellData = sessionStorage.getItem('userUploadData');
      this.selectedUserCellData = JSON.parse(this.selectedUserCellData);
      console.log("SeletedUserData", this.selectedUserCellData)
    }
    this.selectedCellData = JSON.parse(this.selectedCellData)
      this.show = true;
  
  }
  
  closeDialog() {
      this.show = false;
      // window.location.reload();
  }

  deleteEntityData() {
    if (this.unitCode != '') {
      this.addEntityService.deleteEntityDataByUnitCode(this.unitCode).subscribe(
        (res: any) => {
          if ((res.success = true)) {
            let DeleteEntityData = res?.data;
            console.log('DeleteEntityDataResponse', DeleteEntityData);
            this.router.navigate(['/entity-screen']);
         
          } else {
            alert(res.message);
          }
        },
        (err: any) => {
          if (err.status === 401) {
            this.show = false
            sessionStorage.setItem("RateAllowedPopup", "Not a valid session");
            sessionStorage.setItem("PopupMaitainance", "LogoutError");
            this.errordialog?.openDialog();
          }
          else{
            this.show = false;
            sessionStorage.setItem("RateAllowedPopup",err.error.message);
            sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
            this.errordialog?.openDialog();
          }
        }
      );
    }
  }
  deleteUserData() {
    if (this.userId != '') {
      console.log(this.userId);
      this.addEntityService.deleteUserData(this.userId).subscribe(
        (res: any) => {
          console.log(res);
          if ((res.success = true)) {
            let DeleteEntityData = res?.data;
            console.log('DeleteEntityDataResponse', DeleteEntityData);
            this.router.navigate(['/user-data']);
            // this.dialogRef.close();
          } else {
            alert(res.message);
            console.log("response",res)
          }
        },
        (err: any) => {
          if (err.status === 401) {
            this.show = false
            sessionStorage.setItem("RateAllowedPopup", "Not a valid session");
            sessionStorage.setItem("PopupMaitainance", "LogoutError");
            this.errordialog?.openDialog();
          }
          else{
            this.show = false;
            sessionStorage.setItem("RateAllowedPopup",err.error.message);
            sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
            this.errordialog?.openDialog();
          }
        }
      );
    }
  }

  gobackUserScreen() {
    // this.router.navigate(['/add-user-data']);
    this.show = false;
  }

  DeleteEntityUpload() {
    this.spinner.show()
    this.addEntityService.DeleteUploadedFile(this.selectedCellData.entityDataStatusId).subscribe(
      (res: any) => {
        this.spinner.hide()
        console.log("Selected File Response:", res);
        if (res.success === true) {
          // this.router.navigate(['./entity-upload-screen'])
          // window.location.reload();
          this.show = false
          const message = "Deleted Successfully."
          sessionStorage.setItem("RateAllowedPopup",message);
          sessionStorage.setItem("PopupMaitainance",'deleteEntity');
          this.errordialog?.openDialog();
          this.SharedEntityService.filter('Register click')
        }
      },
      (err: any) => {
        if (err.status === 401) {
          this.show = false
          sessionStorage.setItem("RateAllowedPopup", "Not a valid session");
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        }
        else{
          this.show = false;
          sessionStorage.setItem("RateAllowedPopup",err.error.message);
          sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
          this.errordialog?.openDialog();
        }
      });
  }

  DeleteUserUpload() {
    this.addEntityService.delete(this.selectedUserCellData.userDataStatusId).subscribe((response: any) => {
      console.log(response);
      if (response.success == false) {
        this.router.navigate(['./user-upload'])
        window.location.reload();
        this.SharedEntityService.filter('Register click')
      }

    },
    (err: any) => {
      if (err.status === 401) {
        this.show = false
        sessionStorage.setItem("RateAllowedPopup", "Not a valid session");
        sessionStorage.setItem("PopupMaitainance", "LogoutError");
        this.errordialog?.openDialog();
      }
      else{
        this.show = false;
        sessionStorage.setItem("RateAllowedPopup",err.error.message);
        sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
        this.errordialog?.openDialog();
      }
    }
    );
  } 

  
  DeleteNRLMUpload() {
    sessionStorage.removeItem('popupDelete')
    let uploadShgCodesDataStatusId = sessionStorage.getItem('uploadShgCodesDataStatusId')
    this.entityService
      .DeleteuploadNrlm(uploadShgCodesDataStatusId)
      .subscribe(
        (res: any) => {
          if (res.success == true) {
            this.entityService.refresh()
            this.show= false;
            sessionStorage.setItem("deleteSuccess", "deleteSuccess");
            this.errordialog?.openDialog();
            // window.location.reload()
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          if (err.status === 401) {
            this.show = false
            sessionStorage.setItem("RateAllowedPopup", "Not a valid session");
            sessionStorage.setItem("PopupMaitainance", "LogoutError");
            this.errordialog?.openDialog();
          }
          else{
            this.show = false;
            sessionStorage.setItem("RateAllowedPopup",err.error.message);
            sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
            this.errordialog?.openDialog();
          }
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
            this.entityService.refresh()
            this.show= false;
            sessionStorage.setItem("deleteSuccess", "deleteSuccess");
            this.errordialog?.openDialog();
            // window.location.reload()
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          if (err.status === 401) {
            this.show = false
            sessionStorage.setItem("RateAllowedPopup", "Not a valid session");
            sessionStorage.setItem("PopupMaitainance", "LogoutError");
            this.errordialog?.openDialog();
          }
          else{
            this.show = false;
            sessionStorage.setItem("RateAllowedPopup",err.error.message);
            sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
            this.errordialog?.openDialog();
          }
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
          this.entityService.refresh()
          this.show= false;
          sessionStorage.setItem("deleteSuccess", "deleteSuccess");
          this.errordialog?.openDialog();
            // window.location.reload()
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          if (err.status === 401) {
            this.show = false
            sessionStorage.setItem("RateAllowedPopup", "Not a valid session");
            sessionStorage.setItem("PopupMaitainance", "LogoutError");
            this.errordialog?.openDialog();
          }
          else{
            this.show = false;
            sessionStorage.setItem("RateAllowedPopup",err.error.message);
            sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
            this.errordialog?.openDialog();
          }
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
            this.entityService.refresh()
            this.show= false
            // window.location.reload()
            sessionStorage.setItem("deleteSuccess", "deleteSuccess");
            this.errordialog?.openDialog();
          }
          console.log('uploadedfiles', res);
        },
        (err: any) => {
          if (err.status === 401) {
            this.show = false
            sessionStorage.setItem("RateAllowedPopup", "Not a valid session");
            sessionStorage.setItem("PopupMaitainance", "LogoutError");
            this.errordialog?.openDialog();
          }
          else{
            this.show = false;
            sessionStorage.setItem("RateAllowedPopup",err.error.message);
            sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
            this.errordialog?.openDialog();
          }
        }
      );
  }

  deleteClaimsProccessingData(){
    // this.router.navigate(['/claims-processing-screen']);
    this.claimPEvent.emit();
    this.show = false
    sessionStorage.removeItem('popupDelete')
    let message = "Claim Deleted Successfully"
    sessionStorage.setItem("RateAllowedPopup" , message );
        sessionStorage.setItem("PopupMaitainance" ,"deteleClaimSettlement");
        this.errordialog?.openDialog();
    // window.location.reload();

  }
  remarks: any;
  rejectEntity(){
    this.remarks = sessionStorage.getItem('EntityRemarks')

    let data= JSON.parse(sessionStorage.getItem('EntityCelldata')||"null")
    let Data ={
      unitCode: data.unit,
      currentStatus: data.status,
      remarks: this?.remarks,
      isReject: JSON.stringify(true)
  }
   
    this.addentityService.authorizeNdRejectEntity(Data).subscribe(
      (res: any) => {
        if ((res.success = true)) {
          let authorizeEntityData = res;
          this.show = false;
          const message = "Rejected Successfully."
          sessionStorage.setItem("RateAllowedPopup",message);
          sessionStorage.setItem("PopupMaitainance",'EntityRA');
          this.errordialog?.openDialog();
        //  this.router.navigate(['/entity-screen']);
        } else {
          alert(res.message);
        }
      },
      (err: any) => {
        if (err.status === 401) {
          this.show = false
          sessionStorage.setItem("RateAllowedPopup", "Not a valid session");
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        }
        else{
          this.show = false;
          sessionStorage.setItem("RateAllowedPopup",err.error.message);
          sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
          this.errordialog?.openDialog();
        }
      }
    );
  }
  closeEntityDialog(){
    this.show = false
  }
}
