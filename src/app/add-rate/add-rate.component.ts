import { Component, OnInit, ViewChild } from '@angular/core';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { WarningAuthDialogComponent } from '../warning-auth-dialog/warning-auth-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-add-rate',
  templateUrl: './add-rate.component.html',
  styleUrls: ['./add-rate.component.css'],
})
export class AddRateComponent implements OnInit {
  @ViewChild(WarningAuthDialogComponent) authorisedialog: WarningAuthDialogComponent | undefined;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  ratetypes: any = [];
  recordsatus: any = [];
  authEntities: any = [];
  status: boolean = true;
  formData: any = {};
  editrate: any[] = [];

  entityData: any;
  isAdd: boolean = true;

  selectedUnitCode: any;
  ratetype: any;
  effectiveDate: any;
  mclrBmRate: any;
  entityStatus: any;
  intrestScreen: any;
  rateHeading: any;
  mode: any = [];

  constructor(
    private http: EntityScreenServiceService,
    private route: Router,
    public dialog: MatDialog,
    public actroute: ActivatedRoute,
    private entityService: EntityScreenServiceService,
    public datepipe: DatePipe
  ) {}
  addRateData:any = [];
  bankSelected:any;
  selectedFyStart:any;
  selectedQtrEnd:any;
  selectedFrequency:any = 'Quarterly';
  disableRates:boolean = true;
  disableQtyRate:boolean = false;
  m1Rate:any;
  m2Rate:any;
  m3Rate:any;
  selectedRateType:any= 'MCLR';
  unitCode:any;
  Status:any;
  EffectiveDate:any;
  CellData:any= [];
  errmsg:boolean = false;
  errmsg1:boolean = false;
  errmsg11:boolean = false;
  errmsg22:boolean = false;
  errmsg33:boolean = false;
  errmsgQ:boolean = false;
  errmsg2:boolean = false;
  errmsg3:boolean = false;
  isDisabled:boolean = false;
  ngOnInit(): void {
    this.intrestScreen = sessionStorage.getItem('IntrestrateData');
    this.addRateData =  sessionStorage.getItem("selectedBankAndQtr");
    this.addRateData = JSON.parse(this.addRateData);
    this.bankSelected = this.addRateData?.Bank;
    this.selectedFyStart = this.addRateData?.FyEnd;
    this.selectedQtrEnd = this.addRateData?.QtrEnd;
    this.selectedFrequency = 'Quarterly'
    this.unitCode = sessionStorage.getItem('unitcode');
    this.Status = sessionStorage.getItem('Status');
    this.EffectiveDate = sessionStorage.getItem('rateEffectiveFromDate');
    this.EffectiveDate = this.datepipe.transform(this.EffectiveDate,'dd-MM-yyyy');
    if(this.intrestScreen == 'editData' || this.intrestScreen == 'authorizeData' || this.intrestScreen == 'deleteData'|| this.intrestScreen == 'viewData') {
     this.CellData =  sessionStorage.getItem("CellData");
     this.CellData = JSON.parse(this.CellData);
    console.log("CellData",this.CellData);
    this.bankSelected = this.CellData?.unitCode;
    this.selectedQtrEnd = this.CellData?.qtrEnding;
    this.selectedQtrEnd = this.datepipe.transform(this.selectedQtrEnd,'dd MMM yyyy');
    this.selectedRateType = this.CellData?.rateTypeId;
    this.selectedFrequency = this.CellData?.frequency;
    this.quantityRate = this.CellData?.qtrRate;
    this.m1Rate = this.CellData?.m1Rate;
    this.m2Rate = this.CellData?.m2Rate;
    this.m3Rate = this.CellData?.m3Rate;

    }
    console.log("AddRateData",this.addRateData);
    if (this.intrestScreen == 'addData') {
      this.entityStatus = 'A';
      this.status = true;
    }
    this.actroute.queryParamMap.subscribe((data: any) => {
      this.mode = data.params.mode;;
      if (this.mode == 'View') {
        this.isDisabled = true
      }
      
     
    });
    if(this.selectedFrequency === 'Monthly') {
      this.disableRates = false;
      this.disableQtyRate = true;
    }
    if(this.selectedFrequency === 'Quarterly'){
      this.disableRates = true;
      this.disableQtyRate = false;
    }
    this.getAddRateBanks();
  }
selectedM1Rate(event: any) {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  // Remove non-numeric and non-decimal characters
  value = value.replace(/[^0-9.]/g, '');

  // Ensure there is only one decimal point
  const parts = value.split('.');
  if (parts.length > 1) {
    // Limit the numeric part before the decimal point to two digits
    parts[0] = parts[0].slice(0, 2);
    // Limit the decimal part to two digits
    parts[1] = parts[1]?.slice(0, 2);
    value = parts.join('.');
  } else {
    // Limit the numeric part to two digits if there is no decimal point
    value = value.slice(0, 2);
  }

  // Limit the total number of characters to 5 (2 digits before the decimal point + 1 digit for the decimal point + 2 digits after the decimal point)
  if (value.length > 5) {
    value = value.slice(0, 5);
  }

  // Ensure the value is not more than 10.00
  const numericValue = parseFloat(value);
  if (numericValue > 10.0) {
    this.errmsg1= true;
  }
  else {
    this.errmsg1 = false;
  }
  if (numericValue == 0) {
    this.errmsg11= true;
  }
  else {
    this.errmsg11 = false;
  }
  input.value = value;
  this.m1Rate = value;
}
selectedM2Rate(event: any) {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  // Remove non-numeric and non-decimal characters
  value = value.replace(/[^0-9.]/g, '');

  // Ensure there is only one decimal point
  const parts = value.split('.');
  if (parts.length > 1) {
    // Limit the numeric part before the decimal point to two digits
    parts[0] = parts[0].slice(0, 2);
    // Limit the decimal part to two digits
    parts[1] = parts[1]?.slice(0, 2);
    value = parts.join('.');
  } else {
    // Limit the numeric part to two digits if there is no decimal point
    value = value.slice(0, 2);
  }

  // Limit the total number of characters to 5 (2 digits before the decimal point + 1 digit for the decimal point + 2 digits after the decimal point)
  if (value.length > 5) {
    value = value.slice(0, 5);
  }

  // Ensure the value is not more than 10.00
  const numericValue = parseFloat(value);
  if (numericValue > 10.0) {
    this.errmsg2= true;
  }
  else {
    this.errmsg2 = false;
  }
  if (numericValue == 0) {
    this.errmsg22= true;
  }
  else {
    this.errmsg22 = false;
  }
  input.value = value;
  this.m2Rate = value;
}
  saveAddRate() {
    if(this.intrestScreen === 'addData') {
      let EffectiveDate = this.datepipe.transform(this.selectedQtrEnd,'dd-MM-yyyy');
      if(this.disableQtyRate === true) {
        let savedata = {
          unitCode: this.bankSelected,
          rateType: this.selectedRateType,
          freq: this.selectedFrequency,
          m1Rate: this.m1Rate,
          m2Rate: this.m2Rate,
          m3Rate: this.m3Rate,
          qtrRate: 0,
          effectiveDate: EffectiveDate
        }
        this.entityService.addRateData(savedata).subscribe((res: any) => {
          if(res.success === true) {
            this.route.navigate(['/interest-rate-screen']);
            console.log("AddRateData", this.addRateBanks);
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
      if(this.disableRates === true) {
        let savedata = {
          unitCode: this.bankSelected,
          rateType: this.selectedRateType,
          freq: this.selectedFrequency,
          m1Rate: 0,
          m2Rate: 0,
          m3Rate: 0,
          qtrRate: this.quantityRate,
          effectiveDate: EffectiveDate
        }
        this.entityService.addRateData(savedata).subscribe((res: any) => {
          if(res.success === true) {
            this.route.navigate(['/interest-rate-screen']);
            console.log("AddRateData", this.addRateBanks);
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
    if(this.intrestScreen === 'editData') {
      let EffectiveDate = this.datepipe.transform(this.selectedQtrEnd,'dd-MM-yyyy');

      if(this.disableQtyRate === true) {
        let editRateData = {
          unitCode: this.bankSelected,
          rateType: this.selectedRateType,
          freq: this.selectedFrequency,
          m1Rate: this.m1Rate,
          m2Rate: this.m2Rate,
          m3Rate: this.m3Rate,
          qtrRate: 0,
          effectiveDate: EffectiveDate
        }
        this.entityService.editRateData(this.bankSelected,this.CellData.status,EffectiveDate,editRateData).subscribe((res: any) => {
          if(res.success === true) {
            this.route.navigate(['/interest-rate-screen']);
            console.log("EditRateData", this.addRateBanks);
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
      if(this.disableRates === true) {
        let editRateData = {
          unitCode: this.bankSelected,
          rateType: this.selectedRateType,
          freq: this.selectedFrequency,
          m1Rate: 0,
          m2Rate: 0,
          m3Rate: 0,
          qtrRate: this.quantityRate,
          effectiveDate: EffectiveDate
        }
        this.entityService.editRateData(this.bankSelected,this.CellData.status,EffectiveDate,editRateData).subscribe((res: any) => {
          if(res.success === true) {
            this.route.navigate(['/interest-rate-screen']);
            console.log("EditRateData", this.addRateBanks);
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
  }
  selectedM3Rate(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    // Remove non-numeric and non-decimal characters
    value = value.replace(/[^0-9.]/g, '');
  
    // Ensure there is only one decimal point
    const parts = value.split('.');
    if (parts.length > 1) {
      // Limit the numeric part before the decimal point to two digits
      parts[0] = parts[0].slice(0, 2);
      // Limit the decimal part to two digits
      parts[1] = parts[1]?.slice(0, 2);
      value = parts.join('.');
    } else {
      // Limit the numeric part to two digits if there is no decimal point
      value = value.slice(0, 2);
    }
  
    // Limit the total number of characters to 5 (2 digits before the decimal point + 1 digit for the decimal point + 2 digits after the decimal point)
    if (value.length > 5) {
      value = value.slice(0, 5);
    }
  
    // Ensure the value is not more than 10.00
    const numericValue = parseFloat(value);
    if (numericValue > 10.0) {
      this.errmsg3= true;
    }
    else {
      this.errmsg3 = false;
    }
    if (numericValue == 0) {
      this.errmsg33= true;
    }
    else {
      this.errmsg33 = false;
    }
    input.value = value;
    this.m3Rate = value;
  }
  FreqSelect(event:any) {
    this.selectedFrequency = event.target.value;
    if(this.selectedFrequency == 'Quarterly')
    {
      this.m1Rate = '';
      this.m2Rate = '';
      this.m3Rate = '';
      this.errmsg1 = false;
      this.errmsg2 = false;
      this.errmsg3 = false;
      this.errmsg11 = false;
      this.errmsg22 = false;
      this.errmsg33 = false;
      this.disableRates = true;
      this.disableQtyRate = false;
    }
    if(this.selectedFrequency == 'Monthly')
     {
      this.quantityRate = '';
      this.errmsg = false;
      this.errmsgQ = false;
      this.disableRates = false;
      this.disableQtyRate = true;

    }
  }
  quantityRate:any;
  // QantityRate
  QantityRate(event: any) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
  
    // Remove non-numeric and non-decimal characters
    value = value.replace(/[^0-9.]/g, '');
  
    // Ensure there is only one decimal point
    const parts = value.split('.');
    if (parts.length > 1) {
      // Limit the numeric part before the decimal point to two digits
      parts[0] = parts[0].slice(0, 2);
      // Limit the decimal part to two digits
      parts[1] = parts[1]?.slice(0, 2);
      value = parts.join('.');
    } else {
      // Limit the numeric part to two digits if there is no decimal point
      value = value.slice(0, 2);
    }
  
    // Limit the total number of characters to 5 (2 digits before the decimal point + 1 digit for the decimal point + 2 digits after the decimal point)
    if (value.length > 5) {
      value = value.slice(0, 5);
    }
  
    // Ensure the value is not more than 10.00
    const numericValue = parseFloat(value);
    if (numericValue > 10.0) {
      this.errmsg= true;
    }
    else {
      this.errmsg = false;
    }
    if (numericValue == 0) {
      this.errmsgQ= true;
    }
    else {
      this.errmsgQ = false;
    }
    input.value = value;
    this.quantityRate = value;
  }
  
  rateTypeEvent(event:any) {
    this.selectedRateType = event.taget.value;
  }
  addRateBanks:any
  getAddRateBanks() {
    this.entityService.getUnitsInfo().subscribe((res: any) => {
        if(res.success === true) {
          console.log("ResponseData",res?.data);
          this.addRateBanks = res?.data;
          console.log("AddRateData", this.addRateBanks);
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
  showDeletePopup = false;
  deleteRateData() {
    let unitCode = sessionStorage.getItem('unitcode');
    let effectiveDate = sessionStorage.getItem('rateEffectiveFromDate');
  effectiveDate = this.datepipe.transform(effectiveDate,'dd-MM-yyyy')
    this.http.DeleteRate(unitCode, effectiveDate).subscribe(
      (res: any) => {
        if (res.success === true) {
          this.route.navigate(['/interest-rate-screen']);
        } else if (res.success === false) {
          alert(res.message);
          this.route.navigate(['/interest-rate-screen']);
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

  AuthDialog(){
   sessionStorage.setItem('auth','rateAuthorise')
    this.authorisedialog?.openDialog();
  }

  RejectDialog(){
    sessionStorage.setItem('auth','rateReject')
    this.authorisedialog?.openDialog();
  }
  remarks: string = '';
  sendRateUpdate(isReject: boolean) {
    const celldata = JSON.parse(sessionStorage.getItem('UnitCodeRate') || 'null');
    let EffectiveDates = celldata.qtrEnding;
    EffectiveDates = this.datepipe.transform(EffectiveDates,'dd-MM-yyyy');
    const body = {
      unitCode: celldata.unitCode,
      status: celldata.status,
      effectiveDate: EffectiveDates,
      rateType: celldata.rateTypeId,
      remarks: this.remarks,
      isReject: JSON.stringify(isReject),
    };
  
    this.http.UpdateRate(body).subscribe(
      (res: any) => {
        if (res.success === true) {
          this.route.navigate(['/interest-rate-screen']);
        } else if (res.success === false) {
          alert(res.message);
          this.route.navigate(['/interest-rate-screen']);
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
    // Reset the textarea value
     this.remarks = '';
  }

  goBackMain() {
    this.route.navigate(['/interest-rate-screen']);
  }

  reset() {
    // this.selectedRateType = '';
    // this.selectedFrequency = '';
    if(this.intrestScreen === 'addData') {
      this.quantityRate = '';
      this.m1Rate = '';
      this.m2Rate = '';
      this.m3Rate = '';
      this.errmsg = false;
      this.errmsg1 = false;
      this.errmsg11 = false;
      this.errmsg22 = false;
      this.errmsg33 = false;
      this.errmsgQ = false;
      this.errmsg2 = false;
      this.errmsg3 = false;
    }
    else if(this.intrestScreen === 'editData') {
      this.errmsg = false;
      this.errmsg1 = false;
      this.errmsg11 = false;
      this.errmsg22 = false;
      this.errmsg33 = false;
      this.errmsgQ = false;
      this.errmsg2 = false;
      this.errmsg3 = false;
      this.CellData =  sessionStorage.getItem("CellData");
      this.CellData = JSON.parse(this.CellData);
     console.log("CellData",this.CellData);
     this.bankSelected = this.CellData?.unitCode;
     this.selectedQtrEnd = this.CellData?.qtrEnding;
     this.selectedQtrEnd = this.datepipe.transform(this.selectedQtrEnd,'dd MMM yyyy');
     this.selectedRateType = this.CellData?.rateTypeId;
     this.selectedFrequency = this.CellData?.frequency;
     if(this.selectedFrequency == 'Quarterly')
     {
       this.disableRates = true;
       this.disableQtyRate = false;
     }
     if(this.selectedFrequency == 'Monthly')
      {
       this.disableRates = false;
       this.disableQtyRate = true;
     }
     this.quantityRate = this.CellData?.qtrRate;
     this.m1Rate = this.CellData?.m1Rate;
     this.m2Rate = this.CellData?.m2Rate;
     this.m3Rate = this.CellData?.m3Rate;
    }
  }

  redirect() {
    this.route.navigate(['/interest-rate-screen']);
  }

  // doesnot allow feature date
  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}
