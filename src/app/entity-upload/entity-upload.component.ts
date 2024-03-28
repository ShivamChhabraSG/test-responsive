import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormGroup, FormControl, Validator, Validators, FormBuilder } from "@angular/forms";
import { FormBuilder, FormsModule, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { ColDef, GridOptions, PaginationChangedEvent } from 'ag-grid-community';
import { IDropdownSettings } from "ng-multiselect-dropdown/multiselect.model";
import { CellClassParams, CellClassRules, CellClickedEvent, CellValueChangedEvent, FirstDataRenderedEvent, GridReadyEvent, RowValueChangedEvent, SideBarDef, GridApi, ModuleRegistry, ColumnResizedEvent, Grid, } from 'ag-grid-community';
import { IconArrowComponent } from '../icon-arrow/icon-arrow.component';
import { AgGridAngular } from 'ag-grid-angular';
// import 'jspdf-autotable';
// import  {jsPDF} from 'jspdf' ;
import * as jsPDF from 'jspdf';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutServiceService } from '../services/logout-service.service';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
import { left } from '@popperjs/core';

// @ts-ignore
import printDoc from "src/assets/js/printDoc";
import { UploadPopupComponent } from '../upload-popup/upload-popup.component';
import { csvUploadServiceService } from '../services/csv-upload-service.service';
import { from } from 'rxjs';
import { WarningPopupComponent } from '../warning-popup/warning-popup.component';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { UploadStatusDialogComponent } from '../upload-status-dialog/upload-status-dialog.component';
import { WarningAuthDialogComponent } from '../warning-auth-dialog/warning-auth-dialog.component';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-entity-upload',
  templateUrl: './entity-upload.component.html',
  styleUrls: ['./entity-upload.component.css']
})
export class EntityUploadComponent {
  @ViewChild('fileInput')
  fileInput: any;
  
  @ViewChild(UploadStatusDialogComponent) uploaddialog: UploadStatusDialogComponent | undefined;
  @ViewChild(WarningAuthDialogComponent) warningdialog: WarningAuthDialogComponent | undefined;
  @ViewChild(WarningDialogComponent) deletedialog: WarningDialogComponent | undefined;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
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
  uploadFileData: any = [];
  logoutResponse: any;
  entitlements: any = [];
  disabledFields: any;
  authorizePermission: boolean = false;
  parentUnit: any;
  Level: any;
  parentLevelsData: any = [];
  changeLevelIden: boolean = false;
  uploadStatus: any;
  seletedGridLevel: any;
  seletedGridParentUnit: any;
  selectedFile: File | null = null;
  UploadedLevelss: any;
  ParentUnitLevels: any;
  statusUnits: any;
  csvViewData: any = [];
  UploadedStts: any = '';
  EditFunctionality:any;
  showSelectedBank : any
  isDropdownOpen: boolean = false;

  // uploadFileData: any = [];

  // toppingList = ['Unit', 'IFSC', 'Level', 'Parent Unit', 'Unit Name', 'Maker', 'Checker', 'Record Status', 'Pin Code', 'Email', 'District', 'State', 'Status', 'Maker time', 'Checker Time'];

