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
import { NgxSpinner, NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
 
 
 
@Component({
  selector: 'app-view-nrlm-upload',
  templateUrl: './view-nrlm-upload.component.html',
  styleUrls: ['./view-nrlm-upload.component.css']
})
export class ViewNrlmUploadComponent {
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
  toppingList = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];
  toppingListLeft: any[] = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];
  toppingListRight: any[] = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];
  tooltip: any;
  public defaultPage = 20;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
 
  columnDefs: ColDef[] = [
   { headerName: 'SHG Name', field: 'SHG Name', tooltipField: "SHG Name", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'IFSC Code', field: 'IFSC Code', tooltipField: "IFSC Code", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Loan Account Number', field: 'Loan acc no', tooltipField: "Loan acc no", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'SB Account', field: 'SB account', tooltipField: "SB account", editable: false, suppressSizeToFit: true, resizable: true, },
 { headerName: 'SHG Code', field: 'SHG Code', tooltipField: "SHG Code", editable: false, suppressSizeToFit: true, resizable: true, },
 
   
  ];
 
 
  columnDefs1: ColDef[] = [
   { headerName: 'SHG ID', field: 'Shg Cust Id', tooltipField: "Shg Cust Id", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Loan Account Number', field: 'Loan Acc No', tooltipField: "Loan Acc No", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Account Closed Date', field: 'Acc Closed Date', tooltipField: "Acc Closed Date", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Account Closed Status', field: 'Acc Closed Status', tooltipField: "Acc Closed Status", editable: false, suppressSizeToFit: true, resizable: true, },
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
  uploadclosedAccountId:any
  constructor(private logoutService: LogoutServiceService,private spinner: NgxSpinnerService, private entityGridService: SharedEntityServiceService, private fb: FormBuilder, public dialog: MatDialog, private router: Router, private bnIdle: BnNgIdleService, private entityService: EntityScreenServiceService, ) {
    this.tokenExpireyTime = sessionStorage.getItem('tokenExpirationTimeInMinutes');
    this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
  }
  leabelkey:any;
  ngOnInit() {
    let item = sessionStorage.getItem('labelKeyOfSideNav');
    this.leabelkey=item
if(item=='20215'){
this.userdataclosed();
}if(item=='20211'){
  this.userdata();
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
 
  csvViewData:any = [];
  Qtr_Ending:any=[];
 
  userdata(){
    let isView =JSON.stringify(true)
    let fyEnd =sessionStorage.getItem('fyEndUser')
    let qtrEnd = sessionStorage.getItem('qtrEndUser')
    let bankCodeUser =sessionStorage.getItem('bankCodeUser')
    this.spinner.show();
    console.log(bankCodeUser,fyEnd,qtrEnd,isView);
    const modifiedData = {
      FY_Ending:"FY Ending",
      Stat_Code:"Stat Code",
      Bank_Code: "Bank Code",
      Qtr_Ending:"Qtr Ending"
    };
    this.Qtr_Ending.push(modifiedData);
    this.entityService.viewScreen(bankCodeUser,fyEnd,qtrEnd,isView).subscribe(
      (response:any)=>{
      this.spinner.hide();
      console.log('ddd',response.message);
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
          this.csvViewData =  parsedData;
          // sessionStorage.setItem("viewUserCsvDAta",JSON.stringify(this.csvViewData));
       
          console.log("CSVUserDATA",JSON.stringify(this.csvViewData));
 
          this.selectedLevelData=this.csvViewData;
          let data = this.selectedLevelData[0]
console.log("Dataattata",data)
 
          const modifiedData = {
            ...data,
            FY_Ending: data["FY Ending"],
            Stat_Code:data["Stat Code"],
            Bank_Code:data["Bank Code"],
            Qtr_Ending:data["Qtr Ending"],
          };
         
          // Remove the original property name
//           delete modifiedData["FY Ending"];
         
          console.log(modifiedData);
          this.Qtr_Ending.pop();
this.Qtr_Ending.push(modifiedData);
this.spinner.hide();
          // this.Qtr_Ending=this.selectedLevelData[0].join('')
          console.log('this.Qtr_Ending',this.Qtr_Ending)
          console.log(this.csvViewData)
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
  bankCodeUser:any
  userdataclosed(){
    let isView =JSON.stringify(true)
    let fyEnd =sessionStorage.getItem('fyEndUser')
    let qtrEnd = sessionStorage.getItem('qtrEndUser')
    let bankCodeUser =sessionStorage.getItem('bankCodeUser')
    this.bankCodeUser=bankCodeUser;
    this.spinner.show();
    const modifiedData = {
      FY_Ending: "",
      Stat_Code:"",
      Bank_Code:"",
      Qtr_Ending:"",
    };
    this.Qtr_Ending.push(modifiedData);
    console.log(bankCodeUser,fyEnd,qtrEnd,isView);
    if(fyEnd!= null){
      console.log(fyEnd);
      this.entityService.viewScreenclosed(bankCodeUser,fyEnd,qtrEnd,isView).subscribe(
        (response:any)=>{
        this.spinner.hide();
        console.log('ddd',response.message);
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
            this.csvViewData =  parsedData;
            // sessionStorage.setItem("viewUserCsvDAta",JSON.stringify(this.csvViewData));
         
            console.log("CSVUserDATA",JSON.stringify(this.csvViewData));
 
            this.selectedLevelData=this.csvViewData;
            console.log('selectedLevelData',this.selectedLevelData)
            let data = this.selectedLevelData[0]
            console.log("Dataattata",data)
 
            const modifiedData = {
              ...data,
              FY_Ending: data["fy Ending"],
              Stat_Code:data["Stat Code"],
              Bank_Code:data["Bank Code"],
              Qtr_Ending:data["qtr Ending"],
            };
           
            // Remove the original property name
  //           delete modifiedData["FY Ending"];
           
            console.log(modifiedData);
          this.Qtr_Ending.pop();
           this.Qtr_Ending.push(modifiedData)
          this.spinner.hide();
            // this.Qtr_Ending=this.selectedLevelData[0].join('')
            console.log('this.Qtr_Ending',this.Qtr_Ending)
            console.log(this.csvViewData)
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
  back() {
    if(this.leabelkey=='20215'){
      this.router.navigate(['/closed-account-data'])
    }
    if(this.leabelkey=='20211') {
      this.router.navigate(['/nrlm-data-upload'])
    }
  }
}
 