import { Component, ViewChild } from '@angular/core';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { AddEntityServiceService } from '../services/add-entity-service.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-view-add-user-screen',
  templateUrl: './view-add-user-screen.component.html',
  styleUrls: ['./view-add-user-screen.component.css']
})
export class ViewAddUserScreenComponent {
  unitCode: any;
  gridData: any = [];
  UnitCode: any;
  Level: any;
  parentUnit: any;
  unitName: any;
  IFSC: any;
  state: any;
  district: any;
  pincode: any;
  email: any;
  recordStatus: any;
  Status: any;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  constructor(private entityService: AddEntityServiceService, private router: Router) {
  }
  @ViewChild(NgSelectComponent)
  ngSelectComponent!: NgSelectComponent;
  ngOnInit() {
    this.unitCode = sessionStorage.getItem("UserTableuserId")
    this.Status = sessionStorage.getItem("UserTableStatus")
    console.log("RowClicked", this.unitCode)
    this.getViewEntityData();
  }
    cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];
  department:any;
  roleName:any;
  name:any
  givenName:any;
  mobile:any;
  designation:any;
  status:any;
  grade:any;
  getViewEntityData() {
    if (this.unitCode != '') {
      this.entityService.getUserDetails(this.unitCode, this.Status).subscribe((res: any) => {
        console.log("GridDataResponse", res)
        if (res) {
          this.gridData = res?.data;
          this.UnitCode = this.gridData?.userId;
          this.Level = this.gridData?.levelName;
          this.parentUnit = this.gridData?.parentUnit;
          this.unitName = this.gridData?.unitName;
          this.department=this.gridData?.department;
          this.roleName=this.gridData?.role;
          this.name=this.gridData?.name;
          this.mobile=this.gridData?.mobile;
          this.designation=this.gridData?.designation;
          this.grade=this.gridData?.grade;
          this.status=this.gridData?.entityStatusName;
          // this.IFSC = this.gridData?.ifsc;
          this.state = this.gridData?.state
          this.district = this.gridData?.district;
          this.pincode = this.gridData?.pincode;
          this.email = this.gridData?.emailId;
          this.recordStatus = this.gridData?.entity_status;
          this.givenName=this.gridData?.givenName;

          console.log("gridData", this.gridData);
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
  }
  goBack() {
    this.router.navigate(['/user-data'])
  }
}

