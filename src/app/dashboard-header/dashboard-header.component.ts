import { Component, ViewChild } from '@angular/core';
import { LogoutScreenComponent } from '../logout-screen/logout-screen.component';
import { MatDialog } from '@angular/material/dialog';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';
 
@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent {
  @ViewChild(LogoutDialogComponent) logoutdialog: LogoutDialogComponent | undefined;
  constructor(public dialog: MatDialog,) { }
  Logout() {
  //  this.dialog.open(LogoutScreenComponent, { panelClass: 'deactiveSuccessPop' });
  this.logoutdialog?.openDialog();
  }
}