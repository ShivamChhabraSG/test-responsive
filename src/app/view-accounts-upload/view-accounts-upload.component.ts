import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ColDef, GridOptions, PaginationChangedEvent, PaginationNumberFormatterParams } from 'ag-grid-community';
import { IDropdownSettings } from "ng-multiselect-dropdown/multiselect.model";
import { CellClassParams, CellClassRules, CellClickedEvent, CellValueChangedEvent, FirstDataRenderedEvent, GridReadyEvent, RowValueChangedEvent, SideBarDef, GridApi, ModuleRegistry, ColumnResizedEvent, Grid, } from 'ag-grid-community';
import { IconArrowComponent } from '../icon-arrow/icon-arrow.component';
import { AgGridAngular } from 'ag-grid-angular';
import * as jsPDF from 'jspdf';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutServiceService } from '../services/logout-service.service';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import { IStatusPanelParams } from "ag-grid-community";
import { left } from '@popperjs/core';
// @ts-ignore
import printDoc from "src/assets/js/printDoc";
import { UploadPopupComponent } from '../upload-popup/upload-popup.component';
import { DatePipe } from "@angular/common";
import { MatTabsModule } from '@angular/material/tabs';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { Papa } from 'ngx-papaparse';

@Component({
  selector: 'app-view-accounts-upload',
  templateUrl: './view-accounts-upload.component.html',
  styleUrls: ['./view-accounts-upload.component.css'],
  providers: [DatePipe]
})
export class ViewAccountsUploadComponent {
  now: any;
  recordStatus: any;
  FYstart: any;
  FYend: any;
  selectedYear!: number;
  years: number[] = [];
  range = [];
  display = true;
  selectedStartYear: number = 2023;
  selectedEndYear: number = 2024;
  startYears: number[] = [];
  endYears: number[] = [];


  selectedyear: any = ''
  onSelectFinancialYear(item: any) {
    this.selectedyear = '31-3-' + item.target.value
    console.log(this.selectedyear)
  }
  qtrselected: any = ''
  qtrEnding(item: any) {

    this.qtrselected = item.target.value
    console.log(item)
    this.qtrselected = this.datepipe.transform(this.qtrselected, 'dd-MM-yyyy')
    console.log(' this.qtrselected', this.qtrselected)

    console.log(item.target.value)
  }
  getRecordStatus(event: any) {
    this.recordStatus = event.statusId;
    console.log("recordStatus", this.recordStatus);
  }
  getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  @ViewChild('fileInput')
  fileInput: any;

  file: File | null = null;
  @ViewChild('agGrid')
  isOpen = true;
  agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  myForms!: FormGroup;
  showhide: boolean = true;
  tokenExpireyTime: any;
  formGroup!: FormGroup;
  select: any = [];
  levelsData: any = [];
  tabEvent: any;
  viewDisabled: boolean = true;
  selectedLevelData: any[] = [];
  logoutResponse: any;
  entitlements: any = [];
  disabledFields: any;
  authorizePermission: boolean = false;
  parentUnit: any;
  Level: any;
  parentLevelsData: any = [];
  changeLevelIden: boolean = false;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  // toppingList = ['Unit', 'IFSC', 'Level', 'Parent Unit', 'Unit Name', 'Maker', 'Checker', 'Record Status', 'Pin Code', 'Email', 'District', 'State', 'Status', 'Maker time', 'Checker Time'];

