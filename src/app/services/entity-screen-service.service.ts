import { Injectable , EventEmitter} from '@angular/core';
import { environment } from 'src/environments/environment';

import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, tap, throwError, zip } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntityScreenServiceService {
  dashboardUrl = environment.url;

  constructor(private http: HttpClient, private router: Router) { }

  ReloadGrid: EventEmitter<void> = new EventEmitter<void>();
  refresh(): void {
    this.ReloadGrid.emit();
  }

  rolesToken: any;
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const idToken = sessionStorage.getItem('UserToken');
    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + idToken),
      });

      return next.handle(cloned).pipe(
        tap(
          () => { },
          (err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status !== 401) {
                return;
              }
              this.router.navigate(['home']);
            }
          }
        )
      );
    } else {
      return next.handle(req);
    }
  }
  getLevels() {
    this.rolesToken = sessionStorage.getItem('UserToken');
   
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(this.dashboardUrl + `users/get_levels`, options);
  }
  
  getLevelss(currentStatus: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');

    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(
      this.dashboardUrl + `users/get_levels/${currentStatus}`,
      options
    );
  }
  getParentLevels(level: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(
      this.dashboardUrl + `entity/get_parent_units_by_level/${level}`,
      options
    );
  }
  // http://162.222.206.90:8081/api/entity/get_entities/3
  // /api/entity/get_entity_by_unitcode/895
  // getGridDataFromLevels(level: any) {
  //   this.rolesToken = sessionStorage.getItem('UserToken');
   
  //   let options = {
  //     headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  //   };
  //   const params = new HttpParams()
  //   .set('unitCode', level)
  //   return this.http.get(
  //     this.dashboardUrl + `entity/get_entities_info`,
  //     {...options,params:params}
  //   );
  // }
  getGridDataFromLevels(level: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
   
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    const params = new HttpParams()
    .set('level', level);
    return this.http.get(
      this.dashboardUrl + `entity/get_entities`,
      {...options,params:params}
    );
  }

  getEntityDataByUnitCode(unitCode: any){
    const direction = 'L';
    this.rolesToken = sessionStorage.getItem('UserToken');
   
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    const params = new HttpParams()
    .set('unitCode', unitCode)
    .set('direction', direction)
    return this.http.get(
      this.dashboardUrl + `entity/get_entities_info` , 
      {...options,params:params}
    );
  }

  getGridDataFromUnits(unitCode: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
   
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    const params = new HttpParams()
    .set('unitCode', unitCode);
    return this.http.get(
      this.dashboardUrl + `entity/get_child_entities_for_unitcode/${unitCode}` , options
      // {...options,params:params}
    );
  }
  getOnloadGridDataFromLevels(direction:any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
   
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    const params = new HttpParams()
    .set('direction', direction);
    return this.http.get(
      this.dashboardUrl + `entity/get_entities_info`,
      {...options,params:params}
    );
  }
  getView(data:any){

    this.rolesToken = sessionStorage.getItem('UserToken');
  
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.post(this.dashboardUrl + 'shgfileupload/view_file/'+data.uploadShgCodesDataStatusId, options);
    
  }
  getViewforview(closedDataStatusId:any){

    this.rolesToken = sessionStorage.getItem('UserToken');

    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.post(this.dashboardUrl + 'closedaccountfileupload/view_file/'+closedDataStatusId, options);
    
  }

  getuserdata(){
    this.rolesToken = sessionStorage.getItem('UserToken');
  
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(
      this.dashboardUrl + `userfileupload/get_uploaded_files`,
      options
    );
  }


  getUserTables(level:any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
  
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    const params = new HttpParams()
    .set('level', level)
    return this.http.get(this.dashboardUrl + `users/get_users`, {...options,params:params});
  }

  // getRoles
  getRoles() {
    this.rolesToken = sessionStorage.getItem('UserToken');
  
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(this.dashboardUrl + 'roles', options);
  }

  // getrates
  getRates(bankCode:any,fyStart:any,fyEnd:any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(`${this.dashboardUrl}rates/get_rate_info/${fyStart}/${fyEnd}?unitCode=${bankCode}`, options);
  }

  //getrateType
  getrateType() {
    this.rolesToken = sessionStorage.getItem('UserToken');
     let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(this.dashboardUrl + 'rates/get_ratetypes', options);
  }

  // getEntity status
  GetEntityStatus(param1: boolean) {
    this.rolesToken = sessionStorage.getItem('UserToken');
   
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(
      this.dashboardUrl + `entity/get_entity_status/${param1}`,
      options
    );
  }

  // entity/get_authorized_visible_entities

  getAuthorizedEntities() {
    this.rolesToken = sessionStorage.getItem('UserToken');
    
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(
      this.dashboardUrl + 'entity/get_authorized_visible_entities/3',
      options
    );
  }

  // add Rate
  addRate(data: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.post(this.dashboardUrl + 'rates/add_rate', data, options);
  }
  // edit rate
  editRate(unitCode: any, status: any, rateType: any, effectiveDate: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
  
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(`${this.dashboardUrl}rates/get_rate/${unitCode}/${status}/${rateType}/${effectiveDate}`, options);
  }

  // post-edit-rate
  saveeditRate(unitCode: any, status: any, rateType: any, effectiveDate: any, body: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
   
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.post(`${this.dashboardUrl}rates/edit_rate/${unitCode}/${status}/${rateType}/${effectiveDate}`, body, options);
  }

  uploadEntityData(parentUnit: string, level: string, formData: FormData): Observable<any> {
    const rolesToken = sessionStorage.getItem('UserToken');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + rolesToken
    });
  
    return this.http.post<any>(`${this.dashboardUrl}entityfileupload/upload_file/${parentUnit}/${level}`, formData, { headers });
  }

  uploaduserData(formData: FormData): Observable<any> {
    const rolesToken = sessionStorage.getItem('UserToken');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + rolesToken
    });
  
    return this.http.post<any>(`${this.dashboardUrl}userfileupload/upload_file`, formData, { headers });
  }
  
  uploadNrlmData(parentUnit: string, year: string, qtr:any, formData: FormData): Observable<any> {
    const rolesToken = sessionStorage.getItem('UserToken');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + rolesToken
    });
  
    return this.http.post<any>(`${this.dashboardUrl}shgfileupload/upload_file/${parentUnit}/${year}/${qtr}`, formData, { headers });
  }
  uploadAccountsData(parentUnit: string, year: string, qtr:any, formData: FormData): Observable<any> {
    const rolesToken = sessionStorage.getItem('UserToken');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + rolesToken
    });
  
    return this.http.post<any>(`${this.dashboardUrl}accountfileupload/upload_file/${parentUnit}/${year}/${qtr}`, formData, { headers });
  }


  uploadclosedAccounts(parentUnit: string, year: string, qtr:any, formData: FormData): Observable<any> {
    const rolesToken = sessionStorage.getItem('UserToken');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + rolesToken
    });
  
    return this.http.post<any>(`${this.dashboardUrl}closedaccountfileupload/upload_file/${parentUnit}/${year}/${qtr}`, formData, { headers });
  }

