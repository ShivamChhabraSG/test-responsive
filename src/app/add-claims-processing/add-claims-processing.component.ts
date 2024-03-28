import { Component, ViewChild, ElementRef, Output, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
// import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { Router } from '@angular/router';
import { AddEntityServiceService } from '../services/add-entity-service.service';
import { WarningPopupComponent } from '../warning-popup/warning-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { DatePipe } from '@angular/common';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as math from 'mathjs';
import { CellClickedEvent, ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
@Component({
  selector: 'app-add-claims-processing',
  templateUrl: './add-claims-processing.component.html',
  styleUrls: ['./add-claims-processing.component.css']
})
export class AddClaimsProcessingComponent {
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  @ViewChild('slab1pdf', { static: false }) slab1pdf!: ElementRef;
  @ViewChild('slab2pdf', { static: false }) slab2pdf!: ElementRef;
  @ViewChild(WarningDialogComponent) warningdialog: WarningDialogComponent | undefined;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  slab1Data: any;
  slab2Data: any;
  refCheck: boolean = false;
  convertToPdf() {
    const content = this.pdfContent.nativeElement;
    const pdfOptions = { background: 'white', scale: 1 }; // Adjust scale as needed

    html2canvas(content, pdfOptions).then((canvas: any) => {
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size

      // Adjust the width of the PDF page
      const customPdfWidth = 200; // Set your custom width in millimeters
      const pdfHeight = (canvas.height * customPdfWidth) / canvas.width;
      let qtrmonth = this.datePipe.transform(this.newBankdata, 'MMM');
      let qtrYear = this.datePipe.transform(this.newBankdata, 'YYYY');
      let newQtrYr = qtrYear?.toString().slice(-2);
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 20, 20, customPdfWidth, pdfHeight);
      pdf.save('claims summary_' +  this.bankCode +'_'+qtrmonth+'-'+newQtrYr+ '.pdf');
    //   pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 20, 20, customPdfWidth, pdfHeight);
    //   pdf.save('claims summary_' +  this.bankCode + '.pdf');
    });
  }

  selectedCar!: number;
  unitCode: any;
  gridData: any = [];
  entityData: any;
  UnitCode: any;
  Level: any;
  parentUnit: any;
  unitName: any;
  claimsInput: any;
  IFSC: any;
  state: any;
  district: any;
  pincode: any;
  email: any;
  recordStatus: any;
  levelsData: any = [];
  parentLevelsData: any = [];
  statesData: any = [];
  districtsData: any = [];
  recordStatusData: any = [];
  addEntityForm!: FormGroup;
  addEntityData: any;
  Status: any;
  editEntityData: any = [];
  isAdd: boolean = true;
  hideDelete: boolean = false;
  changeLevelIden: boolean = false;
  dissbleBtn: boolean = false;
  myForms!: FormGroup;
  bankSelect!: FormGroup;
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsBank: IDropdownSettings = {};
  selectedItemsArray: any = [];
  bankCode: any = [];
  fyend: any = '';
  myFiles: any = [];
  selectedFileName: string | undefined;
  disableUpload: boolean = true;
  selectedFile: File | null = null;
  ComeFromEdit: any;
  ComeFromAuthorize: any;
  isChecked: boolean = true;
  formattedToDate:any
  // uploadForm:any| undefined;

  A = 2;
  C = 3;
  B = 4;
  D = 5;
  X = 6;
  Z = 7;
  s1 = 8;
  s2 = 9;
  E = 1;
  F = 12;
  Y = 15;
  A1: any;
  B1: any;
  C1: any;
  D1: any;
  F1: any;
  X1: number = 0;
  Y1: number = 0;
  Z1: number = 0;
  G1: any;
  H1: any;
  I1: any;
  J1: any;
  K1: any;
  L1: any;
  M1: any;
  N1: any;
  O1: any;
  outStandingBal: any;
  RefAmt: any;
  EligibleRef: any;
  refId: any;
  math!: Math;
  authorizationClaim: any;
  showDisable: boolean = false;
  claimsCellData: any = [];
  viewClaim: boolean = true;
  PendingStatus: any;
  ComeFromView: any;
  deletePermission: boolean = false;
  showEdit: boolean = false;
  cellData: any = [];
  refinance: any;
  showRejectOnly: boolean = false;
  tokenDetails: any = [];
  claimStatus: any;
  pending: any;
  private gridApi!: GridApi;
  greatertThenOutstanding: boolean = false;
  greatertThenRefinanceAmt: boolean = false;
  public pageSize = 20;
  constructor(private spinner: NgxSpinnerService, private datePipe: DatePipe, private router: Router, public dialog: MatDialog, private fb: FormBuilder, private entityService: EntityScreenServiceService, private entityGridService: SharedEntityServiceService,) {
  }
  @ViewChild('fileInput', { static: false }) fileInputRef!: ElementRef;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(NgSelectComponent)
  ngSelectComponent!: NgSelectComponent;
  sumOfS3NdS6: any;
  claimsCellDataQtrEnding: any;
  claimsCellDataQtrEndingMarYear: any;
  claimsCellDataQtrEndingYear: any;
  extendedyr: any;
  newBankdata:any;
  rejectClaimsInput:string = ''
  ngOnInit() {
    this.tokenDetails = sessionStorage.getItem("TokenDetals");
    this.tokenDetails = JSON.parse(this.tokenDetails)
    console.log("TokenDetails", this.tokenDetails)
    this.claimsCellData = sessionStorage.getItem("ClaimsProcessCellData");
    // this.isChecked = this.refinance;
    console.log("this.claimsCellData", this.claimsCellData)
    this.ComeFromEdit = sessionStorage.getItem("ComeFromEdit");
    this.ComeFromEdit = JSON.parse(this.ComeFromEdit)
    this.ComeFromAuthorize = sessionStorage.getItem("ComeFromAuth");
    this.ComeFromAuthorize = JSON.parse(this.ComeFromAuthorize);
    console.log(this.ComeFromAuthorize);
    this.ComeFromView = sessionStorage.getItem('ComeFromView');
    this.ComeFromView = JSON.parse(this.ComeFromView);
    this.claimsCellData = JSON.parse(this.claimsCellData ? this.claimsCellData : []);
    console.log("ClaimssCellData", this.claimsCellData)
    this.sumOfS3NdS6 = ((this.claimsCellData.intSub3Sum) - (this.claimsCellData.intSub3RevSum)) + ((this.claimsCellData.intSub5Sum) - (this.claimsCellData.intSub5RevSum))
    console.log("this.claimsCellData", this.claimsCellData);
    this.bankCode = this.claimsCellData?.bankCode.split('-')[0];
    this.refinance = this.claimsCellData?.refinance;
    this.pending = this.claimsCellData?.pending;
    this.claimStatus = this.claimsCellData?.status;
    this.claimsCellDataQtrEnding = this.claimsCellData.qtrEnding;
        this.newBankdata = this.datePipe.transform(
          this.claimsCellDataQtrEnding,
      'dd MMM YYYY'
    );
    console.log("this.claimsCellDataQtrEnding", this.claimsCellDataQtrEnding)
    this.claimsCellDataQtrEnding = this.claimsCellDataQtrEnding.split('-')[1];
    if (this.claimsCellDataQtrEnding !== '03') {
      this.claimsCellDataQtrEndingYear = this.claimsCellData.qtrEnding.split('-')[0];
      this.extendedyr = Number(this.claimsCellDataQtrEndingYear) + 1;
      this.extendedyr = (this.extendedyr % 100).toString().padStart(2, '0');
    }
    else {
      this.claimsCellDataQtrEndingYear = this.claimsCellData.qtrEnding.split('-')[0];
      this.extendedyr = Number(this.claimsCellDataQtrEndingYear) - 1;
      this.extendedyr = (this.extendedyr % 100).toString().padStart(2, '0');
    }
    console.log("pending", this.pending);
    console.log("claimStatus", this.claimStatus)
    console.log("Refinance: ", typeof (this.refinance));
    if (this.refinance === "0") {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
    let claimsAuth = sessionStorage.getItem('ClaimsAuth');
    console.log("ClaimsAuth", claimsAuth);
    this.PendingStatus = sessionStorage.getItem("Pending");
    this.authorizationClaim = JSON.parse(claimsAuth ? claimsAuth : '');
    console.log("authorizationClaim", this.authorizationClaim);
    this.refId = this.claimsCellData?.refId;
    let data = sessionStorage.getItem("sideNavbar");
    let deleteView = JSON.parse(data ? data : '')
    deleteView.forEach((elements: any) => {
      // debuggerInject
      if (elements == 'Delete') {
        this.deletePermission = true;
      }
      if (elements == 'Edit') {
        this.showEdit = true;
      }
      if (this.deletePermission === true && this.showEdit === true) {
        this.showRejectOnly = true;
      }
      else {
        this.showRejectOnly = false;
      }
    })
    // if(this.authorizationClaim === false) {
    this.getDocumentDropdown();
    this.documentGriddata();
    // }
    let claimsView = sessionStorage.getItem('ClaimsView');
    this.viewClaim = JSON.parse(claimsView ? claimsView : '')
    this.outStandingBal = this.claimsCellData?.ui1;
    console.log(this.outStandingBal);
    this.RefAmt = this.claimsCellData?.ui2;
    if (this.RefAmt > this.outStandingBal) {
      this.greatertThenOutstanding = true;
    }
    else {
      this.greatertThenOutstanding = false;
    }
    this.EligibleRef = this.claimsCellData?.ui3;
    if (this.EligibleRef > this.RefAmt) {
      this.greatertThenRefinanceAmt = true;
    }
    else {
      this.greatertThenRefinanceAmt = false;
    }
    this.A1 = Math.round(this.claimsCellData?.m3s1Sum);
    this.B1 = Math.round(this.claimsCellData?.m3s1Cnt);
    this.C1 = Math.round(this.claimsCellData?.m3s2Sum);
    this.D1 = Math.round(this.claimsCellData?.m3s2Cnt);

    if (this.outStandingBal) {
      this.X1 = this.outStandingBal;
      console.log("A1", this.A1);
      console.log("C1", this.C1);
      if ((this.A1 + this.C1) != 0) {
        this.F1 = this.X1 * (this.A1 / (this.A1 + this.C1));
        console.log("F1", this.F1);
        this.G1 = this.X1 - this.F1;
      } else {
        this.G1 = 0;
        this.F1 = this.X1;
      }
    }
    if (this.RefAmt) {
      this.Y1 = this.RefAmt;
    }
    if (this.outStandingBal && this.EligibleRef) {
      this.Z1 = this.EligibleRef;
      // this.H1 = Math.round(this.Z1 * (this.A1 / (this.A1 + this.C1)));
      if ((this.A1 + this.C1) != 0) {
        this.H1 = this.Z1 * (this.A1 / (this.A1 + this.C1));
        this.I1 = this.Z1 - this.H1;
      } else {
        this.I1 = 0;
        this.H1 = this.Z1;
      }
      this.J1 = this.F1 - this.H1;
      this.K1 = this.G1 - this.I1;
      this.N1 = this.J1 + this.K1;
      //  this.getSlabNdRate();
    }
    this.getClaimsRemarks();
    if (this.claimsCellData.sremarks != null) {
      this.claimsInput = this.claimsCellData.sremarks;
    }
    console.log("this.claimsCellData", this.claimsCellData);
    this.entityData = sessionStorage.getItem("entityData");
    // let Delete:any;
    // Delete =  sessionStorage.getItem("showDelete");
    // this.showDelete = JSON.parse(Delete?Delete:false);
    // let Edit:any;
    // Edit =  sessionStorage.getItem("showEdit");
    // this.showEdit = JSON.parse(Edit?Edit:false);
    // if(this.showDelete === true && this.showEdit === true) {
    //   this.showRejectOnly = true;
    //   alert(this.showRejectOnly)
    // }
    // else {
    //   this.showRejectOnly = false;
    //   alert(this.showRejectOnly)
    // }
    this.toggleSwitch();
    this.getSlab1Data();
    this.getSlab2Data();

    if (this.outStandingBal != null) {
      this.outStandingBal = this.formatNumberIndianStyle(this.outStandingBal);
    }

    if (this.RefAmt != null) {
      this.RefAmt = this.formatNumberIndianStyle(this.RefAmt);
    }

    if (this.EligibleRef != null) {
      this.EligibleRef = this.formatNumberIndianStyle(this.EligibleRef);
    }
  }
  toppingList = [
    { field: 'Bank', label: 'Bank' },
    { field: 'FY Ending', label: 'FY Ending' },
    { field: 'Qtr End', label: 'Qtr End' },
    { field: 'Total Records', label: 'Total Records' },
  ];
  // getShgCodes
  sghCodes: any = []
  getSghCodes() {
    this.entityService.getShgCodes().subscribe((res: any) => {
      //console.log('ShgCodes', res);
      if (res.success === true) {
        this.sghCodes = res?.data
        // console.log(this.sghCodes);
      }
    },
    (err: any) => {
      this.spinner.hide()
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
    )
  }

  // getsUnits Info
  unitsData: any = [];
  bankListArray: any = [];
  bankAllArray: any[] = [];
  getunits() {
    this.entityService.getUnitsInfo().subscribe(
      (res: any) => {
      // console.log(res);
      if (res.success === true) {
        this.unitsData = res?.data;
        this.bankSelect.patchValue({
          bank: this.unitsData
        })
        //console.log('getUnits', this.unitsData);
        let localdata = res.data;
        this.bankListArray = localdata.map((data: { unit: any; unitName: any; }) => {
          return { unit: data.unit, unitName: data.unitName };
        });
        this.bankListArray.push()
        this.bankListArray.forEach((element: { unit: any; }) => {
          return this.bankAllArray.push(element.unit);
        })
        //console.log("BankListArray", this.bankAllArray);
      }
    },
    (err: any) => {
      this.spinner.hide()
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


  // Called whenever checkbox value changes
  isDisplayed: boolean = false;
  showHideText(event: any) {

    if (event.target.checked == true) {
      this.isDisplayed = true;
    }
    else {
      this.isDisplayed = false;
    }

    // Add other stuff

  }

  qtrselected: any = ''
  qtrEnding(data: any) {
    let datas = data.target.value
    let item = this.datePipe.transform(datas, 'dd-MM-yyyy');
    //console.log("Dataaaa", item);
    this.qtrselected = item;
  }
  fyendyearpopup: any;
  qtdata: any = []
  onSelectFinancialYearpopup(data: any) {
    let item: any;
    item = [data.target.value];
    let selectedDate = this.datePipe.transform(item, 'dd-MM-yyyy');
    this.fyendyearpopup = selectedDate;
    this.entityService.getQtYear(this.fyendyearpopup).subscribe(
      (res: any) => {
      console.log(res);

      this.qtdata = res.data
    },
    (err: any) => {
      this.spinner.hide()
      if (err.status === 401) {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "LogoutError");
        this.errordialog?.openDialog();
      } else {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
        this.errordialog?.openDialog();
      }
    })
    console.log("qtrDataa", this.fyend);
  }
  selectedStartYear: any
  selectedEndYear: any
  startYears: number[] = [];
  endYears: number[] = [];
  fyStart: any = ''
  fyEnd: string = ''
  qtrData: any[] = []
  getqtrEnding() {
    this.entityService.getqtrEnding().subscribe(
      (res: any) => {
      this.startYears = [res.data.pastYears]
      let start: any = [res.data.pastYears]
      let end: any = [res.data.curFyEnd]
      this.startYears = Array.from({ length: end - start + 1 }, (_, i) => end - i)
      let currfyend: any = res.data.curFyEnd
      this.selectedStartYear = res.data.pastFyStart
      this.selectedEndYear = res.data.curFyEnd


      if (res.success === true) {

        let data = res?.data;
        console.log("Dataaaaaaa", data)
        if (data.q1) {
          let obj: any = {
            'item': data.q1,
            'id': 1
          }
          this.qtrData.push(obj)
        }

        if (data.q2) {
          let obj: any = {
            'item': data.q2
          }
          this.qtrData.push(obj)

        }


        if (data.q3) {
          let obj: any = {
            'item': data.q3
          }
          this.qtrData.push(obj)

        }

        if (data.q4) {
          let obj: any = {
            'item': data.q4
          }
          this.qtrData.push(obj)

        }
        // this.qtrData = res?.data;



        console.log("qtrData", this.qtrData);
      }
    },
    (err: any) => {
      this.spinner.hide()
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
  //Financial year ending
  startYearspopup: any = []
  getfinendingForpopup() {
    this.entityService.getfyYearforpopup().subscribe((res: any) => {
      console.log(res)
      this.startYearspopup = res.data

    },
    (err: any) => {
      this.spinner.hide()
      if (err.status === 401) {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "LogoutError");
        this.errordialog?.openDialog();
      } else {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
        this.errordialog?.openDialog();
      }
    })
  }

  SaveData() {
    //alert("Helooo")
    // let data = {
    //   unitCode: this.UnitCode,
    //   parentUnitCode: this.parentUnit,
    //   ifsc: this.IFSC,
    //   unitName: this.unitName,
    //   level: this.Level,
    //   stateCode: this.state,
    //   districtCode: this.district,
    //   pincode: this.pincode,
    //   email: this.email,
    //   entityStatus: this.recordStatus
    // }
    // this.entityService.addEntity(data).subscribe((res: any) => {
    //   if (res.success = true) {
    //     this.addEntityData = res?.data;
    //     console.log("addEntityDataResponse", this.addEntityData);
    //     this.router.navigate(['/entity-screen'])
    //   }
    //   else {
    //     alert(res.message);
    //   }
    // },
    //   (err: any) => {
    //     console.log("ErrorMessage", err.error.message);
    //     alert(err.error.message)
    //   }
    // );
  }
  claimsRemarkss(event: any) {
    this.claimsInput = event.target.value;
    console.log("ClaimssInput", this.claimsInput);
  }
  SaveEditData() {
    if (this.claimsInput !== undefined) {
      let SaveStatus = 'E'
      this.entityService.saveClaimsRemaks(this.refId, this.claimsInput, SaveStatus).subscribe((res: any) => {
        let ClaimsResponse = res;
        console.log("ClaimsResponse", ClaimsResponse);
        this.router.navigate(['/claims-processing-screen'])
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
    }

    let saveAction = 'E';
    console.log("this.claimsCellData", this.claimsCellData);

    if ((this.L1 === 0) && (this.M1 === 0)) {
      let ClaimAmt1 = 0;
      let ClaimAmt2 = 0;

      if (this.isChecked === true) {
        if (this.outStandingBal !== 0) {
          this.outStandingBal = parseFloat(this.outStandingBal.replace(/,/g, ''));
        }
        if (this.RefAmt !== 0) {
          this.RefAmt = parseFloat(this.RefAmt.replace(/,/g, ''));
        }
        if (this.EligibleRef !== 0) {
          this.EligibleRef = parseFloat(this.EligibleRef.replace(/,/g, ''));
        }
      }

      this.entityService.UpdateClaimsProcessing(this.refId, saveAction, this.outStandingBal, this.RefAmt, this.EligibleRef, ClaimAmt1, ClaimAmt2).subscribe(
        (res: any) => {
        let ClaimsResponse = res;
        console.log("ClaimsResponse", ClaimsResponse);
        this.router.navigate(['/claims-processing-screen'])
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
    }
    if (this.L1 !== null && this.M1 !== null) {
      let ClaimAmt1 = this.L1;
      let ClaimAmt2 = this.M1;
      if (this.isChecked === true) {
        if (this.outStandingBal !== 0) {
          this.outStandingBal = parseFloat(this.outStandingBal.replace(/,/g, ''));
        }
        if (this.RefAmt !== 0) {
          this.RefAmt = parseFloat(this.RefAmt.replace(/,/g, ''));
        }
        if (this.EligibleRef !== 0) {
          this.EligibleRef = parseFloat(this.EligibleRef.replace(/,/g, ''));
        }
      }
      this.entityService.UpdateClaimsProcessing(this.refId, saveAction, this.outStandingBal, this.RefAmt, this.EligibleRef, ClaimAmt1, ClaimAmt2)
      .subscribe((res: any) => {
        let ClaimsResponse = res;
        console.log("ClaimsResponse", ClaimsResponse);
        if (res?.success == true) {
          sessionStorage.setItem("ClaimsSaved", res.message);
          sessionStorage.setItem("claimSaved", 'claimSuccess');

          this.errordialog?.openDialog();
        }
        // this.router.navigate(['/claims-processing-screen'])
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
    }
  }
  SubmitEditData() {
    if (this.claimsInput !== undefined) {
      let SubmitStatus = 'S'
      this.entityService.saveClaimsRemaks(this.refId, this.claimsInput, SubmitStatus).subscribe((res: any) => {
        let ClaimsResponse = res;
        if (res?.success == true) {
          console.log("ClaimsResponse", ClaimsResponse);
          const message = "Claim Submitted Successfully"
            sessionStorage.setItem("ClaimsSaved", message);
            sessionStorage.setItem("claimSaved", 'claimSuccess');
            this.errordialog?.openDialog();
        }
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
    }
    let saveAction = 'S';
    // if ((this.claimsCellData?.claimsAmnt1 === null || this.claimsCellData?.claimsAmnt1 === '0.00') && (this.claimsCellData?.claimsAmnt2 === null || this.claimsCellData?.claimsAmnt2 === '0.00')) {
    //   let ClaimAmt1 = 0;
    //   let ClaimAmt2 = 0;
    //   if (this.isChecked === true) {
    //     if (this.outStandingBal !== 0) {
    //       this.outStandingBal = parseFloat(this.outStandingBal.replace(/,/g, ''));
    //     }
    //     if (this.RefAmt !== 0) {
    //       this.RefAmt = parseFloat(this.RefAmt.replace(/,/g, ''));
    //     }
    //     if (this.EligibleRef !== 0) {
    //       this.EligibleRef = parseFloat(this.EligibleRef.replace(/,/g, ''));
    //     }
    //   }

    //   this.entityService.UpdateClaimsProcessing(this.refId, saveAction, this.outStandingBal, this.RefAmt, this.EligibleRef, ClaimAmt1, ClaimAmt2).subscribe((res: any) => {
    //     let ClaimsResponse = res;
    //     console.log("ClaimsResponse", ClaimsResponse);
    //     if (res?.success == true) {
    //       const message = "Claim Submitted Successfully"
    //       sessionStorage.setItem("ClaimsSaved", message);
    //       sessionStorage.setItem("claimSaved", 'claimSuccess');

    //       this.errordialog?.openDialog();
    //     }
    //     // this.router.navigate(['/claims-processing-screen'])
    //   })
    // }
    // if (this.claimsCellData?.claimsAmnt1 !== null && this.claimsCellData?.claimsAmnt2 !== null) {
    //   let ClaimAmt1 = this.L1;
    //   let ClaimAmt2 = this.M1;
    //   if (this.isChecked === true) {
    //     if (this.outStandingBal !== 0) {
    //       this.outStandingBal = parseFloat(this.outStandingBal.replace(/,/g, ''));
    //     }
    //     if (this.RefAmt !== 0) {
    //       this.RefAmt = parseFloat(this.RefAmt.replace(/,/g, ''));
    //     }
    //     if (this.EligibleRef !== 0) {
    //       this.EligibleRef = parseFloat(this.EligibleRef.replace(/,/g, ''));
    //     }
    //   }

    //   this.entityService.UpdateClaimsProcessing(this.refId, saveAction, this.outStandingBal, this.RefAmt, this.EligibleRef, ClaimAmt1, ClaimAmt2).subscribe((res: any) => {
    //     let ClaimsResponse = res;
    //     console.log("ClaimsResponse", ClaimsResponse);
    //     if (res?.success == true) {
    //       const message = "Claim Submitted Successfully"
    //       sessionStorage.setItem("ClaimsSaved", message);
    //       sessionStorage.setItem("claimSaved", 'claimSuccess');

    //       this.errordialog?.openDialog();
    //     }
    //     // this.router.navigate(['/claims-processing-screen'])
    //   })
    // }

    let ClaimAmt1 = this.L1;
    let ClaimAmt2 = this.M1;
    if (this.isChecked === true) {
      if (this.outStandingBal !== 0) {
        this.outStandingBal = parseFloat(this.outStandingBal.replace(/,/g, ''));
      }
      if (this.RefAmt !== 0) {
        this.RefAmt = parseFloat(this.RefAmt.replace(/,/g, ''));
      }
      if (this.EligibleRef !== 0) {
        this.EligibleRef = parseFloat(this.EligibleRef.replace(/,/g, ''));
      }
    }
    // alert(ClaimAmt1);
    // alert(ClaimAmt2);
      this.entityService.UpdateClaimsProcessing(this.refId, saveAction, this.outStandingBal, this.RefAmt, this.EligibleRef, ClaimAmt1, ClaimAmt2).subscribe((res: any) => {
        let ClaimsResponse = res;
        console.log("ClaimsResponse", ClaimsResponse);
        if (res?.success == true) {
          const message = "Claim Submitted Successfully"
          sessionStorage.setItem("ClaimsSaved", message);
          sessionStorage.setItem("claimSaved", 'claimSuccess');
 
          this.errordialog?.openDialog();
        }
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
  }
  rejectByMaker() {
    if (this.rejectClaimsInput !== undefined) {
      let RejectStatus = 'R'
      let claimReject = this.rejectClaimsInput
      this.entityService.saveClaimsRemaks(this.refId, claimReject, RejectStatus).subscribe(
        (res: any) => {
        let ClaimsResponse = res;
        console.log("ClaimsResponse", ClaimsResponse);
        // this.router.navigate(['/claims-processing-screen'])
        const message = "Rejected Successfully."
        sessionStorage.setItem("RateAllowedPopup", message);
        sessionStorage.setItem("PopupMaitainance", 'CPRA');
        this.errordialog?.openDialog();
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
    }
    let saveAction = 'R';
    if ((this.claimsCellData?.claimsAmnt1 === null || this.claimsCellData?.claimsAmnt1 === '0.00') && (this.claimsCellData?.claimsAmnt2 === null || this.claimsCellData?.claimsAmnt2 === '0.00')) {
      let ClaimAmt1 = 0;
      let ClaimAmt2 = 0;
      if (this.isChecked === true) {
        this.outStandingBal = parseFloat(this.outStandingBal.replace(/,/g, ''));
        this.RefAmt = parseFloat(this.RefAmt.replace(/,/g, ''));
        this.EligibleRef = parseFloat(this.EligibleRef.replace(/,/g, ''));
      }

      this.entityService.UpdateClaimsProcessing(this.refId, saveAction, this.outStandingBal, this.RefAmt, this.EligibleRef, ClaimAmt1, ClaimAmt2).subscribe(
        (res: any) => {
        let ClaimsResponse = res;
        console.log("ClaimsResponse", ClaimsResponse);
        // this.router.navigate(['/claims-processing-screen'])
        const message = "Rejected Successfully."
        sessionStorage.setItem("RateAllowedPopup", message);
        sessionStorage.setItem("PopupMaitainance", 'CPRA');
        this.errordialog?.openDialog();
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
    }
    if (this.claimsCellData?.claimsAmnt1 !== null && this.claimsCellData?.claimsAmnt2 !== null) {
      let ClaimAmt1 = this.L1;
      let ClaimAmt2 = this.M1;
      if (this.isChecked === true) {
        this.outStandingBal = parseFloat(this.outStandingBal.replace(/,/g, ''));
        this.RefAmt = parseFloat(this.RefAmt.replace(/,/g, ''));
        this.EligibleRef = parseFloat(this.EligibleRef.replace(/,/g, ''));
      }

      this.entityService.UpdateClaimsProcessing(this.refId, saveAction, this.outStandingBal, this.RefAmt, this.EligibleRef, ClaimAmt1, ClaimAmt2).subscribe((res: any) => {
        let ClaimsResponse = res;
        console.log("ClaimsResponse", ClaimsResponse);
        // this.router.navigate(['/claims-processing-screen'])
        const message = "Rejected Successfully."
        sessionStorage.setItem("RateAllowedPopup", message);
        sessionStorage.setItem("PopupMaitainance", 'CPRA');
        this.errordialog?.openDialog();
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
    }
    this.rejectClaimsInput = ''
  }
  deleteEntityData() {
    let saveAction = 'D';
    // if(this.outStandingBal === null) {
    //   this.outStandingBal = 0;
    // }
    // if(this.RefAmt === null) {
    //   this.RefAmt = 0;
    // }
    // if(this.EligibleRef === null) {
    //   this.EligibleRef = 0;
    // }
    this.spinner.show();
    if (this.isChecked === true) {
      this.outStandingBal = parseFloat(this.outStandingBal.replace(/,/g, ''));
      this.RefAmt = parseFloat(this.RefAmt.replace(/,/g, ''));
      this.EligibleRef = parseFloat(this.EligibleRef.replace(/,/g, ''));
    }
    let claimAmnt1 = this.claimsCellData?.claimsAmnt1;
    let claimAmnt2 = this.claimsCellData?.claimsAmnt2;
    if (claimAmnt1 === null) {
      claimAmnt1 = 0;
    }
    else {
      claimAmnt1 = this.claimsCellData?.claimsAmnt1
    }
    if (claimAmnt2 === null) {
      claimAmnt2 = 0;
    }
    else {
      claimAmnt2 = this.claimsCellData?.claimsAmnt2;
    }
    this.entityService.UpdateClaimsProcessing(this.refId, saveAction, this.outStandingBal, this.RefAmt, this.EligibleRef, claimAmnt1, claimAmnt2).subscribe(
      (res: any) => {
      let ClaimsResponse = res;
      console.log("ClaimsResponse", ClaimsResponse);
      this.spinner.hide()
      // this.router.navigate(['/claims-processing-screen'])
    },
    (err: any) => {
      this.spinner.hide()
      if (err.status === 401) {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "LogoutError");
        this.errordialog?.openDialog();
      } else {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
        this.errordialog?.openDialog();
      }
    })
  }
  deletePopup() {
    sessionStorage.setItem("popupShown", "deleted");
    this.dialog.open(WarningPopupComponent, { panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass: 'backdropBackground', disableClose: false })
  }

  reset() {
    this.outStandingBal = 0;
    this.RefAmt = 0;
    this.EligibleRef = 0;
    this.ngOnInit();
    this.ngSelectComponent.handleClearClick();
  }
  getEditEntityData() {
    // if (this.unitCode != '') {
    //   this.entityService.getViewDataFromUnitCode(this.unitCode, this.Status).subscribe((res: any) => {
    //     console.log("GridDataResponse", res)
    //     if (res.success == true) {
    //       this.gridData = res?.data;
    //       console.log("gridData", this.gridData);
    //       this.UnitCode = this.gridData?.unit;
    //       this.Level = Number(this.gridData?.level);
    //       if(this.Level == 2)  {
    //         this.changeLevelIden = false;
    //       } else {
    //         this.changeLevelIden = true;

    //       }
    //       this.entityService.getParentLevels(this.Level).subscribe((res: any) => {
    //         console.log("LevelsResponse", res)
    //         if (res) {
    //           this.parentLevelsData = res?.data;
    //           console.log("ParentLevelsResponse", this.parentLevelsData);
    //         }
    //       },
    //         (err: any) => {
    //           console.log("ErrorMessage", err.error.message);
    //         }
    //       );
    //       this.parentUnit = this.gridData.parent_unit;
    //       this.unitName = this.gridData?.unit_name;
    //       this.IFSC = this.gridData?.ifsc;
    //       this.state = String(this.gridData?.stateCode);
    //       // alert(this.state)
    //       this.entityService.getDistricts(this.state).subscribe((res: any) => {
    //         console.log("StatesResponse", res)
    //         if (res) {
    //           this.districtsData = res?.data;
    //           console.log("DistrictResponse", this.districtsData);
    //         }
    //       },
    //         (err: any) => {
    //           console.log("ErrorMessage", err.error.message);
    //         }
    //       );
    //       this.district = String(this.gridData?.districtCode);
    //       this.pincode = this.gridData?.pincode;
    //       this.email = this.gridData?.emailId;
    //       this.recordStatus = this.gridData?.entity_status;
    //     }
    //   },
    //     (err: any) => {
    //       console.log("ErrorMessage", err.error.message);
    //     }
    //   );
    // }
  }
  back() {
    this.router.navigate(['/claims-processing-screen'])
  }

  remarks: string = '';
  Authorize() {
    if (this.claimsInput !== undefined) {
      let AuthStatus = 'A'
      this.entityService.saveClaimsRemaks(this.refId, this.claimsInput, AuthStatus).subscribe(
        (res: any) => {
        if (res.succes === true) {
          let ClaimsResponse = res;
          // console.log("ClaimsResponse", ClaimsResponse);
          // alert(res.message)
          const message = "Authorised Successfully."
          sessionStorage.setItem("RateAllowedPopup", message);
          sessionStorage.setItem("PopupMaitainance", 'NrlmUploadSuccess');
          this.errordialog?.openDialog();
        } if (res.succes === false) {
          // alert(res.message);
          sessionStorage.setItem("RateAllowedPopup", res.message);
          sessionStorage.setItem("PopupMaitainance", 'NrlmUpload');
          this.errordialog?.openDialog();
        }
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
    }
    let Status = 'A';
    this.entityService.claimsProcessAuthOrReject(this.refId, Status).subscribe(
      (res: any) => {
        if ((res.success === true)) {
          let authorizeEntityData = res;
          console.log('authorizeEntityDataResponse', authorizeEntityData);
          const message = "Authorised Successfully."
          sessionStorage.setItem("RateAllowedPopup", message);
          sessionStorage.setItem("PopupMaitainance", 'CPRA');
          this.errordialog?.openDialog();
          // this.router.navigate(['/claims-processing-screen'])
        } if (res.success === false) {
          // alert(res.message);
          // this.router.navigate(['/claims-processing-screen']);
          sessionStorage.setItem("RateAllowedPopup", res.message);
          sessionStorage.setItem("PopupMaitainance", 'CPRAError');
          this.errordialog?.openDialog();
        }
      },
      (err: any) => {
        // console.log('ErrorMessage', err.error.message);
        // alert(err.error.message);
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", 'CPRAError');
          this.errordialog?.openDialog();
        }
      }
    );
  }
  reject() {
    if (this.rejectClaimsInput !== undefined) {
      let rejectStatus = 'R'
      let claimReject = this.rejectClaimsInput
      this.entityService.saveClaimsRemaks(this.refId,claimReject, rejectStatus).subscribe(
        (res: any) => {
        let ClaimsResponse = res;
        // console.log("ClaimsResponse", ClaimsResponse);
        // this.router.navigate(['/claims-processing-screen'])
        const message = "Rejected Successfully."
        sessionStorage.setItem("RateAllowedPopup", message);
        sessionStorage.setItem("PopupMaitainance", 'CPRA');
        this.errordialog?.openDialog();
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
    }
    let Status = 'R';
    this.entityService.claimsProcessAuthOrReject(this.refId, Status).subscribe(
      (res: any) => {
        if ((res.success = true)) {
          let authorizeEntityData = res;
          console.log('authorizeEntityDataResponse', authorizeEntityData);
          const message = "Rejected Successfully."
          sessionStorage.setItem("RateAllowedPopup", message);
          sessionStorage.setItem("PopupMaitainance", 'CPRA');
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", res.message);
          sessionStorage.setItem("PopupMaitainance", 'CPRAError');
          this.errordialog?.openDialog();
          // alert(res.message);
          // this.router.navigate(['/claims-processing-screen']);
        }
      },
      (err: any) => {
        if (err.status === 401) {
          this.spinner.hide()
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          // console.log('ErrorMessage', err.error.message);
          // alert(err.error.message);
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", 'CPRAError');
          this.errordialog?.openDialog();
        }
      }
    );
   this.rejectClaimsInput = ''
  }
  uploadForm = new FormGroup({
    files: new FormControl('', [Validators.required])
  });
  onSubmit() {
    const formData = new FormData();

    for (var i = 0; i < this.myFiles.length; i++) {
      formData.append("file[]", this.myFiles[i]);
    }
  }

  openFile() {
    // document.querySelector('input')?.click()
    if (this.documentSelected == null) {
      alert("Please select the Document Type")
    }
    else{
      this.fileInputRef.nativeElement.click();
    }
  }

  // onFileSelected(event: Event): void {
  //   const fileInput = event.target as HTMLInputElement;
  //   this.selectedFileName = fileInput.files?.[0]?.name;
  // }
  slabRateData: any = [];
  sv1Rate: any;
  sv2Rate: any;
  getSlabNdRate() {
    let effectiveDate = sessionStorage.getItem("EffectiveData");
    this.entityService.ClaimsSlabNdRate(effectiveDate).subscribe(
      (res: any) => {
      if (res) {
        this.slabRateData = res?.data;
        this.sv1Rate = this.slabRateData?.sv1Rate;
        this.sv2Rate = this.slabRateData?.sv2Rate;
        this.L1 = this.J1 * (this.sv1Rate / 36500);
        this.M1 = this.K1 * (this.sv2Rate / 36500);
        this.O1 = (this.L1 + this.M1);
        // sessionStorage.setItem("allData",JSON.stringify(alldata));
      }
    },
    (err: any) => {
      this.spinner.hide()
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
    )
  }
  claimsRemarks: any;
  AuthRejRemarks: any;
  getClaimsRemarks() {
    let refId = this.claimsCellData.refId;
    // let Status = this.claimsCellData.status;
    let RemakrsStatus = 'P'
    this.entityService.ClaimsRemarks(refId, RemakrsStatus).subscribe(
      (res: any) => {
      console.log("Claims Remarks", res);
      if (res) {
        this.claimsRemarks = res.data;
        console.log("ClaimsRemarkss", this.claimsRemarks)
      }
    },
    (err: any) => {
      this.spinner.hide()
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
    )
    let remarksStatus = 'X'
    this.entityService.ClaimsRemarks(refId, remarksStatus).subscribe((res: any) => {
      if (res) {
        this.AuthRejRemarks = res.data;
        console.log("ClaimsRemarkss", this.AuthRejRemarks)
      }
    },
    (err: any) => {
      this.spinner.hide()
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
    )
  }
  // onInputChange(event: any) {
  //   // Remove any non-numeric characters from the input
  //   this.inputValue = event.target.value.replace(/[^0-9]/g, '');
  // }
  disableSaveSubmit: boolean = false;
  validateInput(event: any) {
    const formattedNumber = event.target.value;
    const parsedNumber = parseFloat(formattedNumber.replace(/,/g, ''));
    const input: any = +(parsedNumber);

    console.log(input);
    if (!input) {
      this.outStandingBal = 0;
      this.X1 = this.outStandingBal;
      console.log("X1", this.X1);
    // this.EligibleRef=  parseFloat(this.EligibleRef.replace(/,/g, ''));
      if (this.RefAmt > this.outStandingBal) {
        this.greatertThenOutstanding = true;
        // this.disableSaveSubmit = true;
      }
      else {
        this.greatertThenOutstanding = false;
        // this.disableSaveSubmit = false;
      }

      if (this.Z1 > this.outStandingBal) {
        this.greatertThenRefinanceAmt = true;
        this.disableSaveSubmit = true;
      }
      else {
        this.greatertThenRefinanceAmt = false;
        this.disableSaveSubmit = false;
      }
      console.log("A1", this.A1);
      console.log("C1", this.C1);
      if ((this.A1 + this.C1) != 0) {
        this.F1 = this.X1 * (this.A1 / (this.A1 + this.C1));
        this.G1 = this.X1 - this.F1;
      }
      else {
        this.G1 = 0;
        this.F1 = this.X1;
      }
      this.J1 = this.F1;
      this.K1 = this.G1;
      this.N1 = this.J1 + this.K1;
      this.getSlabNdRate();
      if (this.outStandingBal == 0 && this.EligibleRef == 0) {
        this.refCheck = true;
        this.disableSaveSubmit = true;
      }
      if (this.outStandingBal == 0) {
        this.refCheck = true;
        this.disableSaveSubmit = true;
      }
    }
    else {
      this.refCheck = false;
      this.disableSaveSubmit = false;
      this.outStandingBal = Number(input.toFixed(2));
     // this.EligibleRef=  parseFloat(this.EligibleRef.replace(/,/g, ''));
      console.log("outstanding blanace",this.outStandingBal);
      console.log("Eligible Ref",this.EligibleRef);
      this.X1 = this.outStandingBal;
      if (this.RefAmt > this.outStandingBal) {
        this.greatertThenOutstanding = true;
        // this.disableSaveSubmit = true;
      }
      else {
        this.greatertThenOutstanding = false;
        // this.disableSaveSubmit = false;
      }
      if (this.Z1 > this.outStandingBal) {
        this.greatertThenRefinanceAmt = true;
        this.disableSaveSubmit = true;
      }
      else {
        this.greatertThenRefinanceAmt = false;
        this.disableSaveSubmit = false;
      }
      // this.F1 = Math.round(this.X1 * (this.A1 / (this.A1 + this.C1)));
      if ((this.A1 + this.C1) != 0) {
        this.F1 = this.X1 * (this.A1 / (this.A1 + this.C1));
        this.G1 = this.X1 - this.F1;
      }
      else {
        this.G1 = 0;
        this.F1 = this.X1;
      }
      this.J1 = this.F1;
      this.K1 = this.G1;
      this.N1 = this.J1 + this.K1;
      this.getSlabNdRate();
      // alert(this.RefAmt);
      this.outStandingBal = this.formatNumberIndianStyle(this.outStandingBal);
    }
  }

  formatNumberIndianStyle(num: number): string {
    let numStr = num.toString();
    let result = '';
    let count = 0;

    // Iterate over the string from the end to the beginning
    for (let i = numStr.length - 1; i >= 0; i--) {
      // Add a comma after the rightmost 3 digits and then after every 2 digits
      if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
        result = ',' + result;
      }
      result = numStr.charAt(i) + result;
      count++;
    }

    return result;
  }

  // validateRefinanceAmtInputs(event: any) {
  //   const input = event.target.value;
  //   if(input === '') {
  //     alert("Hellooo");
  //     this.RefAmt = 0;
  //   }
  //   else {
  //     this.RefAmt = Math.round(input);
  //     this.RefAmt = event.target.value;
  //     alert(this.RefAmt);
  //   }
  // }
  validateRefinanceAmtInput(event: any) {
    const formattedNumber = event.target.value;
    const parsedNumber = parseFloat(formattedNumber.replace(/,/g, ''));
    const input: any = +(parsedNumber);

    if (!input) {
      this.RefAmt = 0;
      this.Y1 = this.RefAmt;
      if (this.RefAmt < this.outStandingBal) {
        this.greatertThenOutstanding = true;
        // this.disableSaveSubmit = true;
      }
      else {
        this.greatertThenOutstanding = false;
        // this.disableSaveSubmit = false;
      }

      // alert(this.RefAmt);
    }
    else {
      this.RefAmt = Number(input.toFixed(2));
      this.Y1 = this.RefAmt;
      if (this.RefAmt < this.outStandingBal) {
        this.greatertThenOutstanding = true;
        // this.disableSaveSubmit = true;
      }
      else {
        this.greatertThenOutstanding = false;
        // this.disableSaveSubmit = false;
      }
      // alert(this.RefAmt);
      this.RefAmt = this.formatNumberIndianStyle(this.RefAmt);
    }
  }
  // validateRefinanceAmtInput(event: any) {
  //   const input = Number(event.target.value);
  //   if(input) {
  //     alert("PPPPP")
  //     this.RefAmt = 0;
  //     this.Y1 = this.RefAmt;
  //     if(this.RefAmt > this.outStandingBal) {
  //       this.greatertThenOutstanding = true;
  //       this.disableSaveSubmit = true;
  //     }
  //     else {
  //       this.greatertThenOutstanding = false;
  //       this.disableSaveSubmit = false;
  //     }
  //   }
  //   else {
  //           alert(this.RefAmt);
  //     let Refinance =(Math.round(input));
  //     this.RefAmt = Number(Refinance)
  //     this.RefAmt = this.showDisable;
  //       this.Y1 = this.RefAmt;
  //       if(this.RefAmt > this.outStandingBal) {
  //         this.greatertThenOutstanding = true;
  //         this.disableSaveSubmit = true;
  //       }
  //       else {
  //         this.greatertThenOutstanding = false;
  //         this.disableSaveSubmit = false;
  //       }
  //   }

  // }
  validateEligibleRefInput(event: any) {

    const formattedNumber = event.target.value;
    const parsedNumber = parseFloat(formattedNumber.replace(/,/g, ''));
    const input: any = +(parsedNumber);
    if (!input) {
      this.EligibleRef = 0;
      this.Z1 = this.EligibleRef;
      if (this.EligibleRef > this.outStandingBal) {
        this.greatertThenRefinanceAmt = true;
        this.disableSaveSubmit = true;
      }
      else {
        this.greatertThenRefinanceAmt = false;
        this.disableSaveSubmit = false;
      }
      //this.H1 = Math.round(this.Z1 * (this.A1 / (this.A1 + this.C1)));
      if ((this.A1 + this.C1) != 0) {
        this.H1 = this.Z1 * (this.A1 / (this.A1 + this.C1));
        this.I1 = this.Z1 - this.H1;
      } else {
        this.H1 = 0;
      }
      if (this.X1 !== 0) {
        this.J1 = this.F1 - this.H1;
      }
      if (this.X1 !== 0) {
        this.K1 = this.G1 - this.I1;
      }
      if (this.J1 !== '' && this.K1 !== '') {
        this.N1 = this.J1 + this.K1;
      }
      if (this.J1 !== '') {
        this.L1 = this.J1 * (this.sv1Rate / 36500);
      }
      if (this.K1 !== '') {
        this.M1 = this.K1 * (this.sv2Rate / 36500);
      }
      if (this.J1 !== '' && this.K1 !== '') {
        this.O1 = this.L1 + this.M1;
      }
      if (this.outStandingBal == 0 && this.EligibleRef == 0) {
        this.refCheck = true;
        this.disableSaveSubmit = true;
      }
      this.getSlabNdRate();
    }
    else {
      this.Z1 = Number(input.toFixed(2));
      console.log("RefinanceAmt",this.Z1);
      console.log("OutStandingBal",this.outStandingBal)
      const parsedNumber = parseFloat(this.outStandingBal.replace(/,/g, ''));
      const inputs: any = +(parsedNumber);
      console.log("InputNumberr",inputs)
      this.EligibleRef = this.Z1;
      if (this.EligibleRef > inputs) {
        this.greatertThenRefinanceAmt = true;
        this.disableSaveSubmit = true;
      }
      else {
        this.greatertThenRefinanceAmt = false;
        this.disableSaveSubmit = false;
      }
      //  this.H1 = Math.round(this.Z1 * (this.A1 / (this.A1 + this.C1)));
      if ((this.A1 + this.C1) != 0) {
        this.H1 = this.Z1 * (this.A1 / (this.A1 + this.C1));
        this.I1 = this.Z1 - this.H1;
      } else {
        this.H1 = 0;
      }
      if (this.X1 !== 0) {
        this.J1 = this.F1 - this.H1;
      }
      if (this.X1 !== 0) {
        this.K1 = this.G1 - this.I1;
      }
      if (this.J1 !== '' && this.K1 !== '') {
        this.N1 = this.J1 + this.K1;
      }
      if (this.J1 !== '') {
        this.L1 = this.J1 * (this.sv1Rate / 36500);
      }
      if (this.K1 !== '') {
        this.M1 = this.K1 * (this.sv2Rate / 36500);
      }
      if (this.J1 !== '' && this.K1 !== '') {
        this.O1 = this.L1 + this.M1;
      }
      this.getSlabNdRate();

      this.EligibleRef = this.formatNumberIndianStyle(this.EligibleRef);
    }
  }
  documentTypeDrop: any = [];
  getDocumentDropdown() {
    this.entityService.getDocumentType().subscribe(
      (res: any) => {
      if (res) {
        this.documentTypeDrop = res.data;
        console.log("DocumentType", this.documentTypeDrop);
      }
    },
    (err: any) => {
      this.spinner.hide()
      if (err.status === 401) {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "LogoutError");
        this.errordialog?.openDialog();
      } else {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
        this.errordialog?.openDialog();
      }
    })
  }
  documentSelected: any;
  documentSize: any;
  changeDocumentType(event: any) {
    console.log("ChangeDoc", event)
    this.documentSize = event.size;
    this.documentSelected = event.documentType;
  }
  onFileChange(fileInput: HTMLInputElement) {
    const files = fileInput.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.selectedFileName = this.selectedFile.name;
      let uploadedSize = (this.selectedFile.size) / 1000000;
      console.log("UploadedSize", uploadedSize);
      if (uploadedSize > this.documentSize) {
        alert("File Size Exceed");
        this.disableUpload = true;
      }
      else {
        this.disableUpload = false;
      }
    }
  }
  messageSuccess: boolean = true;
  upload() {
    if (this.selectedFile) {
      let fileName: any = this.selectedFile.name;
      console.log("fileName", fileName);
      this.spinner.show();
      var formdata = new FormData();
      formdata.append("docFile", this.selectedFile, fileName);
      console.log(this.selectedFile, fileName);
      if (this.refId && this.documentSelected) {
        let Status = 'P';
        this.entityService.uploadDocumentType(this.refId, this.documentSelected, Status, formdata).subscribe(
          (res: any) => {
          let UploadDocumentRes = res;
          console.log("Response", UploadDocumentRes);
          this.documentSelected = null;
          this.documentSize = null;
          this.selectedFile = null;
          this.selectedFileName = '';
          this.disableUpload = false;
          this.uploadForm.get('files')?.reset();
          const fileInput = this.fileInputRef.nativeElement;
          fileInput.value = '';
          this.documentGriddata();
          // setTimeout(()=>{
          // this.messageSuccess = false;
          // },1000);
          this.spinner.hide()
          // this.closeModalEvent.emit(false);
        },
        (err: any) => {
          this.spinner.hide()
          if (err.status === 401) {
            sessionStorage.setItem("RateAllowedPopup", err.error.message);
            sessionStorage.setItem("PopupMaitainance", "LogoutError");
            this.errordialog?.openDialog();
          } else {
            sessionStorage.setItem("RateAllowedPopup", err.error.message);
            sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
            this.errordialog?.openDialog();
          }
        });
      } else {
        alert("RefId or Document Type is missing");
      }
    } else {
      alert("Select a File");
    }
  }
  CancelBtn() {
    window.location.reload();
  }
  documentGridData: any = [];
  documentGriddata() {
    this.entityService.getClaimsProcessingDocument(this.refId).subscribe(
      (res: any) => {
      this.documentGridData = res.data;
      if (this.documentGridData === null) {
        this.showIcons = false;
      }
      console.log("GridDat", this.documentGridData);
    },
    (err: any) => {
      this.spinner.hide()
      if (err.status === 401) {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "LogoutError");
        this.errordialog?.openDialog();
      } else {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
        this.errordialog?.openDialog();
      }
    })
  }
  showIcons: boolean = false;
  onCellClicked(event: CellClickedEvent) {
    console.log("CellData", event)
    this.cellData = event.data
    this.showIcons = true;
  }
  notes() {
    this.showIcons = false;
  }
  columnDefs: ColDef[] = [
    {
      headerName: 'Document Name',
      field: 'docName',
      tooltipField: 'docName',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'File Name',
      field: 'fileName',
      tooltipField: 'fileName',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Uploaded By',
      field: 'uploadedBy',
      tooltipField: 'uploadedBy',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Status',
      field: 'statusName',
      tooltipField: 'statusName',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 125,
    }

  ];
  gridColumnApi: any;
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }
  gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    defaultColDef: {
      resizable: true,
      filter: true,
      sortable: true,
      floatingFilter: true,
    },
    // onCellClicked: (event: CellClickedEvent) => console.log('Cell was clicked'),
    onGridReady: (params) => {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;

    },
  }
  public defaultColDef: ColDef = {
    suppressSizeToFit: true,


    filter: 'agTextColumnFilter',
    // flex: 8,
    // resizable: true,
    sortable: true,
  };
  closePopup: boolean = true;

  deleteDialog() {
    console.log("it's hitting here");
    sessionStorage.setItem("popupDelete", "claimsProcessingDelete");
    this.warningdialog?.openDialog();
  }
  deleteDocument() {
    this.entityService.ClaimsProcessingNotesDeleteDocument(this.cellData.refId, this.cellData.sn).subscribe((res: any) => {
      let deletedDataStatus = res.data;
      this.documentGriddata();
      // setTimeout(()=>{
      //   this.closePopup = false;
      // },1000);
      console.log("DeletedDataResponse", deletedDataStatus)
      this.showIcons = false
    },
    (err: any) => {
      this.spinner.hide()
      if (err.status === 401) {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "LogoutError");
        this.errordialog?.openDialog();
      } else {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
        this.errordialog?.openDialog();
      }
    })
  }
  downLoadDocument() {
    const fileType = ".csv, application/pdf";
    this.spinner.show()
    this.entityService.getClaimsProcessingDownloadDocument(this.cellData.refId, this.cellData.sn).subscribe((res: any) => {
      this.spinner.hide();
      const blob = new Blob([res.body], { type: fileType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.cellData.fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    },
    (err: any) => {
      this.spinner.hide()
      if (err.status === 401) {
        sessionStorage.setItem("RateAllowedPopup","Not a valid session");
        sessionStorage.setItem("PopupMaitainance", "LogoutError");
        this.errordialog?.openDialog();
      } else {
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
        this.errordialog?.openDialog();
      }
    })

  }
  showChecked: string = 'No';
  toggleSwitch() {
    console.log(this.isChecked);
    this.isChecked = !this.isChecked;
    console.log(this.isChecked);
    if (this.isChecked === true) {
      this.showChecked = 'Yes';
      this.showDisable = false;
      console.log("showDisable", this.showDisable)
      let claimsView = sessionStorage.getItem('ClaimsView');
      this.viewClaim = JSON.parse(claimsView ? claimsView : '')
      this.outStandingBal = this.claimsCellData?.ui1;
      if (this.outStandingBal === null) {
        this.outStandingBal = 0;
      }
      this.RefAmt = this.claimsCellData?.ui2;
      if (this.RefAmt === null) {
        this.RefAmt = 0;
      }
      if (this.RefAmt > this.outStandingBal) {
        this.greatertThenOutstanding = true;
      }
      else {
        this.greatertThenOutstanding = false;
      }
      this.EligibleRef = this.claimsCellData?.ui3;
      if (this.EligibleRef === null) {
        this.EligibleRef = 0;
      }
      if (this.EligibleRef > this.RefAmt) {
        this.greatertThenRefinanceAmt = true;
      }
      else {
        this.greatertThenRefinanceAmt = false;
      }
      if (this.outStandingBal == 0 && this.EligibleRef == 0) {
        this.refCheck = true;
        this.disableSaveSubmit = true;
      }
      this.A1 = Math.round(this.claimsCellData?.m3s1Sum);
      this.B1 = Math.round(this.claimsCellData?.m3s1Cnt);
      this.C1 = Math.round(this.claimsCellData?.m3s2Sum);
      this.D1 = Math.round(this.claimsCellData?.m3s2Cnt);
      if (this.outStandingBal) {
        this.X1 = this.outStandingBal;
        // this.F1 = Math.round(this.X1 * (this.A1 / (this.A1 + this.C1)));
        if ((this.A1 + this.C1) != 0) {
          this.F1 = this.X1 * (this.A1 / (this.A1 + this.C1));
          this.G1 = this.X1 - this.F1;
        }
        else {
          this.G1 = 0;
          this.F1 = this.X1;
        }
      }
      if (this.RefAmt) {
        this.Y1 = this.RefAmt;
      }
      if (this.outStandingBal && this.EligibleRef) {
        this.Z1 = this.EligibleRef;
        // this.H1 = Math.round(this.Z1 * (this.A1 / (this.A1 + this.C1)));
        if ((this.A1 + this.C1) != 0) {
          this.H1 = (this.Z1 * (this.A1 / (this.A1 + this.C1)));
          this.I1 = (this.Z1 - this.H1);
        } else {
          this.I1 = 0;
          this.H1 = this.Z1;
        }
        this.J1 = (this.F1 - this.H1);
        this.K1 = (this.G1 - this.I1);
        this.N1 = this.J1 + this.K1;
        this.getSlabNdRate();
      }
      this.getClaimsRemarks();
      // this.claimsInput = this.claimsCellData.sremarks;
      if (this.claimsCellData.sremarks != null) {
        this.claimsInput = this.claimsCellData.sremarks;
      }
      console.log("this.claimsCellData", this.claimsCellData);


    }
    if (this.isChecked === false) {
      this.refCheck = false;
      this.disableSaveSubmit = false;
      this.showChecked = 'No';
      this.showDisable = true;
      console.log("showDisable", this.showDisable);
      this.outStandingBal = 0;
      this.RefAmt = 0;
      this.EligibleRef = 0;

      this.X1 = this.outStandingBal;
      // this.F1 = Math.round(this.X1 * (this.A1 / (this.A1 + this.C1)));
      if ((this.A1 + this.C1) != 0) {
        this.F1 = this.X1 * (this.A1 / (this.A1 + this.C1));
        this.G1 = this.X1 - this.F1;
      }
      else {
        this.G1 = 0;
        this.F1 = this.X1;
      }
      this.Y1 = this.RefAmt;
      this.Z1 = this.EligibleRef;
      if ((this.A1 + this.C1) != 0) {
        this.H1 = Math.round(this.Z1 * (this.A1 / (this.A1 + this.C1)));
        this.I1 = Math.round(this.Z1 - this.H1);
      } else {
        this.I1 = 0;
        this.H1 = this.Z1;
      }
      this.J1 = this.F1 - this.H1;
      this.K1 = this.G1 - this.I1;
      this.N1 = this.J1 + this.K1;
      this.L1 = (this.claimsCellData?.intSub3Sum - this.claimsCellData?.intSub3RevSum);
      this.M1 = (this.claimsCellData?.intSub5Sum - this.claimsCellData?.intSub5RevSum);
      this.O1 = Math.round(this.L1 + this.M1);
      console.log(this.L1);
      console.log(this.M1);
    }
  }
  // function downloadDocument(res, fileType, fileName) {
  //   const blob = new Blob([res.body], { type: fileType });
  //   const url = window.URL.createObjectURL(blob);

  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = fileName; // You can set the desired filename here
  //   link.click();

  //   window.URL.revokeObjectURL(url);
  // }

  // // Example usage:
  // const response = { body: /* Your document's binary data here */ };
  // const fileType = "application/pdf"; // Replace this with the actual file type
  // const fileName = "example"; // Replace this with the desired filename (without the extension)

  // downloadDocument(response, fileType, fileName);

  getSlab1Data() {
    const qtrEnding = this.claimsCellData?.qtrEnding;
    const formattedDate = this.datePipe.transform(qtrEnding, 'dd-MM-yyyy');
    console.log(formattedDate);
    this.entityService.getSlab1CertifiedData(formattedDate, this.bankCode, this.refId)
      .subscribe((res: any) => {
        this.slab1Data = res?.data;
        console.log('slab1', this.slab1Data);
        this.formattedToDate = this.datePipe.transform(this.slab1Data[0]?.ToPeriod, 'MMM-YY');
        console.log(this.formattedToDate);
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
  }
  getSlab2Data() {
    const qtrEnding = this.claimsCellData?.qtrEnding;
    const formattedDate = this.datePipe.transform(qtrEnding, 'dd-MM-yyyy');
    console.log(formattedDate);
    this.entityService.getSlab2CertifiedData(formattedDate, this.bankCode, this.refId)
      .subscribe((res: any) => {
        this.slab2Data = res?.data;
        console.log('slab2', this.slab2Data);
      this.formattedToDate = this.datePipe.transform(this.slab2Data[0]?.ToPeriod, 'MMM-YY');
      console.log(this.formattedToDate);
      },
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      })
  }

  downloadPdf(slabType: string): void {
    if (slabType === 'slab1') {
      this.generateAndDownloadPdf(this.slab1pdf, 'slab1_'+this.bankCode + '_'+this.formattedToDate+'.pdf');
    } else if (slabType === 'slab2') {
      this.generateAndDownloadPdf(this.slab2pdf, 'slab2_'+this.bankCode+ '_'+this.formattedToDate+'.pdf');
    }
    else if(slabType === 'claimsummary'){
      let qtrmonth = this.datePipe.transform(this.newBankdata, 'MMM');
      let qtrYear = this.datePipe.transform(this.newBankdata, 'YYYY');
      let newQtrYr = qtrYear?.toString().slice(-2);
      this.generateAndDownloadPdf(this.pdfContent, 'claims Summary_' +  this.bankCode +'_'+qtrmonth+'-'+newQtrYr+ '.pdf');
    }
  }
  generateAndDownloadPdf(content: ElementRef, filename: string): void {
    html2canvas(content.nativeElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * width) / canvas.width;
      const verticalOffset = 10;
      pdf.addImage(imgData, 'PNG', 0, verticalOffset, width, pdfHeight);
      pdf.save(filename);
    });
  }

cancelUpload() {  
  this.documentSelected = null;
  this.documentSize = null;
  this.selectedFile = null;
  this.selectedFileName = '';
  this.disableUpload = false;
  this.uploadForm.get('files')?.reset();
  const fileInput = this.fileInputRef.nativeElement;
  fileInput.value = '';
}
}