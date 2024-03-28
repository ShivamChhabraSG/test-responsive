import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { EntityScreenServiceService } from '../services/entity-screen-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
  styleUrls: ['./dashboard-screen.component.css'],
})
export class DashboardScreenComponent implements OnInit {
  rejectedRecords: any;
  submittedRecords: any;
  claimDueStatus: any = [];
  claimSubmittedStatus: any = [];
  unitCode: any;
  level: any;
  fyYear: any = [];
  regions: any = [];
  bank_Type: any = [];
  selectedFyYear: any;
  selectedRegion: any;
  selectedBankType: any;
  isDropdownOpen: boolean = false;
  SHGsClaimed  :any;
  SHGsApproved  :any
  dashboardData:any[]= []
  @ViewChild(ErrorDialogComponent) errordialog:| ErrorDialogComponent| undefined;
  
  barChartData = [
    { value: '', label: 'Banks' },
    { value: '', label: 'Claims Due' },
    { value: '', label: 'Submitted' },
    { value: '', label: 'Rejected' },
    { value: '', label: 'With RO' },
    { value: '', label: 'With HO' },
    { value: '', label: 'Approved' },
  ];
  barChartSHGs = [
    { value: '', label: 'Unique SHGs' },
    { value: '', label: 'Amount Claimed (Crs.)' },
    { value: '', label: 'Unique SHGs' },
    { value: '', label: 'Amount Approved (Crs.)' },
  ];

  barChartType: ChartType = 'bar';
  barChartLegend = true;

  claimStatusDataChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Claim Status',
        font: {
          size: 14,
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          font: {
            size: 9,
          },
        },
      },
    },
  };
  claimStatusData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Due',
        borderColor: 'black',
        backgroundColor: '#4473c5',
        hoverBackgroundColor: '#4473c5',
      },
      {
        data: [],
        label: 'Submitted',
        borderColor: 'black',
        backgroundColor: '#ec7c31',
        hoverBackgroundColor: '#ec7c31',
      },
    ],
  };

  submissionStatusDataChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        max: 100,
        ticks: {
          stepSize: 10,
          callback: (value: number | string) => {
            if (typeof value === 'number') {
              return `${value}%`;
            }
            return value;
          },
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Submission Status (%)',
        font: {
          size: 14,
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          font: {
            size: 9,
          },
        },
      },
    },
  };
  submissionStatusData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Due',
        borderColor: 'black',
        backgroundColor: '#4473c5',
        hoverBackgroundColor: '#4473c5',
      },
      {
        data: [],
        label: 'Submitted',
        borderColor: 'black',
        backgroundColor: '#ec7c31',
        hoverBackgroundColor: '#ec7c31',
      },
    ],
  };

  claimDueDataChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Claim Due',
        font: {
          size: 14,
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          font: {
            size: 9,
          },
        },
      },
    },
  };
  claimDueData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [30, 40, 25, 30, 10, 30, 50],
        label: 'Delayed-30',
        borderColor: 'black',
        backgroundColor: '#ec5546',
        hoverBackgroundColor: '#ec5546',
      },
      {
        data: [20, 30, 40, 50, 37, 29, 42],
        label: 'Delayed-60',
        borderColor: 'black',
        backgroundColor: '#71bbdd',
        hoverBackgroundColor: '#71bbdd',
      },
      {
        data: [30, 40, 25, 30, 10, 30, 50],
        label: 'Delayed-90',
        borderColor: 'black',
        backgroundColor: '#3eae91',
        hoverBackgroundColor: '#3eae91',
      },
      {
        data: [20, 30, 40, 50, 37, 29, 42],
        label: 'Delayed>90',
        borderColor: 'black',
        backgroundColor: '#808080',
        hoverBackgroundColor: '#808080',
      },
    ],
  };

  approvalStatusDataChartOptions: ChartOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      title: {
        display: true,
        text: 'Approval Status',
        font: {
          size: 14,
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          font: {
            size: 9,
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  approvalStatusData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Approved',
        data: [],
        backgroundColor: '#54c0eb',
        hoverBackgroundColor: '#54c0eb',
      },
      {
        label: 'Submitted',
        data: [],
        backgroundColor: '#f8b64c',
        hoverBackgroundColor: '#f8b64c',
      },
    ],
  };

  approvalPercentStatusChartOptions: ChartOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      title: {
        display: true,
        text: 'Approval Status (%)',
        font: {
          size: 14,
        },
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 8,
          boxHeight: 8,
          font: {
            size: 9,
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        max: 100,
        ticks: {
          stepSize: 10,
          callback: (value: number | string) => {
            if (typeof value === 'number') {
              return `${value}%`;
            }
            return value;
          },
        },
      },
      y: {
        stacked: true,
      },
    },
  };
  approvalPercentStatusData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Approved',
        data: [],
        backgroundColor: '#54c0eb',
        hoverBackgroundColor: '#54c0eb',
      },
      {
        label: 'Submitted',
        data: [],
        backgroundColor: '#f8b64c',
        hoverBackgroundColor: '#f8b64c',
      },
    ],
  };

  constructor(
    private entityService: EntityScreenServiceService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.fetchData();
    }, 1000);
  }

  fetchData() {
    let tokenDetails = JSON.parse(
      sessionStorage.getItem('TokenDetals') || 'null'
    );
    this.unitCode = tokenDetails.unitCode;
    console.log(tokenDetails.unitCode);
    this.level = tokenDetails.level;
    console.log(this.level);
    this.fetchDashboardData();
    this.getFyYear();
  }

  fetchDashboardData() {
    this.spinner.show();
    let inDate ;
    let unitType = this.selectedBankType ;
    this.entityService.getDashboardData(this.unitCode,inDate,unitType).subscribe(
        (res: any) => {
          this.spinner.hide();
          this.dashboardData = res?.data;

          if(this.selectedRegion === 'All'){
            this.dashboardData = res?.data;
          }
          else if (this.selectedRegion) {
            console.log(this.selectedRegion);            
            this.dashboardData = this.dashboardData.filter((region:any) => region.REGION === this.selectedRegion)
            console.log(this.dashboardData);
          }
        
          console.log(this.dashboardData);
          
          const storedRegion = sessionStorage.getItem('regions')
          if (storedRegion) {
            this.regions = JSON.parse(storedRegion)
          } else {
            let region =this.dashboardData?.reduce((acc: any, val: any) => {
              (acc[val.REGION] = acc[val.REGION] || []).push(val);
              return acc;
            }, {}) ?? {};
          region["All"] = this.dashboardData || [];
          console.log(region);
          sessionStorage.setItem('regions',JSON.stringify(Object.keys(region)));
          this.regions = Object.keys(region);
          }
       
          const storedBankType = sessionStorage.getItem('bankType');
          if (storedBankType) {
            this.bank_Type = JSON.parse(storedBankType);
          } else {
            let bankType = this.dashboardData?.reduce((acc: any, val: any) => {
                (acc[val.BANK_TYPE] = acc[val.BANK_TYPE] || []).push(val);
                return acc;
              }, {}) ?? {};
            bankType["All"] = this.dashboardData || [];
            console.log(bankType);
            sessionStorage.setItem('bankType',JSON.stringify(Object.keys(bankType)));
            this.bank_Type = Object.keys(bankType);
          }

          let bankCode = this.dashboardData?.reduce((acc: any, val: any) => {
              (acc[val.BANK_CODE] = acc[val.BANK_CODE] || []).push(val);
              return acc;
            }, {}) ?? {};
          console.log(bankCode);
          console.log(Object.keys(bankCode).length);
          this.barChartData[0].value = Object.keys(bankCode).length.toString();

          this.barChartData[1].value = this.dashboardData?.length.toString();

          this.submittedRecords = this.dashboardData?.filter((submitted: any) => 
          submitted.SUBMITTED_STATUS != '');
          console.log(this.submittedRecords?.length);
          this.barChartData[2].value = this.submittedRecords?.length;

          this.rejectedRecords = this.dashboardData?.filter((record: any) => 
          record.REJECTED != '' && record.REJECTED > 0);
          console.log(this.rejectedRecords?.length);
          this.barChartData[3].value = this.rejectedRecords?.length;

          let submittedStatusGroup = this.dashboardData?.reduce((acc: any, val: any) => {
              (acc[val.SUBMITTED_STATUS] = acc[val.SUBMITTED_STATUS] || []).push(val);
              return acc;
            }, {}) ?? {};
          console.log(submittedStatusGroup);
          this.barChartData[4].value = submittedStatusGroup?.With_RO?.length || 0;
          this.barChartData[5].value = submittedStatusGroup?.With_HO?.length || 0;
          this.barChartData[6].value = submittedStatusGroup?.Approved?.length || 0;

          let qtrDate = this.dashboardData?.reduce((acc: any, val: any) => {
              (acc[val.QTR_DATE] = acc[val.QTR_DATE] || []).push(val);
              return acc;
            }, {}) ?? {};
          console.log(qtrDate);

          const formattedDates = Object.keys(qtrDate).map((date) =>
          this.datePipe.transform(date, 'dd-MM-yyyy'));
          console.log(formattedDates);
          this.claimStatusData.labels = formattedDates;
          this.submissionStatusData.labels = formattedDates;
          this.claimDueData.labels = formattedDates;
          this.approvalStatusData.labels = formattedDates.slice().reverse();
          this.approvalPercentStatusData.labels = formattedDates.slice().reverse();

          const dueCount = Object.keys(qtrDate).reduce((acc: any, count: any) => {
              acc[count] = qtrDate[count].length;
              return acc;
            },{});
          console.log(dueCount);
          this.claimDueStatus = Object.values(dueCount);
          console.log(this.claimDueStatus);

          const submittedCount = Object.keys(qtrDate).reduce((acc: any, count: any) => {
          acc[count] = qtrDate[count].filter((record: any) => record.SUBMITTED_STATUS !== '').length;
              return acc;
            },{});
          console.log(submittedCount);
          this.claimSubmittedStatus = Object.values(submittedCount);
          console.log(this.claimSubmittedStatus);

          const dueDelayCount = Object.keys(qtrDate).reduce((acc: any, count: any) => {
            acc[count] = qtrDate[count].filter((record: any) => record.DUE_DELAY === 'Greater then 90 Days').length;
                return acc;
              },{});
            console.log(dueDelayCount);

          const submissionStatusRatio: { [key: string]: number } = {};
          Object.keys(qtrDate).forEach((count) => {const submittedCount = qtrDate[count].filter(
          (record: any) => record.SUBMITTED_STATUS !== '').length;
          const dueCount = qtrDate[count].length;
          const submittedRatio = Math.round(((submittedCount * 100) / dueCount) * 100) / 100;
          submissionStatusRatio[count] = submittedRatio;
          });
          console.log(submissionStatusRatio);

          const dueRatio: { [key: string]: number } = {};
          Object.keys(submissionStatusRatio).forEach((count) => {
            const remaining = 100 - submissionStatusRatio[count];
            dueRatio[count] = Math.round(remaining * 100) / 100;
          });
          console.log(dueRatio);

          const approvedCount = Object.keys(qtrDate).reduce((acc: any, count: any) => {
          acc[count] = qtrDate[count].filter((record: any) => record.SUBMITTED_STATUS === 'Approved').length;
              return acc;
            },{});
          console.log(approvedCount);

          const approvalStatusRatio: { [key: string]: number } = {};
          Object.keys(qtrDate).forEach((count) => {const submittedCount = qtrDate[count].filter(
          (record: any) => record.SUBMITTED_STATUS !== '').length;
          const approvedCount = qtrDate[count].filter((record: any) => record.SUBMITTED_STATUS === 'Approved').length;
          const approvedRatio = Math.round(((approvedCount * 100) / submittedCount) * 100) / 100;
          approvalStatusRatio[count] = approvedRatio;
          });
          console.log(approvalStatusRatio);

          const submittedRatio: { [key: string]: number } = {};
          Object.keys(approvalStatusRatio).forEach((count) => {
          const remaining = 100 - approvalStatusRatio[count];
          submittedRatio[count] = Math.round(remaining * 100) / 100;
          });
          console.log(submittedRatio);

          this.claimStatusData.datasets[0].data = this.claimDueStatus;
          this.claimStatusData.datasets[1].data = this.claimSubmittedStatus;
          this.submissionStatusData.datasets[0].data = Object.values(dueRatio);
          this.submissionStatusData.datasets[1].data = Object.values(submissionStatusRatio);
          this.approvalStatusData.datasets[0].data = Object.values(approvedCount).reverse() as number[];
          this.approvalStatusData.datasets[1].data = Object.values(submittedCount).reverse() as number[];
          this.approvalPercentStatusData.datasets[0].data = Object.values(approvalStatusRatio).reverse() as number[];
          this.approvalPercentStatusData.datasets[1].data = Object.values(submittedRatio).reverse() as number[];

          this.claimStatusData = { ...this.claimStatusData };
          this.submissionStatusData = { ...this.submissionStatusData };
          this.claimDueData = { ...this.claimDueData };
          this.approvalStatusData = { ...this.approvalStatusData };
          this.approvalPercentStatusData = {...this.approvalPercentStatusData };

          this.SHGsClaimed = this.dashboardData?.filter((submitted: any) => submitted.SUBMITTED_STATUS !== '');
          console.log(this.SHGsClaimed);          
          const shgsclaimed = this.SHGsClaimed.reduce((sum: number, record: any) => sum + record.SLAB1_ACCOUNTS, 0);
          const claimedAmount = this.SHGsClaimed.reduce((sum: number, record: any) => sum + record.SLAB1_CA + record.SLAB2_CA, 0)
          this.barChartSHGs[0].value = shgsclaimed?.toLocaleString('en-IN');
          this.barChartSHGs[1].value = claimedAmount 
          console.log(shgsclaimed);          
          console.log(claimedAmount);
          
          this.SHGsApproved = this.dashboardData?.filter((submitted: any) => submitted.SUBMITTED_STATUS === 'Approved');
          console.log(this.SHGsApproved);          
          const shgsApproved = this.SHGsApproved.reduce((sum: number, record: any) => sum + record.SLAB1_ACCOUNTS, 0);
          const approvedAmount = this.SHGsApproved.reduce((sum: number, record: any) => sum + record.SLAB1_CA + record.SLAB2_CA, 0)
          this.barChartSHGs[2].value = shgsApproved?.toLocaleString('en-IN');
          this.barChartSHGs[3].value = approvedAmount 
          console.log(shgsApproved);          
          console.log(approvedAmount);

        },
        (err) => {
          this.handleApiError(err);
        }
      );
  }

  getFyYear() {
    this.entityService.getfyYearforpopup().subscribe(
      (res: any) => {
        console.log(res.data);
        if (res?.data.length === 1) {
          this.selectedFyYear = res?.data[0];
          this.fyYear = res?.data;
        } else {
          this.fyYear = res?.data;
        }
      },
      (err) => {
        this.handleApiError(err);
      }
    );
  }

  clearAll() {
    this.selectedBankType = null;
    this.selectedRegion = null;
  }

  handleApiError(err: any) {
    this.spinner.hide();
    if (err.status === 401) {
      sessionStorage.setItem('RateAllowedPopup', err.error.message);
      sessionStorage.setItem('PopupMaitainance', 'LogoutError');
    } else {
      sessionStorage.setItem('RateAllowedPopup', err.error.error);
      sessionStorage.setItem('PopupMaitainance', 'NrlmUpload');
    }
    this.errordialog?.openDialog();
  }
}
