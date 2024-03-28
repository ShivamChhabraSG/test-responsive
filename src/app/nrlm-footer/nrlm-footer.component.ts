import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { SelectRolesPopupComponent } from '../select-roles-popup/select-roles-popup.component';
import { LoginServiceService } from '../services/login-service.service';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
 
@Component({
  selector: 'app-nrlm-footer',
  templateUrl: './nrlm-footer.component.html',
  styleUrls: ['./nrlm-footer.component.css']
})
export class NRLMFooterComponent implements OnInit {
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  tokendetails:any[]=[];
  constructor( private service:EntityScreenServiceService,
    public dialog: MatDialog, private loginService: LoginServiceService, private router: Router , private spinner : NgxSpinnerService) { }
 
  selectRole(){
    this.dialog.open(SelectRolesPopupComponent, { panelClass: 'AddUsersSuccessPop', disableClose: true, hasBackdrop: true, backdropClass: 'backdropBackground' });
 
  }
   ngOnInit(): void {
    this.service.getTokenDetails().subscribe((res:any)=>{
      if (res.success === true) {
        this.tokendetails= Object([res.data])
        let LoginId= Object([res.data.userId])
        // console.log(this.tokendetails);
        sessionStorage.setItem("TokenDetals",JSON.stringify(res.data));
        sessionStorage.setItem('UserId',LoginId)
      }else if (res.success === false){
        console.log("footer comp.");
        sessionStorage.setItem("RateAllowedPopup", res.message);
        sessionStorage.setItem("PopupMaitainance", "LogoutError");
        this.errordialog?.openDialog();
       // alert(res.message)
      }
    },(err: any) => {
      this.spinner.hide()
      if (err.status === 401) {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "LogoutError");
        this.errordialog?.openDialog();
      } else {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
        this.errordialog?.openDialog();
      }
 
    })
   }
 
}
 