//Upload CLaims with selected bank
  uploadclaimedAccounts(parentUnit: string, year: string, qtr:any, formData: FormData): Observable<any> {
    const rolesToken = sessionStorage.getItem('UserToken');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + rolesToken
    });
  
    return this.http.post<any>(`${this.dashboardUrl}claimsfileupload/upload_file/${parentUnit}/${year}/${qtr}`, formData, { headers });
  }
  //UPload Claims with All Bankss

  // uploadEntityData(parentUnit: any, level: any, body: any) {
  //   this.rolesToken = sessionStorage.getItem('UserToken');
  //   let options = {
  //     headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  //   };
  //   return this.http.post(`${this.dashboardUrl}entityfileupload/upload_file/${parentUnit}/${level}`, body, options);
  // }

  // post-delete-rate
  DeleteRate(unitCode: any, effectiveDate: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
   

    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };

    return this.http.post(
      `${this.dashboardUrl}rates/delete_rate/${unitCode}/${effectiveDate}`,
      options
    );
  }
  //DeleteNRLM Upload
  DeleteuploadNrlm(uploadShg: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };

    return this.http.post(
      `${this.dashboardUrl}shgfileupload/delete_file/${uploadShg}`,
      options
    );
  }
// DeleteAccountsUpload
DeleteuploadAccounts(uploadShg: any) {
  this.rolesToken = sessionStorage.getItem('UserToken');


  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };

  return this.http.post(
    `${this.dashboardUrl}accountfileupload/delete_file/${uploadShg}`,
    options
  );
}
//DeleteClosedAccount

DeleteCloseduploadAccounts(uploadClosed: any) {
  this.rolesToken = sessionStorage.getItem('UserToken');
 

  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };

  return this.http.post(
    `${this.dashboardUrl}closedaccountfileupload/delete_file/${uploadClosed}`,
    options
  );
}
//DeleteClaimsUpload

