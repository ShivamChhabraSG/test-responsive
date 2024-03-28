import { Component, ViewChild } from '@angular/core';
import {FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { ColDef, GridApi,GridReadyEvent,GridOptions,CellClickedEvent} from 'ag-grid-community';
import { IDropdownSettings } from 'ng-multiselect-dropdown/multiselect.model';
import { AgGridAngular } from 'ag-grid-angular';
import { BnNgIdleService } from 'bn-ng-idle';
import { Router } from '@angular/router';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { MatDialog} from '@angular/material/dialog';
import { LogoutServiceService } from '../services/logout-service.service';
import { SharedEntityServiceService } from '../services/shared-entity-service.service';
// @ts-ignore
import printDoc from 'src/assets/js/printDoc';
import { DatePipe } from '@angular/common';
import { DateFormatServiceService } from '../services/date-format-service.service';
import { WarningPopupComponent } from '../warning-popup/warning-popup.component';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import { DateFormatWithoutTimeService } from '../services/date-format-without-time.service';
import { WarningLogDialogComponent } from '../warning-log-dialog/warning-log-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-interest-rate-screen',
  templateUrl: './interest-rate-screen.component.html',
  styleUrls: ['./interest-rate-screen.component.css'],
})
export class InterestRateScreenComponent {
  @ViewChild('agGrid')
  private gridApi!: GridApi;
  @ViewChild(WarningLogDialogComponent) ratedialog: WarningLogDialogComponent | undefined;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
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
  showSelectedBank : any
  showAddSelectedBank: any
  isDropdownOpen: boolean = false;
  toppingList = [
    { field: 'unitCode', label: 'bankCode' },
    { field: 'unitName', label: 'bankName' },
    { field: 'rateTypeId', label: 'rateType' },
    { field: 'qtrEnding', label: 'EffectiveQtr'},
    {field: 'frequency', label: 'frequency'},
    {field: 'qtrRate', label:'QtrRate'},
    {field: 'm1Rate', label: 'm1Rate'},
    {field: 'm2Rate', label: 'm2Rate'},
    {field: 'm3Rate', label: 'm3Rate'},
    {field: 'statusDesc', label: 'status'},
    {field: 'remarks', label: 'remarks'},
    {field: 'maker', label: 'maker'},
    {field: 'makerTime', label: 'makerTime'},
    {field: 'checker', label: 'checker'},
    {field: 'checkerTime', label: 'checkerTime'}
  ];
  toppingListLeft: any = [];
  toppingListRight: any = [];

  tooltip: any;
  columnDefs: ColDef[] = [];
  rowData: any = [];
  interestRateData:any = [];
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
  deletePermission:boolean = false;
  // to disable the authorise button if both are same
  checker:any; maker:any ; statusname:any

  constructor(
    private logoutService: LogoutServiceService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    private bnIdle: BnNgIdleService,
    private entityService: EntityScreenServiceService,
    public datepipe: DatePipe,
    private dateFormatService:DateFormatWithoutTimeService,
    private spinner:NgxSpinnerService,
  ) {
    // this.tokenExpireyTime = sessionStorage.getItem(
    //   'tokenExpirationTimeInMinutes'
    // );
    // this.tokenExpireyTime = JSON.parse(this.tokenExpireyTime);
    // this.bnIdle.startWatching(this.tokenExpireyTime).subscribe((res) => {
    //   if (res) {
    //     this.logoutService.logout().subscribe(
    //       (res: any) => {
    //         if (res) {
    //           this.logoutResponse = res;
          
    //           this.router.navigate(['/home']);
    //         }
    //       },
    //       (err: any) => {
    //         // alert(err.error.message)
           
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
      console.log("Params",params);
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
  public pageSize = 20;
  public totalPages! : number;
  public rowCount!: number;
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }
  onPageSizeChanged() {
    this.gridApi.paginationSetPageSize(this.pageSize);
     
  }

  // Custom number formatter for pagination
  customNumberFormatter(params: any) {
    return params.value.toLocaleString();
  }

