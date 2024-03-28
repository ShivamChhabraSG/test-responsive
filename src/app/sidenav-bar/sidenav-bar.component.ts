import { Component } from '@angular/core';
import{MatExpansionModule} from '@angular/material/expansion';
import { DashboardServiceService } from '../services/dashboard-service.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav-bar',
  templateUrl: './sidenav-bar.component.html',
  styleUrls: ['./sidenav-bar.component.css'],

})
export class SidenavBarComponent {
collapsed=true;
UserId:any;
logoutResponse:any;
sidenavbarData:any;
sidenavbarDataNew:any;
nodes:any= [];
sideLabelData:any;
panelOpenState = false;
panelOpenStateSideNav = true;
Authenticated: any;

ngOnInit(): void {
  this.UserId = sessionStorage.getItem("UserID");
  this.Authenticated = sessionStorage.getItem("UserToken");
  console.log(this.Authenticated);
  this.labelAndEntitlement();
}
constructor(
  private sidenavbar:DashboardServiceService ,private router: Router,public dialog: MatDialog,) {}
labelAndEntitlement() {
  if(this.Authenticated!== null){
  // this.sidenavbar.getLabelsAndEntitlements().subscribe((res: any) => {
  //   if (res) {
  //     this.sidenavbarData = res.labelsAndEntitlements;
     
  //   }
  // },
  //   (err: any) => {
    
  //   }
  // );

  this.sidenavbar.getLabelsAndEntitlementsNewone().subscribe((res: any) => {
    if (res) {
      this.sidenavbarDataNew = res.labelsAndEntitlements;
      
    }
  },
    (err: any) => {
      // alert(err.error.message)
    }
  );
  }
}




onSelectSidenav(data:any) {
  let clickedSidenavData = data;
 
  sessionStorage.setItem('labelKeyOfSideNav',clickedSidenavData.labelKey)
  if(clickedSidenavData.labelKey == '10111') {
  // alert("Helloo");
  sessionStorage.setItem("sideNavbar",JSON.stringify(clickedSidenavData.entitlements))
  this.router.navigate(['/entity-screen']);
  }

  else if(clickedSidenavData.labelKey == '10011') {
    sessionStorage.setItem("sideNavbar",JSON.stringify(clickedSidenavData.entitlements))
  this.router.navigate(['/master-data-screen']);
  }
  else if(clickedSidenavData.labelKey == '10113') {
    sessionStorage.setItem("sideNavbar",JSON.stringify(clickedSidenavData.entitlements))
    this.router.navigate(['/user-data']);
  }
  else if(clickedSidenavData.labelKey == '10117') {
    sessionStorage.setItem("sideNavbar",JSON.stringify(clickedSidenavData.entitlements))
    this.router.navigate(['/roles-view']);
    // this.router.navigate(['/claims-settlement']);
  }
  else if(clickedSidenavData.labelKey == '10119') {
    sessionStorage.setItem("sideNavbar",JSON.stringify(clickedSidenavData.entitlements))
    this.router.navigate(['/interest-rate-screen']);
  }
  else if(clickedSidenavData.labelKey == '20215') {
    sessionStorage.setItem("sideNavbar",JSON.stringify(clickedSidenavData.entitlements))
    this.router.navigate(['/closed-account-data']);
  }
  else if(clickedSidenavData.labelKey == '20211') {
    sessionStorage.setItem("sideNavbar",JSON.stringify(clickedSidenavData.entitlements))
    this.router.navigate(['/nrlm-data-upload']);
    // window.location.reload();
  }
  else if(clickedSidenavData.labelKey == '20213') {
    sessionStorage.setItem("sideNavbar",JSON.stringify(clickedSidenavData.entitlements))
    // this.router.navigate(['/view-accounts-upload']);
    this.router.navigate(['/accounts-data-upload']);
    // window.location.reload();
  }
  else if(clickedSidenavData.labelKey == '30031') {
    sessionStorage.setItem("sideNavbar",JSON.stringify(clickedSidenavData.entitlements))
    // this.router.navigate(['/view-accounts-upload']);
    this.router.navigate(['/claims-processing-screen']);}
  else if(clickedSidenavData.labelKey == '20217') {
    sessionStorage.setItem("sideNavbar",JSON.stringify(clickedSidenavData.entitlements))
    // this.router.navigate(['/view-accounts-upload']);
    this.router.navigate(['/claims-upload']);
    
    // window.location.reload();
  }
  
  else if(clickedSidenavData.labelKey == '40041') {
    sessionStorage.setItem("sideNavbar",JSON.stringify(clickedSidenavData.entitlements))
    this.router.navigate(['/claims-settlement']);
  }
  }

} 