DeleteClaimsUpload(uploadClosed: any) {
  this.rolesToken = sessionStorage.getItem('UserToken');


  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };

  return this.http.post(
    `${this.dashboardUrl}claimsfileupload/delete_file/${uploadClosed}`,
    options
  );
}
  // Update status Authorized
  UpdateRate(body: any) {
    this.rolesToken = sessionStorage.getItem('UserToken'); 
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.post(`${this.dashboardUrl}rates/update_status`, body, options);
  }

  // get user token details
  getTokenDetails() {
    this.rolesToken = sessionStorage.getItem('UserToken'); 
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(`${this.dashboardUrl}users/get_token_details`, options)
  }

  getUploadFiles() {
    this.rolesToken = sessionStorage.getItem('UserToken');
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(`${this.dashboardUrl}entityfileupload/get_uploaded_files`, options)
  }
  getAddRateEnable(operation:any,unitCode:any,qtrEnding:any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    let options = {
      headers: new HttpHeaders({Authorization: 'Bearer' + this.rolesToken})
    }
    return this.http.get(`${this.dashboardUrl}rates/isAddEditDeleteAllowedForRate?operation=${operation}&unitCode=${unitCode}&qtrEndDate=${qtrEnding}`)
  }

  //Delete Uploaded File
  // DeleteUploadedFile(ParentUnit: any, Level: any, status: any) {
  //   this.rolesToken = sessionStorage.getItem('UserToken');
  //   let options = {
  //     headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  //   };
  //   return this.http.post(`${this.dashboardUrl}entityfileupload/delete_file/${ParentUnit}/${Level}/${status}`,
  //     options
  //   );
  // }
  // Download Entity file
  downloadEntityDetails(EntityStatusId: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
  
    const headers = new Headers({
      // 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.rolesToken
    });
  
    const options: RequestInit = {
      method: 'POST',
      headers: headers,
      mode: 'cors', 
      cache: 'no-cache' as RequestCache,
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    };
  
    return fetch(`${this.dashboardUrl}entityfileupload/download_file/${EntityStatusId}`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blobData => {
        console.log(blobData);
        return blobData
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  

  // Download Userdownload file
  downloadUserDetails(EntityStatusId: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
  
    const headers = new Headers({
      // 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.rolesToken
    });
  
    const options: RequestInit = {
      method: 'POST',
      headers: headers,
      mode: 'cors', 
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    };
  
    return fetch(`${this.dashboardUrl}userfileupload/download_file/${EntityStatusId}`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }return response.blob();
      })
      .then(blobData => {
        console.log(blobData);
        return blobData
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
      
  // Entity Change Status
  changeStatus(parentUnitCode:any,level:any,isAuthorize:any,remarks:any){
    this.rolesToken = sessionStorage.getItem('UserToken'); 
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken})
    };
    const url = `${this.dashboardUrl}entityfileupload/change_status/${parentUnitCode}/${level}/${isAuthorize}`;
    const params = new HttpParams().set('remarks', remarks);
    return this.http.post(url, null, { ...options, params: params })
  }

  //User file Authorized/rejected status
  UserfileChangeStatus(isAuthorize:any,remarks:any){
    this.rolesToken = sessionStorage.getItem('UserToken'); 
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    const params = new HttpParams().set('remarks', remarks);
    return this.http.post(`${this.dashboardUrl}userfileupload/update_status/${isAuthorize}`, null, { ...options, params: params })
  }

  //21421 sgh file upload controllerT
  // getUnits_info
  getUnitsInfo(){
    this.rolesToken = sessionStorage.getItem('UserToken');
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(`${this.dashboardUrl}shgfileupload/get_units_info`,options)
  }
  // addRateData(data:any){
  //   this.rolesToken = sessionStorage.getItem('UserToken');
  //   let options = {
  //     headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  //   };
  //   const params = new HttpParams().set('Data', data);
  //   return this.http.get(`${this.dashboardUrl}rates/add_rate`,{ ...options, params: params })
  // }
  addRateData(data: any): Observable<any> {
    this.rolesToken = sessionStorage.getItem('UserToken');
    
    let options = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.rolesToken }),
    };

    return this.http.post(`${this.dashboardUrl}rates/add_rate`, data, options);
  }
  editRateData(unitCode:any,status:any,effectiveDate:any,data: any): Observable<any> {
    this.rolesToken = sessionStorage.getItem('UserToken');
    
    let options = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.rolesToken }),
    };

    return this.http.post(`${this.dashboardUrl}rates/edit_rate/${unitCode}/${status}/${effectiveDate}`, data, options);
  }
    // getClaimsDropDown_info
    getClaimsDropDownInfo(level:any){
      this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
      };
      const params = new HttpParams()
      .set('level', level)
      return this.http.get(`${this.dashboardUrl}common_utils/getunitsbylevelorcode`,{...options,params})
    }
    getBankDropDownInfo(parentlevel:any){
      this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
      };
      return this.http.get(`${this.dashboardUrl}common_utils/getunitsbylevelorcode?parentUntiCode=${parentlevel}`,options)
    }
    // getClaimsProcessData()
    getClaimsProcessData(fyEnding:any,qtrEnding:any,cProLeLevel:any){
      this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
      };
      const params = new HttpParams()
      .set('fyStart',qtrEnding)
      .set('fyEnd', fyEnding)
      return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_settlement`,{...options,params})
    }
    getClaimsProcessingInfo(fyEnding:any,qtrEnding:any,cProLeLevel:any){
      this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
      };
      const params = new HttpParams()
      .set('fyEnding', fyEnding)
      .set('qtrEnding', qtrEnding)
      return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_processing_info`,{...options,params})
    }

    getClaimsProcessDataWithUnitCode(unitCode:any,fyEnding:any,qtrEnding:any,cProLeLevel:any){
      this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
      };
      const params = new HttpParams()
      .set('bankCode', unitCode)
      .set('fyStart', qtrEnding)
      .set('fyEnd', fyEnding)
      return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_settlement`,{...options,params})
    }
    getClaimsProcessingInfoWithUnitCode(unitCode:any,fyEnding:any,qtrEnding:any,cProLeLevel:any){
      this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
      };
      const params = new HttpParams()
      .set('unitCode', unitCode)
      .set('fyEnding', fyEnding)
      .set('qtrEnding', qtrEnding)
      return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_processing_info`,{...options,params})
    }
    getClaimsProcessDataWithParentUnitCode(parentUnitCode:any,fyEnding:any,qtrEnding:any,cProLeLevel:any){
      this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
      };
      const params = new HttpParams()
      .set('fyEnding', fyEnding)
      .set('qtrEnding', qtrEnding)
      .set('parentUnitCode', parentUnitCode)
      return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_settlement`,{...options,params})
    }
    getClaimsProcessingInfoWithParentUnitCode(parentUnitCode:any,fyEnding:any,qtrEnding:any,cProLeLevel:any){
      this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
      };
      const params = new HttpParams()
      .set('parentUnitCode', parentUnitCode)
      .set('fyEnding', fyEnding)
      .set('qtrEnding', qtrEnding)
      return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_processing_info`,{...options,params})
    }
    getClaimsProcessDataWithUnitCodeNdparentUnit(parentUnitCode:any,unitCode:any,fyEnding:any,qtrEnding:any,cProLeLevel:any){
      this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
      };
      const params = new HttpParams()
      .set('bankCode',unitCode)
      .set('fyStart', qtrEnding)
      .set('fyEnd', fyEnding)
      .set('parentUnitCode', parentUnitCode)
      return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_settlement`,{...options,params})
    }
    getClaimsProcessingInfoWithUnitCodeNdparentUnit(parentUnitCode:any,unitCode:any,fyEnding:any,qtrEnding:any,cProLeLevel:any){
      this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
      };
      const params = new HttpParams()
      .set('unitCode', unitCode)
      .set('parentUnitCode', parentUnitCode)
      .set('fyEnding', fyEnding)
      .set('qtrEnding', qtrEnding)
      return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_processing_info`,{...options,params})
    }
