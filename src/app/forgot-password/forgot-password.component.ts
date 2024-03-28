import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { LoginServiceService } from '../services/login-service.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  emailID: any;
  forgotPasswrd: any;
  getOTPdiv: boolean = true;
  otpValue: any;
  otpOutput: any;
  display: any;
  showorhidemsg: any;
  errorShow: boolean = true;
  otpShow: boolean = true;
  // otpshoworhide:any;
  ResendOtp: boolean = false;
  disableResend: boolean = false;
  otperror: any;
  isotperror: boolean = false;
  isEmailError: boolean = false;
  emailErrormsg: any;
  otpMessage: any;
  constructor(
    private dialogRef: MatDialogRef<ForgotPasswordComponent>,
    public dialog: MatDialog,
    private loginService: LoginServiceService
  ) {
    this.timer(3);
  }
  email(event: any) {
    this.emailID = event.target.value;
    console.log('email', this.emailID);
    if (this.emailID === '') {
      this.isEmailError = true;
    } else {
      this.isEmailError = false;
    }
  }

  forgotPassword() {
    if (this.emailID != undefined) {
      this.loginService.forgetpassword(this.emailID).subscribe(
        (res: any) => {
          console.log('Response', res);
          if (res) {
            this.forgotPasswrd = res.success;

            if (this.forgotPasswrd == true) {
              console.log('ForgotPassword', res);
              this.getOTPdiv = true;
              this.isEmailError = false;
              this.otpMessage = res?.message;
            }
            if (this.forgotPasswrd == false) {
              this.isEmailError = true;
              this.emailErrormsg = res?.message;
              this.otpMessage = res?.message;
              this.getOTPdiv = false;
            }
          }
        },
        (err: any) => {
          console.log('Errroorrr', err);
          this.isEmailError = true;
          this.emailErrormsg = err.error?.message;
          // alert(err.error.message);

          if (err.error.message == 'Wrong OTP') {
            this.otperror = 'Wrong OTP';
            // this.otpValue =''
          }
        }
      );
    }
  }
  closepopup() {
    this.dialogRef.close();
  }
  onOtpChange(event: any) {
    console.log('Eveentt', event);
    this.otpValue = event;
    console.log('OTPValue', this.otpValue);
    if (this.otpValue == '') {
      this.otpShow = true;
    } else {
      this.otpShow = false;
    }
    // this.dialog.open(LoginPopupComponent,{ panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass:'backdropBackground', disableClose:true})
  }
  onInput(event: any) {
    const inputValue = event.target.value.replace(/[^0-9]/g, '');
    event.target.value = inputValue;
    if (event.inputType === 'deleteContentBackward') {
      this.isotperror = false;
    }
  }
  //  getotpscreen(){
  //   this.getOTPdiv = false;

  //  }
  getcreatepasswrdscreen() {
    if (this.otpValue != undefined) {
      this.loginService.ValidateEmail(this.emailID, this.otpValue).subscribe(
        (res: any) => {
          console.log('Response', res);
          console.log('TokenResponse', res.token);
          if (res) {
            if (res.code == 0) {
              sessionStorage.setItem('getpassword', 'createpswrdscreen');
              sessionStorage.setItem('UserID', res.userId);
              sessionStorage.setItem('UserToken', res.token);
              this.dialog.open(LoginPopupComponent, {
                panelClass: 'AddUsersSuccessPop',
                hasBackdrop: true,
                backdropClass: 'backdropBackground',
                disableClose: true,
              });
              this.dialogRef.close();
            }
            if (res?.code == 1) {
              this.getOTPdiv = true;
              this.isEmailError = true;
              this.emailErrormsg = res?.message;
            }
            if (res.code == 2) {
              // alert(res.message)
              this.isotperror = true;
              this.otperror = res?.message;
            }
            console.log('OtPOutPut', this.otpOutput);
            // if( this.forgotPasswrd==true) {
            //   console.log("ForgotPassword",this.forgotPasswrd);
            //   this.getOTPdiv = false;
            // }
          }
        },
        (err: any) => {
          console.log('Errroorrr', err);
          // if (err.error.message == 'Login failed') {
          //   alert("Login Failed! Incorrect Username or Password")
          // }
        }
      );
    }
  }

  // const countdown$ = timer(0, 1000).pipe(
  //   take(300),
  //   map(secondsElapsed => 300 - secondsElapsed)
  // );

  // countdown$.subscribe(secondsLeft => {
  //   this.secondsLeft = secondsLeft;
  // });

  timer(minute: any) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log('finished');
        clearInterval(timer);
        this.ResendOtp = true;
      }
    }, 1000);
  }
  Resend() {
    this.disableResend = true;
    this.ResendOtp = false;
    this.loginService.forgetpassword(this.emailID).subscribe(
      (res: any) => {
        console.log('Response', res);
        if (res) {
          this.forgotPasswrd = res.success;
          if (this.forgotPasswrd == true) {
            console.log('ForgotPassword', this.forgotPasswrd);
            this.getOTPdiv = false;
          }
        }
      },
      (err: any) => {
        console.log('Errroorrr', err);
        alert(err.error.message);
      }
    );
    this.timer(3);
  }
}
