import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { DashboardHeaderComponent } from './dashboard-header/dashboard-header.component';
import { DashboardScreenComponent } from './dashboard-screen/dashboard-screen.component';
import { SelectRolesPopupComponent } from './select-roles-popup/select-roles-popup.component';
import { EntityScreenComponent } from './entity-screen/entity-screen.component';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { AddEntityComponent } from './add-entity/add-entity.component';
import { LogoutScreenComponent } from './logout-screen/logout-screen.component';
import { InterestRateScreenComponent } from './interest-rate-screen/interest-rate-screen.component';
import { MasterDataScreenComponent } from './master-data-screen/master-data-screen.component';
import {ViewEntityScreenComponent } from './view-entity-screen/view-entity-screen.component';
import { UserDataComponent } from './user-data/user-data.component';
import { AddUserDataComponent } from './add-user-data/add-user-data.component';
import { RolesViewScreenComponent } from './roles-view-screen/roles-view-screen.component';
import { ViewAddUserScreenComponent } from './view-add-user-screen/view-add-user-screen.component';
import { AddRateComponent } from './add-rate/add-rate.component';
import { EntityUploadComponent } from './entity-upload/entity-upload.component';
import { ViewRateComponent } from './view-rate/view-rate.component';
import { UserUploadComponent } from './user-upload/user-upload.component';
import { NrlmDataUploadComponent } from './nrlm-data-upload/nrlm-data-upload.component';
import { NrlmUploadScreenComponent } from './nrlm-upload-screen/nrlm-upload-screen.component';
import { ViewUploadFilesEntityComponent } from './view-upload-files-entity/view-upload-files-entity.component';
import { ViewNrlmUploadComponent } from './view-nrlm-upload/view-nrlm-upload.component';
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
import { AuthGuard } from './auth.guard';
import { ClaimsSettlementComponent } from './claims-settlement/claims-settlement.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo:'home' },
  {
    path: 'home',
    component: HomePageComponent
  },
  {path: 'dashboard-screen', component: DashboardScreenComponent ,canActivate: [AuthGuard]
},
{ path: 'entity-screen', component: EntityScreenComponent,canActivate: [AuthGuard]
},
{ path: 'login-screen', component: LoginPopupComponent,canActivate: [AuthGuard]
},
{ path: 'add-entity', component: AddEntityComponent,canActivate: [AuthGuard]
},
{ path: 'logout', component: LogoutScreenComponent,canActivate: [AuthGuard]
},
{ path: 'interest-rate-screen', component: InterestRateScreenComponent,canActivate: [AuthGuard]
},
{ path: 'master-data-screen', component: MasterDataScreenComponent,canActivate: [AuthGuard]
},
{ path: 'view-entity-screen', component: ViewEntityScreenComponent,canActivate: [AuthGuard]
},

{ path: 'user-data', component: UserDataComponent,canActivate: [AuthGuard]
},
{ path: 'add-user-data', component: AddUserDataComponent,canActivate: [AuthGuard]
},
{ path:'roles-view', component: RolesViewScreenComponent,canActivate: [AuthGuard]
},
{ path:'view-add-screen', component: ViewAddUserScreenComponent,canActivate: [AuthGuard]
},
{ path:'add-rate', component: AddRateComponent,canActivate: [AuthGuard]
},
{ path:'entity-upload-screen', component: EntityUploadComponent,canActivate: [AuthGuard]},

{ path:'view-rate-screen', component: ViewRateComponent,canActivate: [AuthGuard]
},
{ path:'user-upload', component: UserUploadComponent,canActivate: [AuthGuard]
},
{ path:'nrlm-data-upload', component: NrlmDataUploadComponent,canActivate: [AuthGuard]
},
{ path:'nrlm-upload-screen', component: NrlmUploadScreenComponent,canActivate: [AuthGuard]
},

{ path:'entity-upload-view', component: ViewUploadFilesEntityComponent,canActivate: [AuthGuard]},
{ path:'view-nrlm-upload', component: ViewNrlmUploadComponent,canActivate: [AuthGuard]
},
{ path:'accounts-data-upload', component: AccountsUploadComponent,canActivate: [AuthGuard]
},
{ path:'closed-account-data', component: ClosedAccountDataComponent,canActivate: [AuthGuard]
},
{ path:'view-accounts-upload', component: ViewAccountsUploadComponent,canActivate: [AuthGuard]
},

{
  path:'nrlm-upload-view-screen',component:NrlmUploadViewScreenComponent,canActivate: [AuthGuard]
},
{
  path:'claims-data',component:ClaimsDataComponent,canActivate: [AuthGuard]
},
{
  path:'view-accounts-closed',component:VeiwClosedAccountsComponent,canActivate: [AuthGuard]
},
{
  path: 'claims-processing-screen', component:ClaimsProcessingScreenComponent,canActivate: [AuthGuard]
},
{
  path: 'add-claims-processing', component: AddClaimsProcessingComponent,canActivate: [AuthGuard]
},
{
  path:'claims-upload',component:ClaimsUploadComponent,canActivate: [AuthGuard]
},
{
  path:'view-claims',component:ClaimsViewComponent,canActivate: [AuthGuard]
},


{
  path:'main-view-claims',component:ClaimsUploadViewScreenComponent,canActivate: [AuthGuard]
},
{
  path:'claims-settlement',component:ClaimsSettlementComponent,canActivate: [AuthGuard]
}



];




@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