//getClaimsInfo
getClaimsUnitsInfo(){
  this.rolesToken = sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  return this.http.get(`${this.dashboardUrl}claims/get_claims_info`,options)
}


//getAccountsUnitInfo
getAccountsUnitsInfo(){
  this.rolesToken = sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  return this.http.get(`${this.dashboardUrl}accountfileupload/get_units_info`,options)
}
  // getSgh Codes
  getShgCodes(){
    this.rolesToken = sessionStorage.getItem('UserToken');
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(`${this.dashboardUrl}shgcodes/get_shg_codes`,options)
  }  

//getAccountUpload Code
getAccountUpload(){
  this.rolesToken = sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  return this.http.get(`${this.dashboardUrl}accounts/get_accounts_info`,options)
}  
// getfinStartYear(){
//   this.rolesToken = sessionStorage.getItem('UserToken');
//   let options = {
//     headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
//   };
//   return this.http.get(`${this.dashboardUrl}accounts/get_accounts_info`,options)
// }  
getfinStartYear(){
  this.rolesToken = sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  return this.http.get(`${this.dashboardUrl}common_utils/getFYStarting`,options)
}


getFinalYear(date:any){
  this.rolesToken = sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  return this.http.get(`${this.dashboardUrl}common_utils/getFYEndings?fySelected=${date}`,options)
}

  getqtrEnding(){
    this.rolesToken = sessionStorage.getItem('UserToken');
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(`${this.dashboardUrl}shgfileupload/get_fy_year`,options)
  }

// getUploaded files
  getUploadedFiles(bankCode: any, fystart: any, fyend: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    const params = new HttpParams()
      .set('bankCode', bankCode)
      .set('qtrStart', fystart)
      .set('qtrEnd', fyend);
    return this.http.get(`${this.dashboardUrl}shgfileupload/get_uploaded_files`, {... options, params:params });
  }
  //get uploadDataWithAllBanks
  getAllBanksUploadedFiles(fystart: any, fyend: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    const params = new HttpParams()
      .set('qtrStart', fystart)
      .set('qtrEnd', fyend);
    return this.http.get(`${this.dashboardUrl}shgfileupload/get_uploaded_files`, {... options, params:params });
  }
  //getAccountsUploadedFile
  getAccountsUploadedFilesAfterSubmit(bankCode: any, fystart: any, fyend: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    const params = new HttpParams()
      .set('bankCode', bankCode)
      .set('qtrStart', fystart)
      .set('qtrEnd', fyend);
    return this.http.get(`${this.dashboardUrl}accountfileupload/get_uploaded_files`, {... options, params:params });
  }
    //getAccountsUploadedFile
    getAccountsUploadedFilesAllBanks(fystart: any, fyend: any) {
      this.rolesToken = sessionStorage.getItem('UserToken');
      const options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
      };
      const params = new HttpParams()
        .set('qtrStart', fystart)
        .set('qtrEnd', fyend);
      return this.http.get(`${this.dashboardUrl}accountfileupload/get_uploaded_files`, {... options, params:params });
    }
  // getGridUploaded files
  getGridUploadedFiles() {
    this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    return this.http.get(`${this.dashboardUrl}shgfileupload/get_uploaded_files`, {... options});
  }
  //getAccountsUploadedFile
  getAccountsUploadedFiles() {
    this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    return this.http.get(`${this.dashboardUrl}accountfileupload/get_uploaded_files`, {... options});
  }

  getclosedaccountdetails(){
    this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    return this.http.get(`${this.dashboardUrl}closedaccountfileupload/get_uploaded_files`, {... options});
  }


  getclaimsaccountdetails(){
    this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    return this.http.get(`${this.dashboardUrl}claimsfileupload/get_uploaded_files`, {... options});
  }

    //getClaimsFileUploadBank
    getclaimsFiles(bankCode: any, fystart: any, fyend: any) {
      this.rolesToken = sessionStorage.getItem('UserToken');
      const options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
      };
      const params = new HttpParams()
        .set('bankCode', bankCode)
        .set('qtrStart', fystart)
        .set('qtrEnd', fyend);
      return this.http.get(`${this.dashboardUrl}claimsfileupload/get_uploaded_files`, {... options, params:params });
    }
   //getClaimsFileUploadWithAllBank
   getAllclaimsFiles(fystart: any, fyend: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    const params = new HttpParams()
      .set('qtrStart', fystart)
      .set('qtrEnd', fyend);
    return this.http.get(`${this.dashboardUrl}claimsfileupload/get_uploaded_files`, {... options, params:params });
  }
    //getClosedAccountListWithAllBank
  getclosedFilesWithAllBanks(fystart: any, fyend: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    const params = new HttpParams()
      .set('qtrStart', fystart)
      .set('qtrEnd', fyend);
    return this.http.get(`${this.dashboardUrl}closedaccountfileupload/get_uploaded_files`, {... options, params:params });
  }
  //getClosedFileUploadBank
  getclosedFiles(bankCode: any, fystart: any, fyend: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    const params = new HttpParams()
      .set('bankCode', bankCode)
      .set('qtrStart', fystart)
      .set('qtrEnd', fyend);
    return this.http.get(`${this.dashboardUrl}closedaccountfileupload/get_uploaded_files`, {... options, params:params });
  }

  getclaimsfiles(fystart: any, fyend: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    const params = new HttpParams()
      .set('qtrStart', fystart)
      .set('qtrEnd', fyend);
    return this.http.get(`${this.dashboardUrl}claimsfileupload/get_uploaded_files?bankCode`, {... options, params:params });
  }
