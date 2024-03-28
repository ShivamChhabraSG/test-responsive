import { Component, OnInit, ViewChild } from '@angular/core';
// import { FormGroup, FormControl, Validator, Validators, FormBuilder } from "@angular/forms";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
// @ts-ignore
import printDoc from "src/assets/js/printDoc";
import { UploadPopupComponent } from '../upload-popup/upload-popup.component';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { WarningLogDialogComponent } from '../warning-log-dialog/warning-log-dialog.component';
import {filter, toArray} from 'rxjs';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
@Component({
  selector: 'app-entity-screen',
  templateUrl: './entity-screen.component.html',
  styleUrls: ['./entity-screen.component.css'],
})
export class EntityScreenComponent {
  @ViewChild('agGrid')
  isOpen = true;
  @ViewChild(WarningLogDialogComponent) warningdialog:
    | WarningLogDialogComponent
    | undefined;
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
  currentStatus: boolean = true;
  StatusName: any = [];
  makerId: any;
  loginUserId: any;
  entityStatus: any;
  bankHOCode: any;
  bankRCode: any;
  bankSCode: any;
  bankROCode: any;
  bankCode: any;
  branchCode: any;
  unitCode: any;
  ROunitCode: any;
  roleCode: any;
  uploadPermission: boolean = false;
  selectedTabIndex: number = 0;
  showEditImage: boolean = true;
  @ViewChild(ErrorDialogComponent) errordialog: | ErrorDialogComponent | undefined;

