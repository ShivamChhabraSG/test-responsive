import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { LoginPopupComponent } from '../login-popup/login-popup.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent {
  jsonData: any;
  isFullscreen = false;
  constructor(
    public dialog: MatDialog,
    public translate: TranslateService,
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService
  ) {
    translate.addLangs(['en', 'hi']);
    translate.setDefaultLang('en');
  }
  ngOnInit() {
    this.spinner.hide();
    this.httpClient.get('../../assets/i18n/en.json').subscribe((data) => {
      this.jsonData = data;
      console.log('JSON Data', this.jsonData); // You can now access the JSON data
    });
    this.toggleLanguage();
  }
  //  switchLang(lang:string) {
  // this.translate.use(lang)
  //  }
  ShowText: string = 'हिन्दी';
  toggleLanguage() {
    if (this.translate.currentLang === 'en') {
      this.ShowText = 'English';
      this.translate.use('hi'); // Switch to Hindi
      this.httpClient.get('../../assets/i18n/hi.json').subscribe((data) => {
        this.jsonData = data;
        console.log(this.jsonData); // You can now access the JSON data
      });
    } else {
      this.ShowText = 'हिन्दी';
      this.translate.use('en');
      this.httpClient.get('../../assets/i18n/en.json').subscribe((data) => {
        this.jsonData = data;
        console.log(this.jsonData); // You can now access the JSON data
      }); // Switch to English
    }
  }
  loginIn() {
    sessionStorage.clear();
    sessionStorage.setItem('getpassword', 'createlogin');
    this.dialog.open(LoginPopupComponent, {
      panelClass: 'AddUsersSuccessPop',
      hasBackdrop: true,
      backdropClass: 'backdropBackground',
      disableClose: false,
    }); // this.isOpen = false;
    this.toggleFullscreen();
  }

  toggleFullscreen() {
    if (document.documentElement.requestFullscreen) {
      if (!document.fullscreenElement) {
        document.documentElement
          .requestFullscreen()
          .then(() => {
            this.isFullscreen = true;
          })
          .catch((error) => {
            console.error('Fullscreen request failed:', error);
          });
      }
    }
  }

  isDropdownOpen = false;
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.isPdfDropdownOpen = false;
  }
  downloadOptions = [
    {
      text: 'NRLM Master Upload',
      data: 'slno^bank_code^bank_name^state_id^state_name^shg_name^loan_acc_no^sbaccount^bl_ifsc_code^branch_code^yr^mis_shg_code^',
    },
    {
      text: 'SHG Master Upload',
      data: 'Nrlm_shg_code^Bank_code^Branch_code^Branch_IFSC_Code^Loan_Account_number^SHG_Customer_ID^SHG_name^Loan_Sanction_date^Loan_Account_type^SB_Account_number^SHG_Type^Pin_code^State_code^District_code^Area_Type^Loan_Limit^ROI_1^ROI_2^ROI_3^Drawing_power',
    },
    {
      text: 'Closed Accounts Upload',
      data: 'Bank_code^Loan_Account_number^SHG_customer_id^Acc_closed_status^Acc_closed_date',
    },
    {
      text: 'Claims Upload',
      data: 'QUARTER^BANK_CODE^BRANCH_CODE^LOAN_ACCOUNT_NUMBER^SHG_CUSTOMER_ID^DRAWING_POWER^M1_OUTSTANDING^M2_OUTSTANDING^M3_OUTSTANDING^ROI_1^ROI_2^ROI_3^LOAN_AMT_DIS^INSTALLMENT^INT_CHARGED^M1_ACC_STATUS^M2_ACC_STATUS^M3_ACC_STATUS^INT_SUB_3^INT_SUB_5^INT_SUB_3_REV^INT_SUB_5_REV^M1_OPENING_BALANCE^M3_OVERDUE_AMT^FIN_YEAR^CLAIM_TYPE',
    },
    {
      text: 'Branches Upload',
      data: 'BK_CODE	BR_CODE	BR_NAME	BR_STATE_CODE	BR_DISTRICT_CODE	BR_PINCODE	IFSC',
    },
    {
      text: 'Users Upload',
      data: 'Sl. No.	Employee ID	Name Display	Designation	Unit Name	Dept Name	Grade	Mobile Number	Email Address',
    },
  ];
  downloadCSV(option: { text: string; data: string }) {
    let csvData = option.data.toUpperCase();
    if (option.text === 'Branches Upload' || option.text === 'Users Upload') {
      csvData = option.data.replace(/\t/g, ',').toUpperCase();
    }
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${option.text}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  isPdfDropdownOpen: boolean = false;
  togglePdfDropdown() {
    this.isPdfDropdownOpen = !this.isPdfDropdownOpen;
    this.isDropdownOpen = false;
  }

  
  downloadFile(file: { text: string; fileName: string }): void {
    const fileUrl = `assets/sample-pdf/${file.fileName}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.fileName;
    if (file.fileName.endsWith('.pdf')) {
      link.target = '_blank';
    } 
    else if (file.fileName.endsWith('.csv') || file.fileName.endsWith('.xlsx')) {
      link.setAttribute('download', file.fileName);
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadPdfOptions = [
    {
      text: 'States and District Mapping (Annexure-A)',
      fileName: 'States and District Mapping (Annexure-A).pdf'
    },
    {
      text: 'Upload Data Types (Appendix-C)',
      fileName: 'Upload Data Types (Appendix-C).pdf'
    },
    {
      text: 'Error Correction Steps (Appendix-D)',
      fileName: 'Error Correction Steps (Appendix-D).pdf'
    },
  ]
}
