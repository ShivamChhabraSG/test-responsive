import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { CellClickedEvent, FirstDataRenderedEvent, GridReadyEvent, GridApi, ColDef, GridOptions, PaginationChangedEvent, } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
// import { Component, ViewChild, ElementRef } from '@angular/core';
// import html2pdf from 'html2pdf.js';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { MatDialog } from '@angular/material/dialog';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Injectable} from '@angular/core';
// @ts-ignore
import printDoc from 'src/assets/js/printDoc';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { number } from 'mathjs';
import { DateFormatWithoutTimeService } from '../services/date-format-without-time.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

// import {MatDatepickerModule} from '@angular/material/datepicker';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatNativeDateModule} from '@angular/material/core';


@Component({
  selector: 'app-claims-settlement',
  templateUrl: './claims-settlement.component.html',
  styleUrls: ['./claims-settlement.component.css'],
})
export class ClaimsSettlementComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;

  convertToPdf() {
    const content = this.pdfContent.nativeElement;
    const pdfOptions = { background: 'white', scale: 1 }; // Adjust scale as needed

    html2canvas(content, pdfOptions).then((canvas: any) => {
      const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
      const imgData = canvas.toDataURL('image/png');
      // Adjust the width of the PDF page
      const customPdfWidth = 200; // Set your custom width in millimeters
      const pdfHeight = (canvas.height * customPdfWidth) / canvas.width;
      const bankCode = this.celldata?.bankCode
      let qtrmonth = this.datePipe.transform(this.newBankdata, 'MMM');
      let qtrYear = this.datePipe.transform(this.newBankdata, 'YYYY');
      let newQtrYr = qtrYear?.toString().slice(-2);
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 20, 20, customPdfWidth, pdfHeight);
      pdf.save('settlement summary_' +  bankCode +'_'+qtrmonth+'-'+newQtrYr+ '.pdf');
    });
  }
  now: any;
  bankCode: any = [];
  FYstart: any;
  FYend: any;
  selectedYear!: number;
  years: number[] = [];
  range = [];
  display = true;
  fileInput: any;

  file: File | null = null;
  @ViewChild('agGrid')
  isOpen = true;
  agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  myForms!: FormGroup;
  bankSelect!: FormGroup;
  tokenExpireyTime: any;
  formGroup!: FormGroup;
  select: any = [];
  levelsData: any = [];
  tabEvent: any;
  viewDisabled: boolean = true;
  selectedLevelData: any = [];
  logoutResponse: any;
  entitlements: any = [];
  disabledFields: any;
  authorizePermission: boolean = false;
  parentUnit: any;
  Level: any;
  parentLevelsData: any = [];
  changeLevelIden: boolean = false;
  showComponent: any;
  uploadPermission: boolean = false;
  fileView: boolean = false;
  fyend: any = '';
  loginUserId: any;
  entityStatus: any;
  makerId: any;
  StatusName: any = [];
  rolesToken: any = [];
  claimsAmtSlab1: any;
  claimsAmtSlab2: any;
  totalClaimsAmt: any;
  downloadPdfData: any = [];
  disabledTable: boolean = false;
  slab1Data: any;
  slab2Data: any;
  isButtonDisabled: boolean = true;
  showSelectedRegion : any;
  showSelectedBank : any;
  isDropdownOpen : boolean = false
  isBankDropdownOpen : boolean = false
  toppingList = [
    { field: 'fyEnding', label: 'FY Ending' },
    { field: 'qtrEnding', label: 'Qtr Ending' },
    { field: 'bank', label: 'Bank' },
    { field: 'claimsCount', label: 'Claims Count' },
    { field: 'statusDesc', label: 'Status' },
    { field: 'maker', label: 'Maker' },
    { field: 'checker', label: 'Checker' },
    { field: 'makerTime', label: 'Maker Time' },
    { field: 'checkerTime', label: 'Checker Time' },
  ];

  columnDefs: ColDef[] = [
    {
      headerName: 'Approval Ref No.',
      field: 'approvalRefNo',
      tooltipField: 'approvalRefNo',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 150,
    },
    {
      headerName: 'FY Ending',
      field: 'fyEnding',
      tooltipField: 'fyEnding',
      cellRenderer: (data: any) => {
        return this.dateFormatServiceWthoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 120,
    },
    {
      headerName: 'Qtr Ending',
      field: 'qtrEnding',
      tooltipField: 'qtrEnding',
      cellRenderer: (data: any) => {
        return this.dateFormatServiceWthoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 120,
    },
    {
      headerName: 'Bank',
      field: 'bank',
      tooltipField: 'bank',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 150,
    },
    {
      headerName: 'Approval Status',
      field: 'approvalStatusDesc',
      tooltipField: 'approvalStatusDesc',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 200,
    },
    {
      headerName: 'Payment Status',
      field: 'paymentStatusDesc',
      tooltipField: 'paymentStatusDesc',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      // floatingFilter: true,
      width: 150,
    },

    {
      headerName: 'Approved Claim Amount',
      field: 'approvalClaimAmnt',
      tooltipField: 'approvalClaimAmnt',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agDateColumnFilter',
      // floatingFilter: true,
      resizable: true,
      width: 200,
    },
    {
      headerName: 'Approval Date',
      field: 'approvalDate',
      tooltipField: 'approvalDate',
      cellRenderer: (data: any) => {
        if (data.value !== null && data.value !== undefined) {
          return this.dateFormatServiceWthoutTime.dateformat(data.value);
        } else {
          return '';
        }
      },
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 130,
    },
    {
      headerName: 'Payment Date',
      field: 'paymentDate',
      tooltipField: 'paymentDate',
      cellRenderer: (data: any) => {
        if (data.value !== null && data.value !== undefined) {
          return this.dateFormatServiceWthoutTime.dateformat(data.value);
        } else {
          return '';
        }
      },
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 130,
    },
    {
      headerName: 'Approval Remarks',
      field: 'approvalRemarks',
      tooltipField: 'approvalRemarks',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 180,
    },
    {
      headerName: 'Maker',
      field: 'maker',
      tooltipField: 'maker',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 100,
    },
    {
      headerName: 'Maker Time',
      field: 'makerTime',
      tooltipField: 'makerTime',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 130,
    },
    {
      headerName: 'Checker',
      field: 'checker',
      tooltipField: 'checker',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 100,
    },
    {
      headerName: 'Checker Time',
      field: 'checkerTime',
      tooltipField: 'checkerTime',
      editable: false,
      suppressSizeToFit: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      // floatingFilter: true,
      width: 130,
    },
  ];

  gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    defaultColDef: {
      resizable: true,
      filter: true,
      sortable: true,
      floatingFilter: true,
    },

    onGridReady: (params) => {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
  };
  public defaultColDef: ColDef = {
    suppressSizeToFit: true,
    filter: 'agTextColumnFilter',
    // flex: 8,
    // resizable: true,
    sortable: true,
  };
  gridColumnApi: any;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  public pageSize = 20;
  onPageSizeChanged(params: PaginationChangedEvent) {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridOptions.api!.paginationSetPageSize(Number(value));
  }
  disabled = false;
  selectedItems: any = [];
  tomorrow = new Date();
  constructor(
    private dateFormatService: DateFormatServiceService,
    private dateFormatServiceWthoutTime: DateFormatWithoutTimeService,
    private entityGridService: SharedEntityServiceService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private entityService: EntityScreenServiceService,
    private datePipe: DatePipe
  ) {
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);

    this.tokenExpireyTime = sessionStorage.getItem(
      'tokenExpirationTimeInMinutes'
    );
    this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
  }
  selectedItemsArray: any = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownSettingsBank: IDropdownSettings = {};
  data: any = [];
  viewPermission: boolean = false;
  AddPermission: boolean = false;
  EditPermission: boolean = false;

  qtrselected: any = '';
  qtrEnding(data: any) {
    let datas = this.selectedQtrEnd;
    let item = this.datePipe.transform(datas, 'dd-MM-yyyy');
    console.log('Dataaaa', item);
    this.qtrselected = item;
  }

  fyendyearpopup: any;
  selectedFyEnd: any;
  selectedQtrEnd: any;
  qtdata: any = [];
  onSelectFinancialYearpopup() {
    let fyEnd = this.selectedFyEnd;
    let selectedDate = this.datePipe.transform(fyEnd, 'dd-MM-yyyy');
    this.fyendyearpopup = selectedDate;
    console.log(this.fyendyearpopup);
    //this.selectedFyEnd = this.datePipe.transform(this.fyendyearpopup,'dd MMM YYYY');
    this.entityService.getQtYear(this.fyendyearpopup).subscribe(
      (res: any) => {
      console.log(res);
      this.qtdata = res.data;
      console.log('QTRENd', this.qtdata);
      this.qtrselected = this.qtdata[0];
      this.selectedQtrEnd = this.datePipe.transform(
        this.qtrselected,
        'dd MMM YYYY'
      );
      this.qtrselected = this.datePipe.transform(
        this.qtrselected,
        'dd-MM-YYYY'
      );
      this.getClaimsProcessGridData();
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
    });
    console.log('qtrDataa', this.fyend);
  }

  qtrData: any[] = [];
  getqtrEnding() {
    this.entityService.getqtrEnding().subscribe(
      (res: any) => {
        this.startYears = [res.data.pastYears];
        let start: any = [res.data.pastYears];
        let end: any = [res.data.curFyEnd];
        this.startYears = Array.from(
          { length: end - start + 1 },
          (_, i) => end - i
        );
        let currfyend: any = res.data.curFyEnd;
        this.selectedStartYear = res.data.pastFyStart;
        this.selectedEndYear = res.data.curFyEnd;

        if (res.success === true) {
          let data = res?.data;
          console.log('Dataaaaaaa', data);
          if (data.q1) {
            let obj: any = {
              item: data.q1,
              id: 1,
            };
            this.qtrData.push(obj);
          }

          if (data.q2) {
            let obj: any = {
              item: data.q2,
            };
            this.qtrData.push(obj);
          }

          if (data.q3) {
            let obj: any = {
              item: data.q3,
            };
            this.qtrData.push(obj);
          }

          if (data.q4) {
            let obj: any = {
              item: data.q4,
            };
            this.qtrData.push(obj);
          }
          // this.qtrData = res?.data;

          console.log('qtrData', this.qtrData);
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
  ngOnInit() {
    this.getunits();
    this.getfinendingForpopup();
    // this.getClaimsProcessGridData();
    this.downloadPdfData = sessionStorage.getItem('allData');
    console.log('downLoadPdfData', this.downloadPdfData);
    this.rolesToken = sessionStorage.getItem('TokenDetals');
    this.rolesToken = JSON.parse(this.rolesToken ? this.rolesToken : '');
    console.log('RolesToken', this.rolesToken);
    console.log('this.tokenExpireyTime', this.tokenExpireyTime);
    let data: any = sessionStorage.getItem('sideNavbar');
    console.log('sideNavBarData', data);
    this.loginUserId = sessionStorage.getItem('loginUserId');
    console.log('LoginUSer', this.loginUserId);
    this.entitlements = JSON.parse(data ? data : '');
    this.entitlements.forEach((elements: any) => {
      // debugger
      if (elements == 'View') {
        this.viewPermission = true;
      } else if (elements == 'Add') {
        this.AddPermission = true;
      } else if (elements == 'Edit') {
        this.EditPermission = true;
        if (this.EditPermission == true) {
          sessionStorage.setItem('EditPermission', 'EditTrue');
        }
      } else if (elements === 'Authorize') {
        this.authorizePermission = true;
      } else if (elements == 'FileUpload') {
        this.uploadPermission = true;
      } else if (elements == 'FileView') {
        this.uploadPermission = true;
      }
      // Authorize
    });
    console.log('Entitlements', this.entitlements);

    this.myForms = this.fb.group({
      name: [''],
      name1: [''],
      name2: [''],
    });
    this.bankSelect = this.fb.group({
      bank: [''],
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'field',
      textField: 'label',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      limitSelection: -1,
      enableCheckAll: true,
      itemsShowLimit: 1,
    };
    //Bank Dropdown
    // this.dropdownSettingsBank = {
    //   singleSelection: false,
    //   idField: 'unit',
    //   textField: 'unitName',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   limitSelection: -1,
    //   enableCheckAll: true,
    //   itemsShowLimit: 1,
    // };
    // this.setForm()
    this.selectedItemsArray.push('Unit');

    this.myForms.patchValue({
      name: this.toppingList,
    });
    // this.getSghCodes()
    // this.resetPinned();
    // this.bankSelect.patchValue({
    //   bank: this.unitsData
    // })
  }
  EffectiveDate: any;
  bankData: any;
  claimsCellDataQtrEnding:any;
  claimsCellDataQtrEndingYear:any;
  extendedyr:any;
  totalSoNo1Nd4:any;
  cellInt3Data:any;
  cellInt5Data:any;
  refinance:any;
  newBankdata:any;
  getSlabNdRate() {
    this.bankData = this.celldata.bank;
    this.claimsCellDataQtrEnding = this.celldata.qtrEnding;
    console.log("this.claimsCellDataQtrEnding", this.claimsCellDataQtrEnding)
    this.claimsCellDataQtrEnding = this.claimsCellDataQtrEnding.split('-')[1];
    if (this.claimsCellDataQtrEnding !== '03') {
      this.claimsCellDataQtrEndingYear = this.celldata.qtrEnding.split('-')[0];
      this.extendedyr = Number(this.claimsCellDataQtrEndingYear) + 1;
      this.extendedyr = (this.extendedyr % 100).toString().padStart(2, '0');
    }
    else {
      this.claimsCellDataQtrEndingYear = this.celldata.qtrEnding.split('-')[0];
      this.extendedyr = Number(this.claimsCellDataQtrEndingYear) - 1;
      this.extendedyr = (this.extendedyr % 100).toString().padStart(2, '0');
    }
    this.EffectiveDate = this.celldata.qtrEnding;
    this.newBankdata = this.datePipe.transform(
      this.EffectiveDate,
      'dd MMM YYYY'
    );
    this.totalSoNo1Nd4 = Number(this.celldata?.m3s1Sum)+Number(this.celldata?.m3s2Sum);
    this.cellInt3Data = Number(this.celldata?.intSub3Sum)-Number(this.celldata?.intSub3RevSum);
    this.cellInt5Data = Number(this.celldata?.intSub5Sum)-Number(this.celldata?.intSub5RevSum);
    let refinanceData = this.celldata?.refinance;
    if(refinanceData === 1) {
      this.refinance = 'Yes';
    }
    else {
      this.refinance ='No';
    }
    this.EffectiveDate = this.datePipe.transform(
      this.EffectiveDate,
      'dd-MM-YYYY'
    );
    this.entityService.ClaimsSlabNdRate(this.EffectiveDate).subscribe(
      (res: any) => {
        if (res) {
          let slabRateData = res?.data;
          let sv1Rate = slabRateData?.sv1Rate;
          let sv2Rate = slabRateData?.sv2Rate;
          this.L1 = (this.J1 * (sv1Rate / 36500));
          this.M1 = (this.K1 * (sv2Rate / 36500));
          this.O1 = (this.L1 + this.M1);

          // sessionStorage.setItem("allData",JSON.stringify(alldata));
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
  selectedStartYear: any;
  selectedEndYear: any;
  startYears: number[] = [];
  endYears: number[] = [];
  fyStart: any = '';
  fyEnd: string = '';
  recordStatus: any = '99';

  //Financial year ending
  startYearspopup: any = [];
  getfinendingForpopup() {
    this.entityService.getfyYearforpopup().subscribe(
      (res: any) => {
      this.startYearspopup = res.data;
      this.fyendyearpopup = this.rolesToken.fyEndingDate;
      this.selectedFyEnd = this.datePipe.transform(
        this.fyendyearpopup,
        'dd MMM YYYY'
      );
      this.fyendyearpopup = this.datePipe.transform(
        this.fyendyearpopup,
        'dd-MM-YYYY'
      );
      this.entityService
        .getQtYear(this.fyendyearpopup)
        .subscribe(
          (res: any) => {
          console.log(res);

          this.qtdata = res.data;
          console.log('QtrData', this.qtdata);
          this.qtrselected = this.rolesToken.qtrEndingDate;
          this.selectedQtrEnd = this.datePipe.transform(
            this.qtrselected,
            'dd MMM YYYY'
          );
          this.qtrselected = this.datePipe.transform(
            this.qtrselected,
            'dd-MM-YYYY'
          );
          this.getSettlementGridData();
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
        });
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
    });
  }

  ToggleHideShow() {
    this.showhide = !this.showhide;
    this.gridColumnApi.setColumnsVisible(['Unit'], this.showhide);
    this.gridApi.sizeColumnsToFit();
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
    this.entityGridService.listen().subscribe((m: any) => {
      console.log('RefreshData', m);
      setTimeout(() => {}, 2000);
    });
  }
  // select unit dropdown
  financialYear: any;
  bankStatus: any = '99';
  //get Record Status
  getRecordStatus(event: any) {
    this.recordStatus = event.unitCode;
    this.showSelectedRegion = event.unitName
    this.bankStatus = ''
    if(this.recordStatus === '99') {
     let bankLevel = 3;
     this.entityService.getClaimsDropDownInfo(bankLevel).subscribe((res: any) => {
       if (res.success == true) {
         if(res?.data.length === 1) {
           this.banksData = res?.data;
           this.bankStatus = this.banksData[0].unitCode;
           this.forAddBanksDropdown = res?.data;
           if(this.forAddBanksDropdown.length === 1) {
             this.addBanksStatus = this.forAddBanksDropdown[0].unitCode
           }
 
         } 
         else {
           this.forAddBanksDropdown = res?.data;
           let allbanks = {
             unitCode:'99',
             unitName:'All'
           }
           this.banksData = res?.data;
           console.log("RegionData",this.banksData);
           this.banksData.push(allbanks);
           console.log("RegionData",this.banksData);
           this.bankStatus ='99';
         }
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
 else {
  this.entityService.getBankDropDownInfo(this.recordStatus).subscribe(
    (res: any) => {
      console.log(res);
      if (res.success === true) {
        if (res.data.length === 1) {
          this.showSelectedBank =  res.data[0].unitName
          }
        if (res.data.length > 1) {
          let allBanks = {
            unitCode: '99',
            unitName: 'All'
          };
          this.bankStatus = '99';
          this.banksData = [allBanks, ...res.data];
          this.showSelectedBank =  res.data.unitName
        } else {
          this.banksData = res.data;
          this.bankStatus = res.data[0].unitCode;
        }
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
   //  this.financialYear=  this.recordStatus;
   //  console.log("recordStatus", this.recordStatus);
  }
  //getAddRecord Status
  addRecordStatus: any = [];
  addBanksStatus: any = [];

  getAddRecordStatus(event: any) {
    this.addRecordStatus = event.unitCode;
    this.addBanksStatus = '';
    //  alert(this.addRecordStatus)
    this.entityService.getBankDropDownInfo(this.addRecordStatus).subscribe(
      (res: any) => {
        console.log(res);
        if (res) {
          this.forAddBanksDropdown = res.data;
          this.banksData = res.data;
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
  //Select Bank Status
  getBankStatus(event: any) {
    this.bankStatus = event.unitCode;
    this.showSelectedBank = event.unitName
    // this.financialYear=  this.recordStatus;
    // console.log("recordStatus", this.recordStatus);
  }
  // addBanksStatus
  getAddBankStatus(event: any) {
    this.addBanksStatus = event.unitCode;
  }
  // getsUnits Info
  unitsData: any = [];
  bankListArray: any = [];
  bankAllArray: any[] = [];
  banksData: any = [];
  ClaimsProcessData: any = [];
  forAddBanksDropdown: any = [];
  getunits() {
    let regionLevel =2;
    this.entityService.getClaimsDropDownInfo(regionLevel).subscribe((res: any) => {
      console.log("Response",res)
      if (res.success === true) {
        if(res?.data.length === 1) {
          this.unitsData = res?.data;
          console.log("Region",this.unitsData)
          this.recordStatus = this.unitsData[0].unitCode; 
          this.addRecordStatus = this.unitsData[0].unitCode;
          this.showSelectedRegion = this.unitsData[0].unitName
          this.showSelectedBank = this.unitsData[0].unitName         
        }
        else {
          let Regions = {
            unitCode:'99',
            unitName:'All'
          }
          this.unitsData = res?.data;
          console.log("RegionData",this.unitsData);
          this.unitsData.push(Regions);
          console.log("RegionData",this.unitsData);
          this.recordStatus ='99';
          this.addRecordStatus = '99';
        }

        let localdata = res.data;
        this.bankListArray = localdata.map((data: { unitCode: any; unitName: any; }) => {
          return { unit: data.unitCode, unitName: data.unitName };
        });
        this.bankListArray.push()
        this.bankListArray.forEach((element: { unit: any; }) => {
          return this.bankAllArray.push(element.unit);
        })
        console.log("BankListArray", this.bankAllArray);
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
    let bankLevel = 3;
    this.entityService.getClaimsDropDownInfo(bankLevel).subscribe((res: any) => {
      if (res.success === true) {
        if(res?.data.length === 1) {
          this.banksData = res?.data;
          this.bankStatus = this.banksData[0].unitCode;
          this.showSelectedBank = this.banksData[0].unitName;
          this.forAddBanksDropdown = res?.data;
          if(this.forAddBanksDropdown.length === 1) {
            this.addBanksStatus = this.forAddBanksDropdown[0].unitCode
          }

        } 
        else {
          this.forAddBanksDropdown = res?.data;
          let allbanks = {
            unitCode:'99',
            unitName:'All'
          }
          this.banksData = res?.data;
          //console.log("RegionData",this.banksData);
          this.banksData.push(allbanks);
          //console.log("RegionData",this.banksData);
          this.bankStatus ='99';
        }
        // let localdata = res.data;
        // this.bankListArray = localdata.map((data: { unitCode: any; unitName: any; }) => {
        //   return { unit: data.unitCode, unitName: data.unitName };
        // });
        // this.bankListArray.push()
        // this.bankListArray.forEach((element: { unit: any; }) => {
        //   return this.bankAllArray.push(element.unit);
        // })
        // console.log("BankListArray", this.bankAllArray);
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

  getClaimsProcessGridData() {
    let cProLeLevel = 0;
    // alert(this.fyendyearpopup)
    // alert(this.qtrselected)
    this.entityService
      .getClaimsProcessData(this.fyendyearpopup, this.qtrselected, cProLeLevel)
      .subscribe((res: any) => {
        if (res) {
          this.ClaimsProcessData = res.data;
          console.log('ClaimsData', this.ClaimsProcessData);
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
      });
  }
  // getUploadedFiles
  uploadedfiles: any = [];
  submit() {
    // this.filterData();
    this.entityService
      .getShgCodesByYear(this.bankCode, this.fyStart, this.fyEnd)
      .subscribe((res: any) => {
        console.log('filteredData', res);
        this.getSghCodes();
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
      });
  }
  // getsghcodes by year
  getsghCodesbyYear() {
    // console.log(this.bankCode, this.fyStart, this.fyEnd);
    // this.entityService.getShgCodesByYear(this.bankCode, this.fyStart, this.fyEnd).subscribe((res: any) => {
    //   this.sghCodes = res.data;
    //   console.log(res.data);
    // })
    let cProLeLevel = 0;
    if (this.recordStatus === '99' && this.bankStatus === '99') {
      this.entityService
        .getClaimsProcessData(
          this.qtrselected,
          this.qtrselected,
          cProLeLevel
        )
        .subscribe(
          (res: any) => {
          if (res) {
            this.settlementGridData = res.data;
            console.log('ClaimsData', this.settlementGridData);
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
        });
    }
    if (this.recordStatus !== '99' && this.bankStatus === '99') {
      this.entityService
        .getClaimsProcessDataWithParentUnitCode(
          this.recordStatus,
          this.qtrselected,
          this.qtrselected,
          cProLeLevel
        )
        .subscribe(
          (res: any) => {
          if (res) {
            this.settlementGridData = res.data;
            console.log('ClaimsData', this.settlementGridData);
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
        });
    }
    if (this.recordStatus === '99' && this.bankStatus !== '99') {
      this.entityService
        .getClaimsProcessDataWithUnitCode(
          this.bankStatus,
          this.qtrselected,
          this.qtrselected,
          cProLeLevel
        )
        .subscribe(
          (res: any) => {
          if (res) {
            this.settlementGridData = res.data;
            console.log('ClaimsData', this.settlementGridData);
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
        });
    }
    if (this.recordStatus !== '99' && this.bankStatus !== '99') {
      this.entityService
        .getClaimsProcessDataWithUnitCodeNdparentUnit(
          this.recordStatus,
          this.bankStatus,
          this.qtrselected,
          this.qtrselected,
          cProLeLevel
        )
        .subscribe(
          (res: any) => {
          if (res) {
            this.settlementGridData = res.data;
            console.log('ClaimsData', this.settlementGridData);
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
        });
    }
  }

  // submitAccountsUpload
  submitAccountsData() {}

  // getShgCodes
  sghCodes: any = [];
  getSghCodes() {
    this.entityService.getShgCodes().subscribe(
      (res: any) => {
        console.log('ShgCodes', res);
        if (res.success === true) {
          this.sghCodes = res?.data;
          // console.log(this.sghCodes);
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

  // download pdf
  generatePDF(_: any) {
    let printOptions = {
      PDF_HEADER_COLOR: '#f8f8f8',
      PDF_INNER_BORDER_COLOR: '#dde2eb',
      PDF_OUTER_BORDER_COLOR: '#babfc7',
      PDF_LOGO: '',
      PDF_PAGE_ORITENTATION: 'landscape',
      PDF_WITH_HEADER_IMAGE: false,
      PDF_WITH_FOOTER_PAGE_COUNT: true,
      PDF_HEADER_HEIGHT: 25,
      PDF_ROW_HEIGHT: 15,
      PDF_ODD_BKG_COLOR: '#fcfcfc',
      PDF_EVEN_BKG_COLOR: '#ffffff',
      PDF_WITH_CELL_FORMATTING: true,
      PDF_WITH_COLUMNS_AS_LINKS: true,
      PDF_SELECTED_ROWS_ONLY: false,
    };
    printDoc(printOptions, this.gridApi, this.gridColumnApi);
  }

  // download excel
  onBtnExport() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const exportParams = {
      fileName: `Files_${formattedDate}.csv`,
    };
    this.gridApi.exportDataAsCsv(exportParams);
  }

  // dropdown

  showhide: boolean = true;
  ColumnSelect(selectedField: any) {
    let item = selectedField.field;
    this.showhide = true;
    this.gridColumnApi.setColumnsVisible([item], this.showhide);
    this.gridApi.sizeColumnsToFit();
  }
  ColumnDeSelect(selectedField: any) {
    let item = selectedField.field;
    this.showhide = false;
    this.gridColumnApi.setColumnsVisible([item], this.showhide);
    this.gridApi.sizeColumnsToFit();
  }
  ColumnDeSelectOrAll(selectedFields: any) {
    let itemss = selectedFields.map((x: { field: any }) => x.field);
    this.showhide = false;
    this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    this.gridApi.sizeColumnsToFit();
  }
  ColumnSelectOrAll(selectedFields: any) {
    let itemss = selectedFields.map((x: { field: any }) => x.field);
    this.showhide = true;
    let items = ['Bank', 'FY Ending', 'Qtr End', 'Total Records'];
    this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    this.gridApi.sizeColumnsToFit();
  }

  //Bank Selector

  BankSelect(selectedField: any) {
    this.bankCode = selectedField.unit;
    this.gridApi.sizeColumnsToFit();
  }
  BankDeSelect(selectedField: any) {
    this.bankCode = selectedField.unit;
    this.gridApi.sizeColumnsToFit();
  }
  BankDeSelectOrAll() {
    this.bankCode = [];
    this.gridApi.sizeColumnsToFit();
  }
  BankSelectOrAll() {
    this.bankCode = this.bankAllArray;
    this.gridApi.sizeColumnsToFit();
  }

  // pinning list
  leftPinnedColumns: string[] = [];
  rightPinnedColumns: string[] = [];
  toppingListLeft: any[] = [
    { field: 'fyEnding', label: 'FY Ending' },
    { field: 'qtrEnding', label: 'Qtr Ending' },
    { field: 'bank', label: 'Bank' },
    { field: 'claimsCount', label: 'Claims Count' },
    { field: 'statusDesc', label: 'Status' },
    { field: 'maker', label: 'Maker' },
    { field: 'checker', label: 'Checker' },
    { field: 'makerTime', label: 'Maker Time' },
    { field: 'checkerTime', label: 'Checker Time' },
  ];
  toppingListRight: any[] = [
    { field: 'fyEnding', label: 'FY Ending' },
    { field: 'qtrEnding', label: 'Qtr Ending' },
    { field: 'bank', label: 'Bank' },
    { field: 'claimsCount', label: 'Claims Count' },
    { field: 'statusDesc', label: 'Status' },
    { field: 'maker', label: 'Maker' },
    { field: 'checker', label: 'Checker' },
    { field: 'makerTime', label: 'Maker Time' },
    { field: 'checkerTime', label: 'Checker Time' },
  ];

  onItemSelect(selectedField: any, type: string) {
    let item = selectedField.field;
    console.log('Itemmm', item);
    if (type == 'left') {
      this.leftPinnedColumns.push(item);
      this.toppingListRight = this.toppingListRight.filter(
        (x: any) => x.field != item
      );

      // this.toppingListRight.pop(item)
    } else {
      this.rightPinnedColumns.push(item);
      this.toppingListLeft = this.toppingListLeft.filter(
        (x: any) => x.field != item
      );
    }

    this.updatedColumnPinned();
  }
  onItemDeSelect(selectedField: any, type: string) {
    let item = selectedField.field;
    let obj: any = { field: selectedField.field, label: selectedField.label };
    if (type == 'left') {
      this.leftPinnedColumns = this.leftPinnedColumns.filter((x) => x != item);
      // debugger;
      this.toppingListRight.push(obj);
    } else {
      this.rightPinnedColumns = this.rightPinnedColumns.filter(
        (x) => x != item
      );
      this.toppingListLeft.push(obj);
    }
    this.updatedColumnPinned();

    // this.showhide = false;
    // this.gridColumnApi.setColumnsVisible([item], this.showhide);
    // this.gridApi.sizeColumnsToFit();
  }
  onItemDeSelectOrAll(items: any, type: string) {
    // this.showhide = false;
    // let itemss = ['Unit', 'IFSC', 'Level', 'Parent Unit', 'Unit Name', 'Maker', 'Checker', 'Record Status', 'Pin Code', 'Email', 'District', 'State', 'Status', 'Maker time', 'Checker Time'];
    // itemss.forEach((item: any) => {
    //   if (item == 'Pin Code') {
    //     item = 'Pin_Code'
    //   }
    //   if (item == 'Unit Name') {
    //     item = 'Unit_Name'
    //   }
    //   if (item == 'Parent Unit') {
    //     item = 'Parent_Unit'
    //   }
    //   if (item == 'Maker time') {
    //     item = 'maker_time'
    //   }
    //   if (item == 'Checker Time') {
    //     item = 'checker_time'
    //   }
    //   if (item == 'Record Status') {
    //     item = 'Record_status'
    //   }
    // })
    // this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    // this.gridApi.sizeColumnsToFit();
  }
  onItemSelectOrAll(itemss: any, type: string) {
    // itemss.forEach((item: any) => {
    //   if (item == 'Pin Code') {
    //     item = 'Pin_Code'
    //   }
    //   if (item == 'Unit Name') {
    //     item = 'Unit_Name'
    //   }
    //   if (item == 'Parent Unit') {
    //     item = 'Parent_Unit'
    //   }
    //   if (item == 'Maker time') {
    //     item = 'maker_time'
    //   }
    //   if (item == 'Checker Time') {
    //     item = 'checker_time'
    //   }
    //   if (item == 'Record Status') {
    //     item = 'Record_status'
    //   }
    // })
    // console.log('onItemSelect', itemss);
    // this.showhide = true;
    // let items = ['Unit', 'IFSC', 'Level', 'Parent Unit', 'Unit Name', 'Maker', 'Checker', 'Record Status', 'Pin Code', 'Email', 'District', 'State', 'Status', 'Maker time', 'Checker Time'];
    // this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    // this.gridApi.sizeColumnsToFit();
  }
  updatedColumnPinned() {
    let state: any = [];
    this.leftPinnedColumns.forEach((columnField) => {
      state.push({ colId: columnField, pinned: 'left' });
    });

    this.rightPinnedColumns.forEach((columnField) => {
      state.push({ colId: columnField, pinned: 'right' });
    });

    this.gridColumnApi.applyColumnState({
      state: state,
      defaultState: { pinned: null },
    });
  }
  paymentDate: any;
  getPaymentDate(): string {
    this.paymentDate = this.paymentDate;
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    // If the current date is later than today, return today's date
    const currentDate = new Date(todayISO);
    if (currentDate > today) {
      return this.formatDate(today);
    }

    // If the current date is today or earlier, return the current formatted date
    return this.formatDate(currentDate);
  }
  formatDate(date: Date): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }
  paymentDateSelected() {
    this.paymentDate = this.paymentDate;
    // this.paymentDate = this.datePipe.transform(this.paymentDate,'dd MMM YYYY');
  }
  approvalDate: any;
  getApprovalDate(): string {
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    // If the current date is later than today, return today's date
    const currentDate = new Date(todayISO);
    if (currentDate > today) {
      return todayISO;
    }
    //   this.approvalDate = currentDate;
    //  console.log("ApprovalDate",this.approvalDate)
    // If the current date is today or earlier, return the current date
    return currentDate.toISOString().split('T')[0];
  }

  // getApprovalDate(): string {
  //   const today = new Date();
  //   const todayISO = today.toISOString().split('T')[0];

  //   // Return the current date or previous date, never future date
  //   return todayISO;
  // }
  approvalDateSelected() {
    this.approvalDate = this.approvalDate;
  }
  // search text
  searchText: any;
  onFilterTextBoxChanged(gridOptions: any, $event: any) {
    const { target } = $event;
    this.searchText = target.value;
    console.log(' this.searchText', this.searchText);
    this.gridApi.setQuickFilter(target.value);
  }

  celldata: any;

  downloadRecord() {
    let isView = JSON.stringify(false);
    let fyEnd = this.datePipe.transform(this.celldata.fyEnding, 'dd-MM-yyyy');
    let qtrEnd = this.datePipe.transform(this.celldata.qtrEnding, 'dd-MM-yyyy');
    console.log(this.celldata.bankCode, fyEnd, qtrEnd, isView);
    this.entityService
      .downloadshgCodes(this.celldata.bankCode, fyEnd, qtrEnd, isView)
      .then((res: any) => {
        const blob = new Blob([res], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.celldata.bank;
        link.click();
        window.URL.revokeObjectURL(url);
      }).catch(
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
      });
  }

  // icon functionality
  ClaimsView:any;
  viewClaimsData() {
    this.ClaimsView = 'viewClaims';
  }
  editClaimsData() {
    this.ClaimsView = '';
  }
  addEntity() {
    // alert(this.addRecordStatus);
    // alert(this.addBanksStatus);
    // alert(this.fyendyearpopup);
    // alert(this.qtrselected)
    // sessionStorage.setItem('entityData', 'addData');
    this.entityService
      .AddClaimsProcessing(
        this.addBanksStatus,
        this.fyendyearpopup,
        this.qtrselected
      )
      .subscribe((res: any) => {
        if (res.success == true) {
          let AddResponse = res.data;
          alert('Claims Added Successfully');
          console.log('Add Response', AddResponse);
          window.location.reload();
        }
        if (res.success == false) {
          alert(res.message);
          window.location.reload();
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
      });
    //  AddClaimsProcessing
  }
  EditEntity() {
    let auth = false;
    sessionStorage.setItem('entityData', 'editData');
    // this.celldata?.pending
    sessionStorage.setItem('Pending', this.celldata?.pending);
    sessionStorage.setItem('ClaimsAuth', JSON.stringify(false));
    sessionStorage.setItem('ClaimsView', JSON.stringify(true));
    this.router.navigate(['/add-claims-processing']);
  }
  DeleteEntity() {
    sessionStorage.setItem('entityData', 'deleteData');
    this.router.navigate(['/add-entity']);
  }
  AuthorizeEntity() {
    sessionStorage.setItem('ClaimsAuth', JSON.stringify(true));
    sessionStorage.setItem('ClaimsView', JSON.stringify(true));
    this.router.navigate(['/add-claims-processing']);
  }
  UploadEntity() {
    sessionStorage.setItem('entityData', 'authorizeData');
    sessionStorage.setItem('editPermission', JSON.stringify(this.EditPermission));
    sessionStorage.setItem('uploadFileType', 'nrlm');
    this.router.navigate(['/nrlm-upload-screen']);
  }

  // cell clicked
  showhided: boolean = false;
  H1: any;
  F1: any;
  G1: any;
  I1: any;
  J1: any;
  K1: any;
  N1: any;
  L1: any;
  M1: any;
  O1: any;
  onCellClicked(event: CellClickedEvent) {
    this.showhided = true;
    console.log(event);
    this.celldata = event.data;
    console.log("slab",this.celldata);
    
    let sumAndC = Number(this.celldata?.m3s1Sum) + Number(this.celldata?.m3s2Sum);
      if(sumAndC != 0){
        this.F1 = (this.celldata?.ui1 * (this.celldata?.m3s1Sum / sumAndC));
        this.G1 = (this.celldata?.ui1 - this.F1);
        this.H1 = (
          this.celldata?.ui3 * (this.celldata?.m3s1Sum / sumAndC)
        );
        this.I1 = (this.celldata?.ui3 - this.H1);
      }else{
        this.G1 = 0;
        this.F1 = this.celldata?.ui1;
        this.I1 = 0;
        this.H1 = this.celldata?.ui3;
      }
    this.J1 = this.F1 - this.H1;
    this.K1 = this.G1 - this.I1;
    this.N1 = this.J1 + this.K1;
    console.log('H1', this.H1);
    console.log('F1', this.F1);
    console.log('celllllllldata', this.celldata);
    this.getSlabNdRate();
    this.makerId = this.celldata?.settlementMaker;
    this.makerId = this.makerId?.split('-')[0];
    if (this.EditPermission === true || this.authorizePermission === true) {
      this.refNo = this.celldata?.approvalRefNo;
      this.approveClaimAmt = this.celldata?.approvalClaimAmnt;
          // Format the number to Indian currency format
    this.approveClaimAmt = new Intl.NumberFormat('en-IN', {
      currency: 'INR'
    }).format(this.approveClaimAmt);
      this.paymentDate = this.celldata?.paymentDate;
      // if(this.celldata?.approvalDate === null) {
      //   this.approvalDate = '';
      // }
      // else {
      //   this.approvalDate = this.celldata?.approvalDate;
      // }
      this.approvalDate = this.celldata?.approvalDate;
      this.settlementRemarks = this.celldata?.approvalRemarks;
      this.claimsAmtSlab1 = Number(this.celldata?.claimsAmnt1);
      this.claimsAmtSlab2 = Number(this.celldata?.claimsAmnt2);
      this.totalClaimsAmt = Number((this.claimsAmtSlab1+this.claimsAmtSlab2).toFixed(2));

      console.log('CellData', this.celldata);
    }
    sessionStorage.setItem(
      'ClaimsProcessCellData',
      JSON.stringify(this.celldata)
    );
    // let effectiveDate = this.celldata.qtrEnding;
    // effectiveDate = this.datePipe.transform(effectiveDate,'dd-MM-YYYY')
    // sessionStorage.setItem("EffectiveData",effectiveDate);
    this.getSlab1Data();
    this.getSlab2Data()
  }
  settlementGridData: any = [];
  getSettlementGridData() {
    if (this.recordStatus === '99' && this.bankStatus === '99') {
      this.entityService
        .getClaimsSettlementWithAllBankAndRegion(
          this.qtrselected,
          this.fyendyearpopup
        )
        .subscribe((res: any) => {
          this.settlementGridData = res.data;
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
        });
    }
    if (this.recordStatus === '99' && this.bankStatus !== '99') {
      this.entityService
        .getClaimsSettlementWithAllegion(
          this.bankStatus,
          this.qtrselected,
          this.fyendyearpopup
        )
        .subscribe((res: any) => {
          this.settlementGridData = res.data;
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
        });
    }
    if (this.recordStatus !== '99' && this.bankStatus === '99') {
      this.entityService
        .getClaimsSettlementWithAllBanks(
          this.qtrselected,
          this.fyendyearpopup,
          this.recordStatus
        )
        .subscribe((res: any) => {
          this.settlementGridData = res.data;
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
        });
    }
    if (this.recordStatus !== '99' && this.bankStatus !== '99') {
      this.entityService
        .getClaimsSettlementWithSelectedBankAndRegion(
          this.bankStatus,
          this.qtrselected,
          this.fyendyearpopup,
          this.recordStatus
        )
        .subscribe((res: any) => {
          this.settlementGridData = res.data;
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
        });
    }
  }
  refNo: any;
  updateRefNo() {
    this.refNo = this.refNo;
    console.log(this.refNo);
  }
  approveClaimAmt: any;
  // approveClaimAmnt() {
  //   this.approveClaimAmt = this.approveClaimAmt
  // }
  approveClaimAmnt(event:any) {
    const input = event.target as HTMLInputElement;
    let value = input?.value;
  console.log("inputValue",value);
    // Remove non-numeric and non-decimal characters
    value = value?.replace(/[^0-9.]/g, '');
    console.log("replacedValue",value);
    // Ensure there is only one decimal point
    const parts = value?.split('.');
    console.log("PartsValue",parts);
    if (parts?.length > 1) {
      // Limit the decimal part to two digits
      parts[1] = parts[1]?.slice(0, 2);
      console.log("Parts1",parts[1]);
      value = parts?.join('.');
      console.log("PartsValue",value);
    } 
  // Convert the numeric value to Indian currency format with commas
  console.log("Valueeee",value)
  // const numericValue = parseFloat(value);
  // console.log("numericNumber",numericValue);

  // if (!isNaN(numericValue)) {
  //   console.log("Numeric Value",numericValue);
  //   value = numericValue.toLocaleString('en-IN', {currency: 'INR' });
  //   console.log("toLocaleString",value);
  // }

  input.value = value;
  this.approveClaimAmt = value;
  console.log("ApprovalClaimAmnt", this.approveClaimAmt);
  }
  // approveClaimAmnt(event:any) {
  //   const formatter = new Intl.NumberFormat('en-IN', {
  //     currency: 'INR',
  //     minimumFractionDigits: 2
  //   });

  //   this.approveClaimAmt = formatter.format(event.target.value);
  //   console.log("ApproveClaimsData",this.approveClaimAmt)
  // }
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
  settlementRemarks: any;
  settlementCheckerRemarks: any;
  AddsettlementRemarks() {
    this.settlementRemarks = this.settlementRemarks;
    console.log(this.settlementRemarks);
  }
  AddsettlementCheckerRemarks() {
    this.settlementCheckerRemarks = this.settlementCheckerRemarks;
    this.isButtonDisabled = this.settlementCheckerRemarks.trim().length === 0;
    console.log(this.settlementCheckerRemarks);
  }
  saveSettlement() {
    let approvalAction = 'E';
    this.paymentDate = this.datePipe.transform(this.paymentDate, 'dd-MM-YYYY');
    this.approvalDate = this.datePipe.transform(
      this.approvalDate,
      'dd-MM-YYYY'
    );
    const numericString = this.approveClaimAmt.replace(/[^\d.]/g, '');
    let approveClaimAmts = parseFloat(numericString);
    console.log("SettlementAccount",this.settlementRemarks)
    this.entityService
      .saveApprovalSettlementForSaveSubmitDel(
        this.celldata.refId,
        approvalAction,
        this.refNo,
        this.approvalDate,
        approveClaimAmts,
        this.paymentDate
      )
      .subscribe((res: any) => {
        // let saveSettlementResponse = res;
        if (res?.success == true) {
          const dialogRef = this.dialog.open(SuccessDialogComponent,{
            data:{
              saveSettlement : true,
              message :"Claim Settlement Saved Successfully"
            }
          })
        }
        console.log('SaveSettlement', res);
        // window.location.reload();
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
      });
      this.showhided = false
  }
  submitSettlement() {
    let approvalAction = 'S';
    this.paymentDate = this.datePipe.transform(this.paymentDate, 'dd-MM-YYYY');
    this.approvalDate = this.datePipe.transform(
      this.approvalDate,
      'dd-MM-YYYY'
    );
    const numericString = this.approveClaimAmt.replace(/[^\d.]/g, '');
    let approveClaimAmts = parseFloat(numericString);
    this.entityService
      .saveApprovalSettlementForSaveSubmitDel(
        this.celldata.refId,
        approvalAction,
        this.refNo,
        this.approvalDate,
        approveClaimAmts,
        this.paymentDate
      )
      .subscribe((res: any) => {
          // let saveSettlementResponse = res;
          if (res?.success == true) {
            const dialogRef = this.dialog.open(SuccessDialogComponent,{
              data:{
                submitSettlement : true,
                message :"Claim Settlement Submitted Successfully"
              }
            })
          }
          console.log('SaveSettlement', res);
          // window.location.reload();
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
        });
        this.showhided = false
  }
  // deleteSettlement() {
  //   let approvalAction = 'D';
  //   this.paymentDate = this.datePipe.transform(this.paymentDate, 'dd-MM-YYYY');
  //   this.approvalDate = this.datePipe.transform(
  //     this.approvalDate,
  //     'dd-MM-YYYY'
  //   );
  //   const numericString = this.approveClaimAmt.replace(/[^\d.]/g, '');
  //   let approveClaimAmts = parseFloat(numericString);
  //   this.entityService
  //     .saveApprovalSettlementForSaveSubmitDel(
  //       this.celldata.refId,
  //       approvalAction,
  //       this.refNo,
  //       this.approvalDate,
  //       approveClaimAmts,
  //       this.paymentDate
  //     )
  //     .subscribe((res: any) => {
  //       // let saveSettlementResponse = res;
  //       if (res?.success == true) {
  //         const dialogRef = this.dialog.open(SuccessDialogComponent,{
  //           data:{
  //             deleteSettlement : true,
  //             message :"Claim Settlement Submitted Successfully"
  //           }
  //         })
  //       }
  //       console.log('SaveSettlement', res);
  //       // window.location.reload();
  //     });
  //     this.showhided = false
  // }
  deleteSettlement() {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      data: {
        deleteSettlement: true,
        message: 'Do you really want to delete this Record',
        additionalData: {
          approvalAction: 'D',
          paymentDate: this.datePipe.transform(this.paymentDate, 'dd-MM-YYYY'),
          approvalDate: this.datePipe.transform(this.approvalDate, 'dd-MM-YYYY'),
          approveClaimAmts: parseFloat(this.approveClaimAmt.replace(/[^\d.]/g, '')),
          refId : this.celldata.refId,
          refNo : this.refNo,
        },
      },
    });
    this.showhided = false
  }
  
  messageSuccess: boolean = true;
  authorizeSettlement() {
    let approvalAction = 'A';
    this.paymentDate = this.datePipe.transform(this.paymentDate, 'dd-MM-YYYY');
    this.approvalDate = this.datePipe.transform(
      this.approvalDate,
      'dd-MM-YYYY'
    );
    const numericString = this.approveClaimAmt.replace(/[^\d.]/g, '');
    let approveClaimAmts = parseFloat(numericString);
    this.entityService
      .saveApprovalSettlementForAuthRej(
        this.celldata.refId,
        approvalAction,
        this.refNo,
        this.approvalDate,
        approveClaimAmts,
        this.paymentDate,
        this.settlementCheckerRemarks
      )
      .subscribe((res: any) => {
        if (res?.success == true) {
          const dialogRef = this.dialog.open(SuccessDialogComponent,{
            data:{
              authoriseSettlement : true,
              message :"Claim Settlement Authorised Successfully"
            }
          })
        }
        let saveSettlementResponse = res;
        this.getSettlementGridData();
        setTimeout(() => {
          this.messageSuccess = false;
        }, 1000);
        
        // window.location.reload();
        console.log('SaveSettlement', saveSettlementResponse);
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
      });
  }
  rejectSettlement() {
    let approvalAction = 'R';
    this.paymentDate = this.datePipe.transform(this.paymentDate, 'dd-MM-YYYY');
    this.approvalDate = this.datePipe.transform(
      this.approvalDate,
      'dd-MM-YYYY'
    );
    const numericString = this.approveClaimAmt.replace(/[^\d.]/g, '');
    let approveClaimAmts = parseFloat(numericString);
    this.entityService
      .saveApprovalSettlementForAuthRej(
        this.celldata.refId,
        approvalAction,
        this.refNo,
        this.approvalDate,
        approveClaimAmts,
        this.paymentDate,
        this.settlementCheckerRemarks
      )
      .subscribe((res: any) => {
        let saveSettlementResponse = res;
        if (res?.success == true) {
          const dialogRef = this.dialog.open(SuccessDialogComponent,{
            data:{
              rejectSettlement : true,
              message :"Claim Settlement Rejected Successfully"
            }
          })
        }
        this.getSettlementGridData();
        setTimeout(() => {
          this.messageSuccess = false;
        }, 1000);
        // window.location.reload();
        console.log('SaveSettlement', saveSettlementResponse);
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
      });
  }
  alldata = {
    outstandingAmountS1: 1,
    accountsS1: 2,
    outstandingAmountS2: 3,
    accountsS2: 4,
    totalAccounts: 5,
    totalOutstanding: 6,
    refinanceAmount: 7,
    productOutstanding: 8,
    sumProductSlab1: 9,
    sumProductSlab2: 10,
    totalProduct: 11,
    SumProductConcessionalSlab1: 12,
    SumProductConcessionalSlab2: 13,
    EligibleInterestSlab1: 14,
    totalProductAmount: 15,
    EligibleInterestSlab2: 16,
  };

  // generatePDF() {
  //   const content = this.pdfContent.nativeElement;
  //   const options = {
  //     margin: 10,
  //     filename: 'generated_document.pdf',
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  //   };

  //   html2pdf()
  //     .from(content)
  //     .set(options)
  //     .outputPdf()
  //     .then((pdf) => {
  //       // You can do something with the generated PDF, like showing it in a viewer or saving it.
  //     })
  //     .catch((error) => {
  //       console.error('Error generating PDF:', error);
  //     });
  // }
  formattedToDate : any
  getSlab1Data() {
    const qtrEnding = this.celldata?.qtrEnding;
    const formattedDate = this.datePipe.transform(qtrEnding, 'dd-MM-yyyy');
    const refId = this.celldata?.refId
    const bankCode = this.celldata?.bankCode
    this.entityService.getSlab1CertifiedData(formattedDate, bankCode,refId).subscribe((res: any) => {
        this.slab1Data = res?.data;
        console.log('slab1', this.slab1Data);
        this.formattedToDate = this.datePipe.transform(this.slab1Data[0]?.ToPeriod, 'MMM-YY');
        console.log(this.formattedToDate);
        
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
      });
  }
  getSlab2Data() {
    const qtrEnding = this.celldata?.qtrEnding;
    const formattedDate = this.datePipe.transform(qtrEnding, 'dd-MM-yyyy');
    const refId = this.celldata?.refId
    const bankCode = this.celldata?.bankCode
    this.entityService.getSlab2CertifiedData(formattedDate, bankCode,refId).subscribe((res: any) => {
        this.slab2Data = res?.data;
        console.log('slab2', this.slab2Data);
        this.formattedToDate = this.datePipe.transform(this.slab2Data[0]?.ToPeriod, 'MMM-YY');
        console.log(this.formattedToDate);
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
      });
  }

  @ViewChild('slab1pdf', { static: false }) slab1pdf!: ElementRef;
  @ViewChild('slab2pdf', { static: false }) slab2pdf!: ElementRef;
  downloadPdf(slabType: string): void {
    const bankCode = this.celldata?.bankCode
    if (slabType === 'slab1') {
      this.generateAndDownloadPdf(this.slab1pdf, 'slab1_'+bankCode + '_'+this.formattedToDate+'.pdf');
    } else if (slabType === 'slab2') {
      this.generateAndDownloadPdf(this.slab2pdf, 'slab2_'+bankCode + '_'+this.formattedToDate+'.pdf');

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
}
