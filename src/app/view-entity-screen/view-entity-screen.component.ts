import { Component, ViewChild } from '@angular/core';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Router } from '@angular/router';
import { AddEntityServiceService } from '../services/add-entity-service.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-view-entity-screen',
  templateUrl: './view-entity-screen.component.html',
  styleUrls: ['./view-entity-screen.component.css']
})
export class ViewEntityScreenComponent {
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
    this.unitCode = sessionStorage.getItem("UnitCode")
    this.Status = sessionStorage.getItem("Status")

    this.getViewEntityData();
  }
    cars = [
    { id: 1, name: 'Volvo' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
  ];
  getViewEntityData() {
    if (this.unitCode != '') {
      this.entityService.getViewDataFromUnitCode(this.unitCode, this.Status).subscribe((res: any) => {
     
        if (res) {
          this.gridData = res?.data;
          this.UnitCode = this.gridData?.unit;
          this.Level = this.gridData?.levelName;
          this.parentUnit = this.gridData?.parent_unit;
          this.unitName = this.gridData?.unit_name;
          this.IFSC = this.gridData?.ifsc;
          this.state = this.gridData?.state
          this.district = this.gridData?.district;
          this.pincode = this.gridData?.pincode;
          this.email = this.gridData?.emailId;
          this.recordStatus = this.gridData?.entityStatusName
        
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
    this.router.navigate(['/entity-screen'])
  }
}
