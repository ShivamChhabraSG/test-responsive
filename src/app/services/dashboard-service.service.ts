import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, tap, zip } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService {
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
  getLabelsAndEntitlements() {
    this.rolesToken = sessionStorage.getItem("UserToken");
 
   let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.post(this.dashboardUrl + `users/get_label_and_entitlements`, options)
  }


  getLabelsAndEntitlementsNewone() {
    this.rolesToken = sessionStorage.getItem("UserToken");
      let options = {
     headers: new HttpHeaders({'Authorization': 'Bearer ' +this.rolesToken })
   };
   return this.http.post(this.dashboardUrl + `users/v1/get_label_and_entitlements`, options)
  }
}

