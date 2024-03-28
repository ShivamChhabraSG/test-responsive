import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormGroup, FormControl, Validator, Validators, FormBuilder } from "@angular/forms";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ColDef, GridOptions, PaginationChangedEvent } from 'ag-grid-community';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import {
  CellClassParams,
  CellClassRules,
  CellClickedEvent,
  CellValueChangedEvent,
  FirstDataRenderedEvent,
  GridReadyEvent,
  RowValueChangedEvent,
  SideBarDef,
  GridApi,
  ModuleRegistry,
  ColumnResizedEvent,
  Grid,
} from 'ag-grid-community';
import { IconArrowComponent } from '../icon-arrow/icon-arrow.component';
import { AgGridAngular } from 'ag-grid-angular';
import * as jsPDF from 'jspdf';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutServiceService } from '../services/logout-service.service';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import { left } from '@popperjs/core';

// @ts-ignore
import printDoc from 'src/assets/js/printDoc';
import { UploadPopupComponent } from '../upload-popup/upload-popup.component';
import { WarningPopupComponent } from '../warning-popup/warning-popup.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { UploadStatusDialogComponent } from '../upload-status-dialog/upload-status-dialog.component';

@Component({
  selector: 'app-user-upload',
  templateUrl: './user-upload.component.html',
  styleUrls: ['./user-upload.component.css'],
})
export class UserUploadComponent {
  @ViewChild('fileInput')
  fileInput: any;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  @ViewChild(WarningDialogComponent) deletedialog: WarningDialogComponent | undefined;
  @ViewChild(UploadStatusDialogComponent) uploaddialog: UploadStatusDialogComponent | undefined;
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
  submitSuccessfully:boolean = true;
  disabledFields: any;
  authorizePermission: boolean = false;
  parentUnit: any;
  Level: any;
  parentLevelsData: any = [];
  changeLevelIden: boolean = false;
  selectedFile: File | null = null;
  deleteVisible: boolean = false;
  UserDataStatusId: any;
  csvViewData:any = [];
  usercellClicked:boolean = false;
  ErrRejSucessRecord:any;
  UserData:any;
  public pageSize = 20;
  public totalPages! : number;
  public rowCount!: number;
  // toppingList = ['Unit', 'IFSC', 'Level', 'Parent Unit', 'Unit Name', 'Maker', 'Checker', 'Record Status', 'Pin Code', 'Email', 'District', 'State', 'Status', 'Maker time', 'Checker Time'];

  toppingList = [
    { field: 'Unit', label: 'Unit' },
    { field: 'IFSC', label: 'IFSC' },
    { field: 'Level', label: 'Level' },
    { field: 'Parent_Unit', label: 'Parent Unit' },
    { field: 'Unit_Name', label: 'Unit Name' },
    { field: 'Maker', label: 'Maker' },
    { field: 'Checker', label: 'Checker' },
    { field: 'Status', label: 'Status' },
    { field: 'Record_status', label: 'Record Status' },
    { field: 'Pin_Code', label: 'Pincode' },
    { field: 'emailId', label: 'Email' },
    { field: 'District', label: 'District' },
    { field: 'State', label: 'State' },
    { field: 'maker_time', label: 'Maker time' },
    { field: 'checker_time', label: 'Checker Time' },
  ];

  toppingListLeft: any[] = [
    { field: 'Unit', label: 'Unit' },
    { field: 'IFSC', label: 'IFSC' },
    { field: 'Level', label: 'Level' },
    { field: 'Parent_Unit', label: 'Parent Unit' },
    { field: 'Unit_Name', label: 'Unit Name' },
    { field: 'Maker', label: 'Maker' },
    { field: 'Checker', label: 'Checker' },
    { field: 'Status', label: 'Status' },
    { field: 'Record_status', label: 'Record Status' },
    { field: 'Pin_Code', label: 'Pincode' },
    { field: 'emailId', label: 'Email' },
    { field: 'District', label: 'District' },
    { field: 'State', label: 'State' },
    { field: 'maker_time', label: 'Maker time' },
    { field: 'checker_time', label: 'Checker Time' },
  ];
  toppingListRight: any[] = [
    { field: 'Unit', label: 'Unit' },
    { field: 'IFSC', label: 'IFSC' },
    { field: 'Level', label: 'Level' },
    { field: 'Parent_Unit', label: 'Parent Unit' },
    { field: 'Unit_Name', label: 'Unit Name' },
    { field: 'Maker', label: 'Maker' },
    { field: 'Checker', label: 'Checker' },
    { field: 'Status', label: 'Status' },
    { field: 'Record_status', label: 'Record Status' },
    { field: 'Pin_Code', label: 'Pincode' },
    { field: 'emailId', label: 'Email' },
    { field: 'District', label: 'District' },
    { field: 'State', label: 'State' },
    { field: 'maker_time', label: 'Maker time' },
    { field: 'checker_time', label: 'Checker Time' },
  ];