// getsgcodes by fystart and fyend
getShgCodesByYear(bankCode: any, qtrstart: any, qtrend: any){
  this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    const params = new HttpParams()
      .set('bankCode', bankCode)
      .set('qtrStart', qtrstart)
      .set('qtrEnd', qtrend);
      return this.http.get(`${this.dashboardUrl}shgcodes/get_shg_codes_by_fystart_fyend`, {... options, params:params });
    }
    // getClaimsUpload by fystart and fyend and Bank 
getClaimsUploadByYear(bankCode: any, qtrstart: any, qtrend: any){
  this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    const params = new HttpParams()
      .set('bankCode', bankCode)
      .set('qtrStart', qtrstart)
      .set('qtrEnd', qtrend);
      return this.http.get(`${this.dashboardUrl}claims/get_claims_info`, {... options, params:params });
    }
    //get AllClosed AccountCodes with selected bank
    getAllClosedAccountCodesByBankYear(bankCode: any, qtrstart: any, qtrend: any){
      this.rolesToken = sessionStorage.getItem('UserToken');
        const options = {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
        };
        const params = new HttpParams()
          .set('bankCode', bankCode)
          .set('qtrStart', qtrstart)
          .set('qtrEnd', qtrend);
          return this.http.get(`${this.dashboardUrl}closedaccounts/get_closed_accounts_info`, {... options, params:params });
        }
    //getShgCodesWithAllYear
    getAllShgCodesByYear(qtrstart: any, qtrend: any){
      this.rolesToken = sessionStorage.getItem('UserToken');
        const options = {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
        };
        const params = new HttpParams()
          .set('qtrStart', qtrstart)
          .set('qtrEnd', qtrend);
          return this.http.get(`${this.dashboardUrl}shgcodes/get_shg_codes_by_fystart_fyend`, {... options, params:params });
        }
        getAllClaimsUploadByYear(qtrstart: any, qtrend: any){
          this.rolesToken = sessionStorage.getItem('UserToken');
            const options = {
              headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
            };
            const params = new HttpParams()
              .set('qtrStart', qtrstart)
              .set('qtrEnd', qtrend);
              return this.http.get(`${this.dashboardUrl}claims/get_claims_info`, {... options, params:params });
            }
        //getAllAccountsCodeByYear
        getAllAccountsCodeByYear(qtrstart: any, qtrend: any){
          this.rolesToken = sessionStorage.getItem('UserToken');
            const options = {
              headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
            };
            const params = new HttpParams()
              .set('qtrStart', qtrstart)
              .set('qtrEnd', qtrend);
              return this.http.get(`${this.dashboardUrl}closedaccounts/get_closed_accounts_info`, {... options, params:params });
            }
// geAccountsCode by fystart and fyend
getAccountsCodesByYear(bankCode: any, qtrstart: any, qtrend: any){
  this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    const params = new HttpParams()
      .set('bankCode', bankCode)
      .set('qtrStart', qtrstart)
      .set('qtrEnd', qtrend);
      return this.http.get(`${this.dashboardUrl}accounts/get_accounts_info`, {... options, params:params });
    }
// geAccountsCode with AllBanks by fystart and fyend
getAccountsCodesAllBanksByYear(qtrstart: any, qtrend: any){
  this.rolesToken = sessionStorage.getItem('UserToken');
    const options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
    };
    const params = new HttpParams()
      .set('qtrStart', qtrstart)
      .set('qtrEnd', qtrend);
      return this.http.get(`${this.dashboardUrl}accounts/get_accounts_info`, {... options, params:params });
    }

