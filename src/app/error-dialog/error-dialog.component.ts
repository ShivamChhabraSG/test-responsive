import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent {
  @Output() claimPEvent = new EventEmitter<string>();
  show = false;
  PopupDelete: any | null;
  userId: any | null;
  unitCode: any | null;
  entityData: any | null;
  addRatePopupData: any | null;
  nrlmUpload: any | null;
  claimSaved:any | null;
  claimSuccess : any | null;
  deleteMessage: any | null;
  deleteSuccess: any | null;
 
  constructor(
    private router: Router,public dialog: MatDialog, private entityservice:EntityScreenServiceService
  ) {
    //  this.PopupDelete = sessionStorage.getItem('popupDelete');
    // console.log(this.PopupDelete);
  }
 
  ngOnInit(){
   //this.PopupDelete = sessionStorage.getItem('popupDelete');
  //  this.addRatePopupData =  sessionStorage.getItem("RateAllowedPopup");
  //  console.log(this.addRatePopupData);
  //  this.nrlmUpload =   sessionStorage.getItem("PopupMaitainance");
  //  console.log(this.nrlmUpload);
  }
  AccountLocked:any;
  AccountLockedMsg:any;
  loginSamePasswordPopup:any;
  openDialog() {
 
    this.PopupDelete = sessionStorage.getItem('popupDelete');
    this.addRatePopupData =  sessionStorage.getItem("RateAllowedPopup");
    this.nrlmUpload =   sessionStorage.getItem("PopupMaitainance");
    this.claimSaved = sessionStorage.getItem("ClaimsSaved")
    this.claimSuccess= sessionStorage.getItem("claimSaved")
    this.AccountLocked =  sessionStorage.getItem("AccountLocked");
    this.AccountLockedMsg =  sessionStorage.getItem('errorMessage');
    this.loginSamePasswordPopup = sessionStorage.getItem("LoginPassWord");
    this.deleteSuccess = sessionStorage.getItem("deleteSuccess");
    this.show = true;
      console.log("PopupData",this.claimSaved);
    console.log(this.nrlmUpload);
  }
  redirectDashboard(){
 this.dialog.closeAll();
 sessionStorage.removeItem("AccountLocked")
//  window.location.reload();
  }
  redirecttoResetPassword(){
    this.show = false;
    this.dialog.open(ForgotPasswordComponent, { panelClass: 'AddUsersSuccessPop', disableClose: true, hasBackdrop: true, backdropClass: 'backdropBackground' });
    sessionStorage.removeItem("LoginPassWord")
  }
  closeDialog() {
      this.show = false;
      sessionStorage.removeItem("PopupMaitainance")
      sessionStorage.removeItem("claimSaved");
      sessionStorage.removeItem("ClaimsSaved");
      sessionStorage.removeItem("AccountLocked");
      sessionStorage.removeItem("deleteSuccess");
      // window.location.reload();
      this.entityservice.refresh()
      if (this.nrlmUpload === 'deteleClaimSettlement') {
        this.router.navigate(['/claims-processing-screen'])
      }
  }
  closeErrorDialog() {
      this.show = false;
      sessionStorage.removeItem("PopupMaitainance");
      // window.location.reload();
      this.entityservice.refresh()
  }
 
  redirectEntity(){
    this.router.navigate(['/entity-screen']);
    sessionStorage.removeItem("PopupMaitainance")
  }
 
  redirectUser(){
    this.router.navigate(['/user-data']);
    sessionStorage.removeItem("PopupMaitainance")
  }
 
  redirectRate(){
    this.router.navigate(['/interest-rate-screen']);
    sessionStorage.removeItem("PopupMaitainance")
  }
 
  redirectHome(){
    this.show = false;
    this.router.navigate(['/home']);
    sessionStorage.removeItem("PopupMaitainance");
    this.claimPEvent.emit();
    window.sessionStorage.clear();
    window.sessionStorage.clear();
  }

  closeWarningPopup(){
    this.show = false;
    sessionStorage.removeItem("PopupMaitainance");
    window.location.reload();
  }
 
  redirectClaimsProccessing(){
    this.router.navigate(['/claims-processing-screen'])
    // sessionStorage.removeItem("RateAllowedPopup");
    sessionStorage.removeItem("PopupMaitainance");
    sessionStorage.removeItem("claimSaved");
    sessionStorage.removeItem("ClaimsSaved");
  }
  closeDeleteEntity(){
    this.show = false
    sessionStorage.removeItem("PopupMaitainance");
    this.entityservice.refresh()
  }
  closeEntityDialog(){
    this.show = false
    sessionStorage.removeItem("PopupMaitainance");
  }
}