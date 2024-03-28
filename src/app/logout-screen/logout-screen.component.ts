import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LogoutServiceService } from '../services/logout-service.service';

@Component({
  selector: 'app-logout-screen',
  templateUrl: './logout-screen.component.html',
  styleUrls: ['./logout-screen.component.css']
})
export class LogoutScreenComponent {
  constructor(private logoutService: LogoutServiceService, private dialogRef: MatDialogRef<any>,public dialog: MatDialog,private router: Router){}
  closepopup() {

    this.dialogRef.close();

  }
  Logout() {
    this.dialogRef.close();
    this.logoutService.logout().subscribe((res: any) => {
      if (res) {
         let logoutResponse = res;
           console.log("LogoutResponse",logoutResponse);
           
        this.router.navigate(['/home']);
        window.sessionStorage.clear();
        window.sessionStorage.clear();
      }
    },
      (err: any) => {
        // alert(err.error.message)
      }
    );
   
    }
    preventClose(event: MouseEvent): void {
      // Stop event propagation to prevent closing the popup
      event.stopPropagation();
    }
}
