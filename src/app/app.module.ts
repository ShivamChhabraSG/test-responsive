import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { SelectRolesPopupComponent } from './select-roles-popup/select-roles-popup.component';
import { MatSelectModule } from '@angular/material/select';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { SidenavBarComponent } from './sidenav-bar/sidenav-bar.component';
import { DashboardScreenComponent } from './dashboard-screen/dashboard-screen.component';
import { NRLMFooterComponent } from './nrlm-footer/nrlm-footer.component';
// import { NgxSpinnerModule } from 'ngx-spinner';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import { HTTP_INTERCEPTORS, HttpClientModule,HttpClient } from '@angular/common/http';
import { NgOtpInputModule } from 'ng-otp-input';
import { EntityScreenComponent } from './entity-screen/entity-screen.component';
import { AgGridModule } from 'ag-grid-angular';
import { IconArrowComponent } from './icon-arrow/icon-arrow.component';
import { AlertScreenComponent } from './alert-screen/alert-screen.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AuthInterceptor } from './AuthInterceptor';
import { AddEntityComponent } from './add-entity/add-entity.component';
import { LogoutScreenComponent } from './logout-screen/logout-screen.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';

import { MasterDataScreenComponent } from './master-data-screen/master-data-screen.component';
import { InterestRateScreenComponent } from './interest-rate-screen/interest-rate-screen.component';
import { ViewEntityScreenComponent } from './view-entity-screen/view-entity-screen.component';
import { WarningPopupComponent } from './warning-popup/warning-popup.component';

import { UserDataComponent } from './user-data/user-data.component';
import { AddUserDataComponent } from './add-user-data/add-user-data.component';
import { RolesViewScreenComponent } from './roles-view-screen/roles-view-screen.component';
import { ViewAddUserScreenComponent } from './view-add-user-screen/view-add-user-screen.component';
import { AddRateComponent } from './add-rate/add-rate.component';
import { UploadPopupComponent } from './upload-popup/upload-popup.component';
import { EntityUploadComponent } from './entity-upload/entity-upload.component';
import { ViewRateComponent } from './view-rate/view-rate.component';
import { UserUploadComponent } from './user-upload/user-upload.component';
import { NrlmDataUploadComponent } from './nrlm-data-upload/nrlm-data-upload.component';
import { NrlmUploadScreenComponent } from './nrlm-upload-screen/nrlm-upload-screen.component';
import { ViewUploadFilesEntityComponent } from './view-upload-files-entity/view-upload-files-entity.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ViewNrlmUploadComponent } from './view-nrlm-upload/view-nrlm-upload.component';
import { DatePipe } from '@angular/common';
import { ViewAccountsUploadComponent } from './view-accounts-upload/view-accounts-upload.component';
import { NrlmUploadViewScreenComponent } from './nrlm-upload-view-screen/nrlm-upload-view-screen.component';
import { ClaimsDataComponent } from './claims-data/claims-data.component';
import { AccountsUploadComponent } from './accounts-upload/accounts-upload.component';
import { ClosedAccountDataComponent } from './closed-account-data/closed-account-data.component';
import { VeiwClosedAccountsComponent } from './veiw-closed-accounts/veiw-closed-accounts.component';
import { ClaimsProcessingScreenComponent } from './claims-processing-screen/claims-processing-screen.component';
import { AddClaimsProcessingComponent } from './add-claims-processing/add-claims-processing.component';
import { ClaimsUploadComponent } from './claims-upload/claims-upload.component';
import { ClaimsViewComponent } from './claims-view/claims-view.component';
import { ClaimsUploadViewScreenComponent } from './claims-upload-view-screen/claims-upload-view-screen.component';
import { ClaimsSettlementComponent } from './claims-settlement/claims-settlement.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateLoader,TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorPopupComponent } from './error-popup/error-popup.component';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';
import { WarningLogDialogComponent } from './warning-log-dialog/warning-log-dialog.component';
import { WarningAuthDialogComponent } from './warning-auth-dialog/warning-auth-dialog.component';
import { UploadStatusDialogComponent } from './upload-status-dialog/upload-status-dialog.component';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { NumberFormatPipe } from './number-format.pipe';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { LogoutDialogComponent } from './logout-dialog/logout-dialog.component';
import { RecaptchaModule, RecaptchaFormsModule,RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY  } from 'ng-recaptcha';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { environment } from 'src/environments/environment';
import { NgChartsModule } from 'ng2-charts';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPopupComponent,
    SelectRolesPopupComponent,
    ForgotPasswordComponent,
    DashboardHeaderComponent,
    SidenavBarComponent,
    DashboardScreenComponent,
    UserDataComponent,
    NRLMFooterComponent,
      EntityScreenComponent,
      IconArrowComponent,
      AlertScreenComponent,
      AddEntityComponent,
      LogoutScreenComponent,
      MasterDataScreenComponent,
      InterestRateScreenComponent,
      ViewEntityScreenComponent,
      WarningPopupComponent,
      AddUserDataComponent,
      RolesViewScreenComponent,
      ViewAddUserScreenComponent,
      AddRateComponent,
      UploadPopupComponent,
      EntityUploadComponent,
      ViewRateComponent,
      UserUploadComponent,
      NrlmDataUploadComponent,
      NrlmUploadScreenComponent,
      ViewUploadFilesEntityComponent,
      ViewNrlmUploadComponent,
      ViewAccountsUploadComponent,
      NrlmUploadViewScreenComponent,
      ClaimsDataComponent,
      AccountsUploadComponent,
      ClosedAccountDataComponent,
      VeiwClosedAccountsComponent,
      ClaimsProcessingScreenComponent,
      AddClaimsProcessingComponent,
      ClaimsUploadComponent,
      ClaimsViewComponent,
      ClaimsUploadViewScreenComponent,
      ClaimsSettlementComponent,
      ErrorPopupComponent,
      WarningDialogComponent,
      WarningLogDialogComponent,
      WarningAuthDialogComponent,
      UploadStatusDialogComponent,
      ErrorDialogComponent,
      NumberFormatPipe,
      SuccessDialogComponent,
      LogoutDialogComponent
  ],
  imports: [
    NgxSpinnerModule,
          BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatDialogModule,
    MatSelectModule,
    NgSelectModule,
    FormsModule,
    MatDividerModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    NgbOffcanvasModule,
    MatExpansionModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaV3Module,
    NgxCaptchaModule,
    TranslateModule.forRoot({
loader: {
  provide:TranslateLoader,
  useFactory: httpTranslateLoader ,
  deps:[HttpClient]
}
    }),
    NgOtpInputModule,
    MatFormFieldModule,
    MatTabsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    AgGridModule,
    MatTooltipModule,
    OverlayModule,
    DatePipe,
    MatDatepickerModule,
    NgIdleKeepaliveModule.forRoot(),
    NgChartsModule,
    MatMenuModule
    
  ],
  providers: [   {
    provide: RECAPTCHA_V3_SITE_KEY,
    useValue: environment.reCaptchaSiteKey, // Replace with your actual site key
  }, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true,
   },DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
export function httpTranslateLoader(http:HttpClient) {
  return new TranslateHttpLoader(http);
}