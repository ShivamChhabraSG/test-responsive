

import { Component , OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ColDef, GridOptions, PaginationChangedEvent } from 'ag-grid-community';
import { IDropdownSettings } from "ng-multiselect-dropdown/multiselect.model";
import { CellClassParams, CellClassRules, CellClickedEvent, CellValueChangedEvent, FirstDataRenderedEvent, GridReadyEvent, RowValueChangedEvent, SideBarDef, GridApi, ModuleRegistry, ColumnResizedEvent, Grid, } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutServiceService } from '../services/logout-service.service';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { DateFormatWithoutTimeService } from '../services/date-format-without-time.service';
import { Papa } from 'ngx-papaparse';



@Component({
  selector: 'app-nrlm-upload-view-screen',
  templateUrl: './nrlm-upload-view-screen.component.html',
  styleUrls: ['./nrlm-upload-view-screen.component.css']
})
export class NrlmUploadViewScreenComponent {
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
  selectedLevelData: any = [];
  logoutResponse: any;
  entitlements: any = [];
  disabledFields: any;
  authorizePermission: boolean = false;
  parentUnit: any;
  Level: any;
  parentLevelsData: any = [];
  changeLevelIden:boolean =  false;
  uploadclosedAccountId:any;
  public pageSize = 20;
  toppingList = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];
  toppingListLeft: any[] = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];
  toppingListRight: any[] = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];
  tooltip: any;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;

  columnDefs: ColDef[] = [
    {
      headerName: 'SI No',
      field: 'slno',
      tooltipField: 'filename',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:90
    },
    {
      headerName: 'Bank Code',
      field: 'bank_code',
      tooltipField: 'bank_code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:130
    }, {
      headerName: 'Bank Name',
      field: 'bank_name',
      tooltipField: 'bank_name',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:130
    }, {
      headerName: 'State Id',
      field: 'state_id',
      tooltipField: 'state_id',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:110
    },
    {
      headerName: 'State Name',
      field: 'state_name',
      tooltipField: 'state_name',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:130
    },

    {
      headerName: 'Shg Name',
      field: 'shg_name',
      tooltipField: 'shg_name',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:130
    },

    {
      headerName: 'Loan Account Number',
      field: 'loan_acc_no',
      tooltipField: 'loan_acc_no',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:210
    },

    {
      headerName: 'SBA Account Number',
      field: 'sbaccount',
      tooltipField: 'sbaccount',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:210
    },
    {
      headerName: 'BL IFSC Code',
      field: 'bl_ifsc_code',
      tooltipField: 'bl_ifsc_code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:160
    },
    {
      headerName: 'Branch Code',
      field: 'branch_code',
      tooltipField: 'branch_code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:140
    },
    {
      headerName: 'Financial Year',
      field: 'yr',
      tooltipField: 'yr',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:160
    },
    {
      headerName: 'MIS SHG Code',
      field: 'mis_shg_code',
      tooltipField: 'mis_shg_code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:170
    },


    {
      headerName: 'Remarks',
      field: 'remarks',
      tooltipField: 'remarks',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:110
    },

    {
      headerName: 'Status',
      field: 'status',
      tooltipField: 'status',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:100
    },


  ];
  columnDefs2: ColDef[] = [
   {
      headerName: 'Bank code',
      field: 'Bank_code',
      tooltipField: 'Bank_code',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:120
    }, 
    {
      headerName: 'Loan Account number',
      field: 'Loan_Account_number',
      tooltipField: 'Loan_Account_number',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:180
    },
    {
      headerName: 'SHG Customer ID',
      field: 'SHG_Customer_ID',
      tooltipField: 'SHG_Customer_ID',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:160
    },
    {
      headerName: 'Acc closed status',
      field: 'Acc_closed_status',
      tooltipField: 'Acc_closed_status',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:160
    },
    {
      headerName: 'Account closed date',
      field: 'Acc_closed_date',
      tooltipField: 'Acc_closed_date',
      cellRenderer: (data:any) =>
      { return this.dateFormatServiceWithoutTime.dateformat(data.value);
      },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:170
    },
    {
      headerName: 'Remarks',
      field: 'Remarks',
      tooltipField: 'Remarks',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:110
    },
    {
      headerName: 'Status',
      field: 'Status',
      tooltipField: 'Status',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:90
    },
  ];

  public rowHeight = 30
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
  }
  public defaultColDef: ColDef = {
    suppressSizeToFit: true,
    filter: 'agTextColumnFilter',
      sortable: true,
  };
  gridColumnApi: any;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();

  }
  onPageSizeChanged(params: PaginationChangedEvent) {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridOptions.api!.paginationSetPageSize(Number(value));
  }
  disabled = false;
  selectedItems: any = [];

  constructor(private dateFormatService:DateFormatServiceService,private dateFormatServiceWithoutTime:DateFormatWithoutTimeService,
    private logoutService: LogoutServiceService,    private spinner: NgxSpinnerService, 
    private entityGridService: SharedEntityServiceService, private fb: FormBuilder, 
    public dialog: MatDialog, private router: Router, private bnIdle: BnNgIdleService, 
    private entityService: EntityScreenServiceService, private papa: Papa ) {
    this.tokenExpireyTime = sessionStorage.getItem('tokenExpirationTimeInMinutes');
    this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
  }
  labelKey:any;
  ngOnInit() {
    this.uploadclosedAccountId =sessionStorage.getItem('closedAccount');
    this.spinner.show()

    let item = sessionStorage.getItem('labelKeyOfSideNav');
this.labelKey = item;
    if(item == '20215') {
      this.tabChangedforclosed();
    }
    else if(item == '20211'){

      this.tabChanged();
    }
          console.log("this.tokenExpireyTime", this.tokenExpireyTime)
    let data: any = sessionStorage.getItem("sideNavbar");
    console.log('sideNavBarData', data);

    this.entitlements = JSON.parse(data ? data : '')
    this.entitlements.forEach((elements: any) => {
      
    })
    console.log("Entitlements", this.entitlements)
      this.myForms = this.fb.group({
      name: [''],
      name1: [''],
      name2: ['']

    });
      
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
  getLevelsData() {
    this.entityService.getLevelss(this.changeLevelIden).subscribe((res: any) => {
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
  csvViewData:any = [];

  tabChanged() {
let id = sessionStorage.getItem('uploadShgCodesDataStatusId')

let data:any={
  uploadShgCodesDataStatusId :id
}
    this.entityService.getView(data).subscribe(
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

          const dr:any = dataRows;
          let csvD :any;
          this.papa.parse(csvData,{
            complete: (result) => {
                console.log('Parsed: ', result);
                csvD = result.data;
            }
        });
       
        this.selectedLevelData = this.convertCsvDataToObjectArray(csvD);
        console.log("Final",this.selectedLevelData);
        
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
          // this.csvViewData =  parsedData;
          // console.log("CSV View",this.csvViewData);
          // sessionStorage.setItem("viewUserCsvDAta",JSON.stringify(this.csvViewData));
        
          // console.log("CSVUserDATA",this.csvViewData);

          // this.selectedLevelData=this.csvViewData;
          this.spinner.hide()
          console.log("selectedLevelData",this.selectedLevelData);
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
    }
    );
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

  tabChangedforclosed() {
    let id = sessionStorage.getItem('uploadClosedDataStatusId')
    this.spinner.show();
        this.entityService.getViewforview(id).subscribe(
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
              let csvD :any;
              this.papa.parse(csvData,{
                complete: (result) => {
                    console.log('Parsed: ', result);
                    csvD = result.data;
                }
            });
           
            this.selectedLevelData = this.convertCsvDataToObjectArray(csvD);
            console.log("Final",this.selectedLevelData);
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
              this.csvViewData =  this.selectedLevelData;
              // console.log("CSV View",this.csvViewData);
              sessionStorage.setItem("viewUserCsvDAta",JSON.stringify(this.csvViewData));
            
              // console.log("CSVUserDATA",this.csvViewData);
    
              // this.selectedLevelData=this.csvViewData;
              this.spinner.hide()
              console.log("selectedLevelData",this.selectedLevelData);
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
        }
        );
    }


  back() {
    this.router.navigate(['/nrlm-upload-screen'])
  }
}
