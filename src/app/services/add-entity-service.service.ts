import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, tap, zip } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AddEntityServiceService {
  dashboardUrl = environment.url;
  constructor(private http: HttpClient, private router: Router,) { }
  rolesToken:any;
  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = sessionStorage.getItem("UserToken");
    if (idToken) {
        const cloned = req.clone({
            headers: req.headers.set("Authorization",
                "Bearer " + idToken)
        });

        return next.handle(cloned).pipe( tap(() => {},
        (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401) {
           return;
          }
          this.router.navigate(['home']);
        }
      }))
    }
    else {
        return next.handle(req);
    }
}
  getLevels(currentLevel:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
  
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `users/get_levels/${currentLevel}`, options)
  }
  getParentLevels(level:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
   
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `entity/get_parent_units_by_level/${level}`, options)
  }
  getViewDataFromUnitCode(unitCode:any,status:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
   
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `entity/get_entity_by_unitcode/${unitCode}/${status}`, options)
  }



  getViewDataFromUnitCodeRate(unitCode:any,status:any,rateTypeRate:any,rateEffectiveFromDate:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
   
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `rates/get_rate/${unitCode}/${status}/${rateTypeRate}/${rateEffectiveFromDate}`, options)
  }

  getViewDataFromRate(unitCode:any,status:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
  
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `entity/get_entity_by_unitcode/${unitCode}/${status}`, options)
  }


  getUserDetails(unitCode:any,status:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
   
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `users/get_user/${unitCode}/${status}`, options)
  }

  SaveEditDataFromUnitCode(unitCode:any,status:any,data:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
   
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.post(this.dashboardUrl + `entity/edit_entity/${unitCode}/${status}`,data, options)
  }
  deleteEntityDataByUnitCode(unitCode:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
   
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.post(this.dashboardUrl + `entity/delete_entity/${unitCode}`,options)
  }
  deleteUserData(userId:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
    console.log("This.rolesToken",this.rolesToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.post(this.dashboardUrl + `users/delete_user/${userId}`, options)
  }
  getStates() {
    this.rolesToken = sessionStorage.getItem("UserToken");
    
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `entity/get_states`, options)
  }
  getDistricts(selectedState:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
    
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `entity/get_districts/${selectedState}`, options)
  }
  // http://162.222.206.90:8081/api/entity/get_states
  // entity/get_entity_status
  getEntityStatus(isAdd:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
    
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `entity/get_entity_status/${isAdd}`, options)
  }
  addEntity(data:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
 
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.post(this.dashboardUrl + `entity/add_entity`,data,options)
  }
  authorizeNdRejectEntity(data:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
   
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.post(this.dashboardUrl + `entity/update_status`,data,options)
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
}