// download ShgCodes
downloadshgCodes(bankCode: any, fyEnd: any, qtrEnd: any, isView: any) {
  this.rolesToken = sessionStorage.getItem('UserToken');

  const headers = new Headers({
    Authorization: 'Bearer ' + this.rolesToken,
  });

  const params = new URLSearchParams();
  params.set('bankCode', bankCode);
  params.set('fyEnd', fyEnd);
  params.set('qtrEnd', qtrEnd);
  params.set('isView', isView);

  const options: RequestInit = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'no-cache' as RequestCache,
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  return fetch(`${this.dashboardUrl}shgcodes/download_shg_codes?${params.toString()}`, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blobData => {
      console.log(blobData);
      return blobData
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

//DownloadClosedAccountsData
// download ShgCodes
downloadClosedAccountsData(bankCode: any, fyEnd: any, qtrEnd: any, isView: any) {
  this.rolesToken = sessionStorage.getItem('UserToken');

  const headers = new Headers({
    Authorization: 'Bearer ' + this.rolesToken,
  });

  const params = new URLSearchParams();
  params.set('bankCode', bankCode);
  params.set('fyEnding', fyEnd);
  params.set('qtrEnding', qtrEnd);
  params.set('isView', isView);

  const options: RequestInit = {
    method: 'GET',
    headers: headers,
    mode: 'cors', 
    cache: 'no-cache' as RequestCache,
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  return fetch(`${this.dashboardUrl}closedaccounts/download_closed_accounts_info?${params.toString()}`, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blobData => {
      console.log(blobData);
      return blobData
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


//download Claims Upload Data
downloadClaimsUploadData(bankCode: any, fyEnd: any, qtrEnd: any, isView: any) {
  this.rolesToken = sessionStorage.getItem('UserToken');

  const headers = new Headers({
    Authorization: 'Bearer ' + this.rolesToken,
  });

  const params = new URLSearchParams();
  params.set('bankCode', bankCode);
  params.set('fyEnding', fyEnd);
  params.set('qtrEnding', qtrEnd);
  params.set('isView', isView);

  const options: RequestInit = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'no-cache' as RequestCache,
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  return fetch(`${this.dashboardUrl}claims/download_accounts_info?${params.toString()}`, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blobData => {
      console.log(blobData);
      return blobData
    })
    .catch(error => {
      console.error('Error:', error);
    });
}





    downloadAccounts(bankCode: any, fyEnd: any, qtrEnd: any, isView: any) {
      this.rolesToken = sessionStorage.getItem('UserToken');
    
      const headers = new Headers({
        Authorization: 'Bearer ' + this.rolesToken,
      });
    
      const params = new URLSearchParams();
      params.set('bankCode', bankCode);
      params.set('fyEnding', fyEnd);
      params.set('qtrEnding', qtrEnd);
      params.set('isView', isView);
    
      const options: RequestInit = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'no-cache' as RequestCache,
        credentials: 'same-origin',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      };
    
      return fetch(`${this.dashboardUrl}accounts/download_accounts_info?${params.toString()}`, options)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.blob();
        })
        .then(blobData => {
          console.log(blobData);
          return blobData
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
    


          viewaccountscreen(bankCode:any,fyENd:any,qtENd:any,view:any){
            this.rolesToken = sessionStorage.getItem('UserToken');
            let options = {
              headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
            };
            return this.http.get(`${this.dashboardUrl}accounts/download_accounts_info?bankCode=${bankCode}&fyEnding=${fyENd}&qtrEnding=${qtENd}&isView=true`,options)
          }


          
          viewaccountscreenclaimsdata(bankCode:any,fyENd:any,qtENd:any,view:any){
            this.rolesToken = sessionStorage.getItem('UserToken');
            let options = {
              headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
            };
            return this.http.get(`${this.dashboardUrl}claims/download_accounts_info?bankCode=${bankCode}&fyEnding=${fyENd}&qtrEnding=${qtENd}&isView=true`,options)
          }
          viewaccountsupload(accountDataStatusId:any){
            this.rolesToken = sessionStorage.getItem('UserToken');
            let options = {
              headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
            };
            return this.http.post(`${this.dashboardUrl}accountfileupload/view_file/${accountDataStatusId }`,options)
          }
          

          viewclaimsAccount(accountDataStatusId:any){
            this.rolesToken = sessionStorage.getItem('UserToken');
            let options = {
              headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
            };
            return this.http.post(`${this.dashboardUrl}claimsfileupload/view_file/${accountDataStatusId }`,options)
          }


      viewScreen(bankCode:any,fyENd:any,qtENd:any,view:any){
        this.rolesToken = sessionStorage.getItem('UserToken');
        let options = {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
        };
        return this.http.get(`${this.dashboardUrl}shgcodes/download_shg_codes?bankCode=${bankCode}&fyEnd=${fyENd}&qtrEnd=${qtENd}&isView=true`,options)
      }

      
      viewScreenclosed(bankCode:any,fyENd:any,qtENd:any,view:any){
        this.rolesToken = sessionStorage.getItem('UserToken');
        let options = {
          headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
        };
        return this.http.get(`${this.dashboardUrl}closedaccounts/download_closed_accounts_info?bankCode=${bankCode}&fyEnding=${fyENd}&qtrEnding=${qtENd}&isView=true`,options)
      }
  // Download Files NRLM
  shgdownloadfile(dataStatusId: any, isCSV: any) {
    this.rolesToken = sessionStorage.getItem('UserToken');
    const headers = new Headers({
      // 'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.rolesToken
    });
  
    const options: RequestInit = {
      method: 'POST',
      headers: headers,
      mode: 'cors', 
      cache: 'no-cache' as RequestCache,
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    };
  
    return fetch(`${this.dashboardUrl}shgfileupload/download_file/${dataStatusId}?isCSV=${isCSV}`, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blobData => {
        console.log(blobData);
        return blobData;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
// Download Files Accounts
accountdownloadfile(dataStatusId: any) {
  this.rolesToken = sessionStorage.getItem('UserToken');

  const headers = new Headers({
    // 'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.rolesToken
  });

  const options: RequestInit = {
    method: 'POST',
    headers: headers,
    mode: 'cors',
    cache: 'no-cache' as RequestCache,
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  return fetch(`${this.dashboardUrl}accountfileupload/download_file/${dataStatusId}`, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blobData => {
      console.log(blobData);
      return blobData;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


accountdownloadClose(dataStatusId: any) {
  this.rolesToken = sessionStorage.getItem('UserToken');

  const headers = new Headers({
    // 'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.rolesToken
  });

  const options: RequestInit = {
    method: 'POST',
    headers: headers,
    mode: 'cors', 
    cache: 'no-cache' as RequestCache,
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  return fetch(`${this.dashboardUrl}closedaccountfileupload/download_file/${dataStatusId}`, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blobData => {
      console.log(blobData);
      return blobData
    })
    .catch(error => {
      console.error('Error:', error);
    });
}


claimsAccountDownload(dataStatusId: any) {
  this.rolesToken = sessionStorage.getItem('UserToken');
  const headers = new Headers({
    // 'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + this.rolesToken
  });

  const options: RequestInit = {
    method: 'POST',
    headers: headers,
    mode: 'cors', 
    cache: 'no-cache' as RequestCache,
    credentials: 'same-origin',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  return fetch(`${this.dashboardUrl}claimsfileupload/download_file/${dataStatusId}`, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.blob();
    })
    .then(blobData => {
      console.log(blobData);
      return blobData;
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

  // Updatestatus isAuthorize
  Update_status(parentUnitcode:any,isAuthorize:any,remarks:any){
    this.rolesToken = sessionStorage.getItem('UserToken'); 
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    const params = new HttpParams().set('remarks', remarks)
    return this.http.post(`${this.dashboardUrl}shgfileupload/update_status/${parentUnitcode}/${isAuthorize}`, null, { ...options, params: params })
  }

// UpdateAccountsStatus
update_account_status(parentUnitcode:any,isAuthorize:any,remarks:any){
  this.rolesToken = sessionStorage.getItem('UserToken'); 
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  const params = new HttpParams().set('remarks', remarks)
  return this.http.post(`${this.dashboardUrl}accountfileupload/update_status/${parentUnitcode}/${isAuthorize}`, null, { ...options, params: params })
}
// UpdateClosedAccountsStatus
update_closed_account_status(parentUnitcode:any,isAuthorize:any,remarks:any){
  this.rolesToken = sessionStorage.getItem('UserToken'); 
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  const params = new HttpParams().set('remarks', remarks)
  .set('closedAccountStatusId', parentUnitcode)
  return this.http.post(`${this.dashboardUrl}closedaccountfileupload/update_status/${isAuthorize}`, null, { ...options, params: params })
}
// UpdateClaimsUploadStatus
update_claims_upload_status(parentUnitcode:any,isAuthorize:any,remarks:any){
  this.rolesToken = sessionStorage.getItem('UserToken'); 
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  const params = new HttpParams()
  .set('remarks', remarks)
  return this.http.post(`${this.dashboardUrl}claimsfileupload/update_status/${parentUnitcode}/${isAuthorize}`, null, { ...options, params: params })
}
    //Delete Uploaded File
    DeleteUploadedFile(entityDataStatusId: any) {
      this.rolesToken = sessionStorage.getItem('UserToken');
      let options = {
        headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
      };
      return this.http.post(`${this.dashboardUrl}entityfileupload/delete_file/${entityDataStatusId}`,
        options
      );
    }

        // Delete User Upload
  delete(entityDataStatusId:any){
    this.rolesToken = sessionStorage.getItem('UserToken');
  
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.post(
      this.dashboardUrl + `userfileupload/delete_file/${entityDataStatusId}`,
      options
    );
  }


  getfyYearforpopup(){
    this.rolesToken = sessionStorage.getItem('UserToken');
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(`${this.dashboardUrl}common_utils/getFYEndings`,options)
  }
  
  getQtYear(date:any){
    this.rolesToken = sessionStorage.getItem('UserToken');
    let options = {
      headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
    };
    return this.http.get(`${this.dashboardUrl}common_utils/getQtrEndings?fySelected=${date}`,options)
  }
  //Add Claims Processing

AddClaimsProcessing(bankCode:any,fyENd:any,qtENd:any){
  this.rolesToken = sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  return this.http.post(`${this.dashboardUrl}claims_processing/insert_claim_processing/${bankCode}/${fyENd}/${qtENd}`,options)
}
ClaimsSlabNdRate(effectiveDate:any){
  this.rolesToken = sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  return this.http.get(`${this.dashboardUrl}claims_processing/get_slabs_and_rate?effectiveDate=${effectiveDate}`,options)
}  
ClaimsRemarks(refId:any,status:any){
  this.rolesToken = sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_processing_remarks?refId=${refId}&status=${status}`,options)
}  
UpdateClaimsProcessing(refId:any,saveAction:any,u1:any,u2:any,u3:any,claimsAmnt1:any,claimsAmnt2:any){
  this.rolesToken = sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  return this.http.post(`${this.dashboardUrl}claims_processing/save_claims_processing?refId=${refId}&saveAction=${saveAction}&ui1=${u1}&ui2=${u2}&ui3=${u3}&cAmount1=${claimsAmnt1}&cAmount2=${claimsAmnt2}`,options)
}  
saveClaimsRemaks(Id:any,remarks:any,status:any){
  this.rolesToken = sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken }),
  };
  return this.http.post(`${this.dashboardUrl}claims_processing/update_claims_processing_remarks?Id=${Id}&remarks=${remarks}&status=${status}`,options)
}  
// claimsProcessAuthOrReject
claimsProcessAuthOrReject(refId:any,Status:any,) {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  return this.http.post(`${this.dashboardUrl}claims_processing/change_status/${refId}/${Status}`,options)
}

//get Document Type

getDocumentType() {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  return this.http.get(`${this.dashboardUrl}claims_processing/get_document_types`,options)
}
//upload Documents

// http://162.222.206.90:8081/api/claims_processing/update_claims_processing_documents?Id=1&docType=1&status=true

uploadDocumentType(refId:any, docType:any,Status:any,formdata: FormData): Observable<any>  {
  this.rolesToken=sessionStorage.getItem('UserToken');
  const headers = new HttpHeaders({
    'Authorization': 'Bearer ' + this.rolesToken
    // 'Content-Type': 'multipart/form-data'
  });

  return this.http.post(`${this.dashboardUrl}claims_processing/update_claims_processing_documents?Id=${refId}&docType=${docType}&status=${Status}`,formdata,{headers})
}
// claims_processing/get_claims_processing_documents?refId=1

// Get Claims Processing Document
getClaimsProcessingDocument(refId:any) {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_processing_documents?refId=${refId}`,options)
}
// Download Documents
// const params = new HttpParams()
// .set('bankCode', bankCode)
// .set('fyEnd', fyEnd)
// .set('qtrEnd', qtrEnd)
// .set('isView',isView)
// return this.http.get(`${this.dashboardUrl}shgcodes/download_shg_codes`, {... options,observe: 'response',responseType: 'blob' as 'json', params:params });
// }
getClaimsProcessingDownloadDocument(refId:any,sn:any) {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  const params =new HttpParams()
  .set('refId',refId)
  .set('sn',sn)
  return this.http.get(`${this.dashboardUrl}claims_processing/download_document`,{...options,observe: 'response',responseType: 'blob' as 'json', params:params})
}
// Delete Documents
ClaimsProcessingNotesDeleteDocument(refId:any,sn:any) {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  return this.http.post(`${this.dashboardUrl}claims_processing/delete_claims_processing_documents?refId=${refId}&sn=${sn}`,options)
}
getClaimsSettlementWithAllBankAndRegion(fyStart:any,fyEnd:any) {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  const params =new HttpParams()
  .set('fyStart',fyStart)
  .set('fyEnd',fyEnd)
  return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_settlement`,{...options, params:params})
}
getClaimsSettlementWithAllegion(bankCode:any,fyStart:any,fyEnd:any) {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  const params =new HttpParams()
  .set('bankCode',bankCode)
  .set('fyStart',fyStart)
  .set('fyEnd',fyEnd)
  return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_settlement`,{...options, params:params})
}
getClaimsSettlementWithAllBanks(fyStart:any,fyEnd:any,parentUnitCode:any) {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  const params =new HttpParams()
  .set('fyStart',fyStart)
  .set('fyEnd',fyEnd)
  .set('parentUnitCode',parentUnitCode)
  return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_settlement`,{...options, params:params})
}
getClaimsSettlementWithSelectedBankAndRegion(bankCode:any,fyStart:any,fyEnd:any,parentUnitCode:any) {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  const params =new HttpParams()
  .set('bankCode',bankCode)
  .set('fyStart',fyStart)
  .set('fyEnd',fyEnd)
  .set('parentUnitCode',parentUnitCode)
  return this.http.get(`${this.dashboardUrl}claims_processing/get_claims_settlement`,{...options, params:params})
}
saveApprovalSettlementForAuthRej(refId:any,approvalAction:any,appRefNo:any,aDate:any,aAmnt:any,pDate:any,remarks:any) {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  return this.http.post(`${this.dashboardUrl}claims_processing/save_approve_settlement?refId=${refId}&approvalAction=${approvalAction}&appRefNo=${appRefNo}&aDate=${aDate}&aAmnt=${aAmnt}&pDate=${pDate}&remarks=${remarks}`,options)
}
saveApprovalSettlementForSaveSubmitDel(refId:any,approvalAction:any,appRefNo:any,aDate:any,aAmnt:any,pDate:any) {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  return this.http.post(`${this.dashboardUrl}claims_processing/save_approve_settlement?refId=${refId}&approvalAction=${approvalAction}&appRefNo=${appRefNo}&aDate=${aDate}&aAmnt=${aAmnt}&pDate=${pDate}`,options)
}
getUtilsLastUpdatedQtr(effectiveDate:any,bankCode:any) {
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  return this.http.get(`${this.dashboardUrl}common_utils/check_last_updated_qtr?qtr=${effectiveDate}&bankCode=${bankCode}`,options)
}

getuploadpermissionstatus(operation:any,unitCode:any,qtrEnding:any){
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  return this.http.get(`${this.dashboardUrl}common_utils/getuploadpermissionstatus?operation=${operation}&unitCode=${unitCode}&qtrEnding=${qtrEnding}`,options)
}

getSlab1CertifiedData(qtrDate:any,unitCode:any,refId:any){
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  return this.http.post(`${this.dashboardUrl}claims_processing/gets1certifieddata?qtrDate=${qtrDate}&unitCode=${unitCode}&refId=${refId}`,options)

}
getSlab2CertifiedData(qtrDate:any,unitCode:any,refId:any){
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };
  return this.http.post(`${this.dashboardUrl}claims_processing/gets2certifieddata?qtrDate=${qtrDate}&unitCode=${unitCode}&refId=${refId}`,options)

}

getDashboardData(unitCode:any,inDate?: any,unitType?: any){
  this.rolesToken=sessionStorage.getItem('UserToken');
  let options = {
    headers: new HttpHeaders({ Authorization: 'Bearer ' + this.rolesToken })
  };

   let url = `${this.dashboardUrl}common_utils/get_dashboard_data?unitCode=${unitCode}`;
   if (unitType !== undefined && unitType !== null) {
     url += `&unitType=${unitType}`;
   }
   if (inDate !== undefined && inDate !== null) {
     url += `&inDate=${inDate}`;
   }
   return this.http.get(url, options);
}

}
