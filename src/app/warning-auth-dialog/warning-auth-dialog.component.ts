import { Component, OnInit, ViewChild } from '@angular/core';
import { AddEntityServiceService } from '../services/add-entity-service.service';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { Router } from '@angular/router';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import { UserServiceService } from '../services/user-service.service';
import { DatePipe } from '@angular/common';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-warning-auth-dialog',
  templateUrl: './warning-auth-dialog.component.html',
  styleUrls: ['./warning-auth-dialog.component.css']
})
export class WarningAuthDialogComponent{
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  @ViewChild(WarningDialogComponent) deletedialog: WarningDialogComponent | undefined;

  show = false;
  PopupShown: any | null;
  userId: any | null;
  unitCode: any | null;
  entityData: any | null;
  auth: any | null;
  remarks:string=''

  constructor(
    private entityService: AddEntityServiceService,
    private router: Router,
    private userService: UserServiceService,
    private http: EntityScreenServiceService,
    private route: Router,
    public datepipe: DatePipe,
    private dialog : MatDialog
    
  ) { 
    //  this.auth = sessionStorage.getItem('auth');
     console.log(this.auth);
  }
  passwordChngd:any;
  ngOnInit(){
    this.userId = sessionStorage.getItem('UserId');
    this.unitCode = sessionStorage.getItem('UnitCode');
    this.entityData = sessionStorage.getItem('entityData');
    this.auth = sessionStorage.getItem("auth");
  //  this.auth = sessionStorage.getItem('auth');
  }
  openDialog() {
    this.auth = sessionStorage.getItem('auth');
    //authorizeData
    console.log('its hitting openDialog')
      this.show = true;
  }
  
  closeDialog() {
      this.show = false;
      if (this.auth == 'true') {
       this.dialog.closeAll()
       window.location.reload()
      }
  }
  closePasswordDialog(){
    this.show = false
    window.location.reload()
    this.dialog.closeAll()
  }

  Authorize(){
    let data= JSON.parse(sessionStorage.getItem('EntityCelldata')||"null")
    let Data ={
        unitCode: data.unit,
        currentStatus: data.status,
        remarks: this?.remarks,
        isReject: JSON.stringify(false)
    }
  
    this.entityService.authorizeNdRejectEntity(Data).subscribe(
      (res: any) => {
        console.log(res);
        if ((res.success = true)) {
          let authorizeEntityData = res;
          this.show = false;
          const message = "Authorised Successfully."
          sessionStorage.setItem("RateAllowedPopup",message);
          sessionStorage.setItem("PopupMaitainance",'EntityRA');
          this.errordialog?.openDialog();
         // this.router.navigate(['/entity-screen']);
        } else {
         // alert(res.message);
         sessionStorage.setItem("RateAllowedPopup",res.message);
         sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
         this.errordialog?.openDialog();
        }
      },
      (err: any) => {
        if (err.status === 401) {
          this.show = false;
          sessionStorage.setItem("RateAllowedPopup",err.error.message);
          sessionStorage.setItem("PopupMaitainance",'LogoutError');
          this.errordialog?.openDialog();
        } else {
          this.show = false;
          sessionStorage.setItem("RateAllowedPopup",err.error.message);
          sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
          this.errordialog?.openDialog();
        }
        //alert(err.error.message);
      }
    );
  }



  onReject(){
    this.show = false;
    sessionStorage.setItem("popupDelete", "rejectEntity");
    sessionStorage.setItem("EntityRemarks",this.remarks);
    this.deletedialog?.openDialog();

  //   console.log(this.remarks);
  //   let data= JSON.parse(sessionStorage.getItem('EntityCelldata')||"null")
  //   let Data ={
  //     unitCode: data.unit,
  //     currentStatus: data.status,
  //     remarks: this?.remarks,
  //     isReject: JSON.stringify(true)
  // }
   
  //   this.entityService.authorizeNdRejectEntity(Data).subscribe(
  //     (res: any) => {
  //       if ((res.success = true)) {
  //         let authorizeEntityData = res;
  //         this.show = false;
  //         const message = "Rejected Successfully."
  //         sessionStorage.setItem("RateAllowedPopup",message);
  //         sessionStorage.setItem("PopupMaitainance",'EntityRA');
  //         this.errordialog?.openDialog();
  //       //  this.router.navigate(['/entity-screen']);
  //       } else {
  //         alert(res.message);
  //       }
  //     },
  //     (err: any) => {
       
  //       alert(err.error.message);
  //     }
  //   );
  }