  toppingList = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];

  toppingListLeft: any[] = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];
  toppingListRight: any[] = [{ field: 'Unit', label: 'Unit' }, { field: 'IFSC', label: 'IFSC' }, { field: 'Level', label: 'Level' }, { field: 'Parent_Unit', label: 'Parent Unit' }, { field: 'Unit_Name', label: 'Unit Name' }, { field: 'Maker', label: 'Maker' }, { field: 'Checker', label: 'Checker' }, { field: 'Status', label: 'Status' }, { field: 'Record_status', label: 'Record Status' }, { field: 'Pin_Code', label: 'Pincode' }, { field: 'emailId', label: 'Email' }, { field: 'District', label: 'District' }, { field: 'State', label: 'State' }, { field: 'maker_time', label: 'Maker time' }, { field: 'checker_time', label: 'Checker Time' }];

  tooltip: any;
  checkCSV: boolean = true;

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

    { headerName: 'File Name', field: 'fileName', tooltipField: "filename", editable: false, suppressSizeToFit: true, resizable: true,width:130 },
    // { headerName: 'Products', field: 'Products', editable: false, sort: 'desc', suppressSizeToFit: true, },
    { headerName: 'Remarks', field: 'remarks', tooltipField: "district", editable: false, suppressSizeToFit: true, resizable: true, width:110},
    { headerName: 'Upload Status', field: 'statusDetails', tooltipField: "statusDetails", editable: false, suppressSizeToFit: true, resizable: true, width:150},
    { headerName: 'Level', field: 'level', tooltipField: "levelName", editable: false, suppressSizeToFit: true, resizable: true,width:100 },
    { headerName: 'Parent Unit', field: 'parentUnitName', tooltipField: "parentUnitName", editable: false, suppressSizeToFit: true, resizable: true,width:140 },
    { headerName: 'Uploaded By', field: 'uploadedBy', tooltipField: "uploadedby", editable: false, suppressSizeToFit: true, resizable: true, width:150},
    { headerName: 'Uploaded Date Time', field: 'uploadedDateTime',tooltipField: "emailId",comparator:this.dateComparator , editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Authorised By', field: 'authorizedBy', tooltipField: "maker", editable: false, suppressSizeToFit: true, resizable: true, width:150},
    { headerName: 'Authorised Date Time', field: 'authorizedDateTime',tooltipField: "checker",comparator:this.dateComparator2 , editable: false, suppressSizeToFit: true, resizable: true,width:220 },
    { headerName: 'Total Records', field: 'totalRecords', tooltipField: "statusName", editable: false, suppressSizeToFit: true, resizable: true, width:150},
    { headerName: 'Success Records', field: 'successRecords', tooltipField: "entityStatusName", editable: false, suppressSizeToFit: true, resizable: true,width:170},
    { headerName: 'Error Records', field: 'errorRecords', tooltipField: "pincode", editable: false, suppressSizeToFit: true, resizable: true,width:150},
  ];

  public pageSize = 20;
  public totalPages! : number;
  public rowCount!: number;
  
 onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(this.pageSize);
     
  }
  // Custom number formatter for pagination
  customNumberFormatter(params: any) {
    return params.value.toLocaleString();
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
  gridColumnApi: any;
  checker: any = []
  maker: any = [];
  location: any;
  newData: any;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();



  }
 
  disabled = false;
  selectedItems: any = [];
  constructor(
    private http: HttpClient, private spinner: NgxSpinnerService,
    private dateFormatService:DateFormatServiceService,
    private logoutService: LogoutServiceService, private entityGridService: SharedEntityServiceService, private fb: FormBuilder, public dialog: MatDialog, private router: Router, private bnIdle: BnNgIdleService, private entityService: EntityScreenServiceService,) {
    this.tokenExpireyTime = sessionStorage.getItem('tokenExpirationTimeInMinutes');
    this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
    this.entityService.ReloadGrid.subscribe(()=>{
      this.ngOnInit()
      // this.selectedFile = null
    })
    // this.tokenExpireyTime = sessionStorage.getItem('tokenExpirationTimeInMinutes');
    // this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
    // this.bnIdle.startWatching(this.tokenExpireyTime).subscribe((res) => {
    //   if (res) {
    //     this.logoutService.logout().subscribe((res: any) => {
    //       if (res) {
    //         this.logoutResponse = res;
    //        
    //         this.router.navigate(['/home']);
    //       }
    //     },
    //       (err: any) => {
    //         // alert(err.error.message)
    //        
    //       }
    //     );
    //   }
    // })
  }
  selectedItemsArray: any = [];
  dropdownSettings: IDropdownSettings = {};
  data: any = []
  viewPermission: boolean = false;
  AddPermission: boolean = false;
  EditPermission: boolean = false;
  // EditTrue
  ngOnInit() {
    this.GetUploadFiles();
    this.changeLevel();
    this.EditFunctionality =  sessionStorage.getItem("EditPermission");
   
    let data: any = sessionStorage.getItem("sideNavbar");
   

    this.entitlements = JSON.parse(data ? data : '')
    
    this.entitlements.forEach((elements: any) => {
      // debugger
      if (elements == 'View') {
        this.viewPermission = true;
        // this.getLevelsData();
      }
      else if (elements == 'Add') {
        this.AddPermission = true;
        this.changeLevelIden = false;
        // this.getLevelsData();
      }
      else if (elements == 'Edit') {
        this.EditPermission = true;
        // this.getLevelsData();
      }
      else if (elements == 'Authorize') {
        this.authorizePermission = true;
        this.changeLevelIden = false;
        // this.getLevelsData();
      }
      // Authorize

    })
   
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
    this.resetPinned()
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
   
    this.gridApi.setQuickFilter(
      target.value
    );
  }


  showhided: boolean = false;
  onCellClicked(event: CellClickedEvent) {
    this.checker = sessionStorage.getItem('UserId')
    this.maker = event.data.maker;
  
    this.showhided = true;
    sessionStorage.setItem('cellData', JSON.stringify(event.data))
    console.log("CellDataClicked",event.data);
    let unitCode = event.data.unit;
    this.disabledFields = false;
   
    sessionStorage.setItem("UnitCode", unitCode)
    this.uploadStatus = event.data.uploadStatus;
    console.log("UploadStatus",event.data);
    this.seletedGridLevel = event.data.levelId;
    this.seletedGridParentUnit = event.data.parentUnit
    sessionStorage.setItem("UploadStatus", event.data.uploadStatus);
    sessionStorage.setItem("AuthStatus", event.data.uploadStatus)

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

    this.gridColumnApi.applyColumnState({
      state: state,
      defaultState: { pinned: null },
    });
  }

  onSearchChange($event: any, anything?: any) {
   
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
      
      setTimeout(() => {
        this.GetUploadFiles();
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
    this.uploadFileData.forEach((element: any) => {
      rows.push(element);

    });
    doc.autoTable(col, rows);
    doc.save('row_export_' + new Date().getTime() + '.pdf');
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.uploadFileData); // Sale Data
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
    this.entityService.getLevelss(this.changeLevelIden).subscribe((res: any) => {
    
      if (res) {
        this.levelsData = res?.data;
      //  this.Level = this.levelsData[0];
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
   
    this.tabEvent = event.index;
   
    let selectedLevel = this.levelsData[this.tabEvent].level;
    this.entityService.getGridDataFromLevels(selectedLevel).subscribe(
      (res: any) => {
      if (res) {
        this.uploadFileData = res.data;
       
        this.uploadFileData.map((x: any) => {
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
  // viewEnity() {
  //   sessionStorage.setItem("entityData", "viewData");
  //   this.router.navigate(['/entity-upload-view']);
  // }
  addEntity() {
    sessionStorage.setItem("entityData", "addData");
    this.router.navigate(['/add-entity']);
  }

  OnAuthDialog(){
    const message = "You are a maker, Please login as Checker."
    sessionStorage.setItem("RateAllowedPopup",message);
    sessionStorage.setItem('PopupMaitainance','NrlmUpload');
    this.errordialog?.openDialog();
  }
  EditEntity() {
    sessionStorage.setItem("entityData", "editData");
    this.router.navigate(['/add-entity']);
  }
  DeleteEntity() {
    this.showhided = false
    sessionStorage.setItem("popupDelete", "UploadDeleted");
    this.deletedialog?.openDialog();
   // this.dialog.open(WarningPopupComponent, { panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass: 'backdropBackground', disableClose: false })
  }
  AuthorizeEntity() {
    //  alert("this is authorizing")
     sessionStorage.setItem("auth", "authorizeData");
     this.warningdialog?.openDialog();
    // this.router.navigate(['/add-entity']);
  }
  UploadEntity() {
    sessionStorage.setItem("entityData", "authorizeData");
    // this.router.navigate(['/add-entity']);
    this.dialog.open(UploadPopupComponent, { hasBackdrop: true, backdropClass: 'backdropBackground', disableClose: false })
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

  changeListener(fileInput: HTMLInputElement) {
    const files = fileInput.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
      this.checkCSV = this.selectedFile.name.endsWith('.csv');
      
    }
    fileInput.value = ''
  }
uploadFile() {
  if (this.selectedFile) {
    let fileName: any = this.selectedFile.name
    var formdata = new FormData();
    formdata.append("inputFile", this.selectedFile, fileName);
    console.log(this.uploadFileData);
    if(this.uploadFileData !==null) {
      this.newData = this.uploadFileData.find((row: { levelId: any; parentUnit: any; }) => row.levelId === this.Level && row.parentUnit === this.parentUnit);
    //  alert("Error");
      console.log("Errr",this.newData);
      
    }
     else if(this.uploadFileData === null){
      this.newData = null;
      console.log(this.newData);
    }
     if(this.newData !== undefined && this.newData !== null){
      this.UploadedStts = this.newData.uploadStatus;
      console.log("UploadedFiles",this.newData);
    }
     if ((this.newData !== undefined && this.newData !== null) && (this.UploadedStts === 'R' || this.UploadedStts === 'E')) {
      if (this.UploadedLevelss.filter((value: any) => this.UploadedLevelss.indexOf(value) === this.Level) && this.ParentUnitLevels.filter((value: any) => this.ParentUnitLevels.indexOf(value) === this.parentUnit) && (this.UploadedStts === 'E' || this.UploadedStts === 'R')) {
        this.entityService.DeleteUploadedFile(this.newData.entityDataStatusId).subscribe(
          (res: any) => {
            this.spinner.show();
           
            if(res.success === true) {
              this.entityService.uploadEntityData(this.parentUnit, this.Level, formdata).subscribe(
                (res: any) => {
                 this.selectedFile = null;
                  if (res.success == true) {
                 this.selectedFile = null;
                    this.GetUploadFiles();
                    this.spinner.hide();
                    this.entityGridService.filter('Register click')
                    // alert(res.message);
                    sessionStorage.setItem('uploadStatus','success');
                    sessionStorage.setItem('entityuploadMessage',res.message);
                    this.uploaddialog?.openDialog();
                  }
                  if (res.success == false) {
                   // alert(res.message);
                 this.selectedFile = null;
                   sessionStorage.setItem('uploadStatus','AlreadyExist');
                   sessionStorage.setItem('entityuploadMessage',res.message);
                   this.uploaddialog?.openDialog();
                    this.spinner.hide();

                  }
                },
                (err: any) => {
                  this.spinner.hide();
               this.selectedFile = null;
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
          },
          (err: any) => {
            this.spinner.hide();
            this.selectedFile = null;
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
     if (((this.newData !== undefined && this.newData !== null) && (this.UploadedStts === 'S'))) {
      //alert("File Already Exist Pending Authorisation");
      const message = "File Already Exist Pending Authorisation";
      sessionStorage.setItem('entityuploadMessage',message);
      sessionStorage.setItem('uploadStatus','AlreadyExist');
      this.uploaddialog?.openDialog();
    }
     if (((this.newData !== undefined && this.newData !== null) && (this.UploadedStts === 'A'))) {
      this.entityService.uploadEntityData(this.parentUnit, this.Level, formdata).subscribe(
        (res: any) => {
          this.spinner.show()
           this.selectedFile = null;
          if (res.success == true) {
            this.selectedFile = null;
            this.spinner.hide();
            this.GetUploadFiles();
            this.entityGridService.filter('Register click')
          //  alert("File uploaded successfully!");
          const message = "File uploaded successfully!";
          sessionStorage.setItem('entityuploadMessage',res.message);
          sessionStorage.setItem('uploadStatus','success');
          this.uploaddialog?.openDialog();
          }
          else if (res.success == false) {
           // alert(res.message);
          this.selectedFile = null;
            this.spinner.hide();
            sessionStorage.setItem('entityuploadMessage',res.message);
            sessionStorage.setItem('uploadStatus','AlreadyExist');
            this.uploaddialog?.openDialog();
          }
        },
        (err: any) => {
          this.spinner.hide();
          this.selectedFile = null;
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
     if (this.newData === undefined || this.newData === null) {
      this.entityService.uploadEntityData(this.parentUnit, this.Level, formdata).subscribe(
        (res: any) => {
          this.spinner.show();
         
          if (res.success == true) {
           this.levelsData = ''; this.selectedFile = null;
            this.spinner.hide();
            this.GetUploadFiles();
            this.entityGridService.filter('Register click')
           // alert("File uploaded successfully!");
           const message = "File uploaded successfully!";
           sessionStorage.setItem('entityuploadMessage',res.message);
           sessionStorage.setItem('uploadStatus','success');
           this.uploaddialog?.openDialog();
          }
          else if (res.success == false) {
          //  alert(res.message);
        this.selectedFile = null;
          sessionStorage.setItem('entityuploadMessage',res.message);
          sessionStorage.setItem('uploadStatus','AlreadyExist');
          this.uploaddialog?.openDialog();
            this.spinner.hide();
          }
        },
        (err: any) => {
          this.spinner.hide();
         this.selectedFile = null;
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
  } else {
  
  }
  this.selectedFile = null
  this.showhided = false
}
  // changeListener(files: FileList){
  // 
  //   if(files && files.length > 0) {
  //      let file : File = files.item(0); 
  //        
  //        let reader: FileReader = new FileReader();
  //        reader.readAsText(file);
  //        reader.onload = (e) => {
  //           let csv: string = reader.result as string;
  //          
  //        }
  //     }

  // }
  convertedDateFormat() {
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    return d + m + y;
  }

  // Function to handle the file download
  onBtnExport() {
    var celldata = JSON.parse(sessionStorage.getItem('cellData') || "null");
    console.log("DownloadCellData",celldata);
    let DataStatusId = celldata.entityDataStatusId

    this.entityService.downloadEntityDetails(DataStatusId).then(
      (response: any) => {
    
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
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
  
    // this.gridApi.exportDataAsCsv({ fileName: '' + this.convertedDateFormat() });
  }
  forVIewDownloadData() {
    var celldata = JSON.parse(sessionStorage.getItem('cellData') || "null");
    console.log("ViewCellData",celldata);
    let DataStatusId = celldata.entityDataStatusId
    this.entityService
      .downloadEntityDetails(DataStatusId)
      .then(
        (response: any) => {
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
          
            this.csvViewData = parsedData;
            console.log("CsvData",this.csvViewData);
            sessionStorage.setItem("entityData", "viewEntity");
            sessionStorage.setItem("viewCsvDAta", JSON.stringify(this.csvViewData));
            this.router.navigate(['/entity-upload-view']);
            
          })
      }).catch(
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
      });
  }
  combinedArray:any = [];
  changeLevel() {
    // console.log("Event",event);
    this.Level = 4;
    this.entityService.getParentLevels(this.Level).subscribe(
      (res: any) => {
   
      if (res) {
        // this.levelsData
        this.parentLevelsData = res?.data;
        console.log("ParentUnit",this.parentLevelsData);
        let combinedIdValue = this.parentLevelsData.map((item:any) => `${item.unitCode}-${item.unit}`);
        console.log("CombinedIdValue",combinedIdValue);
        let combinedIdArray = this.parentLevelsData.map((item:any) => item.unitCode);
        console.log("CombinedIdArray",combinedIdArray);
  // Combine arrays into an array of objects
this.combinedArray = combinedIdValue.map((value: any, index: string | number) => ({ unit: value, unitCode: combinedIdArray[index] }));
if (this.combinedArray.length === 1) {
  this.parentUnit = this.combinedArray[0].unitCode;
  this.showSelectedBank = this.combinedArray[0].unit;
}
// Print the result
console.log("arrayOfObjects",this.combinedArray);

      // result_dict = {item['combinedIdValue']: item['combinedIdValue'] for item in data_list}
      //   console.log("combinedArray",this.combinedArray);
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
  GetUploadFiles() {
    this.spinner.show();
    this.entityService.getUploadFiles().subscribe(
      (res: any) => {
      this.spinner.hide();
    
      if (res) {
        this.uploadFileData = res?.data

        let UploadedLevels = res?.data.map((res: any) => res.levelId)
      
        this.UploadedLevelss = [... new Set(UploadedLevels)];
        let ParentUnitLevel = res?.data.map((res: any) => res.parentUnit)
        this.ParentUnitLevels = [... new Set(ParentUnitLevel)];
        let statusUnit = res?.data.map((res: any) => res.uploadStatus)
        this.statusUnits = [... new Set(statusUnit)];
       
        // this.uploadFileData.forEach( ()=> {

        // })
       
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
  // getUploadFiles()
  getParentLevel(event: any) {
    console.log("Event",event.unitCode);
    this.parentUnit = event.unitCode;
    this.showSelectedBank = event.unit
    console.log("ParentUnit",this.parentUnit);
  }

  Reject(){
    this.showhided = false
  }
  remarks: string = ' ';
  Authorize() {
    var celldata = JSON.parse(sessionStorage.getItem('cellData') || "null");
    let parent_unit = celldata.parentUnit
    let level = celldata.levelId
    let isAuthorze = JSON.stringify(true)
    let remarks = this.remarks
  
    this.entityService.changeStatus(parent_unit, level, isAuthorze, remarks).subscribe(
      (res: any) => {
      if (res.success === true) {
        const message = "Authorised Successfully."
        sessionStorage.setItem("RateAllowedPopup",message);
        sessionStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
        this.errordialog?.openDialog();
        this.showhided = false
       // this.GetUploadFiles();
      } else if (res.success === false) {
        
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
    // Reset the textarea value
    this.remarks = '';
  }
  reject() {
    var celldata = JSON.parse(sessionStorage.getItem('cellData') || "null");
    let parent_unit = celldata.parentUnit
    let level = celldata.levelId
    let isAuthorze = JSON.stringify(false)
    let remarks = this.remarks
  
    this.entityService.changeStatus(parent_unit, level, isAuthorze, remarks).subscribe(
      (res: any) => {
      if (res.success === true) {
        const message = "Rejected Successfully."
        sessionStorage.setItem("RateAllowedPopup",message);
        sessionStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
        this.errordialog?.openDialog();
       // this.GetUploadFiles();
      } else if (res.success === false) {
        
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
    // Reset the textarea value
    this.remarks = '';
  }
}
