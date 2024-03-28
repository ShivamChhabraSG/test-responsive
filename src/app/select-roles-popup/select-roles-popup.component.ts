import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { HomePageComponent } from '../home-page/home-page.component';
import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header.component';
import { Router } from '@angular/router';
import { LoginServiceService } from '../services/login-service.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';


export interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-select-roles-popup',
  templateUrl: './select-roles-popup.component.html',
  styleUrls: ['./select-roles-popup.component.css']
})
export class SelectRolesPopupComponent {
  selectedRole: number | undefined;
  rolesData: any = [];
  rolesFromLogin: any = [];
  validRoles:any = [];
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  constructor(private dialogRef: MatDialogRef<SelectRolesPopupComponent>,
    public dialog: MatDialog, private loginService: LoginServiceService,
    private router: Router) { }
  confirm_Order: boolean = true;
  display = false;

  closepopup() {

    this.dialogRef.close();

  }
  ngOnInit(): void {
    // this.selectRoles();
    let LoginRoles = sessionStorage.getItem("validRoles");
    this.rolesFromLogin = LoginRoles ? JSON.parse(LoginRoles) : null;
    console.log("RolesFromLOgin", this.rolesFromLogin);
  }


  closeconfirmorder() {
    this.confirm_Order = false;
  }


  cars = [
    { id: 1, name: 'Bank Checker', icon: '../../assets/image/bank-account 1.svg' },
    { id: 2, name: 'Bank Maker', icon: '../../assets/image/invoice 1.svg' },
    { id: 3, name: 'Inspector (AIO)', icon: '../../assets/image/001-inspection 1.svg' },
    { id: 4, name: 'Inspector (PIO)', icon: '../../assets/image/002-quality-control 1.svg' },
    { id: 4, name: 'Operations', icon: '../../assets/image/003-consolidation 1.svg' },
  ];
  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' }
  ];


  dashBoardScreen() {
    // this.display = true;
    // alert(this.selectedRole)
    if (this.selectedRole != undefined) {
      this.loginService.selectRole(this.selectedRole).subscribe((res: any) => {
        console.log("ROlesRsponse", res)
        if (res.success == true) {
          this.dialogRef.close();
          this.dialog.closeAll();
          let selectedRoleData = res;
          console.log("SelectedRole", selectedRoleData);
          sessionStorage.setItem("selectedRoleData", selectedRoleData)
          console.log("selectedRoleData",selectedRoleData)
          let rolesToken = res.token;
          sessionStorage.setItem("UserToken",rolesToken);
          console.log("RolesToken",rolesToken);
          const currentUrl = this.router.url;
         
          if(currentUrl === '/dashboard-screen') {
          window.location.reload();
          }
          else {
            this.router.navigate(['/dashboard-screen']);
          }
        }
      },
        (err: any) => {
          if (err.status === 401) {
            sessionStorage.setItem("RateAllowedPopup", err.error.message);
            sessionStorage.setItem("PopupMaitainance", "LogoutError");
            this.errordialog?.openDialog();
          } else {
            sessionStorage.setItem("RateAllowedPopup", err.error.message);
            sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
            this.errordialog?.openDialog();
          }
        }
      );
    }
    //To toggle the component
    // this.display = !this.display;
  }
}
