

import { Component,ViewChild } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ColDef, GridOptions, PaginationChangedEvent } from 'ag-grid-community';
import { IDropdownSettings } from "ng-multiselect-dropdown/multiselect.model";
import { CellClickedEvent, GridReadyEvent, GridApi } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-upload-files-entity',
  templateUrl: './view-upload-files-entity.component.html',
  styleUrls: ['./view-upload-files-entity.component.css']
})
export class ViewUploadFilesEntityComponent {
  @ViewChild('fileInput')
  fileInput: any;

  file: File | null = null;
  @ViewChild('agGrid')
  isOpen = true;
  agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  tokenExpireyTime: any;
  public defaultPage = 20;
  columnDefs: ColDef[] = [
    { headerName: 'Bank Code', field: 'BK_CODE', tooltipField: "BANK_CODE", editable: false, suppressSizeToFit: true, resizable: true, width:130},
    { headerName: 'Branch Code', field: 'BR_CODE', tooltipField: "BRANCH_CODE", editable: false, suppressSizeToFit: true, resizable: true,width:140 },
    { headerName: 'Branch Name', field: 'BR_NAME', tooltipField: "BRANCH_NAME", editable: false, suppressSizeToFit: true, resizable: true, width:150},
    { headerName: 'Branch State Code', field: 'BR_STATE_CODE', tooltipField: "BRANCH_STATE_CODE", editable: false, suppressSizeToFit: true, resizable: true, width:150},
    { headerName: 'Branch Pincode', field: 'BR_PINCODE', tooltipField: "BRANCH_PINCODE", editable: false, suppressSizeToFit: true, resizable: true, width:160},
    { headerName: 'IFSC Code', field: 'IFSC', tooltipField: "IFSC", editable: false, suppressSizeToFit: true, resizable: true,width:140 },
    { headerName: 'Branch District Code', field: 'BR_DISTRICT_CODE', tooltipField: "BRANCH_DIST_CODE", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Remarks', field: 'REMARKS', tooltipField: "REMARKS", editable: false, suppressSizeToFit: true, resizable: true,width:110 },
    { headerName: 'Status', field: 'STATUS', tooltipField: "STATUS", editable: false, suppressSizeToFit: true, resizable: true, width:100},
  ];
  columnDefss: ColDef[] = [

    { headerName: 'Sl. No',  valueGetter: (params) => (params.node?.rowIndex ?? -1) + 1, field: 'Sl. No.', tooltipField: "Sl. No.", editable: false, suppressSizeToFit: true, resizable: true, },
    // { headerName: 'Products', field: 'Products', editable: false, sort: 'desc', suppressSizeToFit: true, },
    { headerName: 'Employee Id', field: 'Employee ID', tooltipField: "Employee ID", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Name', field: 'Name Display', tooltipField: "Name Display", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Designation', field: 'Designation', tooltipField: "Designatione", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Unit Name', field: 'Unit Name', tooltipField: "Unit Name", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Dept Name', field: 'Dept Name', tooltipField: "pincode", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Grade', field: 'Grade', tooltipField: "Grade", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Mobile Number', field: 'Mobile Number', tooltipField: "Mobile Number", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Email Address', field: 'Email Address', tooltipField: "Email Address", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Remarks', field: 'remarks', tooltipField: "remarks", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Status', field: 'Status', tooltipField: "Status", editable: false, suppressSizeToFit: true, resizable: true, },
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
  EntityData:any;
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
  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder, public dialog: MatDialog, private router: Router) {
    this.tokenExpireyTime = sessionStorage.getItem('tokenExpirationTimeInMinutes');
    this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
  }
  selectedItemsArray: any = [];
  dropdownSettings: IDropdownSettings = {};
  data: any = []
  viewPermission: boolean = false;
  AddPermission: boolean = false;
  EditPermission: boolean = false;
  viewGridData: any = [];
  userviewGridData:any = [];
  ngOnInit() {
    this.EntityData = sessionStorage.getItem("entityData");
    this.viewGridData = sessionStorage.getItem("viewCsvDAta");
    this.viewGridData = JSON.parse(this.viewGridData);
    this.userviewGridData =  sessionStorage.getItem("viewUserCsvDAta");
    this.userviewGridData =  JSON.parse(this.userviewGridData);
    console.log("ViewGridData", this.viewGridData)
    console.log("userviewGridData", this.userviewGridData);
    console.log("this.tokenExpireyTime", this.tokenExpireyTime);
  }
  showhided: boolean = false;
  onCellClicked(event: CellClickedEvent) {
  }
  goBack() {
    this.router.navigate(['./entity-upload-screen'])
  }
  goBackUserUpload() {
    this.router.navigate(['./user-upload'])
  }
}
