import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, tap, zip } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
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
    console.log("This.rolesToken",this.rolesToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `users/get_levels/${currentLevel}`, options)
  }
  getParentLevels(level:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
    console.log("This.rolesToken",this.rolesToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `entity/get_parent_units_by_level/${level}`, options)
  }
  getUnitCode(unitCode:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
    console.log("This.rolesToken",this.rolesToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `entity/get_child_entities_for_unitcode/${unitCode}`, options)
  }
  getUnitCodeByLevel(level:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
    console.log("This.rolesToken",this.rolesToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `entity/get_authorized_visible_entities/${level}`, options)
  }
  getEntityStatus(isAdd:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
    console.log("This.rolesToken",this.rolesToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `entity/get_entity_status/${isAdd}`, options)
  }
  addUserData(data:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
    console.log("This.rolesToken",this.rolesToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.post(this.dashboardUrl + `users/create_user`,data,options)
  }
  editUserData(userId:any,Status:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
    console.log("This.rolesToken",this.rolesToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `users/get_user/${userId}/${Status}`,options)
  }
  saveEditUserData(userId:any,Status:any,data:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
    console.log("This.rolesToken",this.rolesToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.post(this.dashboardUrl + `users/edit_user/${userId}/${Status}`,data,options)
  }
  getRolesData() {
    this.rolesToken = sessionStorage.getItem("UserToken");
    console.log("This.rolesToken",this.rolesToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.get(this.dashboardUrl + `roles`, options)
  }
  authorizeNdRejectUser(data:any) {
    this.rolesToken = sessionStorage.getItem("UserToken");
    console.log("This.rolesToken",this.rolesToken)
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.post(this.dashboardUrl + `users/update_status`,data,options)
  }
}




