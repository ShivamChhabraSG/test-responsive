import { Component, ViewChild } from '@angular/core';
import {FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { ColDef, GridApi,GridReadyEvent,GridOptions,PaginationChangedEvent,CellClickedEvent,FirstDataRenderedEvent,} from 'ag-grid-community';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { AgGridAngular } from 'ag-grid-angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutServiceService } from '../services/logout-service.service';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
// @ts-ignore
import printDoc from 'src/assets/js/printDoc';

@Component({
  selector: 'app-claims-data',
  templateUrl: './claims-data.component.html',
  styleUrls: ['./claims-data.component.css']
})
export class ClaimsDataComponent {
  @ViewChild('agGrid')
  private gridApi!: GridApi;
  isOpen = false;
  agGrid!: AgGridAngular;
  myForms!: FormGroup;
  showhide: boolean = true;
  tokenExpireyTime: any;
  formGroup!: FormGroup;
  select: any = [];
  tabEvent: any;
  viewDisabled: boolean = true;
  selectedLevelData: any = [];
  logoutResponse: any;
  entitlements: any = [];
  disabledFields: any;
  authorizePermission: boolean = false;

  toppingList: any = [];
  toppingListLeft: any = [];
  toppingListRight: any = [];

  tooltip: any;
  columnDefs: ColDef[] = [
    { headerName: 'SN', field: 'SN', tooltipField: "sn", editable: false, suppressSizeToFit: true, resizable: true, maxWidth:100 },
    { headerName: 'Bank Code', field: 'bank_code', tooltipField: "bank code", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Branch Code', field: 'branch_code', tooltipField: "branch code", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Loan Account No', field: 'loan_ac_no', tooltipField: "loan account no", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'SHG Customer ID', field: 'shg_cust_id', tooltipField: "shg customer id", editable: false, suppressSizeToFit: true, resizable: true, },
    { headerName: 'Account Closed Date', field: 'acc_closed_date', tooltipField: "accounts closed date", editable: false, suppressSizeToFit: true, resizable: true,},
    { headerName: 'Account Closed Status', field: 'acc_closed_status', tooltipField: "account closed status", editable: false, suppressSizeToFit: true, resizable: true,  },
  ];
  rowData: any = [];

  leftPinnedColumns: string[] = [];
  rightPinnedColumns: string[] = [];

  disabled = false;
  selectedItems: any = [];

  selectedItemsArray: any = [];
  dropdownSettings: IDropdownSettings = {};
  data: any = [];
  viewPermission: boolean = false;
  AddPermission: boolean = false;
  EditPermission: boolean = false;

  // to disable the authorise button if both are same
  checker:any; maker:any ; statusname:any
  public pageSize = 20;

  constructor(
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
    // this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
    // this.bnIdle.startWatching(this.tokenExpireyTime).subscribe((res) => {
    //   if (res) {
    //     this.logoutService.logout().subscribe(
    //       (res: any) => {
    //         if (res) {
    //           this.logoutResponse = res;
    //           console.log('LogoutResponse', this.logoutResponse);
    //           this.router.navigate(['/home']);
    //         }
    //       },
    //       (err: any) => {
    //         // alert(err.error.message)
    //         console.log('Error Message', err.error.message);
    //       }
    //     );
    //   }
    // });
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
  // pagination
  onPageSizeChanged(params: PaginationChangedEvent) {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridOptions.api!.paginationSetPageSize(Number(value));
  }

  ngOnInit() {
    console.log('this.tokenExpireyTime', this.tokenExpireyTime);
    let data: any = sessionStorage.getItem('sideNavbar');
    // console.log('sideNavBarData', data);

    this.entitlements = JSON.parse(data ? data : '');
    this.entitlements.forEach((elements: any) => {
      if (elements == 'View') {
        this.viewPermission = true;
      } else if (elements == 'Add') {
        this.AddPermission = true;
      } else if (elements == 'Edit') {
        this.EditPermission = true;
      } else if (elements == 'Authorize') {
        this.authorizePermission = true;
      }
    });
    // console.log('Entitlements', this.entitlements);

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
    this.getRatesData();
  }

  public setForm() {
    this.formGroup = new FormGroup({
      name: new FormControl(this.toppingList, Validators.required),
    });
  }

  f(): any {
    return this.formGroup.controls;
  }

  showhided: boolean = false;
  onCellClicked(event: CellClickedEvent) {
    this.showhided = true;
    // console.log(event);
    let unitCode = event.data;
    this.disabledFields = false;
    console.log('UnitCodeRate',event.data.unitCode);
    sessionStorage.setItem('UnitCodeRate',event.data.unitCode);
    this.checker = sessionStorage.getItem('UserId')
    this.maker = unitCode.makerId
    this.statusname= unitCode.statusName
    // if (this.checker === this.maker) {
    //   alert("Checker and Maker are the same! Does't allow to modify anything");
    // }
    console.log('UnitCodeRate', unitCode);
    console.log("MakerId",unitCode.makerId);
    sessionStorage.setItem('UnitCodeRate', JSON.stringify(unitCode)); // addrate screen add/edit/aauthorize&reject
    sessionStorage.setItem('unitcode', event.data.unitCode);
    sessionStorage.setItem('Status', event.data.status);
    sessionStorage.setItem('rateTypeId', event.data.rateTypeId);
    sessionStorage.setItem('rate', event.data.rate);
    sessionStorage.setItem('rateType', event.data.rateType);
    sessionStorage.setItem('effectiveDate', event.data.effectiveFromDate);
    sessionStorage.setItem('StatusRate', event.data.status);
    sessionStorage.setItem('rateTypeRate', event.data.rateTypeId);
    sessionStorage.setItem('rateEffectiveFromDate', event.data.effectiveFromDate);
  }
  // search text
  searchText: any;
  onFilterTextBoxChanged(gridOptions: any, $event: any) {
    const { target } = $event;
    this.searchText = target.value;
    console.log(' this.searchText', this.searchText);
    this.gridApi.setQuickFilter(target.value);
  }
  
  // pdf download
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

  // excel download
  downloadExcel() {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const exportParams = {
      fileName: `Rate_Details_${formattedDate}.csv`,
    };
    this.gridApi.exportDataAsCsv(exportParams);
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
      // debugger
      this.toppingListRight.push(obj);
    } else {
      this.rightPinnedColumns = this.rightPinnedColumns.filter(
        (x) => x != item
      );
      this.toppingListLeft.push(obj);
    }
    this.updatedColumnPinned();
  }
  onItemDeSelectOrAll(items: any, type: string) {}
  onItemSelectOrAll(itemss: any, type: string) {}

  ColumnSelect(selectedField: any) {
    let item = selectedField.field;
    console.log('column select: ' + item);
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
    this.gridColumnApi.setColumnsVisible(itemss, this.showhide);
    this.gridApi.sizeColumnsToFit();
  }

  // rates data
  getRatesData() {
   
  }

  viewEnity() {
    sessionStorage.setItem('IntrestrateData', 'viewData');
    this.router.navigate(['/view-rate-screen'],{ queryParams: { mode: 'View' }});
  }
  addEntity() {
    sessionStorage.setItem('IntrestrateData', 'addData');
    this.router.navigate(['/add-rate'],{ queryParams: { mode: 'Add' }});
  }
  editEnity() {
    sessionStorage.setItem('IntrestrateData', 'editData');
    this.router.navigate(['/add-rate'], { queryParams: { mode: 'Edit' } });
  }
  deleteEntity() {
    sessionStorage.setItem('IntrestrateData', 'deleteData');
    this.router.navigate(['/add-rate'], { queryParams: { mode: 'Delete' } });
  }
  AuthorizeEntity() {
    sessionStorage.setItem('IntrestrateData', 'authorizeData');
    this.router.navigate(['/add-rate'], { queryParams: { mode: 'Authorize' } });
  }
}