  showSelectedRegion : any
  isRegionOpen : boolean =false
  showSelectedBank : any
  isBankOpen : boolean =false
  showSelectedBranch : any
  isBranchOpen : boolean =false
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
    { field: 'Email', label: 'Email' },
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
  bankUnCode: any;
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
      headerName: 'Unit',
      field: 'Unit',
      tooltipField: 'unit',
      resizable: true,
      width: 80,
    },
    {
      headerName: 'IFSC',
      field: 'IFSC',
      tooltipField: 'ifsc',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 100,
    },
    {
      headerName: 'Level',
      field: 'Level',
      tooltipField: 'levelName',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 100,
    },
    {
      headerName: 'Parent Unit',
      field: 'Parent_Unit',
      tooltipField: 'parent_unit',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 130,
    },
    {
      headerName: 'Unit Name',
      field: 'Unit_Name',
      tooltipField: 'unit_name',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 130,
    },
    {
      headerName: 'Status',
      field: 'Status',
      tooltipField: 'statusName',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 100,
    },
    {
      headerName: 'Record Status',
      field: 'Record_status',
      tooltipField: 'entityStatusName',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 150,
    },
    {
      headerName: 'Email',
      field: 'Email',
      tooltipField: 'emailId',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 150,
    },
    {
      headerName: 'Maker',
      field: 'Maker',
      tooltipField: 'maker',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 100,
    },
    {
      headerName: 'Checker',
      field: 'Checker',
      tooltipField: 'checker',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 110,
    },
    {
      headerName: 'Pincode',
      field: 'Pin_Code',
      tooltipField: 'pincode',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 100,
    },
    {
      headerName: 'District',
      field: 'District',
      tooltipField: 'district',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 100,
    },
    {
      headerName: 'State',
      field: 'State',
      tooltipField: 'state',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 100,
    },
    {
      headerName: 'Maker Time',
      field: 'maker_time',
      tooltipField: 'maker_time',
      comparator: this.dateComparator,
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 170,
    },
    {
      headerName: 'Checker Time',
      field: 'checker_time',
      tooltipField: 'checker_time',
      comparator: this.dateComparator2,
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width: 170,
    },
  ];

  gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    defaultColDef: {
      resizable: true,
      filter: true,
      sortable: true,
      // floatingFilter: true,
    },
    // onCellClicked: (event: CellClickedEvent) => console.log('Cell was clicked'),
    onGridReady: (params) => {
      this.gridApi = params.api;
      this.gridColumnApi = params.columnApi;
    },
  };
  public defaultColDef: ColDef = {
    suppressSizeToFit: true,
    sortable: true,

    filter: 'agTextColumnFilter',
    // flex: 8,
    // resizable: true,
    // sortable: true,
  };
  gridColumnApi: any;
  public pageSize = 20;
  public totalPages!: number;
  public rowCount!: number;

  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(this.pageSize);
  }
  // Custom number formatter for pagination
  customNumberFormatter(params: any) {
    return params.value.toLocaleString();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  disabled = false;
  selectedItems: any = [];
  constructor(
    private http: HttpClient,
    private dateFormatService: DateFormatServiceService,
    private spinner: NgxSpinnerService,
    private logoutService: LogoutServiceService,
    private entityGridService: SharedEntityServiceService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private bnIdle: BnNgIdleService,
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

    //         this.router.navigate(['/home']);
    //       }
    //     },
    //       (err: any) => {
    //         // alert(err.error.message)

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

  ngOnInit() {
    let tokendata: any = sessionStorage.getItem('TokenDetals');
    let token: any = JSON.parse(tokendata);

    this.roleCode = token?.level;
    console.log(this.roleCode);
    let data: any = sessionStorage.getItem('sideNavbar');

    this.loginUserId = sessionStorage.getItem('loginUserId');

    this.entitlements = JSON.parse(data ? data : '');
    this.entitlements.forEach((elements: any) => {
      if (elements == 'View') {
        this.viewPermission = true;
      } else if (elements == 'Add') {
        this.AddPermission = true;
      } else if (elements == 'Edit') {
        this.EditPermission = true;
        if (this.EditPermission == true) {
          sessionStorage.setItem('EditPermission', 'EditTrue');
        }
      } else if (elements == 'Authorize') {
        this.authorizePermission = true;
      } else if (elements == 'FileUpload') {
        this.uploadPermission = true;
      } else if (elements == 'FileView') {
        this.uploadPermission = true;
      }
      // Authorize
    });

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
      itemsShowLimit: 1,
    };

    // this.setForm()
    this.selectedItemsArray.push('Unit');
    this.myForms.patchValue({
      name: this.toppingList,
    });
    // alert(this.toppingList[0])
    this.getLevelsData();
    this.getHOdata();
    this.getROdata();
    this.getBankDataByLevels();
    //this.getBranchDataByLevels();
    // this.getbankdata();
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
  searchText: any;

  onFilterTextBoxChanged(gridOptions: any, $event: any) {
    const { target } = $event;
    this.searchText = target.value;

    this.gridApi.setQuickFilter(target.value);
  }

  showhided: boolean = false;
  onCellClicked(event: CellClickedEvent) {
    this.showhided = true;
    console.log('Celldata', event.data);
    sessionStorage.setItem('EntityCelldata', JSON.stringify(event.data));
    this.StatusName = event.data.status;
    let unitCode = event.data.unit;
    this.disabledFields = false;
    this.makerId = event.data.Maker;
    this.makerId = this.makerId.split('-');
    this.makerId = this.makerId[0];
    this.entityStatus = event.data.status;
    sessionStorage.setItem('UnitCode', unitCode);
    sessionStorage.setItem('Status', event.data.status);
    sessionStorage.setItem('AuthStatus', event.data.Status);
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
  onItemSelect(selectedField: any, type: string) {
    let item = selectedField.field;

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
    // this.showhide = true;
    // this.gridColumnApi.setColumnsVisible([item], this.showhide);
    // this.gridApi.sizeColumnsToFit();
  }

  onItemDeSelect(selectedField: any, type: string) {
    let item = selectedField.field;
    let obj: any = { field: selectedField.field, label: selectedField.label };
    if (type == 'left') {
      this.leftPinnedColumns = this.leftPinnedColumns.filter((x) => x != item);
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
  hoData: any = [];
  getHOdata() {
    const levels = 1;
    this.entityService.getGridDataFromLevels(levels).subscribe(
      (res: any) => {
        console.log(res);
        this.hoData = res?.data;
        this.bankHOCode = this.hoData[0].unit;
        console.log(this.bankHOCode);
        if (res && Array.isArray(res.data)) {
          this.selectedLevelData = res.data;
          // this.selectedLevelData=this.selectedLevelData.filter((item:any)=> item.unit == this.ROunitCode);
          this.selectedLevelData.map((x: any) => {
            x.Unit = x.unit;
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
            x.Record_status = x.entityStatusName;
          });
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

  roData: any = [];
  roAllData: any = [];
  getROdata() {
    const levels = 2;
    this.entityService.getGridDataFromLevels(levels).subscribe(
      (res: any) => {
        if (res && Array.isArray(res.data)) {
          //  this.selectedLevelData = res.data;
          console.log(res.data);
          this.roAllData = res.data;
          // console.log(this.selectedLevelData);
          this.roData = res.data.map(
            (item: { unit_name: any }) => item.unit_name
          );
          console.log(this.roData.length);
          if (this.roData.length > 1) {
            const unit_name = 'All';
            this.roData.unshift(unit_name);
          } else if (this.roData.length === 1) {
            this.selectedLevelData = res.data;
            this.bankRCode = this.roData.toString();
            this.bankROCode = this.bankRCode;
            this.showSelectedRegion = this.bankRCode
            console.log(this.bankRCode);
            // this.selectedLevelData=this.selectedLevelData.filter((item:any)=> item.unit == this.ROunitCode);
            this.selectedLevelData.map((x: any) => {
              x.Unit = x.unit;
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
              x.Record_status = x.entityStatusName;
            });
          }
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
  bankData: any = [];
  bankAllData: any = [];
  getBankDataByLevels() {
    const levels = 3;
    this.entityService.getGridDataFromLevels(levels).subscribe(
      (res: any) => {
        if (res && Array.isArray(res.data)) {
          //  this.selectedLevelData = res.data;

          // console.log(this.selectedLevelData);
          this.bankAllData = res.data;
          this.bankData = res.data.map(
            (item: { unit_name: any }) => item.unit_name
          );
          console.log(this.bankData);
          if (this.bankData.length > 1) {
            const unit_name = 'All';
            this.bankData.unshift(unit_name);
          } else if (this.bankData.length == 1) {
            this.selectedLevelData = res.data;
            this.bankSCode = this.bankData.toString();
            console.log("BankSCode",this.bankSCode);
            const bankCode = this.bankSCode.split(' -')[0];
            this.bankUnCode = bankCode;
            this.bankCode = this.bankSCode;
            this.showSelectedBank = this.bankSCode
            // this.selectedLevelData=this.selectedLevelData.filter((item:any)=> item.unit == this.ROunitCode);
            this.selectedLevelData.map((x: any) => {
              x.Unit = x.unit;
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
              x.Record_status = x.entityStatusName;
            });
            this.getbranchdata();
          }

          // this.unitCode = res.data.map((item: { unit: any; }) => item.unit);
        }
        // console.log(res);
        //console.log(this.roData);
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

  getBranchDataByLevels() {
    const levels = 4;
    this.entityService.getGridDataFromLevels(levels).subscribe(
      (res: any) => {
      if (res && Array.isArray(res.data)) {
        //  this.selectedLevelData = res.data;

        // console.log(this.selectedLevelData);
        this.branchAllData = res.data;
        this.branchData = res.data.map(
          (item: { unit_name: any }) => item.unit_name
        );
        console.log(this.branchData);
        if (this.branchData.length > 1) {
          const unit_name = 'All';
          this.branchData.unshift(unit_name);
        } else if (this.branchData.length == 1) {
          this.selectedLevelData = res.data;
          //  this.bankSCode = this.branchData.toString();
          //   console.log(this.bankSCode);
          //   this.bankCode = this.bankSCode;
          // this.selectedLevelData=this.selectedLevelData.filter((item:any)=> item.unit == this.ROunitCode);
          this.selectedLevelData.map((x: any) => {
            x.Unit = x.unit;
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
            x.Record_status = x.entityStatusName;
          });
        }

        // this.unitCode = res.data.map((item: { unit: any; }) => item.unit);
      }
      // console.log(res);
      //console.log(this.roData);
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

  getbankdata() {
    if (this.ROunitCode === 'All') {
      const levels = 3;
      this.entityService.getGridDataFromLevels(levels).subscribe(
        (res: any) => {
        if (res && Array.isArray(res.data)) {
          this.bankAllData = res.data;
          this.bankData = res.data.map(
            (item: { unit_name: any }) => item.unit_name
          );

          const unit_name = 'All';

          this.bankData.unshift(unit_name);
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
    } else {
      this.entityService.getGridDataFromUnits(this.ROunitCode).subscribe(
        (res: any) => {
          console.log(res);
          if (res.data == null) {
            this.bankData = null;
          }
          if (res && Array.isArray(res.data)) {
            // this.selectedLevelData = res.data;
            this.bankAllData = res.data;
            console.log(res.data);
            this.bankData = res.data.map(
              (item: { unit_name: any }) => item.unit_name
            );
            if (this.bankData.length > 1) {
              const unit_name = 'All';

              this.bankData.unshift(unit_name);
            }
          }
          //  console.log(res);
          console.log(this.bankData);
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
  }

  branchData: any = [];
  branchAllData: any = [];
  isBranchReady: boolean = false;
  getbranchdata() {
    if (this.bankCode === 'All') {
      const levels = 4;
      this.entityService.getGridDataFromLevels(levels).subscribe(
        (res: any) => {
        if (res && Array.isArray(res.data)) {
          this.isBranchReady = true;
          this.branchAllData = res.data;
          this.branchData = res.data.map(
            (item: { unit_name: any }) => item.unit_name
          );

          const unit_name = 'All';

          this.branchData.unshift(unit_name);
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
    } else {
      const bankCode = this.bankCode.split(' -')[0];
      this.entityService
        .getGridDataFromUnits(bankCode)
        .subscribe(
          (res: any) => {
          console.log(res);
          if (res && Array.isArray(res.data) && res.data != null) {
            // this.selectedLevelData = res.data;
            this.isBranchReady = true;
            this.branchAllData = res.data;
            this.branchData = res.data.map(
              (item: { unit_name: any }) => item.unit_name
            );
            const unit_name = 'All';

            this.branchData.unshift(unit_name);
          }else{
            this.branchData = null;
          }
          //  console.log(res);
          console.log(this.branchData);
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
  }

  getHOStatus(event: any) {
    this.bankHOCode = event.unit;
  }
  getROStatus(event: any) {
    this.bankCode = null;
    this.branchCode = null;
    this.showSelectedRegion = event
    console.log(event);
    
    // console.log(event);
    if (event == 'All') {
      this.ROunitCode = 'All';
      this.selectedLevelData = this.roAllData;
      this.selectedLevelData.map((x: any) => {
        x.Unit = x.unit;
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
        x.Record_status = x.entityStatusName;
      });
    } else {
      this.ROunitCode = event.split(' -')[0];
      const levels = 2;
      this.spinner.show();
      this.entityService.getGridDataFromLevels(levels).subscribe(
        (res: any) => {
          this.spinner.hide();
          if (res && Array.isArray(res.data)) {
            this.selectedLevelData = res.data;
            this.selectedLevelData = this.selectedLevelData.filter(
              (item: any) => item.unit == this.ROunitCode
            );
            this.selectedLevelData.map((x: any) => {
              x.Unit = x.unit;
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
              x.Record_status = x.entityStatusName;
            });
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

    //console.log(this.selectedLevelData);
    this.getbankdata();
  }
  getBankStatus(event: any) {
    this.branchCode = null;
    this.showSelectedBank = event
    console.log(event);
    if (event == 'All') {
      this.bankCode = 'All';
      this.selectedLevelData = this.bankAllData;
      this.selectedLevelData.map((x: any) => {
        x.Unit = x.unit;
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
        x.Record_status = x.entityStatusName;
      });
    } else {
      this.bankCode = event;
      const bankCode = event.split(' -')[0];
      this.bankUnCode = bankCode;
      console.log("Bank Code", bankCode);
      console.log(bankCode);
      const levels = 3;
      this.spinner.show();
      this.entityService.getEntityDataByUnitCode(bankCode).subscribe(
        (res: any) => {
          console.log(res);
          this.spinner.hide();
          if (res && Array.isArray(res.data)) {
            this.selectedLevelData = res.data;
            // this.selectedLevelData=this.selectedLevelData.filter((item:any)=> item.unit == this.bankCode);
            this.selectedLevelData.map((x: any) => {
              x.Unit = x.unit;
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
              x.Record_status = x.entityStatusName;
            });
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

    this.getbranchdata();
  }

  getBranchStatus(event: any) {
    this.showSelectedBranch = event
    console.log(event);
    if (event == 'All') {
      this.selectedLevelData = this.branchAllData;
      this.isBranchReady = true;
      this.selectedLevelData.map((x: any) => {
        x.Unit = x.unit.split('_')[1];
        x.IFSC = x.ifsc;
        x.Level = x.levelName;
        x.Parent_Unit = x.parent_unit;
        x.Unit_Name = x.unit_name.split('-')[1];
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
        x.Record_status = x.entityStatusName;
      });
    } else {
      let bcode = event;
      console.log("Bcode",bcode);
      const branchCode = this.bankUnCode+"_"+bcode.split(' -')[0];
      const levels = 4;
      this.spinner.show();
      this.entityService.getEntityDataByUnitCode(branchCode).subscribe(
        (res: any) => {
          console.log(res);
          this.spinner.hide();
          this.isBranchReady = true;
          if (res && Array.isArray(res.data) && res.data != null) {
            this.selectedLevelData = res.data;
            // this.selectedLevelData=this.selectedLevelData.filter((item:any)=> item.unit == this.branchCode);
            this.selectedLevelData.map((x: any) => {
              x.Unit = x.unit.split('_')[1];
              x.IFSC = x.ifsc;
              x.Level = x.levelName;
              x.Parent_Unit = x.parent_unit;
              x.Unit_Name = x.unit_name.split('-')[1];
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
              x.Record_status = x.entityStatusName;
            });
          }else{
            this.selectedLevelData = null;
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
    // let bcode =event.$ngOptionLabel;
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
    let itemss = selectedFields.map((x: { field: any }) => x.field);
    this.showhide = true;
    this.gridColumnApi.setColumnsVisible(itemss, this.showhide);

    this.gridApi.sizeColumnsToFit();
  }
  ColumnSelectOrAll(selectedFields: any) {
    let itemss = selectedFields.map((x: { field: any }) => x.field);
    this.showhide = true;
    // alert(itemss);
    let items = [
      'Unit',
      'IFSC',
      'Level',
      'Parent Unit',
      'Unit Name',
      'Maker',
      'Checker',
      'Record Status',
      'Pin Code',
      'Email',
      'District',
      'State',
      'Status',
      'Maker time',
      'Checker Time',
    ];
    this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    this.gridApi.sizeColumnsToFit();
  }
  onSearchChange($event: any, anything?: any) {}
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
    // import("xlsx").then(xlsx => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.selectedLevelData); // Sale Data
    //   const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    //   const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   this.saveAsExcelFile(excelBuffer, "roles");
    // });
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
    // this.entityService.getLevels().subscribe((res:any)=> {
    //   this.levelsData = res;

    // })
    this.entityService.getLevelss(this.currentStatus).subscribe(
      (res: any) => {
        if (res) {
          // const newLevel = {
          //   level: 99,
          //   levelName: 'All'
          // };

          this.levelsData = res.data;
          this.levelsData.pop();
          // this.levelsData.push(newLevel)
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
    this.selectedTabIndex = event.index;
    this.showEditImage = event.index !== 0;
    this.showhided = false;
    this.spinner.show();
    this.tabEvent = event.index;
    let selectedLevel = this.levelsData[this.tabEvent].level;
    this.entityService.getGridDataFromLevels(selectedLevel).subscribe(
      (res: any) => {
        this.spinner.hide();
        if (res) {
          this.selectedLevelData = res.data;
          console.log('SelectedLevelData', this.selectedLevelData);
          this.selectedLevelData.map((x: any) => {
            x.Unit = x.unit;
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
            x.Record_status = x.entityStatusName;
          });
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
    sessionStorage.setItem('entityData', 'viewData');
    this.router.navigate(['/view-entity-screen']);
  }
  addEntity() {
    sessionStorage.setItem('entityData', 'addData');
    this.router.navigate(['/add-entity'], { queryParams: { mode: 'Add' } });
  }
  EditEntityDialog() {
    console.log('its htting Edit');
    sessionStorage.setItem('entityData', 'editData');
    if (this.entityStatus === 'A') {
      this.EditEntity()
    } else {
      this.warningdialog?.openDialog();
    }
    // this.router.navigate(['/add-entity'] ,{queryParams:{mode : 'Edit'}});
  }
  EditEntity() {
    sessionStorage.setItem('entityData', 'editData');
    this.router.navigate(['/add-entity'], { queryParams: { mode: 'Edit' } });
  }
  DeleteEntity() {
    sessionStorage.setItem('entityData', 'deleteData');
    this.router.navigate(['/add-entity'], { queryParams: { mode: 'Delete' } });
  }
  AuthorizeEntity() {
    sessionStorage.setItem('entityData', 'authorizeData');
    this.router.navigate(['/add-entity']);
  }
  UploadEntity() {
    sessionStorage.setItem('entityData', 'authorizeData');
    this.router.navigate(['/entity-upload-screen']);
    // this.dialog.open(UploadPopupComponent,{ hasBackdrop: true, backdropClass:'backdropBackground', disableClose:false})
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
  back() {
    this.router.navigate(['/entity-screen']);
  }
}