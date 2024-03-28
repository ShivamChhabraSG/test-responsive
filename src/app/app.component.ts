import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isDevMode } from '@angular/core';
import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LogoutServiceService } from './services/logout-service.service';
import { SidenavBarComponent } from './sidenav-bar/sidenav-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NRLM-Project';
  previousURL:any;
  currentURL = '';
  tokenExpiryTime : any;
  idleState : boolean = false;
  token: any;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  @ViewChild(SidenavBarComponent) sidenavComponent: SidenavBarComponent | undefined;
  private destroy$ = new Subject<void>();
  constructor(public router: Router , private idle: Idle, private keepalive: Keepalive ,private cdr : ChangeDetectorRef ,private logoutService: LogoutServiceService,) {
    this.router.events.pipe(
      takeUntil(this.destroy$)
    ).subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Update your sidenav here
        console.log(event.url);
        this.currentURL = event.url;
        this.previousURL = localStorage.getItem('previousURL');
        if(this.currentURL != this.previousURL){
          if(this.currentURL ==='/dashboard-screen')
          this.updateSidenav();
        }
         this.previousURL = this.currentURL;
        localStorage.setItem('previousURL',this.previousURL);
        
     
      }
    });
    this.tokenExpiryTime = localStorage.getItem("tokenExpirationTimeInMinutes") ;
     this.token = sessionStorage.getItem('UserToken');
    if (this.tokenExpiryTime) {
    const idleTimeInSeconds = parseInt(this.tokenExpiryTime);
    this.idle.setIdle(idleTimeInSeconds);
    const timeBeforeWarning = 300; // in seconds
    const warningTime = (idleTimeInSeconds - timeBeforeWarning) * 1000;
    const logoutTime = ((idleTimeInSeconds - 60) * 1000);

    setTimeout(()=>{
     this.showWarningPopup();
    },warningTime);

    setTimeout(()=>{
        this.showLogoutPopup();
        this.logoutService.logout().subscribe((res: any) => {
          if (res) {
             let logoutResponse = res;
               console.log("LogoutResponse",logoutResponse);
               
            // this.router.navigate(['/home']);
          }
        },
          (err: any) => {
            // alert(err.error.message)
          }
        );
    },logoutTime);
    

    }

  }
    
    ngOnInit() {
      console.log = function(){};
      document.addEventListener('contextmenu', event => {
        event.preventDefault();
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updateSidenav(){
  //  window.location.reload();
  this.sidenavComponent?.labelAndEntitlement();
    console.log("yahooo");
  }

  showLogoutPopup() {
 
      localStorage.setItem("PopupMaitainance", "LogoutErrorMessage");
      localStorage.setItem("RateAllowedPopup","Your session has expired please re-login again");
      this.errordialog?.openDialog();
    
  }
  showWarningPopup() {
    localStorage.setItem("PopupMaitainance", "LogoutWarning");
    localStorage.setItem("RateAllowedPopup","Your session will expire in 5 mins, please save your work.");
    this.errordialog?.openDialog();
  }
}