  tooltip: any;
  checkCSV: boolean = true;
  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(this.pageSize);
   
   
  }
  // Custom number formatter for pagination
  customNumberFormatter(params: any) {
    return params.value.toLocaleString();
  }
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
      headerName: 'File Name',
      field: 'fileName',
      tooltipField: 'filename',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Remarks',
      field: 'remarks',
      tooltipField: 'district',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Upload Status',
      field: 'statusDetails',
      tooltipField: 'statusDetails',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Uploaded By',
      field: 'uploadedBy',
      tooltipField: 'uploadedby',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Uploaded Date Time',
      field: 'uploadedDateTime',
      tooltipField: 'emailId',
      // cellRenderer: (data:any) =>
      // { return this.dateFormatService.dateformat(data.value);
      // },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      comparator:this.dateComparator
    },
    {
      headerName: 'Authorised By',
      field: 'authorizedBy',
      tooltipField: 'maker',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Authorised Date Time',
      field: 'authorizedDateTime',
      tooltipField: 'checker',
      // cellRenderer: (data:any) =>
      // { return this.dateFormatService.dateformat(data.value);
      // },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      comparator:this.dateComparator2
    },
    {
      headerName: 'Total Records',
      field: 'totalRecords',
      tooltipField: 'statusName',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Success Records',
      field: 'successRecords',
      tooltipField: 'entityStatusName',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Error Records',
      field: 'errorRecords',
      tooltipField: 'pincode',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
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
    // onCellClicked: (event: CellClickedEvent) => console.log('Cell was clicked'),
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
  checker: any = [];
  maker: any;
  uploadStatus: any;
  fileUploadpermission: any;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  // onPageSizeChanged(params: PaginationChangedEvent) {
  //   var value = (document.getElementById('page-size') as HTMLInputElement)
  //     .value;
  //   this.gridOptions.api!.paginationSetPageSize(Number(value));
  // }
  disabled = false;
  selectedItems: any = [];
  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private logoutService: LogoutServiceService,
    private entityGridService: SharedEntityServiceService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private bnIdle: BnNgIdleService,
    private dateFormatService:DateFormatServiceService,
    private entityService: EntityScreenServiceService
  ) {
    this.tokenExpireyTime = sessionStorage.getItem(
      'tokenExpirationTimeInMinutes'
    );
    this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
    // this.tokenExpireyTime = sessionStorage.getItem('tokenExpirationTimeInMinutes');
    // this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
    // this.bnIdle.startWatching(this.tokenExpireyTime).subscribe((res) => {
    //   if (res) {
    //     this.logoutService.logout().subscribe((res: any) => {
    //       if (res) {
    //         this.logoutResponse = res;
    //         console.log("LogoutResponse", this.logoutResponse);
    //         this.router.navigate(['/home']);
    //       }
    //     },
    //       (err: any) => {
    //         // alert(err.error.message)
    //         console.log("Error Message", err.error.message);
    //       }
    //     );
    //   }
    // })
  }
  selectedItemsArray: any = [];
  dropdownSettings: IDropdownSettings = {};
  data: any = [];
  viewPermission: boolean = false;
  AddPermission: boolean = false;
  EditPermission: boolean = false;
  uploadpermission:any;
  ngOnInit() {
    this.tabChanged();
    this.uploadpermission = sessionStorage.getItem('Editpermisson');
    this.uploadpermission = JSON.parse(this.uploadpermission?this.uploadpermission:'')
    console.log('this.tokenExpireyTime', this.tokenExpireyTime)
   this.fileUploadpermission = sessionStorage.getItem("OnlyFileView");
  //  ,"FileView"
    let data: any = sessionStorage.getItem('sideNavbar');
    console.log('sideNavBarData', data);

    this.entitlements = JSON.parse(data ? data : '');
    this.entitlements.forEach((elements: any) => {
      // debugger
      if (elements == 'View') {
        this.viewPermission = true;
        this.getLevelsData();
      } else if (elements == 'Add') {
        this.AddPermission = true;
        this.changeLevelIden = false;
        this.getLevelsData();
      } else if (elements == 'Edit') {
        this.EditPermission = true;
        this.getLevelsData();
      } else if (elements == 'Authorize') {
        this.authorizePermission = true;
        this.changeLevelIden = false;
        this.getLevelsData();
      }
      // Authorize
    });
    console.log('Entitlements', this.entitlements);
    // this.onItemSelectOrAll(this.toppingList);
    // this.select=[0]

    // this.myForms = this.fb.group({
    //   name:['']

    // })
    // alert(this.toppingList[1])

    this.myForms = this.fb.group({
      name: [''],
      name1: [''],
      name2: [''],
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
    this.selectedItemsArray.push('Unit');
    this.myForms.patchValue({
      name: this.toppingList,
    });
    // alert(this.toppingList[0])
    this.getLevelsData();
    this.resetPinned();
  }

  public setForm() {
    this.formGroup = new FormGroup({
      name: new FormControl(this.toppingList, Validators.required),
    });
  }

  f(): any {
    return this.formGroup.controls;
  }
  forVIewDownloadData() {
    let UserStatusId = this.UserDataStatusId;
    this.entityService
      .downloadUserDetails(UserStatusId)
      .then((response: any) => {
        console.log(response);
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        fetch(url)
          .then(response => response.text())
          .then(csvData => {
            const rows = csvData.split('\n');
            const headerRow = rows[0].split(',');
            const dataRows = rows.slice(1);

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
            sessionStorage.setItem("viewUserCsvDAta",JSON.stringify(this.csvViewData));
            sessionStorage.setItem("entityData", "viewData");
            this.router.navigate(['/entity-upload-view']);
            console.log("CSVUserDATA",this.csvViewData);
          })
      }).catch(
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", "Not a valid session");
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      });
  }
  onBtnExport() {
    var celldata = this.UserData;
    console.log("CelllData", celldata);
    this.entityService
      .downloadUserDetails(this.UserDataStatusId)
      .then(
        (response: any) => {
        console.log("ExportPDFFF", this.UserDataStatusId);
        console.log(response);
        const blob = new Blob([response], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        fetch(url)
          .then(response => response.text())
          .then(csvData => {
            const rows = csvData.split('\n');
            const headerRow = rows[0].split(',');
            const dataRows = rows.slice(1);

            const parsedData = dataRows.map(row => {
              const values = row.split(',');
              const rowData: { [key: string]: string } = {}; // Define the type of rowData

              headerRow.forEach((header, index) => {
                rowData[header] = values[index];
              });

              return rowData;
            });
            // Process the CSV data
            console.log("CSV View Data", csvData);
            let csvViewData = parsedData;
            console.log(csvViewData);
          })
          .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Error fetching CSV data:', error);
          });
        const link = document.createElement('a');
        link.href = url;
        link.download = celldata.fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      }).catch(
      (err: any) => {
        this.spinner.hide()
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", "Not a valid session");
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "NrlmUpload");
          this.errordialog?.openDialog();
        }
      });
    // console.log(parent_unit,level);
    // this.gridApi.exportDataAsCsv({ fileName: '' + this.convertedDateFormat() });
  }

  deleteFile() {
    sessionStorage.setItem('popupDelete', 'UserUploadDeleted');
    this.deletedialog?.openDialog();
    // this.dialog.open(WarningPopupComponent, {
    //   panelClass: 'AddUsersSuccessPop',
    //   hasBackdrop: true,
    //   backdropClass: 'backdropBackground',
    //   disableClose: false,
    // });
    
    // console.log(parent_unit,level);
    // this.gridApi.exportDataAsCsv({ fileName: '' + this.convertedDateFormat() });
  }

  searchText: any;

  onFilterTextBoxChanged(gridOptions: any, $event: any) {
    const { target } = $event;
    this.searchText = target.value;
    console.log(' this.searchText', this.searchText);
    this.gridApi.setQuickFilter(target.value);
  }

  showhided: boolean = false;
  cellClicked: any;
  onCellClicked(event: CellClickedEvent) {
    console.log("Eventtttt",event.data)
    this.UserData =  event.data;
    console.log("USerCelll",this.UserData)
    this.checker = sessionStorage.getItem('UserId')
    this.maker = event.data.uploadedBy;
    this.maker = this.maker.split('-')[0]
    console.log(this.checker, this.maker);
    sessionStorage.setItem('userUploadData', JSON.stringify(this.UserData));
    this.usercellClicked = true;
    // this.checker = sessionStorage.getItem('UserId')
    // this.maker = event.data.maker
    // console.log(this.checker,this.maker);
    this.uploadStatus = event.data.uploadStatus;
    this.deleteVisible = true;
    this.showhided = true;
    console.log(event);
    let unitCode = event.data.unit;
    this.disabledFields = false;
    this.cellClicked = event.data.uploadStatus;
    sessionStorage.setItem('UserDelete', this.cellClicked);
    this.UserDataStatusId = event.data.userDataStatusId;
    // console.log("UnitCOde", unitCode);
    // sessionStorage.setItem("UnitCode", unitCode)
    // sessionStorage.setItem("Status", event.data.status)
    // sessionStorage.setItem("AuthStatus", event.data.Status)
    this.submitSuccessfully = true;
  }
  generatePDF(_: any) {
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
  leftPinnedColumns: string[] = [];
  rightPinnedColumns: string[] = [];

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

  onSearchChange($event: any, anything?: any) {
    console.log();
  }

  changeListener(fileInput: HTMLInputElement) {
    const files = fileInput.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      console.log('Selected File:', this.selectedFile.name);
      this.checkCSV = this.selectedFile.name.endsWith('.csv');
    }
    fileInput.value = ''
  }

  uploadFile() {
    if (this.selectedFile) {
      let fileName: any = this.selectedFile.name;
      var formdata = new FormData();
      formdata.append('inputFile', this.selectedFile, fileName);
      if(this.ErrRejSucessRecord !== undefined) {
        if(this.ErrRejSucessRecord.uploadStatus === 'R'|| this.ErrRejSucessRecord.uploadStatus === 'E') {
          this.entityService.delete(this.ErrRejSucessRecord.userDataStatusId).subscribe((response: any) => {
            console.log("Response",response);
            if (response.success == true) {
              this.spinner.show();
              this.entityService.uploaduserData(formdata).subscribe(
                (res: any) => {
                  this.spinner.hide();
                  console.log('Selected File Response:', res);
                  // alert(res.message);
                  sessionStorage.setItem("RateAllowedPopup",res.message);
                  sessionStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
                  this.spinner.hide()
                  this.errordialog?.openDialog();
                  this.tabChanged();
                },
                (err: any) => {
                  if (err.status === 401) {
        this.spinner.hide()
        sessionStorage.setItem("RateAllowedPopup", err.error.message);
        sessionStorage.setItem("PopupMaitainance", "LogoutError");
        this.errordialog?.openDialog();
      }
                  else if (err.error && err.error.message) {
                    console.log('Error:', err.error.message);
                    sessionStorage.setItem("RateAllowedPopup",err.error.message);
                    sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
                    this.spinner.hide()
                    this.errordialog?.openDialog();
                  } else {
                    console.log('Error:', err);
                  }
                }
              );
            }
            else {
             // alert(response.message);
             sessionStorage.setItem("RateAllowedPopup",response.message);
             sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
             this.spinner.hide()
             this.errordialog?.openDialog();
            }
      
          },
            (err: any) => {
              if (err.status === 401) {
                this.spinner.hide()
                sessionStorage.setItem("RateAllowedPopup", err.error.message);
                sessionStorage.setItem("PopupMaitainance", "LogoutError");
                this.errordialog?.openDialog();
              }
             else if (err.error && err.error.message) {
              //  console.log("Error:", err.error.message);
              sessionStorage.setItem("RateAllowedPopup",err.error.message);
              sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
              this.spinner.hide()
              this.errordialog?.openDialog();
              } else {
                console.log("Error:", err);
              }
            }
          );
        }
        else if(this.ErrRejSucessRecord.uploadStatus === 'S') {
         // alert("File Already Exist Pending Authorisation");
         const message = "File Already Exist Pending Authorisation";
         sessionStorage.setItem("RateAllowedPopup",message);
         sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
         this.spinner.hide()
         this.errordialog?.openDialog();
        }
        else if(this.ErrRejSucessRecord.uploadStatus === 'A') {
          this.spinner.show();
          this.entityService.uploaduserData(formdata).subscribe(
            (res: any) => {
              this.spinner.hide();
              console.log('Selected File Response:', res);
             // alert(res.message);
             sessionStorage.setItem("RateAllowedPopup",res.message);
             sessionStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
             this.spinner.hide()
             this.errordialog?.openDialog();
              this.tabChanged();
            },
            (err: any) => {
              if (err.status === 401) {
                this.spinner.hide()
                sessionStorage.setItem("RateAllowedPopup", err.error.message);
                sessionStorage.setItem("PopupMaitainance", "LogoutError");
                this.errordialog?.openDialog();
              }
              if (err.error && err.error.message) {
              //  console.log('Error:', err.error.message);
              sessionStorage.setItem("RateAllowedPopup",err.error.message);
              sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
              this.spinner.hide()
              this.errordialog?.openDialog();
              } else {
                console.log('Error:', err);
              }
            }
          );
        }
      }
      else if(this.ErrRejSucessRecord === undefined || this.ErrRejSucessRecord === null) {
        this.spinner.show();
        this.entityService.uploaduserData(formdata).subscribe(
          (res: any) => {
            this.spinner.hide();
            console.log('Selected File Response:', res);
           // alert(res.message);
           sessionStorage.setItem("RateAllowedPopup",res.message);
           sessionStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
           this.spinner.hide()
           this.errordialog?.openDialog();
            this.tabChanged();
          },
          (err: any) => {
            if (err.status === 401) {
              this.spinner.hide()
              sessionStorage.setItem("RateAllowedPopup", err.error.message);
              sessionStorage.setItem("PopupMaitainance", "LogoutError");
              this.errordialog?.openDialog();
            }
            if (err.error && err.error.message) {
             // console.log('Error:', err.error.message);
             sessionStorage.setItem("RateAllowedPopup",err.error.message);
             sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
             this.spinner.hide()
             this.errordialog?.openDialog();
            } else {
              console.log('Error:', err);
            }
          }
        );
      }
    } else {
      console.log('No file selected!');
    }
    this.selectedFile = null;
    this.submitSuccessfully = false;
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
    params.api.sizeColumnsToFit();
    this.entityGridService.listen().subscribe((m: any) => {
      console.log('RefreshData', m);
      setTimeout(() => {
        this.getLevelsData();
      }, 2000);
    });
  }
  downloadPdf() {
    var require: any;
    const jsPDF = require('jspdf');
    // require('jspdf-autotable');
    var doc = new jsPDF();
    var col = [
      'Unit',
      'IFSC',
      'products',
      'Level',
      'ParentUnit',
      'UnitType',
      'Maker',
      'Checker',
      'Status',
      'EntityStatus',
      'PinCode',
      'District',
      'State',
      'MakerTime',
      'CheckerTime',
      'UnitName',
    ];
    var rows: any = [];
    this.selectedLevelData.forEach((element: any) => {
      rows.push(element);
    });
    doc.autoTable(col, rows);
    doc.save('row_export_' + new Date().getTime() + '.pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.selectedLevelData); // Sale Data
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'roles');
    });
  }
  // makePDF() {
  //   let pdf = new jsPDF();
  //   pdf.
  // }
  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then((FileSaver) => {
      let EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }
  getLevelsData() {
    this.entityService.getLevelss(this.changeLevelIden).subscribe(
      (res: any) => {
        console.log('LevelsResponse', res);
        if (res) {
          this.levelsData = res?.data;
          console.log('LevelsResponse', this.levelsData);
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
  tabChanged() {
    this.spinner.show();
    this.entityService.getuserdata().subscribe(
      (res: any) => {
        this.spinner.hide();
        console.log('SelectedLevelsResponse', res);
        this.selectedLevelData = res.data;
        console.log("UserListData",this.selectedLevelData);
      this.ErrRejSucessRecord = this.selectedLevelData.find((row: { uploadStatus: any }) => row.uploadStatus === 'R' || row.uploadStatus === 'S' || row.uploadStatus === 'E' || row.uploadStatus === 'A');
      console.log("NewData",this.ErrRejSucessRecord);
        // if (res) {
        //   this.selectedLevelData = res.data;
        //   console.log("this.selectedLevelData", this.selectedLevelData);
        //   this.selectedLevelData.map((x: any) => {
        //     // debugger

        //     x.Unit = x.unit
        //     x.IFSC = x.ifsc;
        //     x.Level = x.levelName;
        //     x.Parent_Unit = x.parent_unit;
        //     x.Unit_Name = x.unit_name;
        //     x.Email = x.email;
        //     x.Maker = x.maker;
        //     x.Checker = x.checker;
        //     x.Status = x.status;
        //     x.Record_Status = x.RecordStatus;
        //     x.Pin_Code = x.pincode;
        //     x.District = x.district;
        //     x.Status = x.statusName;
        //     x.State = x.state;
        //     x.Email = x.emailId;
        //     x.Record_status = x.entityStatusName
        //   })
        //   console.log("this.selectedLevelData", this.selectedLevelData);

        // }
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
    sessionStorage.setItem('entityData', 'viewData');
    this.router.navigate(['/view-entity-screen']);
  }
  addEntity() {
    sessionStorage.setItem('entityData', 'addData');
    this.router.navigate(['/add-entity']);
  }
  EditEntity() {
    sessionStorage.setItem('entityData', 'editData');
    this.router.navigate(['/add-entity']);
  }
  DeleteEntity() {
    sessionStorage.setItem('entityData', 'deleteData');
    this.router.navigate(['/add-entity']);
  }
  AuthorizeEntity() {
    // sessionStorage.setItem("entityData", "authorizeData");
    // this.router.navigate(['/add-entity']);
  }

  remarks: any = ''

  Authorize() {
    var celldata = JSON.parse(sessionStorage.getItem('cellData') || 'null');
    let isAuthorze = JSON.stringify(true);
    let remarks = this.remarks
    this.entityService.UserfileChangeStatus(isAuthorze, remarks).subscribe((res: any) => {
      if (res.success === true) {
        console.log('Authorize Status', res); // this.GetUploadFiles();
        sessionStorage.setItem('entityuploadMessage',res.message);
        sessionStorage.setItem('uploadStatus','success');
        this.uploaddialog?.openDialog();
        this.tabChanged();
      } else if (res.success === false) {
        console.log('Authorize Status', res);
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
    });
  }
  reject() {
    var celldata = JSON.parse(sessionStorage.getItem('cellData') || 'null');
    let isAuthorze = JSON.stringify(false);
    let remarks = this.remarks;
    console.log(isAuthorze);
    this.entityService.UserfileChangeStatus(isAuthorze, remarks).subscribe((res: any) => {
      if (res.success === true) {
        console.log('Rejected Status', res); // this.GetUploadFiles();
        this.tabChanged();
        sessionStorage.setItem('entityuploadMessage',res.message);
        sessionStorage.setItem('uploadStatus','success');
        this.uploaddialog?.openDialog();
      } else if (res.success === false) {
        console.log('Authorize Status', res);
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
    });
  }

  UploadEntity() {
    sessionStorage.setItem('entityData', 'authorizeData');
    // this.router.navigate(['/add-entity']);
    this.dialog.open(UploadPopupComponent, {
      hasBackdrop: true,
      backdropClass: 'backdropBackground',
      disableClose: false,
      data :{
        upload: true,
      }
    });
  }
  resetPinned() {
    this.gridOptions.columnApi!.applyColumnState({
      state: [
        { colId: 'Unit', pinned: 'left' },
        { colId: 'IFSC', pinned: 'left' },
        { colId: 'age', pinned: 'left' },
        { colId: 'total', pinned: 'right' },
      ],
      defaultState: { pinned: null },
    });
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
    d.length == 1 && (d = '0' + d);
    m.length == 1 && (m = '0' + m);
    return d + m + y;
  }

  changeLevel(event: any) {
    console.log('Event', event);
    // alert("hhhh")
    this.parentUnit = '';
    let level = event.level;
    this.Level = event.level;
    this.entityService.getParentLevels(this.Level).subscribe(
      (res: any) => {
        console.log('LevelsResponse', res);
        if (res) {
          this.parentLevelsData = res?.data;
          console.log('ParentLevelsResponse', this.parentLevelsData);
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
    console.log('ParentLevel', this.parentUnit);
  }

  authorise(){
   this.submitSuccessfully = false
  }
}
