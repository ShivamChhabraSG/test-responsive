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


// @ts-ignore
import printDoc from "src/assets/js/printDoc";
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { WarningLogDialogComponent } from '../warning-log-dialog/warning-log-dialog.component';
import { map, take,filter } from 'rxjs';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css'],
})
export class UserDataComponent {
  @ViewChild('agGrid')
  isOpen = true;
  @ViewChild(WarningLogDialogComponent) warningLogdialog: WarningLogDialogComponent | undefined;
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
  AuthorizePermision: boolean = false;
  deletePermision: boolean = false;
  Rejected: any;
  maker:any;
  fileUpload:any;
  public pageSize = 20;
  public totalPages! : number;
  public rowCount!: number;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;

  currentStatus:boolean = true;
  // toppingList = ['Unit', 'IFSC', 'Level', 'Parent Unit', 'Unit Name', 'Maker', 'Checker', 'Record Status', 'Pin Code', 'Email', 'District', 'State', 'Status', 'Maker time', 'Checker Time'];

  toppingList = [
    { field: 'userId', label: 'User ID' },
    { field: 'levelName', label: 'Level' },
    { field: 'parentUnit', label: 'Parent Unit' },
    { field: 'name', label: 'User Name' },
    { field: 'givenName', label: 'Given Name' },
    { field: 'roleName', label: 'Role' },
    { field: 'statusName', label: 'Status' },
    { field: 'entityStatusName', label: 'Record Status' },
    { field: 'maker', label: 'Maker' },
    { field: 'makerTime', label: 'Maker Time' },
    { field: 'checker', label: 'checker' },
    { field: 'checkerTime', label: 'Checker Time' },
    { field: 'mobile', label: 'Mobile No.' },
    { field: 'emailId', label: 'Email' },
    { field: 'department', label: 'Department' },
    { field: 'grade', label: 'Grade' },
    { field: 'designation', label: 'Designation' },
    { field: 'unitCode', label: 'Unit Code' },
    { field: 'unitName', label: 'Unit Name' },
    { field: 'remarks', label: 'Remarks' },
  ];

  toppingListLeft: any[] = [
    { field: 'userId', label: 'User ID' },
    { field: 'levelName', label: 'Level' },
    { field: 'parentUnit', label: 'Parent Unit' },
    { field: 'name', label: 'User Name' },
    { field: 'givenName', label: 'Given Name' },
    { field: 'roleName', label: 'Role' },
    { field: 'statusName', label: 'Status' },
    { field: 'entityStatusName', label: 'Record Status' },
    { field: 'maker', label: 'Maker' },
    { field: 'makerTime', label: 'Maker Time' },
    { field: 'checker', label: 'checker' },
    { field: 'checkerTime', label: 'Checker Time' },
    { field: 'mobile', label: 'Mobile No.' },
    { field: 'emailId', label: 'Email' },
    { field: 'department', label: 'Department' },
    { field: 'grade', label: 'Grade' },
    { field: 'designation', label: 'Designation' },
    { field: 'unitCode', label: 'Unit Code' },
    { field: 'unitName', label: 'Unit Name' },
    { field: 'remarks', label: 'Remarks' },
  ];
  toppingListRight: any[] = [
    { field: 'userId', label: 'User ID' },
    { field: 'levelName', label: 'Level' },
    { field: 'parentUnit', label: 'Parent Unit' },
    { field: 'name', label: 'User Name' },
    { field: 'givenName', label: 'Given Name' },
    { field: 'roleName', label: 'Role' },
    { field: 'statusName', label: 'Status' },
    { field: 'entityStatusName', label: 'Record Status' },
    { field: 'maker', label: 'Maker' },
    { field: 'makerTime', label: 'Maker Time' },
    { field: 'checker', label: 'checker' },
    { field: 'checkerTime', label: 'Checker Time' },
    { field: 'mobile', label: 'Mobile No.' },
    { field: 'emailId', label: 'Email' },
    { field: 'department', label: 'Department' },
    { field: 'grade', label: 'Grade' },
    { field: 'designation', label: 'Designation' },
    { field: 'unitCode', label: 'Unit Code' },
    { field: 'unitName', label: 'Unit Name' },
    { field: 'remarks', label: 'Remarks' },
  ];