  ngOnInit() {
  
    let data: any = sessionStorage.getItem('sideNavbar');


    this.entitlements = JSON.parse(data ? data : '');
    console.log("Entitlements",this.entitlements)
    this.entitlements.forEach((elements: any) => {
      if (elements === 'View') {
        this.viewPermission = true;
      } else if (elements === 'Add') {
        this.AddPermission = true;
      } else if (elements === 'Edit') {
        this.EditPermission = true;
      } else if (elements === 'Authorize') {
        this.authorizePermission = true;
      }
      else if (elements === 'Delete') {
        this.deletePermission = true;
      }
    });
    

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
    this.myForms?.patchValue({
      name: this.toppingList,
    });
 this.getunits();
 this.getstartdate();
 this.getfinendingForpopup();

 setTimeout(() => {
  this.getRatesData();
}, 2000);
 this.getAddRateBanks();
    // alert(this.toppingList[0])
   // this.getRatesData();
    // this.resetPinned();
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
  SelectedbankCode:any;
  EffectiveDate:any;
  onCellClicked(event: CellClickedEvent) {
    this.showhided = true;
    let unitCode = event.data;
    this.disabledFields = false;
    this.checker = sessionStorage.getItem('UserId')
    this.maker = unitCode.makerId;
    this.statusname= unitCode.status;
  console.log("UnitCode",unitCode)
    // if (this.checker === this.maker) {
      sessionStorage.setItem("CellData",JSON.stringify(event.data));
    //   alert("Checker and Maker are the same! Does't allow to modify anything");
    // }
   this.SelectedbankCode = event.data.unitCode;
   this.EffectiveDate = event.data.qtrEnding;
    sessionStorage.setItem('UnitCodeRate', JSON.stringify(unitCode)); // addrate screen add/edit/aauthorize&reject
    sessionStorage.setItem('unitcode', event.data.unitCode);
    sessionStorage.setItem('Status', event.data.status);
    sessionStorage.setItem('rateEffectiveFromDate', event.data.qtrEnding);
  }
  unitsData: any = [];
  bankListArray:any = [];
  bankAllArray:any[] = [];
  bankCode: any = [];
  bankSelect!:FormGroup;
  addRateBanks:any = [];
    
  getAddRateBanks() {
    this.entityService.getUnitsInfo().subscribe((res: any) => {
        if(res.success === true) {
          console.log("ResponseData",res.data);
          if(res?.data?.length=== 1) {
            this.addRateBanks = res?.data;
            console.log("this.addRateBanks",this.addRateBanks)
            // this.addRateBanks.push(allData);
            this.bankCode = res?.data[0].unit;
            console.log("Bankkkk",this.bankCode)
            this.bankSelect?.patchValue({
              bank:this.addRateBanks
            }) 
          }
          else {
            this.addRateBanks = res?.data;
            console.log("AddRateData", this.addRateBanks);
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
  getunits() {
    this.entityService.getUnitsInfo().subscribe((res: any) => {
        if(res.success === true) {
          console.log("ResponseData",res.data);
          if(res?.data?.length=== 1) {
            this.unitsData = res?.data;
           // this.addRateBanks = res?.data;
           this.addRateBanks = this.unitsData;
            console.log("this.unitsData",this.unitsData)
            // this.unitsData.push(allData);
            this.bankCode = res?.data[0].unit;
            this.selectedBank = this.bankCode;
            console.log("Bankkkk",this.bankCode)
            this.showSelectedBank = res?.data[0].bank;
            this.showAddSelectedBank = res?.data[0].bank;
            this.bankSelect?.patchValue({
              bank:this.unitsData
            }) 
          }
          else {
           // this.addRateBanks = res?.data;
            console.log("AddRateData", this.addRateBanks);
              let allData = {
                unit:'99',
                bank:'All'
              }
              this.unitsData = res?.data;
              this.unitsData.push(allData);
              this.bankCode = '99';
              this.bankSelect?.patchValue({
                bank:this.unitsData
              })
              console.log('getUnits', this.unitsData);
            //  this.addRateBanks = this.unitsData;
              let localdata = res.data;
              this.bankListArray = localdata.map((data: { unit: any; unitName: any; }) => {
                return { unit: data.unit, unitName  : data.unitName };
              });
              this.bankListArray.push()
              this.bankListArray.forEach((element: { unit: any; }) => {
                return this.bankAllArray.push(element.unit);
              })   
              console.log("BankListArray",this.bankAllArray);
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
    // get bankcode
    getbankCode(event: any) {
      this.bankCode = event.unit;
      this.showSelectedBank = event.bank;
      console.log('recordStatus', this.bankCode);
    }
    selectedStartYear:any
    selectedEndYear:any
    startYears: number[] = [];
    endYears: number[] = [];
    fyStart:any=''
    fyEnd:string=''
  
  
  
    // start year dropdown
    getstartdate(){
      this.entityService.getfinStartYear().subscribe((res:any)=>{
        console.log(res);
  
        // const yearArray = res.data.map((dateString:any) => parseInt(dateString.split("-")[0]));
  
        this.startYears= res.data;
        this.selectedStartYear = this.startYears[0];
        this.selectedStartYear = this.datepipe.transform(this.selectedStartYear,'dd MMM YYYY')
        this. updateEndYears();
        console.log('this.startYears',this.selectedStartYear)
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
    qtdata:any= []
    updateEndYears() {
      this.selectedEndYear=''
      this.endYears = [];
      this.fyStart= this.selectedStartYear;
      console.log("default value",this.fyStart);
      console.log(this.fyStart);
      this.fyStart = this.datepipe.transform(this.fyStart, 'dd-MM-yyyy');
      this.entityService.getFinalYear(this.fyStart).subscribe(
        (res:any):any=>{
        console.log(res)
        this.endYears=res.data; 
        let EndYear= this.endYears[0];
        this.selectedFYEndDate = this.endYears[0];
        this.selectedEndYear = this.datepipe.transform(EndYear, 'dd MMM yyyy');
        console.log("SelectedEndYear",this.selectedEndYear)
        this.fyEnd = this.selectedEndYear;
        this.fyEnd = String(this.datepipe.transform(this.fyEnd, 'dd-MM-YYYY'));

      //  this.getRatesData();
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
  EndYears(){
    this.fyEnd = this.selectedEndYear;
    this.fyEnd = String(this.datepipe.transform(this.fyEnd,'dd-MM-YYYY'))    
  }
  // search text
  searchText: any;
  onFilterTextBoxChanged(gridOptions: any, $event: any) {
    const { target } = $event;
    this.searchText = target.value;
    console.log('this.searchText', this.searchText);
  
    if (this.gridApi) {
      this.gridApi.setQuickFilter(target.value);
    } else {
      console.warn('gridApi is not defined. Make sure you have access to the ag-Grid API.');
    }
  }
  onPaginationChanged(event:any) {
    // Handle pagination changes here
    console.log('New page number:', event.api.paginationGetCurrentPage() + 1);
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
  startYearspopup:any=[]
  selectedFyEndDates:any;
  selectedQtrEndDate:any;
  qtrselected:any;
  selectedQtrYear:any;
  getfinendingForpopup(){
    this.entityService.getfyYearforpopup().subscribe(
      (res:any)=>{
      console.log(res)
      this.startYearspopup=res.data;
      this.selectedFyEndDates = this.startYearspopup[0];
      // this.selectedFyEndDate = this.rolesToken.fyEndingDate;
      this.selectedFyEndDates =  this.datepipe.transform(this.selectedFyEndDates,'dd MMM YYYY');
      let fyendyearpopup =  this.selectedFyEndDates
      fyendyearpopup = this.datepipe.transform(fyendyearpopup,'dd-MM-YYYY');
      this.entityService.getQtYear(fyendyearpopup).subscribe(
        (res:any)=>{
        console.log(res);
        this.qtdata=res.data;
        this.qtrselected = this.datepipe.transform(this.qtrselected,'dd-MM-YYYY');
        this.selectedQtrYear = this.qtdata[0];
        this.selectedQtrEndDate = this.qtdata[0];
        this.selectedQtrYear = this.datepipe.transform(this.selectedQtrYear,'dd MMM YYYY');
        // this.entityService.getUtilsLastUpdatedQtr(this.qtrselected,this.recordStatus).subscribe((res:any)=> {
        //   this.LstUpdateQtrData = res.data;
        //   console.log("LastUpdatedQtrData",this.LstUpdateQtrData)
        //       })
        this.selectedQtrEndDate = this.datepipe.transform(this.selectedQtrEndDate,'dd MMM YYYY');
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
    if(item === 'status'){
      item = 'statusDesc'
    }
    this.showhide = true;
    this.gridColumnApi.setColumnsVisible([item], this.showhide);
    this.gridApi.sizeColumnsToFit();
  }
  ColumnDeSelect(selectedField: any) {
    let item = selectedField.field;
    this.showhide = false;
    console.log(item);
    if(item === 'status'){
      item = 'statusDesc'
    }
    console.log(this.gridColumnApi);
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
    this.spinner.show();
    this.entityService.getRates(this.bankCode, this.fyStart, this.fyEnd).subscribe((res: any) => {
      if (res) {
        this.spinner.hide();
        const rearrangedHeaders = ['unitCode', 'unitName', 'rateTypeId','status','frequency', 'remarks', 'qtrEnding', 'qtrRate', 'm1Rate', 'm2Rate', 'm3Rate', 'maker', 'makerTime', 'checker', 'checkerTime'];
        const replaceHeaders = (header: string): string=> {
          switch (header) {
            case 'unitCode':
              return 'bankCode';
            case 'unitName':
              return 'bankName';
              case 'rateTypeId':
                return 'rateType';
                case 'status':
                  return 'status';
                  case 'remarks':
                    return 'remarks';
                case 'qtrRate':
                  return 'QtrRate';
                  case 'm1Rate':
                    return 'm1Rate';
                    case 'm2Rate':
                      return 'm2Rate';
                      case 'm3Rate':
                        return 'm3Rate';
                            case 'qtrEnding':
                              return 'EffectiveQtr';
                            
            default:
              return header;
          }
        };
  
        // Apply the replaceHeaders function to rearrangedHeaders
        const updatedHeaders = rearrangedHeaders.map(replaceHeaders);
  
        const fieldMapping: any = { bankCode: 'unitCode', bankName: 'unitName', rateType: 'rateTypeId',frequency:'frequency',status: 'statusDesc', remarks: 'remarks', EffectiveQtr: 'qtrEnding', QtrRate: 'qtrRate', m1Rate: 'm1Rate', m2Rate: 'm2Rate', m3Rate: 'm3Rate', maker: 'maker', makerTime: 'makerTime', checker: 'checker', checkerTime: 'checkerTime' };
  
        this.columnDefs = updatedHeaders.map((header: any) => ({
          headerName: capitalizeFirstLetterWithSpace(header),
          field: fieldMapping[header],
          tooltipField: fieldMapping[header],
          sortable: true,
          resizable: true,
          editable: false,
          // width: 150,
          width:['bankCode','bankName','rateType','statusDesc','frequency','remarks','EffectiveQtr','QtrRate','maker','m1Rate','m2Rate','m3Rate','checker'].includes(header) ? 140 : undefined,
          cellRenderer: (params: any) => {
            // Example: Apply a custom renderer for a column named 'dateColumn'
            if (fieldMapping[header] === 'qtrEnding') {
              return this.dateFormatService.dateformat(params.value);
            }
            if (fieldMapping[header] === 'qtrEnding') {
              return this.dateFormatService.dateformat(params.value);
            }
            // If it's not the column you want to customize, return the default renderer
            return params.value;
          },
        }));
  
        this.interestRateData = res.data;
        console.log("InterestrateData", this.interestRateData);
  
        this.rowData = res.data.map((x: any) => x);
  
        this.toppingList = rearrangedHeaders.map((y: any) => ({ field: y, label: capitalizeFirstLetterWithSpace(y) }));
        this.toppingListLeft = [...this.toppingList];
        this.toppingListRight = [...this.toppingList];
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
      
    const capitalizeFirstLetterWithSpace = (str: any) => {
      const words = str.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
      const capitalizedWords = words.map((word: any) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      });
      return capitalizedWords.join(' ');
    };
  }
  selectedBank:any;
  getSelectedBank(event:any) {
    this.showAddSelectedBank = event.bank
  }
  onSelectFinancialYearQtrEndpopup() {
// alert(this.selectedQtrEndDate);
  }
  selectedFYEndDate:any;
  SelectedFyEnding() {
    let EndYear = this.datepipe.transform(this.selectedFyEndDates, 'dd-MM-yyyy');
    this.entityService.getQtYear(EndYear).subscribe((res:any)=>{
      console.log("QtrrrEnd",res.data);
      this.qtdata=res.data;
      this.selectedQtrEndDate = this.qtdata[0];
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
  notAllowedRateMsg:any;
  showPopup:boolean = false;
  NotAllowedforAdd:any;
  checkAddEnable(){
    let operation = 'A';
    console.log("QtrEnding",this.selectedQtrEndDate);
    let QuarterEnding = this.datepipe.transform(this.selectedQtrEndDate, 'dd-MM-yyyy');
    this.entityService.getAddRateEnable(operation,this.selectedBank,QuarterEnding).subscribe((res:any)=> {
        let response = res.data.isAllowed;
        console.log("Ressssponse",res)
        if(response === 1) {
                    let selectedBankAndQtr = {
            Bank: this.selectedBank,
            FyEnd:this.selectedFYEndDate,
            QtrEnd:this.selectedQtrEndDate
          }
          console.log("selectedBankAndQtr",selectedBankAndQtr);

          sessionStorage.setItem("selectedBankAndQtr",JSON.stringify(selectedBankAndQtr));
          sessionStorage.setItem('IntrestrateData','addData');
          this.router.navigate(['/add-rate'],{queryParams:{mode: 'Add'}});
        }
        else {
          sessionStorage.setItem("RateAllowedPopup",res.data.message);
          sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
          this.errordialog?.openDialog();
          // sessionStorage.setItem("RateAllowedPopup",res.data.message);
          // sessionStorage.setItem("PopupMaitainance","RatesScreen");
          // this.dialog.open(ErrorPopupComponent, { panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass: 'ratebackdropBackground', disableClose: false })
        }
        console.log("Response",response);
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
  viewEnity() {
    sessionStorage.setItem('IntrestrateData', 'viewData');
    this.router.navigate(['/add-rate'],{ queryParams: { mode: 'View' }});
  }
  addEntity() {
    sessionStorage.setItem('IntrestrateData', 'addData');
    this.router.navigate(['/add-rate'],{ queryParams: { mode: 'Add' }});
  }

  editRateDialog(){
    sessionStorage.setItem('entityData', 'ratesData');
    if (this.statusname === 'A') {
      this.editEnity()
    } else {
      this.ratedialog?.openDialog();
    }
  }
  editEnity() {
    console.log('its hitting edit');
    sessionStorage.setItem('IntrestrateData', 'editData');
    let operation = 'E';
    console.log("QtrEnding",this.selectedQtrEndDate);
    let QuarterEnding = this.datepipe.transform(this.EffectiveDate, 'dd-MM-yyyy');
    this.entityService.getAddRateEnable(operation,this.SelectedbankCode,QuarterEnding).subscribe((res:any)=> {
        let response = res.data.isAllowed;
        console.log("Response",response)
        if(response === 1) {
          let selectedBankAndQtr = {
            Bank: this.selectedBank,
            FyEnd:this.selectedFYEndDate,
            QtrEnd:this.selectedQtrEndDate
          }
          console.log("selectedBankAndQtr",selectedBankAndQtr);
          sessionStorage.setItem("selectedBankAndQtr",JSON.stringify(selectedBankAndQtr));
          this.router.navigate(['/add-rate'],{queryParams:{mode: 'Edit'}});
        }
        else {
          sessionStorage.setItem("RateAllowedPopup",res.data.message);
          sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
          this.errordialog?.openDialog();
          // sessionStorage.setItem("RateAllowedPopup",res.data.message);
          // this.dialog.open(ErrorPopupComponent, { panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass: 'ratebackdropBackground', disableClose: false })
        }
        console.log("Response",response);
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
    this.router.navigate(['/add-rate'], { queryParams: { mode: 'Edit' } });
  }
  deleteEntity() {
    sessionStorage.setItem('IntrestrateData', 'deleteData');
    let operation = 'D';
    console.log("QtrEnding",this.selectedQtrEndDate);
    let QuarterEnding = this.datepipe.transform(this.EffectiveDate, 'dd-MM-yyyy');
    this.entityService.getAddRateEnable(operation,this.SelectedbankCode,QuarterEnding).subscribe((res:any)=> {
        let response = res.data.isAllowed;
        console.log("Response",response)
        if(response === 1) {
          let selectedBankAndQtr = {
            Bank: this.selectedBank,
            FyEnd:this.selectedFYEndDate,
            QtrEnd:this.selectedQtrEndDate
          }
          console.log("selectedBankAndQtr",selectedBankAndQtr);
          sessionStorage.setItem("selectedBankAndQtr",JSON.stringify(selectedBankAndQtr));
          this.router.navigate(['/add-rate'],{queryParams:{mode: 'Delete'}});
        }
        else {
          sessionStorage.setItem("RateAllowedPopup",res.data.message);
          sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
          this.errordialog?.openDialog();
          // sessionStorage.setItem("RateAllowedPopup",res.data.message);
          // this.dialog.open(ErrorPopupComponent, { panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass: 'ratebackdropBackground', disableClose: false })
        }
        console.log("Response",response);
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
  AuthorizeEntity() {
    sessionStorage.setItem('IntrestrateData', 'authorizeData');
    console.log("QtrEnding",this.selectedQtrEndDate);
    this.router.navigate(['/add-rate'], { queryParams: { mode: 'Authorise' } });
  }
}