import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectRolesPopupComponent } from '../select-roles-popup/select-roles-popup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginServiceService } from '../services/login-service.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { AlertScreenComponent } from '../alert-screen/alert-screen.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { WarningAuthDialogComponent } from '../warning-auth-dialog/warning-auth-dialog.component';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.css']
})
export class LoginPopupComponent {
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  @ViewChild(WarningAuthDialogComponent) passwordChanged: WarningAuthDialogComponent | undefined;
  hide = true;
  protected aFormGroup!: FormGroup;
  siteKey: string = "6LfqAjEpAAAAADHg23ChxvP883YT383_JxaVI_pt";
  captchatoken: any;
  constructor(private dialogRef: MatDialogRef<LoginPopupComponent>,
    public dialog: MatDialog, private loginService: LoginServiceService, 
    private router: Router,private formBuilder: FormBuilder,private recaptchaV3Service: ReCaptchaV3Service) { }
  username: any;
  password: any;
  newpassword: any;
  confirmpassword: any;
  getcreatepasswordscreen: boolean = false;
  aftercreatepassword: boolean = false;
  loginscreen: boolean = false;
  againlogin: boolean = false;
  LeCode: any;
  UserId: any;
  loginData: any = [];
  ResetPassword: any;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordofuser: any;
  rolesData: any;
  validRoles: any = [];
  rolesLength: any;
  userToken: any;
  errorMessageloginFailed: any;
  errorMsg : boolean = false
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%^&*()_+\-=\[\]{};:'\\|,.<>\/?~]).{8,}$/;

  msgSuccess: any;
  showLoginorRole = {
    previous: true,
    current: false,
  }
  close() {
// this.dialog.closeAll();
    this.dialogRef.close();
  }
  //  login(){
  //   this.dialog.open(SelectRolesPopupComponent,{ panelClass: 'AddUsersSuccessPop', disableClose:true, hasBackdrop: true, backdropClass:'backdropBackground' });
  //   let data = {
  //     UserName: this.username,
  //     Password: this.password,
  //   }
  //   this.dialogRef.close();
  //  }
  // resolved(captchaResponse:any) {
  //   console.log(`Resolved captcha with response: ${captchaResponse}`);
  // }

  // onSubmit(): void {
  //   this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
  //     console.log(`Received reCAPTCHA token: ${token}`);
 
  //   });
  // }

  send(): void {
 
    this.recaptchaV3Service.execute('importantAction')
    .subscribe((token: string) => {
      this.captchatoken = token;
      this.login();
      console.log(`Token [${token}] generated`);
    });
  }

  createpassword() {
    this.dialog.open(LoginPopupComponent, { panelClass: 'AddUsersSuccessPop', disableClose: true, hasBackdrop: true, backdropClass: 'backdropBackground' });
    let data = {
      NewPassword: this.newpassword,
      ConfirmPassword: this.confirmpassword,
    }
    this.dialogRef.close();
  }
  showErrMg:boolean = false;
  ReEnterPassword(event:any) {
    console.log("Event",event)
    this.confirmpassword = event.target.value;
    // this.sanitizer.bypassSecurityTrustHtml(this.confirmpassword);
    console.log("ConfirmPass",this.confirmpassword)
    console.log("Pass",this.newpassword)
    if(this.confirmpassword !== this.newpassword) {
      this.showErrMg = true;
    }
    else {
      this.showErrMg = false;
    }
  }
  againloginscreen() {

    if (this.newpassword == this.confirmpassword) {
      // this.msgSuccess='Password matched successfully '
      // alert("Password Matched")
      this.loginService.resetPassword(this.UserId, this.confirmpassword).subscribe((res: any) => {
        if (res) {
          if(res.success === true) {
            sessionStorage.setItem("auth","true");
            this.passwordChanged?.openDialog();
            this.ResetPassword = res;
            this.loginscreen = true;
            this.getcreatepasswordscreen = false;
          }
          else if (res.success == false){
            this.errorMsg = true
            this.msgSuccess = res?.message
          }
        }
      },
        (err: any) => {
          alert(err.error.message)
          // this.msgSuccess = 'Password length must Greater than 8 and less than 25 Characters '

        }
      );
    }
    else {
      this.msgSuccess = "Password does not match"
      // alert("Password Doesn't Matched");
    }


  }