  remark:string=''
  sendRateUpdate(isReject: boolean) {
    let data = {
      userId: sessionStorage.getItem('UserID'),
      currentStatus:sessionStorage.getItem('UserStatus') ,
      remarks: this.remark,
      isReject: JSON.stringify(isReject),
    };
    console.log(data);
    this.userService.authorizeNdRejectUser(data).subscribe(
      (res: any) => {
        if ((res.success = true)) {
          this.show = false;
          let authorizeUserData = res?.data;
          let message;
          if(isReject){
            message = "Rejected Successfully."
          }else{
            message = "Authorised Successfully"
          }
          sessionStorage.setItem("RateAllowedPopup",message);
          sessionStorage.setItem("PopupMaitainance",'userRA');
          this.errordialog?.openDialog();
          console.log('authorizeUserDataResponse', authorizeUserData);
         // this.router.navigate(['/user-data']);
        } else {
          //alert(res.message);
          this.show = false;
          sessionStorage.setItem("RateAllowedPopup",res.message);
          sessionStorage.setItem("PopupMaitainance",'userRAError');
          this.errordialog?.openDialog();
        }
      },
      (err: any) => {
        if (err.status === 401) {
          this.show = false;
          sessionStorage.setItem("RateAllowedPopup",err.error.message);
          sessionStorage.setItem("PopupMaitainance",'LogoutError');
          this.errordialog?.openDialog();
        }
        else{
          console.log('ErrorMessage', err.error.message);
         // alert(err.error.message);
         this.show = false;
         sessionStorage.setItem("RateAllowedPopup",err.error.message);
         sessionStorage.setItem("PopupMaitainance",'userRAError');
         this.errordialog?.openDialog();
        }
      }
    );
  }

  Rateremarks: string = '';
  sendRaUpdate(isReject: boolean) {
    const celldata = JSON.parse(sessionStorage.getItem('UnitCodeRate') || 'null');
    let EffectiveDates = celldata.qtrEnding;
    EffectiveDates = this.datepipe.transform(EffectiveDates,'dd-MM-yyyy');
    const body = {
      unitCode: celldata.unitCode,
      status: celldata.status,
      effectiveDate: EffectiveDates,
      rateType: celldata.rateTypeId,
      remarks: this.Rateremarks,
      isReject: JSON.stringify(isReject),
    };
  
    this.http.UpdateRate(body).subscribe(
      (res: any) => {
        if (res.success === true) {
          this.show = false;
          let authorizeUserData = res?.data;
          let message: any;
          if(isReject){
            message = "Rejected Successfully."
          }else{
            message = "Authorised Successfully"
          }
          sessionStorage.setItem("RateAllowedPopup",message);
          sessionStorage.setItem("PopupMaitainance",'rateRA');
          this.errordialog?.openDialog();
          //this.route.navigate(['/interest-rate-screen']);
        } else if (res.success === false) {
          // alert(res.message);
          // this.route.navigate(['/interest-rate-screen']);
          this.show = false;
          sessionStorage.setItem("RateAllowedPopup",res.message);
          sessionStorage.setItem("PopupMaitainance",'rateRAError');
          this.errordialog?.openDialog();
        }
      },
      (err: any) => {
        if (err.status === 401) {
          this.show = false;
          sessionStorage.setItem("RateAllowedPopup",err.error.message);
          sessionStorage.setItem("PopupMaitainance",'LogoutError');
          this.errordialog?.openDialog();
        }
        else{
          this.show = false;
          sessionStorage.setItem("RateAllowedPopup",err.error.message);
          sessionStorage.setItem("PopupMaitainance",'rateRAError');
          this.errordialog?.openDialog();
        }
       // alert(err.error.message);
      }
    );
    // Reset the textarea value
     this.remarks = '';
  }
  

}
