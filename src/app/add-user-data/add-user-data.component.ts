import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserServiceService } from '../services/user-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { WarningPopupComponent } from '../warning-popup/warning-popup.component';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';
import { WarningAuthDialogComponent } from '../warning-auth-dialog/warning-auth-dialog.component';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-add-user-data',
  templateUrl: './add-user-data.component.html',
  styleUrls: ['./add-user-data.component.css']
})
export class AddUserDataComponent {

  @ViewChild(WarningDialogComponent) deletedialog: WarningDialogComponent | undefined;
  @ViewChild(WarningAuthDialogComponent) authdialog: WarningAuthDialogComponent | undefined;
  @ViewChild(ErrorDialogComponent) errordialog: ErrorDialogComponent | undefined;
  UnitCode: any;
  Level: any;
  parentUnit: any;
  state: any;
  district: any;
  pincode: any;
  email: any;
  recordStatus: any;
  levelsData: any = [];
  parentLevelsData: any = [];
  unitCodeData: any = [];
  unitCode: any;
  roleModal:any;
  isAdd: boolean = true;
  recordStatusData: any = [];
  roleName: any;
  userName: any;
  nameEntered: any;
  numberEntered: any = 0;
  departmentName: any;
  designationName: any;
  Grade: any;
  userId: any;
  UserId: any;
  Status: any;
  showUser: any;
  rolesData: any = [];
  RoleSettings: IDropdownSettings = {};
  roleSelect: any[] = [];
  rolesListData: any = [];
  rolesListArray: any = [];
  myForms!: FormGroup;
  currentLevel: boolean = true;
  unitLevelByLevel: any = [];
  unitCodeDataByLevel: any = [];
  disabledUserId: boolean = false;
  userHeading:any;
  roleValueSelectedObj:any=[];
  disableEdit:boolean=false
  authorziedUser:boolean = false;
  userLevel:any;
  unitCde: any;
  userTableLevel: any
  rolesAllData: any;
  constructor(private userService: UserServiceService, private fb: FormBuilder, private router: Router, public dialog: MatDialog,private cdr: ChangeDetectorRef, private spinner: NgxSpinnerService) {
  }
  ngOnInit() {
  
    this.myForms = this.fb.group({
      roleU: ['', Validators.required],
    });
    // AuthorizedUser
    this.showUser = sessionStorage.getItem("UserData");
    let tokendata:any = sessionStorage.getItem("TokenDetals");
    tokendata = JSON.parse(tokendata);
     this.userLevel = tokendata.level;
    this.Level = this.userLevel;
    console.log(this.userLevel);
    this.userTableLevel = sessionStorage.getItem("userTableLevel")
    console.log(this.userTableLevel);
    if (this.userLevel) {
      this.GetRolesData();
    }
    console.log("UserData",this.showUser);
    this.UserId = sessionStorage.getItem("userID");
    this.Status = sessionStorage.getItem("Status");
    if (this.showUser == "EditUser") {
      this.userHeading = "Edit User";
      this.isAdd = false
    } else if( this.showUser == "deleteData") {
      this.userHeading = "Delete User";
    }

    if (this.showUser == "EditUser" || this.showUser == "deleteData") {
      this.UserId = sessionStorage.getItem("userID");
      this.Status = sessionStorage.getItem("Status");
      this.disabledUserId = true;
      this.authorziedUser = false;
      this.spinner.show();
      setTimeout(()=>{
        this.getEditUser();
       },2000); 
    //  this.getEditUser();
      let items :any=[
        {
            "description": "None",
            "role": "None",
            "roleCode": 0
        },
        {
            "description": "Admin Role",
            "role": "Admin",
            "roleCode": 1
        },
        {
            "description": "Ops Role",
            "role": "Operations",
            "roleCode": 2
        },
        {
            "description": "Bank Maker Role",
            "role": "Bank Maker",
            "roleCode": 3
        },
        {
            "description": "Bank Checker Role",
            "role": "Bank Checker",
            "roleCode": 4
        },
        {
            "description": "RO Maker Role",
            "role": "RO Maker",
            "roleCode": 5
        },
        {
            "description": "RO Checker Role",
            "role": "RO Checker",
            "roleCode": 6
        },
        {
            "description": "HO Maker Role",
            "role": "HO Maker",
            "roleCode": 7
        },
        {
            "description": "HO Checker Role",
            "role": "HO Checker",
            "roleCode": 8
        },
        {
            "description": "Management Role",
            "role": "Management",
            "roleCode": 9
        },
        {
            "description": "CA Role",
            "role": "Chartered Accountant",
            "roleCode": 10
        },
        {
            "description": "You can Add/Edit/View data pertaining to Units/Entities. You can also bulk_upload units data.",
            "role": "Admin Maker",
            "roleCode": 11
        },
        {
            "description": "You can Authorize/Reject/View data pertaining to Units/Entities. You can also Authorize, bulk_uploaded banches data.",
            "role": "Admin Checker",
            "roleCode": 12
        },
        {
            "description": "Ops Maker",
            "role": "Ops Maker",
            "roleCode": 13
        },
        {
            "description": "Ops Checker",
            "role": "Ops Checker",
            "roleCode": 14
        }
    ]


    let item2 :any=[
    {
        "description": "You can Add/Edit/View data pertaining to Units/Entities. You can also bulk_upload units data.",
        "role": "Admin Maker",
        "roleCode": 11
    },
    {
        "description": "You can Authorize/Reject/View data pertaining to Units/Entities. You can also Authorize, bulk_uploaded banches data.",
        "role": "Admin Checker",
        "roleCode": 12
    },
    {
        "description": "Ops Maker",
        "role": "Ops Maker",
        "roleCode": 13
    },
    {
        "description": "Ops Checker",
        "role": "Ops Checker",
        "roleCode": 14
    }
]


console.log('inngon',this.roleValueSelectedObj)


      this.getLevelsData();
    }
    if (this.showUser == "AddUser") {
      this.recordStatus = 'A';
      this.currentLevel = true;
      this.userHeading = "Add User";
      this.GetRolesAddData();
      this.getLevelsData();
    }
    if (this.showUser == "AuthorizedUser") {
      this.myForms = this.fb.group({
        roleU: ['',Validators.required],

      });
      // alert(this.showUser)
      this.userHeading = "Authorised User";
      this.disabledUserId = true;
      this.disableEdit=true
      this.UserId = sessionStorage.getItem("userID");
      this.Status = sessionStorage.getItem("Status");
      this.disabledUserId = false;
      this.authorziedUser = true;
      this.isAdd = false;
      this.spinner.show();
     setTimeout(()=>{
      this.getEditUser();
     },2000); 
      this.getLevelsData();
    }
    this.RoleSettings = {
      singleSelection: false,
      idField: 'roleCode',
      textField: 'role',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    // this.myForms = this.fb.group({
    //   roleU: [''],

    // });
// this.changeLevel();
   this.getUnitNameByLevel();
   this.getRecordStatusData();
  }
  deleteUser() {
    sessionStorage.setItem("popupDelete","UserDataDeleted");
    //popupDelete
    this.deletedialog?.openDialog();
   // this.dialog.open(WarningPopupComponent,{ panelClass: 'AddUsersSuccessPop', hasBackdrop: true, backdropClass:'backdropBackground', disableClose:false})
  }
  AuthDialog(){
    sessionStorage.setItem("auth","userAuthorise");
   this.authdialog?.openDialog();
  }

  rejectDialog(){
   sessionStorage.setItem("auth","UserReject");
   this.authdialog?.openDialog();
  }

  getLevelsData() {
    this.userService.getLevels(this.currentLevel).subscribe((res: any) => {
      console.log("LevelsResponse", res)
      if (res) {
        this.levelsData = res?.data;
        this.levelsData.pop();
        console.log("LevelsResponse", this.levelsData);
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
  combinedArray:any = [];
  changeLevel(event:any) {
    console.log("Event", event);
    // alert("hhhh")
    this.Level= event.level;
    console.log(this.Level);
    this.parentUnit = '';
    this.unitCode = '';
    this.roleModal = '';
    this.roleSelect = [];
    this.userTableLevel = event.level
    this.GetRolesData();
    // let level = event.level;
    this.Level = this.Level;
    if (this.Level === this.userLevel) {
      this.parentUnit = 0;
      console.log("Level", this.Level)
      console.log("ParentLevel", this.parentUnit)
      this.getUnitNameByLevel();
    }
    if (this.Level !== this.userLevel) {
      this.userService.getParentLevels(this.Level).subscribe((res: any) => {
        console.log("LevelsResponse", res)
        if (res) {
          this.parentLevelsData = res?.data;
          let combinedIdValue = this.parentLevelsData.map((item:any) => `${item.unitCode}-${item.unit}`);
          console.log("CombinedIdValue",combinedIdValue);
          let combinedIdArray = this.parentLevelsData.map((item:any) => item.unitCode);
          console.log("CombinedIdArray",combinedIdArray);
    // Combine arrays into an array of objects
  this.combinedArray = combinedIdValue.map((value: any, index: string | number) => ({ unit: value, unitCode: combinedIdArray[index] }));
        
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
  getParentLevel(event: any) {
    this.unitCode = '';
    this.parentUnit = event.unitCode;
    console.log("ParentLevel", this.parentUnit);
    this.userService.getUnitCode(this.parentUnit).subscribe((res: any) => {
      console.log("UnitCodeResponse", res)
      if (res) {
        this.unitCodeData = res?.data;
        console.log("UnitCodeResponse", this.unitCodeData);
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
  getUnitNameByLevel() {

    this.userService.getUnitCodeByLevel(this.Level).subscribe((res: any) => {
      console.log("RecordStatusesponse", res)
      if (res) {
        this.unitCodeData = res?.data;
        //  let unitCode = res?.data[0].unitCode;
        //  let unitname = res?.data[0].unitName;
        // this.unitCodeData = unitCode+'-'+unitname;
      if(this.unitCodeData){
        this.unitCodeData = this.unitCodeData.map((item:any) => `${item.unitCode}-${item.unitName}`);
      }
      this.cdr.detectChanges();
    
        console.log("unitCodeData", this.unitCodeData);
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
  getUnitName(event: any) {
    console.log("UnitName", event)
    this.unitCode = event.unit;
    console.log("unitName", this.unitCode);
  }
  getUnitNameFromLevel(event: any) {
    console.log("UnitName", event)
    this.unitCode = event;
    console.log("unitName", this.unitCode);
  }
  getRecordStatusData() {
    this.userService.getEntityStatus(this.isAdd).subscribe((res: any) => {
      console.log("RecordStatusesponse", res)
      if (res) {
        this.recordStatusData = res?.data;
        console.log("RecordStatusesponse", this.recordStatusData);
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
  getRecordStatus(event: any) {
    this.recordStatus = event.statusId;
    console.log("recordStatus", this.recordStatus);
  }
  userIdEntered(event: any) {
    this.userId = event.target.value;
    console.log("userId", this.userId);
  }
  roleEntered(event: any) {
    this.roleName = event.target.value;
    console.log("roleName", this.roleName);
  }
  userNameEntered(event: any) {
    this.userName = event.target.value;
    console.log("userName", this.userName);
  }
  givenNameEntered(event: any) {
    this.nameEntered = event.target.value;
    console.log("nameEntered", this.nameEntered);
  }
  mobileNumberEntered(event: any) {
    this.numberEntered = event.target.value;
    console.log("numberEntered", this.numberEntered);
  }
  emailEntered(event: any) {
    this.email = event.target.value;
    console.log("email", this.email);
  }
  departmentEntered(event: any) {
    this.departmentName = event.target.value;
    console.log("departmentName", this.departmentName);
  }
  designationEntered(event: any) {
    this.designationName = event.target.value;
    console.log("designationName", this.designationName);
  }
  gradeEntered(event: any) {
    this.Grade = event.target.value;
    console.log("Grade", this.Grade);
  }
  saveAddUserData() {
    if(this.unitCode.includes("-")){
      this.unitCode = this.unitCode.split('-')[0];
    }
    console.log(this.unitCode);
    let userData = {
      userId: this.userId,
      emailId: this.email,
      mobileNumber: this.numberEntered,
      role: String(this.roleSelect),
      unitCode: this.unitCode,
      userName: this.userName,
      shortName: this.nameEntered,
      department: this.departmentName,
      grade: this.Grade,
      designation: this.designationName,
      entityStatus: this.recordStatus
    }
    console.log("userData",userData);
    this.userService.addUserData(userData).subscribe((res: any) => {
      if (res.success = true) {
        let AddUserResponse = res;
        console.log("AddUserResponse", AddUserResponse);
        const message = "Created Successfully";
        sessionStorage.setItem("RateAllowedPopup",message);
        sessionStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
        this.errordialog?.openDialog();
        if (res.message == "Created Successfully") {
          this.router.navigate(['/user-data'])
        }
        else {
         // alert(res.message)
         sessionStorage.setItem("RateAllowedPopup",res.message);
         sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
         this.errordialog?.openDialog();
        }
      }
      if (res.success == false) {
       // alert(res.message)
       sessionStorage.setItem("RateAllowedPopup",res.message);
       sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
       this.errordialog?.openDialog();
      }
    }, (err: any) => {
      // console.log("ErrorMessage", err.error.message);
      //alert(err.error.message)
      if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        }
       else {
         sessionStorage.setItem("RateAllowedPopup",err.error.message);
         sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
         this.errordialog?.openDialog();
      }
    }
    );
  }
  reset() {
    this.Level = '';
    this.roleSelect  = []
    this.parentUnit = '';
    this.email = '';
    this.numberEntered = '';
    this.unitCode = '';
    this.userName = '';
    this.nameEntered = '';
    this.departmentName = '';
    this.Grade = '';
    this.designationName = '';
    // this.recordStatus = '';
    this.myForms?.reset()
  }
  back() {
    this.router.navigate(['/user-data'])
  }
  selectedobj: any = []
  getEditUser() {
    this.userService.editUserData(this.UserId, this.Status).subscribe(
      (res: any) => {
        this.spinner.hide();
      if (res.success = true) {
        let EditUserResponse = res?.data;
        console.log("EditUserResponse", EditUserResponse)
        this.userId = EditUserResponse?.userId;
        this.unitCode = EditUserResponse?.unitCode;
        this.email = EditUserResponse?.emailId;
        this.numberEntered = EditUserResponse?.mobile;
        this.Level = Number(EditUserResponse?.level);
        this.userName = EditUserResponse?.name;
        this.nameEntered = EditUserResponse?.givenName;
        this.departmentName = EditUserResponse?.department;
        this.designationName = EditUserResponse?.designation;
        this.Grade = EditUserResponse?.grade;
        this.recordStatus = EditUserResponse?.entityStatus;
        this.roleModal = EditUserResponse?.role;
        
        // if (this.Level == 2) {
        //   this.currentLevel = false;
        // }
        // else {
        //   this.currentLevel = true;
        // }
        this.currentLevel = true;
        if (this.Level !== 1) {
          this.userService.getParentLevels(this.Level).subscribe(
            (res: any) => {
            console.log("LevelsResponse", res)
            if (res) {
              this.parentLevelsData = res?.data;
                 let combinedIdValue = this.parentLevelsData.map((item:any) => `${item.unitCode}-${item.unit}`);
          console.log("CombinedIdValue",combinedIdValue);
          let combinedIdArray = this.parentLevelsData.map((item:any) => item.unitCode);
          console.log("CombinedIdArray",combinedIdArray);
         // Combine arrays into an array of objects
         this.combinedArray = combinedIdValue.map((value: any, index: string | number) => ({ unit: value, unitCode: combinedIdArray[index] }));
        
        
              console.log("ParentLevelsResponse", this.parentLevelsData);
            }
          },
            (err: any) => {
              if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        }
           else {
                // console.log("ErrorMessage", err.error.message);
                sessionStorage.setItem("RateAllowedPopup",err.error.message);
                sessionStorage.setItem("PopupMaitainaunitCodeDatance",'NrlmUpload');
                this.errordialog?.openDialog();
              }
            }
          );
        
        this.parentUnit = EditUserResponse?.parentUnitCode;
        this.userService.getUnitCode(this.parentUnit).subscribe(
          (res: any) => {
          console.log("UnitCodeResponse", res)
          if (res) {
            this.unitCodeData = res?.data;
            console.log("UnitCodeResponse", this.unitCodeData);
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
        let roleSelectData = EditUserResponse?.roleCode;
        console.log("roleselectdData",roleSelectData);
        // let roleSelectData = "[4]";
        this.roleSelect = JSON.parse(roleSelectData);
        console.log("RoleSelect",this.roleSelect);
        console.log('this.roleSelect',this.roleSelect);
        console.log("rolesData", this.rolesData);
          this.roleSelect.forEach((element: any) => {
            console.log("AllElements",element);
            const noneRole = {roleCode: 0, description: 'No Role is there for this user', role: 'none'};
            this.rolesData.push(noneRole);
            console.log(this.rolesData);
            const filteredArray = this.rolesData.filter((obj: any) => obj?.roleCode === element);
            console.log("FilteredArray",filteredArray[0]);
              this.roleValueSelectedObj.push(filteredArray[0])
              this.myForms.patchValue({
                roleU:this.roleValueSelectedObj,
              })
              console.log('filteredArray', filteredArray)
              console.log("selectedObj",this.selectedobj)
            })
        
        this.userService.getUnitCodeByLevel(this.Level).subscribe((res: any) => {
          console.log("RecordStatusesponse", res)
          if (res) {
            // this.unitCodeData = res?.data;
            // console.log("unitCodeData", this.unitCodeData);
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
        this.unitCode = EditUserResponse?.unitCode;
        this.userName = EditUserResponse?.name;
        this.nameEntered = EditUserResponse?.givenName;
        this.departmentName = EditUserResponse?.department;
        this.Grade = EditUserResponse?.grade;
        this.designationName = EditUserResponse?.designation
        this.recordStatus = EditUserResponse?.entityStatus
      }
      if (res.success = false) {
       // alert(res.message)
       sessionStorage.setItem("RateAllowedPopup",res.message);
       sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
       this.errordialog?.openDialog();
      }
    }, (err: any) => {
      if (err.status === 401) {
      sessionStorage.setItem("RateAllowedPopup", err.error.message);
      sessionStorage.setItem("PopupMaitainance", "LogoutError");
      this.errordialog?.openDialog()
      } else {
        console.log("ErrorMessage", err.error.message);
      //  alert(err.error.message)
      sessionStorage.setItem("RateAllowedPopup",err.error.message);
      sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
      this.errordialog?.openDialog();
      }
    }
    );
  }

  compareFn(c1: any, c2: any): boolean {
    // Modify the property names if they are different in your objects
    return c1 && c2 ? c1.unit === c2.unit : c1 === c2;
  }
  
  saveEditUserData() {
    let item = this.roleSelect.join(',');
    console.log("Item",item);
    if(this.unitCode.includes("-")){
      this.unitCode = this.unitCode.split('-')[0];
    }
    console.log("SelectRoleEdit",item)
    let EditData = {
      emailId: this.email,
      mobileNumber: this.numberEntered,
      role:item,
      unitCode: this.unitCode,
      userName: this.userName,
      shortName: this.nameEntered,
      department: this.departmentName,
      grade: this.Grade,
      designation: this.designationName,
      entityStatus: this.recordStatus,
      remarks: ""
    }
    console.log("UserDataaa",EditData)
    this.userService.saveEditUserData(this.UserId, this.Status, EditData).subscribe(
      (res: any) => {
      if (res.success == true) {
        let saveEditDataResponse = res;
        console.log("AddUserResponse", saveEditDataResponse);
        sessionStorage.setItem("RateAllowedPopup",res.message);
        sessionStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
        this.errordialog?.openDialog();
        this.router.navigate(['/user-data'])
      }
      if (res.success == false) {
       // alert(res.message)
       sessionStorage.setItem("RateAllowedPopup",res.message);
       sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
       this.errordialog?.openDialog();
      }
    }, (err: any) => {
      if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        }else {
        console.log("ErrorMessage", err.error.message);
        //alert(err.error.message)
        sessionStorage.setItem("RateAllowedPopup",err.error.message);
        sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
        this.errordialog?.openDialog();
      }
    }
    );
  }

  GetRolesAddData(){
    this.userService.getRolesData().subscribe(
      (res: any) => {
     //   this.rolesData = res;
     if (this.userTableLevel == '2') {
      const filteredRolesData = res.filter((role: any) => [5,6,11,12].includes(role.roleCode));
      this.rolesData = filteredRolesData;
    } else if (this.userTableLevel == '3') {
      const filteredRolesData = res.filter((role: any) => [3,4,13,14].includes(role.roleCode));
      this.rolesData = filteredRolesData;
    } 
    else if(this.userTableLevel == '3' && this.userLevel === 2){
      const filteredRolesData = res.filter((role: any) => [3,4,13,14].includes(role.roleCode));
      this.rolesData = filteredRolesData;
    }
    else if(this.userLevel === 2){
      const filteredRolesData = res.filter((role: any) => [5,6,11,12].includes(role.roleCode));
      this.rolesData = filteredRolesData;
    }
    else if(this.userLevel === 3){
      const filteredRolesData = res.filter((role: any) => [3,4,13,14].includes(role.roleCode));
      this.rolesData = filteredRolesData;
    }
      else {
      this.rolesData = res;
    }
      });
  }
  GetRolesData() {
    this.userService.getRolesData().subscribe(
      (res: any) => {
        this.rolesAllData = res;
        if (this.userTableLevel == '2') {
          const filteredRolesData = res.filter((role: any) => [5,6,11,12].includes(role.roleCode));
          this.rolesData = filteredRolesData;
        } else if (this.userTableLevel == '3') {
          const filteredRolesData = res.filter((role: any) => [3,4,13,14].includes(role.roleCode));
          this.rolesData = filteredRolesData;
        } 
        else if(this.userTableLevel == '3' && this.userLevel === 2){
          const filteredRolesData = res.filter((role: any) => [3,4,13,14].includes(role.roleCode));
          this.rolesData = filteredRolesData;
        }
        else if(this.userLevel === 2){
          const filteredRolesData = res.filter((role: any) => [5,6,11,12].includes(role.roleCode));
          this.rolesData = filteredRolesData;
        }
        else if(this.userLevel === 3){
          const filteredRolesData = res.filter((role: any) => [3,4,13,14].includes(role.roleCode));
          this.rolesData = filteredRolesData;
        }
          else {
          this.rolesData = res;
        }
        
        // Extracting roleCode from the filtered rolesData
        this.rolesListArray = this.rolesData.map((role: any) => role.roleCode);
        console.log('RolesData', this.rolesData);
        console.log('rolesListArray', this.rolesListArray);
        // if (this.showUser == "EditUser" || this.showUser == "deleteData" || this.showUser == "AuthorizedUser") {
        //   this.getEditUser();
        // }
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
    })
  }
  SelectRole(item: any) {
    console.log("item", item);
  
    console.log(this.roleModal);
    if(item.roleCode != 0){
      this.roleSelect =  this.roleSelect.filter(number => number !== 0);
      this.roleModal = this.roleModal.filter((item: { roleCode: number; role: string}) => item.roleCode !==0)
    }
    this.roleSelect.push(item.roleCode);
    console.log("Roles", this.roleSelect);
    console.log(this.roleModal);
  }
  DeselectRole(item: any) {
    console.log("Data", item)
    this.roleSelect.forEach((element: any, index: any) => {
      if (element == item.roleCode) this.roleSelect.splice(index, 1);
    });
    console.log("DeSelectRole", this.roleSelect);
  }
  DeselectAllRole(item: any) {
    console.log("Data", item)
    this.roleSelect = [];
  }
  SelectAllRole(item: any) {
    console.log("Data", item)
    this.roleSelect = this.rolesListArray;
    console.log("SelectAllRole", this.roleSelect);
  }
  // Authorize and reject in AdminUser
  remarks:string=''
  sendRateUpdate(isReject: boolean) {
    let data = {
      userId: sessionStorage.getItem('UserID'),
      currentStatus:sessionStorage.getItem('UserStatus') ,
      remarks: this.remarks,
      isReject: JSON.stringify(isReject),
    };
    console.log(data);
    this.userService.authorizeNdRejectUser(data).subscribe(
      (res: any) => {
        if ((res.success = true)) {
          let authorizeUserData = res?.data;
          console.log('authorizeUserDataResponse', authorizeUserData);
          sessionStorage.setItem("RateAllowedPopup",res.message);
          sessionStorage.setItem("PopupMaitainance",'NrlmUploadSuccess');
          this.errordialog?.openDialog();
          this.router.navigate(['/user-data']);
        } else {
          //alert(res.message);
          sessionStorage.setItem("RateAllowedPopup",res.message);
          sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
          this.errordialog?.openDialog();
        }
      },
      (err: any) => {
        if (err.status === 401) {
          sessionStorage.setItem("RateAllowedPopup", err.error.message);
          sessionStorage.setItem("PopupMaitainance", "LogoutError");
          this.errordialog?.openDialog();
        } else {
          console.log('ErrorMessage', err.error.message);
         // alert(err.error.message);
         sessionStorage.setItem("RateAllowedPopup",err.error.message);
         sessionStorage.setItem("PopupMaitainance",'NrlmUpload');
         this.errordialog?.openDialog();
        }
      }
    );
  }

  restrictToNumbers(event: any): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    input.value = value.replace(/[^0-9]/g, '');
 
  }
}