  forgotPassword() {
    this.dialog.open(ForgotPasswordComponent, { panelClass: 'AddUsersSuccessPop', disableClose: true, hasBackdrop: true, backdropClass: 'backdropBackground' });
    this.dialogRef.close();
  }
  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;

  }
  public toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;

  }
  ngOnInit(): void {
    // alert(this.document.location.origin);
    let item2 = sessionStorage.getItem('aftercreatepassword');
    this.UserId = sessionStorage.getItem("UserID")
    this.userToken = sessionStorage.getItem("UserToken");
    console.log("UserToken", this.userToken);
    console.log("UserrrrrId", this.UserId);
    if (item2 == 'aftercreatepassword') {
      this.getcreatepasswordscreen = false;
      this.loginscreen = true;
    }
    // alert(sessionStorage.getItem('getpassword'));
    let item = sessionStorage.getItem('getpassword');
    // sessionStorage.setItem('getpassword','createlogin')

    if (item == 'createpswrdscreen') {
      this.getcreatepasswordscreen = true;
      this.loginscreen = false;
    }
    if (item == 'createlogin') {
      this.loginscreen = true;
      this.getcreatepasswordscreen = false;
    }
    let item1 = sessionStorage.getItem('againlogin');
    if (item == 'nologin') {
      this.getcreatepasswordscreen = true;
      this.loginscreen = false;
    }
    if (item == 'login') {
      this.getcreatepasswordscreen = false;
      this.loginscreen = true;
    }
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });

  }
  // close() {

  //   this.dialogRef.close();
  // }
  login() {
    console.log(this.captchatoken);
    sessionStorage.setItem('captchatoken', this.captchatoken);
    if (this.username != undefined && this.username != '' && this.password != undefined && this.password != '') {
      let isLogout = false;
      sessionStorage.setItem("userName", this.username);
      sessionStorage.setItem("Password", this.password);
      sessionStorage.setItem("LeCode", this.LeCode)
      this.loginService.getloginDeatils(this.username, this.password,this.captchatoken,isLogout).subscribe((res: any) => {
        console.log("Response", res.length)

        if (res) {
          // sessionStorage.setItem("UserToken", res.token)
          sessionStorage.setItem("UserToken", res.token);
          sessionStorage.setItem("LoginUserIdd",res.userId);
          this.loginData = res.roles;
          console.log("Responseeeee",res)
          sessionStorage.setItem("RolesuserrId", JSON.stringify(this.loginData))
          sessionStorage.setItem("loginUserId",res.userId);
          console.log("Login Data", this.loginData);
          sessionStorage.setItem('token', res.token)
          let idleExpireyTime = res?.tokenExpirationTimeInMinutes;
          console.log("idleExpireyTime",idleExpireyTime);
          sessionStorage.setItem('tokenExpirationTimeInMinutes', JSON.stringify(idleExpireyTime));
          if (res.success === false) {
            // alert(res.message);
            sessionStorage.setItem("LoginUserIdd",res.userId);
            let messg = res.message;
            let checkResponseMsg = messg.includes('locked');
              if(checkResponseMsg === true) {
                sessionStorage.setItem("LoginPassWord","")
                sessionStorage.setItem("AccountLocked","AccountLocked")
                sessionStorage.setItem('errorMessage', messg);
                this.errordialog?.openDialog();
              }
              else {
                if (this.password === 'Welcome01') {
                  sessionStorage.setItem("AccountLocked", "");
                  sessionStorage.setItem("LoginPassWord", "LoginPassWord");
                  this.errordialog?.openDialog();
                }
                
                else {
                  sessionStorage.setItem("AccountLocked","")
                  sessionStorage.setItem("LoginPassWord","")
                  sessionStorage.setItem('errorMessage', JSON.stringify(messg));
                                    this.dialog.open(AlertScreenComponent, { panelClass: 'deactiveSuccessPop', disableClose: true, hasBackdrop: true, backdropClass: 'backdropBackground' });
                  return;
                }
              }
          }
          else {
            if (this.password === 'Welcome01') {
              sessionStorage.setItem("AccountLocked", "");
              sessionStorage.setItem("LoginPassWord", "LoginPassWord");
              this.errordialog?.openDialog();
            }
            else {
              this.loginService.getRoles(this.LeCode).subscribe((res: any) => {
                console.log("ROlesRsponse", res)
                if (res) {
                  this.rolesData = res;
                  sessionStorage.setItem("RolesArray", this.rolesData);
                  console.log("loginData",this.loginData);
                  this.validRoles = getValidRoles(this.loginData, this.rolesData)
                  this.rolesLength = this.validRoles.length;
                  this.dialogRef.close();
                  // this.RolesArray = validRoles;
                  console.log("Valid Roles", this.validRoles);
                  interface RoleData {
                    role: string;
                    roleCode: number;
                  }
  
                  function getValidRoles(rolesFromLogin: number[], rolesData: RoleData[]): RoleData[] {
                    const validRoles: RoleData[] = [];
                    for (const roleData of rolesData) {
                      if (rolesFromLogin && rolesFromLogin.includes(roleData.roleCode)) {
                        validRoles.push(roleData);
                      }
                    }
                    return validRoles;
                  }
                  console.log("ROlesLength2", this.rolesLength);
                  console.log("Valid Roles2", this.validRoles);
                  if (this.rolesLength > 1) {
                    sessionStorage.setItem("validRoles", JSON.stringify(this.validRoles))
                    this.dialogRef.close();
                    this.dialog.open(SelectRolesPopupComponent, { panelClass: 'AddUsersSuccessPop', disableClose: true, hasBackdrop: true, backdropClass: 'backdropBackground' });
                    this.dialogRef.close();
                  }
                  else {
                    sessionStorage.setItem("validRoles", JSON.stringify(this.validRoles));
                    this.dialogRef.close();
                    this.router.navigate(['/dashboard-screen']);
                  }
                }
              },
                (err: any) => {
                  // if (err.error.message == 'Login failed') {
                  //   alert("Login Failed! Incorrect Username or Password")
                  // }
                }
              );
            }
          }
        }
      },
        (err: any) => {
          if (err.error.message == 'Login failed') {
            this.errorMessageloginFailed = 'Login Failed! Incorrect Username or Password';
            // alert("Login Failed! Incorrect Username or Password")

          }
        }
      );

    }
  }
  selectRoles() {
    let LeCode = 4
  }
  // forgotPassword() {
  //   this.dialog.open(ForgotPasswordComponent, { panelClass: 'AddUsersSuccessPop', disableClose: true, hasBackdrop: true, backdropClass: 'backdropBackground' });
  //   this.dialogRef.close();
  // }

  onInput(event: any) {
    if (event.inputType === 'deleteContentBackward') {
      this.errorMsg = false;
    }
  }
}