  toppingList = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];

  toppingListLeft: any[] = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];
  toppingListRight: any[] = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];

  tooltip: any;
  arrayLoop: any[] = [];

  public defaultPage = 20;


  
  onPageSizeChanged(event:any) {
    // var value = (document.getElementById('page-size') as HTMLInputElement)
    //   .value;
    this.gridApi.paginationSetPageSize(Number(this.defaultPage));
  }

  public paginationNumberFormatter: (
    params: PaginationNumberFormatterParams
  ) => string = (params: PaginationNumberFormatterParams) => {
    return '[' + params.value.toLocaleString() + ']';
  };
  dateComparator(date1: string, date2: string): number {
    const date1Object = new Date(date1);
    const date2Object = new Date(date2);
    return date1Object.getTime() - date2Object.getTime();
  }
  dateComparator2(date1: string, date2: string): number {
    const date1Object = new Date(date1);
    const date2Object = new Date(date2);
    return date1Object.getTime() - date2Object.getTime();
  }
  columnDefs: ColDef[] = [
    {
      headerName: 'S.No',
      field: 'Sl No',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Bank Code',
      field: 'bankCode',
      tooltipField: 'bankcode',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      
    },

    {
      headerName: 'Area Type',
      field: 'Area Type',
      tooltipField: 'Area Type',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Branch Code',
      field: 'branchcode',
      tooltipField: 'branchcode',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },

    {
      headerName: 'IFSC Code',
      field: 'Ifsc Code',
      tooltipField: 'Ifsc Code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },

    {
      headerName: 'NRLM SHG Code',
      field: 'Shg Code',
      tooltipField: '',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },

  ];
  uploadcolumnDefs: ColDef[] = [
    {
      headerName: 'S.No',
      field: 'sn',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Bank Code',
      field: 'Bank_code',
      tooltipField: 'Bank_code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },

    {
      headerName: 'Area Type',
      field: 'Area_Type',
      tooltipField: 'Area_Type',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Branch Code',
      field: 'Branch_code',
      tooltipField: 'Branch_code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },

    {
      headerName: 'IFSC Code',
      field: 'Branch_IFSC_Code',
      tooltipField: 'Branch_IFSC_Code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },

    {
      headerName: 'NRLM SHG Code',
      field: 'Nrlm_shg_code',
      tooltipField: 'Nrlm_shg_code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },

  ];
  columnDefss: ColDef[] = [
    {
      headerName: 'S.No',
      field: 'Sl No',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:100
    },
    {
      headerName: 'SHG Type',
      field: 'Shg Type',
      tooltipField: 'Shg Type',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:130
    },
    {
      headerName: 'Shg Name',
      field: 'Shg Name',
      tooltipField: 'shgname',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'SHG Customer',
      field: 'Shg Cust Id',
      tooltipField: 'shgcustomer',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'State Code',
      field: 'State Code',
      tooltipField: 'statecode',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:130
    },
    {
      headerName: 'District Code',
      field: 'District Code',
      tooltipField: 'districtcode',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'PinCode',
      field: 'pin code',
      tooltipField: 'pin code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    }
  ];
  UploadcolumnDefss: ColDef[] = [
    {
      headerName: 'S.No',
      field: 'sn',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:100
    },
    {
      headerName: 'SHG Type',
      field: 'SHG_Type',
      tooltipField: 'SHG_Type',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:130
    },
    {
      headerName: 'Shg Name',
      field: 'SHG_name',
      tooltipField: 'SHG_name',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'SHG Customer',
      field: 'SHG_Customer_ID',
      tooltipField: 'SHG_Customer_ID',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'State Code',
      field: 'State_code',
      tooltipField: 'State_code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:130
    },
    {
      headerName: 'District Code',
      field: 'District_code',
      tooltipField: 'District_code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'PinCode',
      field: 'Pin_code',
      tooltipField: 'Pin_code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    }
  ];
  columnDeffs: ColDef[] = [
    {
      headerName: 'S.No',
      field: 'Sl No',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:100
    },
    {
      headerName: 'SB Acc No',
      field: 'Sb Acc No',
      tooltipField: 'sbaccno',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:140
    },
    {
      headerName: 'Loan Acc Type',
      field: 'Loan Acc Type',
      tooltipField: 'loanacctype',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:170
    },
    {
      headerName: 'Loan Acc No',
      field: 'Loan Acc No',
      tooltipField: 'Loan Acc No',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Sanctioned Date',
      field: 'Sanctioned Date',
      tooltipField: 'sanctioneddata',
      cellRenderer: (data:any) =>
      { return this.dateFormatService.dateSanctionformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      comparator:this.dateComparator,
      width:180
    },
    {
      headerName: 'Loan Limit',
      field: 'Loan Limit',
      tooltipField: 'loanlimit',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Drawing Power',
      field: 'Drawing power',
      tooltipField: 'drawingpower',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:170
    },
    {
      headerName: 'ROI Slab-1',
      field: 'Roi Slab 1',
      tooltipField: 'roislab-1',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:140
    },
    {
      headerName: 'ROI Slab-2',
      field: 'Roi Slab 2',
      tooltipField: 'roi-slab-3',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:140
    },
    {
      headerName: 'ROI Slab-3',
      field: 'Roi Slab 3',
      tooltipField: 'roi-slab-2',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:140
    },

  ];

  UploadcolumnDeffs: ColDef[] = [
    {
      headerName: 'S.No',
      field: 'sn',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:100
    },
    {
      headerName: 'SB Acc No',
      field: 'SB_Account_number',
      tooltipField: 'SB_Account_number',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:140
    },
    {
      headerName: 'Loan Acc Type',
      field: 'Loan_Account_type',
      tooltipField: 'Loan_Account_type',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:170
    },
    {
      headerName: 'Loan Acc No',
      field: 'Loan_Account_number',
      tooltipField: 'Loan_Account_number',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Sanctioned Date',
      field: 'Loan_Sanction_date',
      tooltipField: 'Loan_Sanction_date',
      cellRenderer: (data:any) =>
      { return this.dateFormatService.dateSanctionformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      comparator:this.dateComparator,
      width:180
    },
    {
      headerName: 'Loan Limit',
      field: 'Loan_Limit',
      tooltipField: 'Loan_Limit',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Drawing Power',
      field: 'Drawing_power',
      tooltipField: 'Drawing_power',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:170
    },
    {
      headerName: 'ROI Slab-1',
      field: 'ROI_1',
      tooltipField: 'ROI_1',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:140
    },
    {
      headerName: 'ROI Slab-2',
      field: 'ROI_2',
      tooltipField: 'ROI_2',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:140
    },
    {
      headerName: 'ROI Slab-3',
      field: 'ROI_3',
      tooltipField: 'ROI_3',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:140
    },
    {
      headerName: 'Remarks',
      field: 'remarks',
      tooltipField: 'remarks',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:140
    },
    {
      headerName: 'Status',
      field: 'status',
      tooltipField: 'status',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:140
    },

  ];

  gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    defaultColDef: {
      resizable: true,
      filter: true,
      sortable: true,
      floatingFilter: true,
      flex:1,
      
      
    },
    // onCellClicked: (event: CellClickedEvent) => console.log('Cell was clicked'),
    onGridReady: (params:any) => {
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
  gridColumnApi: any;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }

  disabled = false;
  selectedItems: any = [];
  qtrData: any[] = [];
  deletebutton: boolean = false
  constructor(private dateFormatService:DateFormatServiceService,private logoutService: LogoutServiceService,
    private spinner:NgxSpinnerService,  private entityGridService: SharedEntityServiceService,
     private fb: FormBuilder, public dialog: MatDialog, private router: Router, 
     private bnIdle: BnNgIdleService, public datepipe: DatePipe, private entityService: EntityScreenServiceService,  private papa: Papa) {
    this.tokenExpireyTime = sessionStorage.getItem('tokenExpirationTimeInMinutes');
    this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);

  }
  selectedItemsArray: any = [];
  dropdownSettings: IDropdownSettings = {};
  data: any = []
  viewPermission: boolean = false;
  AddPermission: boolean = false;
  EditPermission: boolean = false;
  csvViewData: any = [];
  regionalOffice: any;
  accountsView: any;
  uploadViewId:any;
  ngOnInit() {
    this.accountsView = sessionStorage.getItem("accountsView");
    this.regionalOffice = sessionStorage.getItem('regionalOffice')
    console.log("RegionalOffice",this.regionalOffice)
    if (this.accountsView === 'dataView') {
      this.getDataView();
    }
    if (this.accountsView === 'uploadView') {
      this.regionalOffice = JSON.parse(sessionStorage.getItem('upload_accounts_Details') || 'null')
     this.uploadViewId = sessionStorage.getItem("AccountsView");
      this.getUploadDataView();
    }
    this.startYears = Array.from({ length: 2023 - 2015 + 1 }, (_, i) => 2023 - i);
    this.updateEndYears();
    console.log("this.tokenExpireyTime", this.tokenExpireyTime)
    let data: any = sessionStorage.getItem("sideNavbar");
    console.log('sideNavBarData', data);

    this.entitlements = JSON.parse(data ? data : '')
    this.entitlements.forEach((elements: any) => {
      // debugger
      if (elements == 'View') {
        this.viewPermission = true;
        this.getLevelsData();
      }
      else if (elements == 'Add') {
        this.AddPermission = true;
        this.changeLevelIden = false;
        this.getLevelsData();
      }
      else if (elements == 'Edit') {
        this.EditPermission = true;
        this.getLevelsData();
      }
      else if (elements == 'Authorize') {
        this.authorizePermission = true;
        this.changeLevelIden = false;
        this.getLevelsData();
      }
      // Authorize

    })
    console.log("Entitlements", this.entitlements)
    // this.onItemSelectOrAll(this.toppingList);
    // this.select=[0]

    // this.myForms = this.fb.group({
    //   name:['']

    // })
    // alert(this.toppingList[1])

    this.myForms = this.fb.group({
      name: [''],
      name1: [''],
      name2: ['']

    });
    this.data = [
      { item_id: 1, item_text: 'Hanoi' },
      { item_id: 2, item_text: 'Lang Son' },
      { item_id: 3, item_text: 'Vung Tau' },
      { item_id: 4, item_text: 'Hue' },
      { item_id: 5, item_text: 'Cu Chi' },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'field',
      textField: 'label',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      // limitSelection: -1,
      enableCheckAll: true,
      // selectedItems: 2,
      itemsShowLimit: 2,

    };



    // this.setForm()
    this.selectedItemsArray.push('Unit')
    this.myForms.patchValue({
      name: this.toppingList,
    })
    // alert(this.toppingList[0])
    this.getLevelsData();



  }

  bankcode: any = ''
  fyEnd: any;
  qtrEnd: any;
  showFyEnd:any;
  accountDataStatusId: any;
  getDataView() {
    let fyEnd = sessionStorage.getItem('accountFyEnd');
    this.fyEnd = fyEnd
    let qtrEnd = sessionStorage.getItem('accountqtrEnd');
    this.qtrEnd = qtrEnd
    let bankcode = sessionStorage.getItem('accountbankcode');

    let accountDataStatusId = sessionStorage.getItem('accountDataStatusId');


    this.bankcode = bankcode
    let isView = JSON.stringify(true)
this.spinner.show();
fyEnd = this.datepipe.transform(fyEnd,'dd-MM-YYYY');
qtrEnd = this.datepipe.transform(qtrEnd,'dd-MM-YYYY')
    this.entityService.viewaccountscreen(bankcode, fyEnd, qtrEnd, isView).subscribe(
      (response: any) => {
      console.log("SelectedLevelsResponse", response)
      console.log(response);


      const blob = new Blob([response.message], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      fetch(url)
        .then(response => response.text())
        .then(csvData => {
          const rows = csvData.split('\n');
          const headerRow = rows[0].split(',');
          const dataRows = rows.slice(1,-1);

          const parsedData = dataRows.map(row => {
            const values = row.split(',');
            const rowData: { [key: string]: string } = {}; // Define the type of rowData
            headerRow.forEach((header, index) => {
              const value = values[index];
              const key = header.replace(/"/g, ''); // Remove double quotes from the key
              if (value !== undefined && value !== null) {
                rowData[key] = value.replace(/\\/g, '').replace(/"/g, '');
              } else {
                rowData[key] = value;
              }
            });
            return rowData;
          });
          // Process the CSV data
          console.log("CSV View Data", csvData);
          this.csvViewData = parsedData;
          // sessionStorage.setItem("viewUserCsvDAta", JSON.stringify(this.csvViewData));

          console.log("CSVUserDATA", this.csvViewData);

          this.arrayLoop = this.csvViewData;

          for (let i = 0; i < this.arrayLoop.length; i++) {
            let modifiedData: any = ''
            let branchcode: any = ''
            //     let item=this.selectedLevelData[i].Branch.match(/\d+/)?.[0];
            // branchcode = item ? item : ''


            // const inputString = "1107 -Anantapur - Kalyanadurg Road";
            let extractedNumber = "";

            for (let i = 0; i < this.arrayLoop[i].Branch.length; i++) {
              const char = this.arrayLoop[i].Branch[i];
              if (char >= "0" && char <= "9") {
                extractedNumber += char;
              } else if (extractedNumber !== "") {
                // Break the loop once we have extracted the number
                break;
              }
            }

            branchcode = extractedNumber;
            console.log(extractedNumber)
            this.arrayLoop[i].bankCode = this.bankcode;
            this.arrayLoop[i].branchcode = branchcode
            modifiedData = {
              // ...this.arrayLoop[i],
              // District_Code: this.arrayLoop[i]["District Code"],
              // Drawing_power:this.arrayLoop[i]["Drawing power"],
              // FY_Ending:this.arrayLoop[i]["FY Ending"],
              // Ifsc_Code:this.arrayLoop[i]["Ifsc Code"],
              // Loan_Acc_Type:this.arrayLoop[i]["Loan Acc Type"],

              // Loan_Limit:this.arrayLoop[i]["Loan Limit"],

              // Qtr_Ending:this.arrayLoop[i]["Qtr Ending"],

              // Roi_Slab_1:this.arrayLoop[i]["Roi Slab 1"],

              // Roi_Slab_2:this.arrayLoop[i]["Roi Slab 2"],

              // Roi_Slab_3:this.arrayLoop[i]["Roi Slab 3"],

              // Sanctioned_Date:this.arrayLoop[i]["Sanctioned Date"],

              // Sb_Acc_No:this.arrayLoop[i]["Sb Acc No"],

              // Shg_Code:this.arrayLoop[i]["Shg Code"],

              // Shg_Cust_Id:this.arrayLoop[i]["Shg Cust Id"],

              // Shg_Name:this.arrayLoop[i]["Shg Name"],
              // Shg_Type:this.arrayLoop[i]["Shg Type"],
              // State_Code:this.arrayLoop[i]["State Code"],
              // Area_Type:this.arrayLoop[i]["Area Type"],
              bankCode: this.bankcode,
              branchcode: branchcode
            }
            console.log(modifiedData)

          }


          console.log('arrayLoop', this.arrayLoop)
          console.log('selectedLevelData', this.selectedLevelData)

        })
      this.spinner.hide();
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
  getClosedDataView() {
    let fyEnd = sessionStorage.getItem('accountFyEnd');
    this.fyEnd = fyEnd

    let qtrEnd = sessionStorage.getItem('accountqtrEnd');
    this.qtrEnd = qtrEnd
    let bankcode = sessionStorage.getItem('uploadClosedDatabankCode');
    this.bankcode = bankcode
    let isView = JSON.stringify(true)
    this.entityService.viewaccountscreen(bankcode, fyEnd, qtrEnd, isView).subscribe(
      (response: any) => {
      console.log("SelectedLevelsResponse", response)
      console.log(response);


      const blob = new Blob([response.message], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      fetch(url)
        .then(response => response.text())
        .then(csvData => {
          const rows = csvData.split('\n');
          const headerRow = rows[0].split(',');
          const dataRows = rows.slice(1);
          let csvD:any;
          this.papa.parse(csvData,{
            complete: (result) => {
                console.log('Parsed: ', result.data);
                csvD = result.data;
            }
        });

       this.arrayLoop = this.convertCsvDataToObjectArray(csvD);
        console.log("Final",this.arrayLoop);
          // const parsedData = dataRows.map(row => {
          //   const values = row.split(',');
          //   const rowData: { [key: string]: string } = {}; 
          //   headerRow.forEach((header, index) => {
          //     const value = values[index];
          //     const key = header.replace(/"/g, ''); 
          //     if (value !== undefined && value !== null) {
          //       rowData[key] = value.replace(/\\/g, '').replace(/"/g, '');
          //     } else {
          //       rowData[key] = value;
          //     }
          //   });
          //   return rowData;
          // });
          // Process the CSV data
          console.log("CSV View Data", csvData);
          this.csvViewData = this.arrayLoop;
          sessionStorage.setItem("viewUserCsvDAta", JSON.stringify(this.csvViewData));

          // console.log("CSVUserDATA", this.csvViewData);

          // this.arrayLoop = this.csvViewData;

          for (let i = 0; i < this.arrayLoop.length; i++) {
            let modifiedData: any = ''
            let branchcode: any = ''
            //     let item=this.selectedLevelData[i].Branch.match(/\d+/)?.[0];
            // branchcode = item ? item : ''


            // const inputString = "1107 -Anantapur - Kalyanadurg Road";
            let extractedNumber = "";

            for (let i = 0; i < this.arrayLoop[i].Branch.length; i++) {
              const char = this.arrayLoop[i].Branch[i];
              if (char >= "0" && char <= "9") {
                extractedNumber += char;
              } else if (extractedNumber !== "") {
                // Break the loop once we have extracted the number
                break;
              }
            }

            branchcode = extractedNumber;
            console.log(extractedNumber)
            this.arrayLoop[i].bankCode = this.bankcode;
            this.arrayLoop[i].branchcode = branchcode
            modifiedData = {
              bankCode: this.bankcode,
              branchcode: branchcode
            }
            console.log(modifiedData)

          }


          console.log('arrayLoop', this.arrayLoop)
          console.log('selectedLevelData', this.selectedLevelData)

        })

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
  getUploadDataView() {
    this.spinner.show();
    let selldata:any
    selldata = sessionStorage.getItem('SelectedCelldata');
    selldata = JSON.parse(selldata?selldata:'');
    console.log("Celldatasssssssss",selldata.fyEnding);
        this.fyEnd = this.datepipe.transform(selldata.fyEnding, 'dd MMM YYYY');
        this.qtrEnd = this.datepipe.transform(selldata.qtrEnding, 'dd MMM YYYY');
    this.entityService.viewaccountsupload(this.uploadViewId).subscribe(
      (response: any) => {
      console.log("SelectedLevelsResponse", response)
      console.log(response);
      const blob = new Blob([response.message], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      fetch(url)
        .then(response => response.text())
        .then(csvData => {
          const rows = csvData.split('\n');
          const headerRow = rows[0].split(',');
          const dataRows = rows.slice(1,-1);
          let csvD:any;
          this.papa.parse(csvData,{
            complete: (result) => {
                console.log('Parsed: ', result.data);
                csvD = result.data;
            }
        });

       this.arrayLoop = this.convertCsvDataToObjectArray(csvD);
        console.log("Final",this.arrayLoop);

          // const parsedData = dataRows.map(row => {
          //   const values = row.split(',');
          //   const rowData: { [key: string]: string } = {}; 
          //   headerRow.forEach((header, index) => {
          //     const value = values[index];
          //     const key = header.replace(/"/g, ''); 
          //     if (value !== undefined && value !== null) {
          //       rowData[key] = value.replace(/\\/g, '').replace(/"/g, '');
          //     } else {
          //       rowData[key] = value;
          //     }
          //   });
          //   return rowData;
          // });
          // Process the CSV data
          // console.log("CSV View Data", csvData);
          // this.csvViewData = parsedData;
       
          // console.log("CSVUserDATA", this.csvViewData);
          // this.arrayLoop = this.csvViewData;
          // console.log('arrayLoop', this.arrayLoop);
          // console.log('arrayLoop', this.arrayLoop[0].remarks)
          // console.log('selectedLevelData', this.selectedLevelData)

        })
this.spinner.hide();
    } ,
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

  convertCsvDataToObjectArray(csvData: any[][]): any[] {
    // The first row contains your headers, which will be the keys of your objects.
    const headers = csvData[0];
    // All subsequent rows are your data.
    const dataRows = csvData.slice(1,-1);
  
    // Map each row to an object using the headers for keys.
    const objectArray = dataRows.map(row => {
      // Create an object for each row.
      let obj: any = {};
      // Loop through each cell in the row.
      row.forEach((cell, index) => {
        // Use the header as key and the cell content as value.
        if(cell !== null && cell !== undefined){
          obj[headers[index]] = cell;
        }
      });
      return obj;
    });
    return objectArray;
  }
  updateEndYears() {
    this.endYears = [];
    let val = this.selectedStartYear;
    console.log(val);
    for (let year = Number(val) + 1; year <= Number(val) + 2; year++) {
      this.endYears.push(year);
    }




  }
  public setForm() {
    this.formGroup = new FormGroup({
      name: new FormControl(this.toppingList, Validators.required),
    });
  }

  f(): any {
    return this.formGroup.controls;
  }
  searchText: any;

  onFilterTextBoxChanged(gridOptions: any, $event: any) {
    const { target } = $event;
    this.searchText = target.value;
    console.log(' this.searchText', this.searchText)
    this.gridApi.setQuickFilter(
      target.value
    );
  }


  showhided: boolean = false;
  onCellClicked(event: CellClickedEvent) {
    this.showhided = true;
    console.log(event);
    let unitCode = event.data.unit;
    this.disabledFields = false;
    console.log("UnitCOde", unitCode);
    sessionStorage.setItem("UnitCode", unitCode)
    sessionStorage.setItem("Status", event.data.status)
    sessionStorage.setItem("AuthStatus", event.data.Status)

  }
  generatePDF(_: any) {
    alert('ks')
    // alert('click')
    // const doc = new jsPDF.default();
    // const tableData = gridOptions.api.getDataAsCsv();
    // const tableHeaders = gridOptions.columnDefs.map((colDef: any) => colDef.headerName);
    // doc.autoTable({
    //   head: [tableHeaders],
    //   body: tableData.split('\n').map((row:any) => row.split(',')),
    // });
    // doc.save('grid-data.pdf');


    // doc.save('grid-data.pdf');

    let printOptions = { "PDF_HEADER_COLOR": "#f8f8f8", "PDF_INNER_BORDER_COLOR": "#dde2eb", "PDF_OUTER_BORDER_COLOR": "#babfc7", "PDF_LOGO": "", "PDF_PAGE_ORITENTATION": "landscape", "PDF_WITH_HEADER_IMAGE": false, "PDF_WITH_FOOTER_PAGE_COUNT": true, "PDF_HEADER_HEIGHT": 25, "PDF_ROW_HEIGHT": 15, "PDF_ODD_BKG_COLOR": "#fcfcfc", "PDF_EVEN_BKG_COLOR": "#ffffff", "PDF_WITH_CELL_FORMATTING": true, "PDF_WITH_COLUMNS_AS_LINKS": true, "PDF_SELECTED_ROWS_ONLY": false };
    printDoc(printOptions, this.gridApi, this.gridColumnApi)
  }
  leftPinnedColumns: string[] = [];
  rightPinnedColumns: string[] = [];

  updatedColumnPinned() {
    let state: any = [];
    this.leftPinnedColumns.forEach(columnField => {
      state.push({ colId: columnField, pinned: 'left' });
    });

    this.rightPinnedColumns.forEach(columnField => {
      state.push({ colId: columnField, pinned: 'right' });
    })

    // this.gridColumnApi.applyColumnState({
    //   state: state,
    //   defaultState: { pinned: null },
    // });
  }

  onSearchChange($event: any, anything?: any) {
    console.log();
  }
  ToggleHideShow() {
    this.showhide = !this.showhide;
    this.gridColumnApi.setColumnsVisible(['Unit'], this.showhide);
    this.gridApi.sizeColumnsToFit();
  }

  downloadExcel() {
    this.exportExcel();
  }
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.paginationGoToPage(4);
    params.api.sizeColumnsToFit();
    this.entityGridService.listen().subscribe((m: any) => {
      console.log("RefreshData", m)
      setTimeout(() => {
        this.getLevelsData();;
      }, 2000);

    })
  }
  downloadPdf() {
    var require: any
    const jsPDF = require('jspdf');
    // require('jspdf-autotable');
    var doc = new jsPDF();
    var col = ["Unit", "IFSC", 'products', 'Level', 'ParentUnit', 'UnitType', 'Maker', 'Checker', 'Status', 'EntityStatus', 'PinCode', 'District', 'State', 'MakerTime', 'CheckerTime', 'UnitName'];
    var rows: any = [];
    this.selectedLevelData.forEach((element: any) => {
      rows.push(element);

    });
    doc.autoTable(col, rows);
    doc.save('row_export_' + new Date().getTime() + '.pdf');
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.selectedLevelData); // Sale Data
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "roles");
    });
  }
  // makePDF() {
  //   let pdf = new jsPDF();
  //   pdf.
  // }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }
  getLevelsData() {
    this.entityService.getLevelss(this.changeLevelIden).subscribe(
      (res: any) => {
      console.log("LevelsResponse", res)
      if (res) {
        this.levelsData = res?.data;
        console.log("LevelsResponse", this.levelsData);
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
  tabChanged(event: any) {
    console.log("Event", event)
    this.tabEvent = event.index;
    console.log("SelectedTab", this.levelsData[this.tabEvent].level)
    let selectedLevel = this.levelsData[this.tabEvent].level;
    this.entityService.getGridDataFromLevels(selectedLevel).subscribe((res: any) => {
      console.log("SelectedLevelsResponse", res)
      if (res) {
        this.selectedLevelData = res.data;
        console.log("this.selectedLevelData", this.selectedLevelData);
        this.selectedLevelData.map((x: any) => {
          // debugger

          x.Unit = x.unit
          x.IFSC = x.ifsc;
          x.Level = x.levelName;
          x.Parent_Unit = x.parent_unit;
          x.Unit_Name = x.unit_name;
          x.Email = x.email;
          x.Maker = x.maker;
          x.Checker = x.checker;
          x.Status = x.status;
          x.Record_Status = x.RecordStatus;
          x.Pin_Code = x.pincode;
          x.District = x.district;
          x.Status = x.statusName;
          x.State = x.state;
          x.Email = x.emailId;
          x.Record_status = x.entityStatusName
        })
        console.log("this.selectedLevelData", this.selectedLevelData);

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
  viewEnity() {
    sessionStorage.setItem("entityData", "viewData");
    this.router.navigate(['/view-nrlm-upload']);
  }
  addEntity() {
    sessionStorage.setItem("entityData", "addData");
    this.router.navigate(['/add-entity']);
  }
  EditEntity() {
    sessionStorage.setItem("entityData", "editData");
    this.router.navigate(['/add-entity']);
  }
  DeleteEntity() {
    sessionStorage.setItem("entityData", "deleteData");
    this.router.navigate(['/add-entity']);
  }
  AuthorizeEntity() {
    sessionStorage.setItem("entityData", "authorizeData");
    this.router.navigate(['/add-entity']);
  }
  UploadEntity() {
    sessionStorage.setItem("entityData", "authorizeData");
    this.router.navigate(['/nrlm-upload-screen']);
    // this.dialog.open(UploadPopupComponent,{ hasBackdrop: true, backdropClass:'backdropBackground', disableClose:false})
  }
  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }
  convertedDateFormat() {
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    return d + m + y;
  }
  onBtnExport() {
    this.gridApi.exportDataAsCsv({ fileName: '' + this.convertedDateFormat() });
  }
  changeLevel(event: any) {
    console.log("Event", event);
    // alert("hhhh")
    this.parentUnit = '';
    let level = event.level;
    this.Level = event.level;
    this.entityService.getParentLevels(this.Level).subscribe((res: any) => {
      console.log("LevelsResponse", res)
      if (res) {
        this.parentLevelsData = res?.data;
        console.log("ParentLevelsResponse", this.parentLevelsData);
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
  getParentLevel(event: any) {
    this.parentUnit = event.unitCode;
    console.log("ParentLevel", this.parentUnit);
  }

  onItemSelect(selectedField: any, type: string) {
    let item = selectedField.field;
    console.log("Itemmm", item);
    if (type == 'left') {
      this.leftPinnedColumns.push(item);
      this.toppingListRight = this.toppingListRight.filter((x: any) => x.field != item)

      // this.toppingListRight.pop(item)
    } else {
      this.rightPinnedColumns.push(item);
      this.toppingListLeft = this.toppingListLeft.filter((x: any) => x.field != item)

    }


    this.updatedColumnPinned();
    // this.showhide = true;
    // this.gridColumnApi.setColumnsVisible([item], this.showhide);
    // this.gridApi.sizeColumnsToFit();

  }

  onItemDeSelect(selectedField: any, type: string) {
    let item = selectedField.field;
    let obj: any = { field: selectedField.field, label: selectedField.label }
    if (type == 'left') {
      this.leftPinnedColumns = this.leftPinnedColumns.filter(x => x != item);
      debugger
      this.toppingListRight.push(obj);
    } else {
      this.rightPinnedColumns = this.rightPinnedColumns.filter(x => x != item);
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
    let itemss = selectedFields.map((x: { field: any; }) => x.field);
    this.showhide = true;
    this.gridColumnApi.setColumnsVisible(itemss, this.showhide);

    this.gridApi.sizeColumnsToFit();
  }
  ColumnSelectOrAll(selectedFields: any) {
    let itemss = selectedFields.map((x: { field: any; }) => x.field);
    this.showhide = true;
    let items = ['Unit', 'IFSC', 'Level', 'Parent Unit', 'Unit Name', 'Maker', 'Checker', 'Record Status', 'Pin Code', 'Email', 'District', 'State', 'Status', 'Maker time', 'Checker Time'];
    this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    this.gridApi.sizeColumnsToFit();
  }
  goBack() {
    if(this.accountsView === 'dataView') {
      this.router.navigate(['/accounts-data-upload'])
    }
    if (this.accountsView === 'uploadView') {
      this.router.navigate(['/nrlm-upload-screen'])
    }

  }
}