  tooltip: any;
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
      headerName: 'User ID',
      field: 'userId',
      tooltipField: 'unit',
      resizable: true,
      enableRowGroup: true,
      editable: false,
      width:100
    },
    {
      headerName: 'Remarks',
      field: 'remarks',
      tooltipField: 'remarks',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Level',
      field: 'levelName',
      tooltipField: 'ifsc',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    // { headerName: 'Products', field: 'Products', editable: false, sort: 'desc', suppressSizeToFit: true, },
    {
      headerName: 'Parent Unit',
      field: 'parentUnit',
      tooltipField: 'levelName',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'User Name',
      field: 'name',
      tooltipField: 'parent_unit',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Status',
      field: 'statusName',
      tooltipField: 'maker',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:130
    },
    {
      headerName: 'Record Status',
      field: 'entityStatusName',
      tooltipField: 'checker',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:100
    },
    // { headerName: 'Unit Type', field: 'UnitType',tooltipField:"UnitType", editable: false, sort: 'desc', suppressSizeToFit: true, },
    {
      headerName: 'Given Name',
      field: 'givenName',
      tooltipField: 'unit_name',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Role',
      field: 'role',
      tooltipField: 'role',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Maker',
      field: 'maker',
      tooltipField: 'statusName',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Maker Time',
      field: 'makerTime',
      tooltipField: 'entityStatusName',
      // cellRenderer: (data:any) =>
      // { return this.dateFormatService.dateformat(data.value);
      // },
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150,
      comparator:this.dateComparator
    },
    {
      headerName: 'Checker',
      field: 'checker',
      tooltipField: 'pincode',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Checker Time',
      field: 'checkerTime',
      tooltipField: 'district',
      // cellRenderer: (data:any) =>
      // { return this.dateFormatService.dateformat(data.value);
      // },
      editable: false,
      // sort: 'desc',
      suppressSizeToFit: true,
      resizable: true,
      width:150,
      comparator:this.dateComparator2
    },
    {
      headerName: 'Mobile No.',
      field: 'mobile',
      tooltipField: 'state',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Email',
      field: 'emailId',
      tooltipField: 'maker_time',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
    {
      headerName: 'Department',
      field: 'department',
      tooltipField: 'checker_time',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Grade',
      field: 'grade',
      tooltipField: 'checker_time',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Designation',
      field: 'designation',
      tooltipField: 'checker_time',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Unit Code',
      field: 'unitCode',
      tooltipField: 'checker_time',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
      width:150
    },
    {
      headerName: 'Unit Name',
      field: 'unitName',
      tooltipField: 'checker_time',
      editable: false,
      suppressSizeToFit: true,
      resizable: true,
    },
  ];

  gridOptions: GridOptions = {
    alwaysShowVerticalScroll: true,
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
  constructor(private http: HttpClient, private spinner: NgxSpinnerService,
    private dateFormatService:DateFormatServiceService,
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
    // this.bnIdle.startWatching(this.tokenExpireyTime).subscribe((res) => {
    //   if(res) {
    //     this.logoutService.logout().subscribe((res: any) => {
    //       if (res) {
    //          this.logoutResponse = res;
    //            console.log("LogoutResponse",this.logoutResponse);
    //            this.router.navigate(['/home']);
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
  CellClicked:boolean = false;
  checker:any;
  ngOnInit() {
    // this.tabChanged();
    this.getLevelsData();
    console.log('this.tokenExpireyTime', this.tokenExpireyTime);
    let data: any = sessionStorage.getItem('sideNavbar');
    console.log('sideNavBarData', data);

    this.entitlements = JSON.parse(data ? data : '');
    this.entitlements.forEach((elements: any) => {
      console.log('Elementsss', elements);
      if (elements == 'View') {
        this.viewPermission = true;
      } else if (elements == 'Add') {
        this.AddPermission = true;
      } else if (elements == 'Edit') {
        this.EditPermission = true;
        if(this.EditPermission == true) {
          sessionStorage.setItem("OnlyFileView","FileView");
        }
      } else if (elements == 'FileUpload') {
        sessionStorage.setItem("OnlyFileView","");
        this.fileUpload = true;
      } else if (elements == 'FileView') {
        this.fileUpload = true;
      }  else if (elements == 'Authorize') {
        this.AuthorizePermision = true;
      } else if (elements == 'Delete') {
        this.deletePermision = true;
      }
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
    // this.getLevelsData();
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
    console.log(' this.searchText', this.searchText);
    this.gridApi.setQuickFilter(target.value);
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
  showhided: boolean = false;
  onCellClicked(event: CellClickedEvent) {
    this.checker = sessionStorage.getItem('UserId')
    this.maker = event.data.makerId;
    this.CellClicked = true;
    console.log(this.checker, this.maker);
    this.showhided = true;
    console.log(event);
    let userId = event.data.userId;
    this.disabledFields = false;
    this.Rejected = event.data.status;
    console.log('UnitCOde', userId);
    sessionStorage.setItem('UserID', event.data.userId);
    sessionStorage.setItem('UserStatus', event.data.status);
    sessionStorage.setItem('userID', userId);
    sessionStorage.setItem('Status', event.data.status);
    sessionStorage.setItem('UserTableuserId', userId);
    sessionStorage.setItem('UserTableStatus', event.data.status);
    sessionStorage.setItem('userTableLevel', event.data.level);
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
    // this.showhide = true;
    // this.gridColumnApi.setColumnsVisible([item], this.showhide);
    // this.gridApi.sizeColumnsToFit();
  }

  onItemDeSelect(selectedField: any, type: string) {
    let item = selectedField.field;
    let obj: any = { field: selectedField.field, label: selectedField.label };
    if (type == 'left') {
      this.leftPinnedColumns = this.leftPinnedColumns.filter((x) => x != item);
      debugger;
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
    params.api.sizeColumnsToFit();
    this.entityGridService.listen().subscribe((m: any) => {
      console.log('RefreshData', m);
      setTimeout(() => {
        // this.getLevelsData();
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
    // this.entityService.getLevels().subscribe((res:any)=> {
    //   this.levelsData = res;
    //   console.log("LevelsResponse",this.levelsData);
    // })
    this.entityService.getLevelss(this.currentStatus)
    .subscribe((res: any) => {
      console.log("LevelsResponse", res)
      if (res) {
        // const newLevel = {
        //   level: 99,
        //   levelName: 'All'
        // };
          this.levelsData = res.data;
          this.levelsData.pop();
       // this.levelsData.push(newLevel);
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
  tabChangedUser(event: any) {
    this.CellClicked = false
    this.spinner.show();
    console.log("Event", event)
    this.tabEvent = event.index;
    console.log("SelectedTab", this.levelsData[this.tabEvent].level)
    let selectedLevel = this.levelsData[this.tabEvent].level;
    this.entityService.getUserTables(selectedLevel).subscribe((res: any) => {
      this.spinner.hide();

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
          x.Record_status = x.entityStatusName;
          
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
    sessionStorage.setItem('entityData', 'viewData');
    this.router.navigate(['/view-add-screen']);
  }
  addEntity() {
    sessionStorage.setItem('UserData', 'AddUser');
    this.router.navigate(['/add-user-data']);
  }
  UploadEntity() {
    sessionStorage.setItem('entityData', 'authorizeData');
    sessionStorage.setItem('Editpermisson',JSON.stringify(this.EditPermission));
    this.router.navigate(['/user-upload']);
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
  EditUser() {
    sessionStorage.setItem('UserData', 'EditUser');
    this.router.navigate(['/add-user-data']);
  }

  EditUserDialog(){
    if (this.Rejected === 'A') {
      this.EditUser()
    } else { 
      sessionStorage.setItem('entityData', 'userData');
      this.warningLogdialog?.openDialog();
    }
  }

  DeleteUserDialog(){
    sessionStorage.setItem('entityData', 'deleteuserData');
    this.warningLogdialog?.openDialog();
  }
  AuthorizeUser() {
    sessionStorage.setItem("UserData","AuthorizedUser");
    this.router.navigate(['/add-user-data'])
  }
  DeleteUser() {
    sessionStorage.setItem('UserData', 'deleteData');
    this.router.navigate(['/add-user-data']);
  }
}