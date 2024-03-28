import { Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ColDef, GridOptions, PaginationChangedEvent,} from 'ag-grid-community';
import { GridReadyEvent, GridApi} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutServiceService } from '../services/logout-service.service';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
// @ts-ignore
import printDoc from "src/assets/js/printDoc";
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

@Component({
  selector: 'app-roles-view-screen',
  templateUrl: './roles-view-screen.component.html',
  styleUrls: ['./roles-view-screen.component.css']
})

export class RolesViewScreenComponent {
  @ViewChild('agGrid')
  agGrid!: AgGridAngular;
  private gridApi!: GridApi;
  tokenExpireyTime: any;
  rolesData: any = [];
  logoutResponse: any;
  entitlements: any = [];
  data: any = []
  public pageSize = 20;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  // coloumn headers and rowdata
  columnDefs: ColDef[] = [
    { headerName: 'Role', field: 'role', tooltipField: "role", resizable: true, enableRowGroup: true, editable: false, minWidth: 150,cellStyle: {'text-align': 'left'}, },
    { headerName: 'Description', headerClass:'testClass', field: 'description', tooltipField: "description", editable: false, suppressSizeToFit: true,
    resizable: true,cellStyle: {'text-align': 'left',  'white-space': 'normal',
    'overflow': 'hidden',
    'text-overflow': 'ellipsis',
    'word-wrap': 'break-word',}, autoHeight: true,  cellRenderer: 'wrapTextRenderer',  },
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

  // pagination
  onPageSizeChanged(params: PaginationChangedEvent) {
    var value = (document.getElementById('page-size') as HTMLInputElement).value;
    this.gridOptions.api!.paginationSetPageSize(Number(value));
  }

  constructor(private logoutService: LogoutServiceService, private entityGridService: SharedEntityServiceService,  private router: Router, private bnIdle: BnNgIdleService, private entityService: EntityScreenServiceService) {
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

  ngOnInit() {
    // console.log("this.tokenExpireyTime", this.tokenExpireyTime)
    let data: any = sessionStorage.getItem("sideNavbar");
    // console.log('sideNavBarData', data);
    this.entitlements = JSON.parse(data ? data : '')
    this.getrolesData();
  }
 
  // search text
  searchText: any;
  onFilterTextBoxChanged(gridOptions: any, $event: any) {
    const { target } = $event;
    this.searchText = target.value;
    console.log(' this.searchText', this.searchText)
    this.gridApi.setQuickFilter(
      target.value
    );
  }

  // Inbuilt Options to download csv
  onBtnExport() {
    const exportParams = {
      fileName: 'Role_View'+ new Date().getTime() +'.csv',
    };
    this.gridApi.exportDataAsCsv(exportParams);
  }
  
  // generate pdf
  generatePDF(_: any) {
    let printOptions = { "PDF_HEADER_COLOR": "#f8f8f8", "PDF_INNER_BORDER_COLOR": "#dde2eb", "PDF_OUTER_BORDER_COLOR": "#babfc7", "PDF_LOGO": "", "PDF_PAGE_ORITENTATION": "landscape", "PDF_WITH_HEADER_IMAGE": false, "PDF_WITH_FOOTER_PAGE_COUNT": true, "PDF_HEADER_HEIGHT": 25, "PDF_ROW_HEIGHT": 15, "PDF_ODD_BKG_COLOR": "#fcfcfc", "PDF_EVEN_BKG_COLOR": "#ffffff", "PDF_WITH_CELL_FORMATTING": true, "PDF_WITH_COLUMNS_AS_LINKS": true, "PDF_SELECTED_ROWS_ONLY": false };
    printDoc(printOptions, this.gridApi, this.gridColumnApi)
  }
 
  // roles data
  getrolesData() {
    this.entityService.getRoles().subscribe((res: any) => {
      // console.log("GetRoles", res)
      if (res) {
        this.rolesData = res;
        console.log("Getroles", this.rolesData);
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
  
}

